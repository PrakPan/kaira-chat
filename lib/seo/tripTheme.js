// Trip themes, shared by the build-time card model and the client-side filter
// bar.
//
// Pure like tripLength.js — no `fs` — so a component can import it without
// dragging the .seo-cache reader into the client bundle.
//
// What the corpus actually supports. Across the 1,718 released trips the slug
// and H1 carry exactly one theme word each, and it lines up 1:1 with
// `group_type`: honeymoon 659 = Couple 659, family 470 = Family 470, solo 137 =
// Solo 137, the rest Friends. So the theme is not a second, independent
// dimension — it is the same split said in the traveller's words. "Honeymoon in
// Bali" is what someone searches for; "Couple" is what the database calls it.
//
// The other axis — `experience_filters` (Romantic, Adventure, Hidden Gem …) —
// stays a separate "Vibe" row, because it is a multi-value tag and is only
// populated on about a quarter of the corpus.

const THEMES = [
  {
    id: "honeymoon",
    label: "Honeymoon",
    // Couples' trips are published under honeymoon slugs, and every one of the
    // 659 says so in its own H1.
    group: "Couple",
    match: /\bhoneymoon|\bromantic\b|\banniversary\b|\bbabymoon\b/i,
  },
  {
    id: "family",
    label: "Family",
    group: "Family",
    match: /\bfamily\b|\bkids\b|\bwith parents\b/i,
  },
  {
    id: "friends",
    label: "Friends & groups",
    group: "Friends",
    match: /\bfriends\b|\bgroup\b|\bbachelor|\bbachelorette/i,
  },
  {
    id: "solo",
    label: "Solo",
    group: "Solo",
    match: /\bsolo\b|\bbackpacking\b/i,
  },
];

/**
 * The one theme a trip belongs to, or null.
 *
 * The slug/H1 wins over group_type: it is what the page itself claims, and the
 * 13 rows with no group_type still name their theme there. group_type is the
 * fallback, which is what catches "Friends" trips whose slug says neither
 * "friends" nor "group".
 */
const tripTheme = (row = {}) => {
  const text = `${row.slug || ""} ${row.h1 || ""} ${row.name || ""}`;
  const named = THEMES.find((t) => t.match.test(text));
  if (named) return named.id;

  const group = row.group_type || "";
  const byGroup = THEMES.find((t) => t.group === group);
  return byGroup ? byGroup.id : null;
};

const themeLabel = (id) => THEMES.find((t) => t.id === id)?.label || id;

module.exports = { THEMES, tripTheme, themeLabel };
