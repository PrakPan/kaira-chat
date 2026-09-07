// Filter bar for the trips hubs.
//
// Three dimensions, in the order a traveller actually decides them: what the
// trip is for, how long, and the vibe. They come from what the corpus can
// prove — theme (see lib/seo/tripTheme) and duration are on essentially every
// row, while experience_filters is populated on about a quarter of them.
//
// There is deliberately no "Who" row any more. group_type and theme are the
// same split — honeymoon IS the couples' trips, 1:1 across all 1,718 — so the
// two rows offered the reader the same cut twice, under two vocabularies and
// with slightly different counts (Family 454 by theme, 470 by group_type),
// which read as a bug. The traveller's word wins. There is no engagement data behind the ordering: /trips had
// 3 production sessions in the three days before this was written, so the
// ordering is a judgement about planning intent, not a measurement, and is
// worth revisiting once the pages have traffic.
//
// Filtering hides rather than unmounts. These hubs are the pages targeting the
// head terms, and their whole value is that every trip is a real anchor in the
// served HTML — dropping non-matching cards from the DOM would leave a crawler
// with whatever the default filter happened to be. So all cards render, and a
// selection toggles `hidden` on the ones that don't match.
//
// `defaultTheme` opens the page on one theme rather than on the whole corpus:
// /trips now carries all 1,718 trips, and an unfiltered wall of them is not a
// page anyone reads. The chips are the way in, so one of them starts pressed.

import { useMemo, useState } from "react";
import styled from "styled-components";
import { themeLabel } from "../../lib/seo/tripTheme";

// A bounded strip rather than loose chips on the page background: the rows read
// as one control, and the trips below start against a clean edge instead of
// blending into the filters.
const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 0 28px;
  padding: 16px 18px;
  background: #fbfaf8;
  border: 1px solid #eceae5;
  border-radius: 14px;
  font-family: "Geist", "Inter", system-ui, -apple-system, sans-serif;

  @media (max-width: 600px) {
    padding: 14px;
    /* Full-bleed to the wrapper's gutter so the scrolling chip rows can run to
       the screen edge instead of stopping short inside a rounded box. */
    margin-left: -4px;
    margin-right: -4px;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;

  /* The label sits on its own line on a phone so the chips get the full width
     rather than being squeezed into what's left beside it. */
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 7px;
  }
`;

const GroupLabel = styled.span`
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9aa1ab;
  min-width: 78px;
  flex-shrink: 0;
`;

// Chips scroll sideways on a phone instead of wrapping to four rows and pushing
// the trips themselves below the fold.
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Chip = styled.button`
  flex-shrink: 0;
  font-family: inherit;
  border: 1px solid ${(p) => (p.$on ? "#0b1220" : "#e3e1dc")};
  background: ${(p) => (p.$on ? "#0b1220" : "#fff")};
  color: ${(p) => (p.$on ? "#fff" : "#0b1220")};
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.25;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${(p) => (p.$on ? "#0b1220" : "#bdbab3")};
  }

  em {
    font-style: normal;
    opacity: 0.5;
    margin-left: 6px;
    font-variant-numeric: tabular-nums;
  }
`;

const Summary = styled.p`
  font-size: 14px;
  color: #6b6b6b;
  margin: 0;

  button {
    background: none;
    border: 0;
    padding: 0;
    margin-left: 8px;
    font-size: 14px;
    color: #1c1c1c;
    text-decoration: underline;
    cursor: pointer;
  }
`;

// Only offer a chip the current set can actually satisfy, with its count — a
// destination hub with nothing but couples trips shouldn't show three empty
// group chips.
const tally = (items, pick) => {
  const counts = new Map();
  for (const item of items) {
    for (const value of pick(item)) {
      if (!value) continue;
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  }
  return counts;
};

const matches = (card, sel) => {
  const f = card?.filters || {};
  if (sel.theme && f.theme !== sel.theme) return false;
  if (sel.length && f.length !== sel.length) return false;
  if (sel.vibe && !(f.vibes || []).includes(sel.vibe)) return false;
  return true;
};

const EMPTY_SEL = { theme: null, length: null, vibe: null };

/**
 * Renders the bar and hands the caller the per-card verdict.
 *
 * `children` is called with an `isVisible(card)` predicate so the hub keeps
 * ownership of how a hidden card is rendered (it stays mounted, see above), the
 * number that match, and a key identifying the current selection — the hub
 * uses that last one to reset its "show 48 more" paging when the filter
 * changes, so a new selection always opens at the top of its own set.
 */
const TripsFilters = ({
  cards = [],
  lengthBuckets = [],
  defaultTheme = null,
  children,
}) => {
  const [sel, setSel] = useState({ ...EMPTY_SEL, theme: defaultTheme });

  const themes = useMemo(
    () => tally(cards, (c) => [c?.filters?.theme]),
    [cards],
  );
  const lengths = useMemo(
    () => tally(cards, (c) => [c?.filters?.length]),
    [cards],
  );
  const vibes = useMemo(
    () => tally(cards, (c) => c?.filters?.vibes || []),
    [cards],
  );

  const toggle = (key, value) =>
    setSel((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const visible = cards.filter((c) => matches(c, sel));
  const active = !!(sel.theme || sel.length || sel.vibe);

  // The six most common vibes. The tail is long and thin (Isolated is on 121
  // of 1,718) and a row of fourteen chips is the clutter this bar replaced.
  const topVibes = [...vibes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Vibe is only offered where most of the set is actually tagged. Unlike
  // theme, group and length — which are on ~100% of trips —
  // experience_filters is populated on 473 of 1,718. Below the threshold,
  // picking a vibe would hide trips for being untagged rather than for not
  // matching, and the reader would read that as "there are no romantic trips
  // in Bali".
  const vibedShare = cards.length
    ? cards.filter((c) => (c?.filters?.vibes || []).length).length / cards.length
    : 0;
  const showVibes = vibedShare >= 0.5;

  const row = (label, entries, key, labelFor) =>
    entries.length > 1 ? (
      <Group>
        <GroupLabel>{label}</GroupLabel>
        <Chips>
          {entries.map(([value, count]) => (
            <Chip
              key={value}
              type="button"
              $on={sel[key] === value}
              aria-pressed={sel[key] === value}
              onClick={() => toggle(key, value)}
            >
              {labelFor ? labelFor(value) : value} <em>{count}</em>
            </Chip>
          ))}
        </Chips>
      </Group>
    ) : null;

  return (
    <>
      <Bar>
        {row(
          "Trip for",
          [...themes.entries()].sort((a, b) => b[1] - a[1]),
          "theme",
          themeLabel,
        )}
        {row(
          "How long",
          lengthBuckets
            .filter((b) => lengths.get(b.id))
            .map((b) => [b.id, lengths.get(b.id)]),
          "length",
          (id) => lengthBuckets.find((b) => b.id === id)?.label || id,
        )}
        {showVibes && row("Vibe", topVibes, "vibe")}

        {active && (
          <Summary>
            {visible.length}{" "}
            {visible.length === 1 ? "trip matches" : "trips match"}
            <button type="button" onClick={() => setSel(EMPTY_SEL)}>
              Show all trips
            </button>
          </Summary>
        )}
      </Bar>

      {children(
        (card) => matches(card, sel),
        visible.length,
        `${sel.theme || ""}|${sel.length || ""}|${sel.vibe || ""}`,
      )}
    </>
  );
};

export default TripsFilters;
