import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

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
}

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

// Pink numbered pin using exact provided SVG shape
function getNumberedPin(number: number): google.maps.Icon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
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
      <text x="24" y="28.5" text-anchor="middle"
        font-family="Inter, Arial, sans-serif"
        font-size="13"
        font-weight="700"
        fill="#FD6D6C">${number}</text>
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
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
      <defs>
        <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.30)"/>
        </filter>
      </defs>
      <path d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0Z" fill="${fill}" filter="url(#sh)"/>
      <g transform="translate(8, 8)">
        ${glyph}
      </g>
    </svg>`;
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(36, 46),
    anchor: new google.maps.Point(18, 46),
  };
}

// Generic category marker (non-route stops)
function getMarkerIcon(type: string): google.maps.Icon {
  const configs: Record<string, { bg: string; svg: string }> = {
    restaurant: {
      bg: "#2AB0FC",
      svg: `<path d="M5.83203 18.3337V10.7087C5.1237 10.5142 4.52995 10.1253 4.05078 9.54199C3.57161 8.95866 3.33203 8.2781 3.33203 7.50032V1.66699H4.9987V7.50032H5.83203V1.66699H7.4987V7.50032H8.33203V1.66699H9.9987V7.50032C9.9987 8.2781 9.75911 8.95866 9.27995 9.54199C8.80078 10.1253 8.20703 10.5142 7.4987 10.7087V18.3337H5.83203ZM14.1654 18.3337V11.667H11.6654V5.83366C11.6654 4.68088 12.0716 3.69824 12.8841 2.88574C13.6966 2.07324 14.6793 1.66699 15.832 1.66699V18.3337H14.1654Z" fill="white"/>`,
    },
    poi: {
      bg: "#5CBA66",
      svg: `<g clip-path="url(#cp)"><path d="M16.0846 14.0837C16.418 13.5003 16.668 12.8337 16.668 12.0837C16.668 10.0003 15.0013 8.33366 12.918 8.33366C10.8346 8.33366 9.16797 10.0003 9.16797 12.0837C9.16797 14.167 10.8346 15.8337 12.918 15.8337C13.668 15.8337 14.3346 15.5837 14.918 15.2503L17.5846 17.917L18.7513 16.7503L16.0846 14.0837ZM12.918 14.167C11.7513 14.167 10.8346 13.2503 10.8346 12.0837C10.8346 10.917 11.7513 10.0003 12.918 10.0003C14.0846 10.0003 15.0013 10.917 15.0013 12.0837C15.0013 13.2503 14.0846 14.167 12.918 14.167ZM10.0013 16.667V18.3337C5.4013 18.3337 1.66797 14.6003 1.66797 10.0003C1.66797 5.40032 5.4013 1.66699 10.0013 1.66699C14.0346 1.66699 17.393 4.53366 18.168 8.33366H16.443C15.9096 6.28366 14.443 4.60866 12.5013 3.82533V4.16699C12.5013 5.08366 11.7513 5.83366 10.8346 5.83366H9.16797V7.50032C9.16797 7.95866 8.79297 8.33366 8.33464 8.33366H6.66797V10.0003H8.33464V12.5003H7.5013L3.50964 8.50866C3.4013 8.99199 3.33464 9.48366 3.33464 10.0003C3.33464 13.6753 6.3263 16.667 10.0013 16.667Z" fill="white"/></g><defs><clipPath id="cp"><rect width="20" height="20" fill="white"/></clipPath></defs>`,
    },
    hotel: {
      bg: "#FD6D6C",
      svg: `<path d="M0.832031 15.833V3.33301H2.4987V11.6663H9.16537V4.99967H15.832C16.7487 4.99967 17.5334 5.32606 18.1862 5.97884C18.839 6.63162 19.1654 7.41634 19.1654 8.33301V15.833H17.4987V13.333H2.4987V15.833H0.832031ZM4.0612 10.1038C3.57509 9.61773 3.33203 9.02745 3.33203 8.33301C3.33203 7.63856 3.57509 7.04829 4.0612 6.56217C4.54731 6.07606 5.13759 5.83301 5.83203 5.83301C6.52648 5.83301 7.11675 6.07606 7.60287 6.56217C8.08898 7.04829 8.33203 7.63856 8.33203 8.33301C8.33203 9.02745 8.08898 9.61773 7.60287 10.1038C7.11675 10.59 6.52648 10.833 5.83203 10.833C5.13759 10.833 4.54731 10.59 4.0612 10.1038ZM10.832 11.6663H17.4987V8.33301C17.4987 7.87467 17.3355 7.48231 17.0091 7.15592C16.6827 6.82954 16.2904 6.66634 15.832 6.66634H10.832V11.6663ZM6.42578 8.92676C6.5855 8.76704 6.66537 8.56912 6.66537 8.33301C6.66537 8.0969 6.5855 7.89898 6.42578 7.73926C6.26606 7.57954 6.06814 7.49967 5.83203 7.49967C5.59592 7.49967 5.398 7.57954 5.23828 7.73926C5.07856 7.89898 4.9987 8.0969 4.9987 8.33301C4.9987 8.56912 5.07856 8.76704 5.23828 8.92676C5.398 9.08648 5.59592 9.16634 5.83203 9.16634C6.06814 9.16634 6.26606 9.08648 6.42578 8.92676Z" fill="white"/>`,
    },
    activity: {
      bg: "#AD5BE7",
      svg: `<path d="M16.957 21.0837C16.5598 21.0837 16.174 21.0531 15.7997 20.992C15.4254 20.9309 15.0626 20.8392 14.7112 20.717L1.83203 16.0191L2.29036 14.7128L8.61536 17.0274L10.1966 12.9482L6.91953 9.53366C6.50703 9.10588 6.3428 8.59789 6.42682 8.0097C6.51085 7.42151 6.81259 6.97463 7.33203 6.66908L10.5174 4.83574C10.7772 4.68296 11.0407 4.59512 11.3081 4.5722C11.5754 4.54928 11.839 4.5913 12.0987 4.69824C12.3584 4.78991 12.5838 4.93505 12.7747 5.13366C12.9657 5.33227 13.107 5.56908 13.1987 5.84408L13.4966 6.82949C13.6952 7.48644 14.0199 8.06699 14.4706 8.57116C14.9213 9.07533 15.4598 9.45727 16.0862 9.71699L16.5674 8.25033L17.8737 8.66283L16.8424 11.8253C15.7119 11.642 14.7112 11.1989 13.8404 10.4962C12.9695 9.79338 12.3279 8.92255 11.9154 7.88366L9.60078 9.21283L12.3737 12.3753L10.3341 17.6462L13.1758 18.6774L15.1008 12.7878C15.3147 12.8642 15.5286 12.933 15.7424 12.9941C15.9563 13.0552 16.1779 13.1087 16.407 13.1545L14.4591 19.1587L15.1695 19.4107C15.4445 19.5024 15.731 19.575 16.0289 19.6285C16.3268 19.6819 16.6362 19.7087 16.957 19.7087C17.3543 19.7087 17.7324 19.6705 18.0914 19.5941C18.4504 19.5177 18.798 19.4031 19.1341 19.2503L20.1654 20.2816C19.6765 20.5413 19.1647 20.7399 18.6299 20.8774C18.0952 21.0149 17.5376 21.0837 16.957 21.0837ZM13.8289 5.42012C13.4699 5.06109 13.2904 4.62949 13.2904 4.12533C13.2904 3.62116 13.4699 3.18956 13.8289 2.83053C14.1879 2.47151 14.6195 2.29199 15.1237 2.29199C15.6279 2.29199 16.0595 2.47151 16.4185 2.83053C16.7775 3.18956 16.957 3.62116 16.957 4.12533C16.957 4.62949 16.7775 5.06109 16.4185 5.42012C16.0595 5.77914 15.6279 5.95866 15.1237 5.95866C14.6195 5.95866 14.1879 5.77914 13.8289 5.42012Z" fill="white"/>`,
    },
  };

  const { bg, svg } = configs[type] ?? configs.poi;
  const viewBox = type === "activity" ? "0 0 22 22" : "0 0 20 20";

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
              ${svg}
            </svg>
          </g>
        </svg>
      `),
    scaledSize: new google.maps.Size(36, 36),
    anchor: new google.maps.Point(18, 18),
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
  return img.startsWith("http://") || img.startsWith("https://")
    ? img
    : imgUrlEndPoint + img;
};

