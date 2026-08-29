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

// A page item the reader can "save" toward their itinerary (an activity, POI,
// restaurant, …). When a card carries one AND the page provides a selection
// handler, clicking the card's CTA toggles the item in/out of the selection
// instead of seeding a chat. The saved list is handed to /chat and forwarded
// verbatim in the /chatkit request body's `items` field, so keep the shape
// backend-friendly: `label` is the full name, `short` a compact chip label,
// `kind` a category ("activity" | "poi" | "restaurant" | …), and `id` the
// catalog id when there is one (used as the de-dupe key).
export interface CinematicSelectableItem {
  kind: string;
  label: string;
  short: string;
  id?: string;
}

// What a prompt states about the trip it asks for. A card whose copy reads
// "10 nights in the Cyclades in May for a couple" declares those three facts
// here, and they travel to /chatkit as `intake` keys (month / nights / pax)
// instead of being left for the backend to parse out of the sentence — the
// same keys the themed mini-form submits.
//
// Declared next to the page's PROMPTS map via promptIntakeMap() so the numbers
// and the sentence stating them are edited together. Every field is optional
// and an absent one is simply not sent, so a prompt that names no month has no
// `month` key rather than a blank one.
export interface CinematicPromptIntake {
  /** Month the prompt is written for, 1–12. Resolved forward to its next
   *  bookable occurrence when the prompt fires, so a config never goes stale. */
  month?: number;
  /** Day of that month the trip must START on, for a prompt built around a
   *  fixed date — a Hogmanay street party, the Boxing Day Test, a New Year's
   *  Eve finish, a festival week. Set it whenever the prompt names an event,
   *  and pick the day so `nights` actually COVERS that event: a nine-night
   *  "New Year's Eve finish" needs to start on the 26th, not mid-month, or the
   *  dates end before the 31st. Without it the trip leaves mid-month, which is
   *  right for a prompt with no date in it. */
  day?: number;
  /** Nights the prompt asks for. Together with `month` this also produces the
   *  `dates` range, running from `day` when one is set and from the mini-form's
   *  mid-month departure otherwise. */
  nights?: number;
  /** Who the prompt is for — one of the intake form's WHO_OPTIONS values:
   *  "Just me" | "Couple" | "Family" | "Friends" | "Parents / seniors".
   *  Anchors the pax group; without it no traveller keys are sent. */
  who?: string;
  /** Defaults to 1 for "Just me" and 2 otherwise, matching the form. */
  adults?: number;
  children?: number;
  infants?: number;
  /** The theme form's route this prompt maps onto, when it maps onto one —
   *  `window` is the route key, `skeleton` its routing key. */
  window?: string;
  skeleton?: string;
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
  // When set and the page supplies a selection handler, clicking the card's
  // CTA toggles this item into the saved list (with a "selected" treatment)
  // instead of seeding `prompt`. Takes priority over `prompt`/`activityId`.
  item?: CinematicSelectableItem;
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
  // What the price covers, as short mono chips ("Flights", "Rail pass",
  // "Stays"). Rendered by the stacked layout only.
  includes?: string[];
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
  // The trip in a few words — "Street Party + Highlands", "6 nights ·
  // Christmas week" — shown as a pill at the foot of the card. It is NOT a
  // call to action: the card already ends in a "See itinerary →" CTA, so a
  // route that restates it ("See their itinerary →") just prints the same
  // button twice. Omit it and the card shows the CTA alone.
  route?: string;
  // What they actually said. Rendered as the card's body when present, wrapped
  // in quote marks — so only ever real review text, never a paraphrase.
  quote?: string;
  // Two or three lines describing the itinerary the card opens, for travellers
  // whose review text we don't have. Fills the same body slot as `quote` but
  // renders unquoted, because it is our description of the trip rather than
  // anything the traveller said. `quote` wins if a card somehow carries both.
  summary?: string;
  // When they travelled, e.g. "February 2026 · Niseko". Falls back to `type`.
  when?: string;
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
  // Same contract as CinematicPromptCard.item — toggles this restaurant into
  // the saved list when the page supplies a selection handler.
  item?: CinematicSelectableItem;
}

// Visa country card ("Your visa, handled"): the country, the cities it covers,
// and the fee. Clicking saves the visa to the trip, the same as every other
// "+ Add" element on the page. `href` is the fallback for a page that never
// opted into selection — there the card stays a link to the country's visa
// page.
export interface CinematicVisaCard {
  country: string;
  cities?: string;
  fee?: string; // e.g. "€90"
  href?: string;
  // A sentence of context, shown only on a page with one or two countries —
  // there the card owns most of a column, and a bare name and fee floating in
  // that much space reads like the section failed to load. Write what the
  // reader can't get from the fee: what the entry rule costs them in planning,
  // or what we do with the file. Ignored on a three-plus grid, which has no
  // room for it.
  line?: string;
}

