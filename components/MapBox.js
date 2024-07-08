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
  dashArray: "10, 5", // Defines the pattern of the dashed line (10 units of solid line, 5 units of blank space)
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
      element.lat,
      element.long,
    ]);

    setPolylines(updatedPolylines);
  }, [props.locations]);

  const FitBoundsOnMount = () => {
    const map = useMap();

    useEffect(() => {
      if (props.locations) {
        const bounds = leaflet
          .featureGroup(
            props.locations.map((location) =>
              leaflet.marker([location.lat, location.long])
            )
          )
          .getBounds();

        if (bounds.isValid()) {
          map.fitBounds(bounds);
        }
      }
    }, [map]);

    return null;
  };

  return props?.locations ? (
    <MapContainer
      center={{ lat: props?.locations[0]?.lat, lng: props?.locations[0]?.long }}
      zoom={props.defaultZoom || 1}
      style={{
        height: props.height || "100%",
        width: "100%",
        borderRadius: "1rem",
      }}
    >
      <ReactLeafletGoogleLayer apiKey={GOOGLE_MAPS_API_KEY} />

      {polylines ? (
        <Polyline pathOptions={limeOptions} positions={polylines} />
      ) : null}

      <MarkerClusterGroup>
        {props.locations.map((location, index) => (
          <Marker
            key={`${location.id}-${index}`}
            animate
            position={[
              location?.lat ? location.lat : "",
              location?.long ? location.long : "",
            ]}
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
        ))}
      </MarkerClusterGroup>

      <FitBoundsOnMount />
    </MapContainer>
  ) : null;
});

export default Mapbox;
