// pages/theme/thailand-bachelor.tsx
//
// Thailand bachelor & bachelorette — an editorial, cinematic theme landing (the
// "Thailand Bachelor Theme" mockup) built from the reusable
// CinematicThemeLanding component. Every card either seeds its prompt into a
// fresh /chat session with Kaira or opens the read-only catalog drawer for the
// element behind it. The page is wrapped in the shared site Layout so it keeps
// the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import ActivityDetailsDrawer from "../../components/drawers/activityDetails/ActivityDetailsDrawer";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const VISA = "https://visa.thetarzanway.com/country";
const CHAT = "https://thetarzanway.com/chat";
const PAGE = "/theme/thailand-bachelor";
const THEME_SLUG = "thailand-bachelor";

// Catalog activity ids for the "Activities worth the day" cards (from the
// Mercury BE links) — each opens the read-only activity details drawer.
const ACTIVITY = {
  yona: "d997006b-0560-422c-9095-4fa5dca04394",
  hongSpeedboat: "0dab0d41-ee3f-4091-bcf2-8a5d1c333eef",
  phiPhiCatamaran: "97d8dcd7-cc6f-487b-8138-9cc63c056834",
  sevenIslandSunset: "2ac463df-014f-4d91-8799-cde81402131f",
  raftingZipline: "889f72e9-cccc-42c9-a6ac-2c332510ca8f",
  chaoPhraya: "6c5d4c55-8a08-45e1-a884-be351454985c",
  jamesBond: "eb58fa2e-98c3-4a9c-b463-cdf6e3037347",
  // The whole-boat charter behind the "Four kinds of night out" CTA.
  longtailCharter: "a09d5503-cb65-4ff7-aa1e-dc64ef546f21",
};

// "Which island is yours" — the tour that actually gets you to each island.
const ISLAND = {
  phiPhi: "67bdf7f3-375b-468c-b2a0-2e1e16a84fdc",
  hong: "c96c494b-4a1d-4bf7-9f58-aca4d98416d1",
  phangNga: "6828268f-5887-4503-b7cd-70b47e72bf4b",
  railay: "7044867c-6365-498f-ad0f-eb4465e73c93",
};

// POI ids for "For the morning after" — each opens the POI drawer via ?poi_id=.
const POI = {
  bigBuddha: "0024deeb-cf42-454b-94f7-50da5dafa6e1",
  watArun: "95aadf7d-c327-4a93-ba00-f541a34ad686",
  chatuchak: "47052e65-cb22-428a-bfe3-2bc735192947",
  sanctuary: "6e705e00-5ab1-4454-a9d6-b1dc4a072664",
  lumphini: "95748ad7-4b89-472a-87b6-2a3055b45745",
  iconsiam: "b38d84ab-6167-489f-9e60-081dcaef5baf",
};

// Restaurant ids for "Where to start the night" — ?restaurant_id=.
const RESTAURANT = {
  vertigo: "e8b9aa60-1c24-4f67-8b22-e424bae5ef0e",
  maggieChoo: "a69619a4-159e-4896-81b6-ae65f801a62c",
  phiPhiReggae: "7517e4f3-4c05-4fae-b1f4-70c6178991d7",
  jungleClub: "6504fc01-50b2-4c16-9348-b307ff43a534",
  laeLay: "1fcceb36-712b-4195-a0aa-71f14f1ca99a",
  yaowarat: "a9916d20-53a2-408f-93b0-c19a1d87a146",
};

