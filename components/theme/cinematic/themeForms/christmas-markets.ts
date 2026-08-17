// components/theme/cinematic/themeForms/christmas-markets.ts
//
// Mini-form render data for /theme/christmas-markets. Month-first (see
// season.ts): the markets open in the last week of November and are packed away
// by about 6 January, so the season is exactly two bookable months — and the
// two New Year routes are anchored to the real dates rather than stored with a
// year that expires.

import type { ThemeForm } from "./types";

const christmasMarketsForm: ThemeForm = {
  slug: "christmas-markets",
  display: "Christmas Markets & New Year",
  tagline:
    "Europe's most magical six weeks — glühwein, lantern-lit squares, and New Year's Eve.",
  voice: "Cosy and festive. Talks glühwein, Striezelmarkt, Rathausplatz, the Bells.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "The markets run late Nov to New Year. The month changes the trip.",
    footer:
      "That's the whole form. The page already told me it's the Christmas markets.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 11,
      label: "Markets open",
      tag: "QUIET",
      line: "Stalls up from the last week of November — no crowds, softest fares.",
    },
    {
      month: 12,
      label: "The full thing",
      tag: "PEAK",
      line: "Every square lit, plus New Year's Eve. Book stays months ahead.",
    },
  ],
  // Nights track what these trips actually run at: Austria, Czechia, Hungary,
  // Germany and the Netherlands all average 9–11 nights in our own bookings.
  routes: [
    {
      key: "rhine_run",
      label: "Rhine Run",
      blurb: "Strasbourg → Cologne → Amsterdam, along the Rhine",
      tag: "CLASSIC",
      nights: 8,
      skeleton: "strasbourg_cologne_amsterdam",
      // The Rhine markets close on 23 December, so this one is a November /
      // early-December trip only.
      months: [11, 12],
      fareNote: "Lufthansa DEL/BOM→FRA direct; out of AMS.",
    },
    {
      key: "alpine_classic",
      label: "Alpine Classic",
      blurb: "Munich → Salzburg → Vienna, Alpine market towns",
      tag: "STORYBOOK",
      nights: 9,
      skeleton: "munich_salzburg_vienna",
      months: [11, 12],
      fareNote: "Early-Dec sweet spot; MUC in / VIE out.",
    },
    {
      key: "central_loop",
      label: "Central Loop",
      blurb: "Prague → Vienna → Budapest, the Bells in a grand square",
      tag: "MOST POPULAR",
      nights: 10,
      skeleton: "prague_vienna_budapest",
      months: [12],
      // Starts on the 27th so the 10 nights carry through New Year's Eve.
      anchor: { month: 12, day: 27, note: "New Year's Eve in a grand square" },
      fareNote: "NYE run; PRG in / BUD out. Peak week, book early.",
    },
    {
      key: "midnight_nye",
      label: "Midnight Trip",
      blurb: "Prague → Vienna, just the Bells and the best two squares",
      tag: "NYE SHORT",
      nights: 6,
      skeleton: "prague_vienna",
      months: [12],
      anchor: { month: 12, day: 28, note: "New Year's Eve" },
      fareNote: "Short NYE hit; PRG in / VIE out.",
    },
  ],
  // Panel hero on /chat — a lit carousel and stalls on a half-timbered market square at night.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/christmas-markets.jpg",
    title: "Christmas markets",
    subtext: "Glühwein, lantern-lit squares, and New Year's Eve across Europe.",
    tag: "Europe · Nov – Jan",
  },
  allowExactDates: true,
  seedPrompts: [
    "Where should I be for New Year's Eve?",
    "Add Dresden's Striezelmarkt",
    "Do the Rhine markets instead",
    "A shorter NYE-only trip",
  ],
};

export default christmasMarketsForm;
