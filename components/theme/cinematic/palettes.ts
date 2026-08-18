// components/theme/cinematic/palettes.ts
//
// One palette per theme, keyed by the theme's form slug (the same key the page
// hands to /chat via `?themeForm=` / setPendingSeedMeta). Two surfaces read it:
//
//   • the theme landing page — `config.theme` on its CinematicThemeConfig, and
//   • the in-chat mini-form (ThemeIntakeForm), which resolves the palette by
//     slug so the form's selected state, tags and CTA carry the same accent the
//     reader just came from.
//
// Keying by slug (rather than passing the colours through sessionStorage with
// the handoff) means a hard reload of /chat?themeForm=<slug> still renders the
// themed form, and the page and the form can never drift apart.

import type { CinematicThemePalette } from "./types";

export const THEME_PALETTES: Record<string, CinematicThemePalette> = {
  // /theme/australia-newzealand — harbour blue, the colour of a Sydney summer.
  "australia-newzealand": {
    accent: "#1a6f8f",
    accentSoft: "#e2f0f5",
    page: "#f7fbfc",
    heroTint: "#e8f4f7",
  },
  "christmas-markets": {
    accent: "#1f6b4a",
    accentSoft: "#eef4ea",
    page: "#f8faf6",
    heroTint: "#f9ece6",
  },
  "edinburgh-hogmanay": {
    accent: "#6d4a98",
    accentSoft: "#efe9f5",
    page: "#faf8f4",
    heroTint: "#f8ece0",
  },
  "greece-islands-done-right": {
    accent: "#2f6f9e",
    accentSoft: "#e6f0f7",
    page: "#f6fafc",
    heroTint: "#e9f3f8",
  },
  "hokkaido-powder": {
    accent: "#3d6b8f",
    accentSoft: "#e4eef5",
    page: "#f7fafb",
    heroTint: "#ecf4f9",
  },
  // /theme/honeymoon — a warm rose that reads romantic without going pink.
  honeymoon: {
    accent: "#a8556b",
    accentSoft: "#f8ebef",
    page: "#fbf7f7",
    heroTint: "#fbe9e6",
  },
  lapland: {
    accent: "#3d4f7a",
    accentSoft: "#eef2fb",
    page: "#f8f9fc",
    heroTint: "#eef2fb",
  },
  "northern-lights": {
    accent: "#16324f",
    accentSoft: "#e6edf4",
    page: "#f7f9fb",
    heroTint: "#e9f1f4",
  },
  // /theme/thailand-bachelor — Andaman turquoise.
  "thailand-bachelor": {
    accent: "#0d7f8f",
    accentSoft: "#e2f2f4",
    page: "#f7fbfb",
    heroTint: "#e6f3f2",
  },
  // /theme/thailand-bali-offbeat — jungle green, off the Andaman turquoise so
  // the two Thailand themes don't read as the same page.
  "thailand-bali-offbeat": {
    accent: "#0e7a55",
    accentSoft: "#e2f2ea",
    page: "#f6faf7",
    heroTint: "#dff0e6",
  },
  // /theme/filmy-getaways.
  "filmy-getaways": {
    accent: "#a03352",
    accentSoft: "#f8e5ec",
    page: "#fbf5f7",
    heroTint: "#f8e5ec",
  },
};

/** Palette for a theme slug, or `null` for an unknown/absent slug (callers then
 *  fall back to the neutral ink/yellow default). */
export const getThemePalette = (
  slug?: string | null,
): CinematicThemePalette | null => (slug && THEME_PALETTES[slug]) || null;

// The page each slug came from. Mostly `/theme/<slug>`; the mapping stays
// explicit so a renamed slug can keep its old spelling as an alias. Used by the
// chat's mobile close button to send the reader back where they started.
const THEME_PAGE_PATHS: Record<string, string> = {
  "australia-newzealand": "/theme/australia-newzealand",
  "christmas-markets": "/theme/christmas-markets",
  "edinburgh-hogmanay": "/theme/edinburgh-hogmanay",
  "greece-islands-done-right": "/theme/greece-islands-done-right",
  "hokkaido-powder": "/theme/hokkaido-powder",
  honeymoon: "/theme/honeymoon",
  lapland: "/theme/lapland",
  "northern-lights": "/theme/northern-lights",
  "filmy-getaways": "/theme/filmy-getaways",
  // Legacy slug: the filmy page used to identify itself as "switzerland-ddlj".
  // Threads created before the rename still carry it, and the mobile close
  // button resolves the path from the thread's stored slug — so keep the alias
  // or those readers lose their way back to the page.
  "switzerland-ddlj": "/theme/filmy-getaways",
  "thailand-bachelor": "/theme/thailand-bachelor",
  "thailand-bali-offbeat": "/theme/thailand-bali-offbeat",
};

/** Landing-page path for a theme slug, or `null` when the slug isn't a theme
 *  page (a plain /chat session). */
export const getThemePagePath = (slug?: string | null): string | null =>
  (slug && THEME_PAGE_PATHS[slug]) || null;
