// ─────────────────────────────────────────────────────────────────────────────
//  Border / radius / elevation values, straight from the design.
//
//  These are INLINE styles rather than Tailwind classes on purpose. Three
//  stylesheets load after Tailwind in _app (styles.css, globals.css and
//  bootstrap.min.css), several with `!important`, and buttons in particular
//  were picking up elevation and radius that the design doesn't have — chips,
//  "More"/"Map", "CHANGE" and the day rows all rendered as lifted cards instead
//  of flat 1px-bordered surfaces. An inline style outranks every one of those
//  class and element rules, so the surface renders as drawn regardless of what
//  loads after it.
//
//  `boxShadow: "none"` is stated explicitly, not omitted — omitting it just
//  lets whatever global rule is adding the lift keep applying.
// ─────────────────────────────────────────────────────────────────────────────

export const LINE = "#dcdfe5"; // card + control borders
export const LINE_SOFT = "#ececec"; // trip card, header rule
export const HAIRLINE = "#f1f2f4"; // separators inside the day list
export const INK = "#0b1220";
export const YELLOW = "#f7e700";

const flat = { boxShadow: "none" };

/** Bordered white card — stay row, "before you fly". */
export const card = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  background: "#ffffff",
};

/**
 * The trip-total card: softer border, larger radius, the one intentional lift.
 *
 * `overflow: hidden` like the day cards, and for the same reason — the card is
 * a stack of rows under full-bleed hairlines, and its foot (the hold strip) is
 * ink, so without the clip its square corners paint over the card's own.
 */
export const tripCard = {
  border: `1px solid ${LINE_SOFT}`,
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 24px -18px rgba(11,18,32,0.25)",
  overflow: "hidden",
};

// ── Itinerary E · Bordered ───────────────────────────────────────────────────
// The day-by-day list as "Kaira E Bordered" draws it: every city in its own
// colour, carried by the city cover's gradient, the stay card's left edge, the
// included-activity strip and the day cards' border.
//
// Six colours, indexed by `leg.tone` (the leg's position, cycling). The design
// gives each as a base, a soft border and a gradient.
export const CITY_BASE = ["#2e5f52", "#b06a4a", "#2e4a5f", "#4a6f8f", "#6f5230", "#4a4a7a"];
export const CITY_SOFT = [
  "rgba(46,95,82,.5)",
  "rgba(176,106,74,.55)",
  "rgba(46,74,95,.5)",
  "rgba(74,111,143,.5)",
  "rgba(111,82,48,.55)",
  "rgba(74,74,122,.5)",
];
export const CITY_GRADIENT = [
  "linear-gradient(135deg,#2e5f52,#5ba38b)",
  "linear-gradient(135deg,#b06a4a,#d1936f)",
  "linear-gradient(135deg,#2e4a5f,#7fa8c4)",
  "linear-gradient(135deg,#4a6f8f,#8fb4d4)",
  "linear-gradient(135deg,#6f5230,#a3814f)",
  "linear-gradient(135deg,#4a4a7a,#8484b4)",
];
/** The "Fly home" cover — ink, not a city colour. */
export const HOME_GRADIENT = "linear-gradient(135deg,#0b1220,#2a3550)";

export const tone = (i) => (Number.isFinite(i) ? ((i % 6) + 6) % 6 : 0);

export const GREEN = "#1f8a5a";
export const GREEN_TINT = "rgba(31,138,90,.12)";
export const TRANSFER_TINT = "#eff4fe";
export const TRANSFER_INK = "#2563eb"; // glyph stroke
export const TRANSFER_LINK = "#1a4fd6"; // CHANGE / ADD text
export const PAPER_2 = "#f4f3ec";

/** Transfer card — tinted, no border. */
export const travelRow = {
  ...flat,
  border: "none",
  borderRadius: 14,
  background: TRANSFER_TINT,
};

/** City cover — the leg's gradient, no border. */
export const cover = (i, isHome = false) => ({
  ...flat,
  border: 0,
  borderRadius: 18,
  background: isHome ? HOME_GRADIENT : CITY_GRADIENT[tone(i)],
  boxSizing: "border-box",
});

/** Stay card — hairline border with the city's 3px colour edge. */
export const stayCard = (i) => ({
  ...flat,
  border: `1px solid ${LINE}`,
  borderLeft: `3px solid ${CITY_BASE[tone(i)]}`,
  borderRadius: 12,
  background: "#ffffff",
});

/** A booked taxi in the city — plain bordered row with ✓ INCLUDED. */
export const taxiCard = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  background: "#ffffff",
};

/** One card per day, bordered in the city's soft colour. */
export const dayCard = (i) => ({
  ...flat,
  border: `1.5px solid ${CITY_SOFT[tone(i)]}`,
  borderRadius: 18,
  background: "#ffffff",
  overflow: "hidden",
});

/** A row inside a day card, under a hairline. */
export const dayCardRow = {
  ...flat,
  border: 0,
  borderTop: `1px solid ${HAIRLINE}`,
  borderRadius: 0,
  background: "#ffffff",
  width: "100%",
};

/** An included activity — the day-card row with the city's 3px strip. */
export const paidRow = (i) => ({
  ...dayCardRow,
  borderLeft: `3px solid ${CITY_BASE[tone(i)]}`,
});

/** Mono chips — green "✓ …", dashed "ADD ›", and the time-of-day tag. */
export const chipIn = {
  ...flat,
  border: 0,
  borderRadius: 3,
  background: GREEN_TINT,
  color: GREEN,
};
export const chipAdd = {
  ...flat,
  border: "1px dashed #cfd3da",
  borderRadius: 3,
  background: "none",
  color: "#6b7280",
};
export const chipTod = {
  ...flat,
  border: 0,
  borderRadius: 3,
  background: PAPER_2,
  color: INK,
};

/**
 * Borderless reset for a button that is only a tap target. No `padding` here:
 * an inline padding would outrank the padding classes the caller sets.
 */
export const bare = {
  ...flat,
  border: 0,
  background: "none",
  borderRadius: 0,
};

/** Pill controls — leg-nav chips, "More", "Map", the ask-Kaira field. */
export const pill = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 999,
  background: "#ffffff",
};

/** "CHANGE" / "ADD ›" on a tinted row sits on white with no border. */
export const pillOnTint = {
  ...flat,
  border: "none",
  borderRadius: 999,
  background: "#ffffff",
};

/** Primary action — Fix, Review & pay. */
export const primary = {
  ...flat,
  border: "none",
  borderRadius: 10,
  background: YELLOW,
  color: INK,
};

export const primaryPill = {
  ...primary,
  borderRadius: 999,
  // The design gives the yellow pill a glow; `flat` kills shadows by default,
  // so it has to be re-stated after the spread.
  boxShadow: "0 8px 20px -10px rgba(247,231,0,0.55)",
};

/** Dashed placeholder — "Add a stay", "Add taxi in …". */
export const dashed = {
  ...flat,
  border: `1.5px dashed #cfd3da`,
  borderRadius: 12,
  background: "#ffffff",
};

/** "Day at leisure · ask Kaira" — the dashed placeholder, tighter, inside a day card. */
export const leisure = {
  ...dashed,
  borderRadius: 10,
};
