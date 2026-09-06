// lib/v1Itinerary.js
//
// Turns an archived V1 snapshot (one JSON per itinerary in the
// `ttw-v1-itineraries-data` bucket) into the four shapes the existing V1
// itinerary UI already reads from redux: `Itinerary`, `Breif`, `Plan` and
// `Bookings`. Those used to come from six separate supplier-portal endpoints;
// the portal is being decommissioned, so this is the whole data layer now.
//
// The snapshot is a *flattened* export, so a few things it does not carry:
//   • prices, payment info and booking ids for transfers — every pricing and
//     "select this option" path in the UI is driven by `payment`, which stays
//     null, so those blocks render nothing rather than calling a dead API.
//   • lat/long, city_id, gmaps_place_id — the route map has no coordinates to
//     plot, so it comes up empty.
//   • per-city `name` — see cityLabel() below.
//
// Everything else maps across cleanly. Field names differ in two places worth
// noting: the export calls a day element's title `name` where the UI reads
// `heading`, and calls the day's date `date` where the UI reads `slab`.

const NIGHTS = "Nights";

// "2024-05-17 00:00:00", "2024-05-17T00:00:00Z" and "2024-05-17" all reduce to
// the calendar day, which is the key day slabs are merged on.
const toDay = (value) => {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
};

/**
 * The export currently ships `cities[].city` as `{ image: [...] }` only — the
 * city's name was dropped on the way out. Read it if a later export adds it
 * back (under either spelling) and otherwise fall back to a positional label,
 * so the route strip and city tabs read "Stop 2" instead of "undefined".
 */
const cityLabel = (city, index) =>
  city?.name || city?.city_name || `Stop ${index + 1}`;

const dropEmpty = (list) => (Array.isArray(list) ? list.filter(Boolean) : []);

// --- day slabs ---------------------------------------------------------------

/**
 * Flattens `cities[].day_by_day[]` into the single chronological `day_slabs`
 * array the day-by-day components walk.
 *
 * Cities overlap on travel days — a 3-night Bangkok stay ending 05-20 and a
 * Chiang Mai stay starting 05-20 both carry a 05-20 entry with the same
 * activities — so days are merged by date and activities deduped by title.
 */
function buildDaySlabs(snapshot) {
  const byDate = new Map();

  const slabFor = (date) => {
    if (!byDate.has(date)) {
      byDate.set(date, { slab: date, day_summary: "", slab_elements: [] });
    }
    return byDate.get(date);
  };

  (snapshot.cities || []).forEach((entry) => {
    (entry?.day_by_day || []).forEach((day) => {
      const date = toDay(day?.date);
      if (!date) return;

      const slab = slabFor(date);
      if (!slab.day_summary && day.day_summary) slab.day_summary = day.day_summary;

      (day.slab_elements || []).forEach((element) => {
        const heading = element?.name;
        if (!heading) return;
        const seen = slab.slab_elements.some(
          (existing) =>
            existing.element_type === "activity" && existing.heading === heading,
        );
        if (seen) return;

        slab.slab_elements.push({
          element_type: "activity",
          icon: element.icon || null,
          heading,
          text: "",
          tags: element.tags || [],
          // Poi.js reads `activity_data.id` without a guard, so this has to be
          // an object even though the export carries no POI record.
          activity_data: {},
          bookings: [],
        });
      });
    });
  });

  // A city's arrival marker sets the day header ("Arrival in <city>") and is
  // what NewItenaryMain tracks to label every following day with its city.
  (snapshot.cities || []).forEach((entry, index) => {
    const date = toDay(entry?.start_date);
    if (!date) return;
    slabFor(date).slab_elements.unshift({
      element_type: "newcity",
      icon: null,
      heading: cityLabel(entry?.city, index),
      text: "",
      city_data: { city_name: cityLabel(entry?.city, index) },
      bookings: [],
    });
  });

  // Hotels land on their check-in day; the booking id links the day entry to
  // the card in the Stays section.
  (snapshot.cities || []).forEach((entry, index) => {
    (entry?.hotels || []).forEach((hotel) => {
      const date = toDay(hotel?.check_in);
      if (!date || !hotel?.name) return;
      slabFor(date).slab_elements.push({
        element_type: "accommodation",
        icon: null,
        heading: hotel.name,
        text: cityLabel(entry?.city, index),
        bookings: hotel.id ? [{ id: hotel.id }] : [],
      });
    });
  });

  (snapshot.transfers || []).forEach((transfer) => {
    const date = toDay(transfer?.check_in);
    if (!date || !transfer?.name) return;
    slabFor(date).slab_elements.push({
      element_type: "transfer",
      icon: transfer.icon || null,
      heading: transfer.name,
      text: transfer.travel_duration || "",
      modes: transfer.booking_type || null,
      meta: null,
      transfers: null,
      bookings: [],
    });
  });

  return [...byDate.values()]
    .sort((a, b) => (a.slab < b.slab ? -1 : a.slab > b.slab ? 1 : 0))
    .map((slab, index) => ({
      ...slab,
      slab_id: `day-${index}`,
      slab_elements: slab.slab_elements.map((element, element_index) => ({
        ...element,
        element_index,
      })),
    }));
}

