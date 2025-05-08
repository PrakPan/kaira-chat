import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import Drawer from "../../ui/Drawer";
import { getDate } from "../../../helper/DateUtils";
import { openNotification } from "../../../store/actions/notification";
import { toast, ToastContainer } from "react-toastify";
import PoiDetails from "./NewPoiDetails";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import setItinerary from "../../../store/actions/itinerary";
import PoiDetailsSkeleton from "./PoiDetailsSkelton";

const NewPoiDetailsDrawer = (props) => {
  //console.log("day by day:",props?.setItinerary)
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const itinerary = useSelector((state) => state.Itinerary);
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/geos/poi/${props?.id}/?itinerary_city_id=${props?.itinerary_city_id}`
      );
      if (res.data?.data?.poi) {
        setData(res.data?.data?.poi);
      }
      setLoading(false);
    } catch (error) {
      dispatch(
        openNotification({
          type: "error",
          text: "Something went wrong! Please try after some time.",
          heading: "Error!",
        })
      );
      console.log("poi drawer error is:", error);
    }
  };

  const updatedActivityBooking = async () => {
    try {
      const requestData = {
        itinerary_city_id: props?.itinerary_city_id,
        poi_id: props?.id,
        day_by_day_index: props?.dayIndex || 0,
      };
      const res = await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/poi/add/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      var newItinerary = itinerary;
      const itineraryCities = newItinerary?.cities?.map((item) => {
        console.log("city is:", item);
        const city = item;
        if (item.id == props?.itinerary_city_id) {
          const day_by_day = city?.day_by_day;
          console.log("city1 is:", props?.dayIndex);
          day_by_day[props?.dayIndex].slab_elements = [
            ...day_by_day[props?.dayIndex]?.slab_elements,
            res?.data,
          ];
          city.day_by_day = day_by_day;
          console.log("city2 is:", day_by_day);
        }
        return city;
      });
      newItinerary.cities = itineraryCities;
      dispatch(setItinerary(newItinerary));
      props.openNotification({
        type: "success",
        text: `Added ${res?.data?.heading} Successfuly`,
        heading: "Success!",
      });
    } catch (error) {
      console.log("error is:", error);
      props.openNotification({
        type: "error",
        text: "Something went wrong! Please try after some time.",
        heading: "Error!",
      });
      return 0
    }
    return 1;
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
      <ToastContainer />
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
          setShowLoginModal={props.setShowLoginModal}
          setShowDrawer={props?.setShowDrawer}
        />
      ) : (
        <PoiDetailsSkeleton
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

export default connect(mapStateToPros, mapDispatchToProps)(NewPoiDetailsDrawer);
