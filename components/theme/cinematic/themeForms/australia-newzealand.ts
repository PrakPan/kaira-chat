// components/theme/cinematic/themeForms/australia-newzealand.ts
//
// Mini-form render data for /theme/australia-newzealand. Not read by the model
// — the backend maps the submitted payload; the route brief lives with the
// theme.
//
// This theme is the reason the season/route model exists. Two of its trips hang
// off dates that never move — the Boxing Day Test starts 26 December and the
// Sydney fireworks go up on the 31st — while the rest of the southern summer is
// open. Both are expressed the same way: December's routes are `anchor`ed to
// their real days, January through March carry no anchor and simply depart
// mid-month. Nothing here stores a year, so the form is as correct in 2029 as
// it is today.

import type { ThemeForm } from "./types";

const australiaNewZealandForm: ThemeForm = {
  slug: "australia-newzealand",
  display: "Australia & New Zealand",
  tagline:
    "Southern summer — cricket at the 'G, fireworks over the harbour, and mountains three hours east.",
  voice: "Warm and unhurried. Talks cricket, coastline and driving distances.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "December has fixed dates. The rest of summer is yours.",
    footer:
      "That's the whole form. The page already told me where, what vibe, and what you want to do.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 12,
      label: "The double",
      tag: "TEST + NYE",
      line: "Boxing Day Test on the 26th, Sydney fireworks on the 31st.",
    },
    {
      month: 1,
      label: "Peak summer",
      tag: "BEACH WEATHER",
      line: "Long, hot days and late sunsets. School holidays until late Jan.",
    },
    {
      month: 2,
      label: "Warm and quieter",
      tag: "BEST VALUE",
      line: "Still summer, minus the holiday crowds and the holiday fares.",
    },
    {
      month: 3,
      label: "Late summer",
      tag: "EASIEST",
      line: "Mild days, calm water, and the best light on the South Island.",
    },
  ],
  routes: [
    // ── December: the two fixed dates ──
    {
      key: "big_double",
      label: "The big double",
      blurb: "Melbourne for the Test, Sydney for the fireworks",
      tag: "MOST PICKED",
      nights: 10,
      skeleton: "melbourne_sydney",
      months: [12],
      // Lands on the 23rd so the 10 nights cover both the 26th and the 31st.
      anchor: { month: 12, day: 23, note: "Boxing Day Test + Sydney NYE" },
      fareNote: "Peak fares — the two biggest dates of the Australian summer.",
    },
    {
      key: "double_south_island",
      label: "Double, then the South Island",
      blurb: "Melbourne · Sydney · Queenstown and the alps",
      tag: "SEE BOTH",
      nights: 14,
      skeleton: "melbourne_sydney_queenstown",
      months: [12],
      anchor: { month: 12, day: 22, note: "Boxing Day Test + Sydney NYE" },
      fareNote: "Add the trans-Tasman hop; book the NZ leg early.",
    },
    {
      key: "sydney_nye_coast",
      label: "Sydney NYE + the coast",
      blurb: "Harbour fireworks, then the Great Ocean Road",
      tag: "NYE + DRIVE",
      nights: 9,
      skeleton: "sydney_melbourne_great_ocean_road",
      months: [12],
      // Straight after Christmas — the fireworks fall on night five.
      anchor: { month: 12, day: 27, note: "Sydney NYE" },
      fareNote: "Skips the Test, so Melbourne stays cheaper.",
    },
    // ── January – March: open summer, no fixed dates ──
    {
      key: "summer_cities",
      label: "Sydney & Melbourne summer",
      blurb: "Beaches, harbour, coffee and long lunches",
      tag: "CLASSIC",
      nights: 9,
      skeleton: "sydney_melbourne",
      months: [1, 2, 3],
    },
    {
      key: "aus_nz",
      label: "Australia + New Zealand",
      blurb: "Both cities, then Queenstown and the lakes",
      tag: "THE LOT",
      nights: 14,
      skeleton: "sydney_melbourne_queenstown",
      months: [1, 2, 3],
    },
    {
      key: "great_ocean_road",
      label: "Melbourne & the Great Ocean Road",
      blurb: "The Twelve Apostles, wildlife and coastal towns",
      tag: "ROAD TRIP",
      nights: 8,
      skeleton: "melbourne_great_ocean_road",
      months: [1, 2, 3],
    },
  ],
  // Panel hero on /chat — Sydney, from the catalog's own city imagery, so it
  // can't 404 the way a hand-uploaded file can.
  hero: {
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/168553075298443913459777832031.jpeg",
    title: "Southern summer",
    subtext:
      "Cricket at the 'G, fireworks over the harbour, and the Southern Alps three hours east.",
    tag: "Australia & NZ · Dec – Mar",
  },
  allowExactDates: true,
  seedPrompts: [
    "Add the Great Ocean Road",
    "Tickets for the Boxing Day Test",
    "Somewhere to watch the fireworks",
    "Add Queenstown and the South Island",
  ],
};

export default australiaNewZealandForm;
