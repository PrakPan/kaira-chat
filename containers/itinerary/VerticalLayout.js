import styled from "styled-components";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import Pin from "../newitinerary/breif/route/Pin";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import TransfersIcon from "../../helper/TransfersIcon";
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-left: 25px;
`;

const VerticalLine = styled.div`
  width: 2px;
  height: ${(props) => props.height || "40px"};
  background: ${(props) =>
    props.gradient === "top"
      ? "linear-gradient(to bottom, #F7E700, transparent)"
      : "linear-gradient(to bottom, #359EBF, transparent)"};
  background-size: 10px 10px;
`;


const PinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.div`
  font-weight: 500;
  color: black;
  font-size: 18px;
  position: relative;
`;

const IconContainer = styled.div`
  position: absolute;
  right: -23px;
  opacity: 0.55;
  transition: right 0.2s ease;
`;

const CityItem = ({ city, duration, pinColour, onClick, booking_type,upPresent,downPresent }) => {
  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return <MdOutlineFlightTakeoff className="text-2xl" />;
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" />;
      case "Train":
        return <IoMdTrain className="text-2xl" />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" />;
      case "Bus":
        return <FaBus className="text-2xl" />;
      default:
        return null;
    }
  };

  return (
    <Container onClick={onClick}>
    <PinWrapper>
      {upPresent && <VerticalLine height="40px" gradient="top" />}
      <Pin />
      {downPresent && <VerticalLine height="40px" gradient="bottom" />}
    </PinWrapper>
  
    <div className={`flex items-center gap-2 ${!downPresent&&upPresent&&"mt-[41px]"} ${!upPresent&&downPresent&&"mb-[41px]"}`}>
      <div>{correctIcon(booking_type)}</div>
  
      <div className="flex flex-col">
        <div className="font-medium text-black text-[16px] flex gap-1 items-center">{city}</div>
        {duration && (
          <div className="text-[12px] font-medium">Duration: {duration}</div>
        )}
      </div>
    </div>
  </Container>
  
  );
};

export default CityItem;
