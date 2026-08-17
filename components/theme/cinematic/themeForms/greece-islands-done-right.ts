// components/theme/cinematic/themeForms/greece-islands-done-right.ts
//
// Mini-form render data for /theme/greece-islands-done-right. Month-first (see
// season.ts): the Cyclades ferry season runs May to October and the month is
// what actually changes the trip — the routes themselves are just lengths, and
// all three run whenever the boats do.

import type { ThemeForm } from "./types";

const greeceIslandsForm: ThemeForm = {
  slug: "greece-islands-done-right",
  display: "Greece Islands Done Right",
  tagline:
    "Greece, the islands done right — Athens, a caldera sunset, and the Cyclades by ferry.",
  voice: "Sun-warm and unhurried. Talks ferries, caldera sunsets, which island is which.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "The ferry season runs May to October, and it is not one season.",
    footer: "That's the whole form. The page already told me where and the vibe.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 5,
      label: "Green and quiet",
      tag: "SHOULDER",
      line: "Wildflowers still out, ferries running, sea only just warm enough.",
    },
    {
      month: 6,
      label: "Early peak",
      tag: "BUSIEST",
      line: "Our most-booked Greek month. Long days, warm sea, prices climbing.",
    },
    {
      month: 7,
      label: "High summer",
      tag: "HOTTEST",
      line: "Hot, bright and busy, with the meltemi wind on the Cyclades.",
    },
    {
      month: 8,
      label: "Peak everything",
      tag: "PRICIEST",
      line: "The Greeks are on holiday too. Book ferries and rooms months ahead.",
    },
    {
      month: 9,
      label: "The sweet spot",
      tag: "BEST VALUE",
      line: "Warmest sea of the year, crowds gone, fares softening.",
    },
    {
      month: 10,
      label: "Season closing",
      tag: "QUIETEST",
      line: "Lovely and empty, but ferries thin out towards the end.",
    },
  ],
  // Lengths from our own Greek bookings, which average 8.6–10.5 nights.
  routes: [
    {
      key: "classic_7",
      label: "The two icons",
      blurb: "Athens + Santorini & Mykonos",
      tag: "MOST POPULAR",
      nights: 7,
      skeleton: "classic_7",
      fareNote: "Peak Jun–Aug; fares + island hotels surge, book early.",
    },
    {
      key: "cyclades_9",
      label: "A slower Cyclades hop",
      blurb: "Add Naxos — fewer crowds, more time on each island",
      tag: "SLOW HOP",
      nights: 9,
      skeleton: "cyclades_9",
      fareNote: "Shoulder May/Oct — cheaper, ferries running, fewer crowds.",
    },
    {
      key: "crete_10",
      label: "Crete, then the caldera",
      blurb: "Crete's gorges and beaches before Santorini",
      tag: "SEE MORE",
      nights: 10,
      skeleton: "crete_10",
      fareNote: "Sep shoulder ideal; Crete adds a domestic flight.",
    },
  ],
  // Panel hero on /chat — blue domes above the Santorini caldera.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/greece-islands-done-right.jpg",
    title: "Greek islands",
    subtext: "Athens, a caldera sunset, and the Cyclades by ferry.",
    tag: "Greece · May – Oct",
  },
  allowExactDates: true,
  seedPrompts: [
    "Add a caldera sunset cruise",
    "Swap Mykonos for Naxos",
    "Include Crete",
    "Best island for a honeymoon",
  ],
};

export default greeceIslandsForm;
