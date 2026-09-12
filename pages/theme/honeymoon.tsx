// pages/theme/honeymoon.tsx
//
// Honeymoon — an editorial, cinematic theme landing (the "Honeymoon Theme"
// mockup) built from the reusable CinematicThemeLanding component. Every card
// either seeds its prompt into a fresh /chat session with Kaira or opens the
// read-only catalog drawer for the element behind it. The page is wrapped in
// the shared site Layout so it keeps the standard header + footer.

import { SITE_ORIGIN } from "../../lib/seo/siteOrigin";
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
import {
  promptIntakeMap,
  type ThemePromptIntent,
} from "../../components/theme/cinematic/themeIntake";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
// import ActivityDetailsDrawer from "../../components/drawers/activityDetails/ActivityDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const VISA = "https://visa.thetarzanway.com/country";
const VISA_HOME = "https://visa.thetarzanway.com/";
const CHAT = `${SITE_ORIGIN}/chat`;
const THEME_SLUG = "honeymoon";

// Catalog activity ids for the evening and day-trip cards. Every one is a live
// `ancillaries_activity` row, so the card and the element saved to the trip are
// the same product.
//
// The old `baliWaterfalls` id (86b16fc4…) is gone: that row is is_live = false
// in the catalog. `ubudWaterfalls` below is the live tour of the same sights.
const ACTIVITY = {
  santoriniVolcano: "1d5aa440-d922-4045-8893-d10d12658ca1",
  santoriniScuba: "586c5cd1-eead-454c-bdcf-78bf1e20aa72",
  baliCooking: "903b1346-ad4d-4d13-872c-a3d0217d0a59",
  nusaPenida: "869561b9-4df3-4b11-b335-1286abd4e178",
  exploreMale: "7556e2cd-70e4-454f-a76b-410bdf4fa54a",
  // Evenings
  jimbaranSunset: "c3cfb1a5-c2fc-404f-b787-7091a9d1da67",
  veniceGondola: "65febd05-493b-4555-9361-8aa39f70276d",
  seineDinner: "7f7ec786-4d79-473f-bb51-8f9c854e99e8",
  dubaiSky: "45540f89-bd44-47cf-8934-ec8569cd8bc9",
  tokyoYakatabune: "2cc55e19-b1e3-4017-ae75-57ae0e070f27",
  mykonosSunset: "bdd7f05a-62bc-46dd-a49f-de962cd2df27",
  // Days
  ubudWaterfalls: "9ff61c8a-c81a-4949-a2b8-9e218d84d9a5",
  baliHighlights: "fc630af4-a673-45ce-946d-3065f44ae986",
  phuketIslands: "24cdff2c-0ff8-4bde-bbb0-2e09c822eb2d",
  lucerneHangGliding: "4ffd8a6b-ff0b-4a32-9448-22a76504532a",
  pilatusGolden: "034d644a-332d-41ca-8b89-322d3aa92d09",
  hoiAnAncientTown: "cef545a8-cb2f-4ec9-8ee4-d54090834fbf",
  athensAcropolis: "fb8a1eee-a48e-4450-8931-c45d1f86941b",
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
  // Evenings
  jimbaranSunset: `${MEDIA}/media/activities/169089287587730145454406738281.jpg`,
  veniceGondola: `${MEDIA}/media/activities/169089717550199532508850097656.jpg`,
  seineDinner: `${MEDIA}/media/activities/176224693046543216705322265625.jpg`,
  dubaiSky: `${MEDIA}/media/activities/176786723916710710525512695312.webp`,
  tokyoYakatabune: `${MEDIA}/media/activities/171315948289299941062927246094.jpg`,
  mykonosSunset: `${MEDIA}/media/activities/169089677861731982231140136719.jpg`,
  // Days
  ubudWaterfalls: `${MEDIA}/media/activities/171326529611966514587402343750.jpg`,
  baliHighlights: `${MEDIA}/media/activities/169089831035809040069580078125.jpg`,
  phuketIslands: `${MEDIA}/media/activities/169089315990529751777648925781.jpg`,
  phuketSunset: `${MEDIA}/media/activities/171328217966311955451965332031.jpg`,
  lucerneHangGliding: `${MEDIA}/media/activities/177081241165963554382324218750.png`,
  pilatusGolden: `${MEDIA}/media/activities/171328020515271735191345214844.jpg`,
  pilatusCableCar: `${MEDIA}/media/activities/171328004974621701240539550781.jpg`,
  // Stored with a stray "/" before the extension — that is the actual key in
  // the catalog, and the CDN serves it, so it ships exactly as recorded.
  hoiAnAncientTown: `${MEDIA}/media/activities/173156325334933853149414062500/.png`,
  athensAcropolis: `${MEDIA}/media/activities/169089074913606834411621093750.jpg`,
  krabiIslands: `${MEDIA}/media/activities/175646581281492352485656738281.jpg`,
  halongCruise: `${MEDIA}/media/activities/169090226387135028839111328125.jpg`,
};
// Covers for the "Other themes" tiles that live on another theme page — each
// is that page's own artwork, so the tile and the page it opens agree.
const THEME_IMG = {
  christmasMarkets: `${CDN}/media/website/christmas-markets-2026/market-vienna-hq.jpg`,
  northernLights: `${CDN}/media/website/northern-lights-2026/Sleep%20Beneath%20The%20Aurora.jpg`,
  filmy: `${CDN}/media/website/filmy-getaways-2026/DilChahtaHai.png`,
};

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  hero:
    "We are 2 travellers (a couple) planning our honeymoon for 7 nights in November, and our travel dates are flexible. Help us pick the right destination, then build the itinerary around privacy, beautiful stays, sunsets and slow mornings. Balance a few unforgettable experiences with real downtime, and keep hotel changes to a minimum.",
  // Chips
  maldivesVilla:
    "We are 2 travellers (a couple) going for 6 nights in November, and our travel dates are flexible. We want a romantic Maldives honeymoon centered around an overwater villa. Prioritize privacy, crystal-clear lagoons, floating breakfasts, snorkeling, sunset cruises, candlelight dinners, spa experiences, and slow mornings with plenty of time to simply relax together.",
  baliSantoriniChip:
    "We are 2 travellers (a couple) going for 7 nights in September, and our travel dates are flexible. We want a honeymoon combining Bali and Santorini. Include private pool villas, wellness experiences, waterfalls, rice terraces, cafés, and beach clubs in Bali before continuing to Santorini for caldera sunsets, boutique cave hotels, wine tastings, scenic walks, and romantic dinners. Balance adventure with relaxation.",
  quietPrivate:
    "We are 2 travellers (a couple) going for 7 nights in November, and our travel dates are flexible. We want a peaceful honeymoon focused on privacy and uninterrupted time together. Prioritize secluded luxury stays, beautiful beaches, private pools, spa treatments, scenic viewpoints, sunset experiences, intimate dining, and slow travel. Keep the itinerary relaxed with minimal hotel changes and plenty of free time.",
  allInclusive:
    "We are 2 travellers (a couple) going for 6 nights in November, and our travel dates are flexible. We want an all-inclusive honeymoon where everything is taken care of. Prioritize luxury resorts with meals included, premium experiences, spa access, water activities, romantic dinners, sunset cruises, and seamless transfers. The itinerary should be effortless, relaxing, and focused on enjoying our time together without worrying about logistics.",
  // Routes — "Pick your honeymoon"
  overwater:
    "We are 2 travellers (a couple), and our travel dates in November are flexible. We want a 6-night honeymoon in the Maldives centered around a luxury overwater villa. Prioritize privacy, turquoise lagoons, snorkeling, sunset cruises, candlelight dinners, spa experiences, floating breakfasts, and slow mornings with plenty of downtime. Create a romantic itinerary focused on relaxation, luxury, and unforgettable moments rather than sightseeing.",
  twoIslands:
    "We are 2 travellers (a couple), and our travel dates in September are flexible. We want a 7-night honeymoon combining Bali and Santorini. Begin with Bali's tropical jungles, wellness experiences, waterfalls, private pool villas, and peaceful cafés before continuing to Santorini for whitewashed villages, caldera sunsets, wine tastings, romantic dinners, and boutique cave hotels. Balance relaxation, romance, and iconic experiences at a comfortable pace.",
  ruinsAndWine:
    "We are 2 travellers (a couple), and our travel dates in September are flexible. We want an 8-night romantic honeymoon through Santorini and Athens. Prioritize breathtaking sunsets, boutique cave hotels, scenic coastal walks, wine tastings, private sailing experiences, charming cafés, and romantic dinners in Santorini before exploring Athens' ancient landmarks, hidden neighborhoods, rooftop restaurants, and authentic Greek culture. Keep the itinerary relaxed with plenty of time to enjoy each destination together.",
  villaThenCliffs:
    "We are 2 travellers (a couple), and our travel dates in October are flexible. We want a 9-night honeymoon that starts in the Maldives and finishes in Bali. Begin with an overwater villa - lagoon swims, floating breakfasts, snorkeling and completely unscheduled mornings - then continue to Bali for a private pool villa, waterfalls, rice terraces, cliffside sunsets and beach clubs. Keep the first half empty and the second half easy-paced.",
  seychellesThreeIslands:
    "We are 2 travellers (a couple), and our travel dates in October are flexible. We want a 7-night Seychelles honeymoon across Mahé, Praslin and La Digue. Prioritize granite boulder beaches, a beachfront boutique stay on each island, inter-island ferries, snorkeling, nature trails, Creole dinners and a private beach picnic. Keep the pace unhurried with plenty of free time and minimal scheduling.",
  alpsAndAegean:
    "We are 2 travellers (a couple), and our travel dates in June are flexible. We want a 12-night honeymoon that starts in Switzerland and finishes in Santorini. Begin with scenic train journeys, lakeside towns, mountain excursions and Alpine villages, then fly south for caldera sunsets, a cave hotel, wine tastings, private sailing and seaside dinners. Two climates in one trip, at a comfortable pace with minimal repacking.",
  slowJapan:
    "We are 2 travellers (a couple), and our travel dates in November are flexible. We want a 10-night honeymoon through Tokyo, Hakone and Kyoto. Prioritize a Hakone ryokan with a private onsen, autumn colours, quiet temple mornings in Kyoto, neighbourhood food walks, a tea ceremony and easy rail travel between the three. Keep the pace slow with real downtime rather than a sightseeing checklist.",
  europeByRail:
    "We are 2 travellers (a couple), and our travel dates in June are flexible. We want an 11-night honeymoon by train through Paris, Interlaken and Venice. Prioritize one rail pass, romantic city stays, a Seine evening cruise, Alpine day trips from Interlaken, and a gondola and quiet canals in Venice. Build it around scenic rail legs and slow evenings rather than rushing between sights.",
  vietnamGently:
    "We are 2 travellers (a couple), and our travel dates in March are flexible. We want an 8-night gentle honeymoon through Hanoi, Ha Long Bay and Hoi An. Prioritize an overnight Ha Long cruise, the old quarter, lantern-lit Hoi An evenings, a tailor visit, quiet beaches and unhurried food walks. Keep the itinerary relaxed with short travel days.",
  // The "Pick a plan" trips carry no prompt — each card opens a finished
  // itinerary at /chat/{id} instead of seeding a fresh session.
  // Ask Kaira
  askBar:
    "Which honeymoon should we do in November, just the two of us - the Maldives overwater villa, Bali and Santorini together, or Santorini and Athens? Compare privacy, cost, flying time and the best months for each, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. The month follows the destination rather than the
