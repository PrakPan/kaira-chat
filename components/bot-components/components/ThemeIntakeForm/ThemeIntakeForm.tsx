// components/bot-components/components/ThemeIntakeForm/ThemeIntakeForm.tsx
//
// The themed theme-page mini-form, rendered inside the chat stream on /chat.
// Two steps — Step 1 = when (month → the routes that run in it), Step 2 = who's
// coming — then one button. Pure render of a ThemeForm config (see
// components/theme/cinematic/themeForms). On submit it emits the structured
// payload { slug, window, skeleton, month, dates:[start,end], pax, items } plus
// a readable message; the host sends both to /chatkit. Matches the theme
// mockup: paper card, themed CTA, mono badges.
//
// Two things shape the layout:
//
//  • Months, not stored dates. The config carries bare month numbers and the
//    form resolves each forward to its next occurrence (see season.ts), so the
//    options can never point at a window that has already passed. Pick a month
//    and you get the routes that run in it; a fixed-date event like the Sapporo
//    Snow Festival is a route anchored to its own month, so it shows up only
//    then and lands on the real dates.
//  • One step on screen at a time. Everything used to stack into a single tall
//    card, which on a small phone meant scrolling past the routes to find the
//    button. The two sections now slide, and the card is only ever as tall as
//    the step you're looking at.

import React from "react";
import type {
  ThemeForm,
  ThemeFormSubmission,
  ThemeRoute,
} from "../../../theme/cinematic/themeForms/types";
import {
  resolveSeason,
  routeDates,
  toIso,
  type ResolvedMonth,
} from "../../../theme/cinematic/themeForms/season";
import { getThemePalette } from "../../../theme/cinematic/palettes";
import { composeSelectionText } from "../../../theme/cinematic/selectionText";
// The same range picker the main intake form uses, so "pick exact dates" here
// looks and behaves exactly like the calendar readers already know.
import Calendar from "../IntakeForm/ui/Calendar";
import {
  formatShort,
  formatLong,
  nightsBetween,
  travellersLabel,
} from "../IntakeForm/intakePrompt";
// The who/pax step is the main intake form's, not a themed lookalike — same
// options, same counters, same copy, so a reader who has seen one recognises
// the other.
import { WHO_OPTIONS, WHO_WITH_PAX } from "../IntakeForm/constants";
import Chip from "../IntakeForm/ui/Chip";
import Stepper from "../IntakeForm/ui/Stepper";

const INK = "#0b1220";
const MUTED = "#445069";
const FAINT = "#8a93a6";
const BORDER = "#ececec";
const SAND = "#f4f3ec";
// Neutral fallback for a theme with no palette registered — the old ink/yellow
// treatment, so an unthemed form still renders sensibly.
const NEUTRAL = { accent: INK, accentSoft: SAND, accentOn: "#ffffff" };

const TOTAL_STEPS = 2;

/** rgba() form of a #rrggbb accent, for the CTA's coloured drop shadow. */
const rgba = (hex: string, alpha: number): string => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(11,18,32,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

// Saved items that name a place rather than a thing to do. Only these are
// checked against the chosen route — an activity or a café can't collide with
// a route stop, and matching them would risk false positives against skeletons
// that aren't city lists at all ("classic_7").
const PLACE_KINDS = new Set(["city", "base", "stop", "destination"]);

/** `"Café Central"` → `"cafe_central"`. Matches the shape of a route's
 *  `skeleton` ("sapporo_niseko") so the two can be compared. */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/** Drops the night count from a route label, wherever it sits between the
 *  "·" separators — the count is only true of the option's own range, so once
 *  the reader picks exact dates it would contradict them:
 *    "The Last Hurrah · 6N"            → "The Last Hurrah"
 *    "Central Loop · 10N · incl. NYE"  → "Central Loop · incl. NYE"
 *  A label with no count comes back untouched, and a label that is *only* a
 *  count falls back to the original rather than empty. (Only the legacy
 *  dateWindows configs put counts in labels; season routes carry `nights`.) */
const routeTitle = (label: string): string =>
  label
    .split("·")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d+\s*(N|nights?)$/i.test(part))
    .join(" · ") || label;

