// components/theme/cinematic/themeForms/switzerland-ddlj.ts
//
// Mini-form render data for /theme/filmy-getaways. Month-first (see season.ts).
// The page's own line is that Switzerland is a different film across the year,
// which is a season, not three stored date ranges — so the month carries the
// look (green valleys, alpine meadows, golden larches) and the routes are the
// trip shapes, all of which run whenever the trains do.

import type { ThemeForm } from "./types";

const switzerlandDdljForm: ThemeForm = {
  slug: "switzerland-ddlj",
  display: "Switzerland · Cinematic Romance",
  tagline: "A DDLJ-style Swiss escape — slow trains, misty valleys, café mornings.",
  voice: "Cinematic and unhurried. Frames the trip like film scenes.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "Switzerland is a different film each month. Pick your light.",
    footer:
      "That's the whole form. The page already told me where, the vibe, and your must-haves.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 5,
      label: "Green valleys",
      tag: "CHEAPEST",
      line: "Waterfalls at full volume, valleys at their greenest, fewest people.",
    },
    {
      month: 6,
      label: "Meadows open",
      tag: "MOST BOOKED",
      line: "Our busiest Swiss month — high passes open and the flowers are out.",
    },
    {
      month: 7,
      label: "Peak alpine",
      tag: "MOST ICONIC",
      line: "The DDLJ green, every train running, and the highest prices of the year.",
    },
    {
      month: 8,
      label: "High summer",
      tag: "BUSIEST",
      line: "Long, warm days and full trains. Book the scenic routes ahead.",
    },
    {
      month: 9,
      label: "Clear and calm",
      tag: "BEST AIR",
      line: "Crowds thin out, the air sharpens, and the mountains come out clean.",
    },
    {
      month: 10,
      label: "Golden larches",
      tag: "BEST LIGHT",
      line: "The most cinematic month — gold on the slopes, crisp low light.",
    },
  ],
  // Swiss trips in our own bookings average 8.4–9.8 nights, so these three are
  // the realistic shapes rather than the single 7-night loop the form used to
  // offer for every season.
  routes: [
    {
      key: "classic_loop",
      label: "The classic loop",
      blurb: "Zurich · Interlaken · Montreux, the DDLJ line",
      tag: "MOST PICKED",
      nights: 7,
      skeleton: "classic_loop",
      fareNote: "Single in/out of ZRH; Swiss Travel Pass covers the lot.",
    },
    {
      key: "scenic_rail",
      label: "By the scenic trains",
      blurb: "The same loop, slowed down for the GoldenPass and Glacier Express",
      tag: "SLOW TRAINS",
      nights: 9,
      skeleton: "classic_loop_scenic",
      fareNote: "Panoramic seats are reserved separately — book with the pass.",
    },
    {
      key: "zermatt_add",
      label: "With Zermatt",
      blurb: "Add the Matterhorn and a car-free mountain village",
      tag: "SEE MORE",
      nights: 8,
      skeleton: "classic_loop_zermatt",
      fareNote: "Zermatt is car-free — the last leg is by train from Täsch.",
    },
  ],
  // Panel hero on /chat — the green Lauterbrunnen valley under the Bernese Alps.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/switzerland-ddlj.jpg",
    title: "Switzerland, cinematic",
    subtext: "Slow trains, misty valleys, and café mornings — the DDLJ way.",
    tag: "Switzerland",
  },
  allowExactDates: true,
  seedPrompts: [
    "Include the scenic GoldenPass train",
    "Add a night in Zermatt",
    "Swap Montreux for Interlaken",
    "Make the mornings slow",
  ],
};

export default switzerlandDdljForm;
