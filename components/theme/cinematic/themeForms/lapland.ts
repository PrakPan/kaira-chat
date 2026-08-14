// components/theme/cinematic/themeForms/lapland.ts
//
// Mini-form render data for /theme/lapland. Month-first (see season.ts): the
// page's own line is that Lapland is four different winters, which is exactly a
// season of months rather than four stored date ranges. Christmas week is the
// one fixed thing, so that route is anchored to the 22nd.

import type { ThemeForm } from "./types";

const laplandForm: ThemeForm = {
  slug: "lapland",
  display: "Lapland",
  tagline: "Lapland — Santa's own town, husky trails, and the aurora over a glass roof.",
  voice:
    "Warm and wonderstruck, kid-and-couple friendly. Talks Santa, huskies, glass igloos, snow.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "Lapland is four different winters. Christmas week is the busiest.",
    footer: "That's the whole form. The page already told me it's Lapland.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 11,
      label: "First snow",
      tag: "QUIET",
      line: "Snow down, nobody there yet. Cheapest cabins of the winter.",
    },
    {
      month: 12,
      label: "Christmas",
      tag: "PEAK",
      line: "Santa's own town in its own month. The week books months ahead.",
    },
    {
      month: 1,
      label: "Deep winter",
      tag: "BEST AURORA",
      line: "Darkest skies, deepest snow, and the crowds gone home.",
    },
    {
      month: 2,
      label: "Coldest and clearest",
      tag: "STRONG SKY",
      line: "Hard frost, long dark nights, and the most reliable aurora odds.",
    },
    {
      month: 3,
      label: "Light returns",
      tag: "CHEAPEST",
      line: "Snow still deep but the days are long again. Best value of the season.",
    },
  ],
  // Shapes, not seasons — the month above already says what the winter is like,
  // so all three run the whole way through and the reader gets a real choice in
  // every month rather than a single pre-decided option. Nights match what
  // Finnish trips actually run at in our bookings (8.7–10.8 on average, with
  // the short Santa and aurora breaks at 5–7).
  routes: [
    {
      key: "santa_town",
      label: "Santa's own town",
      blurb: "Rovaniemi, reindeer, and the man himself",
      tag: "FAMILY PICK",
      nights: 6,
      skeleton: "santa_town",
      // Only fires when December is the chosen month; in January or March the
      // same trip simply departs mid-month, which is the quiet way to do it.
      anchor: { month: 12, day: 22, note: "Christmas in Rovaniemi" },
      fareNote: "Christmas week is the most competitive — book months ahead.",
    },
    {
      key: "aurora_glass",
      label: "Glass roof & husky trails",
      blurb: "Sleep under the sky, run a sled team by day",
      tag: "MOST PICKED",
      nights: 5,
      skeleton: "aurora_glass",
      fareNote: "Glass igloos are the first thing to sell out in any month.",
    },
    {
      key: "nordic_slow",
      label: "The slow Arctic week",
      blurb: "Helsinki first, then north with nothing rushed",
      tag: "SEE MORE",
      nights: 7,
      skeleton: "nordic_slow",
      fareNote: "Finnair DEL⇄HEL direct, then the overnight train or a hop north.",
    },
  ],
  // Panel hero on /chat — a husky sled team on a snowy forest trail.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/lapland.jpg",
    title: "Lapland",
    subtext: "Santa's own town, husky trails, and the aurora over a glass roof.",
    tag: "Arctic · Nov – Mar",
  },
  allowExactDates: true,
  seedPrompts: [
    "Add a glass igloo night",
    "Do the overnight Santa train",
    "Best week for the kids to meet Santa",
    "Ski at Levi too",
  ],
};

export default laplandForm;
