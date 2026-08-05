import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { optimizedMediaUrl } from "../../lib/mediaImage";
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import CityElementCard from "./components/CityElementCard";
import CityOverviewCard from "./components/CityOverviewCard";
import ElementMarker, {
  ACTIVE_ELEMENT_MARKER_SIZE,
  ELEMENT_MARKER_SIZE,
} from "./components/ElementMarker";
import CityPinMarker from "./components/CityPinMarker";
import POIDetailsDrawer from "../drawers/poiDetails/POIDetailsDrawer";
import { categoryColor, categoryGlyph } from "./utils/categoryIcons";
import {
  createHtmlMarker,
  type HtmlMarkerOverlay,
} from "./utils/htmlMarkerOverlay";
import {
  buildCityCards,
  type CityCard,
  type CityCardElement,
  type CityElementType,
} from "./utils/cityDayElements";
import { geocodePlace, type LatLng } from "./utils/geocodePlaces";
import {
  chooseDeckPlacements,
  deckOffset,
  dotAnchor,
  markerRect,
  pinRect,
  tailStyle,
  CITY_PIN_ANCHOR,
  COST_COVER_ELEMENT,
  COST_COVER_PIN,
  type AnchorGeom,
  type DeckBox,
  type DeckPlacement,
  type Obstacle,
} from "./utils/deckPlacement";

interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  duration?: number;
  type?: string;
  accent?: string;
  one_liner_description?: string;
  image?: string;
  tags?: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  regionName: string;
  country: string;
}

interface MapProps {
  state: { lat: number; lng: number; zoom?: number };
  locations: Location[];
  userLocation: UserLocation | null;
  currentRoute: Location[] | null;
  /** True while the map pane is the one on screen — see MapViewProps.isVisible. */
  isVisible?: boolean;
  /**
   * Height in px, measured up from the viewport bottom, of the fixed cart / route
   * bars that overlay the map. The day-by-day cards are kept clear of this band
   * (plus the back-to-itinerary pill floating just above it) so they stay fully
   * visible — see the placement pass.
   */
  chromeBottom?: number;
}

/**
 * A city's day-by-day deck once it has been bound to a route stop: anchored to
 * that stop's coordinates, and tagged with its index so a marker can find its
 * own deck without re-matching on position.
 */
type DeckCard = Omit<CityCard, "lat" | "lng"> & {
  lat: number;
  lng: number;
  stopIndex: number;
};

/**
 * A deck opens on the city itself; paging into its elements is what the Explore
 * call to action does. So the index a deck is "at" is either this — the city
 * overview — or the position of one of its elements.
 */
const CITY_VIEW = -1;

/** Elements only get their own marker once the API has given them coordinates. */
const hasCoords = (
  el?: CityCardElement,
): el is CityCardElement & { lat: number; lng: number } =>
  !!el && el.lat != null && el.lng != null;

/** Standalone category markers — map locations that are not part of a city's
 * day-by-day deck, and so are still drawn as a plain marker icon. */
const CATEGORY_MARKER_SIZE = 36;

/**
 * Which marker a deck's card hangs off right now: the element being shown, or
 * the city itself — which is also the fallback for an element the API sent
 * without coordinates and which we could not geocode, since it has no marker of
 * its own.
 */
const deckAnchorEl = (
  card: DeckCard,
  index: number,
): (CityCardElement & { lat: number; lng: number }) | null => {
  const el = index >= 0 ? card.elements[index] : undefined;
  return hasCoords(el) ? el : null;
};

const deckAnchor = (card: DeckCard, index: number): google.maps.LatLngLiteral => {
  const el = deckAnchorEl(card, index);
  return el ? { lat: el.lat, lng: el.lng } : { lat: card.lat, lng: card.lng };
};

/** The shape of that marker — a card is offset from the marker, not the point. */
const deckAnchorGeom = (card: DeckCard, index: number): AnchorGeom =>
  deckAnchorEl(card, index)
    ? dotAnchor(ACTIVE_ELEMENT_MARKER_SIZE)
    : CITY_PIN_ANCHOR;

/**
 * Stacking order for overlapping decks. Earlier stops sit on top of later ones —
 * the route reads first-to-last, so city 2's card should cover city 3's, not the
 * other way round (DOM order alone would do the opposite, since the decks are
 * appended in route order). A deck the user has clicked beats them all: on a
 * tight route that is the only way to reach a card that is fully covered.
 */
const DECK_FOCUS_Z = 1000;
const deckZIndex = (index: number, total: number, focused: boolean): number =>
  focused ? DECK_FOCUS_Z : Math.max(1, total - index);

/**
 * The dismissed-map the deck stack opens with: only the first city's card is
 * shown, the rest start collapsed onto their pins and open when their pin (or
 * marker) is clicked — see showCityCard. "First" is the earliest route stop
 * that matched a deck, since cityCards is built in route order.
 */
const collapsedButFirst = (cards: DeckCard[]): Record<string, boolean> => {
  const dismissed: Record<string, boolean> = {};
  cards.forEach((card, index) => {
    if (index > 0) dismissed[card.id] = true;
  });
  return dismissed;
};

/** The back-to-itinerary pill floats this far above the cart bar; a card kept
 * clear of the bar should clear the pill too. */
const BACK_PILL_CLEARANCE = 52;
/** Breathing room reserved along the top of the pane (header / fullscreen
 * control) so a card never tucks under it. */
const TOP_CHROME = 12;

/**
 * A container for an HTML marker: absolutely positioned, sitting on its point
 * however `transform` says, and swallowing clicks so a marker press never also
 * reads as a press on the map. Gestures are left alone, so a drag that happens
 * to start on a marker still pans.
 */
const markerNode = (transform: string): HTMLDivElement => {
  const node = document.createElement("div");
  node.style.position = "absolute";
  node.style.transform = transform;
  google.maps.OverlayView.preventMapHitsFrom(node);
  return node;
};

/** The little triangle joining a card to its pin. */
const DeckTail = ({ placement }: { placement: DeckPlacement }) => (
  <div
    style={{
      width: 0,
      height: 0,
      filter: "drop-shadow(0 2px 2px rgba(11,18,32,0.10))",
      ...(tailStyle(placement) as React.CSSProperties),
    }}
  />
);

/** Placement used until the first measured pass lands — card above its pin. */
const DEFAULT_PLACEMENT: DeckPlacement = {
  side: "top",
  ...deckOffset("top", "center", 244, 258),
  tail: 122,
};

// Snazzy Maps WY Style
const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{ weight: "2.00" }],
  },
  {
    featureType: "all",
    elementType: "geometry.stroke",
    stylers: [{ color: "#9c9c9c" }],
  },
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f2f2f2" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7b7b7b" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9f6f8" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#e9f6f8" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#070707" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
];

