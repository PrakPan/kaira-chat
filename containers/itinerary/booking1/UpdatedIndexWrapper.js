import React from 'react';
import styled from 'styled-components'

import Timer from '../timer/Index';
import BookingIndex from './Index';


const IndexWrapper = (props) =>{
    
//    if(props)
if(props.showTimer)
return <Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds}  startingTimer={props.startingTimer} itineraryDate={props.itineraryDate} openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> 
else return <BookingIndex></BookingIndex>
}

export default IndexWrapper;