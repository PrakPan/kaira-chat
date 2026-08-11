// components/bot-components/components/ThemeIntakeForm/ThemeIntakeForm.tsx
//
// The themed theme-page mini-form, rendered inside the chat stream on /chat.
// Two sections — Section 1 = when/scope (date_windows radio cards), Section 2 =
// how many (pax presets) — then one button. Pure render of a ThemeForm config
// (see components/theme/cinematic/themeForms). On submit it emits the structured
// payload { slug, window, skeleton, dates:[start,end], pax, items } plus a
// readable message; the host sends both to /chatkit. Matches the theme mockup:
// paper card, yellow CTA, mono badges.

import React from "react";
import type {
  ThemeForm,
  ThemeFormSubmission,
} from "../../../theme/cinematic/themeForms/types";
import { getThemePalette } from "../../../theme/cinematic/palettes";

const INK = "#0b1220";
const MUTED = "#445069";
const FAINT = "#8a93a6";
const BORDER = "#ececec";
const SAND = "#f4f3ec";
// Neutral fallback for a theme with no palette registered — the old ink/yellow
// treatment, so an unthemed form still renders sensibly.
const NEUTRAL = { accent: INK, accentSoft: SAND, accentOn: "#ffffff" };

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
// that aren't city lists at all ("jan_powder", "classic_7").
const PLACE_KINDS = new Set(["city", "base", "stop", "destination"]);

