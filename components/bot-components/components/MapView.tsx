import React, { useEffect, useState } from "react";
import MyMap from "../Map";
import MapLegend from "./MapLegend";
import LoadingOverlay from "./LoadingOverlay";
import { MapViewProps } from "../types";

const MapView: React.FC<MapViewProps> = ({
  mapState,
  locations,
  userLocation,
  currentRoute,
  isLoadingLocation,
  mapRef,
}) => {
  // Animate in when first mounted (after the start screen fades out)
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setRevealed(true);
    });
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className="flex-1 relative overflow-hidden transition-all duration-700 ease-out"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "scale(1)" : "scale(0.98)",
      }}
    >
      {isLoadingLocation && <LoadingOverlay />}

      <MyMap
        state={mapState}
        locations={locations}
        userLocation={userLocation}
        currentRoute={currentRoute}
        ref={mapRef}
      />

      {/* Subtle gradient overlay at top for visual polish */}
      <div
        className="absolute inset-x-0 top-0 h-8 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
        }}
      />
    </div>
  );
};

export default MapView;