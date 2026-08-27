// pages/theme/christmas-markets.tsx
//
// Christmas Markets & NYE — an editorial, cinematic theme landing (the "Christmas
// Markets" mockup) built from the reusable CinematicThemeLanding component. Every
// card seeds its prompt into a fresh /chat session with Kaira. The page is wrapped
// in the shared site Layout so it keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
// Retired with the drawers below — nothing on the page routes any more.
// import { useRouter } from "next/router";
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
// import CityDetailsDrawer from "../../components/drawers/cityDetails/CityDetailsDrawer";
// import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const U = "https://images.unsplash.com";
const VISA = "https://visa.thetarzanway.com/country";
const VISA_HOME = "https://visa.thetarzanway.com/";
const CHAT = "https://thetarzanway.com/chat";
const PAGE = "/theme/christmas-markets";
const THEME_SLUG = "christmas-markets";

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
    "We are 2 travellers with flexible December dates, over 9 nights across Christmas and New Year. Plan a European Christmas markets trip built around the most magical squares — mulled wine, festive lights, Christmas Day itself, and a New Year's Eve finish. Recommend the best market cities for the dates, string them into one smooth multi-city route with rail between them, and balance iconic markets with quieter local ones.",
  // Routes
  alpineClassic:
    "We are 2 travellers with flexible December dates. Plan a 9-night Alpine Christmas markets route through Munich, Salzburg and Vienna across Christmas and New Year. Prioritise the great market squares, cosy cafés, Christmas Day in the mountains, and a New Year's Eve in Vienna. Include rail between cities and a relaxed, festive pace.",
  rhineRun:
    "We are 2 travellers with flexible December dates. Plan an 8-night Christmas markets trip along the Rhine over Christmas — Strasbourg, Cologne and Amsterdam, with Christmas Day itself in one of them. Focus on the oldest and prettiest markets, riverside lights, and easy rail hops. Balance the famous markets with local squares and slow festive mornings.",
  centralLoop:
    "We are 2 travellers with flexible December dates. Plan a 10-night Central Europe Christmas loop through Prague, Vienna and Budapest with Christmas Day and a New Year's Eve celebration. Prioritise old-town markets, thermal baths, festive food, and scenic rail between the cities.",
  // Chips / misc
  viennaNye:
    "We are 2 travellers. Plan 9 nights in Vienna across Christmas and New Year in December — Christmas Day in the city, then the Silvesterpfad street party, midnight fireworks by the Rathaus, and a festive dinner. Add the best Christmas markets to see in the days before.",
  gluhweinCrawl:
    "We are 2 travellers with 3 nights over Christmas in December. Plan a self-guided Glühwein and Christmas market crawl through the best squares of one European city, with the collectible mug stalls, food to try, and the prettiest lit streets.",
  // Markets — "show all the activities/tours in this city"
  activitiesVienna:
    "We are 2 travellers spending 3 of our December nights in Vienna over Christmas for the markets. Show me all the tours and activities worth doing in Vienna over Christmas — market walks, the Schönbrunn and Spanish Riding School experiences, coffeehouse culture, and what stays open on Christmas Day — and add the best ones to my plan.",
  activitiesPrague:
    "We are 2 travellers spending 3 of our December nights in Prague over Christmas for the markets. Show me all the tours and activities worth doing in Prague over Christmas — Old Town and Castle tours, the Night Watchman walk, festive food, river views, and what stays open on Christmas Day — and add the best ones to my plan.",
  activitiesDresden:
    "We are 2 travellers spending 2 of our December nights in Dresden over Christmas for the Striezelmarkt, which runs to Christmas Eve. Show me all the tours and activities worth doing in Dresden over Christmas — the old town, the Frauenkirche, festive food and Stollen — and add the best ones to my plan.",
  activitiesStrasbourg:
    "We are 2 travellers spending 3 of our December nights in Strasbourg over Christmas for the markets. Show me all the tours and activities worth doing in Strasbourg over Christmas — the cathedral market, Petite France, Alsace wine and food — and add the best ones to my plan.",
  // Where to come in from the cold (restaurants)
  eatCafeCentral:
    "Tell me about Café Central in Vienna — the grand coffeehouse — and whether it's worth a stop on our 9-night Christmas markets trip in December for two. Add it to my Vienna plan.",
  eatCafeLouvre:
    "Tell me about Café Louvre in Prague and whether it's worth a stop for coffee and cake on our 9-night Christmas markets trip in December for two. Add it to my Prague plan.",
  eatPfund:
    "Tell me about Pfunds Molkerei (Gebrüder Pfund) in Dresden — the beautiful old dairy shop — and work a visit into our 9-night Christmas markets trip in December for two.",
  eatWinkel:
    "Tell me about Winkel 43 in Amsterdam and its famous apple pie, and add a warm-up stop there to our 9-night Christmas markets trip in December for two.",
  eatCambrinus:
    "Tell me about Cambrinus and its Belgian beer and comfort food, and add a cosy indoor stop to our 9-night Christmas markets trip in December for two.",
  // The "Which December is yours?" trips carry no prompt — each card opens a
  // finished itinerary at /chat/{id} instead of seeding a fresh session.
  // Ask Kaira
  askBar:
    "Which European Christmas market trip should we do first, over 9 nights across Christmas and New Year in December for two — the Alpine classic (Munich, Salzburg, Vienna), the Rhine run (Strasbourg, Cologne, Amsterdam), or the Central Europe loop with a Vienna New Year's Eve? Compare the atmosphere, cost, and dates, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax / dates) rather than left for the backend to read out of the
