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

// Identifies this theme in the /chatkit request body (`slug`), so the backend
// knows which theme page a build request came from.
const THEME_SLUG = "hokkaido-powder";

const U = "https://images.unsplash.com";
const w = (id: string) => `${U}/${id}?w=1200`;

// Decorative winter imagery (edge-optimised via SkeletonImage).
const PIC = {
  powder: w("photo-1551292831-023188e78222"),
  snowCity: w("photo-1522383225653-ed111181a951"),
  train: w("photo-1548783307-f63adc3f200b"),
  onsen: w("photo-1585032226651-759b368d7246"),
  ropeway: w("photo-1610901157620-340856d0a50f"),
  furano: w("photo-1493976040374-85c8e12f0c0e"),
  lakeToya: w("photo-1578637387939-43c525550085"),
  bluePond: w("photo-1526481280693-3bfa7568e0f3"),
  noboribetsu: w("photo-1480796927426-f609979314bd"),
  niseko: w("photo-1524413840807-0c3cb6fa808d"),
  skiJump: w("photo-1552465011-b4e21bf6e79a"),
  hillside: w("photo-1557409518-691ebcd96038"),
  beer: w("photo-1518983546435-91f8b87fe561"),
  market: w("photo-1503899036084-c55cdd92da26"),
  arcade: w("photo-1528360983277-13d401cdc186"),
  shrine: w("photo-1490806843957-31f4c9a91c65"),
  brick: w("photo-1535063406830-27dfae54262a"),
  tower: w("photo-1542051841857-5f90071e7989"),
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
      { image: PIC.powder, caption: "Niseko, powder" },
      { image: PIC.snowCity, caption: "Sapporo, Snow Festival" },
      { image: PIC.train, caption: "The Shinkansen" },
      { image: PIC.onsen, caption: "Onsen, snow country" },
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
          image: PIC.powder,
          name: "Powder and the city",
          line: "Sapporo + Niseko",
          tag: "9 nights",
          prompt: PROMPTS.powderCity,
        },
        {
          image: PIC.train,
          name: "The undersea run",
          line: "Tokyo → Hakodate → Sapporo",
          tag: "11 nights",
          prompt: PROMPTS.underseaRun,
        },
        {
          image: PIC.snowCity,
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
          image: PIC.ropeway,
          name: "Hakodate Ropeway & port walk",
          line: "The historic port, then the night view from Mt. Hakodate.",
          tag: "Hakodate",
          activityId: ACTIVITY.hakodateRopeway,
        },
        {
          image: PIC.furano,
          name: "Asahiyama Zoo, Furano & Ningle Terrace",
          line: "Penguins in the snow and a woodland of little log cabins.",
          tag: "Furano",
          activityId: ACTIVITY.asahiyamaFurano,
        },
        {
          image: PIC.lakeToya,
          name: "Lake Toya & Noboribetsu Jigokudani",
          line: "A caldera lake and the steaming Hell Valley.",
          tag: "Day tour",
          activityId: ACTIVITY.lakeToyaNoboribetsu,
        },
        {
          image: PIC.bluePond,
          name: "Asahiyama Zoo, Shirahige Falls & Blue Pond",
          line: "The famous cobalt-blue pond, frozen and lit in winter.",
          tag: "Biei",
          activityId: ACTIVITY.asahiyamaBluePond,
        },
        {
          image: PIC.noboribetsu,
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
          image: PIC.niseko,
          name: "Niseko Tokyu Grand Hirafu",
          line: "The powder capital — long groomers and legendary tree runs.",
          tag: "Niseko",
          prompt: PROMPTS.niseko,
          item: { kind: "poi", label: "Niseko Tokyu Grand Hirafu", short: "Niseko · Grand Hirafu" },
        },
        {
          image: PIC.skiJump,
          name: "Okurayama Ski Jump Stadium",
          line: "Ride to the Olympic ski jump for the view over Sapporo.",
          tag: "Sapporo",
          prompt: PROMPTS.okura,
          item: { kind: "poi", label: "Okurayama Ski Jump Stadium", short: "Okurayama Ski Jump" },
        },
        {
          image: PIC.hillside,
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
          image: PIC.beer,
          name: "Sapporo Beer Museum",
          line: "Japan's only beer museum, with a tasting room to warm up in.",
          tag: "Sapporo",
          prompt: PROMPTS.beerMuseum,
          item: { kind: "poi", label: "Sapporo Beer Museum", short: "Sapporo Beer Museum" },
        },
        {
          image: PIC.market,
          name: "Nijo Fish Market",
          line: "Uni, crab and a steaming seafood breakfast bowl.",
          tag: "Sapporo",
          prompt: PROMPTS.nijoMarket,
          item: { kind: "poi", label: "Nijo Fish Market", short: "Nijo Fish Market" },
        },
        {
          image: PIC.arcade,
          name: "Tanukikoji Arcade",
          line: "A covered street of shops and izakayas for a snowy evening.",
          tag: "Sapporo",
          prompt: PROMPTS.tanukikoji,
          item: { kind: "poi", label: "Tanukikoji Arcade", short: "Tanukikoji Arcade" },
        },
        {
          image: PIC.shrine,
          name: "Hokkaidō Shrine",
          line: "A quiet, snow-covered shrine in Maruyama Park.",
          tag: "Sapporo",
          prompt: PROMPTS.hokkaidoShrine,
          item: { kind: "poi", label: "Hokkaidō Shrine", short: "Hokkaidō Shrine" },
        },
        {
          image: PIC.brick,
          name: "Kanemori Red Brick Warehouse",
          line: "Historic bayside warehouses, lit up over the winter harbour.",
          tag: "Hakodate",
          prompt: PROMPTS.kanemori,
          item: { kind: "poi", label: "Kanemori Red Brick Warehouse", short: "Kanemori Warehouse" },
        },
        {
          image: PIC.tower,
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
          image: PIC.powder,
          tag: "Powder · ski · 9N",
          name: "Niseko powder week",
          line: "Sapporo nights, Niseko days — the classic first-timer's Japow.",
          nights: "9 nights",
          prompt: PROMPTS.powderCity,
        },
        {
          image: PIC.train,
          tag: "Rail · slow · 11N",
          name: "Tokyo to Hokkaido by rail",
          line: "The undersea Shinkansen, no flights, all the winter scenery.",
          nights: "11 nights",
          prompt: PROMPTS.underseaRun,
        },
        {
          image: PIC.snowCity,
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
          image: PIC.beer,
          name: "Sapporo Beer Garden",
          city: "Sapporo",
          line: "Genghis Khan lamb barbecue under the old brewery rafters.",
          rating: "4.4",
          reviews: "12,000",
          prompt: PROMPTS.beerGarden,
          item: { kind: "restaurant", label: "Sapporo Beer Garden", short: "Sapporo Beer Garden" },
        },
        {
          image: PIC.furano,
          name: "Ebisoba Ichigen",
          city: "Sapporo",
          line: "Rich, sweet shrimp-based ramen — a Hokkaido original.",
          rating: "4.5",
          reviews: "3,800",
          prompt: PROMPTS.ebisoba,
          item: { kind: "restaurant", label: "Ebisoba Ichigen", short: "Ebisoba Ichigen" },
        },
        {
          image: PIC.noboribetsu,
          name: "Soup Curry Suage",
          city: "Sapporo",
          line: "Sapporo's own soup curry, loaded with local vegetables.",
          rating: "4.5",
          reviews: "5,100",
          prompt: PROMPTS.soupCurry,
          item: { kind: "restaurant", label: "Soup Curry Suage", short: "Soup Curry Suage" },
        },
        {
          image: PIC.bluePond,
          name: "Menya Saimi",
          city: "Sapporo",
          line: "The city's most loved bowl of miso ramen. Worth the queue.",
          rating: "4.6",
          reviews: "6,400",
          prompt: PROMPTS.menyaSaimi,
          item: { kind: "restaurant", label: "Menya Saimi", short: "Menya Saimi" },
        },
        {
          image: PIC.arcade,
          name: "Afuri",
          city: "Japan",
          line: "Clean, citrusy yuzu-shio ramen when you want something lighter.",
          rating: "4.4",
          reviews: "9,200",
          prompt: PROMPTS.afuri,
          item: { kind: "restaurant", label: "Afuri", short: "Afuri" },
        },
        {
          image: PIC.market,
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
    {
      type: "list",
      compact: true,
      heading: {
        eyebrow: "Four things people get wrong",
        lead: "Read this",
        accent: "first",
      },
      rows: [
        {
          emoji: "🎿",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          name: "Rent gear, don't fly with it",
          line: "Hokkaido rental is excellent and cheap. Travel light.",
        },
        {
          emoji: "🚄",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          name: "The JR Pass pays off on the long legs",
          line: "Worth it for the Tokyo–Hokkaido run; less so if you only fly in.",
        },
        {
          emoji: "🧴",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          name: "Onsens have rules",
          line: "Wash first, no swimwear, and tattoos may need covering.",
        },
        {
          emoji: "❄️",
          gradient: "linear-gradient(150deg, #1a2436, #445069)",
          name: "It's cold, but it's dry cold",
          line: "Layers and waterproof boots beat a single heavy coat.",
        },
      ],
    },
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
          prompt: PROMPTS.sapporoWinter,
        },
        {
          name: "Niseko",
          meta: "Powder",
          emoji: "🎿",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          prompt: PROMPTS.niseko,
        },
        {
          name: "Hakodate",
          meta: "Port · night view",
          emoji: "🌃",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          prompt: PROMPTS.underseaRun,
        },
        {
          name: "Noboribetsu",
          meta: "Onsen",
          emoji: "♨️",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          prompt: PROMPTS.skiOnsen,
        },
        {
          name: "Furano & Biei",
          meta: "Snow country",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          prompt: PROMPTS.snowFestivalWeek,
        },
        {
          name: "Otaru",
          meta: "Canal town",
          emoji: "🏮",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
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
          href: "/theme/christmas-markets",
        },
        {
          name: "Lapland with Santa",
          meta: "Dec",
          emoji: "🦌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/theme/lapland",
        },
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          href: "/theme/northern-lights",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          href: "/theme/edinburgh-hogmanay",
        },
      ],
    },
    // ── How it works ──
    {
      type: "steps",
      heading: {
        eyebrow: "No markups · pay only for what you book",
        lead: "Sketch it. I'll",
        accent: "finish it.",
      },
      steps: [
        { n: "1", title: "Tell me your dates", sub: "and your ski level." },
        { n: "2", title: "I shape the route", sub: "powder, rail, onsens." },
        { n: "3", title: "You book", sub: "only what you love." },
      ],
      cta: { label: "Start planning", prompt: PROMPTS.powderCity },
      note: "10,000+ trips · rated 4.9 across all of them",
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
  const handleBuild = () => openThemeForm(THEME_SLUG, selection.items);
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
