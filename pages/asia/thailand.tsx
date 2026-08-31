// pages/asia/thailand.tsx
//
// Thailand — the country page, rebuilt on the same cinematic surface the theme
// landings use (the "Thailand Country Page (desktop)" mockup). A static route
// under /asia/thailand, which Next resolves ahead of the generic
// pages/[continent]/[country] country page: every other country still renders
// the API-driven CountryPage, Thailand renders this.
//
// The page is a country, not a theme, so it is organised by decision rather than
// by story: which vibe, which days, which base, which table, which month. The
// one dated thing on it is the Yi Peng lantern festival, which is why that
// section leads — it is the only part of Thailand that has a deadline, and the
// ticketed releases sell out roughly six months out.
//
// Everything a reader taps either seeds a prompt into a fresh /chat session with
// Kaira, or saves the catalog element behind it into the trip tray; the docked
// bar then builds a route around the selection.

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

const SITE = "https://thetarzanway.com";
const PAGE = "/asia/thailand";
const THEME_SLUG = "thailand";
// Thailand's visa desk. The country page links out rather than saving a visa to
// the tray: the fee is waived for Indian passports, so there is nothing to add.
const VISA_URL = "https://visa.thetarzanway.com/country/thailand-visa-online";

// ── Catalog ids ─────────────────────────────────────────────────────────────
// Straight off the Mercury admin links in the brief, so a card and the element
// behind it are the same row. `activityId` opens the read-only detail drawer and
// is also the de-dupe key for the tray.
const ACTIVITY = {
  hongLagoon: "f4b2435d-f5a7-40ac-82f4-2efa5914da93",
  jamesBond: "bf9b2842-d349-4c0b-b622-e73c64f81beb",
  plankton: "c414ebcc-46b8-4a7d-8c01-ebc93942d51c",
  cookingClass: "24523bc3-c738-446c-b681-c24ccce8b1dd",
  khaoHonNak: "f4568078-06e1-4962-b1ca-b5081a80038f",
  chiangDao: "8613bb4b-09e8-4812-b308-9cbaaf70da6a",
  cityTour: "884f09ff-9c0e-45b2-b217-feb21e3873a3",
  chiangRai: "27f6d026-723b-40ed-873f-8691a18850e5",
  khlongToei: "58230d3b-8a8b-42df-a593-b8aac79d031e",
  kitesurf: "9c9f39dc-c16b-44ab-9962-fdcb68409bc3",
};

// Restaurant ids — ?restaurant_id= opens the listing's own drawer.
const RESTAURANT = {
  karaweik: "3ab39fa5-096c-40c9-89eb-de381d1eabcd",
  chaixi: "89ecc314-8d11-4cdd-a886-b42ffdd16255",
  nokkamin: "f6c7dde3-0c15-47ef-a7b5-3ca994232b30",
  kohMook: "bf95ab00-a3c8-41a9-b9ca-d4b6b36d686d",
  chanjao: "3c4b3a34-0e5e-4120-9c9c-0c7c0928174a",
  tangBbq: "c9995613-6bbb-4980-8293-12d3fdf242aa",
  villageFarm: "a70d62c0-ea86-4381-a249-f6ccabb9a4bb",
};

// Ready-made plans, as existing chat threads. These open the actual itinerary
// rather than seeding a new prompt, which is what "Pick a plan" promises.
const PLAN = {
  pattaya: "ab5bbbe7-0c54-4a2e-8bec-659516854a48",
  thaiMeAway: "08cfab4b-bbc3-4a68-ae8d-1a8f5bae959d",
  thaidTogether: "19da4400-3e09-4046-a95f-76e3667956f7",
  thaiMeUp: "ce877431-e561-4139-89ff-8c51abfdeb3c",
};

// ── Imagery ─────────────────────────────────────────────────────────────────
// Catalog photography from Mercury, so a card shows the same cover the listing
// does. The country and other-theme tiles at the foot of the page deliberately
// reuse the images those pages already ship (see COUNTRY / THEME_IMG below)
// rather than picking new ones, so the same country reads the same everywhere.
const M = "https://images.thetarzanway.com/media";
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const A = (n: string) => `${M}/activities/${n}`;
const C = (n: string) => `${M}/website/thailand-theme-2026/${n}`;
const D = (n: string) => `${M}/cities/${n}`;
const R = (n: string) => `${M}/restaurant/${n}`;

const CITY = {
  krabi: C("PickBaseKrabi.png"),
  bangkok: C("PickBaseBangkok.png"),
  chiangMai: C("PickBaseChiangMai.png"),
  phuket: C("PickBasePhuket.png"),
  phangan: C("PickBaseKohPhangan.png"),
  pattaya: C("PickBasePattaya.png"),
  samui: D("170800592286874032020568847656.jpg"),
  chiangRai: D("173340008483138561248779296875.jpeg"),
  koLipe: D("175102409787724852561950683594.jpeg"),
  kohJum: D("177062215040751338005065917969.jpg"),
};

