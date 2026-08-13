// pages/theme/hokkaido-powder.tsx
//
// Hokkaido Powder & Sapporo — an editorial, cinematic theme landing (the
// "Hokkaido Powder" mockup) built from the reusable CinematicThemeLanding
// component. Activity cards open the read-only activity drawer via their catalog
// ids; the JR Pass CTA in the undersea-train feature does the same. POI and
// restaurant cards seed a fresh /chat prompt with Kaira; the "People who went"
// stories open each traveller's real itinerary.

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

// Identifies this theme in the /chatkit request body (`slug`), so the backend
// knows which theme page a build request came from.
const THEME_SLUG = "hokkaido-powder";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
// Contextual imagery staged in media-staging/hokkaido-theme-2026/ — upload to
// S3 at media/website/hokkaido-theme-2026/ (the CDN path mapped below). See
// that folder's README for what each file has to show.
//
// One file per card, deliberately: the page previously ran on 18 generic
// Unsplash shots spread across ~36 slots, so a ramen shop showed a lavender
// field and three unrelated cards shared one photo. Nothing is reused here.
const IMG_BASE = `${CDN}/media/website/hokkaido-theme-2026`;
const IMG = {
  // Hero collage
  heroNiseko: `${IMG_BASE}/hero-niseko-powder-hq.jpg`,
  heroSnowFestival: `${IMG_BASE}/hero-sapporo-snow-festival-hq.jpg`,
  heroShinkansen: `${IMG_BASE}/hero-hokkaido-shinkansen-hq.jpg`,
  heroOnsen: `${IMG_BASE}/hero-rotenburo-snow-hq.jpg`,
  // Routes
  routePowderCity: `${IMG_BASE}/route-powder-and-the-city-hq.jpg`,
  routeUnderseaRun: `${IMG_BASE}/route-undersea-run-hq.jpg`,
  routeSnowFestival: `${IMG_BASE}/route-snow-festival-week-hq.jpg`,
  // Activities (each opens its catalog drawer)
  actHakodateRopeway: `${IMG_BASE}/act-hakodate-ropeway-hq.jpg`,
  actAsahiyamaFurano: `${IMG_BASE}/act-asahiyama-zoo-furano-hq.jpg`,
  actLakeToya: `${IMG_BASE}/act-lake-toya-hq.jpg`,
  actBluePond: `${IMG_BASE}/act-shirahige-blue-pond-hq.jpg`,
  actNoboribetsu: `${IMG_BASE}/act-noboribetsu-jigokudani-hq.jpg`,
  // Which mountain is yours
  mtnNiseko: `${IMG_BASE}/mtn-niseko-grand-hirafu-hq.jpg`,
  mtnOkurayama: `${IMG_BASE}/mtn-okurayama-ski-jump-hq.jpg`,
  mtnTakino: `${IMG_BASE}/mtn-takino-suzuran-hq.jpg`,
  // When your legs need a day off
  poiBeerMuseum: `${IMG_BASE}/poi-sapporo-beer-museum-hq.jpg`,
  poiNijoMarket: `${IMG_BASE}/poi-nijo-fish-market-hq.jpg`,
  poiTanukikoji: `${IMG_BASE}/poi-tanukikoji-arcade-hq.jpg`,
  poiHokkaidoShrine: `${IMG_BASE}/poi-hokkaido-shrine-hq.jpg`,
  poiKanemori: `${IMG_BASE}/poi-kanemori-warehouse-hq.jpg`,
  poiGoryokaku: `${IMG_BASE}/poi-goryokaku-tower-hq.jpg`,
  // Trips
  tripPowderWeek: `${IMG_BASE}/trip-niseko-powder-week-hq.jpg`,
  tripRail: `${IMG_BASE}/trip-tokyo-hokkaido-rail-hq.jpg`,
  tripSnowFestival: `${IMG_BASE}/trip-snow-festival-soft-slopes-hq.jpg`,
  // Where to come in from the cold — these must be FOOD, not landscapes
  eatBeerGarden: `${IMG_BASE}/eat-sapporo-beer-garden-jingisukan-hq.jpg`,
  eatEbisoba: `${IMG_BASE}/eat-ebisoba-ichigen-shrimp-ramen-hq.jpg`,
  eatSoupCurry: `${IMG_BASE}/eat-soup-curry-suage-hq.jpg`,
  eatMenyaSaimi: `${IMG_BASE}/eat-menya-saimi-miso-ramen-hq.jpg`,
  eatAfuri: `${IMG_BASE}/eat-afuri-yuzu-shio-ramen-hq.jpg`,
  eatUniMurakami: `${IMG_BASE}/eat-uni-murakami-hq.jpg`,
  // Destinations
  destSapporo: `${IMG_BASE}/dest-sapporo-hq.jpg`,
  destNiseko: `${IMG_BASE}/dest-niseko-hq.jpg`,
  destHakodate: `${IMG_BASE}/dest-hakodate-hq.jpg`,
  destNoboribetsu: `${IMG_BASE}/dest-noboribetsu-hq.jpg`,
  destFuranoBiei: `${IMG_BASE}/dest-furano-biei-hq.jpg`,
  destOtaru: `${IMG_BASE}/dest-otaru-hq.jpg`,
};
// Other-theme tiles reuse each theme page's own live imagery — nothing new to
// upload for these.
const THEME_IMG = {
  christmasMarkets: `${CDN}/media/website/christmas-markets-2026/hero-vienna-rathausplatz-hq.jpg`,
  lapland: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  northernLights: `${CDN}/media/website/northern-lights-2026/Sleep%20Beneath%20The%20Aurora.jpg`,
  edinburgh: `${CDN}/media/website/edinburgh-hogmanay-2026/Dec%2029%20--The%20Torchlight%20March.jpg`,
};