// --- city slabs --------------------------------------------------------------

/**
 * The supplier's `city_slabs` convention, which the route strip and the Stays
 * section both index against: a departure-only entry first, the stayed-in
 * cities in the middle, and a trip-terminating entry last.
 */
function buildCitySlabs(snapshot, daySlabs) {
  const dayIndex = (value) => {
    const date = toDay(value);
    const found = daySlabs.findIndex((slab) => slab.slab === date);
    return found === -1 ? 0 : found;
  };

  const cities = (snapshot.cities || []).map((entry, index) => ({
    city_name: cityLabel(entry?.city, index),
    duration: entry?.duration ?? 0,
    start_date: toDay(entry?.start_date),
    end_date: toDay(entry?.end_date),
    image: entry?.city?.image?.[0]?.image || null,
    day_slab_location: { start_day_slab_index: dayIndex(entry?.start_date) },
    is_departure_only: false,
    is_trip_terminated: false,
    // No coordinates in the export — the route map plots nothing.
    lat: null,
    long: null,
    city_id: null,
    gmaps_place_id: null,
    intracity_transport: null,
  }));

  const lastDayIndex = Math.max(daySlabs.length - 1, 0);

  return [
    {
      city_name: snapshot.start_city?.name || "",
      duration: 0,
      is_departure_only: true,
      is_trip_terminated: false,
      day_slab_location: { start_day_slab_index: 0 },
      lat: null,
      long: null,
      city_id: null,
      gmaps_place_id: null,
    },
    ...cities,
    {
      city_name: snapshot.end_city?.name || "",
      duration: 0,
      is_departure_only: false,
      is_trip_terminated: true,
      day_slab_location: { start_day_slab_index: lastDayIndex },
      lat: null,
      long: null,
      city_id: null,
      gmaps_place_id: null,
    },
  ];
}

// --- bookings ----------------------------------------------------------------

function buildBookings(snapshot) {
  const stayBookings = [];
  const activityBookings = [];
  const transferBookings = [];
  const flightBookings = [];

  (snapshot.cities || []).forEach((entry, index) => {
    const city = cityLabel(entry?.city, index);

    (entry?.hotels || []).forEach((hotel) => {
      stayBookings.push({
        id: hotel?.id || null,
        name: hotel?.name || "",
        booking_type: "Accommodation",
        city,
        city_name: city,
        images: dropEmpty(hotel?.images),
        check_in: hotel?.check_in || null,
        check_out: hotel?.check_out || null,
        duration: hotel?.duration ?? null,
        number_of_adults: snapshot.number_of_adults ?? null,
        number_of_children: snapshot.number_of_children ?? null,
        // These are the hotels the trip was finalized with, so they always
        // read as included; nothing here is selectable any more.
        user_selected: true,
        costings_breakdown: [],
      });
    });

    (entry?.activities || []).forEach((activity, activityIndex) => {
      if (!activity?.name) return;
      activityBookings.push({
        id: `${index}-${activityIndex}-${activity.name}`,
        name: activity.name,
        booking_type: "Activity",
        city,
        city_name: city,
        images: activity.image ? [{ image: activity.image }] : [],
        check_in: activity.check_in || null,
        check_out: null,
        duration: activity.duration ?? null,
        number_of_adults: activity.pax ?? snapshot.number_of_adults ?? null,
        user_selected: true,
        // OldActivityBooking reads costings_breakdown[0] without a guard.
        costings_breakdown: [],
      });
    });
  });

  (snapshot.transfers || []).forEach((transfer, index) => {
    const booking = {
      id: `transfer-${index}`,
      name: transfer?.name || "",
      booking_display_name: transfer?.name || "",
      booking_type: transfer?.booking_type || "Taxi",
      icon: transfer?.icon || null,
      duration: transfer?.travel_duration || null,
      check_in: transfer?.check_in || null,
      check_out: transfer?.check_out || null,
      number_of_adults: transfer?.pax ?? snapshot.number_of_adults ?? null,
      user_selected: true,
      costings_breakdown: null,
    };
    transferBookings.push(booking);
    if (booking.booking_type === "Flight") flightBookings.push(booking);
  });

  return {
    stayBookings: stayBookings.length ? stayBookings : null,
    activityBookings: activityBookings.length ? activityBookings : null,
    transferBookings: transferBookings.length ? transferBookings : null,
    flightBookings: flightBookings.length ? flightBookings : null,
  };
}

