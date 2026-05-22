// pages/theme/perfect-proposal.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import kairaPerfectProposalTravellerStories from "../../data/kairaPerfectProposalTravellerStories";

const kairaPerfectProposalThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "Every love story deserves a perfect moment. We'll plan yours.",
    promptChips: [
      {
        icon: "💍",
        label: "Plan a Perfect Proposal in India (that actually feels worth it)",
        prompt:
          "I want to plan a romantic proposal in India that feels intimate and meaningful. Build a 5–7 day itinerary around Udaipur, Rajasthan, or Kerala with the perfect proposal moment, stay choice, and setup including décor and photography.",
      },
      {
        icon: "💸",
        label: "A Dream Proposal on a Real Budget (Rs 1.5L, no compromises that matter)",
        prompt:
          "I want to plan a full proposal trip within Rs 1.5 lakh, including flights, stay, and the proposal setup. Build a realistic itinerary, tell me the best destinations for this budget, and how to make the moment feel special without overspending.",
      },
      {
        icon: "✨",
        label: "A Luxury Proposal That Makes the \"Yes\" Even More Perfect",
        prompt:
          "I want a luxury proposal trip with private stays, fine dining, photography, and an unforgettable setup. Help me choose between Maldives, Santorini, Amalfi, Switzerland, or Bali, and build a 7–10 day itinerary focused on the perfect proposal moment.",
      },
      {
        icon: "🎬",
        label: "Proposal Spots That Look Straight Out of a Movie",
        prompt:
          "I want to plan a proposal at one of the world's most visually stunning locations. Shortlist places like Santorini, Cappadocia, Maldives, and Bali, and explain the real experience, crowds, cost, and which one fits my vibe best.",
      },
    ],
  },
  rows: [
    {
      heading: "Dream Proposal Spots Around the World",
      icon: "🌍",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Udaipur — Royal Lake Proposal.jpg ",
          label: "Udaipur — Royal Lake Proposal",
          tags: "Heritage · Royal · Rajasthan",
          description: "The most romantic city in India.",
          prompt:
            "I want to plan a 3-night proposal trip in Udaipur. Build a romantic itinerary covering City Palace, Lake Pichola sunset boat ride, and the best viewpoints. Include proposal setup ideas (rooftop dinner, lake setup, heritage stay), best stay area, and realistic mid-range vs luxury costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Santorini — Cliffside Sunset Proposal.jpg ",
          label: "Santorini — Cliffside Sunset Proposal",
          tags: "Iconic · Cliffside · Greece",
          description: "The sunset nobody forgets.",
          prompt:
            "I want to plan a 4-night Santorini proposal. Help me choose between Oia, Fira, and Imerovigli for the best vibe. Include cliffside dinners, photographer setup, sunset cruise vs terrace proposal, and real mid-range vs luxury costs with what's overpriced.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Cappadocia — Balloon Proposal at Sunrise.jpg ",
          label: "Cappadocia — Balloon Proposal at Sunrise",
          tags: "Surreal · Adventure · Romantic",
          description: "A sky full of forever.",
          prompt:
            "I want to plan a Cappadocia proposal around a sunrise hot air balloon ride. Explain the full experience, whether private balloons are possible, how proposals are arranged, and photographer setup. Also build a 4-night stay plan with cave hotels and key experiences.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Amalfi Coast — Cliffside Love Story.jpg ",
          label: "Amalfi Coast — Cliffside Love Story",
          tags: "Coastal · Luxury · Scenic",
          description: "Positano, pasta, and forever.",
          prompt:
            "I want to plan a 5-night Amalfi Coast proposal. Help me choose between Positano, Ravello, and Amalfi. Include boat cruise ideas, cliffside dinner spots, photographer setup, travel between towns, and realistic mid-range vs luxury costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Maldives — Private Ocean Proposal.jpg ",
          label: "Maldives — Private Ocean Proposal",
          tags: "Overwater · Isolated · Tropical",
          description: "Just us and the Ocean.",
          prompt:
            "I want to plan a Maldives proposal trip. Help me choose the right atoll and resort for privacy. Build a 5–7 day itinerary with overwater villa stay, sandbank proposal, sunset cruise, and photographer setup. Also explain speedboat vs seaplane resorts and total cost from India.",
        },
      ],
    },
    {
      heading: "Perfect Proposals in India",
      icon: "🇮🇳",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Jaipur — A Royal Fort Proposal.jpg ",
          label: "Jaipur — A Royal Fort Proposal",
          tags: "Heritage · Royal · Rajasthan",
          description: "Golden forts and grand gestures.",
          prompt:
            "I want to plan a proposal in Jaipur inside royal forts and palaces. Build a 3–4 day itinerary covering Amer Fort, City Palace, and a private heritage dinner. Include the best fort or palace proposal setups, photographer coordination, and stay options from boutique havelis to luxury palaces.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Kerala — A Private Backwater Proposal.jpg ",
          label: "Kerala — A Private Backwater Proposal",
          tags: "Nature · Backwaters · Intimate",
          description: "Just water, palms, and quiet love.",
          prompt:
            "I want to plan a romantic proposal in Kerala on a private houseboat. Build a 3–5 day itinerary covering Alleppey backwaters and a Munnar extension. Include houseboat setup options for proposal, best time of day, and mid-range vs luxury stay and boat experiences.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Goa — A Sunset Beach Proposal.jpg ",
          label: "Goa — A Sunset Beach Proposal",
          tags: "Beaches · Coastal · Romantic",
          description: "Golden sunsets made for two.",
          prompt:
            "I want to plan a beach proposal in Goa that feels private and romantic. Build a 3–4 day itinerary covering quiet beaches, sunset viewpoints, and beach dinners. Include the best hidden or less crowded beaches, proposal setup ideas, and stay options from boutique villas to luxury resorts.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Shimla–Manali — A Snowy Mountain Proposal.jpg ",
          label: "Shimla–Manali — A Snowy Mountain Proposal",
          tags: "Mountains · Scenic · Cozy",
          description: "Clouds, cabins, and forever moments.",
          prompt:
            "I want to plan a mountain proposal in Shimla or Manali. Build a 4–5 day itinerary with snowy viewpoints, pine forest stays, and cozy private setups. Include the best viewpoints for a proposal, boutique cottages vs luxury resorts, and the ideal season for the experience.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Udaipur — A Lake Palace Proposal.jpg ",
          label: "Udaipur — A Lake Palace Proposal",
          tags: "Heritage · Romantic",
          description: "Where palaces meet still waters.",
          prompt:
            "I want to plan a romantic proposal in Udaipur. Build a 3–4 day itinerary around Lake Pichola, City Palace, and sunset boat rides. Include intimate rooftop or lakeside proposal setups, photographer options, and mid-range to luxury stays.",
        },
      ],
    },
    {
      heading: "Proposal Right Now",
      icon: "🎐",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Cherry Blossom Proposals — Japan in Spring.jpg ",
          label: "Cherry Blossom Proposals — Japan in Spring",
          tags: "Spring · Seasonal · Culture",
          description: "Pink skies and eternal moments.",
          prompt:
            "I want to plan a proposal in Japan during cherry blossom season. Tell me the best timing, ideal cities like Kyoto and Tokyo, and the most romantic proposal spots. Build a 7-day itinerary with crowd-avoidance tips, photographer setup, and flexible planning around bloom changes.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Northern Lights Proposal — Iceland Winter Magic.jpg ",
          label: "Northern Lights Proposal — Iceland Magic",
          tags: "Iceland · Natural Phenomenon",
          description: "Dancing skies, frozen silence.",
          prompt:
            "I want to plan a proposal in Iceland under the Northern Lights. Tell me the best months and locations for aurora sightings, and build a 6–8 day itinerary covering glaciers, black sand beaches, and hot springs. Include the best proposal moments, how to chase the lights realistically, and backup plans if the aurora doesn't appear.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Great Migration Proposal — Kenya Safari.jpg ",
          label: "Great Migration Proposal — Kenya Safari",
          tags: "Safari · Wildlife · Kenya",
          description: "The wildest backdrop on earth.",
          prompt:
            "I want to plan a Kenya proposal during the Great Migration. Explain the safari experience, best lodges, balloon safaris, and private bush dinner setups. Build a romantic itinerary and include how to arrange a fully private proposal with photography.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Europe Summer Proposal — The Dream Route.jpg ",
          label: "Europe Summer Proposal — The Dream Route",
          tags: "Europe · Summer · Romantic",
          description: "Golden hour across continents.",
          prompt:
            "I want to plan a Europe summer proposal across Santorini, Amalfi, Provence, Venice, or Tuscany. Help me choose the best destination, explain crowd levels, and build a 10-day itinerary with ideal proposal moments, photographers, and realistic travel flow.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Thailand Beach Proposal — Perfect Escape.jpg ",
          label: "Thailand Beach Proposal — Perfect Escape",
          tags: "Thailand · Luxury-Budget",
          description: "Warm nights, clear water, perfect timing.",
          prompt:
            "I want to plan a Thailand proposal during peak season. Help me choose between Koh Lanta, Koh Samui, or Krabi islands. Build a 7-day itinerary with beach proposal setups, sunset cruises, private dinners, and which beaches feel truly private versus crowded.",
        },
      ],
    },
    {
      heading: "TTW's Proposal Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/The Classic Romantic — Paris, Tuscany, or Santorini.jpg ",
          label: "The Classic Romantic — Paris, Tuscany, or Santorini",
          tags: "Iconic · Timeless",
          description: "The proposal everyone pictures.",
          prompt:
            "I want to plan a classic romantic proposal in Paris, Tuscany, or Santorini and choose the one that fits us best. Explain what each destination feels like, the best proposal moments, crowd levels, and cost differences. Then build a 6–8 day itinerary for the one we pick with stay, photographer, and setup.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/The Adventure Proposal — Kenya, Nepal, or Patagonia.jpg ",
          label: "The Adventure Proposal — Kenya, Nepal, or Patagonia",
          tags: "Adventure · Wild",
          description: "For the couple that never sits still.",
          prompt:
            "I want to plan an adventure proposal in Kenya, Nepal, or Patagonia. Help me choose the best destination and explain what the proposal experience actually involves, difficulty level, photographer feasibility, and cost. Then build a complete itinerary around the proposal moment.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/The India Royal Proposal — Rajasthan Palace Circuit.jpg ",
          label: "The India Royal Proposal — Rajasthan Circuit",
          tags: "India · Heritage · Royal",
          description: "A fairytale written in forts and palaces.",
          prompt:
            "I want to plan a royal Rajasthan proposal across Jaipur, Jodhpur, and Udaipur. Build a 7–9 day itinerary with palace stays, fort dinners, and desert experiences. Include the best proposal setup option, photographer, and the right mid-range vs luxury experience.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/The Wellness Proposal — Bali, Kerala or Sri Lanka.jpg ",
          label: "The Wellness Proposal — Bali, Kerala or Sri Lanka",
          tags: "Wellness · Intimate",
          description: "Slow down, feel everything, say yes.",
          prompt:
            "I want to plan a calm, wellness-focused proposal in Bali, Kerala, or Sri Lanka. Help me choose the best destination and build a 7-day itinerary with retreats, spa days, cultural experiences, and a private, intimate proposal setup in a natural setting.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/The Budget Proposal That Feels Luxury — Southeast Asia.jpg ",
          label: "The Budget Proposal That Feels Luxury — Southeast Asia",
          tags: "Thailand · Vietnam · Malaysia",
          description: "Big moments, smart spending.",
          prompt:
            "I want to plan a romantic proposal in Southeast Asia on a budget of Rs 1.2–1.5 lakh for two. Help me choose between Vietnam, Thailand, or Malaysia and build a 6–8 day itinerary with the best value destination, proposal setup, and where to spend vs save without losing romance.",
        },
      ],
    },
    {
      heading: "Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Cappadocia Balloon Sunrise Proposal.jpg ",
          label: "Cappadocia Balloon Sunrise Proposal",
          tags: "Adventure · Iconic · Romantic",
          description: "A sunrise above another world.",
          prompt:
            "I want to propose in a Cappadocia hot air balloon and understand the full experience before booking. Explain the flight, timing, private vs shared baskets, photographer setup, and weather risks. Also build a 4–5 day itinerary around cave hotels, viewpoints, and key experiences.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Santorini Cliffside Dinner Proposal.jpg ",
          label: "Santorini Cliffside Dinner Proposal",
          tags: "Sunset · Cliffside · Greece",
          description: "The view that says yes before you do.",
          prompt:
            "I want to plan a private caldera sunset proposal in Santorini. Help me choose between Oia, Imerovigli, and Firostefani, and explain the best setup — restaurants vs private villa dinners. Include photographer timing, crowd-free options, and a smooth 5-day itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Kenya Mara Sundowner Proposal.png ",
          label: "Kenya Mara Sundowner Proposal",
          tags: "Safari · Sundowner · Wild",
          description: "Just you, the savannah, and the sunset.",
          prompt:
            "I want to propose during a Masai Mara sundowner. Explain how private bush setups work, what's included, how photographers are arranged, and which safari camps offer the most intimate experiences. Build a 5–7 day Kenya itinerary around this moment.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Venice Gondola Proposal Experience.jpg ",
          label: "Venice Gondola Proposal Experience",
          tags: "Venice · Italy · Classic",
          description: "The most copied proposal in history.",
          prompt:
            "I want to know if a Venice gondola proposal is still romantic in 2026. Explain the real experience, privacy levels, costs, and crowd situation. If it still works, tell me how to make it intimate. If not, suggest better Venice proposal alternatives.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/perfect-proposal-2026/Maldives Overwater Villa Proposal.png ",
          label: "Maldives Overwater Villa Proposal",
          tags: "Maldives · Overwater · Private",
          description: "Your own island, your own moment.",
          prompt:
            "I want to plan a Maldives overwater villa proposal and understand if it's worth the cost. Explain speedboat vs seaplane resorts, what proposal setups look like, and which resorts do it best. Build a 5–6 day itinerary with realistic choices for different budgets.",
        },
      ],
    },
  ],
  travellerStories: kairaPerfectProposalTravellerStories,
};

const KairaPerfectProposalThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={kairaPerfectProposalThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(KairaPerfectProposalThemePage);
