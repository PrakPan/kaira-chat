import styled from "styled-components";
import React from "react";
import Pin from "../newitinerary/breif/route/Pin";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus, FaPen } from "react-icons/fa";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useState } from "react";
import Drawer from "../../components/ui/Drawer";
import { Details } from "../../components/modals/flights/new-flight-searched/Index";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import { useRouter } from "next/router";
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 6%;
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

const CityItem = ({
  city,
  duration,
  pinColour,
  // onClick,
  booking_type,
  upPresent,
  downPresent,
  booking_id,
  width,
  length
}) => {
  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return <MdOutlineFlightTakeoff className="text-2xl" size={32} />;
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" size={32} />;
      case "Train":
        return <IoMdTrain className="text-2xl" size={32} />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" size={32} />;
      case "Bus":
        return <FaBus className="text-2xl" size={32} />;
      default:
        return null;
    }
  };
  const [handleShow, setHandleShow] = useState(false);
  const [data, setData] = useState({});
  const router=useRouter();

  const handleEdit = async () => {
    const res = await axios.get(
      `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${booking_type.toLowerCase()}/${booking_id}`
    );
    console.log("response is:", res?.data?.flight_details?.items?.[0]);
    setData(res?.data);
    setHandleShow(true);
  };

  return (
    <Container>
      <PinWrapper>
        {upPresent && <VerticalLine height="40px" gradient="top" />}
        <Pin length={length}/>
        {downPresent && <VerticalLine height="40px" gradient="bottom" />}
      </PinWrapper>

      <div
        className={`flex items-center gap-3 ${
          !downPresent && upPresent && "mt-[41px]"
        } ${!upPresent && downPresent && "mb-[41px]"}`}
      >
        <div>{correctIcon(booking_type)}</div>

        <div className="flex flex-col">
          <div className="font-[Poppins] text-[16px] font-[500] flex gap-2 items-center">
            {city}{" "}
            {upPresent && downPresent && (
              <div
                className="hover:cursor-pointer"
                onClick={() => handleEdit()}
              >
                <FaPen size={12} />
              </div>
            )}
          </div>
          {duration && (
            <div className="font-[Poppins] font-[400] text-[12px] ">
              Duration: {duration}
            </div>
          )}
        </div>
      </div>
      <Drawer
        show={handleShow}
        anchor="right"
        width={"500px"}
        style={1503}
        className="font-lexend"
        onHide={setHandleShow}
      >
        {booking_type === "Flight" ? (
  <>
    <div className="font-[Poppins] text-[32px] font-[700] flex gap-2 items-center bg-gray-100 p-2">
      {city}
    </div>
    <FlightDetailModal
      segments={data?.flight_details?.items?.[0]?.segments}
      fareRule={data?.flight_details?.items?.[0]?.fare_rule?.[0]}
    />
  </>
) : booking_type === "Car" ? (
  <></>
) : (
  <>
  <VehicleDetailModal data={data}/>
  </>
)}

      </Drawer>
    </Container>
  );
};

export default CityItem;
