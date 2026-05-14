// pages/theme/thailand-trip-that-has-everything.tsx

import { useEffect } from "react";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import thailandTravellerStories from "../../data/thailandTravellerStories";

const thailandThemeConfig: ThemeConfig = {
  welcome: {
    subtitle: "Thailand has a version for everyone. Let's find yours.",
    promptChips: [
      {
        icon: "🏝️",
        label: "Which Thai islands are actually worth it in 2026?",
        prompt:
          "I want to spend time on the Thai islands but I am overwhelmed by the options — Phuket, Koh Samui, Koh Phi Phi, Koh Lanta, Koh Tao, Koh Phangan, the Similan Islands. Help me choose the right ones for a first trip. Tell me honestly what each island is known for, which ones are overcrowded and which ones still feel unspoilt, which are best for snorkelling and diving versus beach relaxation versus nightlife, and which combinations work well together without too much boat or ferry time. I have 5 to 6 nights for the island portion of my trip. Build me the island itinerary that fits what I want.",
      },
      {
        icon: "💍",
        label: "Design a Thailand Honeymoon with Bangkok & Chiang Mai",
        prompt:
          "I want to plan a honeymoon in Thailand covering Bangkok and Chiang Mai, and understand how each city fits into a romantic, slow-paced trip. Explain how Bangkok feels for couples (luxury stays, rooftop dinners, river evenings) versus Chiang Mai (quiet stays, nature, culture), and how many nights each deserves. Help me choose between flight or overnight train between the two, then build a day-by-day honeymoon itinerary for both cities with romantic experiences, slow pacing, and one or two special moments worth planning the day around. Finally, show how these two cities fit into an 8–10 day Thailand honeymoon with a beach ending, and suggest the best travel order so the trip flows from city to calm to coast.",
      },
      {
        icon: "🗺️",
        label: "Build me a 10-day Thailand itinerary from scratch",
        prompt:
          "I have 10 days in Thailand and I want the classic combination done properly — Bangkok for the culture and the food, the north for the temples and the slower pace, and the south for the islands and the beach. Tell me honestly whether 10 days is enough to do all three or whether I should drop one. If all three work, build me the day-by-day: how many nights in each region, the best way to travel between them, which islands work best as a finale, and what to book in advance. Include the total cost per person at mid-range including flights from India, internal flights within Thailand, and accommodation.",
      },
      {
        icon: "💰",
        label: "Thailand on a budget — what does Rs 80,000 get me?",
        prompt:
          "I want to plan a Thailand trip for around Rs 80,000 per person including return flights from India. Tell me honestly what this budget can build for 8 to 10 days: which islands are affordable versus which ones are now expensive, what mid-range accommodation looks like in Bangkok versus Koh Lanta versus Chiang Mai, where Thai street food keeps costs low and where tourist restaurants drain the budget fast. Build me the actual itinerary at this budget — day-by-day, accommodation type per stop, how to travel between cities and islands cheaply, and where spending a little more genuinely changes the experience versus where cheap is completely fine.",
      },
    ],
  },
  rows: {
    row1: {
      heading: "From Bangkok to the Islands",
      icon: "🌴",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Bangkok — Streets to Skybars.jpg ",
          label: "Bangkok — Streets to Skybars",
          tags: "City · Food",
          description: "A city worth three days.",
          prompt:
            "I want to spend 3 full days in Bangkok and experience it as a destination, not just a stop before the islands. Build me a smart day-by-day itinerary with the city's best mix of culture, food, and atmosphere. Include the Grand Palace and Wat Pho at the right time of day, a canal boat or river experience, rooftop skyline views, Chinatown street food at night, and neighbourhoods like Thonglor or Ari that show modern Bangkok beyond tourist zones. Tell me which area is best to stay in for first-timers, how BTS Skytrain, river boats, Grab, and taxis should actually be used, what to book in advance, and what to eat for breakfast, lunch, and dinner that is specific to Bangkok. Also show how Bangkok fits smoothly into a wider Thailand route with Chiang Mai or the islands.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/ChiangRai.jpg ",
          label: "Chiang Mai — Slow Northern Thailand",
          tags: "Culture · North Thailand",
          description: "A calmer side of Thailand.",
          prompt:
            "I want to spend 3 nights in Chiang Mai and experience a slower, more cultural side of Thailand that feels very different from Bangkok. Build me a smart day-by-day itinerary with the best temples, Old City streets, night markets, northern Thai food, and mountain views from Doi Suthep. Include one cooking class that is genuinely worth doing and explain what the experience usually involves. Also recommend the best ethical elephant sanctuary options that do not allow riding, compare Chiang Mai costs honestly with Bangkok, and tell me whether it makes more sense to arrive by overnight train or short flight as part of a wider Thailand trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Koh Lanta — Quiet Island Escape.png ",
          label: "Koh Lanta — Quiet Island Escape",
          tags: "Beach · Relaxed",
          description: "Thailand beaches without crowds.",
          prompt:
            "I want to spend 4 nights on Koh Lanta and understand why repeat Thailand travellers choose it over Phuket or Phi Phi. Build me a relaxed itinerary with the best part of the island to stay in depending on whether I want sunsets, convenience, or local character. Include beach time, good cafés and seafood spots, sunset bars, and one snorkelling or island-hopping trip that is genuinely worth the day. Tell me the best months to visit, when the island becomes too wet or quiet, how to get there smoothly from Bangkok or Krabi, whether I need a scooter to enjoy the island properly, and how Koh Lanta fits into a wider Thailand beach trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/ChiangMai.jpg ",
          label: "Chiang Rai — Thailand's Artistic North",
          tags: "Culture · Offbeat",
          description: "Temples, art, and the far north.",
          prompt:
            "I want to spend 2 nights in Chiang Rai as part of a northern Thailand trip and see whether it is worth more than a quick day trip from Chiang Mai. Build me a clear itinerary including the White Temple at the best time to visit, the Blue Temple, Black House Museum, and whether the Golden Triangle is genuinely worth the journey or just a quick photo stop. Tell me how to travel there from Chiang Mai, whether it is better as an overnight stay or day trip, what Chiang Rai feels like in the evenings, where to stay, and how this stop fits logically into a Chiang Mai-based Thailand itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Koh Tao — The Underwater Side of Thailand.jpg ",
          label: "Koh Tao — The Underwater Side of Thailand",
          tags: "Diving · Island",
          description: "Thailand's best island for diving.",
          prompt:
            "I want to spend 4 to 5 nights on Koh Tao and complete my PADI Open Water dive certification while still enjoying the island. Build me a realistic trip around the course schedule — how many days training takes, what each day usually involves from classroom theory to pool sessions to open-water dives, and how much free time I will actually have. Recommend the best dive schools for beginners with strong safety reputations, where to stay depending on whether I want nightlife or quiet beaches, and what to do in the evenings after diving. Tell me the honest total cost including certification, equipment, accommodation, and meals. Also explain visibility, marine life, best months to dive, whether Koh Tao is worth visiting without diving, and how to combine it smoothly with Koh Samui or Koh Phangan.",
        },
      ],
    },
    row2: {
      heading: "Thailand Right Now",
      icon: "🎉",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Songkran — Thailand’s Biggest Festival.png ",
          label: "Songkran — Thailand's Biggest Festival",
          sublabel: "Book by January — Chiang Mai fills 3 months out",
          description: "Biggest water fight on earth.",
          prompt:
            "I want to be in Thailand for Songkran — the Thai New Year water festival in April — and I want to plan the trip properly around it. Tell me where the best Songkran celebration happens: Bangkok's Silom Road for the largest city celebration, Chiang Mai for the more traditional version in the old city moat, or the beach towns for the party version. Build me the trip around it: which city to be in for the main 3-day festival, what Songkran actually involves beyond the water fights — the temple visits, the sand stupas, the respect ceremonies — and how to enjoy it without losing my phone to a water cannon. What do I book in advance because accommodation in Chiang Mai during Songkran fills 3 months out?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Loy Krathong — Thailand’s Most Beautiful Night.jpg ",
          label: "Loy Krathong — Thailand's Most Beautiful Night",
          sublabel: "November · book the lantern release early",
          description: "Thousands of lanterns. One night.",
          prompt:
            "I want to plan a Thailand trip around Loy Krathong and Yi Peng in November and make the festival the highlight of my itinerary. Build me the best 7 to 10 day route based around the festival dates, including whether I should stay in Chiang Mai for the famous sky lantern experience or choose Bangkok or Sukhothai for a more traditional Loy Krathong celebration. Explain what actually happens during the festival — floating krathongs on the river, lantern ceremonies, temple events, night markets, and how Chiang Mai's Yi Peng differs from the rest of Thailand. Tell me where to stay, how many nights to spend in each place, where to watch the lantern release legally and safely, what needs booking months in advance, and create a full itinerary that combines the festival with the best of Thailand in November.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Vegetarian Festival — Phuket Experience.png ",
          label: "Vegetarian Festival — Phuket Experience",
          sublabel: "October · 9 days of rituals",
          description: "Nine days of rituals in Phuket.",
          prompt:
            "I want to plan a trip to Phuket around the Vegetarian Festival in October and understand it properly before I go. Build me a clear itinerary that fits the 9-day festival period, including how many days I should stay in Phuket to experience the key events without burnout. Explain what actually happens during the festival. Help me understand what is appropriate for visitors to watch, where to be based in Phuket, and how intense the atmosphere gets in different parts of town. Also include what to do in Phuket beyond the festival (Old Town cafés, viewpoints, beaches), and how to combine this trip with nearby islands like Phi Phi, Krabi, or Koh Yao Noi for a balanced southern Thailand itinerary.",
        },
        {
          image:
           "https://i.travelapi.com/lodging/5000000/4310000/4303800/4303775/2043dea5_b.jpg",
          label: "Thailand Islands at Their Best",
          sublabel: "Peak weather window · book early",
          description: "When Thailand feels like paradise.",
          prompt:
            "I want to plan a Thailand island trip during the best weather window when the Andaman Sea is at its clearest, the water is calm, and island hopping by speedboat or ferry is smooth and reliable. I want to understand how the experience changes during this peak season in terms of sea conditions, snorkelling visibility, ease of travel between islands, and crowd levels, especially which islands still feel enjoyable versus which ones become too overrun. Based on this, build me a complete island itinerary with the best possible route across islands, how many nights to spend in each place, where to stay for mid-range and premium budgets, how to move between islands efficiently, and what needs to be booked in advance as soon as travel dates are fixed, focusing on a logical, well-paced island-hopping flow rather than isolated stops.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Full Moon Party -- Koh Phangan.webp ",
          label: "Full Moon Party — Koh Phangan",
          sublabel: "Monthly · plan around the moon",
          description: "Music, fire, and endless night.",
          prompt:
            "I want to plan a 7-day Gulf of Thailand island trip built around the Full Moon Party on Koh Phangan and understand whether it is still worth structuring an entire itinerary around it in 2026. Tell me honestly what the Full Moon Party is like today — crowd size, music zones, beach layout at Haad Rin, how intense the night actually gets, and whether it still feels special or has become too chaotic and commercial. Compare it with alternatives like Half Moon or Jungle Party for someone who wants the atmosphere without losing control of the night. Then build me a logical 7-day island route across Koh Samui, Koh Phangan, and Koh Tao, including how many nights to spend on each island before and after the party, how to travel between them by ferry or speedboat, where to base myself for different vibes (relaxed arrival, party night, and recovery/diving days), and what safety, timing, and accommodation issues to plan for around the event so the trip flows smoothly rather than revolving only around one night.",
        },
      ],
    },
    row3: {
      heading: "TTW's Thailand Themes",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/First Time in Thailand.jpg ",
          label: "First Time in Thailand",
          sublabel: "All Regions · First Timer",
          description: "City, culture, and beaches in one trip.",
          prompt:
            "I am visiting Thailand for the first time and I want to see the full picture — the city, the culture, and the beach. Build me the classic 10-day first-timer itinerary that gets the balance right: Bangkok for 3 nights to open the trip, Chiang Mai for 2 nights to experience a completely different side of the country, and the southern islands for 4 nights to finish. Tell me which islands work best as a finale for a first visit — easy to reach from Bangkok and genuinely beautiful without needing a 3-hour ferry. Include the day-by-day, how to travel between each region, what to book before I leave India, and the total cost per person at mid-range including return flights.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand With Kids.png ",
          label: "Thailand With Kids",
          sublabel: "Family · All Ages",
          description: "Fun beaches, wildlife, and family time.",
          prompt:
            "I want to plan a Thailand family trip for 2 adults and 2 children aged 7 to 12 that is genuinely fun for the kids and not just for us. Build me the 10-day itinerary: Bangkok for 2 nights with the things that actually hold a child's attention — the Grand Palace, a Thai cooking class for kids, a longtail boat ride through the canals. An ethical elephant sanctuary near Chiang Mai where the children walk with elephants rather than ride them. And a beach finish on an island that has calm shallow water and activities beyond lying down. Tell me which islands are the most family-friendly, which accommodation type works best with young children in Thailand, and how to handle the heat and the food for kids who may not eat everything.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand Honeymoon.png ",
          label: "Thailand Honeymoon",
          sublabel: "Romantic · Beach + Culture",
          description: "Romance, culture, and island luxury.",
          prompt:
            "I want to plan a Thailand honeymoon that has both the cultural depth and the luxury beach finish. Build me the 10-day itinerary: 2 nights in Bangkok at a hotel that feels genuinely special rather than just central, 2 nights in Chiang Mai at a boutique resort outside the old city with a rice field view, and 5 nights on the islands at a property with a private pool and direct beach access. Tell me which island delivers the honeymoon experience — Koh Yao Noi between Phuket and Krabi for the quiet luxury, or Koh Lipe for the turquoise water, or Koh Samui for the range of premium resorts. Include specific hotel recommendations at each stop, what to spend on versus where to save, and the full cost per person at premium.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thailand for Foodies.jpg ",
          label: "Thailand for Foodies",
          sublabel: "Food · Street to Fine",
          description: "Street food to cooking class.",
          prompt:
            "I want to plan a Thailand trip built around eating — not restaurants with Instagram ceilings, the food that Thailand is actually famous for. Build me the 10-day food itinerary: Bangkok's Chinatown street food lanes at night, a morning at Or Tor Kor market which is the best fresh market in the city, a Thai cooking class that covers the actual technique behind tom kha, pad see ew, and mango sticky rice. Then Chiang Mai for northern Thai food — khao soi is a completely different cuisine from Bangkok — and a cooking class that covers the northern dishes. Then one island stop where the seafood is grilled on the beach and the bill is still under 500 baht. Tell me what to eat specifically at each stop and what makes Thai regional food different from city to city.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Islands Only -- 10 Days.jpg",
          label: "Islands Only — 10 Days",
          sublabel: "Beach · Island Hopping",
          description: "Nothing but beaches and islands.",
          prompt:
            "I want to spend all 10 days of my Thailand trip on the islands — no Bangkok, no temples, just the Andaman Sea and the Gulf of Thailand. Build me the island-only itinerary that makes the most of the time: tell me whether to base myself on one island and do day trips or move between 3 different islands, which combination gives the best variety — different water colours, different vibes, one with good snorkelling and one with good nightlife and one where I can actually be quiet. Tell me honestly which islands are still worth visiting and which ones have been overbuilt, what the ferry and speedboat connections look like between my chosen islands, and the best way to fly in and out of Thailand for an island-first trip without routing through Bangkok unnecessarily.",
        },
      ],
    },
    row4: {
      heading: "Only in Thailand — Experiences Worth Flying For",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Muay Thai -- Train with a Real Coach.jpg ",
          label: "Muay Thai — Train with a Real Coach",
          tags: "Sport · Bangkok or Chiang Mai",
          description: "Not a show. An actual session.",
          prompt:
            "I want to do a real Muay Thai training session in Thailand with proper coaches, not a staged tourist experience. Help me choose the best beginner-friendly gyms in Bangkok or Chiang Mai where travellers can join one or two sessions. Explain what happens in a typical class — skipping warm-up, shadow boxing, pad work with a Thai trainer, technique drills, conditioning, and how intense it usually is for first-timers. Tell me how much sessions cost, what to wear, gym etiquette, whether complete beginners are welcome, and if private training is worth paying extra for. Also help me fit one training session into a Bangkok or Chiang Mai itinerary without it taking over the whole day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Thai Cooking Class — Chiang Mai Food Experience.png ",
          label: "Thai Cooking Class — Chiang Mai Food Experience",
          tags: "Food · Chiang Mai",
          description: "Learn the dishes Thailand is known for.",
          prompt:
            "I want to do the best Thai cooking class in Chiang Mai and choose one that is genuinely worth half a day, not a rushed tourist activity. Help me compare the top classes that include a market visit, herb garden or farm experience, small group sizes, and individual cooking stations rather than watching demonstrations. I want to learn dishes that actually matter in Thailand — khao soi, curry paste from scratch, mango sticky rice, stir-fries, soups, and northern Thai specialties. Tell me which cooking schools are most respected, what the morning vs evening classes are like, how long they run, what realistic prices look like, and what is included such as transfers or recipe books. Then build me a Chiang Mai itinerary around the class — what to do before it, what neighbourhood or café to visit afterwards, and how it fits perfectly into a 3-night Chiang Mai trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Overnight Train -- Bangkok to Chiang Mai.png ",
          label: "Overnight Train — Bangkok to Chiang Mai",
          tags: "Experience · Night Train",
          description: "Thailand's most popular train journey.",
          prompt:
            "I want to take the overnight sleeper train from Bangkok to Chiang Mai instead of flying and want to know if it is actually worth doing. Explain first class vs second class cabins, upper vs lower berths, comfort level, luggage storage, cleanliness, food onboard, and whether most travellers sleep well enough to enjoy the next day. Tell me departure and arrival times, how early I should reach the station, how to book tickets in advance, and whether this saves time or simply adds a memorable experience. Also compare it honestly with a short budget flight and tell me which option works better depending on my Thailand itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Similan Islands — Thailand’s Best Snorkelling.jpg ",
          label: "Similan Islands — Thailand's Best Snorkelling",
          tags: "Diving · Andaman Sea",
          description: "Clear water, reefs, and marine life.",
          prompt:
            "I want to build a Thailand beach trip around the Similan Islands because snorkelling, diving, and clear water are my priority. Plan me the best itinerary focused on this experience, including whether I should stay in Khao Lak or Phuket, how many nights I need, and whether to do a premium day trip or a liveaboard. Explain what the Similan Islands are actually like — reef quality, visibility, marine life, beaches, and how they compare with Phi Phi or other Thailand island tours. Tell me the best months to go, how many days to spend in the area, what else to combine nearby such as Khao Sok or Phuket, realistic mid-range and premium costs, and build me a full trip where the Similan Islands are the main highlight.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/thailand-theme-2026/Doi Inthanon - Thailand's Highest Point.jpg ",
          label: "Doi Inthanon — Thailand's Highest Point",
          tags: "Nature · Chiang Mai Day Trip",
          description: "Waterfalls, hill tribes, cold air.",
          prompt:
            "I want to do a day trip to Doi Inthanon from Chiang Mai and plan it properly so it feels worth the long day. Build me the best route covering the summit, Wachirathan waterfall, the twin royal pagodas, scenic viewpoints, short forest walks, and local hill tribe communities visited respectfully. Tell me the best time to leave Chiang Mai, how long each stop needs, and whether sunrise is worth the early start. Also explain whether self-driving is realistic or if a guided tour is better, what the road conditions are like, what temperatures feel like compared with Chiang Mai city, what to pack, and whether Doi Inthanon deserves a full day in a 3-night Chiang Mai trip.",
        },
      ],
    },
  },
  travellerStories: thailandTravellerStories,
};

const ThailandTripThatHasEverythingThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp themeConfig={thailandThemeConfig} />;
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ThailandTripThatHasEverythingThemePage);
