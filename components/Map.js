import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import leaflet from "leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { GOOGLE_MAPS_API_KEY } from "../services/constants";

const customIcon = leaflet.icon({
  iconUrl:
    "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/black-marker.png",
  iconSize: [28, 32],
  iconAnchor: [14, 32],
});

const Mapbox = React.memo((props) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !props.locations?.length) return null;
  
  const FitBoundsOnMount = () => {
    const map = useMap();

    useEffect(() => {
      if (props.locations) {
        const bounds = leaflet
          .featureGroup(
            props.locations.map((location) =>
              leaflet.marker([location.latitude, location.longitude])
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

  if (props.center) {
    return (
      <MapContainer
        center={props.center}
        zoom={props.defaultZoom || 1}
        style={{
          height: props.height || "100%",
          width: "100%",
          borderRadius: "1rem",
        }}
      >
        <ReactLeafletGoogleLayer apiKey={GOOGLE_MAPS_API_KEY} />
        <MarkerClusterGroup>
          <Marker
            key={props?.center?.lat}
            animate
            position={[props?.center?.lat, props?.center?.lng]}
            draggable={false}
            icon={customIcon}
          >
            <Popup>
              {props?.InfoWindowContainer ? props.InfoWindowContainer : ""}
            </Popup>
          </Marker>
        </MarkerClusterGroup>
      </MapContainer>
    );
  }

  return props?.locations ? (
    <MapContainer
      center={{
        lat: props?.locations[0]?.latitude,
        lng: props?.locations[0]?.longitude,
      }}
      zoom={props.defaultZoom || 1}
      style={{
        height: props.height || "100%",
        width: "100%",
        borderRadius: "1rem",
      }}
    >
      <ReactLeafletGoogleLayer apiKey={GOOGLE_MAPS_API_KEY} />
      <MarkerClusterGroup>
        {props.locations.map((location, index) => (
          <Marker
            key={location.id}
            animate
            position={[
              location?.latitude ? location.latitude : "",
              location?.longitude ? location.longitude : "",
            ]}
            draggable={false}
            icon={customIcon}
          >
            <Popup>
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
