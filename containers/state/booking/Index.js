import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BookingCard from '../../../components/cards/Booking';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import SummaryContainer from './Details'
import Flickity from '../../../components/FlickityCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
import Enquiry from './enquiry/Index';
import media from '../../../components/media'
const Container = styled.div`
width: 90%;
margin: auto;

@media screen and (min-width: 768px){
    width: 80%;
    display: grid;
    grid-template-columns: 2fr 1.25fr;
    grid-gap: 2rem;
    margin-top: 0;
    min-height: 100vh;
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

    const [redirect, setRedirect] = useState(false);
    const [showpayment, setShowpayment] = useState(false);
    const [showEnquiry, setShowEnquiry] = useState({
        desktop: true,
        mobile: false,
    });
    const [showBookingMobile, setShowBookingMobile] = useState(true)
    
    const [loaded, setLoaded] = useState(false);
 
    useEffect(()=> {
     

  },[])
    const bookingsdata=
        {
            "id": "db869892-0a76-455a-b3dd-003e0efd84e6",
            "booking_type": "Accommodation",
            "itinerary_type": "Experience",
            "name": "Camp",
            "images": [
                {
                    "id": "c0562494-9162-4c5a-b3c8-bf6d3ae4bcd0",
                    "image": "crm/ravi-sharma-9UFwwZNNjz8-unsplash.jpg",
                    "type": "Booking"
                }
            ],
            "room_type": "Tent",
            "stay_duration": 2,
            "amenities": [],
            "points": [
                "Stay in tents on double sharing.",
                "2 Breakfast and 2 Dinner",
                "Experienced Guide"
            ],
            "itinerary_id": "UdZZT3gBeVVjRPY0SYbK",
            "itinerary_name": "Tranquility at Triund",
            "itinerary_db_id": "zmXhmj7YkwZkHwDh"
        
        }
  
   


    const _showPaymentHandler = () => {
        setShowpayment(true);
    }
    
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
    let SummContainerJSX = null;
    if(props.payment){
        if(isPageWide)
        SummContainerJSX = <SummaryContainer experience={props.experience} setShowEnquiry={() => setShowEnquiry(true)} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> 
        else if(showpayment) SummContainerJSX =  <SummaryContainer setShowEnquiry={() => setShowEnquiry(true)} experience={props.experience}  hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer>;
    }
    if(props.bookings){

    for(var i=0 ; i < props.bookings.length ; i++){
        if(props.bookings[i].booking_type === 'Accommodation')
        bookings.push(
            <BookingCard   setImagesHandler={(images) => setImagesHandler(images)} accommodation heading={props.bookings[i]["stay_duration"]+"N at "+props.bookings[i]["name"]} details={props.bookings[i]["points"]} detailsheading="Other Details" rating="4.9" images={props.bookings[i]["images"]}></BookingCard>
        )
        else 
         bookings.push(
            <BookingCard   setImagesHandler={(images) => setImagesHandler(images)} heading={props.bookings[i]["name"]} details={props.bookings[i]["points"]} detailsheading="Other Details" rating="4.9" images={props.bookings[i]["images"]}></BookingCard>
        )
      
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
          {showEnquiry.desktop ? <Enquiry experience={props.experience} bookings></Enquiry> : SummContainerJSX}
        </Container>
  ); 
  else return(
      <Container>
            {showBookingMobile? <BookingsContainer>
            <Heading align="center" bold margin="0 0 1rem 0">What you get</Heading>
             <Flickity cards={bookings}></Flickity>
             <Button boxShadow hoverBgColor="black" bgColor='#f7e700' width="100%"  borderRadius="5px" borderWidth="0px" margin="0.5rem 0 0.5rem 0" onclick={_showMobileEnquiryHandler} >Enquire Now</Button>
             <Button boxShadow onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} width="100%" bgColor="white" hoverBgColor="black"  borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"  margin="0.5rem 0 0.5rem 0" >
          <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
          Connect on WhatsApp</Button>
            </BookingsContainer> : null}
            {/* {showpayment &&props.payment.payment_info ?
             <SummaryContainer hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
          {showEnquiry.mobile ?  <Enquiry  bookings experience={props.experience} _showBookingMobileHandler={_showBookingMobileHandler}></Enquiry>  : SummContainerJSX}
        </Container>
  );
    }
    else return(
        <div style={{minHeight: '100vh'}}><Enquiry experience={props.experience}></Enquiry></div> 
    )
}

export default React.memo((Booking));
