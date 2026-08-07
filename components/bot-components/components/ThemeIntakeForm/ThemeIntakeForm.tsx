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

const INK = "#0b1220";
const MUTED = "#445069";
const FAINT = "#8a93a6";
const BORDER = "#ececec";
const YELLOW = "#f7e700";
const SAND = "#f4f3ec";

export interface ThemeSelectedItemLike {
  kind?: string;
  label?: string;
  short?: string;
  id?: string;
}

export interface ThemeIntakeFormProps {
  form: ThemeForm;
  items?: ThemeSelectedItemLike[];
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

  const win = form.dateWindows[winIdx] ?? form.dateWindows[0];

  const submit = () => {
    if (submitted || !win) return;
    const useExact = exactOpen && fromDate && toDate;
    const dates: [string, string] = useExact
      ? [fromDate, toDate]
      : [win.range[0], win.range[1]];

    // De-dupe saved items (a place can be reachable from more than one section).
    // Cities that would define a route aren't offered as saves (see the page
    // configs), so what arrives here are add-ons — activities, restaurants,
    // POIs — safe to send alongside the chosen route.
    const dedupedItems: ThemeSelectedItemLike[] = [];
    const seen = new Set<string>();
    for (const it of items) {
      const key = it.id
        ? `id:${it.id}`
        : `${(it.kind || "").toLowerCase()}:${(it.label || it.short || "")
            .trim()
            .toLowerCase()}`;
      if (!key.trim() || key === ":" || seen.has(key)) continue;
      seen.add(key);
      dedupedItems.push(it);
    }

    const submission: ThemeFormSubmission = {
      slug: form.slug,
      window: win.key,
      skeleton: win.skeleton,
      dates,
      pax,
      items: dedupedItems.length ? dedupedItems : undefined,
      prompts: selectedPrompts.length ? selectedPrompts : undefined,
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
    const composed =
      `Here are my ${form.display} trip details:\n` +
      `• When: ${win.label} (${dates[0]} to ${dates[1]})${routeLine}\n` +
      `• Travellers: ${pax}` +
      promptLine +
      savedLine;

    setSubmitted(true);
    onSubmit(submission, composed);
  };

  return (
    <div style={{ width: "100%" }}>
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
                  background: on ? "rgba(247,231,0,0.16)" : "#ffffff",
                  border: `1px solid ${on ? "rgba(247,231,0,0.55)" : BORDER}`,
                  borderRadius: 14,
                  padding: "12px 13px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    ...mono,
                    color: on ? INK : "#b8becc",
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
            background: YELLOW,
            color: INK,
            border: "none",
            borderRadius: 999,
            padding: 13,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 20px -10px rgba(247,231,0,0.5)",
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