// sentence. Keyed by prompt text via promptIntakeMap, so a card only carries
// its prompt and the facts follow.
//
// Every window on this page is built around Christmas and contains the 25th —
// `day` is the start, chosen so the 25th always falls inside `day` + `nights`.
// Without an anchor these would leave on the mid-month Saturday and be home
// before Christmas Eve.
//
// Two rules shape the December ones:
//   • Nothing STARTS on the 25th. Landing on Christmas Day means flying on it
//     and missing the run-up, so the anchored trips leave on Christmas Eve.
//   • Nothing ENDS on 1 January. Checking out the morning after the fireworks
//     is a poor last day, so the New Year trips run to the 2nd.
// Together those put the floor at nine nights from the 24th for anything that
// promises both Christmas Day and New Year's Eve — the 25th and the 31st are
// six days apart, and the 2nd is two beyond that. That is why the Vienna New
// Year chip is 9N rather than the 5N it was.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  hero: { nights: 9, month: 12, day: 24, who: "Couple" },
  alpineClassic: { nights: 9, month: 12, day: 24, who: "Couple" },
  rhineRun: { nights: 8, month: 12, day: 21, who: "Couple" },
  centralLoop: { nights: 10, month: 12, day: 23, who: "Couple" },
  viennaNye: { nights: 9, month: 12, day: 24, who: "Couple" },
  gluhweinCrawl: { nights: 3, month: 12, day: 24, who: "Couple" },
  activitiesVienna: { nights: 3, month: 12, day: 24, who: "Couple" },
  activitiesPrague: { nights: 3, month: 12, day: 24, who: "Couple" },
  activitiesDresden: { nights: 2, month: 12, day: 24, who: "Couple" },
  activitiesStrasbourg: { nights: 3, month: 12, day: 24, who: "Couple" },
  eatCafeCentral: { nights: 9, month: 12, day: 21, who: "Couple" },
  eatCafeLouvre: { nights: 9, month: 12, day: 21, who: "Couple" },
  eatPfund: { nights: 9, month: 12, day: 21, who: "Couple" },
  eatWinkel: { nights: 9, month: 12, day: 21, who: "Couple" },
  eatCambrinus: { nights: 9, month: 12, day: 21, who: "Couple" },
  askBar: { nights: 9, month: 12, day: 24, who: "Couple" },
});

