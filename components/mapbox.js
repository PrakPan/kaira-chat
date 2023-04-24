import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
const MyIcon = ({ color }) => {
  const iconMarkup = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="8" stroke="${color}" stroke-width="2" fill="transparent"/>
                    </svg>`;

  const iconOptions = {
    html: iconMarkup,
    className: 'my-icon-class',
    iconSize: [20, 20],
  };

  const customIcon = new DivIcon(iconOptions);
  return customIcon;
};
const Mapbox = ({ locations }) => {
  return (
    <MapContainer
      center={[locations[0].lat ?? 0, locations[0].long ?? 0]}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={`
       https://api.mapbox.com/styles/v1/ssoam/cl77qs9yq000c14uk4kv9ecog/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3NvYW0iLCJhIjoiY2w3N3J5ZTgyMDJwZzNwb3gzYWtxdWttciJ9.g2IBgPyHpz_bDNTAe3g2fw`}
        // attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      {locations.map((location, index) => (
        <Marker
          key={location.id}
          animate
          position={[location.lat ?? 0, location.long ?? 0]}
          draggable={false}
          icon={<MyIcon color={location.color} />}
        />
      ))}
    </MapContainer>
  );
};

export default Mapbox;
