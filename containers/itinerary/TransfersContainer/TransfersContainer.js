import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as ga from '../../../services/ga/Index';
import { TaxiAlert } from '@mui/icons-material';
import TransferModeContainer from './TransferModeContainer';
import TaxiModal from '../../../components/modals/taxis/Index';
import FlightModal from '../../../components/modals/flights/Index';
import PinSection from '../../newitinerary/breif/route/PinSection';
const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 100%;
  }
  margin-bottom: 1.5rem;
`;

const TransfersContainer = (props) => {
  console.log('routes');

  console.log(props?.routes);
  // useEffect(() => {
  //   console.log(props.transferBookings);
  //   if (props.transferBookings)
  //     for (var i = 0; i < props.transferBookings.length; i++) {
  //       if (true) {
  //         let oldbooking = false;
  //         if (props.transferBookings[i].version === 'v1') oldbooking = true;
  //         if (props.traveleritinerary) oldbooking = true;
  //         let name = props.transferBookings[i]['name'];
  //         let costings_breakdown =
  //           props.transferBookings[i]['costings_breakdown'];
  //         let cost = props.transferBookings[i]['booking_cost'];
  //         let itinerary_id = props.transferBookings[i]['itinerary_id'];
  //         let itinerary_name = props.transferBookings[i]['itinerary_name'];
  //         let booking_type = props.transferBookings[i]['booking_type'];

  //         // let accommodation = props.transferBookings[i]["accommodation"];
  //         let tailored_id = props.transferBookings[i]['tailored_itinerary'];
  //         let id = props.transferBookings[i]['id'];
  //         let check_in = props.transferBookings[i]['check_in'];
  //         let check_out = props.transferBookings[i]['check_out'];
  //         let pax = {
  //           number_of_adults: props.transferBookings[i]['number_of_adults'],
  //           number_of_children: props.transferBookings[i]['number_of_children'],
  //           number_of_infants: props.transferBookings[i]['number_of_infants'],
  //         };
  //         let city = props.transferBookings[i]['city'];
  //         let room_type = props.transferBookings[i]['room_type'];
  //         let taxi_type = props.transferBookings[i]['taxi_type'];
  //         let transfer_type = props.transferBookings[i]['transfer_type'];
  //         let city_id = props.transferBookings[i]['city_id'];
  //         let destination_city = props.transferBookings[i]['destination_city'];
  //         let duration = props.transferBookings[i]['duration'];
  //         let origin_iata = props.transferBookings[i]['origin_city_iata_code'];
  //         let destination_iata =
  //           props.transferBookings[i]['destination_city_iata_code'];
  //         if (oldbooking) {
  //           bookings_transfers.push(
  //             <OldBookingCard
  //               payment={props.payment}
  //               key={i}
  //               setShowBookingModal={(props) =>
  //                 _changeBookingHandler(
  //                   name,
  //                   itinerary_id,
  //                   tailored_id,
  //                   accommodation,
  //                   id,
  //                   check_in,
  //                   check_out,
  //                   pax,
  //                   city,
  //                   room_type,
  //                   number_of_rooms,
  //                   itinerary_name
  //                 )
  //               }
  //               showBookingModal={props.showBookingModal}
  //               setHideBookingModal={props.setHideBookingModal}
  //               blur={props.blur}
  //               setImagesHandler={props.setImagesHandler}
  //               accommodation
  //               heading={props.transferBookings[i]['name']}
  //               details={props.transferBookings[i]['points']}
  //               rating={props.transferBookings[i]['user_rating']}
  //               setImagesHandler={_setImagesHandler}
  //               images={props.transferBookings[i]['images']}
  //             ></OldBookingCard>
  //           );
  //         } else {
  //           console.log(props.transferBookings[i].booking_type);
  //           if (props.transferBookings[i].booking_type === 'Taxi')
  //             bookings_transfers.push(
  //               <TaxiBookingCard
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 token={props.token}
  //                 setShowLoginModal={setShowLoginModal}
  //                 setShowTaxiModal={(props) =>
  //                   _changeTaxiHandler(
  //                     name,
  //                     itinerary_id,
  //                     tailored_id,
  //                     id,
  //                     check_in,
  //                     check_out,
  //                     pax,
  //                     city,
  //                     itinerary_name,
  //                     cost,
  //                     costings_breakdown,
  //                     origin_iata,
  //                     destination_iata,
  //                     destination_city,
  //                     taxi_type,
  //                     transfer_type
  //                   )
  //                 }
  //                 setShowLoginModal={setShowLoginModal}
  //                 token={props.token}
  //                 _deselectTransferBookingHandler={
  //                   props._deselectTransferBookingHandler
  //                 }
  //                 transferFlickityIndex={props.transferFlickityIndex}
  //                 is_selecting={
  //                   props.transferBookings[i].id === props.selectingBooking
  //                 }
  //                 data={props.transferBookings[i]}
  //                 cardUpdateLoading={props.cardUpdateLoading}
  //                 is_stock={props.is_stock}
  //                 _selectTaxiHandler={props._selectTaxiHandler}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 payment={props.payment}
  //                 key={i}
  //                 setImagesHandler={_setImagesHandler}
  //                 setHideTaxiModal={() => props.setShowTaxiModal(false)}
  //               ></TaxiBookingCard>
  //             );
  //           else if (props.transferBookings[i].booking_type === 'Bus')
  //             bookings_transfers.push(
  //               <BusBookingCard
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 setShowLoginModal={setShowLoginModal}
  //                 token={props.token}
  //                 _deselectTransferBookingHandler={
  //                   props._deselectTransferBookingHandler
  //                 }
  //                 transferFlickityIndex={props.transferFlickityIndex}
  //                 is_selecting={
  //                   props.transferBookings[i].id === props.selectingBooking
  //                 }
  //                 data={props.transferBookings[i]}
  //                 cardUpdateLoading={props.cardUpdateLoading}
  //                 is_stock={props.is_stock}
  //                 _selectTaxiHandler={props._selectTaxiHandler}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 payment={props.payment}
  //                 key={i}
  //                 setImagesHandler={_setImagesHandler}
  //               ></BusBookingCard>
  //             );
  //           else if (props.transferBookings[i].booking_type === 'Ferry')
  //             bookings_transfers.push(
  //               <FerryBookingCard
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 token={props.token}
  //                 setShowLoginModal={setShowLoginModal}
  //                 setShowTaxiModal={(props) =>
  //                   _changeTaxiHandler(
  //                     name,
  //                     itinerary_id,
  //                     tailored_id,
  //                     id,
  //                     check_in,
  //                     check_out,
  //                     pax,
  //                     city,
  //                     itinerary_name,
  //                     cost,
  //                     costings_breakdown,
  //                     origin_iata,
  //                     destination_iata,
  //                     destination_city,
  //                     taxi_type,
  //                     transfer_type
  //                   )
  //                 }
  //                 setShowLoginModal={setShowLoginModal}
  //                 token={props.token}
  //                 _deselectTransferBookingHandler={
  //                   props._deselectTransferBookingHandler
  //                 }
  //                 transferFlickityIndex={props.transferFlickityIndex}
  //                 is_selecting={
  //                   props.transferBookings[i].id === props.selectingBooking
  //                 }
  //                 data={props.transferBookings[i]}
  //                 cardUpdateLoading={props.cardUpdateLoading}
  //                 is_stock={props.is_stock}
  //                 _selectTaxiHandler={props._selectTaxiHandler}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 payment={props.payment}
  //                 key={i}
  //                 setImagesHandler={_setImagesHandler}
  //                 setHideTaxiModal={() => props.setShowTaxiModal(false)}
  //               ></FerryBookingCard>
  //             );
  //           else if (props.transferBookings[i].booking_type === 'Rental')
  //             bookings_transfers.push(
  //               <TaxiBookingCard
  //                 rental
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 token={props.token}
  //                 setShowLoginModal={setShowLoginModal}
  //                 setShowTaxiModal={(props) =>
  //                   _changeTaxiHandler(
  //                     name,
  //                     itinerary_id,
  //                     tailored_id,
  //                     id,
  //                     check_in,
  //                     check_out,
  //                     pax,
  //                     city,
  //                     itinerary_name,
  //                     cost,
  //                     costings_breakdown,
  //                     origin_iata,
  //                     destination_iata,
  //                     destination_city,
  //                     taxi_type,
  //                     transfer_type
  //                   )
  //                 }
  //                 setShowLoginModal={setShowLoginModal}
  //                 token={props.token}
  //                 _deselectTransferBookingHandler={
  //                   props._deselectTransferBookingHandler
  //                 }
  //                 transferFlickityIndex={props.transferFlickityIndex}
  //                 is_selecting={
  //                   props.transferBookings[i].id === props.selectingBooking
  //                 }
  //                 data={props.transferBookings[i]}
  //                 cardUpdateLoading={props.cardUpdateLoading}
  //                 is_stock={props.is_stock}
  //                 _selectTaxiHandler={props._selectTaxiHandler}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 payment={props.payment}
  //                 key={i}
  //                 setImagesHandler={_setImagesHandler}
  //                 setHideTaxiModal={() => props.setShowTaxiModal(false)}
  //               ></TaxiBookingCard>
  //             );
  //         }
  //       }

  //       // setAlternates(alternatesarr);
  //       setBookingTransfersDesktopJSX([...bookings_transfers]);
  //       setBookingTransfersMobileJSX(
  //         <Flickity
  //           initialIndex={props.transferFlickityIndex}
  //           cards={[...bookings_transfers]}
  //         ></Flickity>
  //       );
  //     }
  // }, [
  //   props.transferBookings,
  //   props.cardUpdateLoading,
  //   props.selectingBooking,
  //   props.token,
  //   props.payment,
  // ]);

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
    props.setShowFlightModal(true);
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
    if (url) {
      const fileName = url.substring(
        url.lastIndexOf('/') + 1,
        url.lastIndexOf('.')
      );
      const firstLetter = fileName.charAt(0).toUpperCase();
      const restOfWord = fileName.slice(1);
      const transportationType = firstLetter + restOfWord;
      return transportationType;
    } else {
      return url;
    }
  }
  function NoOfNights(days) {
    if (days > 1) {
      return ' Nights';
    } else {
      return ' Night';
    }
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
  if (!props.transfers) {
    if (props.breif.city_slabs[i].is_departure_only)
      startingcity = props.breif.city_slabs[0].city_name;
    if (props.breif.city_slabs[i].is_trip_terminated)
      endingcity = props.breif.city_slabs[i].city_name;
    if (props.breif.city_slabs) {
      for (var i = 1; i < props.transfers.length; i++) {
        //If duration present and not 0, not trip terminated or departure only city show in route
        if (props.transfers['id']) {
          if (props?.routes[i - 1]) {
            locationsArr.push(
              <PinSection
                setCurrentPopup={false}
                handlemap={handlemap}
                dayId={
                  props.routes[i - 1]?.day_slab_location?.start_day_slab_index
                }
                cityData={props.routes[i - 1]}
                dayslab={props.dayslab}
                lat={props.routes[i - 1]?.lat}
                long={props.routes[i - 1]?.long}
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
                        index={i + 1}
                        icon={props?.transfers[i + 1]?.icon}
                        modes={getTransportationType(
                          props?.transfers[i + 1]?.icon
                        )}
                        transferbookings={props.transferBookings}
                        _changeTaxiHandler={_changeTaxiHandler}
                        setShowTaxiModal={props.setShowTaxiModal}
                        userSelected={props?.transferBookings[i]?.user_selected}
                        icon={props?.transferBookings[i + 1]?.images?.image}
                        taxi_type={props?.transferBookings[i + 1]?.taxi_type}
                        transportMode={getTransportationType(
                          props?.transfers[i + 1]?.icon
                        )}
                        duration={props.breif.city_slabs[i].duration}
                      ></TransferModeContainer>
                      <TransferModeContainer
                        booking_type={props?.transferBookings[i]?.booking_type}
                        transferbookings={props.transferBookings}
                        _changeTaxiHandler={_changeTaxiHandler}
                        setShowTaxiModal={props.setShowTaxiModal}
                        pinColour={props.breif.city_slabs[i].color}
                        costings_breakdown={
                          props?.transferBookings[i]?.costings_breakdown
                        }
                        booking={props?.transferBookings[i]}
                        index={i}
                        heading={
                          props?.transferBookings[i]?.booking_display_name
                        }
                        userSelected={props?.transferBookings[i]?.user_selected}
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
                        userSelected={props?.transferBookings[i]?.user_selected}
                        transferbookings={props.transferBookings}
                        _changeTaxiHandler={_changeTaxiHandler}
                        setShowTaxiModal={props.setShowTaxiModal}
                        icon={props?.transfers[i]?.icon}
                        index={i}
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
                    setShowBookingModal={props?.setShowBookingModal}
                    taxi_type={props?.transferBookings[i]?.taxi_type}
                    userSelected={props?.transferBookings[i]?.user_selected}
                    index={i}
                    transferbookings={props.transferBookings}
                    _changeTaxiHandler={_changeTaxiHandler}
                    setShowTaxiModal={props.setShowTaxiModal}
                    transportMode={
                      props.breif.city_slabs[i].intracity_transport
                    }
                    index={i}
                    duration={props.breif.city_slabs[i].duration}
                  ></TransferModeContainer>
                );
            }
          }
        }
      }
      // for (var i = 1; i < props.transferBookings.length; i++) {
      //   //If duration present and not 0, not trip terminated or departure only city show in route

      //   locationsArr.push(
      //     <PinSection
      //       setCurrentPopup={false}
      //       handlemap={handlemap}
      //       cityData={props.routes[i - 1]}
      //       dayslab={props.dayslab}
      //       lat={props.routes[i - 1]?.lat}
      //       long={props.routes[i - 1]?.long}
      //       Mapid={props.routes[i - 1].gmaps_place_id}
      //       city={props.transferBookings[i].destination_city	}
      //       cityId={props.routes[i - 1].city_id}
      //       duration={
      //         props.breif.city_slabs[i - 1].duration
      //           ? props.breif.city_slabs[i - 1].duration + ' Nights'
      //           : null
      //       }
      //       pinColour={props.routes[i - 1].color}
      //       data={order[i - 1]}
      //       _moveDownHandler={_moveDownHandler}
      //       _moveUpHandler={_moveUpHandler}
      //       index={i - 1}
      //     ></PinSection>
      //   );
      //   // midsectionHandler(
      //   //   props?.transferBookings[i],
      //   //   props?.transferBookings[i - 1]
      //   // );
      //   {
      //     props?.transferBookings &&
      //     props?.transferBookings[i]?.booking_type == 'Flight'
      //       ? locationsArr.push(
      //           <div className="flex flex-col gap-1">
      //             <TransferModeContainer
      //               booking_type={props?.transferBookings[i + 1]?.booking_type}
      //               pinColour={props.breif.city_slabs[i].color}
      //               costings_breakdown={
      //                 props?.transferBookings[i + 1]?.costings_breakdown
      //               }
      //               booking={props?.transferBookings[i + 1]}
      //               heading={
      //                 props?.transferBookings[i + 1]?.booking_display_name
      //               }
      //               index={i + 1}
      //               icon={props?.transfers[i + 1]?.icon}
      //               modes={getTransportationType(props?.transfers[i + 1]?.icon)}
      //               transferbookings={props.transferBookings}
      //               _changeTaxiHandler={_changeTaxiHandler}
      //               setShowTaxiModal={props.setShowTaxiModal}
      //               icon={props?.transferBookings[i + 1]?.images?.image}
      //               taxi_type={props?.transferBookings[i + 1]?.taxi_type}
      //               transportMode={getTransportationType(
      //                 props?.transfers[i + 1]?.icon
      //               )}
      //               duration={props.breif.city_slabs[i].duration}
      //             ></TransferModeContainer>
      //             <TransferModeContainer
      //               booking_type={props?.transferBookings[i]?.booking_type}
      //               transferbookings={props.transferBookings}
      //               _changeTaxiHandler={_changeTaxiHandler}
      //               setShowTaxiModal={props.setShowTaxiModal}
      //               pinColour={props.breif.city_slabs[i].color}
      //               costings_breakdown={
      //                 props?.transferBookings[i]?.costings_breakdown
      //               }
      //               booking={props?.transferBookings[i]}
      //               index={i}
      //               heading={props?.transferBookings[i]?.booking_display_name}
      //               icon={props?.transfers[i]?.icon}
      //               modes={getTransportationType(props?.transfers[i]?.icon)}
      //               icon={props?.transferBookings[i]?.images?.image}
      //               taxi_type={props?.transferBookings[i]?.taxi_type}
      //               transportMode={getTransportationType(
      //                 props?.transfers[i]?.icon
      //               )}
      //               duration={props.breif.city_slabs[i].duration}
      //             ></TransferModeContainer>
      //           </div>
      //         )
      //       : locationsArr.push(
      //           props?.transferBookings && (
      //             <TransferModeContainer
      //               booking_type={props?.transferBookings[i]?.booking_type}
      //               pinColour={props.breif.city_slabs[i].color}
      //               costings_breakdown={
      //                 props?.transferBookings[i]?.costings_breakdown
      //               }
      //               heading={props?.transferBookings[i]?.booking_display_name}
      //               transferbookings={props.transferBookings}
      //               _changeTaxiHandler={_changeTaxiHandler}
      //               setShowTaxiModal={props.setShowTaxiModal}
      //               icon={props?.transfers[i]?.icon}
      //               index={i}
      //               booking={props?.transferBookings[i]}
      //               modes={getTransportationType(props?.transfers[i]?.icon)}
      //               icon={props?.transferBookings[i]?.images?.image}
      //               taxi_type={props?.transferBookings[i]?.taxi_type}
      //               transportMode={getTransportationType(
      //                 props?.transfers[i]?.icon
      //               )}
      //               duration={props.breif.city_slabs[i].duration}
      //             ></TransferModeContainer>
      //           )
      //         );
      //   }

      //   // locationsArr.push(
      //   //   <TransferModeContainer
      //   //     pinColour={props.breif.city_slabs[i].color}
      //   //     icon={props?.transfers[i]?.icon}
      //   //     modes={
      //   //       props?.transfers[i]?.modes[1]
      //   //         ? props?.transfers[i]?.modes[1]
      //   //         : props?.transfers[i]?.modes[0]
      //   //     }
      //   //     icon={props?.transferBookings[i]?.images?.image}
      //   //     taxi_type={props?.transferBookings[i]?.taxi_type}
      //   //     transportMode={
      //   //       props?.transfers[i]?.modes[1]
      //   //         ? props?.transfers[i]?.modes[1]
      //   //         : props?.transfers[i]?.modes[0]
      //   //     }
      //   //     duration={props.breif.city_slabs[i].duration}
      //   //   ></TransferModeContainer>
      //   // );
      // }
    }
  } else {
    if (props?.transferBookings) {
      for (var i = 1; i < props.transferBookings.length; i++) {
        locationsArr.push(
          <PinSection
            setCurrentPopup={false}
            city={props?.transferBookings[i - 1]?.destination_city}
            duration={
              props?.breif?.city_slabs[i]?.duration
                ? props?.breif?.city_slabs[i]?.duration +
                  NoOfNights(props?.breif?.city_slabs[i]?.duration)
                : null
            }
            pinColour={props?.breif?.city_slabs[i]?.color}
            index={i}
          ></PinSection>
        );
        // midsectionHandler(
        //   props?.transferBookings[i],
        //   props?.transferBookings[i - 1]
        // );
        {
          props?.transferBookings &&
          props?.transferBookings[i].booking_type === 'Flight'
            ? locationsArr.push(
                <div className="flex flex-col gap-1">
                  <TransferModeContainer
                    booking_type={props?.transferBookings[i]?.booking_type}
                    pinColour={props.breif.city_slabs[i].color}
                    costings_breakdown={
                      props?.transferBookings[i]?.costings_breakdown
                    }
                    booking={props?.transferBookings[i]}
                    heading={props?.transferBookings[i]?.booking_display_name}
                    index={i}
                    icon={props?.transfers[i]?.icon}
                    modes={getTransportationType(props?.transfers[i]?.icon)}
                    transferbookings={props.transferBookings}
                    _changeFlightHandler={_changeFlightHandler}
                    _changeTaxiHandler={_changeTaxiHandler}
                    setShowTaxiModal={props.setShowTaxiModal}
                    userSelected={props?.transferBookings[i]?.user_selected}
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
                    pinColour={props?.breif?.city_slabs[i]?.color}
                    costings_breakdown={
                      props?.transferBookings[i]?.costings_breakdown
                    }
                    heading={props?.transferBookings[i]?.booking_display_name}
                    transferbookings={props.transferBookings}
                    _changeTaxiHandler={_changeTaxiHandler}
                    _changeFlightHandler={_changeFlightHandler}
                    setShowTaxiModal={props.setShowTaxiModal}
                    icon={props?.transfers[i]?.icon}
                    index={i}
                    booking={props?.transferBookings[i]}
                    userSelected={props?.transferBookings[i]?.user_selected}
                    modes={getTransportationType(props?.transfers[i]?.icon)}
                    icon={props?.transferBookings[i]?.images?.image}
                    taxi_type={props?.transferBookings[i]?.taxi_type}
                    transportMode={getTransportationType(
                      props?.transfers[i]?.icon
                    )}
                    duration={props?.breif?.city_slabs[i]?.duration}
                  ></TransferModeContainer>
                )
              );
        }
      }
    }
  }
  console.log('locationsArr');
  console.log(locationsArr);
  return (
    <Container id="Transfer_Container">
      <div className="cursor-pointer font-lexend mb-8  mt-8 font-bold text-4xl group text-[#262626] transition duration-300 max-w-fit">
        Transfers{' '}
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.showFlightModal ? (
        <FlightModal
          getPaymentHandler={props.getPaymentHandler}
          _updateFlightBookingHandler={props._updateFlightBookingHandler}
          _updateBookingHandler={props._updateBookingHandler}
          itinerary_id={
            props?.transferBookings[0]
              ? props?.transferBookings[0]['itinerary_id']
              : null
          }
          setHideFlightModal={props.setHideFlightModal}
          alternates={selectedBooking.id}
          tailored_id={selectedBooking['tailored_itinerary']}
          _updatePaymentHandler={props._updatePaymentHandler}
          _updateFlightHandler={props._updateFlightHandler}
          setHideBookingModal={props.setHideBookingModal}
          selectedBooking={selectedBooking}
          setShowFlightModal={props.setShowFlightModal}
          showFlightModal={props.showFlightModal}
        ></FlightModal>
      ) : null}
      {props.showTaxiModal ? (
        <TaxiModal
          getPaymentHandler={props.getPaymentHandler}
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          setHideBookingModal={props.setHideBookingModal}
          setHideTaxiModal={() => props.setShowTaxiModal(false)}
          showTaxiModal={props.showTaxiModal}
          _updatePaymentHandler={props._updatePaymentHandler}
          selectedBooking={selectedBooking}
        ></TaxiModal>
      ) : null}
      {props?.transferBookings && (
        <>
          <PinSection
            setCurrentPopup={false}
            cityData={props.breif.city_slabs[0]}
            dayId={
              props.breif.city_slabs[0].day_slab_location.start_day_slab_index
            }
            cityData={props.breif.city_slabs[0]}
            dayslab={props.dayslab}
            lat={props.breif.city_slabs[0].lat}
            long={props.breif.city_slabs[0].long}
            Mapid={props.breif.city_slabs[0].gmaps_place_id}
            city={props.breif.city_slabs[0].city_name}
            cityId={props.breif.city_slabs[0].city_id}
            duration={
              props.breif.city_slabs[0].duration
                ? props.breif.city_slabs[0].duration +
                  NoOfNights(props.breif.city_slabs[0].duration)
                : null
            }
            pinColour={props.breif.city_slabs[0].color}
            dayslab={props.dayslab}
          ></PinSection>

          <TransferModeContainer
            booking_type={props?.transferBookings[0]?.booking_type}
            setShowBookingModal={props.setShowBookingModal}
            pinColour={props.breif.city_slabs[0].color}
            heading={props?.transferBookings[0]?.booking_display_name}
            costings_breakdown={props?.transferBookings[0]?.costings_breakdown}
            modes={'Taxi'}
            transferbookings={props.transferBookings}
            booking={props.transferBookings[0]}
            _changeTaxiHandler={_changeTaxiHandler}
            _changeFlightHandler={_changeFlightHandler}
            setShowTaxiModal={props.setShowTaxiModal}
            index={0}
            icon={props?.transferBookings[0]?.images?.image}
            taxi_type={props?.transferBookings[0]?.taxi_type}
            transportMode={'Taxi'}
            duration={'2'}
          />

          {locationsArr}
          {/* <TransferModeContainer></TransferModeContainer>
             <PinSection location="Jaisalmer" duration="4 Nights"></PinSection>
             <TransferModeContainer></TransferModeContainer>
             <PinSection location="Jodhour" duration="3 Nights"></PinSection>
             <TransferModeContainer></TransferModeContainer> */}
          <PinSection
            setCurrentPopup={false}
            dayId={
              props.breif.city_slabs[0].day_slab_location.start_day_slab_index
            }
            cityData={props.breif.city_slabs[0]}
            dayslab={props.dayslab}
            lat={props.breif.city_slabs[0].lat}
            long={props.breif.city_slabs[0].long}
            Mapid={props.breif.city_slabs[0].gmaps_place_id}
            city={props.breif.city_slabs[0].city_name}
            cityId={props.breif.city_slabs[0].city_id}
            duration={
              props.breif.city_slabs[0].duration
                ? props.breif.city_slabs[0].duration +
                  NoOfNights(props.breif.city_slabs[0].duration)
                : null
            }
            pinColour={props.breif.city_slabs[0].color}
          ></PinSection>
        </>
      )}
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
