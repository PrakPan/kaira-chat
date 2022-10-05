import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BookingCard from '../../../components/cards/editablebookings/Index';
import Heading from '../../../components/heading/Heading';
import Button from '../../../components/Button';
import SummaryContainer from './TailoredDetails';
import Flickity from '../../../components/FlickityCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
import ComingSoon from './ComingSoon';
import FullScreenGallery from '../../../components/fullscreengallery/Index';
import Timer from '../timer/Index';
// import OldBookingModal from '../../../components/modals/booking/Index';

import BookingModal from '../../../components/modals/bookingupdated/Index';
import FlightModal from '../../../components/modals/flights/Index';
import OldBookingCard from '../../../components/cards/Booking';
import { useRouter } from 'next/router'
import media from '../../../components/media';
import DesktopBanner from '../../../components/containers/Banner';
import Banner from '../../homepage/banner/Mobile';
// import Accommodation from '../../../components/modals/accommodation/Index';
import FlightCard from '../../../components/cards/editableflights/Index';
import DesktopCardContainer from './DesktopCardCotainer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Spinner from '../../../components/Spinner';
import * as ga from '../../../services/ga/Index';
import urls from '../../../services/urls';

import StayBookingCard from '../../../components/cards/bookings/staybooking/Index';
const Container = styled.div`
width: 100%;
margin: auto;

@media screen and (min-width: 768px){
    width: 90%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    margin-top: 10vh;
}
 
`;
const MobileWidthContainer = styled.div`
width: 90%;
margin: auto;
@media screen and (min-width: 768px){
  width: 100%;
}
`;
const CardsContainer = styled.div`

margin: auto;
padding: 0;
grid-template-columns: 1fr;
grid-template-rows: auto auto;
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    background-color: hsl(0,0%, 97%);
    padding: 0.5rem;
}
@media (min-width: 768px) and (max-width: 1024px) {

}

`
;
const BookingsContainer = styled.div`

border-radius: 10px;
@media screen and (min-width: 768px){
min-height:  50vh;
padding: 1rem;

}
`;

const MessageContainer = styled.div`
  padding: 0.5rem;
  border-radius: 5px;
  background-color: hsl(0,0%,97%);
  font-weight: 300;
   
  margin: 1rem 0;
  @media screen and (min-width: 768px){
    margin: 0 0 2rem 0;

  }
`;
const TargetContainer = styled.div`
  padding: 1rem 0;
  min-height: 40vh;
`;
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
            <TargetContainer>{children}</TargetContainer>
         
        )}
      </div>
    );
  }

