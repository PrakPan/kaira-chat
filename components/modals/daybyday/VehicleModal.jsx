import React from "react";
import { IoClose } from "react-icons/io5";
import TransfersIcon from "../../../helper/TransfersIcon";
import Pin from "../../../containers/newitinerary/breif/route/Pin";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import BackArrow from "../../ui/BackArrow";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";
import { TbArrowBack } from "react-icons/tb";
const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;
const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;
const VehicleDetailModal = ({
  data,
  setIsOpen,
  setHandleShow,
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded,
  setShowDrawer,error
}) => {
  if (!data) return null;

  // const [loading, setLoading] = useState(false);
  // const transfer = useSelector((state) => state.Itinerary);
   let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const {
    name,
    transfer_details,
    price,
    currency,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
    check_in,
    check_out,
    booking_type
  } = data;
  console.log("day by day data is:",data,booking_type);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "long",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const addMinutesToDate = (dateString, minutes) => {
    console.log("Date String", dateString);
    const date = new Date(dateString);
    console.log("date is:")
    date.setMinutes(date.getMinutes() + minutes);
    return formatDateTime(date.toISOString());
  };

  const departure =
    check_in||transfer_details?.start_datetime || transfer_details?.gozo?.start_date ;
  const duration = transfer_details?.duration;

  const arrival = formatDateTime(check_out) ||  addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);

  if (error) {
        return (
          <div
            style={{
              textAlign: "center",
              margin: "auto",
              height: isPageWide ? "80vh" : "70vh",
            }}
            className="center-div"
          >
            Oops, unable to get the details at the moment.
          </div>
        );
      }

  return (
    <>
      <div className=" bg-gray-50 w-full h-full flex flex-col">
        {!isEmbedded && <div className="p-4 flex items-center">
          <BackArrow handleClick={()=>setHandleShow(false)}/>
        </div>}
        <div className="flex justify-between">
        {!isEmbedded &&  <div className="flex items-center px-4">
          {isPageWide && <div className="bg-blue-100 rounded-lg p-2 mr-3">
            {loading ? (
              <div className="w-20 h-12 bg-gray-300 opacity-50 rounded-lg"></div>
            ) : (
              <TransfersIcon
                TransportMode={booking_type || transfer_details?.mode}
                Instyle={{
                  fontSize:
                    transfer_details?.mode === "Bus" ? "2.5rem" : "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            )}
          </div>}
          <span className=" md:text-xl font-semibold text-gray-800">
            {loading ? (
              <div className="w-32 h-5 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              name
            )}
          </span>
        </div>}
        {!isEmbedded && (
                    <div className="font-lexend flex justify-between items-start !m-0 p-4">
                      {loading ? (
                        <div className="w-16 h-5 bg-gray-300 opacity-50 rounded"></div>
                      ) : (
                        <>
                          {/* <Text>{name}</Text> */}
                          <Generalbuttonstyle
                            borderRadius={"7px"}
                            fontSize={"1rem"}
                            padding={"7px 25px"}
                            onClick={() => {
                              setHandleShow(false);
                              setShowDrawer(true);
                              //setShowTaxi(true);console.log("")
                            }}
                          >
                            Change
                          </Generalbuttonstyle>
                        </>
                      )}
                    </div>
                  )}
        </div>

        {/* Ticket Section Label */}
        <div className="px-4 pt-2 pb-2">
          <h2 className="text-lg font-medium">
            {loading ? (
              <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              "My Ticket"
            )}
          </h2>
        </div>

        {/* Scrollable Ticket Details */}
        <div className="flex-1 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            {/* Route Info */}
            <div className="flex justify-between">
              <div className="flex flex-col items-start">
                <Pin pinColour={"green"} index={0} length={0} />
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md">
                        {source_address?.name}
                      </p>
                      <p className="text-black opacity-50 text-[12px]">
                        {depart?.time}
                      </p>
                      <p className="text-black opacity-50 text-[12px]">
                        {depart?.date}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm">
                  {loading ? (
                    <div className="w-4 md:w-12 h-3 bg-gray-300 opacity-50 rounded"></div>
                  ) : (
                    `
                    ${
                      transfer_details?.distance?.text ||
                      `${transfer_details?.distance} km`
                    }
                    `
                  )}
                </span>
                <div className="border-t border-dashed w-6 md:w-64"></div>
              </div>

              <div className="flex flex-col items-end">
                <Pin pinColour={"red"} index={0} length={0} />
                <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md">
                        {destination_address?.name}
                      </p>
                      <p className="text-black opacity-50 text-[12px]">
                        {arrival?.time}
                      </p>
                      <p className="text-black opacity-50 text-[12px]">
                        {arrival?.date}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-gray-400 font-medium text-sm">
                {loading ? (
                  <div className="w-24 h-4 bg-gray-300 opacity-50 rounded"></div>
                ) : (
                  "TRANSFER DETAILS"
                )}
              </p>

              <div className="flex justify-between mt-4">
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md">
                        {number_of_adults} Adults, {number_of_children} Children
                      </p>
                      <p className="text-gray-500 text-sm">Passengers</p>
                    </>
                  )}
                </div>
                {/* <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-20 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md">
                        {price} {currency}
                      </p>
                      <p className="text-gray-500 text-sm">Price</p>
                    </>
                  )}
                </div> */}
              </div>

              {/* <div className="mt-4">
                {loading ? (
                  <>
                    <div className="w-20 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-md">One way</p>
                    <p className="text-gray-500 text-sm">Transfer way</p>
                  </>
                )}
              </div> */}
            </div>
          </div>
        </div>


        {!isPageWide && (
            <FloatingView>
              <TbArrowBack
                style={{ height: "28px", width: "28px" }}
                cursor={"pointer"}
                onClick={()=>setHandleShow(false)}
              />
            </FloatingView>
          )}
        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type!="combo"&&(
          <div className="p-4 bg-white">
            {console.log("type is:",type)}
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={() => handleDelete(booking)}
              disabled={loading}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="flex gap-1 items-center text-white"
                  style={loading ? { visibility: "hidden" } : {}}
                >
                  <Image src="/delete.svg" width={"20"} height={"20"} />{" "}
                  <div>Delete Booking </div>
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
        )}
      </div>
    </>
  );
};

export default VehicleDetailModal;
