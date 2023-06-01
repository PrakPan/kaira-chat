import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import PinSection from './PinSection';
import MidSection from './MidSection';
import { TaxiAlert } from '@mui/icons-material';
const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 30vw;
  }
  margin-bottom: 1.5rem;
`;

const Route = (props) => {
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
  console.log('props.transfers');

  console.log(props.transfers);
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
  let startingcity = null;
  let endingcity = null;
  if (props.breif)
    if (props.breif.city_slabs) {
      for (var i = 1; i < props.breif.city_slabs.length; i++) {
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
          locationsArr.push(
            <PinSection
              setCurrentPopup={props.setCurrentPopup}
              handlemap={handlemap}
              dayId={
                props.breif.city_slabs[i].day_slab_location.start_day_slab_index
              }
              setShowDrawer={props.setShowDrawer}
              setShowDrawerData={props.setShowDrawerData}
              cityData={props.breif.city_slabs[i]}
              dayslab={props.dayslab}
              lat={props.breif.city_slabs[i].lat}
              long={props.breif.city_slabs[i].long}
              Mapid={props.breif.city_slabs[i].gmaps_place_id}
              city={props.breif.city_slabs[i].city_name}
              cityId={props.breif.city_slabs[i].city_id}
              duration={
                props.breif.city_slabs[i].duration
                  ? props.breif.city_slabs[i].duration +
                    NoOfNights(props.breif.city_slabs[i].duration)
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
            <MidSection
              pinColour={props.breif.city_slabs[i].color}
              modes={
                props.transfers[i + 1].modes
                  ? props.transfers[i + 1].modes[0]
                  : 'Taxi'
              }
              icon={null}
              transportMode={props.breif.city_slabs[i].intracity_transport}
              duration={props.breif.city_slabs[i].duration}
            ></MidSection>
          );
        }
      }
      if (!startingcity) startingcity = props.breif.city_slabs[0].city_name;
      if (!endingcity)
        endingcity =
          props.breif.city_slabs[props.breif.city_slabs.length - 1].city_name;
    }
  return (
    <Container>
      <div className="font-lexend mb-4 lg:mb-10  mt-4 font-bold text-4xl">
        Route
      </div>

      <PinSection
        setCurrentPopup={props.setCurrentPopup}
        setShowDrawer={props.setShowDrawer}
        setShowDrawerData={props.setShowDrawerData}
        cityData={props.breif.city_slabs[0]}
        dayId={props.breif.city_slabs[0].day_slab_location.start_day_slab_index}
        setShowDrawer={props.setShowDrawer}
        setShowDrawerData={props.setShowDrawerData}
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
        city={props.nostartinglocation ? 'Your Location' : startingcity}
      ></PinSection>
      <MidSection
        pinColour={props.breif.city_slabs[0].color}
        modes={props.transfers[1].modes[0]}
        icon={props?.transfers[0]?.icon}
        transportMode={'Taxi'}
        duration={'2'}
      ></MidSection>

      {locationsArr}
      {/* <MidSection></MidSection>
             <PinSection location="Jaisalmer" duration="4 Nights"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Jodhour" duration="3 Nights"></PinSection>
             <MidSection></MidSection> */}
      <PinSection
        setCurrentPopup={props.setCurrentPopup}
        dayId={props.breif.city_slabs[0].day_slab_location.start_day_slab_index}
        setShowDrawer={props.setShowDrawer}
        setShowDrawerData={props.setShowDrawerData}
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
        city={props.nostartinglocation ? 'Your Location' : endingcity}
      ></PinSection>
    </Container>
  );
};

export default React.memo(Route);
