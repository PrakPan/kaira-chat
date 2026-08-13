// pages/theme/honeymoon.tsx
//
// Honeymoon — an editorial, cinematic theme landing (the "Honeymoon Theme"
// mockup) built from the reusable CinematicThemeLanding component. Every card
// either seeds its prompt into a fresh /chat session with Kaira or opens the
// read-only catalog drawer for the element behind it. The page is wrapped in
// the shared site Layout so it keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import ActivityDetailsDrawer from "../../components/drawers/activityDetails/ActivityDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const VISA = "https://visa.thetarzanway.com/country";
const CHAT = "https://thetarzanway.com/chat";
const THEME_SLUG = "honeymoon";

// Catalog activity ids for the "Things to do around the world" cards (from the
// Mercury BE links) — each opens the read-only activity details drawer.
const ACTIVITY = {
  santoriniVolcano: "1d5aa440-d922-4045-8893-d10d12658ca1",
  santoriniScuba: "586c5cd1-eead-454c-bdcf-78bf1e20aa72",
  baliWaterfalls: "86b16fc4-4534-4c57-9cb5-5cb2107f5b07",
  baliCooking: "903b1346-ad4d-4d13-872c-a3d0217d0a59",
  nusaPenida: "869561b9-4df3-4b11-b335-1286abd4e178",
  exploreMale: "7556e2cd-70e4-454f-a76b-410bdf4fa54a",
};

