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
import BookingModal from '../../../components/modals/bookingupdated/Index';
// import FlightModal from '../../../components/modals/flights/Index';
import OldBookingCard from '../../../components/cards/Booking';
import { useRouter } from 'next/router'
import media from '../../../components/media';
import DesktopBanner from '../../../components/containers/Banner';
import Banner from '../../homepage/banner/Mobile';
// import Accommodation from '../../../components/modals/accommodation/Index';
import FlightCard from '../../../components/cards/editableflights/Index';

const Container = styled.div`
width: 90%;
margin: auto;

@media screen and (min-width: 768px){
    width: 90%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    margin-top: 10vh;
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

}gTMx9Ym2gqaUUfrejQyh

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
const Booking = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel')
  }
  
  
  let isPageWide = media('(min-width: 768px)')
    const [alternates, setAlternates] = useState(null);
    const [showpayment, setShowpayment] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [images, setImages] = useState(null);
    const [bookingCitiesJSX, setBookingCitiesJSX] = useState([]);
    const [bookingDesktopJSX, setBookingDesktopJSX] = useState([]);
    const [bookingMobileJSX, setBookingMobileJSX] = useState([]) ;
    const [summaryContainerJSX, setSummaryContainerJSX] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState({
      id: null,
      name: null
    })
    const _changeBookingHandler = (name, itinerary_id, tailored_id,  accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown) => {
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
  
    let bookingstest = [
        {
          "id": "3f26088f-1bcd-4a2d-9f44-7c1f5d5af407",
          "booking_type": "Accommodation",
          "itinerary_type": "Tailored",
          "name": "Village home stays",
          "images": [
            {
              "id": "de9de393-9b26-43b9-87c5-2ca893ce6466",
              "image": "crm/boxed-water-is-better-X5UrOwSCYYI-unsplash.jpg",
              "type": "Booking"
            }
          ],
          "room_type": "Home stays",
          "stay_duration": 3,
          "amenities": [
            "Conference Room",
            "Swimming Pool",
            "Daily House Keeping"
          ],
          "points": [
            "Point one",
            "Point two",
            "Point three"
          ],
          "itinerary_id": "VWRn9XgBV8tVljYfKpCr",
          "itinerary_name": "Andaman Special",
          "itinerary_db_id": null,
          "tailored_itinerary": "ba14a7a1-4d16-429e-a98a-0be5a36ffe75"
        }
      ];
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
    let bookingsDesktop = [];
    let bookingsFlickity  = [];

    let alternatesarr = [];


    useEffect(() => {

    if(props.booking)
    for(var i=0 ; i < props.booking.length ; i++){
        if(props.booking[i].alternate_to){
          if(!alternatesarr[props.booking[i].alternate_to])
          alternatesarr[props.booking[i].alternate_to] = [];
        }
        if(!bookingcities[props.booking[i].city]){
            bookingcities[props.booking[i].city] = [];
            alternatesarr[props.booking[i].city]=[];
        }
        let modified_at=new Date(props.booking[i]["modified_at"]);
        //Date on which agoda changes made to box
        let date = new Date('2022-02-02');
         let oldbooking = false;
        if(props.booking[i].version === 'v1') oldbooking= true;
        if(props.traveleritinerary) oldbooking=true;
        let name = props.booking[i]["name"];
        let costings_breakdown=props.booking[i]["costings_breakdown"];
        let cost=props.booking[i]["booking_cost"];
        let itinerary_id = props.booking[i]["itinerary_id"];
        let itinerary_name=props.booking[i]["itinerary_name"];
        let booking_type=props.booking[i]["booking_type"];
        let accommodation = props.booking[i]["accommodation"];
        let tailored_id = props.booking[i]["tailored_itinerary"]
        let id=props.booking[i]["id"];
        let check_in=props.booking[i]["check_in"];
        let check_out=props.booking[i]["check_out"];
        let pax = {
          number_of_adults: props.booking[i]["number_of_adults"],
          number_of_children: props.booking[i]["number_of_children"],
          number_of_infants: props.booking[i]["number_of_infants"],
        }
        let city=props.booking[i]["city"];
        let room_type = props.booking[i]["room_type"];
        if(oldbooking){
          

            if(props.booking[i].booking_type === "Accommodation")
          bookingcities[props.booking[i].city].push(
              <OldBookingCard payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {props.setImagesHandler} accommodation heading={props.booking[i]["name"]} setImagesHandler = {_setImagesHandler} rating={props.booking[i]["user_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["weighted_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}    number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></OldBookingCard>
          )
          else bookingcities[props.booking[i].city].push(
              <OldBookingCard payment={props.payment} key ={i}  setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler =  {props.setImagesHandler} accommodation heading={ props.booking[i]["name"]} details={ props.booking[i]["points"]}  rating={props.booking[i]["user_rating"]} setImagesHandler = {_setImagesHandler} images={ props.booking[i]["images"]}></OldBookingCard>
          )
        }
        // bookingcities[props.booking[i].city].push(props.booking[i])
        else{
 
          if(props.booking[i].booking_type === "Accommodation"){
             let number_of_rooms;
            if(props.booking[i].costings_breakdown.length)
            number_of_rooms = props.booking[i].costings_breakdown[0]["number_of_rooms"];
             if(!props.booking[i].user_selected && !props.booking[i].alternate_to){
              null;
              //set as selectable booking
            }
            else if(!props.booking[i].user_selected && props.booking[i].alternate_to){
              //add in alternate list
              alternatesarr[props.booking[i].alternate_to].push(props.booking[i]);
            }
            else if(props.booking[i].user_selected)
            bookingcities[props.booking[i].city].push(
            <BookingCard star_category={props.booking[i].star_category} duration={props.booking[i].duration} city={props.booking[i].city}  is_auth={props.is_auth} tag={props.booking[i].tag} are_prices_hidden={props.payment.are_prices_hidden} rooms={props.booking[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {_setImagesHandler} accommodation heading={props.booking[i]["name"]} rating={props.booking[i]["user_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}  price_type={props.booking[i].costings_breakdown.length ? props.booking[i].costings_breakdown[0]["pricing_type"] : null}  number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></BookingCard>
            // <BookingCard rooms={props.booking[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {props.setImagesHandler} accommodation heading={props.booking[i]["name"]} rating={props.booking[i]["weighted_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}  price_type={props.booking[i]["pricing_type"]}  number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></BookingCard>
        )}
        else if(props.booking[i].booking_type==='Flight'){
          bookingcities[props.booking[i].city].push(
            <FlightCard data={props.booking[i]} city={props.booking[i].city}  is_auth={props.is_auth} tag={props.booking[i].tag} are_prices_hidden={props.payment.are_prices_hidden} rooms={props.booking[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms, itinerary_name, cost, costings_breakdown)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {_setImagesHandler} accommodation heading={props.booking[i]["name"]} rating={props.booking[i]["user_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}  price_type={props.booking[i].costings_breakdown.length ? props.booking[i].costings_breakdown[0]["pricing_type"] : null}  number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></FlightCard>
            // <BookingCard rooms={props.booking[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {props.setImagesHandler} accommodation heading={props.booking[i]["name"]} rating={props.booking[i]["weighted_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}  price_type={props.booking[i]["pricing_type"]}  number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></BookingCard>
        )
        }
        else bookingcities[props.booking[i].city].push(
            <BookingCard booking_id={id} booking_name={name} booking_type={type} itinerary_id={itinerary_id} itinerary_name={itinerary_name} _selectTaxiHandler={props._selectTaxiHandler} price={props.booking[i]["booking_cost"]}  is_auth={props.is_auth} are_prices_hidden={props.payment.are_prices_hidden} is_stock={props.is_stock} payment={props.payment} key ={i}   blur={props.blur} setImagesHandler =  {_setImagesHandler} accommodation heading={ props.booking[i]["name"]} details={ props.booking[i]["points"]}  rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]}></BookingCard>
        )
      }
    }
    setAlternates(alternatesarr);
    setBookingCitiesJSX(bookingcities);
    for (var key in bookingcities) {
      if(bookingcities[key].length){
        bookingsDesktop.push(<Heading blur={props.blur} bold margin="0 0 1rem 0">{key}</Heading>);
        bookingsFlickity.push(<Heading blur={props.blur} bold margin="0 0 1rem 0">{key}</Heading>);
        bookingsFlickity.push(
            <Flickity cards={bookingcities[key]}></Flickity>
        )
        bookingsDesktop.push(<CardsContainer>
            {bookingcities[key]}
        </CardsContainer>)
      }
    }
    setBookingDesktopJSX(bookingsDesktop);
    setBookingMobileJSX(bookingsFlickity);
   }, [props.booking]);
  let SummContainerJSX = null;

  useEffect(() => {
      if(props.payment){
       setSummaryContainerJSX(<SummaryContainer traveleritinerary={props.traveleritinerary} blur={props.blur} booking={props.booking} payment={props.payment} hide={_hidePaymentHandler}  experienceId={props.experienceId}></SummaryContainer>);
       }
  }, [props.payment, props.traveleritinerary]);
  
  
    let message ="Hey TTW! I need some help with my tailored experience - https://thetarzanway.com/"+router.asPath;
    const _setImagesHandler = (images) => {
       setImages(images);
    }
 
    if(props.booking){
    if(!images){
    if(isPageWide){
    return(
      <div>
        {props.showTimer && !props.hideTimer? <Timer hideTimer={props.hideTimer} _handleTimerClose={props._handleTimerClose} booking openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> : null}
        <Container>
            <BookingsContainer style={{marginTop :   '0' }}>
              <MessageContainer className='border-thin font-lexend'>
              Here are a few recommendations for booking your travel experience that you can completely edit on your own. Our experience captain will get in touch with you to help you out. 🙂
              </MessageContainer>
                {bookingDesktopJSX}
            <CardsContainer>
            </CardsContainer>
            </BookingsContainer>
          {summaryContainerJSX}
          {props.showBookingModal ? <BookingModal bookings={props.booking} alternates={alternates[selectedBooking.id]} tailored_id={props.booking[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler}   _updateBookingHandler={props._updateBookingHandler} selectedBooking={selectedBooking} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null}
          {props.traveleritinerary ? <DesktopBanner onclick={_handleTailoredRedirect} text="Want to personalize your own experience like this?"></DesktopBanner> : null}
          {/* {props.showFlightModal ? <FlightModal bookings={props.booking} alternates={alternates[selectedBooking.id]} tailored_id={props.booking[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler}   _updateFlightHandler={props._updateFlightHandler} selectedBooking={selectedBooking} setShowFlightModal={props.setShowFlightModal} showFlightModal={props.showFlightModal} setHideFlightModal={props.setHideFlightModal}></FlightModal> : null} */}

        </Container>
        {/* <Accommodation token={props.token} show={true} id="a7c63401-3cc4-4542-9e3a-505f73e98614"></Accommodation> */}
    </div>
  ); 
    }
  else return(
      <Container  style={{marginTop :  '0' }}>
            {props.showTimer && !props.hideTimer? <Timer hideTimer={props.hideTimer} _handleTimerClose={props._handleTimerClose} booking hours={props.hours} minutes={props.minutes} seconds={props.seconds}  startingTimer={props.startingTimer} itineraryDate={props.itineraryDate} openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> : <div></div>}
            {!showpayment ? <BookingsContainer style={{marginTop : props.showTimer ? '-50vh' : '0' }}>
            <MessageContainer className='border-thin font-lexend'>
              Here are a few recommendations for booking your travel experience that you can completely edit on your own. Our experience captain will get in touch with you to help you out. 🙂
              </MessageContainer>
             {bookingMobileJSX}
             <Button width="100%" bgColor={props.traveleritinerary ? 'white' : "#F7e700"} borderRadius="5px" borderWidth={props.traveleritinerary ? '1px': "0px"} margin="0.5rem 0 0.5rem 0"  borderColor="#e4e4e4" onclick={_showPaymentHandler} ><p style={{margin: '0'}} className={props.blur ? "blurry-text" : ''}>{props.traveleritinerary ? 'View Details' : 'Buy Now'}</p></Button>
             <Button onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"   margin="0 0 12.5vh 0" >
      <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
       Connect on WhatsApp</Button>
            </BookingsContainer> : summaryContainerJSX}
            {/* {showpayment &&props.payment.payment_info ?
             <SummaryContainer hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
             {props.showBookingModal ? <BookingModal bookings={props.booking} alternates={alternates[selectedBooking.id]} tailored_id={props.booking[0]["tailored_itinerary"]} _updatePaymentHandler={props._updatePaymentHandler}  _updateBookingHandler={props._updateBookingHandler} selectedBooking={selectedBooking} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null}
            {props.traveleritinerary ? <div className='hidden-desktop'><Banner text="Want to craft your own travel experience like this?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div>: null}
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
