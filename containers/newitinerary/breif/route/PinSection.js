import styled from "styled-components";
import React from "react";
import Pin from "./Pin";
import { MdNavigateNext } from "react-icons/md";
import { axiosCityDataById } from "../../../../services/itinerary/brief/route";
import BriefPin from "./BriefPin";

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
  

  const handleClick = async () => {
    if(!props?.mercury){
    if (!props.duration || props.duration === "0" || props.transfersPin) return;
    props.setShowDrawer(true);
    props.setShowDrawerData(props.cityData);
    }else{
      if (!props.duration || props.duration === "0" || props.transfersPin) return;
      if(props?.cityId){
      const res = await axiosCityDataById.get(`/${props?.cityId}`);
      const data = res.data;
      console.log("City Data",data);
      props.setShowDrawerData(data?.data?.city);
      props.setShowDrawer(true);
    
      }
    }
  };
  

  return (
    <Container className="cursor-pointer w-fit" onClick={() => handleClick()}>
      {props?.mercury ? <BriefPin duration={props.duration} pinColour={props.pinColour} index={props?.index} length={props?.length}/> : <Pin duration={props.duration} pinColour={props.pinColour} index={props?.index} length={props?.length}></Pin>}
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
