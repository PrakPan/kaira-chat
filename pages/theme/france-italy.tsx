// pages/theme/france-italy-grand-european.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import franceItalyTravellerStories from "../../data/franceItalyTravellerStories";

const franceItalyThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "France and Italy. The two countries everyone puts off planning. Not anymore.",
    promptChips: [
      {
        icon: "🗺️",
        label: "Two weeks, France and Italy — how do I split the time?",
        prompt:
          "Help me split 14 days between France and Italy. Build the smartest route, ideal time in each country, and a seamless itinerary without wasting days in transit.",
      },
      {
        icon: "💑",
        label: "Plan a romantic honeymoon across France & Italy",
        prompt:
          "Design a romantic France and Italy honeymoon with beautiful hotels, unforgettable meals, scenic moments, and the perfect balance of splurges and slow travel.",
      },
      {
        icon: "🥐",
        label: "Help me explore France beyond Paris",
        prompt:
          "Show me the best of France beyond Paris. Help me choose between Provence, Loire Valley, Lyon, Bordeaux, and the Riviera, then build the ideal 10-day route.",
      },
      {
        icon: "💶",
        label: "Rs 2 lakh per person — what does France and Italy look like?",
        prompt:
          "What does ₹2 lakh per person actually get me in France and Italy? Build a realistic 10–12 day itinerary with flights, hotels, trains, and smart budget choices.",
      },
    ],
  },
  rows: [
    {
      heading: "The Five Faces of France and Italy",
      icon: "🌍",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Paris — Palaces and Pastries.jpg ",
          label: "Paris — Palaces and Pastries",
          tags: "City · France",
          description: "Classic Paris experience.",
          prompt:
            "Plan 3 perfect days in Paris with iconic landmarks, world-class museums, beautiful walks, and the city's best pastries, all mapped into a smart and efficient itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Loire Valley — Castles & Countryside.jpg ",
          label: "Loire Valley — Castles & Countryside",
          tags: "History · France",
          description: "A calm escape through castles.",
          prompt:
            "Design a relaxing Loire Valley escape with fairytale châteaux, charming towns, scenic countryside, and the ideal 2-night route from Paris.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Rome — The Eternal City.jpg ",
          label: "Rome — The Eternal City",
          tags: "History · Italy",
          description: "Rome beyond just monuments.",
          prompt:
            "Help me experience Rome beyond the highlights with ancient history, local neighbourhoods, great food, and a perfectly paced 3-day itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Amalfi Coast — Sea and Sweat.jpg ",
          label: "Amalfi Coast — Sea and Sweat",
          tags: "Scenic · Italy",
          description: "Adventure with sea views.",
          prompt:
            "Build an active Amalfi Coast itinerary with scenic hikes, coastal swims, ferries, and the best base for exploring the region.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/French Riviera — Coastline Classics.jpg ",
          label: "French Riviera — Coastline Classics",
          tags: "Coastal · France",
          description: "Nice, Antibes, Monaco in 3 days.",
          prompt:
            "Plan 3 beautiful days on the French Riviera with Nice, Antibes, Monaco, stunning coastal views, local food, and effortless day trips.",
        },
      ],
    },
    {
      heading: "France & Italy Right Now",
      icon: "🎐",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Venice —City of Waterways.jpg ",
          label: "Venice — City of Waterways",
          sublabel: "See Venice before the crowds.",
          description: "Italy · Classic",
          prompt:
            "Plan 3 unforgettable days in Venice with crowd-free mornings, iconic landmarks, hidden neighbourhoods, and a perfectly paced Burano and Torcello escape.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Provence — Lavender Window.jpg",
          label: "Provence — Lavender Window",
          sublabel: "Plan around the lavender bloom.",
          description: "France · Seasonal",
          prompt:
            "Build a 3-day Provence trip around lavender season with the best fields, villages, scenic drives, local markets, and timing tips to avoid crowds and catch peak bloom.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Cannes — Film Festival Experience.png ",
          label: "Cannes — Film Festival Experience",
          sublabel: "See the city during its biggest event.",
          description: "France · Festival",
          prompt:
            "Show me how to experience Cannes during the Film Festival as a traveller—what's accessible, where to stay nearby, how to move around, and how to soak in the Riviera atmosphere.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Bologna — Food & City Culture.jpg ",
          label: "Bologna — Food & City Culture",
          sublabel: "Italy's most serious food city.",
          description: "Italy · Food",
          prompt:
            "Plan a 3-day Bologna food journey with authentic trattorias, markets, signature dishes, and a perfect Modena day trip for balsamic and Ferrari culture.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Tour de France.jpg ",
          label: "Tour de France",
          sublabel: "See the world's biggest cycling race.",
          description: "France · Scenic",
          prompt:
            "Help me plan a Tour de France trip around a live stage—how to choose the right stage, where to stay, how early to arrive roadside, and how to combine it with a France itinerary.",
        },
      ],
    },
    {
      heading: "TTW's France & Italy Themes",
      icon: "🎯",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/The Grand Tour -- Done Right.jpg ",
          label: "The Grand Tour — Done Right",
          sublabel: "Both Countries · 14 Days",
          description: "Paris to Rome.",
          prompt:
            "Build a seamless 14-day France to Italy route from Paris to Rome with no backtracking. Include key stopovers, train timings, overnight strategy, bookings, and a realistic mid-range cost.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/France and Italy With Kids.png ",
          label: "France and Italy With Kids",
          sublabel: "Family · Both Countries",
          description: "Less walking. More wonder.",
          prompt:
            "Plan a 12-day France and Italy trip for a family with kids (8–12). Focus on manageable cities, kid-friendly highlights, travel pacing, accommodation, and realistic costs.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Honeymoon — Romance Across Two Countries.png ",
          label: "Honeymoon — Romance Across Two Countries",
          sublabel: "Romantic · Premium",
          description: "Fewer places. Longer stays.",
          prompt:
            "Design a slow 12-day France and Italy honeymoon with Paris, Tuscany, and the Amalfi Coast. Focus on romantic stays, ideal pacing, splurge moments, and where to slow down.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Food & Wine — Best Culinary Journey.jpg",
          label: "Food & Wine — Best Culinary Journey",
          sublabel: "Gastronomy · Both Countries",
          description: "Eat and drink across France & Italy.",
          prompt:
            "Create an 11-day France and Italy food & wine itinerary covering Lyon, Burgundy, Bologna, Modena, and Naples with authentic dining experiences and key bookings.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Italy First — Full Country Itinerary.jpg ",
          label: "Italy First — Full Country Itinerary",
          sublabel: "Italy · Deep Dive",
          description: "10 days. One country. All of it.",
          prompt:
            "Build a 10-day Italy-first itinerary covering Venice, Florence, Rome, and Southern Italy with smart pacing, key trains, must-eat food, and logical routing.",
        },
      ],
    },
    {
      heading: "Only Here — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Versailles — The Royal France Experience.jpg ",
          label: "Versailles — The Royal France Experience",
          tags: "History · France",
          description: "Visit Versailles without the chaos.",
          prompt:
            "Plan a half-day Versailles visit from Paris with early entry, timed access to key rooms, garden timing, and what to prioritise vs skip for a smooth experience.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Périgord — Real Truffle Hunting Experience.png",
          label: "Périgord — Real Truffle Hunting Experience",
          tags: "Food · Southwest France",
          description: "Find truffles with local hunters.",
          prompt:
            "Help me plan a real truffle hunting experience in Périgord with local farmers, explain how it works, and build a 2–3 day itinerary with food and caves.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Bologna — Home Cooking with Locals.jpeg ",
          label: "Bologna — Home Cooking with Locals",
          tags: "Food · Italy",
          description: "Cook tortellini in a real kitchen.",
          prompt:
            "Find an authentic Bologna home-cooking experience making tortellini and ragù with locals, and build a full day around it with food and activities.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Loire Valley — Stay in a Chateau.jpg ",
          label: "Loire Valley — Stay in a Chateau",
          tags: "Heritage · France",
          description: "Sleep inside a real French castle.",
          prompt:
            "Plan a 2-night Loire Valley trip with a real château stay, must-see castles, travel from Paris, and whether a car is needed for the best experience.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Cinque Terre — Hiking Between Villages.jpg ",
          label: "Cinque Terre — Hiking Between Villages",
          tags: "Hiking · Italy",
          description: "Walk all five villages properly.",
          prompt:
            "Design a 2-day Cinque Terre hiking trip covering all five villages with realistic routes, open trails, fitness level, packing, and transport connections.",
        },
      ],
    },
  ],
   travellerStories: franceItalyTravellerStories,
};

const FranceItalyGrandEuropeanThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={franceItalyThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(FranceItalyGrandEuropeanThemePage);
