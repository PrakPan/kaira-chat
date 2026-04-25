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

      // Clamp zoom to avoid being too zoomed out on wide desktop containers
      const map = mapRef.current;
      google.maps.event.addListenerOnce(map, "idle", () => {
        const z = map.getZoom();
        if (z !== undefined && z < 5) map.setZoom(5);
        else if (z !== undefined && z > 14) map.setZoom(14);
      });
    }
  }, [currentRoute, mapRef]);
};