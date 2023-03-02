import React, {useRef, useState} from 'react';
import styled from 'styled-components'
import CityContainer from '../CityContainer';
import Timer from '../../../containers/itinerary/timer/Index';



const Container = styled.div`
@media screen and (min-width: 768px){
    width: 80%;
        margin: auto;
        display: grid;
        grid-template-columns: 20% 80%;
        padding: 2rem;
}
    `;
   
const Itinerary = (props) =>{
    
    const [hideTimer, setHideTimer] = useState(false);

    const _handleTimerClose = () => {
        props._hideTimerHandler();
        window.scrollTo(0,window.innerHeight/2)
        setHideTimer(true);

    }

  
    //Generate city containers for each ciyt
    let ContainerArr = [];
    for(var i=0 ; i<props.city_slabs.length; i++){
        if(!props.city_slabs[i].is_trip_termindated)
            ContainerArr.push(
                <div><CityContainer hideTimer={props.hideTimer} blur={props.blur} day_slabs={props.itinerary.day_slabs}  city={props.city_slabs[i].city_name}   startingslab={props.city_slabs[i].day_slab_location.start_day_slab_index} endingslab={props.city_slabs[i].day_slab_location.end_day_slab_index} startingindex={props.city_slabs[i].day_slab_location.start_element_index} endingindex={props.city_slabs[i].day_slab_location.end_element_index}></CityContainer></div>,
            )
    }
    
    return(
    <Container id="kochi-anchor" style={{marginTop : props.showTimer && !props.hideTimer ? '-50vh' : '0' }}>
        {/* {props.showTimer? <Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds} startingTimer={props.startingTimer} timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={props.hideTimer} _handleTimerClose={_handleTimerClose} _hideTimerHandler={props._hideTimerHandler}></Timer> : null} */}
        <div >
        {props.location_selected == 0 ? ContainerArr[0] : null }
        {props.location_selected == 1 ? ContainerArr[1] : null }
        {props.location_selected == 2 ? ContainerArr[2] : null }
        {props.location_selected == 3 ? ContainerArr[3] : null }
        {props.location_selected == 4 ? ContainerArr[4] : null }
        {props.location_selected == 5 ? ContainerArr[5] : null }
        {props.location_selected == 6 ? ContainerArr[6] : null }
        {props.location_selected == 7 ? ContainerArr[7] : null }
        {props.location_selected == 8 ? ContainerArr[8] : null }
        {props.location_selected == 9 ? ContainerArr[9] : null }
        {props.location_selected == 10 ? ContainerArr[10] : null }


            </div>
     </Container>);
    
}

export default React.memo(Itinerary);