const PickAVibe = {
  krabi: C("PickBaseKrabi.png"),
  bangkok: C("PickBaseBangkok.png"),
  chiangMai: C("PickVibe1.jpg"),
  phuket: C("PickVibe3.png"),
  phangan: C("PickBaseKohPhangan.png"),
  pattaya: C("PickVibe4.png"),
  samui: D("170800592286874032020568847656.jpg"),
  chiangRai: D("173340008483138561248779296875.jpeg"),
  koLipe: D("175102409787724852561950683594.jpeg"),
  kohJum: C("PickVibe2.png"),
  trek: C("PickVibe5.png")
}

const IMG = {
  // Yi Peng — the three ticketed releases
  heritageLanterns: C("LanternFestival1.png"),
  heavenLanterns: C("LanternFestival2.png"),
  skyFestival: A("174719880734959030151367187500.jpg"),
  // Experiences
  hong: A("175646581281492352485656738281.jpg"),
  bond: A("175671616117149710655212402344.jpeg"),
  plankton: A("175646677143464565277099609375.jpg"),
  cook: A("175145778088293910026550292969/.jpg"),
  trek: A("169089339441387462615966796875.jpg"),
  chiangDao: A("175654418852686524391174316406.jpeg"),
  cityTour: A("175463584274294662475585937500.jpg"),
  chiangRai: A("169089905615965294837951660156.jpg"),
  grandPalace: A("175577608651952099800109863281.jpeg"),
  cycling: A("175577502579198455810546875000.jpeg"),
  kite: A("176960849961945867538452148438.jpeg"),
  // Restaurants
  karaweik: R("177062228460073184967041015625.jpg"),
  chaixi: R("177062231274741744995117187500.jpg"),
  nokkamin: R("176329972651447081565856933594.jpg"),
  kohMook: R("177314604365588974952697753906.jpg"),
  chanjao: R("177314614510444140434265136719.jpg"),
  tangBbq: R("177064252245488739013671875000.jpg"),
  villageFarm: R("176325336043369770050048828125.jpg"),
};

// Country heroes. Each id is that country's own `geos_country.image` row — the
// same cover the destination pages and filmy-getaways serve, so Vietnam is the
// same Vietnam wherever it appears rather than a second photo of it.
const COUNTRY = {
  indonesia: `${CDN}/media/countries/168442225368335318565368652344.jpg`,
  vietnam: `${CDN}/media/countries/175871326394452381134033203125.png`,
  japan: `${CDN}/media/countries/175853838850662446022033691406.jpg`,
  singapore: `${CDN}/media/countries/170359702492763948440551757812.jpg`,
  malaysia: `${CDN}/media/countries/168442089471308898925781250000.jpg`,
  srilanka: `${CDN}/media/countries/168442029031905126571655273438.jpg`,
};

// Other-theme tiles — each theme page's own hero/first-card image.
const THEME_IMG = {
  thailandBachelor: A("176782413521073794364929199219.webp"),
  thailandBaliOffbeat: A("175646445352407479286193847656.webp"),
  honeymoon: `${CDN}/media/website/honeymoon-theme-2026/Maldives%20%E2%80%94%20The%20Overwater%20Villa%20Fantasy.jpg`,
  filmy: `${CDN}/media/website/filmy-getaways-2026/EatPrayLove.png`,
};

