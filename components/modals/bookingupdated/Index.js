import React, {useRef, useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../media';
import LeftSideBar from './leftsidebar/Index';
import Accommodation from './accommodation/Index';
import AccommodationSearched from './accommodation-searched/Index';

 import axiosaccommodationinstance from '../../../services/bookings/FetchAccommodations';
 import Spinner from '../../Spinner';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons';
 import CurrentlyReplacing from './leftsidebar/CurrentlyReplacing';
import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';
import {connect} from 'react-redux';
 // import Button from '../../Button';
import Button from '../../ui/button/Index';
import LogInModal from '../Login';
const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 1rem;
    @media screen and (min-width: 768px) {
    
    }
`;

const OptionsContainer = styled.div`
    min-height: 40vh;
    overflow-x: hidden;
    width: 100%;
    position: relative;
    max-height: 65vh;

    @media screen and (min-width: 768px) {
        max-height: 80vh;
        min-height: 80vh;

    }
`;
const ContentContainer = styled.div`
    min-height: 65vh;
    @media screen and (min-width: 768px) {
        min-height: max-content;
    }
`;
 
 
 
 
const Booking = (props) => {
    let isPageWide = media('(min-width: 768px)')

    let OptionsJSX = [];
    const [optionsJSX, setOptionsJSX] = useState([]);
    const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);

    const [loading, setLoading] = useState(true);
    const [ filtersState, setFiltersState] = useState({
        budget: [],
        type: [],
        star_category: [],
    });
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [viewMoreStatus, setViewMoreStatus] = useState(false);

    const [updateBookingState, setUpdateBookingState] = useState(false);
    const [updateLoadingState, setUpdateLoadingState] = useState(false);

    const [moreLoadingState, setMoreLoadingState] = useState(false);

    const [noResults, setNoResults] = useState(false);
    
    const filters = {
        budget: ["Below ₹3,000", "₹3,000 - ₹6,000", "₹6,000 - ₹10,000", "Above ₹10,000"],
        type: [
            "Hotel",
            "Homestay",
            "Camp",
            "Guest House",
            "Cottage",
            "Villa",
            "Resort",
            "Lodge",
            "Service Appartment",
            "Bed and Breakfast",
            "Farmstay",
            // "Speciality Lodging",
            // "Boat / Cruise",
            // "Holiday Park / Caravan Park",
            // "Country House",
            "Entire House",
            // "Capsule Hotel",
            "Unique",

        ],
        star_category: ["1 star", "2 star", "3 star", "4 star", "5 star", "All"],
    }
    useEffect(() => {
        let options = [];
         if(props.alternates)
        for(var i=0; i<props.alternates.length; i++){
            options.push(<Accommodation alternates={props.alternates} bookings={props.bookings} selectedBooking={props.selectedBooking} tailored_id={props.tailored_id} updateLoadingState={updateLoadingState} itinerary_id={props.selectedBooking.itinerary_id}  accommodation={props.alternates[i]}   _updateBookingHandler={_newUpdateBookingHandler} key={i} ></Accommodation>)
        }
                        setOptionsJSX(options)

      },[props.alternates, props.bookings])

    useEffect(() => {
        if(!props.alternates)
        axiosaccommodationinstance.post("/?limit="+limit+"&offset="+offset, 
            {
                "cities": props.selectedBooking.city,
                "check_in": props.selectedBooking.check_in,
                "check_out": props.selectedBooking.check_out,                
                "number_of_adults": props.selectedBooking.pax.number_of_adults,
                "number_of_children": props.selectedBooking.pax.number_of_children,
                "number_of_infants": props.selectedBooking.pax.number_of_infants
            
        }).then(res => {
            setUpdateLoadingState(false);
            if(res.data.results.length){
                setNoResults(false);
                let options = [];
                 for(var i = 0; i< res.data.results.length; i++){
                     if(res.data.results[i].name !== props.selectedBooking.name  && res.data.results[i].rooms_available[0].prices.min_price)
                    options.push(<AccommodationSearched _updateSearchedAccommodation={_updateSearchedAccommodation} itinerary_id={props.selectedBooking.itinerary_id} tailored_id={props.tailored_id}_updateBookingHandler={_newUpdateBookingHandler} accommodation={res.data.results[i]} selectedBooking={props.selectedBooking} key={i}  images={res.data.results.images} bookings={props.bookings}  ></AccommodationSearched>)
                     
                }       
                 if(!options.length) setNoResults(true);
                setMoreOptionsJSX(options)
                if(res.data.next){
                    setViewMoreStatus(true);
                    setOffset(offset+20);
                }
                else{
                    setViewMoreStatus(false);
                    setOffset(0);
                }
            }
            else {
                setNoResults(true);
                setOffset(0);
                setViewMoreStatus(false);
                setMoreOptionsJSX([]);


            }
                setLoading(false);
            }).catch(err => {
                
            })
      },[])
      const _updateOptionsHandlerWithFilter = () => {
          setOffset(0);
          setUpdateLoadingState(true);
            setNoResults(false);
            let budgetarr = filtersState.budget;
            let typearr = filtersState.type;
            let sta_catgeoryarr  = filtersState.star_category;

            let type=[];
            let price_lower_range = null;
            let price_upper_range = null;
            let price_set = false;
          
            if(!typearr.length){
            }
            else{
                for(var i = 0; i < typearr.length; i++){
                    if(typearr[i] === 'All') null;
                    else{
                        if(typearr[i] === 'Unique'){
                            type.push("Speciality Lodging");
                            type.push("Boat / Cruise");
                            type.push("Holiday Park / Caravan Park");
                            type.push("Capsule Hotel");
                        }
                        else type.push(typearr[i])
                    }
                }
            }

            //BUDGET FILTERS
            if(!budgetarr.length){
                //send default
                price_lower_range = 0;
                price_upper_range = 100000000;
            }
            else{
                // for(var i = 0 ; i < budgetarr.length; i++){
                // }

 

                 
 
 
 

                if(budgetarr.includes('Below ₹3,000')){

                    price_lower_range = 0;
                    price_upper_range = 300000;
                    if(budgetarr.includes("Above ₹10,000")){
                        price_upper_range = null;
                    }
                    else if(budgetarr.includes("₹6,000 - ₹10,000")){
                        price_upper_range = 1000000;
                    }
                    else if(budgetarr.includes("₹3,000 - ₹6,000")){
                        price_upper_range = 600000;
                    }
                    price_set = true;
                }
                if(budgetarr.includes('Above ₹10,000')){
                    price_upper_range = 100000000;
                    price_lower_range = 1000000;
                    if(budgetarr.includes("Below ₹3,000")){
                        price_lower_range = 0;
                    }
                    else if(budgetarr.includes("₹3,000 - ₹6,000")){
                        price_lower_range = 300000;
                    }
                    else if(budgetarr.includes("₹6,000 - ₹10,000")){
                        price_lower_range = 600000;
                    }
                    price_set = true;   
                }
                if(!price_set){
                    if(budgetarr.includes("₹3,000 - ₹6,000")){
                        price_lower_range = 300000;
                        if(budgetarr.includes("₹6,000 - ₹10,000")){
                            price_upper_range = 1000000;
                        }
                        else price_upper_range = 600000
                    }
                    else if(budgetarr.includes("₹6,000 - ₹10,000")){
                        price_lower_range = 600000;
                        if(budgetarr.includes("Above ₹10,000")){
                            price_upper_range = 100000000;;
                        }
                        else price_upper_range = 1000000;
                    }
                }
             }

setViewMoreStatus(false);
        axiosaccommodationinstance.post("/?limit="+limit+"&offset=0", 
        {
            "cities": [props.selectedBooking.city],
            // "check_in": "2022-02-01",
            // "check_out": "2022-02-04",
            "check_in": props.selectedBooking.check_in,
            "check_out": props.selectedBooking.check_out,
            "accommodation_types": type,
            "price_lower_range": price_lower_range,
            "price_upper_range": price_upper_range,
            "number_of_adults": props.selectedBooking.pax.number_of_adults,
            "number_of_children": props.selectedBooking.pax.number_of_children,
            "number_of_infants": props.selectedBooking.pax.number_of_infants
        
    }).then(res => {
        setUpdateLoadingState(false);
        if(res.data.results.length){
            setNoResults(false)
            let options = [];
            for(var i = 0; i < res.data.results.length; i++){
                 if(res.data.results[i].images.length > 3) //rmeove
                if(res.data.results[i].name !== props.selectedBooking.name)
                options.push(<Accommodation  selectedBooking={props.selectedBooking} tailored_id={props.tailored_id} updateLoadingState={updateLoadingState} booking_id={props.selectedBooking.id} itinerary_id={props.selectedBooking.itinerary_id}  accommodation_id={res.data.results[i].id} room_type={res.data.results[i].live_data.roomtypeName} pricing_type={res.data.results[i].live_data.includeBreakfast ? "CP" : "EP"}  _updateBookingHandler={_updateBookingHandler} type={res.data.results[i].accommodation_type} review_score={res.data.results[i].live_data.reviewScore}   review_count={res.data.results[i].live_data.reviewCount} key={i} name={res.data.results[i].name} description={res.data.results[i].description} location={res.data.results[i].location} star={res.data.results[i].star_category} cost={Math.ceil(res.data.results[i].live_data.dailyRate/100)} images={res.data.results[i].images}  room_type={res.data.results[i].live_data.roomtypeName}  includeBreakfast={res.data.results[i].live_data.includeBreakfast} ></Accommodation>)
                 
            }  
            if(res.data.next){
                setViewMoreStatus(true);    
                setOffset(20);

            } 
            else {
                setViewMoreStatus(false);
                setOffset(0);
            }
            setOptionsJSX(options)
        }
        else{
            setNoResults(true);
            setOffset(0);
            setViewMoreStatus(false);
            setOptionsJSX([]);

        }
            setLoading(false);
            // setUpdateLoadingState(false);

        }).catch(err => {
            setLoading(false);
            
        })
            

      }
      const _addFilterHandler= (filter, heading) => {

          let oldfilters = filtersState;
          let oldfiltersheadingarr = filtersState[heading];

          oldfiltersheadingarr.push(filter);
            let newfilters = {
                ...oldfilters,
                [heading] : oldfiltersheadingarr,
            }
            setFiltersState(newfilters)
            _updateOptionsHandlerWithFilter();

        }
    const _updateStarFilterHandler = ( lower, upper) => {
        let oldfilters = filtersState;
        let newfilters = {
            ...oldfilters,
            star_category: [lower, upper]
        }

        setFiltersState(newfilters)
        _updateOptionsHandlerWithFilter();
    }
    const _removeFilterHandler = (filter, heading) => {
        let oldfilters = filtersState;
        let oldfiltersheadingarr = filtersState[heading];
        const index = oldfiltersheadingarr.indexOf(filter);

        oldfiltersheadingarr.splice(index, 1);
        let newfilters = {
            ...oldfilters,
            [heading] : oldfiltersheadingarr,
        }
        setFiltersState(newfilters)
            _updateOptionsHandlerWithFilter();

    }

    const _updateBookingHandler = ({old_booking_id, itinerary_id, tailored_id, accommodation, costing_breakdown, itinerary_name, new_booking_id, old_accommodation_id}) => {
             
            setUpdateBookingState(true);
             axiosbookingupdateinstance.post("?booking_type=accommodation", 
            [
                {
                    "id": new_booking_id,
                    "booking_type": "Accommodation",
                    "itinerary_type": "Tailored",
                    "city":props.selectedBooking.city,
                    "user_selected": true,			
                    "accommodation": accommodation,
                    "itinerary_id": itinerary_id,
                    "tailored_itinerary": tailored_id,
                    "costings_breakdown": costing_breakdown,
                    "itinerary_name": itinerary_name,
                    "itinerary_db_id": null,
                },
                {
                    "id": old_booking_id,
                    "booking_type": "Accommodation",
                    "itinerary_type": "Tailored",
                    "city":props.selectedBooking.city,
                    "user_selected": false,			
                    "accommodation": props.selectedBooking.accommodation_id,
                    "itinerary_id": itinerary_id,
                    "tailored_itinerary": tailored_id,
                    "costings_breakdown": props.selectedBooking.costings_breakdown,
                    "itinerary_name": itinerary_name,
                    "itinerary_db_id": null,
                    "accommodation": old_accommodation_id
                },
            
            ], {headers: {
                'Authorization': `Bearer ${props.token}`
                }}).then(res => {
                     props._updateBookingHandler(res.data.bookings);
                     setTimeout(function(){ 
                
                        props.getPaymentHandler(); }, 1000);
                     

                    // props._updatePaymentHandler(res.data.payment_info);
                    // setUpdateLoadingState(false);  
                    setUpdateBookingState(false);
  
            }).catch(err => {
                // setUpdateLoadingState(false);
                setUpdateBookingState(false);

                window.alert("There seems to be a problem, please try again!")
            })
    }
    const _updateSearchedAccommodation = ({bookings, new_booking, itinerary_id, tailored_id, itinerary_name}) => {
        setUpdateBookingState(true);
        // const token = localStorage.getItem('access_token');
         let updated_bookings_arr = [{
            "id": props.selectedBooking.id,
                        "name": new_booking.name,
                        "booking_type": "Accommodation",
                        "itinerary_type": "Tailored",
                        "user_selected": true,			
                        "accommodation": new_booking.id,
                        "itinerary_id": itinerary_id,
                        "tailored_itinerary": tailored_id,
                        "costings_breakdown": [{
                            // ...bookings[i].costings_breakdown,
                            number_of_adults: props.selectedBooking.pax.number_of_adults,
                            number_of_children: props.selectedBooking.pax.number_of_children,
                            number_of_infants: props.selectedBooking.pax.number_of_infants,
                            number_of_extra_beds: 0,
                            id: new_booking.rooms_available[0].id,
                            room_type: new_booking.rooms_available[0].room_type,
                            pricing_type: new_booking.rooms_available[0].prices.min_pricing_type
                        }],
                        "itinerary_name": itinerary_name,
                        "itinerary_db_id": null,
        }];
  
        axiosbookingupdateinstance.post("?booking_type=Accommodation", updated_bookings_arr, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
                props._updateStayBookingHandler(res.data.bookings);
                // props._updatePaymentHandler(res.data.payment_info);
                props.getPaymentHandler();

                setUpdateBookingState(false);

        }).catch(err => {
            // setUpdateLoadingState(false);
            setUpdateBookingState(false);

            window.alert("There seems to be a problem, please try again!")
        })
    }
    const _newUpdateBookingHandler = ({alternates, new_booking, itinerary_id, tailored_id, itinerary_name}) => {
        setUpdateBookingState(true);
        // const token = localStorage.getItem('access_token');
          let updated_bookings_arr = [
           
            {
                "id": props.selectedBooking.id,
                "costings_breakdown": props.selectedBooking.costings_breakdown,
                "alternate_to" : null,
                "accommodation" : props.selectedBooking.accommodation,
                "booking_type": "Accommodation",
                "itinerary_type": "Tailored",
                 "user_selected": false,			
                 "itinerary_id": itinerary_id,
                "tailored_itinerary": tailored_id,
                 "itinerary_name": itinerary_name,
                "itinerary_db_id": null,
            },
         ];
         for(var i = 0 ; i < alternates.length ; i++) {
            if(new_booking.id === alternates[i].id) 
            updated_bookings_arr.push(
                {
                    "id": alternates[i].id,
                    "alternate_to": alternates[i].alternate_to,
                    "accommodation": alternates[i].accommodation,
                    "booking_type": "Accommodation",
                    "itinerary_type": "Tailored",
                     "user_selected": true,			
                     "itinerary_id": itinerary_id,
                    "tailored_itinerary": tailored_id,
                     "itinerary_name": itinerary_name,
                    "itinerary_db_id": null,
                    "costings_breakdown": alternates[i].costings_breakdown,
                },
            )
            else{
                updated_bookings_arr.push(
                    {
                        "id": alternates[i].id,
                        "alternate_to": alternates[i].alternate_to,

                        "accommodation": alternates[i].accommodation,
                        "booking_type": "Accommodation",
                        "itinerary_type": "Tailored",
                         "user_selected": false,			
                         "itinerary_id": itinerary_id,
                        "tailored_itinerary": tailored_id,
                         "itinerary_name": itinerary_name,
                        "itinerary_db_id": null,
                        "costings_breakdown": alternates[i].costings_breakdown,
                    },
                )
            }
         }
        
        // const token = localStorage.getItem('access_token');
        axiosbookingupdateinstance.post("?booking_type=Accommodation", updated_bookings_arr, {headers: {
                'Authorization': `Bearer ${props.token}`
                }}).then(res => {
                     props._updateStayBookingHandler(res.data.bookings);
                     setTimeout(function(){ 
                
                        props.getPaymentHandler(); }, 1000);
                    // props._updatePaymentHandler(res.data.payment_info);
                    setUpdateBookingState(false);
  
            }).catch(err => {
                // setUpdateLoadingState(false);
                setUpdateBookingState(false);

                window.alert("There seems to be a problem, please try again!")
            })
    }
     const _loadAccommodationsHandler = () => {
        setUpdateLoadingState(true);
        setViewMoreStatus(false);
        // setMoreLoadingState(true);
        
        axiosaccommodationinstance.post("/?limit="+limit+"&offset="+offset, 
        {
            "cities": props.selectedBooking.city,
            "check_in": props.selectedBooking.check_in,
            "check_out": props.selectedBooking.check_out,                
            "number_of_adults": props.selectedBooking.pax.number_of_adults,
            "number_of_children": props.selectedBooking.pax.number_of_children,
            "number_of_infants": props.selectedBooking.pax.number_of_infants
        
    }).then(res => {
        // setOffset(res.data.nextOffset);
        // setOffset(offset+40);

        // let oldoptions = optionsJSX;
        if(res.data.results.length){
            setNoResults(false);

 
        let options = moreOptionsJSX.slice();
             for(var i = 0; i < res.data.results.length; i++){
                 if(res.data.results[i].name !== props.selectedBooking.name  && res.data.results[i].rooms_available[0].prices.min_price)
                options.push(<AccommodationSearched _updateSearchedAccommodation={_updateSearchedAccommodation} itinerary_id={props.selectedBooking.itinerary_id} tailored_id={props.tailored_id}_updateBookingHandler={_newUpdateBookingHandler} accommodation={res.data.results[i]} selectedBooking={props.selectedBooking} key={i}  images={res.data.results.images} bookings={props.bookings}  ></AccommodationSearched>)

                
                 
            }   
             setMoreOptionsJSX(options)
            
            if(res.data.next) {
                setOffset(offset+20);
                setViewMoreStatus(true);

            }
            else{
                setOffset(0);
                setViewMoreStatus(false);
            }
        }
        else{
                setNoResults(true);
                setOffset(0);
                setViewMoreStatus(false);
                setOptionsJSX([]);
        }
            setUpdateLoadingState(false);


        }).catch(err => {
            setUpdateLoadingState(false);
            
        })
            

      }
     if(props.token)
  return(
      <div>
        <Modal   id="bookingedit-modal" show={props.showBookingModal}  size="xl"  onHide={props.setHideBookingModal} style={{padding: "0"}}>
           {/* <Modal.Header>2</Modal.Header> */}
            <Modal.Body style={{padding: "0.5rem",  borderStyle: "solid", borderColor: "#F7e700", borderWidth: "0.5rem", borderRadius: '16px', backgroundColor: 'white', }} >
            <FontAwesomeIcon className="hover-pointer" icon={faChevronLeft} onClick={props.setHideBookingModal} style={{margin: '0.5rem', position: 'sticky', top: '0'}} ></FontAwesomeIcon>
               <GridContainer style={{clear: 'right'}}>
                <LeftSideBar selectedBooking={props.selectedBooking} filtersState={filtersState} _updateStarFilterHandler={_updateStarFilterHandler} _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} replacing={props.selectedBooking.name} setHideBookingModal={props.setHideBookingModal}></LeftSideBar>
                {/* {!isPageWide ? <MobileFilters _updateStarFilterHandler={_updateStarFilterHandler}  _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} ></MobileFilters> : null} */}
               <ContentContainer style={{position: 'relative'}}>
                {/* {updateLoadingState ? <div className='center-div' style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner>Fetching accommodations for you</div> : null } */}
                {updateBookingState ? <div style={{width: 'max-content', margin: 'auto', height: isPageWide ? '80vh' :'40vh'}} className='center-div text-center font-opensans'><Spinner></Spinner>Please wait while we update your bookings</div> : null }
               { !noResults  && !updateBookingState ? <OptionsContainer id='options'>
                   <div style={{clear: 'right'}}>
                   {optionsJSX.length ? optionsJSX :moreOptionsJSX.length? moreOptionsJSX : null}
                    {/* {moreOptionsJSX} */}
                   {loading && !optionsJSX.length? <div className='center-div' style={{height: isPageWide ? '80vh' : '40vh'}}><Spinner/>Fetching stay recommendations for you</div> : null}
                   </div>
                   
                   {updateLoadingState ?  <div style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner></div> : null} 
                    {viewMoreStatus && !optionsJSX.length? <Button boxShadow onclickparam={null} onclick={_loadAccommodationsHandler} margin="0.25rem auto" borderWidth="1px" borderRadius="2rem" padding="0.25rem 1rem">View More</Button> : null}
                    {/* {noResults ? 'NO RESULTS' : null} */}
               </OptionsContainer> : null}
               {noResults ? <OptionsContainer  className='font-opensans center-div text-center' >Oops, we couldn't find what you were searching but we are already adding new and approved accommodations to our database everyday!</OptionsContainer>  : null}
               {/* <Button onclickparam={null} onclick={_loadAccommodationsHandler} margin="0.25rem auto" borderWidth="1px" borderRadius="2rem" padding="0.25rem 1rem">More</Button> */}
               {/* {
                   !updateLoadingState ? <InfiniteOptionsContainer><InfiniteScroller next={_loadAccommodationsHandler} hasMore={true} dataLength={optionsJSX.length} jsx={optionsJSX}></InfiniteScroller>{optionsJSX}</InfiniteOptionsContainer> : null
                   } 
             */}
               {/* <ButtonToTop className='center-div'>
                   <FontAwesomeIcon icon={faChevronUp} style={{color: 'white', margin: '0'}}/>
                </ButtonToTop> */}
               
               </ContentContainer>
               </GridContainer>
               {!isPageWide ? <CurrentlyReplacing selectedBooking={props.selectedBooking} replacing={props.selectedBooking.name}></CurrentlyReplacing> : null}

            </Modal.Body>
           
      </Modal>
      {/* {showPhotos ? <FullScreenGallery images={[]} closeGalleryHandler={closePhotosHandler}></FullScreenGallery> : null} */}
      </div>
  );
  else return(
<div>

      <LogInModal
          show={true}
          onhide={props.setHideBookingModal}>
        </LogInModal>
</div>
  );

}

const mapStateToPros = (state) => {
    return{
    
      name: state.auth.name,
      emailFail: state.auth.emailFail,
      token: state.auth.token,
      phone: state.auth.phone,
      email: state.auth.email,
      authRedirectPath: state.auth.authRedirectPath,
      loadingsocial: state.auth.loadingsocial,
      emailfailmessage: state.auth.emailfailmessage,
      loginmessage: state.auth.loginmessage,
      hideloginclose: state.auth.hideloginclose
    }
  }
  const mapDispatchToProps = dispatch => {
      return{
      
      }
    }
 
export default  connect(mapStateToPros,mapDispatchToProps)(Booking);