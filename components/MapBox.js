import { MapContainer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import leaflet, { divIcon } from "leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { FaLocationPin } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";
import { GOOGLE_MAPS_API_KEY } from "../services/constants";

const limeOptions = {
  color: "#004d6994",
  dashArray: "10, 5",
  dashOffset: "15",
};

const CustomMarkerIcon = ({ index, color }) => (
  <div className="-mt-4 relative">
    <FaLocationPin
      style={{ color: color ? color : "#111" }}
      className={`text-[40px] font-bold`}
    />
    <span className="absolute top-2 left-[85%] transform -translate-x-[20%] text-white text-center text-xs font-bold">
      {index + 1}
    </span>
  </div>
);

const Mapbox = React.memo((props) => {
  const [polylines, setPolylines] = useState();

  useEffect(() => {
    const updatedPolylines = props.locations.map((element) => [
      element.lat || element?.latitude,
      element.long || element?.longitude,
    ]);

    setPolylines(updatedPolylines);
  }, [props.locations]);

  const FitBoundsOnMount = ({ maxZoom = 10 }) => {
    const map = useMap();

    useEffect(() => {
      // Add guard clause to prevent running with invalid data
      if (!props.locations || props.locations.length === 0) {
        return;
      }

      // Validate that locations have valid coordinates
      const validLocations = props.locations.filter(location => 
        (location.lat || location?.latitude) && 
        (location.long || location?.longitude)
      );

      if (validLocations.length === 0) {
        return;
      }

      try {
        const bounds = leaflet
          .featureGroup(
            validLocations.map((location) =>
              leaflet.marker([
                location.lat || location?.latitude, 
                location.long || location?.longitude
              ])
            )
          )
          .getBounds();

        if (bounds.isValid()) {
          if (validLocations.length === 1) {
            const center = bounds.getCenter();
            map.setView(center, maxZoom);
          } else {
            map.fitBounds(bounds, { maxZoom: maxZoom });
          }
        }
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }, [map, props.locations]); // FIXED: Added props.locations to dependency array

    return null;
  };

  // Add guard clause for the main component
  if (!props?.locations || props.locations.length === 0) {
    return <div>Loading map...</div>;
  }

  // Validate first location for map center
  const firstLocation = props.locations[0];
  const mapCenter = {
    lat: firstLocation?.lat || firstLocation?.latitude || 0,
    lng: firstLocation?.long || firstLocation?.longitude || 0
  };

  // Don't render map if center coordinates are invalid
  if (!mapCenter.lat || !mapCenter.lng) {
    return <div>Invalid location data</div>;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={props.defaultZoom || 1}
      style={{
        height: props.height || "100%",
        width: "100%",
        borderRadius: "1rem",
      }}
    >
      <ReactLeafletGoogleLayer apiKey={GOOGLE_MAPS_API_KEY} />

      {polylines && polylines.length > 0 ? (
        <Polyline pathOptions={limeOptions} positions={polylines} />
      ) : null}

      <MarkerClusterGroup>
        {props.locations.map((location, index) => {
          // Validate each location before rendering marker
          const lat = location?.lat || location?.latitude;
          const lng = location?.long || location?.longitude;
          
          if (!lat || !lng) {
            return null; // Skip invalid locations
          }

          return (
            <Marker
              key={`${location.id}-${index}`}
              animate
              position={[lat, lng]}
              draggable={false}
              icon={divIcon({
                className: "icon",
                html: ReactDOMServer.renderToStaticMarkup(
                  <CustomMarkerIcon index={index} color={location?.color} />
                ),
                iconSize: 20,
              })}
            >
              <Popup className="w-[26rem]">
                {props.InfoWindowContainer ? (
                  props.InfoWindowContainer(location)
                ) : (
                  <b>{location.name}</b>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      <FitBoundsOnMount />
    </MapContainer>
  );
});

export default Mapbox;