// components/theme/cinematic/themeForms/thailand-bachelor.ts
//
// Mini-form render data for /theme/thailand-bachelor. Month-first (see
// season.ts). Thailand really does run year round — our own bookings put every
// month between 451 and 1,106 trips — so every month is in season and none of
// the routes are month-gated. What the month decides is which coast behaves:
// the Andaman side (Phuket, Krabi) is wet May–Oct while the Gulf (Samui) is wet
// Oct–Dec, and that's what the season notes carry, since a group booking a
// private boat day needs to know before they pick the week.
//
// Route order and the MOST PICKED tag come from live booking data (Thailand
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
    datesTitle: "When are you going?",
    datesSub: "Thailand runs year round — but the two coasts take turns being wet.",
    footer: "That's the whole form. The page already told me it's the bachelor trip.",
    cta: "Draft the send-off →",
  },
  season: [
    {
      month: 1,
      label: "Peak dry",
      tag: "BEST SEAS",
      line: "Flat water both coasts. Villas for 8+ book about four months out.",
    },
    {
      month: 2,
      label: "Still perfect",
      tag: "EASY",
      line: "Dry, calm and warm. The safest month for a private boat day.",
    },
    {
      month: 3,
      label: "Hot and dry",
      tag: "BUSY",
      line: "Andaman at its clearest, and getting hot by the afternoon.",
    },
    {
      month: 4,
      label: "Songkran",
      tag: "MOST BOOKED",
      line: "The water festival mid-month, and our second-busiest Thai month.",
    },
    {
      month: 5,
      label: "Rains begin",
      tag: "BEST VALUE",
      line: "Our busiest month anyway — short sharp showers, big villa discounts.",
    },
    {
      month: 6,
      label: "Green season",
      tag: "CHEAPEST",
      line: "Andaman wet but warm. Gulf side (Samui) is drier if it matters.",
    },
    {
      month: 7,
      label: "Wet Andaman",
      tag: "GULF BETTER",
      line: "Phuket and Krabi get squalls; Samui is having its best month.",
    },
    {
      month: 8,
      label: "Still wet west",
      tag: "GULF BETTER",
      line: "Same story — go Gulf side, or accept a cancelled boat day or two.",
    },
    {
      month: 9,
      label: "Wettest",
      tag: "QUIETEST",
      line: "The wettest month on the Andaman, and the emptiest and cheapest.",
    },
    {
      month: 10,
      label: "Turning",
      tag: "SHOULDER",
      line: "Andaman drying out as the Gulf turns wet. Seas settling week by week.",
    },
    {
      month: 11,
      label: "Dry season opens",
      tag: "SWEET SPOT",
      line: "Phuket and Krabi come good, and the peak prices haven't landed yet.",
    },
    {
      month: 12,
      label: "Peak",
      tag: "PRICIEST",
      line: "Perfect weather, New Year crowds, and the dearest villas of the year.",
    },
  ],
  routes: [
    {
      key: "phuket_one_base",
      label: "The one-base weekender",
      blurb: "One villa in Phuket, boats out and back daily",
      tag: "NOBODY MOVES",
      nights: 5,
      skeleton: "phuket_one_base",
      fareNote:
        "The biggest single-base group pick (58 trips, avg 12 pax). Nobody changes hotels.",
    },
    {
      key: "phuket_krabi",
      label: "The last hurrah",
      blurb: "Phuket → Krabi, beach clubs then longtails",
      tag: "MOST PICKED",
      nights: 6,
      skeleton: "phuket_krabi",
      fareNote:
        "The most-booked two-base group route (46 trips, avg 8 pax). HKT in / KBV out, one ferry.",
    },
    {
      key: "bangkok_phuket",
      label: "City meets beach",
      blurb: "Bangkok → Phuket, rooftops then beach clubs",
      tag: "CITY + BEACH",
      nights: 7,
      skeleton: "bangkok_phuket",
      fareNote:
        "BKK in / HKT out. Easiest when the group lands in waves — Bangkok absorbs staggered arrivals.",
    },
    {
      key: "krabi_samui",
      label: "Private paradise",
      blurb: "Krabi → Koh Samui, private villas both ends",
      tag: "VILLA HEAVY",
      nights: 8,
      skeleton: "krabi_koh_samui",
      fareNote:
        "KBV in / USM out. Samui seas stay calmer. Jan villas for 8+ book four months ahead.",
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
  allowExactDates: true,
  seedPrompts: [
    "Make it one base, no moving",
    "Add a private boat day",
    "Check my dates against dry days",
    "Keep it under ₹1 lakh a head",
  ],
};

export default thailandBachelorForm;
