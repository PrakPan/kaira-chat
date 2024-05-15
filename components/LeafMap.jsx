import * as React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MAPBOX_ACCESS_TOKEN } from "../services/constants";

import styled from "styled-components";

const [map, setMap] = useState(null);

const MapInside = styled.div`
  flex: 3;
  width: 100%;

  zindex: 8;
  @media screen and (max-width: 768px) {
    height: 100% !important;
  }
`;

const LeafMap = ({ location }) => {
  const position = [51.505, -0.09];
  return (
    <MapInside id="map">
      <MapContainer
        whenCreated={setMap}
        center={[40.8054, -99.0241]}
        zoom={4}
        ZoomControl={false}
        scrollWheelZoom={false}
        className="lg:h-mapheightFull h-mapheightMob"
        style={{ width: "100%" }}
      >
        <TileLayer
          url={`
       https://api.mapbox.com/styles/v1/ssoam/cl77qs9yq000c14uk4kv9ecog/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </MapInside>
  );
};

export default LeafMap;
