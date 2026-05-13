// pages/theme/bali-uncovered.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import baliTravellerStories from "../../data/baliTravellerStories";

const baliThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "Tell us your vibe — rice fields, beaches, or sunsets — and we'll map your Bali.",
    promptChips: [
      {
        icon: "💍",
        label: "Plan the most romantic Bali honeymoon",
        prompt:
          "We want to plan the most romantic Bali honeymoon possible — luxurious, intimate, and unforgettable without feeling rushed. Build us a 7 to 10 day itinerary with private pool villas, sunset dinners, spa experiences, beautiful cafes, beach clubs worth visiting, and a few truly special experiences. Help us decide the best mix of Ubud, Seminyak, Uluwatu, or quieter island escapes based on the honeymoon vibe we want. We want the trip to flow smoothly without wasting time in traffic or constantly changing hotels, so tell us what is genuinely worth the splurge and what is overrated online.",
      },
      {
        icon: "🌴",
        label: "Bali for first-timers — what is actually worth it?",
        prompt:
          "It is my first Bali trip and I cannot tell what is genuinely worth seeing versus what only looks good on Instagram. Build me the ideal first-time Bali itinerary that covers the highlights without making the trip exhausting. Tell me which temples are truly worth the crowds, whether Nusa Penida is worth the long day trip, which beach area fits my travel style, and how many hotel changes are too many for a one-week trip. I want the version of Bali that feels balanced — good food, culture, beaches, cafes, sunsets, and some downtime instead of constantly being in a car.",
      },
      {
        icon: "💰",
        label: "Bali with a Rs 60,000 budget — is it realistic?",
        prompt:
          "I want to plan a Bali trip for Rs 60,000 per person including return flights from India. Tell me honestly what this budget builds for 7 to 8 days: which accommodation type is realistic in Ubud versus Seminyak at this budget, where Bali is genuinely affordable if you eat at warungs and travel by scooter, and where the costs start to add up faster than expected. Build me the actual itinerary at this budget — day-by-day, where I stay each night and what category, how I get around the island cheaply, and where I should spend a little more versus where cheap is completely fine.",
      },
      {
        icon: "✨",
        label: "I want the luxury Bali everyone talks about",
        prompt:
          "Plan me a luxury Bali trip that feels worth the money, not just expensive for Instagram. I want cliffside resorts, private villas, incredible food, beach clubs that are actually worth visiting, premium wellness experiences, and the kind of itinerary where every stay feels different. Help me decide between Uluwatu, Seminyak, Ubud, and the quieter luxury escapes nearby depending on the vibe I want. Build me a 7 to 9 day itinerary with the best sequence of stays, realistic transfer times, where to book early, and which luxury experiences are genuinely memorable versus just social-media hype.",
      },
    ],
  },
  rows: {
    row1: {
      heading: "From Ubud to the Sea",
      icon: "🌾",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Ubud -- Temples and Rice Fields.jpg ",
          label: "Ubud — Temples and Rice Fields",
          tags: "Culture · Central Bali",
          description: "The Bali everyone pictures.",
          prompt:
            "I want to spend 3 nights in Ubud and use the time well. Build a day-by-day plan covering Tegallalang at sunrise, Tirta Empul temple with context on the purification ritual, and Monkey Forest if time allows. Include a good cooking class with a market visit to Pasar Ubud, the best area to stay in Ubud, and realistic mid-range vs budget costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Seminyak -- Beach Clubs and Sunset.jpg ",
          label: "Seminyak — Beach Clubs and Sunset",
          tags: "Beach · West Bali",
          description: "Sunsets, cocktails, and beach days.",
          prompt:
            "I want to spend 3 nights in Seminyak focused on beach clubs and sunsets. Build the stay with the best beach club experience, timing to get sunbeds, and which places are actually worth it. Also explain Seminyak beyond beach clubs, including shopping, food streets, and how it compares to Kuta and Canggu, plus whether it is still worth visiting in 2026.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Canggu — Surf, Cafes, Slow Bali Days.jpg ",
          label: "Canggu — Surf, Cafes, Slow Bali Days",
          tags: "Surf · Lifestyle",
          description: "Coffee at 8. Surf at 9.",
          prompt:
            "I want to spend 4 nights in Canggu and understand what it is really like beyond Instagram cafes. Include beginner surf spots, surf lesson cost, good vs overrated cafes, food options beyond trends, and whether Echo Beach is worth it. Also compare Canggu with Seminyak for first-time visitors and overall energy and cost.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Uluwatu — Clifftop Sunsets and Surf.jpg ",
          label: "Uluwatu — Clifftop Sunsets and Surf",
          tags: "Scenic · South Bali",
          description: "The sunset nobody forgets.",
          prompt:
            "I want to spend 2 nights in Uluwatu for the temple and Kecak fire dance at sunset. Explain the temple visit, the performance, seating options, and timing. Include nearby surf spots, cliff warungs, and how Uluwatu feels compared to Seminyak and Canggu. Also tell me if 2 nights is necessary or if a day trip is enough.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Nusa Penida -- Day Trip Done Right.jpg ",
          label: "Nusa Penida — Day Trip Done Right",
          tags: "Scenic · Island",
          description: "The views are worth the chaos.",
          prompt:
            "I want to do a Nusa Penida day trip from Bali properly. Build the full day with fast boat timing, Kelingking viewpoint strategy, and how to fit Broken Beach and Angel's Billabong without rushing. Explain road conditions, scooter vs driver options, total cost per person, and whether it fits well into a 7-night Bali itinerary.",
        },
        
      ],
    },
    row2: {
      heading: "Bali Right Now",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Nyepi -- Bali Day of Silence.jpg",
          label: "Nyepi — Bali Day of Silence",
          sublabel: "March · plan around the silence day",
          description: "An entire island goes silent.",
          prompt:
            "I want to be in Bali during Nyepi, the Balinese New Year Day of Silence. Explain what the 24-hour shutdown actually feels like — no travel, no lights, no noise, and only Pecalang on the streets. Also describe the day before with the Ogoh-Ogoh parades and burning of giant effigies. Tell me what is allowed for tourists in hotels, what is restricted, and whether Nyepi is worth planning a trip around. Build me a Bali itinerary around it, including when to arrive and how to plan activities before and after the silence day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Galungan — Bali’s Most Sacred Festival.jpg ",
          label: "Galungan — Bali's Most Sacred Festival",
          sublabel: "Balinese calendar · every 210 days",
          description: "Bali covered in bamboo offerings.",
          prompt:
            "I want to experience Galungan, the festival celebrating the victory of good over evil. Tell me what Bali looks like during this time — penjor bamboo decorations, temple ceremonies, and village celebrations. When is the next Galungan and how should I plan a trip around it? Build me a culturally rich itinerary focusing on Ubud and Gianyar, including what visitors can respectfully attend and what is private, and how to combine it with a normal Bali trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Surf Season — Bali’s Best Waves.jpg",
          label: "Surf Season — Bali's Best Waves",
          sublabel: "May to September · dry season",
          description: "Clean waves, warm water, all day in the ocean.",
          prompt:
            "I want a surf-focused Bali trip during the dry season. Explain surf conditions for beginners, intermediates, and advanced surfers across spots like Canggu, Uluwatu, and Keramas. Build me a 7-day surf itinerary with where to stay, daily surf spots, lesson costs, and what to do on non-surf days. Also tell me the best months within the season for good waves with fewer crowds and better prices.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali Arts Festival — Culture Month in Denpasar.png ",
          label: "Bali Arts Festival — Culture Month in Denpasar",
          sublabel: "June to July · month-long festival",
          description: "A month of dance and music.",
          prompt:
            "I want to visit Bali during the Arts Festival in June–July. Explain what the month-long festival includes — dance, music, parades, and performances at the Denpasar cultural center. Is it good for first-time visitors, and what should I actually watch? Build me an itinerary around it with where to stay and how to combine Denpasar with Ubud and beach areas for a balanced trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali in Shoulder Season -- November.jpg ",
          label: "Bali in Shoulder Season — November",
          sublabel: "Softer prices, fewer crowds",
          description: "Lush green Bali, fewer crowds, softer prices.",
          prompt:
            "I want to travel to Bali in November and understand the wet season properly. Tell me how the weather actually behaves, which parts of Bali are best during this time, how crowds and prices compare to peak season, and what experiences improve because of the rain and greenery. Build me a November itinerary that balances rain-friendly activities with outdoor sightseeing and beach time.",
        },
      ],
    },
    row3: {
      heading: "TTW's Bali Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/First Time in Bali.jpg",
          label: "First Time in Bali",
          sublabel: "All Areas · First Timer",
          description: "The Bali trip everyone imagines.",
          prompt:
            "I am visiting Bali for the first time and want the perfect mix of Ubud, beaches, sunsets, temples, and day trips without the trip feeling rushed. Build me a 7-day itinerary with the right split between Ubud and the south coast, help me choose between Seminyak and Canggu, and tell me whether places like Uluwatu and Nusa Penida are worth fitting in. Include transport, what to pre-book, and realistic mid-range costs from India. I also want to understand how much time is realistically spent in traffic between areas and which experiences are genuinely worth prioritising on a first trip versus what is mostly social media hype.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali With Kids.png",
          label: "Bali With Kids",
          sublabel: "Family · All Ages",
          description: "Relaxed Bali days that work for everyone.",
          prompt:
            "I want to plan a Bali family trip for 2 adults and 2 kids aged 6–12 that genuinely works for children as well as adults. Build me an easy-paced 8-day itinerary with family-friendly beaches, activities like the Monkey Forest and cooking classes, and resorts with proper kids facilities. Also tell me which cultural experiences children actually enjoy, what food works well for kids in Bali, and how to plan around the heat and travel time. Help me understand which beach areas are safest and calmest for families, and whether it is better to stay mostly in one place or split the trip between Ubud and the coast.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali Honeymoon.jpg",
          label: "Bali Honeymoon",
          sublabel: "Romantic · Luxury",
          description: "Private villas and slow sunsets.",
          prompt:
            "I want to plan a Bali honeymoon that feels romantic, luxurious, and genuinely memorable instead of just another beach holiday. Build me an 8-day itinerary with a private pool villa in Ubud, beachside luxury in Seminyak or Uluwatu, couples experiences worth booking ahead, and the right balance of relaxation and sightseeing. Also explain which villa areas feel the most private and which beach locations are better for romance versus nightlife. I want the trip to flow smoothly without constant hotel changes or long travel days, so help me understand the best route and what experiences are actually worth the splurge for a honeymoon.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali for Wellness and Yoga.jpg",
          label: "Bali for Wellness and Yoga",
          sublabel: "Wellness · Ubud",
          description: "Retreat, reset, actually rest.",
          prompt:
            "I want to plan a Bali trip focused on wellness, yoga, and slowing down properly rather than just doing occasional spa treatments. Build me a 7-day itinerary around Ubud with yoga retreats, sound healing, rice field walks, healthy cafes, and spiritual experiences like Tirta Empul. Also explain the difference between staying at a wellness retreat versus booking a villa and attending classes separately, and what a realistic mid-range wellness trip costs. I also want to know which parts of Ubud feel the quietest and most peaceful, and whether wellness-focused Bali trips genuinely feel restorative or are often more commercial than they look online.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali and Lombok -- Two Islands.jpg ",
          label: "Bali and Lombok — Two Islands",
          sublabel: "Both Islands · Beach",
          description: "Bali for culture. Lombok for quiet.",
          prompt:
            "I want to combine Bali and Lombok in one 10-day trip and experience both islands properly without spending half the holiday in transit. Build me the full itinerary with time in Ubud and Bali's beaches before heading to Lombok and the Gili Islands. Help me choose between Gili Trawangan, Gili Air, and Gili Meno based on the vibe I want, explain what the fast boat journey is actually like, and include realistic mid-range costs and travel logistics throughout the trip. I also want to understand how different Lombok actually feels from Bali, whether it is worth the extra travel time, and how to structure the trip so it feels relaxed rather than constantly moving between islands.",
        },
      ],
    },
    row4: {
      heading: "Only in Bali — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Tegallalang Before the Crowds.jpg ",
          label: "Tegallalang Before the Crowds",
          tags: "Nature · Ubud",
          description: "The quiet side of Bali.",
          prompt:
            "I want to walk through the Tegallalang Rice Terraces at sunrise before the crowds and drone photographers arrive. Tell me what the experience actually feels like in the early morning, which route gives the best views without being too crowded, how long the full walk takes, and what the entry fee situation is now. Recommend a good local breakfast spot after the walk, explain how to get there independently from Ubud, and show me how this fits naturally into a relaxed 3-night Ubud itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/The Cooking Class Worth Doing.jpg ",
          label: "The Cooking Class Worth Doing",
          tags: "Food · Ubud",
          description: "Learn real Balinese cooking.",
          prompt:
            "I want to do a proper Balinese cooking class in Ubud that feels authentic rather than overly touristy. Tell me which cooking schools include the market visit, traditional spice pastes, and classic dishes like satay lilit and black rice pudding instead of just basic fried rice. Explain what the experience costs, how long it runs, whether recipe books are included, and how to tell which classes genuinely teach Balinese food culture. Also help me plan the rest of the day around the class.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Mount Batur at Sunrise.jpg ",
          label: "Mount Batur at Sunrise",
          tags: "Trekking · North Bali",
          description: "Bali's most famous sunrise trek.",
          prompt:
            "I want to trek Mount Batur for sunrise and know honestly what the experience is like from start to finish. Tell me how difficult the climb actually is, what the 2am wake-up and hike in the dark feel like, whether a guide is mandatory, and if it is manageable for someone reasonably fit but not a regular trekker. Explain the sunrise views from the crater, the volcanic steam vents, and how to combine the trek with the nearby hot springs afterward without ruining the rest of the day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Uluwatu’s Kecak Fire Dance.jpg ",
          label: "Uluwatu's Kecak Fire Dance",
          tags: "Culture · Uluwatu",
          description: "The performance everyone remembers.",
          prompt:
            "I want to experience the Kecak Fire Dance at Uluwatu Temple at sunset and do it properly rather than just showing up randomly. Tell me what the performance is actually like, how the Ramayana story is presented through chanting instead of instruments, and what makes the sunset setting so special. Explain the best seating options, how early I should arrive, whether premium seats are worth it, and how to combine the evening with the temple visit and a good clifftop dinner nearby.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Private Villas in Bali — Worth It_.jpg ",
          label: "Private Villas in Bali — Worth It?",
          tags: "Villas · Luxury Stay",
          description: "Your own pool changes the trip.",
          prompt:
            "I want to stay in a private Bali villa with a pool instead of regular hotels and understand whether it is genuinely worth the money. Tell me the difference between staying in a jungle-style villa in Ubud versus a beach villa in Seminyak or Uluwatu, what is usually included in the stay, and what realistic mid-range versus luxury pricing looks like. Explain which booking platforms are reliable, what to check before confirming a villa, and whether splitting my trip between two villa locations makes more sense than staying in one place for the full trip.",
        },
      ],
    },
  },
  travellerStories: baliTravellerStories,
};

const BaliUncoveredThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={baliThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(BaliUncoveredThemePage);
