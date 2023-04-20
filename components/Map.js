import React, { useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
  Polyline,
} from '@react-google-maps/api';

import SkeletonCard from './ui/SkeletonCard';
import { useRef } from 'react';
import { useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import axiosPoiCityInstance from '../services/poi/city';
function Map(props) {
  const [center, setCenter] = useState({
    lat: props.locations[0].lat,
    lng: props.locations[0].long,
  });
  const [currentpage, setcurrentPage] = useState('/');
  const [zoom, setZoom] = useState(14);
  const [map, setMap] = useState(null);
  const MapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E',
  });
  const colorMarker = (color) => {
    return {
      path:
        'M11 0.666672C5.40001 0.666672 0.333344 4.96 0.333344 11.6C0.333344 16.0267 3.89334 21.2667 11 27.3333C18.1067 21.2667 21.6667 16.0267 21.6667 11.6C21.6667 4.96 16.6 0.666672 11 0.666672ZM11 14C9.53334 14 8.33334 12.8 8.33334 11.3333C8.33334 9.86667 9.53334 8.66667 11 8.66667C12.4667 8.66667 13.6667 9.86667 13.6667 11.3333C13.6667 12.8 12.4667 14 11 14Z',
      // scaledSize: { width: 30, height: 30 },
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 1,
      scale: 1,
    };
  };
  const router = useRouter();
  const [activeMarker, setActiveMarker] = useState(null);
  useEffect(() => {
    const currentRoute = router.asPath.split('/')[1];
    setcurrentPage(currentRoute);
    console.log(`routee ${currentRoute}`);
    if (map) {
      let selectedMarker = props.locations.filter(
        (location) => location.id == props.active
      );
      console.log(`change marker${JSON.stringify(selectedMarker[0].lat)}`);
      // handleZoomToLocation (selectedMarker[0].lat,selectedMarker[0].long)
      setCenter({ lat: selectedMarker[0].lat, lng: selectedMarker[0].long });
      setZoom(18);
      handleActiveMarker(props.active);
    }
  }, [props.active]);
  const handleZoomToLocation = (lat, lng) => {
    const newCenter = { lat, lng };
    const newZoom = 15;

    setCenter(newCenter);
    setZoom(newZoom);

    if (MapRef.current) {
      MapRef.current.panTo(newCenter);
    }
  };
  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
  };
  async function getCityDetails(cityname) {
    const res = await axiosPoiCityInstance.get(`/?city_id=${cityname}`);
    const data = res.data;
    return data;
  }
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const path = [];
  const handleOnLoad = (map) => {
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();

    props.locations.forEach((location) =>
      bounds.extend({
        lat: location.lat == null ? 0 : location.lat,
        lng: location.long == null ? 0 : location.long,
      })
    );
    map.fitBounds(bounds);
  };

  props.locations.forEach((location) =>
    path.push({
      lat: location.lat == null ? 0 : location.lat,
      lng: location.long == null ? 0 : location.long,
    })
  );
  // async function processLocations(locations) {
  //   let path = [];
  //   for (const location of locations) {
  //     const lat =
  //       location.lat === null
  //         ? await getCityDetails(location.city_id).lat
  //         : location.lat;
  //     const long =
  //       location.long === null
  //         ? await getCityDetails(location.city_id).long
  //         : location.long;
  //     path.push({ lat, long });
  //   }
  //   return path;

  // }

  // const path = processLocations(props.locations);
  const containerStyle = {
    width: props.width || '100%',
    height: props.height || '100%',
    borderRadius: props.borderRadius || '10px',
  };
  const defaultIcon = {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(<FaMapMarkerAlt />),
    scaledSize: { width: 32, height: 32 },
  };
  if (props.center) {
    return isLoaded ? (
      <GoogleMap
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={containerStyle}
        options={{ disableDefaultUI: true, fullscreenControl: true }}
      >
        <Marker
          onClick={() =>
            handleActiveMarker(props.center.lat + props.center.lng)
          }
          position={props.center}
          icon={colorMarker(props.locations[0].color)}
        >
          {activeMarker === props.center.lat + props.center.lng ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              {props.InfoWindowContainer || ''}
            </InfoWindow>
          ) : null}
        </Marker>
      </GoogleMap>
    ) : (
      <SkeletonCard {...containerStyle}></SkeletonCard>
    );
  }
  const lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 2,
  };
  const options = {
    strokeOpacity: 0,
    icons: [
      {
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      },
    ],
    strokeWeight: 2,
  };
  const onLoad = (polyline) => {
    console.log('Polyline onLoad:', polyline);
  };

  const onUnmount = (polyline) => {
    console.log('Polyline onUnmount:', polyline);
  };

  return isLoaded ? (
    <GoogleMap
      ref={MapRef}
      onLoad={handleOnLoad}
      options={mapOptions}
      zoom={zoom}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={containerStyle}
      // zoom={props.defaultZoom?props.defaultZoom:6}
      center={center}
    >
      {currentpage == 'itinerary' ? (
        <Polyline
          path={path}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
        />
      ) : null}

      <MarkerClusterer>
        {(clusterer) =>
          props.locations.map((location, index) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.long }}
              onClick={() => handleActiveMarker(location.id)}
              icon={colorMarker(location.color)}
              clusterer={clusterer}
            >
              {activeMarker === location.id ? (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  {props.InfoWindowContainer ? (
                    props.InfoWindowContainer(location)
                  ) : (
                    <b>{location.name}</b>
                  )}
                </InfoWindow>
              ) : null}
            </Marker>
          ))
        }
      </MarkerClusterer>
    </GoogleMap>
  ) : (
    <SkeletonCard {...containerStyle}></SkeletonCard>
  );
}

export default Map;
