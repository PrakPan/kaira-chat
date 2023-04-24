import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import ImageLoader from './ImageLoader';
import { ITbutton } from '../containers/newitinerary/breif/cities/City';
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
const limeOptions = { color: 'lime' };
const Mapbox = ({ locations }) => {
  // function createTripPointsGeoJson({ locations } = {}) {
  //   return {
  //     type: 'FeatureCollection',
  //     features: locations.map(
  //       ({ placename, location = {}, image, date, todo = [] } = {}) => {
  //         const { lat, lng } = location;
  //         return {
  //           type: 'Feature',
  //           properties: {
  //             placename,
  //             todo,
  //             date,
  //             image,
  //           },
  //           geometry: {
  //             type: 'Point',
  //             coordinates: [lng, lat],
  //           },
  //         };
  //       }
  //     ),
  //   };
  // }
  // function createTripLinesGeoJson({ locations } = {}) {
  //   return {
  //     type: 'FeatureCollection',
  //     features: locations.map((stop = {}, index) => {
  //       const prevStop = locations[index - 1];

  //       if (!prevStop) return [];

  //       const { placename, location = {}, date, todo = [] } = stop;
  //       const { lat, lng } = location;
  //       const properties = {
  //         placename,
  //         todo,
  //         date,
  //       };

  //       const { location: prevLocation = {} } = prevStop;
  //       const { lat: prevLat, lng: prevLng } = prevLocation;

  //       return {
  //         type: 'Feature',
  //         properties,
  //         geometry: {
  //           type: 'LineString',
  //           coordinates: [
  //             [prevLng, prevLat],
  //             [lng, lat],
  //           ],
  //         },
  //       };
  //     }),
  //   };
  // }
  const [polylines, setPolylines] = useState();

  useEffect(() => {
    const updatedPolylines = locations.map((element) => [
      element.lat,
      element.long,
    ]);
    setPolylines(updatedPolylines);
    console.log('useEffect location');
    // console.log(locations);
  }, []);

  console.log(polylines);
  return (
    <MapContainer
      center={[locations[0].lat, locations[0].long]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      {/* <TileLayer
        url={`
       https://api.mapbox.com/styles/v1/ssoam/cl77qs9yq000c14uk4kv9ecog/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3NvYW0iLCJhIjoiY2w3N3J5ZTgyMDJwZzNwb3gzYWtxdWttciJ9.g2IBgPyHpz_bDNTAe3g2fw`}
        // attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      /> */}
      <ReactLeafletGoogleLayer apiKey="AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E" />
      {polylines ? (
        <Polyline pathOptions={limeOptions} positions={polylines} />
      ) : null}

      {/* <Polyline
        // pathOptions={limeOptions}
        position={[
          [26.9124336, 75.7872709],
          [26.9157487, 70.9083443],
        ]}
      /> */}

      {locations.map((location, index) => (
        <Marker
          key={location.id}
          animate
          position={[location.lat ?? 0, location.long ?? 0]}
          draggable={false}
          // icon={<MyIcon color={location.color} />}
        >
          <Popup className="w-[34rem]">
            <div className="flex flex-row justify-between ">
              <div>
                <ImageLoader
                  borderRadius="8px"
                  url={location.cityData.image}
                  height={200}
                  width={200}
                  heightMobile="auto"
                  dimensionsMobile={{ width: 180, height: 180 }}
                ></ImageLoader>
              </div>

              <div className="flex flex-col gap-2 pr-2">
                <div className="font-bold text-lg">{location.name}</div>
                <div className="flex flex-row gap-2">
                  <span>Ideal duration</span>:
                  <div>{location.duration} days</div>
                </div>
                <div>Things to do</div>
                <div className="font-bold text-md">
                  Tours · Wildlife · Museums
                </div>
                <ITbutton
                  onClick={() => scrollToTargetAdjusted(location.dayId)}
                >
                  View {location.cityData.city_name} in your Itinerary
                </ITbutton>
              </div>

              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapbox;
