import styled from "styled-components";
import React from "react";
import { MdNavigateNext } from "react-icons/md";
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

const CityItem = ({ city, duration, pinColour, onClick, booking_type }) => {
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
    <Container onClick={onClick} className="flex items-stretch">
      <PinWrapper>
        <VerticalLine height="30px" gradient="top"/>
        <Pin />
        <VerticalLine height="30px" gradient="bottom"/>
      </PinWrapper>

      <div className="flex items-center justify-center gap-2 p-0 h-full">
        <div className="h-full]">
          {correctIcon(booking_type)}
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="font-medium text-black text-[16px] h-[22px] relative">
            {city}
          </div>
          {duration && <div className="text-[12px] font-medium h-[16px]">
            Duration: {duration}
          </div>}
        </div>
      </div>
    </Container>
  );
};

export default CityItem;
