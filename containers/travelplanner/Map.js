import { useRouter } from "next/router"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const Map = (props) => {
const router = useRouter();

  const _handleMapRedirect = (text) => {
    router.push('/tailored-travel?search_text='+text)
  }

    const MyMapComponent = withScriptjs(withGoogleMap((prop) =>
  <GoogleMap
    defaultZoom={6}
    defaultI
    defaultCenter={{ lat: props.locations[0].lat, lng: props.locations[0].long }}
  >
    {prop.isMarkerShown}
    {props.locations.map(location => <Marker onClick={() => _handleMapRedirect(location.name)}  icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/location-yellow.png'} position={{ lat: location.lat, lng: location.long }} />)}
  </GoogleMap>
))
    return(
<MyMapComponent
  isMarkerShown
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `300px`, maxWidth: '400px' , borderRadius: '12px', margin: '2.5rem 0.25rem 0 o.25rem'}} />}
  mapElement={<div style={{ height: `100%`,  borderRadius: '12px', }} />}
/>);
}

export default Map;