import React from "react";
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
  return (
    <div className="flex-1 relative">
      {isLoadingLocation && <LoadingOverlay />}

      <MyMap
        state={mapState}
        locations={locations}
        userLocation={userLocation}
        currentRoute={currentRoute}
        ref={mapRef}
      />

      {/* {userLocation && (
        <MapLegend userLocation={userLocation} locationCount={locations?.length || 0} />
      )} */}
    </div>
  );
};

export default MapView;