// pages/theme/thailand-bali-offbeat.tsx
//
// Offbeat Thailand + Bali — an editorial, cinematic theme landing (the "Thailand
// Bali Offbeat" mockup) built from the reusable CinematicThemeLanding component.
// Every card either seeds its prompt into a fresh /chat session with Kaira or
// saves the catalog element behind it into the trip. The page is wrapped in the
// shared site Layout so it keeps the standard header + footer.
//
// The premise of the page is a swap: same two countries everyone books, the
// quiet half of each. Krabi's backroads instead of Patong, east Bali and the
// Nusas instead of Kuta and Seminyak. Which means the one fact the page has to
// get right is the monsoon split — Thailand's Andaman coast is rough May–Oct
// while Bali is having its best months, so the season section and the theme
// form both sort by coast rather than by country.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import {
  promptIntakeMap,
  type ThemePromptIntent,
} from "../../components/theme/cinematic/themeIntake";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const VISA = "https://visa.thetarzanway.com/country";
const SITE = "https://thetarzanway.com";
const PAGE = "/theme/thailand-bali-offbeat";
const THEME_SLUG = "thailand-bali-offbeat";

// Catalog activity ids for the "Worth getting off the map for" cards (from the
// Mercury BE links).
const ACTIVITY = {
  hongLagoon: "f4b2435d-f5a7-40ac-82f4-2efa5914da93",
  mangroveKayak: "28ceb76b-8914-445c-bfa6-c3806ed40828",
  cookingClass: "24523bc3-c738-446c-b681-c24ccce8b1dd",
  khaoHonNak: "f4568078-06e1-4962-b1ca-b5081a80038f",
  tukTukNight: "30e91f12-976e-4e8a-9edf-e17989480d6c",
  taladNoi: "1e14f943-eb18-4790-889f-3ac16e7d2aff",
  ubudWaterfalls: "9ff61c8a-c81a-4949-a2b8-9e218d84d9a5",
  eastBaliPalaces: "04a14fe7-f3b3-4029-9135-82850d6c0731",
};

// "The route less travelled" — the tour or boat that actually gets you to each
// island, so adding the island adds the way there rather than a place name.
const ISLAND = {
  giliTrawangan: "436373f0-0285-4ea8-9d82-533c040632d1",
  lembongan: "aa60e0e9-9cfd-4e15-a905-e5425d16325a",
  penida: "869561b9-4df3-4b11-b335-1286abd4e178",
  kohYaoNoi: "7e7f8969-eab6-4632-ae38-7242e6a90f8b",
};

// "Bali, away from the traffic" — a mix of POIs (the places themselves) and
// activities (the day that reaches them), so each card carries an explicit
// `item` naming which kind it is rather than inheriting the section default.
const POI = {
  tirtaGangga: "a53a9b55-6f6e-4e56-b643-3b1def185cbf",
  kelingking: "f831fad4-9a7d-4b2d-ae4c-507fae15a13c",
};
const BALI_ACTIVITY = {
  ubudWaterfallTour: "966ac0a4-22fd-482a-bc6f-4cfee3de45d6",
  uluwatuSunset: "c3cfb1a5-c2fc-404f-b787-7091a9d1da67",
  giliSunrise: "fd97f8ed-52d7-4e1e-b0bd-9b3440772852",
};

// Restaurant ids for "Restaurants and cafés" — ?restaurant_id=.
const RESTAURANT = {
  karaweik: "3ab39fa5-096c-40c9-89eb-de381d1eabcd",
  anandinii: "38c88567-f905-4d59-87cb-2140cbea9638",
  citrusVine: "dd52df54-db91-4c8e-9534-dfc25903bfa4",
  greenMelon: "f4a27460-2f1d-4c72-8ae6-d4521a95046c",
  nokkamin: "f6c7dde3-0c15-47ef-a7b5-3ca994232b30",
  littleHill: "b79ee852-0acb-457f-ac8b-3da86ecc32c8",
};

