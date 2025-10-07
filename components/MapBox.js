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

const CITY_COLOR_CODES = [
  "#359EBF",
  "#F0C631",
  "#BF3535",
  "#47691e",
  "#cc610a",
  "#008080",
  "#7d5e7d",
];

const limeOptions = {
  color: "#0D53FF",
  dashArray: "10, 5",
  dashOffset: "15",
  smoothFactor: 1.0,
  weight: 3,
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
    if (props.locations.length < 2) {
      setPolylines([]);
      return;
    }

    // Create curved path by adding intermediate points
    const createCurvedPath = (start, end) => {
      const points = [];
      const steps = 20; // Number of intermediate points for smooth curve
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        
        // Add curve by offsetting the middle points
        if (i > 0 && i < steps) {
          const offset = Math.sin(t * Math.PI) * 0.1; // Curve intensity
          const perpendicularLat = (end[1] - start[1]) * offset;
          const perpendicularLng = -(end[0] - start[0]) * offset;
          
          points.push([
            lat + perpendicularLat,
            lng + perpendicularLng
          ]);
        } else {
          points.push([lat, lng]);
        }
      }
      
      return points;
    };

    const curvedPolylines = [];
    for (let i = 0; i < props.locations.length - 1; i++) {
      const start = [
        props.locations[i].lat || props.locations[i]?.latitude,
        props.locations[i].long || props.locations[i]?.longitude
      ];
      const end = [
        props.locations[i + 1].lat || props.locations[i + 1]?.latitude,
        props.locations[i + 1].long || props.locations[i + 1]?.longitude
      ];
      
      curvedPolylines.push(...createCurvedPath(start, end));
    }

    setPolylines(curvedPolylines);
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
                  <CustomMarkerIcon index={index} color={CITY_COLOR_CODES[index % CITY_COLOR_CODES.length]} />
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