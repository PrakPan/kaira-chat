// components/theme/cinematic/themeForms/places.ts
//
// What the theme form needs to know about each place a theme page card is
// tagged with (`where`), so that when none of a theme's set routes reaches every
// saved pick it can still offer one — a route built from the picks themselves.
//
//   base    — where you'd sleep to do it, when that isn't the place itself
//             (Railay → Krabi, Delphi → Athens, Hobbiton → Auckland).
//   country — groups stops so a built route doesn't zig-zag between countries.
//   nights  — nights a trip usually spends there. Median stay per city across
//             real itineraries (mercury itinerary_itinerarycity.duration,
//             Sept 2026), floored at 2. Places with no or thin data (Sidemen,
//             Hydra, Abisko, Phi Phi…) use 2, or 3 where aurora / snow trips
//             need the extra night for weather.
//   at      — [lat, lng] (mercury geos_city), so a built route runs
//             nearest-first instead of in the order things were saved.
//   area    — a region or country rather than a stop ("Bali", "Japan",
//             "Lapland"). It becomes a stop only when no specific place in the
//             same country was picked.
//
// Keyed by slug (see placeKey) so "Tromsø" / "tromso" / "Tromso" all resolve.
// A place missing from here still works: it becomes its own 3-night stop.

export interface PlaceInfo {
  country: string;
  base?: string;
  nights?: number;
  area?: boolean;
  /** [lat, lng] from mercury geos_city — orders a built route's stops. */
  at?: [number, number];
}

