import type { Destination } from "./types";

// CloudFront base used across the app for media paths returned by the API
// (e.g. the geos suggest endpoint returns `media/cities/....jpg`).
export const CDN_BASE = "https://d31aoa0ehgvjdi.cloudfront.net/";

/** Resolve an API/relative image path to a full URL. Absolute URLs pass
 *  through unchanged; empty/nullish values return null. */
export function resolveImage(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return CDN_BASE + path.replace(/^\/+/, "");
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Curated featured destinations for step 1 — used when the form_fields effect
// does not carry its own `featured` list. Images use Unsplash photo ids that
// already ship in the StartScreen mockup data.
export const DEFAULT_FEATURED: Destination[] = [
  {
    name: "Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80&auto=format&fit=crop",
    headline: "Lantern towns and limestone bays.",
    place_tag: "Land of the ascending dragon",
    tags: "loved by solo",
    badge_type: "love",
  },
  {
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80&auto=format&fit=crop",
    headline: "Temples, rice fields and slow mornings.",
    place_tag: "Island of the gods",
    tags: "honeymoon fav",
    badge_type: "love",
  },
  {
    name: "Thailand",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=80&auto=format&fit=crop",
    headline: "Street food, beaches and golden temples.",
    place_tag: "Land of smiles",
    tags: "most booked",
    badge_type: "hot",
  },
  {
    name: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80&auto=format&fit=crop",
    headline: "Neon nights and quiet shrines.",
    place_tag: "Land of the rising sun",
    tags: "trending",
    badge_type: "hot",
  },
  {
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80&auto=format&fit=crop",
    headline: "Overwater villas and turquoise water.",
    place_tag: "Sun, sand and sea",
    tags: "pure luxury",
  },
  {
    name: "Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80&auto=format&fit=crop",
    headline: "Skylines, souks and desert dunes.",
    place_tag: "City of gold",
    tags: "family fav",
  },
  {
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80&auto=format&fit=crop",
    headline: "Gardens, hawker food and skyline views.",
    place_tag: "The lion city",
    tags: "quick escape",
  },
  {
    name: "Europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80&auto=format&fit=crop",
    headline: "Many countries, one unforgettable trip.",
    place_tag: "Old world charm",
    tags: "bucket list",
  },
];

// Default hero shown by the left panel before any destination is chosen.
export const DEFAULT_HERO = {
  image:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&q=80&auto=format&fit=crop",
  headline: "Like asking a friend who's been everywhere.",
  place_tag: "Pick a place to begin",
};

export const WHO_OPTIONS = [
  { value: "Just me", label: "🧍 Just me" },
  { value: "Couple", label: "💑 Couple" },
  { value: "Family", label: "👨‍👩‍👧 Family" },
  { value: "Friends", label: "🥂 Friends" },
  { value: "Parents / seniors", label: "👴 Parents / seniors" },
];

// who values that reveal the adult/child/infant pax counters
export const WHO_WITH_PAX = ["Family", "Friends", "Parents / seniors"];

export const NOTE_HINTS = [
  "on a budget",
  "luxury stays",
  "lots of beaches",
  "great food",
  "relaxed pace",
];

export const TOTAL_STEPS = 4;