const Booking = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel')
  }
  
   const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      const tabs = ['S', 'T', 'A'];
      ga.event({action: 'Itinerary-bookings-tabs-'+tabs[newValue], params: {key : ''}});

      if(newValue === 1) props._reloadTransferBookings();
      setValue(newValue);
    };

  let isPageWide = media('(min-width: 768px)')
    const [alternates, setAlternates] = useState(null);
    const [showpayment, setShowpayment] = useState(false);
     const [images, setImages] = useState(null);

     const [bookingsAccommodationsDesktopJSX, setBookingAccommodationsDesktopJSX] = useState([]);
    const [bookingsAccommodationsMobileJSX, setBookingAccommodationsMobileJSX] = useState([]);
   
    const [bookingsTransfersDesktopJSX, setBookingTransfersDesktopJSX] = useState([]);
    const [bookingsTransfersMobileJSX, setBookingTransfersMobileJSX] = useState([]);

    const [bookingsFlightsDesktopJSX, setBookingFlightsDesktopJSX] = useState([]);

    const [bookingsFlightsMobileJSX, setBookingFlightsMobileJSX] = useState([]);

    const [bookingsAcivityDesktopJSX, setBookingActivityDesktopJSX] = useState([]);
    const [bookingsActivityMobileJSX, setBookingActivityMobileJSX] = useState([]);

    
    const [summaryContainerJSX, setSummaryContainerJSX] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState({
      id: null,
      name: null
    })

    const _changeBookingHandler = (name, itinerary_id, tailored_id,  accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown) => {
      ga.event({action: 'Itinerary-bookings-acc_change', params: {name : name}})

      setSelectedBooking({
        ...selectedBooking,
        name: name,
        itinerary_id: itinerary_id,
        accommodation: accommodation,
        id: id,
        tailored_id: tailored_id,
        check_in: check_in,
        check_out: check_out,
        pax: pax,
        city: city,
        room_type: room_type,
        number_of_rooms: number_of_rooms, 
        itinerary_name: itinerary_name,
        cost: Math.round(cost/100),
        costings_breakdown: costings_breakdown
      })
      props.setShowBookingModal();
    }
    const _changeFlightHandler = (name, itinerary_id, tailored_id,   id, check_in, check_out, pax, city,  itinerary_name, cost, costings_breakdown) => {
      ga.event({action: 'Itinerary-bookings-flight_change', params: {name : name}})

      setSelectedBooking({
        ...selectedBooking,
        name: name,
        itinerary_id: itinerary_id,
        id: id,
        tailored_id: tailored_id,
        check_in: check_in,
        check_out: check_out,
        pax: pax,
        city: city,
        itinerary_name: itinerary_name,
        cost: Math.round(cost/100),
        costings_breakdown: costings_breakdown
      })
      props.setShowFlightModal();
    }

    useEffect(()=> {
      if(isPageWide) setShowpayment(true);

  

  },[])
   
  
   

  
    const _showPaymentHandler = () => {
        setShowpayment(true);
    }
    const _hidePaymentHandler = () => {
        setShowpayment(false);
    }
 
    let bookingcities = {};
    // let bookingsDesktop = [];
    // let bookingsFlickity  = [];

    let bookings_accommodations = [];
     let bookings_transfers=[];
    let bookings_activities=[];
    let bookings_flights=[];
    let alternatesarr = [];



   useEffect(() => {

    if(props.stayBookings)
    for(var i=0 ; i < props.stayBookings.length ; i++){
 
        if(props.stayBookings[i].alternate_to){
          if(!alternatesarr[props.stayBookings[i].alternate_to])
          alternatesarr[props.stayBookings[i].alternate_to] = [];
        }
        if(!bookingcities[props.stayBookings[i].city]){
            bookingcities[props.stayBookings[i].city] = [];
            alternatesarr[props.stayBookings[i].city]=[];
        }
       
        let oldbooking = false;
        if(props.stayBookings[i].version === 'v1') oldbooking= true;
        if(props.traveleritinerary) oldbooking=true;
        let name = props.stayBookings[i]["name"];
        let costings_breakdown=props.stayBookings[i]["costings_breakdown"];
        let cost=props.stayBookings[i]["booking_cost"];
        let itinerary_id = props.stayBookings[i]["itinerary_id"];
        let itinerary_name=props.stayBookings[i]["itinerary_name"];
        let booking_type=props.stayBookings[i]["booking_type"];

        let accommodation = props.stayBookings[i]["accommodation"];
        let tailored_id = props.stayBookings[i]["tailored_itinerary"]
        let id=props.stayBookings[i]["id"];
        let check_in=props.stayBookings[i]["check_in"];
        let check_out=props.stayBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.stayBookings[i]["number_of_adults"],
          number_of_children: props.stayBookings[i]["number_of_children"],
          number_of_infants: props.stayBookings[i]["number_of_infants"],
        }
        let city=props.stayBookings[i]["city"];
        let room_type = props.stayBookings[i]["room_type"];
        if(oldbooking){
          

           bookings_accommodations.push(
              <OldBookingCard payment={props.payment} city={props.stayBookings[i].city} type={props.stayBookings[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {props.setImagesHandler} accommodation heading={props.stayBookings[i]["name"]} setImagesHandler = {_setImagesHandler} rating={props.stayBookings[i]["user_rating"]} details={ props.stayBookings[i]["points"]}   rating={props.stayBookings[i]["weighted_rating"]} images={ props.stayBookings[i]["images"]} price={props.stayBookings[i]["booking_cost"]}    number_of_rooms={props.stayBookings[i]["number_of_rooms"]} check_in={props.stayBookings[i]["check_in"]} check_out={props.stayBookings[i]["check_out"]} room_type={props.stayBookings[i]["room_type"]} ></OldBookingCard>
          )
          }
          else{
 
          if(props.stayBookings[i].booking_type === "Accommodation"){
 
             let number_of_rooms;
            if(props.stayBookings[i].costings_breakdown.length)
            number_of_rooms = props.stayBookings[i].costings_breakdown[0]["number_of_rooms"];
             if(!props.stayBookings[i].user_selected && !props.stayBookings[i].alternate_to){
              null;
              //set as selectable booking
            }
            else if(!props.stayBookings[i].user_selected && props.stayBookings[i].alternate_to){
              //add in alternate list
              alternatesarr[props.stayBookings[i].alternate_to].push(props.stayBookings[i]);
            }
            else if(props.stayBookings[i].user_selected)
            bookings_accommodations.push(
            <StayBookingCard images={props.stayBookings[i]["images"]} is_stock={props.is_stock} is_selected={true}   is_auth={props.is_auth}  are_prices_hidden={props.payment ? props.payment.are_prices_hidden : false} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}  setImagesHandler = {_setImagesHandler} data={props.stayBookings[i]} ></StayBookingCard>
         )}
     
      }
    }
    setAlternates(alternatesarr);
    
    setBookingAccommodationsDesktopJSX(<DesktopCardContainer>{bookings_accommodations}</DesktopCardContainer>);
    setBookingAccommodationsMobileJSX(<Flickity cards={bookings_accommodations}></Flickity>);
    
  }, [props.stayBookings]);

      useEffect(() => {

    if(props.transferBookings)
    for(var i=0 ; i < props.transferBookings.length ; i++){
       
        let oldbooking = false;
        if(props.transferBookings[i].version === 'v1') oldbooking= true;
        if(props.traveleritinerary) oldbooking=true;
        let name = props.transferBookings[i]["name"];
        let costings_breakdown=props.transferBookings[i]["costings_breakdown"];
        let cost=props.transferBookings[i]["booking_cost"];
        let itinerary_id = props.transferBookings[i]["itinerary_id"];
        let itinerary_name=props.transferBookings[i]["itinerary_name"];
        let booking_type=props.transferBookings[i]["booking_type"];

        // let accommodation = props.transferBookings[i]["accommodation"];
        let tailored_id = props.transferBookings[i]["tailored_itinerary"]
        let id=props.transferBookings[i]["id"];
        let check_in=props.transferBookings[i]["check_in"];
        let check_out=props.transferBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.transferBookings[i]["number_of_adults"],
          number_of_children: props.transferBookings[i]["number_of_children"],
          number_of_infants: props.transferBookings[i]["number_of_infants"],
        }
        let city=props.transferBookings[i]["city"];
        let room_type = props.transferBookings[i]["room_type"];
        let taxi_type=props.transferBookings[i]["taxi_type"];
        let transfer_type=props.transferBookings[i]["transfer_type"];
        let city_id=props.transferBookings[i]["city_id"]; 
        let destination_city_id=props.transferBookings[i]["destination_city_id"];  
        let duration=props.transferBookings[i]["duration"];  

        if(oldbooking){
          

          
           bookings_transfers.push(
              <OldBookingCard payment={props.payment} key ={i}  setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler =  {props.setImagesHandler} accommodation heading={ props.transferBookings[i]["name"]} details={ props.transferBookings[i]["points"]}  rating={props.transferBookings[i]["user_rating"]} setImagesHandler = {_setImagesHandler} images={ props.transferBookings[i]["images"]}></OldBookingCard>
          ) 
        }
         else{
 
     
          if(props.transferBookings[i].booking_type==='Flight'){
          bookings_flights.push(
            <FlightCard is_stock={props.is_stock} bookings={props.transferBookings} setShowFlightModal={(props) => _changeFlightHandler(name, itinerary_id, tailored_id,  id, check_in, check_out, pax, city, itinerary_name, cost, costings_breakdown)} showFlightModal={props.showFlightModal} is_auth={props.is_auth} are_prices_hidden={props.payment ? props.payment.are_prices_hidden : false} is_selected={props.transferBookings[i].user_selected} data={props.transferBookings[i]} city={props.transferBookings[i].city}  is_auth={props.is_auth} tag={props.transferBookings[i].tag} are_prices_hidden={props.payment ? props.payment.are_prices_hidden : false} rooms={props.transferBookings[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.transferBookings[i].city} type={props.transferBookings[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {_setImagesHandler} accommodation heading={props.transferBookings[i]["name"]} rating={props.transferBookings[i]["user_rating"]} details={ props.transferBookings[i]["points"]} price={props.transferBookings[i]["booking_cost"]}  price_type={props.transferBookings[i].costings_breakdown.length ? props.transferBookings[i].costings_breakdown[0]["pricing_type"] : null}  number_of_rooms={props.transferBookings[i]["number_of_rooms"]} check_in={props.transferBookings[i]["check_in"]} check_out={props.transferBookings[i]["check_out"]} room_type={props.transferBookings[i]["room_type"]} images={props.transferBookings[i]["images"]} ></FlightCard>
         )
        }
        else bookings_transfers.push(
            <BookingCard  check_in={check_in} taxi_type={taxi_type} transfer_type={transfer_type} city_id={city_id} destination_city_id={destination_city_id} duration={duration} cardUpdateLoading={props.cardUpdateLoading}  is_selected={props.transferBookings[i].user_selected} is_stock={props.is_stock} tailored_id={tailored_id} booking_id={id} booking_name={name} booking_type={booking_type} itinerary_id={itinerary_id} itinerary_name={itinerary_name} _selectTaxiHandler={props._selectTaxiHandler} is_selected={props.transferBookings[i].user_selected} price={props.transferBookings[i]["booking_cost"]}  is_auth={props.is_auth} are_prices_hidden={props.payment ? props.payment.are_prices_hidden : false} is_stock={props.is_stock} payment={props.payment} key ={i}   blur={props.blur} setImagesHandler =  {_setImagesHandler} accommodation heading={ props.transferBookings[i]["name"]} details={ props.transferBookings[i]["points"]}  rating={props.transferBookings[i]["user_rating"]} images={ props.transferBookings[i]["images"]}></BookingCard>
        )
      }
    }
    // setAlternates(alternatesarr);
    setBookingTransfersDesktopJSX([...bookings_flights, ...bookings_transfers]);
    setBookingTransfersMobileJSX(<Flickity cards={[...bookings_flights, ...bookings_transfers]}></Flickity>);


   }, [props.transferBookings, props.cardUpdateLoading]);
   

      useEffect(() => {

    if(props.activityBookings)
    for(var i=0 ; i < props.activityBookings.length ; i++){
        if(props.activityBookings[i].alternate_to){
          if(!alternatesarr[props.activityBookings[i].alternate_to])
          alternatesarr[props.activityBookings[i].alternate_to] = [];
        }
        if(!bookingcities[props.activityBookings[i].city]){
            bookingcities[props.activityBookings[i].city] = [];
            alternatesarr[props.activityBookings[i].city]=[];
        }
       
        let oldbooking = false;
        if(props.activityBookings[i].version === 'v1') oldbooking= true;
        if(props.traveleritinerary) oldbooking=true;
        let name = props.activityBookings[i]["name"];
        let costings_breakdown=props.activityBookings[i]["costings_breakdown"];
        let cost=props.activityBookings[i]["booking_cost"];
        let itinerary_id = props.activityBookings[i]["itinerary_id"];
        let itinerary_name=props.activityBookings[i]["itinerary_name"];
        let booking_type=props.activityBookings[i]["booking_type"];

        let accommodation = props.activityBookings[i]["accommodation"];
        let tailored_id = props.activityBookings[i]["tailored_itinerary"]
        let id=props.activityBookings[i]["id"];
        let check_in=props.activityBookings[i]["check_in"];
        let check_out=props.activityBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.activityBookings[i]["number_of_adults"],
          number_of_children: props.activityBookings[i]["number_of_children"],
          number_of_infants: props.activityBookings[i]["number_of_infants"],
        }
        let city=props.activityBookings[i]["city"];
        let room_type = props.activityBookings[i]["room_type"];
        
        if(oldbooking){
          

          
          bookings_activities.push(
              <OldBookingCard payment={props.payment} key ={i}  setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler =  {props.setImagesHandler} accommodation heading={ props.activityBookings[i]["name"]} details={ props.activityBookings[i]["points"]}  rating={props.activityBookings[i]["user_rating"]} setImagesHandler = {_setImagesHandler} images={ props.activityBookings[i]["images"]}></OldBookingCard>
          )
        }
         else{
 
      
        bookings_activities.push(
            <BookingCard check_in={check_in}  is_stock={props.is_stock}  tailored_id={tailored_id} booking_id={id} booking_name={name} booking_type={booking_type} itinerary_id={itinerary_id} itinerary_name={itinerary_name} _selectTaxiHandler={props._selectTaxiHandler} is_selected={props.activityBookings[i].user_selected} price={props.activityBookings[i]["booking_cost"]}  is_auth={props.is_auth} are_prices_hidden={props.payment ? props.payment.are_prices_hidden : false}_stock={props.is_stock} payment={props.payment} key ={i}   blur={props.blur} setImagesHandler =  {_setImagesHandler} accommodation heading={ props.activityBookings[i]["name"]} details={ props.activityBookings[i]["points"]}  rating={props.activityBookings[i]["user_rating"]} images={ props.activityBookings[i]["images"]}></BookingCard>
        )
      }
    }
    setAlternates(alternatesarr);
    
   
    setBookingActivityDesktopJSX(<DesktopCardContainer>{bookings_activities}</DesktopCardContainer>);
    setBookingActivityMobileJSX(<Flickity cards={bookings_activities}></Flickity>);


   }, [props.activityBookings]);

  useEffect(() => {
      if(props.payment){

       setSummaryContainerJSX(<SummaryContainer payment={props.payment}  activityBookings={props.activityBookings} stayBookings={props.stayBookings} transferBookings={props.transferBookings} traveleritinerary={props.traveleritinerary} blur={props.blur}  hide={_hidePaymentHandler}  experienceId={props.experienceId}></SummaryContainer>);
      //   // setSummaryContainerJSX(S)
      }
  }, [props.payment, props.traveleritinerary, props.stayBookings, props.transferBookings]);
  
   
    let message ="Hey TTW! I need some help with my tailored experience - https://thetarzanway.com/"+router.asPath;
    const _setImagesHandler = (images) => {
      // window.scrollTo(0,0);
      setImages(images);
    }
 
    if(true){
    if(!images){
    if(isPageWide){
    return(
      <div>
        {props.showTimer && !props.hideTimer? <Timer hideTimer={props.hideTimer} _handleTimerClose={props._handleTimerClose} booking openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> : null}
        <Container>
            <BookingsContainer style={{marginTop :   '0' }}>
              <MessageContainer className='border-thin font-opensans'>
              Here are a few recommendations for booking your travel experience that you can completely edit on your own. Our experience captain will get in touch with you to help you out. 🙂
              </MessageContainer>
              <Tabs
        value={value}
        onChange={handleChange}
        variant={!isPageWide ? 'scrollable': "fullWidth"}
        scrollButtons={!isPageWide ? true : false}
        allowScrollButtonsMobile
        indicatorColor="#f7e700"
        id="poimodal-tabs"
      >
       <Tab  label="Stays" className="bookingdetail-tab font-opensans"></Tab>
       <Tab label="Transfers"  className="bookingdetail-tab font-opensans" id="bookingdetail-tab-flights"></Tab>
       <Tab label="Activities"  className="bookingdetail-tab font-opensans"></Tab>
      </Tabs>
      <TabPanel value={value} index={0} >
            {bookingsAccommodationsDesktopJSX }
       </TabPanel>
       <TabPanel value={value} index={1} >
          {!props.transferLoading ? <DesktopCardContainer>
            {bookingsFlightsDesktopJSX}
            {bookingsTransfersDesktopJSX}

            </DesktopCardContainer>    :  <div style={{height: '50vh'}} className="center-div"><Spinner></Spinner></div>}        
       </TabPanel>
       <TabPanel value={value} index={2} >
           {bookingsAcivityDesktopJSX}
       </TabPanel>
            </BookingsContainer>
          {summaryContainerJSX}
          {props.showBookingModal ?  <BookingModal  getPaymentHandler={props.getPaymentHandler} _updateStayBookingHandler={props._updateStayBookingHandler} alternates={alternates[selectedBooking.id]} tailored_id={props.stayBookings ? props.stayBookings[0]["tailored_itinerary"] : null} _updatePaymentHandler={props._updatePaymentHandler}   _updateBookingHandler={props._updateBookingHandler} selectedBooking={selectedBooking} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null}
          {props.traveleritinerary ? <DesktopBanner onclick={_handleTailoredRedirect} text="Want to personalize your own experience like this?"></DesktopBanner> : null}
          {props.showFlightModal ? <FlightModal getPaymentHandler={props.getPaymentHandler} _updateFlightBookingHandler={props._updateFlightBookingHandler } _updateBookingHandler={props._updateBookingHandler} itinerary_id={props.stayBookings.length ?  props.stayBookings[0]["itinerary_id"] : null} setHideFlightModal={props.setHideFlightModal}  alternates={alternates[selectedBooking.id]} tailored_id={props.stayBookings[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler}   _updateFlightHandler={props._updateFlightHandler} selectedBooking={selectedBooking} setShowFlightModal={props.setShowFlightModal} showFlightModal={props.showFlightModal} ></FlightModal> : null}

        </Container>
        {/* <Accommodation token={props.token} show={true} id="a7c63401-3cc4-4542-9e3a-505f73e98614"></Accommodation> */}
    </div>
  ); 
    }
  else return(
      <Container  style={{marginTop :  '0' }}>
            {props.showTimer && !props.hideTimer? <Timer hideTimer={props.hideTimer} _handleTimerClose={props._handleTimerClose} booking hours={props.hours} minutes={props.minutes} seconds={props.seconds}  startingTimer={props.startingTimer} itineraryDate={props.itineraryDate} openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> : <div></div>}
            {!showpayment ? <BookingsContainer style={{marginTop : props.showTimer ? '-50vh' : '0' }}>
            <MobileWidthContainer><MessageContainer className='border-thin font-opensans'>
              Here are a few recommendations for booking your travel experience that you can completely edit on your own. Our experience captain will get in touch with you to help you out. 🙂
              </MessageContainer></MobileWidthContainer>
             {/* {bookingMobileJSX} */}
             <Tabs
        value={value}
        onChange={handleChange}
        variant={!isPageWide ? 'scrollable': "fullWidth"}
        scrollButtons={false}
        allowScrollButtonsMobile
        indicatorColor="#f7e700"
        id="poimodal-tabs"
      >
       <Tab  label="Stays" className="bookingdetail-tab font-opensans"></Tab>
       <Tab label="Transfers"  className="bookingdetail-tab font-opensans" id="bookingdetail-tab-flights"></Tab>
       <Tab label="Activities"  className="bookingdetail-tab font-opensans"></Tab>
      </Tabs>
      <TabPanel value={value} index={0} >
            {bookingsAccommodationsMobileJSX}
       </TabPanel>
       <TabPanel value={value} index={1} >
            {bookingsFlightsMobileJSX}
            {bookingsTransfersMobileJSX}
       </TabPanel>
       <TabPanel value={value} index={2} >
            {bookingsActivityMobileJSX}
       </TabPanel>
             <MobileWidthContainer><Button width="100%" bgColor={props.traveleritinerary ? 'white' : "#F7e700"} borderRadius="5px" borderWidth={props.traveleritinerary ? '1px': "0px"} margin="0.5rem 0 0.5rem 0"  borderColor="#e4e4e4" onclick={_showPaymentHandler} ><p style={{margin: '0'}} className={props.blur ? "blurry-text" : ''}>{props.traveleritinerary ? 'View Details' : 'Buy Now'}</p></Button>
             <Button onclick={()=> window.location.href=urls.WHATSAPP+"?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"   margin="0 0 12.5vh 0" >
      <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
       Connect on WhatsApp</Button></MobileWidthContainer>
            </BookingsContainer> : summaryContainerJSX}
            {/* {showpayment &&props.payment.payment_info ?
             <SummaryContainer hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
             {props.showBookingModal ? <BookingModal getPaymentHandler={props.getPaymentHandler} alternates={alternates[selectedBooking.id]} tailored_id={props.stayBookings[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler} _updateStayBookingHandler={props._updateStayBookingHandler} _updateBookingHandler={props._updateBookingHandler} selectedBooking={selectedBooking} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null}
            {props.traveleritinerary ? <div className='hidden-desktop'><Banner text="Want to craft your own travel experience like this?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div>: null}
            {props.showFlightModal ? <FlightModal _updateBookingHandler={props._updateBookingHandler} itinerary_id={ props.stayBookings[0]["itinerary_id"] }  setHideFlightModal={props.setHideFlightModal}  alternates={alternates[selectedBooking.id]} tailored_id={props.stayBookings[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler}   _updateFlightHandler={props._updateFlightHandler} selectedBooking={selectedBooking} setShowFlightModal={props.setShowFlightModal} showFlightModal={props.showFlightModal} ></FlightModal> : null}

            {/* <Accommodation token={props.token} show={true} id="a7c63401-3cc4-4542-9e3a-505f73e98614"></Accommodation> */}
        </Container>
  );
        }
    else return <FullScreenGallery closeGalleryHandler={() => setImages(null)} images={images} ></FullScreenGallery>;
    }
    else return (
      <div>
       <ComingSoon></ComingSoon></div>
        );
}

export default React.memo((Booking));
