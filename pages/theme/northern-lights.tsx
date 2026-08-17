// pages/theme/northern-lights.tsx
//
// Northern Lights — an editorial, cinematic theme landing built from the
// reusable CinematicThemeLanding component (converted from the older BotApp
// themeConfig surface). Experience cards save to the trip ("+ Add"); destination
// and trip-shape cards seed a plan; "Build trip" opens the themed mini-form on
// /chat, which submits the aurora country-branch payload to /chatkit.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import {
  promptIntakeMap,
  type ThemePromptIntent,
} from "../../components/theme/cinematic/themeIntake";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const THEME_SLUG = "northern-lights";
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026";
const img = (name: string) => `${CDN}/${name}`;

const PROMPTS = {
  whichCountry:
    "I want to see the northern lights over 7 nights in February with my partner, and I cannot choose between Finland, Norway, Iceland, and Sweden. Tell me honestly what each delivers differently — aurora probability, accommodation, activities, and price. Then recommend the best one for me and build the itinerary.",
  luxury:
    "I want a 7-night luxury northern lights trip in February for two, with the highest possible chance of seeing the aurora. Suggest the best destinations along with premium stays like glass igloos or luxury Arctic lodges. Include how expert guides maximise sightings and then design a high-end itinerary focused on giving me the best odds of seeing the lights at least once.",
  iglooOrGlamping:
    "I want to sleep somewhere I can watch the aurora from bed, in February with my partner. Tell me the honest difference between a glass igloo in Finland and an aurora glamping cabin in Norway — cost, comfort, sky visibility, and surrounding activities. Then recommend one and build the 4-night itinerary.",
  cost:
    "I want to plan a northern lights trip from India for two in February and understand the real numbers. Break down the full cost for 5 nights: flights, accommodation, activities, and food. Give me the total at mid-range and what the honest minimum is for a trip that actually delivers.",
  // Where to chase — destinations (create a plan)
  finlandFull:
    "I want Finnish Lapland in February for two, for the complete arctic experience — glass igloo, husky safari, reindeer sleigh. Tell me the difference between Rovaniemi, Saariselka, and Levi, recommend the right one for a first visit, and build me the 5-night itinerary with total cost from India.",
  tromso:
    "I want to use Tromso as a base for an aurora trip in January with my partner — guided chases into the mountains when conditions are right, plus whale watching in the fjords. Tell me how Tromso compares to Finland for probability and price, and build me the 5-night Tromso itinerary.",
  abisko:
    "I want to visit Abisko in Swedish Lapland in February with my partner — the location with the highest consistent aurora visibility in Europe. Tell me about the Aurora Sky Station, how remote it is, how to get there, and what a 3-night stay costs. Build me the Abisko itinerary.",
  iceland:
    "I want to combine Iceland's northern lights with the winter landscape in February, travelling as a couple — geysers, waterfalls, black beaches. Tell me honestly how Iceland compares to Scandinavia for aurora probability and build me the 6-night Iceland winter itinerary.",
  secretSeason:
    "I want to visit Lapland in September with my partner, before the Christmas crowds and December prices. Tell me what the aurora probability is in September, what the Ruska foliage season looks like, and whether glass igloos are open this early. Build me the 5-night September Lapland itinerary.",
  // Which aurora trip is yours — shapes (create a plan)
  honeymoon:
    "I want a northern lights honeymoon in February — private glass igloo, snowmobile evening, and a husky safari morning. Tell me the best property and what the romantic version of this trip costs at premium level. Build the full 7-night itinerary.",
  family:
    "I want a Finnish Lapland family trip in December for 2 adults and 2 children aged 5 to 12 — Santa Village, reindeer sleigh, husky safari, and a northern lights evening in snowsuits. Tell me the best accommodation for families and build the 6-night itinerary with cost per person.",
  solo:
    "I want to chase the northern lights solo, over 6 nights in February. Tell me which destination works best for solo travellers, what the small group guided aurora tour experience is like, and what solo aurora travel actually feels like. Build the 6-night solo itinerary at mid-range.",
  active:
    "I want an active northern lights trip for two in March — skiing, snowshoeing, and snowmobiling during the day, aurora watching at night. Tell me which destination suits an active traveller best and build the 7-night itinerary combining daily activity with evening aurora chasing.",
  longWeekend:
    "I want the northern lights in just 4 nights in February, travelling as a couple — the most efficient routing from India and a destination that does not waste a day in transit. Tell me if 4 nights is genuinely enough and build the itinerary.",
  // Build brief + ask
  build:
    "We are 2 travellers going for 7 nights in February, and our travel dates are flexible. Build my complete Northern Lights trip around the aurora experiences I've saved on this page — pick the country with the best odds on my dates, slot in the glass-roof stays and safaris, and price it.",
  ask:
    "Which country should we chase the aurora in over 7 nights in February, as a couple — Finnish Lapland, Tromsø, Iceland, or Abisko? Compare the aurora odds, the experiences, the pace, and the cost from India, then build the full itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. Months stay inside the aurora season (Sep–Mar), and
// each one is picked for what that prompt is actually after — December for the
// Santa Village family trip, September for the Ruska shoulder, March for the
// ski-and-chase week.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  whichCountry: { nights: 7, month: 2, who: "Couple" },
  luxury: { nights: 7, month: 2, who: "Couple" },
  iglooOrGlamping: { nights: 4, month: 2, who: "Couple" },
  cost: { nights: 5, month: 2, who: "Couple" },
  finlandFull: { nights: 5, month: 2, who: "Couple" },
  tromso: { nights: 5, month: 1, who: "Couple" },
  abisko: { nights: 3, month: 2, who: "Couple" },
  iceland: { nights: 6, month: 2, who: "Couple" },
  secretSeason: { nights: 5, month: 9, who: "Couple" },
  honeymoon: { nights: 7, month: 2, who: "Couple" },
  family: { nights: 6, month: 12, who: "Family", adults: 2, children: 2 },
  solo: { nights: 6, month: 2, who: "Just me" },
  active: { nights: 7, month: 3, who: "Couple" },
  longWeekend: { nights: 4, month: 2, who: "Couple" },
  build: { nights: 7, month: 2, who: "Couple" },
  ask: { nights: 7, month: 2, who: "Couple" },
});