// Catalog activity ids (from the Mercury BE links) — open the activity drawer.
const ACTIVITY = {
  hakodateRopeway: "e3addbb6-5803-44fd-bd6a-03b0353e7cf7",
  asahiyamaFurano: "90dd0a30-4d68-4282-8d21-10506852daf9",
  lakeToyaNoboribetsu: "54873c07-f2d3-4143-8b17-f316995e3d2c",
  asahiyamaBluePond: "92d1d0bb-10af-46cc-a490-1dea46f2c6a6",
  // "Noboribetsu and Lake Toya day tour" shares the Lake Toya / Noboribetsu id.
  jrPass: "5d200e42-c1cc-4978-93b7-e389ef324e67",
};

const VISA_JAPAN = "https://visa.thetarzanway.com/country/japan-visa-online";

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  // Hero chips (verbatim from the brief)
  snowFestivalPowder:
    "We are 2 travellers, and our travel dates are flexible. We want one trip that combines Hokkaido's best powder snow with the Sapporo Snow Festival. Include skiing, winter festivals, onsens, scenic train journeys, and iconic winter experiences at a comfortable pace.",
  underseaShinkansen:
    "We are 2 travellers, and our travel dates are flexible. We want to experience Japan's famous undersea Shinkansen journey to Hokkaido. Build our itinerary around scenic train travel, Hakodate, Sapporo, local food, winter landscapes, and unique rail experiences before continuing into Hokkaido.",
  sapporoWinter:
    "We are 2 travellers, and our travel dates are flexible. We want to experience Sapporo during winter. Include the Snow Festival (when available), local seafood markets, beer museum, winter illuminations, ramen alley, snowy city walks, and day trips to nearby attractions.",
  skiOnsen:
    "We are 2 travellers, and our travel dates are flexible. We want to combine skiing with traditional Japanese onsen experiences. Balance ski days with relaxing hot springs, ryokan stays, mountain scenery, local cuisine, and slow winter evenings.",
  // "Pick a shape" routes (verbatim)
  powderCity:
    "We are 2 travellers, and our travel dates are flexible. We want a 9-night Hokkaido winter itinerary combining Sapporo and Niseko. Prioritize legendary powder snow, skiing or snowboarding (based on our experience level), cozy onsens, local seafood, ramen, winter cafés, scenic snowy landscapes, and enough time to explore Sapporo's city highlights. Balance adventure on the slopes with relaxed evenings and authentic Hokkaido experiences.",
  underseaRun:
    "We are 2 travellers, and our travel dates are flexible. We want an 11-night Japan winter itinerary featuring the undersea Hokkaido Shinkansen journey from Tokyo to Hokkaido. Include Tokyo's highlights before travelling by bullet train through the Seikan Tunnel to Hakodate and Sapporo. Prioritize scenic rail travel, fresh seafood, winter city experiences, historic districts, onsens, snowy landscapes, and authentic Japanese culture at a comfortable pace.",
  snowFestivalWeek:
    "We are 2 travellers, and our travel dates are flexible. We want an 8-night Hokkaido winter itinerary centered around the Sapporo Snow Festival. Include the festival's iconic snow and ice sculptures, winter illuminations, Otaru's canal and glass workshops, Noboribetsu's famous hot springs and Jigokudani (Hell Valley), local seafood, cozy cafés, and classic Hokkaido winter experiences. Keep the pace relaxed with time to fully enjoy each destination.",
  // Mountains (POIs)
  niseko:
    "Tell me about skiing Niseko — the Grand Hirafu resort and the wider Niseko United area. What's the powder like, what runs suit different levels, how many days should we ski, and how do we combine it with Sapporo? Add it to my Hokkaido plan.",
  okura:
    "Tell me about the Okurayama Ski Jump Stadium in Sapporo — the Olympic ski jump, the observation deck views over the city, and the winter sports museum. Work a visit into my Sapporo days.",
  takino:
    "Tell me about Takino Suzuran Hillside Park near Sapporo in winter — the snow play, tubing and cross-country trails. Is it worth a half day with the family? Add it to my Hokkaido plan.",
  // Rest days (POIs)
  beerMuseum:
    "Tell me about the Sapporo Beer Museum — the history, the tasting room, and the beer garden next door. Add a relaxed afternoon there to my Sapporo plan.",
  nijoMarket:
    "Tell me about Nijo Fish Market in Sapporo — the fresh uni, crab and kaisendon breakfast bowls. Work a morning there into my plan.",
  tanukikoji:
    "Tell me about the Tanukikoji shopping arcade in Sapporo — the covered street of shops, izakayas and cafés, perfect for a snowy evening. Add it to my plan.",
  hokkaidoShrine:
    "Tell me about Hokkaido Shrine in Maruyama Park, Sapporo — a peaceful, snow-covered shrine visit. Add it to my winter itinerary.",
  kanemori:
    "Tell me about the Kanemori Red Brick Warehouse in Hakodate — the historic bayside warehouses turned shops and cafés, lit up in winter. Add it to my Hakodate plan.",
  goryokaku:
    "Tell me about Goryokaku Tower and the star-shaped fort in Hakodate, especially under snow from the observation deck. Add it to my plan.",
  // Restaurants
  beerGarden:
    "Tell me about the Sapporo Beer Garden and its Genghis Khan (jingisukan) lamb barbecue, and add a hearty dinner there to my Sapporo plan.",
  ebisoba:
    "Tell me about Ebisoba Ichigen in Sapporo and its shrimp-based ramen, and add a warm-up bowl there to my plan.",
  soupCurry:
    "Tell me about Soup Curry Suage in Sapporo — the local soup curry with vegetables and chicken — and work a lunch there into my plan.",
  menyaSaimi:
    "Tell me about Menya Saimi, one of Sapporo's most famous miso ramen shops, and add it to my plan.",
  afuri:
    "Tell me about Afuri and its yuzu shio ramen, and add a lighter ramen stop to my Japan plan.",
  uniMurakami:
    "Tell me about Uni Murakami in Hakodate and its fresh sea urchin, and add a seafood stop to my Hakodate plan.",
  // Ask bar
  askBar:
    "Which Hokkaido winter trip should I do — Niseko powder week, Tokyo to Hokkaido by rail, or a Snow Festival week with softer slopes? Compare the powder, the pace, the cost, and the best month, then build the full itinerary for the one you recommend.",
  // "Build this itinerary" — sent when the reader has saved places on the page.
  // The saved items ride along in the /chatkit request; this brief tells Kaira
  // to shape the trip around them.
  buildItinerary:
    "We are 2 travellers, and our travel dates are flexible. Build my complete Hokkaido winter itinerary around the places I've saved on this page — fit them into the right stops with skiing, onsens, scenic rail and Sapporo at a comfortable pace, then price it.",
};

