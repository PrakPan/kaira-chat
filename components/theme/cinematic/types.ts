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
  prompt?: string;
  // When set, clicking opens the read-only activity details drawer for this
  // catalog activity id (e.g. the "Which ticket you actually need" cards)
  // instead of seeding a prompt. Takes priority over `prompt`. `activitySource`
  // forwards the provider source to the detail endpoint when required.
  activityId?: string;
  activitySource?: string;
}

// Horizontal "Step into the scene" card — thumbnail + meta + price. The
// thumbnail is either a cover `image` or, when absent, a gradient + `emoji`
// tile (matches the Lapland "Which Lapland is yours?" cards). An optional
// `urgent` line renders as a red banner across the card footer.
export interface CinematicTripCard {
  image?: string;
  emoji?: string; // shown on the gradient tile when no image
  gradient?: string; // tile backdrop when using emoji
  name: string;
  line?: string;
  tag?: string;
  price?: string;
  nights?: string;
  urgent?: string; // red urgency banner across the card footer
  objectPosition?: string; // cover-crop focal point (defaults to center)
  prompt?: string;
  // When set, clicking navigates here (e.g. an existing itinerary at
  // /chat/{itinerary_id}) instead of seeding `prompt`. `href` wins if both set.
  href?: string;
}

// Gradient/emoji "pillar" card — a hero tile with a mono window badge, name
// and supporting line. Powers the "Choose Your Arctic Story" scroller. An
// optional `image` shows in place of the emoji (with a skeleton loader).
export interface CinematicPillarCard {
  emoji: string;
  gradient: string;
  image?: string;
  window?: string; // mono badge over the hero tile (e.g. "Sept – Mar")
  name: string;
  line?: string;
  prompt: string;
}

// Row in a `list` section (e.g. "Where you'd sleep" / "Worth the cold"): a
// gradient + emoji thumb, a name with an optional highlight badge, a line, and
// a trailing arrow. Clicking seeds `prompt` or navigates to `href`.
export interface CinematicListRow {
  emoji: string;
  gradient: string;
  // Optional cover image for the thumb (shows over the gradient, with a
  // skeleton loader; falls back to the emoji if it fails / is absent).
  image?: string;
  objectPosition?: string;
  name: string;
  line?: string;
  badge?: string; // yellow pill next to the name ("Kaira's pick")
  prompt?: string;
  href?: string;
  // When set, clicking opens the read-only activity details drawer for this
  // ancillary/activity id (no Add/Remove CTA) instead of seeding a prompt.
  // Takes priority over `prompt`/`href`. `activitySource` forwards the
  // provider source to the detail endpoint when the catalog requires it.
  activityId?: string;
  activitySource?: string;
}

// Dark checklist row ("The Santa bit, done properly"): emoji + name + meta.
export interface CinematicCheckRow {
  emoji: string;
  name: string;
  meta?: string;
  prompt?: string;
  href?: string;
}

// Month/timeline row ("When to actually go"): a mono range + name + line.
export interface CinematicMonthRow {
  range: string;
  name: string;
  line?: string;
}

// Testimonial card ("People who went"): rating, traveller type, name, route.
export interface CinematicStoryCard {
  rating: string;
  type: string;
  name: string;
  route: string;
  prompt?: string;
  // When set, clicking opens this link — e.g. the traveller's actual itinerary
  // at /chat/{id}, or their Google review. `href` wins over `prompt`.
  href?: string;
}

// Dark "Where to eat" card ("Where to come in from the cold"): a warm spot with
// a cover image, name, city, one line, and a rating. Clicking seeds `prompt`.
export interface CinematicEatCard {
  image: string;
  name: string;
  city?: string; // yellow mono label
  line?: string;
  rating?: string;
  reviews?: string; // e.g. "1,240"
  objectPosition?: string;
  prompt?: string;
  // When set, clicking navigates here instead of seeding `prompt` — e.g. a
  // `?restaurant_id={id}` query that opens the restaurant details drawer.
  href?: string;
}

// Dark visa country card ("Your visa, handled"): the country, the cities it
// covers, and the fee. Clicking opens the country's visa page (`href`).
export interface CinematicVisaCard {
  country: string;
  cities?: string;
  fee?: string; // e.g. "€90"
  href?: string;
}

// Small fact chip under the visa cards (label + value).
export interface CinematicVisaFact {
  label: string;
  value: string;
}

