// components/theme/cinematic/themeForms/northern-lights.ts
// Mini-form render data for /theme/northern-lights. Mirrors
// theme_forms/northern-lights.yaml. Poly-destination — the "date window" here
// is the COUNTRY BRANCH the traveller picks.

import type { ThemeForm } from "./types";

const northernLightsForm: ThemeForm = {
  slug: "northern-lights",
  display: "Northern Lights",
  tagline:
    "Chasing the Aurora — glass roofs, husky trails, and a sky that comes alive.",
  voice:
    "Awe-chasing and cold-weather-savvy. Talks aurora odds, glass igloos, which country suits.",
  copy: {
    datesTitle: "Where do you want to chase it?",
    datesSub: "Four very different Arctic countries. The sky is best Sep–Mar.",
    paxTitle: "And how many of you?",
    paxSub: "So I can size the cabins and the safaris.",
    footer: "That's the whole form. The page already told me it's the aurora.",
    cta: "Draft my route →",
  },
  dateWindows: [
    {
      key: "finnish_lapland",
      label: "Finnish Lapland · 7N",
      range: ["2026-12-27", "2027-01-03"],
      nights: 7,
      blurb: "The Full Package — aurora, huskies & Santa",
      tag: "MOST POPULAR",
      skeleton: "finland_helsinki_rovaniemi",
      fareNote:
        "Finnair DEL⇄HEL direct — best connectivity. Christmas week peaks.",
    },
    {
      key: "tromso_norway",
      label: "Tromsø, Norway · 7N",
      range: ["2027-01-15", "2027-01-22"],
      nights: 7,
      blurb: "City comfort, wild Arctic, fjord aurora",
      tag: "ADVENTURE",
      skeleton: "norway_oslo_bergen_tromso",
      fareNote: "One-stop DEL/BOM→OSL; Jan–Feb best aurora.",
    },
    {
      key: "iceland",
      label: "Iceland · 7N",
      range: ["2027-02-12", "2027-02-19"],
      nights: 7,
      blurb: "Epic landscapes by day, aurora by night",
      tag: "GUIDED",
      skeleton: "iceland_ring_south",
      fareNote: "Via a Europe hub; private driver-guide along the south coast.",
    },
    {
      key: "abisko_sweden",
      label: "Abisko, Sweden · 6N",
      range: ["2027-03-05", "2027-03-11"],
      nights: 6,
      blurb: "Max sky, min crowds — clearest-sky spot",
      tag: "OFF-GRID",
      skeleton: "sweden_stockholm_abisko",
      fareNote: "One-stop DEL/BOM→ARN; March cheapest.",
    },
  ],
  hero: {
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/northern-lights-2026/Abisko Under The Lights.jpg",
    title: "Northern lights",
    subtext: "Glass roofs, husky trails, and a sky that comes alive.",
    tag: "Arctic · Sep – Mar",
  },
  paxPresets: ["Just us 2", "Family of 4", "Solo", "Friends of 4"],
  allowExactDates: true,
  seedPrompts: [
    "Which country has the best aurora odds?",
    "Glass igloo or Arctic cabin?",
    "Add Santa and huskies for the kids",
    "Do it as a long weekend",
  ],
};

export default northernLightsForm;
