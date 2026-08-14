// components/theme/cinematic/themeForms/hokkaido-powder.ts
//
// Mini-form render data for /theme/hokkaido-powder. Mirrors
// theme_forms/hokkaido-powder.yaml. Not read by the model — the backend maps
// the submitted payload; the route brief lives in themes/hokkaido-powder.yaml.

import type { ThemeForm } from "./types";

const hokkaidoPowderForm: ThemeForm = {
  slug: "hokkaido-powder",
  display: "Hokkaido Powder",
  tagline: "Hokkaido powder — the lightest snow on earth, reached by train.",
  voice: "Ski-savvy and unhurried. Talks snow quality and season tradeoffs.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "Pick a month — the season reads differently in each one.",
    footer:
      "That's the whole form. The page already told me where, what vibe, and what you want to do.",
    cta: "Draft my route →",
  },
  // Month numbers only — no years. The form resolves each to its next
  // occurrence, so this stays correct forever (see season.ts). Matches the
  // page's own "When to actually go" section and its "Dec – Mar" header.
  season: [
    {
      month: 12,
      label: "First snow",
      tag: "QUIET",
      line: "Resorts opening, thin crowds, fares still soft.",
    },
    {
      month: 1,
      label: "Deepest powder",
      tag: "BEST SNOW",
      line: "Japanuary — the driest snow of the year, and the coldest.",
    },
    {
      month: 2,
      label: "Snow Festival",
      tag: "FESTIVAL",
      line: "Giant ice sculptures in Sapporo. Busiest week of the winter.",
    },
    {
      month: 3,
      label: "Spring corn",
      tag: "CHEAPEST",
      line: "Bluebird days, softer snow, the fewest people on the hill.",
    },
  ],
  // Trip shapes, each tagged with the months it runs in. Lengths are the ones
  // that actually sell: Hokkaido trips in our own bookings average 9–14 nights,
  // with Sapporo held ~3 nights, Niseko ~2.5 and Hakodate ~2.
  routes: [
    {
      key: "powder_city",
      label: "Powder and the city",
      blurb: "Sapporo + Niseko — ski days, city nights",
      tag: "MOST PICKED",
      nights: 9,
      skeleton: "sapporo_niseko",
      fareNote: "Post-New-Year lull is the cheapest window for this one.",
    },
    {
      key: "undersea_run",
      label: "The undersea run",
      blurb: "Tokyo → Hakodate → Sapporo, all by train",
      tag: "BY RAIL",
      nights: 11,
      skeleton: "tokyo_hakodate_sapporo",
      fareNote: "One JR Pass covers the Seikan Tunnel run both ways.",
    },
    {
      key: "snow_festival",
      label: "Snow Festival week",
      blurb: "Sapporo · Otaru · Noboribetsu, timed to the sculptures",
      tag: "FESTIVAL",
      nights: 8,
      skeleton: "sapporo_otaru_noboribetsu",
      // The festival runs the first full week of February, so this route only
      // shows for February and lands on the real dates of whichever year the
      // reader is booking.
      months: [2],
      anchor: { month: 2, day: 4, note: "Sapporo Snow Festival week" },
      fareNote: "Festival demand — book Sapporo stays early.",
    },
    {
      key: "first_tracks",
      label: "First tracks & onsen",
      blurb: "Sapporo · Niseko · Noboribetsu at a slower pace",
      tag: "QUIET",
      nights: 7,
      skeleton: "sapporo_niseko_noboribetsu",
      months: [12, 3],
      fareNote: "Shoulder months — quietest slopes and the best value.",
    },
  ],
  // Panel hero on /chat — a skier through deep powder in snow-laden trees.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/hokkaido-powder.jpg",
    title: "Hokkaido winter",
    subtext: "The lightest powder on earth, onsens, and a train beneath the sea.",
    tag: "Japan · Dec – Mar",
  },
  allowExactDates: true,
  seedPrompts: [
    "Ski-in ski-out in Niseko",
    "Add the Sapporo Snow Festival",
    "Do it by train instead",
    "Beginner-friendly slopes",
  ],
};

export default hokkaidoPowderForm;
