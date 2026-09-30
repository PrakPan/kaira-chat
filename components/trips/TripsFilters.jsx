// Filter bar for the trips hubs.
//
// On /trips a destination row comes first (where), then three dimensions in
// the order a traveller actually decides them: what the trip is for, how long,
// and the vibe. They come from what the corpus can
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
//
// The selection lives in the query string too — ?destination=thailand,
// ?theme=family, ?length=week, ?vibe=hidden-gem — so a filtered view can be
// linked to (ads, WhatsApp, the blog). A URL carrying any of them opens on
// exactly that selection and skips `defaultTheme`; ?theme=all is how the URL
// says "no theme" when the page would otherwise press one. The served HTML is
// the same for every query string — this is a static export — so the URL is
// only read after hydration, and the default view flashes first.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
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
     rather than being squeezed into what's left beside it. nowrap matters:
     in a wrapping column flexbox each line is as wide as its content, so the
     chip row grew to its full length and got clipped instead of scrolling. */
  @media (max-width: 600px) {
    flex-direction: column;
    flex-wrap: nowrap;
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
  if (sel.destination && f.destination !== sel.destination) return false;
  if (sel.theme && f.theme !== sel.theme) return false;
  if (sel.length && f.length !== sel.length) return false;
  if (sel.vibe && !(f.vibes || []).includes(sel.vibe)) return false;
  return true;
};

const EMPTY_SEL = { destination: null, theme: null, length: null, vibe: null };
const KEYS = Object.keys(EMPTY_SEL);

// Vibes are free text ("Hidden Gem"); the URL carries them as "hidden-gem".
const slugify = (value) =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const sameSel = (a, b) => KEYS.every((k) => a[k] === b[k]);

// Enough to cover where most of the demand is without the row turning into the
// 146-name wall the destination index at the foot of the page already is.
const TOP_DESTINATIONS = 8;

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
  // Every destination, [{ id, label }], most trips first; the row shows the
  // top TOP_DESTINATIONS. Only /trips passes these — on a destination hub every
  // card is the same destination.
  destinations = null,
  children,
}) => {
  const router = useRouter();
  const initialSel = useMemo(
    () => ({ ...EMPTY_SEL, theme: defaultTheme }),
    [defaultTheme],
  );
  const [sel, setSel] = useState(initialSel);
  // Set once the query string has been read, so the write-back below never
  // runs on the pre-hydration default and wipes the reader's ?destination=.
  const [fromUrl, setFromUrl] = useState(false);
  const lastWritten = useRef(null);

  const destinationCounts = useMemo(
    () => tally(cards, (c) => [c?.filters?.destination]),
    [cards],
  );
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

  // Read the query string once the router is ready. On these static pages
  // isReady stays false until Next's own post-hydration navigation when there
  // IS a query string, and replacing the URL before that races it.
  //
  // window.location rather than router.query: on /trips/[destination] the
  // route param is also called `destination`, and it is not a filter.
  useEffect(() => {
    if (!router.isReady || fromUrl) return;

    const params = new URLSearchParams(window.location.search);
    const has = KEYS.some((k) => params.get(k));

    if (has) {
      const vibeSlug = params.get("vibe");
      const themeParam = (params.get("theme") || "").toLowerCase();
      const destParam = (params.get("destination") || "").toLowerCase();
      const lengthParam = (params.get("length") || "").toLowerCase();

      // Values the cards can't satisfy are dropped, not applied — a stale or
      // mistyped link should open on a full page, not on "No trips match".
      const next = {
        destination:
          destinations && destinationCounts.has(destParam) ? destParam : null,
        theme: themes.has(themeParam) ? themeParam : null,
        length: lengthBuckets.some((b) => b.id === lengthParam) ? lengthParam : null,
        vibe: vibeSlug
          ? [...vibes.keys()].find((v) => slugify(v) === vibeSlug.toLowerCase()) || null
          : null,
      };
      // Nothing usable (?destination=nowhere) keeps the default view; the
      // write-back below then strips the dead param from the URL.
      if (KEYS.some((k) => next[k]) || themeParam === "all") {
        lastWritten.current = window.location.search;
        setSel(next);
      }
    }
    setFromUrl(true);
  }, [router.isReady, fromUrl, destinations, destinationCounts, themes, vibes, lengthBuckets]);

  // Mirror the selection back into the URL. replace, not push: a chip tap is
  // not a page the back button should step through. Other params (utm_*,
  // gclid) are kept — this page takes ad traffic.
  useEffect(() => {
    if (!fromUrl) return;

    const params = new URLSearchParams(window.location.search);
    KEYS.forEach((k) => params.delete(k));

    if (!sameSel(sel, initialSel)) {
      if (sel.destination) params.set("destination", sel.destination);
      if (sel.theme) params.set("theme", sel.theme);
      if (sel.length) params.set("length", sel.length);
      if (sel.vibe) params.set("vibe", slugify(sel.vibe));
      // Nothing pressed at all, on a page that opens with a theme pressed:
      // without this the URL would reload onto the default theme again.
      if (!KEYS.some((k) => sel[k]) && defaultTheme) params.set("theme", "all");
    }

    const qs = params.toString();
    const search = qs ? `?${qs}` : "";
    if (search === window.location.search || search === lastWritten.current) return;
    lastWritten.current = search;

    router.replace(
      `${window.location.pathname}${search}${window.location.hash}`,
      undefined,
      { shallow: true, scroll: false },
    );
    // `router` is left out on purpose: its identity changes on every replace,
    // which would re-run this for a selection that hasn't changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, fromUrl, initialSel, defaultTheme]);

  const toggle = (key, value) =>
    setSel((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const visible = cards.filter((c) => matches(c, sel));
  const active = KEYS.some((k) => sel[k]);

  // The top destinations as quick chips. A destination picked from the URL
  // that isn't among them still gets its chip, so the pressed state is visible
  // and can be undone.
  const destinationEntries = (() => {
    if (!destinations?.length) return [];
    const ids = destinations
      .filter((d) => destinationCounts.get(d.id))
      .slice(0, TOP_DESTINATIONS)
      .map((d) => d.id);
    if (sel.destination && !ids.includes(sel.destination)) ids.push(sel.destination);
    return ids.map((id) => [id, destinationCounts.get(id)]);
  })();
  const destinationLabelFor = (id) =>
    destinations?.find((d) => d.id === id)?.label || id;

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
        {row("Where", destinationEntries, "destination", destinationLabelFor)}
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
        KEYS.map((k) => sel[k] || "").join("|"),
      )}
    </>
  );
};

export default TripsFilters;