// Catalog imagery straight from Mercury, so a card and the element behind it
// always show the same photo.
const M = "https://images.thetarzanway.com/media";
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const IMG = {
  // Thailand activities
  hongLagoon: `${M}/activities/175646581281492352485656738281.jpg`,
  mangroveKayak: `${M}/activities/175646445352407479286193847656.webp`,
  cookingClass: `${M}/activities/175145778088293910026550292969/.jpg`,
  khaoHonNak: `${M}/activities/169089339441387462615966796875.jpg`,
  tukTukNight: `${M}/activities/176782383768921089172363281250.jpg`,
  taladNoi: `${M}/activities/173185313253253698348999023438/.png`,
  // Bali activities
  ubudWaterfalls: `${M}/activities/171326529611966514587402343750.jpg`,
  eastBaliPalaces: `${M}/activities/175484901603489995002746582031.png`,
  ubudWaterfallTour: `${M}/activities/176537422159461569786071777344.jpg`,
  uluwatuSunset: `${M}/activities/169089287587730145454406738281.jpg`,
  giliSunrise: `${M}/activities/177141595239064979553222656250.jpg`,
  // Islands
  giliTrawangan: `${M}/activities/175293457794143223762512207031.jpg`,
  lembongan: `${M}/activities/169089636859134507179260253906.jpg`,
  penida: `${M}/activities/169089299718673110008239746094.jpg`,
  kohYaoNoi: `${M}/activities/169089331089201307296752929688.jpg`,
  // POIs
  tirtaGangga: `${M}/pois/168425284319693517684936523438.jpeg`,
  kelingking: `${M}/pois/178696040173068714141845703125.jpeg`,
  // Restaurants
  karaweik: `${M}/restaurant/177062228460073184967041015625.jpg`,
  anandinii: `${M}/restaurant/176330254163953781127929687500.jpg`,
  citrusVine: `${M}/restaurant/176330258440837073326110839844.jpg`,
  greenMelon: `${M}/restaurant/176331355647877955436706542969.jpg`,
  nokkamin: `${M}/restaurant/176329972651447081565856933594.jpg`,
  littleHill: `${M}/restaurant/176330337101588559150695800781.jpg`,
};
// Other-theme page images (reused from each theme page's hero/first card).
const THEME_IMG = {
  thailandBachelor: `${M}/activities/176782413521073794364929199219.webp`,
  honeymoon: `${CDN}/media/website/honeymoon-theme-2026/Maldives%20%E2%80%94%20The%20Overwater%20Villa%20Fantasy.jpg`,
  hokkaido: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  christmas: `${CDN}/media/website/christmas-markets-2026/hero-vienna-rathausplatz-hq.jpg`,
};