/** True when the chosen route already covers this city. Compared on token
 *  boundaries so "vienna" hits "prague_vienna_budapest" but "wien" does not hit
 *  "wienerwald", and multi-word cities ("st_moritz") still match. */
const routeCovers = (skeleton: string, label: string): boolean => {
  const route = slugify(skeleton);
  const city = slugify(label);
  if (!route || !city) return false;
  return (
    route === city ||
    route.startsWith(`${city}_`) ||
    route.endsWith(`_${city}`) ||
    route.includes(`_${city}_`)
  );
};

export interface ThemeSelectedItemLike {
  kind?: string;
  label?: string;
  short?: string;
  id?: string;
}

export interface ThemeIntakeFormProps {
  form: ThemeForm;
  items?: ThemeSelectedItemLike[];
  // Free text the reader typed into the theme page's docked ask-bar before
  // hitting "Build trip". Shown back to them and sent with the submission.
  note?: string;
  onSubmit: (submission: ThemeFormSubmission, composedText: string) => void;
}

const mono: React.CSSProperties = {
  fontFamily:
    "ui-monospace, 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const ThemeIntakeForm: React.FC<ThemeIntakeFormProps> = ({
  form,
  items = [],
  note,
  onSubmit,
}) => {
  // The season resolved against today. Empty for a config still on the legacy
  // `dateWindows` model, which then renders its stored windows instead — both
  // paths produce the same chosen-plan shape below.
  const months = React.useMemo<ResolvedMonth[]>(
    () => resolveSeason(form),
    [form],
  );
  const windows = form.dateWindows ?? [];
  const legacy = months.length === 0;

  const [step, setStep] = React.useState(0);
  // First month + first route are pre-selected so the reader can submit in one
  // tap (per _STRUCTURE.md behaviour).
  const [monthKey, setMonthKey] = React.useState(months[0]?.key ?? "");
  const [routeKey, setRouteKey] = React.useState(
    months[0]?.routes[0]?.key ?? "",
  );
  const [winIdx, setWinIdx] = React.useState(0);
  const [exactOpen, setExactOpen] = React.useState(false);
  // ISO date-only strings ("YYYY-MM-DD"), or null — the shape Calendar emits.
  const [fromDate, setFromDate] = React.useState<string | null>(null);
  const [toDate, setToDate] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  // Who's coming — same fields and defaults as the main intake form's slice.
  const [who, setWho] = React.useState("");
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [infants, setInfants] = React.useState(0);
  // Selected quick-reply chips — toggled on/off and sent with the submission in
  // one go when the reader hits the CTA (not sent immediately on tap).
  const [selectedPrompts, setSelectedPrompts] = React.useState<string[]>([]);
  const togglePrompt = (p: string) =>
    setSelectedPrompts((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  // The theme's colour, resolved from the same slug the page handed over. Every
  // "chosen" state in the card — the month chips, the route card and its tick,
  // the saved-item tags and the CTA — reads from here, so the form looks like
  // the page it came from.
  const pagePalette = getThemePalette(form.slug);
  const accent = pagePalette?.accent ?? NEUTRAL.accent;
  const accentSoft = pagePalette?.accentSoft ?? NEUTRAL.accentSoft;
  const accentOn = pagePalette?.accentOn ?? NEUTRAL.accentOn;

  // ── The chosen plan, from whichever model this theme uses ──────────────────
  const month = months.find((m) => m.key === monthKey) ?? months[0] ?? null;
  // Derived rather than reset in an effect: when the reader switches to a month
  // that doesn't run their route, the first route of the new month simply takes
  // over on the same render, and switching back restores their pick.
  const route: ThemeRoute | null = month
    ? (month.routes.find((r) => r.key === routeKey) ?? month.routes[0] ?? null)
    : null;
  const win = legacy ? (windows[winIdx] ?? windows[0]) : undefined;

  const planKey = legacy ? (win?.key ?? "") : (route?.key ?? "");
  const planLabel = legacy ? (win?.label ?? "") : (route?.label ?? "");
  const planBlurb = legacy ? win?.blurb : route?.blurb;
  const skeleton = legacy ? (win?.skeleton ?? "") : (route?.skeleton ?? "");

  // Dates the plan would run on. On the season path they're computed from the
  // chosen month (a festival route lands on its anchor); on the legacy path
  // they're the window's stored range.
  const planDates = React.useMemo<[string, string]>(() => {
    if (legacy) return [win?.range[0] ?? "", win?.range[1] ?? ""];
    if (!route || !month) return ["", ""];
    return routeDates(route, month);
    // `month.key` and `route.key` identify the pair; the objects are rebuilt on
    // every resolveSeason() call, so keying on them directly would thrash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacy, win?.key, route?.key, month?.key]);

  // The reader's own dates win over the plan's default range once BOTH ends
  // are picked. The route is unaffected — they've changed the length of the
  // trip, not which trip it is.
  const useExact = exactOpen && !!fromDate && !!toDate;
  const dates: [string, string] = useExact
    ? [fromDate as string, toDate as string]
    : planDates;
  // Always derived from `dates`, so an exact-date pick can never be sent
  // alongside the plan's stored `nights` (e.g. 9 picked nights on an 8-night
  // route). The plan's own value is only a fallback for a malformed range.
  const planNights = legacy ? (win?.nights ?? 0) : (route?.nights ?? 0);
  const nights = useExact
    ? nightsBetween(dates[0], dates[1])
    : nightsBetween(dates[0], dates[1]) || planNights;

  // Where the exact-date picker opens. Never the current month: by the time
  // someone reaches this form most of it is already behind them (open it in
  // mid-August and half the grid is struck through), so the floor is the 1st of
  // next month. Above that floor it opens on the month the suggested departure
  // actually falls in — a reader who picked "Dec '26" lands on December rather
  // than paging forward from September to find their own trip.
  const calendarInitialMonth = React.useMemo(() => {
    const now = new Date();
    // Day 1 of next month; the month index rolls the year over on its own.
    const nextMonth = toIso(new Date(now.getFullYear(), now.getMonth() + 1, 1));
    // Date-only ISO sorts chronologically as a plain string.
    return planDates[0] && planDates[0] > nextMonth ? planDates[0] : nextMonth;
  }, [planDates]);

  const trimmedNote = (note ?? "").trim();

  // ── Step gating ───────────────────────────────────────────────────────────
  const isLast = step === TOTAL_STEPS - 1;
  const canAdvance = step === 0 ? !!skeleton : !!who;

  // The horizontal track holds both steps side-by-side and slides between them;
  // the viewport height follows the active step so the card grows and shrinks
  // instead of swapping content. Same treatment as the main intake card, and
  // the reason this form no longer needs scrolling on a phone.
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const stepRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const prevStepRef = React.useRef(step);

  // ONLY a step change animates the height. Content growth inside a step — the
  // pax counters appearing, the calendar opening — is applied instantly.
  // Animating those too looked fine until a transition was interrupted
  // mid-flight: the box stayed at the interpolated height while the content had
  // already grown past it, and `overflow: hidden` silently ate the bottom of
  // the step (the seed-prompt chips, and on a short step the CTA itself). An
  // instant resize cannot strand content that way.
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const active = stepRefs.current[step];
    if (!viewport || !active) return;

    const stepChanged = prevStepRef.current !== step;
    prevStepRef.current = step;
    viewport.style.transition = stepChanged
      ? "height .42s cubic-bezier(.2,.7,.3,1)"
      : "none";

    const apply = () => {
      const h = active.scrollHeight;
      if (h > 0 && viewport.style.height !== `${h}px`) {
        viewport.style.height = `${h}px`;
      }
    };
    apply();
    const ro = new ResizeObserver(() => {
      // Anything the observer reports is in-step growth, never a step change.
      viewport.style.transition = "none";
      apply();
    });
    ro.observe(active);
    return () => ro.disconnect();
    // Re-measured on every input that changes a step's height, so the box is
    // correct even if the observer is coalesced or misses a frame.
  }, [step, who, adults, children, infants, exactOpen, monthKey, routeKey, winIdx, selectedPrompts.length]);

  // De-dupe saved items (a place can be reachable from more than one section).
  const uniqueItems: ThemeSelectedItemLike[] = React.useMemo(() => {
    const out: ThemeSelectedItemLike[] = [];
    const seen = new Set<string>();
    for (const it of items) {
      const key = it.id
        ? `id:${it.id}`
        : `${(it.kind || "").toLowerCase()}:${(it.label || it.short || "")
            .trim()
            .toLowerCase()}`;
      if (!key.trim() || key === ":" || seen.has(key)) continue;
      seen.add(key);
      out.push(it);
    }
    return out;
  }, [items]);

  // Second pass, against the route the reader just chose. Some theme pages let
  // you save the same cities the route is built from (Christmas markets' "Which
  // square is worth the stop"), so picking "Prague → Vienna → Budapest" after
  // saving Prague would otherwise send Prague twice — once as the skeleton and
  // once as an add-on. Drop those; what's left are genuine extras (activities,
  // cafés, and cities the route doesn't already visit). Recomputed as the
  // selection changes, so the tags below show exactly what will be sent.
  const dedupedItems: ThemeSelectedItemLike[] = React.useMemo(() => {
    if (!skeleton) return uniqueItems;
    return uniqueItems.filter((it) => {
      if (!PLACE_KINDS.has((it.kind || "").toLowerCase())) return true;
      const label = it.short || it.label || "";
      return !routeCovers(skeleton, label);
    });
  }, [uniqueItems, skeleton]);

  const pickWho = (next: string) => {
    if (next === "Just me") {
      setWho(next);
      setAdults(1);
      setChildren(0);
      setInfants(0);
    } else if (next === "Couple") {
      setWho(next);
      setAdults(2);
      setChildren(0);
      setInfants(0);
    } else {
      setWho(next);
      setAdults((a) => Math.max(2, a));
    }
  };

  const goNext = () => {
    if (!canAdvance) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    submit();
  };

  const submit = () => {
    if (submitted || !skeleton) return;

    const pax = travellersLabel({ who, adults, children, infants });

    const submission: ThemeFormSubmission = {
      slug: form.slug,
      window: planKey,
      skeleton,
      month: legacy ? undefined : month?.key,
      monthLabel: legacy ? undefined : month?.long,
      dates,
      nights,
      exactDates: useExact || undefined,
      pax,
      who: who || undefined,
      adults,
      children,
      infants,
      items: dedupedItems.length ? dedupedItems : undefined,
      prompts: selectedPrompts.length ? selectedPrompts : undefined,
      note: trimmedNote || undefined,
    };

    // Include the plan's blurb so the message reads with the chosen route
    // (e.g. "Powder and the city — Sapporo + Niseko — ski days, city nights").
    const routeLine = planBlurb ? ` — ${planBlurb}` : "";
    // With exact dates the length comes from the calendar, so the route is
    // named WITHOUT any stored night count and the dates get their own line —
    // otherwise the message would read "The Last Hurrah · 6N" over a 9-night
    // range and the two would contradict each other.
    const nightsWord = nights === 1 ? "night" : "nights";
    const whenLines = useExact
      ? `• When: ${formatLong(dates[0])} to ${formatLong(dates[1])} · ${nights} ${nightsWord} ` +
        `(my exact dates — use these, not the route's usual length)\n` +
        `• Plan: ${routeTitle(planLabel)}${routeLine}\n`
      : `• When: ${formatLong(dates[0])} to ${formatLong(dates[1])} · ${nights} ${nightsWord}` +
        (legacy ? "" : ` (I'm going in ${month?.long ?? ""} — shift the dates within that month if it prices better)`) +
        `\n• Plan: ${routeTitle(planLabel)}${routeLine}\n`;
    // The picks also ride the request body structurally (as `intake.items` —
    // see handleThemedFormSubmit), but they're named here too so the message
    // reads complete on its own. Each pick keeps its kind so "Phi Phi Islands
    // (activity)" can't be read as a city stop.
    const savedText = composeSelectionText(
      dedupedItems,
      `Build it around the ${dedupedItems.length} ${
        dedupedItems.length === 1 ? "pick" : "picks"
      } I saved on the page:`,
    );
    const savedLine = savedText ? `\n• ${savedText}` : "";
    const promptLine = selectedPrompts.length
      ? `\n• Also: ${selectedPrompts.join("; ")}`
      : "";
    // The reader's own words go on their own line, ahead of the canned chips,
    // so they read as the brief rather than one more toggle.
    const noteLine = trimmedNote ? `\n• In my words: ${trimmedNote}` : "";
    const composed =
      `Here are my ${form.display} trip details:\n` +
      whenLines +
      `• Travellers: ${pax}` +
      noteLine +
      promptLine +
      savedLine;

    setSubmitted(true);
    onSubmit(submission, composed);
  };

  const showCounters = WHO_WITH_PAX.includes(who);

  // ── Step 1 — when ─────────────────────────────────────────────────────────
  const whenStep = (
    <div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: INK,
          letterSpacing: "-0.01em",
        }}
      >
        {form.copy.datesTitle}
      </div>
      <div style={{ fontSize: 12, color: FAINT, margin: "3px 0 11px" }}>
        {form.copy.datesSub}
      </div>

      {/* Month strip — resolved forward from today, so it can never offer a
          month that has already gone. */}
      {!legacy && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {months.map((m) => {
              const on = m.key === month?.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    setMonthKey(m.key);
                    setExactOpen(false);
                  }}
                  style={{
                    background: on ? accent : "#ffffff",
                    color: on ? accentOn : INK,
                    border: `1.5px solid ${on ? accent : BORDER}`,
                    borderRadius: 999,
                    padding: "7px 13px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {on ? "✓ " : ""}
                  {m.short}
                </button>
              );
            })}
          </div>
          {/* What that month is actually like — the line the old fixed windows
              buried in their subtitle. */}
          {month?.line && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 7,
                marginTop: 9,
                fontSize: 11.5,
                lineHeight: 1.45,
                color: MUTED,
              }}
            >
              {month.tag && (
                <span
                  style={{
                    ...mono,
                    background: accentSoft,
                    color: accent,
                    padding: "3px 6px",
                    borderRadius: 5,
                    fontSize: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {month.tag}
                </span>
              )}
              <span>{month.line}</span>
            </div>
          )}
        </>
      )}

      {/* The routes that run in the chosen month (or, on a legacy config, the
          stored windows). */}
      <div
        style={{
          ...mono,
          color: FAINT,
          fontSize: 8.5,
          margin: legacy ? "0 0 7px" : "13px 0 7px",
        }}
      >
        {legacy ? "Pick a route" : `Routes that run in ${month?.long ?? ""}`}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {legacy
          ? windows.map((w, i) => (
              <RouteRow
                key={w.key}
                on={i === winIdx}
                label={w.label}
                blurb={w.blurb}
                tag={w.tag}
                nights={w.nights}
                accent={accent}
                accentSoft={accentSoft}
                onClick={() => {
                  setWinIdx(i);
                  setExactOpen(false);
                }}
              />
            ))
          : (month?.routes ?? []).map((r) => (
              <RouteRow
                key={r.key}
                on={r.key === route?.key}
                label={r.label}
                blurb={r.blurb}
                tag={r.tag}
                nights={r.nights}
                accent={accent}
                accentSoft={accentSoft}
                onClick={() => {
                  setRouteKey(r.key);
                  setExactOpen(false);
                }}
              />
            ))}
      </div>

      {/* One line for the dates that will actually be sent, with the exact-date
          escape hatch beside it. Keeps the calendar out of the way for the
          reader who is happy with the suggested departure. */}
      {!exactOpen && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 9,
            flexWrap: "wrap",
          }}
        >
          {dates[0] && dates[1] && (
            <span style={{ fontSize: 11.5, color: MUTED }}>
              {formatShort(dates[0])} – {formatLong(dates[1])}
            </span>
          )}
          {form.allowExactDates && (
            <button
              type="button"
              onClick={() => setExactOpen(true)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: MUTED,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Or pick exact dates
            </button>
          )}
        </div>
      )}

      {exactOpen && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 7,
            }}
          >
            <span style={{ ...mono, color: FAINT, fontSize: 8.5 }}>
              Exact dates
            </span>
            <button
              type="button"
              onClick={() => {
                setExactOpen(false);
                setFromDate(null);
                setToDate(null);
              }}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: MUTED,
                fontSize: 10.5,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Use the suggested dates
            </button>
          </div>
          <Calendar
            startDate={fromDate}
            endDate={toDate}
            initialMonth={calendarInitialMonth}
            onChange={(start, end) => {
              setFromDate(start);
              setToDate(end);
            }}
          />
          {/* Exactly what will be sent. The route is still the one ticked
              above; only the length is now the reader's. Until both ends are
              picked the suggested range still applies, and this says so. */}
          <div
            style={{
              marginTop: 8,
              background: useExact ? accentSoft : SAND,
              border: `1px solid ${useExact ? accent : BORDER}`,
              borderRadius: 12,
              padding: "8px 10px",
              fontSize: 11.5,
              lineHeight: 1.45,
              color: INK,
            }}
          >
            {useExact ? (
              <>
                <strong>
                  {nights} {nights === 1 ? "night" : "nights"}
                </strong>{" "}
                · {formatShort(dates[0])} to {formatLong(dates[1])} ·{" "}
                {routeTitle(planLabel)}
              </>
            ) : (
              <>
                Until then I&apos;ll use {formatShort(planDates[0])} –{" "}
                {formatLong(planDates[1])}.
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ── Step 2 — who's coming ─────────────────────────────────────────────────
  // Deliberately identical to the main intake form's WhoStep: same title, same
  // sub, same WHO_OPTIONS chips, same adult/child/infant counters.
  const whoStep = (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        Who&apos;s coming?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        So I can pace the trip and size the stays.
      </div>

      <div className="flex flex-wrap gap-[6px]">
        {WHO_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            label={o.label}
            active={who === o.value}
            onClick={() => pickWho(o.value)}
          />
        ))}
      </div>

      {showCounters && (
        <div
          className="mt-3 rounded-[13px] px-[14px]"
          style={{ background: "#fafaf5", border: "1px solid #ececec" }}
        >
          {[
            { key: "adults" as const, label: "Adults", sub: "12+ years", min: 1, value: adults, set: setAdults },
            { key: "children" as const, label: "Children", sub: "2 to 11 years", min: 0, value: children, set: setChildren },
            { key: "infants" as const, label: "Infants", sub: "under 2 years", min: 0, value: infants, set: setInfants },
          ].map((row, idx) => (
            <div
              key={row.key}
              className="py-[10px]"
              style={{ borderBottom: idx < 2 ? "1px solid #ececec" : "none" }}
            >
              <Stepper
                label={row.label}
                sub={row.sub}
                value={row.value}
                min={row.min}
                max={20}
                onChange={row.set}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick-reply chips — toggle-selectable, sent with the submission when
          the CTA is hit (not fired one at a time). They live on this step so
          they don't add height to the one the reader starts on. */}
      {form.seedPrompts?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ ...mono, color: FAINT, fontSize: 8.5, marginBottom: 7 }}>
            Add any of these
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {form.seedPrompts.map((s) => {
              const on = selectedPrompts.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => togglePrompt(s)}
                  aria-pressed={on}
                  style={{
                    background: on ? INK : "#ffffff",
                    border: `1px solid ${on ? INK : BORDER}`,
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontSize: 11.5,
                    fontWeight: on ? 700 : 500,
                    color: on ? "#fafaf5" : MUTED,
                    cursor: "pointer",
                  }}
                >
                  {on ? `✓ ${s}` : s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      {/* What they typed into the theme page's ask-bar, echoed so it's clear it
          survived the jump and will be sent with the form. */}
      {trimmedNote && (
        <div
          style={{
            marginBottom: 10,
            marginLeft: 10,
            background: accentSoft,
            borderLeft: `2px solid ${accent}`,
            borderRadius: "4px 12px 12px 4px",
            padding: "9px 12px",
          }}
        >
          <div style={{ ...mono, color: accent, fontSize: 8.5, marginBottom: 3 }}>
            You asked
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.45, color: INK }}>
            {trimmedNote}
          </div>
        </div>
      )}

      {/* What the reader saved on the theme page, shown back as accent tags so
          the handoff is visible rather than implied. Same treatment as the
          page's own saved-list chips. */}
      {dedupedItems.length > 0 && (
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <div style={{ ...mono, color: FAINT, fontSize: 9, marginBottom: 6 }}>
            Building around your {dedupedItems.length}{" "}
            {dedupedItems.length === 1 ? "pick" : "picks"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {dedupedItems.map((it, i) => (
              <span
                key={it.id ?? `${it.kind}:${it.label}:${i}`}
                style={{
                  ...mono,
                  background: accentSoft,
                  color: accent,
                  padding: "4px 9px",
                  borderRadius: 6,
                  fontSize: 8.5,
                }}
              >
                {it.short || it.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* The 2-step card (the tagline greeting is a separate message bubble
          above, with Kaira's avatar). */}
      <div
        style={{
          background: "#ffffff",
          border: `1px solid ${BORDER}`,
          borderRadius: 18,
          padding: 16,
          boxShadow: "0 8px 20px -10px rgba(11,18,32,0.15)",
          opacity: submitted ? 0.6 : 1,
          pointerEvents: submitted ? "none" : "auto",
        }}
      >
        {/* progress dots + step label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 13,
          }}
        >
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i <= step ? accent : "#dfe2ea",
                  transition: "background .25s",
                }}
              />
            ))}
          </div>
          <span style={{ ...mono, color: FAINT, fontSize: 9 }}>
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Sliding viewport — height animates to the active step, so the card is
            only ever as tall as what's on screen. */}
        <div
          ref={viewportRef}
          // `height` and `transition` are set imperatively by the effect above
          // — keeping them out of React's style prop means a re-render can
          // never reset the measured height mid-animation.
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              transform: `translateX(-${step * 100}%)`,
              transition: "transform .4s cubic-bezier(.2,.7,.3,1)",
            }}
          >
            {[whenStep, whoStep].map((node, i) => (
              <div
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                style={{ minWidth: "100%", alignSelf: "flex-start" }}
                aria-hidden={i !== step}
              >
                {node}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{
                background: "#ffffff",
                border: `1.5px solid ${BORDER}`,
                borderRadius: 999,
                padding: "12px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: MUTED,
                cursor: "pointer",
              }}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            style={{
              flex: 1,
              background: canAdvance ? accent : "#b8becc",
              color: canAdvance ? accentOn : "#ffffff",
              border: "none",
              borderRadius: 999,
              padding: 13,
              fontSize: 14,
              fontWeight: 700,
              cursor: canAdvance ? "pointer" : "not-allowed",
              boxShadow: canAdvance
                ? `0 8px 20px -10px ${rgba(accent, 0.5)}`
                : "none",
              transition: "background .2s",
            }}
          >
            {isLast ? form.copy.cta : "Continue →"}
          </button>
        </div>
        {isLast && !who && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#e0703f",
              marginTop: 7,
              textAlign: "center",
            }}
          >
            Pick who&apos;s coming to continue.
          </div>
        )}
      </div>
    </div>
  );
};

/** One selectable route/window row. Compact by design — the list has to fit
 *  alongside the month strip without the card growing a scrollbar. */
const RouteRow: React.FC<{
  on: boolean;
  label: string;
  blurb?: string;
  tag?: string;
  nights?: number;
  accent: string;
  accentSoft: string;
  onClick: () => void;
}> = ({ on, label, blurb, tag, nights, accent, accentSoft, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 9,
      textAlign: "left",
      width: "100%",
      background: on ? accentSoft : "#ffffff",
      border: `1px solid ${on ? accent : BORDER}`,
      borderRadius: 13,
      padding: "10px 12px",
      cursor: "pointer",
      transition: "all .15s",
    }}
  >
    <span
      style={{
        ...mono,
        color: on ? accent : "#b8becc",
        fontSize: 11,
        flex: "0 0 12px",
      }}
    >
      {on ? "✓" : "○"}
    </span>
    <span style={{ flex: 1, minWidth: 0 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: INK,
        }}
      >
        {label}
        {tag && (
          <span
            style={{
              ...mono,
              background: on ? "#ffffff" : SAND,
              color: on ? accent : MUTED,
              padding: "2px 5px",
              borderRadius: 4,
              fontSize: 7.5,
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </span>
        )}
      </span>
      {blurb && (
        <span
          style={{
            display: "block",
            fontSize: 11,
            color: FAINT,
            marginTop: 2,
          }}
        >
          {blurb}
        </span>
      )}
    </span>
    {!!nights && (
      <span
        style={{
          ...mono,
          color: on ? accent : MUTED,
          fontSize: 9.5,
          whiteSpace: "nowrap",
        }}
      >
        {nights}N
      </span>
    )}
  </button>
);

export default ThemeIntakeForm;
