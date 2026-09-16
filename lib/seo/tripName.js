// What a released trip is called on a public page.
//
// The trip's own `name` is the short, human one the travel team gave it —
// "Aurora for Two", "8N Cultural Adventure in Japan", "Bali, With Love". It is
// what a card and a heading want: 39 characters on average, against the 75 of
// the SEO `h1`, which is written for a search result and restates the slug
// ("9 Nights 10 Days Europe Honeymoon Itinerary: Amsterdam, Paris, Zurich &
// More").
//
// One thing has to come off it first. These itineraries were built for real
// customers and 527 of the 1,718 names still say so — "…for Joshini", "…with
// Naveen", plus a "(Cloned)" marker where the plan was copied. A first name is
// not ours to publish on an indexed page, so the trailing credit is stripped.
//
// Pure: no `fs`, no network. Safe from getStaticProps and from the client.

// A trailing "for X" / "with X" that names a person. The same shape can be part
// of a real title — "Aurora for Two", "Fall-ing for Japan", "A Love Affair with
// Andaman" — so it is only removed when X is neither somewhere the trip goes
// nor one of the words a trip is bought for.
const CREDIT =
  /\s+(?:for|with)\s+(?:Mr|Mrs|Ms|Dr|Miss)?\.?\s*([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,2})(?:\s*&\s*[A-Za-z]+)?[.\s]*$/i;

// The same credit written as a possessive, which puts it mid-title rather than
// at the end: "2N Escape to Kerala for Devika's Relaxing Retreat".
const POSSESSIVE = /\s+(?:for|with)\s+[A-Z][A-Za-z]+['’]s\b/;

// Names end in decoration often enough to matter — "…for Raj ✨", "Thai Me Up
// 💫". Peeled before the credit is looked for so the end-anchor can reach the
// name, and put back after: the emoji is the team's, the name is not.
// Anything at the end that is not a letter, a digit or a closing bracket —
// peeled only when there is an actual emoji in it, so a title that simply ends
// in "!" is left exactly as written.
const TRAILING_SYMBOLS = /([^\p{L}\p{N})\]]+)$/u;
const EMOJI_CHAR =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;

// Not names: who the trip is for, said as a group rather than as a person.
const NOT_A_NAME = new Set([
  "two",
  "us",
  "you",
  "me",
  "her",
  "him",
  "them",
  "family",
  "friends",
  "kids",
  "love",
  "mum",
  "mom",
  "dad",
  "parents",
  "couple",
  "couples",
  "one",
  "four",
  "three",
  "everyone",
]);

// "(Cloned)", "(Final)" — the CRM's own bookkeeping, never part of a title.
// "(2nd Edition)" and the like are left alone: those read as deliberate.
const MARKER = /^\((?:cloned|copy|final|draft|test)\)$/i;

// Any trailing parenthetical. Peeled before the credit is looked for, because
// "…for Ayushi (Final)" puts one between the name and the end of the string,
// and put back afterwards unless it was bookkeeping.
const TRAILING_PAREN = /\s*(\([^()]{1,24}\))\s*$/;

/**
 * Every place word this trip is associated with, lowercased.
 *
 * The slug is the one source present on both shapes we are handed — an index
 * row (no cities) and a cached page (cities) — and it is built from the route,
 * so "10-days-amsterdam-paris-zurich-honeymoon-itinerary" yields amsterdam,
 * paris and zurich for free.
 */
const placeWords = (trip) => {
  const words = new Set();

  for (const part of String(trip?.slug || "").split("-")) {
    if (part) words.add(part.toLowerCase());
  }

  const destination = String(trip?.destination || "").replace(/-/g, " ");
  for (const part of destination.split(/\s+/)) {
    if (part) words.add(part.toLowerCase());
  }

  for (const city of trip?.cities || []) {
    for (const part of String(city?.name || "").split(/\s+/)) {
      if (part) words.add(part.toLowerCase());
    }
  }

  return words;
};

/**
 * The trip's public name: its own short title, with any customer credit and
 * clone marker removed. Falls back to the SEO h1, then to the destination, so
 * something is always rendered.
 */
const tripName = (trip = {}) => {
  const raw = typeof trip.name === "string" ? trip.name.trim() : "";
  if (!raw) return typeof trip.h1 === "string" ? trip.h1 : "";

  let name = raw;
  let suffix = "";

  const emoji = name.match(TRAILING_SYMBOLS);
  if (emoji && EMOJI_CHAR.test(emoji[1])) {
    name = name.slice(0, emoji.index).trim();
    suffix = emoji[1].trim() ? ` ${emoji[1].trim()}` : "";
  }

  const parenthetical = name.match(TRAILING_PAREN);
  if (parenthetical) {
    name = name.slice(0, parenthetical.index).trim();
    if (!MARKER.test(parenthetical[1])) suffix = ` ${parenthetical[1]}`;
  }

  // "for Devika's Relaxing Retreat" -> "Relaxing Retreat" keeps the title and
  // drops the person. Checked first: it is not at the end, so the credit rule
  // below would never see it.
  name = name.replace(POSSESSIVE, "").trim();

  const credited = name.match(CREDIT);
  if (credited) {
    const who = credited[1];
    const places = placeWords(trip);
    const isPlace = who
      .split(/\s+/)
      .every((word) => places.has(word.toLowerCase()));
    const isGroup = who
      .split(/\s+/)
      .some((word) => NOT_A_NAME.has(word.toLowerCase()));

    if (!isPlace && !isGroup) {
      name = name.slice(0, credited.index).trim().replace(/[,\-–—]+$/, "").trim();
    }
  }

  return `${name}${suffix}`.trim() || trip.h1 || "";
};

module.exports = { tripName };
