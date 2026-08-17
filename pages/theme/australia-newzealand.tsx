// pages/theme/australia-newzealand.tsx
//
// Australia & New Zealand summer — an editorial, cinematic theme landing built
// from the reusable CinematicThemeLanding component, same shape as
// /theme/hokkaido-powder. Activity cards open the read-only activity drawer via
// their catalog ids; the Boxing Day Test feature seeds a ticket enquiry. POI and
// restaurant cards seed a fresh /chat prompt with Kaira; the "People who went"
// stories open each traveller's real itinerary.
//
// Every image, rating and review count below comes from the live catalog
// (ancillaries_activity / geos_poi / geos_restaurant / geos_city), so nothing
// here needs a separate media upload and nothing can drift from what the
// activity drawer shows when the reader opens it.

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

// Identifies this theme in the /chatkit request body (`slug`), so the backend
// knows which theme page a build request came from.
const THEME_SLUG = "australia-newzealand";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
// Catalog media paths, straight from the records these cards represent.
const IMG = {
  // Hero collage
  heroMcg: `${CDN}/media/activities/169089791854120635986328125000.jpg`,
  // Darling Harbour, not the Opera House tour shot — that one is a guide
  // holding a sign, which reads as a tour listing rather than the city.
  heroHarbour: `${CDN}/media/pois/168424594714908790588378906250.jpeg`,
  heroQueenstown: `${CDN}/media/cities/168553059337338519096374511719.jpeg`,
  heroBondi: `${CDN}/media/pois/177021014971818804740905761719.jpg`,
  // Routes ("Pick a shape")
  routeBigDouble: `${CDN}/media/cities/168553038781704521179199218750.jpeg`,
  routeSouthIsland: `${CDN}/media/activities/178635099868767666816711425781.jpeg`,
  routeNyeCoast: `${CDN}/media/activities/169089269232460260391235351562.jpg`,
  // Activities (each opens its catalog drawer)
  actMcg: `${CDN}/media/activities/169089791854120635986328125000.jpg`,
  actOperaHouse: `${CDN}/media/activities/169089790412012100219726562500.jpg`,
  actThunderJet: `${CDN}/media/activities/176958435110703945159912109375.jpeg`,
  actBlueMountains: `${CDN}/media/activities/171316680833138012886047363281.jpg`,
  actPenguinParade: `${CDN}/media/activities/177588482161054134368896484375.jpg`,
  actGreatOceanRoad: `${CDN}/media/activities/169089269232460260391235351562.jpg`,
  actSkyfeast: `${CDN}/media/activities/169089501201909232139587402344.jpg`,
  // Where to stand at midnight (POIs / NYE vantage points)
  nyeMrsMacquaries: `${CDN}/media/pois/177020985492234396934509277344.jpg`,
  nyeHarbourCruise: `${CDN}/media/activities/169089599413088130950927734375.jpg`,
  nyeTaronga: `${CDN}/media/activities/169089919724472808837890625000.jpg`,
  // New Zealand
  nzKawarau: `${CDN}/media/activities/169089305050054287910461425781.jpg`,
  nzSkydive: `${CDN}/media/activities/178635099868767666816711425781.jpeg`,
  nzWalterPeak: `${CDN}/media/activities/176967888364071559906005859375.webp`,
  nzHobbiton: `${CDN}/media/activities/171328220985850071907043457031.jpg`,
  nzGlowworm: `${CDN}/media/activities/177001926548302531242370605469.jpeg`,
  nzHookerValley: `${CDN}/media/activities/178021935390879440307617187500.jpg`,
  // Trips
  tripBigDouble: `${CDN}/media/pois/168424582702011752128601074219.jpeg`,
  tripSouthIsland: `${CDN}/media/cities/168553059337338519096374511719.jpeg`,
  tripSydneyKids: `${CDN}/media/pois/178360874395327806472778320312.jpg`,
  // Long lunches, late dinners — these must be FOOD, not landscapes
  eatQuay: `${CDN}/media/restaurant/169080133765817618370056152344.jpeg`,
  eatMrWong: `${CDN}/media/restaurant/169080132533251285552978515625.jpeg`,
  eatRouleGalette: `${CDN}/media/restaurant/169080289973066949844360351562.jpeg`,
  eatFergburger: `${CDN}/media/restaurant/169082152340897870063781738281.jpeg`,
  // Destinations
  destSydney: `${CDN}/media/cities/168553075298443913459777832031.jpeg`,
  destMelbourne: `${CDN}/media/cities/168553038781704521179199218750.jpeg`,
  destQueenstown: `${CDN}/media/cities/168553059337338519096374511719.jpeg`,
  destAuckland: `${CDN}/media/cities/168448408596688270568847656250.jpeg`,
  destChristchurch: `${CDN}/media/cities/168552964797360444068908691406.jpeg`,
  destCairns: `${CDN}/media/cities/168552953077165150642395019531.jpeg`,
};
// Other-theme tiles reuse each theme page's own live imagery — nothing new to
// upload for these.
const THEME_IMG = {
  hokkaido: `${CDN}/media/website/hokkaido-theme-2026/hero-niseko-powder-hq.jpg`,
  christmasMarkets: `${CDN}/media/website/christmas-markets-2026/hero-vienna-rathausplatz-hq.jpg`,
  greece: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  edinburgh: `${CDN}/media/website/edinburgh-hogmanay-2026/Dec%2029%20--The%20Torchlight%20March.jpg`,
};

