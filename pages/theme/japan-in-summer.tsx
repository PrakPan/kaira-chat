// pages/theme/japan-in-summer.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";

const japanThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Things you'll talk about for years. Tell me what you want.",
    promptChips: [
      {
        icon: "🗾",
        label: "Plan a 10-day Japan trip — temples, bullet trains, ryokans",
        prompt:
          "Plan a 10-day Japan summer trip for 2 people. Cover Tokyo, Kyoto, and Osaka. Include shinkansen travel between cities, at least one ryokan stay, key temples, and the best summer food experiences. Suggest a day-by-day itinerary and full budget breakdown for Indian travellers.",
      },
      {
        icon: "⛩️",
        label: "Kyoto temples and ryokans — build me an itinerary",
        prompt:
          "Plan a 4 to 5 day Kyoto itinerary for summer. I want to visit the key temples and shrines, stay in a ryokan for at least one night, experience a traditional kaiseki meal, and understand what to avoid in peak tourist season. Suggest the best way to get around.",
      },
      {
        icon: "💴",
        label: "Japan on Rs 1.5L per person — is it doable?",
        prompt:
          "I want to do a Japan trip in summer with a budget of Rs 1.5 lakh per person including flights. Is it realistic? What would I need to compromise on and what can I still experience? Suggest the best way to plan this as an Indian traveller.",
      },
      {
        icon: "🌸",
        label: "First time in Japan — where do I actually start?",
        prompt:
          "This will be my first trip to Japan. I am going in summer and have about 10 days. I do not know where to start — Tokyo, Kyoto, Osaka, Hiroshima. Help me figure out the best first-timer route, what I must not miss, and what to expect as an Indian traveller.",
      },
    ],
  },
  rows: {
    row1: {
      heading: "From Cherry Blossoms to Bullet Trains",
      icon: "🌸",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TokyoR1.jpg",
          label: "Tokyo — City of Everything",
          tags: "Urban · First Timer",
          description: "Where every street surprises you.",
          prompt:
            "Plan 4 days in Tokyo in summer. I want to cover the highlights — Shibuya, Shinjuku, Asakusa — but also find the less obvious spots. Include food, transport, and one day trip suggestion.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/KyotoR1.jpg",
          label: "Kyoto — Temples and Tatami",
          tags: "Culture · Ryokan",
          description: "Ancient Japan, perfectly preserved.",
          prompt:
            "Plan a 3 to 4 day Kyoto itinerary for summer. Include the top temples, a ryokan stay, a traditional kaiseki dinner, and the best times to visit each site to avoid peak crowds.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HakoneR1.jpg",
          label: "Hakone — Mt. Fuji Views",
          tags: "Scenic · Onsen",
          description: "Fuji on one side. Hot spring on the other.",
          prompt:
            "Plan a 2-day Hakone trip from Tokyo. I want a ryokan with an onsen, the best views of Mt. Fuji, and what to do if the mountain is clouded over. Include transport from Tokyo.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/OsakaR1.jpg",
          label: "Osaka — Eat Everything",
          tags: "Food · Nightlife",
          description: "Japan's most delicious city. Obviously.",
          prompt:
            "Plan 2 to 3 days in Osaka focused on food and culture. Give me the must-eat list — takoyaki, okonomiyaki, ramen — the best neighbourhoods, and how to combine it with a Kyoto trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HiroshimaR1.jpg",
          label: "Hiroshima and Miyajima",
          tags: "History · Bucket List",
          description: "The trip that stays with you.",
          prompt:
            "Plan a day or two in Hiroshima and Miyajima Island. I want to visit the Peace Memorial, understand the history properly, and see the floating torii gate. Best approached as a day trip or overnight?",
        },
      ],
    },
    row2: {
      heading: "Japan This Summer",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/GionR2.jpg",
          label: "Gion Matsuri — Kyoto's Greatest Festival",
          sublabel: "Book by May — hotels fill 3 months out",
          prompt:
            "I want to attend the Gion Matsuri festival in Kyoto in July. Plan a trip around it — best days to be there, where to stay, what the festival involves, and how to combine it with a broader Kyoto and Japan itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ObonR2.jpg",
          label: "Obon Week — Ancestral Fire and Dance",
          sublabel: "Mid-August",
          prompt:
            "I want to experience Obon in Japan in August. Which city or town gives the most authentic experience? Plan a trip around the Obon period including bon odori dances, lantern ceremonies, and the best places to witness it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/FujiR2.jpg",
          label: "Fuji Climbing Season Opens",
          sublabel: "Only 2 months to climb. Plan now.",
          prompt:
            "I want to climb Mount Fuji this summer. When does the season open, which trail is best for a first-timer, how fit do I need to be, and what does the full trip cost? Plan this as part of a broader Japan trip from India.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HokkaidoR2.jpg",
          label: "Hokkaido — Japan's Cool North",
          sublabel: "While everyone melts in Tokyo",
          prompt:
            "Plan a summer trip to Hokkaido. I want to escape the heat of mainland Japan, see the lavender fields in Furano, explore Sapporo, and understand how to combine Hokkaido with Tokyo in a 10-12 day trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapneseR2.jpg",
          label: "Japanese Summer Fireworks — Hanabi Season",
          sublabel: "The nights are worth the flight.",
          prompt:
            "Tell me about the best hanabi — fireworks — festivals in Japan in summer. Which ones are truly spectacular, where are they held, and how do I plan a trip that includes one? Recommend the best combination with other Japan stops.",
        },
      ],
    },
    row3: {
      heading: "TTW's Japan Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TraditionalR3.jpg",
          label: "Traditional Japan",
          sublabel: "Less Rush. More Ritual.",
          prompt:
            "I want to do Japan slowly. No rushed itinerary — I want ryokans, onsens, morning temple walks, and quiet towns. Suggest a 10-day Japan trip that prioritises the unhurried side of the country. Kyoto and smaller towns over Tokyo crowds.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapankidsR3.jpg",
          label: "Japan With Kids",
          sublabel: "Family Summer Trips",
          prompt:
            "Plan a Japan summer trip for a family with young children. I want it to be fun and manageable — not overwhelming. What are the best cities, kid-friendly attractions, food that children will eat, and how to handle transport with kids? 8 to 10 days.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/HoneymoonR3.jpg",
          label: "Honeymoon in Japan",
          sublabel: "Romantic and Refined",
          prompt:
            "Plan a honeymoon trip to Japan. We want the romantic side — a ryokan with a private onsen, beautiful scenery, good food, and a mix of Kyoto culture and Tokyo energy. 10 days, suggest a full itinerary and what to splurge on.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/JapanR3.jpg",
          label: "Japan Under Rs 1.5 Lakh",
          sublabel: "Premium Feel, Honest Budget",
          prompt:
            "Plan a Japan trip for under Rs 1.5 lakh per person including flights. I want it to feel premium — not budget-backpacker. What does this budget actually get me, where do I stay, and what should I prioritise and skip to make the numbers work?",
        },
      ],
    },
    row4: {
      heading: "Only in Japan — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ChaR5.jpg",
          label: "Cha-no-yu — Private Tea Ceremony, Kyoto",
          tags: "Cultural · Premium",
          description: "Not a tourist show. The real thing.",
          prompt:
            "I want to experience a genuine Japanese tea ceremony — not the 10-minute tourist version. Tell me what a proper cha-no-yu involves, how long it takes, and what makes it different from the commercialised versions. Suggest the best places in Kyoto for a private session in a traditional machiya or tea house — what does it cost, how do I book, and how should I prepare? Walk me through what the experience actually feels like. Then ask me how many days I have in Kyoto and what else I'd like to build around this.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ShukuboR5.jpg",
          label: "Shukubo — Sleeping in a Buddhist Temple, Koyasan",
          tags: "Offbeat · Spiritual",
          description: "Monk breakfast included. Seriously.",
          prompt:
            "Tell me everything about staying in a shukubo — Buddhist temple lodging — on Mount Koya. What is the experience like: the rooms, the vegetarian monk cuisine called shojin ryori, morning prayers I can join, and the ancient Okunoin cemetery lit by stone lanterns at night. How far is Koyasan from Osaka or Kyoto, how do I get there on the cable car and train, and how do I choose the right temple to stay in? What does it cost and how different is it from a ryokan? Then ask me where I'm based in Japan and whether I'd like to build a 1 or 2 night detour around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/KaisekiR5.jpg",
          label: "Kaiseki Dinner — Michelin Gastronomy, Kyoto",
          tags: "Luxury · Gastronomy",
          description: "Seven courses. Zero regrets.",
          prompt:
            "I want to experience a proper kaiseki dinner in Kyoto. Explain what kaiseki actually is — the philosophy behind it, the seasonal ingredients, how the meal unfolds across seven to twelve courses, and why this is considered the highest form of Japanese cooking. What is the difference between a mid-range and a Michelin-level kaiseki experience, and what does each cost for two? How far in advance do I need to book, and what should I know as an Indian traveller about navigating the menu and dietary restrictions? Then ask me my travel dates and overall Japan food budget so we can figure out where this fits in the trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/TsukujiR5.jpg",
          label: "Tsukiji Market — Sunrise Tuna Auction, Tokyo",
          tags: "Food · Immersive",
          description: "4am. Tuna. Worth every minute.",
          prompt:
            "Tell me about the Tsukiji outer market experience in Tokyo — the early morning energy, watching the fish auction, the stalls opening at dawn, and eating the freshest sushi breakfast of my life at 6am. Can tourists still access the tuna auction, do I need to register, and how early do I actually need to arrive to make it worth it? Walk me through the full morning from arrival to sitting down for breakfast — what to eat, which stalls are worth knowing, and how long I need. Then ask me what else I have planned in Tokyo so we can figure out how to fit this in without wrecking the rest of the day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/ZazenR5.jpg",
          label: "Zazen Meditation with a Zen Master — Kyoto or Kamakura",
          tags: "Wellness · Spiritual",
          description: "Silence so good it's uncomfortable.",
          prompt:
            "I want to do a zazen — seated Zen meditation — session with a proper instructor in Japan. Tell me exactly what it involves: the posture, the silence, what the monk does, how long a session runs, and whether it is genuinely suitable for a complete beginner with no meditation background. Where are the best temples for this — a Rinzai temple in Kyoto or a Zen temple in Kamakura — and what is the difference between a drop-in public session and a private guided experience? What does each cost and how do I book? Then ask me where I will be in Japan and how much time I have so we can figure out which city fits my itinerary better.",
        },
      ],
    },
  },
};

const JapanInSummerThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={japanThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(JapanInSummerThemePage);