// Small fact chip under the visa cards (label + value).
export interface CinematicVisaFact {
  label: string;
  value: string;
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
  // What the card's "+ Add" pill saves. Omit it and the `title` names the item
  // (carrying `activityId` as its catalog id), which is what the JR Pass and
  // long-tail-charter cards rely on — the pill has always said "+ Add", and now
  // that the detail drawer is retired it does exactly that.
  item?: CinematicSelectableItem;
}

// Numbered row in a `steps` section ("Sketch it. I'll finish it."): the
// ordinal in a yellow disc, then what happens at that step.
export interface CinematicStepRow {
  n: string; // "01"
  title: string;
  line?: string;
}

// Discriminated union of the section blocks a page can stack. Order in the
// config array is the render order. Every block also accepts the options in
// CinematicSectionOptions below — see CinematicSection.
type CinematicSectionBlock =
  | {
      type: "cards";
      heading: CinematicHeading;
      cta?: CinematicSectionCta;
      cards: CinematicPromptCard[];
      // Section background: "paper" (default), "sand" (a warm neutral band,
      // used to group sections like the Hokkaido "Which mountain is yours"), or
      // "dark" — the mockup's inset ink panel with a yellow heading and a
      // yellow-filled CTA, for a short row that has to stop the scroll.
      tone?: "paper" | "sand" | "dark";
      // Paragraph under the heading. The dark panel is the only tone that reads
      // with one; the light rows carry their explanation on the cards.
      intro?: string;
      // Keep the horizontal rail at every breakpoint instead of switching to a
      // 3-up grid from md. For the mockup's "Pick a film" and "Experiences
      // worth booking" scrollers, where eleven cards in a grid become four
      // stacked rows and stop reading as a set of options.
      rail?: boolean;
      // When set, each card shows a pill CTA at its foot with this label
      // (e.g. "Create this plan →"). Clicking anywhere on the card still fires
      // the card action; the label is a visual affordance. Omit to keep the
      // clean click-through cards used by the other theme pages.
      ctaLabel?: string;
      // CTA colour: "solid" (yellow fill, default — for primary "Create this
      // plan") or "dark" (ink fill + yellow text, for secondary "+ Add to trip").
      ctaTone?: "solid" | "dark";
      // When true, every card in this section becomes an "+ Add" save-toggle
      // (the page must supply a selection handler). Each card's saved item is
      // derived from the card (name + tag) unless the card sets an explicit
      // `item`. `itemKind` sets the category tag shown in the saved list.
      selectable?: boolean;
      itemKind?: string;
      // Noun for the resting Add pill: "activity" renders "+ Add activity".
      // Ignored unless `selectable` is set; the saved state stays "✓ Added".
      addNoun?: string;
    }
  | {
      type: "trips";
      heading: CinematicHeading;
      cards: CinematicTripCard[];
      // Full-width yellow CTA under each trip (e.g. "Book this itinerary →").
      ctaLabel?: string;
      // "row" (default) is the side-thumbnail card every other theme page
      // ships. "stacked" is the mockup's packaged-product card: cover photo on
      // top, included-in chips, a ruled price line and an ink CTA.
      layout?: "row" | "stacked";
      // "band" lays the section on a full-bleed wash of the page's accentSoft,
      // which is how the mockup separates the priced plans from the free
      // browsing above and below them.
      tone?: "paper" | "band";
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
      // When true, each row becomes an "+ Add" save-toggle (the page must supply
      // a selection handler); the item is derived from the row's name.
      selectable?: boolean;
      itemKind?: string;
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
      // Mono badge on the far end of the heading row, e.g. "★ 4.9".
      badge?: string;
    }
  | {
      // Dark "Where to eat" scroller ("Where to come in from the cold").
      type: "eats";
      heading: CinematicHeading;
      cards: CinematicEatCard[];
      // Optional pill CTA at the foot of each card (e.g. "Add restaurant →").
      ctaLabel?: string;
      // Keep the horizontal rail at every breakpoint instead of falling into a
      // 5-up grid from md — the mockup's "Where to eat" scroller, which stays
      // one row however many tables are on it.
      rail?: boolean;
      // When true, every card becomes an "+ Add" save-toggle (see the `cards`
      // section note). `itemKind` defaults to "restaurant" here.
      selectable?: boolean;
      itemKind?: string;
      // Noun for the resting Add pill: "table" renders "+ Add table" instead of
      // a bare "+ Add", which is what a restaurant card wants when the tray is
      // a long way further down the page. Ignored unless `selectable` is set;
      // the saved state stays the shared "✓ Added".
      addNoun?: string;
    }
  | {
      // "Your visa, handled" — one white card split in two: the heading, intro
      // and a 2×2 grid of facts on the left, the country cards (each a
      // "+ Add visa" save-toggle) on the right.
      type: "visa";
      heading: CinematicHeading;
      intro?: string;
      // Only the countries THIS theme's trips actually cross — a Hokkaido page
      // lists Japan, not the six other places someone might fly to instead.
      // The right column sizes itself from the count (one or two go full-width
      // and taller, three or more fall into two tracks), so a short, honest
      // list costs nothing in layout.
      cards: CinematicVisaCard[];
      // Rendered as a 2×2 grid, so four reads best; three leaves a hole and
      // five wraps to an uneven third row.
      facts?: CinematicVisaFact[];
      // The mockup's closing block under the country cards: a primary CTA, and
      // beneath it a callback strip for the reader who can't work out which
      // country to apply through — the one question a grid of countries can't
      // answer. Opt-in, and deliberately NOT the older `cta` key: five pages
      // still carry a `cta` from before that button was removed, and reviving
      // it here would put it back on all of them.
      footer?: {
        cta?: { label: string; href: string };
        callback?: {
          title: string;
          line?: string;
          cta: { label: string; href: string };
        };
      };
      note?: ReactNode; // closing line under the facts
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
      // Dark closing block ("Sketch it. I'll finish it."): the heading and the
      // page's primary CTA on one row, then a numbered 3-up of what happens
      // after the reader taps it.
      type: "steps";
      heading: CinematicHeading;
      rows: CinematicStepRow[];
      // Yellow pill beside the heading — seeds `prompt`, or navigates `href`.
      cta?: CinematicSectionCta;
      // Mono reassurance under the CTA, e.g. "10,000+ trips · rated 4.9".
      ctaNote?: string;
    };

