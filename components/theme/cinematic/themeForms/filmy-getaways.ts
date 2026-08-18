// components/theme/cinematic/themeForms/filmy-getaways.ts
//
// Mini-form render data for /theme/filmy-getaways. Mirrors theme_forms/
// filmy-getaways.yaml 1:1. Month-first (see season.ts).
//
// The form used to offer three Switzerland loops, because the page launched as
// the DDLJ route wearing the filmy slug. It now carries all eleven films, each
// with the skeleton key the route brief routes on — the same keys the page's
// cards send — so both surfaces hand the backend the same routing key.
//
// Month-first is doing real work here. Eleven films means eleven seasons, and
// most of them genuinely close: Corsica shuts Nov–Mar, the Greek ferries stop
// off-season, Goa's shacks come down for the monsoon, Rohtang goes under snow.
// Pick a month and you get the films that actually run in it; Switzerland and
// Paris carry no `months` because they run whenever the trains do.

import type { ThemeForm } from "./types";

const filmyGetawaysForm: ThemeForm = {
  slug: "filmy-getaways",
  display: "Filmy getaways",
  tagline:
    "Some stories are too good to just watch. Tell me the month and the film and I'll build the route around the places that actually made it.",
  voice:
    "Cinematic and unhurried. Frames the trip like scenes, names the real location rather than the set, and never bends a leg just to hit a filming spot.",
  copy: {
    datesTitle: "When are you going?",
    datesSub:
      "Every film has its own season. Pick a month, I'll show you which ones run.",
    footer:
      "That's the whole form. The page already told me it's a film trip.",
    cta: "Draft my scene →",
  },
  // All twelve months: Switzerland and Paris run year-round, so there is no
  // month with nothing in it. The line names what that month is actually for.
  //
  // The strip only ever shows the next four (MAX_MONTHS in season.ts), so a
  // reader sees the films bookable soon rather than all eleven at once — in
  // August that's Sep–Dec, eight films down to four. A film whose season is
  // further out than that is still one click away from its card on the theme
  // page, and `allowExactDates` covers a reader who already knows their dates.
  season: [
    {
      month: 1,
      label: "Sun and the far south",
      tag: "BEACH SEASON",
      line: "Goa is dry and full of light, New Zealand deep in its summer.",
    },
    {
      month: 2,
      label: "Middle-earth summer",
      tag: "BEST FOR NZ",
      line: "Queenstown at its longest days; Goa still shack season.",
    },
    {
      month: 3,
      label: "The hills wake up",
      line: "Himachal opens back up as New Zealand runs out its last summer weeks.",
    },
    {
      month: 4,
      label: "Everything reopens",
      tag: "SHOULDER",
      line: "Corsica and Spain come back on, Manali clears, Bali starts its dry run.",
    },
    {
      month: 5,
      label: "Nearly every film runs",
      tag: "MOST CHOICE",
      line: "Greek ferries start, the Highlands clear, and the Alps go green.",
    },
    {
      month: 6,
      label: "Meadows and long days",
      tag: "MOST BOOKED",
      line: "The DDLJ green, the Spanish coast before the heat, Manali before the rain.",
    },
    {
      month: 7,
      label: "High summer, fewer films",
      tag: "BUSIEST",
      line: "Rome and Bali sit this one out — Corsica, Greece and Scotland carry it.",
    },
    {
      month: 8,
      label: "Islands and Highlands",
      line: "The Mediterranean at full volume; Scotland at its warmest and its fullest.",
    },
    {
      month: 9,
      label: "The month that reads best",
      tag: "BEST LIGHT",
      line: "Rome, Spain, Greece, Corsica and the Alps all clear at once — crowds gone.",
    },
    {
      month: 10,
      label: "Golden and quiet",
      tag: "BEST VALUE",
      line: "Larches in Switzerland, the last Greek ferries, Corsica before it shuts.",
    },
    {
      month: 11,
      label: "Goa season opens",
      line: "The shacks are back up, New Zealand's summer starts, Himachal turns crisp.",
    },
    {
      month: 12,
      label: "Sun or snow",
      line: "Goa at its peak and NZ at its longest days; Switzerland and Paris turn festive.",
    },
  ],
  // One route per film, in the page's own order — six Bollywood, then five
  // Hollywood. `key` and `skeleton` are deliberately the same string: the brief
  // routes on the skeleton and the page's cards send it too, so keeping them
  // identical means there is only ever one name for a film in the payload.
  routes: [
    {
      key: "switzerland_ddlj",
      label: "DDLJ, the Switzerland dream",
      blurb: "Lucerne → Wengen → Montreux, the Jungfrau meadows",
      tag: "MOST PICKED",
      nights: 7,
      skeleton: "switzerland_ddlj",
      fareNote:
        "ZRH in / GVA out, direct from DEL and BOM. All Swiss rail on a Travel Pass; Wengen is car-free, so the last leg is the Lauterbrunnen cog.",
    },
    {
      key: "znmd_spain",
      label: "ZNMD, Spain awaits",
      blurb: "Barcelona → Costa Brava → Valencia → Seville, the road trip",
      tag: "THE ROAD TRIP",
      nights: 10,
      months: [4, 5, 6, 9, 10],
      skeleton: "znmd_spain",
      fareNote:
        "BCN in / MAD out, one stop via DXB, DOH or IST. Self-drive from Barcelona to Valencia — the drive is the film.",
    },
    {
      key: "yjhd_india",
      label: "Yeh Jawaani — mountains to palaces",
      blurb: "Manali → Delhi → Udaipur, the trek then the wedding",
      tag: "DOMESTIC",
      nights: 8,
      months: [3, 4, 5, 6],
      skeleton: "yjhd_india",
      fareNote:
        "Domestic — DEL in / UDR out. Bhuntar flights cancel often, so the Delhi–Manali road is the reliable default.",
    },
    {
      key: "dch_goa",
      label: "Dil Chahta Hai, Goa forever",
      blurb: "Mumbai → North Goa → South Goa, Chapora and the sea",
      tag: "DOMESTIC",
      nights: 6,
      months: [11, 12, 1, 2],
      skeleton: "dch_goa",
      fareNote:
        "Domestic — BOM in / GOX out. Chapora Fort is the wall shot and stays in the North Goa block.",
    },
    {
      key: "jabwemet_hills",
      label: "Jab We Met, hill-town joy",
      blurb: "Shimla → Manali, in on the Kalka toy train",
      tag: "DOMESTIC",
      nights: 7,
      months: [3, 4, 5, 6, 9, 10, 11],
      skeleton: "jabwemet_hills",
      fareNote:
        "Domestic loop out of DEL. The Kalka–Shimla toy train is the hero transfer, never a car — it books out early.",
    },
    {
      key: "tamasha_corsica",
      label: "Tamasha, Corsica calling",
      blurb: "Ajaccio → Porto → Bonifacio, cliffs and silence",
      tag: "OFFBEAT",
      nights: 8,
      months: [4, 5, 6, 7, 8, 9, 10],
      skeleton: "tamasha_corsica",
      fareNote:
        "No direct India–Corsica: route via Nice or Paris, then AJA in and out. Car-only on the island — rail reaches neither Porto nor Bonifacio.",
    },
    {
      key: "midnight_paris",
      label: "Midnight in Paris",
      blurb: "Paris, six nights, one city",
      tag: "ONE CITY",
      nights: 6,
      skeleton: "midnight_paris",
      fareNote:
        "CDG in and out, direct from DEL and BOM. Single-city by design — Versailles and Giverny are day trips, not second overnights.",
    },
    {
      key: "eatpraylove_bali_italy",
      label: "Eat Pray Love, Bali & Italy",
      blurb: "Rome → Ubud → Seminyak, both halves of the book",
      tag: "TWO COUNTRIES",
      nights: 12,
      months: [4, 5, 6, 9, 10],
      skeleton: "eatpraylove_bali_italy",
      fareNote:
        "FCO in / DPS out — Italy first, Bali second, because the flight home from Denpasar is the short one. Naples and Pompeii are day trips out of Rome.",
    },
    {
      key: "mammamia_greece",
      label: "Mamma Mia — Greek islands",
      blurb: "Athens → Skopelos → Skiathos, the chapel island",
      tag: "ISLAND HOPPING",
      nights: 8,
      months: [5, 6, 7, 8, 9, 10],
      skeleton: "mammamia_greece",
      fareNote:
        "ATH in and out, then the ~50m hop to Skiathos and a ~1h ferry. Skopelos holds the chapel and is the anchor.",
    },
    {
      key: "harrypotter_scotland",
      label: "Harry Potter, Scotland magic",
      blurb: "Edinburgh → Fort William → Glasgow, Glenfinnan and Glencoe",
      tag: "BOOK EARLY",
      nights: 8,
      months: [5, 6, 7, 8, 9],
      skeleton: "harrypotter_scotland",
      fareNote:
        "EDI in / GLA out; the Highlands leg is a private car, not rail. The Jacobite steam train sells out months ahead — book it before the trip is confirmed.",
    },
    {
      key: "lotr_newzealand",
      label: "Lord of the Rings, New Zealand",
      blurb: "Auckland → Wellington → Queenstown, Glenorchy and Milford",
      tag: "LONGEST HAUL",
      nights: 10,
      months: [11, 12, 1, 2, 3, 4],
      skeleton: "lotr_newzealand",
      fareNote:
        "AKL in and out — Queenstown has no long-haul, so the loop closes at Auckland. Hobbiton is a day trip from Auckland, ~2h each way.",
    },
  ],
  // Panel hero on /chat — the green Lauterbrunnen valley under the Bernese Alps,
  // still the flagship film of the eleven. Self-hosted so it can't drift or 404;
  // see public/theme-heroes/README.md for the source and licence.
  hero: {
    image: "/theme-heroes/switzerland-ddlj.jpg",
    title: "Live your favourite movie",
    subtext:
      "Eleven films, eleven real routes — and the touristy bits trimmed out.",
    tag: "Bollywood + Hollywood",
  },
  allowExactDates: true,
  seedPrompts: [
    "Keep the signature scene for last",
    "Fewer transfers, longer stays",
    "Add the day trips, not more cities",
    "What does this cost, honestly?",
  ],
};

export default filmyGetawaysForm;
