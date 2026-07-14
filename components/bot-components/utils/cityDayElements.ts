// Flattens the canonical itinerary (Redux `state.Itinerary`) into one card deck
// per city — the day-by-day activities and POIs that the map renders on each
// city marker. Field resolution mirrors CityDay.jsx (same old/new API quirks),
// so a card on the map reads exactly like its row in the itinerary panel.

const IMG_BASE = "https://d31aoa0ehgvjdi.cloudfront.net/";

export type CityElementType = "activity" | "poi";

export interface CityCardElement {
  key: string;
  name: string;
  image: string | null;
  oneLiner: string | null;
  type: CityElementType;
  /** Continuous day index across the whole trip, matching the itinerary panel. */
  dayNumber: number;
  /** "Fri 6 Jun", or null when the day carries no date (skeleton / draft). */
  dateLabel: string | null;
  /**
   * The element's own coordinates, when the API sent any. Drafts and older
   * payloads carry none, in which case the element has no marker of its own and
   * its card stays pinned to the city.
   */
  lat: number | null;
  lng: number | null;
}

export interface CityCard {
  id: string;
  cityName: string;
  /**
   * The city's own coordinates, when it has any. Draft and skeleton itineraries
   * carry `latitude: null` (see BotApp's transformDraftToItinerary), so these
   * are only a matching hint — the map anchors each deck to the route stop's
   * coordinates, and matches by city name when these are absent.
   */
  lat: number | null;
  lng: number | null;
  /** Cover shot for the city card — the overview the deck opens on. */
  image: string | null;
  /** Days spent in the city, for the city card's subtitle. */
  dayCount: number;
  elements: CityCardElement[];
}

// Old format quirks: an `activity` element carrying a `poi` key is really a POI;
// a `recommendation` carrying `restaurants[]` is really a restaurant.
const resolveElementType = (item: any): string | null => {
  if (!item) return null;
  if (item.element_type === "activity" && item.poi != null) return "poi";
  if (item.element_type === "activity" && item.activity) return "activity";
  if (
    item.element_type === "recommendation" &&
    Array.isArray(item.restaurants) &&
    item.restaurants.length > 0
  )
    return "restaurant";
  return item.element_type || null;
};

const getName = (item: any): string =>
  item?.name || item?.restaurants?.[0]?.name || item?.heading || "";

const resolveImage = (raw: unknown): string | null => {
  if (!raw || typeof raw !== "string") return null;
  return raw.startsWith("http") ? raw : IMG_BASE + raw.replace(/^\/+/, "");
};

const getImage = (item: any): string | null => {
  let icon = item?.icon || item?.restaurants?.[0]?.icon;
  if (Array.isArray(icon)) icon = icon[0] || null;
  return resolveImage(icon);
};

// `city.image` is an array of `{ image }` records on the canonical itinerary and
// a bare string on some older payloads.
const getCityImage = (city: any): string | null => {
  const raw = Array.isArray(city?.image)
    ? (city.image[0]?.image ?? city.image[0])
    : city?.image;
  return resolveImage(raw);
};

const toCoord = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Coordinates sit on the slab element itself on the canonical itinerary, but a
// restaurant recommendation keeps them on the restaurant, and some payloads nest
// the place under `poi` / `activity` rather than flattening it onto the element.
const getCoords = (item: any): { lat: number | null; lng: number | null } => {
  const sources = [item, item?.poi, item?.activity, item?.restaurants?.[0]];
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    const lat = toCoord(src.latitude ?? src.lat);
    const lng = toCoord(src.longitude ?? src.lng ?? src.long);
    if (lat != null && lng != null) return { lat, lng };
  }
  return { lat: null, lng: null };
};

// Same chain as CityDay.jsx's getItemSubtitle — canonical POIs often carry only
// an `address`, and dropping that fallback left those cards with a bare name
// where the itinerary panel shows a subtitle.
const getOneLiner = (item: any): string | null =>
  item?.one_liner ||
  item?.short_description ||
  item?.description ||
  item?.address ||
  item?.restaurants?.[0]?.one_liner ||
  item?.restaurants?.[0]?.short_description ||
  item?.restaurants?.[0]?.address ||
  null;

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// API dates are ISO "YYYY-MM-DD" — parse as local so we don't drift a day.
const formatDate = (dateStr?: string | null): string | null => {
  if (!dateStr) return null;
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${SHORT_WEEKDAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
};

// How many days precede city `index`. Intermediate cities have a checkout day
// whose date matches the next city's first day — collapse those so the same
// date keeps the same Day N across the city boundary. Ported from
// components/itinerary/itineraryCity/index.jsx so map and panel agree.
const dayOffsetForCity = (cities: any[], index: number): number => {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    const days = cities[i]?.day_by_day || [];
    offset += days.length || cities[i]?.duration || 0;
    const lastDate = days[days.length - 1]?.date;
    const nextFirstDate = cities[i + 1]?.day_by_day?.[0]?.date;
    if (lastDate && nextFirstDate && lastDate === nextFirstDate) offset -= 1;
  }
  return offset;
};

export function buildCityCards(itinerary: any): CityCard[] {
  const cities: any[] = itinerary?.cities ?? [];
  const cards: CityCard[] = [];

  cities.forEach((c, cityIdx) => {
    const city = c?.city ?? c;

    const offset = dayOffsetForCity(cities, cityIdx);
    const elements: CityCardElement[] = [];

    (c?.day_by_day ?? []).forEach((day: any, dayIdx: number) => {
      const dayNumber = offset + dayIdx + 1;
      const dateLabel = formatDate(day?.date);

      (day?.slab_elements ?? []).forEach((el: any, elIdx: number) => {
        const type = resolveElementType(el);
        if (type !== "activity" && type !== "poi") return;
        const name = getName(el);
        if (!name) return;
        const { lat, lng } = getCoords(el);
        elements.push({
          key: String(el?.id ?? `${cityIdx}-${dayIdx}-${elIdx}`),
          name,
          image: getImage(el),
          oneLiner: getOneLiner(el),
          type,
          dayNumber,
          dateLabel,
          lat,
          lng,
        });
      });
    });

    if (elements.length === 0) return;

    cards.push({
      id: String(c?.id ?? city.gmaps_place_id ?? city.id ?? city.name),
      cityName: city.name ?? "",
      lat: toCoord(city.latitude),
      lng: toCoord(city.longitude),
      image: getCityImage(city),
      dayCount: (c?.day_by_day ?? []).length || Number(c?.duration) || 0,
      elements,
    });
  });

  return cards;
}
