// pages/theme/greece-islands-done-right.tsx
//
// Greece Islands Done Right — an editorial, cinematic theme landing built from
// the reusable CinematicThemeLanding component (converted from the older
// CountryPage + GetInspiredSection surface). Place / experience cards save to
// the trip ("+ Add"); the "Greece themes" shapes seed a plan; "Build trip"
// opens the themed mini-form on /chat (island-count payload → /chatkit).

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
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

const THEME_SLUG = "greece-islands-done-right";
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/media/website";
const img = (name: string) => `${CDN}/${name}`;

const PROMPTS = {
  santorini:
    "I'm planning an 11-day Greece trip and can dedicate 3 nights to Santorini. Tell me honestly if it's worth the cost and crowds, or if another island offers a better experience. Then build the best itinerary based on your recommendation.",
  budget:
    "Plan an 8-day Greece trip for ₹1.8 lakh per person, including flights from India. Show what's realistically possible, which islands offer the best value, and create a complete itinerary with stays, transport, and daily experiences.",
  tenDay:
    "Create a seamless 10-day Greece itinerary with Athens and the best island combination. Prioritize smooth connections, minimal travel time, and a relaxed pace, then map out the trip day by day.",
  romantic:
    "Design an 11–12 day Greece trip for a couple focused on romance, sunsets, great food, beautiful hotels, and slow travel. Recommend the ideal route, best islands, and a complete day-by-day itinerary.",
  // Greece themes — shapes (create a plan)
  classicIslands:
    "Plan the perfect 10-day Greek islands trip with Santorini, Crete, and one more island. Recommend the best route, ferry connections, day-by-day itinerary, and realistic mid-range costs.",
  withKids:
    "Build a family-friendly 10-day Greece itinerary with the best islands, beaches, ancient sites, and travel pace for children aged 8–13. Include accommodation advice, daily plans, and costs.",
  honeymoon:
    "Design an 11-day Greece honeymoon combining iconic Santorini with a quieter romantic island. Include luxury stays, special experiences, dining recommendations, and a complete itinerary.",
  budgetTheme:
    "Plan a 7-day Greece trip under ₹1.8 lakh per person including flights. Recommend the best-value destinations, realistic hotels, transport, and a complete day-by-day itinerary.",
  mainland:
    "Create a 10-day mainland Greece itinerary focused on Athens, Delphi, Meteora, Mycenae, Epidaurus, and Nafplio. Include transport, daily plans, and the key stories behind each site.",
  build:
    "We are 2 travellers, and our travel dates are flexible. Build my complete Greece itinerary around the islands and experiences I've saved on this page — route Athens and the Cyclades with smooth ferry connections at a relaxed pace, then price it.",
  ask:
    "Which Greece trip should I do — the classic Santorini + Mykonos run, a slower Cyclades hop with Naxos, or add Crete? Compare the pace, the ferries, the cost, and the best month, then build the full itinerary for the one you recommend.",
};

