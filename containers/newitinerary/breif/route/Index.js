
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PinSection from './PinSection';
import MidSection from './MidSection';
const Container = styled.div`

  @media screen and (min-width: 768px) {
    width:30vw;
  
  }
  margin-bottom: 1.5rem;
`;
const Heading = styled.p`
  font-size: 25px;
  font-weight: 600;
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
  function handlemap(MapId){
    props.setPlaceID(MapId)
    scrollToTargetAdjusted()
    console.log(`id mapp${props.active}`)
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
          console.log(
            'colorsssssssssss.....' + props.breif.city_slabs[i].color
          );
          locationsArr.push(
        
<PinSection
        handlemap={handlemap}
             Mapid={props.breif.city_slabs[i].gmaps_place_id}
              city={props.breif.city_slabs[i].city_name}
              duration={props.breif.city_slabs[i].duration + ' Nights'}
              pinColour={props.breif.city_slabs[i].color}
              data={order[i]}
              _moveDownHandler={_moveDownHandler}
              _moveUpHandler={_moveUpHandler}
              index={i}
            ></PinSection>
  
            
          );
          locationsArr.push(
            <MidSection
              pinColour={[props.breif.city_slabs[i].color,props.breif.city_slabs[i].color]}
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
      <Heading className="font-poppins">Route</Heading>

      <PinSection
        
        city={props.nostartinglocation ? 'Your Location' : startingcity}
      ></PinSection>
      <MidSection
        pinColour={'#f7e700'}
        transportMode={'taxi'}
        duration={'2'}
      ></MidSection>

      {locationsArr}
      {/* <MidSection></MidSection>
             <PinSection location="Jaisalmer" duration="4 Nights"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Jodhour" duration="3 Nights"></PinSection>
             <MidSection></MidSection> */}
      <PinSection
        
        city={props.nostartinglocation ? 'Your Location' : endingcity}
      ></PinSection>
    </Container>
  );
};

export default Route;