// Catalog activity ids (from the Mercury BE links in the brief) — open the
// activity drawer.
const ACTIVITY = {
  mcgTour: "6f63657f-5d81-4195-9560-983170b857f6",
  operaHouse: "d9d8a257-a4b6-46db-89f4-723eb8359846",
  thunderJet: "79faadbe-1ff8-43f6-9cf1-61d16a4a8a8d",
  blueMountains: "21cbfbf8-aadf-4d41-afcc-0ac0c4de615d",
  penguinParade: "917a309f-0edd-40e8-a3e5-069e01e8dc74",
  greatOceanRoad: "52e8c3a6-5094-4fd6-bfd3-0033f3ed135c",
  skyfeast: "7a5cddee-1149-47db-b349-cfecc0aee9c4",
  // New Zealand. The brief named "Kawarau jet boat thrill" without a link; this
  // is the catalog's Kawarau River jet boat (4.69 / 58 reviews).
  kawarauJet: "4e6c3cc7-343a-4cbf-9506-9ec3730f6aca",
  tandemSkydive: "37acab36-b8a6-424c-b458-c2e2ed1625e3",
  walterPeak: "dca03c37-9415-4de3-89c4-54751a44d6fc",
  hobbiton: "5d24211b-c1a4-4125-84c4-67c27cc8b861",
  glowwormCave: "1eb0470f-df32-4261-bdbd-955036b9ee21",
  hookerValley: "bda5e3d0-1e7a-4339-bf60-d0a0117d4538",
  // Midnight vantage points that exist as bookable activities.
  nyeCruise: "eb7abfca-c717-4676-903c-e0d673ad9c37",
  tarongaCruise: "ffea5040-2334-4334-8368-4a541817f55b",
};