// ── Prompts ─────────────────────────────────────────────────────────────────
// Every prompt below is the brief's own copy, verbatim. They all open "We are 2
// travellers, and our travel dates are flexible" except the three Yi Peng ones,
// which pin 24–25 November 2026 because that is when the festival is — a
// flexible-dates lantern trip is a contradiction.
const PROMPTS = {
  // Hero + chips
  yiPengChip:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand trip around the Yi Peng Lantern Festival in Chiang Mai. Include the best festival experiences, night markets, temples, local food and cultural experiences, while also adding a few days in another Thai destination. Build the itinerary around the festival dates and keep the pace comfortable.",
  krabiIslands:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand trip focused on Krabi and the surrounding islands. Include beautiful beaches, longtail boat trips, snorkeling, hidden lagoons, viewpoints, local food and a few offbeat experiences. Keep enough free time for relaxed island days.",
  chiangMaiNorth:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand trip focused on Chiang Mai and Northern Thailand. Include temples, night markets, local food, cafés, nature, scenic viewpoints and authentic cultural experiences. Add a few nearby experiences outside the city and keep the trip slow rather than packed.",
  bangkokWeekend:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand weekend in Bangkok with a mix of iconic sights and local experiences. Include street food, night markets, rooftop views, temples, Chinatown, cafés and nightlife. Keep it fun and well-paced without trying to see everything.",
  firstTime:
    "We are 2 travellers, and our travel dates are flexible. Plan our first Thailand trip and include the destinations and experiences we shouldn't miss. I'd like a mix of Bangkok, beaches, local food, culture and a few unique experiences, while keeping the route practical and not too rushed.",
  withoutPhuket:
    "We are 2 travellers, and our travel dates are flexible. Plan a Thailand trip without Phuket, focusing instead on quieter islands and less-crowded destinations. Include beautiful beaches, island hopping, local experiences, great food and scenic stays, while avoiding overly touristy places where possible.",
  // The brief's three Yi Peng prompts are deliberately not here: those cards
  // save the release into the trip instead of seeding a sentence, and a
  // selectable card never fires a prompt. What they said — which release, and
  // that 24–25 November 2026 is fixed — is carried by each card's item label
  // and by the form's November route, which is anchored to the same two nights.
  // Pick a vibe — the five route shapes
  lanternsNorth:
    "We are 2 travellers, and our dates are flexible, but we want to travel in November. Plan a 6-night Thailand trip around the Yi Peng Lantern Festival, combining Chiang Mai, Chiang Rai and Bangkok. Include the lantern festival, temples, night markets, local food and cultural experiences, with enough time to enjoy each place without rushing.",
  islandsSlowly:
    "We are 2 travellers, and our travel dates are flexible. Plan a 9-night Thailand island trip through Krabi, Koh Lanta and Koh Jum. Focus on quiet beaches, longtail boats, snorkeling, local food, sunsets and slow island days. Avoid overly crowded tourist spots and keep the itinerary relaxed with minimal rushing between islands.",
  cityAndBeach:
    "We are 2 travellers, and our travel dates are flexible. Plan a 5-night first-time Thailand trip combining Bangkok and Phuket. Include Bangkok's temples, street food and markets, followed by Phuket's best beaches and island experiences. Keep it simple, practical and relaxed for a first visit.",
  loudWeek:
    "We are a group of 6 friends, and our travel dates are flexible. Plan a 7-night Thailand trip through Bangkok, Pattaya and Phuket. Focus on nightlife, beach clubs, street food, fun group activities, island trips and memorable experiences. Keep the itinerary energetic but leave enough downtime between nights out.",
  kayaksCavesCooking:
    "We are 2 travellers, and our travel dates are flexible. Plan an 8-night Thailand trip combining Krabi and Chiang Mai, focused on active and hands-on experiences. Include kayaking, caves, hiking, snorkeling, Thai cooking classes, temples, local food and outdoor adventures. Keep the itinerary active but balanced with relaxed evenings.",
  // Ask Kaira
  askBar:
    "Which Thailand trip should we do first, for two of us with flexible dates — Krabi and the Andaman islands, Chiang Mai and the north around the Yi Peng lanterns, or a first-timer's Bangkok and one beach? Compare the pace, the cost and which months each one actually works in, given the two coasts have opposite monsoons, then build the ideal itinerary for the one you recommend.",
};

// What each prompt states about the trip, sent as `intake` keys (month / day /
// nights / pax) rather than left for the backend to parse out of the sentence.
//
// The chips and the two-line brief prompts say "our travel dates are flexible",
// so they carry `who` only — inventing a month for them would contradict the
// sentence the reader just sent.
//
// The five vibes carry the nights their own card prints. The lantern one also
// carries `month: 11` with `day: 22`: Yi Peng is two fixed nights and a
// mid-month departure would miss them, so the trip starts two days ahead and
// the 24th and 25th land inside it.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  yiPengChip: { who: "Couple", month: 11 },
  krabiIslands: { who: "Couple" },
  chiangMaiNorth: { who: "Couple" },
  bangkokWeekend: { who: "Couple" },
  firstTime: { who: "Couple" },
  withoutPhuket: { who: "Couple" },
  lanternsNorth: {
    who: "Couple",
    nights: 6,
    month: 11,
    day: 22,
    window: "lanterns_north",
    skeleton: "chiangmai_chiangrai_bangkok",
  },
  islandsSlowly: {
    who: "Couple",
    nights: 9,
    window: "islands_slowly",
    skeleton: "krabi_lanta_kohjum",
  },
  cityAndBeach: {
    who: "Couple",
    nights: 5,
    window: "city_and_beach",
    skeleton: "bangkok_phuket",
  },
  loudWeek: {
    who: "Friends",
    adults: 6,
    nights: 7,
    window: "loud_week",
    skeleton: "bangkok_pattaya_phuket",
  },
  kayaksCavesCooking: {
    who: "Couple",
    nights: 8,
    window: "active_krabi_north",
    skeleton: "krabi_chiangmai",
  },
  askBar: { who: "Couple" },
});

