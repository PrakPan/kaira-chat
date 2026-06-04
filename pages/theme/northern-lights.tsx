// pages/theme/northern-lights.tsx

import { useEffect } from "react";
import Head from "next/head";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import northernLightsTravellerStories from "../../data/northernLightsTravellerStories";

const northernLightsThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "You can't time the sky. But you can prepare for the moment it comes alive.",
    promptChips: [
      {
        icon: "🌍",
        label: "Which country is best for the northern lights?",
        prompt:
          "I want to see the northern lights and I cannot choose between Finland, Norway, Iceland, and Sweden. Tell me honestly what each delivers differently — aurora probability, accommodation, activities, and price. Then recommend the best one for me and build the itinerary.",
      },
      {
        icon: "✨",
        label: "Build me the ultimate luxury aurora journey",
        prompt:
          "I want a luxury northern lights trip with the highest possible chance of seeing the aurora. Suggest the best destinations, months, and trip length, along with premium stays like glass igloos or luxury Arctic lodges. Include how expert guides maximise sightings and then design a high-end itinerary focused on giving me the best odds of seeing the lights at least once.",
      },
      {
        icon: "🛖",
        label: "Glass igloo or glamping — which is worth it?",
        prompt:
          "I want to sleep somewhere I can watch the aurora from bed. Tell me the honest difference between a glass igloo in Finland and an aurora glamping cabin in Norway — cost, comfort, sky visibility, and surrounding activities. Then recommend one and build the 4-night itinerary.",
      },
      {
        icon: "💰",
        label: "Northern lights trip — what does it cost from India?",
        prompt:
          "I want to plan a northern lights trip from India and understand the real numbers. Break down the full cost for 5 nights: flights, accommodation, activities, and food. Give me the total at mid-range and what the honest minimum is for a trip that actually delivers.",
      },
    ],
  },
  rows: [
    {
      heading: "How You Want to Experience It",
      icon: "🌌",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Sleep Beneath The Aurora.jpg ",
          label: "Sleep Beneath The Aurora",
          tags: "Glamping · Finland",
          description: "Glass roof. Lights overhead.",
          prompt:
            "I want a glass igloo in Finnish Lapland where I can watch the aurora from bed. Tell me which properties actually deliver genuine sky visibility, what a 2-night igloo stay costs, and which month gives the best probability. Build me the 5-night Lapland itinerary around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Ruska Marathon -- Run Under the Lights.png ",
          label: "Ruska Marathon — Run Under the Lights",
          tags: "Running · Active",
          description: "Arctic race. Aurora above.",
          prompt:
            "I want to run the Ruska Marathon in Finnish Lapland during autumn aurora season. Tell me what the race involves, the terrain, how to register from India, and what fitness level it suits. Then build the trip around it — arriving early, running the race, and staying for a glass igloo night after.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Husky Safari -- Run With the Pack.png ",
          label: "Husky Safari — Run With the Pack",
          tags: "Adventure · Lapland",
          description: "The Arctic in motion.",
          prompt:
            "I want a husky safari as the centrepiece of a northern lights trip. Tell me what driving a sled yourself involves, which destination has the best programme — Finland, Sweden, or Norway — and how to combine a husky morning with an aurora evening. Build me a 5-night trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Inside Santa's Homeland.jpg ",
          label: "Inside Santa's Homeland",
          tags: "Family · Magical",
          description: "Magic beyond the postcards.",
          prompt:
            "I want to do the Rovaniemi Santa Village, a reindeer sleigh ride, and a northern lights evening in one trip. Tell me what each experience involves, how Rovaniemi compares to remote Lapland for aurora probability, and build me the 4-night family or couple itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Arctic Cabin Escape.png ",
          label: "Arctic Cabin Escape",
          tags: "Glamping · Norway",
          description: "Hot tub. Wilderness. Aurora.",
          prompt:
            "I want an aurora glamping cabin outside Tromso with a private outdoor hot tub facing north. Tell me which properties are worth the rate, what the aurora probability is in northern Norway, and what to do during the days. Build me the 4-night cabin itinerary.",
        },
      ],
    },
    {
      heading: "Where to Chase the Aurora",
      icon: "🧭",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Finnish Lapland -- The Full Package.jpg ",
          label: "Finnish Lapland — The Full Package",
          tags: "Finland · Family + Couples",
          description: "Aurora, huskies, and Santa Claus.",
          prompt:
            "I want Finnish Lapland for the complete arctic experience — glass igloo, husky safari, reindeer sleigh. Tell me the difference between Rovaniemi, Saariselka, and Levi, recommend the right one for a first visit, and build me the 5-night itinerary with total cost from India.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Tromsø Aurora Escape.jpg ",
          label: "The Tromsø Aurora Escape",
          tags: "Norway · Adventure",
          description: "City comfort. Wild Arctic.",
          prompt:
            "I want to use Tromso as a base for an aurora trip — guided chases into the mountains when conditions are right, plus whale watching in the fjords. Tell me how Tromso compares to Finland for probability and price, and build me the 5-night Tromso itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Abisko Under The Lights.jpg ",
          label: "Abisko Under The Lights",
          tags: "Sweden · Off-Grid",
          description: "Maximum sky. Minimum crowds.",
          prompt:
            "I want to visit Abisko in Swedish Lapland — the location with the highest consistent aurora visibility in Europe. Tell me about the Aurora Sky Station, how remote it is, how to get there, and what a 3-night stay costs. Build me the Abisko itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Iceland's Winter Spectacle.jpg ",
          label: "Iceland's Winter Spectacle",
          tags: "Iceland · Unique",
          description: "Epic landscapes. Aurora nights.",
          prompt:
            "I want to combine Iceland's northern lights with the winter landscape — geysers, waterfalls, black beaches. Tell me honestly how Iceland compares to Scandinavia for aurora probability and build me the 6-night Iceland winter itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Lapland's Secret Season.jpg",
          label: "Lapland's Secret Season",
          tags: "Finland · Timing",
          description: "Auroras without the crowds.",
          prompt:
            "I want to visit Lapland in September before the Christmas crowds and December prices. Tell me what the aurora probability is in September, what the Ruska foliage season looks like, and whether glass igloos are open this early. Build me the September Lapland itinerary.",
        },
      ],
    },
    {
      heading: "Which Aurora Trip Is Yours?",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/A Honeymoon Under The Aurora.jpg ",
          label: "A Honeymoon Under The Aurora",
          tags: "Romantic · Couple",
          description: "Glass ceiling. Just the two of you.",
          prompt:
            "I want a northern lights honeymoon — private glass igloo, snowmobile evening, and a husky safari morning. Tell me the best property, which month, and what the romantic version of this trip costs at premium level. Build the full 7-night itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Ultimate Family Lapland.png",
          label: "The Ultimate Family Lapland",
          tags: "Family · Ages 5 Plus",
          description: "Huskies, Santa, and snow.",
          prompt:
            "I want a Finnish Lapland family trip for 2 adults and 2 children aged 5 to 12 — Santa Village, reindeer sleigh, husky safari, and a northern lights evening in snowsuits. Tell me the best accommodation for families and build the 6-night itinerary with cost per person.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Solo Aurora Journey.jpg",
          label: "The Solo Aurora Journey",
          tags: "Solo · Adventure",
          description: "A journey worth taking solo.",
          prompt:
            "I want to chase the northern lights solo. Tell me which destination works best for solo travellers, what the small group guided aurora tour experience is like, and what solo aurora travel actually feels like. Build the 6-night solo itinerary at mid-range.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Active Arctic.jpg",
          label: "The Active Arctic",
          tags: "Adventure · Sport",
          description: "Adventure by day. Aurora by night.",
          prompt:
            "I want an active northern lights trip — skiing, snowshoeing, and snowmobiling during the day, aurora watching at night. Tell me which destination suits an active traveller best and build the 7-night itinerary combining daily activity with evening aurora chasing.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Long Weekend Aurora.jpg",
          label: "The Long Weekend Aurora",
          tags: "Short Trip · Efficient",
          description: "Four nights. One unforgettable sky.",
          prompt:
            "I want the northern lights in just 4 nights — the most efficient routing from India, the right month for maximum probability in a short window, and a destination that does not waste a day in transit. Tell me if 4 nights is genuinely enough and build the itinerary.",
        },
      ],
    },
    {
      heading: "Experiences Worth the Cold",
      icon: "✨",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/The Husky Trail After Dark.jpg",
          label: "The Husky Trail After Dark",
          tags: "Practical · Essential",
          description: "Led by paws and instinct.",
          prompt:
            "I want a husky sledding experience at night in Arctic conditions, ideally under a clear sky or aurora. Tell me what it feels like to drive your own sled through frozen landscapes, how long these journeys last, and where in Finland, Sweden, or Norway this is most immersive. Include it in a 5-night aurora trip.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Chasing The Aurora By Snowmobile.png ",
          label: "Chasing The Aurora By Snowmobile",
          tags: "Adventure · Arctic Night",
          description: "Far from roads. Closer to wonder.",
          prompt:
            "I want a nighttime snowmobile safari timed to an aurora forecast evening — driving into the wilderness, cutting the engine, and watching the sky in silence. Tell me what it involves, which resorts offer it as a dedicated aurora chase, and what it costs. Build it into a 5-night Lapland itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Ice Fishing on a Frozen Lake.jpg",
          label: "Ice Fishing on a Frozen Lake",
          tags: "Experience · Lapland",
          description: "The Arctic at its quietest.",
          prompt:
            "I want to go ice fishing on a frozen Lapland lake on a clear afternoon and then watch the aurora from the ice as the light fades. Tell me what ice fishing involves, which resorts offer it as a guided activity, and how to combine a fishing afternoon with an aurora evening in the same day.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/A Day With Arctic Herders.png ",
          label: "A Day With Arctic Herders",
          tags: "Culture · Lapland",
          description: "Life at the edge of winter.",
          prompt:
            "I want a genuine Sami reindeer herding morning in Finnish Lapland — not a tourist show but a real working visit with a herding family. Tell me which areas offer authentic experiences, what the morning involves, and how to build it into a 5-night Lapland itinerary alongside the aurora and adventure activities.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Arctic Sauna Under the Stars.png ",
          label: "Arctic Sauna Under the Stars",
          tags: "Wellness · Nordic Ritual",
          description: "The Nordic evening perfected.",
          prompt:
            "I want a traditional Arctic sauna experience in a remote wilderness or luxury lodge setting, followed by stepping into freezing outdoor air or snow as part of a Nordic heat–cold ritual. Build this into a luxury northern lights itinerary evening where the sauna session transitions into aurora viewing outdoors. Tell me how this experience typically unfolds, how long it lasts, and how it fits into a 5-night high-end aurora trip.",
        },
      ],
    },
  ],
  travellerStories: northernLightsTravellerStories,
};

const NorthernLightsThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <>
      <Head>
        <title>
          Northern Lights: Chasing the Aurora | Trip Planner & Itinerary | The
          Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan your northern lights trip with The Tarzan Way's AI itinerary. Finland, Norway, Sweden, Iceland — glass igloos, husky safaris, snowmobile aurora chases, and the best months to see the lights for Indian travellers."
        />
        <meta
          property="og:title"
          content="Northern Lights: Chasing the Aurora | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan your northern lights trip with The Tarzan Way's AI itinerary. Finland, Norway, Sweden, Iceland — glass igloos, husky safaris, snowmobile aurora chases, and the best months to see the lights for Indian travellers."
        />
      </Head>
      <BotApp themeConfig={northernLightsThemeConfig} />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(NorthernLightsThemePage);