// The private candlelit dinner isn't one product — it's one per destination.
// Each row opens its own activity drawer so the reader picks the actual table.
const DINNER = {
  ubud: "945e3b83-b090-446c-8f4c-ae25a7c74666",
  seminyak: "f0221532-1dc5-46bf-bbe3-278a9094e630",
  nusaPenida: "2ee0ab5c-b5bc-407e-97da-dc90873bb63b",
  santorini: "d7c5cab0-fc99-4018-a116-b292844b3bc6",
};

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const MEDIA = "https://images.thetarzanway.com";
// The curated honeymoon set already on the CDN (shared with /theme/honeymoon-2026).
// Filenames carry spaces and em-dashes, so they ship pre-encoded — note the "é"
// in the Bali file is stored decomposed (e + U+0301), hence the %65%CC%81 form.
const HM = `${CDN}/media/website/honeymoon-theme-2026`;
const IMG = {
  maldives: `${HM}/Maldives%20%E2%80%94%20The%20Overwater%20Villa%20Fantasy.jpg`,
  bali: `${HM}/Bali%20%E2%80%94%20Beyond%20the%20Honeymoon%20Cliche%CC%81s.jpg`,
  santorini: `${HM}/Santorini,%20Greece%20%E2%80%94%20Caldera,%20Caves%20%26%20Champagne.jpg`,
  greece: `${HM}/Greece%20%E2%80%94%20Santorini%20and%20Mykonos.jpg`,
  amalfi: `${HM}/Amalfi%20Coast,%20Italy%20%E2%80%94%20Clifftop%20Villages%20and%20Sea%20Drives.jpg`,
  rajasthan: `${HM}/Private%20Desert%20Dinner%20Under%20the%20Stars%20%E2%80%94%20Rajasthan.png`,
};
// Catalog imagery for the elements that open a drawer — the actual product
// photo from Mercury, so the card and the drawer show the same thing.
const CAT = {
  santoriniVolcano: `${MEDIA}/media/activities/174643740258093547821044921875.jpg`,
  santoriniScuba: `${MEDIA}/media/activities/169089234938154792785644531250.jpg`,
  baliWaterfalls: `${MEDIA}/media/activities/176199171326125335693359375000.jpg`,
  baliCooking: `${MEDIA}/media/activities/169089627862838149070739746094.jpg`,
  nusaPenida: `${MEDIA}/media/activities/169089299718673110008239746094.jpg`,
  exploreMale: `${MEDIA}/media/activities/178172587427999567985534667969.jpg`,
  dinnerUbud: `${MEDIA}/media/activities/169089652472093176841735839844.jpg`,
  dinnerSeminyak: `${MEDIA}/media/activities/175559916532956957817077636719.jpeg`,
  dinnerNusaPenida: `${MEDIA}/media/activities/175282307596770119667053222656.jpeg`,
  dinnerSantorini: `${MEDIA}/media/activities/174712170803791809082031250000.png`,
  seychelles: `${MEDIA}/media/activities/171316515219507312774658203125.jpg`,
  seychellesBeach: `${MEDIA}/media/activities/171316515510504651069641113281.jpg`,
  thailandIslands: `${MEDIA}/media/activities/175672376581723809242248535156.jpeg`,
};

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  hero:
    "We are 2 travellers (a couple) planning our honeymoon, and our travel dates are flexible. Help us pick the right destination, then build the itinerary around privacy, beautiful stays, sunsets and slow mornings. Balance a few unforgettable experiences with real downtime, and keep hotel changes to a minimum.",
  // Chips
  maldivesVilla:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a romantic Maldives honeymoon centered around an overwater villa. Prioritize privacy, crystal-clear lagoons, floating breakfasts, snorkeling, sunset cruises, candlelight dinners, spa experiences, and slow mornings with plenty of time to simply relax together.",
  baliSantoriniChip:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a honeymoon combining Bali and Santorini. Include private pool villas, wellness experiences, waterfalls, rice terraces, cafés, and beach clubs in Bali before continuing to Santorini for caldera sunsets, boutique cave hotels, wine tastings, scenic walks, and romantic dinners. Balance adventure with relaxation.",
  quietPrivate:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a peaceful honeymoon focused on privacy and uninterrupted time together. Prioritize secluded luxury stays, beautiful beaches, private pools, spa treatments, scenic viewpoints, sunset experiences, intimate dining, and slow travel. Keep the itinerary relaxed with minimal hotel changes and plenty of free time.",
  allInclusive:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want an all-inclusive honeymoon where everything is taken care of. Prioritize luxury resorts with meals included, premium experiences, spa access, water activities, romantic dinners, sunset cruises, and seamless transfers. The itinerary should be effortless, relaxing, and focused on enjoying our time together without worrying about logistics.",
  // Routes — "Pick your honeymoon"
  overwater:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a 6-night honeymoon in the Maldives centered around a luxury overwater villa. Prioritize privacy, turquoise lagoons, snorkeling, sunset cruises, candlelight dinners, spa experiences, floating breakfasts, and slow mornings with plenty of downtime. Create a romantic itinerary focused on relaxation, luxury, and unforgettable moments rather than sightseeing.",
  twoIslands:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a 7-night honeymoon combining Bali and Santorini. Begin with Bali's tropical jungles, wellness experiences, waterfalls, private pool villas, and peaceful cafés before continuing to Santorini for whitewashed villages, caldera sunsets, wine tastings, romantic dinners, and boutique cave hotels. Balance relaxation, romance, and iconic experiences at a comfortable pace.",
  ruinsAndWine:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want an 8-night romantic honeymoon through Santorini and Athens. Prioritize breathtaking sunsets, boutique cave hotels, scenic coastal walks, wine tastings, private sailing experiences, charming cafés, and romantic dinners in Santorini before exploring Athens' ancient landmarks, hidden neighborhoods, rooftop restaurants, and authentic Greek culture. Keep the itinerary relaxed with plenty of time to enjoy each destination together.",
  // Which island is yours
  islandMaldives:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a romantic Maldives honeymoon focused on privacy and luxury. Prioritize an overwater villa, crystal-clear lagoons, floating breakfasts, snorkeling, sunset cruises, candlelight dinners, spa experiences, and uninterrupted time together. Build a slow-paced itinerary with minimal movement and maximum relaxation.",
  islandBali:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a romantic Bali honeymoon combining Uluwatu, Seminyak, and Ubud. Prioritize private pool villas, waterfalls, temples, beach clubs, scenic cafés, spa treatments, rice terraces, sunset dinners, and meaningful local experiences. Balance relaxation with exploration while keeping the pace comfortable.",
  islandSantorini:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a Santorini honeymoon built around romance and breathtaking sunsets. Include a caldera-view cave hotel, Oia and Fira, private sailing, wine tastings, seaside dinners, charming cafés, scenic coastal walks, and hidden viewpoints. Prioritize slow travel, beautiful stays, and unforgettable moments together.",
  islandSeychelles:
    "We are 2 travellers (a couple), and our travel dates are flexible. We want a peaceful Seychelles honeymoon with secluded beaches and luxury island experiences. Prioritize boutique beachfront resorts, granite boulder beaches, island hopping, snorkeling, sunset cruises, nature trails, Creole cuisine, and private beach picnics. Keep the itinerary relaxed with plenty of free time to enjoy the islands at an unhurried pace.",
  // Trips
  tripMaldives:
    "We are 2 travellers (a couple). Build the Maldives overwater escape — 6 nights, one resort, one overwater villa, seaplane transfers both ways, with flights from Delhi included. Add a floating breakfast, a sunset cruise and one private dinner.",
  tripBali:
    "We are 2 travellers (a couple). Build the slow Bali honeymoon — 7 nights across Uluwatu, Seminyak and Ubud with private pool villas, a spa day, waterfalls and rice terraces, and flights from Delhi included. Keep the mornings free.",
  tripGreece:
    "We are 2 travellers (a couple). Build the Santorini and Athens honeymoon — 8 nights, a caldera-view cave hotel, private sailing, wine tastings, and the Athens ruins and rooftops, with flights from Delhi included.",
  // Evenings
  privateDinner:
    "We are 2 travellers on our honeymoon. Set up a private candlelit dinner for us — beach or cliffside — and tell me which destination does it best, what it costs, and how far ahead it has to be booked.",
  // Ask Kaira
  askBar:
    "Which honeymoon should we do — the Maldives overwater villa, Bali and Santorini together, or Santorini and Athens? Compare privacy, cost, flying time and the best months for each, then build the ideal itinerary for the one you recommend.",
};