/** "Saariselkä" → "saariselka", "Ko Lipe" → "ko_lipe". */
export const placeKey = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const P: Record<string, PlaceInfo> = {
  // ── Thailand ──
  Bangkok: { country: "Thailand", nights: 2, at: [13.76, 100.5] },
  "Chiang Mai": { country: "Thailand", nights: 2, at: [18.79, 98.99] },
  "Chiang Rai": { country: "Thailand", nights: 2, at: [19.92, 99.77] },
  Kanchanaburi: { country: "Thailand", base: "Bangkok" },
  Pattaya: { country: "Thailand", nights: 2, at: [12.92, 100.88] },
  Krabi: { country: "Thailand", nights: 2, at: [8.09, 98.91] },
  Railay: { country: "Thailand", base: "Krabi" },
  "Hong Island": { country: "Thailand", base: "Krabi" },
  Phuket: { country: "Thailand", nights: 2, at: [7.88, 98.39] },
  "Phang Nga Bay": { country: "Thailand", base: "Phuket" },
  "Phi Phi": { country: "Thailand", nights: 2, at: [7.74, 98.77] },
  "Koh Samui": { country: "Thailand", nights: 2, at: [9.51, 100.01] },
  "Koh Phangan": { country: "Thailand", nights: 2, at: [9.73, 100.01] },
  "Koh Tao": { country: "Thailand", nights: 3, at: [10.1, 99.84] },
  "Ko Lipe": { country: "Thailand", nights: 2, at: [6.49, 99.3] },
  "Koh Muk": { country: "Thailand", nights: 2, at: [7.37, 99.3] },
  "Koh Jum": { country: "Thailand", nights: 3, at: [7.81, 98.98] },
  "Koh Lanta": { country: "Thailand", nights: 2, at: [7.62, 99.08] },
  "Koh Yao Noi": { country: "Thailand", nights: 2, at: [8.12, 98.59] },
  Thailand: { country: "Thailand", nights: 5, area: true },

  // ── Indonesia ──
  Bali: { country: "Indonesia", nights: 4, area: true, at: [-8.67, 115.21] },
  Ubud: { country: "Indonesia", nights: 3, at: [-8.34, 115.09] },
  Seminyak: { country: "Indonesia", nights: 2, at: [-8.69, 115.17] },
  Uluwatu: { country: "Indonesia", nights: 2, at: [-8.41, 115.19] },
  Jimbaran: { country: "Indonesia", base: "Uluwatu" },
  "Nusa Penida": { country: "Indonesia", nights: 2, at: [-8.73, 115.54] },
  "Nusa Lembongan": { country: "Indonesia", nights: 2, at: [-8.68, 115.46] },
  Amed: { country: "Indonesia", nights: 2, at: [-8.34, 115.66] },
  "East Bali": { country: "Indonesia", base: "Amed" },
  Sidemen: { country: "Indonesia", nights: 2, at: [-8.48, 115.44] },
  Munduk: { country: "Indonesia", nights: 2, at: [-8.27, 115.05] },
  "Gili Trawangan": { country: "Indonesia", nights: 2, at: [-8.35, 116.04] },
  Indonesia: { country: "Indonesia", nights: 5, area: true },

  // ── Japan ──
  Tokyo: { country: "Japan", nights: 3, at: [35.68, 139.77] },
  Sapporo: { country: "Japan", nights: 2, at: [43.06, 141.35] },
  Otaru: { country: "Japan", base: "Sapporo" },
  Niseko: { country: "Japan", nights: 4, at: [42.8, 140.69] },
  Hakodate: { country: "Japan", nights: 2, at: [41.77, 140.73] },
  Noboribetsu: { country: "Japan", nights: 2, at: [42.46, 141.1] },
  Furano: { country: "Japan", nights: 2, at: [43.34, 142.38] },
  Biei: { country: "Japan", base: "Furano" },
  Japan: { country: "Japan", nights: 5, area: true },

  // ── Australia / New Zealand ──
  Sydney: { country: "Australia", nights: 3, at: [-33.87, 151.21] },
  "Blue Mountains": { country: "Australia", base: "Sydney" },
  Melbourne: { country: "Australia", nights: 3, at: [-37.81, 144.96] },
  "Great Ocean Road": { country: "Australia", nights: 2, at: [-38.76, 143.67] },
  Australia: { country: "Australia", nights: 6, area: true },
  Auckland: { country: "New Zealand", nights: 3, at: [-36.85, 174.76] },
  Hobbiton: { country: "New Zealand", base: "Auckland" },
  Waitomo: { country: "New Zealand", base: "Auckland" },
  Queenstown: { country: "New Zealand", nights: 3, at: [-45.03, 168.66] },
  "Mount Cook": { country: "New Zealand", nights: 2, at: [-43.59, 170.14] },
  "New Zealand": { country: "New Zealand", nights: 6, area: true },

  // ── Greece ──
  Athens: { country: "Greece", nights: 2, at: [37.98, 23.73] },
  Delphi: { country: "Greece", base: "Athens" },
  Hydra: { country: "Greece", base: "Athens" },
  Epidaurus: { country: "Greece", base: "Athens" },
  Santorini: { country: "Greece", nights: 3, at: [36.39, 25.46] },
  Mykonos: { country: "Greece", nights: 2, at: [37.45, 25.33] },
  Naxos: { country: "Greece", nights: 2, at: [37.1, 25.38] },
  Crete: { country: "Greece", nights: 3, at: [35.34, 25.14] },
  Meteora: { country: "Greece", nights: 2, at: [39.71, 21.63] },
  Thessaloniki: { country: "Greece", nights: 2, at: [40.64, 22.94] },
  Cyclades: { country: "Greece", nights: 4, area: true, at: [37.1, 25.38] },
  Greece: { country: "Greece", nights: 5, area: true },

  // ── Europe ──
  Prague: { country: "Czech Republic", nights: 3, at: [50.08, 14.44] },
  Vienna: { country: "Austria", nights: 3, at: [48.21, 16.37] },
  Salzburg: { country: "Austria", nights: 2, at: [47.81, 13.06] },
  Budapest: { country: "Hungary", nights: 3, at: [47.5, 19.04] },
  Dresden: { country: "Germany", nights: 2, at: [51.05, 13.74] },
  Berlin: { country: "Germany", nights: 2, at: [52.52, 13.4] },
  Munich: { country: "Germany", nights: 2, at: [48.14, 11.58] },
  Cologne: { country: "Germany", nights: 2, at: [50.94, 6.96] },
  Amsterdam: { country: "Netherlands", nights: 3, at: [52.37, 4.89] },
  Bruges: { country: "Belgium", nights: 2, at: [51.21, 3.22] },
  Strasbourg: { country: "France", nights: 2, at: [48.57, 7.75] },
  Paris: { country: "France", nights: 3, at: [48.86, 2.35] },
  London: { country: "United Kingdom", nights: 3, at: [51.51, -0.13] },
  Edinburgh: { country: "United Kingdom", nights: 3, at: [55.95, -3.19] },
  Glasgow: { country: "United Kingdom", nights: 2, at: [55.86, -4.25] },
  "Scottish Highlands": { country: "United Kingdom", nights: 2, at: [57.48, -4.22] },
  Speyside: { country: "United Kingdom", base: "Scottish Highlands" },
  Venice: { country: "Italy", nights: 2, at: [45.44, 12.32] },
  Rome: { country: "Italy", nights: 3, at: [41.9, 12.5] },
  Barcelona: { country: "Spain", nights: 3, at: [41.39, 2.17] },
  Spain: { country: "Spain", nights: 5, area: true },
  Lucerne: { country: "Switzerland", nights: 2, at: [47.05, 8.31] },
  Interlaken: { country: "Switzerland", nights: 2, at: [46.69, 7.86] },
  Switzerland: { country: "Switzerland", nights: 5, area: true },

  // ── Nordics ──
  Helsinki: { country: "Finland", nights: 2, at: [60.17, 24.94] },
  Rovaniemi: { country: "Finland", nights: 4, at: [66.5, 25.73] },
  Levi: { country: "Finland", nights: 4, at: [67.8, 24.81] },
  Saariselkä: { country: "Finland", nights: 3, at: [68.42, 27.41] },
  Kakslauttanen: { country: "Finland", base: "Saariselkä" },
  "Finnish Lapland": { country: "Finland", base: "Rovaniemi" },
  Lapland: { country: "Finland", base: "Rovaniemi" },
  Finland: { country: "Finland", nights: 5, area: true },
  Tromsø: { country: "Norway", nights: 3, at: [69.65, 18.96] },
  Norway: { country: "Norway", base: "Tromsø" },
  Abisko: { country: "Sweden", nights: 3, at: [68.35, 18.83] },
  Sweden: { country: "Sweden", base: "Abisko" },
  Iceland: { country: "Iceland", nights: 5, area: true, at: [64.15, -21.94] },
  Reykjavik: { country: "Iceland", nights: 3, at: [64.15, -21.94] },

  // ── Beaches / elsewhere ──
  Maldives: { country: "Maldives", nights: 4, area: true, at: [4.18, 73.51] },
  Male: { country: "Maldives", nights: 4, at: [4.18, 73.51] },
  Seychelles: { country: "Seychelles", nights: 5, at: [-4.68, 55.49] },
  Dubai: { country: "United Arab Emirates", nights: 4, at: [25.2, 55.27] },
  "Hoi An": { country: "Vietnam", nights: 2, at: [15.88, 108.34] },
};

