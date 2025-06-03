import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import Drawer from "../../ui/Drawer";
import { openNotification } from "../../../store/actions/notification";
import {  ToastContainer } from "react-toastify";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import setItinerary from "../../../store/actions/itinerary";
import PoiDetailsSkeleton from "./PoiDetailsSkelton";
import ChangePoiDetails from "./ChangePoiDetails";

const ChangePoiDetailDrawer = (props) => {
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
    }
  };

  const updatedActivityBooking = async () => {
    try {
      const requestData = {
        itinerary_city_id: props?.itinerary_city_id,
        poi_id: props?.id,
        day_by_day_index: props?.dayIndex || 0,
        poi_index:props?.slabIndex
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
        const city = item;
        if (item.id == props?.itinerary_city_id) {
          const day_by_day = [...city?.day_by_day];
          day_by_day[props?.dayIndex].slab_elements[props.slabIndex] = res?.data;
          city.day_by_day = day_by_day;
        }
        return city;
      });
      newItinerary.cities = itineraryCities;
      console.log("new itinerary is:",newItinerary)
      dispatch(setItinerary(newItinerary));
      props.openNotification({
        type: "success",
        text: `Added ${res?.data?.heading} Successfully`,
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
      style={{ zIndex: 1506 }}
      className="font-lexend"
      onHide={props.handleCloseDrawer}
    >
      <ToastContainer />
      {!loading ? (
        <ChangePoiDetails
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

export default connect(mapStateToPros, mapDispatchToProps)(ChangePoiDetailDrawer);