const honeymoonConfig: CinematicThemeConfig = {
  // Warm rose — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES.honeymoon,
  header: {
    title: "Honeymoon",
    subtitle: "Theme · overseas · year round",
  },
  hero: {
    eyebrow: "PRIVACY · OVERWATER VILLAS · SUNSETS · SLOW MORNINGS",
    heading: { lead: "The first trip", accent: "as us." },
    lede:
      "Somewhere between the wedding and real life there is one trip where nothing is scheduled. Tell me the shape you want and I'll build the rest — the villa, the transfers, the one dinner you'll still talk about.",
    placeholder: "Try: Maldives overwater villa, six nights, no itinerary",
    prompt: PROMPTS.hero,
    chips: [
      { label: "Maldives villa", prompt: PROMPTS.maldivesVilla },
      { label: "Bali + Santorini", prompt: PROMPTS.baliSantoriniChip },
      { label: "Quiet & private", prompt: PROMPTS.quietPrivate },
      { label: "All-inclusive", prompt: PROMPTS.allInclusive },
    ],
    // Desktop-only Kaira polaroid collage — each polaroid opens its destination.
    images: [
      { image: IMG.maldives, caption: "Maldives, overwater", href: "/asia/maldives" },
      { image: IMG.bali, caption: "Bali, Uluwatu", href: "/asia/indonesia" },
      { image: IMG.santorini, caption: "Santorini, the caldera", href: "/europe/greece" },
      { image: CAT.seychelles, caption: "Seychelles, granite beaches", href: "/africa/seychelles" },
    ],
  },
  sections: [
    // ── Routes ──
    {
      type: "cards",
      ctaLabel: "Create this plan →",
      heading: {
        eyebrow: "Multi-city · swipe",
        lead: "Pick your",
        accent: "honeymoon",
      },
      cards: [
        {
          image: IMG.maldives,
          name: "Overwater & Endless Blue",
          line: "Maldives · one atoll, one island",
          tag: "6 nights",
          prompt: PROMPTS.overwater,
        },
        {
          image: IMG.bali,
          name: "Two Islands, Two Moods",
          line: "Bali → Santorini",
          tag: "7 nights",
          prompt: PROMPTS.twoIslands,
        },
        {
          image: IMG.greece,
          name: "Ruins by Day, Wine by Night",
          line: "Santorini → Athens",
          tag: "8 nights",
          prompt: PROMPTS.ruinsAndWine,
        },
      ],
    },
    // ── Experiences (card click opens the drawer; "+ Add" saves to the trip) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Things to do", accent: "around the world" },
      cards: [
        {
          image: CAT.santoriniVolcano,
          name: "Volcano, hot springs and Oia sunset boat trip",
          line: "One boat, one day — the caldera, a hot-spring swim, and the sunset everyone comes for.",
          tag: "Santorini",
          activityId: ACTIVITY.santoriniVolcano,
        },
        {
          image: CAT.santoriniScuba,
          name: "Scuba diving in the volcanic caldera",
          line: "A dive inside an active volcano's crater — one of the few places on earth you can.",
          tag: "Santorini",
          activityId: ACTIVITY.santoriniScuba,
        },
        {
          image: CAT.baliWaterfalls,
          name: "Waterfalls, water temple and rice terraces",
          line: "A private day through Ubud's postcard sights, paced so it never feels like a checklist.",
          tag: "Bali",
          activityId: ACTIVITY.baliWaterfalls,
        },
        {
          image: CAT.baliCooking,
          name: "Balinese cooking class and market tour",
          line: "A market walk, then a hands-on class — the one thing you can actually take home.",
          tag: "Bali",
          activityId: ACTIVITY.baliCooking,
        },
        {
          image: CAT.nusaPenida,
          name: "Nusa Penida full-day island tour",
          line: "Cliffs, hidden beaches and the view every Bali feed is built from — transfers done for you.",
          tag: "Bali",
          activityId: ACTIVITY.nusaPenida,
        },
        {
          image: CAT.exploreMale,
          name: "Explore Male, the capital",
          line: "A slow walk through the smallest, densest capital in the world — an easy half-day off the resort.",
          tag: "Maldives",
          activityId: ACTIVITY.exploreMale,
        },
      ],
    },
    // ── Two kinds of evening (dark) ──
    {
      type: "feature",
      heading: { lead: "Two kinds of", accent: "evening" },
      intro:
        "Every honeymoon needs both — the night nobody else is there, and the night you want people around. Get the ratio right and the trip has a rhythm instead of a schedule.",
      rows: [
        {
          stat: "PRIVATE",
          name: "Beach or cliffside dinner",
          line: "Just the two of you, a table, and staff who disappear once the food arrives.",
        },
        {
          stat: "SOCIAL",
          name: "Beach clubs at sunset",
          line: "Potato Head or Atlas in Bali, a wine bar in Fira — people around without losing the mood.",
        },
      ],
      stats: [
        { stat: "30min", label: "TO SET UP A PRIVATE DINNER" },
        { stat: "100%", label: "PRIVACY ON OVERWATER VILLAS" },
        { stat: "2", label: "ISLANDS RECOMMENDED FOR 7N+" },
      ],
      cta: {
        title: "Private candlelit dinner",
        meta: "Beach or cliffside · just the two of you",
        prompt: PROMPTS.privateDinner,
      },
    },
    // ── The actual candlelit dinners (each opens its own activity drawer) ──
    {
      type: "list",
      selectable: true,
      itemKind: "activity",
      heading: {
        lead: "A private table,",
        accent: "wherever you land",
        note: "Tap one for the menu, the setting and what it costs",
      },
      rows: [
        {
          image: CAT.dinnerUbud,
          emoji: "🕯️",
          gradient: "linear-gradient(150deg, #a8556b, #f8ebef 190%)",
          name: "Ubud: 6-course candlelight dinner in the valley",
          badge: "Kaira's pick",
          line: "Six courses above the Ubud valley, under the stars. 3 hours.",
          activityId: DINNER.ubud,
        },
        {
          image: CAT.dinnerSeminyak,
          emoji: "🌊",
          gradient: "linear-gradient(150deg, #16324f, #a8556b 170%)",
          name: "Seminyak: island romantic candlelight dinner",
          line: "Ocean views, live violin, and a table set on the sand.",
          activityId: DINNER.seminyak,
        },
        {
          image: CAT.dinnerNusaPenida,
          emoji: "🪨",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          name: "Nusa Penida: candlelight dinner under the stars",
          line: "Three courses on the quietest of the three islands.",
          activityId: DINNER.nusaPenida,
        },
        {
          image: CAT.dinnerSantorini,
          emoji: "🍷",
          gradient: "linear-gradient(150deg, #2f6f9e, #f0e9d6 190%)",
          name: "Santorini: private candlelight dinner",
          line: "An intimate table with the caldera going gold behind it.",
          activityId: DINNER.santorini,
        },
      ],
    },
    // ── Which island is yours ──
    // Deliberately NOT `selectable`: these aren't bookable elements, they're
    // whole-trip requests. A selectable row with no activityId/href toggles the
    // saved list on click and never fires its prompt (see ListRow), which would
    // strand the four island prompts. Tapping one seeds the trip instead.
    {
      type: "list",
      heading: {
        lead: "Which island",
        accent: "is yours",
        note: "Tap one and I'll build the whole trip around it",
      },
      rows: [
        {
          image: IMG.maldives,
          emoji: "🐚",
          gradient: "linear-gradient(150deg, #16324f, #2f6f9e 150%)",
          name: "Maldives",
          badge: "Most private",
          line: "One resort, one overwater villa, and nowhere to be. Visa-free for Indian passports.",
          prompt: PROMPTS.islandMaldives,
        },
        {
          image: IMG.bali,
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          name: "Bali",
          badge: "Most picked",
          line: "Cliffside Uluwatu for the view, Seminyak for the beach, Ubud for the quiet.",
          prompt: PROMPTS.islandBali,
        },
        {
          image: IMG.santorini,
          emoji: "🌅",
          gradient: "linear-gradient(150deg, #2f6f9e, #f0e9d6 190%)",
          name: "Santorini",
          line: "Caldera-view suites carved into the cliff, sunset in Oia every single night.",
          prompt: PROMPTS.islandSantorini,
        },
        {
          image: CAT.seychellesBeach,
          emoji: "🪨",
          gradient: "linear-gradient(150deg, #1a2436, #17724a 170%)",
          name: "Seychelles",
          line: "Granite boulders, empty beaches, and a fraction of the Maldives crowd in peak season.",
          prompt: PROMPTS.islandSeychelles,
        },
      ],
    },
    // ── Trips ──
    {
      type: "trips",
      ctaLabel: "Book this itinerary →",
      heading: {
        lead: "Which honeymoon is",
        accent: "yours?",
        note: "Priced from Delhi · flights and transfers included",
      },
      cards: [
        {
          image: IMG.maldives,
          tag: "Couple · 6N",
          name: "Maldives overwater escape",
          line: "One resort, one overwater villa, seaplane transfer both ways. Nothing else to plan.",
          price: "₹2,45,000 / person",
          nights: "6 nights · Maldives",
          urgent: "Dec – Feb villas book out six months ahead",
          prompt: PROMPTS.tripMaldives,
        },
        {
          image: IMG.bali,
          tag: "Couple · 7N",
          name: "Slow Bali honeymoon",
          line: "Four nights of cliffside quiet in Uluwatu, then Ubud, markets and slow mornings.",
          price: "₹1,88,525 / person",
          nights: "7 nights · Bali",
          prompt: PROMPTS.tripBali,
        },
        {
          image: IMG.greece,
          tag: "Couple · 8N",
          name: "Santorini and Athens",
          line: "Five nights of caldera views, then ruins and rooftop dinners in Athens.",
          price: "₹2,02,000 / person",
          nights: "8 nights · Greece",
          prompt: PROMPTS.tripGreece,
        },
      ],
    },
    // ── When to go ──
    {
      type: "months",
      heading: {
        eyebrow: "Three destinations, one calendar",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Nov – Mar",
          name: "Peak everywhere",
          line: "Dry in the Maldives, mild in Bali, cool in Santorini. Also the priciest — book villas six months out.",
        },
        {
          range: "Apr – Jun",
          name: "Shoulder season",
          line: "Warm and mostly dry across all three. Fewer couples, softer rates, still reliable weather.",
        },
        {
          range: "Jul – Aug",
          name: "European peak",
          line: "Santorini is packed and pricey. The Maldives and Bali stay calm — worth splitting the trip around this.",
        },
        {
          range: "Sep – Oct",
          name: "Quiet transition",
          line: "Crowds thin everywhere, prices ease, and the weather is still on your side in all three.",
        },
      ],
      note:
        "If manta rays matter to you, the Maldives season runs May to November on the western atolls — that date has to bend around the fish, not the other way round.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: { lead: "Your visas,", accent: "handled" },
      intro:
        "The Maldives waives the visa entirely for Indian passports — 30 days on arrival, no paperwork. Bali and Greece are where the actual filing happens, and we do both for you before you fly.",
      cards: [
        {
          country: "Maldives",
          cities: "Male · any atoll",
          fee: "₹0 · free on arrival",
          href: "https://visa.thetarzanway.com",
        },
        {
          country: "Indonesia (Bali)",
          cities: "Uluwatu · Seminyak · Ubud",
          fee: "₹2,900",
          href: `${VISA}/indonesia-visa-online`,
        },
        {
          country: "Greece",
          cities: "Santorini · Athens",
          fee: "₹5,250",
          href: `${VISA}/greece-visa-online`,
        },
      ],
      facts: [
        { label: "Fastest", value: "Maldives · 0d" },
        { label: "Slowest", value: "Greece · 15d" },
        { label: "We handle", value: "Docs + submission" },
      ],
      note:
        "Greece is a Schengen sticker — file it at least twenty days out. The Bali e-Visa lands in a few days. Nothing here needs an embassy queue on your side.",
    },
    // ── Read this first ──
    // {
    //   type: "list",
    //   compact: true,
    //   heading: {
    //     eyebrow: "The four things couples get wrong",
    //     lead: "Read this",
    //     accent: "first",
    //   },
    //   rows: [
    //     {
    //       emoji: "💗",
    //       gradient: "linear-gradient(150deg, #a8556b, #f8ebef 190%)",
    //       name: 'Say "honeymoon" when you book',
    //       line: "The upgrade, the fruit basket, the private dinner — only if it's flagged in advance. We confirm it in writing.",
    //     },
    //     {
    //       emoji: "🗓️",
    //       gradient: "linear-gradient(150deg, #16324f, #2f6f9e 160%)",
    //       name: "The good overwater villas go first",
    //       line: "December to March is booked out six months ahead for the villas actually worth photographing.",
    //     },
    //     {
    //       emoji: "🐟",
    //       gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
    //       name: "Time it to the manta rays if you care",
    //       line: "Maldives manta season is May to November on the western atolls. Everything else is easier to move.",
    //     },
    //     {
    //       emoji: "🏝️",
    //       gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
    //       name: "Two islands beat one past a week",
    //       line: "Seven-plus nights on one resort gets quiet fast. One island to unwind, one to explore.",
    //     },
    //   ],
    // },
    // ── Stories — each opens the traveller's actual itinerary ──
    {
      type: "stories",
      heading: { eyebrow: "Loved on Google", lead: "Couples who", accent: "went" },
      cards: [
        {
          rating: "4.9",
          type: "Google review",
          name: "Sam",
          when: "3 nights · Maldives",
          quote:
            "A weekend was enough. One resort, no itinerary to manage, and the review speaks for itself.",
          route: "See their itinerary →",
          href: `${CHAT}/3-nights-weekend-romantic-getaway-to-maldives-70de4ba72ec8`,
        },
        {
          rating: "4.9",
          type: "Google review",
          name: "Atal",
          when: "1 week · Bali",
          quote:
            "Cliffs, sunsets, and a plan that left room to change our minds most days.",
          route: "See their itinerary →",
          href: `${CHAT}/1-week-romantic-getaway-to-bali-23eedb88d7e6`,
        },
        {
          rating: "4.4",
          type: "Google review",
          name: "Arun",
          when: "5 nights · Greece",
          quote:
            "Santorini looked exactly like the version we'd saved on Pinterest for two years. Better, actually.",
          route: "See their itinerary →",
          href: `${CHAT}/5-nights-romantic-getaway-to-greece-fe17b0eac6ce`,
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations in this theme",
        lead: "Where I",
        accent: "send couples",
      },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Maldives",
          meta: "Visa-free · overwater villas",
          emoji: "🐚",
          gradient: "linear-gradient(150deg, #16324f, #2f6f9e 150%)",
          image: IMG.maldives,
          href: "/asia/maldives",
        },
        {
          name: "Bali",
          meta: "Most picked · cliffs + beaches",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          image: IMG.bali,
          href: "/asia/indonesia",
        },
        {
          name: "Greece",
          meta: "Best sunsets · caldera suites",
          emoji: "🌅",
          gradient: "linear-gradient(150deg, #2f6f9e, #f0e9d6 190%)",
          image: IMG.santorini,
          href: "/europe/greece",
        },
        {
          name: "Seychelles",
          meta: "Quietest · granite beaches",
          emoji: "🪨",
          gradient: "linear-gradient(150deg, #1a2436, #17724a 170%)",
          image: CAT.seychelles,
          href: "/africa/seychelles",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Not quite this?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Perfect proposals",
          meta: "Before the honeymoon",
          emoji: "💍",
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          image: IMG.rajasthan,
          href: "/theme/perfect-proposal",
        },
        {
          name: "Thailand bachelor",
          meta: "Groups of 6+",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 190%)",
          image: CAT.thailandIslands,
          href: "/theme/thailand-bachelor",
        },
        {
          name: "Greece islands",
          meta: "Done right",
          emoji: "🏛️",
          gradient: "linear-gradient(150deg, #2f6f9e, #e6f0f7 190%)",
          image: IMG.greece,
          href: "/theme/greece-islands-done-right",
        },
        {
          name: "France & Italy",
          meta: "One trip, two countries",
          emoji: "🍷",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: IMG.amalfi,
          href: "/theme/france-italy",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about the honeymoon…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
    buildCta: "Build trip",
  },
};

