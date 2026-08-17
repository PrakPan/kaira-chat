// pages/theme/lapland.tsx
//
// Lapland — an editorial, cinematic theme landing (the "02 · Theme" mockup)
// built from the reusable CinematicThemeLanding component. Every card seeds its
// prompt into a fresh /chat session with Kaira, and destination tiles navigate
// to their country pages. The page is wrapped in the shared site Layout so it
// keeps the standard header + footer.

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

const THEME_SLUG = "lapland";

// ── Dummy prompts (one per clickable card) ──────────────────────────────────
const PROMPTS = {
  // Hero
  hero:
    "Plan a magical Lapland winter trip for two over 6 nights in December, with the northern lights, Santa's village, husky safaris and a glass igloo stay. Recommend the best bases, then build a complete cinematic itinerary balancing snow adventures with slow Nordic evenings.",
  chipLapland:
    "We are 2 adults going for 6 nights in January, and our travel dates are flexible. We want to plan a complete Lapland holiday covering the region's best experiences. Include iconic Arctic activities like husky and reindeer safaris, snowmobile rides, scenic winter landscapes, Finnish saunas, cozy stays, and local culture. Build a balanced itinerary with sightseeing, unique experiences, and enough free time to enjoy the Arctic at a relaxed pace.",
  chipAurora:
    "We are 2 adults (a couple) going for 5 nights in February, and our travel dates are flexible. We want our trip to focus on experiencing the Northern Lights. Prioritize destinations with high Aurora visibility, include guided Aurora hunts, glass igloos or remote cabins where possible, and schedule activities around the best viewing opportunities. Maximize our chances of seeing the Aurora while still including a few classic Lapland experiences.",
  chipChristmas:
    "We are 2 adults going for 6 nights in December, and our travel dates are flexible. We want to experience Lapland during Christmas. Prioritize Santa Claus Village, festive markets, reindeer rides, husky safaris, snow-covered forests, Christmas lights, cozy cafés, and magical winter experiences. We want the itinerary to feel festive, immersive, and perfect for celebrating Christmas in the Arctic.",
  // Pillars — Choose Your Arctic Story
  pillarChristmas:
    "We are 2 adults going for 6 nights in December, and our travel dates are flexible. We want a Christmas-focused Lapland itinerary with a stay in Rovaniemi. Include Santa Claus Village, reindeer and husky experiences, snowy forests, Christmas markets (if available), cozy cafés, and festive winter activities. Prioritize a magical Christmas atmosphere.",
  pillarAurora:
    "We are 2 adults going for 5 nights in February, and our travel dates are flexible. We want a Lapland itinerary focused on maximizing our chances of seeing the Northern Lights. Include stays in Aurora-friendly locations, glass igloos or unique Arctic accommodations where possible, guided Aurora hunts, scenic winter landscapes, Finnish saunas, and Arctic experiences with minimal city time.",
  pillarSlowdown:
    "We are 2 adults going for 5 nights in January, and our travel dates are flexible. We want a slow-paced Lapland itinerary focused on relaxation and cozy Nordic experiences. Include scenic stays, traditional Finnish saunas, snow-covered forests, local cafés, peaceful walks, optional light winter activities, and plenty of free time.",
  pillarFairytale:
    "We are 2 adults going for 6 nights in December, and our travel dates are flexible. We want a cinematic winter wonderland itinerary in Lapland. Include snowy forests, glass igloos or cozy cabins, reindeer and husky safaris, frozen lakes, beautiful viewpoints, magical cafés, and iconic Arctic experiences. We want the trip to feel like a real-life fairytale.",
  // Bases — Where you'd sleep
  baseRovaniemi:
    "We are 2 adults going for 6 nights in December, and our travel dates are flexible. We want our trip to be centered around Rovaniemi, with most of our stay here. Prioritize easy access to Santa Claus Village, reindeer farms, husky safaris, snowmobile experiences, Arctic museums, cozy cafés, and festive winter attractions. We'd like a balance of winter activities and relaxed evenings, with accommodation close to the main experiences.",
  baseHelsinki:
    "We are 2 adults (a couple) going for 7 nights in January, and our travel dates are flexible. We want to combine the best of Helsinki and Lapland. Start our trip in Helsinki to explore Finnish architecture, cafés, markets, saunas, and local culture before heading north to experience the Arctic. Include enough time in both destinations, with a comfortable pace and seamless travel between the city and Lapland.",
  baseSaariselka:
    "Plan a 5-night Lapland trip for two in February based in Saariselkä — deeper north, darker skies and glass roofs over the snow for the best aurora odds. Build an itinerary focused on northern lights and Arctic wilderness.",
  baseLevi:
    "Plan a 6-night Lapland trip in March for 2 adults and 2 children, based in Levi — ski slopes by day and husky night trails. Great for teens and active families. Build a balanced snow-adventure itinerary.",
  baseKakslauttanen:
    "Plan a 5-night splurge Lapland stay for two in December at Kakslauttanen — glass igloos, Christmas lights and deep snow. Build a romantic, high-end itinerary around the igloo experience.",
  // Trips — "Which Lapland is yours?" cards now open a saved sample itinerary
  // at /chat/{id} (see the trips section below), so they carry no prompt.
  // Santa checklist
  santaMeet:
    "On a 6-night December Lapland trip for 2 adults and 2 children, arrange a private meeting with Santa in Rovaniemi with no queue and a photo included, and build the rest of a family day around it.",
  santaArctic:
    "On a 6-night December Lapland trip for 2 adults and 2 children, plan a day where we cross the Arctic Circle and get the certificate, plus the best nearby winter activities for kids.",
  santaLetter:
    "On a 6-night December Lapland trip for 2 adults and 2 children, include a visit to Santa's main post office to post a letter that arrives home next December, and suggest what else to do in the village.",
  santaReindeer:
    "Add a reindeer sleigh ride through the pines to a 6-night December Lapland itinerary for 2 adults and 2 children, and recommend the quietest, most scenic operator.",
  // Experiences — "Worth the cold" rows now open the read-only activity
  // details drawer by activity id (see the section below), so they carry no
  // prompt.
  // Stories
  storyFamily:
    "Plan a Christmas-week Lapland family trip in December like the Mehras did, for 2 adults and 2 children aged 6 and 9 — Santa, huskies and snow — over 6 nights.",
  storyCouple:
    "Plan a mid-January Lapland couple's trip with a glass igloo stay like Aditi and Rohan's, over 5 nights.",
  storySolo:
    "Plan a 4-night solo Lapland trip based in Rovaniemi in February focused on aurora, huskies and quiet snowy days.",
  // Ask bar
  ask:
    "Which Lapland base should we actually pick for 6 nights in January, travelling as a couple — Rovaniemi, Saariselkä, Levi or Kakslauttanen? Compare them for aurora odds, family-friendliness and cost, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. Months stay inside the Lapland winter (Nov–Mar), each
// chosen for what the prompt is after — December for Santa and Christmas,
// February for the darkest aurora skies, March for the ski-and-husky week.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  hero: { nights: 6, month: 12, who: "Couple" },
  chipLapland: { nights: 6, month: 1, who: "Couple" },
  chipAurora: { nights: 5, month: 2, who: "Couple" },
  chipChristmas: { nights: 6, month: 12, who: "Couple" },
  pillarChristmas: { nights: 6, month: 12, who: "Couple" },
  pillarAurora: { nights: 5, month: 2, who: "Couple" },
  pillarSlowdown: { nights: 5, month: 1, who: "Couple" },
  pillarFairytale: { nights: 6, month: 12, who: "Couple" },
  baseRovaniemi: { nights: 6, month: 12, who: "Couple" },
  baseHelsinki: { nights: 7, month: 1, who: "Couple" },
  baseSaariselka: { nights: 5, month: 2, who: "Couple" },
  baseLevi: { nights: 6, month: 3, who: "Family", adults: 2, children: 2 },
  baseKakslauttanen: { nights: 5, month: 12, who: "Couple" },
  santaMeet: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  santaArctic: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  santaLetter: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  santaReindeer: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  storyFamily: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  storyCouple: { nights: 5, month: 1, who: "Couple" },
  storySolo: { nights: 4, month: 2, who: "Just me" },
  ask: { nights: 6, month: 1, who: "Couple" },
});

