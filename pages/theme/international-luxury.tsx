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
          "Compare Santorini, the Maldives, Kyoto, and the Amalfi Coast, and tell me which is best for my honeymoon. Then build a 10–12 night luxury itinerary around it.",
      },
      {
        icon: "💰",
        label: "What does a premium international trip really cost from India?",
        prompt:
          "Compare the real cost of luxury travel in Santorini, Koh Samui, and the Amalfi Coast. Show me what premium hotels, flights, and experiences actually cost.",
      },
      {
        icon: "✨",
        label: "I want something rare — not the usual bucket-list trip",
        prompt:
          "Compare unique trips like Lapland aurora cabins, Croatia sailing, and Kyoto ryokans. Tell me which is most special, what it costs, and when to book.",
      },
      {
        icon: "🥂",
        label: "Build me a dream trip for two — ₹5 lakh per person",
        prompt:
          "Compare destinations like Japan, Greece, Bali, and Vietnam for my budget. Then build the best possible premium itinerary for two.",
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
            "I want to experience Santorini from a private cave suite overlooking the caldera. Help me choose the right area and plan the perfect 3-night escape.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi & Capri by Private Boat.jpg",
          label: "Amalfi & Capri by Private Boat",
          tags: "Italy · Premium",
          description: "The coast, without the crowds.",
          prompt:
            "Show me the most elegant way to experience Amalfi Coast and Capri. Plan a 4-night itinerary with private boat days, hidden coves, and an unforgettable stay.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/French Riviera -- Nice, Antibes, Monaco.jpg",
          label: "French Riviera — Nice, Antibes, Monaco",
          tags: "France · Glamour",
          description: "The Riviera that money built.",
          prompt:
            "Help me discover the French Riviera beyond the obvious tourist route. Build a refined 4-night itinerary with yacht time, great dining, and the best base to stay in.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Quiet Bali Retreat.jpg",
          label: "Quiet Bali Retreat",
          tags: "Bali · Beach",
          description: "Private Bali done properly.",
          prompt:
            "I want a quieter, more private side of Bali away from the crowds. Design a 6-night luxury escape with beautiful villas and meaningful experiences.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/KohS.jpg ",
          label: "Koh Samui — Private Villa Escape",
          tags: "Thailand · Beach",
          description: "Your villa. Your beach. Your day.",
          prompt:
            "Help me find the best private villa experience in Koh Samui. Plan a 5-night stay with island-hopping, spa days, and memorable beachfront dinners.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland -- Northern Lights, Glass Cabin.jpg",
          label: "Lapland — Northern Lights, Glass Cabin",
          tags: "Finland · Arctic",
          description: "Aurora above. Warm inside.",
          prompt:
            "I want to see the northern lights from a glass-roof cabin in Lapland. Tell me when to go, where to stay, and build the ideal Arctic itinerary.",
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
            "I'm deciding when to visit Santorini for a luxury caldera-view stay. Compare August and September, then build the ideal 3-night itinerary for the better month.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi Coast -- May or October.jpg ",
          label: "Amalfi Coast — May or October",
          sublabel: "Italy · Timing",
          description: "The coast at its best pace.",
          prompt:
            "I want to experience the Amalfi Coast outside peak summer. Help me choose between May and October, then create the perfect 4-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland in September vs December.jpg ",
          label: "Lapland in September vs December",
          sublabel: "Finland · Season",
          description: "Aurora skies or winter magic.",
          prompt:
            "I can't decide between autumn auroras and a snowy winter Lapland trip. Compare September and December, then build the ideal 4-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Kyoto in Spring or Autumn.jpg ",
          label: "Kyoto in Spring or Autumn",
          sublabel: "Japan · Season",
          description: "Two versions of Kyoto, both unforgettable.",
          prompt:
            "I'm choosing between Kyoto's cherry blossom and autumn foliage seasons. Tell me which offers the better first experience and plan a 5-day itinerary around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Croatia in June.jpg ",
          label: "Croatia in June",
          sublabel: "Croatia · Timing",
          description: "Sail Croatia before summer crowds.",
          prompt:
            "I want to sail Croatia at the best possible time. Compare June and August, then create the ideal 7-day Split-to-Dubrovnik sailing itinerary.",
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
            "I'm planning a once-in-a-lifetime honeymoon and can't choose between Santorini, the Amalfi Coast, and Kyoto. Recommend the best fit and build the perfect 10-night itinerary around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Art, History & Exceptional Stays.jpg ",
          label: "Art, History & Exceptional Stays",
          sublabel: "Premium · Art and History",
          description: "The best hotel. The real history.",
          prompt:
            "I want a trip that blends luxury with authentic local culture. Compare Kyoto, the Amalfi Coast, and the Loire Valley, then create the ideal 10-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/The Adventure Version of Premium Travel.jpg ",
          label: "The Adventure Version of Premium Travel",
          sublabel: "Premium · Active",
          description: "Wild days. Five-star nights.",
          prompt:
            "I want adventure-filled days and unforgettable places to stay each night. Compare Croatia sailing, Lapland, and Kenya safari, then build the perfect 10-night trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Ocean Views & Empty Calendars.jpg ",
          label: "Ocean Views & Empty Calendars",
          sublabel: "Beach · Total Rest",
          description: "Private villas, slow days, zero effort.",
          prompt:
            "I'm looking for the perfect luxury beach holiday with privacy, great food, and beautiful water. Help me choose between Koh Samui, Bali, and the Maldives, then plan a 7-night escape.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/The Perfect Trip for Four.png ",
          label: "The Perfect Trip for Four",
          sublabel: "Group · Premium",
          description: "Four people. One exceptional trip.",
          prompt:
            "I'm planning a special trip for two couples and can't decide between Amalfi villas, Croatia sailing, and Kyoto ryokans. Recommend the best fit and build the ideal 8-night itinerary.",
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
            "I want a traditional Kyoto ryokan stay with a private onsen. Recommend the best ryokans and what a 2-night stay really costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Amalfi by Private Catamaran.jpg ",
          label: "Amalfi by Private Catamaran",
          tags: "Italy · Coastal",
          description: "Sea caves beyond the ferry routes.",
          prompt:
            "I want the perfect private boat day on the Amalfi Coast. Help me choose the best departure point and build it into a 4-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Lapland Under The Aurora.jpg ",
          label: "Lapland Under The Aurora",
          tags: "Finland · Arctic",
          description: "Glass igloos beneath Arctic skies.",
          prompt:
            "I want to watch the northern lights from a glass igloo in Finnish Lapland. Recommend the best stays, the ideal time to visit, and build the perfect Arctic itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Yacht Dinner -- French Riviera Sunset.jpg ",
          label: "Yacht Dinner — French Riviera Sunset",
          tags: "France · Luxury",
          description: "Champagne evenings on open water.",
          prompt:
            "I want a private yacht experience on the French Riviera. Help me choose between Nice, Antibes, and Monaco, then build the ideal 4-night trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/vietnam-theme-2026/international-luxury-theme-2026/Private Villa -- Hvar Island, Croatia.jpg ",
          label: "Private Villa — Hvar Island, Croatia",
          tags: "Croatia · Exclusive",
          description: "A private island stay with staff.",
          prompt:
            "I want a private sea-view villa on Hvar Island. Compare the best villa locations and show me how to fit Hvar into a Croatia itinerary.",
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