const VISA_HOME = "https://visa.thetarzanway.com/";

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  // Hero chips (verbatim from the brief)
  boxingDayNye:
    "We are 2 travellers going for 10 nights in December, and our dates are flexible. Plan a trip to Australia around the Boxing Day Test in Melbourne and New Year's Eve in Sydney. Include the best cricket experience, Melbourne highlights, then travel to Sydney for the harbour fireworks, beaches, food and summer experiences. Keep the itinerary comfortable and include enough time to enjoy both cities.",
  summerSydney:
    "We are 2 travellers going for 7 nights in December, and our dates are flexible. Plan a summer trip to Sydney with a focus on New Year's Eve, beaches, harbour views and outdoor experiences. Include the Sydney NYE fireworks, Bondi and other great coastal spots, local food, scenic walks and fun summer activities. Keep the pace relaxed with plenty of free time.",
  ausNz:
    "We are 2 travellers going for 14 nights in December, and our dates are flexible. Plan a combined Australia and New Zealand summer trip. Include Sydney and Melbourne with their best summer experiences, then continue to New Zealand for mountains, lakes, scenic drives and adventure. Create a balanced itinerary that covers the highlights without feeling rushed.",
  greatOceanRoad:
    "We are 2 travellers going for 9 nights in December, and our dates are flexible. Plan a trip around the Great Ocean Road in Australia, starting from Melbourne. Include scenic coastal drives, the Twelve Apostles, beaches, wildlife, charming coastal towns and beautiful viewpoints. Add a few Melbourne experiences before or after the drive, and keep enough time for spontaneous stops along the way.",
  // "Pick a shape" routes (verbatim)
  bigDouble:
    "We are 2 travellers, and our travel dates in December are flexible. Plan a 10-night Australia trip around the Boxing Day Test in Melbourne and New Year's Eve in Sydney. Include the best experiences in both cities, the cricket match, Sydney Harbour fireworks, beaches, food and summer activities. Keep the itinerary comfortable and well-paced.",
  doubleSouthIsland:
    "We are 2 travellers, and our travel dates in December are flexible. Plan a 14-night trip starting with the Boxing Day Test in Melbourne, followed by New Year's Eve in Sydney, and then continue to Queenstown and New Zealand's South Island. Include cricket, Sydney fireworks, scenic drives, mountains, lakes, adventure activities and beautiful viewpoints, while keeping enough downtime to enjoy the trip.",
  sydneyNyeCoast:
    "We are 2 travellers, and our travel dates in December are flexible. Plan a 9-night Australia trip focused on New Year's Eve in Sydney and a Great Ocean Road road trip. Include Sydney's harbour fireworks, beaches, coastal experiences and food, followed by a scenic drive from Melbourne along the Great Ocean Road with the Twelve Apostles, wildlife and coastal towns. Keep the pace relaxed and leave room for spontaneous stops.",
  // Boxing Day Test feature
  boxingDayTicket:
    "On our 10-night December trip for two, I want to be at the Boxing Day Test at the MCG in Melbourne. Tell me how Day 1 tickets work, what they cost, where to sit for a first-timer, and how early we need to book — then build the Melbourne leg of my trip around the 26th of December.",
  // Where to stand at midnight (POIs)
  mrsMacquaries:
    "On our 10-night December trip for two, tell me about watching the Sydney New Year's Eve fireworks from Mrs Macquarie's Point — how early to arrive, whether it's ticketed, what to carry, and what the view is like. Add it to my Sydney plan.",
  midnightCruise:
    "On our 10-night December trip for two, tell me about watching the Sydney New Year's Eve fireworks from a boat on the harbour — what the cruises include, what they cost, and how far ahead they sell out. Add a midnight harbour cruise to my Sydney plan.",
  tarongaLawns:
    "On our 10-night December trip for two, tell me about watching the Sydney New Year's Eve fireworks from the Taronga Zoo lawns — the view back across the harbour, what's included, and whether it suits families. Add it to my Sydney plan.",
  // Restaurants
  quay:
    "On our 10-night December trip for two, tell me about Quay in Sydney — the harbour-front fine dining and its famous tasting menu — and add a special dinner there to my Sydney plan.",
  mrWong:
    "On our 10-night December trip for two, tell me about Mr Wong in Sydney and its modern Cantonese cooking, and add a long dinner there to my plan.",
  rouleGalette:
    "On our 10-night December trip for two, tell me about Roule Galette in Melbourne and its French galettes and crêpes, and work a relaxed lunch there into my Melbourne days.",
  fergburger:
    "On our 14-night December trip for two, tell me about Fergburger in Queenstown — the queue, the burgers, and when to go — and add it to my New Zealand plan.",
  // Ask bar
  askBar:
    "Which southern-summer trip should we do in December, travelling as a couple — the Boxing Day Test and Sydney NYE double, the same double extended into New Zealand's South Island, or Sydney NYE with a Great Ocean Road drive? Compare the pace, the cost and the fixed dates, then build the full itinerary for the one you recommend.",
  // "Build this itinerary" — sent when the reader has saved places on the page.
  // The saved items ride along in the /chatkit request; this brief tells Kaira
  // to shape the trip around them.
  buildItinerary:
    "We are 2 travellers going for 10 nights in December, and our travel dates are flexible. Build my complete Australia and New Zealand summer itinerary around the places I've saved on this page — fit them into the right cities with the cricket, the fireworks, the coast and the mountains at a comfortable pace, then price it.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. Every month is December: the whole theme hangs off two
