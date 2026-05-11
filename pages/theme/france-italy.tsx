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
          "I have 14 days for France and Italy and I need to split the time sensibly. I do not want to spend 3 days travelling between places and I do not want to leave either country feeling like I only scratched the surface. Help me decide: how many nights in France versus Italy, which cities in each country genuinely deserve time versus which ones can be done as a day trip, and which single connection point between the two countries makes the routing work without a backtrack. Then build me the day-by-day with honest train or flight times between every stop, what to book before I leave India, and the total cost per person at mid-range.",
      },
      {
        icon: "💑",
        label: "Plan a romantic honeymoon across France & Italy",
        prompt:
          "My partner and I want to do a France and Italy honeymoon across 13 nights. We want the trip to feel romantic and unhurried — not a checklist trip. We care most about: one extraordinary hotel moment (a Positano cliffside room or a Paris hotel with a real view), great food every evening, and at least one day that feels completely free of an agenda. Mid-premium budget — we are happy to spend on accommodation and one or two splurge experiences, but we do not need a luxury trip end to end. Build the full day-by-day, tell us where to splurge and where to save, and include the honest total cost per person.",
      },
      {
        icon: "🥐",
        label: "Help me explore France beyond Paris",
        prompt:
          "I have been to Paris once and I want to see the France that most people miss. I have 10 days and I do not want to spend them in the capital. Tell me what the rest of France actually offers: the Loire Valley chateaux and what makes them different from each other, Provence in lavender season and what that actually looks like on the ground, Lyon as the food capital of Europe and what one serious meal there involves, Bordeaux wine country during harvest, and the French Riviera beyond Nice airport. Help me choose the right 2 or 3 regions for 10 days based on what matters most to me, then build the day-by-day with how to travel between each region without flying domestically.",
      },
      {
        icon: "💶",
        label: "Rs 2 lakh per person — what does France and Italy look like?",
        prompt:
          "I want to plan France and Italy for Rs 2 lakh per person including return flights from India. Tell me honestly what this budget can build for a 10 to 12 day trip: which cities to anchor the trip in, what hotel category is realistic in Paris versus Rome versus the smaller stops, whether the Eurail pass saves money or costs more than buying tickets individually, and how to eat well in both countries without tourist-trap pricing. Build me the actual itinerary at this budget — day-by-day, accommodation category per stop, rough cost per night, and where the budget holds comfortably versus where it needs a compromise.",
      },
    ],
  },
  rows: {
    row1: {
      heading: "The Five Faces of France and Italy",
      icon: "🌍",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Paris — Palaces and Pastries.jpg ",
          label: "Paris — Palaces and Pastries",
          tags: "City · France",
          description: "Classic Paris experience.",
          prompt:
            "I want 3 days in Paris built around grand architecture, famous museums, and the city's best pastries. Create a day-by-day itinerary with smart morning, afternoon, and evening plans. Tell me which arrondissement to stay in for easy access and charm, schedule the Louvre and Palais Garnier at the best low-crowd times, include a sunrise walk through the Tuileries, éclairs from L'Éclair de Génie, croissants from Du Pain et des Idées, and one elegant dinner in Le Marais. Add the best route for each day, metro tips, what to book in advance, and factor in how Paris connects with the rest of my Europe trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Loire Valley — Castles & Countryside.jpg ",
          label: "Loire Valley — Castles & Countryside",
          tags: "History · France",
          description: "A calm escape through castles.",
          prompt:
            "I want 2 nights in the Loire Valley focused on history, atmosphere, and calm countryside. Build me a day-by-day itinerary that balances iconic chateaux with slower moments. Recommend three castles worth seeing for different reasons, include early morning gardens at Villandry, a riverside town walk in Amboise, and one excellent dinner in a converted manor or inn. Explain the easiest way from Paris, whether a car is necessary, and factor in how the Loire Valley connects with the rest of my France trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Rome — The Eternal City.jpg ",
          label: "Rome — The Eternal City",
          tags: "History · Italy",
          description: "Rome beyond just monuments.",
          prompt:
            "I want 3 days in Rome that go beyond landmarks. Build me a day-by-day itinerary where each day reveals a different Rome. Day 1 ancient sites with early Colosseum access and the Forum, Day 2 Vatican museums, St. Peter's, and piazza life, Day 3 neighbourhood Rome through Trastevere and Testaccio with food at the center. Include reservations, walking routes, transport tips, and tell me the one lunch or dinner worth planning the entire final day around. Factor in how Rome connects with the rest of my Italy trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Amalfi Coast — Sea and Sweat.jpg ",
          label: "Amalfi Coast — Sea and Sweat",
          tags: "Scenic · Italy",
          description: "Adventure with sea views.",
          prompt:
            "I want 3 nights on the Amalfi Coast built around effort and reward. Create a day-by-day itinerary for someone who wants hikes, swims, ferries, and real movement. Compare Positano, Praiano, and Ravello honestly as bases for an active trip. I want to hike Sentiero degli Dei into Positano, swim at Marina di Praia or Fiordo di Furore, drive the Amalfi road once without wasting hours in traffic, and take a ferry to Capri or Amalfi town. Tell me how to reach the coast from Naples or Rome, what to book ahead, and factor in how this stop connects with the rest of my Italy trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/French Riviera — Coastline Classics.jpg ",
          label: "French Riviera — Coastline Classics",
          tags: "Coastal · France",
          description: "Nice, Antibes, Monaco in 3 days.",
          prompt:
            "I want 3 days on the French Riviera and I want a smart, beautiful trip based in Nice. Build me a simple day-by-day itinerary. Day 1 should be Nice with the flower market, Old Town streets, local food, and Castle Hill views, plus time in Èze. Day 2 should be Antibes for the Picasso Museum, marina, market, and Cap d'Antibes walk. Day 3 should be Monaco for a relaxed afternoon seeing the palace area, harbour, and Casino Square before returning to Nice. Tell me where to stay, how to travel between places, what to pre-book, and factor in how this fits before flying home.",
        },
      ],
    },
    row2: {
      heading: "France & Italy Right Now",
      icon: "🎐",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Venice —City of Waterways.jpg ",
          label: "Venice — City of Waterways",
          sublabel: "See Venice before the crowds.",
          description: "Italy · Classic",
          prompt:
            "I want a 3-day Venice itinerary that avoids peak crowds and shows me the city at the right times of day. Build a smart day-by-day plan with timing as the focus — when to visit major sites and when to avoid them. Include early morning Rialto Market, timed visits to St. Mark's Basilica and Doge's Palace, and the best vaporetto routes for both transport and scenic views. Suggest quieter neighbourhoods like Cannaregio and Castello for dinners instead of San Marco, and include slow canal walks away from tourist crowds. Also add a day trip to Burano and Torcello that is well-paced and not rushed. Include how to reach Venice from Rome or Florence and how this stop fits into a wider Italy itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Provence — Lavender Window.jpg",
          label: "Provence — Lavender Window",
          sublabel: "Plan around the lavender bloom.",
          description: "France · Seasonal",
          prompt:
            "I want 3 days in Provence planned around the lavender season, but I also want a beautiful trip even if bloom timing shifts slightly. Build me a clear day-by-day itinerary and tell me whether Aix-en-Provence or a Luberon village is the better base. Include the best lavender areas such as Valensole Plateau, Abbaye de Sénanque near Gordes, and quieter fields near Sault. Tell me the best times of day for light and fewer crowds, which village markets are worth visiting, scenic drives between stops, and memorable local meals. Explain how to get there from Paris or Nice, and factor in how Provence fits into the rest of my France trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Cannes — Film Festival Experience.png ",
          label: "Cannes — Film Festival Experience",
          sublabel: "See the city during its biggest event.",
          description: "France · Festival",
          prompt:
            "I want to visit Cannes during the Film Festival and experience it as a normal traveller, not an industry insider. Build me a smart itinerary around the festival dates. Tell me what is actually accessible to the public such as red carpet arrivals near the Palais des Festivals, beach screenings, outdoor events, and the atmosphere across town when cinema takes over. Recommend where to stay if Cannes hotels are too expensive, including Antibes or Nice, and how to use trains to move around. Add nearby Riviera stops worth combining, and factor in how this fits into a wider South of France trip.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Bologna — Food & City Culture.jpg ",
          label: "Bologna — Food & City Culture",
          sublabel: "Italy's most serious food city.",
          description: "Italy · Food",
          prompt:
            "I want to plan a trip to Bologna around its food culture and major culinary events. Build me a clear 3-day itinerary focused on what the city does best. Include Quadrilatero market early in the day, authentic tortellini, mortadella, ragù, and local trattorias that matter. Add food experiences worth booking ahead, seasonal specialties if available, and a day trip to Modena for balsamic vinegar and the Ferrari Museum. Explain how Bologna connects easily with Florence and Venice, and factor in how this works in a wider northern Italy itinerary.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Tour de France.jpg ",
          label: "Tour de France",
          sublabel: "See the world's biggest cycling race.",
          description: "France · Scenic",
          prompt:
            "I want to watch the Tour de France in person and build a trip around the stage I choose. Explain how it works for spectators, when the route is announced, and how to choose the best type of stage: mountain finish, village sprint, or Paris finale. Build me an itinerary around the stage with where to stay, when to arrive roadside, what the caravan atmosphere feels like, and how to position myself for the best experience. Add how to combine it with a wider Alps or South of France trip depending on the route.",
        },
      ],
    },
    row3: {
      heading: "TTW's France & Italy Themes",
      icon: "🎯",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/The Grand Tour -- Done Right.jpg ",
          label: "The Grand Tour — Done Right",
          sublabel: "Both Countries · 14 Days",
          description: "Paris to Rome.",
          prompt:
            "I want a 14-day France to Italy trip with a smooth southbound route and no backtracking or wasted travel days. Start in Paris (3 nights), then move logically through France into Italy, ending in Rome. Build a full day-by-day itinerary with realistic pacing. Include the best intermediate stops like Lyon, the French Riviera, Cinque Terre or Genoa, and Florence/Tuscany. Tell me which places are worth overnight stays vs short stops, and why. Give exact train routes between each city, travel times, and how far in advance I need to book. Also include what needs advance reservations in each city (major attractions, museums, etc.). Finally, give a realistic mid-range cost per person including international flights from India, and explain the overall flow of the trip so I understand the logic of the route.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/France and Italy With Kids.png ",
          label: "France and Italy With Kids",
          sublabel: "Family · Both Countries",
          description: "Less walking. More wonder.",
          prompt:
            "I want to plan France and Italy for 2 adults and 2 children aged 8 to 12. The honest version — not the aspirational one. Build me the 12-day itinerary that actually works with kids: Paris for the things children genuinely find extraordinary (the Eiffel Tower at night, the Louvre Egyptian mummies, not the whole painting collection), Rome for the Colosseum with a guide who makes the gladiator story land, the Amalfi Coast for a boat day and a beach that is not a pebble. Tell me which cities are too much walking and heat for kids, which accommodation type works best, how to handle the long train journeys, and what children actually eat well in both countries. Full day-by-day and cost per person.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Honeymoon — Romance Across Two Countries.png ",
          label: "Honeymoon — Romance Across Two Countries",
          sublabel: "Romantic · Premium",
          description: "Fewer places. Longer stays.",
          prompt:
            "I want to plan a France and Italy honeymoon that does not feel like a sprint through highlights. Build me a 12-day itinerary that spends real time in each place: 3 nights in Paris in the right hotel — not the most expensive, the most Parisian — 3 nights in a Tuscany farmhouse with a pool and no particular agenda, and 3 nights on the Amalfi Coast where the only plan is a boat in the morning and dinner at sunset. Tell me which Paris hotel delivers the honeymoon feel without the palace price, which Tuscany farmhouse area — Chianti, Val d'Orcia, Montalcino — suits a couple who wants wine and quiet over sightseeing, and which Amalfi town is romantic rather than crowded. Full day-by-day, specific property recommendations, and what to spend on versus where to save.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Food & Wine — Best Culinary Journey.jpg",
          label: "Food & Wine — Best Culinary Journey",
          sublabel: "Gastronomy · Both Countries",
          description: "Eat and drink across France & Italy.",
          prompt:
            "I want to plan a France and Italy trip built entirely around eating and drinking seriously — not restaurants with views, the restaurants with the food. Build me the 11-day itinerary for someone who considers lunch the main event: Lyon for the bouchon tradition and why this city is the gastronomic capital of France, Burgundy for a private tasting at a small domaine that does not have a tourist operation, then across to Bologna for the Quadrilatero market and the ragù that takes all day, Modena for balsamic vinegar at the source and the only Osteria Francescana reservation worth chasing, and Naples for the pizza that made everything else a copy. Tell me what to book months in advance, which experiences are genuinely unmissable versus overhyped, and the total cost per person.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Italy First — Full Country Itinerary.jpg ",
          label: "Italy First — Full Country Itinerary",
          sublabel: "Italy · Deep Dive",
          description: "10 days. One country. All of it.",
          prompt:
            "I want to do Italy properly before I add France to the picture. Build me a 10-day Italy itinerary that covers the country's range without feeling rushed: 2 nights in Venice before the summer heat, 2 nights in Florence for the Uffizi and the Oltrarno neighbourhood, 2 nights in Rome for the ancient and the modern side by side, then 3 nights somewhere in the south — the Amalfi Coast, Puglia, or Sicily — to end in a completely different Italy from where I started. Tell me what connects these places beyond the obvious, the exact trains to book and how far ahead, what to eat that is specific to each city, and how to return for France on a second trip with this as the foundation.",
        },
      ],
    },
    row4: {
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
            "I want a half-day Versailles visit from Paris that avoids peak crowds and shows me the palace properly. Build a plan using the earliest possible entry slot, including timed entry for the Hall of Mirrors, the best way to experience the gardens before they get crowded, and whether the Trianon palaces and Marie Antoinette's estate are worth adding. Explain what to prioritise, what to skip, total time needed, how to get there from Paris, and how to fit this into a 3-day Paris itinerary without it feeling like a wasted day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Périgord — Real Truffle Hunting Experience.png",
          label: "Périgord — Real Truffle Hunting Experience",
          tags: "Food · Southwest France",
          description: "Find truffles with local hunters.",
          prompt:
            "I want to do a real black truffle hunting experience in the Périgord region during the truffle season. Explain what an authentic morning hunt looks like with a local truffle farmer and trained dog, how truffles are found and priced, and what happens after the hunt including the tasting lunch. Tell me how to find a genuine operator (not a tourist setup), where Périgord is in relation to Bordeaux and Paris, and build a 2–3 day itinerary including Lascaux caves and nearby villages, with total cost per person.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Bologna — Home Cooking with Locals.jpeg ",
          label: "Bologna — Home Cooking with Locals",
          tags: "Food · Italy",
          description: "Cook tortellini in a real kitchen.",
          prompt:
            "I want a hands-on cooking experience in Bologna where I cook traditional tortellini and ragù in a real local home with a Bolognese nonna, not a cooking school. Explain how to find authentic home-cooking experiences, what the morning includes from market visit to cooking and eating, and how the experience usually works. Build a full Bologna day around it, including what to do the evening before and where to eat dinner after the class, and mention cost, duration, and availability.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Loire Valley — Stay in a Chateau.jpg ",
          label: "Loire Valley — Stay in a Chateau",
          tags: "Heritage · France",
          description: "Sleep inside a real French castle.",
          prompt:
            "I want to spend 2 nights in the Loire Valley with one night inside a real château where guests stay in a historic property, not a modern hotel. Recommend authentic château stays and explain what the experience is like (rooms, dinner, atmosphere). Build a 2-night Loire itinerary including which châteaux to visit like Chambord and Chenonceau, how to get there from Paris, whether a car is needed, and how to structure the stay so the château night feels like the highlight.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/france-italy-theme-2026/Cinque Terre — Hiking Between Villages.jpg ",
          label: "Cinque Terre — Hiking Between Villages",
          tags: "Hiking · Italy",
          description: "Walk all five villages properly.",
          prompt:
            "I want a 2-day Cinque Terre hiking trip done properly across all five villages. Explain the current state of the coastal and ridge trails, which routes are actually open and worth doing, and build a realistic walking itinerary including start and end villages, lunch stops on the trail, and ferry or train options between sections. Tell me the fitness level required, what to pack, how luggage works, and how Cinque Terre fits into a Florence–Milan or Florence–Rome route.",
        },
      ],
    },
  },
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
