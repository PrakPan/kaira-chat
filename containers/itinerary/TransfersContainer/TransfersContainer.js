import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { TaxiAlert } from '@mui/icons-material';
import TransferModeContainer from './TransferModeContainer';
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
            locationsArr.push(
              <TransferModeContainer
                pinColour={props.breif.city_slabs[i].color}
                icon={props?.transfers[i]?.icon}
                modes={
                  props?.transfers[i]?.modes[1]
                    ? props?.transfers[i]?.modes[1]
                    : props?.transfers[i]?.modes[0]
                }
                icon={props?.transferBookings[i]?.images?.image}
                taxi_type={props?.transferBookings[i]?.taxi_type}
                transportMode={
                  props?.transfers[i]?.modes[1]
                    ? props?.transfers[i]?.modes[1]
                    : props?.transfers[i]?.modes[0]
                }
                duration={props.breif.city_slabs[i].duration}
              ></TransferModeContainer>
            );
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
            locationsArr.push(
              <TransferModeContainer
                pinColour={props.breif.city_slabs[i].color}
                modes={'Taxi'}
                icon={props?.transferBookings[i]?.images?.image}
                taxi_type={props?.transferBookings[i]?.taxi_type}
                transportMode={props.breif.city_slabs[i].intracity_transport}
                duration={props.breif.city_slabs[i].duration}
              ></TransferModeContainer>
            );
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
      <div className="font-lexend mb-4 mt-2 font-bold text-4xl">Route</div>

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

      <TransferModeContainer
        pinColour={props.breif.city_slabs[0].color}
        modes={'Taxi'}
        icon={props?.transferBookings[0]?.images?.image}
        taxi_type={props?.transferBookings[0]?.taxi_type}
        transportMode={'Taxi'}
        duration={'2'}
      ></TransferModeContainer>

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

export default React.memo(TransfersContainer);
