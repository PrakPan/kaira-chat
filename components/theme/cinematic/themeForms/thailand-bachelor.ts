// components/theme/cinematic/themeForms/thailand-bachelor.ts
// Mini-form render data for /theme/thailand-bachelor. Mirrors
// theme_forms/thailand-bachelor.yaml. Here the "date window" is the ROUTE — a
// group picks its bases first and bends the dates around the villa.
//
// Window order and the MOST PICKED tag come from live booking data (Thailand
// trips with 6+ adults): Phuket-only 58 trips (avg 12 pax), Phuket ↔ Krabi 46,
// Bangkok ↔ Phuket 35.

import type { ThemeForm } from "./types";

const thailandBachelorForm: ThemeForm = {
  slug: "thailand-bachelor",
  display: "Thailand bachelor & bachelorette",
  tagline:
    "The last big one before the wedding. Tell me the headcount and I'll hold a villa, stagger the transfers, and keep the boats private.",
  voice:
    "Dry and unbothered. Talks villas over hotel rooms, Bangla Road, longtails, dry days, and moving ten people without a group-chat meltdown.",
  copy: {
    datesTitle: "Which send-off is yours?",
    datesSub: "Thailand runs year round. Pick the bases, I'll bend the dates.",
    paxTitle: "How many of you?",
    paxSub: "So I can size the villa and the boat, not eight hotel rooms.",
    footer: "That's the whole form. The page already told me it's the bachelor trip.",
    cta: "Draft the send-off →",
  },
  dateWindows: [
    {
      key: "phuket_krabi",
      label: "The Last Hurrah · 6N",
      range: ["2026-11-07", "2026-11-13"],
      nights: 6,
      blurb: "Phuket → Krabi, beach clubs then longtails",
      tag: "MOST PICKED",
      skeleton: "phuket_krabi",
      fareNote:
        "The most-booked two-base group route (46 trips, avg 8 pax). HKT in / KBV out, one ferry.",
    },
    {
      key: "bangkok_phuket",
      label: "City Meets Beach · 7N",
      range: ["2026-12-05", "2026-12-12"],
      nights: 7,
      blurb: "Bangkok → Phuket, rooftops then beach clubs",
      tag: "CITY + BEACH",
      skeleton: "bangkok_phuket",
      fareNote:
        "BKK in / HKT out. Easiest when the group lands in waves — Bangkok absorbs staggered arrivals.",
    },
    {
      key: "krabi_samui",
      label: "Private Paradise · 8N",
      range: ["2027-01-09", "2027-01-17"],
      nights: 8,
      blurb: "Krabi → Koh Samui, private villas both ends",
      tag: "VILLA HEAVY",
      skeleton: "krabi_koh_samui",
      fareNote:
        "KBV in / USM out. Samui seas stay calmer. Jan villas for 8+ book four months ahead.",
    },
    {
      key: "phuket_one_base",
      label: "The One-Base Weekender · 5N",
      range: ["2026-10-30", "2026-11-04"],
      nights: 5,
      blurb: "One villa in Phuket, boats out and back daily",
      tag: "NOBODY MOVES",
      skeleton: "phuket_one_base",
      fareNote:
        "The biggest single-base group pick (58 trips, avg 12 pax). Nobody changes hotels.",
    },
  ],
  // Panel hero on /chat — the YONA floating beach club off Patong.
  hero: {
    image:
      "https://images.thetarzanway.com/media/activities/176782413521073794364929199219.webp",
    title: "Thailand bachelor & bachelorette",
    subtext: "Villas, longtails, beach clubs — and a plan that survives ten people.",
    tag: "Thailand · year round",
  },
  paxPresets: ["Group of 6", "Group of 8", "Group of 10", "12 or more"],
  allowExactDates: true,
  seedPrompts: [
    "Make it one base, no moving",
    "Add a private boat day",
    "Check my dates against dry days",
    "Keep it under ₹1 lakh a head",
  ],
};

export default thailandBachelorForm;
