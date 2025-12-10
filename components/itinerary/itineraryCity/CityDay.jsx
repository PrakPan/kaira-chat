import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useDispatch, useSelector } from "react-redux";
import { BsPeopleFill } from "react-icons/bs";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { FaEdit } from "react-icons/fa";
import ImageLoader from "../../ImageLoader";
import { useRouter } from "next/router";
import styled from "styled-components";
import Image from "next/image";
import { getHumanDateWithYearv2 } from "../../../services/getHumanDateV2";
import { getDate } from "../../../helper/ConvertDateFormat";

const SectionHeading = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
`;

const DivideSlabElement = styled.div`
  border-left: 1px dashed #a09e9e;
  margin-left: 2.5rem;
  padding: 10px 5px;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 12px;
  color: #a09e9e;
  min-height: 32px;
  gap: 6px;
`;
import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import { MdOutlineDownhillSkiing } from "react-icons/md";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 767px)");
  const [viewMore, setViewMore] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]);
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { trackActivityBookingAdd, trackActivityCardClicked } = useAnalytics();
  const transferBookings = useSelector(
    (state) => state.TransferBookings
  ).transferBookings;
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");

  console.log("next city", props?.nextCity);

  const router = useRouter();
  const { drawer, idx, itinerary_city_id, date } = router?.query;
  const handleAddActivity = () => {
    trackActivityBookingAdd(router.query.id, "day_by_day_collapse");
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.itinerary_city_id,
          idx: props?.index,
          date: props?.day?.date,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };
  useEffect(() => {
    let elements = [];
    for (let elem of props.day.slab_elements) {
      if (["activity", "recommendation"].includes(elem.element_type)) {
        elements.push(elem);
      }
    }

    setElements(elements);
  }, [props.day?.slab_elements]);

  useEffect(() => {
    if (props?.index === 0) {
      setViewMore(true);
    }
  }, []);

  const matchingIntracityBookings = props?.intracityBookings?.filter(
    (booking) => {
      const checkIn = booking?.check_in?.split(" ")[0];
      const checkOut = booking?.check_out?.split(" ")[0];
      const allDates = getDatesInRange(checkIn, checkOut);

      const dayDate = new Date(props?.day?.date).toISOString().split("T")[0];
      return allDates.includes(dayDate);
    }
  );

  const formattedTaxiDetails = matchingIntracityBookings?.map(
    (booking, index) => {
      const checkInDate = new Date(booking?.check_in);
      const checkOutDate = new Date(booking?.check_out);

      const formattedCheckIn = checkInDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      const formattedCheckOut = checkOutDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      return {
        ...booking,
        id: booking.id,
        currentDayLabel: `Day ${props.index + 1}, ${getDate(props?.day?.date)}`,
        // date: formattedCheckIn === formattedCheckOut
        //   ? `Day ${index + 1}, ${formattedCheckIn}`
        //   : `${formattedCheckIn} to ${formattedCheckOut}`,
        fromLocation:
          booking.transfer_details?.source?.name || "Unknown Source",
        toLocation:
          booking.transfer_details?.destination?.name || "Unknown Destination",
        passengers:
          booking.number_of_adults +
          booking.number_of_children +
          booking.number_of_infants,
        // duration: booking.transfer_details?.duration?.text || 'N/A',
      };
    }
  );
  return (
    <div
      id="cityday"
      className="flex flex-col md:flex-row bg-transparent mb-[8px]"
    >
      <div
        className={`flex flex-col md:w-[100%] rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ${
          viewMore ? "bg-[#FFFAF5]" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-t-[8px] py-[12px] px-[16px] cursor-pointer`}
          onClick={() => setViewMore((prev) => !prev)}
        >
          <div className="text-[14px] font-medium text-[#333333]">
            {isPageWide ? `Day ${props.index + 1} | ` : ""}
            <span>
              {getHumanDateWithYearv2(props?.day?.date)}
              {props?.day?.day_summary ? " - " + props?.day?.day_summary : null}
            </span>
          </div>
          <button className="flex items-center">
            <Image
              src={"/assets/Itinerary/arrow-up.svg"}
              alt="toggle"
              width={12}
              height={8}
              className={`transition-transform duration-200 ${
                viewMore ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {viewMore && (
          <>
            {elements.length === 0 ? (
              // Empty state when no activities
              <>
                <div className="mx-[16px] my-[16px] p-[16px] bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="flex gap-[16px]">
                    {/* Icon on the left */}
                    <div className="flex-shrink-0">
                      {/* <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#F5F5F5"/>
                <path d="M20 12L12 16.5V22C12 27.5 15.5 32 20 33.5C24.5 32 28 27.5 28 22V16.5L20 12Z" fill="#A09E9E"/>
              </svg> */}
                      <MdOutlineDownhillSkiing color="#A09E9E" size={24} />
                    </div>

                    {/* Text content on the right */}
                    <div className="flex-1">
                      <div className="text-[16px] text-[#333333] mb-[8px]">
                        No activities
                      </div>
                      <div className="text-[14px] text-[#666666] mb-[16px]">
                        No activities have been added yet. Tap the '+' to add
                        one
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-[12px]">
                        <button
                          onClick={handleAddActivity}
                          className="py-[8px] px-[16px] bg-[#07213A] rounded-[8px] text-[14px] text-white"
                        >
                          + Activity
                        </button>
                        {/* <button
                  className="py-[8px] px-[16px] bg-[#07213A] rounded-[8px] text-[14px] text-white font-medium"
                >
                  + Sightseeing
                </button> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout message for last day even when no activities */}
                {props?.isLastDay && (
                  <div className="px-[16px] pb-[16px]">
                    <div className="p-[16px] bg-white flex gap-[16px] items-center rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      <img
                        src="/checkout.png"
                        alt="checkout"
                        className="w-[71px] h-[47px] object-contain flex-shrink-0"
                      />
                      <div className="text-[14px] font-medium text-[#333333] leading-[22px]">
                        This is your check out day in {props?.city?.name}, take
                        a{" "}
                        {transferBookings?.intercity?.[
                          `${props?.city?.id}:${
                            props?.nextCity?.id ||
                            props?.nextCity?.gmaps_place_id
                          }`
                        ]?.booking_type || "taxi"}{" "}
                        to{" "}
                        {props?.nextCity?.city?.name ||
                          itineraryDaybyDay?.end_city?.name}
                        .
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Render activities */}
                {elements.map((element, index) => (
                  <>
                    <SlabElement
                      itinerary_city_id={props?.itinerary_city_id}
                      key={index}
                      element={element}
                      dayIndex={props?.index}
                      slabIndex={index}
                      setShowLoginModal={props?.setShowLoginModal}
                      date={props?.date}
                      cityID={props.city.id}
                      cityName={props.city.name}
                      totalElements={elements.length}
                    />
                    {index !== elements.length - 1 ? (
                      <DivideSlabElement>
                        {props?.city?.nextTime ? "2h" : ""}
                      </DivideSlabElement>
                    ) : null}
                  </>
                ))}

                {/* Add Activity button - only show when there are activities */}
                {finalized_status === "PENDING" ? (
                  <div className="mt-3 ml-4 w-48 h-[20px] bg-gray-300 rounded animate-pulse"></div>
                ) : (
                  <div className="flex justify-start pl-[16px] pb-[16px] pt-[8px]">
                    <button
                      onClick={handleAddActivity}
                      className="py-[8px] px-[16px] bg-[#07213A] rounded-[8px] text-[14px] text-white"
                    >
                      + Activity
                    </button>
                  </div>
                )}

                {/* Checkout message when there are activities AND it's last day */}
                {props?.isLastDay && (
                  <div className="px-[16px] pb-[16px]">
                    <div className="p-[16px] bg-white flex gap-[16px] items-center rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      <img
                        src="/checkout.png"
                        alt="checkout"
                        className="w-[71px] h-[47px] object-contain flex-shrink-0"
                      />
                      <div className="text-[14px] font-medium text-[#333333] leading-[22px]">
                        This is your check out day in {props?.city?.name}, take
                        a{" "}
                        {transferBookings?.intercity?.[
                          `${props?.city?.id}:${
                            props?.nextCity?.id ||
                            props?.nextCity?.gmaps_place_id
                          }`
                        ]?.booking_type || "taxi"}{" "}
                        to{" "}
                        {props?.nextCity?.city?.name ||
                          itineraryDaybyDay?.end_city?.name}
                        .
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {matchingIntracityBookings &&
          formattedTaxiDetails &&
          matchingIntracityBookings?.length > 0 && (
            <>
              <hr />
              <div className="">
                <SectionHeading className="p-2">
                  {formattedTaxiDetails?.length > 0 && <>Taxi:</>}
                </SectionHeading>
                <div className="flex flex-col gap-2 w-full font-montserrat">
                  <div className="flex flex-wrap gap-2">
                    {formattedTaxiDetails?.map((item) => (
                      <>
                        <div
                          key={item.id}
                          className="flex gap-3 items-center bg-white border-radius-10 p-2 border-1 w-100 mb-2"
                          // onClick={() => handleTaxi(item.id)}
                        >
                          <div className="hidden hover:block cursor-pointer">
                            <FaEdit />
                          </div>

                          <div className="w-[50px] h-[50px] flex items-center justify-center ">
                            <ImageLoader
                              borderRadius="5px"
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "contain",
                                cursor: "pointer",
                                margin: "auto",
                                // display: "block",
                              }}
                              url={
                                item?.transfer_details?.quote?.taxi_category
                                  ?.image
                              }
                            />
                          </div>

                          <div class="w-100">
                            <span className="font-semibold  text-[12px]">
                              {item.currentDayLabel}
                            </span>
                            <div className="w-full h-px bg-gray-200 mb-2" />
                            <div className="flex gap-1 relative">
                              <div className="w-fit font-semibold  text-[12px] cursor-pointer">
                                {item?.name}
                              </div>
                              {/* <div className="hidden group-hover:!block ">
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 24 24"
                                class="mt-1"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                              </svg>
                            </div> */}
                            </div>
                            <div className="flex gap-3 text-[12px] ">
                              <div className="w-auto flex items-center gap-1">
                                <BsPeopleFill />
                                <div>
                                  {(() => {
                                    const pax =
                                      item?.pax ??
                                      item?.number_of_adults +
                                        item?.number_of_children +
                                        item?.number_of_infants;
                                    return `${pax} Passenger${
                                      pax > 1 ? "s" : ""
                                    }`;
                                  })()}
                                </div>
                              </div>
                              {item?.duration &&
                                item?.duration != "0 hours" && (
                                  <div className="w-auto flex items-center gap-1">
                                    <svg
                                      width="13"
                                      height="13"
                                      viewBox="0 0 13 13"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6.32734 0.417969C3.01534 0.417969 0.333344 3.10597 0.333344 6.41797C0.333344 9.72997 3.01534 12.418 6.32734 12.418C9.64534 12.418 12.3333 9.72997 12.3333 6.41797C12.3333 3.10597 9.64534 0.417969 6.32734 0.417969ZM6.33334 11.218C3.68134 11.218 1.53334 9.06997 1.53334 6.41797C1.53334 3.76597 3.68134 1.61797 6.33334 1.61797C8.98534 1.61797 11.1333 3.76597 11.1333 6.41797C11.1333 9.06997 8.98534 11.218 6.33334 11.218ZM6.20134 3.41797H6.16534C5.92534 3.41797 5.73334 3.60997 5.73334 3.84997V6.68197C5.73334 6.89197 5.84134 7.08997 6.02734 7.19797L8.51734 8.69197C8.72134 8.81197 8.98534 8.75197 9.10534 8.54797C9.23134 8.34397 9.16534 8.07397 8.95534 7.95397L6.63334 6.57397V3.84997C6.63334 3.60997 6.44134 3.41797 6.20134 3.41797Z"
                                        fill="black"
                                      />
                                    </svg>
                                    {item?.duration}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        {/* <div className="py-3">
          <button className="bg-[#F7E700] text-black text-sm font-normal py-1 px-3 rounded border-1 border-black">
            + Add Sightseeing Taxi
          </button>
        </div> */}
      </div>
      {drawer === "showAddActivity" &&
        itinerary_city_id == props?.itinerary_city_id &&
        idx == props?.index && (
          <ActivityAddDrawer
            showDrawer={
              itinerary_city_id == props?.itinerary_city_id &&
              idx == props?.index
            }
            mercuryItinerary={props?.mercuryItinerary}
            setShowDrawer={setShowAddDrawer}
            cityName={props.city.name}
            cityID={props.city.id}
            date={date}
            setItinerary={props?.setItinerary}
            itinerary_city_id={props?.itinerary_city_id}
            day={`Day ${idx + 1}`}
            duration={props.duration}
            start_date={props?.start_date}
            day_slab_index={idx}
            setShowLoginModal={props?.setShowLoginModal}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
          ></ActivityAddDrawer>
        )}

      {/* {handleShowTaxi && (
        <TransferDrawer
          show={handleShowTaxi}
          setHandleShow={setHandleShowTaxi}
          data={taxiData}
          booking_type={taxiData?.transferType || taxiData?.booking_type}
          loading={loading}
          handleDelete={handleDelete}
          setShowDrawer={setHandleShowTaxi}
          // city={city}
          _updateFlightBookingHandler={props?._updateFlightBookingHandler}
          _updatePaymentHandler={props?._updatePaymentHandler}
          getPaymentHandler={props?.getPaymentHandler}
          // oCityData={oCityData}
          // dCityData={dCityData}
          setShowLoginModal={props?.setShowLoginModal}
          // dcity={destination_city_name}
          // selectedBooking={selectedBooking}
          // setSelectedBooking={setSelectedBooking}
          // originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
          // destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
          // origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
          // destination_itinerary_city_id={dCityData?.id || dCityData?.gmaps_place_id}
          isIntracity={true}
          isSightseeing={true}
        />
      )} */}
    </div>
  );
};

export default CityDay;
