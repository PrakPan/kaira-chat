import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, Polygon } from 'react-google-maps';


  const Map = (props) => {
    let latcenter = null;
    let longcenter = null;

    if(props.breif.city_slabs[1].lat && props.breif.city_slabs[1].long){
      latcenter = props.breif.city_slabs[1].lat;
      longcenter = props.breif.city_slabs[1].long;
    }

    let totalcoords = 0;
    let Markers = [];
    
    for(var i = 0; i < props.breif.city_slabs.length-1 ; i++){
      if(!props.breif.city_slabs[i].is_trip_terminated &&  !props.breif.city_slabs[i].is_starting_city_departure_only && !props.breif.city_slabs[i].is_departure_only && props.breif.city_slabs[i].duration && props.breif.city_slabs[i].duration!=="0"){
        // if(props.breif.city_slabs[i].lat && props.breif.city_slabs[i].long )
       if(props.breif.city_slabs[i].lat && props.breif.city_slabs[i].long){
        Markers.push(
          <Marker position={ {lat: props.breif.city_slabs[i].lat, lng: props.breif.city_slabs[i].long}} />
        );
        totalcoords++;
       }
      }
    }

   const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
        defaultCenter = {{lat: latcenter, lng: longcenter}}
        defaultZoom = {6}
    options={{disableDefaultUI : true}}
        
      >
         {Markers}
      </GoogleMap>
   ));
   
   if(window.innerWidth > 768){
     if(totalcoords > 0 && latcenter && longcenter)
   return(
      <div>
        <GoogleMapExample
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
          containerElement={ <div style={{ height: `50vh`, width: '80%', marginLeft: "30%" }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
   );
   else return null;
   }
   else return(
    <div>
    {window.innerWidth >768 ? <GoogleMapExample
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
      containerElement={ <div style={{ height: `50vh`, width: '80%', margin: "auto"}} /> }
      mapElement={ <div style={{ height: `100%` }} /> }
    /> : <GoogleMapExample
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"

    containerElement={ <div style={{ height: `50vh`, width: '100%', margin: "auto"}} /> }
    mapElement={ <div style={{ height: `100%` }} /> }
    />}
  </div>
   );
};
export default React.memo(Map);