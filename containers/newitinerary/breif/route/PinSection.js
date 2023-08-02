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
`;
const IconContainer = styled.div`
  position: absolute;
  right: -23px;
  opacity: 0.55;
  transition: right 0.2s ease;
`;

const PinSection = (props) => {
  const handleClick = () => {
    if (props.startingCity || props.endingCity || props.transfersPin) return;
    props.setShowDrawer(true);
    props.setShowDrawerData(props.cityData);
  };
  return (
    <Container className="cursor-pointer " onClick={() => handleClick()}>
      <Pin duration={props.duration} pinColour={props.pinColour}></Pin>
      <Heading
        pinColour={props.pinColour}
        className={`${
          props.setCurrentPopup ? "ml-4 heading" : "lg:ml-8 ml-2 heading"
        } `}
      >
        {props.duration >= 1
          ? props.city +
            `${
              props.duration > 1
                ? ` - ${props.duration} Nights`
                : `${props.duration == 0 ? `` : ` - ${props.duration}`}  Night`
            } `
          : props.city}
      {(props.startingCity || props.endingCity || props.transfersPin) ? <></> :   <IconContainer className="IconContainer">
          <MdNavigateNext
            style={{ fontSize: "1.5rem" }}
            className="AnimateRight"
          />
        </IconContainer>}
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