const northernLightsConfig: CinematicThemeConfig = {
  // Aurora midnight — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["northern-lights"],
  header: { title: "Northern lights", subtitle: "Theme · Arctic · Sep – Mar" },
  hero: {
    eyebrow: "GLASS ROOFS · HUSKY TRAILS · A SKY THAT COMES ALIVE",
    heading: { lead: "Chasing the", accent: "Aurora" },
    lede: "You can't time the sky. But you can prepare for the moment it comes alive. Tell me your dates and I'll pick the country with the best odds and build the winter around you.",
    placeholder: "Try: Finnish Lapland, glass igloo, 5 nights in February",
    prompt: PROMPTS.whichCountry,
    chips: [
      { label: "Which country is best?", prompt: PROMPTS.whichCountry },
      { label: "Ultimate luxury aurora", prompt: PROMPTS.luxury },
      { label: "Glass igloo or glamping?", prompt: PROMPTS.iglooOrGlamping },
      { label: "What does it cost?", prompt: PROMPTS.cost },
    ],
    images: [
      { image: img("Sleep Beneath The Aurora.jpg"), caption: "Glass igloo, Finland" },
      { image: img("The Tromsø Aurora Escape.jpg"), caption: "Tromsø, Norway" },
      { image: img("Abisko Under The Lights.jpg"), caption: "Abisko, Sweden" },
      { image: img("Iceland's Winter Spectacle.jpg"), caption: "Iceland, winter" },
    ],
  },
  sections: [
    // ── How you want to experience it (save experiences) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "experience",
      heading: { lead: "How you want to", accent: "experience it" },
      cards: [
        {
          image: img("Sleep Beneath The Aurora.jpg"),
          name: "Sleep beneath the aurora",
          line: "Glass roof. Lights overhead.",
          tag: "Glamping · Finland",
        },
        {
          image: img("Ruska Marathon -- Run Under the Lights.png"),
          name: "Ruska Marathon — run under the lights",
          line: "Arctic race. Aurora above.",
          tag: "Running · Active",
        },
        {
          image: img("Husky Safari -- Run With the Pack.png"),
          name: "Husky safari — run with the pack",
          line: "The Arctic in motion.",
          tag: "Adventure · Lapland",
        },
        {
          image: img("Inside Santa's Homeland.jpg"),
          name: "Inside Santa's homeland",
          line: "Magic beyond the postcards.",
          tag: "Family · Magical",
        },
        {
          image: img("Arctic Cabin Escape.png"),
          name: "Arctic cabin escape",
          line: "Hot tub. Wilderness. Aurora.",
          tag: "Glamping · Norway",
        },
      ],
    },
    // ── Where to chase the aurora (create a plan) ──
    {
      type: "cards",
      ctaLabel: "Create plan →",
      heading: { lead: "Where to", accent: "chase the aurora" },
      cards: [
        {
          image: img("Finnish Lapland -- The Full Package.jpg"),
          name: "Finnish Lapland — the full package",
          line: "Aurora, huskies, and Santa Claus.",
          tag: "Finland",
          prompt: PROMPTS.finlandFull,
        },
        {
          image: img("The Tromsø Aurora Escape.jpg"),
          name: "The Tromsø aurora escape",
          line: "City comfort. Wild Arctic.",
          tag: "Norway",
          prompt: PROMPTS.tromso,
        },
        {
          image: img("Abisko Under The Lights.jpg"),
          name: "Abisko under the lights",
          line: "Maximum sky. Minimum crowds.",
          tag: "Sweden",
          prompt: PROMPTS.abisko,
        },
        {
          image: img("Iceland's Winter Spectacle.jpg"),
          name: "Iceland's winter spectacle",
          line: "Epic landscapes. Aurora nights.",
          tag: "Iceland",
          prompt: PROMPTS.iceland,
        },
        {
          image: img("Lapland's Secret Season.jpg"),
          name: "Lapland's secret season",
          line: "Auroras without the crowds.",
          tag: "Finland · timing",
          prompt: PROMPTS.secretSeason,
        },
      ],
    },
    // ── Which aurora trip is yours (create a plan) ──
    {
      type: "cards",
      tone: "sand",
      ctaLabel: "Create plan →",
      heading: { lead: "Which aurora trip", accent: "is yours" },
      cards: [
        {
          image: img("A Honeymoon Under The Aurora.jpg"),
          name: "A honeymoon under the aurora",
          line: "Glass ceiling. Just the two of you.",
          tag: "Romantic",
          prompt: PROMPTS.honeymoon,
        },
        {
          image: img("The Ultimate Family Lapland.png"),
          name: "The ultimate family Lapland",
          line: "Huskies, Santa, and snow.",
          tag: "Family",
          prompt: PROMPTS.family,
        },
        {
          image: img("The Solo Aurora Journey.jpg"),
          name: "The solo aurora journey",
          line: "A journey worth taking solo.",
          tag: "Solo",
          prompt: PROMPTS.solo,
        },
        {
          image: img("The Active Arctic.jpg"),
          name: "The active Arctic",
          line: "Adventure by day. Aurora by night.",
          tag: "Adventure",
          prompt: PROMPTS.active,
        },
        {
          image: img("The Long Weekend Aurora.jpg"),
          name: "The long weekend aurora",
          line: "Four nights. One unforgettable sky.",
          tag: "Short trip",
          prompt: PROMPTS.longWeekend,
        },
      ],
    },
    // ── Experiences worth the cold (save experiences) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "experience",
      heading: { lead: "Experiences", accent: "worth the cold" },
      cards: [
        {
          image: img("The Husky Trail After Dark.jpg"),
          name: "The husky trail after dark",
          line: "Led by paws and instinct.",
          tag: "Essential",
        },
        {
          image: img("Chasing The Aurora By Snowmobile.png"),
          name: "Chasing the aurora by snowmobile",
          line: "Far from roads. Closer to wonder.",
          tag: "Arctic night",
        },
        {
          image: img("Ice Fishing on a Frozen Lake.jpg"),
          name: "Ice fishing on a frozen lake",
          line: "The Arctic at its quietest.",
          tag: "Lapland",
        },
        {
          image: img("A Day With Arctic Herders.png"),
          name: "A day with Arctic herders",
          line: "Life at the edge of winter.",
          tag: "Culture",
        },
        {
          image: img("Arctic Sauna Under the Stars.png"),
          name: "Arctic sauna under the stars",
          line: "The Nordic evening perfected.",
          tag: "Wellness",
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: { eyebrow: "Other themes", lead: "Winter elsewhere?", accent: "Try these" },
      columns: 4,
      cards: [
        {
          name: "Lapland with Santa",
          meta: "Dec",
          emoji: "🦌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/theme/lapland",
        },
        {
          name: "Christmas markets",
          meta: "Nov – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          href: "/theme/christmas-markets",
        },
        {
          name: "Hokkaido powder",
          meta: "Dec – Mar",
          emoji: "🎿",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          href: "/theme/hokkaido-powder",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          href: "/theme/edinburgh-hogmanay",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about the aurora…",
    cta: "Ask Kaira",
    prompt: PROMPTS.ask,
    buildPrompt: PROMPTS.build,
    buildCta: "Build trip",
  },
};

const NorthernLightsThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  const handleSelectPrompt = (prompt: string, intent?: ThemePromptIntent) =>
    seedChat(prompt, {
      items: selection.items,
      slug: THEME_SLUG,
      intent,
      facts: PROMPT_FACTS[prompt],
    });
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="northern-lights">
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
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/northern-lights"
        />
      </Head>
      <CinematicThemeLanding
        config={northernLightsConfig}
        onSelectPrompt={handleSelectPrompt}
        selection={selection}
        onBuild={handleBuild}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(NorthernLightsThemePage);
