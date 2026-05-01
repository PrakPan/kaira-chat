const greeceTravellerStories = [
  {
    id: 1,
    name: "Kavya and Arjun",
    tripName: "10N Honeymoon — Athens, Santorini, Mykonos",
    duration: "10 Nights",
    groupType: "Honeymoon",
    destinations: ["Athens", "Santorini", "Mykonos"],
    image:
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=1600&auto=format&fit=crop&q=80",
    ],
    shortDescription:
      "Kavya, 29, and Arjun, 31, from Bengaluru almost booked Maldives because Greece felt complicated to plan — the ferries, the islands, the hotels that look identical in photographs but are completely different in reality. Day 1: land Athens, Monastiraki neighbourhood hotel, rooftop dinner with Acropolis view at night. Day 2: Acropolis at 8am before the heat, Acropolis Museum, Ancient Agora, Psiri neighbourhood for lunch. Day 3: flight to Santorini, caldera-view cave hotel check-in, Fira exploration. Day 4: private catamaran — hot springs, Red Beach, sunset from the water into Oia. Day 5: Oia in the morning before crowds, wine tasting at a caldera vineyard, sunset from Santo Wines terrace. Day 6: ferry to Mykonos (2h20m), Little Venice afternoon, Chora evening walk. Day 7: Paradise Beach, windmills at sunset, late dinner in Chora. Day 8: morning ferry back to Athens, afternoon flight home. Day 9–10 buffer used for Cape Sounion and the Temple of Poseidon. The catamaran day was the best day of the trip — they saw the island from the water and it looked nothing like the photographs, it looked better.",
    viewItineraryLink:
      "https://thetarzanway.com/chat/34bfde26-4b6f-4c4b-9d08-71c53e3b20e4",
    rating: 4.9,
    prompt:
      "I want to book the same Greece honeymoon Kavya and Arjun did — Athens 2 nights, Santorini 3 nights with caldera-view hotel, Mykonos 2 nights, 9 nights total, around Rs 2.1L per person. Plan it for me exactly as they did it including the catamaran day around the Santorini caldera and the 8am Acropolis morning before crowds. Include the rooftop dinner with the Acropolis view, the wine tasting at a caldera vineyard, and the Cape Sounion buffer day at the end.",
  },
  {
    id: 2,
    name: "Priya and her girls",
    tripName: "9D Girls Trip — Athens, Crete, Naxos",
    duration: "9 Days",
    groupType: "Girls Trip",
    destinations: ["Athens", "Crete", "Naxos"],
    image:
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1600&auto=format&fit=crop&q=80",
    ],
    shortDescription:
      "Priya and her four closest friends did 9 days through Athens, Crete, and Naxos for Rs 1.5L each. Athens 2 nights for the Acropolis at first light and a long Psiri tapas-style mezedes evening. Crete 4 nights based in Chania for the Venetian harbour at sunset, a Samaria Gorge hike that wrecked their legs but made the trip, a south coast beach day, and a proper Cretan dakos lunch in a mountain village. Naxos 3 nights for what they called the actual surprise of the trip — Apollo's Gate at sunset, beach-bar afternoons at Plaka, and a quiet harbour dinner where nobody else spoke English. Naxos was the tip that changed everything. Nobody goes there. Everyone should.",
    viewItineraryLink:
      "https://thetarzanway.com/chat/a884b626-cea4-4287-841a-d5c54a780b5c",
    rating: 4.8,
    prompt:
      "Plan a 9-day girls trip to Greece for 5 friends — Athens 2 nights, Crete 4 nights based in Chania, Naxos 3 nights. We want the Acropolis at first light, Samaria Gorge hike with the ferry back along the coast, a south coast beach day, the Venetian harbour at sunset, and Apollo's Gate in Naxos at golden hour. Mid-range budget around Rs 1.5L per person including flights from India. Skip Santorini — replace it with Naxos for the quieter, less-hyped island experience.",
  },
  {
    id: 3,
    name: "The Iyer family",
    tripName: "11D Family Trip — Athens, Meteora, Santorini",
    duration: "11 Days",
    groupType: "Family Trip",
    destinations: ["Athens", "Meteora", "Santorini"],
    image:
      "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593466144596-8abd50ad2c4f?w=1600&auto=format&fit=crop&q=80",
    ],
    shortDescription:
      "The Iyer family — two parents and two children aged 9 and 12 — did 11 days mixing ancient sites, cliff monasteries, and one proper island. Athens 3 nights for the Acropolis at 8am, the Acropolis Museum, the Ancient Agora, and a day trip down to the Theatre of Epidaurus where their 12-year-old whispered from the stage and the people at the back heard him perfectly — that was the moment of the trip. Meteora 2 nights from Kalambaka — the train up from Athens, the six monasteries spread across vertical rock, sunset from Roussanou. Santorini 3 nights with a caldera-view hotel that they upgraded for the kids' first ocean view, a half-day catamaran instead of full-day, and the Akrotiri archaeological site as a slot the kids actually liked. Mid-premium budget. Pace stayed family-doable throughout.",
    viewItineraryLink:
      "https://thetarzanway.com/chat/d918bc52-e431-407f-9f6e-b8b178f94567",
    rating: 4.7,
    prompt:
      "Plan an 11-day Greece family trip for 2 adults and 2 children aged 9 and 12 — Athens 3 nights, Meteora 2 nights, Santorini 3 nights. We want the Acropolis at 8am before the heat, a day trip to Epidaurus and the ancient theatre, the Meteora monasteries spread across the cliffs with a sunset from Roussanou, and a half-day catamaran in Santorini that suits children. Include the Akrotiri archaeological site. Mid-premium budget, family-doable pace, and tell me which kid-friendly attractions are genuinely worth it versus skip-able.",
  },
  {
    id: 4,
    name: "Siddharth",
    tripName: "7D Solo Cyclades Sailing Charter",
    duration: "7 Days",
    groupType: "Solo · Sailing",
    destinations: ["Paros", "Naxos", "Ios", "Santorini", "Milos"],
    image:
      "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&auto=format&fit=crop&q=80",
    ],
    shortDescription:
      "Siddharth, 34, sailed the Cyclades solo for 7 days on a shared skippered charter out of Athens — Paros, Naxos, Ios, Santorini, Milos. He woke up in a different cove every morning, swam off the back of the boat before breakfast, and arrived into harbours by sea instead of by ferry. The Milos coastline by water — Sarakiniko's lunar rocks, Kleftiko's pirate caves — is what stayed with him most. The boat slept eight, mixed nationalities, food was provisioned and cooked on board half the nights and at island tavernas the other half. Cost worked out to roughly Rs 1.4L per person for the week excluding flights. He says he is still not over it.",
    viewItineraryLink:
      "https://thetarzanway.com/chat/27020a6c-0d57-4f1b-b6d5-b238ca77a53a",
    rating: 4.9,
    prompt:
      "Plan a 7-day solo Cyclades sailing charter for me out of Athens — Paros, Naxos, Ios, Santorini, Milos. I want a shared skippered charter rather than a private one, mixed-nationality boat sleeping 6 to 8, with mornings spent swimming off the back of the boat and lunches in coves. I want Milos specifically for Sarakiniko and Kleftiko by water. Tell me what the daily routine looks like, what level of sailing experience I need (none), what the week costs all-in, and which months in the Aegean are best — July versus September.",
  },
  {
    id: 5,
    name: "Meera and Rohit",
    tripName: "10D Mainland Greece — Athens, Meteora, Delphi",
    duration: "10 Days",
    groupType: "Couple · Mainland",
    destinations: ["Athens", "Nafplio", "Meteora", "Delphi", "Thessaloniki"],
    image:
      "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=1600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1600&auto=format&fit=crop&q=80",
    ],
    shortDescription:
      "Meera and Rohit, both 36, skipped the islands entirely and did the mainland circuit — and never missed them once. Athens 3 nights for the Acropolis, the National Archaeological Museum, and a long evening walk through Plaka. The Peloponnese 2 nights based in Nafplio for Mycenae's Lion Gate, the Theatre of Epidaurus, and a slow seafood dinner on the harbour. Meteora 2 nights for the cliff monasteries at first light, sunset from Roussanou, and a hike between the rock formations. Delphi 1 night for the Sacred Way, the Temple of Apollo, and the museum's Charioteer of Delphi. Thessaloniki 2 nights to close — White Tower, the Roman Rotunda, the Ano Poli neighbourhood, and rooftop seafood mezedes above the Byzantine walls. Self-driven for the Peloponnese and Delphi sections. They said the mainland gave them the Greece they didn't know they were coming for.",
    viewItineraryLink:
      "https://thetarzanway.com/chat/34bfde26-4b6f-4c4b-9d08-71c53e3b20e4",
    rating: 4.8,
    prompt:
      "Plan a 10-day mainland Greece trip for 2 — no islands at all. Athens 3 nights, the Peloponnese 2 nights based in Nafplio for Mycenae and Epidaurus, Meteora 2 nights, Delphi 1 night, Thessaloniki 2 nights. We want the ancient sites taken seriously, the cliff monasteries at first light and sunset from Roussanou, the Theatre of Epidaurus, the Charioteer of Delphi, and Thessaloniki's rooftop seafood mezedes. Self-drive for the Peloponnese and Delphi sections. Mid-range budget. Build the day-by-day with honest travel times.",
  },
];
export default greeceTravellerStories;
