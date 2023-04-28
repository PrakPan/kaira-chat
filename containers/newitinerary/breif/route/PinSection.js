import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useHover } from '../../../../hooks/useHover';
import Pin from './Pin';

const Container = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content auto;
`;
const Heading = styled.div`
  font-weight: 650;
  margin: 0 0 0 1rem;
  color: black;

  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
`;

const PinSection = ({
  dayslab,
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
  const [pinhover, isPinhover] = useHover();
  const getdayId = (id) => {
    console.log(`cityid ${id}`);
    return dayslab[id]?.slab_id;
  };
  useEffect(() => {
    if (isPinhover) {
      if (lat) {
        setCurrentPopup([
          {
            dayId: getdayId(dayId),

            cityData: cityData,
            id: Mapid,
            city_id: cityId,
            lat: lat,
            long: long,
            name: city,
            duration: duration,
            color: pinColour,
          },
        ]);
      }
    }
  }, [isPinhover]);

  return (
    <Container className="cursor-pointer" ref={pinhover}>
      <Pin duration={duration} pinColour={pinColour}></Pin>
      <Heading>{duration ? city + ' (' + duration + ')' : city}</Heading>
    </Container>
  );
};

export default React.memo(PinSection);
