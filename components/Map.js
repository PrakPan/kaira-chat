import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker,useJsApiLoader,MarkerClusterer,Polyline } from "@react-google-maps/api";
import SkeletonCard from "./ui/SkeletonCard";
import { useRef } from "react";
import { useEffect } from "react";

function Map(props) {
  const [center, setCenter] = useState({lat: props.locations[0].lat, lng: props.locations[0].long });
  const [zoom, setZoom] = useState(14);
  const [map, setMap] = useState(null);
  const MapRef = useRef(null) 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  })
  const [activeMarker, setActiveMarker] = useState(null);
   useEffect(()=>{
    if(map){
      let selectedMarker = props.locations.filter((location) => (
        location.id == props.active
      ))
      console.log(`change marker${JSON.stringify(selectedMarker[0].lat)}`)
      // handleZoomToLocation (selectedMarker[0].lat,selectedMarker[0].long)
      setCenter({lat : selectedMarker[0].lat , lng : selectedMarker[0].long});
      setZoom(18);
      handleActiveMarker(props.active)
    } 
    
  },[props.active])
  const handleZoomToLocation = (lat, lng) => {
    const newCenter = { lat, lng };
    const newZoom = 15;

    setCenter(newCenter);
    setZoom(newZoom);

    if (MapRef.current) {
      MapRef.current.panTo(newCenter);
    }
  };
  const mapOptions = 
    {
      zoomControl: true,
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
  const path = []
  const handleOnLoad = (map) => {
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
     
    props.locations.forEach(location=> bounds.extend({lat : location.lat , lng : location.long}))
      map.fitBounds(bounds);  
    };
    props.locations.forEach(location=> path.push({lat : location.lat , lng : location.long}))
  const containerStyle={
    width: props.width || '100%', 
    height: props.height || '100%',
    borderRadius : props.borderRadius || '10px'
    }

  if(props.center){
    return isLoaded?(<GoogleMap
    
    
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

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  };
  const onLoad = polyline => {
    console.log('Polyline onLoad:', polyline);
  };

  const onUnmount = polyline => {
    console.log('Polyline onUnmount:', polyline);
  };

  

  return isLoaded? (
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
      <Polyline
        path={path}
        options={options}
        onLoad={onLoad}
        onUnmount={onUnmount}
        
      />
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
