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
import { TbArrowBack } from "react-icons/tb";
import useMediaQuery from "../../media";
import styled from "styled-components";
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

const NewPoiDetailsDrawer = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const itinerary = useSelector((state) => state.Itinerary);
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

  const [error, setError] = useState(null);

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
      setError(error.response?.data?.errors[0]?.message[0]);
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
          const day_by_day = city?.day_by_day;
          day_by_day[props?.dayIndex].slab_elements = [
            ...day_by_day[props?.dayIndex]?.slab_elements,
            res?.data,
          ];
          city.day_by_day = day_by_day;
        }
        return city;
      });
      newItinerary.cities = itineraryCities;
      dispatch(setItinerary(newItinerary));
      props.openNotification({
        type: "success",
        text: `Added ${res?.data?.heading} Successfully`,
        heading: "Success!",
      });
    } catch (error) {
      console.log("error is:", error);
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error.message ||
        "Something went wrong! Please try after some time.";
      props.openNotification({
        type: "error",
        text: errorMsg,
        heading: "Error!",
      });
      return 0;
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
      className="font-lexend overflow-y-hidden"
      onHide={props.handleCloseDrawer}
    >
      <ToastContainer />
      {error == null ? (
        <>
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
      {!isDesktop && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={(e) => props.handleCloseDrawer(e)}
          />
        </FloatingView>
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
