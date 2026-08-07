// components/theme/cinematic/themeForms/lapland.ts
// Mini-form render data for /theme/lapland. Mirrors theme_forms/lapland.yaml.

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
    paxTitle: "And how many of you?",
    paxSub: "So I can size the cabins and the sleigh rides.",
    footer: "That's the whole form. The page already told me it's Lapland.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "first_snow",
      label: "Nov – early Dec",
      range: ["2026-11-20", "2026-11-25"],
      nights: 5,
      blurb: "First snow, no crowds",
      tag: "QUIET",
      skeleton: "aurora_glass",
      fareNote: "Pre-Christmas lull — cheapest fares + cabins.",
    },
    {
      key: "christmas_week",
      label: "20 – 31 Dec",
      range: ["2026-12-22", "2026-12-28"],
      nights: 6,
      blurb: "Christmas in Santa's own town",
      tag: "PEAK",
      skeleton: "santa_town",
      fareNote: "Most competitive week — book months ahead.",
    },
    {
      key: "deep_winter",
      label: "3 – 10 Jan",
      range: ["2027-01-03", "2027-01-10"],
      nights: 7,
      blurb: "Deepest snow, darkest sky — Santa without the crowds",
      tag: "BEST AURORA",
      skeleton: "nordic_slow",
      fareNote:
        "Sweet spot: post-Christmas calm, strong aurora, softer prices.",
    },
    {
      key: "light_returns",
      label: "March",
      range: ["2027-03-08", "2027-03-13"],
      nights: 5,
      blurb: "Light returns — long days, snow still deep",
      tag: "CHEAPEST",
      skeleton: "aurora_glass",
      fareNote: "Cheapest of the season; longer daylight.",
    },
  ],
  hero: {
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/lapland-2026/Rovaniemi.png",
    title: "Lapland",
    subtext: "Santa's own town, husky trails, and the aurora over a glass roof.",
    tag: "Arctic · Nov – Mar",
  },
  paxPresets: ["Family of 4", "Just us 2", "Friends of 4", "Group of 6"],
  allowExactDates: true,
  seedPrompts: [
    "Add a glass igloo night",
    "Do the overnight Santa train",
    "Best week for the kids to meet Santa",
    "Ski at Levi too",
  ],
};

export default laplandForm;
