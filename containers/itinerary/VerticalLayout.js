import styled from "styled-components";
import React from "react";
import Pin from "../newitinerary/breif/route/Pin";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat, IoIosArrowForward } from "react-icons/io";
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
import { useDispatch, useSelector } from "react-redux";
import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import Drawer from "../../components/ui/Drawer";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TransferSkeleton from "../../components/itinerary/Skeleton/TransferSkeleton";
import media from "../../components/media";
import { openNotification } from "../../store/actions/notification";
import Image from "next/image";
import { RiArrowDropRightLine, RiArrowGoForwardLine } from "react-icons/ri";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import { AiOutlineRight } from "react-icons/ai";
import BackArrow from "../../components/ui/BackArrow";
import { PulseLoader } from "react-spinners";
import TransferDrawer from "./TransferDrawer";

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
  selectedBooking,
  setSelectedBooking,
  duration,
  booking_type,
  transfer_type,
  upPresent,
  downPresent,
  booking_id,
  length,
  bookingIdToDelete,
  destination_city_id,
  origin_city_id,
  destination_city_name,
  origin_city_name,
  loadbookings,
  setShowLoginModal,
  origin,
  destination,
  oCityData,
  dCityData,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
}) => {
  const { transfers_status } = useSelector((state) => state.ItineraryStatus);
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
  const [comboDetails,setComboDetails] =useState(false);

  console.log("Selllll",selectedBooking)
  const router = useRouter();
  const dispatch = useDispatch();
  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

  const handleEdit = async (combo) => {
    if(combo){
      setComboDetails(true);
    }
    setLoading(true);
    console.log("inside show");
    try {

      setHandleShow(true);
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${
          router?.query?.id
        }/bookings/${combo? `combo` : booking_type.toLowerCase()}/${booking_id}/`
      );
      setData(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDelete = async (val) => {
    const dataPassed = val != null ? val : data;
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${
          dataPassed?.itinerary_id
        }/bookings/${dataPassed?.booking_type?.toLowerCase()}/${
          dataPassed?.id
        }/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(bookingIdToDelete));
        setLoading(false);
        getPaymentHandler();
        
        setVisible(true);
        setHandleShow(false);
        dispatch(
          openNotification({
            type: "success",
            text: `${city} deleted successfuly`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      dispatch(
        openNotification({
          type: "error",
          text: `${err.response?.data?.errors[0]?.detail}`,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };

  const extractMode = (text) => {
    // Convert the text to lowercase for better matching
    const lowerText = text.toLowerCase();

    // Match the known transport modes
    if (lowerText.includes("flight")) {
      return "Flight";
    } else if (lowerText.includes("train")) {
      return "Train";
    } else if (lowerText.includes("bus")) {
      return "Bus";
    } else if (lowerText.includes("taxi") || lowerText.includes("car")) {
      return "Car";
    } else if (lowerText.includes("ferry")) {
      return "Ferry";
    } else {
      return "";
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
        {!(upPresent && downPresent) && <div className="">{city} </div>}
        {(transfers_status === "PENDING") ? (
          (upPresent && downPresent) ? <TransferSkeleton /> : ""
        ) : (
          <div className=" text-[16px] font-[500] flex gap-1">
            {(booking_id || city) && !visible ? (
              <>
                {" "}
                <div className="mt-[4px] flex items-start">
                  {city?.includes(",")
                    ? city?.split(",").map((text, i) => {
                        const mode = extractMode(text.trim());

                        return (
                          <>
                            {correctIcon(mode)}

                            {i < city.split(",").length - 1 && (
                              <span>
                                <RiArrowDropRightLine size={18} />
                              </span>
                            )}
                          </>
                        );
                      })
                    : correctIcon(booking_type)}
                </div>
                {transfer_type == "combo" ? (
                  <div
                    className={`flex flex-col ${upPresent && downPresent ? "group hover:cursor-pointer" : ""}`}
                    onClick={() => {
 upPresent && downPresent && handleEdit(true)
                      // const res = await axios.get(
                      //   `${MERCURY_HOST}/api/v1/itinerary/${
                      //     router?.query?.id
                      //   }/bookings/${booking_type.toLowerCase()}/${booking_id}/`
                      // );
                      // upPresent && downPresent && handleDelete(res?.data);
                    }}
                  >
                    <div className="flex gap-2 items-center ">
                      <div className="group-hover:text-blue ">{city} </div>
                      {upPresent && downPresent && (
                        <>
                          {upPresent && downPresent && (
                            <div className="">
                              <FaPen
                                size={12}
                                className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
                              />
                            </div>
                          )}
                          {/* <div className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.83398 17.5C5.37565 17.5 4.98329 17.3368 4.6569 17.0104C4.33051 16.684 4.16732 16.2917 4.16732 15.8333V5H3.33398V3.33333H7.50065V2.5H12.5007V3.33333H16.6673V5H15.834V15.8333C15.834 16.2917 15.6708 16.684 15.3444 17.0104C15.018 17.3368 14.6257 17.5 14.1673 17.5H5.83398ZM14.1673 5H5.83398V15.8333H14.1673V5ZM7.50065 14.1667H9.16732V6.66667H7.50065V14.1667ZM10.834 14.1667H12.5007V6.66667H10.834V14.1667Z"
                                fill="red"
                              />
                            </svg>
                          </div> */}
                        </>
                      )}
                    </div>
                    {duration && (
                      <div className=" font-[400] text-[12px] ">
                        Duration: {duration}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col ${upPresent && downPresent ? "group hover:cursor-pointer" : ""}`}
                    onClick={() => upPresent && downPresent && handleEdit()}
                  >
                    <div className="flex gap-2 items-center ">
                     {(upPresent && downPresent) && <div className="group-hover:text-blue ">{city} </div>}
                      {upPresent && downPresent && (
                        <div className="">
                          <FaPen
                            size={12}
                            className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
                          />
                        </div>
                      )}
                    </div>
                    {duration && (
                      <div className=" font-[400] text-[12px] ">
                        Duration: {duration}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : isPageWide ? (
              <button
                onClick={() => setShowDrawer(true)}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
              >
                + Add Transfer from {origin_city_name} to{" "}
                {destination_city_name}
              </button>
            ) : (
              <button
                onClick={() => setShowDrawer(true)}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
              >
                + Add Transfer
              </button>
            )}
          </div>
        )}
      </div>
      <TransferEditDrawer
        mercury
        addOrEdit={"transferAdd"}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        // selectedTransferHeading={origin}
        destination={destination_city_id}
        _updateFlightBookingHandler={_updateFlightBookingHandler}
        _updatePaymentHandler={_updatePaymentHandler}
        getPaymentHandler={getPaymentHandler}
        // check_in={check_in}
        // routeId={id}
        oCityData={oCityData}
        dCityData={dCityData}
        setShowLoginModal={setShowLoginModal}
        city={origin_city_name}
        dcity={destination_city_name}
        // originCityId={origin}
        // destinationCityId={destination}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
        destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
        origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
        destination_itinerary_city_id={
          dCityData?.id || dCityData?.gmaps_place_id
        }
      />

{    handleShow &&   <TransferDrawer
   show={handleShow}
   setHandleShow={setHandleShow}
   data={data}
   booking_type={booking_type}
   loading={loading}
   handleDelete={handleDelete}
   city={city}
/>}

      {/* <Drawer
        show={handleShow}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={setHandleShow}
        mobileWidth="100vw"
        width={`${!(booking_type === "Flight") ? "45vw" : "50vw"}`}
      >
       {!comboDetails ?  <>
          {booking_type === "Flight" ? (
            loading?<FlightDetailLoader/>:
            <FlightDetailModal
              segments={data?.transfer_details?.items?.[0]?.segments}
              fareRule={data?.transfer_details?.items?.[0]?.fare_rule?.[0]}
              booking_id={data?.id}
              setShowDetails={setHandleShow}
              name={city}
            />
          ) : loading ? (
            <VehicleDetailLoader setHandleShow={setHandleShow} />
          ) : booking_type === "Taxi" ? (
            <TaxiDetailModal
              data={data}
              setHandleShow={setHandleShow}
              handleDelete={handleDelete}
              loading={loading}
            />
          ) : (
            <>
              <VehicleDetailModal
                data={data}
                setHandleShow={setHandleShow}
                handleDelete={handleDelete}
                loading={loading}
              />
              <VehicleDetailModal
                data={data}
                setHandleShow={setHandleShow}
                handleDelete={handleDelete}
                loading={loading}
              />
            </>
          )}
        </> : 
        <div className="h-screen flex flex-col"> {/* Full height wrapper */}
        {/* <div className="p-4 flex flex-col flex-grow"> {/* Inner scrollable content */}
          {/* <BackArrow handleClick={() => {
            setHandleShow(false);
          }}/>
      
          <div className="text-lg md:text-xl lg:text-xl font-semibold p-3">
            Transfer details from Srinagar to New Delhi
          </div>
      
          <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 mb-4">
            <div>
              <span className="font-medium p-2 text-lg">Taxi to Srinagar </span>
              <span className="text-gray-600 ml-1"></span>
            </div>
            <AiOutlineRight size={20} className="text-gray-400" />
          </div>
      
          <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 mb-4">
            <div>
              <span className="font-medium p-2 text-lg">Flight to New Delhi</span>
              <span className="text-gray-600 ml-1"></span>
            </div>
            <AiOutlineRight size={20} className="text-gray-400" />
          </div>
      
          <div className="mt-auto p-4 bg-white">
            <button className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center">
              <div style={{ position: "relative" }}>
                <div className="flex gap-1 items-center text-white">
                  <Image src="/delete.svg" width={"20"} height={"20"} />
                  <div>Delete Booking</div>
                </div>
                {loading && (
                  <PulseLoader
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                      transform: "translate(-50% , -50%)",
                    }}
                    size={12}
                    speedMultiplier={0.6}
                    color="#ffffff"
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
        
        }
      </Drawer> */}
      {/* <Drawer
              show={show}
              anchor="right"
              width={"500px"}
              style={1503}
              className="font-lexend"
              onHide={setShow}
            >
           
            </Drawer>  */}
    </Container>
  );
};

export default CityItem;
