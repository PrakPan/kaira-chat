import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useHover } from "../../../../hooks/useHover";
import Pin from "./Pin";
import { MdNavigateNext } from "react-icons/md";

const Container = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content auto max-content;
  // &:hover > .heading::after {
  //   width: 100%;
  // }
  &:hover {
    .IconContainer {
      right: -33px;
    }
  }
`;
const Heading = styled.div`
  width: fit-content;
  font-weight: 500;
  color: black;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  position: relative;

  // ----
  // position: relative;
  // display: inline-block;

  // &::after {
  //   content: "";
  //   position: absolute;
  //   left: 0;
  //   bottom: -5px; /* Adjust this value to control the underline thickness */
  //   width: 0;
  //   height: 2px;
  //   background-color: ${({ pinColour }) => pinColour};
  //   transform-origin: left;
  //   transition: width 0.2s ease; /* Smooth transition on width change */
  // }
`;
const IconContainer = styled.div`
  position: absolute;
  right: -23px;
  opacity: 0.55;
  transition: right 0.2s ease;
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
      <Heading
        pinColour={pinColour}
        className={`${
          setCurrentPopup ? "ml-4 heading" : "lg:ml-8 ml-2 heading"
        } `}
      >
        {duration >= 1
          ? city +
            `${
              duration > 1
                ? ` - ${duration} Nights`
                : `${duration == 0 ? `` : ` - ${duration}`}  Night`
            } `
          : city}
        {/* <div className="px-4 py-1 text-[12px] cursor-pointer border-2 border-black ml-6 font-bold font-lexend text-black rounded-md">
          Edit
        </div> */}
        <IconContainer className="IconContainer">
          <MdNavigateNext
            style={{ fontSize: "1.5rem" }}
            className="AnimateRight"
          />
        </IconContainer>
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
