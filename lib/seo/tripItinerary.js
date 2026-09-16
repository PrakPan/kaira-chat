// Cached trip payload -> the Redux shape the V1 itinerary view renders from.
//
// The trips leaf pages show the same itinerary UI as an archived V1 itinerary,
// but their data comes from the build-time snapshot (.seo-cache) rather than a
// runtime fetch. That difference matters: these 1,718 pages exist to put the
// day-by-day in the served HTML, so the state is seeded during the static
// export and the components render into it, instead of filling in after
// hydration.
//
// `is_v1_archive: true` is deliberate and load-bearing. Every read-only gate in
// the itinerary tree already keys off it — no Change hotel / Add stay / Add
// taxi / Add activity, no settings gear, no map CTA, no per-day dates, no
// Download & Share, and day chips derived from element_type. Setting it here is
// what makes the page "exactly like V1, not editable" without a second set of
// flags to keep in sync.
//
// Pure: no `fs`, no network. Safe to call from getStaticProps.

// The snapshot has no calendar dates — and the V1 view hides dates anyway (they
// are the dates a trip was originally sold for). Days are identified by their
// number instead.
const { tripName } = require("./tripName");

const buildCity = (meta, index, days, itineraryId) => {
  const cityId = `${itineraryId}-city-${index}`;
  const name = meta?.name;

  // A day names the cities it covers. It is attached to the first of them, so a
  // travel day that spans two stops appears once, under the city it starts in,
  // rather than being duplicated into both.
  const cityDays = days.filter((day) => (day?.cities || [])[0] === name);

  return {
    id: cityId,
    city: {
      id: `${cityId}-place`,
      name,
      image: meta?.image ? [{ image: meta.image }] : [],
    },
    duration: meta?.nights ?? 0,
    day_by_day: cityDays.map((day, dayIndex) => ({
      slab_id: `${cityId}-day-${dayIndex}`,
      // No date: the day-number column carries the sequence (see CityDay).
      date: null,
      day_summary: (day?.summaries || []).filter(Boolean)[0] || "",
      slab_elements: (day?.elements || []).map((element, elementIndex) => ({
        heading: element?.heading || "",
        name: element?.heading || "",
        element_type: element?.type || null,
        type: element?.type || null,
        icon: element?.image || null,
        tags: Array.isArray(element?.tags) ? element.tags : [],
        one_liner: element?.oneLiner || null,
        index: elementIndex,
        current_city_id: cityId,
      })),
    })),
  };
};

/**
 * @param {object} page A `.seo-cache/trips/<slug>.json` payload.
 * @returns {{itinerary: object, stays: object[]}|null}
 */
function tripItinerary(page) {
  if (!page?.id) return null;

  const cityMeta = page.cities || [];
  const days = page.days || [];
  if (!cityMeta.length) return null;

  const cities = cityMeta.map((meta, index) =>
    buildCity(meta, index, days, page.id),
  );

  // Any day whose city didn't match a `cities` row would otherwise vanish, so
  // the leftovers are appended to the first stop rather than dropped.
  const placed = cities.reduce((n, c) => n + c.day_by_day.length, 0);
  if (placed < days.length && cities[0]) {
    days.slice(placed).forEach((day, i) => {
      cities[0].day_by_day.push({
        slab_id: `${page.id}-city-0-extra-${i}`,
        date: null,
        day_summary: (day?.summaries || []).filter(Boolean)[0] || "",
        slab_elements: (day?.elements || []).map((element, elementIndex) => ({
          heading: element?.heading || "",
          name: element?.heading || "",
          element_type: element?.type || null,
          type: element?.type || null,
          icon: element?.image || null,
          tags: Array.isArray(element?.tags) ? element.tags : [],
          one_liner: element?.oneLiner || null,
          index: elementIndex,
          current_city_id: cities[0].id,
        })),
      });
    });
  }

  // Stays are matched to their city by name — the snapshot's only link between
  // the two. A stay whose city doesn't resolve is still listed, against the
  // first stop, rather than being silently dropped.
  const stays = (page.stays || [])
    .filter((stay) => stay?.name)
    .map((stay, index) => {
      const city =
        cities.find((c) => c.city.name === stay.city) || cities[0] || null;
      return {
        id: `${page.id}-stay-${index}`,
        name: stay.name,
        itinerary_city_id: city?.id || null,
        city_id: city?.city?.id || null,
        city_name: city?.city?.name || stay.city || null,
        star_category: stay.stars || null,
        key: index,
      };
    });

  return {
    itinerary: {
      id: page.id,
      // The public name, not the raw one: this travels into the store, where
      // the itinerary chrome can put it on screen, and into the props blob in
      // the served HTML. See lib/seo/tripName.
      name: tripName(page) || null,
      cities,
      // The clone card hides itself when the itinerary has no owner
      // (`if (!hasOwner || isOwn) return null` in ItineraryCloneCta), and these
      // trips have no customer — they were built and released by the travel
      // team, so that is who the card credits. Without this the panel would
      // render its header and composer with nothing between them.
      customer_name: "The Tarzan Way",
      duration: page.duration ?? null,
      group_type: page.group_type || null,
      currency: page?.price?.currency || "INR",
      // The card and the bottom bar both read this shape (paise on the V1
      // archive, rupees here — the snapshot's price is already in rupees, so it
      // is passed through as a per-person figure rather than re-scaled).
      trip_price: page?.price || null,
      status: "Finalized",
      // The flights / trains / road legs between stops, already through
      // toPublicTransfers. `v1_transfers` is the key the archive view reads —
      // DaybyDay renders it as V1TransfersList at the foot of the day-by-day,
      // directly above the page's FAQs.
      v1_transfers: Array.isArray(page.transfers) ? page.transfers : [],
      // See the header note: this is what makes the whole tree read-only.
      is_v1_archive: true,
      is_trip_page: true,
    },
    stays,
  };
}

module.exports = { tripItinerary };
