import { useEffect } from "react";
import { Location } from "../types";


export const useMapBounds = (
  currentRoute: Location[] | null,
  mapRef: React.MutableRefObject<google.maps.Map | null>
) => {
  useEffect(() => {
    if (currentRoute && currentRoute.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();

      currentRoute.forEach((location) => {
        bounds.extend(
          new window.google.maps.LatLng(location.lat, location.lng)
        );
      });

      mapRef.current.fitBounds(bounds, {
        top: 80,
        right: 60,
        bottom: 80,
        left: 60,
      });
    }
  }, [currentRoute, mapRef]);
};