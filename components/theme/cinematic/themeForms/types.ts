// components/theme/cinematic/themeForms/types.ts
//
// Frontend render-data for a theme page's in-chat mini-form (the small
// "2-section" card: when/scope + how many, then one button). One config per
// theme, keyed by slug. Mirrors the repo's theme_forms/<slug>.yaml spec
// (_STRUCTURE.md) 1:1 — pure render data, no business logic. The `skeleton`
// field is never rendered; it's the routing key passed through on submit.

export interface ThemeDateWindow {
  key: string;
  label: string; // card title, e.g. "10–19 Jan"
  range: [string, string]; // [start, end] ISO dates to prefill
  nights?: number;
  blurb?: string; // card subtext
  tag?: string; // small badge, e.g. "BEST SNOW"
  skeleton: string; // routing key — passed through untouched, never displayed
  fareNote?: string; // internal helper/tooltip — safe to hide
}

// ── Season + routes (the month-first model) ──────────────────────────────────
// `dateWindows` above pins each option to absolute dates ("10–19 Jan 2027"),
// which goes stale the moment that window passes — a reader arriving in August
// was being offered three windows that had already been and gone, with no way
// to say "I'm going in December". A season/route pair fixes that by separating
// the two things the old windows conflated:
//
//   season — WHICH MONTHS this theme is worth doing, as month numbers. The form
//            resolves each one forward to its next occurrence from today, so
//            "January" reads as "Jan '27" in August '26 and "Jan '28" in
//            February '27. It can never point at the past.
//   routes — WHICH TRIP SHAPES exist, each declaring the months it runs in. Pick
//            a month, get that month's routes. A fixed-date event (the Sapporo
//            Snow Festival) is a route with an `anchor`, so it only appears for
//            its own month and lands on the real dates.

/** One month of a theme's season, plus what that month is actually like. */
export interface ThemeSeasonMonth {
  month: number; // 1–12
  label?: string; // "Deepest powder" — the headline for the month
  tag?: string; // small badge, e.g. "BEST SNOW"
  line?: string; // one line on weather / crowds / price
}

/** A trip shape offered inside the season. Replaces ThemeDateWindow. */
export interface ThemeRoute {
  key: string;
  label: string; // "Powder and the city"
  blurb?: string; // "Sapporo + Niseko — the classic first Japow"
  tag?: string; // small badge, e.g. "MOST PICKED"
  nights: number;
  skeleton: string; // routing key — passed through untouched, never displayed
  // Months (1–12) this route runs in. Omit for "every month of the season".
  months?: number[];
  // A fixed-date event this route is built around. When the reader picks the
  // anchor's month the trip starts on that day of the resolved year instead of
  // the generic mid-month departure — that's how a festival keeps its real
  // dates without hard-coding a year that expires.
  anchor?: { month: number; day: number; note?: string };
  fareNote?: string; // internal helper/tooltip — safe to hide
}

export interface ThemeFormCopy {
  datesTitle: string;
  datesSub: string;
  /** @deprecated The who/pax step now carries the main intake form's own
   *  wording ("Who's coming?"), so the two forms read identically. Not
   *  rendered; kept so un-migrated configs still typecheck. */
  paxTitle?: string;
  /** @deprecated See paxTitle. */
  paxSub?: string;
  footer: string;
  cta: string;
}

// Left-hero content shown on /chat's IntakeLeftPanel while the themed form is
// open (there's no destination picked yet). One theme image + a line of copy.
export interface ThemeFormHero {
  image: string;
  title?: string;
  subtext?: string;
  tag?: string; // the little pill (e.g. "Japan · winter")
}

export interface ThemeForm {
  slug: string;
  display: string;
  tagline: string; // opening chat bubble (Kaira's first line)
  voice?: string; // tone reference only — not rendered
  copy: ThemeFormCopy;
  // A theme supplies EITHER season + routes (preferred — month-first, never
  // goes stale) OR the legacy dateWindows. The form renders whichever it finds,
  // preferring season/routes.
  season?: ThemeSeasonMonth[];
  routes?: ThemeRoute[];
  dateWindows?: ThemeDateWindow[];
  /** @deprecated Superseded by the shared who/pax picker, which is the same
   *  control the main intake form uses (WHO_OPTIONS + adult/child/infant
   *  counters). No longer rendered; kept so un-migrated configs still typecheck. */
  paxPresets?: string[];
  allowExactDates: boolean;
  seedPrompts: string[]; // quick-reply chips below the composer
  hero?: ThemeFormHero; // left-panel hero on /chat
}

// The structured first-message payload sent to /chatkit on submit. `items` is
// the reader's saved selection from the theme page (may be empty).
export interface ThemeFormSubmission {
  slug: string;
  window: string; // chosen routes[].key (or legacy date_windows[].key)
  skeleton: string; // chosen routes[].skeleton (routing key)
  // The month the reader picked, resolved forward from today — "2027-01" plus
  // its readable form. Absent on the legacy dateWindows path and when the
  // reader overrides everything with exact dates.
  month?: string; // "YYYY-MM"
  monthLabel?: string; // "January 2027"
  dates: [string, string]; // [start, end] — from the window, or exact-date picks
  // Trip length in nights, always derived from `dates`. When the reader picks
  // exact dates this is THEIR length, not the window's stored `nights` — the
  // route is still the skeleton, but the duration is whatever they chose.
  nights: number;
  // True when `dates`/`nights` came from the reader's own calendar picks rather
  // than the chosen window's default range.
  exactDates?: boolean;
  // Readable traveller summary, worded exactly like the main intake form's
  // ("Family — 2 adults, 1 child"), so both forms hand the backend the same
  // phrasing. The raw counts ride alongside it.
  pax: string;
  who?: string; // "Just me" | "Couple" | "Family" | "Friends" | "Parents / seniors"
  adults?: number;
  children?: number;
  infants?: number;
  items?: Array<{ kind?: string; label?: string; short?: string; id?: string }>;
  // Quick-reply chips the reader toggled on in the form (seed_prompts).
  prompts?: string[];
  // Free text the reader typed into the theme page's docked ask-bar before
  // hitting "Build trip". Kept separate from `prompts` — those are canned
  // chips, this is the reader's own words.
  note?: string;
}
