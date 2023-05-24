import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker,useJsApiLoader,MarkerClusterer } from "@react-google-maps/api";
import SkeletonCard from "./ui/SkeletonCard";

function Map(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  })
  const [activeMarker, setActiveMarker] = useState(null);

  const mapOptions = 
    {
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    }
    

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
      props.locations.forEach(location=> bounds.extend({lat : location.lat , lng : location.long}))
      map.fitBounds(bounds);  
    };

  const containerStyle={
    width: props.width || '100%', 
    height: props.height || '100%',
    borderRadius : props.borderRadius || '10px'
    }

  if(props.center){
    return isLoaded?(<GoogleMap
    center={props.center}
    zoom = { 14 }
    onClick={() => setActiveMarker(null)}
    mapContainerStyle={containerStyle}
    
options={{disableDefaultUI : true ,  fullscreenControl: true}}
  >
      <Marker onClick={() => handleActiveMarker(props.center.lat + props.center.lng)}  position={props.center} icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/black-marker.png'}>
      {activeMarker === (props.center.lat + props.center.lng) ? (
      <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              {props.InfoWindowContainer || ''}
            </InfoWindow>) : null}
      </Marker>
  </GoogleMap>) : (<SkeletonCard {...containerStyle}></SkeletonCard>)
  }



  return isLoaded? (
    <GoogleMap
      onLoad={handleOnLoad}
      options={mapOptions}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={containerStyle}
      // zoom={props.defaultZoom?props.defaultZoom:6}
      center={{ lat: props.locations[0]?.lat, lng: props.locations[0]?.long}}
 
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
