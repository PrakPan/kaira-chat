// components/theme/cinematic/themeForms/christmas-markets.ts
// Mini-form render data for /theme/christmas-markets. Mirrors
// theme_forms/christmas-markets.yaml. Here the "date window" is the ROUTE.

import type { ThemeForm } from "./types";

const christmasMarketsForm: ThemeForm = {
  slug: "christmas-markets",
  display: "Christmas Markets & New Year",
  tagline:
    "Europe's most magical six weeks — glühwein, lantern-lit squares, and New Year's Eve.",
  voice: "Cosy and festive. Talks glühwein, Striezelmarkt, Rathausplatz, the Bells.",
  copy: {
    datesTitle: "Which route through the markets?",
    datesSub: "Markets open late Nov and run to New Year. Pick your line.",
    paxTitle: "And how many of you?",
    paxSub: "So I can size the rooms and the train seats.",
    footer:
      "That's the whole form. The page already told me it's the Christmas markets.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "central_loop",
      label: "Central Loop · 10N · incl. NYE",
      range: ["2026-12-27", "2027-01-06"],
      nights: 10,
      blurb: "Prague → Vienna → Budapest, the Bells in a grand square",
      tag: "MOST POPULAR",
      skeleton: "prague_vienna_budapest",
      fareNote: "NYE run; PRG in / BUD out. Peak week, book early.",
    },
    {
      key: "alpine_classic",
      label: "Alpine Classic · 9N",
      range: ["2026-12-05", "2026-12-14"],
      nights: 9,
      blurb: "Munich → Salzburg → Vienna, Alpine market towns",
      tag: "STORYBOOK",
      skeleton: "munich_salzburg_vienna",
      fareNote: "Early-Dec sweet spot; MUC in / VIE out.",
    },
    {
      key: "rhine_run",
      label: "Rhine Run · 8N",
      range: ["2026-12-01", "2026-12-09"],
      nights: 8,
      blurb: "Strasbourg → Cologne → Amsterdam, along the Rhine",
      tag: "CLASSIC",
      skeleton: "strasbourg_cologne_amsterdam",
      fareNote: "Lufthansa DEL/BOM→FRA direct; out of AMS.",
    },
    {
      key: "midnight_nye",
      label: "Midnight Trip · 6N · NYE",
      range: ["2026-12-28", "2027-01-03"],
      nights: 6,
      blurb: "Prague → Vienna, just the Bells and the best two squares",
      tag: "NYE SHORT",
      skeleton: "prague_vienna",
      fareNote: "Short NYE hit; PRG in / VIE out.",
    },
  ],
  hero: {
    image:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200",
    title: "Christmas markets",
    subtext: "Glühwein, lantern-lit squares, and New Year's Eve across Europe.",
    tag: "Europe · Nov – Jan",
  },
  paxPresets: ["Just us 2", "Family of 4", "Friends of 4", "Group of 6"],
  allowExactDates: true,
  seedPrompts: [
    "Where should I be for New Year's Eve?",
    "Add Dresden's Striezelmarkt",
    "Do the Rhine markets instead",
    "A shorter NYE-only trip",
  ],
};

export default christmasMarketsForm;
