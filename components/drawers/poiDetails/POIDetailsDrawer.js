import React, { useState } from "react";
import Drawer from "../../ui/Drawer";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import axiosPOIActivityInstance, {
  activityDetail,
} from "../../../services/poi/poiActivities";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import { useRouter } from "next/router";
import PoiDetailsNew from "./PoiDetailsNew";
import ActivityDetails from "./ActivityDetails";
import ActivityDetailsSkeleton from "../activityDetails/ActivityDetailsSkeleton";

const POIDetailsDrawer = (props) => {
console.log("props activities summary are:",props)
  const [data, setData] = useState(props?.data || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  const fetchData = async () => {
    setLoading(true);
    if (props?.activityData?.type == "activity") {
      if (props?.showBookingDetail) {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${props?.activityData?.id}/`
        );
        setData(res?.data?.activity);
        setData((prev)=>({
          ...prev,
          id:res?.data?.id
        }))
        setLoading(false);
      } else {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/geos/poi/${props?.activityData?.id}/?itinerary_city_id=${props?.itinerary_city_id}`
        );
        setData(res?.data?.data?.poi);
        setLoading(false);
      }
    } else if (props?.activityData?.type == "poi") {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/geos/poi/${props?.activityData?.id}/?itinerary_city_id=${props?.itinerary_city_id}`
      );
      setData(res?.data?.data?.poi);
      setLoading(false);
    } else if (props?.activityData?.type == "restaurant") {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/geos/restaurant/${props?.activityData?.id}/`
      );
      setData(res?.data?.data?.restaurant);
      setLoading(false);
    } else if (props.ActivityiconId && props.themePage) {
      activityDetail
        .post(`${props.ActivityiconId}/`, {},{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
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
      axiosPOIActivityInstance
        .get(`/?id=${props.ActivityiconId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        )
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
      if (props.iconId) {
        axiosPOIdetailsInstance
          .get(`/?id=${props.iconId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          )
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
        <>
          {props?.activityData?.type == "activity" ? (
            <>
            <ActivityDetails
              itineraryDrawer={props.itineraryDrawer}
              data={data}
              handleCloseDrawer={props.handleCloseDrawer}
              dayIndex={props?.dayIndex}
              slabIndex={props?.slabIndex}
              itinerary_city_id={props?.itinerary_city_id}
              setShowLoginModal={props?.setShowLoginModal}
              getPaymentHandler={props?.getPaymentHandler}
            >
              {props?.children}
            </ActivityDetails>
            </>
          ) : (
            <>
            <POIDetails
              itineraryDrawer={props.itineraryDrawer}
              data={data}
              handleCloseDrawer={props.handleCloseDrawer}
              dayIndex={props?.dayIndex}
              slabIndex={props?.slabIndex}
              itinerary_city_id={props?.itinerary_city_id}
              setShowLoginModal={props?.setShowLoginModal}
              getPaymentHandler={props?.getPaymentHandler}
              removeDelete={props?.removeDelete}
            >
              {props.children}
            </POIDetails>
            </>
          )}

          <div className="sticky z-50 bottom-4 w-full flex items-center justify-center">
            {props.children}
          </div>
        </>
      ) :
      <>
        {props?.activityData?.type == "activity" ? (
          <ActivityDetailsSkeleton/>
        ) : (
          <PoiDetailsNew />
        )}
        </>
      
      }
    </Drawer>
  );
};

export default POIDetailsDrawer;
