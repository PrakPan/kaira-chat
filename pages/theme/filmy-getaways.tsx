// pages/theme/filmy-getaways.tsx

import { useEffect } from "react";
import Head from "next/head";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";

const IMAGE_BASE =
  "https://d31aoa0ehgvjdi.cloudfront.net/media/website/filmy-getaways-2026";

const filmyGetawaysThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "The film ends. Your trip begins.",
    promptChips: [
      {
        icon: "🎬",
        label: "I want to do the ZNMD Spain trip",
        prompt:
          "I want to recreate the ZNMD Spain journey through Pamplona, La Tomatina, Seville, and Barcelona. Build the ultimate itinerary with the best route, key experiences, costs, and festival dates.",
      },
      {
        icon: "🚆",
        label: "Plan my DDLJ Switzerland and Europe trip",
        prompt:
          "I want the classic DDLJ experience with Alpine trains, scenic villages, and romantic landscapes. Build a 10-day rail itinerary with the best routes, seasons, and costs from India.",
      },
      {
        icon: "🎞️",
        label: "Which film location should I actually visit?",
        prompt:
          "Which iconic film-inspired trip should I do first—ZNMD Spain, Queen Europe, Eat Pray Love Bali, or Before Sunrise Vienna? Compare the experience, cost, and atmosphere, then build the ideal itinerary.",
      },
      {
        icon: "🌴",
        label: "Plan my Eat Pray Love Bali trip",
        prompt:
          "I want to experience Bali from Eat Pray Love, from Ubud and rice terraces to wellness and local culture. Build the ideal itinerary with the best stays, experiences, and trip costs.",
      },
    ],
  },
  rows: [
    {
      heading: "Bollywood Scenes We Could Not Forget",
      icon: "🎥",
      cards: [
        {
          image: `${IMAGE_BASE}/Queen -- Solo Paris and Amsterdam.jpg`,
          label: "Queen — Solo Paris and Amsterdam",
          tags: "Bollywood · Europe",
          description: "Go alone. Come back with stories.",
          prompt:
            "I want a Queen-inspired solo trip through Paris and Amsterdam. Build the perfect itinerary with safe areas, memorable experiences, and the freedom that made the journey so special.",
        },
        {
          image: `${IMAGE_BASE}/ZNMD -- Spain Awaits You.jpg `,
          label: "ZNMD — Spain Awaits You",
          tags: "Bollywood · Spain",
          description: "Spain. Friendship. No regrets.",
          prompt:
            "I want to recreate the ZNMD Spain journey through Pamplona, La Tomatina, Seville, and Barcelona. Build the ultimate itinerary with key experiences, costs, and festival dates.",
        },
        {
          image: `${IMAGE_BASE}/Dil Chahta Hai -- Goa Forever.jpg`,
          label: "Dil Chahta Hai — Goa Forever",
          tags: "Bollywood · Goa",
          description: "Friends, feni, and the sea.",
          prompt:
            "I want a Dil Chahta Hai-style Goa getaway with beaches, nightlife, and unforgettable moments with friends. Build the perfect itinerary with the best places to stay, eat, and explore.",
        },
        {
          image: `${IMAGE_BASE}/DDLJ -- The Switzerland Dream.jpg `,
          label: "DDLJ — The Switzerland Dream",
          tags: "Bollywood · Europe",
          description: "Trains, Alps, and romance.",
          prompt:
            "I want the classic DDLJ experience through Switzerland and Europe. Build the ideal itinerary with scenic trains, charming towns, and iconic mountain views.",
        },
        {
          image: `${IMAGE_BASE}/Yeh Jawaani -- Mountains to Palaces.jpg`,
          label: "Yeh Jawaani — Mountains to Palaces",
          tags: "Bollywood · India",
          description: "Mountains. Desert. Road trip vibes.",
          prompt:
            "I want a Yeh Jawaani Hai Deewani-inspired trip from Manali to Udaipur. Build the perfect journey with mountain adventures, scenic routes, and romantic city experiences.",
        },
      ],
    },
    {
      heading: "Hollywood Said Go Here. We Agree.",
      icon: "🍿",
      cards: [
        {
          image: `${IMAGE_BASE}/Before Sunrise -- Vienna at Midnight.jpg `,
          label: "Before Sunrise — Vienna at Midnight",
          tags: "Hollywood · Austria",
          description: "A night that never feels planned.",
          prompt:
            "Build a Before Sunrise-style Vienna itinerary focused on slow walks, cafés, parks, and midnight conversations. Capture the exact feel of Jesse and Celine's journey across the city.",
        },
        {
          image: `${IMAGE_BASE}/Eat Pray Love -- Bali and Italy.jpg `,
          label: "Eat Pray Love — Bali and Italy",
          tags: "Hollywood · Bali + Italy",
          description: "Some trips change everything.",
          prompt:
            "Plan a combined Italy and Bali trip inspired by Eat Pray Love. Cover Rome, Naples, and Ubud with real experiences still worth doing today and total cost from India.",
        },
        {
          image: `${IMAGE_BASE}/Mamma Mia -- Greek Islands.jpg `,
          label: "Mamma Mia — Greek Islands",
          tags: "Hollywood · Greece",
          description: "Where life turns into music.",
          prompt:
            "Build an 8-day Greek islands trip inspired by Mamma Mia. Include Skopelos, Skiathos, and Santorini options with the most cinematic stays and island routes.",
        },
        {
          image: `${IMAGE_BASE}/Midnight in Paris -- Walk Into the Film.jpg `,
          label: "Midnight in Paris — Walk Into the Film",
          tags: "Hollywood · France",
          description: "When Paris stops performing.",
          prompt:
            "Create a Midnight in Paris-inspired 3-day itinerary covering Montmartre, Seine bridges, and Left Bank cafés. Include best timing for light, crowds, and cinematic moments.",
        },
        {
          image: `${IMAGE_BASE}/The Secret Life of Walter Mitty -- Iceland.jpg `,
          label: "The Secret Life of Walter Mitty — Iceland",
          tags: "Hollywood · Iceland",
          description: "Reality feels optional here.",
          prompt:
            "Create a 7-day Iceland road trip inspired by Walter Mitty. Cover the Ring Road, Snaefellsnes Peninsula, and south coast highlights with cinematic stops and routes.",
        },
      ],
    },
    {
      heading: "Your Film. Your Trip.",
      icon: "🎟️",
      cards: [
        {
          image: `${IMAGE_BASE}/Friends Who Travel Far.jpg `,
          label: "Friends Who Travel Far",
          tags: "Bollywood · Group",
          description: "Three friends. One wild route.",
          prompt:
            "Plan a ZNMD style Spain trip for three friends covering Pamplona, La Tomatina, Seville, and Barcelona. Include festival dates, booking timelines, travel between cities, stays, and cost from India.",
        },
        {
          image: `${IMAGE_BASE}/The Romantic Escape.jpg `,
          label: "The Romantic Escape",
          tags: "Bollywood · Romantic",
          description: "Europe made for two.",
          prompt:
            "Build a DDLJ-inspired 10-day honeymoon in Switzerland and nearby Europe. Focus on alpine trains, scenic villages, romantic routes, seasons, and total cost from India.",
        },
        {
          image: `${IMAGE_BASE}/The Solo Reset Trip.jpg `,
          label: "The Solo Reset Trip",
          tags: "Films · Solo",
          description: "Go alone. Come back new.",
          prompt:
            "Choose between Queen (Paris–Amsterdam) or Eat Pray Love (Bali–Italy) for a solo trip. Recommend one and build a detailed itinerary with key experiences and cost from India.",
        },
        {
          image: `${IMAGE_BASE}/The Film Route Europe Trip.jpg `,
          label: "The Film Route Europe Trip",
          tags: "Hollywood · Europe",
          description: "Cities that feel unreal.",
          prompt:
            "Create a 12-day Europe trip inspired by Before Sunrise (Vienna), Midnight in Paris, and Letters to Juliet (Verona). Include routes, key experiences, train travel, and total cost from India.",
        },
        {
          image: `${IMAGE_BASE}/Cruise Through the Mediterranean.jpg `,
          label: "Cruise Through the Mediterranean",
          tags: "Bollywood · Europe",
          description: "Sea, luxury, escape.",
          prompt:
            "Plan a Dil Dhadakne Do-inspired Mediterranean cruise covering Italy, Greece, and Turkey. Include best cruise route, key stops, season, and total cost from India.",
        },
      ],
    },
    {
      heading: "The Scenes You Want to Step Into",
      icon: "🎦",
      cards: [
        {
          image: `${IMAGE_BASE}/Rohtang Pass -- 3 Idiots and YJHD.jpg `,
          label: "Rohtang Pass — 3 Idiots and YJHD",
          tags: "Bollywood · Himalayas",
          description: "The road everyone remembers.",
          prompt:
            "Plan a 5-day Manali trip covering Rohtang Pass, inspired by 3 Idiots and Yeh Jawaani Hai Deewani. Include permit details, road conditions in snow vs summer, and full itinerary with Solang Valley, Old Manali, and Beas River.",
        },
        {
          image: `${IMAGE_BASE}/Corsica -- Where Tamasha Was Shot.jpg `,
          label: "Corsica — Where Tamasha Was Shot",
          tags: "Bollywood · France",
          description: "Cliffs, sea, and silence.",
          prompt:
            "Build a 5-day Corsica itinerary covering Bonifacio, Palombaggia, and mountain villages inspired by Tamasha. Include how to reach from France/Italy and how to combine it with Paris.",
        },
        {
          image: `${IMAGE_BASE}/Juliet's Courtyard -- Verona.jpg `,
          label: "Juliet's Courtyard — Verona",
          tags: "Hollywood · Italy",
          description: "Walls, wishes, and stories.",
          prompt:
            "Create a 2-day Verona itinerary covering Juliet's Courtyard, Piazza delle Erbe, the Roman amphitheatre, and river walks. Include what feels real vs touristy and how to fit it into a wider Italy trip.",
        },
        {
          image: `${IMAGE_BASE}/Amsterdam -- Queen's Canal Walk.jpg `,
          label: "Amsterdam — Queen's Canal Walk",
          tags: "Bollywood · Netherlands",
          description: "A city that slows you.",
          prompt:
            "Plan a 3-day Amsterdam trip inspired by Queen. Include Jordaan canals, Haarlemmerstraat, Vondelpark, and key solo/couple experiences. Structure it as a Paris extension with safe, cinematic walking routes.",
        },
        {
          image: `${IMAGE_BASE}/Santorini -- Mamma Mia Vibes.jpg `,
          label: "Santorini — Mamma Mia Vibes",
          tags: "Hollywood · Greece",
          description: "Sunsets that feel unreal.",
          prompt:
            "Build a 4-night Santorini or Skopelos itinerary inspired by Mamma Mia. Compare both islands, recommend where to stay, and design a day-by-day plan with Athens connection and best viewpoints.",
        },
      ],
    },
  ],
};

const FilmyGetawaysThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <>
      <Head>
        <title>
          Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan
          Way
        </title>
        <meta
          name="description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Queen Europe, Eat Pray Love Bali, Before Sunrise Vienna, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
        <meta
          property="og:title"
          content="Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Queen Europe, Eat Pray Love Bali, Before Sunrise Vienna, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
      </Head>
      <BotApp themeConfig={filmyGetawaysThemeConfig} />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(FilmyGetawaysThemePage);
