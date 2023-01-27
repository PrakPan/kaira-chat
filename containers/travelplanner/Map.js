import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const Map = (props) => {
    const MyMapComponent = withScriptjs(withGoogleMap((prop) =>
  <GoogleMap
    defaultZoom={6}
    defaultI
    defaultCenter={{ lat: props.locations[0].lat, lng: props.locations[0].long }}
  >
    {prop.isMarkerShown}
    {props.locations.map(location => <Marker icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/location-yellow.png'} position={{ lat: location.lat, lng: location.long }} />)}
  </GoogleMap>
))
    return(
<MyMapComponent
  isMarkerShown
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px` }} />}
  mapElement={<div style={{ height: `100%` }} />}
/>);
}

export default Map;