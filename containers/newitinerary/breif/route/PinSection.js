import styled from "styled-components";
import React from "react";
import Pin from "./Pin";
import { MdNavigateNext } from "react-icons/md";

const Container = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content auto max-content;
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
    if (!props.duration || props.duration === "0" || props.transfersPin) return;
    props.setShowDrawer(true);
    props.setShowDrawerData(props.cityData);
  };
  

  return (
    <Container className="cursor-pointer w-fit" onClick={() => handleClick()}>
      <Pin mercury={props?.mercury} duration={props.duration} pinColour={props.pinColour} index={props?.index} length={props?.length}></Pin>
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
        {props.transfersPin || !props.duration || props.duration === "0" ? (
          <></>
        ) : (
          <IconContainer className="IconContainer">
            <MdNavigateNext
              style={{ fontSize: "1.5rem" }}
              className="AnimateRight"
            />
          </IconContainer>
        )}
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
