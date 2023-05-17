import React, { useRef, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../media';
// import LeftSideBar from './leftsidebar/Index';
// import Accommodation from './accommodation/Index';
// import AccommodationSearched from './new-accommodation-searched/Index';
// import AccommodationModal from '../accommodation/Index';
import axiosaccommodationinstance from '../../../services/bookings/FetchAccommodations';
import axiostaxiinstance from '../../../services/bookings/FetchTaxiRecommendations';
import Spinner from '../../Spinner';

//  import CurrentlyReplacing from './leftsidebar/CurrentlyReplacing';
import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';
import { connect } from 'react-redux';
// import Button from '../../Button';
import Button from '../../ui/button/Index';
import LogInModal from '../Login';
// import AccommodationSelected from './new-accommodation-selected/Index';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import LoadingLottie from '../../ui/LoadingLottie';
import TaxiSelected from './taxi-selected/Index';
import TaxiSearched from './taxi-searched/Index';
import Drawer from '../../ui/Drawer';
const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr;
 
    @media screen and (min-width: 768px) {
    
    }
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 80%;
    margin: auto;
  }
`;
const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;

const Booking = (props) => {
  let isPageWide = media('(min-width: 768px)');
  let OptionsJSX = [];
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filtersState, setFiltersState] = useState({
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
    budget: [
      'Below ₹3,000',
      '₹3,000 - ₹6,000',
      '₹6,000 - ₹10,000',
      'Above ₹10,000',
    ],
    type: [
      'Hotel',
      'Homestay',
      'Camp',
      'Guest House',
      'Cottage',
      'Villa',
      'Resort',
      'Lodge',
      'Service Appartment',
      'Bed and Breakfast',
      'Farmstay',
      // "Speciality Lodging",
      // "Boat / Cruise",
      // "Holiday Park / Caravan Park",
      // "Country House",
      'Entire House',
      // "Capsule Hotel",
      'Unique',
    ],
    star_category: ['1 star', '2 star', '3 star', '4 star', '5 star', 'All'],
  };
  useEffect(() => {
    // let options = [];
    //  if(props.alternates)
    // for(var i=0; i<props.alternates.length; i++){
    //     options.push(<Accommodation  _setImagesHandler={props._setImagesHandler} alternates={props.alternates} bookings={props.bookings} selectedBooking={props.selectedBooking} tailored_id={props.tailored_id} updateLoadingState={updateLoadingState} itinerary_id={props.selectedBooking.itinerary_id}  accommodation={props.alternates[i]}   _updateBookingHandler={_newUpdateBookingHandler} key={i} ></Accommodation>)
    // }
    //                 setOptionsJSX(options)
  }, [props.alternates, props.bookings]);

  useEffect(() => {
    if (!props.alternates) {
      let params = null;
      try {
        if (props.selectedBooking.transfer_type === 'Intercity one-way') {
          params = {
            transfer_type: 'Intercity one-way',
            search_by: 'name',
            locations:
              props.selectedBooking.city +
              ',' +
              props.selectedBooking.destination_city,
            distance: Math.trunc(
              props.selectedBooking.costings_breakdown.distance.value
            ),
          };
        } else
          params = {
            transfer_type: 'Intercity round-trip',
            duration: props.selectedBooking.costings_breakdown.duration.value,
            distance: Math.trunc(
              props.selectedBooking.costings_breakdown.distance.value
            ),
          };
      } catch {
        params = {
          transfer_type: 'Intercity one-way',
          search_by: 'name',

          locations: 'Munnar,Kochi',
        };
      }
      axiostaxiinstance
        .get('/', {
          //  params:   {
          //         "transfer_type": props.selectedBooking.transfer_type,
          //         "duration": props.selectedBooking.costings_breakdown["duration"].value,
          //         "distance": props.selectedBooking.costings_breakdown["distance"].value,
          //     }

          params: {
            ...params,
          },
        })
        .then((res) => {
          setLoading(false);
          setUpdateLoadingState(false);
          if (res.data[0].choices.length) {
            setNoResults(false);
            let is_min_price_present = false;
            let options = [];
            for (var i = 0; i < res.data[0].choices.length; i++) {
              // try{
              //     for(var j = 0 ; j < res.data.results[i].rooms_available.length; j++){
              //         if(res.data.results[i].rooms_available[j].prices.min_price) {
              //             is_min_price_present = true;
              //             break;
              //         }
              // }

              //  if(res.data.results[i].name !== props.selectedBooking.name  && is_min_price_present)
              options.push(
                <TaxiSearched
                  _updateSearchedTaxi={_updateSearchedTaxi}
                  selectedBooking={props.selectedBooking}
                  data={res.data[0].choices[i]}
                ></TaxiSearched>
              );
              // }
              // catch{
              //     options.push(<AccommodationSearched  _setImagesHandler={props._setImagesHandler} bookings={props.bookings}  _updateSearchedAccommodation={_updateSearchedAccommodation} itinerary_id={props.selectedBooking.itinerary_id} tailored_id={props.tailored_id}_updateBookingHandler={_newUpdateBookingHandler} accommodation={res.data.results[i]} selectedBooking={props.selectedBooking} key={i}  images={res.data.results.images} bookings={props.bookings}  ></AccommodationSearched>)

              // }
            }
            if (!options.length) setNoResults(true);
            setMoreOptionsJSX(options);
            if (res.data.next) {
              setViewMoreStatus(true);
              setOffset(offset + 20);
            } else {
              setViewMoreStatus(false);
              setOffset(0);
            }
          } else {
            setNoResults(true);
            setOffset(0);
            setViewMoreStatus(false);
            setMoreOptionsJSX([]);
          }
          setLoading(false);
        })
        .catch((err) => {});
    }
  }, [props.alternates, props.budget]);

  const _updateSearchedTaxi = ({
    itinerary_id,
    taxi_type,
    transfer_type,
    duration,
    total_taxi,
  }) => {
    setUpdateBookingState(true);

    let updated_bookings_arr = [
      {
        id: props.selectedBooking.id,
        booking_type: 'Taxi',
        itinerary_type: 'Tailored',
        user_selected: true,
        itinerary_id: itinerary_id,
        taxi_type: taxi_type,
        transfer_type: transfer_type,
        costings_breakdown: {
          duration: {
            value: Math.trunc(duration),
          },
          total_taxi: total_taxi,
        },
      },
    ];
    console.dir(updated_bookings_arr);
    axiosbookingupdateinstance
      .post('?booking_type=Taxi,Bus,Ferry', updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateTaxiBookingHandler(res.data.bookings);
        //  props.getPaymentHandler();
        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        setUpdateBookingState(false);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        setUpdateBookingState(false);

        window.alert('There seems to be a problem, please try again!');
      });
  };

  if (props.token)
    return (
      <div>
        <Drawer
          anchor={'right'}
          backdrop
          style={{ zIndex: 1501 }}
          className="font-lexend"
          show={props.showTaxiModal}
          onHide={props.setHideTaxiModal}
          // zIndex='1501'
        >
          <SectionOne setHideTaxiModal={props.setHideTaxiModal}></SectionOne>
          <div>
            <GridContainer style={{ clear: 'right' }}>
              {/* <LeftSideBar selectedBooking={props.selectedBooking} filtersState={filtersState} _updateStarFilterHandler={_updateStarFilterHandler} _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} replacing={props.selectedBooking.name} setHideBookingModal={props.setHideBookingModal}></LeftSideBar> */}
              {/* {!isPageWide ? <MobileFilters _updateStarFilterHandler={_updateStarFilterHandler}  _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} ></MobileFilters> : null} */}
              <ContentContainer style={{ position: 'relative' }}>
                {/* {updateLoadingState ? <div className='center-div' style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner>Fetching accommodations for you</div> : null } */}
                {updateBookingState ? (
                  <div
                    style={{
                      width: 'max-content',
                      margin: 'auto',
                      height: isPageWide ? '80vh' : '40vh',
                    }}
                    className="center-div text-center font-lexend"
                  >
                    <LoadingLottie height="5rem" width="5rem" margin="none" />
                    Please wait while we update your bookings
                  </div>
                ) : null}
                {!noResults && !updateBookingState ? (
                  <OptionsContainer id="options">
                    <div style={{ clear: 'right' }}>
                      <TaxiSelected
                        _setImagesHandler={props._setImagesHandler}
                        selectedBooking={props.selectedBooking}
                      ></TaxiSelected>

                      {optionsJSX.length
                        ? optionsJSX
                        : moreOptionsJSX.length
                        ? moreOptionsJSX
                        : null}
                      {/* {moreOptionsJSX} */}
                      {loading && !optionsJSX.length ? (
                        <div
                          className="center-div"
                          style={{ height: isPageWide ? '80vh' : '40vh' }}
                        >
                          <LoadingLottie
                            height="5rem"
                            width="5rem"
                            margin="none"
                          />
                          Fetching recommendations for you
                        </div>
                      ) : null}
                      {/* {loading && !optionsJSX.length? <div className='center-div' style={{height: isPageWide ? '80vh' : '40vh'}}><Spinner/>Fetching stay recommendations for you</div> : null} */}
                    </div>

                    {/* {updateLoadingState ?  <div style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner></div> : null}  */}
                    {updateLoadingState ? (
                      <div className="center-div" style={{}}>
                        <LoadingLottie
                          height="5rem"
                          width="5rem"
                          margin="1rem auto"
                        />
                      </div>
                    ) : null}

                    {viewMoreStatus && !optionsJSX.length ? (
                      <Button
                        boxShadow
                        onclickparam={null}
                        onclick={_loadAccommodationsHandler}
                        margin="0.25rem auto"
                        borderWidth="1px"
                        borderRadius="2rem"
                        padding="0.25rem 1rem"
                      >
                        View More
                      </Button>
                    ) : null}
                    {/* {noResults ? 'NO RESULTS' : null} */}
                  </OptionsContainer>
                ) : null}
                {noResults ? (
                  <OptionsContainer className="font-lexend center-div text-center">
                    Oops, we couldn't find what you were searching but we are
                    already adding new and approved accommodations to our
                    database everyday!
                  </OptionsContainer>
                ) : null}
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
          </div>
        </Drawer>

        {/* {showPhotos ? <FullScreenGallery images={[]} closeGalleryHandler={closePhotosHandler}></FullScreenGallery> : null} */}
      </div>
    );
  else
    return (
      <div>
        <LogInModal show={true} onhide={props.setHideBookingModal}></LogInModal>
      </div>
    );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
