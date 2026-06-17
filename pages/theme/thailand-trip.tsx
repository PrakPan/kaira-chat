// pages/theme/thailand-trip-that-has-everything.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import thailandTravellerStories from "../../data/thailandTravellerStories";

const thailandThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Thailand has a version for everyone. Let's find yours.",
    promptChips: [
      {
        icon: "🏝️",
        label: "Which Thai islands are actually worth it in 2026?",
        prompt:
          "Phuket, Samui, Phi Phi, Lanta, Tao or Phangan? Help me choose the right Thai islands for my travel style and build the perfect 5–6 night island-hopping route.",
      },
      {
        icon: "💍",
        label: "Design a Thailand Honeymoon with Bangkok & Chiang Mai",
        prompt:
          "Plan a romantic Thailand honeymoon with Bangkok, Chiang Mai, and a beautiful beach escape. Build the ideal route, pace, stays, and unforgettable experiences for two.",
      },
      {
        icon: "🗺️",
        label: "Build me a 10-day Thailand itinerary from scratch",
        prompt:
          "Build me the ultimate 10-day Thailand itinerary covering culture, food, temples, nature, and beaches—without feeling rushed or wasting time in transit.",
      },
      {
        icon: "💰",
        label: "Thailand on a budget — what does Rs 80,000 get me?",
        prompt:
          "What does ₹80,000 actually get me in Thailand? Build a realistic 8–10 day itinerary with flights, hotels, transport, and the smartest places to spend and save.",
      },
    ],
  },
  rows: [
    {
      heading: "From Bangkok to the Islands",
      icon: "🌴",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Bangkok — Streets to Skybars.jpg ",
          label: "Bangkok — Streets to Skybars",
          tags: "City · Food",
          description: "A city worth three days.",
          prompt:
            "Plan 3 perfect days in Bangkok with temples, rooftop bars, river life, street food, and the city's best neighbourhoods. Show me where to stay, eat, and how to get around.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/ChiangRai.jpg ",
          label: "Chiang Mai — Slow Northern Thailand",
          tags: "Culture · North Thailand",
          description: "A calmer side of Thailand.",
          prompt:
            "Help me experience Chiang Mai beyond the highlights. Build a 3-night itinerary with temples, markets, mountain views, great food, an ethical elephant sanctuary, and local culture.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Koh Lanta — Quiet Island Escape.png ",
          label: "Koh Lanta — Quiet Island Escape",
          tags: "Beach · Relaxed",
          description: "Thailand beaches without crowds.",
          prompt:
            "Plan 4 relaxing nights on Koh Lanta with beaches, sunsets, island-hopping, great food, and the best area to stay based on my travel style.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/ChiangMai.jpg ",
          label: "Chiang Rai — Thailand's Artistic North",
          tags: "Culture · Offbeat",
          description: "Temples, art, and the far north.",
          prompt:
            "Is Chiang Rai worth more than a day trip? Build the ideal 2-night itinerary covering its famous temples, local culture, and how it fits into a northern Thailand trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Koh Tao — The Underwater Side of Thailand.jpg ",
          label: "Koh Tao — The Underwater Side of Thailand",
          tags: "Diving · Island",
          description: "Thailand's best island for diving.",
          prompt:
            "Plan a Koh Tao trip around earning my PADI certification. Include dive training, accommodation, island experiences, costs, and how to combine it with nearby islands.",
        },
      ],
    },
    {
      heading: "Thailand Right Now",
      icon: "🎉",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Songkran — Thailand’s Biggest Festival.png ",
          label: "Songkran — Thailand's Biggest Festival",
          sublabel: "Book by January — Chiang Mai fills 3 months out",
          description: "Biggest water fight on earth.",
          prompt:
            "Plan a Thailand trip around Songkran. Help me choose between Bangkok, Chiang Mai, and the islands, explain the festival traditions, and build the perfect itinerary around the celebrations.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Loy Krathong — Thailand’s Most Beautiful Night.jpg ",
          label: "Loy Krathong — Thailand's Most Beautiful Night",
          sublabel: "November · book the lantern release early",
          description: "Thousands of lanterns. One night.",
          prompt:
            "Design a Thailand trip around Loy Krathong and Yi Peng. Show me the best places to experience the festivals, what to book early, and how to build them into a 7–10 day itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Vegetarian Festival — Phuket Experience.png ",
          label: "Vegetarian Festival — Phuket Experience",
          sublabel: "October · 9 days of rituals",
          description: "Nine days of rituals in Phuket.",
          prompt:
            "Help me experience Phuket's Vegetarian Festival. Explain the traditions, key events, where to stay, and how to combine the festival with nearby islands.",
        },
        {
          image:
           "https://i.travelapi.com/lodging/5000000/4310000/4303800/4303775/2043dea5_b.jpg",
          label: "Thailand Islands at Their Best",
          sublabel: "Peak weather window · book early",
          description: "When Thailand feels like paradise.",
          prompt:
            "Plan the ultimate Thailand island-hopping trip during peak season. Recommend the best islands, ideal route, where to stay, and how to avoid common planning mistakes.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Full Moon Party -- Koh Phangan.webp ",
          label: "Full Moon Party — Koh Phangan",
          sublabel: "Monthly · plan around the moon",
          description: "Music, fire, and endless night.",
          prompt:
            "Build a 7-day Koh Samui, Koh Phangan, and Koh Tao itinerary around the Full Moon Party. Explain whether it's still worth it, where to stay, and how to balance partying with island life.",
        },
      ],
    },
    {
      heading: "TTW's Thailand Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/First Time in Thailand.jpg ",
          label: "First Time in Thailand",
          sublabel: "All Regions · First Timer",
          description: "City, culture, and beaches in one trip.",
          prompt:
            "Show me the best version of Thailand for a first visit—Bangkok, Chiang Mai, and the islands—with the perfect route, pace, and budget for 10 unforgettable days.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand With Kids.png ",
          label: "Thailand With Kids",
          sublabel: "Family · All Ages",
          description: "Fun beaches, wildlife, and family time.",
          prompt:
            "Design a Thailand family adventure with wildlife, beaches, culture, and activities kids will genuinely love, all at a pace that works for everyone.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand Honeymoon.png ",
          label: "Thailand Honeymoon",
          sublabel: "Romantic · Beach + Culture",
          description: "Romance, culture, and island luxury.",
          prompt:
            "Create the ultimate Thailand honeymoon with luxury stays, cultural experiences, stunning beaches, and unforgettable moments designed for two.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand for Foodies.jpg ",
          label: "Thailand for Foodies",
          sublabel: "Food · Street to Fine",
          description: "Street food to cooking class.",
          prompt:
            "Take me on a food-first journey through Thailand, from Bangkok street stalls and local markets to northern specialties and fresh island seafood.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Islands Only -- 10 Days.jpg",
          label: "Islands Only — 10 Days",
          sublabel: "Beach · Island Hopping",
          description: "Nothing but beaches and islands.",
          prompt:
            "Build the perfect Thailand island-hopping escape with the best beaches, snorkelling, sunsets, nightlife, and island combinations for 10 days.",
        },
      ],
    },
    {
      heading: "Only in Thailand — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Muay Thai -- Train with a Real Coach.jpg ",
          label: "Muay Thai — Train with a Real Coach",
          tags: "Sport · Bangkok or Chiang Mai",
          description: "Not a show. An actual session.",
          prompt:
            "Help me book an authentic Muay Thai session in Bangkok or Chiang Mai. Compare the best gyms, what training involves, costs, and how to fit it into my trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thai Cooking Class — Chiang Mai Food Experience.png ",
          label: "Thai Cooking Class — Chiang Mai Food Experience",
          tags: "Food · Chiang Mai",
          description: "Learn the dishes Thailand is known for.",
          prompt:
            "Find me the best Chiang Mai cooking class. Compare top schools, what I'll learn, costs, and how to build a perfect food-focused day around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Overnight Train -- Bangkok to Chiang Mai.png ",
          label: "Overnight Train — Bangkok to Chiang Mai",
          tags: "Experience · Night Train",
          description: "Thailand's most popular train journey.",
          prompt:
            "Is Thailand's famous overnight train worth it? Compare cabins, comfort, costs, and whether it beats flying for my itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Similan Islands — Thailand’s Best Snorkelling.jpg ",
          label: "Similan Islands — Thailand's Best Snorkelling",
          tags: "Diving · Andaman Sea",
          description: "Clear water, reefs, and marine life.",
          prompt:
            "Plan a Thailand trip around the Similan Islands. Cover snorkelling, diving, where to stay, best season, and how to build the ideal itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Doi Inthanon - Thailand's Highest Point.jpg ",
          label: "Doi Inthanon — Thailand's Highest Point",
          tags: "Nature · Chiang Mai Day Trip",
          description: "Waterfalls, hill tribes, cold air.",
          prompt:
            "Help me plan the perfect Doi Inthanon day trip with waterfalls, viewpoints, nature walks, and the best way to experience Thailand's highest mountain.",
        },
      ],
    },
  ],
  travellerStories: thailandTravellerStories,
};

const ThailandTripThatHasEverythingThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={thailandThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ThailandTripThatHasEverythingThemePage);