// Numbered route-stop pin. The teardrop (and number) take the color the cities
// widget assigned to this stop; the center stays white.
function getNumberedPin(number: number, color: string = "#FD6D6C"): google.maps.Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
      <defs>
        <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.30)"/>
        </filter>
      </defs>
      <!-- exact pin shape with shadow -->
      <path d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z" fill="${color}" filter="url(#sh)"/>
      <!-- white filled circle over the hollow center -->
      <circle cx="24" cy="23.9643" r="11.5" fill="white"/>
      <!-- number -->
      <text x="24" y="28.5" text-anchor="middle"
        font-family="Inter, Arial, sans-serif"
        font-size="13"
        font-weight="700"
        fill="${color}">${number}</text>
    </svg>`;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(36, 46),
    anchor: new google.maps.Point(18, 46),
  };
}

// Start / end city endpoint pin — teardrop shape with a take-off/landing glyph.
// Used for the trip's origin (green) and departure (dark) cities so users can
// visually distinguish them from numbered route stops.
function getEndpointPin(kind: "start" | "end"): google.maps.Icon {
  const fill = kind === "start" ? "#22C55E" : "#111827";
  const glyph =
    kind === "start"
      ? // Takeoff arrow
        `<path d="M6 22l20-6-2-3-6 1-8-7-3 1 4 6-5 1-2-2-2 1 4 5z" fill="white"/>`
      : // Landing arrow (mirrored)
        `<path d="M26 22L6 16l2-3 6 1 8-7 3 1-4 6 5 1 2-2 2 1-4 5z" fill="white"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
      <defs>
        <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.30)"/>
        </filter>
      </defs>
      <!-- exact pin shape with shadow -->
      <path d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z" fill="#FD6D6C" filter="url(#sh)"/>
      <!-- white filled circle over the hollow center -->
      <circle cx="24" cy="23.9643" r="11.5" fill="white"/>
      <!-- number -->
    </svg>`;
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(36, 46),
    anchor: new google.maps.Point(18, 46),
  };
}

// Category marker for a standalone map location — a search result or any pin the
// bot drops that is not part of a city's day-by-day. The deck's own elements are
// drawn from their photos instead (see components/ElementMarker), so this is
// only the plain-pictogram case.
function getMarkerIcon(type: string): google.maps.Icon {
  const bg = categoryColor(type);
  const { viewBox, markup } = categoryGlyph(type);
  const size = CATEGORY_MARKER_SIZE;

  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="rgba(124,121,121,0.25)"/>
          </filter>
          <circle cx="18" cy="18" r="16" fill="${bg}" filter="url(#sh)"/>
          <g transform="translate(8, 8)">
            <svg width="20" height="20" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
              ${markup}
            </svg>
          </g>
        </svg>
      `),
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
  };
}

// Accent name → hex color
const ACCENT_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
  yellow: "#eab308",
};

const getImageUrl = (img) => {
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  if (!img) return "";
  const url =
    img.startsWith("http://") || img.startsWith("https://")
      ? img
      : imgUrlEndPoint + img;
  return optimizedMediaUrl(url, { width: 400 });
};

function resolveAccent(accent?: string): string {
  if (!accent) return "#FD6D6C";
  return ACCENT_COLORS[accent.toLowerCase()] ?? "#FD6D6C";
}

// Teardrop fill for a route-stop pin — the color the cities widget assigns to
// the stop. Accepts a hex ("#3b82f6") or a palette name, optionally with a
// Tailwind-style shade ("blue-500") or "accent." prefix. Falls back to the
// brand coral so a stop without a color still shows a pin.
function resolvePinColor(loc?: any): string {
  const raw = (
    loc?.color ??
    loc?.pin_color ??
    loc?.dot_color ??
    loc?.accent ??
    ""
  )
    .toString()
    .trim();
  if (!raw) return "#FD6D6C";
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
  const base = raw.toLowerCase().replace(/^accent\./, "").replace(/-\d+$/, "");
  return ACCENT_COLORS[base] ?? "#FD6D6C";
}

// Resolve an image URL — return absolute URLs as-is, otherwise prepend the
// CloudFront base. Used anywhere we consume a server-supplied image path.
function resolvePopupImageUrl(img?: string): string | undefined {
  if (!img) return undefined;
  const url = /^https?:\/\//i.test(img)
    ? img
    : "https://d31aoa0ehgvjdi.cloudfront.net/" + img.replace(/^\/+/, "");
  return optimizedMediaUrl(url, { width: 400 });
}

