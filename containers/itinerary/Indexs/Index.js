import React, {useRef, useState, useEffect} from 'react';
import { useRouter } from 'next/router'

import styled from 'styled-components'
import FullImg from '../fullimg/FullImg';
import FullImgContainer from '../fullimg/FullImgContent';


import Menu from '../Menu';
import axios from 'axios';
import Spinner from '../../../containers/loaderbar/Index';
import OldSpinner from '../../../components/LoadingPage';
 import defaultbreif from '../defaultbrief';
import axiosdaybydayinstance from '../../../services/itinerary/daybyday/preview';
import axiosbreifinstance from '../../../services/itinerary/brief/preview';
import {MIS_SERVER_HOST} from '../../../services/constants';
 
import * as authaction from '../../../store/actions/auth';
import {connect} from 'react-redux';
 import { ITINERARY_STATUSES } from '../../../services/constants';
 import { TRAVELER_ITINERARIES } from '../../../services/constants';
 import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';
import Landing from '../landing/Index';

  const Container = styled.div`
    width: 100%;

`;

const btoa = (text) => {
  return Buffer.from(text, 'binary').toString('base64');
};
const Itinerary = (props) =>{
  const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [totalduration, setTotalduration] = useState(0);
    // let totalduration = 0;  
 const [plan, setPlan] = useState(null);
    const [itineraryNotCreated, setItineraryNotCreated] = useState(false);
    //states required for timer 
    const [itineraryReleased, setItineraryReleased] = useState(false);
    const [itineraryDate, setItineraryDate] = useState('2021-09-20 18:05:48');
    const [timeRequired, setTimeRequired] = useState();

    //for itinerary and bookings
    const [itinerary, setItinerary] = useState({name: "Loading Itinerary", images: ['null']});
    const [breif, setBreif] = useState(defaultbreif);
    const [booking, setBooking] = useState(null);

    const [itineraryLoading, setItineraryLoading] = useState(true);
    const [briefLoading, setBreifLoading] = useState(true);
    const [stayLoading, setStayLoading] = useState(true);
    const [activityLoading, setActivityLoading] = useState(true);
    const [transferLoading, setTransferLoading] = useState(true);
    const [paymentLoading, setPaymentLoading ] = useState(true);
    const [flightLoading, setFlightLoading] = useState(true);

    const [cardUpdateLoading, setCardUpdateLoading] = useState(null);

    const [stayBookings, setStayBookings] = useState(null);
    const [transferBookings, setTransferBookings] = useState(null);
    const [activityBookings, setActivityBookings] = useState(null);
    const [flightBookings, setFlightBookings] = useState(null);

    const [selectingBooking, setSelectingBooking] = useState(null);
    const [stayFlickityIndex, setStayFlickityIndex] = useState(0);
    const [transferFlickityIndex, setTransferFlickityIndex] = useState(0);
    const [flightFlickityIndex, setFlightFlickityIndex] = useState(0);
    const [activityFlickityIndex, setActivityFlickityIndex] = useState(0);

    const [payment, setPayment] = useState(null);
    const [noBookings, setNoBookings] = useState(false);
    
    const [noStayBookings, setNoStayBookings] = useState(false);
    const [noActivityBookings, setNoActivityBookings] = useState(false);
    const [noTransferBookings, setNoTransferBookings] = useState(false);
    const [noFlightBookings, setNoFlightBookings] = useState(true);

    // const [images, setImages] = useState(null);    
    const [showbooking, setShowbooking] = useState(false);

    const [reloadBookings, setReloadBookings] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const [isDatePresent, setIsDatePresent] = useState(false);
    const [showFlightModal, setShowFlightModal] = useState(false);
    const [showTaxiModal, setShowTaxiModal] = useState(false);

    const [showPoiModal, setShowPoiModal] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    const [hasUserPaid, setHasUserPaid] = useState(false);

    const [isPastTravelerItinerary, setIsPastTravelerItinerary] = useState(false);
    const [is_stock, setIsStock] = useState(false);
    // const closeGalleryHandler = () => {
    //   setImages(null);
    //   setShowbooking(true);
    // }
 //   var script = document.createElement('script');
// script.onload = function () {
//     //do stuff with the script
// };
// script.src =`(function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.in-freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "3225c221f3048e75e5a6ef1d6a5227c59290c8f1"); s.setAttribute("data-bot-hash", "74b6cd8cbe305eba5699361061f2c6fc1ec8607b"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "in"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return {"cstmr::eml":"","cstmr::phn":"","cstmr::nm":""}; } }, function(successResponse) { }, function(errorResponse) { }); });`;
const getBreifHandler = () => {
axiosbreifinstance.get(`/?itinerary_id=`+props.id)
.then(res => {
   setBreif(res.data);
   setBreifLoading(false);
   if(res.data){
    if(res.data.city_slabs){ if(res.data.city_slabs.length)
   for(var i = 0 ; i<res.data.city_slabs.length ; i++){
      if(res.data.city_slabs[i].duration) setTotalduration(totalduration+parseInt(res.data.city_slabs[i].duration));
   }
   else   window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';

  }
  else   window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';

  }
  else    window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
   if(res.data.city_slabs) if(!res.data.city_slabs.length) if(!breif.city_slabs) if(!breif.city_slabs.length)
   setTimeout(getBreifHandler, 3000);

}).catch(error => {
  setBreifLoading(false);

  window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
});
}

const getPaymentHandler = ( ) => {
   setPaymentLoading(true);
  //  props.checkAuthState();

  axios.post(MIS_SERVER_HOST+'/payment/info/', {
    "itinerary_type": "Tailored",
    "itinerary_id": props.id,
  }, {headers: {
    'Authorization': `Bearer ${props.token}`
    }})
  .then(res => {
    setPaymentLoading(false);

     setPayment(res.data);
 
     //check if user has already paid
    // try{
      let email = localStorage.getItem('email');
      if(props.token)
      for(var i=0; i < res.data.registered_users.length ; i++){
        // console.log(props.email)

        // console.log(res.data.registered_users[i])
        if(res.data.registered_users[i].email === email){
          if(res.data.registered_users[i].payment_status)
           if(res.data.registered_users[i].payment_status === 'captured') setHasUserPaid(true);
          break;
        }
      }
    // }catch{

    // }

  }).catch(error => {
    setPaymentLoading(false);

  });
}

const getAccommodationAndActivitiesHandler = () => {
  let stay_bookings = [];
  let activity_bookings= [];
  let transfer_bookings=[];
  let flight_bookings = [];

  var username = "administrator@thetarzanway.com";
  var password = "AKY6282&#bc(*!L)6w8";
fetch(MIS_SERVER_HOST+"/sales/bookings/?itinerary_id="+props.id,{
params: {"itinerary_id": props.id},
headers: {
  "Authorization": "Basic " + btoa(username + ":" + password),
  "Content-Type": "application/json"
}
}
).then(response =>  {
setStayLoading(false);
if(response.status === 200){

response.json().then(json => {
  // getPaymentHandler();

  for(var i =0  ; i < json.bookings.length; i++) {
    if(json.bookings[i].booking_type === 'Accommodation') stay_bookings.push(json.bookings[i]);
    else  if(json.bookings[i].booking_type === 'Activity') activity_bookings.push(json.bookings[i]);
    else  if(json.bookings[i].booking_type === 'Flight') flight_bookings.push(json.bookings[i]);
    else   transfer_bookings.push(json.bookings[i]);


  }
  
  setStayBookings(stay_bookings);
  if(activity_bookings.length)
  setActivityBookings(activity_bookings)

  if(flight_bookings.length)
  setFlightBookings(flight_bookings)

  if(transfer_bookings.length)
  setTransferBookings(transfer_bookings)
})

}
else if(response.status === 404){
setLoading(false);
setNoStayBookings(true);

}
}).catch(err => {

setStayLoading(false);

})

}
useEffect(() => {
  getPaymentHandler();
}, [props.token]);
useEffect(() => {
  // if(!props.token && !props.otpSent)
  //  props.checkAuthState();

}, );


     useEffect(() => {
      // if(router.query.payment_status) window.location.reload();
      //  props.checkAuthState();
      //  console.log('itinerary token',props.token)

         window.scrollTo(0,0);
        if(TRAVELER_ITINERARIES.includes(props.id)) setIsPastTravelerItinerary(true);
        axiosdaybydayinstance.get(`/?itinerary_id=`+props.id)
          .then(res => {
            if(res.data.day_slabs.length){
            if(res.data.is_stock) setIsStock(true);
              setItinerary(res.data);
             setItineraryLoading(false);
             }
            else {
              window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
            }
          }).catch(error => {
             setItineraryLoading(false);
            window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
          });
         getBreifHandler();
          
          axios.get(MIS_SERVER_HOST+'/sales/plan/?itinerary_id='+props.id)
          .then(res => {

             setPlan(res.data);
            if(res.data.itinerary_status === ITINERARY_STATUSES.itinerary_not_created){
                setItineraryNotCreated(false);
                alert("Looks like the response took too long, please refresh and try again.")
            }
            else {
               setUserEmail(res.data.user_email);
               if(res.data.start_date) setIsDatePresent(true);
              setItineraryReleased(res.data.is_visible_to_customer);
              setItineraryDate(res.data.created_at);
              setTimeRequired(res.data.time_needed_for_itinerary_completion);
            }

          }).catch(error => {
 
          });
          
          getAccommodationAndActivitiesHandler();
          
          

 
  // if(itineraryLoading && !itineraryNotCreated){
  // if(stayLoading && !stayBookings){
   
       
  
}, []);





 
  const _updateFlightBookingHandler = (json) => {
     setShowFlightModal(false);
    setFlightBookings(json)
  }

  const _updateBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setBooking(json)
  }
  const _updateStayBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setStayBookings(json)
  }

  const _updateActivityBookingHandler = (json)=> {
    setActivityBookings(json);
  }
  const _updateTransferBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setTransferBookings(json)
  }
 const  _updateTaxiBookingHandler = (json) => {
  setShowTaxiModal(false);
  setTransferBookings(json);

 }
  const _selectTaxiHandler = (bookings, booking_id, booking_name, booking_type, itinerary_id, tailored_id, itinerary_name, taxi_type, transfer_type, city_id, destination_city_id, duration, check_in) => {
    let data =[];
     setCardUpdateLoading(booking_id);
    // for(var i = 0 ; i<bookings.length; i++){
      // if(bookings[i].id === booking_id)
        data.push( {
          "id": booking_id,
          "booking_type": booking_type,
          "itinerary_type": "Tailored",
          "user_selected": true,			
          "itinerary_id": itinerary_id,
          "tailored_itinerary": tailored_id,
          "itinerary_name": itinerary_name,
          "itinerary_db_id": null,
          "taxi_type": taxi_type,
          "transfer_type": transfer_type,
          "city_id": city_id,
          "destination_city_id": destination_city_id,
          "duration": duration,
          "check_in": check_in
      });
      // else data.push(bookings[i]);
    // }
  
    // const token = localStorage.getItem('access_token')
    axiosbookingupdateinstance.post("/?booking_type=Taxi,Bus,Ferry", data, {headers: {
      'Authorization': `Bearer ${props.token}`
      }}).then(res => {
        setCardUpdateLoading(null)
           _updateTransferBookingHandler(res.data.bookings);
           setTimeout(function(){ 
                
            getPaymentHandler(); }, 1000);
 
  
  }).catch(err => {
  
      setCardUpdateLoading(null)

      window.alert("You're not authorized to take this action, please contact your experience captain.")
  })
  }

  const _deselectStayBookingHandler = ( booking, user_selected) => {
     for(var i = 0; i< stayBookings.length; i++){
      if(stayBookings[i].id ===  booking.id){
        // flickity_index=i;
        setStayFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);
    setSelectingBooking(booking.id)
    let costings_breakdown = [];
    for(var i = 0 ; i < booking.costings_breakdown.length; i ++){
      costings_breakdown.push({
        "id": booking.costings_breakdown[i].id,
        "room_type": booking.costings_breakdown[i].room_type,
        "pricing_type":   booking.costings_breakdown[i].pricing_type,
        "room_type_name":  booking.costings_breakdown[i].room_type_name,
        "number_of_rooms": booking.costings_breakdown[i].number_of_rooms,
        "number_of_adults":  booking.costings_breakdown[i].number_of_adults,
        "number_of_infants": booking.costings_breakdown[i].number_of_infants,
        "number_of_children": booking.costings_breakdown[i].number_of_children
      })
    }
    let data =[];
         data.push( {
          "id": booking.id,
           "booking_type": "Accommodation",
           "city": booking.city, 
          "user_selected": user_selected,			
          "accommodation": booking.accommodation,
          "itinerary_id": booking.itinerary_id,
          "tailored_itinerary": booking.tailored_itinerary,
          "costings_breakdown": costings_breakdown,
          "itinerary_name": booking.itinerary_name,
          "itinerary_db_id": null,
          "is_estimated_price": booking.is_estimated_price,
          "itinerary_type": 'Tailored',
      });
      // else data.push(bookings[i]);
    // }
  
    // const token = localStorage.getItem('access_token')
    axiosbookingupdateinstance.post("/?booking_type=Accommodation&itinerary_id="+booking.itinerary_id, data, {headers: {
      'Authorization': `Bearer ${props.token}`
      }}).then(res => {
        setCardUpdateLoading(null)
           _updateStayBookingHandler(res.data.bookings);
           setSelectingBooking(null);
           setTimeout(function(){ 
                
            getPaymentHandler(); }, 1000);
  
  
  }).catch(err => {
    setSelectingBooking(null);

      setCardUpdateLoading(null)
 
      window.alert("You're not authorized to take this action, please contact your experience captain.")
  })
  }
  const _deselectFlightBookingHandler = ( booking, user_selected) => {
    for(var i = 0; i< flightBookings.length; i++){
     if(flightBookings[i].id ===  booking.id){
       // flickity_index=i;
       setFlightFlickityIndex(i);
       break;
     }
   }
   setPaymentLoading(true);

   setSelectingBooking(booking.id)
   let data =[];
   
       data.push( {
         "id": booking.id,
         "booking_type": booking.booking_type,
         "itinerary_type": "Tailored",
         "user_selected": user_selected,			
         "itinerary_id": booking.itinerary_id,
       });
     // else data.push(bookings[i]);
   // }
 
   // const token = localStorage.getItem('access_token')
   axiosbookingupdateinstance.post("/?booking_type=Flight&itinerary_id="+booking.itinerary_id, data, {headers: {
     'Authorization': `Bearer ${props.token}`
     }}).then(res => {
       setCardUpdateLoading(null)
       _updateFlightBookingHandler(res.data.bookings);
          setSelectingBooking(null);
          setTimeout(function(){ 
               
           getPaymentHandler(); }, 1000);
 
 
 }).catch(err => {
   setSelectingBooking(null);

     setCardUpdateLoading(null)

     window.alert("You're not authorized to take this action, please contact your experience captain.")
    })
 }
  const _deselectTransferBookingHandler = ( booking, user_selected) => {
    for(var i = 0; i< transferBookings.length; i++){
     if(transferBookings[i].id ===  booking.id){
       // flickity_index=i;
       setTransferFlickityIndex(i);
       break;
     }
   }
   setPaymentLoading(true);

   setSelectingBooking(booking.id)
   let data =[];
        data.push( {
         "id": booking.id,
         "booking_type": booking.booking_type,
         "itinerary_type": "Tailored",
         "user_selected": user_selected,	
         "taxi_type": booking.taxi_type,
         "transfer_type": booking.transfer_type,
         "itinerary_id": booking.itinerary_id,
              "costings_breakdown": booking.costings_breakdown,
       });
 
     // else data.push(bookings[i]);
   // }
 
   // const token = localStorage.getItem('access_token')
   axiosbookingupdateinstance.post("/?booking_type=Taxi,Bus,Ferry&itinerary_id="+booking.itinerary_id, data, {headers: {
     'Authorization': `Bearer ${props.token}`
     }}).then(res => {
       setCardUpdateLoading(null)
          _updateTransferBookingHandler(res.data.bookings);
          setSelectingBooking(null);
          setTimeout(function(){ 
               
           getPaymentHandler(); }, 1000);
 
 
 }).catch(err => {
   setSelectingBooking(null);

     setCardUpdateLoading(null)

     window.alert("There seems to be a problem, please try again!")
 })
 }
 const _deselectActivityBookingHandler = ( booking, user_selected) => {
  for(var i = 0; i< activityBookings.length; i++){
   if(activityBookings[i].id ===  booking.id){
     // flickity_index=i;
     setActivityFlickityIndex(i);
     break;
   }
 }
 setPaymentLoading(true);

 setSelectingBooking(booking.id)
 let data =[];
 
     data.push( {
       "id": booking.id,
       "booking_type": booking.booking_type,
       "itinerary_type": "Tailored",
       "user_selected": user_selected,			
       "itinerary_id": booking.itinerary_id,
       "tailored_itinerary": booking.tailored_itinerary,
       "itinerary_name": booking.itinerary_name,
       "itinerary_db_id": null,
       "check_in": booking.check_in,
       "check_out": booking.check_out,
       "city": booking.city,
       "costings_breakdown": booking.costings_breakdown,
       "accommodation": booking.accommodation,
       "is_estimated_price": booking.is_estimated_price
   });
   // else data.push(bookings[i]);
 // }

 // const token = localStorage.getItem('access_token')
 axiosbookingupdateinstance.post("/?booking_type=Activity&itinerary_id="+booking.itinerary_id, data, {headers: {
   'Authorization': `Bearer ${props.token}`
   }}).then(res => {
     setCardUpdateLoading(null)
        _updateActivityBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function(){ 
             
         getPaymentHandler(); }, 1000);


}).catch(err => {
 setSelectingBooking(null);

   setCardUpdateLoading(null)

      window.alert("You're not authorized to take this action, please contact your experience captain.")
})
}

   const _updatePaymentHandler = (json) => {
     setPayment(json);
}
  const setHideBookingModal = () => {
    setShowBookingModal(false);
  }
  const setHidePoiModal = () => {
    setShowPoiModal(false);
  }
     if(breif && !itineraryLoading)
    return(
      // <CheckAuthRedirect authRedirectPath="/" redirectOnFail={null}>

        <Container>
          {/* <Header/> */}
           {/* <FullImg url={itinerary.images ? itinerary.images.length ? itinerary.images[0] : 'media/website/grey.png': 'media/website/grey.png'} title={itinerary.name} duration={plan ? plan.duration_number+" "+plan.duration_unit : null}  >
                 <FullImgContainer heading={itinerary.name} duration={plan ? plan.duration_number+" "+plan.duration_unit : null} plan={plan}></FullImgContainer>
           </FullImg>  */}
           <Landing title={itinerary.name} images={itinerary.images} duration={plan ? plan.duration_number+" "+plan.duration_unit : null}></Landing>
            <div id="itinerary-anchor">
              <Menu  hasUserPaid={hasUserPaid} plan={plan} isDatePresent={isDatePresent} _updateTaxiBookingHandler={_updateTaxiBookingHandler} showTaxiModal={showTaxiModal}  setShowTaxiModal={setShowTaxiModal}paymentLoading={paymentLoading} budget={plan ? plan.budget : null} _deselectActivityBookingHandler={_deselectActivityBookingHandler} activityFlickityIndex={activityFlickityIndex} transferFlickityIndex={transferFlickityIndex}  flightLoading={flightLoading} stayFlickityIndex={stayFlickityIndex} setStayFlickityIndex={setStayFlickityIndex} selectingBooking={selectingBooking} _deselectTransferBookingHandler={_deselectTransferBookingHandler} _deselectFlightBookingHandler={_deselectFlightBookingHandler} flightFlickityIndex={flightFlickityIndex} _deselectStayBookingHandler={_deselectStayBookingHandler} getPaymentHandler={getPaymentHandler}  flightBookings={flightBookings} noFlightBookings={noFlightBookings}  cardUpdateLoading={cardUpdateLoading} _selectTaxiHandler={_selectTaxiHandler} _updateTransferHandler={_updateTransferBookingHandler } _updateStayBookingHandler={_updateStayBookingHandler} activityBookings={activityBookings} transferBookings={transferBookings} stayBookings={stayBookings}  user_email={userEmail} no_bookings={noBookings} setItinerary={setItinerary} traveleritinerary={isPastTravelerItinerary} id={props.id} is_stock={is_stock} _updatePaymentHandler={_updatePaymentHandler} setHidePoiModal={setHidePoiModal} setHideBookingModal={setHideBookingModal} setShowPoiModal={setShowPoiModal} setShowBookingModal={setShowBookingModal} _updateFlightBookingHandler={_updateFlightBookingHandler} showFlightModal={showFlightModal} setShowFlightModal={setShowFlightModal} showPoiModal={showPoiModal} showBookingModal={showBookingModal} _updateBookingHandler={_updateBookingHandler}  _updateBookingHandler={_updateBookingHandler} timeRequired={timeRequired} itineraryReleased={itineraryReleased} itineraryDate={itineraryDate} showbooking={showbooking}  payment={payment} itinerary={itinerary} breif={breif} booking={booking}></Menu>
              {/* <ItineraryMobile></ItineraryMobile> */}
              {/* <Cities></Cities> */}
            </div>
            {/* <Footer></Footer> */}
        </Container>
        // </CheckAuthRedirect>
    );
  
    else if(isPastTravelerItinerary )
    return(
      <OldSpinner></OldSpinner>
    );
    else if(router.query.payment_status){
       return(
        <OldSpinner></OldSpinner>
      );
     }
    else return <Spinner></Spinner>
   
}

const mapStateToPros = (state) => {
  return{
    token: state.auth.token,
    email: state.auth.email,
    otpSent: state.auth.otpSent,

  }
}
const mapDispatchToProps = dispatch => {
    return{
      checkAuthState: () => dispatch(authaction.checkAuthState()),
    }
  }
 

export default connect(mapStateToPros,mapDispatchToProps)(React.memo((Itinerary)));