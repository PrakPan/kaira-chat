// pages/theme/spain-sun-stone-sangria.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import spainTravellerStories from "../../data/spainTravellerStories";

const spainThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Where food is social and nights stay young. Let's plan yours.",
    promptChips: [
      {
        icon: "🏛️",
        label: "Barcelona or Madrid — which city do I actually start with?",
        prompt:
          "Help me choose between Barcelona and Madrid. Compare the vibe, food, culture, attractions, and nightlife, then recommend the best route for a 12-day Spain trip.",
      },
      {
        icon: "📅",
        label: "What's the best time of year to visit Spain from India?",
        prompt:
          "Show me the best time to visit Spain based on weather, crowds, festivals, and budget. Help me choose the ideal travel window for the experience I want.",
      },
      {
        icon: "💶",
        label: "Spain on Rs 2.5 lakh per person",
        prompt:
          "Plan a realistic 10-day Spain trip for ₹2.5 lakh per person including flights. Show what this budget covers, where to splurge, where to save, and build the ideal itinerary.",
      },
      {
        icon: "💃",
        label: "I want Flamenco, Alhambra, Seville, and tapas",
        prompt:
          "Build me the ultimate Andalusia itinerary with Seville, Granada, Cordoba, Flamenco, tapas culture, and the Alhambra. Include the best route, timing, and local experiences.",
      },
    ],
  },
  rows: [
    {
      heading: "From Gaudí to the Alhambra",
      icon: "🏛️",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Barcelona — Gaudí and the Good Life.jpg ",
          
          label: "Barcelona — Gaudí and the Good Life",
          tags: "City · First Timer",
          description: "Dinner starts at 10pm. Always.",
          prompt:
            "Plan 4 perfect days in Barcelona covering Gaudí's masterpieces, local food culture, hidden neighbourhoods, markets, beaches, and the experiences worth booking in advance.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Seville — Spain's Most Passionate City.jpg ",
          label: "Seville — Spain's Most Passionate City",
          tags: "Culture · Flamenco",
          description: "Feel where flamenco began.",
          prompt:
            "Help me experience the real Seville through Flamenco, tapas, historic landmarks, and local neighbourhoods. Build the ideal 3-day itinerary and explain the best time to visit.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Granada — Home of the Alhambra.jpg ",
          label: "Granada — Home of the Alhambra",
          tags: "History · UNESCO",
          description: "One palace. Worth the wait.",
          prompt:
            "Plan 2 unforgettable days in Granada with the Alhambra, Albaicín, Sacromonte, and Moorish heritage. Include ticket strategy, local experiences, and travel logistics.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/San Sebastián — World's Best Food City.jpg ",
          label: "San Sebastián — World's Best Food City",
          tags: "Food · Basque Country",
          description: "More Michelin stars per block.",
          prompt:
            "Design a 2–3 day San Sebastián itinerary focused on pintxos, Basque culture, coastal scenery, and whether a Michelin-starred meal is worth adding.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Camino de Santiago — Walk It.jpg ",
          label: "Camino de Santiago — Walk It",
          tags: "Adventure · Pilgrimage",
          description: "500km. Most do the last 100.",
          prompt:
            "Help me plan a Camino de Santiago experience. Recommend the best route for a first-timer, what to expect on the trail, when to go, what to pack, and how to fit it into a Spain trip.",
        },
      ],
    },
    {
      heading: "Spain Right Now",
      icon: "🎉",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/La Tomatina — Buñol, August.png ",
          label: "La Tomatina — Buñol, August",
          sublabel: "Hotels near Buñol: book by April",
          description: "Spain's wildest 90 minutes.",
          prompt:
            "Help me plan a Spain trip around La Tomatina. Cover tickets, logistics, where to stay, what to expect on the day, and how to build it into a wider itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Running of the Bulls — Pamplona, July.png ",
          label: "Running of the Bulls — Pamplona, July",
          sublabel: "You don't have to run. Watching works.",
          description: "Eight mornings. One legendary city.",
          prompt:
            "Guide me through the San Fermín festival and Running of the Bulls. Explain the experience, viewing options, accommodation strategy, and how to combine it with northern Spain.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Semana Santa — Seville, Holy Week.png ",
          label: "Semana Santa — Seville, Holy Week",
          sublabel: "March–April · Nothing prepares you",
          description: "Processions through the night.",
          prompt:
            "Show me how to experience Semana Santa in Seville or Málaga. Explain the traditions, best viewing spots, key days, and how to plan a trip around this iconic event.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Feria de Abril — Seville Dances Again.png ",
          label: "Feria de Abril — Seville Dances Again",
          sublabel: "April–May · Sherry at noon",
          description: "A week the city dresses up.",
          prompt:
            "Help me experience Seville's Feria de Abril. Cover the traditions, dress code, casetas, best times to visit, and how to combine it with an Andalusia itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Primavera Sound — Barcelona, June.png ",
          label: "Primavera Sound — Barcelona, June",
          sublabel: "The reason Europe flies to Barcelona",
          description: "Barcelona's biggest music week.",
          prompt:
            "Plan a Spain trip around Barcelona's music festivals. Compare Primavera Sound and Sónar, explain tickets and accommodation, and show how to fit them into a wider itinerary.",
        },
      ],
    },
    {
      heading: "TTW's Spain Themes",
      icon: "🎯",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Classic Andalusia.jpg ",
          label: "Classic Andalusia",
          sublabel: "Culture · South Spain",
          description: "Flamenco. Alhambra. Tapas.",
          prompt:
            "Plan the ultimate 10-day Andalusia trip through Seville, Granada, Córdoba, and Jerez. Include Flamenco, the Alhambra, white villages, great food, ideal stays, and realistic costs from India.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Spain With Kids.png ",
          label: "Spain With Kids",
          sublabel: "Family · City + Beach",
          description: "Gaudí, beaches, churros.",
          prompt:
            "Build a family-friendly 10-day Spain itinerary with the best cities, beaches, attractions, accommodation, and travel pace for children aged 7–12.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Honeymoon in Spain.png ",
          label: "Honeymoon in Spain",
          sublabel: "Romantic · City + Countryside",
          description: "Rooftops, alleys, no agenda.",
          prompt:
            "Design a romantic 12-day Spain honeymoon with boutique hotels, Flamenco, Andalusia, Barcelona, unforgettable dining, and the perfect mix of planned highlights and free time.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Spain Under Rs 2.5 Lakh Per Person.jpg ",
          label: "Spain Under Rs 2.5 Lakh Per Person",
          sublabel: "Budget · All Regions",
          description: "Big trip. Smaller budget.",
          prompt:
            "Plan a realistic 10–12 day Spain trip under ₹2.5 lakh per person including flights. Show where to save, where to splurge, and build the best-value itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Road Trip Across Spain.png ",
          label: "Road Trip Across Spain",
          sublabel: "Adventure · Self-Drive",
          description: "One car. No fixed plan.",
          prompt:
            "Plan an 11-day Spain road trip with the best driving route, scenic stops, rental costs, and experiences that are impossible to reach by train.",
        },
      ],
    },
    {
      heading: "Only in Spain — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Alhambra — Before the Crowds Arrive.jpg ",
          label: "Alhambra — Before the Crowds Arrive",
          tags: "History · Granada",
          description: "Book 3 months out. No exceptions.",
          prompt:
            "Help me experience the Alhambra properly. Explain the best entry times, ticket strategy, must-see sections, and how to plan the perfect visit around my travel dates.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Pintxos Crawl — San Sebastián After Dark.png ",
          label: "Pintxos Crawl — San Sebastián After Dark",
          tags: "Food · Basque",
          description: "Different bar every 20 minutes.",
          prompt:
            "Guide me through an authentic San Sebastián pintxos crawl. Show me where to go, what to order, how the culture works, and how to plan the perfect evening.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Real Flamenco — Andalusia’s True Show.png ",
          label: "Real Flamenco — Andalusia's True Show",
          tags: "Culture · Andalusia",
          description: "Where flamenco was born.",
          prompt:
            "Help me find genuine Flamenco in Andalusia. Explain what makes it authentic, where to experience it, and how to choose the right venue for my trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Rioja — Spain’s Famous Wine Region.jpg ",
          label: "Rioja — Spain's Famous Wine Region",
          tags: "Wine · Northern Spain",
          description: "Spain's best-known wine country.",
          prompt:
            "Plan a Rioja wine escape with top wineries, tastings, local food, and the best way to combine it with a Basque Country itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Sleep in a Parador — A Castle Bedroom.png ",
          label: "Sleep in a Parador — A Castle Bedroom",
          tags: "Heritage · Unique Stay",
          description: "15th-century castle. Your room tonight.",
          prompt:
            "Help me choose the perfect Parador in Spain. Compare the best historic properties, what makes them special, and which one fits my itinerary best.",
        },
      ],
    },
  ],
  travellerStories: spainTravellerStories,
};

const SpainSunStoneSangriaThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={spainThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(SpainSunStoneSangriaThemePage);
