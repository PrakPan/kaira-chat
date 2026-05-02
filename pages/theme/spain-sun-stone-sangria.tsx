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
          "I want to visit Spain and everyone says start with Barcelona or start with Madrid but nobody explains why. Give me an honest side-by-side: the architecture, the food scene, the pace, the beaches, the museums, the nightlife, and how they feel different on the ground. I have 12 days total — which city deserves more time, which one can I do in 3 days, and is there a routing that makes sense geographically so I'm not backtracking?",
      },
      {
        icon: "📅",
        label: "What's the best time of year to visit Spain from India?",
        prompt:
          "I want to plan a Spain trip but the timing feels complicated — the south is boiling in July, the north has its own weather, festival seasons book out hotels months in advance. Tell me what each season actually looks like across Spain: the shoulder months when crowds thin but everything is open, the summer heat reality in Seville and Andalusia, the best windows for the Camino de Santiago, and when La Tomatina and Running of the Bulls happen so I can either plan around them or for them. I'm flexible on travel dates — help me choose the right window.",
      },
      {
        icon: "💶",
        label: "Spain on Rs 2.5 lakh per person",
        prompt:
          "I want to plan a Spain trip for around Rs 2.5 lakh per person including flights from India. Is this realistic for 10 days? Walk me through what this budget actually gets me: accommodation in Madrid, Barcelona, and Andalusia, high-speed AVE train connections, day trips to Granada and Toledo, and food. Where should I spend more and where is Spain forgiving on the wallet? What does mid-range look like versus budget-hostel Spain — and at what point does an extra Rs 30,000 genuinely change the experience?",
      },
      {
        icon: "💃",
        label: "I want Flamenco, Alhambra, Seville, and tapas",
        prompt:
          "I want to experience the Spain that actually looks like Spain — Flamenco in its real home, the Alhambra palace at sunset, the tapas bars of Seville where the food is still free with your drink, and whitewashed Andalusian villages on hillsides. I don't want theme-park Spain. Plan me a 10 to 12 day itinerary anchored in the south — Granada, Seville, Cordoba — with guidance on exactly when to book the Alhambra, which Flamenco shows are genuine versus tourist-oriented, and how to get between cities efficiently.",
      },
    ],
  },
  rows: {
    row1: {
      heading: "From Gaudí to the Alhambra",
      icon: "🏛️",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Barcelona — Gaudí and the Good Life.jpg ",
          
          label: "Barcelona — Gaudí and the Good Life",
          tags: "City · First Timer",
          description: "Dinner starts at 10pm. Always.",
          prompt:
            "Plan 4 days in Barcelona. I want a logical order for seeing Gaudí's work — Sagrada Família at what time of day and why, Park Güell before the crowds arrive, Casa Batlló versus Palau de la Música for the one I shouldn't skip. I also want the real Barcelona eating schedule: why dinner before 9pm is wrong, which neighbourhood markets are worth the morning, and how to find the tapas bars the locals actually go to in El Born and Gràcia. Include the Gothic Quarter walking route and one half-day at Barceloneta beach. What should I book in advance and how far out?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Seville — Spain's Most Passionate City.jpg ",
          label: "Seville — Spain's Most Passionate City",
          tags: "Culture · Flamenco",
          description: "Feel where flamenco began.",
          prompt:
            "Plan 3 days in Seville. I want the real Triana neighbourhood across the river where Flamenco started, the Alcázar palace at opening time before the tour groups arrive, the Cathedral and the Giralda tower at golden hour, and the tapas circuit in the old city where the drink still comes with free food. Tell me which Flamenco shows are genuinely rooted in tradition versus staged for tourists — what makes a tablao authentic and what to look for when booking. What is Seville like in summer heat and what does a May or October visit feel like instead?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Granada — Home of the Alhambra.jpg ",
          label: "Granada — Home of the Alhambra",
          tags: "History · UNESCO",
          description: "One palace. Worth the wait.",
          prompt:
            "Plan 2 days in Granada. The Alhambra is non-negotiable — tell me how to book the timed entry tickets (they sell out weeks ahead), what time of day the Nasrid Palaces show the best light, and what the difference is between the Palacios Nazaríes, the Generalife gardens, and the Alcazaba fortress in terms of where to spend the most time. Outside the Alhambra: the Albaicín neighbourhood at dusk for the best view across to the palace, the tea houses of the Moorish quarter, and a real Sacromonte cave Flamenco in the evening. What must I know about getting there from Seville or Madrid?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/San Sebastián — World's Best Food City.jpg ",
          label: "San Sebastián — World's Best Food City",
          tags: "Food · Basque Country",
          description: "More Michelin stars per block.",
          prompt:
            "Plan 2 to 3 days in San Sebastián in the Basque Country. I want to understand what makes pintxos different from tapas and why the Basque food culture is considered Spain's most serious culinary tradition. Walk me through the Old Part bar crawl — which streets, what time, and what to order at each bar. Is a Michelin-starred dinner worth booking on this trip or is the pintxos bar scene genuinely better? What else does San Sebastián offer beyond food — La Concha beach, the Monte Urgull walk, the Chillida sculptures? How do I get there from Madrid or Barcelona?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Camino de Santiago — Walk It.jpg ",
          label: "Camino de Santiago — Walk It",
          tags: "Adventure · Pilgrimage",
          description: "500km. Most do the last 100.",
          prompt:
            "I want to walk a section of the Camino de Santiago. Tell me the honest picture: how long is the full Camino Francés, what are the realistic shorter sections a first-timer with 7 to 10 days can walk and still feel the experience fully, and what the Camino actually feels like on the ground — the albergues, the terrain, the other pilgrims, the moment you arrive in Santiago de Compostela. Do I need to be a hiker or spiritually inclined, or is this for anyone? What months are best, what should I pack specifically for the Camino, and how do I reach the starting point from India via Madrid?",
        },
      ],
    },
    row2: {
      heading: "Spain Right Now",
      icon: "🎉",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/La Tomatina — Buñol, August.png ",
          label: "La Tomatina — Buñol, August",
          sublabel: "Hotels near Buñol: book by April",
          description: "Spain's wildest 90 minutes.",
          prompt:
            "I want to attend La Tomatina in Buñol on the last Wednesday of August. Plan the trip around it: how to get there from Valencia or Madrid on the morning, what the event actually involves from start to finish — the signal, the trucks, the 90-minute tomato battle, the hose-down — and where to stay since Buñol has almost no accommodation. How do I get official tickets, what should I wear and leave behind at the hotel, and how do I combine this with a wider Valencia and Spain itinerary? What is the full trip cost for an Indian traveller doing 10 days around this festival?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Running of the Bulls — Pamplona, July.png ",
          label: "Running of the Bulls — Pamplona, July",
          sublabel: "You don't have to run. Watching works.",
          description: "Eight mornings. One legendary city.",
          prompt:
            "I want to be in Pamplona for the San Fermín festival and the Running of the Bulls. Tell me honestly what the week involves beyond the run itself — the daily encierro is 3 minutes long, so what fills the rest of the festival: the bullfights, the street parties, the fireworks, the white-and-red dress code that turns the whole city into one crowd? If I want to run, what do I need to know about the route, the danger, and what not to do? If I want to watch, where are the best viewing spots? How do I book accommodation in Pamplona 6 months out because the city fills completely, and how does this combine with San Sebastián or Barcelona?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Semana Santa — Seville, Holy Week.png ",
          label: "Semana Santa — Seville, Holy Week",
          sublabel: "March–April · Nothing prepares you",
          description: "Processions through the night.",
          prompt:
            "I want to witness Semana Santa — Holy Week — in Spain, specifically in Seville or Málaga where the processions are considered the most extraordinary in the world. Tell me what actually happens: the cofradías carrying their floats through narrow streets at 2am, the saeta — the spontaneous flamenco lament sung from balconies — the scale of the events that bring half a million people into Seville in a single week. Which days are the most significant, where should I stand, and what should I know as a non-Catholic visitor experiencing this? Book hotels at least 3 months out — rates triple and rooms vanish.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Feria de Abril — Seville Dances Again.png ",
          label: "Feria de Abril — Seville Dances Again",
          sublabel: "April–May · Sherry at noon",
          description: "A week the city dresses up.",
          prompt:
            "Tell me about the Feria de Abril in Seville — the week-long festival that happens two weeks after Semana Santa where the city fills with casetas (private tent parties), Flamenco dresses, horse parades, and sherry at noon. Is it possible for a tourist to actually get inside the casetas or is it an invite-only experience? What is the Feria grounds layout, what is the right way to dress, what time does it come alive, and how does the energy compare to the solemnity of Semana Santa the fortnight before? How do I combine this with a Seville-Granada-Córdoba Andalusia trip?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Primavera Sound — Barcelona, June.png ",
          label: "Primavera Sound — Barcelona, June",
          sublabel: "The reason Europe flies to Barcelona",
          description: "Barcelona's biggest music week.",
          prompt:
            "Tell me about Barcelona's two big music festivals — Primavera Sound in late May and Sónar in June. What is the difference between them in terms of music genre, crowd, venue, and the kind of experience they offer? Can I attend as someone who doesn't know every act on the lineup, or is this purely for music specialists? How do I buy tickets from India, where do I stay in Barcelona during festival weeks when hotels fill and prices spike, and how do I build a festival visit into a wider Spain trip that also includes Andalusia?",
        },
      ],
    },
    row3: {
      heading: "TTW's Spain Themes",
      icon: "🎯",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Classic Andalusia.jpg ",
          label: "Classic Andalusia",
          sublabel: "Culture · South Spain",
          description: "Flamenco. Alhambra. Tapas.",
          prompt:
            "Design a 10-day trip entirely in Andalusia — the Spain that looks like Spain. I want the Alhambra at first light, the Mezquita of Córdoba before the tour groups, the whitewashed villages of the Sierra Nevada, a Flamenco show in Jerez that isn't for tourists, and Seville's tapas bars where the drink still arrives with free food. Route me through Granada, Córdoba, Seville, and Jerez with the right number of nights in each, honest guidance on where to stay, and what the total cost looks like from India for two people.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Spain With Kids.png ",
          label: "Spain With Kids",
          sublabel: "Family · City + Beach",
          description: "Gaudí, beaches, churros.",
          prompt:
            "Plan a Spain family trip for 2 adults and 2 children aged 7 to 12. I want experiences that work for kids — Gaudí's buildings are genuinely strange and fascinating at any age, the beach culture works perfectly for children, and the late Spanish dinner hour is a real logistical challenge with tired kids. Which cities work best for families, what are the child-friendly attractions beyond the obvious, how do I handle the Spanish meal schedule with children, and what accommodation type works best — city apartments versus hotels? 10 days, mid-range budget.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Honeymoon in Spain.png ",
          label: "Honeymoon in Spain",
          sublabel: "Romantic · City + Countryside",
          description: "Rooftops, alleys, no agenda.",
          prompt:
            "Plan a Spain honeymoon. We want the romantic version — Seville's candlelit tapas bars, a private Flamenco session in a Granada cave, the Alhambra at dusk just before closing when most tourists have left, a boutique hotel with a rooftop in the Gothic Quarter of Barcelona, and one night in a rural parador in the Andalusian countryside. 12 days, mid-range to premium. Tell us exactly what to spend on, what to skip, and which specific moments are worth engineering versus leaving to chance.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Spain Under Rs 2.5 Lakh Per Person.jpg ",
          label: "Spain Under Rs 2.5 Lakh Per Person",
          sublabel: "Budget · All Regions",
          description: "Big trip. Smaller budget.",
          prompt:
            "Plan a Spain trip for under Rs 2.5 lakh per person including return flights from India. Is this realistic for 10 to 12 days? Spain is more affordable than most of Western Europe if you know where to eat and how to travel between cities. Walk me through the honest budget: where the AVE high-speed trains save time and money versus budget flights, which cities have good mid-range accommodation under Rs 6,000 per night, and where the food is genuinely cheap even in tourist areas. What are the smart trade-offs between Barcelona, Madrid, and Andalusia at this budget?",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Road Trip Across Spain.png ",
          label: "Road Trip Across Spain",
          sublabel: "Adventure · Self-Drive",
          description: "One car. No fixed plan.",
          prompt:
            "Plan a Spain road trip for 2 people in 11 days with a rental car. I want to understand which routes actually make sense — the coastal road along the Costa Brava from Barcelona, the drive through the Basque Country to Rioja wine country, or the Andalusia route through whitewashed villages from Seville to Granada. What are the tolls situation, parking reality in Spanish cities, and the genuine joy of having a car in rural Spain that the trains can't reach? Suggest a full route with overnight stops, and tell me what a rental, fuel, and tolls budget looks like per person.",
        },
      ],
    },
    row4: {
      heading: "Only in Spain — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Alhambra — Before the Crowds Arrive.jpg ",
          label: "Alhambra — Before the Crowds Arrive",
          tags: "History · Granada",
          description: "Book 3 months out. No exceptions.",
          prompt:
            "I want to experience the Alhambra in Granada properly — not shuffled through in a tour group. Tell me everything about the timed entry system: how far in advance tickets sell out for the Nasrid Palaces specifically, what the morning first-entry slot feels like compared to afternoon, and which parts of the complex — Palacios Nazaríes, Generalife gardens, Alcazaba fortress — deserve the most time and why. What is the architectural and historical story of the Alhambra that makes it different from any other palace in Europe — the Nasrid dynasty, the water engineering, the geometry of the tilework, the inscriptions that run across every wall? What should I read or watch before visiting to understand what I'm actually standing inside? Then ask me my travel dates and how many days I have in Granada so I can help you secure the right entry slot before they're gone.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Pintxos Crawl — San Sebastián After Dark.png ",
          label: "Pintxos Crawl — San Sebastián After Dark",
          tags: "Food · Basque",
          description: "Different bar every 20 minutes.",
          prompt:
            "Tell me exactly how a pintxos bar crawl in San Sebastián's Old Part works — the etiquette, the timing, the unwritten rules about grabbing from the bar versus ordering from the bartender, and why you should never stay in one place longer than two rounds. What are the specific streets — Calle Fermín Calbetón, 31 de Agosto — and what should I order at each stop rather than just eating whatever is on the counter? What makes Basque pintxos culture different from tapas culture elsewhere in Spain — the complexity of the preparations, the pride of the bartenders, the atmosphere at 8pm on a Thursday? Is this affordable or does San Sebastián's gastronomy reputation make it expensive even at bar level? Then ask me how many evenings I have in San Sebastián so we can plan whether to do one serious crawl or two lighter ones.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Real Flamenco — Andalusia’s True Show.png ",
          label: "Real Flamenco — Andalusia's True Show",
          tags: "Culture · Andalusia",
          description: "Where flamenco was born.",
          prompt:
            "I want to experience genuine Flamenco — not a tourist show with a dinner package. Explain to me what Flamenco actually is at its roots: the four elements of cante (voice), toque (guitar), baile (dance), and jaleo (the clapping and shouting from the audience that drives the performer), why Jerez de la Frontera and the Triana neighbourhood of Seville are its authentic homes, and what separates a real peña flamenca from a staged tablao. What is the right way to find a genuine Flamenco experience as an outsider — which venues in Jerez, which tablaos in Seville that are respected by local artists rather than built for tourist throughput? What time does real Flamenco start, what should I know about how to behave in the audience, and what does the music and performance actually feel like when it's the real thing rather than a reproduction? Then ask me which cities I'm visiting in Andalusia so I can match the best genuine Flamenco option to my route.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Rioja — Spain’s Famous Wine Region.jpg ",
          label: "Rioja — Spain's Famous Wine Region",
          tags: "Wine · Northern Spain",
          description: "Spain's best-known wine country.",
          prompt:
            "Tell me about visiting the Rioja wine region in northern Spain — the bodega landscape around Haro and Logroño, what a proper winery visit involves beyond just a glass poured in a gift shop, and how the architecture of Rioja's bodegas — Frank Gehry's Marqués de Riscal, Zaha Hadid's López de Heredia visitor centre — has made this one of the most visually striking wine regions in the world. What is the difference between Rioja Alta, Rioja Alavesa, and Rioja Oriental in terms of the wines they produce? How do I structure a 2-day Rioja visit that includes at least two serious bodega tastings and a lunch at a restaurant that takes the local wine as seriously as the food? How do I get there from Bilbao or San Sebastián, and how does this combine into a Basque Country and Rioja 4 to 5 day itinerary? Then ask me my travel dates and what I want to spend on a bodega experience so I can suggest the right producers to book.",
        },
        {
          image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/spain-theme-2026/Sleep in a Parador — A Castle Bedroom.png ",
          label: "Sleep in a Parador — A Castle Bedroom",
          tags: "Heritage · Unique Stay",
          description: "15th-century castle. Your room tonight.",
          prompt:
            "Tell me about the Paradores — Spain's network of state-owned hotels housed inside historic buildings: medieval castles, ancient monasteries, Renaissance palaces, and hilltop convents. What does staying in a Parador actually feel like versus a standard hotel — the architecture, the food (Paradores serve regional cuisine), the locations which are often in places no chain hotel would ever build? Which Paradores are considered the best in Spain: the Parador de Granada inside the Alhambra grounds, the Parador de Sigüenza in a 12th-century castle, the Parador de Santiago de Compostela which has hosted pilgrims for 500 years? How do I book, what do they cost compared to equivalent hotel experiences, and are they worth the price? Then ask me which region of Spain I'm visiting and how many nights I have so I can suggest the right Parador for my specific itinerary.",
        },
      ],
    },
  },
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
