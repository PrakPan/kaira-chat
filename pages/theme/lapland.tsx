// pages/theme/lapland.tsx
//
// Lapland — an editorial, cinematic theme landing (the "02 · Theme" mockup)
// built from the reusable CinematicThemeLanding component. Every card seeds its
// prompt into a fresh /chat session with Kaira, and destination tiles navigate
// to their country pages. The page is wrapped in the shared site Layout so it
// keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import { useSeedChat } from "../../components/theme/cinematic/useSeedChat";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";

// ── Dummy prompts (one per clickable card) ──────────────────────────────────
const PROMPTS = {
  // Hero
  hero:
    "Plan a magical Lapland winter trip with the northern lights, Santa's village, husky safaris and a glass igloo stay. Recommend the best bases and the ideal number of nights, then build a complete cinematic itinerary balancing snow adventures with slow Nordic evenings.",
  chipLapland:
    "Design a first-timer's Lapland itinerary covering aurora hunts, reindeer and husky rides, Santa experiences and a glass-roof stay. Recommend the best time to go and a well-paced route with cozy stays.",
  chipAurora:
    "Build a northern lights focused trip to Lapland designed to maximize aurora sightings — dark-sky bases, flexible nights, guided hunts and glass igloos. Include backup plans for cloudy nights.",
  chipChristmas:
    "Plan a Christmas-in-Lapland family trip around Santa's hometown — meeting Santa, reindeer sleigh rides, husky safaris and snowy Christmas magic. Recommend the right base and how far ahead to book.",
  // Pillars — Choose Your Arctic Story
  pillarChristmas:
    "Create a Christmas in Santa's hometown itinerary in Rovaniemi — meeting Santa, reindeer rides, husky safaris, Santa's post office and one night under a glass igloo. Make it magical for kids while keeping the pace relaxed.",
  pillarAurora:
    "Plan a northern lights escape to Lapland built around maximizing aurora sightings — the darkest-sky bases, flexible nights and guided hunts. Balance the chase with cozy cabins and saunas.",
  pillarSlowdown:
    "Design a slow Nordic winter escape — sauna rituals, silence, snow-heavy pine forests and long quiet evenings. Prioritize rest, nature and the parts of Lapland nobody plans for but everybody remembers.",
  // Bases — Where you'd sleep
  baseRovaniemi:
    "Plan a Lapland trip based in Rovaniemi — Santa's village, easy flights and everything within reach. Best for families with young kids. Build a 5–6 night itinerary with the top winter experiences.",
  baseSaariselka:
    "Plan a Lapland trip based in Saariselkä — deeper north, darker skies and glass roofs over the snow for the best aurora odds. Build an itinerary focused on northern lights and Arctic wilderness.",
  baseLevi:
    "Plan a Lapland trip based in Levi — ski slopes by day and husky night trails. Great for teens and active families. Build a balanced snow-adventure itinerary.",
  baseKakslauttanen:
    "Plan a splurge Lapland stay at Kakslauttanen — glass igloos, Christmas lights and deep snow. Build a romantic, high-end itinerary around the igloo experience.",
  // Trips — Which Lapland is yours?
  tripFamily:
    "Create a 6-night family Lapland Christmas itinerary across Rovaniemi and Saariselkä — Santa, huskies and a glass roof — for kids aged 4 and up. Include stays, transfers and a day-by-day plan.",
  tripCouple:
    "Create a 5-night romantic Lapland itinerary for a couple — a glass igloo, a forest cabin and private saunas under the aurora. Keep it intimate, scenic and unrushed.",
  tripSlow:
    "Create a 7-night slow Nordic itinerary — Helsinki, sauna culture, the design district and one long scenic train north. Prioritize rest, design and quiet winter beauty.",
  tripShort:
    "Create a 4-night long-weekend Lapland trip based in Rovaniemi — Christmas lights, huskies and one aurora hunt. Make it efficient but still magical.",
  // Santa checklist
  santaMeet:
    "Arrange a private meeting with Santa in Rovaniemi with no queue and a photo included, and build the rest of a family day around it.",
  santaArctic:
    "Plan a day where we cross the Arctic Circle and get the certificate, plus the best nearby winter activities for kids.",
  santaLetter:
    "Include a visit to Santa's main post office to post a letter that arrives home next December, and suggest what else to do in the village.",
  santaReindeer:
    "Add a reindeer sleigh ride through the pines to a Lapland itinerary and recommend the quietest, most scenic operator.",
  // Experiences — Worth the cold
  expAurora:
    "Plan an aurora hunt by snowmobile far from roads and light pollution, with a guide and warm gear. Recommend the best base and night for it.",
  expHusky:
    "Add a husky trail after dark to a Lapland itinerary — self-driven or guided — and recommend the best location for it.",
  expGlass:
    "Include a night sleeping under a heated glass roof watching for the northern lights, and recommend the best glass igloo stays.",
  expSauna:
    "Add an authentic smoke sauna and ice-dip experience to a Finland trip and explain the Finnish sauna ritual for first-timers.",
  expIce:
    "Plan a quiet ice-fishing morning on a frozen Lapland lake with a guide, and pair it with other calm winter experiences.",
  expSnowshoe:
    "Add a snowshoe hike through old-growth Arctic forest to a Lapland itinerary — around two hours, off the beaten path.",
  // Stories
  storyFamily:
    "Plan a Christmas-week Lapland family trip like the Mehras did with kids aged 6 and 9 — Santa, huskies and snow — over 6 nights.",
  storyCouple:
    "Plan a mid-January Lapland couple's trip with a glass igloo stay like Aditi and Rohan's, over 5 nights.",
  storySolo:
    "Plan a 4-night solo Lapland trip based in Rovaniemi in February focused on aurora, huskies and quiet snowy days.",
  // Ask bar
  ask:
    "Which Lapland base should I actually pick — Rovaniemi, Saariselkä, Levi or Kakslauttanen? Compare them for aurora odds, family-friendliness and cost, then build the ideal itinerary for the one you recommend.",
};

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
          image: IMG.rovaniemi,
          gradient: "linear-gradient(160deg, #b84034, #f0e9d6 200%)",
          prompt: PROMPTS.pillarChristmas,
        },
        {
          name: "Northern Lights Escape",
          line: "Built around maximizing aurora sightings with flexible nights, guided hunts, and darker skies.",
          window: "Nov – Jan",
          emoji: "🌌",
          image: IMG.finland,
          gradient: "linear-gradient(160deg, #0e1530, #1f8a5a 150%)",
          prompt: PROMPTS.pillarAurora,
        },
        {
          name: "The Nordic slowdown",
          line: "Sauna, silence, snow-heavy pines. The part nobody plans for and everybody remembers.",
          window: "All winter",
          emoji: "🌲",
          image: IMG.sweden,
          gradient: "linear-gradient(160deg, #16324f, #3d4f7a)",
          prompt: PROMPTS.pillarSlowdown,
        },
      ],
    },
    // ── Where you'd sleep ──
    {
      type: "list",
      heading: { lead: "Where you'd", accent: "sleep" },
      rows: [
        {
          name: "Rovaniemi",
          line: "Santa's village + easy flights + everything within reach",
          badge: "Kaira's pick",
          emoji: "🎄",
          image: IMG.rovaniemi,
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
      ],
    },
    // ── Which Lapland is yours? ──
    {
      type: "trips",
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
          prompt: PROMPTS.tripFamily,
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
          prompt: PROMPTS.tripCouple,
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
          prompt: PROMPTS.tripSlow,
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
          prompt: PROMPTS.tripShort,
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
      heading: { lead: "Worth", accent: "the cold" },
      rows: [
        {
          name: "Aurora hunt by snowmobile",
          line: "Far from roads, closer to wonder",
          emoji: "🛵",
          image: IMG.finland,
          gradient: "linear-gradient(140deg, #0e1530, #445069)",
          prompt: PROMPTS.expAurora,
        },
        {
          name: "Husky trail after dark",
          line: "Led by paws and instinct",
          emoji: "🐕",
          image: IMG.tromso,
          gradient: "linear-gradient(140deg, #1a2436, #3d4f7a)",
          prompt: PROMPTS.expHusky,
        },
        {
          name: "Sleep under a glass roof",
          line: "Lights overhead, heating on",
          emoji: "🛌",
          image: IMG.rovaniemi,
          gradient: "linear-gradient(140deg, #16324f, #1f8a5a 160%)",
          prompt: PROMPTS.expGlass,
        },
        {
          name: "Smoke sauna and ice dip",
          line: "The Finnish rite of passage",
          emoji: "🧖",
          image: IMG.helsinki,
          gradient: "linear-gradient(140deg, #b84034, #f0e9d6 200%)",
          prompt: PROMPTS.expSauna,
        },
        {
          name: "Ice fishing on a frozen lake",
          line: "The Arctic at its quietest",
          emoji: "🎣",
          image: IMG.sweden,
          gradient: "linear-gradient(140deg, #16324f, #3d4f7a)",
          prompt: PROMPTS.expIce,
        },
        {
          name: "Snowshoe through old forest",
          line: "Two hours, no other footprints",
          emoji: "🥾",
          image: IMG.kiruna,
          gradient: "linear-gradient(140deg, #0e1530, #1f8a5a 170%)",
          prompt: PROMPTS.expSnowshoe,
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
    // ── How it works ──
    {
      type: "steps",
      heading: {
        eyebrow: "No markups · pay only for what you book",
        lead: "Sketch it. I'll",
        accent: "finish it.",
      },
      steps: [
        { n: "1", title: "Tell me", sub: "where", meta: "~30 sec" },
        { n: "2", title: "I plan it", sub: "all", meta: "~90 sec · you watch it build" },
        { n: "3", title: "Book in", sub: "one tap", meta: "holds, tickets, tables — handled" },
      ],
      cta: { label: "Start planning", prompt: PROMPTS.hero },
      note: "10,000+ trips · rated 4.9 across all of them",
    },
  ],
  askBar: {
    placeholder: "Ask me about Lapland…",
    cta: "Ask Kaira",
    prompt: PROMPTS.ask,
  },
};

const LaplandThemePage = ({ checkAuthState }: { checkAuthState: () => void }) => {
  const seedChat = useSeedChat();

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
      </Head>
      <CinematicThemeLanding config={laplandConfig} onSelectPrompt={seedChat} />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(LaplandThemePage);