const BY_KEY: Record<string, PlaceInfo & { name: string }> = Object.fromEntries(
  Object.entries(P).map(([name, info]) => [placeKey(name), { name, ...info }]),
);

const DEFAULT_NIGHTS = 3;
const MIN_TRIP_NIGHTS = 5;

/** Great-circle distance in km. */
const distanceKm = (a: [number, number], b: [number, number]): number => {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLng = (b[1] - a[1]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/**
 * Nearest-first from the first saved pick, so the route doesn't double back
 * (Phuket → Krabi → Koh Samui, not Phuket → Koh Samui → Krabi). Stops with no
 * coordinates slot in after the last stop from their country, or at the end.
 */
function orderStops<
  T extends { country: string; at?: [number, number] },
>(stops: T[]): T[] {
  const located = stops.filter((s) => s.at);
  const unlocated = stops.filter((s) => !s.at);
  const out: T[] = [];
  const left = [...located];
  let current = left.shift();
  while (current) {
    out.push(current);
    const from = current.at as [number, number];
    let best = -1;
    let bestKm = Infinity;
    left.forEach((s, i) => {
      const km = distanceKm(from, s.at as [number, number]);
      if (km < bestKm) {
        bestKm = km;
        best = i;
      }
    });
    current = best >= 0 ? left.splice(best, 1)[0] : undefined;
  }
  for (const s of unlocated) {
    let idx = -1;
    out.forEach((o, i) => {
      if (o.country === s.country) idx = i;
    });
    if (idx >= 0) out.splice(idx + 1, 0, s);
    else out.push(s);
  }
  return out;
}

export interface PicksRouteStop {
  place: string;
  nights: number;
}

/**
 * A route through the picked places, for when no set route reaches all of
 * them. Each pick resolves to where you'd sleep (its `base`), stops are
 * de-duplicated and ordered nearest-first from the first pick, a
 * region / country pick only becomes a stop when nothing more specific in that
 * country was picked, and the length is the sum of the stops' usual nights —
 * at least MIN_TRIP_NIGHTS, with any shortfall added to the first stop.
 */
export function buildPicksStops(wheres: string[]): PicksRouteStop[] {
  type Stop = {
    place: string;
    country: string;
    nights: number;
    area: boolean;
    at?: [number, number];
  };
  const stops: Stop[] = [];
  for (const where of wheres) {
    const raw = (where || "").trim();
    if (!raw) continue;
    let info = BY_KEY[placeKey(raw)];
    // Follow `base` (one hop is all the table uses) to where you'd sleep.
    let place = info?.name ?? raw;
    if (info?.base) {
      const base = BY_KEY[placeKey(info.base)];
      place = base?.name ?? info.base;
      info = base ?? { ...info, base: undefined, name: info.base };
    }
    if (stops.some((s) => placeKey(s.place) === placeKey(place))) continue;
    stops.push({
      place,
      country: info?.country ?? raw,
      nights: Math.max(2, info?.nights ?? DEFAULT_NIGHTS),
      area: !!info?.area,
      at: info?.at,
    });
  }

  // Drop a region / country stop when a specific place in it was also picked.
  const specific = stops.filter(
    (s) =>
      !s.area ||
      !stops.some((o) => o !== s && !o.area && o.country === s.country),
  );

  const ordered = orderStops(specific);

  const total = ordered.reduce((sum, s) => sum + s.nights, 0);
  if (ordered.length && total < MIN_TRIP_NIGHTS) {
    ordered[0].nights += MIN_TRIP_NIGHTS - total;
  }
  return ordered.map(({ place, nights }) => ({ place, nights }));
}
