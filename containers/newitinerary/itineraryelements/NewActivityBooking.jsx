import React, { useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import styled from "styled-components";
import { getIndianPrice } from "../../../services/getIndianPrice";
import ActivityDetailsDrawer from "../../../components/drawers/activityDetails/ActivityDetailsDrawer";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import Button from "../../../components/ui/button/Index";
import RecommendedBadge from "./Recommended";

export default function NewActivityBooking(props) {
  const [stars, setStars] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState({
    show: false,
    data: {},
  });

  useEffect(() => {
    if (props?.data && props.data?.rating) {
      const stars = [];
      for (let i = 0; i < Math.floor(props.data.rating); i++) {
        stars.push(<FaStar />);
      }
      if (Math.floor(props.data.rating) < props.data.rating) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    }
  }, [props?.data]);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDetails({ show: false, data: {} });
  };

   const handleClick = async (id) => {
  //   const res = await axios.get(
  //     `${MERCURY_HOST}/api/v1/ancillaries/activity/${id}`
  //   );
    setShowDetails({
      show: true,
      data:"" //res?.data?.data?.activity,
    });
  };

  return (
    <div className="relative border rounded-[16px] w-[98%] p-2 mb-3 hover:border-[#F7E700] hover:border-[3px] hover:bg-[#FDFCF1]">
      <div className={`flex gap-1  flex-col justify-start max-[583px]:hidden`}>
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "auto 2fr",
          }}
          id="Activity"
        >
          <div>
            {" "}
            <div
              style={{
                height: "220px",
                width: "251px",
                overflow: "hidden",
                borderRadius: "16px",
                display: imageLoaded ? "block" : "none",
              }}
              className="relative"
            >
              <ImageLoader
                fit="cover"
                url={
                  props?.data?.image
                    ? props.data?.image
                    : "media/website/grey.png"
                }
                width="100%"
                height="220px"
                display="absolute"
                noLazy={true}
                onload={() => {
                  setImageLoaded(true);
                }}
                onfail={() => {
                  setImageLoaded(true);
                }}
              ></ImageLoader>
            </div>
            <div
              style={{
                height: "220px",
                width: "251px",
                overflow: "hidden",
                borderRadius: "16px",
                display: !imageLoaded ? "block" : "none",
              }}
            >
              <SkeletonCard height={"100%"} />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 text-[#01202B]  w-full h-fit justify-start">
              <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                  <div className="text-[20px] font-semibold">
                    {props.data?.name ? props.data.name : null}
                  </div>
                </div>
                {stars && (
                  <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                    <span className="flex flex-row text-[#FFD201] text-[12px]">
                      {stars}
                    </span>
                    <span className="text-[12px]">{props.data?.rating} . </span>
                    <span className="underline text-[12px]">
                      {props.data?.user_ratings_total} user reviews
                    </span>
                  </span>
                )}
              </div>

              <div className="my-2">
                <div className=" text-sm text-[#01202B] line-clamp-3 text-[14px]">
                  {props.data.short_description
                    .split(" ")
                    .slice(0, 40)
                    .join(" ")}
                  <span className="font-bold text-gray-500"> ...more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              {props.data?.pricing?.total_price ? (
                <div className="flex flex-col md:flex-row gap-1">
                  <div className="text-[24px] font-bold">
                    <span
                      className="!font-[lexend]"
                      style={{ fontFamily: "Lexend" }}
                    >
                      ₹
                    </span>
                    {getIndianPrice(Math.round(props.data.pricing.total_price))}
                  </div>
                  <div className="text-[14px] self-end">
                    for {props.data.pricing.total_pax} people*
                  </div>
                </div>
              ) : null}

              {props?.data?.added_in_itinerary?.selected ? (
                <div className="whitespace-nowrap font-semibold">
                  <TransparentButton>
                    <MdDoneAll
                      style={{
                        display: "inline",
                        marginRight: "0.35rem",
                      }}
                    />
                    Added
                    {props?.data?.added_in_itinerary?.added_on
                      ? ` on ${convertDateFormat(
                          props?.data?.added_in_itinerary?.added_on
                        )}`
                      : null}
                  </TransparentButton>
                </div>
              ) : (
                <Button
                  bgColor={"#F7E700"}
                  borderRadius="8px"
                  fontWeight="400"
                  hoverColor="white"
                  height={"full"}
                  className="p-[12px]"
                  onclick={() => handleClick(props.data?.id)}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-[583px]:hidden" id="Activity">
        <div>
          <div
            style={{
              height: "220px",
              overflow: "hidden",
              borderRadius: "16px",
              display: imageLoaded ? "block" : "none",
            }}
            className="relative"
          >
            <ImageLoader
              fit="cover"
              url={
                props?.data?.image
                  ? props.data?.image
                  : "media/website/grey.png"
              }
              width="100%"
              height="220px"
              display="absolute"
              noLazy={true}
              onload={() => {
                setImageLoaded(true);
              }}
              onfail={() => {
                setImageLoaded(true);
              }}
            ></ImageLoader>
          </div>
          <div
            style={{
              height: "220px",
              overflow: "hidden",
              borderRadius: "16px",
              display: !imageLoaded ? "block" : "none",
            }}
          >
            <SkeletonCard height={"100%"} />
          </div>
        </div>

        <div className="text-[20px] font-semibold">
          {props.data?.name ? props.data.name : null}
        </div>

        {stars && (
          <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
            <span className="flex flex-row text-[#FFD201] text-[12px]">
              {stars}
            </span>
          </span>
        )}

        <div className="my-2">
          <div className=" text-sm text-[#01202B] line-clamp-3 text-[14px]">
            {props.data.short_description.split(" ").slice(0, 40).join(" ")}
            <span className="font-bold text-gray-500"> ...more</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          {props.data?.pricing?.total_price ? (
            <div className="flex gap-1">
              <div className="text-[24px] font-bold">
                <span>₹</span>
                {getIndianPrice(Math.round(props.data.pricing.total_price))}
              </div>
              <div className="text-[14px] mt-[10px]">
                for {props.data.pricing.total_pax} people*
              </div>
            </div>
          ) : null}
        </div>

        {props?.data?.added_in_itinerary?.selected ? (
          <div className="whitespace-nowrap font-semibold">
            <TransparentButton>
              <MdDoneAll
                style={{
                  display: "inline",
                  marginRight: "0.35rem",
                }}
              />
              Added
              {props?.data?.added_in_itinerary?.added_on
                ? ` on ${convertDateFormat(
                    props?.data?.added_in_itinerary?.added_on
                  )}`
                : null}
            </TransparentButton>
          </div>
        ) : (
          <div className="w-full flex justify-end">
          <Button
            bgColor={"#F7E700"}
            borderRadius="8px"
            fontWeight="400"
            hoverColor="white"
            height={"full"}
            className="p-[12px] !w-full"
            width={"100%"}
            onclick={() => handleClick(props.data?.id)}
          >
            View Detail
          </Button>
          </div>
          // <div
          //   className="h-full text-blue underline cursor-pointer"
          //   onClick={() => handleClick(props.data?.id)}
          // >
          //   View Details
          // </div>
        )}
      </div>

      <ActivityDetailsDrawer
        itineraryDrawer
        date={props.date}
        show={showDetails.show}
        setShowDetails={setShowDetails}
        activityId={props.data?.id}
        handleCloseDrawer={handleCloseDrawer}
        Topheading={"Select Our Activity"}
        getAccommodationAndActivitiesHandler={
          props.getAccommodationAndActivitiesHandler
        }
        cityId={props?.cityId}
        itinerary_city_id={props?.itinerary_city_id}
        setActivities={props?.setActivities}
        activities={props?.activities}
        setItinerary={props?.setItinerary}
        activityBookings={props.activityBookings}
        setActivityBookings={props.setActivityBookings}
        setShowLoginModal={props?.setLoginModal}
        pax={props?.pax}
        setShowDrawer={props?.setShowDrawer}
      />
      {props.data?.is_very_popular && (
        <div className="absolute top-6 -left-2 z-[1]">
          <RecommendedBadge />
        </div>
      )}
    </div>
  );
}