// Catalog imagery straight from Mercury, so a card and the drawer it opens
// always show the same photo.
const M = "https://images.thetarzanway.com/media";
const IMG = {
  // Activities
  yona: `${M}/activities/176782413521073794364929199219.webp`,
  hongSpeedboat: `${M}/activities/169089891563917303085327148438.jpg`,
  phiPhiCatamaran: `${M}/activities/177026169906301355361938476562.jpeg`,
  sevenIslandSunset: `${M}/activities/171328157013065576553344726562.jpg`,
  raftingZipline: `${M}/activities/175672411963634657859802246094.jpeg`,
  chaoPhraya: `${M}/activities/171328210027878880500793457031.jpg`,
  jamesBond: `${M}/activities/175672445995741558074951171875.jpg`,
  // Islands
  phiPhi: `${M}/activities/175672376581723809242248535156.jpeg`,
  hongIsland: `${M}/activities/175646518750200438499450683594.jpeg`,
  phangNga: `${M}/activities/171328199544626688957214355469.jpg`,
  railay: `${M}/activities/171328196150627899169921875000.jpg`,
  // POIs
  bigBuddha: `${M}/pois/169399071186543273925781250000.jpg`,
  watArun: `${M}/pois/168425125926943612098693847656.jpeg`,
  chatuchak: `${M}/pois/168301604959737777709960937500.jpeg`,
  sanctuary: `${M}/pois/175214512178936147689819335938.jpg`,
  lumphini: `${M}/pois/168425134647174572944641113281.jpeg`,
  iconsiam: `${M}/pois/176539061435841441154479980469.jpg`,
  // Restaurants
  vertigo: `${M}/restaurant/169083175181786060333251953125.jpeg`,
  maggieChoo: `${M}/restaurant/169083177862236094474792480469.jpeg`,
  phiPhiReggae: `${M}/restaurant/169104510509408783912658691406.jpeg`,
  jungleClub: `${M}/restaurant/169104466671661233901977539062.jpeg`,
  laeLay: `${M}/restaurant/169104523343862318992614746094.jpeg`,
  yaowarat: `${M}/restaurant/169083180374274635314941406250.jpeg`,
  // Destinations / trips
  phuket: `${M}/pois/168301605450005459785461425781.jpeg`,
};
// Other-theme page images (reused from each theme page's hero/first card).
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const HM = `${CDN}/media/website/honeymoon-theme-2026`;
const THEME_IMG = {
  honeymoon: `${HM}/Maldives%20%E2%80%94%20The%20Overwater%20Villa%20Fantasy.jpg`,
  proposal: `${HM}/Private%20Desert%20Dinner%20Under%20the%20Stars%20%E2%80%94%20Rajasthan.png`,
  hokkaido: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  greece: `${HM}/Greece%20%E2%80%94%20Santorini%20and%20Mykonos.jpg`,
};

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  hero:
    "We are 8 friends planning a bachelor/bachelorette trip to Thailand, and our travel dates are flexible. Help us pick the right bases, then build one itinerary around a private pool villa, island days, beach clubs and nightlife — with enough downtime that the trip never feels rushed. Keep the group together and the transfers handled.",
  // Chips
  villaWeekend:
    "We are 8 friends, and our travel dates are flexible. We want a bachelor/bachelorette trip centered around a private pool villa. Include beach clubs, villa parties, island hopping, great food, nightlife, and enough downtime to enjoy the villa together.",
  phuketParty:
    "We are 8 friends, and our travel dates are flexible. We want an energetic bachelor/bachelorette trip in Phuket. Prioritize beach clubs, nightlife, island tours, water sports, rooftop bars, great restaurants, and memorable group experiences.",
  krabiEscape:
    "We are 8 friends, and our travel dates are flexible. We want a relaxed bachelor/bachelorette trip in Krabi. Include beautiful beaches, island hopping, private boat trips, scenic viewpoints, beach cafés, sunset dinners, and a luxury villa.",
  partyRecovery:
    "We are 8 friends, and our travel dates are flexible. We want the perfect balance of nightlife and downtime. Combine beach clubs, bars, and parties with pool days, cafés, island tours, and recovery time so the trip never feels rushed.",
  // Routes — "Pick your crew's vibe"
  lastHurrah:
    "We are 8 friends, and our travel dates are flexible. We want a 6-night bachelor/bachelorette trip combining Phuket and Krabi. Start with Phuket's beach clubs, nightlife, rooftop bars, and lively atmosphere before slowing down in Krabi with island hopping, private boat trips, scenic beaches, sunset dinners, and a luxury pool villa. Balance party nights with relaxed beach days.",
  cityMeetsBeach:
    "We are 8 friends, and our travel dates are flexible. We want a 7-night Thailand bachelor/bachelorette itinerary starting in Bangkok before heading to Phuket. Include rooftop bars, nightlife, shopping, local food, luxury stays, beach clubs, island tours, water activities, and enough downtime to enjoy the trip together. Create the perfect balance of city energy and island relaxation.",
  privateParadise:
    "We are 8 friends, and our travel dates are flexible. We want an 8-night bachelor/bachelorette trip through Krabi and Koh Samui. Prioritize luxury private villas, beach clubs, sunset cruises, island hopping, lively nightlife, great restaurants, spa experiences, and memorable group activities. Keep the itinerary relaxed during the day and vibrant in the evenings, with plenty of time to enjoy the villa together.",
  // Trips
  tripPhuketVilla:
    "We are 8 friends. Build the Phuket villa and boats trip — 6 nights, one private pool villa in Bang Tao, three island days and two nights out, with transfers held for the whole group and flights from Delhi included.",
  tripKrabiBangkok:
    "We are 6 friends. Build the Krabi slow, Bangkok loud trip — 7 nights: four of longtails and cliff bars in Krabi, then three of rooftops and Yaowarat in Bangkok, with a spa afternoon on the last day and flights from Delhi included.",
  tripOneBase:
    "We are 10 friends. Build the one-base weekender — 5 nights, nobody changes hotels: one villa in Phuket, boats out and back daily, minimal logistics, flights from Delhi included.",
  // Ask Kaira
  askBar:
    "Which Thailand send-off should we do — Phuket and Krabi over 6 nights, Bangkok and Phuket over 7, or Krabi and Koh Samui over 8? Compare the nightlife, the villas, the cost per head and the boat days, then build the ideal itinerary for the one you recommend.",
};

