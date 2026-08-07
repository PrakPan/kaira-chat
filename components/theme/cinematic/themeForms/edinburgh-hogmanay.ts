// components/theme/cinematic/themeForms/edinburgh-hogmanay.ts
// Mini-form render data for /theme/edinburgh-hogmanay. Mirrors
// theme_forms/edinburgh-hogmanay.yaml. Festival is date-fixed (30 Dec–1 Jan);
// the "date window" is trip length/scope around that anchor.

import type { ThemeForm } from "./types";

const edinburghHogmanayForm: ThemeForm = {
  slug: "edinburgh-hogmanay",
  display: "Edinburgh Hogmanay",
  tagline:
    "Edinburgh Hogmanay — the world's biggest New Year, torchlit and fireworks over the castle.",
  voice:
    "Festive and warm against the cold. Talks Torchlight, the Bells, ceilidhs, Loony Dook.",
  copy: {
    datesTitle: "How long, and how far?",
    datesSub: "Hogmanay itself is fixed — 30 Dec to 1 Jan. Pick your trip length.",
    paxTitle: "And how many of you?",
    paxSub: "So I can size the rooms and the ceilidh table.",
    footer:
      "That's the whole form. The page already told me it's Hogmanay in Edinburgh.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "bells_only",
      label: "29 Dec – 2 Jan",
      range: ["2026-12-29", "2027-01-02"],
      nights: 4,
      blurb: "Just the Bells · all-in on Edinburgh",
      tag: "THE BELLS",
      skeleton: "edinburgh_core",
      fareNote: "NYE peak; EDI direct fares + hotels surge, book early.",
    },
    {
      key: "scotland_ny",
      label: "26 Dec – 2 Jan",
      range: ["2026-12-26", "2027-01-02"],
      nights: 7,
      blurb: "London first, then the Bells in Edinburgh",
      tag: "MOST POPULAR",
      skeleton: "london_edinburgh",
      fareNote: "Fly LHR (cheapest), open-jaw home from EDI.",
    },
    {
      key: "highlands_ny",
      label: "26 Dec – 3 Jan",
      range: ["2026-12-26", "2027-01-03"],
      nights: 8,
      blurb: "The Bells in Edinburgh, then Glasgow",
      tag: "SEE MORE",
      skeleton: "edinburgh_glasgow",
      fareNote: "LHR in / GLA out open-jaw; book early.",
    },
  ],
  hero: {
    image:
      "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=1200",
    title: "Edinburgh Hogmanay",
    subtext: "The world's biggest New Year — torchlit, fireworks over the castle.",
    tag: "Scotland · 29 Dec – 2 Jan",
  },
  paxPresets: ["Just us 2", "Solo", "Friends of 4", "Family of 4"],
  allowExactDates: true,
  seedPrompts: [
    "Get me Street Party tickets",
    "Add a Highlands day tour",
    "Do the Bells only, skip London",
    "Somewhere warm to watch the fireworks",
  ],
};

export default edinburghHogmanayForm;
