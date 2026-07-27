// pages/theme/filmy-getaways.tsx
//
// Filmy Getaways — an editorial, cinematic theme landing (the "02 · Theme"
// mockup) built from the reusable CinematicThemeLanding component. Every card
// seeds its prompt into a fresh /chat session with Kaira. The page is wrapped
// in the shared site Layout so it keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import { useSeedChat } from "../../components/theme/cinematic/useSeedChat";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const IMAGE_BASE = `${CDN}/media/website/filmy-getaways-2026`;

// ── Prompts (authoritative, per the campaign brief) ────────────────────────
const PROMPTS = {
  // Bollywood
  ddlj:
    "Create a romantic Switzerland itinerary inspired by the feeling of Dilwale Dulhania Le Jayenge. Prioritize scenic train journeys, charming alpine villages, breathtaking mountain landscapes, lakeside towns, cozy cafés, slow mornings, and unforgettable viewpoints. The itinerary should feel relaxed, cinematic, and immersive rather than rushed, balancing iconic Swiss experiences with hidden gems.",
  znmd:
    "Plan a Spain road trip inspired by Zindagi Na Milegi Dobara. Design the journey around friendship, freedom, adventure, and unforgettable experiences rather than simply covering cities. Prioritize scenic drives, coastal towns, authentic Spanish culture, lively nightlife, beautiful sunsets, local food experiences, and meaningful moments. Balance iconic highlights with offbeat recommendations to create a journey that feels spontaneous yet well-paced.",
  yjhd:
    "Create a Himalayan adventure inspired by Yeh Jawaani Hai Deewani. Balance adventure, friendships, peaceful mountain moments, and cozy cafés. Recommend the best Himalayan destinations for the season instead of limiting the itinerary to one state. Include scenic drives, breathtaking viewpoints, optional treks, local experiences, adventure activities, bonfire evenings, stargazing opportunities, and hidden cafés while keeping the pace relaxed and memorable.",
  dilChahtaHai:
    "Build a Goa getaway inspired by Dil Chahta Hai. Focus on unforgettable moments with friends, beach sunsets, scenic drives, lively cafés, hidden beaches, water activities, local food, nightlife, and relaxed afternoons rather than simply covering tourist attractions. Blend iconic experiences with lesser-known gems to create the perfect mix of fun and downtime.",
  jabWeMet:
    "Create a mountain escape inspired by Jab We Met. Prioritize charming hill towns, scenic road journeys, cozy cafés, colorful local markets, peaceful viewpoints, authentic cultural experiences, and comfortable stays. Let the itinerary capture the joy of spontaneous travel and slow exploration instead of rushing between destinations.",
  tamasha:
    "Design a Corsica escape inspired by Tamasha. Focus on scenic coastal drives, charming villages, beautiful beaches, local cafés, Mediterranean culture, hidden viewpoints, and slow travel experiences that encourage exploration and self-discovery. Balance relaxation with unique local experiences to create a journey that feels both refreshing and meaningful.",
  // Hollywood
  midnightInParis:
    "Create a Paris itinerary inspired by the timeless charm of Midnight in Paris. Prioritize atmospheric cafés, charming neighborhoods, bookstores, art museums, riverside walks, jazz bars, evening strolls, local bakeries, and authentic Parisian experiences. Balance iconic landmarks with hidden gems to create a slow, romantic, and immersive journey.",
  eatPrayLove:
    "Plan a Bali escape inspired by Eat Pray Love. Design the journey around wellness, mindfulness, cultural immersion, beautiful nature, hidden cafés, temples, waterfalls, beach sunsets, yoga experiences, spa treatments, and slow travel. Prioritize meaningful local experiences over simply visiting popular tourist attractions.",
  mammaMia:
    "Create a Greek island itinerary inspired by Mamma Mia!. Prioritize charming whitewashed villages, crystal-clear beaches, local tavernas, boat trips, coastal walks, hidden viewpoints, island hopping, and spectacular sunsets. The journey should feel joyful, picturesque, and relaxed while blending iconic highlights with authentic island experiences.",
  harryPotter:
    "Create a Scotland itinerary inspired by the magical landscapes associated with Harry Potter. Focus on historic castles, scenic rail journeys, misty Highlands, charming villages, dramatic landscapes, ancient streets, cozy pubs, and iconic viewpoints. Capture a sense of wonder and adventure rather than simply visiting filming locations.",
  lordOfTheRings:
    "Design a New Zealand adventure inspired by the epic landscapes of The Lord of the Rings. Prioritize breathtaking mountain scenery, pristine lakes, scenic drives, hiking opportunities, charming towns, and immersive nature experiences. Create a journey that feels cinematic, adventurous, and balanced, with a mix of iconic sights and hidden natural gems.",
  // Step into the scene
  romanticEscape:
    "Create a romantic itinerary designed around meaningful experiences rather than packed sightseeing. Prioritize beautiful stays, scenic viewpoints, sunset experiences, charming cafés, intimate dining, leisurely walks, hidden gems, and memorable moments. Balance iconic attractions with peaceful experiences to create a slow, cinematic, and deeply romantic journey.",
  friendsWhoTravelFar:
    "Create a fun-filled group itinerary focused on shared experiences, adventure, scenic road journeys, lively cafés, nightlife, local food, unique activities, and unforgettable moments with friends. Prioritize flexibility, memorable experiences, and a balance of excitement and downtime over simply covering tourist attractions.",
  soloTrip:
    "Create a solo travel itinerary focused on self-discovery, flexibility, safety, and immersive local experiences. Prioritize walkable neighborhoods, cafés, cultural experiences, scenic viewpoints, peaceful moments, hidden gems, and opportunities to connect with the destination. Maintain a relaxed pace that encourages exploration while leaving room for spontaneity.",
  // Ask Kaira
  whichFilmLocation:
    "Which iconic film-inspired trip should I do first — DDLJ Switzerland, ZNMD Spain, Eat Pray Love Bali, or Mamma Mia Greece? Compare the experience, cost, and atmosphere, then build the ideal itinerary for the one you recommend.",
};

