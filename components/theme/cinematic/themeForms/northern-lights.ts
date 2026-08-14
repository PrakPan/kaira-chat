// components/theme/cinematic/themeForms/northern-lights.ts
//
// Mini-form render data for /theme/northern-lights. Month-first (see
// season.ts). Poly-destination: the routes here are COUNTRY BRANCHES, not
// lengths, and all four run for the whole aurora season — the month decides the
// dates and the odds, not which country is open. What changes month to month is
// darkness and snow, which is what the season notes carry.

import type { ThemeForm } from "./types";

const northernLightsForm: ThemeForm = {
  slug: "northern-lights",
  display: "Northern Lights",
  tagline:
    "Chasing the Aurora — glass roofs, husky trails, and a sky that comes alive.",
  voice:
    "Awe-chasing and cold-weather-savvy. Talks aurora odds, glass igloos, which country suits.",
  copy: {
    datesTitle: "When are you going?",
    datesSub: "The sky is open Sep to Mar, and it isn't the same sky each month.",
    footer: "That's the whole form. The page already told me it's the aurora.",
    cta: "Draft my route →",
  },
  season: [
    {
      month: 9,
      label: "Season opens",
      tag: "MILD",
      line: "Nights are dark enough again, the ground isn't frozen, and lakes still reflect.",
    },
    {
      month: 10,
      label: "Dark returns",
      tag: "GOOD ODDS",
      line: "Long nights, autumn colour, first snow up north. Prices still soft.",
    },
    {
      month: 11,
      label: "Snow arrives",
      tag: "QUIET",
      line: "Properly dark and properly white, with the Christmas rush not yet on.",
    },
    {
      month: 12,
      label: "Polar night",
      tag: "PEAK",
      line: "Barely any daylight, so barely any waiting. Busiest and dearest month.",
    },
    {
      month: 1,
      label: "Deep winter",
      tag: "BEST ODDS",
      line: "Coldest and clearest. The month with the strongest aurora record.",
    },
    {
      month: 2,
      label: "Cold and clear",
      tag: "STRONG SKY",
      line: "Still dark, still frozen, and a little more daylight to fill the days.",
    },
    {
      month: 3,
      label: "Equinox",
      tag: "BEST VALUE",
      line: "Equinox activity peaks, snow is deep, and the season's prices are lowest.",
    },
  ],
  // Nights follow what these actually run at in our bookings: Finland 8.7–10.8,
  // Norway 7.5–9.9, Iceland 8–9, Sweden 9–11.5.
  routes: [
    {
      key: "finnish_lapland",
      label: "Finnish Lapland",
      blurb: "The full package — aurora, huskies and Santa",
      tag: "MOST POPULAR",
      nights: 7,
      skeleton: "finland_helsinki_rovaniemi",
      fareNote:
        "Finnair DEL⇄HEL direct — best connectivity. Christmas week peaks.",
    },
    {
      key: "tromso_norway",
      label: "Tromsø, Norway",
      blurb: "City comfort, wild Arctic, fjord aurora",
      tag: "ADVENTURE",
      nights: 7,
      skeleton: "norway_oslo_bergen_tromso",
      fareNote: "One-stop DEL/BOM→OSL; Jan–Feb best aurora.",
    },
    {
      key: "iceland",
      label: "Iceland",
      blurb: "Epic landscapes by day, aurora by night",
      tag: "GUIDED",
      nights: 7,
      skeleton: "iceland_ring_south",
      fareNote: "Via a Europe hub; private driver-guide along the south coast.",
    },
    {
      key: "abisko_sweden",
      label: "Abisko, Sweden",
      blurb: "Max sky, min crowds — the clearest-sky spot there is",
      tag: "OFF-GRID",
      nights: 6,
      skeleton: "sweden_stockholm_abisko",
      fareNote: "One-stop DEL/BOM→ARN; March cheapest.",
    },
  ],
  // Panel hero on /chat — green aurora over a frosted Finnish treeline.
  // Self-hosted so it can't drift or 404; see public/theme-heroes/README.md
  // for the source and licence, and for the size to re-encode to.
  hero: {
    image: "/theme-heroes/northern-lights.jpg",
    title: "Northern lights",
    subtext: "Glass roofs, husky trails, and a sky that comes alive.",
    tag: "Arctic · Sep – Mar",
  },
  allowExactDates: true,
  seedPrompts: [
    "Which country has the best aurora odds?",
    "Glass igloo or Arctic cabin?",
    "Add Santa and huskies for the kids",
    "Do it as a long weekend",
  ],
};

export default northernLightsForm;
