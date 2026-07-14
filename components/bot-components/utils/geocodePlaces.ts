// Resolve a day-by-day element to a point on the map.
//
// The canonical itinerary names an element ("Ferry Building Marketplace") but
// carries no coordinates for it, so the only way to give it a marker is to look
// the name up against the city it belongs to. That is a billed Google request
// per element, so results — including the misses, which are otherwise retried on
// every re-render — are cached for the tab's lifetime, and the lookups run one
// at a time rather than firing a whole itinerary's worth at once.

export interface LatLng {
  lat: number;
  lng: number;
}

/** `null` = looked up and not found; missing = never looked up. */
const cache = new Map<string, LatLng | null>();

const STORE_KEY = "ttw:mapGeocode";

// A geocode is stable for a given name+city, so it survives a reload rather than
// being paid for again. sessionStorage (not local) so a corrected itinerary in a
// later session isn't stuck with a stale point.
const loadStore = (): Record<string, LatLng> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveToStore = (key: string, coords: LatLng) => {
  if (typeof window === "undefined") return;
  try {
    const store = loadStore();
    store[key] = coords;
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // Private mode / quota — the in-memory cache still does its job.
  }
};

/** How far from its city a result may land before we call it a mismatch. */
const MAX_DRIFT_DEG = 0.6; // ~65km — comfortably wider than a metro area

// One at a time, with a breath between calls: a whole itinerary geocoded in
// parallel is what trips Google's rate limit (OVER_QUERY_LIMIT), and a marker
// that appears a moment late costs nothing.
let queue: Promise<unknown> = Promise.resolve();
const GAP_MS = 60;

const enqueue = <T,>(task: () => Promise<T>): Promise<T> => {
  const run = queue.then(task);
  queue = run
    .catch(() => undefined)
    .then(() => new Promise((r) => setTimeout(r, GAP_MS)));
  return run;
};

const lookup = async (
  query: string,
  near: LatLng,
): Promise<LatLng | null> => {
  const geocoder = new window.google.maps.Geocoder();
  // Bias — not restrict — to the city: a bounds box keeps "Ferry Building" in
  // San Francisco rather than any other city that has one, while still allowing
  // a place that sits just outside the box.
  const bounds = new window.google.maps.LatLngBounds(
    { lat: near.lat - 0.35, lng: near.lng - 0.35 },
    { lat: near.lat + 0.35, lng: near.lng + 0.35 },
  );
  const result = await geocoder.geocode({ address: query, bounds });
  const loc = result.results?.[0]?.geometry?.location;
  if (!loc) return null;

  const coords = { lat: loc.lat(), lng: loc.lng() };
  // A name the geocoder can't place often resolves to something far away (the
  // country's centroid, a same-named street abroad). Anything that far from the
  // city it belongs to is worse than no marker at all.
  if (
    Math.abs(coords.lat - near.lat) > MAX_DRIFT_DEG ||
    Math.abs(coords.lng - near.lng) > MAX_DRIFT_DEG
  )
    return null;

  return coords;
};

/**
 * Geocode `query` (an element's name, qualified by its city), biased to `near`.
 * Resolves to null when the place can't be placed near that city.
 */
export const geocodePlace = async (
  query: string,
  near: LatLng,
): Promise<LatLng | null> => {
  if (!query.trim()) return null;
  const key = `${query}`.toLowerCase();

  if (cache.has(key)) return cache.get(key)!;

  const stored = loadStore()[key];
  if (stored) {
    cache.set(key, stored);
    return stored;
  }

  if (typeof window === "undefined" || !window.google?.maps?.Geocoder)
    return null;

  return enqueue(async () => {
    // The queue means another caller may have resolved this while we waited.
    if (cache.has(key)) return cache.get(key)!;
    try {
      const coords = await lookup(query, near);
      cache.set(key, coords);
      if (coords) saveToStore(key, coords);
      return coords;
    } catch {
      // ZERO_RESULTS throws, as does a rate-limit trip. Cache the miss either
      // way: a retry loop across every render is the one outcome worse than a
      // missing marker.
      cache.set(key, null);
      return null;
    }
  });
};
