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
import Image from "next/image";

const NewPoiDetailsDrawer = (props) => {
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

  const updatedActivityBooking = async (overrides = {}) => {
    try {
      const requestData = {
        itinerary_city_id: props?.itinerary_city_id,
        poi_id: props?.id,
        day_by_day_index: props?.dayIndex || 0,
        // Forward the picker selections (start_date / day / time) when the
        // child drawer supplies them. Older callers that pass no args still
        // work because spread of an empty object is a no-op.
        ...(overrides.start_date && { start_date: overrides.start_date }),
        ...(overrides.date && { date: overrides.date }),
        ...(overrides.day != null && { day: overrides.day }),
        ...(overrides.time && { time: overrides.time }),
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
      // Ensure the new slab element carries a `time` value so CityDay.jsx
      // buckets it into the slot the user picked. API echoes `time` when
      // it stores one; if not, fall back to the picker's selection.
      const newSlabElement = {
        ...res?.data,
        time: res?.data?.time || overrides.time || requestData?.time || null,
      };
      const itineraryCities = newItinerary?.cities?.map((item) => {
        const city = item;
        if (item.id == props?.itinerary_city_id) {
          const day_by_day = city?.day_by_day;
          day_by_day[props?.dayIndex].slab_elements = [
            ...day_by_day[props?.dayIndex]?.slab_elements,
            newSlabElement,
          ];
          city.day_by_day = day_by_day;
        }
        return city;
      });
      newItinerary.cities = itineraryCities;
      dispatch(setItinerary(newItinerary));

      // Re-fetch the canonical itinerary after a successful add — mirrors the
      // POI/activity delete flow. The local push above gives instant feedback,
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
      bgColor="#fafaf5"
      style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
      className="!overflow-y-hidden"
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
              trackPoiBookingAdded={props?.trackPoiBookingAdded}
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
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4 bg-[#fafaf5]">
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              onClick={(e) => props.handleCloseDrawer(e)}
            />
          </div>
          <div className="flex flex-col items-center justify-center mt-16 gap-3">
            <div className="ttw-type-small text-[#445069] text-center">
              {error}
            </div>
            <button
              className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
              onClick={() => fetchData()}
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

export default connect(mapStateToPros, mapDispatchToProps)(NewPoiDetailsDrawer);
