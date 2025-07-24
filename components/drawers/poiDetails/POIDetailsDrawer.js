import React, { useState } from "react";
import Drawer from "../../ui/Drawer";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import { activityDetail } from "../../../services/poi/poiActivities";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import { useRouter } from "next/router";
import PoiDetailsNew from "./PoiDetailsNew";
import ActivityDetails from "./ActivityDetails";
import ActivityDetailsSkeleton from "../activityDetails/ActivityDetailsSkeleton";
import useMediaQuery from "../../media";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";

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

const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
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
  z-index: 901;
  cursor: pointer;
`;
const POIDetailsDrawer = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [data, setData] = useState(props?.data || []);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const fetchData = async () => {
    setLoading(true);

    try {
      if (props?.activityData?.type == "activity") {
        if (props?.showBookingDetail) {
          const res = await axios.get(
            `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${props?.activityData?.id}/`
          );
          setData(res?.data?.activity);
          setData((prev) => ({
            ...prev,
            id: res?.data?.id,
            cancellation_policies: res?.data?.cancellation_policies,
          }));
          setActivityData(res?.data?.activity_data);
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
      className="font-lexend pb-[20px]"
      onHide={props.handleCloseDrawer}
    >
      {!loading ? (
        error == null ? (
          <>
            {props?.activityData?.type != "poi" ? (
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
            <OptionsContainer className="px-2 center-div space-y-5">
              {error}
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

export default POIDetailsDrawer;
