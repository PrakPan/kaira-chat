// components/theme/cinematic/useSeedChat.ts
//
// Hands a prompt off to a fresh /chat session. Mirrors the homepage hero and
// GetInspiredSection handoff: the prompt is stashed via setPendingSeed (module
// memory + sessionStorage, survives the route change and a hard reload of
// /chat) and also passed as `?seed=` so a cold /chat load can still pick it up.
//
// A theme page may also pass structured context — the items the reader saved on
// the page and a `slug` naming the theme. That rides along via setPendingSeedMeta
// and is forwarded verbatim in the first /chatkit request body (see useChat.ts).
//
// The seed also carries an `intake` object built from the same keys the themed
// mini-form submits (see themeIntake.ts), so a hero send, an ask-bar send and a
// card CTA all hit /chatkit in the mini-form's request shape rather than as
// bare free text. `intent` is what the landing surface reports about the click.

import { useCallback } from "react";
import { useRouter } from "next/router";
import {
  setPendingSeed,
  setPendingSeedMeta,
} from "../../../services/heroChatHandoff";
import type {
  CinematicPromptIntake,
  CinematicSelectableItem,
} from "./types";
import { buildSeedIntake, type ThemePromptIntent } from "./themeIntake";

export interface SeedChatMeta {
  items?: CinematicSelectableItem[];
  slug?: string;
  /** What fired the prompt — the hero composer, the ask bar, a card, a CTA.
   *  Shapes the `intake` object sent with the first /chatkit request. */
  intent?: ThemePromptIntent;
  /** What the fired prompt states about the trip (month / nights / who), from
   *  the page's PROMPT_FACTS map. Absent for free text the reader typed. */
  facts?: CinematicPromptIntake;
}

export function useSeedChat() {
  const router = useRouter();

  return useCallback(
    (prompt: string, meta?: SeedChatMeta) => {
      const seed = (prompt || "").trim();
      if (seed) setPendingSeed(seed);
      // Always write (setPendingSeedMeta clears itself when empty) so a plain
      // seed after a themed one never inherits a stale selection.
      setPendingSeedMeta({
        items: meta?.items ?? [],
        slug: meta?.slug ?? "",
        intake: buildSeedIntake(seed, {
          slug: meta?.slug,
          items: meta?.items,
          intent: meta?.intent,
          facts: meta?.facts,
        }),
      });
      router.push(seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat");
    },
    [router],
  );
}

// "Build this itinerary" — opens the themed mini-form on /chat rather than
// seeding an auto-sent prompt. The saved items + slug ride along via
// setPendingSeedMeta; /chat resolves the form by slug (?themeForm=) and injects
// it. Nothing fires to /chatkit until the reader submits the form.
//
// `note` is free text the reader typed into the docked ask-bar before hitting
// build. It travels with the handoff and is folded into the form's submission
// so the request carries it rather than dropping it at the route change.
export function useOpenThemeForm() {
  const router = useRouter();

  return useCallback(
    (slug: string, items?: CinematicSelectableItem[], note?: string) => {
      setPendingSeedMeta({
        items: items ?? [],
        slug: slug || "",
        note: note ?? "",
      });
      router.push(`/chat?themeForm=${encodeURIComponent(slug)}`);
    },
    [router],
  );
}
