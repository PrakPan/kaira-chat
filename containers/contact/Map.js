
import { withGoogleMap, GoogleMap, Marker, withScriptjs } from 'react-google-maps';
import styled from 'styled-components';
import {Component} from 'react';
const Container = styled.div`
  height: 300px;
  width: 100%;
  @media screen and (min-width: 768px){
    height: 500px;
  }
`;

class Map extends Component {
   render() {
   const GoogleMapExample = withScriptjs(withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { {lat: 28.5779959, lng: 77.343917} }
        defaultZoom = { 14 }
    options={{disableDefaultUI : true}}
        
      >
          <Marker position={ {lat: 28.5779959, lng: 77.343917}} />
      </GoogleMap>
   )));
   return(
      <div>
        <GoogleMapExample
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E"
          containerElement={ <Container  /> }
          mapElement={ <div style={{ height: `100%` }} /> }
          loadingElement={<div style={{ height: `100%` }} />}
        />
      </div>
   );
   }
};
export default Map;