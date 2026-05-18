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
          "We want a romantic Bali honeymoon that feels luxurious and seamless. Build a 7–10 day itinerary with private pool villas, sunsets, spa experiences, cafes, beach clubs, and key experiences. Help us choose between Ubud, Seminyak, Uluwatu, and quieter islands, and what's worth splurging on vs overrated.",
      },
      {
        icon: "🌴",
        label: "Bali for first-timers — what is actually worth it?",
        prompt:
          "I want a first-time Bali itinerary that shows only what's truly worth doing. Build a balanced plan covering key temples, beaches, Nusa Penida, food spots, and sunsets. Tell me what to skip, how many places to stay in, and how to avoid a rushed, over-touristy trip.",
      },
      {
        icon: "💰",
        label: "Bali with a Rs 60,000 budget — is it realistic?",
        prompt:
          "I want to plan a Bali trip on a ₹60,000 per person budget including flights. Tell me what 7–8 days realistically looks like, where to stay in Ubud and Seminyak, how to travel cheaply, and build a full day-by-day itinerary with where to spend and where to save.",
      },
      {
        icon: "✨",
        label: "I want the luxury Bali everyone talks about",
        prompt:
          "I want a luxury Bali trip that actually feels worth it. Build a 7–9 day itinerary with cliffside resorts, private villas, fine dining, beach clubs, and wellness experiences. Help me choose between Uluwatu, Seminyak, and Ubud, and highlight what's truly worth the hype vs what's not.",
      },
    ],
  },
  rows: [
    {
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
            "I want to spend 3 nights in Ubud and use the time well. Build a day-by-day plan covering Tegallalang sunrise, Tirta Empul purification ritual, Monkey Forest, and a local cooking class with market visit. Include the best area to stay and realistic costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Seminyak -- Beach Clubs and Sunset.jpg ",
          label: "Seminyak — Beach Clubs and Sunset",
          tags: "Beach · West Bali",
          description: "Sunsets, cocktails, and beach days.",
          prompt:
            "I want to spend 3 nights in Seminyak focused on beach clubs and sunsets. Build a plan covering the best clubs, timing for sunbeds, and what's actually worth it. Also explain food, shopping, nearby areas, and whether Seminyak is still worth visiting.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Canggu — Surf, Cafes, Slow Bali Days.jpg ",
          label: "Canggu — Surf, Cafes, Slow Bali Days",
          tags: "Surf · Lifestyle",
          description: "Coffee at 8. Surf at 9.",
          prompt:
            "I want to spend 4 nights in Canggu and understand what it's really like beyond Instagram. Include surf lessons, beginner beaches, good vs overrated cafes, Echo Beach, and how it compares to Seminyak for first-time visitors.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Uluwatu — Clifftop Sunsets and Surf.jpg ",
          label: "Uluwatu — Clifftop Sunsets and Surf",
          tags: "Scenic · South Bali",
          description: "The sunset nobody forgets.",
          prompt:
            "I want to spend 2 nights in Uluwatu for the temple and Kecak fire dance at sunset. Explain timing, seating, and experience. Include nearby surf spots, cliff warungs, and whether 2 nights is needed or a day trip is enough.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Nusa Penida -- Day Trip Done Right.jpg ",
          label: "Nusa Penida — Day Trip Done Right",
          tags: "Scenic · Island",
          description: "The views are worth the chaos.",
          prompt:
            "I want to do a proper Nusa Penida day trip from Bali. Build the full itinerary with fast boat timing, Kelingking viewpoint strategy, Broken Beach, and Angel's Billabong. Include transport options, costs, road conditions, and whether it fits a 7-night Bali trip.",
        },
        
      ],
    },
    {
      heading: "Bali Right Now",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Nyepi -- Bali Day of Silence.jpg",
          label: "Nyepi — Bali Day of Silence",
          sublabel: "Culture · March",
          description: "An entire island goes silent.",
          prompt:
            "I want to be in Bali during Nyepi. Explain what the 24-hour silence feels like, the Ogoh-Ogoh parades before it, and what is allowed or restricted for tourists. Build a full itinerary showing when to arrive and how to plan before and after the day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Galungan — Bali’s Most Sacred Festival.jpg ",
          label: "Galungan — Bali's Most Sacred Festival",
          sublabel: "Culture · Balinese Calendar",
          description: "Bali covered in bamboo offerings.",
          prompt:
            "I want to experience Galungan in Bali. Explain what the festival looks like with penjor decorations and temple rituals, when it happens next, and what tourists can respectfully see. Build a 5–7 day itinerary around Ubud and Gianyar.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Surf Season — Bali’s Best Waves.jpg",
          label: "Surf Season — Bali's Best Waves",
          sublabel: "Surf · Dry Season",
          description: "Clean waves, warm water, all day in the ocean.",
          prompt:
            "I want a surf-focused Bali trip during the dry season. Explain surf conditions for beginners to advanced across Canggu, Uluwatu, and Keramas. Build a 7-day surf itinerary with stays, daily surf spots, lesson costs, and the best months for waves and fewer crowds.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali Arts Festival — Culture Month in Denpasar.png ",
          label: "Bali Arts Festival — Culture Month in Denpasar",
          sublabel: "Culture · Annual",
          description: "A month of dance and music.",
          prompt:
            "I want to visit Bali during the Arts Festival. Explain what the festival includes and what is worth watching. Build a 7-day itinerary combining Denpasar events with Ubud and beach stays for a balanced cultural and leisure trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali in Shoulder Season -- November.jpg ",
          label: "Bali in Shoulder Season — November",
          sublabel: "Travel Tip · November",
          description: "Lush green Bali, fewer crowds, softer prices.",
          prompt:
            "I want to travel to Bali in November and understand the wet season properly. Explain weather patterns, best areas to stay, crowd levels, and what improves during this season. Build a 7-day itinerary balancing rain-friendly experiences and outdoor activities.",
        },
      ],
    },
    {
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
            "I want my first Bali trip to include Ubud, beaches, sunsets, temples, and day trips without feeling rushed. Build a 7-day itinerary with the right split, help me choose between Seminyak and Canggu, and tell me if Uluwatu and Nusa Penida are worth adding. Include transport time, key bookings, and what's actually worth prioritising.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali With Kids.png",
          label: "Bali With Kids",
          sublabel: "Family · All Ages",
          description: "Relaxed Bali days that work for everyone.",
          prompt:
            "I want to plan a Bali family trip for 2 adults and 2 kids (6–12 years). Build an easy 8-day itinerary with safe beaches, Monkey Forest, cooking classes, and kid-friendly resorts. Include what children will actually enjoy, food options, and whether to stay in one place or split between Ubud and the coast.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali Honeymoon.jpg",
          label: "Bali Honeymoon",
          sublabel: "Romantic · Luxury",
          description: "Private villas and slow sunsets.",
          prompt:
            "I want to plan a romantic Bali honeymoon that feels luxurious and memorable. Build an 8-day itinerary with a private Ubud villa, Seminyak or Uluwatu beach stay, and key couple experiences. Include the best areas for privacy, romance vs nightlife, and how to avoid too many hotel changes.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali for Wellness and Yoga.jpg",
          label: "Bali for Wellness and Yoga",
          sublabel: "Wellness · Ubud",
          description: "Retreat, reset, actually rest.",
          prompt:
            "I want a Bali wellness trip focused on yoga, healing, and slowing down. Build a 7-day Ubud itinerary with retreats, sound healing, rice fields, cafes, and spiritual experiences like Tirta Empul. Also explain retreat vs villa stays, realistic costs, and whether wellness Bali feels truly restorative.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Bali and Lombok -- Two Islands.jpg ",
          label: "Bali and Lombok — Two Islands",
          sublabel: "Both Islands · Beach",
          description: "Bali for culture. Lombok for quiet.",
          prompt:
            "I want to combine Bali and Lombok in a 10-day trip without wasting time in transit. Build an itinerary covering Ubud, Bali beaches, and Lombok/Gili Islands. Help me choose between Gili T, Air, and Meno, explain fast boat travel, costs, and whether Lombok is worth adding compared to staying only in Bali.",
        },
      ],
    },
    {
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
            "I want to walk through Tegallalang Rice Terraces at sunrise before crowds arrive. Describe the early morning experience, best walking routes, timing, entry fees, and how long it takes. Include how to reach from Ubud, a good breakfast stop, and how to fit this into a relaxed Ubud itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/The Cooking Class Worth Doing.jpg ",
          label: "The Cooking Class Worth Doing",
          tags: "Food · Ubud",
          description: "Learn real Balinese cooking.",
          prompt:
            "I want to do an authentic Balinese cooking class in Ubud. Tell me which ones include market visits, traditional spice pastes, and real local dishes. Explain duration, cost, what you learn, how to spot authentic classes, and how to plan the rest of the day around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Mount Batur at Sunrise.jpg ",
          label: "Mount Batur at Sunrise",
          tags: "Trekking · North Bali",
          description: "Bali's most famous sunrise trek.",
          prompt:
            "I want to trek Mount Batur for sunrise and understand the real experience. Explain difficulty level, 2am start, guide requirements, safety, and fitness needed. Include sunrise views, volcanic features, and how to combine it with hot springs afterward.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Uluwatu’s Kecak Fire Dance.jpg ",
          label: "Uluwatu's Kecak Fire Dance",
          tags: "Culture · Uluwatu",
          description: "The performance everyone remembers.",
          prompt:
            "I want to experience the Kecak Fire Dance at Uluwatu Temple properly. Explain the performance, Ramayana storytelling, sunset setting, seating options, and entry timing. Include whether premium seats are worth it and how to plan dinner nearby.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/bali-theme-2026/Private Villas in Bali — Worth It_.jpg ",
          label: "Private Villas in Bali — Worth It?",
          tags: "Villas · Luxury Stay",
          description: "Your own pool changes the trip.",
          prompt:
            "I want to stay in a private Bali villa and understand if it's worth it. Compare Ubud jungle villas vs Seminyak/Uluwatu beach villas, pricing, inclusions, and booking tips. Also explain whether splitting stays across locations is better than staying in one villa.",
        },
      ],
    },
  ],
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
