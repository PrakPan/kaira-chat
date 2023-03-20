import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker,InfoWindow } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E",
    loadingElement:<div style={{ height: `100%` }} />,
    containerElement:<div style={{ height: `300px`, maxWidth: '100%' , borderRadius: '12px', margin: '0 0.25rem 0 0.25rem'}} />,
    mapElement:<div style={{ height: `100%`,  borderRadius: '12px'}}/>,
  }),
  withScriptjs,
  withGoogleMap
)((props) => 
  <GoogleMap
    options={{disableDefaultUI : true}}
    defaultZoom={props.defaultZoom?props.defaultZoom:6}
    defaultCenter={{ lat: props.locations[0].lat, lng: props.locations[0].long}}
  > 
   {props.locations.map(location => (
   <Marker onClick={() =>props.handleActiveMarker(location.id)}  icon={'https://d31aoa0ehgvjdi.cloudfront.net/media/icons/general/black-marker.png'} position={{ lat: location.lat, lng: location.long }}>
   {props.activeMarker === location.id ? (
   <InfoWindow onCloseClick={() => props.handleInfoClose()}>
      {/* <div>{name}</div> */}
      {props.InfoWindowContainer? props.InfoWindowContainer(location) : <b>{location.name}</b>}
    </InfoWindow>
    ) : null}

</Marker>
  
   
   ))} 

    {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />} */}
  </GoogleMap>
)

class MyFancyComponent extends React.Component {
  state = {
    isMarkerShown: false,
    activeMarker : null
  }

  componentDidMount() {
    this.delayedShowMarker()

  }

   handleActiveMarker = (marker) => {
    if (marker === this.state.activeMarker) {
      return;
    }
    this.setState({activeMarker : marker})
  };

    handleInfoClose = ()=>{
    this.setState({activeMarker : null})
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
        activeMarker={this.state.activeMarker}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        defaultZoom={this.props.defaultZoom}
        handleActiveMarker={this.handleActiveMarker}
        handleInfoClose={this.handleInfoClose}
        InfoWindowContainer={this.props.InfoWindowContainer}
      />
    )
  }
}
export default MyFancyComponent