// components/theme/cinematic/types.ts
//
// Shared config types for the "cinematic" theme landing pages (the editorial,
// magazine-style theme surface first built for /theme/filmy-getaways). These
// are intentionally generic so any future theme — food trails, honeymoon,
// festivals — can drive the same layout from a single config object.
//
// Every clickable card carries a `prompt`; the page seeds it into a fresh
// /chat session (see useSeedChat). Gradient cards may instead carry an `href`
// to navigate to another page.

import type { ReactNode } from "react";

// A two-part heading: a plain lead with an optional serif-italic accent word,
// rendered as `lead <span class="ctl-serif">accent</span>`. Matches the
// mockup's "Scenes you never forgot" treatment.
export interface CinematicHeading {
  eyebrow?: string; // mono line above the heading
  lead: string;
  accent?: string;
  note?: string; // mono line below the heading (e.g. "Priced from Delhi")
}

// Small pill under the hero input — short label shown, full prompt sent.
export interface CinematicChip {
  label: string;
  prompt: string;
}

// Image card used by the Bollywood / Hollywood style rows.
export interface CinematicPromptCard {
  image: string;
  name: string;
  line?: string;
  tag?: string; // yellow corner badge
  // CSS object-position for the cover crop (e.g. "center", "top",
  // "center 35%"). Defaults to center. Use to keep a poster's subject in frame.
  objectPosition?: string;
  prompt: string;
}

// Horizontal "Step into the scene" card — thumbnail + meta + price.
export interface CinematicTripCard {
  image: string;
  name: string;
  line?: string;
  tag?: string;
  price?: string;
  nights?: string;
  objectPosition?: string; // cover-crop focal point (defaults to center)
  prompt: string;
}

// Gradient + emoji tile used by "Other themes" and "Destinations". Clicking
// either seeds a `prompt` or navigates to `href` (prompt wins if both set).
export interface CinematicGradientCard {
  emoji: string;
  gradient: string;
  name: string;
  meta?: string;
  prompt?: string;
  href?: string;
}

export interface CinematicSectionCta {
  label: string;
  href?: string;
  prompt?: string;
}

// Discriminated union of the section blocks a page can stack. Order in the
// config array is the render order.
export type CinematicSection =
  | {
      type: "cards";
      heading: CinematicHeading;
      cta?: CinematicSectionCta;
      cards: CinematicPromptCard[];
    }
  | {
      type: "trips";
      heading: CinematicHeading;
      cards: CinematicTripCard[];
    }
  | {
      type: "gradient";
      heading: CinematicHeading;
      cta?: CinematicSectionCta;
      cards: CinematicGradientCard[];
      // Desktop column count (defaults to 6). Mobile is a horizontal scroll
      // unless `mobileGrid` is set, which renders a 2-up grid instead.
      columns?: number;
      mobileGrid?: boolean;
    };

// Film image shown as a rotated polaroid in the desktop hero collage.
export interface CinematicHeroImage {
  image: string;
  caption?: string; // serif italic caption under the polaroid
  href?: string; // optional navigation on click
}

export interface CinematicHeroConfig {
  eyebrow?: string;
  heading: CinematicHeading;
  lede?: ReactNode;
  // Faux composer: placeholder text + the prompt sent on "Send".
  placeholder?: string;
  prompt?: string;
  chips?: CinematicChip[];
  // Desktop-only Kaira + film polaroid collage (hidden on mobile).
  images?: CinematicHeroImage[];
  kairaImage?: string; // round avatar src (defaults to /KairaInsta.jpg)
}

export interface CinematicAskBar {
  placeholder: string;
  cta?: string;
  prompt: string;
}

export interface CinematicThemeConfig {
  // Compact in-page header shown above the hero (logo + title + subtitle).
  header?: {
    title: string;
    subtitle?: string;
  };
  hero: CinematicHeroConfig;
  sections: CinematicSection[];
  askBar?: CinematicAskBar;
}