const filmyThemePrompt =
  "Plan a film-inspired getaway — tell me a movie and I'll build a trip around the real places behind it, with the touristy bits trimmed out.";
const proposalPrompt =
  "Help me plan the perfect proposal trip abroad with a jaw-dropping setting, the right moment and every detail handled.";
const newYearPrompt =
  "Plan a New Year and Christmas holiday abroad with festive markets, lights and celebrations. Recommend the best late-December destinations and build a complete itinerary.";
const thailandBachelorPrompt =
  "Plan a Thailand bachelor trip for a group of 6+ with the best beaches, nightlife and group activities across a lively route.";
const honeymoonPrompt =
  "Plan a dreamy honeymoon on a beautiful island with private beaches, romantic stays and unforgettable sunsets.";

// Real destination imagery pulled from The Tarzan Way's own POI/CDN library
// (the same photos the country/city destination pages use).
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const IMG = {
  finland: `${CDN}/media/countries/168442263137298607826232910156.jpg`,
  norway: `${CDN}/media/countries/168442149904007196426391601562.jpg`,
  sweden: `${CDN}/media/countries/168442187649124574661254882812.jpg`,
  iceland: `${CDN}/media/countries/168442051714989519119262695312.jpg`,
  japan: `${CDN}/media/countries/175853838850662446022033691406.jpg`,
  switzerland: `${CDN}/media/countries/175930905875495767593383789062.jpg`,
  rovaniemi: `${CDN}/media/cities/174964816838489937782287597656.jpeg`,
  helsinki: `${CDN}/media/cities/168552998421971487998962402344.jpeg`,
  tromso: `${CDN}/media/states/172751825436703801155090332031.jpeg`,
  kiruna: `${CDN}/media/cities/168553018601762032508850097656.jpeg`,
};

