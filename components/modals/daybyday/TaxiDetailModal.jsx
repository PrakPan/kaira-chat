import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Image from "next/image";
import BackArrow from "../../ui/BackArrow";
import ImageLoader from "../../ImageLoader";

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const TaxiDetailModal = ({
  data,
  setIsOpen,
  setHandleShow,
  handleDelete,
  loading,
  booking,
  type,
}) => {
  if (!data) return null;

  const {
    name,
    transfer_details,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
    check_in,
    check_out,
  } = data;

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const departure = check_in || transfer_details?.start_datetime || transfer_details?.gozo?.start_date;
  const duration = transfer_details?.duration;
  const arrival = formatDateTime(check_out) || addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);

  const distance = transfer_details?.distance?.text || `${transfer_details?.distance?.value} km`;
  const duration_text = transfer_details?.duration?.text;
  const model = transfer_details?.quote?.taxi_category?.model_name;
  const fuelType = transfer_details?.quote?.taxi_category?.fuel_type;
  const luggageBags = transfer_details?.quote?.taxi_category?.bag_capacity;
  const seatCapacity = transfer_details?.quote?.taxi_category?.seating_capacity;

  return (
    <>
      <div className="fixed inset-0 bg-gray-50 w-full h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <BackArrow handleClick={() => setHandleShow(false)} />
          <div className="text-blue-600 font-medium">
            {loading ? (
              <div className="w-16 h-5 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              "Change"
            )}
          </div>
        </div>

        <div className="px-4">
          <h1 className="text-xl font-bold text-gray-800">
            {loading ? (
              <div className="w-64 h-7 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              `Taxi from ${source_address?.name} to ${destination_address?.name}`
            )}
          </h1>
        </div>

        {/* Journey Card */}
        <div className="flex-1 px-4 pt-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            {/* Distance and Duration Banner */}
            <div className="relative flex justify-center items-center mb-6 mt-2">
              {/* Left dotted line */}
              <div className="absolute left-0 right-1/2 border-t border-dashed border-gray-300 h-0" style={{ marginRight: "20px" }}></div>
              
              {/* Distance and duration pill */}
              <div className="bg-gray-200 px-4 py-1 rounded-full text-sm z-10">
                {loading ? (
                  <div className="w-24 h-4 bg-gray-300 opacity-50 rounded"></div>
                ) : (
                  `${distance} | ${duration_text}`
                )}
              </div>
              
              {/* Right dotted line */}
              <div className="absolute right-0 left-1/2 border-t border-dashed border-gray-300 h-0" style={{ marginLeft: "20px" }}></div>
              
              {/* Left pin circle */}
              <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full"></div>
              
              {/* Right pin circle */}
              <div className="absolute right-0 w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>

            {/* Route Info */}
            <div className="flex justify-between mb-6">
              <div className="flex flex-col items-start">
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">
                        {source_address?.name || "Rasmeshwaram"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {depart.time || "05:30 PM"} | {depart.date || "Fri Apr 24, 2025"}
                      </p>
                    </>
                  )}
                </div>
              </div>


              <div className="flex flex-col items-end">
                <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">
                        {destination_address?.name || "Hyderabad"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {arrival?.time || "05:30 PM"} | {arrival?.date || "Fri Apr 24, 2025"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Taxi Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-4">
                {loading ? (
                  <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                ) : (
                  "TAXI DETAILS"
                )}
              </p>

              <div className="flex gap-2">
                {/* Taxi Image */}
                <div className="border border-gray-200 rounded-lg mr-4 flex justify-center items-center" style={{ minWidth: '120px' }}>
                  {loading ? (
                    <div className="w-full h-24 bg-gray-300 opacity-50 rounded"></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {data?.transfer_details?.quote?.taxi_category?.image ? (
                        <ImageLoader
                          className="object-contain w-full h-full"
                          url={data?.transfer_details?.quote?.taxi_category?.image}
                          leftalign
                          height={"100%"}
                          width={"100%"}
                        />
                      ) : (
                        <Image 
                          src="/taxi-default.jpg" 
                          width={120}
                          height={90}
                          alt="Taxi" 
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Taxi Details Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Model */}
                    { model && <div>
                      <p className="text-gray-500 text-sm">Model</p>
                      <p className="font-semibold text-gray-800">
                        {loading ? (
                          <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                        ) : (
                          model
                        )}
                      </p>
                    </div>}

                    {/* Fuel Type */}
                    { fuelType && <div>
                      <p className="text-gray-500 text-sm">Fuel Type</p>
                      <p className="font-semibold text-gray-800">
                        {loading ? (
                          <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                        ) : (
                          fuelType
                        )}
                      </p>
                    </div>}

                    {/* Luggage Bags */}
                   {luggageBags && <div>
                      <p className="text-gray-500 text-sm">Luggage Bags</p>
                      <p className="font-semibold text-gray-800">
                        {loading ? (
                          <div className="w-10 h-5 bg-gray-300 opacity-50 rounded"></div>
                        ) : (
                          luggageBags
                        )}
                      </p>
                    </div>}

                    {/* Seat Capacity */}
                   { seatCapacity && <div>
                      <p className="text-gray-500 text-sm">Seat Capacity</p>
                      <p className="font-semibold text-gray-800">
                        {loading ? (
                          <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                        ) : (
                          seatCapacity
                        )}
                      </p>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type !== "combo" && (
          <div className="p-4 bg-white">
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
                  <Image src="/delete.svg" width={20} height={20} alt="Delete icon" /> 
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
        )}
      </div>
    </>
  );
};

export default TaxiDetailModal;