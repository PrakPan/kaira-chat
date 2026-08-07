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

export interface ThemeFormCopy {
  datesTitle: string;
  datesSub: string;
  paxTitle: string;
  paxSub: string;
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
  dateWindows: ThemeDateWindow[];
  paxPresets: string[];
  allowExactDates: boolean;
  seedPrompts: string[]; // quick-reply chips below the composer
  hero?: ThemeFormHero; // left-panel hero on /chat
}

// The structured first-message payload sent to /chatkit on submit. `items` is
// the reader's saved selection from the theme page (may be empty).
export interface ThemeFormSubmission {
  slug: string;
  window: string; // chosen date_windows[].key
  skeleton: string; // chosen date_windows[].skeleton (routing key)
  dates: [string, string]; // [start, end] — from the window, or exact-date picks
  pax: string; // chosen pax preset
  items?: Array<{ kind?: string; label?: string; short?: string; id?: string }>;
  // Quick-reply chips the reader toggled on in the form (seed_prompts).
  prompts?: string[];
}
