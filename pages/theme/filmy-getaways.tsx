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
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import {
  promptIntakeMap,
  type ThemePromptIntent,
} from "../../components/theme/cinematic/themeIntake";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

// The themed mini-form + /chatkit slug for this page (Switzerland DDLJ route).
const THEME_SLUG = "switzerland-ddlj";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const IMAGE_BASE = `${CDN}/media/website/filmy-getaways-2026`;

// ── Prompts (authoritative, per the campaign brief) ────────────────────────
const PROMPTS = {
  // Bollywood
  ddlj:
    "We are 2 travellers going for 7 nights in June, and our travel dates are flexible. Create a romantic Switzerland itinerary inspired by the feeling of Dilwale Dulhania Le Jayenge. Prioritize scenic train journeys, charming alpine villages, breathtaking mountain landscapes, lakeside towns, cozy cafés, slow mornings, and unforgettable viewpoints. The itinerary should feel relaxed, cinematic, and immersive rather than rushed, balancing iconic Swiss experiences with hidden gems.",
  znmd:
    "We are 2 travellers going for 10 nights in September, and our travel dates are flexible. Plan a Spain road trip inspired by Zindagi Na Milegi Dobara. Design the journey around friendship, freedom, adventure, and unforgettable experiences rather than simply covering cities. Prioritize scenic drives, coastal towns, authentic Spanish culture, lively nightlife, beautiful sunsets, local food experiences, and meaningful moments. Balance iconic highlights with offbeat recommendations to create a journey that feels spontaneous yet well-paced.",
  yjhd:
    "We are 2 travellers going for 7 nights in May, and our travel dates are flexible. Create a Himalayan adventure inspired by Yeh Jawaani Hai Deewani. Balance adventure, friendships, peaceful mountain moments, and cozy cafés. Recommend the best Himalayan destinations for the season instead of limiting the itinerary to one state. Include scenic drives, breathtaking viewpoints, optional treks, local experiences, adventure activities, bonfire evenings, stargazing opportunities, and hidden cafés while keeping the pace relaxed and memorable.",
  dilChahtaHai:
    "We are 2 travellers going for 5 nights in November, and our travel dates are flexible. Build a Goa getaway inspired by Dil Chahta Hai. Focus on unforgettable moments with friends, beach sunsets, scenic drives, lively cafés, hidden beaches, water activities, local food, nightlife, and relaxed afternoons rather than simply covering tourist attractions. Blend iconic experiences with lesser-known gems to create the perfect mix of fun and downtime.",
  jabWeMet:
    "We are 2 travellers going for 6 nights in April, and our travel dates are flexible. Create a mountain escape inspired by Jab We Met. Prioritize charming hill towns, scenic road journeys, cozy cafés, colorful local markets, peaceful viewpoints, authentic cultural experiences, and comfortable stays. Let the itinerary capture the joy of spontaneous travel and slow exploration instead of rushing between destinations.",
  tamasha:
    "We are 2 travellers going for 7 nights in June, and our travel dates are flexible. Design a Corsica escape inspired by Tamasha. Focus on scenic coastal drives, charming villages, beautiful beaches, local cafés, Mediterranean culture, hidden viewpoints, and slow travel experiences that encourage exploration and self-discovery. Balance relaxation with unique local experiences to create a journey that feels both refreshing and meaningful.",
  // Hollywood
  midnightInParis:
    "We are 2 travellers going for 5 nights in September, and our travel dates are flexible. Create a Paris itinerary inspired by the timeless charm of Midnight in Paris. Prioritize atmospheric cafés, charming neighborhoods, bookstores, art museums, riverside walks, jazz bars, evening strolls, local bakeries, and authentic Parisian experiences. Balance iconic landmarks with hidden gems to create a slow, romantic, and immersive journey.",
  eatPrayLove:
    "We are 2 travellers going for 8 nights in July, and our travel dates are flexible. Plan a Bali escape inspired by Eat Pray Love. Design the journey around wellness, mindfulness, cultural immersion, beautiful nature, hidden cafés, temples, waterfalls, beach sunsets, yoga experiences, spa treatments, and slow travel. Prioritize meaningful local experiences over simply visiting popular tourist attractions.",
  mammaMia:
    "We are 2 travellers going for 8 nights in June, and our travel dates are flexible. Create a Greek island itinerary inspired by Mamma Mia!. Prioritize charming whitewashed villages, crystal-clear beaches, local tavernas, boat trips, coastal walks, hidden viewpoints, island hopping, and spectacular sunsets. The journey should feel joyful, picturesque, and relaxed while blending iconic highlights with authentic island experiences.",
  harryPotter:
    "We are 2 travellers going for 7 nights in August, and our travel dates are flexible. Create a Scotland itinerary inspired by the magical landscapes associated with Harry Potter. Focus on historic castles, scenic rail journeys, misty Highlands, charming villages, dramatic landscapes, ancient streets, cozy pubs, and iconic viewpoints. Capture a sense of wonder and adventure rather than simply visiting filming locations.",
  lordOfTheRings:
    "We are 2 travellers going for 12 nights in February, and our travel dates are flexible. Design a New Zealand adventure inspired by the epic landscapes of The Lord of the Rings. Prioritize breathtaking mountain scenery, pristine lakes, scenic drives, hiking opportunities, charming towns, and immersive nature experiences. Create a journey that feels cinematic, adventurous, and balanced, with a mix of iconic sights and hidden natural gems.",
  // Step into the scene
  romanticEscape:
    "We are 2 travellers going for 7 nights in October, and our travel dates are flexible. Create a romantic itinerary designed around meaningful experiences rather than packed sightseeing. Prioritize beautiful stays, scenic viewpoints, sunset experiences, charming cafés, intimate dining, leisurely walks, hidden gems, and memorable moments. Balance iconic attractions with peaceful experiences to create a slow, cinematic, and deeply romantic journey.",
  friendsWhoTravelFar:
    "We are 4 friends going for 7 nights in October, and our travel dates are flexible. Create a fun-filled group itinerary focused on shared experiences, adventure, scenic road journeys, lively cafés, nightlife, local food, unique activities, and unforgettable moments with friends. Prioritize flexibility, memorable experiences, and a balance of excitement and downtime over simply covering tourist attractions.",
  soloTrip:
    "I'm travelling solo for 6 nights in October, and my travel dates are flexible. Create a solo travel itinerary focused on self-discovery, flexibility, safety, and immersive local experiences. Prioritize walkable neighborhoods, cafés, cultural experiences, scenic viewpoints, peaceful moments, hidden gems, and opportunities to connect with the destination. Maintain a relaxed pace that encourages exploration while leaving room for spontaneity.",
  // Ask Kaira
  whichFilmLocation:
    "Which iconic film-inspired trip should we do first, travelling as a couple — DDLJ Switzerland, ZNMD Spain, Eat Pray Love Bali, or Mamma Mia Greece? Compare the experience, cost, and atmosphere, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. Each film sends you somewhere different, so the month
// follows the destination rather than the theme — February for a New Zealand
// summer, June for the Alps and the Aegean, November for Goa.
//
// `whichFilmLocation` carries neither `nights` nor `month`: it asks Kaira to
// choose between four countries whose seasons don't overlap, so committing to
// either would answer the question for her.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  ddlj: { nights: 7, month: 6, who: "Couple" },
  znmd: { nights: 10, month: 9, who: "Couple" },
  yjhd: { nights: 7, month: 5, who: "Couple" },
  dilChahtaHai: { nights: 5, month: 11, who: "Couple" },
  jabWeMet: { nights: 6, month: 4, who: "Couple" },
  tamasha: { nights: 7, month: 6, who: "Couple" },
  midnightInParis: { nights: 5, month: 9, who: "Couple" },
  eatPrayLove: { nights: 8, month: 7, who: "Couple" },
  mammaMia: { nights: 8, month: 6, who: "Couple" },
  harryPotter: { nights: 7, month: 8, who: "Couple" },
  lordOfTheRings: { nights: 12, month: 2, who: "Couple" },
  romanticEscape: { nights: 7, month: 10, who: "Couple" },
  friendsWhoTravelFar: { nights: 7, month: 10, who: "Friends", adults: 4 },
  soloTrip: { nights: 6, month: 10, who: "Just me" },
  whichFilmLocation: { who: "Couple" },
});

