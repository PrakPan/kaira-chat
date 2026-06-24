import React from "react";
import TransfersIcon from "../../../helper/TransfersIcon";
import Pin from "../../../containers/newitinerary/breif/route/Pin";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Image from "next/image";
import BackArrow from "../../ui/BackArrow";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";
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
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded,
  error,
  handleClose,
  handleEditRoute
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
    booking_type,
    cancellation_policies
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
    date.setMinutes(date?.getMinutes() + minutes);
    return formatDateTime(date?.toISOString());
  };

  const departure =
    check_in ||
    transfer_details?.start_datetime ||
    transfer_details?.gozo?.start_date;
  const duration = transfer_details?.duration;

  const arrival =
    formatDateTime(check_out) || addMinutesToDate(departure, duration);
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
      <div className=" bg-[#f4f3ec] w-full h-full flex flex-col">
        {!isEmbedded && (
          <div className="p-4 flex items-center">
            <BackArrow handleClick={handleClose} />
          </div>
        )}
        <div className="flex justify-between">
          {!isEmbedded && (
            <div className="flex items-center px-4">
              {isPageWide && (
                <div className="bg-[#eef2fb] rounded-lg p-2 mr-3">
                  {loading ? (
                    <div className="w-20 h-12 bg-[#ececec] opacity-50 rounded-lg"></div>
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
                </div>
              )}
              <span className=" md:text-xl font-semibold text-[#0b1220]">
                {loading ? (
                  <div className="w-32 h-5 bg-[#ececec] opacity-50 rounded"></div>
                ) : (
                  name
                )}
              </span>
            </div>
          )}
          {!isEmbedded && (
            <div className=" flex justify-between items-start !m-0 p-4">
              {loading ? (
                <div className="w-16 h-5 bg-[#ececec] opacity-50 rounded"></div>
              ) : (
                <>
                  {/* <Text>{name}</Text> */}
                  <Generalbuttonstyle
                    borderRadius={"7px"}
                    fontSize={"1rem"}
                    padding={"7px 25px"}
                    onClick={() => {
                      // handleClose()
                      handleEditRoute(data)
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
          <h2 className="text-lg font-medium text-[#0b1220]">
            {loading ? (
              <div className="w-24 h-5 bg-[#ececec] opacity-50 rounded"></div>
            ) : (
             ""
            )}
          </h2>
        </div>

        {/* Scrollable Ticket Details */}
        <div className="flex-1 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-[#ececec]">
            {/* Route Info */}
            <div className="flex justify-between">
              <div className="flex flex-col items-start">
                <Pin pinColour={"green"} index={0} length={0} />
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-4 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-[#ececec] opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md text-[#0b1220]">
                        {transfer_details?.source?.city_name}
                      </p>
                      <p className="text-[#445069] text-[12px]">
                        {depart?.time}
                      </p>
                      <p className="text-[#445069] text-[12px]">
                        {depart?.date}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm text-[#445069]">
                  {loading ? (
                    <div className="w-4 md:w-12 h-3 bg-[#ececec] opacity-50 rounded"></div>
                  ) : (
                    `
                    ${
                      transfer_details?.distance?.text ||
                      `${transfer_details?.distance} km`
                    }
                    `
                  )}
                </span>
                <div className="border-t border-dashed border-[#b8becc] w-6 md:w-64"></div>
              </div>

              <div className="flex flex-col items-end">
                <Pin pinColour={"red"} index={0} length={0} />
                <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-32 h-4 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-[#ececec] opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-md text-[#0b1220]">
                        {transfer_details?.destination?.city_name}
                      </p>
                      <p className="text-[#445069] text-[12px]">
                        {arrival?.time}
                      </p>
                      <p className="text-[#445069] text-[12px]">
                        {arrival?.date}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Details */}
           
<div className="mt-8 pt-4 border-t border-[#ececec]">
  <p className="text-[#0b1220] font-medium text-sm mb-4">
    {loading ? (
      <div className="w-24 h-4 bg-[#ececec] opacity-50 rounded"></div>
    ) : (
      "TRANSFER DETAILS"
    )}
  </p>

  <div className="grid grid-cols-2 gap-4">
    <div>
      {loading ? (
        <>
          <div className="w-32 h-4 bg-[#ececec] opacity-50 rounded mb-1"></div>
          <div className="w-24 h-3 bg-[#ececec] opacity-50 rounded"></div>
        </>
      ) : (
        <>
          <p className="font-semibold text-md text-[#0b1220]">
            {number_of_adults} Adults, {number_of_children} Children
          </p>
          <p className="text-[#445069] text-sm">Passengers</p>
        </>
      )}



    </div>
    {!loading && (transfer_details?.prices?.[0]?.class || transfer_details?.results?.[0]?.prices?.[0]?.class_name) && (
      <div className="">
        <p className="font-semibold text-md text-[#0b1220]">
          {transfer_details.prices[0].class || transfer_details.results?.[0]?.prices?.[0]?.class_name}
        </p>
        <p className="text-[#445069] text-sm">Class</p>
      </div>
    )}

    
  </div>
</div>



{/* Journey Details - Only for Omio/12go with segments - MOVED TO NEW SECTION */}
{!loading && transfer_details?.results?.[0]?.segments && transfer_details.results[0].segments.length > 0 && (
  <div className="mt-6 pt-4 border-t border-[#ececec]">
    <p className="text-[#0b1220] font-medium text-sm mb-4">
      JOURNEY DETAILS
    </p>
    
    {/* {transfer_details.results[0].segments.length > 1 && (
      <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg inline-block">
        <p className="text-xs text-gray-600 font-medium">
          {transfer_details.results[0].segments.length} segments · {transfer_details.results[0].segments.length - 1} connection{transfer_details.results[0].segments.length > 2 ? 's' : ''}
        </p>
      </div>
    )} */}

    <div className="space-y-3">
      {transfer_details.results[0].segments.map((segment, idx) => {
        const isLast = idx === transfer_details.results[0].segments.length - 1;
        const depTime = segment.departure_datetime ? new Date(segment.departure_datetime) : null;
        const arrTime = segment.arrival_datetime ? new Date(segment.arrival_datetime) : null;
        const nextSegment = !isLast ? transfer_details.results[0].segments[idx + 1] : null;
        
        return (
          <div key={idx} className="relative">
            {/* Departure */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-end w-20 shrink-0">
                {depTime && (
                  <>
                    <span className="text-sm font-semibold leading-tight text-[#0b1220]">
                      {depTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </span>
                    <span className="text-xs text-[#8a93a6]">
                      {depTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center shrink-0 pt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-black"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a2436] line-clamp-2" title={segment.departure_station?.name}>
                  {segment.departure_station?.name} <br />
                  {segment.vehicle_number ? <span className="text-xs text-[#8a93a6]">
                  {segment.vehicle_number}
                </span> : null}
                </p>
                
              </div>
            </div>

            {/* Journey Line with Operator */}
            <div className="flex items-start gap-3 ml-20 my-2">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-0.5 bg-[#b8becc]" style={{ height: "40px" }}></div>
              </div>
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                {segment.operator?.image && (
                  <img
                    src={segment.operator.image}
                    alt={segment.operator.name}
                    className="h-5 w-auto object-contain"
                  />
                )}
                <span className="text-xs font-medium text-[#445069]">
                  {segment.duration_formatted || `${Math.floor(segment.duration / 60)}h ${segment.duration % 60}m`}
                </span>
              </div>
            </div>

            {/* Arrival */}
            {arrTime && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-end w-20 shrink-0">
                  <span className="text-sm font-semibold leading-tight text-[#0b1220]">
                    {arrTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </span>
                  <span className="text-xs text-[#8a93a6]">
                    {arrTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center shrink-0 pt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-black"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a2436] line-clamp-2" title={segment.arrival_station?.name}>
                    {segment.arrival_station?.name}
                  </p>
                </div>
              </div>
            )}

            {/* Layover between segments */}
            {!isLast && nextSegment && arrTime && (
              <div className="flex items-center gap-3 ml-20 my-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-0.5 h-4 bg-[#ececec]"></div>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md text-xs font-medium text-amber-800">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {(() => {
                      const nextDep = new Date(nextSegment.departure_datetime);
                      const layoverMs = nextDep - arrTime;
                      const layoverMin = Math.floor(layoverMs / 60000);
                      const h = Math.floor(layoverMin / 60);
                      const m = layoverMin % 60;
                      return h > 0 ? `${h}h ${m}m layover` : `${m}m layover`;
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
          </div>

          {cancellation_policies && (
          <>
            {" "}
            <div className="flex flex-col">
              <div className="w-fit py-2 mb-2 text-lg font-bold text-[#0b1220]">
                Cancellation Policies
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: cancellation_policies,
                }}
                className="flex flex-col gap-1 text-sm ml-4 text-[#445069]"
              ></div>
            </div>
          </>
        )}
        </div>

        {/* {!isPageWide && (
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={() => setHandleShow(false)}
            />
          </FloatingView>
        )} */}
        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type != "combo" && (
          <div className="p-4 bg-[#fafaf5] sticky bottom-0 z-10 border-t border-[#ececec]">
            <button
              className="ttw-btn-remove-pill"
              onClick={() => handleDelete(booking || data)}
              disabled={loading}
            >
              {loading ? (
                <PulseLoader size={10} speedMultiplier={0.6} color="#CD2026" />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M8 6V4.5A1.5 1.5 0 019.5 3h5A1.5 1.5 0 0116 4.5V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M18.5 6l-.7 12.1a2 2 0 01-2 1.9H8.2a2 2 0 01-2-1.9L5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Delete Booking
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
    </>
  );
};

export default VehicleDetailModal;