const thailandConfig: CinematicThemeConfig = {
  // Andaman teal — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES.thailand,
  header: {
    title: "Thailand",
    subtitle: "Asia · Nov – Apr",
  },
  hero: {
    eyebrow: "Two coasts, opposite monsoons, one country",
    heading: { lead: "Thailand,", accent: "beyond the usual" },
    lede:
      "Longtails out of Krabi, night temples in Chiang Mai, the two markets outside Bangkok. Tell me the shape of the trip and I'll price every leg live.",
    placeholder: "Try: Krabi and Chiang Mai, 9 nights, two of us",
    prompt: PROMPTS.firstTime,
    chips: [
      { label: "Yi Peng lantern festival", prompt: PROMPTS.yiPengChip },
      { label: "Krabi and the islands", prompt: PROMPTS.krabiIslands },
      { label: "Chiang Mai in the north", prompt: PROMPTS.chiangMaiNorth },
      { label: "Bangkok on a weekend", prompt: PROMPTS.bangkokWeekend },
      { label: "First time in Thailand", prompt: PROMPTS.firstTime },
      { label: "Without Phuket", prompt: PROMPTS.withoutPhuket },
    ],
    // Desktop-only Kaira polaroid collage. Each one saves the scene it shows.
    images: [
      { image: IMG.hong, caption: "Krabi, the Hong lagoon" },
      { image: IMG.heritageLanterns, caption: "Chiang Mai, Yi Peng" },
      { image: IMG.grandPalace, caption: "Bangkok, the Grand Palace" },
      { image: IMG.bond, caption: "Phang Nga, by canoe" },
    ],
  },
  sections: [
    // ── Yi Peng ──
    // Opens the page because it is the only thing on it with a deadline. The
    // ink panel is the point: it stops the scroll before the browsing rows
    // begin, and the three cards are ticketed releases that sell out roughly
    // six months out.
    //
    // A lantern night decides the dates of the whole trip, so the release the
    // reader picks has to reach the itinerary rather than just seeding a
    // sentence: each card saves into the tray, and its label carries 24–25
    // November 2026 so the date rides along with the item. The theme form's
    // November route is anchored to the same two nights.
    {
      type: "cards",
      tone: "dark",
      // No rail: three cards fall into the ink panel's 3-up grid and fill it
      // edge to edge. A rail would hold them at a fixed 288px and leave most of
      // the panel empty to their right.
      selectable: true,
      itemKind: "activity",
      addNoun: "activity",
      heading: {
        eyebrow: "24 – 25 November 2026 · Chiang Mai",
        lead: "The night the sky",
        accent: "fills up",
      },
      intro:
        "One night a year, on the Lanna full moon. The release everyone photographs is ticketed and 30–45 minutes outside the city — not the free one in town, which runs the same nights and is worth doing as well.",
      cards: [
        {
          image: IMG.heritageLanterns,
          name: "Heritage Sky Lanterns",
          line: "The traditional Lanna ceremony — monks chanting, then the release. The one people photograph.",
          tag: "Most booked",
          item: {
            kind: "activity",
            label:
              "Yi Peng — Heritage Sky Lanterns, Chiang Mai (24–25 Nov 2026)",
            short: "Heritage Sky Lanterns",
          },
        },
        {
          image: IMG.heavenLanterns,
          name: "Heaven Lantern Festival, with dinner",
          line: "Khantoke dinner and a seated release. The easiest evening if you're bringing parents.",
          tag: "Dinner included",
          item: {
            kind: "activity",
            label:
              "Yi Peng — Heaven Lantern Festival with Khantoke dinner, Chiang Mai (24–25 Nov 2026)",
            short: "Heaven Lantern Festival",
          },
        },
        {
          image: IMG.skyFestival,
          name: "Chiang Mai Sky Festival",
          line: "A separate ticketed release earlier in the month — the fallback when Yi Peng night is sold out.",
          tag: "Early November",
          item: {
            kind: "activity",
            label:
              "Chiang Mai Sky Festival lantern release (early November 2026)",
            short: "Chiang Mai Sky Festival",
          },
        },
      ],
    },
    // ── Pick a vibe ──
    // Five route shapes. A shape is a whole trip request, not a bookable
    // element, so these seed their prompt instead of saving to the tray.
    {
      type: "cards",
      rail: true,
      ctaLabel: "Create this plan →",
      ctaTone: "dark",
      heading: {
        eyebrow: "Multi-city · swipe",
        lead: "Pick a",
        accent: "vibe",
      },
      cards: [
        {
          image: PickAVibe.chiangMai,
          name: "Lanterns and the north",
          line: "Chiang Mai · Chiang Rai · Bangkok — the festival, the temples, the markets.",
          tag: "6 nights · November",
          prompt: PROMPTS.lanternsNorth,
        },
        {
          image: PickAVibe.kohJum,
          name: "Islands, slowly",
          line: "Krabi · Koh Lanta · Koh Jum — longtails, snorkelling, and days with nothing in them.",
          tag: "9 nights",
          prompt: PROMPTS.islandsSlowly,
        },
        {
          image: PickAVibe.phuket,
          name: "One city, one beach",
          line: "Bangkok · Phuket — the simplest first trip. Two bases, one internal flight.",
          tag: "5 nights · first time",
          prompt: PROMPTS.cityAndBeach,
        },
        {
          image: PickAVibe.pattaya,
          name: "Loud week with friends",
          line: "Bangkok · Pattaya · Phuket — nightlife, beach clubs and island days, six of you.",
          tag: "7 nights · friends",
          prompt: PROMPTS.loudWeek,
        },
        {
          image: PickAVibe.trek,
          name: "Kayaks, caves and cooking",
          line: "Krabi · Chiang Mai — half sea, half hills, hands-on the whole way.",
          tag: "8 nights · active",
          prompt: PROMPTS.kayaksCavesCooking,
        },
      ],
    },
    // ── Days worth building around ──
    // Real `ancillaries_activity` rows. These save rather than seed: a day out
    // is a day inside a trip, not a trip, so "+ Add experience" drops it in the
    // tray and the docked bar builds the route around it.
    {
      type: "cards",
      rail: true,
      selectable: true,
      itemKind: "activity",
      // The pill names the kind of thing it saves, so it reads "+ Add activity"
      // — same as every other activity row on the site. The section heading is
      // where the editorial word ("days worth building around") belongs; the
      // button is where the reader needs to know what lands in the tray.
      addNoun: "activity",
      heading: {
        lead: "Days worth",
        accent: "building around",
        note: "Tap one and I'll shape the route so the day actually fits",
      },
      cards: [
        {
          image: IMG.hong,
          name: "Hong Island lagoon by longtail boat",
          line: "Private island-hopping into the hidden lagoon, snorkel stops on the way back.",
          tag: "Krabi",
          activityId: ACTIVITY.hongLagoon,
        },
        {
          image: IMG.bond,
          name: "James Bond Island with canoeing",
          line: "Big boat out to Phang Nga Bay, then the sea caves by canoe.",
          tag: "Phuket",
          activityId: ACTIVITY.jamesBond,
        },
        {
          image: IMG.plankton,
          name: "Bioluminescent plankton and sunset",
          line: "Islands and sunset first, then glowing water after dark.",
          tag: "Krabi",
          activityId: ACTIVITY.plankton,
        },
        {
          image: IMG.cook,
          name: "Thai Charm cooking class with meal",
          line: "Market first, wok second — four dishes you'll cook again at home.",
          tag: "Krabi",
          activityId: ACTIVITY.cookingClass,
        },
        {
          image: IMG.trek,
          name: "Khao Hon Nak trek with lunch",
          line: "A limestone ridge nobody climbs, panoramic at the top, lunch at the bottom.",
          tag: "Krabi",
          activityId: ACTIVITY.khaoHonNak,
        },
        {
          image: IMG.chiangDao,
          name: "Chiang Dao cave trekking",
          line: "Limestone caves and waterfall climbs, a full day out of the city.",
          tag: "Chiang Mai",
          activityId: ACTIVITY.chiangDao,
        },
        {
          image: IMG.cityTour,
          name: "Customise your own city tour",
          line: "Build the day yourself — temples, markets, and the lantern-release spots in November.",
          tag: "Chiang Mai",
          activityId: ACTIVITY.cityTour,
        },
        {
          image: IMG.chiangRai,
          name: "Chiang Rai guided day trip",
          line: "The White Temple, the Blue Temple and the hills between them.",
          tag: "Chiang Mai",
          activityId: ACTIVITY.chiangRai,
        },
        {
          image: IMG.grandPalace,
          name: "Grand Palace, floating and railway markets",
          line: "The palace at opening, then the two markets outside the city in one run.",
          tag: "Bangkok",
          // No catalog id in the brief for this one — it saves by name, which is
          // what a card without an `activityId` does.
          item: {
            kind: "activity",
            label: "Grand Palace, floating and railway markets (Bangkok)",
            short: "Grand Palace + markets",
          },
        },
        {
          image: IMG.cycling,
          name: "Khlong Toei market and Bang Krachao by bike",
          line: "The wholesale market at dawn, then the city's green lung on two wheels.",
          tag: "Bangkok",
          activityId: ACTIVITY.khlongToei,
        },
        {
          image: IMG.kite,
          name: "Kitesurfing lesson with a pro",
          line: "One hour, one instructor, and the wind on the east shore.",
          tag: "Koh Phangan",
          activityId: ACTIVITY.kitesurf,
        },
      ],
    },
    // ── Pick a base ──
    // Six cities, each linking to its own destination page — that is where the
    // full activity list for the city lives, and "check what's there" is a
    // different question from "add this to my trip".
    {
      type: "gradient",
      columns: 6,
      mobileGrid: true,
      heading: {
        eyebrow: "Where you'd actually sleep",
        lead: "Pick a",
        accent: "base",
      },
      cards: [
        {
          name: "Krabi",
          meta: "3 – 4 nights · longtails",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #0b6b78, #e0f0f2 190%)",
          image: CITY.krabi,
          href: "/asia/thailand/krabi/krabi",
        },
        {
          name: "Bangkok",
          meta: "2 – 3 nights · markets",
          emoji: "🛺",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: CITY.bangkok,
          href: "/asia/thailand/bangkok/bangkok",
        },
        {
          name: "Chiang Mai",
          meta: "3 nights · the north",
          emoji: "🛕",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: CITY.chiangMai,
          href: "/asia/thailand/chiang_mai_province/chiang_mai",
        },
        {
          name: "Phuket",
          meta: "2 – 3 nights · boats",
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #16324f, #0b6b78 160%)",
          image: CITY.phuket,
          href: "/asia/thailand/phuket_province/phuket",
        },
        {
          name: "Koh Phangan",
          meta: "3 nights · the Gulf",
          emoji: "🌊",
          gradient: "linear-gradient(150deg, #1f8a5a, #e0f0f2 200%)",
          image: CITY.phangan,
          href: "/asia/thailand/surat_thani/koh_phangan",
        },
        {
          name: "Pattaya",
          meta: "2 nights · cabaret",
          emoji: "🎭",
          gradient: "linear-gradient(150deg, #3d4f7a, #f0e9d6 200%)",
          image: CITY.pattaya,
          href: "/asia/thailand/chonburi/pattaya",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
    // ── Restaurants and cafés (dark) ──
    // Real `geos_restaurant` rows — the rating and review count are the
    // listing's own, so a card can't drift from what the drawer shows.
    {
      type: "eats",
      rail: true,
      selectable: true,
      itemKind: "restaurant",
      addNoun: "table",
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
          image: IMG.chaixi,
          name: "Chaixi Bameekiao Noodles",
          city: "Koh Tao",
          line: "Massaman curry, pad thai and stir-fried basil, a minute off Sairee Beach.",
          rating: "5.0",
          reviews: "569",
          href: `${PAGE}?restaurant_id=${RESTAURANT.chaixi}`,
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
          image: IMG.kohMook,
          name: "Koh Mook Lae Lay Seafood",
          city: "Koh Muk",
          line: "Stir-fried squid in its own ink, and a Long Island as the sun goes down.",
          rating: "5.0",
          reviews: "200",
          href: `${PAGE}?restaurant_id=${RESTAURANT.kohMook}`,
        },
        {
          image: IMG.chanjao,
          name: "CHANJAO Restaurant & Bar",
          city: "Koh Muk",
          line: "Fish curry, vegetable tempura, and fried banana with pineapple after.",
          rating: "5.0",
          reviews: "40",
          href: `${PAGE}?restaurant_id=${RESTAURANT.chanjao}`,
        },
        {
          image: IMG.tangBbq,
          name: "TANG B.B.Q",
          city: "Koh Jum",
          line: "Whole fish or chicken, slow-cooked twelve hours, with papaya salad alongside.",
          rating: "5.0",
          reviews: "24",
          href: `${PAGE}?restaurant_id=${RESTAURANT.tangBbq}`,
        },
        {
          image: IMG.villageFarm,
          name: "The Village Farm To Café",
          city: "Kanchanaburi",
          line: "Dirty coffee and a kurobuta pork burger, twenty-five thousand reviews deep.",
          rating: "4.9",
          reviews: "25,761",
          href: `${PAGE}?restaurant_id=${RESTAURANT.villageFarm}`,
        },
      ],
    },
    // ── Visa ──
    // One country, so the card carries a `line`: a bare "Free" floating in a
    // full-width column reads like the section failed to load, and the thing a
    // reader actually needs here is what to carry, not what to pay.
    {
      type: "visa",
      heading: {
        eyebrow: "Indian passport · no embassy visit",
        lead: "Your visa,",
        accent: "handled",
      },
      intro:
        "Thailand waives the visa fee for Indian passports on stays under 60 days — you land, you get stamped. We still check your return ticket, funds proof and hotel confirmations before you fly, because those are what get people turned around at immigration.",
      cards: [
        {
          country: "Thailand",
          cities: "Visa-free · 60 days · stamped on arrival",
          fee: "Free",
          line:
            "Extendable once at an immigration office inside the country, which is worth knowing before you book a return you can't move. The free digital arrival card is separate and due within 72 hours of landing — we send that link with your documents.",
          href: VISA_URL,
        },
      ],
      facts: [
        { label: "Fee", value: "Free" },
        { label: "Processing", value: "On arrival" },
        { label: "Stay", value: "60 days" },
        { label: "Carry", value: "4 papers" },
      ],
      note:
        "Return ticket, funds proof, hotel confirmations and insurance are the four papers immigration asks for. Nothing is filed in advance — the work is making sure you land with the right file.",
    },
    // ── When to actually go ──
    // The two coasts are on opposite monsoons, which is the whole planning
    // problem on this page and the reason the season rows are written by coast.
    {
      type: "months",
      heading: {
        eyebrow: "Two coasts, opposite monsoons",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Nov – Feb",
          name: "Cool and dry · best overall",
          line: "Both coasts behave. Yi Peng lands on November's full moon, and Chiang Mai sells out six months out.",
        },
        {
          range: "Mar – May",
          name: "Hot season · sweet spot",
          line: "Warmest water of the year and thinning crowds. Songkran in mid-April is worth planning around, either way.",
        },
        {
          range: "Jun – Sep",
          name: "Andaman monsoon · go east",
          line: "Krabi and Phuket get rough seas and cancelled boats. Koh Samui, Koh Phangan and the Gulf stay fine.",
        },
        {
          range: "Oct",
          name: "The shoulder · best value",
          line: "Rain easing, everything green, prices at their lowest right before the season turns.",
        },
      ],
      note:
        "The one rule worth remembering: June to September, book the Gulf, not the Andaman. Same country, same week, and only one of the two coasts will run its boat days.",
    },
    // ── Pick a plan ──
    // Existing itineraries rather than prompts: each card opens the real thread,
    // priced and already built, so `href` wins over any prompt.
    {
      type: "trips",
      layout: "stacked",
      // One row at every breakpoint. There are four plans and the stacked grid
      // is 3-up, which stranded the fourth on a line of its own.
      rail: true,
      tone: "band",
      ctaLabel: "Open this plan →",
      heading: {
        eyebrow: "Priced · rated · bookable today",
        lead: "Pick a",
        accent: "plan",
        note: "Prices from · searched live on your dates",
      },
      cards: [
        {
          image: CITY.pattaya,
          tag: "Friends · ★ 4.9",
          name: "Pattaya, Party, Repeat",
          line: "Bangkok and Pattaya, a road transfer apart. Cabaret, Muay Thai and the shortest possible flight bill.",
          price: "₹62,000 / person",
          nights: "3 nights",
          includes: ["Flights", "2 stays", "Cabaret", "Muay Thai"],
          href: `${SITE}/chat/${PLAN.pattaya}`,
        },
        {
          image: CITY.phuket,
          tag: "Friends · ★ 4.8",
          name: "Thai Me Away",
          line: "Bangkok for the food, then Phuket for the boats. Phi Phi is the day everyone remembers.",
          price: "₹84,000 / person",
          nights: "5 nights",
          includes: ["Flights", "2 stays", "Phi Phi day"],
          href: `${SITE}/chat/${PLAN.thaiMeAway}`,
        },
        {
          image: CITY.krabi,
          tag: "Family · ★ 4.8",
          name: "Thai'd Together",
          line: "Krabi and Phuket with the four-island tour in the middle — the easiest version with kids along.",
          price: "₹96,000 / person",
          nights: "6 nights",
          includes: ["Flights", "2 stays", "4-island tour"],
          href: `${SITE}/chat/${PLAN.thaidTogether}`,
        },
        {
          image: CITY.samui,
          tag: "Couple · ★ 4.8",
          name: "Thai Me Up",
          line: "Bangkok, Krabi and Phuket over ten nights. Five stays, ferries and transfers all handled.",
          price: "₹1,32,517 / person",
          nights: "10 nights",
          includes: ["Flights", "5 stays", "Ferries", "Transfers"],
          href: `${SITE}/chat/${PLAN.thaiMeUp}`,
        },
      ],
    },
    // ── Other themes ──
    // Paired with "Other countries" below into the half-and-half row (adjacent
    // gradient sections pair). Both reuse the images those pages already ship.
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Planning around",
        accent: "an occasion?",
      },
      columns: 4,
      cards: [
        {
          name: "Thailand bachelor",
          meta: "Groups of 6+",
          emoji: "🕺",
          gradient: "linear-gradient(150deg, #0d7f8f, #e2f2f4 190%)",
          image: THEME_IMG.thailandBachelor,
          href: "/theme/thailand-bachelor",
        },
        {
          name: "Thailand + Bali offbeat",
          meta: "Quiet islands · Nov – Apr",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #0e7a55, #e2f2ea 190%)",
          image: THEME_IMG.thailandBaliOffbeat,
          href: "/theme/thailand-bali-offbeat",
        },
        {
          name: "Honeymoon",
          meta: "Slow · two of you",
          emoji: "🫶",
          gradient: "linear-gradient(150deg, #a8556b, #f8ebef 190%)",
          image: THEME_IMG.honeymoon,
          href: "/theme/honeymoon",
        },
        {
          name: "Filmy getaways",
          meta: "Bollywood + Hollywood",
          emoji: "🎬",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: THEME_IMG.filmy,
          href: "/theme/filmy-getaways",
        },
      ],
    },
    // ── Other countries ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other countries",
        lead: "Or somewhere",
        accent: "else entirely",
      },
      columns: 6,
      cards: [
        {
          name: "Indonesia",
          meta: "Bali · the Nusas · Gilis",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: COUNTRY.indonesia,
          href: "/asia/indonesia",
        },
        {
          name: "Vietnam",
          meta: "Hanoi · Hoi An · Ha Long",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #1f8a5a, #16324f 170%)",
          image: COUNTRY.vietnam,
          href: "/asia/vietnam",
        },
        {
          name: "Japan",
          meta: "Tokyo · Kyoto · Hokkaido",
          emoji: "⛩️",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: COUNTRY.japan,
          href: "/asia/japan",
        },
        {
          name: "Singapore",
          meta: "Easiest add-on to Bangkok",
          emoji: "🌃",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: COUNTRY.singapore,
          href: "/asia/singapore",
        },
        {
          name: "Malaysia",
          meta: "Langkawi · Kuala Lumpur",
          emoji: "🏙️",
          gradient: "linear-gradient(150deg, #0b6b78, #f0e9d6 200%)",
          image: COUNTRY.malaysia,
          href: "/asia/malaysia",
        },
        {
          name: "Sri Lanka",
          meta: "Tea country · the south coast",
          emoji: "🐘",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          image: COUNTRY.srilanka,
          href: "/asia/sri_lanka",
        },
      ],
    },
    // ── How it works ──
    // The closing block. Everything above is a way in; this is what happens
    // after one is tapped.
    // {
    //   type: "steps",
    //   heading: {
    //     eyebrow: "No markups · pay only for what you book",
    //     lead: "Sketch it.",
    //     accent: "I'll finish it.",
    //   },
    //   cta: { label: "Start planning →", prompt: PROMPTS.firstTime },
    //   ctaNote: "10,000+ trips · rated 4.9",
    //   rows: [
    //     {
    //       n: "01",
    //       title: "Tap what you want",
    //       line: "Experiences, bases and tables land in your list.",
    //     },
    //     {
    //       n: "02",
    //       title: "Two questions",
    //       line: "Dates and how many of you. That's the whole form.",
    //     },
    //     {
    //       n: "03",
    //       title: "Priced in ~90 seconds",
    //       line: "Flights, stays, boats and transfers — searched live.",
    //     },
    //   ],
    // },
  ],
  askBar: {
    placeholder: "Which coast works for my month?",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
    buildCta: "Build trip",
  },
};

