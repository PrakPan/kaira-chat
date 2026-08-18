// components/theme/cinematic/themeForms/thailand-bali-offbeat.ts
//
// Mini-form render data for /theme/thailand-bali-offbeat. Month-first (see
// season.ts). The thing that makes this theme different from every other Thai
// or Balinese one is that it spans two monsoons: Thailand's Andaman coast is
// rough May–Oct and boats get cancelled, while Bali and the Nusas are perfectly
// fine — and cheap — right through it. So the season notes are written per
// coast, and the two Andaman-based routes are month-gated to Nov–Apr rather
// than being offered in a month where the boat day is a coin toss.
//
// The two routes with no `months` (north Thailand + the Gilis, and the East
// Bali/Nusas loop) sit away from the Andaman, so they stay bookable all year
// and are what a reader picking July actually gets shown.

import type { ThemeForm } from "./types";

const thailandBaliOffbeatForm: ThemeForm = {
  slug: "thailand-bali-offbeat",
  display: "Offbeat Thailand + Bali",
  tagline:
    "Two countries, one stretch of water, and the half of each that isn't on the postcard. Tell me the month and I'll tell you which coast behaves.",
  voice:
    "Quiet and specific. Talks longtails over speedboats, east Bali over the south, ferries and boat timings, and why the crowded version costs more.",
  copy: {
    datesTitle: "When are you going?",
    datesSub:
      "Bali runs year round. Thailand's Andaman coast doesn't — that's the whole planning problem.",
    footer: "That's the whole form. The page already told me you want the quiet version.",
    cta: "Draft the route →",
  },
  season: [
    {
      month: 1,
      label: "Peak dry",
      tag: "BUSIEST",
      line: "Perfect on both sides. Also the priciest — east-coast villas go three months out.",
    },
    {
      month: 2,
      label: "Still perfect",
      tag: "EASY",
      line: "Flat Andaman, dry Bali. The safest month for a longtail day you can't reschedule.",
    },
    {
      month: 3,
      label: "Hot and clear",
      tag: "SWEET SPOT",
      line: "Warmest water of the year and the January crowds have gone home.",
    },
    {
      month: 4,
      label: "Songkran",
      tag: "PLAN AROUND IT",
      line: "Thailand's water festival mid-month. Worth building around, either way — but decide deliberately.",
    },
    {
      month: 5,
      label: "Andaman turns",
      tag: "BALI BETTER",
      line: "Krabi starts getting squalls. Bali is unbothered and noticeably cheaper.",
    },
    {
      month: 6,
      label: "Green season",
      tag: "BEST VALUE",
      line: "Bali's dry season, Thailand's wet one. Weight the trip east and you win twice.",
    },
    {
      month: 7,
      label: "Bali's best",
      tag: "GILIS PEAK",
      line: "Driest month in Indonesia. The Gilis and the Nusas are at their clearest.",
    },
    {
      month: 8,
      label: "Still dry east",
      tag: "GILIS PEAK",
      line: "Same story, and Bali's busiest. Book the Nusa stay-over early.",
    },
    {
      month: 9,
      label: "Wettest Andaman",
      tag: "SKIP KRABI",
      line: "The month I'd push you off Thailand's west coast entirely. Bali still fine.",
    },
    {
      month: 10,
      label: "Turning back",
      tag: "SHOULDER",
      line: "Andaman seas settling week by week. Bali picking up rain but nothing that ruins a day.",
    },
    {
      month: 11,
      label: "Dry, green, empty",
      tag: "BEST VALUE",
      line: "Rains have just stopped. Everything is green, prices haven't climbed, islands half full.",
    },
    {
      month: 12,
      label: "Dry season proper",
      tag: "BOOK EARLY",
      line: "Both coasts good. New Year pushes the east-Bali and Koh Yao stays out fast.",
    },
  ],
  routes: [
    {
      key: "krabi_east_bali",
      label: "Krabi backroads, East Bali",
      blurb: "Krabi → Ao Thalane → Ubud → Amed",
      tag: "KAIRA'S PICK",
      nights: 12,
      skeleton: "krabi_ubud_amed",
      months: [11, 12, 1, 2, 3, 4],
      fareNote:
        "KBV in / DPS out, one flight between. Andaman-dependent — gated to the dry months on purpose.",
    },
    {
      key: "north_thailand_gilis",
      label: "North Thailand, then the Gilis",
      blurb: "Chiang Mai → Bangkok → Gili Trawangan",
      tag: "YEAR ROUND",
      nights: 13,
      skeleton: "chiang_mai_bangkok_gili",
      fareNote:
        "CNX in / LOP or DPS out. Nothing on this route depends on the Andaman, so it holds up in any month.",
    },
    {
      key: "east_bali_nusas",
      label: "East Bali and the Nusas",
      blurb: "Ubud → Amed → Lembongan → Penida",
      tag: "SLOWEST",
      nights: 11,
      skeleton: "ubud_amed_nusas",
      fareNote:
        "DPS both ends, boats between. Driest Jun–Sep, which is exactly when Thailand's west coast isn't.",
    },
    {
      key: "two_islands",
      label: "Two islands, nothing else",
      blurb: "Koh Yao Noi → Nusa Lembongan",
      tag: "NOBODY MOVES",
      nights: 10,
      skeleton: "koh_yao_lembongan",
      months: [11, 12, 1, 2, 3, 4],
      fareNote:
        "Two bases, two boats, zero itinerary. Koh Yao Noi is Andaman, so the dry months only.",
    },
  ],
  // Panel hero on /chat — the Hong Island lagoon, reached by longtail.
  hero: {
    image:
      "https://images.thetarzanway.com/media/activities/175646581281492352485656738281.jpg",
    title: "Offbeat Thailand + Bali",
    subtext: "Quiet Andaman islands, then the half of Bali that isn't in the traffic.",
    tag: "Thailand / Indonesia · Nov – Apr",
  },
  allowExactDates: true,
  seedPrompts: [
    "Keep me off the crowded islands",
    "More water, fewer temples",
    "Add a night on a Nusa",
    "Which coast works for my month?",
  ],
};

export default thailandBaliOffbeatForm;
