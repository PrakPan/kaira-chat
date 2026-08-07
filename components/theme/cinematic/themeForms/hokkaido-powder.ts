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
    datesSub: "The season splits into three completely different months.",
    paxTitle: "And how many of you?",
    paxSub: "So I can size the rooms and the transfers.",
    footer:
      "That's the whole form. The page already told me where, what vibe, and what you want to do.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "jan",
      label: "10–19 Jan",
      range: ["2027-01-10", "2027-01-19"],
      nights: 9,
      blurb: "Japanuary · deepest snow of the year",
      tag: "BEST SNOW",
      skeleton: "jan_powder",
      fareNote: "Post-New-Year lull; DEL/BOM→NRT fares soften.",
    },
    {
      key: "feb",
      label: "4–12 Feb",
      range: ["2027-02-04", "2027-02-12"],
      nights: 8,
      blurb: "Snow Festival week · busiest in Sapporo",
      tag: "FESTIVAL",
      skeleton: "feb_festival",
      fareNote: "Festival demand; book onward early.",
    },
    {
      key: "mar",
      label: "8–16 Mar",
      range: ["2027-03-08", "2027-03-16"],
      nights: 8,
      blurb: "Spring corn · bluebird days, fewer people",
      tag: "CHEAPEST",
      skeleton: "mar_value",
      fareNote: "Shoulder; cheapest of the season.",
    },
  ],
  hero: {
    image: "https://images.unsplash.com/photo-1551292831-023188e78222?w=1200",
    title: "Hokkaido winter",
    subtext: "The lightest powder on earth, onsens, and a train beneath the sea.",
    tag: "Japan · Dec – Mar",
  },
  paxPresets: ["Just us 2", "3", "Family of 4", "Group of 6"],
  allowExactDates: true,
  seedPrompts: [
    "Ski-in ski-out in Niseko",
    "Add the Sapporo Snow Festival",
    "Do it by train instead",
    "Beginner-friendly slopes",
  ],
};

export default hokkaidoPowderForm;