/** `"Café Central"` → `"cafe_central"`. Matches the shape of a window's
 *  `skeleton` ("prague_vienna_budapest") so the two can be compared. */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/** True when the chosen window's route already covers this city. Compared on
 *  token boundaries so "vienna" hits "prague_vienna_budapest" but "wien" does
 *  not hit "wienerwald", and multi-word cities ("st_moritz") still match. */
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
  // First date window + first pax preset are pre-selected so the reader can
  // submit in one tap (per _STRUCTURE.md behaviour).
  const [winIdx, setWinIdx] = React.useState(0);
  const [pax, setPax] = React.useState(form.paxPresets[0] ?? "");
  const [exactOpen, setExactOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  // Selected quick-reply chips — toggled on/off and sent with the submission in
  // one go when the reader hits the CTA (not sent immediately on tap).
  const [selectedPrompts, setSelectedPrompts] = React.useState<string[]>([]);
  const togglePrompt = (p: string) =>
    setSelectedPrompts((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  // The theme's colour, resolved from the same slug the page handed over. Every
  // "chosen" state in the card — the route card, its tick, the saved-item tags
  // and the CTA — reads from here, so the form looks like the page it came from.
  const pagePalette = getThemePalette(form.slug);
  const accent = pagePalette?.accent ?? NEUTRAL.accent;
  const accentSoft = pagePalette?.accentSoft ?? NEUTRAL.accentSoft;
  const accentOn = pagePalette?.accentOn ?? NEUTRAL.accentOn;

  const win = form.dateWindows[winIdx] ?? form.dateWindows[0];

  const trimmedNote = (note ?? "").trim();

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
    const skeleton = win?.skeleton ?? "";
    if (!skeleton) return uniqueItems;
    return uniqueItems.filter((it) => {
      if (!PLACE_KINDS.has((it.kind || "").toLowerCase())) return true;
      const label = it.short || it.label || "";
      return !routeCovers(skeleton, label);
    });
  }, [uniqueItems, win?.skeleton]);

  const submit = () => {
    if (submitted || !win) return;
    const useExact = exactOpen && fromDate && toDate;
    const dates: [string, string] = useExact
      ? [fromDate, toDate]
      : [win.range[0], win.range[1]];

    const submission: ThemeFormSubmission = {
      slug: form.slug,
      window: win.key,
      skeleton: win.skeleton,
      dates,
      pax,
      items: dedupedItems.length ? dedupedItems : undefined,
      prompts: selectedPrompts.length ? selectedPrompts : undefined,
      note: trimmedNote || undefined,
    };

    // Include the window's blurb so the message reads with the chosen
    // route/length (e.g. "Rhine Run · 8N — Strasbourg → Cologne → Amsterdam").
    const routeLine = win.blurb ? ` — ${win.blurb}` : "";
    const savedLine = dedupedItems.length
      ? ` Build it around the ${dedupedItems.length} ${
          dedupedItems.length === 1 ? "place" : "places"
        } I saved: ${dedupedItems
          .map((i) => i.short || i.label)
          .filter(Boolean)
          .join(", ")}.`
      : "";
    const promptLine = selectedPrompts.length
      ? `\n• Also: ${selectedPrompts.join("; ")}`
      : "";
    // The reader's own words go on their own line, ahead of the canned chips,
    // so they read as the brief rather than one more toggle.
    const noteLine = trimmedNote ? `\n• In my words: ${trimmedNote}` : "";
    const composed =
      `Here are my ${form.display} trip details:\n` +
      `• When: ${win.label} (${dates[0]} to ${dates[1]})${routeLine}\n` +
      `• Travellers: ${pax}` +
      noteLine +
      promptLine +
      savedLine;

    setSubmitted(true);
    onSubmit(submission, composed);
  };

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
        <div style={{ marginBottom: 10, marginLeft: 10}}>
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

      {/* The 2-section card (the tagline greeting is a separate message bubble
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
            marginBottom: 14,
          }}
        >
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: INK }} />
            <div
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: pax ? INK : "#dfe2ea",
              }}
            />
          </div>
          <span style={{ ...mono, color: FAINT, fontSize: 9 }}>2/2</span>
        </div>

        {/* ── Section 1 — when/scope ── */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.01em",
          }}
        >
          {form.copy.datesTitle}
        </div>
        <div style={{ fontSize: 12.5, color: FAINT, margin: "3px 0 12px" }}>
          {form.copy.datesSub}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {form.dateWindows.map((w, i) => {
            const on = i === winIdx && !exactOpen;
            return (
              <button
                key={w.key}
                type="button"
                onClick={() => {
                  setWinIdx(i);
                  setExactOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                  width: "100%",
                  background: on ? accentSoft : "#ffffff",
                  border: `1px solid ${on ? accent : BORDER}`,
                  borderRadius: 14,
                  padding: "12px 13px",
                  cursor: "pointer",
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
                      display: "block",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: INK,
                    }}
                  >
                    {w.label}
                  </span>
                  {w.blurb && (
                    <span
                      style={{
                        display: "block",
                        fontSize: 11.5,
                        color: FAINT,
                        marginTop: 2,
                      }}
                    >
                      {w.blurb}
                    </span>
                  )}
                </span>
                {w.tag && (
                  <span
                    style={{
                      ...mono,
                      background: SAND,
                      color: MUTED,
                      padding: "3px 7px",
                      borderRadius: 6,
                      fontSize: 8.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {w.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {form.allowExactDates && !exactOpen && (
          <button
            type="button"
            onClick={() => setExactOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: MUTED,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "10px 0 0",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Or pick exact dates
          </button>
        )}
        {exactOpen && (
          <div
            style={{
              display: "flex",
              gap: 10,
              background: SAND,
              borderRadius: 14,
              padding: "11px 13px",
              marginTop: 10,
            }}
          >
            <label style={{ flex: 1, minWidth: 0 }}>
              <span style={{ ...mono, display: "block", color: FAINT, fontSize: 8.5 }}>
                Depart
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 5,
                  border: "none",
                  background: "none",
                  fontSize: 12,
                  color: INK,
                  padding: 0,
                }}
              />
            </label>
            <label style={{ flex: 1, minWidth: 0 }}>
              <span style={{ ...mono, display: "block", color: FAINT, fontSize: 8.5 }}>
                Return
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 5,
                  border: "none",
                  background: "none",
                  fontSize: 12,
                  color: INK,
                  padding: 0,
                }}
              />
            </label>
          </div>
        )}

        <div style={{ height: 1, background: BORDER, margin: "18px 0" }} />

        {/* ── Section 2 — how many ── */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.01em",
          }}
        >
          {form.copy.paxTitle}
        </div>
        <div style={{ fontSize: 12.5, color: FAINT, margin: "3px 0 12px" }}>
          {form.copy.paxSub}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {form.paxPresets.map((p) => {
            const on = p === pax;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPax(p)}
                style={{
                  background: on ? INK : "#ffffff",
                  color: on ? "#fafaf5" : MUTED,
                  border: `1px solid ${on ? INK : BORDER}`,
                  borderRadius: 999,
                  padding: "9px 15px",
                  fontSize: 12.5,
                  fontWeight: on ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {on ? `✓ ${p}` : p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={submit}
          style={{
            width: "100%",
            marginTop: 16,
            background: accent,
            color: accentOn,
            border: "none",
            borderRadius: 999,
            padding: 13,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 8px 20px -10px ${rgba(accent, 0.5)}`,
          }}
        >
          {form.copy.cta}
        </button>
      </div>

      {/* footer under the card */}
      {/* {form.copy.footer && (
        <div
          style={{
            background: SAND,
            borderRadius: 14,
            padding: "11px 14px",
            fontSize: 12,
            lineHeight: 1.5,
            color: MUTED,
            marginTop: 10,
          }}
        >
          {form.copy.footer}
        </div>
      )} */}

      {/* Quick-reply chips — toggle-selectable. Selected chips are sent with the
          submission when the CTA is clicked (not fired one at a time). */}
      {form.seedPrompts?.length > 0 && !submitted && (
        <div style={{ marginTop: 10 }}>
          <div style={{ ...mono, color: FAINT, fontSize: 9, marginBottom: 6 }}>
            Add any of these
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
                    padding: "8px 13px",
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
};

export default ThemeIntakeForm;