// --- entry point -------------------------------------------------------------

/**
 * @param {object} snapshot Parsed `itineraries/<id>.json`.
 * @param {string} id       Itinerary id (the snapshot doesn't carry its own).
 * @returns {{itinerary: object, breif: object, plan: object, bookings: object}}
 */
export function adaptV1Snapshot(snapshot, id) {
  if (!snapshot || typeof snapshot !== "object") return null;

  const daySlabs = buildDaySlabs(snapshot);
  const citySlabs = buildCitySlabs(snapshot, daySlabs);
  const isFinalized = snapshot.status === "Finalized";

  return {
    itinerary: {
      id,
      name: snapshot.name || "",
      // The export leaves empty strings in `images` where a city had no photo.
      images: dropEmpty(snapshot.images),
      starting_city: { city_name: snapshot.start_city?.name || "" },
      ending_city: { city_name: snapshot.end_city?.name || "" },
      day_slabs: daySlabs,
      currency: snapshot.currency || "INR",
      status: snapshot.status || null,
      version: "v1",
      is_stock: false,
    },

    breif: { city_slabs: citySlabs },

    plan: {
      start_date: snapshot.start_date || null,
      end_date: snapshot.end_date || null,
      duration_number: snapshot.duration ?? null,
      duration_unit: NIGHTS,
      budget: snapshot.budget || null,
      group_type: snapshot.group_type || null,
      number_of_adults: snapshot.number_of_adults ?? null,
      number_of_children: snapshot.number_of_children ?? null,
      number_of_infants: snapshot.number_of_infants ?? null,
      currency: snapshot.currency || "INR",
      version: "v1",
      // Must never be ITINERARY_NOT_CREATED — the page alerts on that.
      itinerary_status: isFinalized
        ? "ITINERARY_PREPARED"
        : "ITINERARY_UNDER_PREPARATION",
      is_released_for_customer: isFinalized,
      experience_filters_selected: null,
      user_email: null,
      created_at: null,
    },

    bookings: buildBookings(snapshot),
  };
}

// --- Mercury-shaped output ---------------------------------------------------
//
// The archive was exported straight out of Mercury's itinerary structure, so it
// is very nearly the same object: 18 of Mercury's 19 top-level keys, identical
// nesting through cities -> day_by_day -> slab_elements. That means an archived
// itinerary can be rendered by the normal /chat itinerary view instead of the
// retired V1 layout — it only needs the handful of fields the export dropped.
//
// Differences this fills in, measured against a live Mercury response:
//   • cities[].id and cities[].city.id / .name / .latitude / .longitude
//   • day_by_day[].slab_id
//   • slab_elements[].heading (the export renamed it to `name`) and .type
// Everything else is passed through untouched.
//
// The archive's own extra key — a flat top-level `transfers` list — has no
// Mercury equivalent (Mercury keeps transfers per city). It is carried through
// as `v1_transfers` for the vertical transfers list the V1 view renders below
// the day-by-day.