const hokkaidoConfig: CinematicThemeConfig = {
  // Hokkaido snow blue — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["hokkaido-powder"],
  header: {
    title: "Hokkaido powder & Sapporo",
    subtitle: "Theme · Japan · Dec – Mar",
  },
  hero: {
    eyebrow: "JAPOW · ONSENS · ONE BULLET TRAIN BENEATH THE SEA",
    heading: { lead: "Japan's ultimate winter", accent: "playground" },
    lede:
      "The lightest, driest powder on earth, steaming open-air onsens, snow-sculpted city festivals, and a bullet train that runs under the ocean to reach it all. Tell me your dates and I'll shape the winter around you.",
    placeholder: "Try: Niseko powder week, Sapporo, 9 nights in February",
    prompt: PROMPTS.powderCity,
    chips: [
      { label: "Snow Festival & powder", prompt: PROMPTS.snowFestivalPowder },
      { label: "Undersea Shinkansen", prompt: PROMPTS.underseaShinkansen },
      { label: "Sapporo winter", prompt: PROMPTS.sapporoWinter },
      { label: "Ski & onsen", prompt: PROMPTS.skiOnsen },
    ],
    images: [
      { image: IMG.heroNiseko, caption: "Niseko, powder" },
      { image: IMG.heroSnowFestival, caption: "Sapporo, Snow Festival" },
      { image: IMG.heroShinkansen, caption: "The Shinkansen" },
      { image: IMG.heroOnsen, caption: "Onsen, snow country" },
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
          image: IMG.routePowderCity,
          name: "Powder and the city",
          line: "Sapporo + Niseko",
          tag: "9 nights",
          prompt: PROMPTS.powderCity,
        },
        {
          image: IMG.routeUnderseaRun,
          name: "The undersea run",
          line: "Tokyo → Hakodate → Sapporo",
          tag: "11 nights",
          prompt: PROMPTS.underseaRun,
        },
        {
          image: IMG.routeSnowFestival,
          name: "Snow Festival week",
          line: "Sapporo · Otaru · Noboribetsu",
          tag: "8 nights",
          prompt: PROMPTS.snowFestivalWeek,
        },
      ],
    },
    // ── Activities (card click opens the drawer; "+ Add" saves to the trip) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Activities worth", accent: "the day" },
      cards: [
        {
          image: IMG.actHakodateRopeway,
          name: "Hakodate Ropeway & port walk",
          line: "The historic port, then the night view from Mt. Hakodate.",
          tag: "Hakodate",
          activityId: ACTIVITY.hakodateRopeway,
          objectPosition: "center 50%",
        },
        {
          image: IMG.actAsahiyamaFurano,
          name: "Asahiyama Zoo, Furano & Ningle Terrace",
          line: "Penguins in the snow and a woodland of little log cabins.",
          tag: "Furano",
          activityId: ACTIVITY.asahiyamaFurano,
        },
        {
          image: IMG.actLakeToya,
          name: "Lake Toya & Noboribetsu Jigokudani",
          line: "A caldera lake and the steaming Hell Valley.",
          tag: "Day tour",
          activityId: ACTIVITY.lakeToyaNoboribetsu,
        },
        {
          image: IMG.actBluePond,
          name: "Asahiyama Zoo, Shirahige Falls & Blue Pond",
          line: "The famous cobalt-blue pond, frozen and lit in winter.",
          tag: "Biei",
          activityId: ACTIVITY.asahiyamaBluePond,
        },
        {
          image: IMG.actNoboribetsu,
          name: "Noboribetsu & Lake Toya day tour",
          line: "Hokkaido's best onsen town and its volcanic scenery.",
          tag: "Day tour",
          activityId: ACTIVITY.lakeToyaNoboribetsu,
        },
      ],
    },
    // ── Undersea train (dark feature) ──
    {
      type: "feature",
      heading: { lead: "A bullet train under the ocean floor" },
      intro:
        "The Hokkaido Shinkansen runs through the Seikan Tunnel — deep beneath the strait between Honshu and Hokkaido — linking Tokyo to Hakodate in about four hours. One JR Pass covers the whole run, both ways.",
      rows: [
        {
          stat: "~4 hrs",
          name: "Tokyo → Hakodate",
          line: "Board at Tokyo Station, step off in Hokkaido. No airport, no queues.",
        },
        {
          stat: "1988",
          name: "The Seikan Tunnel opened",
          line: "Still one of the longest and deepest rail tunnels ever built.",
        },
      ],
      stats: [
        { stat: "23.3km", label: "of track run under the sea" },
        { stat: "240m", label: "below the surface at the deepest" },
        { stat: "320km/h", label: "top speed on the line" },
      ],
      cta: {
        title: "JR Pass · 14 days",
        meta: "Covers the Shinkansen both ways",
        activityId: ACTIVITY.jrPass,
      },
    },
    // ── Which mountain is yours (POIs, sand) ──
    {
      type: "cards",
      tone: "sand",
      ctaLabel: "Add to trip →",
      ctaTone: "dark",
      heading: { lead: "Which mountain", accent: "is yours" },
      cards: [
        {
          image: IMG.mtnNiseko,
          name: "Niseko Tokyu Grand Hirafu",
          line: "The powder capital — long groomers and legendary tree runs.",
          tag: "Niseko",
          prompt: PROMPTS.niseko,
          item: { kind: "poi", label: "Niseko Tokyu Grand Hirafu", short: "Niseko · Grand Hirafu" },
        },
        {
          image: IMG.mtnOkurayama,
          name: "Okurayama Ski Jump Stadium",
          line: "Ride to the Olympic ski jump for the view over Sapporo.",
          tag: "Sapporo",
          prompt: PROMPTS.okura,
          item: { kind: "poi", label: "Okurayama Ski Jump Stadium", short: "Okurayama Ski Jump" },
        },
        {
          image: IMG.mtnTakino,
          name: "Takino Suzuran Hillside Park",
          line: "Snow play, tubing and gentle cross-country near the city.",
          tag: "Sapporo",
          prompt: PROMPTS.takino,
          item: { kind: "poi", label: "Takino Suzuran Hillside Park", short: "Takino Suzuran Park" },
        },
      ],
    },
    // ── When your legs need a day off (POIs, sand) ──
    {
      type: "cards",
      tone: "sand",
      ctaLabel: "Add to trip →",
      ctaTone: "dark",
      heading: { lead: "When your legs need", accent: "a day off" },
      cards: [
        {
          image: IMG.poiBeerMuseum,
          name: "Sapporo Beer Museum",
          line: "Japan's only beer museum, with a tasting room to warm up in.",
          tag: "Sapporo",
          prompt: PROMPTS.beerMuseum,
          item: { kind: "poi", label: "Sapporo Beer Museum", short: "Sapporo Beer Museum" },
          objectPosition: "center 20%"
        },
        {
          image: IMG.poiNijoMarket,
          name: "Nijo Fish Market",
          line: "Uni, crab and a steaming seafood breakfast bowl.",
          tag: "Sapporo",
          prompt: PROMPTS.nijoMarket,
          item: { kind: "poi", label: "Nijo Fish Market", short: "Nijo Fish Market" },
          objectPosition: "center 60%"
        },
        {
          image: IMG.poiTanukikoji,
          name: "Tanukikoji Arcade",
          line: "A covered street of shops and izakayas for a snowy evening.",
          tag: "Sapporo",
          prompt: PROMPTS.tanukikoji,
          item: { kind: "poi", label: "Tanukikoji Arcade", short: "Tanukikoji Arcade" },
          objectPosition: "center 20%"
        },
        {
          image: IMG.poiHokkaidoShrine,
          name: "Hokkaidō Shrine",
          line: "A quiet, snow-covered shrine in Maruyama Park.",
          tag: "Sapporo",
          prompt: PROMPTS.hokkaidoShrine,
          item: { kind: "poi", label: "Hokkaidō Shrine", short: "Hokkaidō Shrine" },
          objectPosition: "center 40%"
        },
        {
          image: IMG.poiKanemori,
          name: "Kanemori Red Brick Warehouse",
          line: "Historic bayside warehouses, lit up over the winter harbour.",
          tag: "Hakodate",
          prompt: PROMPTS.kanemori,
          item: { kind: "poi", label: "Kanemori Red Brick Warehouse", short: "Kanemori Warehouse" },
          objectPosition: "center 40%"
        },
        {
          image: IMG.poiGoryokaku,
          name: "Goryōkaku Tower",
          line: "The star-shaped fort, best seen under snow from above.",
          tag: "Hakodate",
          prompt: PROMPTS.goryokaku,
          item: { kind: "poi", label: "Goryōkaku Tower", short: "Goryōkaku Tower" },
        },
      ],
    },
    // ── Which winter is yours (trips) ──
    {
      type: "trips",
      ctaLabel: "Book this itinerary →",
      heading: {
        lead: "Which winter is",
        accent: "yours?",
        note: "Priced from Delhi · flights and rail included",
      },
      cards: [
        {
          image: IMG.tripPowderWeek,
          tag: "Powder · ski · 9N",
          name: "Niseko powder week",
          line: "Sapporo nights, Niseko days — the classic first-timer's Japow.",
          nights: "9 nights",
          prompt: PROMPTS.powderCity,
        },
        {
          image: IMG.tripRail,
          tag: "Rail · slow · 11N",
          name: "Tokyo to Hokkaido by rail",
          line: "The undersea Shinkansen, no flights, all the winter scenery.",
          nights: "11 nights",
          prompt: PROMPTS.underseaRun,
        },
        {
          image: IMG.tripSnowFestival,
          tag: "Festival · easy · 8N",
          name: "Snow Festival & soft slopes",
          line: "Ice sculptures, onsen towns, and gentler beginner runs.",
          nights: "8 nights",
          prompt: PROMPTS.snowFestivalWeek,
        },
      ],
    },
    // ── Where to come in from the cold (eats, dark) ──
    {
      type: "eats",
      ctaLabel: "Add restaurant →",
      heading: { lead: "Where to come in", accent: "from the cold" },
      cards: [
        {
          image: IMG.eatBeerGarden,
          name: "Sapporo Beer Garden",
          city: "Sapporo",
          line: "Genghis Khan lamb barbecue under the old brewery rafters.",
          rating: "4.4",
          reviews: "12,000",
          prompt: PROMPTS.beerGarden,
          item: { kind: "restaurant", label: "Sapporo Beer Garden", short: "Sapporo Beer Garden" },
        },
        {
          image: IMG.eatEbisoba,
          name: "Ebisoba Ichigen",
          city: "Sapporo",
          line: "Rich, sweet shrimp-based ramen — a Hokkaido original.",
          rating: "4.5",
          reviews: "3,800",
          prompt: PROMPTS.ebisoba,
          item: { kind: "restaurant", label: "Ebisoba Ichigen", short: "Ebisoba Ichigen" },
        },
        {
          image: IMG.eatSoupCurry,
          name: "Soup Curry Suage",
          city: "Sapporo",
          line: "Sapporo's own soup curry, loaded with local vegetables.",
          rating: "4.5",
          reviews: "5,100",
          prompt: PROMPTS.soupCurry,
          item: { kind: "restaurant", label: "Soup Curry Suage", short: "Soup Curry Suage" },
        },
        {
          image: IMG.eatMenyaSaimi,
          name: "Menya Saimi",
          city: "Sapporo",
          line: "The city's most loved bowl of miso ramen. Worth the queue.",
          rating: "4.6",
          reviews: "6,400",
          prompt: PROMPTS.menyaSaimi,
          item: { kind: "restaurant", label: "Menya Saimi", short: "Menya Saimi" },
        },
        {
          image: IMG.eatAfuri,
          name: "Afuri",
          city: "Japan",
          line: "Clean, citrusy yuzu-shio ramen when you want something lighter.",
          rating: "4.4",
          reviews: "9,200",
          prompt: PROMPTS.afuri,
          item: { kind: "restaurant", label: "Afuri", short: "Afuri" },
        },
        {
          image: IMG.eatUniMurakami,
          name: "Uni Murakami",
          city: "Hakodate",
          line: "Sea urchin at its freshest, steps from the morning market.",
          rating: "4.5",
          reviews: "2,600",
          prompt: PROMPTS.uniMurakami,
          item: { kind: "restaurant", label: "Uni Murakami", short: "Uni Murakami" },
        },
      ],
    },
    // ── When to go (months) ──
    {
      type: "months",
      heading: {
        eyebrow: "The season runs December to March",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Early Dec",
          name: "First snow",
          line: "Resorts opening, thin crowds, prices still reasonable.",
        },
        {
          range: "Jan – early Feb",
          name: "Deepest powder",
          line: "The famous dry Japow. Coldest, driest, and busiest for skiers.",
        },
        {
          range: "Early Feb",
          name: "Sapporo Snow Festival",
          line: "A week of giant snow and ice sculptures. Book stays early.",
        },
        {
          range: "March",
          name: "Spring skiing",
          line: "Warmer, longer days and softer snow — easiest for beginners.",
        },
      ],
      note:
        "Peak powder and the Snow Festival both fall in late January to early February — the busiest, priciest window. Come early December or March for quieter slopes and better value.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: {
        eyebrow: "Japan · tourist sticker visa",
        lead: "Your visa,",
        accent: "handled",
      },
      intro:
        "We prep the paperwork, check every document and submit for you. No embassy queues, no guesswork on the bank statements.",
      cards: [
        {
          country: "Japan",
          cities: "Sticker · single entry · up to 90 days",
          fee: "₹4,300",
          href: VISA_JAPAN,
        },
      ],
      facts: [
        { label: "Type", value: "Tourist sticker" },
        { label: "Embassy fee", value: "₹3,300" },
        { label: "Our fee", value: "₹1,000" },
      ],
      note:
        "Applied through the Japanese embassy. We book the appointment, assemble the file, and hand it back to you ready to travel.",
    },
    // ── Read this first (list compact) ──
    // {
    //   type: "list",
    //   compact: true,
    //   heading: {
    //     eyebrow: "Four things people get wrong",
    //     lead: "Read this",
    //     accent: "first",
    //   },
    //   rows: [
    //     {
    //       emoji: "🎿",
    //       gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
    //       name: "Rent gear, don't fly with it",
    //       line: "Hokkaido rental is excellent and cheap. Travel light.",
    //     },
    //     {
    //       emoji: "🚄",
    //       gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
    //       name: "The JR Pass pays off on the long legs",
    //       line: "Worth it for the Tokyo–Hokkaido run; less so if you only fly in.",
    //     },
    //     {
    //       emoji: "🧴",
    //       gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
    //       name: "Onsens have rules",
    //       line: "Wash first, no swimwear, and tattoos may need covering.",
    //     },
    //     {
    //       emoji: "❄️",
    //       gradient: "linear-gradient(150deg, #1a2436, #445069)",
    //       name: "It's cold, but it's dry cold",
    //       line: "Layers and waterproof boots beat a single heavy coat.",
    //     },
    //   ],
    // },
    // ── Stories (open each traveller's itinerary) ──
    {
      type: "stories",
      heading: { eyebrow: "Came back · rated it", lead: "People who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Couple",
          name: "Rohan Mehta",
          route: "See the full itinerary →",
          href: "/itinerary/f4ebf208-8d91-42f8-a482-4edb84455fe4",
        },
        {
          rating: "5.0",
          type: "Solo",
          name: "Priya",
          route: "See the plan →",
          href: "/chat/c534d49c-fe0d-420f-9350-b88aadc921cb",
        },
        {
          rating: "4.9",
          type: "Family",
          name: "Arjun & family",
          route: "See the full itinerary →",
          href: "/itinerary/7504ac55-cfc1-4f7b-92c3-5198273d3835",
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: { eyebrow: "Destinations in this theme", lead: "Where I", accent: "send people" },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Sapporo",
          meta: "City · festival",
          emoji: "🏙️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: IMG.destSapporo,
          prompt: PROMPTS.sapporoWinter,
        },
        {
          name: "Niseko",
          meta: "Powder",
          emoji: "🎿",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: IMG.destNiseko,
          prompt: PROMPTS.niseko,
        },
        {
          name: "Hakodate",
          meta: "Port · night view",
          emoji: "🌃",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: IMG.destHakodate,
          prompt: PROMPTS.underseaRun,
        },
        {
          name: "Noboribetsu",
          meta: "Onsen",
          emoji: "♨️",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: IMG.destNoboribetsu,
          prompt: PROMPTS.skiOnsen,
        },
        {
          name: "Furano & Biei",
          meta: "Snow country",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: IMG.destFuranoBiei,
          prompt: PROMPTS.snowFestivalWeek,
        },
        {
          name: "Otaru",
          meta: "Canal town",
          emoji: "🏮",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image: IMG.destOtaru,
          prompt: PROMPTS.snowFestivalWeek,
        },
      ],
      footerCta: { label: "View all destinations", href: "/asia/japan" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: { eyebrow: "Other themes", lead: "Winter elsewhere?", accent: "Try these" },
      columns: 4,
      cards: [
        {
          name: "Christmas markets",
          meta: "Nov – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image: THEME_IMG.christmasMarkets,
          href: "/theme/christmas-markets",
        },
        {
          name: "Lapland with Santa",
          meta: "Dec",
          emoji: "🦌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: THEME_IMG.lapland,
          href: "/theme/lapland",
        },
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image: THEME_IMG.northernLights,
          href: "/theme/northern-lights",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: THEME_IMG.edinburgh,
          href: "/theme/edinburgh-hogmanay",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about Hokkaido…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
    buildPrompt: PROMPTS.buildItinerary,
    buildCta: "Build trip",
  },
};

const HokkaidoPowderThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  // Items the reader saves off the page (POIs + restaurants). Handed to /chat
  // and forwarded in the /chatkit request body so Kaira builds around them.
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  // Every seed from this page carries the current selection + theme slug.
  const handleSelectPrompt = (prompt: string) =>
    seedChat(prompt, { items: selection.items, slug: THEME_SLUG });
  // "Build this itinerary" — open the themed mini-form on /chat (no auto-send);
  // the saved items ride along and are sent to /chatkit only on form submit.
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);
  // Read-only activity drawer (opened from the Activities cards + the JR Pass CTA).
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
    <Layout page="Theme Page" slug="hokkaido-powder">
      <Head>
        <title>
          Hokkaido Powder & Sapporo Winter | Trip Planner & Itinerary | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a Hokkaido winter trip with The Tarzan Way's AI itinerary — Niseko powder skiing, the Sapporo Snow Festival, onsens, the undersea Shinkansen from Tokyo, seafood and ramen, for Indian travellers."
        />
        <meta
          property="og:title"
          content="Hokkaido Powder & Sapporo Winter | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a Hokkaido winter trip with The Tarzan Way's AI itinerary — Niseko powder skiing, the Sapporo Snow Festival, onsens, the undersea Shinkansen from Tokyo, seafood and ramen, for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/hokkaido-powder"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/hokkaido-powder"
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
                  name: "Hokkaido Powder & Sapporo Winter — Trip Planner",
                  description:
                    "Plan a Hokkaido winter trip with The Tarzan Way's AI itinerary — Niseko powder skiing, the Sapporo Snow Festival, onsens, the undersea Shinkansen from Tokyo, seafood and ramen, for Indian travellers.",
                  url: "https://thetarzanway.com/theme/hokkaido-powder",
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
                      name: "Hokkaido Powder & Sapporo",
                      item: "https://thetarzanway.com/theme/hokkaido-powder",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={hokkaidoConfig}
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

// A sensible default start date for the read-only activity drawer — ~60 days
// out, in DD/MM/YYYY (the format the detail endpoint expects).
const defaultActivityDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(HokkaidoPowderThemePage);
