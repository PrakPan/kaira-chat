// ─────────────────────────────────────────────────────────────────────────────
//  Every sentence the mobile itinerary says to Kaira, in one place.
//
//  On this surface there are no edit drawers: a change is a request, and Kaira
//  is the one who makes it. Keeping the strings together means the vocabulary
//  stays consistent (lowercase, city-scoped) and can be tuned against the
//  model's prompt without hunting through components.
//
//  The first three are the exact strings the draft-itinerary path already
//  sends today (itineraryCity/index.jsx), so Kaira's existing handling of them
//  carries over unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const prompts = {
  // ── Stays ──────────────────────────────────────────────────────────────────
  changeStay: (city) => `change hotel in ${city}`,
  addStay: (city) => `add a hotel in ${city}`,
  removeStay: (city) => `remove the hotel in ${city} from my plan`,

  // ── Transfers between cities ───────────────────────────────────────────────
  changeTransfer: (city) => `change transfer in ${city}`,
  changeReturn: (city) => `change my return flight to ${city}`,
  // The origin is whatever the trip was in before this leg — the previous
  // city, or the trip's start city on leg 1. It can be missing (a first leg
  // the itinerary never named an origin for), and "from undefined to Kochi" is
  // worse than not saying it.
  addTransfer: (from, to) =>
    from ? `add a transfer from ${from} to ${to}` : `add a transfer to ${to}`,
  removeTransfer: (city) => `remove the transfer into ${city} from my plan`,
  // The return leg is named by where it lands, like changeReturn — "remove the
  // transfer into Hampi" is the wrong journey entirely on the way home.
  removeReturn: (city) => `remove my return journey to ${city} from my plan`,

  // ── Taxis within a city ────────────────────────────────────────────────────
  changeTaxi: (city) => `change the taxi in ${city}`,
  // The pickup/drop pair, named by which of the two it is and by where it
  // happens — "airport" for a flight, "station" for a train, a bus or a ferry.
  // `changeTaxi` means the sightseeing car, and a city that has all three would
  // otherwise send the same sentence for every one of them.
  changeHubTaxi: (hub, role, city) =>
    `change the ${String(hub || "airport").toLowerCase()} ${role} in ${city}`,
  addTaxi: (city) => `add a taxi in ${city}`,

  // ── Days ───────────────────────────────────────────────────────────────────
  addToDay: (city, dayLabel) =>
    dayLabel
      ? `add something to do in ${city} on ${dayLabel}`
      : `add something to do in ${city}`,
  askAboutDay: (city, dayLabel) =>
    dayLabel
      ? `what else can I do in ${city} on ${dayLabel}?`
      : `what else can I do in ${city}?`,

  // ── Items ──────────────────────────────────────────────────────────────────
  // TitleCase here is deliberate — it matches the existing detail-request
  // string the itinerary already sends (itineraryCity/index.jsx).
  showDetails: (name, city) => `Show ${name}, ${city} Details`,
  removeItem: (name, city) => `remove ${name} from my ${city} plan`,
  // A place or a restaurant is a plan entry, not a booking — the POI drawer's
  // CTA has always said "Replace with something else", so the request Kaira
  // gets is worded the same way rather than as a booking "change".
  replaceItem: (name, city) =>
    `Can you replace ${name}${city ? ` in ${city}` : ""} with something else?`,

  // ── Trip-level ─────────────────────────────────────────────────────────────
  changePax: () => `change traveller count`,
  changeDates: () => `change my travelling date`,
  changeRoute: () => `change my route`,
  changeActivity: (name, city) =>
    `Can you change ${name}${city ? ` in ${city}` : ""} to something else?`,
  openEnded: () => `I'd like to change something in my trip`,
  // `what` is the one booking being changed — "visa" or "eSIM". Each is its
  // own card and its own sheet now, so the request names one rather than
  // asking Kaira to redo both.
  changeAncillary: (what) => `change the ${what} in my trip`,
  // `what` is what the block actually holds — "visa", "eSIM" or "visa and
  // eSIM". A trip with no visa should not be asked to drop one.
  removeAncillaries: (what) => `remove the ${what} from my trip`,
  // A booking opened from the CART. The cart is grouped by kind, not by leg, so
  // a row there names the booking but not the city it sits in — these say what
  // to change by NAME, which is the one handle both sides of the conversation
  // already share.
  changeBooking: (name) => `change ${name} in my trip`,
  removeBooking: (name) => `remove ${name} from my trip`,

  // The change bar's Undo. Phrased as a request because that is what it is:
  // nothing here can roll the trip back on its own, so it asks the one party
  // that can — see TripChangeBar.
  undoLast: () => `undo the last change you made to my trip`,

  // ── Composer hints ─────────────────────────────────────────────────────────
  // The ask-Kaira field in the footer rotates through these rather than sitting
  // on one static line. A change surface with no visible controls has to teach
  // its own vocabulary: the only thing telling the user they can say "add
  // something to do in Hanoi" is the field offering it.
  //
  // Templated on the trip's own cities, so the examples name places the user is
  // actually going. The first two are trip-agnostic and always present, which
  // is also the whole list when the itinerary has no cities yet.
  hints: (cities = []) => {
    const named = (Array.isArray(cities) ? cities : []).filter(Boolean);
    return [
      "Ask Kaira anything",
      'Try: "Do we need a visa?"',
      named[0] ? `Try: "Change my ${named[0]} stay"` : null,
      named[1] || named[0]
        ? `Try: "Add something to do in ${named[1] || named[0]}"`
        : null,
    ].filter(Boolean);
  },
};

export default prompts;
