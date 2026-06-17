// pages/theme/greece-islands-done-right.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import greeceTravellerStories from "../../data/greeceTravellerStories";

const greeceThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Greece is a big decision. Let's make it an easy one.",
    promptChips: [
      {
        icon: "🌅",
        label: "Is Santorini actually worth the hype?",
        prompt:
          "I'm planning an 11-day Greece trip and can dedicate 3 nights to Santorini. Tell me honestly if it's worth the cost and crowds, or if another island offers a better experience. Then build the best itinerary based on your recommendation.",
      },
      {
        icon: "💶",
        label: "I have Rs 1.8 lakh — what does Greece actually get me?",
        prompt:
          "Plan an 8-day Greece trip for ₹1.8 lakh per person, including flights from India. Show what's realistically possible, which islands offer the best value, and create a complete itinerary with stays, transport, and daily experiences.",
      },
      {
        icon: "🗺️",
        label: "Build me a doable 10-day Greece itinerary",
        prompt:
          "Create a seamless 10-day Greece itinerary with Athens and the best island combination. Prioritize smooth connections, minimal travel time, and a relaxed pace, then map out the trip day by day.",
      },
      {
        icon: "💍",
        label: "Plan a romantic Greece trip for 2",
        prompt:
          "Design an 11–12 day Greece trip for a couple focused on romance, sunsets, great food, beautiful hotels, and slow travel. Recommend the ideal route, best islands, and a complete day-by-day itinerary.",
      },
    ],
  },
  rows: [
    {
      heading: "From the Acropolis to the Aegean",
      icon: "🏛️",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Athens.jpg",
          label: "Athens — Ruins and Rooftops",
          tags: "History · City",
          description: "2,500 years. Still buzzing.",
          prompt:
            "Show me how to spend 3 perfect days in Athens—covering ancient landmarks, great neighborhoods, rooftop dining, local culture, and the experiences most visitors miss.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Santorini.jpg",
          label: "Santorini — Blue Domes, Real Story",
          tags: "Scenic · Romantic",
          description: "The photo is real. Book early.",
          prompt:
            "Help me plan 3 unforgettable nights in Santorini. Where should I stay, what is actually worth doing, and how can I experience the island beyond the famous photos?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Crete.jpg",
          label: "Crete — More Than a Beach",
          tags: "Culture · Beach",
          description: "Biggest island. Wildly underrated.",
          prompt:
            "Build me the ideal 4-day Crete itinerary with historic sites, stunning beaches, local food, scenic towns, and the best way to experience the island like a traveler, not a tourist.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Meteora.jpg",
          label: "Meteora — Monasteries on Cliffs",
          tags: "UNESCO · Spiritual",
          description: "Built on nothing. Literally.",
          prompt:
            "Help me understand and explore Meteora in 2 days—covering the most impressive monasteries, viewpoints, history, and the smartest way to visit from Athens.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Mykonos.jpg",
          label: "Mykonos — Beyond the Party",
          tags: "Beach · Nightlife",
          description: "The calm side of Mykonos.",
          prompt:
            "I want to experience the beautiful side of Mykonos, not the party scene. Plan 2 memorable days and tell me if Mykonos is truly worth it compared to Paros or Naxos.",
        },
      ],
    },
    {
      heading: "Greece Right Now",
      icon: "🇬🇷",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Easter in Greece.png",
          label: "Easter in Greece — Nothing Like It",
          sublabel: "April–May · Bigger than Christmas",
          description: "Bigger than Christmas.",
          prompt:
            "Plan a Greece trip around Orthodox Easter. Show me the best place to experience the celebrations, how many days I need, where to stay, and how to build the rest of my itinerary around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Epidaurus.png",
          label: "Epidaurus — The Original Theatre",
          sublabel: "June–August · 2,400 years old",
          description: "2,400 years old.",
          prompt:
            "Help me experience a performance at Epidaurus. Explain what makes it special and build a short itinerary that combines it with Nafplio and Mycenae.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Thessaloniki.jpg",
          label: "Thessaloniki — Where Greeks Holiday",
          sublabel: "Year-Round · More food per street",
          description: "More food per street.",
          prompt:
            "Plan 2 days in Thessaloniki focused on great food, local culture, historic landmarks, and the best way to combine it with a wider mainland Greece trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Hydra.jpg",
          label: "Hydra — No Cars. Just Donkeys.",
          sublabel: "90 minutes from Athens",
          description: "90 minutes from Athens.",
          prompt:
            "Is Hydra worth 2 nights? Show me what a stay on this car-free island looks like, what to do, where to swim, and whether it works better as an overnight stay or day trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Delphi.jpg",
          label: "Delphi — Where Gods Were Consulted",
          sublabel: "Day Trip · The centre of the ancient world",
          description: "The centre of the ancient world.",
          prompt:
            "Help me visit Delphi the right way. Explain its history, the must-see highlights, and how to fit it into a mainland Greece itinerary with Athens or Meteora.",
        },
      ],
    },
    {
      heading: "TTW's Greece Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Classic Greek Islands.jpg",
          label: "Classic Greek Islands",
          sublabel: "Islands · Scenic",
          description: "Santorini. Crete. One more.",
          prompt:
            "Plan the perfect 10-day Greek islands trip with Santorini, Crete, and one more island. Recommend the best route, ferry connections, day-by-day itinerary, and realistic mid-range costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece With Kids.png",
          label: "Greece With Kids",
          sublabel: "Family · Islands",
          description: "Ruins, beaches, feta.",
          prompt:
            "Build a family-friendly 10-day Greece itinerary with the best islands, beaches, ancient sites, and travel pace for children aged 8–13. Include accommodation advice, daily plans, and costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Honeymoon in Greece.png",
          label: "Honeymoon in Greece",
          sublabel: "Romantic · Luxury",
          description: "Blue domes. No crowds.",
          prompt:
            "Design an 11-day Greece honeymoon combining iconic Santorini with a quieter romantic island. Include luxury stays, special experiences, dining recommendations, and a complete itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece Under Rs 1.8 Lakh Per Person.jpg",
          label: "Greece Under Rs 1.8 Lakh Per Person",
          sublabel: "Budget · Islands",
          description: "Aegean, minus the bill.",
          prompt:
            "Plan a 7-day Greece trip under ₹1.8 lakh per person including flights. Recommend the best-value destinations, realistic hotels, transport, and a complete day-by-day itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece Mainland.png",
          label: "Greece Mainland — Ancient Greek Journey",
          sublabel: "History · Culture",
          description: "Before the islands existed.",
          prompt:
            "Create a 10-day mainland Greece itinerary focused on Athens, Delphi, Meteora, Mycenae, Epidaurus, and Nafplio. Include transport, daily plans, and the key stories behind each site.",
        },
      ],
    },
    {
      heading: "Only in Greece — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Acropolis.jpg",
          label: "Acropolis — 8am, No One Else",
          tags: "History · Athens",
          description: "You and the Parthenon.",
          prompt:
            "Show me how to experience the Acropolis before the crowds. Build the perfect morning, explain what makes the Parthenon special, and help me fit the Acropolis Museum into the day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Catamaran.jpg",
          label: "Catamaran — Santorini From the Sea",
          tags: "Luxury · Santorini",
          description: "Better from the water.",
          prompt:
            "Plan the ultimate Santorini catamaran experience. Compare private vs shared cruises, highlight the best stops, costs, and timing, and show where it fits into a 3-night stay.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Samaria Gorge.png",
          label: "Samaria Gorge — Hike, Then Beach",
          tags: "Hiking · Crete",
          description: "16km. Worth every step.",
          prompt:
            "Help me tackle the Samaria Gorge. Explain the hike, fitness level required, logistics, what to pack, and how to fit it into a relaxed 4-day Crete itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Cook Greek — In a Local Home.png",
          label: "Cook Greek — In a Local Home",
          tags: "Food · Cultural",
          description: "A Greek grandmother's kitchen.",
          prompt:
            "Find me an authentic Greek cooking experience with locals. Explain what I'll learn, where to do it, what it costs, and how to build a full food-focused day around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Sail the Cyclades — Your Own Route.png",
          label: "Sail the Cyclades — Your Own Route",
          tags: "Sailing · Islands",
          description: "New island every morning.",
          prompt:
            "Help me plan a week-long Cyclades sailing adventure. Recommend the best islands, costs, sailing route, and whether chartering a boat beats traditional island hopping.",
        },
      ],
    },
  ],
  travellerStories: greeceTravellerStories,
};

const GreeceIslandsDoneRightThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={greeceThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(GreeceIslandsDoneRightThemePage);
