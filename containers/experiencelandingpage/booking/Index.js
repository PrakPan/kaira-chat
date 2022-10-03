import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OldBookingCard from '../../../components/cards/Booking';
import BookingCard from '../../../components/cards/editablebookings/Index';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import Button from '../../../components/Button';
import Flickity from '../../../components/FlickityCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
import Enquiry from './newenquiry/Index';
import media from '../../../components/media'
import  { useRouter } from 'next/router';
import urls from '../../../services/urls';
const Container = styled.div`
width: 90%;
margin: auto;

@media screen and (min-width: 768px){
    width: 80%;
    display: grid;
    grid-template-columns: 2fr 1.25fr;
    grid-gap: 1rem;
    margin-top: 0;
    min-height: 100vh;
    height: max-content;
}
@media (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 1fr;
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
    grid-gap: 2rem;
    background-color: hsl(0,0%, 97%);
    padding: 0.5rem;
}
@media (min-width: 768px) and (max-width: 1024px) {

}
`;

const BookingsContainer = styled.div`

border-radius: 10px;

@media screen and (min-width: 768px){
padding: 1rem;

}
`;
const Booking = (props) => {
    let isPageWide = media('(min-width: 768px)')
    const router = useRouter();
    const [showpayment, setShowpayment] = useState(false);
    const [showEnquiry, setShowEnquiry] = useState({
        desktop: true,
        mobile: false,
    });
    const [showBookingMobile, setShowBookingMobile] = useState(true)
    
  
    useEffect(()=> {
    

  },[])

    
    const _hidePaymentHandler = () => {
        setShowpayment(false);
    }

    const _showMobileEnquiryHandler = () => {
        setShowEnquiry({...showEnquiry, mobile: true});
        setShowBookingMobile(false);
    }
   const _showBookingMobileHandler = () => {
    setShowEnquiry({...showEnquiry, mobile: false});
    setShowBookingMobile(true);
    }
    const bookings = [];
    const _handleGalleryOpen = (images) => {
        props.setGalleryOpen();
        props.setGalleryImages(images);
    }
    const setImagesHandler = (images) => {
        window.scrollTo(0,0);
        _handleGalleryOpen(images);
    }

    if(props.bookings){

    for(var i=0 ; i < props.bookings.length ; i++){
        if(props.bookings[i].version==='v1'){
            if(props.bookings[i].booking_type === 'Accommodation')
            bookings.push(
                <OldBookingCard experience  setImagesHandler={(images) => setImagesHandler(images)} accommodation heading={props.bookings[i]["duration"]+"N at "+props.bookings[i]["name"]} details={props.bookings[i]["points"]} detailsheading="Other Details" rating="4.9" images={props.bookings[i]["images"]}></OldBookingCard>
            )
            else 
             bookings.push(
                <OldBookingCard  experience setImagesHandler={(images) => setImagesHandler(images)} heading={props.bookings[i]["name"]} details={props.bookings[i]["points"]} detailsheading="Other Details" rating="4.9" images={props.bookings[i]["images"]}></OldBookingCard>
            )   
        }
        else{

            if(props.bookings[i].booking_type === "Accommodation"){
               
              if(props.bookings[i].costings_breakdown.length)
           bookings.push(
                <BookingCard  experience rooms={props.bookings[i].costings_breakdown} is_stock={true} payment={{}} city={props.bookings[i].city} type={props.bookings[i].booking_type} key ={i} setShowBookingModal={null} showBookingModal={null} setHideBookingModal={null} blur={props.blur} setImagesHandler={(images) => setImagesHandler(images)} accommodation heading={props.bookings[i]["name"]} rating={props.bookings[i]["weighted_rating"]} details={ props.bookings[i]["points"]}   rating={props.bookings[i]["user_rating"]} images={ props.bookings[i]["images"]} price={props.bookings[i]["booking_cost"]}  price_type={props.bookings[i].costings_breakdown.length ? props.bookings[i].costings_breakdown[0]["pricing_type"] : null}  number_of_rooms={props.bookings[i]["number_of_rooms"]} check_in={props.bookings[i]["check_in"]} check_out={props.bookings[i]["check_out"]} room_type={props.bookings[i]["room_type"]} ></BookingCard>
              // <BookingCard rooms={props.booking[i].costings_breakdown} is_stock={props.is_stock} payment={props.payment} city={props.booking[i].city} type={props.booking[i].booking_type} key ={i} setShowBookingModal={(props) => _changeBookingHandler(name, itinerary_id, tailored_id, accommodation, id, check_in, check_out, pax, city, room_type, number_of_rooms)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} blur={props.blur} setImagesHandler = {props.setImagesHandler} accommodation heading={props.booking[i]["name"]} rating={props.booking[i]["weighted_rating"]} details={ props.booking[i]["points"]}   rating={props.booking[i]["user_rating"]} images={ props.booking[i]["images"]} price={props.booking[i]["booking_cost"]}  price_type={props.booking[i]["pricing_type"]}  number_of_rooms={props.booking[i]["number_of_rooms"]} check_in={props.booking[i]["check_in"]} check_out={props.booking[i]["check_out"]} room_type={props.booking[i]["room_type"]} ></BookingCard>
          )}
          else bookings.push(
              <BookingCard  experience is_stock={true} payment={{}} key ={i}   blur={props.blur} setImagesHandler={(images) => setImagesHandler(images)} accommodation heading={ props.bookings[i]["name"]} details={ props.bookings[i]["points"]}  rating={props.bookings[i]["weighted_rating"]} images={ props.bookings[i]["images"]}></BookingCard>
          )
         }
    }
    let message ="Hey TTW! I was going through your travel experience %27"+props.experience+"%27 and would like to ask a few questions regarding the same, could you help?";

    if(isPageWide)
    return(
        <Container>
            <BookingsContainer>
              <Heading bold margin="0 0 1rem 0">What you get</Heading> 

            <CardsContainer>
                {bookings}
            </CardsContainer>
            {/* {window.innerWidth < 768 ? bookings[0] : null} */}
            </BookingsContainer>
            {/* { props.payment.payment_info ? <SummaryContainer payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
         <Enquiry experience={props.experience} bookings></Enquiry>
        </Container>
  ); 
  else return(
      <Container>
            {showBookingMobile? <BookingsContainer>
            <Heading align="center" bold margin="0 0 1rem 0">What you get</Heading>
             <Flickity cards={bookings}></Flickity>
             <Button hoverBgColor="black" bgColor='#f7e700' width="100%" bgColor="#F7e700" borderRadius="5px" borderWidth="0px" margin="0.5rem 0 0.5rem 0" onclick={_showMobileEnquiryHandler} >Enquire Now</Button>
             <Button onclick={()=> router.push(urls.TAILORED_TRAVEL)} width="100%" bgColor="white" hoverBgColor="black"  borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"  margin="0.5rem 0 0.5rem 0" >
          {/* <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/> */}
          Craft Experience</Button>
            </BookingsContainer> : null}
            {/* {showpayment &&props.payment.payment_info ?
             <SummaryContainer hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
          {showEnquiry.mobile ?  <Enquiry  bookings experience={props.experience} _showBookingMobileHandler={_showBookingMobileHandler}></Enquiry>  : null}
        </Container>
  );
    }
    else return(
        <div style={{minHeight: '100vh'}}><Enquiry experience={props.experience}></Enquiry></div> 
    )
}

export default React.memo((Booking));
