// components/theme/cinematic/themeIntake.ts
//
// The `intake` payload a theme page sends when it fires a prompt at /chat.
//
// Two surfaces on a theme page reach the chat: the themed mini-form ("Build
// trip"), which submits a ThemeFormSubmission, and everything else — the hero
// composer, the docked ask-bar, and every card / CTA carrying a canned prompt.
// That second group used to arrive as plain free text with the slug and saved
// items hung off the request root. They now send the SAME request shape as the
// form: `form_submitted: true` at the root and the context under `intake` (see
// buildFirstMessageBody in bot-components/hooks/useChat.ts), so the backend
// reads one contract no matter which surface the reader started from.
//
// The values come from the prompt itself. A card whose copy says "10 nights in
// the Cyclades in May for a couple" declares those facts alongside its prompt
// (CinematicPromptIntake on the page's PROMPT_FACTS map), and they are sent as
// `nights` / `month` / `pax` rather than left for the backend to parse out of
// the sentence. Nothing is invented: a fact the prompt doesn't state is simply
// not sent, so the key is absent rather than blank.

import type {
  CinematicPromptIntake,
  CinematicSelectableItem,
} from "./types";
import {
  monthDates,
  resolveMonthForward,
} from "./themeForms/season";
// The mini-form's own traveller wording, so "Couple (2 adults)" reads
// identically whether it came from the form or from a card's prompt.
import { travellersLabel } from "../../bot-components/components/IntakeForm/intakePrompt";

/** Which surface on the theme page fired the prompt.
 *   • hero    — the hero composer or one of the chips under it
 *   • ask_bar — the docked bar at the bottom of the page
 *   • card    — a content card, tile or row in a section
 *   • cta     — a section CTA, footer button or feature call-to-action */
export type ThemePromptSource = "hero" | "ask_bar" | "card" | "cta";

/** Emitted by CinematicThemeLanding alongside every prompt it fires, so the
 *  page can describe WHAT the reader clicked rather than only what text went
 *  out. Optional everywhere — a caller that omits it still seeds, just with a
 *  less specific intake. */
export interface ThemePromptIntent {
  source: ThemePromptSource;
  /** True when the prompt is the reader's own typed words (hero composer, ask
   *  bar) rather than a canned prompt behind a card or CTA. Decides whether the
   *  text lands in `note` (their words) or `prompts` (ours). */
  typed?: boolean;
  /** Name of the card / CTA behind the prompt, when it has one. */
  label?: string;
}

/** The `intake` object sent on the first /chatkit request for a theme prompt.
 *  Key-for-key the mini-form's ThemeFormSubmission; every field beyond `slug`
 *  and `source` is present only when the prompt actually states it. */
export interface ThemeSeedIntake {
  slug: string;
  source: ThemePromptSource;
  window?: string;
  skeleton?: string;
  month?: string; // "2027-05"
  monthLabel?: string; // "May 2027"
  dates?: [string, string];
  nights?: number;
  pax?: string;
  who?: string;
  adults?: number;
  children?: number;
  infants?: number;
  items?: CinematicSelectableItem[];
  /** The reader's own words, when they typed them. */
  note?: string;
  /** The canned prompt behind the card / CTA they tapped. */
  prompts?: string[];
  /** Name of that card / CTA. */
  label?: string;
}

export interface BuildSeedIntakeOptions {
  slug?: string;
  items?: CinematicSelectableItem[];
  intent?: ThemePromptIntent;
  /** What the fired prompt states about the trip (see CinematicPromptIntake).
   *  Absent for free text — the hero composer and the ask bar, where the reader
   *  hasn't picked anything yet. */
  facts?: CinematicPromptIntake;
}

/** Adult count implied by a `who` that didn't declare one. Mirrors the intake
 *  form's own pickWho defaults, so a prompt saying "for a couple" carries the
 *  same counts the form would have submitted. */
const defaultAdults = (who: string): number => (who === "Just me" ? 1 : 2);

/**
 * Compose the `intake` payload for a prompt fired off a theme page.
 *
 * Returns `undefined` when there's no theme slug — a seed with no theme behind
 * it has nothing to route on, so it keeps the plain free-text request shape.
 */
export function buildSeedIntake(
  prompt: string,
  { slug, items, intent, facts }: BuildSeedIntakeOptions = {},
): ThemeSeedIntake | undefined {
  const themeSlug = (slug || "").trim();
  if (!themeSlug) return undefined;

  const text = (prompt || "").trim();
  const typed = !!intent?.typed;
  const saved = (items ?? []).filter(Boolean);

  const intake: ThemeSeedIntake = {
    slug: themeSlug,
    // A prompt that arrives without an intent came from a call site that hasn't
    // been taught to describe itself; "cta" is the least surprising reading.
    source: intent?.source ?? "cta",
  };

  // ── What the prompt says about the trip ─────────────────────────────────
  if (facts?.window) intake.window = facts.window;
  if (facts?.skeleton) intake.skeleton = facts.skeleton;

  // A bare month number resolves forward to its next bookable occurrence, the
  // same way the mini-form's season strip does, so a config written once never
  // starts offering a month that has already passed.
  const month =
    facts?.month != null ? resolveMonthForward(facts.month) : null;
  if (month) {
    intake.month = month.key;
    intake.monthLabel = month.long;
  }

  const nights = facts?.nights;
  if (typeof nights === "number" && nights > 0) intake.nights = nights;

  // Dates need both halves — a month to sit in and a length to run for. With
  // only one of them we send that one and leave `dates` out rather than
  // inventing the other.
  if (month && intake.nights) intake.dates = monthDates(month, intake.nights);

  // Travellers. `who` is the anchor: without it a prompt hasn't said who it's
  // for, and the whole pax group is omitted.
  if (facts?.who) {
    const adults = facts.adults ?? defaultAdults(facts.who);
    const children = facts.children ?? 0;
    const infants = facts.infants ?? 0;
    intake.who = facts.who;
    intake.adults = adults;
    if (children) intake.children = children;
    if (infants) intake.infants = infants;
    intake.pax = travellersLabel({ who: facts.who, adults, children, infants });
  }

  // ── What the reader brought ─────────────────────────────────────────────
  if (saved.length) intake.items = saved;
  if (text && typed) intake.note = text;
  if (text && !typed) intake.prompts = [text];
  if (intent?.label) intake.label = intent.label;

  return intake;
}

/**
 * Pair a page's `PROMPTS` map with the trip facts each prompt states, keyed by
 * the prompt TEXT so the page can look one up when a card fires it:
 *
 *   const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
 *     tenDay: { nights: 10, month: 5, who: "Couple" },
 *   });
 *   …
 *   seedChat(prompt, { …, facts: PROMPT_FACTS[prompt] });
 *
 * Keeping the facts in one block next to the prompts (rather than on every
 * card) means the sentence and the numbers it states are edited together and
 * can't drift apart.
 */
export function promptIntakeMap<K extends string>(
  prompts: Record<K, string>,
  facts: Partial<Record<K, CinematicPromptIntake>>,
): Record<string, CinematicPromptIntake> {
  const out: Record<string, CinematicPromptIntake> = {};
  (Object.keys(prompts) as K[]).forEach((key) => {
    const fact = facts[key];
    const text = prompts[key];
    if (fact && text) out[text] = fact;
  });
  return out;
}

export default buildSeedIntake;
