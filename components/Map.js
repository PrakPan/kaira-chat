import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import leaflet from "leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";

const customIcon = leaflet.icon({
  iconUrl:
    "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/black-marker.png",
  iconSize: [28, 32],
  iconAnchor: [14, 32],
});
const Mapbox = React.memo((props) => {
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

  if (props.center) {
    // props.center ? props.center :
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
        <TileLayer
          url={`
       https://api.mapbox.com/styles/v1/shivaank/clhpyxasr01ud01qu4n3e7x80/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hpdmFhbmsiLCJhIjoiY2xob3Vjbnd6MDBsNjNkbXNkanp2Nzd5dyJ9.Nikg8Qt4OOYGthgMQ5zH1w`}
          // attribution="The Tarzan Way"
        />
        <ReactLeafletGoogleLayer apiKey="AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E" />
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
        {/* <FitBoundsOnMount /> */}
      </MapContainer>
    );
  }

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
      <TileLayer
        url={`
       https://api.mapbox.com/styles/v1/shivaank/clhpyxasr01ud01qu4n3e7x80/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hpdmFhbmsiLCJhIjoiY2xob3Vjbnd6MDBsNjNkbXNkanp2Nzd5dyJ9.Nikg8Qt4OOYGthgMQ5zH1w`}
        // attribution="The Tarzan Way"
      />
      <ReactLeafletGoogleLayer apiKey="AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E" />
      <MarkerClusterGroup>
        {props.locations.map((location, index) => (
          <Marker
            key={location.id}
            animate
            position={[
              location?.lat ? location.lat : "",
              location?.long ? location.long : "",
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