const laplandConfig: CinematicThemeConfig = {
  // Arctic indigo — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["lapland"],
  header: {
    title: "Lapland",
    subtitle: "Theme · Dec – Mar",
  },
  hero: {
    eyebrow: "The closest thing to a real-life fairytale",
    heading: { lead: "Aurora, Santa", accent: "and Snow" },
    // Kept on desktop only (the mobile mockup has no hero subtext).
    lede:
      "The northern lights, Santa's own hometown and snow so deep it swallows sound. Tell me who's coming and I'll build the Lapland trip around the parts that actually feel like magic.",
    placeholder: "Try: Lapland with a 6-year-old, Christmas week",
    prompt: PROMPTS.hero,
    chips: [
      { label: "Lapland Trip", prompt: PROMPTS.chipLapland },
      { label: "Northern Lights", prompt: PROMPTS.chipAurora },
      { label: "Christmas in Lapland", prompt: PROMPTS.chipChristmas },
    ],
    // Desktop-only Kaira + polaroid collage — each polaroid opens its destination.
    images: [
      { image: IMG.finland, caption: "Aurora, Finland", href: "/europe/finland" },
      { image: IMG.rovaniemi, caption: "Santa's Rovaniemi", href: "/europe/finland" },
      { image: IMG.tromso, caption: "Husky trails, Norway", href: "/europe/norway" },
      { image: IMG.kiruna, caption: "Deep north, Sweden", href: "/europe/sweden" },
    ],
  },
  sections: [
    // ── Choose Your Arctic Story ──
    {
      type: "pillars",
      heading: { lead: "Choose Your", accent: "Arctic Story" },
      cards: [
        {
          name: "Christmas in Santa's Hometown",
          line: "Meet Santa, reindeer rides, husky safaris, Santa's Post Office, and one magical night under a glass igloo.",
          window: "Sept – Mar",
          emoji: "🎅",
          image: `${CDN}/media/website/lapland-2026/ChristmasInSantaHometown.png`,
          gradient: "linear-gradient(160deg, #b84034, #f0e9d6 200%)",
          prompt: PROMPTS.pillarChristmas,
        },
        {
          name: "Northern Lights Escape",
          line: "Built around maximizing aurora sightings with flexible nights, guided hunts, and darker skies.",
          window: "Nov – Jan",
          emoji: "🌌",
          image:  IMG.norway,
          gradient: "linear-gradient(160deg, #0e1530, #1f8a5a 150%)",
          prompt: PROMPTS.pillarAurora,
        },
        {
          name: "The Nordic slowdown",
          line: "Sauna, silence, snow-heavy pines. The part nobody plans for and everybody remembers.",
          window: "All winter",
          emoji: "🌲",
          image: `${CDN}/media/website/lapland-2026/TheNordicSlowdown.png`,
          gradient: "linear-gradient(160deg, #16324f, #3d4f7a)",
          prompt: PROMPTS.pillarSlowdown,
        },
        {
          name: "Frozen Fairytale",
          line: "A cinematic winter wonderland — snowy forests, frozen lakes, cozy cabins and iconic Arctic experiences.",
          window: "Dec – Mar",
          emoji: "🏰",
          image: `${CDN}/media/website/lapland-2026/FrozenFairystyle.png`,
          gradient: "linear-gradient(160deg, #1a2a4a, #7aa0c8 180%)",
          prompt: PROMPTS.pillarFairytale,
        },
      ],
    },
    // ── Where you'd sleep ──
    {
      type: "list",
      heading: { lead: "Where you'd", accent: "sleep" },
      selectable: true,
      itemKind: "base",
      rows: [
        {
          name: "Rovaniemi",
          line: "Santa's village + easy flights + everything within reach",
          badge: "Kaira's pick",
          emoji: "🎄",
          image: `${CDN}/media/website/lapland-2026/Rovaniemi.png`,
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          prompt: PROMPTS.baseRovaniemi,
        },
        {
          name: "Saariselkä",
          line: "Deeper north + darker skies + glass roofs over the snow",
          emoji: "🛖",
          image: IMG.finland,
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 140%)",
          prompt: PROMPTS.baseSaariselka,
        },
        {
          name: "Levi",
          line: "Ski slopes by day + husky night trails",
          emoji: "🎿",
          image: IMG.kiruna,
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          prompt: PROMPTS.baseLevi,
        },
        {
          name: "Kakslauttanen",
          line: "Igloo stay + Christmas lights + snow",
          emoji: "❄️",
          image: IMG.tromso,
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          prompt: PROMPTS.baseKakslauttanen,
        },
        {
          name: "Helsinki",
          line: "Finnish design + cafés + saunas, then north to the Arctic",
          emoji: "🏛️",
          image: `${CDN}/media/website/lapland-2026/Helsinki.png`,
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          prompt: PROMPTS.baseHelsinki,
        },
      ],
    },
    // ── Which Lapland is yours? ──
    {
      type: "trips",
      ctaLabel: "Create plan →",
      heading: { lead: "Which Lapland is", accent: "yours?" },
      cards: [
        {
          tag: "Family · ages 4+ · 6N",
          name: "Christmas in Santa's own town",
          line: "Rovaniemi + Saariselkä + Santa + huskies + a glass roof",
          price: "₹2,10,000 / person",
          nights: "6 nights",
          emoji: "🛷",
          image: IMG.rovaniemi,
          gradient: "linear-gradient(150deg, #b84034, #1f8a5a 180%)",
          urgent: "Christmas week — 4 rooms left across all bases",
          href: "/chat/456c747e-4c30-4420-a92a-d5ca91841c71",
        },
        {
          tag: "Couple · 5N",
          name: "Aurora under glass",
          line: "Glass igloo + forest cabin + sauna",
          price: "₹2,45,000 / person",
          nights: "5 nights",
          emoji: "🫶",
          image: IMG.finland,
          gradient: "linear-gradient(150deg, #0e1530, #1f8a5a 160%)",
          href: "/chat/2b786c5a-2e19-42cd-8cd1-ce52b7429823",
        },
        {
          tag: "Slow · 7N",
          name: "The Nordic slowdown",
          line: "Helsinki + sauna + design district + one long train",
          price: "₹1,95,000 / person",
          nights: "7 nights",
          emoji: "🧖",
          image: IMG.helsinki,
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          href: "/chat/538033b0-2206-461e-82c0-50a76c9f7d5f",
        },
        {
          tag: "Short · 4N",
          name: "The long weekend north",
          line: "One base + Christmas lights + huskies",
          price: "₹1,45,000 / person",
          nights: "4 nights · Rovaniemi",
          emoji: "⚡",
          image: IMG.kiruna,
          gradient: "linear-gradient(150deg, #1a2436, #b84034 190%)",
          href: "/chat/9a4dae5e-3375-415b-b56b-ae2b3d546e8d",
        },
      ],
    },
    // ── The Santa bit, done properly ──
    {
      type: "checklist",
      heading: { lead: "The Santa bit,", accent: "done properly" },
      rows: [
        {
          name: "Meet Santa in his office",
          meta: "Private slot · no queue · photo included",
          emoji: "🎅",
          prompt: PROMPTS.santaMeet,
        },
        {
          name: "Cross the Arctic Circle",
          meta: "Certificate your kid will keep forever",
          emoji: "🧭",
          prompt: PROMPTS.santaArctic,
        },
        {
          name: "Post a letter from Santa's post office",
          meta: "Arrives home next December",
          emoji: "✉️",
          prompt: PROMPTS.santaLetter,
        },
        {
          name: "Reindeer sleigh through the pines",
          meta: "20 min · quieter than it sounds",
          emoji: "🦌",
          prompt: PROMPTS.santaReindeer,
        },
      ],
    },
    // ── Worth the cold ──
    {
      type: "list",
      compact: true,
      selectable: true,
      itemKind: "activity",
      heading: { lead: "Worth", accent: "the cold" },
      rows: [
        {
          name: "Aurora hunt by snowmobile",
          line: "Far from roads, closer to wonder",
          emoji: "🛵",
          image: IMG.finland,
          gradient: "linear-gradient(140deg, #0e1530, #445069)",
          activityId: "6610b432-c665-4d37-96dc-092738b66881",
        },
        {
          name: "Husky trail after dark",
          line: "Led by paws and instinct",
          emoji: "🐕",
          image: IMG.tromso,
          gradient: "linear-gradient(140deg, #1a2436, #3d4f7a)",
          activityId: "897a7ac8-e8e5-4911-912d-41494c71d5fb",
        },
        {
          name: "Arctic Lights Chase & Photo Safari",
          line: "Chase the aurora, come home with the shot",
          emoji: "📸",
          image: IMG.rovaniemi,
          gradient: "linear-gradient(140deg, #16324f, #1f8a5a 160%)",
          activityId: "6610b432-c665-4d37-96dc-092738b66881",
        },
        {
          name: "Break through the frozen Bothnian Sea",
          line: "An icebreaker adventure on the Arctic ice",
          emoji: "🚢",
          image: IMG.sweden,
          gradient: "linear-gradient(140deg, #16324f, #3d4f7a)",
          activityId: "470fb6f1-064a-4f83-8e8b-867aeeb106a8",
        },
        {
          name: "Snowmobile safari & fireside feast",
          line: "Wilderness ride, then a meal by the fire",
          emoji: "🛷",
          image: IMG.kiruna,
          gradient: "linear-gradient(140deg, #0e1530, #1f8a5a 170%)",
          activityId: "5c910808-12d9-4eca-869b-1d14d73a307f",
        },
        {
          name: "Meet Arctic wildlife in the snow",
          line: "Reindeer, huskies and more, up close",
          emoji: "🦌",
          image: IMG.norway,
          gradient: "linear-gradient(140deg, #b84034, #f0e9d6 200%)",
          activityId: "afd2220f-5a46-43f3-9b28-e3226320b2fa",
        },
      ],
    },
    // ── When to actually go ──
    {
      type: "months",
      heading: { lead: "When to", accent: "actually go" },
      rows: [
        {
          range: "Nov – early Dec",
          name: "First snow, no crowds",
          line: "Cheapest window. Santa's village open, lights already showing.",
        },
        {
          range: "20 – 31 Dec",
          name: "Christmas week",
          line: "The one everyone wants. Book 8 months out or don't bother.",
        },
        {
          range: "Jan – Feb",
          name: "Deepest snow, darkest sky",
          line: "Best aurora odds and the quiet back. Coldest too −25°C days.",
        },
        {
          range: "March",
          name: "Light returns",
          line: "Long bright days, snow still deep. Best for kids who hate the dark.",
        },
      ],
      note: (
        <>
          <span style={{ fontWeight: 600, color: "#0b1220" }}>
            If you want both Santa and quiet:
          </span>{" "}
          go 3–10 January. Christmas crowds gone, snow at its deepest, aurora
          odds still high.
        </>
      ),
    },
    // ── People who went ──
    {
      type: "stories",
      heading: { lead: "People who", accent: "went" },
      cards: [
        {
          name: "The Mehras took two kids, 6 and 9",
          route: "6 nights · Christmas week",
          rating: "4.9",
          type: "Family",
          prompt: PROMPTS.storyFamily,
        },
        {
          name: "Aditi and Rohan did the igloo",
          route: "5 nights · mid-January",
          rating: "4.8",
          type: "Couple",
          prompt: PROMPTS.storyCouple,
        },
        {
          name: "Sai went alone in February",
          route: "4 nights · Rovaniemi",
          rating: "4.7",
          type: "Solo",
          prompt: PROMPTS.storySolo,
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: { eyebrow: "Other themes", lead: "Not the Arctic?", accent: "Try these" },
      columns: 6,
      cards: [
        {
          name: "Filmy getaways",
          meta: "16 trips · your film, your trip",
          emoji: "🎬",
          image: `${CDN}/media/website/filmy-getaways-2026/Mamma Mia -- Greek Islands.png`,
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          href: "/theme/filmy-getaways",
        },
        {
          name: "Perfect proposals",
          meta: "9 trips · she'll say yes",
          emoji: "💍",
          image: `${CDN}/media/page/174120792592848706245422363281/.png`,
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          href: "/theme/perfect-proposal",
        },
        {
          name: "New Year & Christmas",
          meta: "14 trips · Dec – Jan",
          emoji: "🎄",
          image:
            "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          prompt: newYearPrompt,
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "4 trips · 29 Dec – 2 Jan",
          emoji: "🏴",
          image: `${CDN}/media/website/edinburgh-hogmanay-2026/Dec 31 -- Street Party and Midnight Fireworks.jpg`,
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          href: "/theme/edinburgh-hogmanay",
        },
        {
          name: "Thailand bachelor",
          meta: "7 trips · groups of 6+",
          emoji: "🕺",
          image: `${CDN}/media/website/thailand-theme-2026/ChiangMai.jpg`,
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          href: "/theme/thailand-trip",
        },
        {
          name: "Honeymoon isles",
          meta: "12 trips · year round",
          emoji: "🫶",
          image:
            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/theme/honeymoon-2026",
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: { eyebrow: "Destinations", lead: "Where I", accent: "send people" },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Finland",
          meta: "18 trips",
          emoji: "🛖",
          image: IMG.finland,
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 130%)",
          href: "/europe/finland",
        },
        {
          name: "Norway",
          meta: "13 trips",
          emoji: "⛰️",
          image: IMG.norway,
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          href: "/europe/norway",
        },
        {
          name: "Sweden",
          meta: "9 trips",
          emoji: "🌲",
          image: IMG.sweden,
          gradient: "linear-gradient(150deg, #0e1530, #1f8a5a 170%)",
          href: "/europe/sweden",
        },
        {
          name: "Iceland",
          meta: "8 trips",
          emoji: "🌋",
          image: IMG.iceland,
          gradient: "linear-gradient(150deg, #16324f, #b84034 160%)",
          href: "/europe/iceland",
        },
        {
          name: "Switzerland",
          meta: "18 trips",
          emoji: "🏔️",
          image: IMG.switzerland,
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/europe/switzerland",
        },
        {
          name: "Japan",
          meta: "16 trips",
          emoji: "⛩️",
          image: IMG.japan,
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          href: "/asia/japan",
        },
      ],
      footerCta: { label: "View all destinations", href: "/destinations" },
    },
  ],
  askBar: {
    placeholder: "Ask me about Lapland…",
    cta: "Ask Kaira",
    prompt: PROMPTS.ask,
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

const LaplandThemePage = ({ checkAuthState }: { checkAuthState: () => void }) => {
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
  // Read-only activity details drawer (opened from the "Worth the cold" list).
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
    <Layout page="Theme Page" slug="lapland">
      <Head>
        <title>
          Lapland Trip Planner | Northern Lights, Santa & Aurora Itinerary | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a magical Lapland winter trip with The Tarzan Way's AI itinerary — northern lights, Santa's village in Rovaniemi, husky safaris, glass igloos and the best time to go for aurora and Christmas."
        />
        <meta
          property="og:title"
          content="Lapland Trip Planner | Northern Lights, Santa & Aurora Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a magical Lapland winter trip with The Tarzan Way's AI itinerary — northern lights, Santa's village in Rovaniemi, husky safaris, glass igloos and the best time to go for aurora and Christmas."
        />
        <link rel="canonical" href="https://thetarzanway.com/theme/lapland" />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/lapland"
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
                  name: "Lapland Trip Planner — Northern Lights, Santa & Aurora",
                  description:
                    "Plan a magical Lapland winter trip with The Tarzan Way's AI itinerary — northern lights, Santa's village in Rovaniemi, husky safaris, glass igloos and the best time to go for aurora and Christmas.",
                  url: "https://thetarzanway.com/theme/lapland",
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
                      name: "Lapland",
                      item: "https://thetarzanway.com/theme/lapland",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={laplandConfig}
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

export default connect(null, mapDispatchToProps)(LaplandThemePage);
