import React from "react";
import { IoClose } from "react-icons/io5";
import TransfersIcon from "../../../helper/TransfersIcon";
import Pin from "../../../containers/newitinerary/breif/route/Pin";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";

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
  booking
}) => {
  if (!data) return null;
  // const [loading, setLoading] = useState(false);
  // const transfer = useSelector((state) => state.Itinerary);
  const {
    name,
    transfer_details,
    price,
    currency,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
  } = data;

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
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + minutes);
    return formatDateTime(date.toISOString());
  };

  const departure = transfer_details?.start_datetime;
  const duration = transfer_details?.duration;

  const arrival = addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);

  return (
    <>
      <div className="fixed inset-0 bg-gray-50 w-full h-full flex flex-col">
        <div className="p-4 flex items-center">
          <IoClose
            onClick={() => setHandleShow(false)}
            className="hover:cursor-pointer"
            style={{ fontSize: "2rem" }}
          />
          <BackText>Back to Itinerary</BackText>
        </div>
        <div className="flex items-center px-4">
          <div className="bg-blue-100 rounded-lg p-2 mr-3">
            {loading ? (
              <div className="w-20 h-12 bg-gray-300 opacity-50 rounded-lg"></div>
            ) : (
              <TransfersIcon
                TransportMode={transfer_details?.mode}
                Instyle={{
                  fontSize:
                    transfer_details?.mode === "Bus" ? "2.5rem" : "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            )}
          </div>
          <span className="text-xl font-semibold text-gray-800">
            {loading ? (
              <div className="w-32 h-5 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              name
            )}
          </span>
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
                <span className="text-sm">
                  {loading ? (
                    <div className="w-12 h-3 bg-gray-300 opacity-50 rounded"></div>
                  ) : (
                    `${transfer_details?.distance} km`
                  )}
                </span>
                <div className="border-t border-dashed w-64"></div>
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
                <div className="text-right">
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
                </div>
              </div>

              <div className="mt-4">
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
              </div>
            </div>

            {/* Profile Icon */}
            <div className="absolute bottom-6 right-6 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow">
              {loading ? (
                <div className="w-4 h-4 bg-gray-300 opacity-50 rounded"></div>
              ) : (
                <span className="font-semibold">D</span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Booking Button (Fixed) */}
        {handleDelete && (
          <div className="p-4 bg-white">
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={()=>handleDelete(booking)}
              disabled={loading}
            >
              <div style={{ position: "relative" }}>
                <div className="flex gap-1 items-center" style={loading ? { visibility: "hidden" } : {}}>
                <Image src="/delete.svg" width={"20"} height={"20"}/> <span> Delete Booking </span>
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
