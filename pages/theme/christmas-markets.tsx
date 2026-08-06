// pages/theme/christmas-markets.tsx
//
// Christmas Markets & NYE — an editorial, cinematic theme landing (the "Christmas
// Markets" mockup) built from the reusable CinematicThemeLanding component. Every
// card seeds its prompt into a fresh /chat session with Kaira. The page is wrapped
// in the shared site Layout so it keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import { useSeedChat } from "../../components/theme/cinematic/useSeedChat";
import ActivityDetailsDrawer from "../../components/drawers/activityDetails/ActivityDetailsDrawer";
import CityDetailsDrawer from "../../components/drawers/cityDetails/CityDetailsDrawer";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";

const U = "https://images.unsplash.com";
const VISA = "https://visa.thetarzanway.com/country";
const CHAT = "https://thetarzanway.com/chat";
const PAGE = "/theme/christmas-markets";

// Catalog activity ids for the "Experiences I'd actually book" cards (from the
// Mercury BE links) — each opens the read-only activity details drawer.
const ACTIVITY = {
  pragueCastle: "3f454418-04a7-4809-91a1-b1e718ce2184",
  strudelShow: "d4d9c46f-e3ed-4369-836a-eab9c8f2b6cd",
  nightWatchman: "2a642596-e149-45bc-a645-6d557095eaa0",
  reichstag: "1d76ae36-aea8-463e-856d-7b584227b976",
  spanishRiding: "64d0e542-01af-4aaf-9509-ffcb53089e60",
  canalCruise: "db326346-d61c-4730-b928-301ff81de2b8",
};

// City ids for the "Which square is worth the stop" rows — each opens the city
// details drawer (its full list of tours/activities) via ?city_id=.
const CITY = {
  vienna: "80f5f7e8-aa6d-408c-bb7d-69f87b955ba8",
  prague: "2bc8d544-1135-4eba-be73-7609d8b410dc",
  dresden: "ac9d9319-7b00-43d7-b176-6c3a0b0ec4d8",
  strasbourg: "d1f30fc9-6a95-49da-9a0b-3a3bae39ef4f",
};

// Restaurant ids for the "Where to come in from the cold" cards — each opens
// the restaurant details drawer via ?restaurant_id=.
const RESTAURANT = {
  cafeCentral: "f29b64fc-1425-41e7-86a6-b65db6419a2a",
  louvre: "f3d3008a-fdbf-4263-a640-a056ef089e97",
  pfund: "8941a385-d363-4c31-b505-7c04d3298eb5",
  winkel: "2f225f49-7772-49cd-8c2a-b1449c45fab3",
  cambrinus: "a9937d45-cdf6-43f8-97d8-acf761c2de6e",
};

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
// Contextual imagery staged in media-staging/christmas-markets-2026/ — upload to
// S3 at media/website/christmas-markets-2026/ (the CDN path mapped below).
const IMG_BASE = `${CDN}/media/website/christmas-markets-2026`;
const IMG = {
  heroVienna: `${IMG_BASE}/hero-vienna-rathausplatz-hq.jpg`,
  heroStrasbourg: `${IMG_BASE}/hero-strasbourg-hq.jpg`,
  heroPrague: `${IMG_BASE}/hero-prague-hq.jpg`,
  heroBudapest: `${IMG_BASE}/hero-budapest-hq.jpg`,
  routeAlpine: `${IMG_BASE}/route-alpine-salzburg-hq.jpg`,
  routeRhine: `${IMG_BASE}/route-rhine-cologne-hq.jpg`,
  routeCentral: `${IMG_BASE}/route-central-budapest-hq.jpg`,
  expPragueCastle: `${IMG_BASE}/exp-prague-castle-hq.jpg`,
  expSchonbrunn: `${IMG_BASE}/exp-schonbrunn-hq.jpg`,
  expNightWatchman: `${IMG_BASE}/exp-night-watchman-rothenburg-hq.jpg`,
  expReichstag: `${IMG_BASE}/exp-reichstag-berlin-hq.jpg`,
  expSpanishRiding: `${IMG_BASE}/exp-spanish-riding-school-hq.jpg`,
  expCanalCruise: `${IMG_BASE}/exp-amsterdam-canal-cruise-hq.jpg`,
  marketVienna: `${IMG_BASE}/market-vienna-hq.jpg`,
  marketPrague: `${IMG_BASE}/market-prague-hq.jpg`,
  marketDresden: `${IMG_BASE}/market-dresden-striezelmarkt-hq.jpg`,
  marketStrasbourg: `${IMG_BASE}/market-strasbourg-hq.jpg`,
  tripFestive: `${IMG_BASE}/trip-festive-munich-hq.jpg`,
  tripMidnight: `${IMG_BASE}/trip-midnight-vienna-nye-hq.jpg`,
  tripRhine: `${IMG_BASE}/trip-rhine-amsterdam-hq.jpg`,
  eatCafeCentral: `${IMG_BASE}/eat-cafe-central-vienna-hq.jpg`,
  eatCafeLouvre: `${IMG_BASE}/eat-cafe-louvre-prague-hq.jpg`,
  eatPfund: `${IMG_BASE}/eat-pfunds-molkerei-dresden-hq.jpg`,
  eatWinkel: `${IMG_BASE}/eat-winkel43-amsterdam-hq.jpg`,
  eatCambrinus: `${IMG_BASE}/eat-cambrinus-bruges-hq.jpg`,
};
// Destination country-page images (reused from each /europe country page).
const DEST = {
  austria: `${CDN}/media/countries/168442217817077326774597167969.jpg`,
  germany: `${CDN}/media/countries/168441976189620375633239746094.jpg`,
  france: `${CDN}/media/countries/173131953880670285224914550781.webp`,
  czech: `${CDN}/media/countries/168441870417685723304748535156.jpg`,
};
// Other-theme page images (reused from each theme page's hero/first card).
const THEME_IMG = {
  northernLights: `${CDN}/media/website/northern-lights-2026/Sleep Beneath The Aurora.jpg`,
  lapland: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  edinburgh: `${CDN}/media/website/edinburgh-hogmanay-2026/Dec 29 --The Torchlight March.jpg`,
  filmy: `${CDN}/media/website/filmy-getaways-2026/DilChahtaHai.png`,
};


// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  hero:
    "We are 2 travellers and our dates are flexible in December. Plan a European Christmas markets trip built around the most magical squares — mulled wine, festive lights, and a New Year's Eve finish. Recommend the best market cities for the dates, string them into one smooth multi-city route with rail between them, and balance iconic markets with quieter local ones.",
  // Routes
  alpineClassic:
    "We are 2 travellers with flexible December dates. Plan a 9-night Alpine Christmas markets route through Munich, Salzburg and Vienna. Prioritise the great market squares, cosy cafés, a day in the mountains, and a New Year's Eve in Vienna. Include rail between cities and a relaxed, festive pace.",
  rhineRun:
    "We are 2 travellers with flexible December dates. Plan a Christmas markets trip along the Rhine — Strasbourg, Cologne and Amsterdam. Focus on the oldest and prettiest markets, riverside lights, and easy rail hops. Balance the famous markets with local squares and slow festive mornings.",
  centralLoop:
    "We are 2 travellers with flexible December dates. Plan a Central Europe Christmas loop through Prague, Vienna and Budapest with a New Year's Eve celebration. Prioritise old-town markets, thermal baths, festive food, and scenic rail between the cities.",
  // Chips / misc
  viennaNye:
    "We are 2 travellers. Plan a New Year's Eve in Vienna around the Silvesterpfad street party, midnight fireworks by the Rathaus, and a festive dinner. Add the best Christmas markets to see in the days before.",
  gluhweinCrawl:
    "We are 2 travellers. Plan a self-guided Glühwein and Christmas market crawl through the best squares of one European city, with the collectible mug stalls, food to try, and the prettiest lit streets.",
  // Markets — "show all the activities/tours in this city"
  activitiesVienna:
    "We are 2 travellers visiting Vienna for the Christmas markets. Show me all the tours and activities worth doing in Vienna in December — market walks, the Schönbrunn and Spanish Riding School experiences, coffeehouse culture, and New Year's Eve options — and add the best ones to my plan.",
  activitiesPrague:
    "We are 2 travellers visiting Prague for the Christmas markets. Show me all the tours and activities worth doing in Prague in December — Old Town and Castle tours, the Night Watchman walk, festive food, and river views — and add the best ones to my plan.",
  activitiesDresden:
    "We are 2 travellers visiting Dresden for the Striezelmarkt. Show me all the tours and activities worth doing in Dresden in December — the old town, the Frauenkirche, festive food and Stollen — and add the best ones to my plan.",
  activitiesStrasbourg:
    "We are 2 travellers visiting Strasbourg for the Christmas markets. Show me all the tours and activities worth doing in Strasbourg in December — the cathedral market, Petite France, Alsace wine and food — and add the best ones to my plan.",
  // Where to come in from the cold (restaurants)
  eatCafeCentral:
    "Tell me about Café Central in Vienna — the grand coffeehouse — and whether it's worth a stop on my Christmas markets trip. Add it to my Vienna plan.",
  eatCafeLouvre:
    "Tell me about Café Louvre in Prague and whether it's worth a stop for coffee and cake on my Christmas markets trip. Add it to my Prague plan.",
  eatPfund:
    "Tell me about Pfunds Molkerei (Gebrüder Pfund) in Dresden — the beautiful old dairy shop — and work a visit into my Dresden Christmas markets day.",
  eatWinkel:
    "Tell me about Winkel 43 in Amsterdam and its famous apple pie, and add a warm-up stop there to my Amsterdam Christmas plan.",
  eatCambrinus:
    "Tell me about Cambrinus and its Belgian beer and comfort food, and add a cosy indoor stop to my festive plan.",
  // Trips
  tripFestive:
    "We are 2 travellers. Build the classic festive markets trip — Munich, Salzburg and Vienna over 9 nights with rail and flights from Delhi included. Prioritise the great markets and a Vienna New Year's Eve.",
  tripNye:
    "We are a group of 4. Build a New Year's Eve city break in Central Europe — Prague and Vienna over 6 nights — with the best midnight celebration and festive markets, flights from Delhi included.",
  tripSlow:
    "We are 2 travellers. Build a slow, cosy Christmas markets trip along the Rhine — Strasbourg, Cologne and Amsterdam over 8 nights — with plenty of café time and easy rail, flights from Delhi included.",
  // Ask Kaira
  askBar:
    "Which European Christmas market trip should I do first — the Alpine classic (Munich, Salzburg, Vienna), the Rhine run (Strasbourg, Cologne, Amsterdam), or the Central Europe loop with a Vienna New Year's Eve? Compare the atmosphere, cost, and dates, then build the ideal itinerary for the one you recommend.",
};