const thailandBachelorConfig: CinematicThemeConfig = {
  // Andaman turquoise — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["thailand-bachelor"],
  header: {
    title: "Thailand bachelor & bachelorette",
    subtitle: "Theme · Thailand · year round",
  },
  hero: {
    eyebrow: "FRIENDS · VILLAS · ISLANDS · NIGHTLIFE",
    heading: { lead: "The last big one", accent: "before the wedding." },
    lede:
      "Eight people, six flights, one villa. The hard part was never the party — it's getting everyone in the same place with a boat waiting. Tell me the headcount and I'll handle the rest.",
    placeholder: "Try: Phuket and Krabi for eight of us, five nights, January",
    prompt: PROMPTS.hero,
    chips: [
      { label: "Villa weekend", prompt: PROMPTS.villaWeekend },
      { label: "Phuket party", prompt: PROMPTS.phuketParty },
      { label: "Krabi escape", prompt: PROMPTS.krabiEscape },
      { label: "Party + recovery", prompt: PROMPTS.partyRecovery },
    ],
    // Desktop-only Kaira polaroid collage — each polaroid opens its destination.
    images: [
      { image: IMG.yona, caption: "Phuket, floating club", href: "/asia/thailand" },
      { image: IMG.sevenIslandSunset, caption: "Krabi, longtails", href: "/asia/thailand" },
      { image: IMG.iconsiam, caption: "Bangkok, the river", href: "/asia/thailand" },
      { image: IMG.jungleClub, caption: "Koh Samui, above Chaweng", href: "/asia/thailand" },
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
        accent: "crew's vibe",
      },
      cards: [
        {
          image: IMG.phiPhi,
          name: "The Last Hurrah",
          line: "Phuket → Krabi · 2 bases · 1 ferry",
          tag: "6 nights",
          prompt: PROMPTS.lastHurrah,
        },
        {
          image: IMG.iconsiam,
          name: "City Meets Beach",
          line: "Bangkok → Phuket · 2 cities · 1 flight",
          tag: "7 nights",
          prompt: PROMPTS.cityMeetsBeach,
        },
        {
          image: IMG.sevenIslandSunset,
          name: "Private Paradise",
          line: "Krabi → Koh Samui · 2 islands · 1 flight",
          tag: "8 nights",
          prompt: PROMPTS.privateParadise,
        },
      ],
    },
    // ── Experiences (card click opens the drawer; "+ Add" saves to the trip) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Activities worth", accent: "the day" },
      cards: [
        {
          image: IMG.yona,
          name: "YONA floating beach club",
          line: "A converted barge anchored off Patong. Infinity pools, a DJ, and nobody has to drive home.",
          tag: "Phuket",
          activityId: ACTIVITY.yona,
        },
        {
          image: IMG.hongSpeedboat,
          name: "Hong Islands by speedboat",
          line: "Lagoons you swim into through a gap in the rock. Lunch on the sand, back by four.",
          tag: "Krabi",
          activityId: ACTIVITY.hongSpeedboat,
        },
        {
          image: IMG.phiPhiCatamaran,
          name: "Phi Phi and Bamboo by catamaran",
          line: "The big one — Maya Bay, Bamboo Island, snorkelling stops. A premium boat so the group isn't crammed.",
          tag: "Krabi",
          activityId: ACTIVITY.phiPhiCatamaran,
        },
        {
          image: IMG.sevenIslandSunset,
          name: "7-island sunset by longtail",
          line: "Sunset over seven islands, then plankton glowing on the ride back. Quietly the best night of the trip.",
          tag: "Krabi",
          activityId: ACTIVITY.sevenIslandSunset,
        },
        {
          image: IMG.raftingZipline,
          name: "Rafting, zipline and ATV",
          line: "White water, treetops and mud in one day. The correct answer to a group that can't sit still.",
          tag: "Phuket",
          activityId: ACTIVITY.raftingZipline,
        },
        {
          image: IMG.chaoPhraya,
          name: "Chao Phraya sunset cruise",
          line: "Buffet, live band, temples lit along the river. Easy first night while the group lands in waves.",
          tag: "Bangkok",
          activityId: ACTIVITY.chaoPhraya,
        },
        {
          image: IMG.jamesBond,
          name: "James Bond Island by speedboat",
          line: "Phang Nga Bay's limestone stacks and sea caves by canoe. Go early — the tour fleet arrives at eleven.",
          tag: "Phuket",
          activityId: ACTIVITY.jamesBond,
        },
      ],
    },
    // ── Four kinds of night out (dark) ──
    {
      type: "feature",
      heading: { lead: "Four kinds of", accent: "night out" },
      intro:
        "Thailand does loud and it does civil, and a good week has both. The trick is knowing which city does which, and not spending the one big night in the wrong place.",
      rows: [
        {
          stat: "LOUD",
          name: "Bangla Road, Patong",
          line: "Half a kilometre of open-front bars, closed to traffic at six. Cheap, chaotic, and the default for a first night.",
        },
        {
          stat: "CIVIL",
          name: "Rooftops in Bangkok",
          line: "Vertigo, Octave, Sky Bar. Dress code, real cocktails, and a view that justifies the price of them.",
        },
      ],
      stats: [
        { stat: "฿100", label: "A LARGE CHANG ON BANGLA ROAD" },
        { stat: "2am", label: "WHEN MOST BARS LEGALLY CLOSE" },
        { stat: "5", label: "DRY DAYS A YEAR · BUDDHIST HOLIDAYS" },
      ],
      cta: {
        title: "Private long-tail charter",
        meta: "Full day · your group only · no shared boat",
        activityId: ACTIVITY.longtailCharter,
      },
    },
    // ── Which island is yours (each row opens its tour) ──
    {
      type: "list",
      selectable: true,
      itemKind: "activity",
      heading: {
        lead: "Which island",
        accent: "is yours",
        note: "Tap one for the boat that actually gets you there",
      },
      rows: [
        {
          image: IMG.phiPhi,
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 190%)",
          name: "Phi Phi Islands",
          badge: "Loudest after dark",
          line: "Maya Bay by day, a beach party every night. 2h from Phuket — the one everybody pictures.",
          activityId: ISLAND.phiPhi,
        },
        {
          image: IMG.hongIsland,
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #16324f, #0d7f8f 160%)",
          name: "Hong Islands",
          line: "A ring of limestone with a lagoon in the middle. 45 min from Krabi, calm and shallow.",
          activityId: ISLAND.hong,
        },
        {
          image: IMG.phangNga,
          emoji: "📸",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          name: "Phang Nga Bay",
          line: "Four hundred islands, sea caves, and the stack from the Bond film. Best from a canoe at dawn.",
          activityId: ISLAND.phangNga,
        },
        {
          image: IMG.railay,
          emoji: "🧗",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          name: "Railay",
          line: "No roads in. Climbers on the cliffs, one bar on the sand, and the boat stops at sunset.",
          activityId: ISLAND.railay,
        },
      ],
    },
    // ── For the morning after (POIs — tap opens the POI drawer via ?poi_id=) ──
    {
      type: "list",
      selectable: true,
      itemKind: "poi",
      heading: {
        lead: "For the",
        accent: "morning after",
        note: "Low effort, high payoff — nothing here needs a 6am alarm",
      },
      rows: [
        {
          image: IMG.bigBuddha,
          emoji: "🛕",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 190%)",
          name: "The Big Buddha",
          badge: "★ 4.6 · 27.9k",
          line: "Forty-five metres of white marble on a hill, with the whole island underneath. Cover your knees. · Phuket",
          href: `${PAGE}?poi_id=${POI.bigBuddha}`,
        },
        {
          image: IMG.watArun,
          emoji: "🌇",
          gradient: "linear-gradient(150deg, #16324f, #0d7f8f 160%)",
          name: "Wat Arun",
          badge: "★ 4.6 · 32.2k",
          line: "The Temple of Dawn across the river. Go at 7am — empty, cool, and the light is why people photograph it. · Bangkok",
          href: `${PAGE}?poi_id=${POI.watArun}`,
        },
        {
          image: IMG.chatuchak,
          emoji: "🧺",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          name: "Chatuchak weekend market",
          badge: "★ 4.4 · 43.1k",
          line: "Ten thousand stalls. Someone in the group will buy a hammock they cannot carry home. · Bangkok",
          href: `${PAGE}?poi_id=${POI.chatuchak}`,
        },
        {
          image: IMG.sanctuary,
          emoji: "🪵",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          name: "Sanctuary of Truth",
          badge: "★ 4.6 · 28.7k",
          line: "An entire temple carved from teak, still unfinished after forty years. Genuinely worth the detour. · Pattaya",
          href: `${PAGE}?poi_id=${POI.sanctuary}`,
        },
        {
          image: IMG.lumphini,
          emoji: "🌳",
          gradient: "linear-gradient(150deg, #17724a, #e2f2f4 200%)",
          name: "Lumphini Park",
          badge: "★ 4.5 · 31k",
          line: "Where the city goes to run at six. Monitor lizards in the lake, and shade when the heat is unreasonable. · Bangkok",
          href: `${PAGE}?poi_id=${POI.lumphini}`,
        },
        {
          image: IMG.iconsiam,
          emoji: "🛍️",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          name: "ICONSIAM",
          badge: "★ 4.7 · 54.4k",
          line: "Riverfront mall with an indoor floating market on the ground floor. Air conditioning as an activity. · Bangkok",
          href: `${PAGE}?poi_id=${POI.iconsiam}`,
        },
      ],
    },
    // ── Trips ──
    {
      type: "trips",
      ctaLabel: "Book this itinerary →",
      heading: {
        lead: "Which send-off is",
        accent: "yours?",
        note: "Priced from Delhi · flights, villa and boats included",
      },
      cards: [
        {
          image: IMG.yona,
          tag: "8 people · 6N",
          name: "Phuket villa and the boats",
          line: "One private pool villa in Bang Tao, three island days, two nights out. Transfers held for the whole group.",
          price: "₹96,000 / person",
          nights: "6 nights · Phuket + Krabi",
          urgent: "Dec – Feb villas for 8+ book out four months ahead",
          prompt: PROMPTS.tripPhuketVilla,
        },
        {
          image: IMG.sevenIslandSunset,
          tag: "6 people · 7N",
          name: "Krabi slow, Bangkok loud",
          line: "Four nights of longtails and cliff bars, three of rooftops and Yaowarat. Spa afternoon on the last day.",
          price: "₹1,04,000 / person",
          nights: "7 nights · Krabi + Bangkok",
          prompt: PROMPTS.tripKrabiBangkok,
        },
        {
          image: IMG.phuket,
          tag: "10+ · 5N",
          name: "The one-base weekender",
          line: "Nobody moves hotels. One villa in Phuket, boats out and back daily, minimal logistics.",
          price: "₹78,000 / person",
          nights: "5 nights · Phuket",
          prompt: PROMPTS.tripOneBase,
        },
      ],
    },
    // ── Where to start the night (dark) ──
    {
      type: "eats",
      selectable: true,
      itemKind: "restaurant",
      heading: { lead: "Where to", accent: "start the night" },
      cards: [
        {
          image: IMG.vertigo,
          name: "Vertigo and Moon Bar",
          city: "Bangkok",
          line: "61 floors up with no roof. Get there for sunset — dress code enforced, worth the shirt.",
          rating: "4.4",
          reviews: "3,030",
          href: `${PAGE}?restaurant_id=${RESTAURANT.vertigo}`,
        },
        {
          image: IMG.maggieChoo,
          name: "Maggie Choo's",
          city: "Bangkok",
          line: "A 1930s Shanghai speakeasy in an old bank vault. Jazz, cocktails, and no queue before ten.",
          rating: "4.4",
          reviews: "1,142",
          href: `${PAGE}?restaurant_id=${RESTAURANT.maggieChoo}`,
        },
        {
          image: IMG.phiPhiReggae,
          name: "Phi Phi Reggae Bar",
          city: "Krabi",
          line: "Muay Thai ring in the middle, free bucket if you get in it. Someone in your group will.",
          rating: "4.4",
          reviews: "1,033",
          href: `${PAGE}?restaurant_id=${RESTAURANT.phiPhiReggae}`,
        },
        {
          image: IMG.jungleClub,
          name: "Jungle Club",
          city: "Koh Samui",
          line: "Up a dirt track above Chaweng. The view does the work — book a table before you climb.",
          rating: "4.4",
          reviews: "3,965",
          href: `${PAGE}?restaurant_id=${RESTAURANT.jungleClub}`,
        },
        {
          image: IMG.laeLay,
          name: "Lae Lay Grill",
          city: "Krabi",
          line: "Seafood on a hillside deck over the bay. The whole-fish order, shared, is the correct move.",
          rating: "4.2",
          reviews: "971",
          href: `${PAGE}?restaurant_id=${RESTAURANT.laeLay}`,
        },
        {
          image: IMG.yaowarat,
          name: "Yaowarat Road",
          city: "Bangkok",
          line: "Chinatown after dark — the whole street is the restaurant. Go hungry, bring cash, follow the queues.",
          rating: "4.6",
          reviews: "874",
          href: `${PAGE}?restaurant_id=${RESTAURANT.yaowarat}`,
        },
      ],
    },
    // ── When to go ──
    {
      type: "months",
      heading: {
        eyebrow: "One country, four very different quarters",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Nov – Feb",
          name: "Cool and dry · best weather",
          line: "Flat seas, 30°C, no rain. Also the priciest — villas for 8+ go months out.",
        },
        {
          range: "Mar – May",
          name: "Hot season · cheaper",
          line: "36°C and humid. Rates drop, boats still run. Songkran in mid-April is a nationwide water fight — go for it or avoid it deliberately.",
        },
        {
          range: "Jun – Aug",
          name: "Green season · best value",
          line: "Short afternoon downpours, then sun. Half the price and half the crowds. Andaman seas get choppy; the Samui side is calmer.",
        },
        {
          range: "Sep – Oct",
          name: "Wettest · boats cancel",
          line: "The one window I'd push you off. Island days get called off at short notice and there's no second attempt in five nights.",
        },
      ],
      note:
        "Alcohol sales stop nationwide on a handful of Buddhist holidays and election days. It has ruined more than one big night — send me your dates and I'll check them against the list before anything is booked.",
    },
    // ── Visa (dark) ──
    {
      type: "visa",
      heading: { lead: "Your visa,", accent: "handled" },
      intro:
        "Thailand ended visa-free entry for Indian passports. For a group, the e-Visa is the only sane route — one file per person, done before you fly, no cash counter at 2am.",
      cards: [
        {
          country: "Thailand",
          cities: "Tourist e-Visa · 60 days · applied before you fly",
          fee: "₹4,700",
          href: `${VISA}/thailand-visa-online`,
        },
      ],
      facts: [
        { label: "Processing", value: "5 – 10 days" },
        { label: "Stay", value: "Up to 60d" },
        { label: "Entry", value: "Single" },
      ],
      note:
        "Visa-on-arrival still exists — 15 days, ฿2,000 cash each, and a queue. Fine for a long weekend, wrong for eight people. Everyone also needs the free digital arrival card within 72 hours of landing; we send that link.",
    },
    // ── Read this first ──
    // {
    //   type: "list",
    //   compact: true,
    //   heading: {
    //     eyebrow: "The four things groups get wrong",
    //     lead: "Read this",
    //     accent: "first",
    //   },
    //   rows: [
    //     {
    //       emoji: "🏠",
    //       gradient: "linear-gradient(150deg, #0d7f8f, #e2f2f4 190%)",
    //       name: "A villa beats eight hotel rooms",
    //       line: "Cheaper per head, one address for every transfer, and somewhere to be at 3am that isn't a bar.",
    //     },
    //     {
    //       emoji: "🚫",
    //       gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
    //       name: "Some days are legally dry",
    //       line: "Alcohol sales stop nationwide on a few Buddhist holidays and election days. We check your dates against the list.",
    //     },
    //     {
    //       emoji: "🛵",
    //       gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
    //       name: "Don't rent the scooters",
    //       line: "The jet-ski and scooter damage scam is real and it targets exactly your group. Private drivers cost less than the argument.",
    //     },
    //     {
    //       emoji: "✈️",
    //       gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
    //       name: "Everyone lands at a different hour",
    //       line: "Ten people on six flights is the actual hard part. We stagger the transfers and hold the villa from the earliest arrival.",
    //     },
    //   ],
    // },
    // ── Stories — each opens the group's actual itinerary ──
    {
      type: "stories",
      heading: { eyebrow: "Loved on Google", lead: "Groups who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Google review",
          name: "Varun and seven friends",
          when: "January 2026 · Phuket",
          quote:
            "Eight of us, six flights, one villa. Every transfer was waiting and the Phi Phi boat was ours alone — no sharing with forty strangers. She also warned us one night was dry, which saved the plan.",
          route: "See their itinerary →",
          href: `${CHAT}/ed0b5d1f-9ec7-4e57-9962-8cc640e6689c`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Meher and five",
          when: "February 2026 · Krabi",
          quote:
            "We wanted loud without being messy. Longtail sunset in Krabi, then two nights of rooftops in Bangkok. The 7-island trip with the plankton is the thing everyone still talks about.",
          route: "See their itinerary →",
          href: `${CHAT}/b9b67de2-2a74-4c56-88fe-106fa725679a`,
        },
        {
          rating: "5.0",
          type: "Google review",
          name: "Aman, group of 12",
          when: "November 2025 · Phuket",
          quote:
            "Twelve people is a nightmare and she made it boring in the best way. One base, boats out daily, nobody lost. The e-Visa paperwork was done for all of us in one go.",
          route: "See their itinerary →",
          href: `${CHAT}/24796b88-2b91-4dd1-832b-7ab3281d3cce`,
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations in this theme",
        lead: "Where I",
        accent: "send groups",
      },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Phuket",
          meta: "Villas · boats · Bangla Road",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #0d7f8f, #f0e9d6 190%)",
          image: IMG.phuket,
          href: "/asia/thailand",
        },
        {
          name: "Krabi",
          meta: "Longtails · cliffs · Railay",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #16324f, #0d7f8f 160%)",
          image: IMG.sevenIslandSunset,
          href: "/asia/thailand",
        },
        {
          name: "Bangkok",
          meta: "Rooftops · Yaowarat · markets",
          emoji: "🏙️",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image: IMG.iconsiam,
          href: "/asia/thailand",
        },
        {
          name: "Koh Samui",
          meta: "Calmer seas · Full Moon nearby",
          emoji: "🌊",
          gradient: "linear-gradient(150deg, #17724a, #f0e9d6 200%)",
          image: IMG.jungleClub,
          href: "/asia/thailand",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Not this crowd?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Honeymoon",
          meta: "Year round",
          emoji: "🫶",
          gradient: "linear-gradient(150deg, #a8556b, #f8ebef 190%)",
          image: THEME_IMG.honeymoon,
          href: "/theme/honeymoon",
        },
        {
          name: "Perfect proposals",
          meta: "Before all this",
          emoji: "💍",
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          image: THEME_IMG.proposal,
          href: "/theme/perfect-proposal",
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
          name: "Greece islands",
          meta: "Done right",
          emoji: "🏛️",
          gradient: "linear-gradient(150deg, #2f6f9e, #e6f0f7 190%)",
          image: THEME_IMG.greece,
          href: "/theme/greece-islands-done-right",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about the send-off…",
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

const ThailandBachelorThemePage = ({
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
  const router = useRouter();
  // POI / restaurant detail drawers are driven by URL query params so the
  // shared card components can open them with a plain href.
  const poiId = router.query.poi_id as string | undefined;
  const restaurantId = router.query.restaurant_id as string | undefined;
  const closeQueryDrawer = () =>
    router.push({ pathname: PAGE }, undefined, { shallow: true });
  // Read-only activity details drawer (opened from the experience/island cards).
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
    <Layout page="Theme Page" slug="thailand-bachelor">
      <Head>
        <title>
          Thailand Bachelor & Bachelorette Trips | Group Itinerary Planner | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a Thailand bachelor or bachelorette trip with The Tarzan Way's AI itinerary — private pool villas in Phuket and Krabi, beach clubs, private island boats, Bangkok rooftops, e-Visas and group transfers handled for Indian travellers."
        />
        <meta
          property="og:title"
          content="Thailand Bachelor & Bachelorette Trips | Group Itinerary Planner | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a Thailand bachelor or bachelorette trip with The Tarzan Way's AI itinerary — private pool villas in Phuket and Krabi, beach clubs, private island boats, Bangkok rooftops, e-Visas and group transfers handled for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/thailand-bachelor"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/thailand-bachelor"
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
                  name: "Thailand Bachelor & Bachelorette — Trip Planner",
                  description:
                    "Plan a Thailand bachelor or bachelorette trip with The Tarzan Way's AI itinerary — private pool villas in Phuket and Krabi, beach clubs, private island boats, Bangkok rooftops, e-Visas and group transfers handled for Indian travellers.",
                  url: "https://thetarzanway.com/theme/thailand-bachelor",
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
                      name: "Thailand Bachelor & Bachelorette",
                      item: "https://thetarzanway.com/theme/thailand-bachelor",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={thailandBachelorConfig}
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
      {/* POI details — driven by ?poi_id */}
      {poiId && (
        <POIDetailsDrawer
          show
          activityData={{ id: poiId, type: "poi" }}
          handleCloseDrawer={closeQueryDrawer}
          removeDelete
          removeChange
        />
      )}
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

export default connect(null, mapDispatchToProps)(ThailandBachelorThemePage);
