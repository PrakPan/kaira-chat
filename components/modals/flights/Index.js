import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../media';
import Accommodation from './accommodation/Index';
import axiosaccommodationinstance from '../../../services/bookings/FetchAccommodations';
import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';
import { connect } from 'react-redux';
import axiosflightsearch from '../../../services/bookings/FlightSearch';
import LogInModal from '../Login';

import SectionOne from './SectionOne';
import Button from '../../ui/button/Index';
import Flight from './new-flight-searched/Index';
import LoadingLottie from '../../ui/LoadingLottie';
import Drawer from '../../ui/Drawer';
const GridContainer = styled.div`
min-height: 65vh;
max-height: 40vh;

@media screen and (min-width: 768px) {
    min-height: 90vh;
  
    overflow-y: scroll;
 
    @media screen and (min-width: 768px) {
    
    }
    
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  width: 100%;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
  }
`;
const ContentContainer = styled.div`
  @media screen and (min-width: 768px) {
    width: 70%;
    margin: auto;
  }
`;

const Booking = (props) => {
  let isPageWide = media('(min-width: 768px)');

  let OptionsJSX = [];
  const [optionsJSX, setOptionsJSX] = useState([]);
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
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    let options = [];
    setLoading(true);
    if (props.selectedBooking && props.token)
      axiosflightsearch
        .get('/?limit=' + limit + '&offset=' + offset, {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
          params: {
            number_of_adults: props.selectedBooking.pax.number_of_adults,
            number_of_children: props.selectedBooking.pax.number_of_children,
            number_of_infants: props.selectedBooking.pax.number_of_infants,
            check_in: props.selectedBooking.check_in,
            city_code: props.selectedBooking.origin_iata,
            destination_city_code: props.selectedBooking.destination_iata,
            flight_cabin_class: '1',
          },
        })
        .then((res) => {
          localStorage.setItem('tbo_trace_id', res.data.TraceId);
          // const flights
          if (res.data.Results.length) {
            for (var i = 0; i < res.data.Results.length; i++) {
              options.push(
                <Flight
                  itinerary_id={props.itinerary_id}
                  data={res.data.Results[i]}
                  selectedBooking={props.selectedBooking}
                  _updateBookingHandler={_newUpdateBookingHandler}
                ></Flight>
              );
            }
            setOptionsJSX(options);
          }
          if (res.data.next_page) {
            setViewMoreStatus(true);
            setOffset(offset + 20);
          } else {
            setViewMoreStatus(false);
            setOffset(0);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
  }, [props.selectedBooking, props.token]);

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

  const _updateOptionsHandlerWithFilter = () => {
    setOffset(0);
    setUpdateLoadingState(true);
    setNoResults(false);
    let budgetarr = filtersState.budget;
    let typearr = filtersState.type;
    let sta_catgeoryarr = filtersState.star_category;

    let type = [];
    let price_lower_range = null;
    let price_upper_range = null;
    let price_set = false;
    //TYPE FILTERS
    if (!typearr.length) {
      //send empty type
    } else {
      for (var i = 0; i < typearr.length; i++) {
        if (typearr[i] === 'All') null;
        else {
          if (typearr[i] === 'Unique') {
            type.push('Speciality Lodging');
            type.push('Boat / Cruise');
            type.push('Holiday Park / Caravan Park');
            type.push('Capsule Hotel');
          } else type.push(typearr[i]);
        }
      }
    }

    //BUDGET FILTERS
    if (!budgetarr.length) {
      //send default
      price_lower_range = 0;
      price_upper_range = 100000000;
    } else {
      if (budgetarr.includes('Below ₹3,000')) {
        price_lower_range = 0;
        price_upper_range = 300000;
        if (budgetarr.includes('Above ₹10,000')) {
          price_upper_range = null;
        } else if (budgetarr.includes('₹6,000 - ₹10,000')) {
          price_upper_range = 1000000;
        } else if (budgetarr.includes('₹3,000 - ₹6,000')) {
          price_upper_range = 600000;
        }
        price_set = true;
      }
      if (budgetarr.includes('Above ₹10,000')) {
        price_upper_range = 100000000;
        price_lower_range = 1000000;
        if (budgetarr.includes('Below ₹3,000')) {
          price_lower_range = 0;
        } else if (budgetarr.includes('₹3,000 - ₹6,000')) {
          price_lower_range = 300000;
        } else if (budgetarr.includes('₹6,000 - ₹10,000')) {
          price_lower_range = 600000;
        }
        price_set = true;
      }
      if (!price_set) {
        if (budgetarr.includes('₹3,000 - ₹6,000')) {
          price_lower_range = 300000;
          if (budgetarr.includes('₹6,000 - ₹10,000')) {
            price_upper_range = 1000000;
          } else price_upper_range = 600000;
        } else if (budgetarr.includes('₹6,000 - ₹10,000')) {
          price_lower_range = 600000;
          if (budgetarr.includes('Above ₹10,000')) {
            price_upper_range = 100000000;
          } else price_upper_range = 1000000;
        }
      }
    }

    setViewMoreStatus(false);
    axiosaccommodationinstance
      .post('/?limit=' + limit + '&offset=0', {
        cities: [props.selectedBooking.city],
        // "check_in": "2022-02-01",
        // "check_out": "2022-02-04",
        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,
        accommodation_types: type,
        price_lower_range: price_lower_range,
        price_upper_range: price_upper_range,
        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
      })
      .then((res) => {
        setUpdateLoadingState(false);
        if (res.data.results.length) {
          setNoResults(false);
          let options = [];
          for (var i = 0; i < res.data.results.length; i++) {
            if (res.data.results[i].images.length > 3)
              if (res.data.results[i].name !== props.selectedBooking.name)
                //rmeove
                options.push(
                  <Accommodation
                    selectedBooking={props.selectedBooking}
                    tailored_id={props.tailored_id}
                    updateLoadingState={updateLoadingState}
                    booking_id={props.selectedBooking.id}
                    itinerary_id={props.selectedBooking.itinerary_id}
                    accommodation_id={res.data.results[i].id}
                    room_type={res.data.results[i].live_data.roomtypeName}
                    pricing_type={
                      res.data.results[i].live_data.includeBreakfast
                        ? 'CP'
                        : 'EP'
                    }
                    _updateBookingHandler={_updateBookingHandler}
                    type={res.data.results[i].accommodation_type}
                    review_score={res.data.results[i].live_data.reviewScore}
                    review_count={res.data.results[i].live_data.reviewCount}
                    key={i}
                    name={res.data.results[i].name}
                    description={res.data.results[i].description}
                    location={res.data.results[i].location}
                    star={res.data.results[i].star_category}
                    cost={Math.ceil(
                      res.data.results[i].live_data.dailyRate / 100
                    )}
                    images={res.data.results[i].images}
                    includeBreakfast={
                      res.data.results[i].live_data.includeBreakfast
                    }
                  ></Accommodation>
                );
          }
          if (res.data.next) {
            setViewMoreStatus(true);
            setOffset(20);
          } else {
            setViewMoreStatus(false);
            setOffset(0);
          }
          setOptionsJSX(options);
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setOptionsJSX([]);
        }
        setLoading(false);
        // setUpdateLoadingState(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const _newUpdateBookingHandler = ({
    booking_id,
    itinerary_id,
    result_index,
  }) => {
    setUpdateBookingState(true);
    setUnauthorized(false);
    let updated_bookings_arr = [];

    updated_bookings_arr.push({
      trace_id: localStorage.getItem('tbo_trace_id'),
      id: booking_id,
      user_selected: true,
      booking_type: 'Flight',
      itinerary_id: itinerary_id,
      result_index: result_index,
      itinerary_type: 'Tailored',
    });

    // const token = localStorage.getItem('access_token');
    axiosbookingupdateinstance
      .post('?booking_type=Flight', updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateFlightBookingHandler(res.data.bookings);
        /* setTimeout(function () {
          props.getPaymentHandler();
        }, 1000); */
        props.getPaymentHandler();
        setUpdateBookingState(false);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        setUpdateBookingState(false);
        console.log(err);
        setUnauthorized(true);
        window.alert('There seems to be a problem, please try again!');
      });
  };
  const _loadAccommodationsHandler = () => {
    // setUpdateLoadingState(true);
    setViewMoreStatus(false);
    setMoreLoadingState(true);
    let trace_id = localStorage.getItem('tbo_trace_id');

    axiosflightsearch
      .get('/?limit=' + limit + '&offset=' + offset, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        params: {
          number_of_adults: props.selectedBooking.pax.number_of_adults,
          number_of_children: props.selectedBooking.pax.number_of_children,
          number_of_infants: props.selectedBooking.pax.number_of_infants,
          check_in: props.selectedBooking.check_in,
          city_code: props.selectedBooking.origin_iata,
          destination_city_code: props.selectedBooking.destination_iata,
          flight_cabin_class: '1',
          trace_id: trace_id,
        },
      })
      .then((res) => {
        setMoreLoadingState(false);
        localStorage.setItem('tbo_trace_id', res.data.TraceId);
        // const flights
        let options = optionsJSX.slice();
        if (res.data.Results.length) {
          for (var i = 0; i < res.data.Results.length; i++) {
            options.push(
              <Flight
                itinerary_id={props.itinerary_id}
                data={res.data.Results[i]}
                selectedBooking={props.selectedBooking}
                _updateBookingHandler={_newUpdateBookingHandler}
              ></Flight>
            );
          }
          setOptionsJSX([...options]);
        }
        if (res.data.next_page) {
          setViewMoreStatus(true);
          setOffset(offset + 20);
        } else {
          setViewMoreStatus(false);
          setOffset(0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMoreLoadingState(false);
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
          show={props.showFlightModal}
          onHide={props.setHideFlightModal}
          // zIndex='1501'
        >
          <SectionOne
            setHideBookingModal={props.setHideBookingModal}
            setHideFlightModal={props.setHideFlightModal}
          ></SectionOne>

          <GridContainer style={{ clear: 'right' }}>
            <ContentContainer style={{ position: 'relative' }}>
              {updateLoadingState && !updateBookingState ? (
                <div
                  className="center-div"
                  style={{ width: 'max-content', margin: 'auto' }}
                >
                  <LoadingLottie height={'5rem'} width={'5rem'} margin="none" />
                  Fetching best fares
                </div>
              ) : null}
              {updateBookingState ? (
                <div
                  style={{
                    width: 'max-content',
                    margin: 'auto',
                    height: isPageWide ? '80vh' : '40vh',
                  }}
                  className="center-div font-lexend"
                >
                  <LoadingLottie height={'5rem'} width={'5rem'} margin="none" />
                  Please wait while we update your flight
                </div>
              ) : null}
              {!noResults && !updateLoadingState && !unauthorized ? (
                <OptionsContainer id="options">
                  <div style={{ clear: 'right' }}>
                    {optionsJSX.length && !updateBookingState
                      ? optionsJSX
                      : null}
                    {loading && !optionsJSX.length ? (
                      <div
                        style={{
                          width: 'max-content',
                          margin: 'auto',
                          height: isPageWide ? '80vh' : '40vh',
                        }}
                        className="center-div"
                      >
                        <LoadingLottie
                          height={'5rem'}
                          width={'5rem'}
                          margin="none"
                        />
                        Fetching best fares
                      </div>
                    ) : null}
                    {!loading && !optionsJSX.length ? (
                      <div
                        style={{
                          width: 'max-content',
                          margin: 'auto',
                          height: isPageWide ? '80vh' : '40vh',
                        }}
                        className="center-div"
                      >
                        Oops, it looks like there are no alternate flights
                        available.
                      </div>
                    ) : null}
                  </div>
                  {moreLoadingState ? (
                    <div style={{ width: 'max-content', margin: 'auto' }}>
                      <LoadingLottie
                        height={'5rem'}
                        width={'5rem'}
                        margin="none"
                      />
                    </div>
                  ) : null}
                  {viewMoreStatus && !updateBookingState ? (
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
                </OptionsContainer>
              ) : null}
              {unauthorized ? (
                <div
                  style={{
                    width: '100%',
                    margin: 'auto',
                    height: isPageWide ? '80vh' : '40vh',
                  }}
                  className="center-div text-center"
                >
                  Oops, this action is not allowed on another user's itinerary
                </div>
              ) : null}

              {noResults && !unauthorized ? (
                <p className="font-lexend text-center">
                  Oops, we couldn't find what you were searching!
                </p>
              ) : null}
            </ContentContainer>
          </GridContainer>
        </Drawer>
      </div>
    );
  else
    return (
      <div>
        <LogInModal show={true} onhide={props.setHideFlightModal}></LogInModal>
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
