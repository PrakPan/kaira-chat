// pages/theme/japan-in-autumn.tsx

import { useEffect } from "react";
import Head from "next/head";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";

const japanThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Things you'll talk about for years. Tell me what you want.",
    promptChips: [
      {
        icon: "🍁",
        label: "Plan a 10-day Japan trip — temples, bullet trains, ryokans",
        prompt:
          "Plan a 10-day Japan Autumn trip for 2 people. Cover Tokyo, Kyoto, and Osaka. Include shinkansen travel between cities, at least one ryokan stay, key temples, and the best food experiences. Suggest a day-by-day itinerary and full budget breakdown for Indian travellers.",
      },
      {
        icon: "⛩️",
        label: "Kyoto temples and ryokans — build me an itinerary",
        prompt:
          "Plan a 4 to 5 day Kyoto itinerary for Autumn. I want to visit the key temples and shrines, stay in a ryokan for at least one night, experience a traditional kaiseki meal, and understand what to avoid in peak tourist season. Suggest the best way to get around.",
      },
      {
        icon: "💴",
        label: "Japan on Rs 1.5L per person — is it doable?",
        prompt:
          "I want to do a Japan trip in Autumn with a budget of Rs 1.5 lakh per person including flights. Is it realistic? What would I need to compromise on and what can I still experience? Suggest the best way to plan this as an Indian traveller.",
      },
      {
        icon: "🍂",
        label: "First time in Japan — where do I actually start?",
        prompt:
          "This will be my first trip to Japan. I am going in Autumn and have about 10 days. I do not know where to start — Tokyo, Kyoto, Osaka, Hiroshima. Help me figure out the best first-timer route, what I must not miss, and what to expect as an Indian traveller.",
      },
    ],
  },
  rows: [
    {
      heading: "From Maple Leaves to Bullet Trains",
      icon: "🍁",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TokyoR1.jpg",
          label: "Tokyo — City of Everything",
          tags: "Urban · First Timer",
          description: "Neon nights. Golden autumn days.",
          prompt:
            "Plan 4 days in Tokyo in Autumn. I want to cover the highlights — Shibuya, Shinjuku, Asakusa — but also find the less obvious spots. Include food, transport, and one day trip suggestions.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/KyotoR1.jpg",
          label: "Kyoto — Temples and Tatami",
          tags: "Culture · Ryokan",
          description: "Ancient Japan, perfectly preserved.",
          prompt:
            "Plan a 3 to 4 day Kyoto itinerary in autumn. Include top temples for foliage, a ryokan stay, kaiseki dinner, and the best times to avoid crowds.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HakoneR1.jpg",
          label: "Hakone — Fuji and Autumn Views",
          tags: "Scenic · Onsen",
          description: "Hot springs under red leaves.",
          prompt:
            "Plan a 2-day Hakone trip from Tokyo in autumn. I want a ryokan with an onsen, Mt. Fuji views, autumn scenery, and transport details from Tokyo.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/OsakaR1.jpg",
          label: "Osaka — Eat Everything",
          tags: "Food · Nightlife",
          description: "Japan's most delicious city. Obviously.",
          prompt:
            "Plan 2 to 3 days in Osaka focused on food and culture. Give me the must-eat list — takoyaki, okonomiyaki, ramen — the best neighbourhoods, and how to combine it with a Kyoto trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HiroshimaR1.jpg",
          label: "Hiroshima and Miyajima",
          tags: "History · Bucket List",
          description: "The trip that stays with you.",
          prompt:
            "Plan a day or two in Hiroshima and Miyajima Island. I want to visit the Peace Memorial, understand the history properly, and see the floating torii gate. Best approached as a day trip or overnight?",
        },
      ],
    },
    {
      heading: "Japan This Autumn",
      icon: "🍂",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/GionR2.jpg",
          label: "Gion Matsuri — Kyoto's Greatest Festival",
          sublabel: "Book by May — hotels fill 3 months out",
          description: "Kyoto's wildest July night.",
          prompt:
            "I want to attend the Gion Matsuri festival in Kyoto in July. Plan a trip around it — best days to be there, where to stay, what the festival involves, and how to combine it with a broader Kyoto and Japan itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ObonR2.jpg",
          label: "Obon Week — Ancestral Fire and Dance",
          sublabel: "Mid-August",
          description: "Fire, dance, and ancestors.",
          prompt:
            "I want to experience Obon in Japan in August. Which city or town gives the most authentic experience? Plan a trip around the Obon period including bon odori dances, lantern ceremonies, and the best places to witness it.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/FujiR2.jpg",
          label: "Fuji Climbing Season Opens",
          sublabel: "Only 2 months to climb. Plan now.",
          description: "Two months. One summit.",
          prompt:
            "I want to climb Mount Fuji this Autumn. When does the season open, which trail is best for a first-timer, how fit do I need to be, and what does the full trip cost? Plan this as part of a broader Japan trip from India.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HokkaidoR2.jpg",
          label: "Hokkaido — Japan's Cool North",
          sublabel: "While everyone melts in Tokyo",
          description: "Cool air. Lavender fields.",
          prompt:
            "Plan an autumn trip to Hokkaido. I want to escape the heat of mainland Japan, see the lavender fields in Furano, explore Sapporo, and understand how to combine Hokkaido with Tokyo in a 10-12 day trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapneseR2.jpg",
          label: "Autumn Food Season in Japan",
          sublabel: "Chestnuts, ramen, and comfort food",
          description: "Japan tastes best in autumn.",
          prompt:
            "Tell me about the best seasonal food experiences in Japan during autumn. What should I eat, where should I go, and how do I build a food-focused autumn itinerary?",
        },
      ],
    },
    {
      heading: "TTW's Japan Themes",
      icon: "🎯",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TraditionalR3.jpg",
          label: "Traditional Japan",
          sublabel: "Less Rush. More Ritual.",
          description: "Slow down. Feel every moment.",
          prompt:
            "I want to do Japan slowly. No rushed itinerary — I want ryokans, onsens, morning temple walks, and quiet towns. Suggest a 10-day Japan trip that prioritises the unhurried side of the country. Kyoto and smaller towns over Tokyo crowds.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapankidsR3.jpg",
          label: "Japan With Kids",
          sublabel: "Family Autumn Trips",
          description: "Fun for the whole family.",
          prompt:
            "Plan a Japan Autumn trip for a family with young children. I want it to be fun and manageable — not overwhelming. What are the best cities, kid-friendly attractions, food that children will eat, and how to handle transport with kids? 8 to 10 days.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HoneymoonR3.jpg",
          label: "Honeymoon in Japan",
          sublabel: "Romantic and Refined",
          description: "Private onsens. Perfect dinners.",
          prompt:
            "Plan a honeymoon trip to Japan. We want the romantic side — a ryokan with a private onsen, beautiful scenery, good food, and a mix of Kyoto culture and Tokyo energy. 10 days, suggest a full itinerary and what to splurge on.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapanR3.jpg",
          label: "Japan Under Rs 1.5 Lakh",
          sublabel: "Premium Feel, Honest Budget",
          description: "Premium feel. Honest price.",
          prompt:
            "Plan a Japan trip for under Rs 1.5 lakh per person including flights. I want it to feel premium — not budget-backpacker. What does this budget actually get me, where do I stay, and what should I prioritise and skip to make the numbers work?",
        },
      ],
    },
    {
      heading: "Only in Japan — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ChaR5.jpg",
          label: "Cha-no-yu — Private Tea Ceremony, Kyoto",
          tags: "Cultural · Intimate · Premium",
          description: "Not a tourist show. The real thing.",
          prompt:
            "I want to experience a genuine Japanese tea ceremony in Kyoto — not the rushed tourist version. Tell me what a proper cha-no-yu feels like, how long it lasts, where to do a private session in a traditional tea house, what it costs, and how to prepare. Then ask me how many days I have in Kyoto so we can build the rest of the trip around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ShukuboR5.jpg",
          label: "Shukubo — Sleeping in a Buddhist Temple, Koyasan",
          tags: "Offbeat · Spiritual · Bucket List",
          description: "Monk breakfast included. Seriously.",
          prompt:
            "Tell me everything about staying in a shukubo — Buddhist temple lodging — on Mount Koya. What is the experience actually like, how do I get there from Kyoto or Osaka, what does it cost, and how is it different from a ryokan? Then ask me whether I want to add this as a 1 or 2 night detour in my Japan trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/KaisekiR5.jpg",
          label: "Kaiseki Dinner — Michelin Gastronomy, Kyoto",
          tags: "Luxury · Gastronomy · Once-in-a-lifetime",
          description: "Seven courses. Zero regrets.",
          prompt:
            "I want to experience a proper kaiseki dinner in Kyoto. Explain what makes it special, how the meal unfolds, what different price ranges look like, and how far in advance I need to book. Also help me understand dietary restrictions and what to expect as an Indian traveller. Then ask me my travel dates and Japan food budget.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TsukujiR5.jpg",
          label: "Tsukiji Market — Sunrise Tuna Auction, Tokyo",
          tags: "Food · Immersive · 4am Start",
          description: "4am. Tuna. Worth every minute.",
          prompt:
            "Tell me about the Tsukiji outer market experience in Tokyo — the early morning energy, sushi breakfast, best stalls, and whether tourists can still watch the tuna auction. Walk me through the full morning, how early I should arrive, and what is actually worth doing. Then ask me what else I have planned in Tokyo so we can fit this in properly.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ZazenR5.jpg",
          label: "Zazen Meditation with a Zen Master — Kyoto or Kamakura",
          tags: "Wellness · Spiritual · Premium",
          description: "Silence so good it's uncomfortable.",
          prompt:
            "I want to try a proper zazen meditation session in Japan with a real instructor. Explain what the experience involves, whether it is beginner-friendly, the best temples in Kyoto or Kamakura, and the difference between public and private sessions. Then ask me where I'll be in Japan and how much time I have so we can fit this into my itinerary.",
        },
      ],
    },
  ],
};

const JapanInAutumnThemePage = ({
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
          Japan in Autumn | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan your Japan autumn trip with The Tarzan Way's AI itinerary. Tokyo, Kyoto, Osaka, Hakone, Hiroshima — ryokans, temples, bullet trains, and the best autumn food experiences for Indian travellers."
        />
        <meta
          property="og:title"
          content="Japan in Autumn | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan your Japan autumn trip with The Tarzan Way's AI itinerary. Tokyo, Kyoto, Osaka, Hakone, Hiroshima — ryokans, temples, bullet trains, and the best autumn food experiences for Indian travellers."
        />
      </Head>
      <BotApp themeConfig={japanThemeConfig} />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(JapanInAutumnThemePage);