function resolveAccent(accent?: string): string {
  if (!accent) return "#FD6D6C";
  return ACCENT_COLORS[accent.toLowerCase()] ?? "#FD6D6C";
}

// Resolve an image URL — return absolute URLs as-is, otherwise prepend the
// CloudFront base. Used anywhere we consume a server-supplied image path.
function resolvePopupImageUrl(img?: string): string | undefined {
  if (!img) return undefined;
  if (/^https?:\/\//i.test(img)) return img;
  return "https://d31aoa0ehgvjdi.cloudfront.net/" + img.replace(/^\/+/, "");
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
  ({ state, locations, userLocation, currentRoute }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const userMarkerRef = useRef<google.maps.Marker | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    // One polyline per segment so we can draw arrows between consecutive stops
    const polylinesRef = useRef<google.maps.Polyline[]>([]);
    const [mapReady, setMapReady] = useState(false);

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

      if (typeof window !== "undefined" && window.google?.maps) {
        initMap();
      } else {
        const interval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(interval);
            initMap();
          }
        }, 100);
        return () => clearInterval(interval);
      }
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
      const hasRoute = currentRoute && currentRoute.length > 0;
      const hasLocations = locations && locations.length > 0;
      if (!hasRoute && !hasLocations) return;

      // Ensure Maps knows the true container size before fitting
      google.maps.event.trigger(mapInstance.current, "resize");

      if (hasRoute) {
        if (currentRoute.length === 1) {
          mapInstance.current.setCenter({
            lat: currentRoute[0].lat,
            lng: currentRoute[0].lng,
          });
          mapInstance.current.setZoom(11);
        } else {
          const bounds = new google.maps.LatLngBounds();
          currentRoute.forEach((loc) =>
            bounds.extend({ lat: loc.lat, lng: loc.lng }),
          );
          mapInstance.current.fitBounds(bounds, {
            top: 80,
            right: 60,
            bottom: 80,
            left: 60,
          });
          clampZoomAfterFit(mapInstance.current);
        }
      } else if (hasLocations) {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((loc) =>
          bounds.extend({ lat: loc.lat, lng: loc.lng }),
        );
        mapInstance.current.fitBounds(bounds, {
          top: 80,
          right: 60,
          bottom: 80,
          left: 60,
        });
        clampZoomAfterFit(mapInstance.current);
      }
    }, [currentRoute, locations, clampZoomAfterFit]);

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
        const wasHidden = lastW === 0 || lastH === 0;
        const isVisible = w > 0 && h > 0;
        lastW = w;
        lastH = h;
        if (wasHidden && isVisible && mapInstance.current) {
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
      const hasRoute = currentRoute && currentRoute.length > 0;
      const hasLocations = locations && locations.length > 0;
      if (hasRoute || hasLocations) return;

      mapInstance.current.setCenter({ lat: state.lat, lng: state.lng });
      if (state.zoom) {
        mapInstance.current.setZoom(state.zoom);
      }
    }, [state.lat, state.lng, state.zoom, currentRoute, locations]);

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

      if (!mapReady || !mapInstance.current || !currentRoute || currentRoute.length === 0)
        return;

      // ↓ Single city — just fit bounds to it, no polyline needed
      if (currentRoute.length === 1) {
        const { lat, lng } = currentRoute[0];
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

      for (let i = 0; i < currentRoute.length - 1; i++) {
        const from = currentRoute[i];
        const to = currentRoute[i + 1];
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
      currentRoute.forEach((loc) =>
        bounds.extend({ lat: loc.lat, lng: loc.lng }),
      );
      mapInstance.current.fitBounds(bounds, {
        top: 80,
        right: 60,
        bottom: 80,
        left: 60,
      });
      clampZoomAfterFit(mapInstance.current);
    }, [currentRoute, clampZoomAfterFit, mapReady]);

    // User location marker — hide when an itinerary route is loaded
    useEffect(() => {
      if (!mapReady || !mapInstance.current || !infoWindowRef.current) return;

      // Remove existing user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }

      // Don't show user location when a route is active
      if (!userLocation || (currentRoute && currentRoute.length > 0)) return;

      const userIcon = {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
        <path d="M20 0C11.163 0 4 7.163 4 16c0 12 16 34 16 34s16-22 16-34c0-8.837-7.163-16-16-16z" fill="#4285F4"/>
        <circle cx="20" cy="16" r="10" fill="white"/>
        <path d="M20 10c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 2c.828 0 1.5.672 1.5 1.5S20.828 15 20 15s-1.5-.672-1.5-1.5S19.172 12 20 12zm0 8c-1.657 0-3-1.343-3-3 0-.414.336-.75.75-.75h4.5c.414 0 .75.336.75.75 0 1.657-1.343 3-3 3z" fill="#4285F4"/>
      </svg>
    `),
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50),
      };

      userMarkerRef.current = new google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstance.current,
        title: "Your Location",
        icon: userIcon,
        zIndex: 1000,
      });

      userMarkerRef.current.addListener("click", () => {
        const locationText = [
          userLocation.city,
          userLocation.regionName,
          userLocation.country,
        ]
          .filter(Boolean)
          .join(", ");
        infoWindowRef.current!.setContent(
          buildPopupHTML({
            title: "Your Location",
            locationText,
            accentColor: "#4285F4",
          }),
        );
        infoWindowRef.current!.open(
          mapInstance.current!,
          userMarkerRef.current!,
        );
      });
    }, [userLocation, currentRoute, mapReady]);

    // Place / update location markers
    useEffect(() => {
      if (!mapReady || !mapInstance.current || !infoWindowRef.current) return;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      locations?.forEach((location) => {
        const loc = location as any;

        // Determine if this location is a numbered route stop
        const routeIndex =
          currentRoute?.findIndex((r) => r.id === location.id) ?? -1;
        const isRouteStop = routeIndex !== -1;

        let markerIcon: google.maps.Icon;
        const endpointKind: "start" | "end" | null =
          loc.type === "start_city"
            ? "start"
            : loc.type === "end_city"
              ? "end"
              : null;
        if (endpointKind) {
          // Trip origin / departure pin — distinct from numbered route stops.
          markerIcon = getEndpointPin(endpointKind);
        } else if (isRouteStop) {
          // Numbered pink pin
          markerIcon = getNumberedPin(routeIndex + 1);
        } else if (loc.type) {
          // Category icon
          markerIcon = getMarkerIcon(loc.type);
        } else {
          // Generic pink location pin (no number) - same shape as numbered pin
          const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="61" viewBox="0 0 48 61" fill="none">
            <defs>
              <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.30)"/>
              </filter>
            </defs>
            <path d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z" fill="#FD6D6C" filter="url(#sh)"/>
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
          } else if (isRouteStop && currentRoute) {
            const badge = `Stop ${routeIndex + 1} of ${currentRoute.length}`;
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
      if (currentRoute && currentRoute.length > 0) return;

      if (locations?.length > 0) {
        google.maps.event.trigger(mapInstance.current, "resize");
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((loc) =>
          bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng)),
        );
        mapInstance.current.fitBounds(bounds, {
          top: 80,
          right: 60,
          bottom: 80,
          left: 60,
        });
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
    }, [locations, userLocation, currentRoute, mapInstance, clampZoomAfterFit, state.zoom, mapReady]);

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
  },
);

export default MyMap;
