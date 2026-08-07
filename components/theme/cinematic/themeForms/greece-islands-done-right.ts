// components/theme/cinematic/themeForms/greece-islands-done-right.ts
// Mini-form render data for /theme/greece-islands-done-right. Mirrors
// theme_forms/greece-islands-done-right.yaml. The "date window" is trip length
// (how many islands / nights).

import type { ThemeForm } from "./types";

const greeceIslandsForm: ThemeForm = {
  slug: "greece-islands-done-right",
  display: "Greece Islands Done Right",
  tagline:
    "Greece, the islands done right — Athens, a caldera sunset, and the Cyclades by ferry.",
  voice: "Sun-warm and unhurried. Talks ferries, caldera sunsets, which island is which.",
  copy: {
    datesTitle: "How many islands?",
    datesSub: "The Cyclades reward a slower hop. Pick your length.",
    paxTitle: "And how many of you?",
    paxSub: "So I can size the rooms and the ferries.",
    footer: "That's the whole form. The page already told me where and the vibe.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "classic_7",
      label: "7 nights · Jun–Sep",
      range: ["2027-06-12", "2027-06-19"],
      nights: 7,
      blurb: "Athens + the two icons: Santorini & Mykonos",
      tag: "MOST POPULAR",
      skeleton: "classic_7",
      fareNote: "Peak Jun–Aug; fares + island hotels surge, book early.",
    },
    {
      key: "cyclades_9",
      label: "9 nights · May–Oct",
      range: ["2027-05-20", "2027-05-29"],
      nights: 9,
      blurb: "Add Naxos — a slower, less-crowded Cyclades hop",
      tag: "SLOW HOP",
      skeleton: "cyclades_9",
      fareNote: "Shoulder May/Oct — cheaper, ferries running, fewer crowds.",
    },
    {
      key: "crete_10",
      label: "10 nights · May–Oct",
      range: ["2027-09-15", "2027-09-25"],
      nights: 10,
      blurb: "Crete's gorges + beaches, then the caldera",
      tag: "SEE MORE",
      skeleton: "crete_10",
      fareNote: "Sep shoulder ideal; Crete adds a domestic flight.",
    },
  ],
  hero: {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Santorini.jpg",
    title: "Greek islands",
    subtext: "Athens, a caldera sunset, and the Cyclades by ferry.",
    tag: "Greece · May – Oct",
  },
  paxPresets: ["Just us 2", "Family of 4", "Friends of 4", "Group of 6"],
  allowExactDates: true,
  seedPrompts: [
    "Add a caldera sunset cruise",
    "Swap Mykonos for Naxos",
    "Include Crete",
    "Best island for a honeymoon",
  ],
};

export default greeceIslandsForm;