const christmasMarketsConfig: CinematicThemeConfig = {
  header: {
    title: "Christmas markets & NYE",
    subtitle: "Theme · Europe · multi-city",
  },
  hero: {
    eyebrow: "MULLED WINE · CHRISTMAS LIGHTS · MIDNIGHT FIREWORKS",
    heading: { lead: "Europe's most magical", accent: "six weeks" },
    lede:
      "From the last week of November to New Year's Eve, the old squares light up and the whole continent smells of cinnamon. Tell me your dates and I'll build the route around the markets worth the detour.",
    placeholder: "Try: markets in December, NYE in Vienna, 9 nights",
    prompt: PROMPTS.hero,
    chips: [
      { label: "Best markets in December", prompt: PROMPTS.gluhweinCrawl },
      { label: "New Year's Eve in Vienna", prompt: PROMPTS.viennaNye },
      { label: "Rhine run · 8 nights", prompt: PROMPTS.rhineRun },
    ],
    // Desktop-only Kaira polaroid collage — each polaroid opens its destination.
    images: [
      {
        image: IMG.heroVienna,
        caption: "Vienna, Rathausplatz",
        href: "/europe/austria",
      },
      {
        image: IMG.heroStrasbourg,
        caption: "Strasbourg, Grande Île",
        href: "/europe/france",
      },
      {
        image: IMG.heroPrague,
        caption: "Prague, Old Town",
        href: "/europe/czech-republic",
      },
      {
        image: IMG.heroBudapest,
        caption: "Budapest, Vörösmarty",
        href: "/europe/hungary",
      },
    ],
  },
  sections: [
    // ── Routes ──
    {
      type: "cards",
      heading: {
        eyebrow: "Multi-city · swipe",
        lead: "Three ways to",
        accent: "string it together",
      },
      cards: [
        {
          image: IMG.routeAlpine,
          name: "The Alpine classic",
          line: "Munich · Salzburg · Vienna",
          tag: "9 nights",
          prompt: PROMPTS.alpineClassic,
        },
        {
          image: IMG.routeRhine,
          name: "The Rhine run",
          line: "Strasbourg · Cologne · Amsterdam",
          tag: "8 nights",
          prompt: PROMPTS.rhineRun,
        },
        {
          image: IMG.routeCentral,
          name: "The Central loop",
          line: "Prague · Vienna · Budapest",
          tag: "10 nights · NYE",
          prompt: PROMPTS.centralLoop,
          objectPosition: "center 110%",
        },
      ],
    },
    // ── Experiences (each opens the activity details drawer) ──
    {
      type: "cards",
      heading: { lead: "Experiences I'd", accent: "actually book" },
      cards: [
        {
          image: IMG.expPragueCastle,
          name: "Prague Castle tour with a local guide",
          line: "The castle complex, told by someone who lives it.",
          tag: "Prague",
          activityId: ACTIVITY.pragueCastle,
        },
        {
          image: IMG.expSchonbrunn,
          name: "Strudel show at Schönbrunn",
          line: "Watch the apple strudel pulled paper-thin.",
          tag: "Vienna",
          activityId: ACTIVITY.strudelShow,
        },
        {
          image: IMG.expNightWatchman,
          name: "Night Watchman in lantern light",
          line: "A lantern-lit walk through the old town after dark.",
          tag: "Germany",
          activityId: ACTIVITY.nightWatchman,
        },
        {
          image: IMG.expReichstag,
          name: "Reichstag dome & government quarter",
          line: "Berlin's glass dome and the halls of power.",
          tag: "Berlin",
          activityId: ACTIVITY.reichstag,
        },
        {
          image: IMG.expSpanishRiding,
          name: "Spanish Riding School tour",
          line: "Behind the scenes with the Lipizzaner horses.",
          tag: "Vienna",
          activityId: ACTIVITY.spanishRiding,
        },
        {
          image: IMG.expCanalCruise,
          name: "Classic boat canal cruise",
          line: "Festive lights from the water.",
          tag: "Amsterdam",
          activityId: ACTIVITY.canalCruise,
        },
      ],
    },
    // ── Markets — tap a city to open its city details (all its tours) ──
    {
      type: "list",
      heading: {
        lead: "Which square is",
        accent: "worth the stop",
        note: "Tap a city for every tour and activity there",
      },
      rows: [
        {
          image: IMG.marketVienna,
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          name: "Vienna",
          badge: "Kaira's pick",
          line: "Rathausplatz glows; the smaller Spittelberg lanes steal the show.",
          href: `${PAGE}?city_id=${CITY.vienna}`,
        },
        {
          image: IMG.marketPrague,
          emoji: "🏰",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          name: "Prague",
          line: "Old Town Square, a giant tree, and mulled honey wine.",
          href: `${PAGE}?city_id=${CITY.prague}`,
        },
        {
          image: IMG.marketDresden,
          emoji: "🥨",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          name: "Dresden",
          line: "The Striezelmarkt — Germany's oldest, and its Stollen.",
          href: `${PAGE}?city_id=${CITY.dresden}`,
        },
        {
          image: IMG.marketStrasbourg,
          emoji: "✨",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          name: "Strasbourg",
          line: "The oldest of them all, wrapped around the cathedral.",
          href: `${PAGE}?city_id=${CITY.strasbourg}`,
        },
      ],
    },
    // ── Trips ──
    {
      type: "trips",
      heading: {
        lead: "Which December is",
        accent: "yours?",
        note: "Priced from Delhi · flights and rail included",
      },
      cards: [
        {
          image: IMG.tripFestive,
          tag: "Markets · classic · 9N",
          name: "The festive classic",
          line: "Munich, Salzburg, Vienna — the great squares.",
          price: "₹2,95,000 / person",
          nights: "9 nights",
          prompt: PROMPTS.tripFestive,
        },
        {
          image: IMG.tripMidnight,
          tag: "NYE · group · 6N",
          name: "The midnight trip",
          line: "Prague to a Vienna New Year's Eve.",
          price: "₹2,45,000 / person",
          nights: "6 nights",
          urgent: "NYE stays sell out by early November",
          prompt: PROMPTS.tripNye,
        },
        {
          image: IMG.tripRhine,
          tag: "Markets · slow · 8N",
          name: "The slow Rhine",
          line: "Strasbourg, Cologne, Amsterdam — cosy and unhurried.",
          price: "₹2,75,000 / person",
          nights: "8 nights",
          prompt: PROMPTS.tripSlow,
        },
      ],
    },
    // ── Where to come in from the cold (dark) ──
    {
      type: "eats",
      heading: { lead: "Where to", accent: "come in from the cold" },
      cards: [
        {
          image: IMG.eatCafeCentral,
          name: "Café Central",
          city: "Vienna",
          line: "A grand coffeehouse under vaulted ceilings.",
          rating: "4.4",
          reviews: "35,000",
          href: `${PAGE}?restaurant_id=${RESTAURANT.cafeCentral}`,
        },
        {
          image: IMG.eatCafeLouvre,
          name: "Café Louvre",
          city: "Prague",
          line: "Coffee, cake and history since 1902.",
          rating: "4.6",
          reviews: "18,000",
          href: `${PAGE}?restaurant_id=${RESTAURANT.louvre}`,
        },
        {
          image: IMG.eatPfund,
          name: "Pfunds Molkerei",
          city: "Dresden",
          line: "The world's most beautiful dairy shop.",
          rating: "4.5",
          reviews: "9,500",
          href: `${PAGE}?restaurant_id=${RESTAURANT.pfund}`,
        },
        {
          image: IMG.eatWinkel,
          name: "Winkel 43",
          city: "Amsterdam",
          line: "The apple pie people queue in the cold for.",
          rating: "4.5",
          reviews: "6,800",
          href: `${PAGE}?restaurant_id=${RESTAURANT.winkel}`,
        },
        {
          image: IMG.eatCambrinus,
          name: "Cambrinus",
          city: "Bruges",
          line: "Belgian beer and comfort food by the fire.",
          rating: "4.4",
          reviews: "7,200",
          href: `${PAGE}?restaurant_id=${RESTAURANT.cambrinus}`,
        },
      ],
    },
    // ── When to go ──
    {
      type: "months",
      heading: {
        eyebrow: "The season has four different weeks",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Late Nov",
          name: "Opening week",
          line: "Markets light up, crowds are thin, everything feels new.",
        },
        {
          range: "Early Dec",
          name: "The sweet spot",
          line: "Full swing, still calm midweek. Kaira's pick for markets.",
        },
        {
          range: "Dec 20–26",
          name: "Peak & Christmas",
          line: "Busiest and priciest; many markets close on the 24th–25th.",
        },
        {
          range: "Dec 27–31",
          name: "New Year run",
          line: "A few markets reopen; cities gear up for midnight.",
        },
      ],
      note:
        "Most markets run late November to 23 December, then a handful reopen for New Year. If you want both markets and NYE, aim your last nights at a city that keeps its market open — Vienna and Budapest are safe bets.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: { lead: "Your visa,", accent: "handled" },
      intro:
        "One Schengen visa covers this whole trip — apply through the country where you'll spend the most nights. We prep the paperwork, check every document, and submit for you. No embassy queues.",
      cards: [
        {
          country: "Czech Republic",
          cities: "Prague",
          fee: "₹3,999",
          href: `${VISA}/czech-republic-visa-online`,
        },
        {
          country: "Netherlands",
          cities: "Amsterdam",
          fee: "₹3,654",
          href: `${VISA}/netherlands-visa-online`,
        },
        {
          country: "Austria",
          cities: "Vienna · Salzburg",
          fee: "₹4,323",
          href: `${VISA}/austria-visa-online`,
        },
        {
          country: "Germany",
          cities: "Nuremberg · Cologne · Dresden",
          fee: "₹3,899",
          href: `${VISA}/germany-visa-online`,
        },
        {
          country: "France",
          cities: "Strasbourg",
          fee: "₹4,219",
          href: `${VISA}/france-visa-online`,
        },
      ],
      facts: [
        { label: "Visa type", value: "Schengen short-stay" },
        { label: "Apply via", value: "Most-nights country" },
        { label: "We handle", value: "Docs + submission" },
      ],
      note:
        "The €90 fee is the standard Schengen adult application fee. One visa lets you cross freely between all the countries on your route.",
    },
    // ── Read this first ──
    {
      type: "list",
      compact: true,
      heading: { lead: "Read this", accent: "first" },
      rows: [
        {
          emoji: "🧣",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          name: "It's cold, but it's dry cold",
          line: "Layers, gloves, waterproof boots. The Glühwein helps.",
        },
        {
          emoji: "🚆",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          name: "Rail beats flying between cities",
          line: "City-centre to city-centre, and you keep the festive views.",
        },
        {
          emoji: "🗓️",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          name: "Check the closing dates",
          line: "Markets wind down around the 23rd — build the route around it.",
        },
      ],
    },
    // ── Stories — real Google reviews; each opens the traveller's itinerary ──
    // Review links (for reference):
    //   Naveen — https://share.google/zOTQwy9G4uBLbnddL
    //   Sumit  — https://share.google/7kA1DZAg1VlOZB0o2
    //   Neel   — https://share.google/ZA8l6hJtrTzAXsgZp
    {
      type: "stories",
      heading: { eyebrow: "Loved on Google", lead: "People who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Google review",
          name: "Naveen",
          route: "See their itinerary →",
          href: `${CHAT}/8fd53624-ba0c-4ab2-9708-29108738fb56`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Sumit",
          route: "See their itinerary →",
          href: `${CHAT}/0be8701a-8e41-41a9-ba7a-c0d540efa528`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Neel",
          route: "See their itinerary →",
          href: `${CHAT}/7504c8b4-5217-47d6-910c-3661e04cc203`,
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
          name: "Austria",
          meta: "Vienna · Salzburg",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image: DEST.austria,
          href: "/europe/austria",
        },
        {
          name: "Germany",
          meta: "Nuremberg · Cologne",
          emoji: "🥨",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: DEST.germany,
          href: "/europe/germany",
        },
        {
          name: "France",
          meta: "Strasbourg",
          emoji: "✨",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: DEST.france,
          href: "/europe/france",
        },
        {
          name: "Czech Republic",
          meta: "Prague",
          emoji: "🏰",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image: DEST.czech,
          href: "/europe/czech-republic",
        },
      ],
      footerCta: { label: "View all destinations", href: "/europe" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Winter elsewhere?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: THEME_IMG.northernLights,
          href: "/theme/northern-lights",
        },
        {
          name: "Lapland with Santa",
          meta: "Dec",
          emoji: "🦌",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: THEME_IMG.lapland,
          href: "/theme/lapland",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image: THEME_IMG.edinburgh,
          href: "/theme/edinburgh-hogmanay",
        },
        {
          name: "Filmy getaways",
          meta: "Year-round",
          emoji: "🎬",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: THEME_IMG.filmy,
          href: "/theme/filmy-getaways",
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
        { n: "1", title: "Tell me your dates", sub: "and rough idea." },
        { n: "2", title: "I draft the route", sub: "markets, rail, stays." },
        { n: "3", title: "You book", sub: "only what you love." },
      ],
      cta: { label: "Start planning", prompt: PROMPTS.hero },
      note: "10,000+ trips · rated 4.9 across all of them",
    },
  ],
  askBar: {
    placeholder: "Ask me about the markets…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
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

const ChristmasMarketsThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const router = useRouter();
  // City / restaurant detail drawers are driven by URL query params so the
  // shared card components can open them with a plain href.
  const cityId = router.query.city_id as string | undefined;
  const restaurantId = router.query.restaurant_id as string | undefined;
  const closeQueryDrawer = () =>
    router.push({ pathname: PAGE }, undefined, { shallow: true });
  // Read-only activity details drawer (opened from the "Experiences" cards).
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
    <Layout page="Theme Page" slug="christmas-markets">
      <Head>
        <title>
          Christmas Markets & New Year in Europe | Trip Planner & Itinerary | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a European Christmas markets and New Year's Eve trip with The Tarzan Way's AI itinerary — Vienna, Strasbourg, Nuremberg, Prague and more, strung into one festive multi-city route with rail included, for Indian travellers."
        />
        <meta
          property="og:title"
          content="Christmas Markets & New Year in Europe | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a European Christmas markets and New Year's Eve trip with The Tarzan Way's AI itinerary — Vienna, Strasbourg, Nuremberg, Prague and more, strung into one festive multi-city route with rail included, for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/christmas-markets"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/christmas-markets"
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
                  name: "Christmas Markets & New Year in Europe — Trip Planner",
                  description:
                    "Plan a European Christmas markets and New Year's Eve trip with The Tarzan Way's AI itinerary — Vienna, Strasbourg, Nuremberg, Prague and more, strung into one festive multi-city route with rail included, for Indian travellers.",
                  url: "https://thetarzanway.com/theme/christmas-markets",
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
                      name: "Christmas Markets & NYE",
                      item: "https://thetarzanway.com/theme/christmas-markets",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={christmasMarketsConfig}
        onSelectPrompt={seedChat}
        onSelectActivity={openActivity}
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
      {/* City details (all tours/activities in a city) — driven by ?city_id */}
      {cityId && <CityDetailsDrawer show handleCloseDrawer={closeQueryDrawer} />}
      {/* Restaurant details — driven by ?restaurant_id */}
      {restaurantId && (
        <POIDetailsDrawer
          show
          activityData={{ id: restaurantId, type: "restaurant" }}
          handleCloseDrawer={closeQueryDrawer}
          removeDelete
          removeChange
        />
      )}
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ChristmasMarketsThemePage);