// ── Prompts ─────────────────────────────────────────────────────────────────
// The four chips and the three route prompts are the copy as written for this
// theme; everything else is composed to match their voice.
const PROMPTS = {
  hero:
    "We are 2 travellers, and our travel dates are flexible. Plan a 12-night offbeat Thailand and Bali trip that combines the quieter Thai islands with the half of Bali that isn't crowded. Include longtail boat trips, snorkeling, hidden beaches and local seafood in Thailand, then rice terraces, waterfalls, water palaces and coastal villages in Bali. Avoid the busiest tourist areas and keep the pace comfortable.",
  // Chips
  thaiIslandsBaliCoast:
    "We are 2 travellers, and our travel dates are flexible. Plan a trip combining Thailand's best islands with Bali's beautiful coastline. Include quieter Thai beaches, island hopping, snorkeling, longtail boat trips and local seafood, followed by Bali's coastal towns, beach sunsets, cafés and relaxed beach experiences. Avoid overly crowded tourist spots and keep the pace comfortable.",
  eastBaliNusas:
    "We are 2 travellers, and our travel dates are flexible. Plan an offbeat Thailand and Bali trip focused on East Bali and the Nusa Islands, while also including a few of Thailand's best island experiences. Prioritize hidden beaches, snorkeling, scenic coastal drives, waterfalls, local villages, beautiful stays and slow island days. Avoid the busiest tourist areas and leave plenty of time to explore.",
  chiangMaiGilis:
    "We are 2 travellers, and our travel dates are flexible. Create a Thailand and Bali/Indonesia itinerary combining Chiang Mai and the Gili Islands. Start with Chiang Mai's temples, night markets, cafés, local food and surrounding nature, then slow down in the Gilis with beaches, snorkeling, cycling and sunset experiences. Keep the trip relaxed and balance culture, nature and island time.",
  islandsHighlands:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand + Bali trip that combines tropical islands with cooler highland experiences. Include island hopping, beaches, snorkeling and coastal experiences in Thailand, followed by Bali's mountains, rice terraces, waterfalls, temples and quieter villages. Create a balanced itinerary with both adventure and plenty of downtime.",
  // Routes — "Pick a shape, I'll fill it in"
  krabiEastBali:
    "We are 2 travellers, and our travel dates are flexible. Plan a 12-night offbeat Thailand and Bali trip starting with Krabi and its quieter surroundings, including scenic coastal drives, hidden beaches, local food, kayaking and island experiences. Then continue to East Bali, with Ubud and Amed, focusing on rice terraces, waterfalls, temples, snorkeling, local villages and beautiful stays. Keep the itinerary relaxed and avoid the most crowded tourist spots.",
  northThailandGilis:
    "We are 2 travellers, and our travel dates are flexible. Plan a 13-night trip combining North Thailand with the Gili Islands. Start in Chiang Mai with temples, night markets, local food, cafés and nature, spend some time in Bangkok for its food and city experiences, then head to Gili Trawangan for beaches, snorkeling, cycling and sunset experiences. Keep the pace comfortable and balance culture, city life and island downtime.",
  twoIslands:
    "We are 2 travellers, and our travel dates are flexible. Plan a 10-night trip focused entirely on Koh Yao Noi in Thailand and Nusa Lembongan in Indonesia. Prioritize quiet beaches, snorkeling, boat trips, scenic viewpoints, local food, beautiful stays and slow island days. Avoid crowded tourist areas and keep the itinerary relaxed, with plenty of time to enjoy each island rather than constantly moving.",
  // Trips — the same three shapes, priced and dated, flights included
  tripKrabiEastBali:
    "We are 2 travellers. Build the Krabi backroads and East Bali trip — 12 nights in January, starting with Krabi's quieter coast, mangroves and longtail island days, then Ubud and Amed for rice terraces, water palaces and snorkeling. Flights from Delhi and the internal flight included.",
  tripNorthThailandGilis:
    "We are 2 travellers. Build the North Thailand and Gili Islands trip — 13 nights in February: Chiang Mai's temples and night markets, a short Bangkok stop for the food, then Gili Trawangan for beaches, snorkeling and cycling. Flights from Delhi and the boat transfers included.",
  tripTwoIslands:
    "We are 2 travellers. Build the two-island trip — 10 nights in March split between Koh Yao Noi in Thailand and Nusa Lembongan in Indonesia. Two bases, no rushing, boats and ferries handled, flights from Delhi included.",
  // Ask Kaira
  askBar:
    "Which offbeat Thailand and Bali trip should we do first, for two of us with flexible dates — Krabi backroads then East Bali over 12 nights, North Thailand then the Gili Islands over 13, or just Koh Yao Noi and Nusa Lembongan over 10? Compare the pace, the cost and which months each one actually works in, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (nights /
// month / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow.
//
// Nothing here invents a month for the prompts that don't name one: every chip
// and route prompt on this page says "our travel dates are flexible", so those
// carry `nights` and `who` only and let the reader (or Kaira) pick the window.
// The three priced trips DO name a month in their own sentence, and each sits
// in that route's good season — Jan and Feb for the Andaman-dependent legs,
// March for the two-island one, where the water is warmest and the peak crowds
// have gone.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  hero: { nights: 12, who: "Couple" },
  thaiIslandsBaliCoast: { who: "Couple" },
  eastBaliNusas: { who: "Couple" },
  chiangMaiGilis: { who: "Couple" },
  islandsHighlands: { who: "Couple" },
  krabiEastBali: { nights: 12, who: "Couple" },
  northThailandGilis: { nights: 13, who: "Couple" },
  twoIslands: { nights: 10, who: "Couple" },
  tripKrabiEastBali: { nights: 12, month: 1, who: "Couple" },
  tripNorthThailandGilis: { nights: 13, month: 2, who: "Couple" },
  tripTwoIslands: { nights: 10, month: 3, who: "Couple" },
  askBar: { who: "Couple" },
});

