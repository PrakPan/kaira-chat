import React, { useEffect, useRef } from "react";

interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  duration?: number;
  type?: string;
  accent?: string;
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

const MyMap: React.FC<MapProps> = ({
  state,
  locations,
  userLocation,
  currentRoute,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  // One polyline per segment so we can draw arrows between consecutive stops
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: state.lat, lng: state.lng },
        zoom: state.zoom || 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: mapStyles,
      });
      infoWindowRef.current = new google.maps.InfoWindow();
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

  // Pan / zoom when state changes
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter({ lat: state.lat, lng: state.lng });
      if (state.zoom) {
        mapInstance.current.setZoom(state.zoom);
      }
    }
  }, [state.lat, state.lng, state.zoom]);

  // Draw dashed route lines with arrowheads between consecutive stops
  useEffect(() => {
    // Clear old polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!mapInstance.current || !currentRoute || currentRoute.length === 0) return;

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
      direction = 1
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
        direction
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

    // Fit map to route
    const bounds = new google.maps.LatLngBounds();
    currentRoute.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
    mapInstance.current.fitBounds(bounds, { top: 80, right: 60, bottom: 80, left: 60 });
  }, [currentRoute]);

  // User location marker
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !infoWindowRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

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
      infoWindowRef.current!.setContent(`
      <div style="padding: 12px; min-width: 220px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <div style="font-size: 20px;">📍</div>
          <h3 style="font-weight: bold; color: #4285F4; margin: 0;">Your Location</h3>
        </div>
        <p style="color: #333; font-size: 14px; margin: 4px 0;">${userLocation.city}, ${userLocation.regionName}</p>
        <p style="color: #666; font-size: 12px; margin: 4px 0;">${userLocation.country}</p>
      </div>
    `);
      infoWindowRef.current!.open(mapInstance.current!, userMarkerRef.current!);
    });
  }, [userLocation]);

  // Place / update location markers
  useEffect(() => {
    if (!mapInstance.current || !infoWindowRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    locations?.forEach((location) => {
      const loc = location as any;

      // Determine if this location is a numbered route stop
      const routeIndex = currentRoute?.findIndex((r) => r.id === location.id) ?? -1;
      const isRouteStop = routeIndex !== -1;

      let markerIcon: google.maps.Icon;
      if (isRouteStop) {
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
        zIndex: isRouteStop ? 200 + routeIndex : 100,
      });

      // Info window on click
      marker.addListener("click", () => {
        const accentColor = "#F06B72";

        const nameLine = `<h4 style="font-weight:600;margin:0 0 3px 0;color:#202124;font-size:12px;line-height:1.3;">${location.name}</h4>`;
        const descLine = location.description
          ? `<p style="color:#5f6368;font-size:10px;margin:0 0 3px 0;line-height:1.4;">${location.description}</p>`
          : "";
        const cityLine = loc.city
          ? `<div style="display:flex;align-items:center;gap:3px;font-size:10px;margin-bottom:3px;">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C6.13 0 3 3.13 3 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5C8.62 9.5 7.5 8.38 7.5 7S8.62 4.5 10 4.5 12.5 5.62 12.5 7 11.38 9.5 10 9.5z" fill="${accentColor}"/>
              </svg>
              <span style="color:#888;">${loc.city}</span>
             </div>`
          : "";
        const ratingLine = loc.rating
          ? `<div style="display:flex;align-items:center;gap:3px;font-size:10px;color:#f5a623;">
              ${"★".repeat(Math.round(loc.rating))}<span style="color:#aaa;margin-left:2px;">${loc.rating}</span>
             </div>`
          : "";
        const routeLine =
          isRouteStop && currentRoute
            ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #eee;display:flex;align-items:center;gap:5px;">
                <div style="width:16px;height:16px;background:${accentColor};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;flex-shrink:0;">${routeIndex + 1}</div>
                <span style="color:${accentColor};font-size:11px;font-weight:500;">Stop ${routeIndex + 1} of ${currentRoute.length}</span>
              </div>`
            : "";

        infoWindowRef.current!.setContent(`
          <div style="padding:8px 10px;min-width:180px;max-width:260px;font-family:Inter,sans-serif;">
            ${nameLine}${descLine}${cityLine}${ratingLine}${routeLine}
          </div>`);
        infoWindowRef.current!.open(mapInstance.current!, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds (only when no route — route fitting is handled separately)
    if (currentRoute && currentRoute.length > 0) return;

    if (locations?.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) =>
        bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng))
      );
      mapInstance.current.fitBounds(bounds, { top: 80, right: 60, bottom: 80, left: 60 });
    } else if (userLocation) {
      mapInstance.current.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
      mapInstance.current.setZoom(13);
    }
  }, [locations, userLocation, currentRoute, mapInstance]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyMap;