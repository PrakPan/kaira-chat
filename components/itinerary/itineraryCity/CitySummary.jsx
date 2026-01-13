import { useState, useEffect } from "react";

import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";
import ImageLoader from "../../ImageLoader";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { openNotification } from "../../../store/actions/notification";
import { BsPeopleFill } from "react-icons/bs";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { useAnalytics } from "../../../hooks/useAnalytics";

const CitySummary = (props) => {
  const router = useRouter();
  const [dayByDay, setDayByDay] = useState(null);
  const [poi, setPoi] = useState(0);
  const [activities, setActivities] = useState(null);
  const [dayByDayIndex, setDayByDayIndex] = useState(0);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  var size = 0;
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {trackActivityBookingAdd,trackActivityCardClicked} = useAnalytics();
  const {id} = useSelector(state=>state.auth) 
  const dispatch = useDispatch();
  const {
    drawer,
    poi_id,
    type,
    dayIndex,
    index,
    itinerary_city_id,
    idx,
    date,
    bookingId,
  } = router?.query;
  const  activityData = {
    id: poi_id,
    type: type,
    dayIndex: dayIndex,
    index: index,
  };
  const handleView = async (poi, type, dayIndex) => {
    trackActivityCardClicked(router.query.id,poi,'day_by_day_collapse');
    try {
      router.push(
        {
          pathname: `/itinerary/${router.query.id}`,
          query: {
            drawer: "showPoiDetail",
            poi_id: poi,
            type: type,
            dayIndex: dayIndex,
            itinerary_city_id:props?.itinerary_city_id
          },
        },
        undefined,
        {
          scroll: false,
        }
      );
    } catch (error) {
      console.log("error is:", error);
    }
  };
  useEffect(() => {
    let dayByDayArray = [];
    let activityArray = [];
    var index = 0;
    for (const daybyday of props.city.day_by_day) {
      for (const element of daybyday?.slab_elements) {
        if (element.element_type === "activity") {
          element.dayIndex = index;
          dayByDayArray.push(element);
        }
      }
      index += 1;
    }
    index = 0;

    setActivities(props.city.activities);
    setDayByDay(dayByDayArray);
  }, [props.city]);

  const handleActivity = (poiData, index, dayIndex) => {
    setDayByDayIndex(index);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showPoiDetail",
          poi_id: poiData?.booking?.id
            ? poiData?.booking?.id
            : poiData?.poi
            ? poiData?.poi
            : poiData?.activity
            ? poiData?.activity
            : null,
          type: poiData?.activity ? "activity" : "poi",
          index: index,
          dayIndex: dayIndex,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
    setPoi(poiData);

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: dayByDay[index].heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const handleAddActivity = () => {
    trackActivityBookingAdd(router.query.id,'day_by_day_collapse');
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.city?.id,
          idx: 0,
          date: props?.city?.start_date,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handleCloseAddActivity = () => {
    router.push(
      {
        pathname: `/itinerary/${router?.query?.id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };

  const handleSeeMore = () => {
    props.setViewMore(true);
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    router.push(
      {
        pathname: `/itinerary/${router?.query?.id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };

  const formattedTaxiDetails = props?.intracityBookings?.map(
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
        date:
          formattedCheckIn === formattedCheckOut
            ? `Day ${index + 1}, ${formattedCheckIn}`
            : `${formattedCheckIn} to ${formattedCheckOut}`,
        fromLocation: booking.transfer_details?.source?.name || "",
        toLocation: booking.transfer_details?.destination?.name || "",
        passengers:
          booking.number_of_adults +
          booking.number_of_children +
          booking.number_of_infants,
        // duration: booking.transfer_details?.duration?.text || 'N/A',
      };
    }
  );

  const handleTaxi = async (id) => {
    setHandleShowTaxi(true);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "SightSeeing",
          bookingId: id,
          itinerary_city_id: props?.city?.id,
        },
      },
      undefined,
      { scroll: false }
    );

    // try {
    //   setLoading(true);
    //   setTaxiData(null);

    //   const res = await axios.get(
    //     `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/taxi/${id}/`
    //   );

    //   setTaxiData(res?.data);
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);

    //   dispatch(
    //     openNotification({
    //       type: "error",
    //       text: `${error.response?.data?.errors[0]?.message[0]}`,
    //       heading: "Error!",
    //     })
    //   );
    // } finally {
    // }
  };

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
    <div className="p-3 flex flex-col gap-3">
      {dayByDay && dayByDay.length ? (
        <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row">
          <div className="text-[14px] font-medium leading-[22px] w-[80px]">
            Explore:{" "}
          </div>
          <div className="text-sm font-normal flex flex-row items-center flex-wrap gap-1 w-[]">
            {dayByDay.map((poi, index) => {
              if (!poi.activity) {
                size += 1;
              }
              return (
                size <= 3 &&
                !poi?.activity && (
                  <>
                    <span
                      onClick={() => handleActivity(poi, index, poi.dayIndex)}
                      key={index}
                      id={index}
                      className="cursor-pointer hover:text-blue border-2 rounded-full px-2 lg:px-3 md:px-3 py-1"
                    >
                      {poi.heading}
                    </span>
                    {/* {dayByDay && dayByDay.length ? (
                      <>
                        {drawer === "showPoiDetail" &&
                          String(poi_id) === String(poi?.poi) && (
                            <POIDetailsDrawer
                              itineraryDrawer
                              show={true}
                              handleCloseDrawer={handleCloseDrawer}
                              slabIndex={dayByDayIndex}
                              iconId={
                                dayByDay?.[dayByDayIndex]
                                  ? dayByDay?.[dayByDayIndex]?.poi
                                  : dayByDay?.[dayByDayIndex]?.activity
                              }
                              name={dayByDay?.[dayByDayIndex]?.heading}
                              image={dayByDay[dayByDayIndex].icon}
                              text={dayByDay[dayByDayIndex]?.text}
                              Topheading={"Select Our Point Of Interest"}
                              activityData={activityData}
                              showBookingDetail={true}
                              setShowLoginModal={props?.setShowLoginModal}
                              dayIndex={dayIndex}
                              itinerary_city_id={props.city.id}
                              cityID={props.city.city.id}
                              cityName={props.city.city.name}
                              removeDelete={false}
                            />
                          )}
                      </>
                    ) : null} */}
                  </>
                )
              );
            })}
            <span
              onClick={handleSeeMore}
              className="ml-2 text-blue hover:underline font-[600] text-[12px] leading-[22px] cursor-pointer"
            >
              {size > 3 && `+${size - 3} more`}
            </span>
          </div>
        </div>
      ) : null}
      <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row">
        <div className="text-[14px] font-medium leading-[22px] w-[80px]">
          {activities?.length > 0 && <>Activity:</>}{" "}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap gap-2">
            {activities?.map((item) => (
              <>
                <div
                  key={item.id}
                  className="flex gap-2 group w-[333px] p-[10px] border-[2px] rounded-[12px] shadow-none hover:cursor-pointer hover:bg-[rgb(254_250_216)] bg-opacity-100"
                  onClick={() => handleView(item.id, "activity", poi.dayIndex)}
                >
                  <div className="w-[50px]">
                    <ImageLoader
                      borderRadius={"5px"}
                      style={{
                        width: "48px",
                        height: "48px",
                        cursor: "pointer",
                        margin: "auto",
                      }}
                      url={item?.image}
                    />
                  </div>
                  <div>
                    <div className="flex gap-1">
                      <div className="w-fit font-semibold  text-[12px] cursor-pointer">
                        {item?.name}
                      </div>
                      <div className="hidden group-hover:!block">
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
                      </div>
                    </div>
                    <div className="flex gap-3 text-[12px] ">
                      <div className="w-auto flex items-center gap-1">
                        <svg
                          width="14"
                          height="11"
                          viewBox="0 0 14 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.8 8.08398L6.66667 6.68398L8.5 8.08398L7.8 5.81732L9.66667 4.35065H7.4L6.66667 2.08398L5.93333 4.35065H3.66667L5.5 5.81732L4.8 8.08398ZM1.33333 10.7507C0.966667 10.7507 0.652778 10.6201 0.391667 10.359C0.130556 10.0979 0 9.78399 0 9.41732V7.16732C0 7.0451 0.0388889 6.93954 0.116667 6.85065C0.194444 6.76176 0.294444 6.70621 0.416667 6.68398C0.683333 6.5951 0.902778 6.43398 1.075 6.20065C1.24722 5.96732 1.33333 5.70621 1.33333 5.41732C1.33333 5.12843 1.24722 4.86732 1.075 4.63398C0.902778 4.40065 0.683333 4.23954 0.416667 4.15065C0.294444 4.12843 0.194444 4.07287 0.116667 3.98398C0.0388889 3.8951 0 3.78954 0 3.66732V1.41732C0 1.05065 0.130556 0.736762 0.391667 0.475651C0.652778 0.21454 0.966667 0.0839844 1.33333 0.0839844H12C12.3667 0.0839844 12.6806 0.21454 12.9417 0.475651C13.2028 0.736762 13.3333 1.05065 13.3333 1.41732V3.66732C13.3333 3.78954 13.2944 3.8951 13.2167 3.98398C13.1389 4.07287 13.0389 4.12843 12.9167 4.15065C12.65 4.23954 12.4306 4.40065 12.2583 4.63398C12.0861 4.86732 12 5.12843 12 5.41732C12 5.70621 12.0861 5.96732 12.2583 6.20065C12.4306 6.43398 12.65 6.5951 12.9167 6.68398C13.0389 6.70621 13.1389 6.76176 13.2167 6.85065C13.2944 6.93954 13.3333 7.0451 13.3333 7.16732V9.41732C13.3333 9.78399 13.2028 10.0979 12.9417 10.359C12.6806 10.6201 12.3667 10.7507 12 10.7507H1.33333ZM1.33333 9.41732H12V7.71732C11.5889 7.47287 11.2639 7.14787 11.025 6.74232C10.7861 6.33676 10.6667 5.8951 10.6667 5.41732C10.6667 4.93954 10.7861 4.49787 11.025 4.09232C11.2639 3.68676 11.5889 3.36176 12 3.11732V1.41732H1.33333V3.11732C1.74444 3.36176 2.06944 3.68676 2.30833 4.09232C2.54722 4.49787 2.66667 4.93954 2.66667 5.41732C2.66667 5.8951 2.54722 6.33676 2.30833 6.74232C2.06944 7.14787 1.74444 7.47287 1.33333 7.71732V9.41732Z"
                            fill="#01202B"
                          />
                        </svg>{" "}
                        <div>
                          {item?.pax ||
                            item?.number_of_adults +
                              item?.number_of_children +
                              item?.number_of_infants}{" "}
                          ticket
                          {item?.pax ||
                          item?.number_of_adults +
                            item?.number_of_children +
                            item?.number_of_infants >
                            1
                            ? "s"
                            : ""}
                        </div>
                      </div>
                      {item?.duration && item?.duration != "0 hours" && (
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
                {/* {dayByDay && dayByDay.length ? (
                  <>
                    {drawer === "showPoiDetail" &&
                      String(poi_id) === String(item.id) && (
                        <POIDetailsDrawer
                          itineraryDrawer
                          show={true}
                          handleCloseDrawer={handleCloseDrawer}
                          slabIndex={dayByDayIndex}
                          iconId={
                            dayByDay?.[dayByDayIndex]
                              ? dayByDay?.[dayByDayIndex]?.poi
                              : dayByDay?.[dayByDayIndex]?.activity
                          }
                          name={dayByDay?.[dayByDayIndex]?.heading}
                          image={dayByDay[dayByDayIndex].icon}
                          text={dayByDay[dayByDayIndex]?.text}
                          Topheading={"Select Our Point Of Interest"}
                          activityData={activityData}
                          showBookingDetail={true}
                          setShowLoginModal={props?.setShowLoginModal}
                          dayIndex={dayIndex}
                          itinerary_city_id={props.city.id}
                          cityID={props.city.city.id}
                          cityName={props.city.city.name}
                          removeDelete={false}
                        />
                      )}
                  </>
                ) : null} */}
              </>
            ))}
          </div>
          {finalized_status === "PENDING" ? (
            <div className="mt-3 w-48 h-[20px] bg-gray-300 rounded animate-pulse"></div>
          ) : (
            <p
              className=" text-blue cursor-pointer font-semibold underline"
              onClick={handleAddActivity}
            >
              + Add Activity in {props?.city?.city?.name}
            </p>
          )}
        </div>
      </div>

      {props?.intracityBookings &&
        formattedTaxiDetails &&
        props?.intracityBookings?.length > 0 && (
          <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row">
            <div className="text-[14px] font-medium leading-[22px] w-[80px]">
              {formattedTaxiDetails?.length > 0 && <>Taxi:</>}{" "}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-wrap gap-2">
                {formattedTaxiDetails?.map((item) => (
                  <>
                    <div
                      key={item.id}
                      className="group relative flex gap-2 w-[333px] p-[10px] border-[2px] rounded-[12px] shadow-none cursor-pointer hover:bg-[rgb(254_250_216)] bg-opacity-100"
                      onClick={() => handleTaxi(item.id)}
                    >
                      <div className="absolute top-2 sm:top-[10px] right-2 opacity-0 group-hover:!opacity-100 transition-opacity duration-200 z-10 p-1">
                        <FaPen size={12} />
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
                            item?.transfer_details?.quote?.taxi_category?.image
                          }
                        />
                      </div>

                      <div>
                        <span className="font-normal text-[12px] text-[#8a989d]">
                          {item.date}
                        </span>
                        <div className="w-full h-px bg-gray-200 mb-2" />
                        <div className="flex gap-1 relative">
                          <div className="w-fit font-[450] text-[12px] ">
                            {item?.name}
                          </div>
                        </div>
                        <div className="flex gap-3 text-[12px] font-normal">
                          <div className="w-auto flex items-center gap-1">
                            <BsPeopleFill />
                            <div>
                              {(() => {
                                const pax =
                                  item?.pax ??
                                  item?.number_of_adults +
                                    item?.number_of_children +
                                    item?.number_of_infants;
                                return `${pax} Passenger${pax > 1 ? "s" : ""}`;
                              })()}
                            </div>
                          </div>
                          {item?.duration && item?.duration != "0 hours" && (
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
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        )}

      {dayByDay && dayByDay.length ? (
        <>
          <POIDetailsDrawer
            itineraryDrawer
            show={showDrawer}
            handleCloseDrawer={handleCloseDrawer}
            slabIndex={dayByDayIndex}
            iconId={
              dayByDay?.[dayByDayIndex]
                ? dayByDay?.[dayByDayIndex]?.poi
                : dayByDay?.[dayByDayIndex]?.activity
            }
            name={dayByDay?.[dayByDayIndex]?.heading}
            image={dayByDay[dayByDayIndex].icon}
            text={dayByDay[dayByDayIndex]?.text}
            Topheading={"Select Our Point Of Interest"}
            activityData={activityData}
            showBookingDetail={showBookingDetail}
            setShowLoginModal={props?.setShowLoginModal}
            dayIndex={activityData.dayIndex}
            itinerary_city_id={props.city.id}
            cityID={props.city.city.id}
            cityName={props.city.city.name}
            removeDelete={false}
          />
        </>
      ) : null}
      <ActivityAddDrawer
        showDrawer={showAddDrawer}
        setShowDrawer={setShowAddDrawer}
        cityName={props.city.city.name}
        cityID={props.city.city.id}
        date={props?.city?.start_date}
        start_date={props?.city?.start_date}
        itinerary_city_id={props?.city?.id}
        setActivities={setActivities}
        activities={activities}
        activityBookings={props?.activityBookings}
        setActivityBookings={props?.setActivityBookings}
        day="Day 1"
        duration={props.city.duration}
        setItinerary={props?.setItinerary}
        setShowLoginModal={props?.setShowLoginModal}
      ></ActivityAddDrawer>

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

export default CitySummary;