const thailandBaliOffbeatConfig: CinematicThemeConfig = {
  // Jungle green — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["thailand-bali-offbeat"],
  header: {
    title: "Offbeat Thailand + Bali",
    subtitle: "Theme · Thailand / Indonesia · Nov – Apr",
  },
  hero: {
    eyebrow: "SKIP PATONG · SKIP KUTA · KEEP THE WATER",
    heading: { lead: "Thailand's islands, Bali's jungle", accent: "in one trip." },
    lede:
      "Same two countries everyone books, the quiet half of each. Longtails instead of speedboats, east Bali instead of the south, and enough days in each place that you stop checking the time. Tell me the shape and I'll fill in the rest.",
    placeholder: "Try: Krabi backroads then East Bali, 12 nights",
    prompt: PROMPTS.hero,
    chips: [
      { label: "Thai islands + Balinese coast", prompt: PROMPTS.thaiIslandsBaliCoast },
      { label: "East Bali and the Nusas", prompt: PROMPTS.eastBaliNusas },
      { label: "Chiang Mai + Gilis", prompt: PROMPTS.chiangMaiGilis },
      { label: "Islands + highlands", prompt: PROMPTS.islandsHighlands },
    ],
    // Desktop-only Kaira polaroid collage (hidden on mobile).
    images: [
      { image: IMG.hongLagoon, caption: "Krabi, the Hong lagoon" },
      { image: IMG.eastBaliPalaces, caption: "East Bali, the water palaces" },
      { image: IMG.giliSunrise, caption: "Gili T, first light" },
      { image: IMG.kelingking, caption: "Nusa Penida, Kelingking" },
    ],
  },
  sections: [
    // ── Routes ──
    {
      type: "cards",
      ctaLabel: "Create plan →",
      heading: {
        eyebrow: "Multi-city · swipe",
        lead: "Pick a shape,",
        accent: "I'll fill it in",
      },
      cards: [
        {
          image: IMG.hongLagoon,
          name: "Krabi backroads, East Bali",
          line: "Krabi · Ao Thalane · Ubud · Amed — 4 bases, 2 flights",
          tag: "12 nights",
          prompt: PROMPTS.krabiEastBali,
        },
        {
          image: IMG.tukTukNight,
          name: "North Thailand, then the Gilis",
          line: "Chiang Mai · Bangkok · Gili Trawangan — 3 stops, 3 flights",
          tag: "13 nights",
          prompt: PROMPTS.northThailandGilis,
        },
        {
          image: IMG.lembongan,
          name: "Two islands, nothing else",
          line: "Koh Yao Noi · Nusa Lembongan — 2 islands, boats between",
          tag: "10 nights",
          prompt: PROMPTS.twoIslands,
        },
      ],
    },
    // ── Experiences (a click anywhere on a card adds or removes it) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Worth getting", accent: "off the map for" },
      cards: [
        {
          image: IMG.hongLagoon,
          name: "Hong Island lagoon by longtail boat",
          line: "The hidden lagoon before the speedboats find it — one boat, one crew, snorkel stops in between.",
          tag: "Krabi",
          activityId: ACTIVITY.hongLagoon,
        },
        {
          image: IMG.mangroveKayak,
          name: "Mangrove kayaking at Ao Thalane",
          line: "Paddle through limestone caves and mangrove channels, barbecue under the karsts after.",
          tag: "Krabi",
          activityId: ACTIVITY.mangroveKayak,
        },
        {
          image: IMG.cookingClass,
          name: "Thai cooking class at Thai Charm",
          line: "Market first, wok second. The four dishes you'll actually cook again at home.",
          tag: "Krabi",
          activityId: ACTIVITY.cookingClass,
        },
        {
          image: IMG.khaoHonNak,
          name: "Khao Hon Nak trek with lunch",
          line: "A limestone ridge nobody climbs, panoramic at the top, lunch waiting at the bottom.",
          tag: "Krabi",
          activityId: ACTIVITY.khaoHonNak,
        },
        {
          image: IMG.tukTukNight,
          name: "Tuk-tuk night temples and street food",
          line: "Lit temples after dark and the stalls locals queue at — four hours, no bus.",
          tag: "Chiang Mai",
          activityId: ACTIVITY.tukTukNight,
        },
        {
          image: IMG.taladNoi,
          name: "Talad Noi street art walk",
          line: "The old Chinatown alleys — murals, mechanic shops and a shrine at the end.",
          tag: "Bangkok",
          activityId: ACTIVITY.taladNoi,
        },
        {
          image: IMG.ubudWaterfalls,
          name: "Waterfalls, water temple and rice terraces",
          line: "Private car, three waterfalls, and Tirta Empul before the tour buses arrive.",
          tag: "Ubud",
          activityId: ACTIVITY.ubudWaterfalls,
        },
        {
          image: IMG.eastBaliPalaces,
          name: "Lempuyang, Tirta Gangga and Taman Ujung",
          line: "The gates of heaven and two royal water palaces, small group, east-side pace.",
          tag: "East Bali",
          activityId: ACTIVITY.eastBaliPalaces,
        },
      ],
    },
    // ── The swap that makes this trip ──
    // The editorial spine of the page: each row is the crowded version people
    // book, next to the version this theme sends them to instead.
    // {
    //   type: "list",
    //   compact: true,
    //   heading: {
    //     eyebrow: "The swap that makes this trip",
    //     lead: "Go one island",
    //     accent: "further",
    //   },
    //   rows: [
    //     {
    //       emoji: "🛶",
    //       gradient: "linear-gradient(150deg, #0e7a55, #e2f2ea 190%)",
    //       name: "Krabi and Koh Yao Noi",
    //       badge: "Not Phuket's west coast",
    //       line: "Same Andaman water, longtail boats instead of jet skis, and lagoons that empty out by four.",
    //     },
    //     {
    //       emoji: "🌋",
    //       gradient: "linear-gradient(150deg, #16324f, #0e7a55 160%)",
    //       name: "East Bali and Amed",
    //       badge: "Not Kuta or Seminyak",
    //       line: "Black sand, water palaces and dive sites. Two hours from the airport and a decade behind the south.",
    //     },
    //     {
    //       emoji: "🌅",
    //       gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
    //       name: "One night on a Nusa",
    //       badge: "Not a Bali-only fortnight",
    //       line: "Stay over on Lembongan or Penida and you get Kelingking at dawn with nobody in the frame.",
    //     },
    //   ],
    // },
    // ── Islands — each row adds the boat or tour that actually gets you there ──
    {
      type: "list",
      selectable: true,
      itemKind: "activity",
      heading: {
        lead: "The route",
        accent: "less travelled",
        note: "Tap one to add the boat that actually gets you there",
      },
      rows: [
        {
          image: IMG.giliTrawangan,
          emoji: "🚲",
          gradient: "linear-gradient(150deg, #0e7a55, #e2f2ea 190%)",
          name: "Gili Trawangan",
          badge: "Boat from Bali",
          line: "No cars, no motorbikes. Bicycles, turtles off the beach, and a sunset side everyone walks to.",
          activityId: ISLAND.giliTrawangan,
        },
        {
          image: IMG.lembongan,
          emoji: "🌉",
          gradient: "linear-gradient(150deg, #16324f, #0e7a55 160%)",
          name: "Nusa Lembongan & Ceningan",
          badge: "40 min from Sanur",
          line: "The yellow bridge, mangrove channels and a coastline of secluded coves — Bali without Bali's traffic.",
          activityId: ISLAND.lembongan,
        },
        {
          image: IMG.penida,
          emoji: "🦖",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          name: "Nusa Penida, east and west",
          badge: "Day or overnight",
          line: "Kelingking cliff, Diamond Beach and jungle in between. Stay the night and you'll have it at dawn.",
          activityId: ISLAND.penida,
        },
        {
          image: IMG.kohYaoNoi,
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          name: "Koh Yao Noi",
          badge: "Ferry from Krabi",
          line: "Between Phuket and Krabi and ignored by both. Rubber plantations, longtails, and no beach clubs.",
          activityId: ISLAND.kohYaoNoi,
        },
      ],
    },
    // ── Bali, away from the traffic ──
    // Mixed POIs and activities, so every card names its own `item` kind rather
    // than inheriting the section default.
    {
      type: "cards",
      selectable: true,
      itemKind: "poi",
      heading: {
        lead: "Bali,",
        accent: "away from the traffic",
        note: "Everything here is worth an early alarm, and most of it needs one",
      },
      cards: [
        {
          image: IMG.tirtaGangga,
          name: "Tirta Gangga",
          line: "The royal water palace with stepping stones over koi pools. Go at opening.",
          tag: "Karangasem",
          item: {
            kind: "poi",
            label: "Tirta Gangga (Karangasem)",
            short: "Tirta Gangga",
            id: POI.tirtaGangga,
          },
        },
        {
          image: IMG.ubudWaterfallTour,
          name: "Ubud waterfall circuit",
          line: "Kanto Lampo and the jumps upstream, before 9am and ahead of the crowd.",
          tag: "Ubud",
          activityId: BALI_ACTIVITY.ubudWaterfallTour,
          item: {
            kind: "activity",
            label: "Ubud waterfall circuit",
            short: "Ubud waterfalls",
            id: BALI_ACTIVITY.ubudWaterfallTour,
          },
        },
        {
          image: IMG.kelingking,
          name: "Kelingking cliff",
          line: "The T-rex headland. Look, photograph, and skip the climb down.",
          tag: "Nusa Penida",
          item: {
            kind: "poi",
            label: "Kelingking cliff (Nusa Penida)",
            short: "Kelingking cliff",
            id: POI.kelingking,
          },
        },
        {
          image: IMG.uluwatuSunset,
          name: "Uluwatu at sunset",
          line: "Cliff temple, kecak dance as the sun drops, grilled fish on the sand after.",
          tag: "Jimbaran",
          activityId: BALI_ACTIVITY.uluwatuSunset,
          item: {
            kind: "activity",
            label: "Uluwatu at sunset (Jimbaran)",
            short: "Uluwatu sunset",
            id: BALI_ACTIVITY.uluwatuSunset,
          },
        },
        {
          image: IMG.giliSunrise,
          name: "Sunrise on the east beach",
          line: "SUP out at first light with Rinjani across the water.",
          tag: "Gili Trawangan",
          activityId: BALI_ACTIVITY.giliSunrise,
          item: {
            kind: "activity",
            label: "Gili Trawangan sunrise SUP",
            short: "Gili T sunrise",
            id: BALI_ACTIVITY.giliSunrise,
          },
        },
      ],
    },
    // ── Trips ──
    {
      type: "trips",
      ctaLabel: "Book itinerary →",
      heading: {
        lead: "Pick a plan.",
        accent: "Pack your bags",
        note: "Priced from Delhi · flights, boats and ferries included",
      },
      cards: [
        {
          image: IMG.hongLagoon,
          tag: "Couple · 12N",
          name: "Krabi backroads, East Bali",
          line: "Longtails and mangroves for a week, then water palaces and a black-sand coast.",
          price: "₹1,45,000 / person",
          nights: "12 nights · Krabi + Bali",
          urgent: "Dec – Feb villas on the east coast go three months out",
          prompt: PROMPTS.tripKrabiEastBali,
        },
        {
          image: IMG.tukTukNight,
          tag: "Couple · 13N",
          name: "North Thailand, then the Gilis",
          line: "Chiang Mai's night temples, one Bangkok stopover, then no cars for five days.",
          price: "₹1,62,000 / person",
          nights: "13 nights · Chiang Mai + Gili T",
          prompt: PROMPTS.tripNorthThailandGilis,
        },
        {
          image: IMG.lembongan,
          tag: "Slow · 10N",
          name: "Two islands, nothing else",
          line: "Koh Yao Noi and Nusa Lembongan. Two boats, two bases, zero itinerary.",
          price: "₹1,28,000 / person",
          nights: "10 nights · 2 islands",
          prompt: PROMPTS.tripTwoIslands,
        },
      ],
    },
    // ── Restaurants and cafés (dark) ──
    {
      type: "eats",
      selectable: true,
      itemKind: "restaurant",
      heading: { lead: "Restaurants", accent: "and cafés" },
      cards: [
        {
          image: IMG.karaweik,
          name: "Karaweik",
          city: "Koh Tao",
          line: "Burmese kitchen on a Thai island — rich curries, fish soup, mohinga. Nothing like the beach menus.",
          rating: "5.0",
          reviews: "2,118",
          href: `${PAGE}?restaurant_id=${RESTAURANT.karaweik}`,
        },
        {
          image: IMG.anandinii,
          name: "Anandinii Organic Garden",
          city: "Sidemen Valley",
          line: "Garden kitchen in the rice terraces. Mango salad, bubur Bali, vegetables picked that morning.",
          rating: "5.0",
          reviews: "911",
          href: `${PAGE}?restaurant_id=${RESTAURANT.anandinii}`,
        },
        {
          image: IMG.citrusVine,
          name: "Citrus & Vine",
          city: "Sidemen Valley",
          line: "Proper latte art in the middle of nowhere, plus the chocolate chip cookies people come back for.",
          rating: "5.0",
          reviews: "838",
          href: `${PAGE}?restaurant_id=${RESTAURANT.citrusVine}`,
        },
        {
          image: IMG.greenMelon,
          name: "Green Melon Warung",
          city: "Amed",
          line: "Seafood plates, mi goreng with chicken, coconut pancakes. Sea across the road.",
          rating: "5.0",
          reviews: "688",
          href: `${PAGE}?restaurant_id=${RESTAURANT.greenMelon}`,
        },
        {
          image: IMG.nokkamin,
          name: "Nokkamin Home",
          city: "Ko Lipe",
          line: "Pad thai and tom yum on the quietest island in the Andaman. Mango smoothie after.",
          rating: "5.0",
          reviews: "227",
          href: `${PAGE}?restaurant_id=${RESTAURANT.nokkamin}`,
        },
        {
          image: IMG.littleHill,
          name: "The Little Hill Terrace",
          city: "Munduk",
          line: "Beef rendang and yellow chicken curry up in the hills, roasted banana to end.",
          rating: "5.0",
          reviews: "125",
          href: `${PAGE}?restaurant_id=${RESTAURANT.littleHill}`,
        },
      ],
    },
    // ── When to go ──
    {
      type: "months",
      heading: {
        eyebrow: "Two countries, two different monsoons",
        lead: "The dry months,",
        accent: "ranked",
      },
      rows: [
        {
          range: "Nov – Dec",
          name: "Dry, green, empty · best value",
          line: "Rains have just stopped. Everything is green, prices haven't climbed and the islands are half full.",
        },
        {
          range: "Jan – Feb",
          name: "Peak dry season · busiest",
          line: "Perfect weather, highest prices. Book villas and boats three months out, or take the shoulder.",
        },
        {
          range: "Mar – Apr",
          name: "Hot and clear · sweet spot",
          line: "Warmest water of the year, crowds thinning. Songkran in mid-April is worth planning around, either way.",
        },
        {
          range: "May – Oct",
          name: "Monsoon, split · skip the Andaman",
          line: "Thailand's west coast gets rough seas and boats cancel. Bali stays fine, and cheap, right through it.",
        },
      ],
      note:
        "The two countries don't share a monsoon, which is the whole planning problem — and the reason a May-to-October trip should be weighted east. Send me your month and I'll tell you which coast behaves before anything is booked.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: { lead: "Your visas,", accent: "handled" },
      intro:
        "Two countries, two applications, one handler. Indonesia's e-Visa is quick and comes through in a day; Thailand's tourist e-Visa is applied for before you fly. We prep both files, check every document, and submit for you.",
      // The two countries in the title, and nothing else — the stopovers and
      // upgrades that used to pad this list (Vietnam, Singapore, Maldives,
      // Japan) were for trips this page isn't selling.
      cards: [
        {
          country: "Thailand",
          cities: "Tourist e-Visa · 60 days · applied before you fly",
          fee: "₹4,700",
          line:
            "Single entry, which quietly settles the shape of the trip: whichever country you land in first is the one you can't come back to without applying again. It's why the route runs one way rather than hopping.",
          href: `${VISA}/thailand-visa-online`,
        },
        {
          country: "Indonesia",
          cities: "e-Visa · 30 days · single entry, extendable once",
          fee: "₹3,600",
          line:
            "Comes through in about a day, and extends once on the ground. This is the half of the trip that can stretch — if the Sidemen valley does its job, you extend rather than re-plan.",
          href: `${VISA}/indonesia-visa-online`,
        },
      ],
      facts: [
        { label: "Processing", value: "1 – 10 days" },
        { label: "Stay", value: "60d / 30d" },
        { label: "Proof", value: "Return ticket" },
        { label: "Entry", value: "Single · both" },
      ],
      note:
        "Both are single-entry, so the order of the two countries matters if you were thinking of hopping back. Thailand also needs the free digital arrival card within 72 hours of landing — we send that link with the visa.",
    },
    // ── Read this first ──
    // {
    //   type: "list",
    //   compact: true,
    //   heading: {
    //     eyebrow: "The three things people get wrong",
    //     lead: "Read this",
    //     accent: "first",
    //   },
    //   rows: [
    //     {
    //       emoji: "🛥️",
    //       gradient: "linear-gradient(150deg, #0e7a55, #e2f2ea 190%)",
    //       name: "The boat, not the island, decides the day",
    //       line: "Longtail beats speedboat everywhere in Krabi — slower, quieter, and it reaches the lagoons after the fleet leaves.",
    //     },
    //     {
    //       emoji: "🌦️",
    //       gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
    //       name: "The two countries have different monsoons",
    //       line: "May to October the Andaman is rough and boats cancel; Bali is perfectly fine. Pair them by month, not by map.",
    //     },
    //     {
    //       emoji: "💸",
    //       gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
    //       name: "Offbeat costs less, not more",
    //       line: "East Bali and Koh Yao Noi run well under the south-Bali and Phuket equivalents. The saving buys the extra week.",
    //     },
    //   ],
    // },
    // ── Stories — each opens the traveller's actual plan ──
    {
      type: "stories",
      heading: { eyebrow: "Loved on Google", lead: "People who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Google review",
          name: "Nishant",
          when: "June 2024 · Koh Samui, Krabi, Phuket",
          quote:
            "Nine nights built around Krabi's islands and Koh Samui, with Phuket only as the way in and out.",
          href: `${SITE}/chat/d0feea73-5208-402c-81f6-c2215e912157`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Atal",
          when: "July 2024 · Ubud",
          quote:
            "A week entirely in Ubud — waterfalls, rice terraces and temples, no south-Bali beach clubs.",
          href: `${SITE}/chat/1d73f1c3-a43a-4c56-afc2-23eedb88d7e6`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Rishab",
          when: "January 2024 · Krabi, Phuket",
          quote:
            "Four nights done on a budget, with the boat days prioritised over the hotels.",
          href: `${SITE}/itinerary/40ed8592-d6fb-460e-9c22-a5422af6e68b`,
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations in this theme",
        lead: "Where I",
        accent: "send people",
      },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Krabi",
          meta: "Longtails · lagoons",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #0e7a55, #e2f2ea 190%)",
          image: IMG.hongLagoon,
          href: "/asia/thailand",
        },
        {
          name: "Chiang Mai",
          meta: "North · temples",
          emoji: "🛕",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: IMG.tukTukNight,
          href: "/asia/thailand",
        },
        {
          name: "East Bali",
          meta: "Water palaces · Amed",
          emoji: "🌋",
          gradient: "linear-gradient(150deg, #16324f, #0e7a55 160%)",
          image: IMG.eastBaliPalaces,
          href: "/asia/indonesia",
        },
        {
          name: "Gili Trawangan",
          meta: "No cars · turtles",
          emoji: "🚲",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          image: IMG.giliTrawangan,
          href: "/asia/indonesia",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Somewhere else warm?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Thailand bachelor",
          meta: "Islands · villas",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #0d7f8f, #e2f2f4 190%)",
          image: THEME_IMG.thailandBachelor,
          href: "/theme/thailand-bachelor",
        },
        {
          name: "Honeymoon",
          meta: "Year round",
          emoji: "🫶",
          gradient: "linear-gradient(150deg, #a8556b, #f8ebef 190%)",
          image: THEME_IMG.honeymoon,
          href: "/theme/honeymoon",
        },
        {
          name: "Hokkaido powder",
          meta: "Dec – Mar",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: THEME_IMG.hokkaido,
          href: "/theme/hokkaido-powder",
        },
        {
          name: "Christmas markets",
          meta: "Europe · multi-city",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image: THEME_IMG.christmas,
          href: "/theme/christmas-markets",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about the quiet side…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
    buildCta: "Build trip",
  },
};

const ThailandBaliOffbeatThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  const handleSelectPrompt = (prompt: string, intent?: ThemePromptIntent) =>
    seedChat(prompt, {
      items: selection.items,
      slug: THEME_SLUG,
      intent,
      facts: PROMPT_FACTS[prompt],
    });
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="thailand-bali-offbeat">
      <Head>
        <title>
          Offbeat Thailand &amp; Bali Trips | Trip Planner &amp; Itinerary | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan an offbeat Thailand and Bali trip with The Tarzan Way's AI itinerary — Krabi's quiet islands, Koh Yao Noi, East Bali, the Nusas and the Gilis, strung into one route with boats, ferries and visas handled, for Indian travellers."
        />
        <meta
          property="og:title"
          content="Offbeat Thailand & Bali Trips | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan an offbeat Thailand and Bali trip with The Tarzan Way's AI itinerary — Krabi's quiet islands, Koh Yao Noi, East Bali, the Nusas and the Gilis, strung into one route with boats, ferries and visas handled, for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/thailand-bali-offbeat"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/thailand-bali-offbeat"
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
                  name: "Offbeat Thailand & Bali — Trip Planner",
                  description:
                    "Plan an offbeat Thailand and Bali trip with The Tarzan Way's AI itinerary — Krabi's quiet islands, Koh Yao Noi, East Bali, the Nusas and the Gilis, strung into one route with boats, ferries and visas handled, for Indian travellers.",
                  url: "https://thetarzanway.com/theme/thailand-bali-offbeat",
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
                      name: "Offbeat Thailand & Bali",
                      item: "https://thetarzanway.com/theme/thailand-bali-offbeat",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={thailandBaliOffbeatConfig}
        onSelectPrompt={handleSelectPrompt}
        selection={selection}
        onBuild={handleBuild}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ThailandBaliOffbeatThemePage);
