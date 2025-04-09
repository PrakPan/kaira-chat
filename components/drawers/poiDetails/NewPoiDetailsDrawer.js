import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import Drawer from "../../ui/Drawer";
import POIDetailsSkeleton from "../poiDetails/POIDetailsSkeleton";
import { getDate } from "../../../helper/DateUtils";
import { openNotification } from "../../../store/actions/notification";
import { toast } from "react-toastify";
import PoiDetails from "./NewPoiDetails";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";

const NewPoiDetailsDrawer = (props) => {
  //console.log("day by day:",props?.setItinerary)
  const router = useRouter();
  const [data, setData] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  const fetchData = async() => {
    setLoading(true)

    try {
        const res = await axios.get(
            `${MERCURY_HOST}/api/v1/geos/poi/${props?.id}/`
        );
        if(res.data?.data?.poi){
        setData(res.data?.data?.poi)
        }
        setLoading(false);
    } catch (error) {
        console.log('poi drawer error is:',error)
    }

  };

  const updatedActivityBooking = async() => {

    const requestData={
        itinerary_city_id:props?.itinerary_city_id,
        poi_id:props?.id,
        day_by_day_index:props?.dayIndex
    }
    const res=await axios.post(`${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/poi/add/`,requestData)

    // activityBooking
    //   .post(`${router.query?.id}/bookings/activity/`, requestData)
    //   .then((res) => {
    //     props.setActivities([...props?.activities,res?.data])
    //     props.setActivityBookings([...props?.activityBookings,res?.data])
    //     toast.success("Added activity in itinerary")
    //   })
    //   .catch((err) => {
    //     console.log("error is:",err)
    //     if (err?.response?.status === 403) {
    //       props.openNotification({
    //         text: "You are not allowed to make changes to this itinerary",
    //         heading: "Error!",
    //         type: "error",
    //       });
    //     } else {
    //       props.openNotification({
    //         text: "There seems to be a problem, please try again!",
    //         heading: "Error!",
    //         type: "error",
    //       });
    //     }
    //   });
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
        <PoiDetails
          itineraryDrawer={props.itineraryDrawer}
          data={data}
          date={props.date}
          handleCloseDrawer={props.handleCloseDrawer}
          fetchData={fetchData}
          updatedActivityBooking={updatedActivityBooking}
          itinerary_city_id={props?.itinerary_city_id}
          dayIndex={props?.dayIndex}
        />
      ) : (
        <POIDetailsSkeleton
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
)(NewPoiDetailsDrawer);
