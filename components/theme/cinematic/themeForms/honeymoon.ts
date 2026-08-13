// components/theme/cinematic/themeForms/honeymoon.ts
// Mini-form render data for /theme/honeymoon. Mirrors theme_forms/honeymoon.yaml.
// Here the "date window" is the ROUTE — a honeymoon is picked by shape, not by a
// season. Window order and the MOST PICKED tag come from live booking data
// (couples travelling as 2 adults, international): Bali 1,927 trips, Maldives
// 425, Greece 354, Seychelles 101.

import type { ThemeForm } from "./types";

const honeymoonForm: ThemeForm = {
  slug: "honeymoon",
  display: "Honeymoon",
  tagline:
    "The first trip as us. Tell me the shape you want — overwater and nowhere to be, or two islands and two moods — and I'll build the rest.",
  voice:
    "Warm and unhurried. Talks overwater villas, floating breakfasts, caldera sunsets, slow mornings.",
  copy: {
    datesTitle: "Which honeymoon is yours?",
    datesSub: "Every one of these is year-round. Pick the shape, I'll fit the dates.",
    paxTitle: "Just the two of you?",
    paxSub: "So I can size the villa and the transfers.",
    footer: "That's the whole form. The page already told me it's a honeymoon.",
    cta: "Draft our honeymoon →",
  },
  dateWindows: [
    {
      key: "bali_slow",
      label: "Slow Bali · 7N",
      range: ["2026-10-10", "2026-10-17"],
      nights: 7,
      blurb: "Uluwatu → Seminyak → Ubud, cliffs then rice terraces",
      tag: "MOST PICKED",
      skeleton: "uluwatu_seminyak_ubud",
      fareNote:
        "The most-booked honeymoon we run (1,927 couple trips). One stop to DPS; single in/out airport.",
    },
    {
      key: "maldives_overwater",
      label: "Overwater & Endless Blue · 6N",
      range: ["2026-11-14", "2026-11-20"],
      nights: 6,
      blurb: "One atoll, one overwater villa, nowhere to be",
      tag: "MOST PRIVATE",
      skeleton: "maldives_one_island",
      fareNote:
        "Direct DEL/BOM→MLE, seaplane each way. Dec–Mar villas go six months out; visa-free.",
    },
    {
      key: "bali_santorini",
      label: "Two Islands, Two Moods · 7N",
      range: ["2026-09-12", "2026-09-19"],
      nights: 7,
      blurb: "Bali → Santorini, jungle quiet then caldera sunsets",
      tag: "TWO MOODS",
      skeleton: "bali_santorini",
      fareNote:
        "Needs an Indonesia e-Visa and a Schengen sticker. Sept is quiet in both.",
    },
    {
      key: "santorini_athens",
      label: "Ruins by Day, Wine by Night · 8N",
      range: ["2026-09-26", "2026-10-04"],
      nights: 8,
      blurb: "Santorini → Athens, sunsets then ancient streets",
      tag: "RUINS & WINE",
      skeleton: "santorini_athens",
      fareNote: "JTR in / ATH out. Schengen only — file 20+ days ahead.",
    },
  ],
  // Panel hero on /chat — the overwater villa shot from the honeymoon-2026 set.
  hero: {
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Maldives%20%E2%80%94%20The%20Overwater%20Villa%20Fantasy.jpg",
    title: "Honeymoon",
    subtext: "Overwater villas, caldera sunsets, and mornings with nothing in them.",
    tag: "Overseas · year round",
  },
  paxPresets: ["Just us 2", "Us 2 + a stopover", "Us 2, all-inclusive", "Us 2, two islands"],
  allowExactDates: true,
  seedPrompts: [
    "Make it more private",
    "Add a private candlelit dinner",
    "Keep it to one island",
    "What does this cost, honestly?",
  ],
};

export default honeymoonForm;