const filmyGetawaysConfig: CinematicThemeConfig = {
  header: {
    title: "Filmy getaways",
    subtitle: "Theme · Bollywood + Hollywood",
  },
  hero: {
    eyebrow: "Some stories are too good to just watch.",
    heading: { lead: "Live Your", accent: "Favorite Movie" },
    // Kept on desktop only (the mobile mockup has no hero subtext).
    lede: "You've watched the scene enough times. Tell me the film and I'll build the trip around the places that made it — with the touristy bits trimmed out.",
    placeholder: "Try: the ZNMD Spain trip",
    prompt: PROMPTS.znmd,
    chips: [
      { label: "ZNMD Spain trip", prompt: PROMPTS.znmd },
      { label: "DDLJ Switzerland trip", prompt: PROMPTS.ddlj },
      { label: "Eat Pray Love Bali trip", prompt: PROMPTS.eatPrayLove },
    ],
    // Desktop-only Kaira polaroid collage — each polaroid opens its destination.
    images: [
      {
        image: `${IMAGE_BASE}/DDLJ -- The Switzerland Dream.png`,
        caption: "Switzerland, DDLJ",
        href: "/europe/switzerland",
      },
      {
        image: `${IMAGE_BASE}/ZNMD -- Spain Awaits You.png`,
        caption: "Spain, ZNMD",
        href: "/europe/spain",
      },
      {
        image: `${IMAGE_BASE}/Mamma Mia -- Greek Islands.png`,
        caption: "Greece, Mamma Mia",
        href: "/europe/greece",
      },
      {
        image: `${IMAGE_BASE}/Eat Pray Love -- Bali and Italy.png`,
        caption: "Bali, Eat Pray Love",
        href: "/asia/indonesia/bali",
      },
    ],
  },
  sections: [
    // ── Bollywood ──
    {
      type: "cards",
      heading: { lead: "Bollywood scenes you never", accent: "forgot" },
      cards: [
        {
          image: `${IMAGE_BASE}/DDLJ -- The Switzerland Dream.png`,
          name: "DDLJ, the Switzerland dream",
          line: "Trains, Alps, and romance.",
          tag: "Switzerland",
          prompt: PROMPTS.ddlj,
        },
        {
          image: `${IMAGE_BASE}/ZNMD -- Spain Awaits You.png`,
          name: "ZNMD, Spain awaits",
          line: "Spain. Friendship. No regrets.",
          tag: "Spain",
          objectPosition: "center 30%",
          prompt: PROMPTS.znmd,
        },
        {
          image: `${IMAGE_BASE}/Yeh Jawaani -- Mountains to Palace.jpg`,
          name: "Yeh Jawaani — mountains to palaces",
          line: "Mountains, desert, road-trip vibes.",
          tag: "India",
          prompt: PROMPTS.yjhd,
        },
        {
          image: `${IMAGE_BASE}/Dil Chahta Hai -- Goa Forever.png`,
          name: "Dil Chahta Hai, Goa forever",
          line: "Friends, feni, and the sea.",
          tag: "Goa",
          prompt: PROMPTS.dilChahtaHai,
        },
        {
          image:
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200",
          name: "Jab We Met, hill-town joy",
          line: "Spontaneous, slow, unforgettable.",
          tag: "Mountains",
          prompt: PROMPTS.jabWeMet,
        },
        {
          image: `${IMAGE_BASE}/Corsica -- Where Tamasha Was Shot.png`,
          name: "Tamasha, Corsica calling",
          line: "Cliffs, sea, and silence.",
          tag: "Corsica",
          prompt: PROMPTS.tamasha,
        },
      ],
    },
    // ── Hollywood ──
    {
      type: "cards",
      heading: { lead: "Hollywood said go.", accent: "We agree." },
      cards: [
        {
          image:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
          name: "Midnight in Paris",
          line: "When Paris stops performing.",
          tag: "France",
          prompt: PROMPTS.midnightInParis,
        },
        {
          image: `${IMAGE_BASE}/Eat Pray Love -- Bali and Italy.png`,
          name: "Eat Pray Love, Bali & Italy",
          line: "Some trips change everything.",
          tag: "Bali + Italy",
          prompt: PROMPTS.eatPrayLove,
        },
        {
          image: `${IMAGE_BASE}/Mamma Mia -- Greek Islands.png`,
          name: "Mamma Mia — Greek islands",
          line: "Where life turns into music.",
          tag: "Greece",
          prompt: PROMPTS.mammaMia,
        },
        {
          image:
            "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=1200",
          name: "Harry Potter, Scotland magic",
          line: "Castles, mist, and wonder.",
          tag: "Scotland",
          prompt: PROMPTS.harryPotter,
        },
        {
          image:
            "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200",
          name: "Lord of the Rings, New Zealand",
          line: "Landscapes out of legend.",
          tag: "New Zealand",
          prompt: PROMPTS.lordOfTheRings,
        },
      ],
    },
    // ── Step into the scene ──
    {
      type: "trips",
      heading: {
        lead: "Step into",
        accent: "the scene",
        note: "Priced from Delhi · flights included",
      },
      cards: [
        {
          image: `${IMAGE_BASE}/The Romantic Escape.png`,
          tag: "Bollywood · romantic · 9N",
          name: "The romantic escape",
          line: "Europe made for two.",
          price: "₹3,85,000 / person",
          nights: "9 nights",
          prompt: PROMPTS.romanticEscape,
        },
        {
          image: `${IMAGE_BASE}/Friends Who Travel Far.png`,
          tag: "Bollywood · group · 8N",
          name: "Friends who travel far",
          line: "Three friends. One wild route.",
          price: "₹2,95,000 / person",
          nights: "8 nights",
          prompt: PROMPTS.friendsWhoTravelFar,
        },
        {
          image: `${IMAGE_BASE}/The Solo Reset.jpg`,
          tag: "Hollywood · solo · 7N",
          name: "The solo reset trip",
          line: "Go alone. Come back new.",
          price: "₹2,40,000",
          nights: "7 nights",
          prompt: PROMPTS.soloTrip,
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "Not a film person?",
        accent: "Try these",
      },
      columns: 6,
      cards: [
        {
          name: "Perfect proposals",
          meta: "9 trips",
          emoji: "💍",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: `${CDN}/media/page/174120792592848706245422363281/.png`,
          href: "/theme/perfect-proposal",
        },
        {
          name: "New Year & Christmas",
          meta: "Dec – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image:
            "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200",
          prompt:
            "Plan a New Year and Christmas holiday abroad with festive markets, lights, and celebrations. Recommend the best destinations for late December, and build a complete itinerary with stays and experiences.",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image:
            "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=1200",
          href: "/theme/edinburgh-hogmanay",
        },
        {
          name: "Thailand bachelor",
          meta: "Groups of 6+",
          emoji: "🕺",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: `${CDN}/media/website/thailand-theme-2026/ChiangMai.jpg`,
          href: "/theme/thailand-trip",
        },
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: `${CDN}/media/page/177133062391213107109069824219.jpg`,
          href: "/theme/northern-lights",
        },
        {
          name: "Honeymoon isles",
          meta: "12 trips",
          emoji: "🫶",
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          image:
            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200",
          href: "/theme/honeymoon-2026",
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations",
        lead: "Where I",
        accent: "send people",
      },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Switzerland",
          meta: "18 trips",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: `${CDN}/media/countries/175930905875495767593383789062.jpg`,
          href: "/europe/switzerland",
        },
        {
          name: "Spain",
          meta: "12 trips",
          emoji: "🍷",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: `${CDN}/media/countries/175344481739372777938842773438.jpg`,
          href: "/europe/spain",
        },
        {
          name: "Thailand",
          meta: "21 trips",
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          image: `${CDN}/media/countries/168442180095400023460388183594.jpg`,
          href: "/asia/thailand",
        },
        {
          name: "Japan",
          meta: "16 trips",
          emoji: "⛩️",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: `${CDN}/media/countries/175853838850662446022033691406.jpg`,
          href: "/asia/japan",
        },
        {
          name: "Iceland",
          meta: "8 trips",
          emoji: "🌋",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: `${CDN}/media/countries/168442051714989519119262695312.jpg`,
          href: "/europe/iceland",
        },
        {
          name: "Bali",
          meta: "14 trips",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: `${CDN}/media/cities/175456211725436902046203613281.jpg`,
          href: "/asia/indonesia/bali",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Which film location should I actually visit?",
    cta: "Ask Kaira",
    prompt: PROMPTS.whichFilmLocation,
  },
};

const FilmyGetawaysThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="filmy-getaways">
      <Head>
        <title>
          Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan
          Way
        </title>
        <meta
          name="description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
        <meta
          property="og:title"
          content="Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/filmy-getaways"
        />
      </Head>
      <CinematicThemeLanding config={filmyGetawaysConfig} onSelectPrompt={seedChat} />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(FilmyGetawaysThemePage);
