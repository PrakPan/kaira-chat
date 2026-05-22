// pages/theme/vietnam-uncovered.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import vietnamTravellerStories from "../../data/vietnamTravellerStories";

const vietnamThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "Streets that smell like food. Tell me when you're going.",
    promptChips: [
      {
        icon: "🗺️",
        label: "Plan a 10-day Vietnam trip — north to south",
        prompt:
          "Plan a 10-day Vietnam trip covering the north and south. Start in Hanoi, include Ha Long Bay, move through Hoi An, and end in Ho Chi Minh City. Include the best transport between cities, key experiences, food stops, and a full budget breakdown for Indian travellers.",
      },
      {
        icon: "🛥️",
        label: "Ha Long Bay overnight cruise — worth it?",
        prompt:
          "I want to do an overnight cruise on Ha Long Bay. Is it worth the cost? What is the difference between a 1-night and 2-night cruise, which cruise company level should I book, and how do I combine it with a Hanoi and northern Vietnam trip?",
      },
      {
        icon: "💰",
        label: "Vietnam on Rs 50K per person — full trip",
        prompt:
          "I want to plan a Vietnam trip on a budget of Rs 50,000 per person including flights from India. Is it realistic? What can I cover, where should I stay, and what are the best ways to keep costs low without missing the highlights?",
      },
      {
        icon: "🌏",
        label: "First time in Vietnam — where do I actually start?",
        prompt:
          "This will be my first trip to Vietnam. I have about 10 days and do not know whether to go north, south, or do both. Help me figure out the best first-timer route — Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh City — and what to expect as an Indian traveller.",
      },
    ],
  },
  rows: [
    {
      heading: "From Street Food to Karst Mountains",
      icon: "🍜",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Hanoi — Old Quarter and Everything After.jpg ",
          label: "Hanoi — Old Quarter and Everything After",
          tags: "Urban · History",
          description: "The city that never really sleeps.",
          prompt:
            "Plan 3 days in Hanoi. I want to explore the Old Quarter, visit Hoan Kiem Lake, try authentic pho and bun cha, and understand the history. Include a day trip suggestion — Ha Long Bay or Ninh Binh — and transport tips.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Ha Long Bay — Limestone and Still Water.jpg ",
          label: "Ha Long Bay — Limestone and Still Water",
          tags: "Scenic · Iconic",
          description: "Still the most beautiful thing. Always.",
          prompt:
            "Plan a Ha Long Bay trip as part of a Vietnam itinerary. Should I do a 1-night or 2-night cruise, which tier of cruise is worth it, and what are the best activities on board? Combine this with Hanoi before and what comes after.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Hoi An — Lanterns and Ancient Streets.jpg ",
          label: "Hoi An — Lanterns and Ancient Streets",
          tags: "Culture · Slow Travel",
          description: "You'll want to stay another week.",
          prompt:
            "Plan 3 to 4 days in Hoi An. I want to walk the Ancient Town, visit a tailor for custom clothing, take a cooking class, and cycle to the beach. What is the best time to be there for the lantern festival and how does it connect to Da Nang?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/HoC.jpg",
          label: "Ho Chi Minh City — Chaos Worth Loving",
          tags: "Food · Energy",
          description: "More alive than any city you've visited.",
          prompt:
            "Plan 2 to 3 days in Ho Chi Minh City. I want to understand the war history, eat my way through District 1, visit the Mekong Delta, and feel the energy of the city. What are the must-dos for a first timer?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Sapa.jpg",
          label: "Sapa — Rice Terraces and Mountain Tribes",
          tags: "Offbeat · Trek",
          description: "The photo you've seen. Now go live it.",
          prompt:
            "Plan a Sapa trip as part of a northern Vietnam itinerary. I want to trek through rice terraces, visit a hill tribe village, and stay in a homestay or mountain lodge. How do I get there from Hanoi and how many days do I need?",
        },
      ],
    },
    {
      heading: "Vietnam This Month",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Ha Long Bay — Before the Rains.jpg ",
          label: "Ha Long Bay — Before the Rains",
          sublabel: "Seasonal · Iconic",
          description: "Best visibility window closes by June.",
          prompt:
            "Ha Long Bay is best visited before the rainy season. I want to do an overnight cruise in May or early June. Plan the trip — which cruise, which nights, and how to combine it with Hanoi and the rest of northern Vietnam.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Hoi An Lantern Festival — Full Moon Night.png ",
          label: "Hoi An Lantern Festival — Full Moon Night",
          sublabel: "Festival · Culture",
          description: "Every full moon, the town transforms.",
          prompt:
            "I want to experience the Hoi An Lantern Festival. When does it happen, what is the full moon schedule, and how do I plan a trip around it? Include the best things to do in Hoi An beyond the festival night.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Phu Quoc Island — Before Peak Season.jpg ",
          label: "Phu Quoc Island — Before Peak Season",
          sublabel: "Beach · Island",
          description: "The beach before the crowds arrive.",
          prompt:
            "Plan a Phu Quoc island trip in May or June. I want beaches, snorkelling, and island food. Is it still worth going before the full dry season and how do I combine it with Ho Chi Minh City?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Ninh Binh — Ha Long Bay on Land.jpg ",
          label: "Ninh Binh — Ha Long Bay on Land",
          sublabel: "Offbeat · Scenic",
          description: "Ha Long Bay, minus the boat crowds.",
          prompt:
            "I want to visit Ninh Binh instead of or alongside Ha Long Bay. What can I see and do — Trang An boat caves, Mua Cave hike, Bich Dong Pagoda — how many days do I need and how does it connect to a Hanoi itinerary?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Vietnamese Street Food Trail — North to South.jpg",
          label: "Vietnamese Street Food Trail — North to South",
          sublabel: "Food · Culture",
          description: "The best food trip in Southeast Asia.",
          prompt:
            "Plan a Vietnam trip focused entirely on food. I want to eat my way from Hanoi to Ho Chi Minh City — pho, bun cha, banh mi, cao lau, banh xeo, com tam. Which cities, which dishes, and which specific places should I not miss?",
        },
      ],
    },
    {
      heading: "TTW's Vietnam Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Vietnam on a Budget.jpg ",
          label: "Vietnam on a Budget",
          sublabel: "Southeast Asia Without Compromise",
          description: "Big trip. Honest budget.",
          prompt:
            "Plan a Vietnam trip on the tightest realistic budget for an Indian traveller. I want to do it properly — Ha Long Bay, Hoi An, Ho Chi Minh City — without feeling like I am cutting corners everywhere. What does a truly good Vietnam trip cost if done smartly?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Honeymoon in Vietnam.png ",
          label: "Honeymoon in Vietnam",
          sublabel: "Romantic, Unhurried, Unforgettable",
          description: "Lanterns, cruises, slow mornings.",
          prompt:
            "Plan a Vietnam honeymoon. We want the romantic version — a river cruise in Ha Long Bay, lanterns in Hoi An, a beach stay in Da Nang or Phu Quoc, and good food throughout. 10 days, suggest the full itinerary and where to splurge.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Vietnam With Family.png",
          label: "Vietnam With Family",
          sublabel: "10 Days, All Ages, No Stress",
          description: "Easy days. Happy kids.",
          prompt:
            "Plan a Vietnam family trip for 2 adults and 2 children. I want destinations and experiences that work for kids — not too much heat, easy transport, good food variety, and engaging activities. 10 days, cover the highlights without exhausting everyone.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/Vietnam for Solo Travellers.png",
          label: "Vietnam for Solo Travellers",
          sublabel: "Safe, Free, and Exactly Your Pace",
          description: "Go where the day takes you.",
          prompt:
            "Plan a solo Vietnam trip. I want it to feel free — flexible itinerary, easy to meet people, safe for solo travel, and genuinely interesting beyond the tourist trail. 10 to 12 days, any budget range, suggest the best route and mindset for going alone.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/North Vietnam — The Full Experience.jpg ",
          label: "North Vietnam — The Full Experience",
          sublabel: "Hanoi, Ha Long Bay, Sapa, Ninh Binh",
          description: "Go deep. No south. No rush.",
          prompt:
            "Plan a trip focused entirely on northern Vietnam. I want to spend 10 to 12 days going deep — Hanoi old quarter, Ha Long Bay overnight, Sapa trek, Ninh Binh caves. No south, no rush. Suggest the best order, transport, and stays.",
        },
      ],
    },
  ],
  travellerStories: vietnamTravellerStories,
};

const VietnamUncoveredThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={vietnamThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(VietnamUncoveredThemePage);