// Unified compact popup — matches the Figma card design
// (cover image, title row with rating, pin-icon location line, clamped description).
// Fixed width 240px, image fills container edge-to-edge (no negative-margin hacks).
function buildPopupHTML({
  image,
  title,
  rating,
  ratingCount,
  locationText,
  description,
  accentColor,
  badge,
}: {
  image?: string;
  title: string;
  rating?: number;
  ratingCount?: number;
  locationText?: string;
  description?: string;
  accentColor: string;
  badge?: string;
}): string {
  const safeTitle = title.replace(/"/g, "&quot;");
  const resolvedImage = resolvePopupImageUrl(image);

  const imageBlock = resolvedImage
    ? `<div style="width:100%;height:140px;overflow:hidden;border-radius:12px 12px 0 0;">
         <img src="${resolvedImage}" alt="${safeTitle}" style="width:100%;height:100%;object-fit:cover;display:block;" />
       </div>`
    : "";

  const ratingBlock =
    typeof rating === "number" && rating > 0
      ? `<div style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:#111827;flex-shrink:0;white-space:nowrap;">
           <span>${Number(rating).toFixed(1)}</span>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           ${ratingCount ? `<span style="color:#6B7280;font-weight:400;">(${ratingCount})</span>` : ""}
         </div>`
      : "";

  const locationBlock = locationText
    ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
           <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z"/>
           <circle cx="12" cy="10" r="3"/>
         </svg>
         <span style="font-size:11px;color:#6B7280;">${locationText}</span>
       </div>`
    : "";

  const descriptionBlock = description
    ? `<p style="color:#6B7280;font-size:11px;margin:8px 0 0 0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${description}</p>`
    : "";

  const badgeBlock = badge
    ? `<div style="margin-bottom:6px;"><span style="padding:2px 8px;background:${accentColor};color:#fff;border-radius:9999px;font-size:10px;font-weight:600;">${badge}</span></div>`
    : "";

  return `<div style="width:240px;font-family:'Inter',sans-serif;border-radius:12px;overflow:hidden;background:#fff;">
    ${imageBlock}
    <div style="padding:12px;">
      ${badgeBlock}
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <h4 style="font-weight:600;margin:0;color:#111827;font-size:14px;line-height:1.3;flex:1;min-width:0;">${title}</h4>
        ${ratingBlock}
      </div>
      ${locationBlock}
      ${descriptionBlock}
    </div>
  </div>`;
}

const MyMap = forwardRef<google.maps.Map | null, MapProps>(
  (
    {
      state,
      locations,
      userLocation,
      currentRoute,
      isVisible = true,
      chromeBottom = 0,
    },
    ref,
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    // One polyline per segment so we can draw arrows between consecutive stops
    const polylinesRef = useRef<google.maps.Polyline[]>([]);
    const [mapReady, setMapReady] = useState(false);

    // Fallback route from the Itinerary redux slice — used when the bot has
    // not sent any map_effects yet (no currentRoute, no locations). Renders
    // the saved itinerary as start_city → intermediate cities → end_city,
    // matching the focus_route visual (numbered stops + dashed polyline).
    const itineraryRedux = useSelector((s: any) => s.Itinerary);
    const fallbackRoute = useMemo<Location[] | null>(() => {
      const hasRoute = currentRoute && currentRoute.length > 0;
      const hasLocations = locations && locations.length > 0;
      if (hasRoute || hasLocations) return null;

      const cities: any[] = itineraryRedux?.cities ?? [];
      const startCity = itineraryRedux?.start_city;
      const endCity = itineraryRedux?.end_city;
      if (!cities.length && !startCity && !endCity) return null;

      const route: Location[] = [];

      // if (
      //   startCity &&
      //   startCity.latitude != null &&
      //   startCity.longitude != null
      // ) {
      //   route.push({
      //     id: `start__${startCity.gmaps_place_id ?? startCity.id ?? "start"}`,
      //     name: startCity.name ?? startCity.city_name ?? "Start",
      //     description: "",
      //     lat: Number(startCity.latitude),
      //     lng: Number(startCity.longitude),
      //     type: "start_city",
      //   } as Location);
      // }

      cities.forEach((c) => {
        const city = c?.city ?? c;
        if (city?.latitude == null || city?.longitude == null) return;
        const img = Array.isArray(city.image)
          ? city.image[0]?.image
          : city.image;
        route.push({
          id: c?.id ?? city.gmaps_place_id ?? city.id ?? city.name,
          name: city.name ?? "",
          description: "",
          lat: Number(city.latitude),
          lng: Number(city.longitude),
          duration: c?.duration,
          image: img,
        } as Location);
      });

      // if (endCity && endCity.latitude != null && endCity.longitude != null) {
      //   route.push({
      //     id: `end__${endCity.gmaps_place_id ?? endCity.id ?? "end"}`,
      //     name: endCity.name ?? endCity.city_name ?? "End",
      //     description: "",
      //     lat: Number(endCity.latitude),
      //     lng: Number(endCity.longitude),
      //     type: "end_city",
      //   } as Location);
      // }

      return route.length > 0 ? route : null;
    }, [itineraryRedux, currentRoute, locations]);

    const effectiveRoute = fallbackRoute ?? currentRoute;
    const effectiveLocations = fallbackRoute ?? locations;

    // ── Day-by-day cards on the city markers ────────────────────────────────
    // Every route stop carries a deck of that city's activities / POIs, drawn
    // from the canonical itinerary. A deck is only shown for a stop that is on
    // the map right now, so a POI-only `focus_on_map` (which clears the route)
    // doesn't drag stale cards along.
    //
    // Stops are matched to itinerary cities by NAME first, then by proximity.
    // Neither alone is enough: a draft itinerary (BotApp's
    // transformDraftToItinerary) carries no city coordinates at all, so
    // proximity has nothing to work with there; and a bot `focus_route` carries
    // its own coordinates for a city, agreeing with Mercury's only to within a
    // few hundred metres, so an exact coordinate match would miss. The
    // proximity tolerance is city-scale — far below the gap between two stops.
    //
    // Each deck records the index of the stop that owns it, so marker clicks can
    // bind to a deck exactly instead of re-deriving it from coordinates (which
    // is ambiguous when a route visits the same city twice).
    const cityCards = useMemo<DeckCard[]>(() => {
      if (!effectiveRoute || effectiveRoute.length === 0) return [];
      const decks = buildCityCards(itineraryRedux);
      if (decks.length === 0) return [];

      const CITY_MATCH_DEG = 0.05; // ~5.5km
      const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
      const claimed = new Set<string>();
      const matched: DeckCard[] = [];

      effectiveRoute.forEach((stop, stopIndex) => {
        let best: CityCard | undefined;

        // 1. Name match — the only signal a coordinate-less draft city has.
        for (const deck of decks) {
          if (claimed.has(deck.id)) continue;
          if (norm(deck.cityName) && norm(deck.cityName) === norm(stop.name)) {
            best = deck;
            break;
          }
        }

        // 2. Nearest unclaimed city within city-scale tolerance.
        if (!best) {
          let bestDist = Infinity;
          for (const deck of decks) {
            if (claimed.has(deck.id)) continue;
            if (deck.lat == null || deck.lng == null) continue;
            const dLat = Math.abs(deck.lat - stop.lat);
            const dLng = Math.abs(deck.lng - stop.lng);
            if (dLat > CITY_MATCH_DEG || dLng > CITY_MATCH_DEG) continue;
            if (dLat + dLng < bestDist) {
              bestDist = dLat + dLng;
              best = deck;
            }
          }
        }

        if (!best) return;
        claimed.add(best.id);
        // Anchor the deck to the marker's own coordinates, not the itinerary
        // city's, so the card sits on the pin rather than beside it.
        matched.push({ ...best, lat: stop.lat, lng: stop.lng, stopIndex });
      });
      return matched;
    }, [itineraryRedux, effectiveRoute]);

    // ── Element coordinates ─────────────────────────────────────────────────
    // The itinerary names its day-by-day elements but ships no coordinates for
    // them, so every element would otherwise be a card with no pin. Look the
    // missing ones up by name against their own city (see utils/geocodePlaces —
    // cached, throttled, and biased to the city so we don't pin a namesake on the
    // other side of the world), then fold the results back into the decks.
    const [geocoded, setGeocoded] = useState<Record<string, LatLng>>({});
    // Which lookups have been started, so a re-render doesn't re-run them. A miss
    // stays in here without ever landing in `geocoded` — that element simply has
    // no marker.
    const attemptedRef = useRef<Set<string>>(new Set());

    const elementKey = (cardId: string, el: CityCardElement) =>
      `${cardId}::${el.key}`;

    useEffect(() => {
      if (!mapReady) return undefined;
      let cancelled = false;

      const pending: { key: string; query: string; near: LatLng }[] = [];
      cityCards.forEach((card) => {
        card.elements.forEach((el) => {
          if (el.lat != null && el.lng != null) return;
          const key = elementKey(card.id, el);
          if (attemptedRef.current.has(key)) return;
          const query = [el.name, card.cityName].filter(Boolean).join(", ");
          if (!query) return;
          attemptedRef.current.add(key);
          pending.push({ key, query, near: { lat: card.lat, lng: card.lng } });
        });
      });
      if (pending.length === 0) return undefined;

      // Markers land one by one as the queue drains, rather than the map sitting
      // empty until the last element resolves.
      pending.forEach(({ key, query, near }) => {
        geocodePlace(query, near).then((coords) => {
          if (cancelled || !coords) return;
          setGeocoded((prev) =>
            prev[key] ? prev : { ...prev, [key]: coords },
          );
        });
      });

      return () => {
        cancelled = true;
      };
    }, [cityCards, mapReady]);

    // The decks as the map draws them: the itinerary's own coordinates where it
    // has any, the geocoded ones where it doesn't.
    const deckCards = useMemo<DeckCard[]>(() => {
      if (Object.keys(geocoded).length === 0) return cityCards;
      return cityCards.map((card) => ({
        ...card,
        elements: card.elements.map((el) => {
          if (el.lat != null && el.lng != null) return el;
          const found = geocoded[elementKey(card.id, el)];
          return found ? { ...el, lat: found.lat, lng: found.lng } : el;
        }),
      }));
    }, [cityCards, geocoded]);

    // What each city's deck is showing — CITY_VIEW (the default, so an unvisited
    // deck opens on its city) or the index of one of its elements — and which
    // decks the user has dismissed. Keyed by city id; pruned whenever the deck
    // set changes so a rebuilt itinerary doesn't inherit a stale index.
    const [cardIndex, setCardIndex] = useState<Record<string, number>>({});
    const [dismissedCards, setDismissedCards] = useState<Record<string, boolean>>({});
    // Decks overlap on tight routes — the last one touched is raised above the rest.
    const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
    // DOM nodes owned by the OverlayViews; the cards are portalled into them.
    const [overlayNodes, setOverlayNodes] = useState<
      { id: string; node: HTMLDivElement }[]
    >([]);

    useEffect(() => {
      const ids = new Set(cityCards.map((c) => c.id));
      const prune = <T,>(prev: Record<string, T>): Record<string, T> => {
        const keys = Object.keys(prev);
        if (keys.every((k) => ids.has(k))) return prev;
        const next: Record<string, T> = {};
        keys.forEach((k) => {
          if (ids.has(k)) next[k] = prev[k];
        });
        return next;
      };
      // A city that survives an itinerary edit can still lose elements, which
      // would leave its index pointing past the end of a shorter deck. Drop
      // those back to the city overview rather than to some other element the
      // user never paged to.
      const lengths = new Map(cityCards.map((c) => [c.id, c.elements.length]));
      setCardIndex((prev) => {
        const pruned = prune(prev);
        let changed = pruned !== prev;
        const next: Record<string, number> = { ...pruned };
        Object.keys(next).forEach((k) => {
          if (next[k] > (lengths.get(k) ?? 0) - 1) {
            next[k] = CITY_VIEW;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
      setDismissedCards(prune);
      setFocusedCardId((prev) => (prev && ids.has(prev) ? prev : null));
    }, [cityCards]);

    // Leaving the map and coming back is a fresh look at it, so the decks
    // return to their default state — only the first city's card open, the rest
    // collapsed onto their pins (see collapsedButFirst) — rather than preserving
    // whatever the user dismissed or paged to last time.
    const wasVisibleRef = useRef(isVisible);
    useEffect(() => {
      const reEntered = isVisible && !wasVisibleRef.current;
      wasVisibleRef.current = isVisible;
      if (!reEntered) return;
      setDismissedCards(collapsedButFirst(cityCards));
      setCardIndex((prev) => (Object.keys(prev).length ? {} : prev));
      setFocusedCardId(null);
    }, [isVisible, cityCards]);

    // A fresh mount with the map already on screen (e.g. desktop opening
    // straight to the map tab) never trips the re-enter transition above, so
    // collapse to the first city's card the first time the decks populate.
    const didInitialCollapseRef = useRef(false);
    useEffect(() => {
      if (didInitialCollapseRef.current || cityCards.length === 0) return;
      didInitialCollapseRef.current = true;
      setDismissedCards(collapsedButFirst(cityCards));
    }, [cityCards]);

    // Which side of its pin each deck sits on, chosen by the placement pass.
    const [deckPlacements, setDeckPlacements] = useState<
      Record<string, DeckPlacement>
    >({});
    // A no-op overlay kept on the map purely to borrow its projection, so the
    // placement pass can work in pixel space.
    const projectionRef = useRef<google.maps.OverlayView | null>(null);
    useEffect(() => {
      if (!mapReady || !mapInstance.current || projectionRef.current) return undefined;
      class ProjectionProbe extends google.maps.OverlayView {
        onAdd() {}
        draw() {}
        onRemove() {}
      }
      const probe = new ProjectionProbe();
      probe.setMap(mapInstance.current);
      projectionRef.current = probe;
      return () => {
        probe.setMap(null);
        projectionRef.current = null;
      };
    }, [mapReady]);

    // The live overlays, so paging a deck can move its card from the city's pin
    // onto the element's own pin without tearing the overlay down and back up.
    const overlaysRef = useRef<
      Record<string, { setPosition: (p: google.maps.LatLngLiteral) => void }>
    >({});

    // One OverlayView per deck, anchored to whichever pin its card belongs on.
    // OverlayView (rather than InfoWindow) because every deck stays open at once,
    // the cards are interactive React, and InfoWindow's chrome + auto-pan fight
    // both.
    useEffect(() => {
      if (!mapReady || !mapInstance.current || cityCards.length === 0) {
        setOverlayNodes((prev) => (prev.length === 0 ? prev : []));
        return undefined;
      }

      class CardOverlay extends google.maps.OverlayView {
        constructor(
          private position: google.maps.LatLngLiteral,
          private readonly container: HTMLDivElement,
        ) {
          super();
        }
        setPosition(next: google.maps.LatLngLiteral) {
          if (
            next.lat === this.position.lat &&
            next.lng === this.position.lng
          )
            return;
          this.position = next;
          this.draw();
        }
        onAdd() {
          this.getPanes()?.floatPane.appendChild(this.container);
        }
        draw() {
          const point = this.getProjection()?.fromLatLngToDivPixel(
            new google.maps.LatLng(this.position.lat, this.position.lng),
          );
          if (!point) return;
          this.container.style.left = `${point.x}px`;
          this.container.style.top = `${point.y}px`;
        }
        onRemove() {
          this.container.remove();
        }
      }

      const created = cityCards.map((card, index) => {
        const node = document.createElement("div");
        node.style.position = "absolute";
        // Above the pin until the placement pass says otherwise.
        node.style.transform = `translate(${DEFAULT_PLACEMENT.dx}px, ${DEFAULT_PLACEMENT.dy}px)`;
        // The transform makes this node a stacking context, so a z-index on a
        // portalled child can only order things *within* the card. Ordering one
        // deck against an overlapping neighbour has to happen out here, on the
        // containers themselves — see deckZIndex.
        node.style.zIndex = String(deckZIndex(index, cityCards.length, false));
        // Keep drags, clicks and scrolls inside the card from reaching the map.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(node);
        const overlay = new CardOverlay({ lat: card.lat, lng: card.lng }, node);
        overlay.setMap(mapInstance.current!);
        return { id: card.id, node, overlay };
      });

      overlaysRef.current = Object.fromEntries(
        created.map(({ id, overlay }) => [id, overlay]),
      );
      setOverlayNodes(created.map(({ id, node }) => ({ id, node })));

      return () => {
        created.forEach(({ overlay }) => overlay.setMap(null));
        overlaysRef.current = {};
        setOverlayNodes([]);
      };
    }, [cityCards, mapReady]);

    // Follow the deck onto the pin of whatever it is showing — including the
    // moment an element's geocode lands and its card can move off the city pin
    // onto its own.
    useEffect(() => {
      deckCards.forEach((card) => {
        overlaysRef.current[card.id]?.setPosition(
          deckAnchor(card, cardIndex[card.id] ?? CITY_VIEW),
        );
      });
    }, [deckCards, cardIndex, overlayNodes]);

    // ── Placement pass ──────────────────────────────────────────────────────
    // Measure the pins and the rendered cards in pixel space, then let
    // chooseDeckPlacements pick a spot for each deck (see utils/deckPlacement).
    const relayoutDecks = useCallback(() => {
      const projection = projectionRef.current?.getProjection();
      const container = mapRef.current;
      if (!projection || !container || overlayNodes.length === 0) return;

      const vw = container.clientWidth;
      const vh = container.clientHeight;
      if (!vw || !vh) return; // hidden pane — nothing meaningful to measure

      const toPixel = (lat: number, lng: number) =>
        projection.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng));

      // Every marker on the map right now — these are what the cards work around.
      // City pins hang from their tip and are close to untouchable; element
      // markers are discs centred on their point (see components/ElementMarker)
      // and are a softer constraint, since a city that packs a dozen of them into
      // a few hundred metres leaves nowhere that clears them all.
      const obstacles: Obstacle[] = [];
      (effectiveLocations ?? []).forEach((loc) => {
        const p = toPixel(loc.lat, loc.lng);
        if (p) obstacles.push({ rect: pinRect(p.x, p.y), cost: COST_COVER_PIN });
      });
      deckCards.forEach((card) => {
        const shown = cardIndex[card.id] ?? CITY_VIEW;
        card.elements.forEach((el, i) => {
          if (!hasCoords(el)) return;
          const p = toPixel(el.lat, el.lng);
          if (!p) return;
          const active = i === shown;
          const size = active
            ? ACTIVE_ELEMENT_MARKER_SIZE
            : ELEMENT_MARKER_SIZE;
          obstacles.push({
            rect: markerRect(p.x, p.y, dotAnchor(size)),
            // The element being read about is the one marker on the map the user
            // is certainly looking for, so its own card must not sit on it.
            cost: active ? COST_COVER_PIN : COST_COVER_ELEMENT,
          });
        });
      });

      const nodeById = new Map(overlayNodes.map((o) => [o.id, o.node]));
      const boxes: DeckBox[] = [];
      deckCards.forEach((card) => {
        if (dismissedCards[card.id]) return; // a closed deck reserves no space
        const node = nodeById.get(card.id);
        const shown = cardIndex[card.id] ?? CITY_VIEW;
        const anchor = deckAnchor(card, shown);
        const p = toPixel(anchor.lat, anchor.lng);
        if (!node || !p) return;
        boxes.push({
          id: card.id,
          x: p.x,
          y: p.y,
          w: node.offsetWidth || 244,
          h: node.offsetHeight || 250,
          anchor: deckAnchorGeom(card, shown),
        });
      });

      // The fixed cart / route bars overlay the bottom of the pane, and the
      // back-to-itinerary pill floats just above them. chromeBottom is measured
      // up from the viewport bottom, so fold in however far this container sits
      // above that bottom to get how deep the bars actually reach into the pane,
      // then reserve the pill's band on top. Cards are steered out of the result
      // so they stay fully visible instead of tucking under the bars.
      const rect = container.getBoundingClientRect();
      const viewportH =
        typeof window !== "undefined" ? window.innerHeight : rect.bottom;
      const barsIntoPane = Math.max(
        0,
        chromeBottom - Math.max(0, viewportH - rect.bottom),
      );
      const insets = {
        top: TOP_CHROME,
        right: 0,
        bottom: barsIntoPane > 0 ? barsIntoPane + BACK_PILL_CLEARANCE : 0,
        left: 0,
      };

      const next = chooseDeckPlacements(boxes, obstacles, vw, vh, insets);

      // Written straight to the DOM as well as to state: the transform has to
      // land in the same frame as the measurement it came from, while the state
      // is what turns the tail to face the pin.
      boxes.forEach(({ id }) => {
        const node = nodeById.get(id);
        const p = next[id];
        if (node && p) {
          node.style.transform = `translate(${p.dx}px, ${p.dy}px)`;
        }
      });

      setDeckPlacements((prev) => {
        const keys = Object.keys(next);
        const same =
          keys.length === Object.keys(prev).length &&
          keys.every(
            (k) =>
              prev[k] &&
              prev[k].side === next[k].side &&
              prev[k].tail === next[k].tail,
          );
        return same ? prev : next;
      });
    }, [
      overlayNodes,
      deckCards,
      cardIndex,
      dismissedCards,
      effectiveLocations,
      chromeBottom,
    ]);

    // Re-place after the cards have rendered (relayoutDecks is keyed on
    // `cardIndex`, and both the card on show and the pin it hangs off change with
    // it), and whenever the map settles — a zoom changes how far apart the pins
    // are on screen, which changes what collides with what.
    //
    // Deliberately NOT keyed on `deckPlacements`: the pass writes the transform
    // to the DOM itself, so it does not need a re-render to take effect, and
    // feeding its own output back in would let two placements trade forever.
    useEffect(() => {
      if (!mapReady || !mapInstance.current) return undefined;
      const raf = requestAnimationFrame(relayoutDecks);
      const listener = mapInstance.current.addListener("idle", relayoutDecks);

      // A card's height is not settled when it first mounts — its title and
      // one-liner reflow to a second line, and paging swaps in an element with
      // more or less text. Measured short, it gets parked with its lower half
      // hanging under the cart bar. Re-place whenever any card changes size so
      // the slide-into-view always works off the height actually on screen.
      let pending = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(relayoutDecks);
      });
      overlayNodes.forEach(({ node }) => ro.observe(node));

      return () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(pending);
        listener.remove();
        ro.disconnect();
      };
    }, [relayoutDecks, mapReady, overlayNodes]);

    // Decks overlap wherever two cities sit close together on screen. Clicking a
    // pin (or the card itself) lifts that deck above its neighbours — the only
    // way to reach a card that is fully covered.
    useEffect(() => {
      const order = new Map(cityCards.map((c, i) => [c.id, i]));
      overlayNodes.forEach(({ id, node }) => {
        const index = order.get(id);
        if (index === undefined) return;
        node.style.zIndex = String(
          deckZIndex(index, cityCards.length, focusedCardId === id),
        );
      });
    }, [overlayNodes, focusedCardId, cityCards]);

    // Decks need room around the pins, or the placement pass has to choose
    // between covering a marker and running off the edge of the pane. A card is
    // ~258px tall and 244px wide and can now sit on any side of its pin, so the
    // bounds get headroom on every side — capped as a fraction of the pane so a
    // small map isn't zoomed out to nothing to make room.
    const fitPadding = useCallback((): google.maps.Padding => {
      const base = { top: 80, right: 60, bottom: 80, left: 60 };
      if (cityCards.length === 0) return base;
      const el = mapRef.current;
      const height = el?.clientHeight ?? 0;
      const width = el?.clientWidth ?? 0;
      const side =
        width > 0 ? Math.min(160, Math.max(60, Math.round(width / 6))) : 60;
      return {
        top: height > 0 ? Math.min(300, Math.max(80, Math.round(height / 3))) : 300,
        bottom:
          height > 0 ? Math.min(180, Math.max(80, Math.round(height / 5))) : 80,
        left: side,
        right: side,
      };
    }, [cityCards.length]);

    // Open one of a deck's elements. The map is deliberately left exactly where
    // it was when the pane opened — no pan, no zoom — so paging through a city's
    // day-by-day never moves it; only the user's own gestures do. The card
    // re-anchors to the element's marker (see the overlay effect) and the
    // placement pass keeps it inside the visible pane.
    const openElement = useCallback((card: DeckCard, target: number) => {
      const index = Math.min(
        Math.max(0, target),
        Math.max(0, card.elements.length - 1),
      );
      setCardIndex((prev) =>
        prev[card.id] === index ? prev : { ...prev, [card.id]: index },
      );
      setDismissedCards((prev) =>
        prev[card.id] ? { ...prev, [card.id]: false } : prev,
      );
      setFocusedCardId(card.id);
    }, []);

    // Back out of a city's elements to the city card (also the handler for a
    // city pin/marker click). Like openElement, it leaves the map untouched: a
    // city pin is always inside the fitted route, so its card is already on
    // screen and the placement pass keeps it clear of the chrome.
    const showCityCard = useCallback((card: DeckCard) => {
      setCardIndex((prev) =>
        (prev[card.id] ?? CITY_VIEW) === CITY_VIEW
          ? prev
          : { ...prev, [card.id]: CITY_VIEW },
      );
      setDismissedCards((prev) =>
        prev[card.id] ? { ...prev, [card.id]: false } : prev,
      );
      setFocusedCardId(card.id);
    }, []);

    // The element whose detail drawer is open. Kept here rather than lifted to
    // BotApp because the drawer portals itself to #modal-portal — it renders the
    // same from anywhere in the tree, and the map is what knows which element
    // was asked about.
    const [detail, setDetail] = useState<{
      id: string;
      type: CityElementType;
      name: string;
      image: string | null;
      itineraryCityId: string | null;
      cityId: string | null;
      cityName: string;
    } | null>(null);

    const showElementDetail = useCallback((card: DeckCard, index: number) => {
      const el = card.elements[index];
      if (!el?.entityId) return;
      setDetail({
        id: el.entityId,
        type: el.type,
        name: el.name,
        image: el.image,
        itineraryCityId: card.itineraryCityId,
        cityId: card.cityId,
        cityName: card.cityName,
      });
    }, []);

    // Hand the walk over to the next city: its card opens, and the city we came
    // from collapses back onto its pin so the map keeps showing one card rather
    // than a trail of them. Nothing is lost — its pin reopens it.
    const walkOnToCity = useCallback(
      (fromId: string, next: DeckCard) => {
        setDismissedCards((prev) => ({ ...prev, [fromId]: true }));
        showCityCard(next);
      },
      [showCityCard],
    );

    // Expose the map instance to parent via ref
    useImperativeHandle(ref, () => mapInstance.current!, [mapReady]);

    // Initialize map
    useEffect(() => {
      if (!mapRef.current || mapInstance.current) return;

      const initMap = () => {
        if (!mapRef.current || mapInstance.current) return;
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: state.lat, lng: state.lng },
          zoom: state.zoom || 12,
          minZoom: 2,
          maxZoom: 18,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: mapStyles,
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              west: -180,
              east: 180,
            },
            strictBounds: true,
          },
        });
        infoWindowRef.current = new google.maps.InfoWindow();

        // After tiles load (map fully rendered), re-fit bounds if data arrived
        // before the map was ready — common on page refresh.
        google.maps.event.addListenerOnce(mapInstance.current, "idle", () => {
          setMapReady(true);
        });
      };

      // Maps SDK is no longer in <head>; load it on demand, then init.
      let cancelled = false;
      loadGoogleMaps()
        .then(() => {
          if (!cancelled) initMap();
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, []);

    // Clamp zoom after fitBounds — avoids being too zoomed out on wide desktop containers.
    // Min zoom 5 (continent-level), max zoom 14 (street-level).
    const clampZoomAfterFit = useCallback((map: google.maps.Map) => {
      google.maps.event.addListenerOnce(map, "idle", () => {
        const z = map.getZoom();
        if (z !== undefined && z < 5) map.setZoom(5);
        else if (z !== undefined && z > 14) map.setZoom(14);
      });
    }, []);

    // Reusable fitBounds helper — triggers resize first so Google Maps
    // computes bounds against the actual container dimensions.
    const fitToCurrentElements = useCallback(() => {
      if (!mapInstance.current) return;
      const hasRoute = effectiveRoute && effectiveRoute.length > 0;
      const hasLocations = effectiveLocations && effectiveLocations.length > 0;
      if (!hasRoute && !hasLocations) return;

      // Ensure Maps knows the true container size before fitting
      google.maps.event.trigger(mapInstance.current, "resize");

      if (hasRoute) {
        if (effectiveRoute!.length === 1) {
          mapInstance.current.setCenter({
            lat: effectiveRoute![0].lat,
            lng: effectiveRoute![0].lng,
          });
          mapInstance.current.setZoom(11);
        } else {
          const bounds = new google.maps.LatLngBounds();
          effectiveRoute!.forEach((loc) =>
            bounds.extend({ lat: loc.lat, lng: loc.lng }),
          );
          mapInstance.current.fitBounds(bounds, fitPadding());
          clampZoomAfterFit(mapInstance.current);
        }
      } else if (hasLocations) {
        const bounds = new google.maps.LatLngBounds();
        effectiveLocations!.forEach((loc) =>
          bounds.extend({ lat: loc.lat, lng: loc.lng }),
        );
        mapInstance.current.fitBounds(bounds, fitPadding());
        clampZoomAfterFit(mapInstance.current);
      }
    }, [effectiveRoute, effectiveLocations, clampZoomAfterFit, fitPadding]);

    // Once the map tiles have loaded, re-fit to any existing route/location
    // data. Handles the page-reload race where data arrives before the map
    // container has its final pixel dimensions.
    useEffect(() => {
      if (!mapReady) return;
      setTimeout(() => {
        if (mapInstance.current) {
          google.maps.event.trigger(mapInstance.current, "resize");
          fitToCurrentElements();
        }
      }, 150);
    }, [mapReady, fitToCurrentElements]);

    // Watch the container size. When the map is hidden (display:none, e.g. on
    // p2 reload where viewMode = "itinerary"), fitBounds is computed against a
    // 0x0 container, which leaves the map zoomed out. As soon as the container
    // gains real dimensions (user switches to map tab), refit so the pins land
    // inside the visible viewport at a reasonable zoom.
    useEffect(() => {
      if (!mapRef.current) return;
      const el = mapRef.current;
      let lastW = el.clientWidth;
      let lastH = el.clientHeight;
      const observer = new ResizeObserver(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        // Container size only — distinct from the `isVisible` prop, which also
        // covers mobile's opacity toggle (where the container keeps its size).
        const wasHidden = lastW === 0 || lastH === 0;
        const hasSize = w > 0 && h > 0;
        lastW = w;
        lastH = h;
        if (wasHidden && hasSize && mapInstance.current) {
          // Small timer so the browser has settled before we measure inside fitBounds
          setTimeout(() => {
            if (!mapInstance.current) return;
            google.maps.event.trigger(mapInstance.current, "resize");
            fitToCurrentElements();
          }, 80);
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [fitToCurrentElements]);

    // Pan / zoom when state changes — but only when there are no active
    // routes or locations (fitBounds handles those). This prevents a late
    // mapState update (e.g. user location resolving) from overriding fitBounds.
    useEffect(() => {
      if (!mapInstance.current) return;
      const hasRoute = effectiveRoute && effectiveRoute.length > 0;
      const hasLocations = effectiveLocations && effectiveLocations.length > 0;
      if (hasRoute || hasLocations) return;

      mapInstance.current.setCenter({ lat: state.lat, lng: state.lng });
      if (state.zoom) {
        mapInstance.current.setZoom(state.zoom);
      }
    }, [state.lat, state.lng, state.zoom, effectiveRoute, effectiveLocations]);

    // Re-fit bounds when the browser tab becomes visible again (handles tab switching)
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          setTimeout(() => {
            if (mapInstance.current) {
              google.maps.event.trigger(mapInstance.current, "resize");
              fitToCurrentElements();
            }
          }, 150);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
    }, [fitToCurrentElements]);

    // Draw dashed route lines with arrowheads between consecutive stops
    useEffect(() => {
      // Clear old polylines — runs on every currentRoute change, including
      // when it transitions to null (e.g. clear_map effect). This guarantees
      // the route polylines are removed from the map.
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];

      if (
        !mapReady ||
        !mapInstance.current ||
        !effectiveRoute ||
        effectiveRoute.length === 0
      )
        return;

      // ↓ Single city — just fit bounds to it, no polyline needed
      if (effectiveRoute.length === 1) {
        const { lat, lng } = effectiveRoute[0];
        mapInstance.current.setCenter({ lat, lng });
        mapInstance.current.setZoom(11);
        return;
      }

      // Quadratic bezier arc between two lat/lng points
      const getCurvedPath = (
        from: { lat: number; lng: number },
        to: { lat: number; lng: number },
        numPoints = 60,
        direction = 1,
      ): google.maps.LatLngLiteral[] => {
        const midLat = (from.lat + to.lat) / 2;
        const midLng = (from.lng + to.lng) / 2;
        const dLat = to.lat - from.lat;
        const dLng = to.lng - from.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        const curvature = 0.25 * direction;
        const perpLat = -dLng;
        const perpLng = dLat;
        const perpLen = Math.sqrt(perpLat * perpLat + perpLng * perpLng) || 1;
        const controlLat = midLat + (perpLat / perpLen) * dist * curvature;
        const controlLng = midLng + (perpLng / perpLen) * dist * curvature;
        // Build path, stopping slightly before destination center
        // so arrowhead at 100% lands right at the pin tip visually
        const path: google.maps.LatLngLiteral[] = [];
        const tMax = 0.93; // stop at 93% so arrow tip touches pin edge, not overshoots
        for (let j = 0; j <= numPoints; j++) {
          const t = (j / numPoints) * tMax;
          const u = 1 - t;
          path.push({
            lat: u * u * from.lat + 2 * u * t * controlLat + t * t * to.lat,
            lng: u * u * from.lng + 2 * u * t * controlLng + t * t * to.lng,
          });
        }
        return path;
      };

      for (let i = 0; i < effectiveRoute.length - 1; i++) {
        const from = effectiveRoute[i];
        const to = effectiveRoute[i + 1];
        // Alternate curve direction: odd segments curve one way, even the other
        const direction = i % 2 === 0 ? 1 : -1;
        const curvedPath = getCurvedPath(
          { lat: from.lat, lng: from.lng },
          { lat: to.lat, lng: to.lng },
          60,
          direction,
        );
        const polyline = new google.maps.Polyline({
          path: curvedPath,
          geodesic: false,
          strokeOpacity: 0,
          icons: [
            {
              icon: {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                strokeColor: "#4DB8FF",
                strokeWeight: 3,
                scale: 3,
              },
              offset: "0",
              repeat: "14px",
            },
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeOpacity: 1,
                strokeColor: "#4DB8FF",
                fillColor: "#4DB8FF",
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 4,
              },
              offset: "100%",
            },
          ],
        });
        polyline.setMap(mapInstance.current);
        polylinesRef.current.push(polyline);
      }

      // Fit map to route — trigger resize first so bounds use correct container size
      google.maps.event.trigger(mapInstance.current, "resize");
      const bounds = new google.maps.LatLngBounds();
      effectiveRoute.forEach((loc) =>
        bounds.extend({ lat: loc.lat, lng: loc.lng }),
      );
      mapInstance.current.fitBounds(bounds, fitPadding());
      clampZoomAfterFit(mapInstance.current);
    }, [effectiveRoute, clampZoomAfterFit, mapReady, fitPadding]);

    // Place / update location markers
    useEffect(() => {
      if (!mapReady || !mapInstance.current || !infoWindowRef.current) return;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      effectiveLocations?.forEach((location) => {
        const loc = location as any;

        // Determine if this location is a numbered route stop
        const routeIndex =
          effectiveRoute?.findIndex((r) => r.id === location.id) ?? -1;
        const isRouteStop = routeIndex !== -1;

        let markerIcon: google.maps.Icon;
        const endpointKind: "start" | "end" | null =
          loc.type === "start_city"
            ? "start"
            : loc.type === "end_city"
              ? "end"
              : null;

        // A city carrying a day-by-day deck draws its own pin as an HTML overlay
        // (see htmlPinnedCities), so that it and the photo markers gathered on it
        // land in one pane and can be ordered against each other. Leaving a
        // marker icon here too would just stack a second pin under it.
        const hasHtmlPin =
          !endpointKind &&
          isRouteStop &&
          cityCards.some((c) => c.stopIndex === routeIndex);
        if (hasHtmlPin) return;

        if (endpointKind) {
          // Trip origin / departure pin — distinct from numbered route stops.
          markerIcon = getEndpointPin(endpointKind);
        } else if (isRouteStop) {
          // Numbered route pin — colored by the cities widget's stop color.
          markerIcon = getNumberedPin(routeIndex + 1, resolvePinColor(loc));
        } else if (loc.type) {
          // Category icon
          markerIcon = getMarkerIcon(loc.type);
        } else {
          // Generic location pin (no number) - same shape as numbered pin,
          // colored by the cities widget's stop color when present.
          const pinColor = resolvePinColor(loc);
          const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
            <defs>
              <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.30)"/>
              </filter>
            </defs>
            <path d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z" fill="${pinColor}" filter="url(#sh)"/>
            <circle cx="24" cy="23.9643" r="8.5675" fill="white"/>
          </svg>`;
          markerIcon = {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
            scaledSize: new google.maps.Size(36, 46),
            anchor: new google.maps.Point(18, 46),
          };
        }

        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstance.current!,
          title: location.name,
          icon: markerIcon,
          zIndex: endpointKind ? 400 : isRouteStop ? 200 + routeIndex : 100,
        });

        // A route stop that carries a day-by-day deck answers its own marker
        // click: the deck is already on screen, so re-open it if the user
        // dismissed it and raise it above any overlapping neighbour, rather
        // than stacking an InfoWindow on top of it. Matched on the stop's index
        // — matching on coordinates would be ambiguous for a route that visits
        // the same city twice, where both stops sit on the same point.
        const deck = isRouteStop
          ? cityCards.find((c) => c.stopIndex === routeIndex)
          : undefined;
        if (deck) {
          marker.addListener("click", () => {
            infoWindowRef.current?.close();
            showCityCard(deck);
          });
          markersRef.current.push(marker);
          return;
        }

        // Info window on click — unified compact card design (Figma)
        marker.addListener("click", () => {
          const accentColor = resolveAccent(loc.accent);
          // Pass raw image — buildPopupHTML calls resolvePopupImageUrl which
          // returns absolute URLs as-is and prefixes CloudFront for relative paths.
          const imageUrl = loc.image as string | undefined;
          const description = loc.one_liner_description || location.description;
          const ratingCount =
            typeof loc.user_ratings_total === "number"
              ? loc.user_ratings_total
              : undefined;

          if (endpointKind) {
            infoWindowRef.current!.setContent(
              buildPopupHTML({
                title: location.name,
                locationText: endpointKind === "start" ? "Trip starts here" : "Trip ends here",
                accentColor: endpointKind === "start" ? "#22C55E" : "#111827",
                badge: endpointKind === "start" ? "Start" : "End",
              }),
            );
          } else if (isRouteStop && effectiveRoute) {
            const badge = `Stop ${routeIndex + 1} of ${effectiveRoute.length}`;
            const locationText = loc.duration
              ? `${loc.duration} ${loc.duration === 1 ? "night" : "nights"}`
              : loc.city;
            infoWindowRef.current!.setContent(
              buildPopupHTML({
                image: imageUrl,
                title: location.name,
                locationText,
                description,
                accentColor,
                badge,
              }),
            );
          } else {
            infoWindowRef.current!.setContent(
              buildPopupHTML({
                image: imageUrl,
                title: location.name,
                rating: typeof loc.rating === "number" ? loc.rating : undefined,
                ratingCount,
                locationText: loc.city,
                description,
                accentColor,
              }),
            );
          }

          infoWindowRef.current!.open(mapInstance.current!, marker);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds (only when no route — route fitting is handled separately)
      if (effectiveRoute && effectiveRoute.length > 0) return;

      if (effectiveLocations && effectiveLocations.length > 0) {
        google.maps.event.trigger(mapInstance.current, "resize");
        const bounds = new window.google.maps.LatLngBounds();
        effectiveLocations.forEach((loc) =>
          bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng)),
        );
        mapInstance.current.fitBounds(bounds, fitPadding());
        clampZoomAfterFit(mapInstance.current);
      } else if (userLocation) {
        mapInstance.current.setCenter({
          lat: userLocation.lat,
          lng: userLocation.lng,
        });
        // Use the caller-provided zoom (set by clear_map etc.) when available,
        // falling back to a sensible country-level zoom instead of world-level.
        mapInstance.current.setZoom(state.zoom ?? 6);
      }
    }, [effectiveLocations, userLocation, effectiveRoute, mapInstance, clampZoomAfterFit, state.zoom, mapReady, cityCards, showCityCard]);

    // A marker for every day-by-day element the itinerary places inside a city,
    // showing the place's own photo. Clicking one opens that element's card.
    //
    // These are HTML overlays rather than `google.maps.Marker`s: a marker icon is
    // a single image, and an SVG one may not reference an external photo, so a
    // photo marker has to be drawn as DOM (see components/ElementMarker).
    //
    // Kept as a keyed diff rather than a wipe-and-rebuild: the geocodes trickle
    // in one element at a time, and tearing every marker off the map on each one
    // would leave the whole set flickering while a city resolves.
    const elementOverlaysRef = useRef<
      Record<string, { overlay: HtmlMarkerOverlay; node: HTMLDivElement }>
    >({});
    const [elementMarkerNodes, setElementMarkerNodes] = useState<
      { key: string; node: HTMLDivElement }[]
    >([]);

    useEffect(() => {
      if (!mapReady || !mapInstance.current) return;

      const live = elementOverlaysRef.current;
      const wanted = new Set<string>();
      let changed = false;

      deckCards.forEach((card) => {
        card.elements.forEach((el) => {
          if (!hasCoords(el)) return;
          const key = elementKey(card.id, el);
          wanted.add(key);

          const existing = live[key];
          if (existing) {
            existing.overlay.setPosition({ lat: el.lat, lng: el.lng });
            return;
          }

          // Centred on its point, so growing the active disc never walks the
          // marker off its own coordinates.
          const node = markerNode("translate(-50%, -50%)");
          const overlay = createHtmlMarker({ lat: el.lat, lng: el.lng }, node);
          overlay.setMap(mapInstance.current!);
          live[key] = { overlay, node };
          changed = true;
        });
      });

      Object.keys(live).forEach((key) => {
        if (wanted.has(key)) return;
        live[key].overlay.setMap(null);
        delete live[key];
        changed = true;
      });

      // Only when the set itself moved — a re-render on every geocode's
      // reposition would portal all the markers again for nothing.
      if (changed)
        setElementMarkerNodes(
          Object.entries(live).map(([key, { node }]) => ({ key, node })),
        );
    }, [deckCards, mapReady]);

    // The diff above only prunes overlays it can still see; unmounting takes the
    // rest off the map.
    useEffect(
      () => () => {
        Object.values(elementOverlaysRef.current).forEach(({ overlay }) =>
          overlay.setMap(null),
        );
        elementOverlaysRef.current = {};
      },
      [],
    );

    // The numbered pin for every city that carries a deck, drawn as HTML for the
    // same reason its elements are — see utils/htmlMarkerOverlay. Cities without
    // a deck, and the trip's start / end pins, stay marker icons (see the
    // location effect above), since nothing clusters on top of them.
    const htmlPinnedCities = useMemo(() => {
      const endpoints = new Set<number>();
      (effectiveLocations ?? []).forEach((location) => {
        const loc = location as any;
        if (loc.type !== "start_city" && loc.type !== "end_city") return;
        const stop = effectiveRoute?.findIndex((r) => r.id === location.id) ?? -1;
        if (stop !== -1) endpoints.add(stop);
      });
      return deckCards.filter((card) => !endpoints.has(card.stopIndex));
    }, [deckCards, effectiveLocations, effectiveRoute]);

    const cityPinOverlaysRef = useRef<
      Record<string, { overlay: HtmlMarkerOverlay; node: HTMLDivElement }>
    >({});
    const [cityPinNodes, setCityPinNodes] = useState<
      { id: string; node: HTMLDivElement }[]
    >([]);

    useEffect(() => {
      if (!mapReady || !mapInstance.current) return;

      const live = cityPinOverlaysRef.current;
      const wanted = new Set<string>();
      let changed = false;

      htmlPinnedCities.forEach((card) => {
        wanted.add(card.id);
        const existing = live[card.id];
        if (existing) {
          existing.overlay.setPosition({ lat: card.lat, lng: card.lng });
          return;
        }
        // The teardrop hangs from its tip, which is the city's point.
        const node = markerNode("translate(-50%, -100%)");
        const overlay = createHtmlMarker({ lat: card.lat, lng: card.lng }, node);
        overlay.setMap(mapInstance.current!);
        live[card.id] = { overlay, node };
        changed = true;
      });

      Object.keys(live).forEach((id) => {
        if (wanted.has(id)) return;
        live[id].overlay.setMap(null);
        delete live[id];
        changed = true;
      });

      if (changed)
        setCityPinNodes(
          Object.entries(live).map(([id, { node }]) => ({ id, node })),
        );
    }, [htmlPinnedCities, mapReady]);

    useEffect(
      () => () => {
        Object.values(cityPinOverlaysRef.current).forEach(({ overlay }) =>
          overlay.setMap(null),
        );
        cityPinOverlaysRef.current = {};
      },
      [],
    );

    // A city pin sits above the photo markers that gather round it, and an open
    // element's marker above the pin — the order the map had when both were
    // marker icons, now that both are DOM in one pane.
    useEffect(() => {
      const order = new Map(deckCards.map((c, i) => [c.id, i]));
      cityPinNodes.forEach(({ id, node }) => {
        node.style.zIndex = String(200 + (order.get(id) ?? 0));
      });
    }, [cityPinNodes, deckCards]);

    /** The element whose card is open — the one marker the user is certainly
     * looking for, so it wears the bigger disc and rides above its neighbours. */
    const isElementActive = useCallback(
      (cardId: string, index: number) =>
        index === (cardIndex[cardId] ?? CITY_VIEW) && !dismissedCards[cardId],
      [cardIndex, dismissedCards],
    );

    // The element behind each live marker node, so the portal pass below can
    // render one without re-walking the decks per marker.
    const markerTargets = useMemo(() => {
      const byKey: Record<
        string,
        { card: DeckCard; el: CityCardElement; index: number }
      > = {};
      deckCards.forEach((card) =>
        card.elements.forEach((el, index) => {
          byKey[elementKey(card.id, el)] = { card, el, index };
        }),
      );
      return byKey;
    }, [deckCards]);

    // Marker discs overlap wherever two places sit close together. Ordered out
    // here on the containers, like the decks above and for the same reason: each
    // container is its own stacking context, so a z-index inside a marker could
    // only order that marker's own parts.
    useEffect(() => {
      elementMarkerNodes.forEach(({ key, node }) => {
        const target = markerTargets[key];
        if (!target) return;
        node.style.zIndex = String(
          isElementActive(target.card.id, target.index) ? 300 : 100,
        );
      });
    }, [elementMarkerNodes, markerTargets, isElementActive]);

    return (
      <>
        {/* Paging a deck swaps one card for the next on a marker a few pixels
            from the last one, which on its own reads as nothing happening. The
            card lifts in, so the change is felt. */}
        <style dangerouslySetInnerHTML={{ __html: `@keyframes ttwDeckCardIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: none; }
        }` }} />
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {cityPinNodes.map(({ id, node }) => {
          const card = deckCards.find((c) => c.id === id);
          if (!card) return null;
          return createPortal(
            <CityPinMarker
              number={card.stopIndex + 1}
              cityName={card.cityName}
              color={resolvePinColor(effectiveRoute?.[card.stopIndex])}
              onClick={() => {
                infoWindowRef.current?.close();
                showCityCard(card);
              }}
            />,
            node,
            id,
          );
        })}
        {/* One photo marker per element with coordinates. Rendered here, rather
            than written into the overlay's node imperatively, so a marker is
            plain React — its own image-failure state, its own hover. */}
        {elementMarkerNodes.map(({ key, node }) => {
          const target = markerTargets[key];
          if (!target) return null;
          const { card, el, index } = target;
          return createPortal(
            <ElementMarker
              name={el.name}
              image={el.image}
              type={el.type}
              active={isElementActive(card.id, index)}
              onClick={() => {
                infoWindowRef.current?.close();
                openElement(card, index);
              }}
            />,
            node,
            key,
          );
        })}
        {overlayNodes.map(({ id, node }) => {
          const card = deckCards.find((c) => c.id === id);
          if (!card || dismissedCards[id]) return null;
          const index = Math.min(
            cardIndex[id] ?? CITY_VIEW,
            card.elements.length - 1,
          );
          const placement = deckPlacements[id] ?? DEFAULT_PLACEMENT;
          // The route carries on past this city's last element, so the pager
          // does too — decks are built in route order, so the next one along is
          // the next city the trip visits.
          const nextDeck = deckCards[deckCards.findIndex((c) => c.id === id) + 1];
          return createPortal(
            // The tail is absolutely positioned against the card, so a card slid
            // along its pin's edge still points back at its own marker. Keyed on
            // what it is showing, so stepping to the next element remounts it and
            // replays the animation.
            <div
              key={`${id}:${index}`}
              style={{
                position: "relative",
                animation: "ttwDeckCardIn 170ms ease-out",
              }}
            >
              {index === CITY_VIEW ? (
                <CityOverviewCard
                  card={card}
                  onExplore={() => openElement(card, 0)}
                  onClose={() =>
                    setDismissedCards((prev) => ({ ...prev, [id]: true }))
                  }
                  onFocus={() => setFocusedCardId(id)}
                />
              ) : (
                <CityElementCard
                  card={card}
                  index={index}
                  onPrev={() => openElement(card, index - 1)}
                  onNext={() => openElement(card, index + 1)}
                  onBack={() => showCityCard(card)}
                  onFocus={() => setFocusedCardId(id)}
                  onSeeDetails={
                    card.elements[index]?.entityId
                      ? () => showElementDetail(card, index)
                      : undefined
                  }
                  nextCityName={nextDeck?.cityName ?? null}
                  onNextCity={
                    nextDeck ? () => walkOnToCity(id, nextDeck) : undefined
                  }
                />
              )}
              <DeckTail placement={placement} />
            </div>,
            node,
            id,
          );
        })}
        {/* Portalled out to #modal-portal by Drawer, so it is unaffected by the
            map's own stacking. */}
        {detail && (
          <POIDetailsDrawer
            itineraryDrawer
            show
            handleCloseDrawer={() => setDetail(null)}
            activityData={{ id: detail.id, type: detail.type }}
            iconId={detail.id}
            name={detail.name}
            image={detail.image}
            showBookingDetail
            itinerary_city_id={detail.itineraryCityId}
            cityID={detail.cityId}
            cityName={detail.cityName}
            // "See details" is a look, not an edit — the itinerary is changed
            // from its own panel, which is also the only place equipped to
            // refresh when it is.
            removeDelete
            removeChange
          />
        )}
      </>
    );
  },
);

export default MyMap;
