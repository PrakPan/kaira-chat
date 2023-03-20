import { useRouter } from "next/router"
import { useEffect } from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const _passProps = (props) => {
  
}
const MyMapComponent = withScriptjs(withGoogleMap((props) =>
<GoogleMap
  defaultZoom={6}
  defaultI
  defaultCenter={{ lat: -34.397, lng: 150.644  }}
  options={{disableDefaultUI : true}}

>
  {/* {prop.isMarkerShown} */}
  {props.locations.map(location => <Marker onClick={() => _handleMapRedirect(location.name)}  icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/location-yellow.png'} position={{ lat: location.lat, lng: location.long }} />)}
</GoogleMap>
))

const Map = (props) => {
const router = useRouter();

useEffect(() => {
  
}, [props.locations]);

  const _handleMapRedirect = (text) => {
    router.push('/tailored-travel?search_text='+text)
  }

    return(
<MyMapComponent
  isMarkerShown
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `200px`, maxWidth: '300px' , borderRadius: '12px', margin: '0 0.25rem 0 0.25rem'}} />}
  mapElement={<div style={{ height: `100%`,  borderRadius: '12px', }} />}
/>);
}

export default Map;