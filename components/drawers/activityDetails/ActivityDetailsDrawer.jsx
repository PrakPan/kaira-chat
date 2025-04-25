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

const ActivityDetailsDrawer = (props) => {
  //console.log("day by day:",props?.setItinerary)
  const router = useRouter();
  const [data, setData] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateAmenities, setUpdateAmenities] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const itinerary=useSelector((state)=>state.Itinerary)
  console.log("itinerary is:",itinerary)
  const num_adults = props?.pax?.adults
  const num_children = props?.pax?.children
  console
  const [filterState, setFilterState] = useState({
    number_of_travelers:  num_adults + num_children,
    traveler_ages: Array(num_adults).fill(null),
    children: num_children,
    adults: num_adults,
  });
  const dispatch=useDispatch();

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show, filterState]);

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
      .post(`/${props.activityId}/`, requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        setTraceId(res.data?.trace_id);
        if (res.data?.data?.activity.name) {
          setData(res.data?.data?.activity);
        } else throw new Error(res.data?.message);
        setLoading(false);
        setUpdateAmenities(false);
      })
      .catch((err) => {
        setData({
          name: props.name,
          short_description: props.text,
          image: props.image,
        });
        setLoading(false);
        setUpdateAmenities(false);
      });
  };

  const updatedActivityBooking = () => {
    const requestData = {
      itinerary_city_id: props?.itinerary_city_id,
      trace_id: traceId,
    };

    activityBooking
      .post(`${router.query?.id}/bookings/activity/`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {

        const newItinerary = {
          ...itinerary,
          cities: itinerary?.cities?.map((city) => {
            if (city?.city?.id === props?.cityId) {
              const updatedActivities = [...(city?.activities || []), res?.data];
        
              const activityData={
                activity:res?.data?.activity?.id,
                booking:{
                  id:res?.data?.id,
                  pax:res?.data?.number_of_adults+res?.data?.number_of_children+res?.data?.number_of_infants,
                  duration:res?.data?.duration
                },
                element_type:"activity",
                heading:res?.data?.activity?.name,
                icon:res?.data?.image,
                poi:null,
                rating:res?.data?.activity?.rating,
                user_ratings_total:res?.data?.activity?.user_ratings_total
              }
              const updatedDayByDay = city?.day_by_day?.map((day) => {
                if (day?.date === props?.date) {
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

        if(props?.activityBookings==null){
          props?.setActivityBookings([res?.data])
        }
        else{
          props.setActivityBookings([...props?.activityBookings, res?.data]);
        }
        props.openNotification({
          type: "success",
          text: `Added ${res?.data?.name} activity to the itinerary`,
          heading: "Success!",
        });
      })
      .catch((err) => {
        console.log("error is:", err);
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
      });
  };

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      width={"50%"}
      mobileWidth={"100%"}
      style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
      className="font-lexend"
      onHide={props.handleCloseDrawer}
    >
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
        />
      ) : (
        <ActivityDetailsSkeleton
          itineraryDrawer={props.itineraryDrawer}
          name={props.name}
          handleCloseDrawer={props.handleCloseDrawer}
        />
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

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(ActivityDetailsDrawer);
