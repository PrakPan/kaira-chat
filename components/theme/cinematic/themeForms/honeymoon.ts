// components/theme/cinematic/themeForms/honeymoon.ts
//
// Mini-form render data for /theme/honeymoon. Month-first (see season.ts). A
// honeymoon isn't tied to a season the way a ski trip is — the wedding sets the
// date — so every month is in season and the month notes carry what actually
// differs. What the month DOES decide is which shapes are on: the two Santorini
// routes only run May–Oct, because the caldera hotels and the ferries shut for
// the winter and offering them in January would be selling a closed island.
//
// Route order and the MOST PICKED tag come from live booking data (couples
// travelling as 2 adults, international): Bali 1,927 trips, Maldives 425,
// Greece 354, Seychelles 101.

import type { ThemeForm } from "./types";

const honeymoonForm: ThemeForm = {
  slug: "honeymoon",
  display: "Honeymoon",
  tagline:
    "The first trip as us. Tell me the shape you want — overwater and nowhere to be, or two islands and two moods — and I'll build the rest.",
  voice:
    "Warm and unhurried. Talks overwater villas, floating breakfasts, caldera sunsets, slow mornings.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "Pick the month the wedding leaves you — I'll show what's good then.",
    footer: "That's the whole form. The page already told me it's a honeymoon.",
    cta: "Draft our honeymoon →",
  },
  season: [
    {
      month: 1,
      label: "Dry and bright",
      tag: "MALDIVES BEST",
      line: "The Maldives at its clearest. Bali between the rains.",
    },
    {
      month: 2,
      label: "Peak Indian Ocean",
      tag: "CLEAREST",
      line: "Best Maldives weather of the year — and a Valentine's premium on villas.",
    },
    {
      month: 3,
      label: "Calm seas",
      tag: "EASY",
      line: "Dry, clear and still across the Indian Ocean.",
    },
    {
      month: 4,
      label: "End of the dry",
      tag: "GOOD VALUE",
      line: "Last of the Maldives dry season; Bali warming up and quiet.",
    },
    {
      month: 5,
      label: "Bali's month",
      tag: "MOST BOOKED",
      line: "Our busiest Bali month. Greece opens up and is still empty.",
    },
    {
      month: 6,
      label: "Long days",
      tag: "GREECE OPENS",
      line: "Bali dry season, Greek islands warm with the crowds not yet in.",
    },
    {
      month: 7,
      label: "High summer",
      tag: "PEAK",
      line: "Busy everywhere. Villas and flights need booking well ahead.",
    },
    {
      month: 8,
      label: "Driest Bali",
      tag: "BUSIEST",
      line: "Bali at its driest; Greece hot, bright and full.",
    },
    {
      month: 9,
      label: "The sweet spot",
      tag: "BEST VALUE",
      line: "Greece warm and emptying, Bali still dry, prices coming down.",
    },
    {
      month: 10,
      label: "Soft shoulder",
      tag: "QUIET",
      line: "Warmest sea in Greece, green Bali, and the last of the ferries.",
    },
    {
      month: 11,
      label: "Indian Ocean turns",
      tag: "MALDIVES OPENS",
      line: "The Maldives dries out as the Greek islands close for winter.",
    },
    {
      month: 12,
      label: "Peak season",
      tag: "PRICIEST",
      line: "Peak Maldives and peak Bali — the most-booked month, and the dearest.",
    },
  ],
  routes: [
    {
      key: "bali_slow",
      label: "Slow Bali",
      blurb: "Uluwatu → Seminyak → Ubud, cliffs then rice terraces",
      tag: "MOST PICKED",
      nights: 7,
      skeleton: "uluwatu_seminyak_ubud",
      fareNote:
        "The most-booked honeymoon we run (1,927 couple trips). One stop to DPS; single in/out airport.",
    },
    {
      key: "maldives_overwater",
      label: "Overwater & endless blue",
      blurb: "One atoll, one overwater villa, nowhere to be",
      tag: "MOST PRIVATE",
      nights: 6,
      skeleton: "maldives_one_island",
      fareNote:
        "Direct DEL/BOM→MLE, seaplane each way. Dec–Mar villas go six months out; visa-free.",
    },
    {
      key: "bali_santorini",
      label: "Two islands, two moods",
      blurb: "Bali → Santorini, jungle quiet then caldera sunsets",
      tag: "TWO MOODS",
      nights: 7,
      skeleton: "bali_santorini",
      // Santorini's hotels and ferries close over winter.
      months: [5, 6, 7, 8, 9, 10],
      fareNote:
        "Needs an Indonesia e-Visa and a Schengen sticker. Sept is quiet in both.",
    },
    {
      key: "santorini_athens",
      label: "Ruins by day, wine by night",
      blurb: "Santorini → Athens, sunsets then ancient streets",
      tag: "RUINS & WINE",
      nights: 8,
      skeleton: "santorini_athens",
      months: [5, 6, 7, 8, 9, 10],
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
  allowExactDates: true,
  seedPrompts: [
    "Make it more private",
    "Add a private candlelit dinner",
    "Keep it to one island",
    "What does this cost, honestly?",
  ],
};

export default honeymoonForm;
