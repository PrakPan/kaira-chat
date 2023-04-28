import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
} from 'react-leaflet';
import { divIcon } from 'leaflet';
import { format, parseISO } from 'date-fns';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import ImageLoader from './ImageLoader';
import { ITbutton } from '../containers/newitinerary/breif/cities/City';
import WeatherWidget from './WeatherWidget/WeatherWidget';
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
const limeOptions = {
  color: 'black',
  dashArray: '10, 5', // Defines the pattern of the dashed line (10 units of solid line, 5 units of blank space)
  dashOffset: '10',
};
const Mapbox = ({ locations, currentPopup, setCurrentPopup }) => {
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
  const convertDFormat = (dt) => {
    const date = parseISO(dt);
    const formattedDate = format(date, 'MMMM do');
    return formattedDate;
  };
  useEffect(() => {
    const updatedPolylines = locations.map((element) => [
      element.lat,
      element.long,
    ]);
    setPolylines(updatedPolylines);
    console.log('useEffect location');
    // console.log(locations);
  }, []);
  function scrollToTargetAdjusted(id) {
    // if (window.location.pathname === '/') {
    //   router.push({ pathname: '/locations', query: { scroll: target } });
    //   return;
    // }
    // console.log(`lool${target}`);
    console.log(`clicked id ${id}`);
    const element = document.getElementById(id);
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
  console.log(polylines);
  return (
    <MapContainer
      center={[locations[0].lat, locations[0].long]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
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
          icon={divIcon({
            className: 'icon',
            html: `<div class=" rounded-full w-[30px] h-[30px] flex justify-center items-center" style="background-color: ${
              location.color
            };">
            <span class="text-white text-xs font-bold  ">  ${index + 1}</span>
         
          `,
            iconSize: 20,
          })}
        >
          <Popup className="w-[26rem]">
            <div className="flex flex-row w-[26rem] ">
              <div>
                <ImageLoader
                  borderRadius="8px"
                  url={location.cityData.image}
                  height={150}
                  width={150}
                  heightMobile="auto"
                  dimensionsMobile={{ width: 150, height: 150 }}
                ></ImageLoader>
              </div>

              <div className="flex flex-col gap-2 pl-3">
                <div className={`font-bold text-lg text-[#270e0e]`}>
                  {location.name}
                </div>
                <div className="flex flex-row gap-2">
                  <span>Date</span>:<div>{location.date}</div>
                </div>
                <div>Things to do</div>
                <div className="font-bold text-md">
                  Tours · Wildlife · Museums
                </div>
                {/* <WeatherWidget
                  city={location.city_name}
                  lat={location.lat}
                  lon={location.long}
                /> */}
                {/* <a
                  href="#_"
                  class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
                >
                  View {location.cityData.city_name} in your Itinerary
                  <span class="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400  opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}
                    ></span>
                  </span>
                </a> */}
                <div
                  className={`relative rounded min-w-fit flex flex-row cursor-pointer bg-slate-600 px-2 py-2 text-xs font-semibold text-white shadow-sm  hover:bg-[#BF3535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={() => scrollToTargetAdjusted(location.dayId)}
                >
                  View {location.cityData.city_name} in your Itinerary
                  <span class="absolute -right-1 -top-2 flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {currentPopup ? (
        <Popup
          className="w-[26rem]"
          position={[currentPopup[0].lat, currentPopup[0].long]}
        >
          <div className="flex flex-row w-[26rem] ">
            <div>
              <ImageLoader
                borderRadius="8px"
                url={currentPopup[0].cityData.image}
                height={150}
                width={150}
                heightMobile="auto"
                dimensionsMobile={{ width: 150, height: 150 }}
              ></ImageLoader>
            </div>

            <div className="flex flex-col gap-2 pl-3">
              <div className={`font-bold text-lg text-[#270e0e]`}>
                {currentPopup[0].name}
              </div>
              <div className="flex flex-row gap-2">
                <span>Date</span>:<div>{currentPopup[0].date} </div>
              </div>
              <div>Things to do</div>
              <div className="font-bold text-md">
                Tours · Wildlife · Museums
              </div>
              {/* <WeatherWidget
                city={currentPopup[0].city_name}
                lat={currentPopup[0].lat}
                lon={currentPopup[0].long}
              /> */}
              {/* <a
            href="#_"
            class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
          >
            View {currentPopup[0].cityData.city_name} in your Itinerary
            <span class="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400  opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}
              ></span>
            </span>
          </a> */}
              <div
                className={`relative rounded min-w-fit flex flex-row cursor-pointer bg-slate-600 px-2 py-2 text-xs font-semibold text-white shadow-sm  hover:bg-[#BF3535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={() => scrollToTargetAdjusted(currentPopup[0].dayId)}
              >
                View {currentPopup[0].cityData.city_name} in your Itinerary
                <span class="absolute -right-1 -top-2 flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}
                  ></span>
                </span>
              </div>
            </div>
          </div>
        </Popup>
      ) : null}
    </MapContainer>
  );
};

export default Mapbox;
