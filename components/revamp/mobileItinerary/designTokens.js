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

/** Bordered white card — stay row, extras, "before you fly". */
export const card = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  background: "#ffffff",
};

/** The trip-total card: softer border, larger radius, the one intentional lift. */
export const tripCard = {
  border: `1px solid ${LINE_SOFT}`,
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 24px -18px rgba(11,18,32,0.25)",
};

/** Arrival-transfer row — tinted, no border. */
export const travelRow = {
  ...flat,
  border: "none",
  borderRadius: 14,
  background: "#eff4fe",
};

/**
 * The same row, with nothing in it — a leg of the route with no transfer
 * booked. It keeps the travel row's SHAPE, because a missing transfer is a
 * hole in the route rather than an extra you declined, and takes the amber the
 * chat itinerary already uses for exactly this state (VerticalLayout's
 * "No transfer added from … to …" card) so one condition reads the same on
 * every surface.
 */
export const travelGapRow = {
  ...flat,
  border: "1px solid #f5dfa6",
  borderRadius: 14,
  background: "#fff7e6",
};

/** "ADD" on the amber row — the tinted row's white pill, hairlined in amber. */
export const pillOnAmber = {
  ...flat,
  border: "1px solid #f0dbaa",
  borderRadius: 999,
  background: "#ffffff",
};

/** The day list is one bordered box; rows inside it are separated by hairlines. */
export const dayList = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  overflow: "hidden",
  background: "#ffffff",
};

export const dayRow = {
  ...flat,
  border: "none",
  borderTop: `1px solid ${HAIRLINE}`,
  borderRadius: 0,
  background: "#ffffff",
  width: "100%",
};

export const addRow = {
  ...dayRow,
  background: "#fbfbfa",
};

/** Pill controls — leg-nav chips, "More", "Map", the ask-Kaira field. */
export const pill = {
  ...flat,
  border: `1px solid ${LINE}`,
  borderRadius: 999,
  background: "#ffffff",
};

/** "CHANGE" on a tinted row sits on white with no border. */
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

/** Dashed placeholder — "Add a stay", "Ask Kaira to add something". */
export const dashed = {
  ...flat,
  border: `1.5px dashed #cfd3da`,
  borderRadius: 12,
  background: "#ffffff",
};

/** BOOKED tag. */
export const tag = {
  ...flat,
  border: `1px solid ${INK}`,
  borderRadius: 3,
};
