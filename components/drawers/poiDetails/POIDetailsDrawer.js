import React, { useState } from "react";
import Drawer from "../../ui/Drawer";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import { activityDetail } from "../../../services/poi/poiActivities";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import { getDate } from "../../../helper/DateUtils";
import { useRouter } from "next/router";
import PoiDetailsNew from "./PoiDetailsNew";
import ActivityDetails from "./ActivityDetails";
import ActivityDetailsSkeleton from "../activityDetails/ActivityDetailsSkeleton";
import useMediaQuery from "../../media";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import { useSelector } from "react-redux";

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

const POIDetailsDrawer = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [data, setData] = useState(props?.data || []);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  // Inline overlay flag — keeps POIDetails mounted during day/time
  // refetches so the user's day + time-of-day picks aren't reset to
  // defaults by an unmount/remount cycle through the skeleton view.
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const currency = useSelector(state=>state.currency);

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

  const fetchData = async (opts) => {
    // Day/time refetches go through the inline overlay; first-open and
    // other refetches keep the skeleton path. Without the inline mode the
    // skeleton swap would unmount POIDetails and reset startDate /
    // selectedTimeOfDay to their defaults mid-interaction.
    const isInlineUpdate = !!(opts?._dateOverride || opts?._timeOverride);
    const dateParam = opts?._dateOverride ? getDate(opts._dateOverride) : null;
    const timeParam = opts?._timeOverride || null;
    const scheduleQuery =
      (dateParam ? `&start_date=${dateParam}` : "") +
      (timeParam ? `&time_of_day=${encodeURIComponent(timeParam)}` : "");

    if (isInlineUpdate) {
      setUpdating(true);
    } else {
      setLoading(true);
    }

    try {
      if (props?.activityData?.type == "activity") {
        if (props?.showBookingDetail) {
          const res = await axios.get(
            `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${props?.activityData?.id}/?currency=${currency?.currency || 'INR'}`
          );
          setData(res?.data?.activity);
          setData((prev) => ({
            ...prev,
            id: res?.data?.id,
            hotel_pickup_included: res?.data?.hotel_pickup_included,
            cancellation_policies: res?.data?.cancellation_policies,
          }));
          setActivityData(res?.data?.activity_data);
          setLoading(false);
          setUpdating(false);
        } else {
          const res = await axios.get(
            `${MERCURY_HOST}/api/v1/geos/poi/${props?.activityData?.id}/?itinerary_city_id=${props?.itinerary_city_id}${scheduleQuery}`
          );
          setData(res?.data?.data?.poi);
          setLoading(false);
          setUpdating(false);
        }
      } else if (props?.activityData?.type == "poi") {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/geos/poi/${props?.activityData?.id}/?itinerary_city_id=${props?.itinerary_city_id}${scheduleQuery}`
        );
        setData(res?.data?.data?.poi);
        setLoading(false);
        setUpdating(false);
      } else if (props?.activityData?.type == "restaurant") {
        console.log("fetching restaurant details", props?.activityData);
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/geos/restaurant/${props?.activityData?.id}/?itinerary_city_id=${props?.itinerary_city_id}${scheduleQuery}`
        );
        setData(res?.data?.data?.restaurant);
        setLoading(false);
        setUpdating(false);
      } else if (props.ActivityiconId && props.themePage) {
        activityDetail
          .post(
            `${props.ActivityiconId}/`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          )
          .then((res) => {
            if (res.data.success) setData(res.data.data.activity);
            else throw new Error(res.data?.message);
            setLoading(false);
          })
          .catch((err) => {
            if (props.data) {
              setData(props.data);
            } else {
              setData({
                name: props.name,
                short_description: props.text,
                image: props.image,
              });
            }
            setLoading(false);
          });
      } else if (props.ActivityiconId) {
        activityDetail
          .post(
            `/${props.ActivityiconId}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            },
            {
              start_date: "2025-06-20",
              number_of_adults: 1,
            }
          )
          .then((res) => {
            if (res.data?.data?.activity?.name)
              setData(res.data?.data?.activity);
            else throw new Error(res.data?.message);
            setLoading(false);
          })
          .catch((err) => {
            setData({
              name: props.name,
              short_description: props.text,
              image: props.image,
            });
            setLoading(false);
          });
      } else {
        if (props.iconId) {
          axiosPOIdetailsInstance
            .get(`/${props.iconId}/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            })
            .then((res) => {
              if (res.data.name) setData(res.data);
              else throw new Error(res.data?.message);
              setLoading(false);
            })
            .catch((err) => {
              setData({
                name: props.name,
                short_description: props.text,
                image: props.image,
              });
              setLoading(false);
            });
        } else {
          setData({
            name: props.name,
            short_description: props.text,
            image: props.image,
          });
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message?.[0] || err.message);
      setLoading(false);
      setUpdating(false);
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
      className=" pb-[20px]"
      onHide={props.handleCloseDrawer}
    >
      {!loading ? (
        error == null ? (
          <>
            {props?.activityData?.type != "poi" && props?.activityData?.type != "restaurant" ? (
              <>
                <ActivityDetails
                  version={props?.version}
                  itineraryDrawer={props.itineraryDrawer}
                  data={data}
                  handleCloseDrawer={props.handleCloseDrawer}
                  dayIndex={props?.dayIndex}
                  slabIndex={props?.slabIndex}
                  itinerary_city_id={props?.itinerary_city_id}
                  setShowLoginModal={props?.setShowLoginModal}
                  getPaymentHandler={props?.getPaymentHandler}
                  removeDelete={props?.removeDelete}
                  activityData={activityData}
                  showCallback={props?.showCallback}
                  setIsModalOpen={props?.setIsModalOpen}
                  type={props?.activityData?.type}

                >
                  {props?.children}
                </ActivityDetails>
              </>
            ) : (
              <>
                <POIDetails
                  version={props?.version}
                  itineraryDrawer={props.itineraryDrawer}
                  data={data}
                  type={props?.activityData?.type}
                  handleCloseDrawer={props.handleCloseDrawer}
                  dayIndex={props?.dayIndex}
                  slabIndex={props?.slabIndex}
                  itinerary_city_id={props?.itinerary_city_id}
                  cityID={props?.cityID}
                  setShowLoginModal={props?.setShowLoginModal}
                  getPaymentHandler={props?.getPaymentHandler}
                  removeDelete={props?.removeDelete}
                  date={props?.date}
                  name={props.name}
                  cityName={props?.cityName}
                  removeChange={props?.removeChange}
                  showAddToItinerary={props?.showAddToItinerary}
                  onAddToItinerary={props?.onAddToItinerary}
                  kind={props?.activityData?.type}
                  fetchData={fetchData}
                  updating={updating}
                >
                  {props.children}
                </POIDetails>
              </>
            )}

            <div className="sticky z-50 bottom-4 w-full flex items-center justify-center">
              {props.children}
            </div>
          </>
        ) : (
          <div className="h-[100vh]">
            <OptionsContainer className="px-6 max-ph:px-4 center-div flex flex-col items-center justify-center gap-4 text-center">
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
            </OptionsContainer>
          </div>
        )
      ) : (
        <>
          {props?.activityData?.type == "activity" ? (
            <ActivityDetailsSkeleton />
          ) : (
            <PoiDetailsNew />
          )}
        </>
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;