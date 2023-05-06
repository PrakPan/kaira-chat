import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ga from '../../../services/ga/Index';
import { TaxiAlert } from '@mui/icons-material';
import TransferModeContainer from './TransferModeContainer';
import TaxiModal from '../../../components/modals/taxis/Index';
import PinSection from '../../newitinerary/breif/route/PinSection';
const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 100%;
  }
  margin-bottom: 1.5rem;
`;

const TransfersContainer = (props) => {
  console.log('transfersBooking');
  console.log(props.transferBookings);
  //Stores initial order of locations
  const initialorder = {
    0: {
      location: 'Jodhpur',
      duration: '1 Night',
    },
    1: {
      location: 'Jaisalmer',
      duration: '2 Nights',
    },
    2: {
      location: 'Jodhpur',
      duration: '1 Night',
    },
  };
  let locationsArr = [];

  const [order, setOrder] = useState(initialorder);
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const _moveDownHandler = (index) => {
    if (index === 3) {
      //Last Item, disbale button
    } else
      setOrder({
        ...order,
        [index]: order[index + 1],
        [index + 1]: order[index],
      });
  };
  const _changeBookingHandler = (
    name,
    itinerary_id,
    tailored_id,
    accommodation,
    id,
    check_in,
    check_out,
    pax,
    city,
    room_type,
    number_of_rooms,
    itinerary_name,
    cost,
    costings_breakdown,
    images
  ) => {
    ga.event({
      action: 'Itinerary-bookings-acc_change',
      params: { name: name },
    });

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
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      images: images,
    });
    props.setShowBookingModal();
  };
  const _changeFlightHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata
  ) => {
    ga.event({
      action: 'Itinerary-bookings-flight_change',
      params: { name: name },
    });
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
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
    });
    props.setShowFlightModal();
  };
  const _changeTaxiHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata,
    destination_city,
    taxi_type,
    transfer_type
  ) => {
    ga.event({
      action: 'Itinerary-bookings-taxi_change',
      params: { name: name },
    });
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
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
      destination_city: destination_city,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
    });
    props.setShowTaxiModal(true);
  };
  function getTransportationType(url) {
    const fileName = url.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    const firstLetter = fileName.charAt(0).toUpperCase();
    const restOfWord = fileName.slice(1);
    const transportationType = firstLetter + restOfWord;
    return transportationType;
  }
  function scrollToTargetAdjusted() {
    // if (window.location.pathname === '/') {
    //   router.push({ pathname: '/locations', query: { scroll: target } });
    //   return;
    // }
    // console.log(`lool${target}`);
    const element = document.getElementById('MapcontainerRoute');
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
  function handlemap(MapId) {
    props.setPlaceID(MapId);
    scrollToTargetAdjusted();
    console.log(`id mapp${props.active}`);
  }

  const _moveUpHandler = (index) => {
    if (index === 1) {
      //First item, disable button
    } else {
      setOrder({
        ...order,
        [index]: order[index - 1],
        [index - 1]: order[index],
      });
    }
  };
  const midsectionHandler = (data, prevdata) => {};
  let startingcity = null;
  let endingcity = null;
  if (props.breif)
    if (props.breif.city_slabs) {
      
      for (var i = 0; i < props.breif.city_slabs.length; i++) {
        if (props.breif.city_slabs[i].is_departure_only)
          startingcity = props.breif.city_slabs[0].city_name;
        if (props.breif.city_slabs[i].is_trip_terminated)
          endingcity = props.breif.city_slabs[i].city_name;
        //If duration present and not 0, not trip terminated or departure only city show in route
        if (
          !props.breif.city_slabs[i].is_trip_terminated &&
          !props.breif.city_slabs[i].is_departure_only &&
          !props.breif.city_slabs[i].is_departure_only &&
          props.breif.city_slabs[i].duration &&
          props.breif.city_slabs[i].duration !== '0'
        ) {
          
          if (props.routes.length >= 1) {
            locationsArr.push(
              <PinSection
                setCurrentPopup={false}
                handlemap={handlemap}
                setShowTaxiModal={(props) =>
                  _changeTaxiHandler(
                    name,
                    itinerary_id,
                    tailored_id,
                    id,
                    check_in,
                    check_out,
                    pax,
                    city,
                    itinerary_name,
                    cost,
                    costings_breakdown,
                    origin_iata,
                    destination_iata,
                    destination_city,
                    taxi_type,
                    transfer_type
                  )
                }
                dayId={
                  props.routes[i - 1].day_slab_location.start_day_slab_index
                }
                cityData={props.routes[i - 1]}
                dayslab={props.dayslab}
                lat={props.routes[i - 1].lat}
                long={props.routes[i - 1].long}
                Mapid={props.routes[i - 1].gmaps_place_id}
                city={props.routes[i - 1].city_name}
                cityId={props.routes[i - 1].city_id}
                duration={
                  props.breif.city_slabs[i - 1].duration
                    ? props.breif.city_slabs[i - 1].duration + ' Nights'
                    : null
                }
                pinColour={props.routes[i - 1].color}
                data={order[i - 1]}
                _moveDownHandler={_moveDownHandler}
                _moveUpHandler={_moveUpHandler}
                index={i - 1}
              ></PinSection>
            );
            // midsectionHandler(
            //   props?.transferBookings[i],
            //   props?.transferBookings[i - 1]
            // );
            {
              props?.transferBookings &&
              props?.transferBookings[i]?.booking_type == 'Flight'
                ? locationsArr.push(
                    <div className="flex flex-col gap-1">
                      <TransferModeContainer
                        booking_type={
                          props?.transferBookings[i + 1]?.booking_type
                        }
                        pinColour={props.breif.city_slabs[i].color}
                        costings_breakdown={
                          props?.transferBookings[i + 1]?.costings_breakdown
                        }
                        booking={props?.transferBookings[i + 1]}
                        heading={
                          props?.transferBookings[i + 1]?.booking_display_name
                        }
                        icon={props?.transfers[i + 1]?.icon}
                        modes={getTransportationType(
                          props?.transfers[i + 1]?.icon
                        )}
                        icon={props?.transferBookings[i + 1]?.images?.image}
                        taxi_type={props?.transferBookings[i + 1]?.taxi_type}
                        transportMode={getTransportationType(
                          props?.transfers[i + 1]?.icon
                        )}
                        duration={props.breif.city_slabs[i].duration}
                      ></TransferModeContainer>
                      <TransferModeContainer
                        booking_type={props?.transferBookings[i]?.booking_type}
                        pinColour={props.breif.city_slabs[i].color}
                        costings_breakdown={
                          props?.transferBookings[i]?.costings_breakdown
                        }
                        booking={props?.transferBookings[i]}
                        heading={
                          props?.transferBookings[i]?.booking_display_name
                        }
                        icon={props?.transfers[i]?.icon}
                        modes={getTransportationType(props?.transfers[i]?.icon)}
                        icon={props?.transferBookings[i]?.images?.image}
                        taxi_type={props?.transferBookings[i]?.taxi_type}
                        transportMode={getTransportationType(
                          props?.transfers[i]?.icon
                        )}
                        duration={props.breif.city_slabs[i].duration}
                      ></TransferModeContainer>
                    </div>
                  )
                : locationsArr.push(
                    props?.transferBookings && (
                      <TransferModeContainer
                        booking_type={props?.transferBookings[i]?.booking_type}
                        pinColour={props.breif.city_slabs[i].color}
                        costings_breakdown={
                          props?.transferBookings[i]?.costings_breakdown
                        }
                        heading={
                          props?.transferBookings[i]?.booking_display_name
                        }
                        icon={props?.transfers[i]?.icon}
                        booking={props?.transferBookings[i]}
                        modes={getTransportationType(props?.transfers[i]?.icon)}
                        icon={props?.transferBookings[i]?.images?.image}
                        taxi_type={props?.transferBookings[i]?.taxi_type}
                        transportMode={getTransportationType(
                          props?.transfers[i]?.icon
                        )}
                        duration={props.breif.city_slabs[i].duration}
                      ></TransferModeContainer>
                    )
                  );
            }

            // locationsArr.push(
            //   <TransferModeContainer
            //     pinColour={props.breif.city_slabs[i].color}
            //     icon={props?.transfers[i]?.icon}
            //     modes={
            //       props?.transfers[i]?.modes[1]
            //         ? props?.transfers[i]?.modes[1]
            //         : props?.transfers[i]?.modes[0]
            //     }
            //     icon={props?.transferBookings[i]?.images?.image}
            //     taxi_type={props?.transferBookings[i]?.taxi_type}
            //     transportMode={
            //       props?.transfers[i]?.modes[1]
            //         ? props?.transfers[i]?.modes[1]
            //         : props?.transfers[i]?.modes[0]
            //     }
            //     duration={props.breif.city_slabs[i].duration}
            //   ></TransferModeContainer>
            // );
          } else {
            locationsArr.push(
              <PinSection
                setShowTaxiModal={(props) =>
                  _changeTaxiHandler(
                    name,
                    itinerary_id,
                    tailored_id,
                    id,
                    check_in,
                    check_out,
                    pax,
                    city,
                    itinerary_name,
                    cost,
                    costings_breakdown,
                    origin_iata,
                    destination_iata,
                    destination_city,
                    taxi_type,
                    transfer_type
                  )
                }
                setCurrentPopup={false}
                handlemap={handlemap}
                dayId={
                  props.breif.city_slabs[i].day_slab_location
                    .start_day_slab_index
                }
                cityData={props.breif.city_slabs[i]}
                dayslab={props.dayslab}
                lat={props.breif.city_slabs[i].lat}
                long={props.breif.city_slabs[i].long}
                Mapid={props.breif.city_slabs[i].gmaps_place_id}
                city={props.breif.city_slabs[i].city_name}
                cityId={props.breif.city_slabs[i].city_id}
                duration={
                  props.breif.city_slabs[i].duration
                    ? props.breif.city_slabs[i].duration + ' Night'
                    : null
                }
                pinColour={props.breif.city_slabs[i].color}
                data={order[i]}
                _moveDownHandler={_moveDownHandler}
                _moveUpHandler={_moveUpHandler}
                index={i}
              ></PinSection>
            );
            {
              props?.transferBookings &&
                locationsArr.push(
                  <TransferModeContainer
                    pinColour={props.breif.city_slabs[i].color}
                    modes={'Taxi'}
                    icon={props?.transferBookings[i]?.images?.image}
                    taxi_type={props?.transferBookings[i]?.taxi_type}
                    transportMode={
                      props.breif.city_slabs[i].intracity_transport
                    }
                    duration={props.breif.city_slabs[i].duration}
                  ></TransferModeContainer>
                );
            }
          }
        }
      }
      if (!startingcity) startingcity = props.breif.city_slabs[0].city_name;
      if (!endingcity)
        endingcity =
          props.breif.city_slabs[props.breif.city_slabs.length - 1].city_name;
    }
  return (
    <Container>
      <div className="cursor-pointer font-lexend mb-8  mt-8 font-bold text-4xl group text-[#262626] transition duration-300 max-w-fit">
        Transfers{' '}
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.showTaxiModal ? (
        <TaxiModal
          getPaymentHandler={props.getPaymentHandler}
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          setHideTaxiModal={() => props.setShowTaxiModal(false)}
          showTaxiModal={props.showTaxiModal}
          _updatePaymentHandler={props._updatePaymentHandler}
          selectedBooking={selectedBooking}
        ></TaxiModal>
      ) : null}
      <PinSection
        setCurrentPopup={false}
        cityData={props.breif.city_slabs[0]}
        dayId={props.breif.city_slabs[0].day_slab_location.start_day_slab_index}
        cityData={props.breif.city_slabs[0]}
        dayslab={props.dayslab}
        lat={props.breif.city_slabs[0].lat}
        long={props.breif.city_slabs[0].long}
        Mapid={props.breif.city_slabs[0].gmaps_place_id}
        city={props.breif.city_slabs[0].city_name}
        cityId={props.breif.city_slabs[0].city_id}
        duration={
          props.breif.city_slabs[0].duration
            ? props.breif.city_slabs[0].duration + ' Night'
            : null
        }
        pinColour={props.breif.city_slabs[0].color}
        dayslab={props.dayslab}
        city={props.nostartinglocation ? 'Your Location' : startingcity}
      ></PinSection>
      {props?.transferBookings && (
        <TransferModeContainer
          booking_type={props?.transferBookings[0]?.booking_type}
          pinColour={props.breif.city_slabs[0].color}
          heading={props?.transferBookings[0]?.booking_display_name}
          costings_breakdown={props?.transferBookings[0]?.costings_breakdown}
          modes={'Taxi'}
          icon={props?.transferBookings[0]?.images?.image}
          taxi_type={props?.transferBookings[0]?.taxi_type}
          transportMode={'Taxi'}
          duration={'2'}
        ></TransferModeContainer>
      )}

      {locationsArr}
      {/* <TransferModeContainer></TransferModeContainer>
             <PinSection location="Jaisalmer" duration="4 Nights"></PinSection>
             <TransferModeContainer></TransferModeContainer>
             <PinSection location="Jodhour" duration="3 Nights"></PinSection>
             <TransferModeContainer></TransferModeContainer> */}
      <PinSection
        setCurrentPopup={false}
        dayId={props.breif.city_slabs[0].day_slab_location.start_day_slab_index}
        cityData={props.breif.city_slabs[0]}
        dayslab={props.dayslab}
        lat={props.breif.city_slabs[0].lat}
        long={props.breif.city_slabs[0].long}
        Mapid={props.breif.city_slabs[0].gmaps_place_id}
        city={props.breif.city_slabs[0].city_name}
        cityId={props.breif.city_slabs[0].city_id}
        duration={
          props.breif.city_slabs[0].duration
            ? props.breif.city_slabs[0].duration + ' Night'
            : null
        }
        pinColour={props.breif.city_slabs[0].color}
        city={props.nostartinglocation ? 'Your Location' : endingcity}
      ></PinSection>
    </Container>
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
export default connect(mapStateToPros, mapDispatchToProps)(TransfersContainer);