// theme — November for the Maldives dry season, September for Bali's dry
// season and for the Greek islands, October for the Seychelles inter-monsoon
// calm. All of them sit in the Sep–Mar window, so none resolves to a month
// that has already gone.
//
// `askBar` deliberately carries no `nights`: it asks Kaira to compare a 6, a 7
// and an 8-night honeymoon, so pinning one length would answer it for her.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  hero: { nights: 7, month: 11, who: "Couple" },
  maldivesVilla: { nights: 6, month: 11, who: "Couple" },
  baliSantoriniChip: { nights: 7, month: 9, who: "Couple" },
  quietPrivate: { nights: 7, month: 11, who: "Couple" },
  allInclusive: { nights: 6, month: 11, who: "Couple" },
  overwater: { nights: 6, month: 11, who: "Couple" },
  twoIslands: { nights: 7, month: 9, who: "Couple" },
  ruinsAndWine: { nights: 8, month: 9, who: "Couple" },
  villaThenCliffs: { nights: 9, month: 10, who: "Couple" },
  seychellesThreeIslands: { nights: 7, month: 10, who: "Couple" },
  alpsAndAegean: { nights: 12, month: 6, who: "Couple" },
  slowJapan: { nights: 10, month: 11, who: "Couple" },
  europeByRail: { nights: 11, month: 6, who: "Couple" },
  vietnamGently: { nights: 8, month: 3, who: "Couple" },
  askBar: { month: 11, who: "Couple" },
});

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
      "Somewhere between the wedding and real life there is one trip where nothing is scheduled. Tell me the shape you want and I'll build the rest - the villa, the transfers, the one dinner you'll still talk about.",
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
    // ── Evenings ──
    // The mockup's "Evenings you'll both remember" rail, and the first thing
    // under the hero exactly as the mockup has it: the page opens on one thing
    // to tap, not on a menu of trip shapes to choose between.
    //
    // `tone: "dark"` is the mockup's inset ink panel — 28px radius inside the
    // page gutter, the yellow radial glow off its top-right corner, a yellow
    // heading and a rail of ink cards. Six evenings from around the world, then
    // the four candlelit dinners this page has always carried; same category,
    // so they belong on the same shelf rather than in a list of their own.
    // Every card is a live catalog activity and a click anywhere on it adds or
    // removes the evening; the pill is the affordance.
    {
      type: "cards",
      tone: "dark",
      selectable: true,
      itemKind: "activity",
      addNoun: "evening",
      rail: true,
      heading: { lead: "Evenings you'll both", accent: "remember" },
      cards: [
        {
          image: CAT.jimbaranSunset,
          name: "Uluwatu temple, kecak dance and Jimbaran Bay",
          line: "Cliff temple at golden hour, then grilled seafood on the sand.",
          tag: "Jimbaran",
          activityId: ACTIVITY.jimbaranSunset,
        },
        {
          image: CAT.veniceGondola,
          name: "Grand Canal by gondola",
          line: "The one cliché worth doing - with live commentary.",
          tag: "Venice",
          activityId: ACTIVITY.veniceGondola,
        },
        {
          image: CAT.seineDinner,
          name: "3-course dinner cruise on the Seine",
          line: "The city lit up, a table for two on the water.",
          tag: "Paris",
          activityId: ACTIVITY.seineDinner,
        },
        {
          image: CAT.dubaiSky,
          name: "Dinner in the Sky",
          line: "A table 50 metres up. The stopover that upgrades the trip.",
          tag: "Dubai",
          activityId: ACTIVITY.dubaiSky,
        },
        {
          image: CAT.tokyoYakatabune,
          name: "Yakatabune dinner cruise on the Sumida",
          line: "A traditional boat, kaiseki courses, the skyline drifting by.",
          tag: "Tokyo",
          activityId: ACTIVITY.tokyoYakatabune,
        },
        {
          image: CAT.mykonosSunset,
          name: "Sunset cruise with drinks",
          line: "The Aegean at dusk, drinks included.",
          tag: "Mykonos",
          activityId: ACTIVITY.mykonosSunset,
        },
        {
          image: CAT.dinnerUbud,
          name: "6-course candlelight dinner in the valley",
          line: "Six courses above the Ubud valley, under the stars. 3 hours.",
          tag: "Ubud",
          activityId: DINNER.ubud,
        },
        {
          image: CAT.dinnerSeminyak,
          name: "Island romantic candlelight dinner",
          line: "Ocean views, live violin, and a table set on the sand.",
          tag: "Seminyak",
          activityId: DINNER.seminyak,
        },
        {
          image: CAT.dinnerNusaPenida,
          name: "Candlelight dinner under the stars",
          line: "Three courses on the quietest of the three islands.",
          tag: "Nusa Penida",
          activityId: DINNER.nusaPenida,
        },
        {
          image: CAT.dinnerSantorini,
          name: "Private candlelight dinner",
          line: "An intimate table with the caldera going gold behind it.",
          tag: "Santorini",
          activityId: DINNER.santorini,
        },
      ],
    },
    // ── Routes ──
    {
      type: "cards",
      ctaLabel: "Create this plan →",
      // Nine shapes, so the row stays a rail at every width. The 3-up grid it
      // would otherwise fall into from md breaks the set across three bands and
      // it stops reading as one shelf of options.
      rail: true,
      heading: {
        eyebrow: "Multi-city · swipe",
        lead: "Pick a shape,",
        accent: "I will fill it in",
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
        {
          image: CAT.nusaPenida,
          name: "Villa First, Cliffs After",
          line: "Maldives → Bali",
          tag: "9 nights",
          prompt: PROMPTS.villaThenCliffs,
        },
        {
          image: CAT.seychellesBeach,
          name: "Granite Beaches, No Crowds",
          line: "Mahé → Praslin → La Digue",
          tag: "7 nights",
          prompt: PROMPTS.seychellesThreeIslands,
        },
        {
          image: CAT.pilatusCableCar,
          name: "Alps, Then the Aegean",
          line: "Switzerland → Santorini",
          tag: "12 nights",
          prompt: PROMPTS.alpsAndAegean,
        },
        {
          image: CAT.tokyoYakatabune,
          name: "Slow Japan",
          line: "Tokyo → Hakone ryokan → Kyoto",
          tag: "10 nights",
          prompt: PROMPTS.slowJapan,
        },
        {
          image: CAT.veniceGondola,
          name: "Europe by Rail",
          line: "Paris → Interlaken → Venice",
          tag: "11 nights",
          prompt: PROMPTS.europeByRail,
        },
        {
          image: CAT.halongCruise,
          name: "Vietnam, Gently",
          line: "Hanoi → Ha Long → Hoi An",
          tag: "8 nights",
          prompt: PROMPTS.vietnamGently,
        },
      ],
    },
    // ── Experiences (card click opens the drawer; "+ Add" saves to the trip) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      rail: true,
      heading: { lead: "Days worth building around" },
      cards: [
        {
          image: CAT.santoriniVolcano,
          name: "Volcano, hot springs and Oia sunset boat trip",
          line: "One boat, one day - the caldera, a hot-spring swim, and the sunset everyone comes for.",
          tag: "Santorini",
          activityId: ACTIVITY.santoriniVolcano,
        },
        {
          image: CAT.santoriniScuba,
          name: "Scuba diving in the volcanic caldera",
          line: "A dive inside an active volcano's crater - one of the few places on earth you can.",
          tag: "Santorini",
          activityId: ACTIVITY.santoriniScuba,
        },
        {
          image: CAT.ubudWaterfalls,
          name: "Waterfalls, water temple and rice terraces - private",
          line: "Your own car and guide through Ubud's postcard sights, paced so it never feels like a checklist.",
          tag: "Ubud",
          activityId: ACTIVITY.ubudWaterfalls,
        },
        {
          image: CAT.baliCooking,
          name: "Balinese cooking class and market tour",
          line: "A market walk, then a hands-on class - the one thing you can actually take home.",
          tag: "Bali",
          activityId: ACTIVITY.baliCooking,
        },
        {
          image: CAT.nusaPenida,
          name: "Nusa Penida full-day island tour",
          line: "Cliffs, hidden beaches and the view every Bali feed is built from - transfers done for you.",
          tag: "Bali",
          activityId: ACTIVITY.nusaPenida,
        },
        {
          image: CAT.exploreMale,
          name: "Explore Male, the capital",
          line: "A slow walk through the smallest, densest capital in the world - an easy half-day off the resort.",
          tag: "Maldives",
          activityId: ACTIVITY.exploreMale,
        },
        {
          image: CAT.baliHighlights,
          name: "Bali highlights, full day",
          line: "The rice terraces, temples and swings - one car, one day, all of it.",
          tag: "Ubud",
          activityId: ACTIVITY.baliHighlights,
        },
        {
          image: CAT.phuketIslands,
          name: "Maya, Phi Phi and Khai islands",
          line: "The blue-water triple with buffet lunch on board.",
          tag: "Phuket",
          activityId: ACTIVITY.phuketIslands,
        },
        {
          image: CAT.lucerneHangGliding,
          name: "Hang gliding over Lucerne",
          line: "Two harnesses, one lake, the story you'll tell for years.",
          tag: "Lucerne",
          activityId: ACTIVITY.lucerneHangGliding,
        },
        {
          image: CAT.pilatusGolden,
          name: "Mt. Pilatus golden round trip",
          line: "Boat out, cogwheel up, cable car down - the classic Swiss day.",
          tag: "Zurich",
          activityId: ACTIVITY.pilatusGolden,
        },
        {
          image: CAT.hoiAnAncientTown,
          name: "Hoi An ancient town with dinner",
          line: "Lantern streets, Marble Mountain and dinner on the way back.",
          tag: "Da Nang",
          activityId: ACTIVITY.hoiAnAncientTown,
        },
        {
          image: CAT.athensAcropolis,
          name: "Acropolis and museum, guided",
          line: "The Parthenon before the cruise crowds, museum after.",
          tag: "Athens",
          activityId: ACTIVITY.athensAcropolis,
        },
      ],
    },
    // ── Trips — four finished itineraries, not prompts. Each card opens the
    // real plan at /chat/{itinerary_id}.
    //
    // Copy, nights and prices all come from the itinerary itself: the route is
    // its city stops in order, and the price is `per_person_discounted_cost`
    // rounded the way the itinerary page rounds it, so the number on the card
    // is the number the visitor lands on. Re-check whenever they're re-priced.
    //
    // The section note no longer claims "flights included" — the Bali plan
    // carries no flight booking (ferry and taxis only), unlike the other two. ──
    {
      type: "trips",
      // The mockup's packaged-product card: cover photo on top, the
      // what's-included chips, a ruled price line and one ink CTA. The band
      // washes the priced plans in the page's accentSoft so they read as the
      // one commercial block between the free browsing above and below.
      //
      // `rail` because there are four: the 3-up grid strands the fourth on a
      // row of its own and the set stops reading as one shelf of plans.
      layout: "stacked",
      tone: "band",
      rail: true,
      ctaLabel: "Book this itinerary →",
      heading: {
        eyebrow: "Priced · bookable today",
        lead: "Pick a plan",
        note: "Tap a plan to open the full itinerary",
      },
      // `includes` is what the itinerary's own bookings actually carry, not a
      // generic feature list — the Maldives and Greece plans book flights, the
      // Bali one doesn't (ferry and taxis only), which is why its chips say so.
      cards: [
        {
          image: IMG.maldives,
          tag: "Couple · 3N",
          name: "The Maldives long weekend",
          line: "One lagoon resort, a speedboat from Male, and three nights with nothing scheduled.",
          price: "₹90,744 / person",
          nights: "3 nights · Maldives",
          includes: ["Flights", "1 resort", "Boat transfers"],
          urgent: "Dec – Feb villas book out six months ahead",
          href: `${CHAT}/1f212379-86d2-4588-8d6c-938148467026`,
        },
        {
          image: IMG.bali,
          tag: "Couple · 7N",
          name: "Slow Bali honeymoon",
          line: "Three nights in the Ubud valley, two on Nusa Penida's cliffs, two on the Seminyak sand.",
          price: "₹55,333 / person",
          nights: "7 nights · Bali",
          includes: ["3 stays", "6 activities", "Ferry + taxis"],
          href: `${CHAT}/a8802c37-7a27-4724-8213-4a6246e242f5`,
        },
        {
          image: IMG.greece,
          tag: "Couple · 8N",
          name: "Athens, Mykonos and Santorini",
          line: "Two nights of ruins, two on Mykonos, then three over the Santorini caldera.",
          price: "₹2,79,011 / person",
          nights: "8 nights · Greece",
          includes: ["Flights", "4 stays", "Ferries"],
          href: `${CHAT}/cedadafb-03af-47f1-992c-169a88af12e6`,
        },
        {
          image: CAT.phuketSunset,
          tag: "Couple · 10N",
          name: "Slow Thailand",
          line: "Khao Lak's quiet coast, a night in the Khao Sok rainforest, then Phuket and Bangkok.",
          price: "₹61,424 / person",
          nights: "10 nights · Thailand",
          includes: ["Flights", "4 stays", "5 activities"],
          href: `${CHAT}/4a7bab43-aab2-41a7-96db-9512a238d722`,
        },
      ],
    },
    // ── When to go ──
    // Keyed to the wedding date rather than to one destination: the reader
    // can't move the wedding, so the calendar answers "given when we marry,
    // where should we go" instead of "when should we visit the Maldives". The
    // mockup's coloured status flag has no slot in CinematicMonthRow, so it
    // opens the line instead.
    {
      type: "months",
      heading: {
        eyebrow: "One calendar, every destination",
        lead: "Match it to the",
        accent: "wedding date",
      },
      rows: [
        {
          range: "Nov – Feb",
          name: "Winter weddings",
          line: "Go south-east. Thailand, Bali and Vietnam are in their dry season - warm, clear and direct-flight easy. Europe is for the brave.",
        },
        {
          range: "Mar – May",
          name: "Spring weddings",
          line: "Japan's moment. Sakura in Japan, shoulder-season Greece, and the islands before the heat. Book Japan four months out.",
        },
        {
          range: "Jun – Sep",
          name: "Summer weddings",
          line: "Europe's turn. Swiss meadows, Italian coasts, Paris evenings. The Andaman is monsoon - skip Thailand's west coast.",
        },
        {
          range: "Oct",
          name: "The shoulder",
          line: "Best value. Everywhere is between seasons - Bali dry, Europe golden, prices at their year-low before December.",
        },
      ],
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: {
        eyebrow: "Indian passport · no embassy visit",
        lead: "Visas,",
        accent: "handled",
      },
      intro:
        "The Maldives waives the visa entirely for Indian passports - 30 days on arrival, no paperwork. Bali and Greece are where the actual filing happens, and we do both for you before you fly.",
      // The four islands this page actually sends people to. Italy and
      // Switzerland used to sit here too — lovely honeymoons, but not the ones
      // on this page.
      cards: [
        {
          country: "Maldives",
          cities: "Male · any atoll",
          fee: "₹0 Free",
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
        {
          country: "Seychelles",
          cities: "Mahé · Praslin · La Digue",
          href: VISA_HOME,
        },
      ],
      facts: [
        { label: "Fastest", value: "Maldives · 0d" },
        { label: "Slowest", value: "Greece · 15d" },
        { label: "We handle", value: "Docs + submission" },
        { label: "Embassy queue", value: "None for you" },
      ],
      note:
        "Greece is a Schengen sticker - file it at least twenty days out. The Bali e-Visa lands in a few days. Nothing here needs an embassy queue on your side.",
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
    // Link by the full 36-char itinerary uuid, never by the indexed slug: the
    // bot reads the session id off the path with /\/chat\/([a-f0-9-]{36})/
    // (BotApp `sessionIdFromUrl`), so a slug — even the real one, ending in the
    // itinerary's last uuid segment — matches nothing and the trip never loads.
    // The slug form belongs to /trips/{type}/{slug} instead.
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
          href: `${CHAT}/4a6d08ea-bb48-4497-a276-70de4ba72ec8`,
        },
        {
          rating: "4.9",
          type: "Google review",
          name: "Atal",
          when: "1 week · Bali",
          quote:
            "Cliffs, sunsets, and a plan that left room to change our minds most days.",
          href: `${CHAT}/1d73f1c3-a43a-4c56-afc2-23eedb88d7e6`,
        },
        {
          rating: "4.4",
          type: "Google review",
          name: "Arun",
          when: "5 nights · Greece",
          quote:
            "Santorini looked exactly like the version we'd saved on Pinterest for two years. Better, actually.",
          href: `${CHAT}/d6dc9ff5-7865-4dc6-934f-fe17b0eac6ce`,
        },
      ],
    },
    // ── Destinations ──
    // `meta` is the real count of couple itineraries (two adults) we have built
    // through each country, not an invented trust number — re-run the count
    // before quoting it again, because it only ever goes up. The page's own
    // four lead, then the four the evenings and day trips above reach into.
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations in this theme",
        lead: "Where I",
        accent: "send people",
      },
      columns: 4,
      mobileGrid: true,
      cards: [
        {
          name: "Maldives",
          meta: "496 couple trips",
          emoji: "🐚",
          gradient: "linear-gradient(150deg, #16324f, #2f6f9e 150%)",
          image: IMG.maldives,
          href: "/asia/maldives",
        },
        {
          name: "Bali",
          meta: "2,622 couple trips",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          image: IMG.bali,
          href: "/asia/indonesia",
        },
        {
          name: "Greece",
          meta: "732 couple trips",
          emoji: "🌅",
          gradient: "linear-gradient(150deg, #2f6f9e, #f0e9d6 190%)",
          image: IMG.santorini,
          href: "/europe/greece",
        },
        {
          name: "Seychelles",
          meta: "126 couple trips",
          emoji: "🪨",
          gradient: "linear-gradient(150deg, #1a2436, #17724a 170%)",
          image: CAT.seychelles,
          href: "/africa/seychelles",
        },
        {
          name: "Thailand",
          meta: "5,384 couple trips",
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 190%)",
          image: CAT.krabiIslands,
          href: "/asia/thailand",
        },
        {
          name: "Switzerland",
          meta: "2,936 couple trips",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: CAT.pilatusCableCar,
          href: "/europe/switzerland",
        },
        {
          name: "Japan",
          meta: "2,175 couple trips",
          emoji: "⛩️",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: CAT.tokyoYakatabune,
          href: "/asia/japan",
        },
        {
          name: "Vietnam",
          meta: "2,721 couple trips",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #17724a, #2f6f9e 170%)",
          image: CAT.halongCruise,
          href: "/asia/vietnam",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Planning",
        accent: "something else?",
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
        {
          name: "Thailand + Bali offbeat",
          meta: "Past the postcards",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #0d7f8f, #17724a 180%)",
          image: CAT.krabiIslands,
          href: "/theme/thailand-bali-offbeat",
        },
        {
          name: "Filmy getaways",
          meta: "The scenes you grew up on",
          emoji: "🎬",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: THEME_IMG.filmy,
          href: "/theme/filmy-getaways",
        },
        {
          name: "Christmas markets",
          meta: "December in Europe",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: THEME_IMG.christmasMarkets,
          href: "/theme/christmas-markets",
        },
        {
          name: "Northern lights",
          meta: "Sept – Mar, above the circle",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #1a2436, #17724a 170%)",
          image: THEME_IMG.northernLights,
          href: "/theme/northern-lights",
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
// const defaultActivityDate = () => {
  // const d = new Date();
  // d.setDate(d.getDate() + 60);
  // const dd = String(d.getDate()).padStart(2, "0");
  // const mm = String(d.getMonth() + 1).padStart(2, "0");
  // return `${dd}/${mm}/${d.getFullYear()}`;
// };

const HoneymoonThemePage = ({
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
  // Read-only activity details drawer (opened from the experience / dinner cards).
  // const [activityDrawer, setActivityDrawer] = useState<{
    // show: boolean;
    // activityId?: string;
    // source?: string;
    // date?: string;
  // }>({ show: false });

  // const openActivity = (activityId: string, source?: string) =>
    // setActivityDrawer({
      // show: true,
      // activityId,
      // source,
      // date: defaultActivityDate(),
    // });
  // const closeActivity = () =>
    // setActivityDrawer((prev) => ({ ...prev, show: false }));

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
          content="Plan your honeymoon with The Tarzan Way's AI itinerary - Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples."
        />
        <meta
          property="og:title"
          content="Honeymoon Trip Planner & Itineraries | Maldives, Bali, Santorini | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan your honeymoon with The Tarzan Way's AI itinerary - Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples."
        />
        <link rel="canonical" href={`${SITE_ORIGIN}/theme/honeymoon`} />
        <meta
          property="og:url"
          content={`${SITE_ORIGIN}/theme/honeymoon`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${SITE_ORIGIN}/og-image.png`}
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
                  name: "Honeymoon - Trip Planner & Itineraries",
                  description:
                    "Plan your honeymoon with The Tarzan Way's AI itinerary - Maldives overwater villas, Bali pool villas, Santorini caldera suites and Seychelles beaches, with private dinners, visas and transfers handled for Indian couples.",
                  url: `${SITE_ORIGIN}/theme/honeymoon`,
                  image: `${SITE_ORIGIN}/og-image.png`,
                  provider: {
                    "@type": "TravelAgency",
                    name: "The Tarzan Way",
                    url: SITE_ORIGIN,
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: SITE_ORIGIN,
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Honeymoon",
                      item: `${SITE_ORIGIN}/theme/honeymoon`,
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
        selection={selection}
        onBuild={handleBuild}
      />
      {/* Detail drawers are retired on this page — a click anywhere on a
          card adds or removes it, so nothing opens a drawer. Uncomment to
          restore (and pass `onSelectActivity` to <CinematicThemeLanding>).

      Read-only activity details — no Add/Remove CTA on this marketing page
      <ActivityDetailsDrawer
        show={activityDrawer.show}
        activityId={activityDrawer.activityId}
        source={activityDrawer.source}
        date={activityDrawer.date}
        hideCta
        handleCloseDrawer={closeActivity}
        setShowDrawer={closeActivity}
      />
      */}
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(HoneymoonThemePage);
