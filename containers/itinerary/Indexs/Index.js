import React, {useRef, useState, useEffect} from 'react';
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
    const [flightLoading, setFlightLoading] = useState(true);

    const [cardUpdateLoading, setCardUpdateLoading] = useState(null);

    const [stayBookings, setStayBookings] = useState(null);
    const [transferBookings, setTransferBookings] = useState(null);
    const [activityBookings, setActivityBookings] = useState(null);
    const [flightBookings, setFlightBookings] = useState(null);

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

    
    const [showFlightModal, setShowFlightModal] = useState(false);
    const [showPoiModal, setShowPoiModal] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

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
   
  axios.post(MIS_SERVER_HOST+'/payment/info/', {
    "itinerary_type": "Tailored",
    "itinerary_id": props.id,
  })
  .then(res => {

     setPayment(res.data);
  }).catch(error => {

  });
}

const getAccommodationAndActivitiesHandler = () => {
  let stay_bookings = [];
  let activity_bookings= [];
  var username = "administrator@thetarzanway.com";
  var password = "AKY6282&#bc(*!L)6w8";
fetch(MIS_SERVER_HOST+"/sales/bookings/?booking_type=Accommodation,Activity&itinerary_id="+props.id,{
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
  getPaymentHandler();

  for(var i =0  ; i < json.bookings.length; i++) {
    if(json.bookings[i].booking_type === 'Accommodation') stay_bookings.push(json.bookings[i]);
    else activity_bookings.push(json.bookings[i]);
  }

  setStayBookings(stay_bookings);
  if(activity_bookings.length)
  setActivityBookings(activity_bookings)
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
      props.checkAuthState();

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

const _reloadTransferBookings  = () => {
  // if(transferLoading && !transferBookings){
    setTransferLoading(true);
 
    
     fetch(MIS_SERVER_HOST+"/sales/bookings/?booking_type=Flight,Taxi&itinerary_id="+props.id,{
      params: {"itinerary_id": props.id},
   
    }
    ).then(response =>  {
      // setFlightLoading(false);
      // _reloadTaxiBookings();
      setTransferLoading(false)
     if(response.status === 200){
      response.json().then(json => {
        getPaymentHandler();
        setTransferBookings(json.bookings)
        // setFlightBookings(json.bookings);
      })
   
    }
    else if(response.status === 404){
      
      setLoading(false);
      setNoFlightBookings(true);
      
    }
  }).catch(err => {
    setTransferLoading(false);

      setLoading(false);
 
  })
  // }
}
 
  const _updateFlightHandler = (json) => {
     setShowFlightModal(false);
    setBooking(json)
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

  
  const _updateFlightBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setTransferBookings(json)
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
    axiosbookingupdateinstance.post("/?booking_type=Taxi,Flight", data, {headers: {
      'Authorization': `Bearer ${props.token}`
      }}).then(res => {
        setCardUpdateLoading(null)
           _updateFlightBookingHandler(res.data.bookings);
           setTimeout(function(){ 
                
            getPaymentHandler(); }, 1000);
 
  
  }).catch(err => {
  
      setCardUpdateLoading(null)

      window.alert("There seems to be a problem, please try again!")
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
           <FullImg url={itinerary.images ? itinerary.images.length ? itinerary.images[0] : 'media/website/grey.png': 'media/website/grey.png'} title={itinerary.name} duration={plan ? plan.duration_number+" "+plan.duration_unit : null}  >
                 <FullImgContainer heading={itinerary.name} duration={plan ? plan.duration_number+" "+plan.duration_unit : null} plan={plan}></FullImgContainer>
           </FullImg> 
            <div id="itinerary-anchor">
              <Menu getAccommodationAndActivitiesHandler={getAccommodationAndActivitiesHandler} getPaymentHandler={getPaymentHandler} flightLoading={flightLoading} flightBookings={flightBookings} noFlightBookings={noFlightBookings} transferLoading={transferLoading}  cardUpdateLoading={cardUpdateLoading} _selectTaxiHandler={_selectTaxiHandler} _updateFlightBookingHandler={_updateFlightBookingHandler } _updateStayBookingHandler={_updateStayBookingHandler} activityBookings={activityBookings} transferBookings={transferBookings} stayBookings={stayBookings}  user_email={userEmail} no_bookings={noBookings} setItinerary={setItinerary} traveleritinerary={isPastTravelerItinerary} id={props.id} is_stock={is_stock} _updatePaymentHandler={_updatePaymentHandler} setHidePoiModal={setHidePoiModal} setHideBookingModal={setHideBookingModal} setShowPoiModal={setShowPoiModal} setShowBookingModal={setShowBookingModal} _reloadTransferBookings={_reloadTransferBookings} _updateFlightHandler={_updateFlightHandler} showFlightModal={showFlightModal} setShowFlightModal={setShowFlightModal} showPoiModal={showPoiModal} showBookingModal={showBookingModal} _updateBookingHandler={_updateBookingHandler}  _updateBookingHandler={_updateBookingHandler} timeRequired={timeRequired} itineraryReleased={itineraryReleased} itineraryDate={itineraryDate} showbooking={showbooking}  payment={payment} itinerary={itinerary} breif={breif} booking={booking}></Menu>
              {/* <ItineraryMobile></ItineraryMobile> */}
              {/* <Cities></Cities> */}
            </div>
            {/* <Footer></Footer> */}
        </Container>
        // </CheckAuthRedirect>
    );
  
    else if(isPastTravelerItinerary)
    return(
      <OldSpinner></OldSpinner>
    );
    else return <Spinner></Spinner>
   
}

const mapStateToPros = (state) => {
  return{
    token: state.auth.token,

  }
}
const mapDispatchToProps = dispatch => {
    return{
      checkAuthState: () => dispatch(authaction.checkAuthState()),
    }
  }
 

export default connect(mapStateToPros,mapDispatchToProps)(React.memo((Itinerary)));