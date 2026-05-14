// pages/theme/kaira-honeymoon.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import kairaHoneymoonTravellerStories from "../../data/kairaHoneymoonTravellerStories";

const kairaHoneymoonThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Tell us your dream honeymoon and we'll plan it.",
    promptChips: [
      {
        icon: "💍",
        label: "Plan the most romantic honeymoon in India",
        prompt:
          "We want a romantic honeymoon within India that still feels unforgettable. Help us choose between Rajasthan, Kerala, and the Andamans based on romance, season, experiences worth paying for, and which destination feels the most special for the budget.",
      },
      {
        icon: "✈️",
        label: "Best international honeymoon under Rs 1.5 lakh each",
        prompt:
          "We have a honeymoon budget of Rs 1.5 lakh per person including flights from India. Tell us which destinations — Thailand, Bali, Vietnam, or Malaysia — genuinely work at this budget, what the experience actually feels like, and whether it is worth going international or staying domestic.",
      },
      {
        icon: "✨",
        label: "I want the luxury honeymoon everyone talks about",
        prompt:
          "We want a luxury honeymoon that feels unforgettable, not just expensive. Help us choose between the Maldives, Santorini, Amalfi Coast, and Europe, then build the ideal itinerary with the right splurges, experiences worth pre-booking, and what actually justifies the luxury price tag.",
      },
      {
        icon: "🌅",
        label: "What is the most breathtaking honeymoon destination right now?",
        prompt:
          "We want the most visually breathtaking honeymoon possible — somewhere that genuinely feels magical in person. Help us choose between places like Santorini, Kyoto, Amalfi Coast, and the Maldives based on season, beauty, and the experiences that create unforgettable memories beyond just photos.",
      },
    ],
  },
  rows: [
    {
      heading: "The World's Most Iconic Honeymoon Destinations",
      icon: "🌍",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Paris, France — The City That Invented Romance.jpg ",
          label: "Paris, France — The City That Invented Romance",
          tags: "Art and Culture · Iconic",
          description: "Every corner is a love letter.",
          prompt:
            "I want to plan 5 romantic nights in Paris without rushing the experience. Build a day-by-day itinerary covering the Eiffel Tower at dusk, a Seine dinner cruise, Montmartre at sunrise, and the right day trip, while also helping us choose the best area to stay and the one dinner worth booking in advance.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Santorini, Greece — Caldera, Caves & Champagne.jpg ",
          label: "Santorini, Greece — Caldera, Caves & Champagne",
          tags: "Scenic · Very Popular",
          description: "The sunset nobody stops talking about.",
          prompt:
            "I want to plan a Santorini honeymoon properly, not like a rushed tourist trip. Help us choose between Oia, Fira, and Imerovigli, decide whether cave hotels are worth it, and build the perfect stay with sunsets, a catamaran cruise, a wine tour, and the best months for fewer crowds.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Amalfi Coast, Italy — Clifftop Villages and Sea Drives.jpg ",
          label: "Amalfi Coast, Italy — Clifftop Villages and Sea Drives",
          tags: "Romantic · Heritage",
          description: "The drive alone will change you.",
          prompt:
            "I want to plan an Amalfi Coast honeymoon that feels smooth and romantic rather than stressful. Build the ideal split between Positano, Ravello, and Amalfi, including whether a private boat day is worth it, the best sea-view restaurants, and whether to add Naples or Rome before or after.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Kyoto & Tokyo — Autumn Romance.jpg ",
          label: "Japan — Kyoto and Tokyo in Autumn",
          tags: "Heritage · Art and Culture",
          description: "Romance under crimson leaves.",
          prompt:
            "I want to experience Japan in autumn without the trip feeling rushed or checklist-driven. Build a romantic itinerary covering Kyoto and Tokyo, including a ryokan stay, autumn foliage spots, Kyoto at dawn, and how to make the shinkansen experience feel easy and seamless.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Maldives — The Overwater Villa Fantasy.jpg ",
          label: "Maldives — Beyond the Instagram Honeymoon",
          tags: "Luxury · Beach",
          description: "A private island, just for two.",
          prompt:
            "I want to understand what a Maldives honeymoon actually feels like beyond the Instagram photos. Explain the real difference between budget, mid-range, and luxury villas, which atolls offer the best value, and build the ideal stay with snorkelling, spa time, sandbanks, and sunset experiences.",
        },
      ],
    },
    {
      heading: "Honeymoon in India",
      icon: "🇮🇳",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Rajasthan — Palaces, Deserts and Royal Nights.jpg ",
          label: "Rajasthan — Palaces, Deserts and Royal Nights",
          tags: "Heritage · Luxury",
          description: "Sleep where the maharajas slept.",
          prompt:
            "I want a Rajasthan honeymoon that feels royal rather than touristy. Build an 8-night itinerary across Udaipur, Jodhpur, and Jaisalmer with the right palace stays, desert experiences, romantic dinners, and the smoothest way to travel between cities.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Kerala — Backwaters, Tea Hills and a Private Houseboat.jpg ",
          label: "Kerala — Backwaters, and a Private Houseboat",
          tags: "Nature · Romantic",
          description: "Your own boat. Your own pace.",
          prompt:
            "I want a Kerala honeymoon covering the backwaters, Munnar, and a beach escape. Build a romantic 7-night itinerary with the right houseboat experience, scenic stays, the best route through Kerala, and what kind of budget actually makes the trip feel special.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Andaman Islands — Private Beaches and Still Blue Water.jpg ",
          label: "Andaman Islands — Private Beaches and Still Blue Water",
          tags: "Beach · Tropical",
          description: "The kind of blue you don't believe is real.",
          prompt:
            "I want to plan an Andaman honeymoon beyond the usual Port Blair itinerary. Build a 7-night trip around Havelock and Neil Island with the best beach areas, romantic resorts, island experiences worth doing, and the easiest way to travel between islands.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Kashmir — Dal Lake, Meadows and a Shikara at Dawn.jpg ",
          label: "Kashmir — Dal Lake, Meadows and a Shikara at Dawn",
          tags: "Scenic · Romantic",
          description: "The most beautiful place in India.",
          prompt:
            "I want a Kashmir honeymoon that feels peaceful and scenic rather than rushed and tourist-heavy. Build a romantic itinerary covering Srinagar, Gulmarg, and either Pahalgam or Sonamarg, including the right houseboat stay, mountain views, best season, and how to experience Kashmir slowly.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Pondicherry — French Quarters and Quiet Beaches.jpg ",
          label: "Pondicherry — French Quarters and Quiet Beaches",
          tags: "Heritage · Coastal · Romantic · Domestic",
          description: "Europe-in-India and the sea right after.",
          prompt:
            "I want a Pondicherry honeymoon that feels slow, romantic, and coastal. Build a 5-night itinerary covering the French Quarter, Auroville, and a beach stay, including the best boutique hotels, quiet cafés, nearby coastal extensions, and the best season to visit.",
        },
      ],
    },
    {
      heading: "Honeymoon Right Now",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Bali — Beyond the Honeymoon Clichés.jpg ",
          label: "Bali — Beyond the Honeymoon Clichés",
          tags: "Romance · Luxury",
          description: "Amazing stays and unforgettable evenings.",
          prompt:
            "I want a romantic Bali trip that feels personal rather than touristy. Build a 7-day itinerary with private villas, jungle stays, beach sunsets, spa experiences, and the best areas in Bali for couples.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/France and Italy in One Trip.jpg ",
          label: "France and Italy in One Trip",
          tags: "Romantic · Multi-City",
          description: "Two countries, one love story.",
          prompt:
            "I want to plan a romantic France and Italy honeymoon in 12 nights. Help us split the trip between Paris, Provence, Florence, or the Amalfi Coast with the right transport, stay style, and unforgettable experiences worth booking early.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Budapest, Vienna and Prague — Central Europe.jpg ",
          label: "Budapest, Vienna and Prague — Central Europe",
          tags: "Romantic · Budget-Friendly",
          description: "Candlelit cities where history is still alive.",
          prompt:
            "I want to plan a romantic Central Europe honeymoon across Budapest, Vienna, and Prague. Build the ideal route with beautiful train journeys, romantic experiences in each city, and which destination feels the most magical for couples.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Kenya — Great Migration Safari Honeymoon.jpg ",
          label: "Kenya — Great Migration Safari Honeymoon",
          tags: "Adventure · Wildlife",
          description: "The most romantic wilderness on earth.",
          prompt:
            "I want to plan a Kenya honeymoon around the Great Migration in the Masai Mara. Build a romantic safari itinerary with the best migration season, lodge experiences worth splurging on, and whether to add Zanzibar or Lake Nakuru.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Vietnam — Ha Long Bay and Hoi An.jpg ",
          label: "Vietnam — Ha Long Bay and Hoi An",
          tags: "Scenic · Off-Beat",
          description: "The kind of beauty that doesn't feel real.",
          prompt:
            "I want to plan a Vietnam honeymoon around Ha Long Bay and Hoi An. Build a romantic itinerary with the right cruise experience, lantern-lit evenings, cultural experiences, and the best season for clear skies.",
        },
      ],
    },
    {
      heading: "TTW's Honeymoon Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Greece — Santorini and Mykonos.jpg ",
          label: "Greece — Santorini and Mykonos",
          tags: "Romantic · Island Hopping",
          description: "Two islands. Two kinds of perfect.",
          prompt:
            "I want to island-hop between Santorini and Mykonos without the trip feeling rushed. Build a romantic itinerary with the right split, best areas to stay, sunset experiences, and how to enjoy Mykonos beyond the party scene.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Thailand — Phuket, Krabi and the Islands.jpg ",
          label: "Thailand — Phuket, Krabi and the Islands",
          tags: "Budget-Friendly · Romantic",
          description: "Island sunsets and longtail boat mornings.",
          prompt:
            "I want a Thailand honeymoon that balances romance, beaches, and island experiences. Build a 9-day itinerary covering Phuket and Krabi with the best beach areas, boat trips, sunset spots, and the right season for clear water.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Malaysia — Langkawi and Kuala Lumpur.jpg ",
          label: "Malaysia — Langkawi and Kuala Lumpur",
          tags: "Beach · Southeast Asia",
          description: "Rainforest, beach, and city lights in one trip.",
          prompt:
            "I want to combine Langkawi and Kuala Lumpur for a romantic honeymoon. Build an 8-night itinerary with the best beaches, city experiences, rooftop dining, and whether Malaysia works best as a standalone trip or part of Southeast Asia.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Spain — Barcelona and Andalusia.jpg ",
          label: "Spain — Barcelona and Andalusia",
          tags: "Culture · Beach",
          description: "Flamenco nights and golden Spanish streets.",
          prompt:
            "I want to plan a romantic Spain honeymoon across Barcelona and Andalusia. Build the ideal route with beautiful stays, flamenco evenings, authentic tapas spots, and the experiences that make southern Spain feel magical.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Australia — Sydney and the South.jpg ",
          label: "Australia — Sydney and the South",
          tags: "Luxury · Adventure",
          description: "Harbour sunsets and wine country escapes.",
          prompt:
            "I want to plan an Australia honeymoon covering Sydney and a scenic southern escape. Build a romantic itinerary with harbour experiences, coastal drives or wine regions, the best spring season, and the right balance between luxury and adventure.",
        },
      ],
    },
    {
      heading: "Only on Your Honeymoon — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Sunset Dinner at the Eiffel Tower — Paris.png ",
          label: "Sunset Dinner at the Eiffel Tower — Paris",
          tags: "Iconic · Paris",
          description: "One evening. Every cliche earns it.",
          prompt:
            "I want to plan the perfect romantic Paris evening around the Eiffel Tower. Tell me the best dinner spots, viewpoints for the light show, whether the summit is worth it, and how to end the night beautifully by the Seine.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Ryokan Stay in Kyoto — The Full Experience.jpg ",
          label: "Ryokan Stay in Kyoto — The Full Experience",
          tags: "Cultural · Japan",
          description: "An inn that turns sleep into ceremony.",
          prompt:
            "I want to experience a traditional ryokan stay in Kyoto for our honeymoon. Help us choose the right ryokan, understand the onsen and kaiseki experience, and decide whether one or two nights is worth it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Bioluminescent Plankton Night — Maldives.png ",
          label: "Bioluminescent Plankton Night — Maldives",
          tags: "Maldives · Night",
          description: "The ocean glows under your feet at midnight.",
          prompt:
            "I want to experience the glowing bioluminescent beaches in the Maldives on our honeymoon. Tell me the best islands and season for it, plus how to combine it with snorkelling, sandbanks, and an overwater villa stay.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Private Desert Dinner Under the Stars — Rajasthan.png ",
          label: "Private Desert Dinner Under the Stars — Rajasthan",
          tags: "India · Heritage",
          description: "A royal table in the middle of nowhere.",
          prompt:
            "I want a romantic private dinner in the Thar Desert with lanterns, music, and stargazing. Tell me the best setup in Rajasthan, whether to base ourselves in Jaisalmer or Jodhpur, and how to build the honeymoon around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/honeymoon-theme-2026/Catamaran Sunset Cruise — Santorini Caldera.png ",
          label: "Catamaran Sunset Cruise — Santorini Caldera",
          tags: "Romantic · Scenic",
          description: "The water reflects gold. So does everything else.",
          prompt:
            "I want to do a Santorini catamaran sunset cruise properly. Explain the difference between private and group cruises, the best caldera route, and how to combine the sailing experience with the famous Oia sunset.",
        },
      ],
    },
  ],
  travellerStories: kairaHoneymoonTravellerStories,
};

const KairaHoneymoonThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={kairaHoneymoonThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(KairaHoneymoonThemePage);