const ThailandCountryPage = ({
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
    <Layout page="Country Page" destination="Thailand" slug={THEME_SLUG}>
      <Head>
        <title>
          Thailand Trip Packages &amp; Itineraries from India | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a Thailand trip with The Tarzan Way's AI itinerary — Krabi and the Andaman islands, Chiang Mai and the Yi Peng lantern festival, Bangkok, Phuket and the Gulf. Experiences, stays, visa and flights, priced live."
        />
        <meta
          property="og:title"
          content="Thailand Trip Packages & Itineraries from India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a Thailand trip with The Tarzan Way's AI itinerary — Krabi and the Andaman islands, Chiang Mai and the Yi Peng lantern festival, Bangkok, Phuket and the Gulf. Experiences, stays, visa and flights, priced live."
        />
        <link rel="canonical" href={`${SITE}/asia/thailand`} />
        <meta property="og:url" content={`${SITE}/asia/thailand`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "TouristDestination",
                  name: "Thailand",
                  description:
                    "Plan a Thailand trip with The Tarzan Way's AI itinerary — Krabi and the Andaman islands, Chiang Mai and the Yi Peng lantern festival, Bangkok, Phuket and the Gulf.",
                  url: `${SITE}/asia/thailand`,
                  image: `${SITE}/og-image.png`,
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: SITE,
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Asia",
                      item: `${SITE}/asia`,
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: "Thailand",
                      item: `${SITE}/asia/thailand`,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={thailandConfig}
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

export default connect(null, mapDispatchToProps)(ThailandCountryPage);