// Options every section accepts, whatever its own shape.
export interface CinematicSectionOptions {
  /** Hide this whole block below 640px — the shared `.ttw-wide-only`
   *  breakpoint in globals.css — and keep it from there up. Decided in CSS
   *  rather than JS on purpose: a `useMediaQuery` swap renders the section on
   *  the server, then drops it at hydration, and the page shortens under the
   *  reader's thumb. */
  desktopOnly?: boolean;
}

// A block plus the shared options. Distributed member by member so
// `Extract<CinematicSection, { type: "cards" }>` still resolves to one member;
// a plain `CinematicSectionBlock & CinematicSectionOptions` would not, because
// the intersection is no longer a naked union for the conditional to walk.
type WithSectionOptions<T> = T extends unknown
  ? T & CinematicSectionOptions
  : never;

export type CinematicSection = WithSectionOptions<CinematicSectionBlock>;

// Film image shown as a rotated polaroid in the desktop hero collage.
export interface CinematicHeroImage {
  image: string;
  caption?: string; // serif italic caption under the polaroid
  // The scene this polaroid saves. When the page supplies a selection handler,
  // clicking the polaroid toggles this item in and out of the trip (a green
  // tick marks it saved). Omit it and the caption names the scene instead, so
  // an existing config becomes selectable without being rewritten; a polaroid
  // with neither stays purely decorative.
  item?: CinematicSelectableItem;
  /** @deprecated Ignored. The hero polaroids no longer navigate — they save
   *  the scene they show. Existing configs may still carry this; it has no
   *  effect. */
  href?: string;
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
  // "Build this itinerary" variant. When the reader has saved one or more
  // items on the page, the docked bar swaps to this prompt/label so the bottom
  // CTA reads as building the trip around the selection (the saved items ride
  // along in the /chatkit request). Falls back to `prompt`/`cta` when unset or
  // when nothing is selected.
  buildPrompt?: string;
  buildCta?: string;
}

// Per-theme colour set. The layout is identical on every theme page; only these
// few values change, so each page ships its own palette and the shared
// components read it through context (see usePalette in CinematicThemeLanding).
//
// `accent` carries every action on the page — the "Create this plan" / "Book
// this trip" buttons, the saved ("✓ Added") state, the docked bar's build
// button and bag. `accentSoft` is its pale wash, used for the resting "+ Add"
// pill, the saved-list rows and the count chips. Everything else (ink, paper,
// yellow) stays common across themes.
export interface CinematicThemePalette {
  accent: string; // e.g. "#3d6b8f" (Hokkaido blue)
  accentSoft: string; // pale tint of `accent`, e.g. "#e4eef5"
  accentOn?: string; // text/icon colour on an `accent` fill (defaults to white)
  page?: string; // page background (defaults to the shared paper)
  heroTint?: string; // wash faded out behind the hero (defaults to none)
}

export interface CinematicThemeConfig {
  // Compact in-page header shown above the hero (logo + title + subtitle).
  header?: {
    title: string;
    subtitle?: string;
  };
  // Theme colours. Omit for the neutral ink/yellow default.
  theme?: CinematicThemePalette;
  hero: CinematicHeroConfig;
  // Content measure for every section, e.g. "1440px". Defaults to the shared
  // 1240px. Set per page rather than globally so widening one theme can't
  // reflow the other ten.
  maxWidth?: string;
  sections: CinematicSection[];
  askBar?: CinematicAskBar;
}
