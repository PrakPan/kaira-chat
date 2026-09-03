// components/theme/cinematic/themeForms/thailand.ts
//
// Mini-form render data for the Thailand country page (/asia/thailand).
// Month-first (see season.ts).
//
// The season is the dry window only — November through April, the same span the
// country page's header ("Asia · Nov – Apr") and its "Nov – Feb · best overall"
// months row already promise. It used to list all twelve months, and because
// resolveSeason walks forward from today and stops at four, a reader arriving in
// early September opened the form on Sep '26 / Oct '26 with one monsoon route
// between them — the page saying "cool and dry, Nov to Feb" above a form
// offering October. Cutting May–October makes the strip open on November and run
// Nov → Dec → Jan → Feb, and it keeps rolling correctly on its own: read in
// January it comes back Jan → Feb → Mar → Apr.
//
// Thailand still has two coasts on opposite monsoons, but that stops being the
// reader's problem once every month on offer is a dry one — inside Nov–Apr both
// the Andaman and the Gulf behave, so the routes are gated on what each month is
// LIKE (crowds, prices, Yi Peng, Songkran) rather than on which sea is workable.
// The Jun–Sep "go east" advice still lives on the page, in "When to actually go".
//
// The lantern route is the other reason this form exists rather than a generic
// country picker: Yi Peng falls on the Lanna full moon, which is a real date in
// a real year, so it is an `anchor` route rather than a "November" one. In 2026
// that is 24–25 November.

import type { ThemeForm } from "./types";

const thailandForm: ThemeForm = {
  slug: "thailand",
  display: "Thailand",
  tagline:
    "Longtails out of Krabi, night temples in Chiang Mai, and one dry window that runs November to April. Tell me the month and I'll tell you what the country is actually like in it.",
  voice:
    "Specific and unfussy. Talks boat days and crowd levels over brochure adjectives, names what each month costs and what it sells out of, and says when the free version of something is better than the ticketed one.",
  copy: {
    datesTitle: "When are you going?",
    datesSub:
      "November to April is the dry run, and every month in it is a different trip. Pick one and I'll shape the route to suit it.",
    footer:
      "That's the whole form. Whatever you tapped on the page is already in your list.",
    cta: "Draft the route →",
  },
  season: [
    {
      month: 1,
      label: "Peak dry",
      tag: "BUSIEST",
      line: "Both coasts behave and everybody knows it. Best weather, highest prices.",
    },
    {
      month: 2,
      label: "Still perfect",
      tag: "EASY",
      line: "Flat Andaman seas — the safest month for a boat day you can't reschedule.",
    },
    {
      month: 3,
      label: "Hot and clear",
      tag: "SWEET SPOT",
      line: "Warmest water of the year, and the January crowds have gone home.",
    },
    {
      month: 4,
      label: "Songkran",
      tag: "PLAN AROUND IT",
      line: "The water festival lands mid-month. Worth building around either way, but decide deliberately.",
    },
    // May–October are deliberately absent. They are the Andaman monsoon and the
    // Gulf-only half of the year, and listing them made the strip open on
    // whichever of them happened to be next — see the note at the top of the file.
    {
      month: 11,
      label: "Cool and dry",
      tag: "YI PENG",
      line: "The best month in the country, and the lantern festival lands on the full moon. Chiang Mai sells out six months out.",
    },
    {
      month: 12,
      label: "Dry season proper",
      tag: "BOOK EARLY",
      line: "Both coasts good. New Year pushes island stays and internal flights out fast.",
    },
  ],
  routes: [
    {
      key: "lanterns_north",
      label: "Lanterns and the north",
      blurb: "Chiang Mai → Chiang Rai → Bangkok",
      tag: "NOVEMBER ONLY",
      nights: 6,
      skeleton: "chiangmai_chiangrai_bangkok",
      months: [11],
      // Yi Peng 2026. An anchor rather than a plain November route: the festival
      // is two fixed nights on the Lanna full moon, and a mid-month departure
      // would miss them by a week.
      anchor: {
        month: 11,
        day: 22,
        note: "Starts two days before Yi Peng so the 24th and 25th fall inside the trip.",
      },
      fareNote:
        "CNX in / BKK out. The ticketed releases are 30–45 min outside Chiang Mai and sell out by mid-year.",
    },
    {
      key: "islands_slowly",
      label: "Islands, slowly",
      blurb: "Krabi → Koh Lanta → Koh Jum",
      tag: "SLOWEST",
      nights: 9,
      skeleton: "krabi_lanta_kohjum",
      months: [11, 12, 1, 2, 3, 4],
      fareNote:
        "KBV both ends, ferries between. Pure Andaman, so the dry months only.",
    },
    {
      key: "city_and_beach",
      label: "One city, one beach",
      blurb: "Bangkok → Phuket",
      tag: "FIRST TIME",
      nights: 5,
      skeleton: "bangkok_phuket",
      months: [11, 12, 1, 2, 3, 4],
      fareNote:
        "BKK in / HKT out. The shortest sensible first trip — two bases, one internal flight.",
    },
    {
      key: "loud_week",
      label: "Loud week with friends",
      blurb: "Bangkok → Pattaya → Phuket",
      tag: "GROUPS",
      nights: 7,
      skeleton: "bangkok_pattaya_phuket",
      months: [11, 12, 1, 2, 3, 4],
      fareNote:
        "Pattaya is a road transfer from Bangkok, not a flight, which is what keeps this one cheap.",
    },
    {
      key: "active_krabi_north",
      label: "Kayaks, caves and cooking",
      blurb: "Krabi → Chiang Mai",
      tag: "ACTIVE",
      nights: 8,
      skeleton: "krabi_chiangmai",
      months: [11, 12, 1, 2, 3],
      fareNote:
        "KBV in / CNX out via BKK. Half sea, half hills — the caves and the ridge trek both want dry ground.",
    },
    {
      key: "gulf_islands",
      label: "The Gulf side",
      blurb: "Bangkok → Koh Samui → Koh Phangan",
      tag: "QUIETER",
      nights: 8,
      skeleton: "bangkok_samui_phangan",
      // Was Jun–Sep, as the monsoon fallback for when the Andaman shuts. It is
      // re-gated to the dry months because that is when it is actually booked:
      // across trips since 2023, Koh Samui appears in 200 November itineraries,
      // 203 in December, 159 in January and 208 in February — the Gulf is a
      // choice people make in peak season, not only a wet-season consolation.
      // The Andaman is drier than the Gulf in this window (the east coast keeps
      // some November rain), so this is the quieter, not the sunnier, option.
      months: [11, 12, 1, 2],
      fareNote:
        "BKK in, USM out. The Gulf keeps a little more November rain than Krabi does, and takes half the crowd — Phangan's full moon party is the one date to check before booking.",
    },
  ],
  // Panel hero on /chat — the Hong Island lagoon, reached by longtail.
  hero: {
    image:
      "https://images.thetarzanway.com/media/activities/175646581281492352485656738281.jpg",
    title: "Thailand",
    subtext:
      "Longtails, limestone and the north. I'll put you on whichever coast your month suits.",
    tag: "Thailand · Nov – Apr",
  },
  allowExactDates: true,
  seedPrompts: [
    "Find the cheapest week in my month",
    "Add the Yi Peng lantern night",
    "Skip Phuket entirely",
    "More islands, fewer cities",
  ],
};

export default thailandForm;
