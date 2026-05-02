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
          "I want to visit Greece and everyone says Santorini is unmissable — but I have also heard it is overcrowded and overpriced. Help me decide: is Santorini worth 3 nights of my 11-day trip or should I replace it with somewhere less hyped? If it is worth it, build me the 3-night Santorini itinerary that actually delivers — the right hotel area, what to do each day, when to see the sunset and where to stand for it. If it is not worth it, suggest what to do with those 3 nights instead and build the alternative into my overall Greece route.",
      },
      {
        icon: "💶",
        label: "I have Rs 1.8 lakh — what does Greece actually get me?",
        prompt:
          "I want to plan a 8-day Greece trip for Rs 1.8 lakh per person including flights from India. Tell me honestly what this budget can build — which islands are realistic, what hotel category I am looking at in Athens versus the islands, and whether Santorini is possible or whether I should anchor the trip around Crete and one cheaper Cyclades island instead. Then build me the actual itinerary: where I fly in, how many nights in each place, how I move between islands, and what the day-by-day looks like at this budget.",
      },
      {
        icon: "🗺️",
        label: "Build me a doable 10-day Greece itinerary",
        prompt:
          "Build me a doable 10-day Greece itinerary where the route is logically connected and I am not losing time on inefficient travel between islands. I want a plan that avoids poor island combinations, unnecessary ferry hops, and overly rushed stops. Tell me whether it's better to start in Athens or fly straight to an island, how many nights Athens is actually worth, and which 2–3 islands work best together with smooth, realistic connections. Then build a clear day-by-day itinerary with honest travel times and a pace that feels enjoyable, not rushed, and highlight the common mistakes people make when planning Greece so this route avoids them completely.",
      },
      {
        icon: "💍",
        label: "Plan a romantic Greece trip for 2",
        prompt:
          "I want to plan an 11 to 12 day Greece trip for 2 people that feels romantic, beautiful, and easy rather than rushed. Help me build the best route with 2 islands that have real charm, great food, sunset moments, and hotels worth staying in. Tell me if Santorini is still worth it for couples or if there are better islands for romance and value. Include one or two ancient sites that are genuinely worth our time, how to travel between islands smoothly, where to stay in each place, what to do each day, and how to keep the pace relaxed with time for long dinners, swims, and slow mornings. Keep it mid-range and ideal for shoulder season travel.",
      },
    ],
  },
  rows: {
    row1: {
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
            "I want to spend 3 days in Athens and I want to use them properly. Build me the day-by-day: when to visit the Acropolis to beat the heat and the crowds, which parts of the site to spend the most time in, and whether the Acropolis Museum is worth a separate half-day or can be folded into the same morning. Then tell me how to spend the rest of each day — the Ancient Agora, the Monastiraki neighbourhood, the rooftop tavernas in Psiri where you can see the Parthenon lit up while you eat. What do I book in advance, what time does dinner actually start in Athens, and what should I not miss that most visitors skip?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Santorini.jpg",
          label: "Santorini — Blue Domes, Real Story",
          tags: "Scenic · Romantic",
          description: "The photo is real. Book early.",
          prompt:
            "I want to spend 3 nights in Santorini and I want the trip to justify the cost. Build me the day-by-day: which part of the island to stay in — Oia, Fira, Imerovigli — and what the honest difference is between them in terms of views, crowds, and price. What do I do on each of the 3 days so I am not just sitting on a terrace? When is the best time to walk into Oia before the sunset crowds arrive, and is there a better viewpoint than the castle that most people do not know? What hotel category actually gives a genuine caldera view, what does it cost, and what should I book the moment I confirm my dates?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Crete.jpg",
          label: "Crete — More Than a Beach",
          tags: "Culture · Beach",
          description: "Biggest island. Wildly underrated.",
          prompt:
            "I want to spend 4 days in Crete and I want to go deeper than the average tourist. Build me the day-by-day: which part of the island to base myself in — Chania or Heraklion — and how to structure the days so I get the Minoan Palace of Knossos, at least one full beach day on the south coast, the Venetian harbour of Chania at sunset, and a meal that makes me understand why Cretan food is different from the rest of Greece. Do I need a car or can I do this on public transport? What does most people get wrong about Crete because they only give it 2 nights?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Meteora.jpg",
          label: "Meteora — Monasteries on Cliffs",
          tags: "UNESCO · Spiritual",
          description: "Built on nothing. Literally.",
          prompt:
            "I want to spend 2 days in Meteora and understand what I am actually looking at. Build me the visit: which of the six active monasteries is worth the most time, what order to visit them in, and what time of day the light is best on the rock formations. Tell me the story of why monks built on top of these vertical cliffs, how they got up before the staircases were cut, and what life inside an active monastery looks like today. How do I get to Meteora from Athens, what is the town of Kalambaka like to stay in, and how does a 2-day Meteora stop fit into a wider Greece itinerary that also includes Athens and the islands?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Mykonos.jpg",
          label: "Mykonos — Beyond the Party",
          tags: "Beach · Nightlife",
          description: "The calm side of Mykonos.",
          prompt:
            "I want to spend 2 nights in Mykonos but I am not coming for the nightlife. Build me the 2-day itinerary for someone who wants the beautiful parts without the party version: the windmills at golden hour before the crowds, the Little Venice waterfront for an early evening drink, the Chora backstreets that were designed to confuse pirates, and the best beach that is not Paradise Beach. Is Mykonos worth it at all if I am skipping the clubs, or should I replace it with Paros or Naxos? If I keep it, tell me the right time of year to visit so the prices are manageable and the island is not completely overrun.",
        },
      ],
    },
    row2: {
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
            "I want to build a Greece trip around Greek Orthodox Easter. Tell me first what the experience actually involves — the midnight Anastasi service where the whole congregation lights candles from a single flame, the fireworks over the harbour, the lamb on the spit on Easter Sunday morning — and which island or town gives the most extraordinary version of it. Then build me the itinerary: how many days I need to be there to experience the full arc of Holy Week, where to stay, what to do on the days surrounding Easter, and how this combines with a wider Greece trip. Book accommodation 4 months out — Easter fills Greece completely.",
        },
        {
          image:
            "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1600&auto=format&fit=crop&q=80",
          label: "Epidaurus — The Original Theatre",
          sublabel: "June–August · 2,400 years old",
          description: "2,400 years old.",
          prompt:
            "I want to watch a play at the ancient Theatre of Epidaurus as part of a Greece trip. Tell me what the experience is actually like — the scale of a 14,000-seat open-air theatre carved into a hillside, the acoustics that let you hear a whisper from the back row, and what it feels like to watch a Greek tragedy in the same space it was written for. Do I need to understand Greek or are international productions staged? Then build me the itinerary around it: how to get to Epidaurus from Athens, whether it works as a day trip or needs an overnight, and how to combine the theatre with the ruins at Mycenae and the town of Nafplio into a 2 to 3 day Peloponnese circuit.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Thessaloniki.jpg",
          label: "Thessaloniki — Where Greeks Holiday",
          sublabel: "Year-Round · More food per street",
          description: "More food per street.",
          prompt:
            "I want to spend 2 days in Thessaloniki as part of a mainland Greece itinerary. Build me the food-first visit: what to eat for breakfast and where, which waterfront street has the best seafood mezedes, and what the rooftop bar situation looks like above the Byzantine walls at sunset. But also tell me what Thessaloniki offers beyond food — the White Tower, the Roman Rotunda, the Ano Poli neighbourhood with its Ottoman houses and view over the whole city. How do I get there from Athens and how does a Thessaloniki stop combine with Meteora into a mainland circuit before flying to the islands?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Hydra.jpg",
          label: "Hydra — No Cars. Just Donkeys.",
          sublabel: "90 minutes from Athens",
          description: "90 minutes from Athens.",
          prompt:
            "I want to add Hydra to my Greece itinerary. Tell me what a 2-night stay on this car-free island actually looks like day by day — how to arrive by ferry from Athens, what the harbour looks like when you pull in, what you actually do without vehicles, and which tavernas and swimming spots are worth the walk. Why do people who have done Santorini multiple times start choosing Hydra instead? How does it fit alongside Athens in a wider Greece trip, and is it possible as a day trip or does it genuinely need an overnight to make sense? Give me the honest case for and against adding it to a 10-day itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Delphi.jpg",
          label: "Delphi — Where Gods Were Consulted",
          sublabel: "Day Trip · The centre of the ancient world",
          description: "The centre of the ancient world.",
          prompt:
            "I want to visit Delphi as part of my Greece trip. Build me the day: the drive time from Athens, whether self-drive or guided tour makes more sense, how long I need at the archaeological site itself, and what the visit actually involves — the Temple of Apollo, the Sacred Way, the ancient theatre with its view down the valley, and the museum artefact I should not leave without seeing. Tell me the story of the Oracle — why rulers and city-states across the ancient world sent delegations here before every major decision — so I understand what I am standing inside. Can Delphi combine with Meteora into a 2-day mainland circuit, and where does it sit best in a 10 to 12 day Greece itinerary?",
        },
      ],
    },
    row3: {
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
            "I want to do the classic Greek islands trip but I want it to be done properly — not too many islands, not too rushed, and the right number of nights in each place. Build me the 10-day itinerary: 3 nights in Santorini with a caldera-view hotel, 3 nights in Crete with the Chania old town and one proper beach day, and 2 nights on a third island that genuinely adds something different. Tell me which third island works best — Naxos, Paros, or Rhodes — and why. Include the ferry connections between all three, honest travel times, a day-by-day breakdown, and the cost per person at mid-range including flights from India.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece With Kids.png",
          label: "Greece With Kids",
          sublabel: "Family · Islands",
          description: "Ruins, beaches, feta.",
          prompt:
            "I want to plan a 10-day Greece family trip for 2 adults and 2 children aged 8 to 13 that actually works for everyone. Build me the itinerary: which cities and islands are right for families, which ancient sites hold a child's attention and which ones are just rocks in a field, and how to structure the days so nobody ends up exhausted on a long ferry. Tell me which beaches have shallow safe water, what kids will actually eat at Greek tavernas, and which accommodation type works best — apartment or hotel. Include the day-by-day, the right island combination, honest travel times, and cost per person at mid-range.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Honeymoon in Greece.png",
          label: "Honeymoon in Greece",
          sublabel: "Romantic · Luxury",
          description: "Blue domes. No crowds.",
          prompt:
            "I want to plan a Greece honeymoon that gets the balance right between the iconic and the intimate. Build me the 11-day itinerary: 3 nights in a Santorini cave hotel with a genuine caldera view, a private catamaran day around the island, and then 3 nights somewhere quieter and more romantic — Folegandros, Milos, or Sifnos rather than the crowded main islands. Tell me what makes each of those quiet islands different, which one suits us best, and what a premium but not excessive budget looks like. Include the day-by-day, where to eat each evening, what to splurge on, and the full cost per person.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece Under Rs 1.8 Lakh Per Person.jpg",
          label: "Greece Under Rs 1.8 Lakh Per Person",
          sublabel: "Budget · Islands",
          description: "Aegean, minus the bill.",
          prompt:
            "I want to plan a proper Greece trip for under Rs 1.8 lakh per person including flights from India. Build me the 7-day itinerary that makes this budget work — which islands to choose instead of or alongside Santorini, what hotel category is realistic in Athens versus the Cyclades, and how to use ferries instead of inter-island flights to save money. Tell me where Greece is genuinely affordable if you eat and stay like a local, and where the budget starts to hurt. Include the full day-by-day, honest costs per night for accommodation at each stop, and where to save versus where a small upgrade is worth it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Greece Mainland.png",
          label: "Greece Mainland — Ancient Greek Journey",
          sublabel: "History · Culture",
          description: "Before the islands existed.",
          prompt:
            "I want to plan a 10-day Greece trip focused entirely on the mainland and Athens — no islands. Build me the itinerary for someone who cares more about ancient history than beaches: 3 days in Athens going deep into the Acropolis, the Ancient Agora, and the National Archaeological Museum, then the Peloponnese circuit covering Mycenae, Epidaurus, Nafplio, and ancient Sparta, then Meteora and Delphi. Tell me how to travel between each of these sites, how many nights each place deserves, and what the mainland reveals about Greek history and civilisation that a week in the islands completely misses. Include the full day-by-day and cost per person.",
        },
      ],
    },
    row4: {
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
            "I want to visit the Acropolis at first light before the crowds and the heat arrive. Build me the morning: what the first entry slot is, how to get there from a central Athens hotel so I arrive as the gates open, which parts of the site to go to first and which to leave until the end, and how long I realistically need before it gets uncomfortable. Tell me what I should actually understand about the Parthenon before I arrive — the optical illusions built into the columns, the original painted colours, the 2,500 years of damage and deliberate theft — so I am not just walking past marble. Then tell me how to fold the Acropolis Museum into the same morning or whether it needs a separate visit, and how this shapes the rest of Day 1 in Athens.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Catamaran.jpg",
          label: "Catamaran — Santorini From the Sea",
          tags: "Luxury · Santorini",
          description: "Better from the water.",
          prompt:
            "I want to do a catamaran day around the Santorini caldera as part of my 3-night stay. Build me the day: what a half-day versus full-day trip involves, which stops are genuinely worth it — the volcanic hot springs, the Red Beach swim, arriving into Oia by sea at sunset — and which are filler. Tell me the honest difference between a private charter for 2 and a shared group cruise in terms of crowd size, flexibility, and what each costs. Which catamaran operators are worth booking and how far in advance? Then tell me which day of my Santorini stay works best for this so the rest of the itinerary flows around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Samaria Gorge.png",
          label: "Samaria Gorge — Hike, Then Beach",
          tags: "Hiking · Crete",
          description: "16km. Worth every step.",
          prompt:
            "I want to hike the Samaria Gorge in Crete and I want to know exactly what I am getting into. Build me the full day: the early bus from Chania to the Omalos plateau, what the 16km descent involves and where the hard sections are, the Iron Gates where the canyon narrows to 3 metres, the village of Agia Roumeli at the end, and the ferry back along the coast to Chora Sfakion. How fit do I need to be — is this accessible to someone who does not regularly hike? What month is best, what do I wear and carry, and how long does the full day take from departure to getting back to Chania? Tell me how to build this into a 4-day Crete itinerary without it wrecking the following day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Cook Greek — In a Local Home.png",
          label: "Cook Greek — In a Local Home",
          tags: "Food · Cultural",
          description: "A Greek grandmother's kitchen.",
          prompt:
            "I want to do a genuine Greek cooking experience in Crete or Athens — not a commercial kitchen demonstration. Tell me what a real session involves: the morning market visit to buy seasonal produce, the dishes that get made and why they are specific to the region, and what Cretan cooking in particular involves that is different from the rest of Greece. Then build me how to find and book a genuine experience with a local family or small producer rather than a tourist school. What does it cost, how long does it run, and which city gives the better experience? Tell me how to place this in the itinerary so it is not a standalone activity but the anchor of a food-focused day — where to eat breakfast before, what to do with the afternoon after.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Sail the Cyclades — Your Own Route.png",
          label: "Sail the Cyclades — Your Own Route",
          tags: "Sailing · Islands",
          description: "New island every morning.",
          prompt:
            "I want to charter a sailing boat in the Cyclades for a week as an alternative to hotel-and-ferry island hopping. Build me the trip: what a skippered charter involves practically, which islands form the best Cyclades sailing circuit — Paros, Naxos, Ios, Santorini, Milos — how many nautical miles between each, and what a typical day looks like from anchor to anchorage. What does a skippered charter for 4 people cost per person for the week, and how does that compare to doing the same islands in hotels and ferries? What level of sailing experience do I need, what is the weather like in the Aegean in July versus September, and how do I book a reputable skipper? Tell me whether this works better as the whole trip or as one week within a longer Greece itinerary.",
        },
      ],
    },
  },
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
