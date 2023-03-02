import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components'



import ItineraryContainer from './ItineraryContainer';
import Spinner from '../../../components/LoadingPage';
import defaultbreif from '../../itinerary/defaultbrief';

const Container = styled.div`
    width: 100%;
    @media screen and (min-width: 768px) {
      margin-top: 5vh;
    }
`;
 

const Itinerary = (props) =>{
  

    // var id = props.match.params.id;
    var id="1";
    const [loaded, setLoaded] = useState(false);
    const [itinerary, setItinerary] = useState({name: "Loading Itinerary", images: []});
    const [breif, setBreif] = useState(defaultbreif);

    // useEffect(() => {
        // if(props.match.params.id === "LX1513cBeVVjRPY09EhI") setIsGroup(true);
        // axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/day_by_day/?itinerary_id=`+props.match.params.id)
        //   .then(res => {
            
        //     setItinerary(res.data);
        //     setLoaded(true);

        //   }).catch(error => {
        //     props.history.push('/404')
        //   });
      //     axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/brief/?itinerary_id=`+props.match.params.id)
      //     .then(res => {
      //       setBreif(res.data);
        
      //     }).catch(error => {

      //     });
      // }, []);



 let totalduration = 0;  
 //Calculate duration to show in full image
for(var i=0; i<props.brief.city_slabs.length; i++){
  if(props.brief.city_slabs[i].duration) totalduration+=parseInt(props.brief.city_slabs[i].duration);
}
  if(true)
    return(
        <Container>
              <ItineraryContainer itinerary={props.itinerary} brief={props.brief}></ItineraryContainer>
        </Container>
    );
    else return(
    // <div style={{height: "100vh", width: "100vw", backgroundColor: "#f7e700"}} className="center-div">
      <Spinner></Spinner>
    // </div>
    );
   
}

export default React.memo((Itinerary));