// Numbered step ("Sketch it. I'll finish it."): number, title, serif accent,
// mono meta line.
export interface CinematicStep {
  n: string;
  title: string;
  sub?: string; // serif accent word after the title
  meta?: string;
}

// Gradient + emoji tile used by "Other themes" and "Destinations". Clicking
// either seeds a `prompt` or navigates to `href` (prompt wins if both set).
export interface CinematicGradientCard {
  emoji: string;
  gradient: string;
  // When set, the tile shows this image (with a skeleton loader) instead of the
  // emoji; the gradient stays as the backdrop while it loads / if it fails.
  image?: string;
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

// ── Feature block (dark — e.g. "A bullet train under the ocean floor") ───────
// A highlighted fact row: a short stat + a name + a supporting line.
export interface CinematicFeatureRow {
  stat: string; // e.g. "4 hrs"
  name: string;
  line?: string;
}

// A big-number tile in the feature section's 3-up stat grid.
export interface CinematicFeatureStat {
  stat: string; // e.g. "240m"
  label: string;
}

// Highlighted CTA card at the foot of the feature block (e.g. the JR Pass): a
// title + meta that opens the read-only activity drawer via `activityId`
// (falls back to seeding `prompt`).
export interface CinematicFeatureCta {
  title: string;
  meta?: string;
  activityId?: string;
  activitySource?: string;
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
      // Section background: "paper" (default) or "sand" (a warm neutral band,
      // used to group sections like the Hokkaido "Which mountain is yours").
      tone?: "paper" | "sand";
      // When set, each card shows a pill CTA at its foot with this label
      // (e.g. "Create this plan →"). Clicking anywhere on the card still fires
      // the card action; the label is a visual affordance. Omit to keep the
      // clean click-through cards used by the other theme pages.
      ctaLabel?: string;
      // CTA colour: "solid" (yellow fill, default — for primary "Create this
      // plan") or "dark" (ink fill + yellow text, for secondary "+ Add to trip").
      ctaTone?: "solid" | "dark";
    }
  | {
      type: "trips";
      heading: CinematicHeading;
      cards: CinematicTripCard[];
      // Full-width yellow CTA under each trip (e.g. "Book this itinerary →").
      ctaLabel?: string;
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
      // Full-width button under the grid (e.g. "View all destinations →").
      footerCta?: CinematicSectionCta;
    }
  | {
      type: "pillars";
      heading: CinematicHeading;
      cta?: CinematicSectionCta;
      cards: CinematicPillarCard[];
    }
  | {
      type: "list";
      heading: CinematicHeading;
      rows: CinematicListRow[];
      // Compact rows (40px thumb, no arrow emphasis) for dense lists like
      // "Worth the cold"; default rows use a 62px thumb like "Where you'd sleep".
      compact?: boolean;
    }
  | {
      type: "checklist";
      heading: CinematicHeading;
      rows: CinematicCheckRow[];
    }
  | {
      type: "months";
      heading: CinematicHeading;
      rows: CinematicMonthRow[];
      note?: ReactNode; // callout card under the month list
    }
  | {
      type: "stories";
      heading: CinematicHeading;
      cards: CinematicStoryCard[];
    }
  | {
      // Dark "Where to eat" scroller ("Where to come in from the cold").
      type: "eats";
      heading: CinematicHeading;
      cards: CinematicEatCard[];
      // Optional pill CTA at the foot of each card (e.g. "Add restaurant →").
      ctaLabel?: string;
    }
  | {
      // Dark "Your visa, handled" section — intro, country fee cards, fact chips.
      type: "visa";
      heading: CinematicHeading;
      intro?: string;
      cards: CinematicVisaCard[];
      facts?: CinematicVisaFact[];
      note?: ReactNode; // callout under the fact chips
    }
  | {
      // Dark editorial feature block (e.g. the undersea Shinkansen): a couple of
      // highlighted fact rows, a 3-up stat grid, and an activity CTA card.
      type: "feature";
      heading: CinematicHeading;
      intro?: string;
      rows?: CinematicFeatureRow[];
      stats?: CinematicFeatureStat[];
      cta?: CinematicFeatureCta;
    }
  | {
      type: "steps";
      heading: CinematicHeading;
      steps: CinematicStep[];
      cta?: CinematicSectionCta; // the "Start planning →" button
      note?: string; // footer mono line under the CTA
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
