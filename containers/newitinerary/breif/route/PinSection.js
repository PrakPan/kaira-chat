<<<<<<< HEAD
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Pin from './Pin';
 
const  Container = styled.div`
display: grid;
grid-template-columns: max-content auto;
`;
const Heading = styled.div`
    font-weight: 600;
    margin: 0 0 0 0.75rem;
    line-height: 24px;
    display: flex;
    align-items: center;
`;
 
const PinSection = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
            <Pin duration={props.duration}></Pin>
            <Heading>{props.duration ? props.location +  " ("+ props.duration+" Nights)": props.location }</Heading>
        </Container>
        
    );
 }

export default  PinSection;
=======
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useHover } from '../../../../hooks/useHover';
import Pin from './Pin';

const Container = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content auto max-content;
`;
const Heading = styled.div`
  font-weight: 500;

  color: black;

  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
`;

const PinSection = ({
  dayslab,
  setShowDrawer,
  setShowDrawerData,
  cityData,
  dayId,
  setCurrentPopup,
  lat,
  long,
  cityId,
  duration,
  city,
  pinColour,
  handlemap,
  Mapid,
}) => {
  // const [pinhover, isPinhover] = useHover();
  // const getdayId = (id) => {
  //   return dayslab[id]?.slab_id;
  // };
  // const getdateId = (id) => {
  //   return dayslab[id]?.slab;
  // };
  // useEffect(() => {
  //   if (isPinhover) {
  //     if (lat) {
  //       setCurrentPopup &&
  //         setCurrentPopup([
  //           {
  //             dayId: getdayId(dayId),
  //             date: getdateId(dayId),
  //             cityData: cityData,
  //             id: Mapid,
  //             city_id: cityId,
  //             lat: lat,
  //             long: long,
  //             name: city,
  //             duration: duration,
  //             color: pinColour,
  //           },
  //         ]);
  //     }
  //   }
  // }, [isPinhover]);
  // ref={pinhover}
  const handleClick = () => {
    setShowDrawer(true);
    setShowDrawerData(cityData);
  };
  return (
    <Container className="cursor-pointer " onClick={() => handleClick()}>
      <Pin duration={duration} pinColour={pinColour}></Pin>
      <Heading className={`${setCurrentPopup ? 'ml-4' : 'lg:ml-8 ml-2'} `}>
        {duration ? city + ` - ${duration}` : city}
        {/* <div className="px-4 py-1 text-[12px] cursor-pointer border-2 border-black ml-6 font-bold font-lexend text-black rounded-md">
          Edit
        </div> */}
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
