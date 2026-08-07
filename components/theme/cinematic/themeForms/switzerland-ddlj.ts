// components/theme/cinematic/themeForms/switzerland-ddlj.ts
// Mini-form render data for /theme/filmy-getaways. Mirrors
// theme_forms/switzerland-ddlj.yaml.

import type { ThemeForm } from "./types";

const switzerlandDdljForm: ThemeForm = {
  slug: "switzerland-ddlj",
  display: "Switzerland · Cinematic Romance",
  tagline: "A DDLJ-style Swiss escape — slow trains, misty valleys, café mornings.",
  voice: "Cinematic and unhurried. Frames the trip like film scenes.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "Switzerland is three different films across the year.",
    paxTitle: "And how many of you?",
    paxSub: "So I can pace the trip and size the stays.",
    footer:
      "That's the whole form. The page already told me where, the vibe, and your must-haves.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "late_spring",
      label: "20–27 May",
      range: ["2027-05-20", "2027-05-27"],
      nights: 7,
      blurb: "Green valleys · waterfalls, fewer crowds",
      tag: "CHEAPEST",
      skeleton: "classic_loop",
      fareNote: "Shoulder; cheapest DEL/BOM→ZRH fares.",
    },
    {
      key: "summer",
      label: "10–17 Jul",
      range: ["2027-07-10", "2027-07-17"],
      nights: 7,
      blurb: "Peak alpine meadows · the DDLJ green",
      tag: "MOST ICONIC",
      skeleton: "classic_loop",
      fareNote: "Peak; book onward early, fares + hotels high.",
    },
    {
      key: "autumn",
      label: "5–12 Oct",
      range: ["2027-10-05", "2027-10-12"],
      nights: 7,
      blurb: "Golden larches · crisp, cinematic light",
      tag: "BEST LIGHT",
      skeleton: "classic_loop",
      fareNote: "Autumn shoulder; good fares.",
    },
  ],
  hero: {
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/filmy-getaways-2026/DDLJ.png",
    title: "Switzerland, cinematic",
    subtext: "Slow trains, misty valleys, and café mornings — the DDLJ way.",
    tag: "Switzerland",
  },
  paxPresets: ["Just us 2", "Family of 4", "Friends of 4", "Group of 6"],
  allowExactDates: true,
  seedPrompts: [
    "Include the scenic GoldenPass train",
    "Add a night in Zermatt",
    "Swap Montreux for Interlaken",
    "Make the mornings slow",
  ],
};

export default switzerlandDdljForm;
