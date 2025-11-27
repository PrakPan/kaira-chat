import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import Drawer from "../../ui/Drawer";
import ActivityDetails from "./ActivityDetails";
import {
  activityDetail,
  activityBooking,
} from "../../../services/poi/poiActivities";
import { getDate } from "../../../helper/DateUtils";
import { openNotification } from "../../../store/actions/notification";
import ActivityDetailsSkeleton from "./ActivityDetailsSkeleton";
import setItinerary from "../../../store/actions/itinerary";
import { duration } from "@mui/material";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import media from "../../media";
import BackArrow from "../../ui/BackArrow";

const FloatingView = styled.div`
  position: sticky;
  bottom: 100px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 51;
  cursor: pointer;
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 95%;
    margin: auto;
  }
`;

const ActivityDetailsDrawer = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [data, setData] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateAmenities, setUpdateAmenities] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const itinerary = useSelector((state) => state.Itinerary);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const [hotelPickupIncluded,setHotelPickupIncluded] = useState(false);

  const num_adults = props?.pax?.adults;
  const num_children = props?.pax?.children;
  const [filterState, setFilterState] = useState({
    number_of_travelers: num_adults + num_children,
    traveler_ages: Array(num_adults).fill(null),
    children: num_children,
    adults: num_adults,
  });

  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show, filterState]);

  useEffect(() => {
    if (props.show) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.show]);

  const fetchData = (data) => {
    if (!data?.amenities) {
      setLoading(true);
    }
    let requestData = {
      start_date: getDate(props.date),
      number_of_adults: filterState.adults,
      number_of_children: filterState.children,
    };

    if (data?.amenities) {
      requestData.amenities = data.amenities;
      setUpdateAmenities(true);
    }

    activityDetail
      .post(`/${props.activityId}/`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setTraceId(res.data?.trace_id);
        if (res.data?.data?.activity.name) {
          setData(res.data?.data?.activity);
          setHotelPickupIncluded(res?.data?.data?.hotel_pickup_included);
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

  const updatedActivityBooking = async (data) => {
    try {
      const requestData = {
        itinerary_city_id: props?.itinerary_city_id,
        trace_id: traceId,
       ...(data?.result_index !== undefined && { result_index: data.result_index }),
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
              heading: res?.data?.activity?.name,
              icon: res?.data?.image,
              poi: null,
              rating: res?.data?.activity?.rating,
              user_ratings_total: res?.data?.activity?.user_ratings_total,
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

      if (props?.activityBookings == null) {
        props?.setActivityBookings([res?.data]);
      } else {
        props.setActivityBookings([...props?.activityBookings, res?.data]);
      }

      props.openNotification({
        type: "success",
        text: `Added ${res?.data?.name} activity to the itinerary`,
        heading: "Success!",
      });
      props?.setShowDrawer(false);
      return res; // ✅ return response so the caller knows it succeeded
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

      return err; // ❗ rethrow so the caller can handle error
    }
  };

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      width={"50%"}
      mobileWidth={"100%"}
      style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
      className="font-lexend overflow-y-hidden pb-[40px]"
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
        <div className="h-[100vh] px-4">
          <div className="z-1 flex flex-row items-center gap-2 pt-4 bg-white">
            <BackArrow handleClick={(e) => props.handleCloseDrawer(e)} />
          </div>
          <OptionsContainer className="px-2 center-div space-y-5">
            {error}
          </OptionsContainer>
        </div>
      )}

      {/* {!isPageWide && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={(e) => props.handleCloseDrawer(e)}
          />
        </FloatingView>
      )} */}
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

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(ActivityDetailsDrawer);
