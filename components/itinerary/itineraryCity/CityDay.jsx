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
`

const DivideSlabElement = styled.div`
    border-left: 1px dashed #A09E9E;
    margin-left: 1rem;
    padding: 10px 5px;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #A09E9E;
    min-height: 45px
`
import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { openNotification } from "../../../store/actions/notification";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 767px)");
  const [viewMore, setViewMore] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]);
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {trackActivityBookingAdd,trackActivityCardClicked} = useAnalytics();
  const dispatch = useDispatch();


  const router = useRouter()
  const { drawer, idx, itinerary_city_id, date } =
    router?.query;
  const handleAddActivity = () => {
    trackActivityBookingAdd(router.query.id,'day_by_day_collapse');
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.itinerary_city_id,
          idx: props?.index,
          date: props?.day?.date
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
  }, [])

const matchingIntracityBookings = props?.intracityBookings?.filter((booking) => {
  const checkIn = booking?.check_in?.split(" ")[0];
  const checkOut = booking?.check_out?.split(" ")[0];
  const allDates = getDatesInRange(checkIn, checkOut);

  const dayDate = new Date(props?.day?.date).toISOString().split("T")[0];
  return allDates.includes(dayDate);
});

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

  const handleDelete = async (val) => {
      if (!localStorage?.getItem("access_token")) {
        props?.setShowLoginModal(true);
        return;
      }
      const dataPassed = val != null ? val : taxiData;
      try {
        setLoading(true);
        const response = await axiosDeleteBooking.delete(
          `${router?.query?.id}/bookings/${
            dataPassed?.booking_type?.includes(",")
              ? `combo`
              : dataPassed?.booking_type?.toLowerCase()
          }/${dataPassed?.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
  
        if (response.status === 204) {
          dispatch(updateTransferBookings(dataPassed?.id));
          setLoading(false);
          props?.getPaymentHandler();
  
          setHandleShowTaxi(false);
          dispatch(
            openNotification({
              type: "success",
              text: `Taxi deleted successfully`,
              heading: "Success!",
            })
          );
        }
      } catch (err) {
        const errorMsg =
          err?.response?.data?.errors?.[0]?.message?.[0] ||
          err.response?.data?.errors[0]?.detail ||
          err.message;
        dispatch(
          openNotification({
            type: "error",
            text: errorMsg,
            heading: "Error!",
          })
        );
        setLoading(false);
      }
    };

  return (
    <div id="cityday" className="flex flex-col md:flex-row bg-[#FBFBFB]">
      <div className={`flex flex-col  md:w-[100%]  ${isPageWide ? 'ml-4 mr-[7px]' : ''}`}>
        <div className="flex items-center justify-between bg-white rounded-[8px] shadow-sm py-[8px] px-[16px] border-[#E5E5E5] border-[1px] mb-[8px]">
          <div className={`Body2M_14`}> Day {props.index + 1} |  <span>  {getHumanDateWithYearv2(props?.day?.date)} {props?.day?.day_summary ? " - " + props?.day?.day_summary : null}</span></div>
          <button
            onClick={() => setViewMore((prev) => !prev)}
            className="flex items-center text-sm font-semibold"
          >
              <Image
                src={'/assets/Itinerary/arrow-up.svg'}
                alt="ticket"
                width={12}
                height={8}
                className={`transition-200 ${viewMore ? '' : 'rotate-180'}`}
              />
          </button>
        </div>

        {viewMore ? <>
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

              {index !== elements.length - 1  ? <DivideSlabElement>  {props?.city?.nextTime ? '2h' : '' } </DivideSlabElement> : null}
            </>
          ))}

          {finalized_status === "PENDING" ? (
            <div className="mt-3 w-48 h-[20px] bg-gray-300 rounded animate-pulse"></div>
          ) : (
            <div className="flex justify-end">
            <button
              onClick={handleAddActivity}
              className="mt-3  w-fit text-[14px] text-[#3A85FC;] underline font-medium font-montserrat"
            >
              + Add 
            </button>
            </div>
          )}
        </>

          : null}

        {matchingIntracityBookings &&
          formattedTaxiDetails &&
          matchingIntracityBookings?.length > 0 &&  (
            <>
              <hr />
              <div className="">
                <SectionHeading className="p-2">
                  {formattedTaxiDetails?.length > 0 && <>Taxi:</>}
                </SectionHeading>
                <div className="flex flex-col gap-2 w-full font-montserrat">
                  <div className="flex flex-wrap gap-2">
                    {formattedTaxiDetails?.map((item) => (
                      <div key={item?.id}>
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
                                    return `${pax} Passenger${pax > 1 ? "s" : ""
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

                         {drawer == "SightSeeing" && item?.id == bookingId && (
                            <>
                           
                            <TransferDrawer
                              show={drawer == "SightSeeing" && item?.id == bookingId}
                              setHandleShow={setHandleShowTaxi}
                              bookingData={taxiData}
                              booking_type={"Taxi"}
                              booking_id={item?.id}
                              loading={loading}
                              handleDelete={handleDelete}
                              origin_itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
                              destination_itinerary_city_id={
                                props?.city?.id || props?.city?.gmaps_place_id
                              }
                              itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
                              
                              setShowDrawer={setHandleShowTaxi}
                              // city={city}
                              _updateFlightBookingHandler={
                                props?._updateFlightBookingHandler
                              }
                              _updatePaymentHandler={props?._updatePaymentHandler}
                              getPaymentHandler={props?.getPaymentHandler}
                              // oCityData={oCityData}
                              // dCityData={dCityData}
                              setShowLoginModal={props?.setShowLoginModal}
                              setError={props?.setError}
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
                            </>
                          )}
                      </div>
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
      {drawer === "showAddActivity" && itinerary_city_id == props?.itinerary_city_id && idx == props?.index && (
        <ActivityAddDrawer
          showDrawer={itinerary_city_id == props?.itinerary_city_id && idx == props?.index}
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

      {handleShowTaxi && (
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
      )}
    </div>
  );
};

export default CityDay;