const christmasMarketsConfig: CinematicThemeConfig = {
  // Market green — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["christmas-markets"],
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
      ctaLabel: "Create plan →",
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
    // ── Experiences (card click opens the drawer; "+ Add" saves to the trip) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
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
          objectPosition: "center 90%"
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
    // Saveable: "+ Add" puts the city in the trip, the card body still opens
    // the city page for its tours/activities. These are also the cities the
    // mini-form's route picks from, so any that the chosen route already
    // covers are dropped before the submission reaches /chatkit (see
    // ThemeIntakeForm's route de-dupe) rather than being sent twice.
    {
      type: "list",
      selectable: true,
      itemKind: "city",
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
    // ── Trips — three finished itineraries, not prompts. Each card opens the
    // real plan at /chat/{itinerary_id}, so the nights live in the tag and the
    // card carries no "Create plan" CTA.
    //
    // Prices are each itinerary's own `per_person_total_cost`, rounded the way
    // the itinerary page rounds it, so the number on the card is the number the
    // visitor lands on. Re-check them whenever the plans are re-priced. ──
    {
      type: "trips",
      heading: {
        lead: "Which December is",
        accent: "yours?",
      },
      cards: [
        {
          image: IMG.tripMidnight,
          tag: "Couple · 9N",
          name: "Markets, then NYE in Vienna",
          line: "Salzburg and Prague squares, finishing with the Silvesterpfad and a waltz you'll fake convincingly.",
          price: "₹1,91,389 / person",
          urgent: "NYE week — Vienna rooms 80% gone by September",
          href: `${CHAT}/8495d68b-5430-4e4a-979c-a270d80d8fa3`,
        },
        {
          image: IMG.marketDresden,
          tag: "Family · ages 6+ · 8N",
          name: "The gingerbread route",
          line: "Dresden and Berlin. Short train hops, early nights, a lot of gingerbread.",
          price: "₹3,38,139 / person",
          href: `${CHAT}/3ffa5b92-af47-401b-aff8-e56af6c38c05`,
        },
        {
          image: IMG.tripRhine,
          tag: "Slow · 10N",
          name: "Canals and lanterns",
          line: "Bruges, Amsterdam, Copenhagen. Fewer stalls, more candlelight, Tivoli lit end to end.",
          price: "₹2,86,060 / person",
          href: `${CHAT}/efd8d6f8-8a13-4bc1-9d9c-3ce15675590a`,
        },
      ],
    },
    // ── Where to come in from the cold (dark) ──
    {
      type: "eats",
      selectable: true,
      itemKind: "cafe",
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
        {
          country: "Hungary",
          cities: "Budapest · open through New Year",
          href: VISA_HOME,
        },
      ],
      facts: [
        { label: "Visa type", value: "Schengen short-stay" },
        { label: "Apply via", value: "Most-nights country" },
        { label: "We handle", value: "Docs + submission" },
        { label: "Embassy fee", value: "€90 adult" },
      ],
      note:
        "The €90 fee is the standard Schengen adult application fee. One visa lets you cross freely between all the countries on your route.",
    },
    // ── Read this first ──
    // {
    //   type: "list",
    //   compact: true,
    //   heading: { lead: "Read this", accent: "first" },
    //   rows: [
    //     {
    //       emoji: "🧣",
    //       gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
    //       name: "It's cold, but it's dry cold",
    //       line: "Layers, gloves, waterproof boots. The Glühwein helps.",
    //     },
    //     {
    //       emoji: "🚆",
    //       gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
    //       name: "Rail beats flying between cities",
    //       line: "City-centre to city-centre, and you keep the festive views.",
    //     },
    //     {
    //       emoji: "🗓️",
    //       gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
    //       name: "Check the closing dates",
    //       line: "Markets wind down around the 23rd — build the route around it.",
    //     },
    //   ],
    // },
    // ── Stories — each card opens that traveller's own December itinerary ──
    // These used to carry three Google reviewers (Naveen, Sumit, Neel) whose
    // linked trips were a February Europe run and two Greek summers — real
    // trips, but nothing to do with markets. They now point at December plans
    // through the market cities, so the card, the summary and the itinerary
    // behind it all describe the same trip. `summary` renders unquoted; none of
    // these travellers has review text on file, so nothing is put in quotes.
    // Retired Google review links, if the copy is ever wanted back:
    //   Naveen — https://share.google/zOTQwy9G4uBLbnddL
    //   Sumit  — https://share.google/7kA1DZAg1VlOZB0o2
    //   Neel   — https://share.google/ZA8l6hJtrTzAXsgZp
    {
      type: "stories",
      heading: { eyebrow: "Came back · rated it", lead: "People who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Couple",
          name: "Pujan",
          when: "Couple · Prague to Budapest",
          summary:
            "Four market cities at three nights each — Prague, Salzburg, Vienna and Budapest. Long enough in each to do the squares twice.",
          href: `${CHAT}/44ed05ba-6e76-400b-af42-b9ec9a24ef5c`,
        },
        {
          rating: "5.0",
          type: "Family of 4",
          name: "Lakshman",
          when: "Family of 4 · Munich to Zurich",
          summary:
            "Five cities for four of them. Munich to open, then Prague, Budapest and Vienna, finishing up in Zurich.",
          href: `${CHAT}/d743b45e-74e4-4200-8f02-ca48354b2b16`,
        },
        {
          rating: "5.0",
          type: "Friends",
          name: "Khushbu",
          when: "Friends · Amsterdam to Budapest",
          summary:
            "The northern markets before the Danube ones — Amsterdam and Berlin first, then Prague and four nights in Budapest.",
          href: `${CHAT}/92a629fa-0219-46d5-8f54-222c43711a42`,
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
  ],
  askBar: {
    placeholder: "Ask me about the markets…",
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

const ChristmasMarketsThemePage = ({
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
  // const router = useRouter();
  // City / restaurant detail drawers are driven by URL query params so the
  // shared card components can open them with a plain href.
  // const cityId = router.query.city_id as string | undefined;
  // const restaurantId = router.query.restaurant_id as string | undefined;
  // const closeQueryDrawer = () =>
    // router.push({ pathname: PAGE }, undefined, { shallow: true });
  // Read-only activity details drawer (opened from the "Experiences" cards).
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
      City details (all tours/activities in a city) — driven by ?city_id
      {cityId && <CityDetailsDrawer show handleCloseDrawer={closeQueryDrawer} />}
      Restaurant details — driven by ?restaurant_id
      {restaurantId && (
        <POIDetailsDrawer
          show
          activityData={{ id: restaurantId, type: "restaurant" }}
          handleCloseDrawer={closeQueryDrawer}
          removeDelete
          removeChange
        />
      )}
      */}
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ChristmasMarketsThemePage);
