import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import leaflet, { divIcon } from "leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { MAPBOX_ACCESS_TOKEN } from "../services/constants";

const limeOptions = {
  color: "#004d6994",
  dashArray: "10, 5", // Defines the pattern of the dashed line (10 units of solid line, 5 units of blank space)
  dashOffset: "15",
};

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
      <TileLayer
        url={`
       https://api.mapbox.com/styles/v1/shivaank/clhpyxasr01ud01qu4n3e7x80/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
      />

      <ReactLeafletGoogleLayer apiKey="AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E" />

      {polylines ? (
        <Polyline pathOptions={limeOptions} positions={polylines} />
      ) : null}

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
            icon={divIcon({
              className: "icon",
              html: `
                <div class="-mt-1 -ml-2 group w-[40px] h-[40px] rounded-full grid place-items-center">
                    <div class="-mt-2 drop-shadow-lg group-hover:animate-bounce rounded-full w-[30px] h-[30px] flex justify-center items-center" style="background-color: ${
                      location.color ? location.color : "#111"
                    };">
                    <span class="text-white text-xs font-bold  ">  ${
                      index + 1
                    }</span>
                    </div>
                </div>`,
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