const filmyGetawaysConfig: CinematicThemeConfig = {
  // Cinema red — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["switzerland-ddlj"],
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
        image: `${IMAGE_BASE}/DDLJ2.png`,
        caption: "Switzerland, DDLJ",
        href: "/europe/switzerland",
      },
      {
        image: `${IMAGE_BASE}/ZNMD.png`,
        caption: "Spain, ZNMD",
        href: "/europe/spain",
      },
      {
        image: `${IMAGE_BASE}/MammaMia.png`,
        caption: "Greece, Mamma Mia",
        href: "/europe/greece",
      },
      {
        image: `${IMAGE_BASE}/EatPrayLove.png`,
        caption: "Bali, Eat Pray Love",
        href: "/asia/indonesia/bali",
      },
    ],
  },
  sections: [
    // ── Bollywood ──
    // A film isn't a bookable element — each card is a whole trip request, so
    // it carries "Create plan" and seeds its prompt rather than "+ Add"-ing to
    // the tray. (A `selectable` card with no activityId toggles the saved list
    // on click and never fires its prompt — see PromptCard.)
    {
      type: "cards",
      ctaLabel: "Create plan →",
      heading: { lead: "Bollywood scenes you never", accent: "forgot" },
      cards: [
        {
          image: `${IMAGE_BASE}/DDLJ2.png`,
          name: "DDLJ, the Switzerland dream",
          line: "Trains, Alps, and romance.",
          tag: "Switzerland",
          prompt: PROMPTS.ddlj,
        },
        {
          image: `${IMAGE_BASE}/ZNMD.png`,
          name: "ZNMD, Spain awaits",
          line: "Spain. Friendship. No regrets.",
          tag: "Spain",
          objectPosition: "center 30%",
          prompt: PROMPTS.znmd,
        },
        {
          image: `${IMAGE_BASE}/YJHD.png`,
          name: "Yeh Jawaani — mountains to palaces",
          line: "Mountains, desert, road-trip vibes.",
          tag: "India",
          prompt: PROMPTS.yjhd,
        },
        {
          image: `${IMAGE_BASE}/DilChahtaHai.png`,
          name: "Dil Chahta Hai, Goa forever",
          line: "Friends, feni, and the sea.",
          tag: "Goa",
          prompt: PROMPTS.dilChahtaHai,
        },
        {
          image:
            `${IMAGE_BASE}/JabWeMet.png`,
          name: "Jab We Met, hill-town joy",
          line: "Spontaneous, slow, unforgettable.",
          tag: "Mountains",
          // Portrait still — frame the couple's faces (upper third).
          objectPosition: "center 40%",
          prompt: PROMPTS.jabWeMet,
        },
        {
          image: `${IMAGE_BASE}/Tamasha.png`,
          name: "Tamasha, Corsica calling",
          line: "Cliffs, sea, and silence.",
          tag: "Corsica",
          prompt: PROMPTS.tamasha,
        },
      ],
    },
    // ── Hollywood ── (same contract as the Bollywood row above)
    {
      type: "cards",
      ctaLabel: "Create plan →",
      heading: { lead: "Hollywood said go.", accent: "We agree." },
      cards: [
        {
          image:
           `${IMAGE_BASE}/MidNightInParis.png`,
          name: "Midnight in Paris",
          line: "When Paris stops performing.",
          tag: "France",
          // Portrait still — frame the couple's faces (upper third).
          objectPosition: "center 25%",
          prompt: PROMPTS.midnightInParis,
        },
        {
          image: `${IMAGE_BASE}/EatPrayLove.png`,
          name: "Eat Pray Love, Bali & Italy",
          line: "Some trips change everything.",
          tag: "Bali + Italy",
          prompt: PROMPTS.eatPrayLove,
        },
        {
          image: `${IMAGE_BASE}/MammaMia.png`,
          name: "Mamma Mia — Greek islands",
          line: "Where life turns into music.",
          tag: "Greece",
          prompt: PROMPTS.mammaMia,
        },
        {
          image:
           `${IMAGE_BASE}/HarryPotter.png`,
          name: "Harry Potter, Scotland magic",
          line: "Castles, mist, and wonder.",
          tag: "Scotland",
          // Portrait still — frame the subject's face (upper third).
          objectPosition: "center 25%",
          prompt: PROMPTS.harryPotter,
        },
        {
          image:
            `${IMAGE_BASE}/LordOfRings.png`,
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
      ctaLabel: "Create plan →",
      heading: {
        lead: "Step into",
        accent: "the scene",
        note: "Priced from Delhi · flights included",
      },
      cards: [
        {
          image: `${IMAGE_BASE}/TheRomanticEscape.jpeg`,
          tag: "Bollywood · romantic · 9N",
          name: "The romantic escape",
          line: "Europe made for two.",
          price: "₹3,85,000 / person",
          nights: "9 nights",
          prompt: PROMPTS.romanticEscape,
        },
        {
          image: `${IMAGE_BASE}/FriendsWhoTravelSoFar.jpeg`,
          tag: "Bollywood · group · 8N",
          name: "Friends who travel far",
          line: "Three friends. One wild route.",
          price: "₹2,95,000 / person",
          nights: "8 nights",
          prompt: PROMPTS.friendsWhoTravelFar,
        },
        {
          image: `${IMAGE_BASE}/SoloTrip.jpeg`,
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
    buildCta: "Build trip",
  },
};

const FilmyGetawaysThemePage = ({
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
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/filmy-getaways"
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
                  name: "Filmy Getaways — Film-Inspired Trip Planner",
                  description:
                    "Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers.",
                  url: "https://thetarzanway.com/theme/filmy-getaways",
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
                      name: "Filmy Getaways",
                      item: "https://thetarzanway.com/theme/filmy-getaways",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={filmyGetawaysConfig}
        onSelectPrompt={handleSelectPrompt}
        selection={selection}
        onBuild={handleBuild}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(FilmyGetawaysThemePage);