const greeceConfig: CinematicThemeConfig = {
  // Aegean blue — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES["greece-islands-done-right"],
  header: { title: "Greece islands", subtitle: "Theme · Greece · May – Oct" },
  hero: {
    eyebrow: "ATHENS · A CALDERA SUNSET · THE CYCLADES BY FERRY",
    heading: { lead: "Greece, the islands", accent: "done right" },
    lede: "Greece is a big decision. Let's make it an easy one. Tell me how many islands and how many of you, and I'll route Athens and the Cyclades so no day is wasted on a ferry.",
    placeholder: "Try: Athens, Santorini and Naxos, 9 nights in May",
    prompt: PROMPTS.tenDay,
    chips: [
      { label: "Is Santorini worth the hype?", prompt: PROMPTS.santorini },
      { label: "₹1.8 lakh — what do I get?", prompt: PROMPTS.budget },
      { label: "A doable 10-day itinerary", prompt: PROMPTS.tenDay },
      { label: "A romantic Greece for 2", prompt: PROMPTS.romantic },
    ],
    images: [
      { image: img("Santorini.jpg"), caption: "Santorini, caldera" },
      { image: img("Athens.jpg"), caption: "Athens, the Acropolis" },
      { image: img("Crete.jpg"), caption: "Crete, the south" },
      { image: img("Mykonos.jpg"), caption: "Mykonos, quiet side" },
    ],
  },
  sections: [
    // ── From the Acropolis to the Aegean (save places) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "place",
      heading: { lead: "From the Acropolis", accent: "to the Aegean" },
      cards: [
        {
          image: img("Athens.jpg"),
          name: "Athens — ruins and rooftops",
          line: "2,500 years. Still buzzing.",
          tag: "History · City",
        },
        {
          image: img("Santorini.jpg"),
          name: "Santorini — blue domes, real story",
          line: "The photo is real. Book early.",
          tag: "Scenic · Romantic",
        },
        {
          image: img("Crete.jpg"),
          name: "Crete — more than a beach",
          line: "Biggest island. Wildly underrated.",
          tag: "Culture · Beach",
        },
        {
          image: img("Meteora.jpg"),
          name: "Meteora — monasteries on cliffs",
          line: "Built on nothing. Literally.",
          tag: "UNESCO",
        },
        {
          image: img("Mykonos.jpg"),
          name: "Mykonos — beyond the party",
          line: "The calm side of Mykonos.",
          tag: "Beach",
        },
      ],
    },
    // ── Greece right now (save experiences) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "experience",
      heading: { lead: "Greece", accent: "right now" },
      cards: [
        {
          image: img("Easter in Greece.png"),
          name: "Easter in Greece — nothing like it",
          line: "Bigger than Christmas.",
          tag: "Apr – May",
        },
        {
          image: img("Epidaurus.png"),
          name: "Epidaurus — the original theatre",
          line: "2,400 years old.",
          tag: "Jun – Aug",
        },
        {
          image: img("Thessaloniki.jpg"),
          name: "Thessaloniki — where Greeks holiday",
          line: "More food per street.",
          tag: "Year-round",
        },
        {
          image: img("Hydra.jpg"),
          name: "Hydra — no cars, just donkeys",
          line: "90 minutes from Athens.",
          tag: "Day trip",
        },
        {
          image: img("Delphi.jpg"),
          name: "Delphi — where gods were consulted",
          line: "The centre of the ancient world.",
          tag: "Day trip",
        },
      ],
    },
    // ── TTW's Greece themes (create a plan) ──
    {
      type: "cards",
      tone: "sand",
      ctaLabel: "Create plan →",
      heading: { lead: "TTW's Greece", accent: "themes" },
      cards: [
        {
          image: img("Classic Greek Islands.jpg"),
          name: "Classic Greek Islands",
          line: "Santorini. Crete. One more.",
          tag: "Islands",
          prompt: PROMPTS.classicIslands,
        },
        {
          image: img("Greece With Kids.png"),
          name: "Greece with kids",
          line: "Ruins, beaches, feta.",
          tag: "Family",
          prompt: PROMPTS.withKids,
        },
        {
          image: img("Honeymoon in Greece.png"),
          name: "Honeymoon in Greece",
          line: "Blue domes. No crowds.",
          tag: "Romantic",
          prompt: PROMPTS.honeymoon,
        },
        {
          image: img("Greece Under Rs 1.8 Lakh Per Person.jpg"),
          name: "Greece under ₹1.8 lakh per person",
          line: "Aegean, minus the bill.",
          tag: "Budget",
          prompt: PROMPTS.budgetTheme,
        },
        {
          image: img("Greece Mainland.png"),
          name: "Greece mainland — ancient journey",
          line: "Before the islands existed.",
          tag: "History",
          prompt: PROMPTS.mainland,
        },
      ],
    },
    // ── Only in Greece — experiences (save experiences) ──
    {
      type: "cards",
      selectable: true,
      itemKind: "experience",
      heading: { lead: "Only in Greece —", accent: "experiences worth flying for" },
      cards: [
        {
          image: img("Acropolis.jpg"),
          name: "Acropolis — 8am, no one else",
          line: "You and the Parthenon.",
          tag: "Athens",
        },
        {
          image: img("Catamaran.jpg"),
          name: "Catamaran — Santorini from the sea",
          line: "Better from the water.",
          tag: "Santorini",
        },
        {
          image: img("Samaria Gorge.png"),
          name: "Samaria Gorge — hike, then beach",
          line: "16km. Worth every step.",
          tag: "Crete",
        },
        {
          image: img("Cook Greek — In a Local Home.png"),
          name: "Cook Greek — in a local home",
          line: "A Greek grandmother's kitchen.",
          tag: "Food",
        },
        {
          image: img("Sail the Cyclades — Your Own Route.png"),
          name: "Sail the Cyclades — your own route",
          line: "New island every morning.",
          tag: "Sailing",
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: { eyebrow: "Other themes", lead: "Somewhere else?", accent: "Try these" },
      columns: 4,
      cards: [
        {
          name: "Filmy getaways",
          meta: "Bollywood + Hollywood",
          emoji: "🎬",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          href: "/theme/filmy-getaways",
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
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/theme/northern-lights",
        },
      ],
    },
  ],
  askBar: {
    placeholder: "Ask me about the Greek islands…",
    cta: "Ask Kaira",
    prompt: PROMPTS.ask,
    buildPrompt: PROMPTS.build,
    buildCta: "Build trip",
  },
};

const GreeceIslandsThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  const handleSelectPrompt = (prompt: string) =>
    seedChat(prompt, { items: selection.items, slug: THEME_SLUG });
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="greece-islands-done-right">
      <Head>
        <title>
          Greece Islands Done Right | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan a Greek islands trip with The Tarzan Way's AI itinerary — Athens, a Santorini caldera sunset, and the Cyclades by ferry. Island-hop Mykonos, Naxos and Crete at a relaxed pace, for Indian travellers."
        />
        <meta
          property="og:title"
          content="Greece Islands Done Right | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan a Greek islands trip with The Tarzan Way's AI itinerary — Athens, a Santorini caldera sunset, and the Cyclades by ferry. Island-hop Mykonos, Naxos and Crete at a relaxed pace, for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/greece-islands-done-right"
        />
      </Head>
      <CinematicThemeLanding
        config={greeceConfig}
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

export default connect(null, mapDispatchToProps)(GreeceIslandsThemePage);
