// pages/theme/international-luxury.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import internationalLuxuryTravellerStories from "../../data/internationalLuxuryTravellerStories";

const internationalLuxuryThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "The luxury version of everywhere.",
    promptChips: [
      {
        icon: "💍",
        label: "Plan my honeymoon with zero compromises",
        prompt:
          "I want to plan a luxury honeymoon where the experience matters most. Help me choose between destinations like Santorini, Amalfi Coast, Kyoto, or the Maldives, then build a 10–12 night itinerary with incredible stays, unforgettable experiences, and what to book first.",
      },
      {
        icon: "💰",
        label: "What does a premium international trip really cost from India?",
        prompt:
          "I want to understand the real cost of a high-end international trip from India. Compare flights, luxury stays, private transfers, yacht days, and premium experiences across destinations like Santorini, Amalfi Coast, and Koh Samui. Show me where spending more genuinely improves the trip.",
      },
      {
        icon: "✨",
        label: "I want something rare — not the usual bucket-list trip",
        prompt:
          "I want an international trip that feels unique and hard to replicate. Suggest rare experiences like Lapland northern lights cabins, Croatia sailing routes, or Kyoto ryokans. Explain costs, booking timelines, and which destination best fits someone looking beyond typical luxury travel.",
      },
      {
        icon: "🥂",
        label: "Build me a dream trip for two — ₹5 lakh per person",
        prompt:
          "I want to plan a premium international trip for two with a budget of around ₹5 lakh per person. Help me choose the best destinations, explain what this budget realistically allows, and build a complete 10-night itinerary with stays, experiences, and booking priorities.",
      },
    ],
  },
  rows: [
    {
      heading: "Where Luxury Lives",
      icon: "🌍",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Santorini Cave Suite Escape.png",
          label: "Santorini Cave Suite Escape",
          tags: "Greece · Romantic",
          description: "The view that justifies the price.",
          prompt:
            "I want to do Santorini properly with a private cave suite overlooking the caldera. Help me choose between Oia and Imerovigli, compare luxury vs premium stays, and build the perfect 3-night itinerary with a catamaran cruise, sunset dinner, and smooth travel route.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi & Capri by Private Boat.jpg",
          label: "Amalfi & Capri by Private Boat",
          tags: "Italy · Premium",
          description: "The coast, without the crowds.",
          prompt:
            "I want to experience Amalfi Coast and Capri in a quieter, more elegant way. Help me choose between Positano, Ravello, and Praiano, then build a 4-night itinerary with private boat days, hidden coves, and one unforgettable Capri stay.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/French Riviera -- Nice, Antibes, Monaco.jpg",
          label: "French Riviera — Nice, Antibes, Monaco",
          tags: "France · Glamour",
          description: "The Riviera that money built.",
          prompt:
            "I want to spend 4 nights on the French Riviera in a refined, non-touristy way. Help me choose between Nice, Èze, and Cap d'Antibes, compare boutique stays vs luxury hotels, and build the ideal Riviera itinerary with yacht time, fine dining, and Monaco done right.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Quiet Bali Retreat.jpg",
          label: "Quiet Bali Retreat",
          tags: "Bali · Beach",
          description: "Private Bali done properly.",
          prompt:
            "I want to experience Bali in a quieter, more private way away from Seminyak and Canggu. Help me choose between Nusa Dua, Bukit Peninsula, and Ubud, then build a 6-night itinerary with luxury villas, peaceful stays, and experiences genuinely worth paying extra for.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/KohS.jpg ",
          label: "Koh Samui — Private Villa Escape",
          tags: "Thailand · Beach",
          description: "Your villa. Your beach. Your day.",
          prompt:
            "I want to spend 5 nights in Koh Samui at a private pool villa. Help me compare Chaweng, Choeng Mon, and Plai Laem, explain which resorts truly stand out, and build a luxury itinerary with boat trips, spa experiences, and beach dinners.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland -- Northern Lights, Glass Cabin.jpg",
          label: "Lapland — Northern Lights, Glass Cabin",
          tags: "Finland · Arctic",
          description: "Aurora above. Warm inside.",
          prompt:
            "I want to plan a Lapland trip focused on northern lights and a real glass-ceiling cabin stay. Help me choose the best properties, ideal months, and how many nights I need. Then build the full itinerary with husky safaris, snowmobiles, and what needs early booking.",
        },
      ],
    },
    {
      heading: "The Right Time Changes Everything",
      icon: "⏳",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Santorini -- September Over August.jpg ",
          label: "Santorini — September Over August",
          sublabel: "Greece · Timing",
          description: "Same view. Half the crowd.",
          prompt:
            "I'm deciding between Santorini in August or September. Compare crowds, hotel pricing, sunsets, sea temperatures, and overall atmosphere at a premium caldera-view stay. Then build the ideal 3-night September itinerary and explain if it's genuinely better or just cheaper.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi Coast -- May or October.jpg ",
          label: "Amalfi Coast — May or October",
          sublabel: "Italy · Timing",
          description: "The coast at its best pace.",
          prompt:
            "I want to visit the Amalfi Coast outside peak summer. Compare May and October for weather, crowds, boat trips, restaurant reservations, and overall vibe. Then build the ideal 4-night itinerary for the better month.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland in September vs December.jpg ",
          label: "Lapland in September vs December",
          sublabel: "Finland · Season",
          description: "Aurora skies or winter magic.",
          prompt:
            "I'm choosing between Lapland in September or December. Compare aurora visibility, snow, activities, pricing, and the glass igloo experience. Then build the ideal 4-night itinerary based on the better season for northern lights vs winter scenery.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Kyoto in Spring or Autumn.jpg ",
          label: "Kyoto in Spring or Autumn",
          sublabel: "Japan · Season",
          description: "Two versions of Kyoto, both unforgettable.",
          prompt:
            "I want to stay in a Kyoto ryokan during cherry blossom or autumn foliage season. Compare crowds, atmosphere, temple gardens, pricing, and booking difficulty. Then build a 5-day itinerary for the better first Kyoto experience.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Croatia in June.jpg ",
          label: "Croatia in June",
          sublabel: "Croatia · Timing",
          description: "Sail Croatia before summer crowds.",
          prompt:
            "I want to plan a Croatia sailing trip and choose between June and August. Compare crowds, sailing conditions, charter prices, and overall atmosphere. Then build the ideal 7-day Split-to-Dubrovnik sailing itinerary with the best overnight stops and experiences.",
        },
      ],
    },
    {
      heading: "For Every Kind of Luxury Traveller",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/The Honeymoon Everyone Dreams About.jpg ",
          label: "The Honeymoon Everyone Dreams About",
          sublabel: "Romantic · Premium",
          description: "The trip people remember forever.",
          prompt:
            "I want to plan a luxury honeymoon that feels unforgettable in every way. Help me choose between Santorini, Amalfi Coast, or Kyoto based on privacy, food, and atmosphere, then build the ideal 10-night itinerary with exceptional stays, key experiences, and what to reserve first.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Art, History & Exceptional Stays.jpg ",
          label: "Art, History & Exceptional Stays",
          sublabel: "Premium · Art and History",
          description: "The best hotel. The real history.",
          prompt:
            "I want a premium trip that combines beautiful stays with meaningful cultural experiences. Compare destinations like Kyoto, Amalfi Coast, and the Loire Valley, then build a 10-night itinerary with the right hotels, immersive experiences, and thoughtful pacing.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/The Adventure Version of Premium Travel.jpg ",
          label: "The Adventure Version of Premium Travel",
          sublabel: "Premium · Active",
          description: "Wild days. Five-star nights.",
          prompt:
            "I want a trip that feels adventurous during the day but exceptional every night. Compare Croatia sailing, Lapland northern lights, and Kenya safari experiences, then build the ideal 10-night itinerary with stays, structure, and realistic pricing.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Ocean Views & Empty Calendars.jpg ",
          label: "Ocean Views & Empty Calendars",
          sublabel: "Beach · Total Rest",
          description: "Private villas, slow days, zero effort.",
          prompt:
            "I want a beach trip focused on privacy, calm water, great food, and effortless luxury. Compare Koh Samui, Bali, and the Maldives, then build the perfect 7-night itinerary with the right stay, worthwhile experiences, and realistic total costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/The Perfect Trip for Four.png ",
          label: "The Perfect Trip for Four",
          sublabel: "Group · Premium",
          description: "Four people. One exceptional trip.",
          prompt:
            "I want to plan a premium trip for two couples with both privacy and shared experiences. Compare options like Amalfi villas, Croatia sailing charters, and Kyoto ryokans, then build the ideal 8-night itinerary with the right property, pacing, and pricing.",
        },
      ],
    },
    {
      heading: "Experiences Only Available at This Level",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Kyoto Ryokan After Dark.jpg ",
          label: "Kyoto Ryokan After Dark",
          tags: "Japan · Cultural",
          description: "Private baths & quiet nights.",
          prompt:
            "I want to stay at a Kyoto ryokan with a truly private onsen experience. Compare the best ryokans for reserved baths, explain the etiquette, which rooms are worth booking, realistic 2-night costs, and how early reservations open.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi by Private Catamaran.jpg ",
          label: "Amalfi by Private Catamaran",
          tags: "Italy · Coastal",
          description: "Sea caves beyond the ferry routes.",
          prompt:
            "I want to charter a private boat on the Amalfi Coast for swimming, sea caves, and a waterside lunch. Compare departures from Positano vs Praiano, ideal boat sizes for 2–4 people, realistic pricing, and how to fit it into a perfect 4-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland Under The Aurora.jpg ",
          label: "Lapland Under The Aurora",
          tags: "Finland · Arctic",
          description: "Glass igloos beneath Arctic skies.",
          prompt:
            "I want to stay in a Finnish Lapland glass igloo and watch the northern lights from bed. Compare the best igloo resorts, best aurora months, realistic costs, and build the ideal itinerary with husky safaris and snowmobile experiences.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Yacht Dinner -- French Riviera Sunset.jpg ",
          label: "Yacht Dinner — French Riviera Sunset",
          tags: "France · Luxury",
          description: "Champagne evenings on open water.",
          prompt:
            "I want to charter a private yacht on the French Riviera for a sunset dinner with champagne and coastal views. Compare routes from Nice, Antibes, and Monaco, realistic charter costs, yacht sizes for 2–6 people, and how to build it into a 4-night Riviera trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Private Villa -- Hvar Island, Croatia.jpg ",
          label: "Private Villa — Hvar Island, Croatia",
          tags: "Croatia · Exclusive",
          description: "A private island stay with staff.",
          prompt:
            "I want to rent a private villa on Hvar Island with sea views and full service for 4–6 people. Compare hillside vs waterfront villas, realistic weekly costs, best months to visit, and how to fit Hvar into a larger Croatia itinerary.",
        },
      ],
    },
  ],
  travellerStories: internationalLuxuryTravellerStories,
};

const InternationalLuxuryThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={internationalLuxuryThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(InternationalLuxuryThemePage);
