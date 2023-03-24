import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker,useJsApiLoader,MarkerClusterer } from "@react-google-maps/api";
import SkeletonCard from "./ui/SkeletonCard";

const markers = [
  {
    id: 1,
    name: "Chicago, Illinois",
    position: { lat: 41.881832, lng: -87.623177 }
  },
  {
    id: 2,
    name: "Denver, Colorado",
    position: { lat: 39.739235, lng: -104.99025 }
  },
  {
    id: 3,
    name: "Los Angeles, California",
    position: { lat: 34.052235, lng: -118.243683 }
  },
  {
    id: 4,
    name: "New York, New York",
    position: { lat: 40.712776, lng: -74.005974 }
  }
];

function Map(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  })
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    // markers.forEach(({ position }) => bounds.extend(position));
    props.locations.forEach(location=> bounds.extend({lat : location.lat , lng : location.long}))
    map.fitBounds(bounds);
  };

  const containerStyle={
    width: props.width || '100%', 
    height: props.height || '100%',
    borderRadius : props.borderRadius || '10px'
  }


  return isLoaded? (
    <GoogleMap
      onLoad={handleOnLoad}
      options={{disableDefaultUI : true}}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={containerStyle}
      // zoom={props.defaultZoom?props.defaultZoom:6}
      center={{ lat: props.locations[0].lat, lng: props.locations[0].long}}
 
    >
      <MarkerClusterer>
        { clusterer=>props.locations.map((location) => (
        <Marker
          key={location.id}
          position={{lat : location.lat,lng : location.long}}
          onClick={() => handleActiveMarker(location.id)}
          icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/black-marker.png'}
        clusterer={clusterer}
        >
          {activeMarker === location.id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              {props.InfoWindowContainer? props.InfoWindowContainer(location) : <b>{location.name}</b>}
            </InfoWindow>
          ) : null}
        </Marker>
      ))
        }
 
      </MarkerClusterer>
     
    </GoogleMap>
  ) : <SkeletonCard {...containerStyle}></SkeletonCard>
}

export default Map;