// The clone CTA identifies whose itinerary you're looking at, and hides itself
// when there's no owner (`if (!hasOwner || isOwn) return null`). The export
// nulls `customer_name` on every record, but the itinerary title is the
// customer's own — "Bhaskar's Family Excursion in North India" — so the name is
// recovered from the possessive. Roughly 4 in 5 titles carry one; the rest fall
// back to the brand, which is accurate for archive itineraries TTW authored.
const ownerFromTitle = (title) => {
  const match = String(title || "").match(
    /^\s*([\p{L}][\p{L}.'\u2019-]*(?:\s+[\p{L}][\p{L}.'\u2019-]*)?)['\u2019]s\b/u,
  );
  if (!match) return null;
  return match[1]
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ARCHIVE_ELEMENT_TYPES = {
  activity: "Activity",
  recommendation: "Recommendation",
  meal: "Meal Recommendation",
  transfer: "Transfer",
  accommodation: "Accommodation",
  newcity: "New City",
};

/**
 * Adapt an archived snapshot into the shape the Mercury itinerary view reads.
 *
 * @param {object} snapshot Parsed `itineraries/<id>.json`.
 * @param {string} id       Itinerary id (the snapshot doesn't carry its own).
 * @returns {object|null}   A Mercury-shaped itinerary, or null.
 */
export function adaptV1ToMercuryShape(snapshot, id) {
  if (!snapshot || typeof snapshot !== "object") return null;

  const cities = (snapshot.cities || []).map((entry, index) => {
    // Ids are synthesised from the itinerary id so they stay stable across
    // renders — the components use them as React keys and scroll targets.
    const cityId = `${id}-city-${index}`;

    return {
      ...entry,
      id: cityId,
      city: {
        ...(entry?.city || {}),
        id: `${cityId}-place`,
        name: cityLabel(entry?.city, index),
        // No coordinates in the export, so the map has nothing to plot.
        latitude: entry?.city?.latitude ?? null,
        longitude: entry?.city?.longitude ?? null,
      },
      day_by_day: (entry?.day_by_day || []).map((day, dayIndex) => ({
        ...day,
        slab_id: `${cityId}-day-${dayIndex}`,
        slab_elements: (day?.slab_elements || []).map((element) => ({
          ...element,
          // The export renamed `heading` to `name`; keep both so either
          // spelling resolves.
          heading: element?.heading || element?.name || "",
          name: element?.name || element?.heading || "",
          type:
            element?.type ||
            ARCHIVE_ELEMENT_TYPES[element?.element_type] ||
            element?.element_type ||
            "",
          current_city_id: cityId,
        })),
      })),
    };
  });

  return {
    ...snapshot,
    id,
    cities,
    customer_name:
      snapshot.customer_name || ownerFromTitle(snapshot.name) || "The Tarzan Way",
    images: dropEmpty(snapshot.images),
    version: "v1",
    // Flags the read-only archive path for the view layer: it suppresses the
    // between-city transfer sections and renders these flat lists instead.
    is_v1_archive: true,
    v1_transfers: snapshot.transfers || [],
    // Stays are stored per city in the archive, but Mercury delivers them as
    // one flat list in `state.Stays` keyed by `itinerary_city_id` — which is
    // what ItineraryCity reads to draw the hotel row under each city heading.
    // Flattening them into that same shape here means the archive reuses the
    // V2 stay row instead of needing a V1-only list; ItineraryContainer's
    // loadArchivedV1 dispatches this straight into setStays().
    v1_stays: (snapshot.cities || []).flatMap((entry, index) => {
      const cityId = `${id}-city-${index}`;
      return (entry?.hotels || [])
        .filter((hotel) => hotel?.name)
        .map((hotel, hotelIndex) => ({
          ...hotel,
          // The row is hidden outright when the first stay has no `id` (it
          // doubles as the React key), so synthesise one for the handful of
          // archived hotels the export left without.
          id: hotel?.id || `${cityId}-stay-${hotelIndex}`,
          itinerary_city_id: cityId,
          city_id: entry?.city?.id ?? null,
          city_name: cityLabel(entry?.city, index),
          key: index,
          source: hotel?.images?.[0]?.source ?? null,
        }));
    }),
  };
}

export default adaptV1Snapshot;