// A sensible default start date for the read-only activity drawer — ~60 days
// out, in DD/MM/YYYY (the format the detail endpoint expects). The drawer only
// shows details/indicative pricing here; the visitor picks real dates in chat.
const defaultActivityDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const HoneymoonThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  const handleSelectPrompt = (prompt: string) =>
    seedChat(prompt, { items: selection.items, slug: THEME_SLUG });
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);
  // Read-only activity details drawer (opened from the experience / dinner cards).
  const [activityDrawer, setActivityDrawer] = useState<{
    show: boolean;
    activityId?: string;
    source?: string;
    date?: string;
  }>({ show: false });

  const openActivity = (activityId: string, source?: string) =>
    setActivityDrawer({
      show: true,
      activityId,
      source,
      date: defaultActivityDate(),
    });
  const closeActivity = () =>
    setActivityDrawer((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="honeymoon">
      <Head>
        <title>
          Honeymoon Trip Planner & Itineraries | Maldives, Bali, Santorini | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan your honeymoon with The Tarzan Way's AI itinerary — Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples."
        />
        <meta
          property="og:title"
          content="Honeymoon Trip Planner & Itineraries | Maldives, Bali, Santorini | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan your honeymoon with The Tarzan Way's AI itinerary — Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples."
        />
        <link rel="canonical" href="https://thetarzanway.com/theme/honeymoon" />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/honeymoon"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://thetarzanway.com/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "TouristTrip",
                  name: "Honeymoon — Trip Planner & Itineraries",
                  description:
                    "Plan your honeymoon with The Tarzan Way's AI itinerary — Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples.",
                  url: "https://thetarzanway.com/theme/honeymoon",
                  image: "https://thetarzanway.com/og-image.png",
                  provider: {
                    "@type": "TravelAgency",
                    name: "The Tarzan Way",
                    url: "https://thetarzanway.com",
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://thetarzanway.com",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Honeymoon",
                      item: "https://thetarzanway.com/theme/honeymoon",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={honeymoonConfig}
        onSelectPrompt={handleSelectPrompt}
        onSelectActivity={openActivity}
        selection={selection}
        onBuild={handleBuild}
      />
      {/* Read-only activity details — no Add/Remove CTA on this marketing page */}
      <ActivityDetailsDrawer
        show={activityDrawer.show}
        activityId={activityDrawer.activityId}
        source={activityDrawer.source}
        date={activityDrawer.date}
        hideCta
        handleCloseDrawer={closeActivity}
        setShowDrawer={closeActivity}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(HoneymoonThemePage);
