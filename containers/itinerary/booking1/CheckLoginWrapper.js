import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

// import Timer from '../timer/Index';
import Bookings from './UpdatedIndex';
import {connect} from 'react-redux';
// import Login from '../../../c'

import Spinner from '../../../components/Spinner';
import { useRouter } from 'next/router'
const SpinnerContainer=styled.div`
  height: 60vh;
  width: max-content;
  margin: auto;
@media screen and (min-width: 768px) {
    height: 100vh;
}
`;
const LoginContainer = styled.div`
border-radius: 5px;
 
@media screen and (min-width: 768px) {
  width: 35%;
  margin: 1rem auto;
  border-radius: 5px;
  padding: 0.5rem;
}
`;
const NotFoundContainer = styled.div`
  padding: 5vh;
`;
const MessageContainer = styled.div`
  padding: 0.5rem 0.5rem;
  border-radius: 5px;
  background-color: hsl(0,0%,97%);
  font-weight: 300;
  width: 100%;
  margin: auto;
  text-align: center;
  @media screen and (min-width: 768px){
     

  }
`;

const IndexWrapper = (props) =>{
    const router = useRouter()

    const [booking, setBooking] = useState();
    const [payment, setPayment] = useState();

 
  if(!props.no_bookings){
    if(true)
    return <Bookings  getPaymentHandler={props.getPaymentHandler} flightLoading={props.flightLoading} flightBookings={props.flightBookings} transferLoading={props.transferLoading} _reloadTransferBookings={props._reloadTransferBookings} cardUpdateLoading={props.cardUpdateLoading} _updateFlightBookingHandler={props._updateFlightBookingHandler} _updateStayBookingHandler={props._updateStayBookingHandler} activityBookings={props.activityBookings} transferBookings={props.transferBookings} stayBookings={props.stayBookings} _selectTaxiHandler={props._selectTaxiHandler} setHideFlightModal={props.setHideFlightModal} showFlightModal={props.showFlightModal} setShowFlightModal={props.setShowFlightModal} token={props.token} is_auth={props.email === props.user_email ? true : false} traveleritinerary={props.traveleritinerary} is_stock={props.is_stock} _updatePaymentHandler={props._updatePaymentHandler} _updateBookingHandler={props._updateBookingHandler} reloadBookings={props.reloadBookings} setShowBookingModal={props.setShowBookingModal}  showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} hours={props.hours} minutes={props.minutes} seconds={props.seconds}    timeRequired={props.timeRequired} hideTimer={props.hideTimer} showTimer={false} itineraryDate={props.itineraryDate} blur={false} openItinerary={props.openItinerary}  _handleTimerClose={props._handleTimerClose} setImagesHandler={props.setImagesHandler} payment={props.payment} booking={props.booking}></Bookings>
     else return <SpinnerContainer className="center-div"><Spinner></Spinner></SpinnerContainer>
}

else return(
  <NotFoundContainer>
  <MessageContainer className='border-thin font-opensans'>
  Looks like our travel experts are working on providing you the best available accommodations.
  </MessageContainer></NotFoundContainer>
)
}

const mapStateToPros = (state) => {
    return{
      token: state.auth.token,
      email: state.auth.email
    }
  }

export default connect(mapStateToPros)(IndexWrapper);