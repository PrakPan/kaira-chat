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
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import { axiosDeleteBooking } from "../../services/itinerary/bookings";
import {
  setTransferBookings,
  updateTransferBookings,
} from "../../store/actions/transferBookingsStore";
import { useDispatch } from "react-redux";
import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import Drawer from "../../components/ui/Drawer";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
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
      ? "linear-gradient(to bottom, #DDDDDD, transparent)"
      : "linear-gradient(to top, #DDDDDD, transparent)"};
  background-size: 10px 10px;
`;

const PinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CityItem = ({
  city,
  duration,
  booking_type,
  upPresent,
  downPresent,
  booking_id,
  length,
  bookingIdToDelete,
  destination_city_id,
  origin_city_id,
  destination_city_name,
  origin_city_name,
}) => {
  console.log("City Name", city);
  const [show, setShow] = useState(false);
  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return (
          <MdOutlineFlightTakeoff
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
          />
        );
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Train":
        return <IoMdTrain className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Bus":
        return (
          <FaBus
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
          />
        );
      default:
        return null;
    }
  };
  const [handleShow, setHandleShow] = useState(false);
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();
  const selectedBooking = {
    id: booking_id,
    type: booking_type,
  };
  const dispatch = useDispatch();

  const handleEdit = async () => {
    const res = await axios.get(
      `${MERCURY_HOST}/api/v1/itinerary/${
        router?.query?.id
      }/bookings/${booking_type.toLowerCase()}/${booking_id}`
    );
    setData(res?.data);
    setHandleShow(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${data?.itinerary_id}/bookings/${data?.booking_type?.toLowerCase()}/${
          data?.id
        }/`
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(bookingIdToDelete));
        setLoading(false);
        toast.success("Booking deleted successfuly");
        setVisible(true);
        setHandleShow(false);
        console.log("Deleted Booking");
      }
    } catch (err) {
      console.log(
        "[ERROR][ItineraryPage][axiosDeleteBooking:/Delete_Booking]",
        err
      );
      toast.error("Error", err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <PinWrapper>
        {upPresent && <VerticalLine height="40px" gradient="top" />}
        {upPresent && downPresent ? (
          <Pin length={length} />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              opacity="0.5"
              cx="12.0551"
              cy="12.0558"
              r="6.57534"
              fill="#F7E700"
            />
            <path
              d="M10.9041 24V21.8082C8.621 21.5525 6.6621 20.6073 5.0274 18.9726C3.39269 17.3379 2.44749 15.379 2.19178 13.0959H0V10.9041H2.19178C2.44749 8.621 3.39269 6.6621 5.0274 5.0274C6.6621 3.39269 8.621 2.44749 10.9041 2.19178V0H13.0959V2.19178C15.379 2.44749 17.3379 3.39269 18.9726 5.0274C20.6073 6.6621 21.5525 8.621 21.8082 10.9041H24V13.0959H21.8082C21.5525 15.379 20.6073 17.3379 18.9726 18.9726C17.3379 20.6073 15.379 21.5525 13.0959 21.8082V24H10.9041ZM12 19.6712C14.1187 19.6712 15.9269 18.9224 17.4247 17.4247C18.9224 15.9269 19.6712 14.1187 19.6712 12C19.6712 9.88128 18.9224 8.07306 17.4247 6.57534C15.9269 5.07763 14.1187 4.32877 12 4.32877C9.88128 4.32877 8.07306 5.07763 6.57534 6.57534C5.07763 8.07306 4.32877 9.88128 4.32877 12C4.32877 14.1187 5.07763 15.9269 6.57534 17.4247C8.07306 18.9224 9.88128 19.6712 12 19.6712ZM12 16.3836C10.7945 16.3836 9.76256 15.9543 8.90411 15.0959C8.04566 14.2374 7.61644 13.2055 7.61644 12C7.61644 10.7945 8.04566 9.76256 8.90411 8.90411C9.76256 8.04566 10.7945 7.61644 12 7.61644C13.2055 7.61644 14.2374 8.04566 15.0959 8.90411C15.9543 9.76256 16.3836 10.7945 16.3836 12C16.3836 13.2055 15.9543 14.2374 15.0959 15.0959C14.2374 15.9543 13.2055 16.3836 12 16.3836ZM12 14.1918C12.6027 14.1918 13.1187 13.9772 13.5479 13.5479C13.9772 13.1187 14.1918 12.6027 14.1918 12C14.1918 11.3973 13.9772 10.8813 13.5479 10.4521C13.1187 10.0228 12.6027 9.80822 12 9.80822C11.3973 9.80822 10.8813 10.0228 10.4521 10.4521C10.0228 10.8813 9.80822 11.3973 9.80822 12C9.80822 12.6027 10.0228 13.1187 10.4521 13.5479C10.8813 13.9772 11.3973 14.1918 12 14.1918Z"
              fill="#1F1F1F"
            />
            <circle
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.5"
              cx="12.0551"
              cy="12.0558"
              r="6.57534"
              fill="#F7E700"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M10.9041 24V21.8082C8.621 21.5525 6.6621 20.6073 5.0274 18.9726C3.39269 17.3379 2.44749 15.379 2.19178 13.0959H0V10.9041H2.19178C2.44749 8.621 3.39269 6.6621 5.0274 5.0274C6.6621 3.39269 8.621 2.44749 10.9041 2.19178V0H13.0959V2.19178C15.379 2.44749 17.3379 3.39269 18.9726 5.0274C20.6073 6.6621 21.5525 8.621 21.8082 10.9041H24V13.0959H21.8082C21.5525 15.379 20.6073 17.3379 18.9726 18.9726C17.3379 20.6073 15.379 21.5525 13.0959 21.8082V24H10.9041ZM12 19.6712C14.1187 19.6712 15.9269 18.9224 17.4247 17.4247C18.9224 15.9269 19.6712 14.1187 19.6712 12C19.6712 9.88128 18.9224 8.07306 17.4247 6.57534C15.9269 5.07763 14.1187 4.32877 12 4.32877C9.88128 4.32877 8.07306 5.07763 6.57534 6.57534C5.07763 8.07306 4.32877 9.88128 4.32877 12C4.32877 14.1187 5.07763 15.9269 6.57534 17.4247C8.07306 18.9224 9.88128 19.6712 12 19.6712ZM12 16.3836C10.7945 16.3836 9.76256 15.9543 8.90411 15.0959C8.04566 14.2374 7.61644 13.2055 7.61644 12C7.61644 10.7945 8.04566 9.76256 8.90411 8.90411C9.76256 8.04566 10.7945 7.61644 12 7.61644C13.2055 7.61644 14.2374 8.04566 15.0959 8.90411C15.9543 9.76256 16.3836 10.7945 16.3836 12C16.3836 13.2055 15.9543 14.2374 15.0959 15.0959C14.2374 15.9543 13.2055 16.3836 12 16.3836ZM12 14.1918C12.6027 14.1918 13.1187 13.9772 13.5479 13.5479C13.9772 13.1187 14.1918 12.6027 14.1918 12C14.1918 11.3973 13.9772 10.8813 13.5479 10.4521C13.1187 10.0228 12.6027 9.80822 12 9.80822C11.3973 9.80822 10.8813 10.0228 10.4521 10.4521C10.0228 10.8813 9.80822 11.3973 9.80822 12C9.80822 12.6027 10.0228 13.1187 10.4521 13.5479C10.8813 13.9772 11.3973 14.1918 12 14.1918Z"
              fill="#1F1F1F"
            />
          </svg>
        )}
        {downPresent && <VerticalLine height="40px" gradient="bottom" />}
      </PinWrapper>

      <div
        className={`flex items-center gap-3 ${
          !downPresent && upPresent && "mt-[41px]"
        } ${!upPresent && downPresent && "mb-[41px]"}`}
      >
        <div className="font-[Poppins] text-[16px] font-[500] flex gap-1">
          {(booking_id || city) && !visible ? (
            <>
              {" "}
              <div className="mt-[4px]">{correctIcon(booking_type)}</div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
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
              </div>{" "}
            </>
          ) : (
            <button
              onClick={() => setShowDrawer(true)}
              className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
            >
              +Add Transfer
            </button>
          )}
        </div>
      </div>
      <TransferEditDrawer
        mercury
        addOrEdit={"transferAdd"}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        // selectedTransferHeading={origin}
        origin={origin_city_id}
        destination={destination_city_id}
        // check_in={check_in}
        // routeId={id}
        city={origin_city_name}
        dcity={destination_city_name}
        selectedBooking={selectedBooking}
      />
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
            <VehicleDetailModal
              data={data}
              setHandleShow={setHandleShow}
              handleDelete={handleDelete}
              loading={loading}
            />
          </>
        )}
      </Drawer>
      {/* <Drawer
              show={show}
              anchor="right"
              width={"500px"}
              style={1503}
              className="font-lexend"
              onHide={setShow}
            >
            <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={show}
          setShowDrawer={setShowTransferEditDrawer}
          selectedTransferHeading={props.selectedTransferHeading}
          origin={props.selectedBooking?.city}
          destination={props.selectedBooking?.destination_city}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          fetchData={props?.fetchData}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
          routeId={props.routeId}
          selectedBooking={props.selectedBooking}
          mercuryTransfer={props?.mercuryTransfer}
          mercury={true}
        />
            </Drawer>  */}
    </Container>
  );
};

export default CityItem;
