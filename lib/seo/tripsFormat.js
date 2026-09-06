// Display helpers shared by the trips leaf pages, hubs, and the JSON-LD.

// Destination slugs whose title-cased form is wrong. Everything else is
// "south-india" -> "South India", which is right far more often than not.
const DESTINATION_LABELS = {
  uae: "UAE",
  uk: "UK",
  usa: "USA",
  "south-india": "South India",
  "north-east": "North East",
  "andaman-and-nicobar": "Andaman & Nicobar",
  "jammu-and-kashmir": "Jammu & Kashmir",
};

const SMALL_WORDS = new Set(["and", "of", "the", "in"]);

function destinationLabel(slug) {
  if (!slug) return "";
  if (DESTINATION_LABELS[slug]) return DESTINATION_LABELS[slug];

  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((word, index) =>
      index > 0 && SMALL_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/**
 * The price the backend already baked into `page_title` and
 * `meta_description`, recomputed from `price.per_person`.
 *
 * It rounds to the nearest 100 (verified against 14 sampled titles), and the
 * page body has to land on the same number: a title that promises ₹2,45,000
 * next to a body reading ₹2,44,953.56 reads as a bait-and-switch to a user and
 * as a price mismatch to Google's merchant checks. The JSON-LD offer uses this
 * same value for the same reason.
 */
function roundedPerPerson(price) {
  const value = Number(price?.per_person);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value / 100) * 100;
}

function formatINR(amount) {
  if (!Number.isFinite(amount)) return null;
  try {
    return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
  } catch (err) {
    return `₹${Math.round(amount)}`;
  }
}

/**
 * "6 Nights 7 Days" — the evergreen framing. `duration` from the API is nights,
 * and these pages must never show a start date, so nights+1 is the only way to
 * express the trip length.
 */
function durationLabel(nights) {
  const value = Number(nights);
  if (!Number.isFinite(value) || value <= 0) return null;
  return `${value} Nights ${value + 1} Days`;
}

const nightsLabel = (nights) => {
  const value = Number(nights);
  if (!Number.isFinite(value) || value <= 0) return null;
  return `${value} ${value === 1 ? "night" : "nights"}`;
};

module.exports = {
  destinationLabel,
  roundedPerPerson,
  formatINR,
  durationLabel,
  nightsLabel,
};
