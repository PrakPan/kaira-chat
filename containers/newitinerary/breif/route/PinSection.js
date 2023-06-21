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
  console.log('duration;: ', duration);
  return (
    <Container className="cursor-pointer " onClick={() => handleClick()}>
      <Pin duration={duration} pinColour={pinColour}></Pin>
      <Heading className={`${setCurrentPopup ? 'ml-4' : 'lg:ml-8 ml-2'} `}>
        {duration
          ? city +
            `${
              duration > 1
                ? ` - ${duration} Nights`
                : `${duration == 0 ? ` ` : ` - ${duration} Night`}  `
            } `
          : city}
        {/* <div className="px-4 py-1 text-[12px] cursor-pointer border-2 border-black ml-6 font-bold font-lexend text-black rounded-md">
          Edit
        </div> */}
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
