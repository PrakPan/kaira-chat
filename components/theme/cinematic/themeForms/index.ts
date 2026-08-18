// components/theme/cinematic/themeForms/index.ts
//
// Registry of theme mini-form configs, keyed by slug. Both the theme page and
// the /chat host resolve a form by slug from here, so the form data ships once
// and stays in sync across the route change.

import type { ThemeForm } from "./types";
import australiaNewZealandForm from "./australia-newzealand";
import hokkaidoPowderForm from "./hokkaido-powder";
import filmyGetawaysForm from "./filmy-getaways";
import laplandForm from "./lapland";
import christmasMarketsForm from "./christmas-markets";
import edinburghHogmanayForm from "./edinburgh-hogmanay";
import northernLightsForm from "./northern-lights";
import greeceIslandsForm from "./greece-islands-done-right";
import honeymoonForm from "./honeymoon";
import thailandBachelorForm from "./thailand-bachelor";
import thailandBaliOffbeatForm from "./thailand-bali-offbeat";

const FORMS: ThemeForm[] = [
  australiaNewZealandForm,
  hokkaidoPowderForm,
  filmyGetawaysForm,
  laplandForm,
  christmasMarketsForm,
  edinburghHogmanayForm,
  northernLightsForm,
  greeceIslandsForm,
  honeymoonForm,
  thailandBachelorForm,
  thailandBaliOffbeatForm,
];

const THEME_FORMS: Record<string, ThemeForm> = Object.fromEntries(
  FORMS.map((f) => [f.slug, f]),
);

export const getThemeForm = (slug?: string | null): ThemeForm | null =>
  (slug && THEME_FORMS[slug]) || null;

export type { ThemeForm, ThemeFormSubmission, ThemeDateWindow } from "./types";
