// components/theme/cinematic/themeForms/thailand.ts
//
// Mini-form render data for the Thailand country page (/asia/thailand).
// Month-first (see season.ts).
//
// One fact shapes this whole form: Thailand has two coasts on opposite monsoons.
// The Andaman side (Krabi, Phuket, Koh Lanta) is rough Jun–Sep with boat days
// cancelled outright, while the Gulf (Samui, Phangan, Koh Tao) is fine — so the
// island routes are month-gated by coast rather than offered year round and left
// to disappoint someone in July.
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
    "Longtails out of Krabi, night temples in Chiang Mai, and the two coasts that are never good at the same time. Tell me the month and I'll tell you which side of the country to be on.",
  voice:
    "Specific and unfussy. Talks coasts and boat days over brochure adjectives, names the months things actually shut, and says when the free version of something is better than the ticketed one.",
  copy: {
    datesTitle: "When are you going?",
    datesSub:
      "The Andaman and the Gulf run on opposite monsoons. Pick a month and I'll put you on the coast that behaves.",
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
    {
      month: 5,
      label: "Andaman turns",
      tag: "GO EAST",
      line: "Krabi and Phuket start getting squalls. The Gulf islands are unbothered.",
    },
    {
      month: 6,
      label: "Green season",
      tag: "BEST VALUE",
      line: "Wet in the west, dry in the east. Weight the trip to Samui and the Gulf and you win twice.",
    },
    {
      month: 7,
      label: "Gulf's best",
      tag: "SAMUI PEAK",
      line: "Driest stretch on the east coast while the Andaman is at its roughest.",
    },
    {
      month: 8,
      label: "Still dry east",
      tag: "SAMUI PEAK",
      line: "Same split. Chiang Mai is green and cheap, with afternoon rain rather than all-day.",
    },
    {
      month: 9,
      label: "Wettest west",
      tag: "SKIP KRABI",
      line: "The month I'd push you off the Andaman entirely. Boats cancel and the lagoon days don't run.",
    },
    {
      month: 10,
      label: "The shoulder",
      tag: "BEST VALUE",
      line: "Rain easing, everything green, prices at their lowest before the season turns.",
    },
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
      label: "The Gulf, when the west is wet",
      blurb: "Bangkok → Koh Samui → Koh Phangan",
      tag: "JUN – SEP",
      nights: 8,
      skeleton: "bangkok_samui_phangan",
      months: [5, 6, 7, 8, 9, 10],
      fareNote:
        "The monsoon answer. Samui and Phangan are at their driest exactly when Krabi and Phuket aren't.",
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
    "Which coast for my month?",
    "Add the Yi Peng lantern night",
    "Skip Phuket entirely",
    "More islands, fewer cities",
  ],
};

export default thailandForm;
