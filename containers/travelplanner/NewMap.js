import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E",
    loadingElement:<div style={{ height: `100%` }} />,
    containerElement:<div style={{ height: `200px`, maxWidth: '300px' , borderRadius: '12px', margin: '0 0.25rem 0 0.25rem'}} />,
    mapElement:<div style={{ height: `100%`,  borderRadius: '12px'}}/>,
  }),
  withScriptjs,
  withGoogleMap
)((props) => 
  <GoogleMap
    defaultZoom={6}
    defaultCenter={{ lat: props.locations[0].lat, lng: props.locations[0].long}}
  > 
   {props.locations.map(location => <Marker onClick={() =>props. _handleMapRedirect(location.name)}  icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/location-yellow.png'} position={{ lat: location.lat, lng: location.long }} />)} 

    {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />} */}
  </GoogleMap>
)

class MyFancyComponent extends React.Component {
  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    return (
      <MyMapComponent
      locations={this.props.locations}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}
export default MyFancyComponent