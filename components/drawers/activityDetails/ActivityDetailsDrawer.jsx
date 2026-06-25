import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import Drawer from "../../ui/Drawer";
import ActivityDetails from "./ActivityDetails";
import { MERCURY_HOST } from "../../../services/constants";
import {
  activityDetail,
  activityBooking,
} from "../../../services/poi/poiActivities";
import { getDate } from "../../../helper/DateUtils";
import { openNotification } from "../../../store/actions/notification";
import ActivityDetailsSkeleton from "./ActivityDetailsSkeleton";
import setItinerary from "../../../store/actions/itinerary";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";

const ActivityDetailsDrawer = (props) => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateAmenities, setUpdateAmenities] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const itinerary = useSelector((state) => state.Itinerary);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const [hotelPickupIncluded, setHotelPickupIncluded] = useState(false);
  const currency = useSelector((state) => state.currency);

  // Default to 1 adult / 0 children when no pax prop is supplied (chat-opened
  // flow). Without this the request body and Add-to-itinerary payload carry
  // undefined values, and the card→drawer pax handoff drops to NaN.
  const num_adults = props?.pax?.adults ?? 1;
  const num_children = props?.pax?.children ?? 0;
  const child_ages = props?.pax?.childAges || [];

  const buildTravelerAges = () => [
    ...child_ages,
  ];

  const [filterState, setFilterState] = useState({
    number_of_travelers: num_adults + num_children,
    children_ages: buildTravelerAges(),
    children: num_children,
    adults: num_adults,
  });

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  useEffect(() => {
    if (props.show) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.show]);

  const fetchData = (data) => {
    const paxSource = data?._paxOverride || filterState;
    const dateSource = data?._dateOverride || props.date;
    // Day / time / amenity refetches re-render in place via the inline
    // "Updating" overlay. Routing them through setLoading would swap the
    // drawer for ActivityDetailsSkeleton, unmounting ActivityDetails and
    // resetting the user's day + time-of-day picks back to defaults.
    const isInlineUpdate = !!(
      data?.amenities || data?._dateOverride || data?._timeOverride
    );

    if (isInlineUpdate) {
      setUpdateAmenities(true);
    } else {
      setLoading(true);
    }

    let requestData = {
      start_date: getDate(dateSource),
      number_of_adults: paxSource.adults,
      number_of_children: paxSource.children,
      children_ages: paxSource?.children_ages || paxSource.traveler_ages,
    };

    // Source identifies which provider the activity came from (passed down
    // from the search-result item). The detail endpoint needs it to resolve
    // the correct upstream provider.
    const sourceValue = data?._sourceOverride || props.source;
    if (sourceValue) {
      requestData.source = sourceValue;
    }

    if (data?._timeOverride) {
      requestData.time_of_day = data._timeOverride;
    }

    if (data?.amenities) {
      requestData.amenities = data.amenities;
    }

    activityDetail
      .post(`/${props.activityId}/?currency=${currency.currency || "INR"}`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setTraceId(res.data?.trace_id);
        if (res.data?.data?.activity.name) {
          const activity = res.data?.data?.activity;
          setData(activity);
          setHotelPickupIncluded(activity?.hotel_pickup_included);
          // Sync filterState with the pax the API actually priced for
          // (prices[0].pax_details). Keeps the Travellers pill and the
          // bottom-bar price in lockstep — important on the chat-opened
          // flow where no pax prop is passed in.
          const paxDetails = activity?.prices?.[0]?.pax_details;
          if (paxDetails) {
            setFilterState((prev) => ({
              ...prev,
              adults: paxDetails.adults ?? prev.adults,
              children: paxDetails.children ?? prev.children,
              number_of_travelers:
                (paxDetails.adults ?? prev.adults ?? 0) +
                (paxDetails.children ?? prev.children ?? 0),
            }));
          }
        } else throw new Error(res.data?.message);
        setLoading(false);
        setUpdateAmenities(false);
      })
      .catch((err) => {
        setError(err.response?.data?.errors[0]?.message[0]);
        setLoading(false);
        setUpdateAmenities(false);
      });
  };

  const formatTime = (time24) => {
    if (!time24) return null;

    const [hours, minutes, seconds] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour;

    return `${hour12}:${minutes}`;
  };

  const updatedActivityBooking = async (data) => {
    try {
      const requestData = {
        itinerary_city_id: props?.itinerary_city_id,
        trace_id: traceId,
        ...(data?.result_index !== undefined && { result_index: data.result_index }),
        ...(data?.time !== undefined && { time: data.time }),
      };

      const res = await activityBooking.post(
        `${router.query?.id}/bookings/activity/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      dispatch(SetCallPaymentInfo(!CallPaymentInfo));

      const newItinerary = {
        ...itinerary,
        cities: itinerary?.cities?.map((city) => {
          if (city?.id === props?.itinerary_city_id) {
            const updatedActivities = [...(city?.activities || []), res?.data];

            const activityData = {
              activity: res?.data?.activity?.id,
              booking: {
                id: res?.data?.id,
                pax:
                  res?.data?.number_of_adults +
                  res?.data?.number_of_children +
                  res?.data?.number_of_infants,
                duration: res?.data?.duration,
              },
              element_type: "activity",
              heading: res?.data?.activity_data?.display_name || res?.data?.activity?.name,
              icon: res?.data?.image,
              poi: null,
              tags: res?.data?.activity_data?.tags || [],
              rating: res?.data?.activity?.rating,
              user_ratings_total: res?.data?.activity?.user_ratings_total,
              start_time: formatTime(res?.data?.check_in?.split(" ")?.[1]) || null,
              end_time: formatTime(res?.data?.check_out?.split(" ")?.[1]) || null,
              // Carry the picker's time-of-day onto the slab element so
              // CityDay.jsx's getTimeOfDay(item.time) buckets the new item
              // into the slot the user actually chose. Prefer the API's
              // value if it returned one.
              time: res?.data?.time || data?.time || requestData?.time || null,
            };

            const updatedDayByDay = city?.day_by_day?.map((day) => {
              if (day?.date === props?.date?.split("/").reverse().join("-")) {
                return {
                  ...day,
                  slab_elements: [...(day?.slab_elements || []), activityData],
                };
              }
              return day;
            });

            return {
              ...city,
              activities: updatedActivities,
              day_by_day: updatedDayByDay,
            };
          }
          return city;
        }),
      };

      dispatch(setItinerary(newItinerary));

      // Re-fetch the canonical itinerary after a successful add — mirrors the
      // activity/POI delete flow. The local push above gives instant feedback,
      // but the backend decides the slab element's final placement/indices, so
      // pulling the fresh response keeps the day-by-day view from showing stale
      // data and keeps slab indices correct for the next mutation.
      try {
        const refreshed = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (refreshed?.data) {
          // Preserve the resolved status — the itinerary GET can lag and
          // return a stale "Draft", which would hide finalized-only tabs.
          const priorStatus = itinerary?.status;
          const resolvedStatus =
            priorStatus && priorStatus !== "Draft"
              ? priorStatus
              : refreshed.data?.status;
          dispatch(setItinerary({ ...refreshed.data, status: resolvedStatus }));
        }
      } catch (refreshErr) {
        console.log("Failed to refresh itinerary after add:", refreshErr);
      }

      if (props?.activityBookings == null) {
        props?.setActivityBookings?.([res?.data]);
      } else {
        props?.setActivityBookings?.([...props?.activityBookings, res?.data]);
      }

      props.openNotification({
        type: "success",
        text: `Added ${res?.data?.name} activity to the itinerary`,
        heading: "Success!",
      });
      props?.setShowDrawer(false);
      return res;
    } catch (err) {
      console.error("error is:", err);

      if (err?.response?.status === 403) {
        props.openNotification({
          text: "You are not allowed to make changes to this itinerary",
          heading: "Error!",
          type: "error",
        });
      } else {
        props.openNotification({
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
          type: "error",
        });
      }

      return err;
    }
  };

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      width={"50%"}
      mobileWidth={"100%"}
      bgColor="#fafaf5"
      style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
      className="!overflow-y-hidden pb-[40px]"
      onHide={props.handleCloseDrawer}
    >
      {error == null ? (
        <>
          {!loading ? (
            <ActivityDetails
              itineraryDrawer={props.itineraryDrawer}
              data={data}
              date={props.date}
              handleCloseDrawer={props.handleCloseDrawer}
              fetchData={fetchData}
              updatedActivityBooking={updatedActivityBooking}
              updateAmenities={updateAmenities}
              filterState={filterState}
              setFilterState={setFilterState}
              setShowLoginModal={props?.setShowLoginModal}
              itinerary_city_id={props?.itinerary_city_id}
              hotel_pickup_included={hotelPickupIncluded}
              isBotQuery={props?.isBotQuery}
              showPackages={props?.showPackages}
              onAddToItinerary={props?.onAddToItinerary}
              traceId={traceId}
              fromChat={props?.fromChat}
            />
          ) : (
            <ActivityDetailsSkeleton
              itineraryDrawer={props.itineraryDrawer}
              name={props.name}
              handleCloseDrawer={props.handleCloseDrawer}
            />
          )}
        </>
      ) : (
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              alt="Back"
              onClick={(e) => props.handleCloseDrawer(e)}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center">
            <p className="ttw-type-body text-[#445069]">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchData();
              }}
              className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    plan: state.Plan,
    itineraryId: state.itineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ActivityDetailsDrawer);