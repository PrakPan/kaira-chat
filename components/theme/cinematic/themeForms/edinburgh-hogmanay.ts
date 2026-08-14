// components/theme/cinematic/themeForms/edinburgh-hogmanay.ts
//
// Mini-form render data for /theme/edinburgh-hogmanay. Month-first (see
// season.ts), though this theme has the narrowest season there is: Hogmanay
// runs 30 Dec – 1 Jan and nothing else on the page happens without it. So the
// season is the single month of December and all three routes are anchored to
// the days that put the reader in Edinburgh for the Bells — which means the
// form rolls to the next December on its own instead of expiring.

import type { ThemeForm } from "./types";

const edinburghHogmanayForm: ThemeForm = {
  slug: "edinburgh-hogmanay",
  display: "Edinburgh Hogmanay",
  tagline:
    "Edinburgh Hogmanay — the world's biggest New Year, torchlit and fireworks over the castle.",
  voice:
    "Festive and warm against the cold. Talks Torchlight, the Bells, ceilidhs, Loony Dook.",
  copy: {
    datesTitle: "How long, and how far?",
    datesSub: "Hogmanay itself is fixed — 30 Dec to 1 Jan. Pick your trip length.",
    footer:
      "That's the whole form. The page already told me it's Hogmanay in Edinburgh.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 12,
      label: "Hogmanay",
      tag: "30 DEC – 1 JAN",
      line: "Torchlight on the 30th, the Street Party on the 31st, Loony Dook on the 1st.",
    },
  ],
  // Lengths are the ones the page offers; UK trips in our own bookings average
  // ~9.6 nights in December, so the 7 and 8-night shapes are the realistic ones
  // and the 4-night Bells-only run is the deliberate short hit.
  routes: [
    {
      key: "scotland_ny",
      label: "London first, then the Bells",
      blurb: "London → Edinburgh, arriving in time for Hogmanay",
      tag: "MOST POPULAR",
      nights: 7,
      skeleton: "london_edinburgh",
      anchor: { month: 12, day: 26, note: "In Edinburgh for 30 Dec – 1 Jan" },
      fareNote: "Fly LHR (cheapest), open-jaw home from EDI.",
    },
    {
      key: "highlands_ny",
      label: "The Bells, then Glasgow",
      blurb: "Edinburgh → Glasgow, with room for a Highlands day",
      tag: "SEE MORE",
      nights: 8,
      skeleton: "edinburgh_glasgow",
      anchor: { month: 12, day: 26, note: "In Edinburgh for 30 Dec – 1 Jan" },
      fareNote: "LHR in / GLA out open-jaw; book early.",
    },
    {
      key: "bells_only",
      label: "Just the Bells",
      blurb: "All-in on Edinburgh, nothing else to catch",
      tag: "THE BELLS",
      nights: 4,
      skeleton: "edinburgh_core",
      anchor: { month: 12, day: 29, note: "Torchlight, the Street Party, Loony Dook" },
      fareNote: "NYE peak; EDI direct fares + hotels surge, book early.",
    },
  ],
  // Panel hero on /chat — fireworks bursting over Edinburgh Castle.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/edinburgh-hogmanay.jpg",
    title: "Edinburgh Hogmanay",
    subtext: "The world's biggest New Year — torchlit, fireworks over the castle.",
    tag: "Scotland · 29 Dec – 2 Jan",
  },
  allowExactDates: true,
  seedPrompts: [
    "Get me Street Party tickets",
    "Add a Highlands day tour",
    "Do the Bells only, skip London",
    "Somewhere warm to watch the fireworks",
  ],
};

export default edinburghHogmanayForm;
