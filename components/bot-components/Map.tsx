import React, { useEffect, useRef } from "react";

interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  duration?: number;
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
    stylers: [{ color: "#46bcec" }, { visibility: "on" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#c8d7d4" }],
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
  const polylineRef = useRef<google.maps.Polyline | null>(null);

// Initialize map with Snazzy Maps styling
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
    // Poll until the Google Maps script finishes loading
    const interval = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(interval);
        initMap();
      }
    }, 100);
    return () => clearInterval(interval);
  }
}, []);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter({ lat: state.lat, lng: state.lng });
      if (state.zoom) {
        mapInstance.current.setZoom(state.zoom);
      }
    }
  }, [state.lat, state.lng, state.zoom]);

  useEffect(() => {
    if (!mapInstance.current || !currentRoute || currentRoute.length < 2) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const path = currentRoute.map((location) => ({
      lat: location.lat,
      lng: location.lng,
    }));

    polylineRef.current = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            strokeColor: "#4DB8FF",
            scale: 3,
          },
          offset: "0",
          repeat: "15px",
        },
      ],
    });

    polylineRef.current.setMap(mapInstance.current);

    const bounds = new google.maps.LatLngBounds();
    currentRoute.forEach((location) => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    mapInstance.current.fitBounds(bounds, {
      top: 80,
      right: 60,
      bottom: 80,
      left: 60,
    });
  }, [currentRoute]);

  // Add/update user location marker with custom pin design
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !infoWindowRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Custom blue pin with person icon for user location
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

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current || !infoWindowRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    locations?.forEach((location, index) => {
      const isRouteStop = currentRoute?.some(
        (routeLocation) => routeLocation.id === location.id,
      );
      const markerColor = isRouteStop ? "#4285F4" : "#EA4335";
      const markerZIndex = isRouteStop ? 200 + index : 100 + index;

      const markerIcon = {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="${currentRoute?.[index]?.accent || markerColor}"/>
        <g transform="translate(9.5, 7.5)">
          <path d="M6.41667 0C2.86917 0 0 2.86917 0 6.41667C0 11.2292 6.41667 16.3333 6.41667 16.3333C6.41667 16.3333 12.8333 11.2292 12.8333 6.41667C12.8333 2.86917 9.96417 0 6.41667 0ZM6.41667 8.70833C5.15167 8.70833 4.125 7.68167 4.125 6.41667C4.125 5.15167 5.15167 4.125 6.41667 4.125C7.68167 4.125 8.70833 5.15167 8.70833 6.41667C8.70833 7.68167 7.68167 8.70833 6.41667 8.70833Z" fill="white"/>
        </g>
      </svg>
    `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
      };

      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstance.current!,
        title: location.name,
        icon: markerIcon,
        zIndex: markerZIndex,
      });

      // Add info window
      marker.addListener("click", () => {
        let content = `
          <div style="padding: 12px; min-width: 240px; max-width: 300px;">
            <h3 style="font-weight: bold; margin: 0 0 8px 0; color: #202124; font-size: 16px;">${location.name}</h3>
            <p style="color: #5f6368; font-size: 14px; margin: 0; line-height: 1.4;">${location.description || "No description available"}</p>
        `;

        if (isRouteStop && currentRoute) {
          const routeIndex =
            currentRoute.findIndex((routeLoc) => routeLoc.id === location.id) +
            1;
          content += `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 18px; height: 18px; background: #4285F4; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">
                  ${routeIndex}
                </div>
                <span style="color: #4285F4; font-size: 13px; font-weight: 500;">Stop ${routeIndex} of ${currentRoute.length}</span>
              </div>
            </div>
          `;
        }

        content += `</div>`;

        infoWindowRef.current!.setContent(content);
        infoWindowRef.current!.open(mapInstance.current!, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds logic
    if (currentRoute && currentRoute.length > 0) {
      return;
    } else if (locations?.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations?.forEach((location) => {
        bounds.extend(
          new window.google.maps.LatLng(location.lat, location.lng),
        );
      });

      mapInstance.current.fitBounds(bounds);

      mapInstance.current.fitBounds(bounds, {
        top: 80,
        right: 60,
        bottom: 80,
        left: 60,
      });
    } else if (userLocation) {
      mapInstance.current.setCenter({
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      mapInstance.current.setZoom(13);
    }
  }, [locations, userLocation, currentRoute, mapInstance]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MyMap;