// fixed dates — the Boxing Day Test on the 26th and Sydney's NYE fireworks.
//
// `askBar` deliberately carries no `nights`: it asks Kaira to compare a 9, a 10
// and a 14-night shape, so pinning one length would answer it for her.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  boxingDayNye: { nights: 10, month: 12, day: 24, who: "Couple" },
  summerSydney: { nights: 7, month: 12, day: 28, who: "Couple" },
  ausNz: { nights: 14, month: 12, day: 24, who: "Couple" },
  greatOceanRoad: { nights: 9, month: 12, who: "Couple" },
  bigDouble: { nights: 10, month: 12, day: 24, who: "Couple" },
  doubleSouthIsland: { nights: 14, month: 12, day: 24, who: "Couple" },
  sydneyNyeCoast: { nights: 9, month: 12, day: 28, who: "Couple" },
  boxingDayTicket: { nights: 10, month: 12, day: 24, who: "Couple" },
  mrsMacquaries: { nights: 10, month: 12, day: 24, who: "Couple" },
  midnightCruise: { nights: 10, month: 12, day: 24, who: "Couple" },
  tarongaLawns: { nights: 10, month: 12, day: 24, who: "Couple" },
  quay: { nights: 10, month: 12, day: 24, who: "Couple" },
  mrWong: { nights: 10, month: 12, day: 24, who: "Couple" },
  rouleGalette: { nights: 10, month: 12, day: 24, who: "Couple" },
  fergburger: { nights: 14, month: 12, day: 24, who: "Couple" },
  askBar: { month: 12, who: "Couple" },
  buildItinerary: { nights: 10, month: 12, day: 24, who: "Couple" },
});

const australiaNewZealandConfig: CinematicThemeConfig = {
  // Harbour blue — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["australia-newzealand"],
  header: {
    title: "Australia & New Zealand",
    subtitle: "Theme · Southern summer · Dec – Mar",
  },
  hero: {
    eyebrow: "THE BOXING DAY TEST · MIDNIGHT ON THE HARBOUR · THE SOUTH ISLAND",
    heading: { lead: "Summer, while home is", accent: "freezing" },
    lede:
      "Cricket at the 'G on the 26th, a million people on Sydney Harbour on the 31st, and the Southern Alps three hours east of both. Two fixed dates and a whole summer to build around them. Tell me when and I'll shape it.",
    placeholder: "Try: Boxing Day Test then Sydney NYE, 10 nights",
    prompt: PROMPTS.bigDouble,
    chips: [
      { label: "Boxing Day Test + NYE", prompt: PROMPTS.boxingDayNye },
      { label: "Summer in Sydney", prompt: PROMPTS.summerSydney },
      { label: "Australia + New Zealand", prompt: PROMPTS.ausNz },
      { label: "Great Ocean Road drive", prompt: PROMPTS.greatOceanRoad },
    ],
    images: [
      { image: IMG.heroMcg, caption: "The 'G, Boxing Day" },
      { image: IMG.heroHarbour, caption: "Sydney, the harbour" },
      { image: IMG.heroQueenstown, caption: "Queenstown, South Island" },
      { image: IMG.heroBondi, caption: "Bondi to Coogee" },
    ],
  },
  sections: [
    // ── Pick a shape (routes) ──
    {
      type: "cards",
      ctaLabel: "Create this plan →",
      heading: { lead: "Pick a shape,", accent: "I'll fill it in" },
      cards: [
        {
          image: IMG.routeBigDouble,
          name: "The big double",
          line: "Melbourne → Sydney",
          tag: "10 nights",
          prompt: PROMPTS.bigDouble,
        },
        {
          image: IMG.routeSouthIsland,
          name: "Double, then the South Island",
          line: "Melbourne → Sydney → Queenstown",
          tag: "14 nights",
          prompt: PROMPTS.doubleSouthIsland,
        },
        {
          image: IMG.routeNyeCoast,
          name: "Sydney NYE + coast",
          line: "Sydney · Melbourne · Great Ocean Road",
          tag: "9 nights",
          prompt: PROMPTS.sydneyNyeCoast,
        },
      ],
    },
    // ── Days worth building around (card click opens the drawer; "+ Add" saves) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Days worth", accent: "building around" },
      cards: [
        {
          image: IMG.actMcg,
          name: "MCG legendary stadium tour",
          line: "Walk the rooms and the turf of the 100,000-seat 'G.",
          tag: "Melbourne",
          activityId: ACTIVITY.mcgTour,
        },
        {
          image: IMG.actOperaHouse,
          name: "Opera House guided tour with entry",
          line: "Inside the sails, with the stories behind the shell.",
          tag: "Sydney",
          activityId: ACTIVITY.operaHouse,
        },
        {
          image: IMG.actThunderJet,
          name: "Thunder Jet harbour thrill ride",
          line: "Spins and 270° turns past the Opera House and the Bridge.",
          tag: "Sydney",
          activityId: ACTIVITY.thunderJet,
        },
        {
          image: IMG.actBlueMountains,
          name: "Blue Mountains tour with waterfall walk",
          line: "The Three Sisters, a waterfall walk and lunch. A full day out.",
          tag: "Day tour",
          activityId: ACTIVITY.blueMountains,
        },
        {
          image: IMG.actPenguinParade,
          name: "Penguin Parade, koalas and kangaroos",
          line: "Phillip Island at dusk, when the little penguins come ashore.",
          tag: "Melbourne",
          activityId: ACTIVITY.penguinParade,
        },
        {
          image: IMG.actGreatOceanRoad,
          name: "Great Ocean Road with wildlife stops",
          line: "The Twelve Apostles at sunset, koalas on the way.",
          tag: "Day tour",
          activityId: ACTIVITY.greatOceanRoad,
        },
        {
          image: IMG.actSkyfeast,
          name: "Skyfeast at Sydney Tower",
          line: "The revolving buffet, 250m over the city.",
          tag: "Sydney",
          activityId: ACTIVITY.skyfeast,
        },
      ],
    },
    // ── The Boxing Day Test (dark feature) ──
    {
      type: "feature",
      heading: { lead: "One ticket the whole summer is built around" },
      intro:
        "The Boxing Day Test starts at the MCG on 26 December, every year, without exception. Day 1 is the one people fly for — 90,000-odd in for the first session, and a city that shuts down around it. Get that date locked and the rest of the trip arranges itself.",
      rows: [
        {
          stat: "26 Dec",
          name: "Day 1, every year",
          line: "First ball around 10:30am. Gates open long before that.",
        },
        {
          stat: "1892",
          name: "Cricket at the 'G on Boxing Day",
          line: "The fixture has been an Australian institution ever since.",
        },
      ],
      stats: [
        { stat: "100,024", label: "seats at the MCG" },
        { stat: "~91,000", label: "through the gate on a big Day 1" },
        { stat: "5 days", label: "of play, if it goes the distance" },
      ],
      cta: {
        title: "Boxing Day Test · Day 1 ticket",
        meta: "We'll sort seats and the Melbourne leg around it",
        prompt: PROMPTS.boxingDayTicket,
      },
    },
    // ── Where to stand at midnight (POIs, sand) ──
    {
      type: "cards",
      tone: "sand",
      ctaLabel: "Add to trip →",
      ctaTone: "dark",
      heading: { lead: "Where to stand", accent: "at midnight" },
      cards: [
        {
          image: IMG.nyeMrsMacquaries,
          name: "Mrs Macquarie's Point",
          line: "The postcard angle — Bridge and Opera House in one frame.",
          tag: "Sydney",
          prompt: PROMPTS.mrsMacquaries,
          item: {
            kind: "poi",
            label: "Mrs Macquarie's Point",
            short: "Mrs Macquarie's Point",
          },
        },
        {
          image: IMG.nyeHarbourCruise,
          name: "Midnight harbour cruise",
          line: "On the water, under the barges. Sells out months ahead.",
          tag: "Sydney",
          prompt: PROMPTS.midnightCruise,
          item: {
            kind: "poi",
            label: "Midnight harbour cruise",
            short: "Midnight harbour cruise",
          },
        },
        {
          image: IMG.nyeTaronga,
          name: "Taronga Zoo lawns",
          line: "Looking back at the skyline, with room for kids to sit.",
          tag: "Sydney",
          prompt: PROMPTS.tarongaLawns,
          item: {
            kind: "poi",
            label: "Taronga Zoo lawns",
            short: "Taronga Zoo lawns",
          },
        },
      ],
    },
    // ── New Zealand (activities, sand) ──
    {
      type: "cards",
      tone: "sand",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Then three hours east:", accent: "New Zealand" },
      cards: [
        {
          image: IMG.nzKawarau,
          name: "Kawarau jet boat thrill",
          line: "Full-throttle through the canyon that invented bungy.",
          tag: "Queenstown",
          activityId: ACTIVITY.kawarauJet,
        },
        {
          image: IMG.nzSkydive,
          name: "Tandem skydive over Wakatipu",
          line: "Out the door at 15,000ft, with the Remarkables below.",
          tag: "Queenstown",
          activityId: ACTIVITY.tandemSkydive,
        },
        {
          image: IMG.nzWalterPeak,
          name: "Walter Peak cruise and BBQ",
          line: "Across the lake on a coal steamer, lunch at the farm.",
          tag: "Queenstown",
          activityId: ACTIVITY.walterPeak,
        },
        {
          image: IMG.nzHobbiton,
          name: "Hobbiton movie set day",
          line: "The Shire, hobbit holes and a pint at the Green Dragon.",
          tag: "Auckland",
          activityId: ACTIVITY.hobbiton,
        },
        {
          image: IMG.nzGlowworm,
          name: "Glowworm cave boat tour",
          line: "Drifting under a ceiling of live constellations at Waitomo.",
          tag: "Waitomo",
          activityId: ACTIVITY.glowwormCave,
        },
        {
          image: IMG.nzHookerValley,
          name: "Hooker Valley track",
          line: "Three swing bridges to a glacier lake under Mount Cook.",
          tag: "Mount Cook",
          activityId: ACTIVITY.hookerValley,
        },
      ],
    },
    // ── Which summer is yours (trips → real itineraries) ──
    {
      type: "trips",
      ctaLabel: "See this itinerary →",
      heading: {
        lead: "Which summer is",
        accent: "yours?",
        note: "Real itineraries we've built · flights and transfers included",
      },
      cards: [
        {
          image: IMG.tripBigDouble,
          tag: "Cricket · NYE · 10N",
          name: "The big double",
          line: "Christmas week into New Year, both cities, both big dates.",
          nights: "10 nights",
          href: "/itinerary/d4f2eaf5-d895-423a-b418-3f5bd42c18a2",
        },
        {
          image: IMG.tripSouthIsland,
          tag: "Both countries · 17N",
          name: "Double, then the South Island",
          line: "Australia first, then Queenstown, the lakes and the alps.",
          nights: "17 nights",
          href: "/itinerary/dc8ba2c4-3ccf-419c-96e2-32de88724aec",
        },
        {
          image: IMG.tripSydneyKids,
          tag: "Family · easy · 8N",
          name: "Sydney summer with kids",
          line: "Beaches, the zoo and the harbour, at a four-year-old's pace.",
          nights: "8 nights",
          href: "/itinerary/f2b6ccc3-86e9-4717-9692-6db19b03dd40",
        },
      ],
    },
    // ── Long lunches, late dinners (eats, dark) ──
    {
      type: "eats",
      ctaLabel: "Add restaurant →",
      heading: { lead: "Long lunches,", accent: "late dinners" },
      cards: [
        {
          image: IMG.eatQuay,
          name: "Quay",
          city: "Sydney",
          line: "Fine dining with the Opera House filling the window.",
          rating: "4.5",
          reviews: "1,124",
          prompt: PROMPTS.quay,
          item: { kind: "restaurant", label: "Quay", short: "Quay" },
        },
        {
          image: IMG.eatMrWong,
          name: "Mr Wong",
          city: "Sydney",
          line: "Modern Cantonese in a basement that never empties.",
          rating: "4.4",
          reviews: "4,153",
          prompt: PROMPTS.mrWong,
          item: { kind: "restaurant", label: "Mr Wong", short: "Mr Wong" },
        },
        {
          image: IMG.eatRouleGalette,
          name: "Roule Galette",
          city: "Melbourne",
          line: "Proper Breton galettes down a Melbourne laneway.",
          rating: "4.7",
          reviews: "1,523",
          prompt: PROMPTS.rouleGalette,
          item: {
            kind: "restaurant",
            label: "Roule Galette",
            short: "Roule Galette",
          },
        },
        {
          image: IMG.eatFergburger,
          name: "Fergburger",
          city: "Queenstown",
          line: "The queue is the point. Worth it at least once.",
          rating: "4.6",
          reviews: "17,312",
          prompt: PROMPTS.fergburger,
          item: { kind: "restaurant", label: "Fergburger", short: "Fergburger" },
        },
      ],
    },
    // ── When to go (months) ──
    {
      type: "months",
      heading: {
        eyebrow: "Their summer runs December to March",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "26 Dec",
          name: "Boxing Day Test",
          line: "Melbourne stops. Day 1 at the MCG is the ticket to get.",
        },
        {
          range: "31 Dec",
          name: "Sydney NYE",
          line: "9pm family fireworks, then midnight over the Bridge.",
        },
        {
          range: "January",
          name: "Peak summer",
          line: "Hottest, longest days — and the priciest fares of the year.",
        },
        {
          range: "Feb – Mar",
          name: "Warm and quieter",
          line: "Still summer, minus the crowds. Best value of the season.",
        },
      ],
      note:
        "The two big dates are fixed, and everything around them books out early — flights from India for late December go months ahead. Come in February or March instead for the same weather at a much better price.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: {
        eyebrow: "Australia + New Zealand · e-visas",
        lead: "Your visa,",
        accent: "handled",
      },
      intro:
        "Both are online applications, and both are slow — New Zealand especially. We prep the paperwork, check every document and submit for you, so the processing clock starts as early as it can.",
      cards: [
        {
          country: "Australia",
          cities: "e-Visa · multiple entry · 90 days a visit",
          fee: "₹13,900",
          href: VISA_HOME,
        },
        {
          country: "New Zealand",
          cities: "e-Visa · multiple entry · 90 days a visit",
          fee: "₹27,500",
          href: VISA_HOME,
        },
      ],
      facts: [
        { label: "Type", value: "e-Visa, both" },
        { label: "Australia", value: "~20 days" },
        { label: "New Zealand", value: "~40 days" },
      ],
      note:
        "Start the New Zealand application first — it takes roughly twice as long as the Australian one. Apply for both at least three months out if you're travelling over Christmas.",
    },
    // ── Stories (open each traveller's itinerary) ──
    {
      type: "stories",
      heading: {
        eyebrow: "Came back · rated it",
        lead: "People who",
        accent: "went",
      },
      cards: [
        {
          rating: "5.0",
          type: "Solo",
          name: "Siddharth",
          route: "See the plan →",
          href: "/chat/c99c32d8-5201-4329-9b9f-d21a3f00f83a",
        },
        {
          rating: "5.0",
          type: "Family of 4",
          name: "Nikita and Dev",
          route: "See the full itinerary →",
          href: "/itinerary/77de697b-cd27-4832-8063-5e97b7aabe67",
        },
        {
          rating: "4.9",
          type: "Solo",
          name: "Harsha",
          route: "See the full itinerary →",
          href: "/itinerary/734751d2-e17c-4dc8-8aaf-b4af813e80be",
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
          name: "Sydney",
          meta: "Harbour · NYE",
          emoji: "🎆",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: IMG.destSydney,
          prompt: PROMPTS.summerSydney,
        },
        {
          name: "Melbourne",
          meta: "Cricket · coffee",
          emoji: "🏏",
          gradient: "linear-gradient(150deg, #1a2436, #445069)",
          image: IMG.destMelbourne,
          prompt: PROMPTS.boxingDayNye,
        },
        {
          name: "Queenstown",
          meta: "Adventure",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: IMG.destQueenstown,
          prompt: PROMPTS.ausNz,
        },
        {
          name: "Great Ocean Road",
          meta: "Coast drive",
          emoji: "🌊",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 200%)",
          image: IMG.routeNyeCoast,
          prompt: PROMPTS.greatOceanRoad,
        },
        {
          name: "Auckland",
          meta: "North Island",
          emoji: "⛵",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: IMG.destAuckland,
          prompt: PROMPTS.ausNz,
        },
        {
          name: "Christchurch",
          meta: "Alps · lakes",
          emoji: "🚗",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: IMG.destChristchurch,
          prompt: PROMPTS.doubleSouthIsland,
        },
      ],
      footerCta: { label: "View all destinations", href: "/oceania/australia" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Rather have winter?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Hokkaido powder",
          meta: "Dec – Mar",
          emoji: "🎿",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: THEME_IMG.hokkaido,
          href: "/theme/hokkaido-powder",
        },
        {
          name: "Christmas markets",
          meta: "Nov – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image: THEME_IMG.christmasMarkets,
          href: "/theme/christmas-markets",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: THEME_IMG.edinburgh,
          href: "/theme/edinburgh-hogmanay",
        },
        {
          name: "Greek islands",
          meta: "May – Oct",
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #2f6f9e, #f0e9d6 200%)",
          image: THEME_IMG.greece,
          href: "/theme/greece-islands-done-right",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about Australia or New Zealand…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
    buildPrompt: PROMPTS.buildItinerary,
    buildCta: "Build trip",
  },
};

const AustraliaNewZealandThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  // Items the reader saves off the page (activities, POIs + restaurants). Handed
  // to /chat and forwarded in the /chatkit request body so Kaira builds around
  // them.
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  // Every seed from this page carries the current selection + theme slug.
  const handleSelectPrompt = (prompt: string, intent?: ThemePromptIntent) =>
    seedChat(prompt, {
      items: selection.items,
      slug: THEME_SLUG,
      intent,
      facts: PROMPT_FACTS[prompt],
    });
  // "Build this itinerary" — open the themed mini-form on /chat (no auto-send);
  // the saved items ride along and are sent to /chatkit only on form submit.
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);
  // Read-only activity drawer (opened from the activity cards).
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
    <Layout page="Theme Page" slug="australia-newzealand">
      <Head>
        <title>
          Australia &amp; New Zealand Summer | Boxing Day Test &amp; Sydney NYE |
          The Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan an Australia and New Zealand summer trip with The Tarzan Way's AI itinerary — the Boxing Day Test at the MCG, Sydney New Year's Eve fireworks, the Great Ocean Road, Queenstown and the South Island, for Indian travellers."
        />
        <meta
          property="og:title"
          content="Australia & New Zealand Summer | Boxing Day Test & Sydney NYE | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan an Australia and New Zealand summer trip with The Tarzan Way's AI itinerary — the Boxing Day Test at the MCG, Sydney New Year's Eve fireworks, the Great Ocean Road, Queenstown and the South Island, for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/australia-newzealand"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/australia-newzealand"
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
                  name: "Australia & New Zealand Summer — Trip Planner",
                  description:
                    "Plan an Australia and New Zealand summer trip with The Tarzan Way's AI itinerary — the Boxing Day Test at the MCG, Sydney New Year's Eve fireworks, the Great Ocean Road, Queenstown and the South Island, for Indian travellers.",
                  url: "https://thetarzanway.com/theme/australia-newzealand",
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
                      name: "Australia & New Zealand",
                      item: "https://thetarzanway.com/theme/australia-newzealand",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={australiaNewZealandConfig}
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

// A sensible default start date for the read-only activity drawer — ~60 days
// out, in DD/MM/YYYY (the format the detail endpoint expects).
// const defaultActivityDate = () => {
  // const d = new Date();
  // d.setDate(d.getDate() + 60);
  // const dd = String(d.getDate()).padStart(2, "0");
  // const mm = String(d.getMonth() + 1).padStart(2, "0");
  // return `${dd}/${mm}/${d.getFullYear()}`;
// };

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(AustraliaNewZealandThemePage);
