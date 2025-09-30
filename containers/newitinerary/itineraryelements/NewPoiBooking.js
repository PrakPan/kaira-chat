import React, { use, useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import styled from "styled-components";
import { getIndianPrice } from "../../../services/getIndianPrice";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import Button from "../../../components/ui/button/Index";
import NewPoiDetailsDrawer from "../../../components/drawers/poiDetails/NewPoiDetailsDrawer";
import RecommendedBadge from "./Recommended";
import Image from "next/image";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { useRouter } from "next/router";
const ClippathComp = styled.div`
  clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0% 100%);
`;

const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

export default function NewPoiBooking(props) {
  const [stars, setStars] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState({
    show: false,
    data: {},
  });
  const [activityData,setActivityData]=useState({
    type:"",
    id:""
  })

  const {trackPoiBookingAdded,trackPoiCardClicked} = useAnalytics();
  const router = useRouter();

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
    trackPoiCardClicked(router.query.id, id, "itinerary_poi_list");
    setActivityData({
      type:"poi",
      id:id,
    })
    setShowDetails({
      show: true,
      data: {},
    });
  };

  return (
    <div className="relative border rounded-[16px] w-[98%] p-2 mb-3 hover:border-[#F7E700] hover:border-[3px] hover:bg-[#FDFCF1]">
      <div
        className={`relative flex gap-1  flex-col justify-start max-[583px]:hidden`}
      >
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "auto 2fr",
          }}
          id="Activity"
        >
          {" "}
          <div
            style={{
              height: "220px",
              width: "251px",
              // overflow: "hidden",
              borderRadius: "16px",
              display: imageLoaded ? "block" : "none",
            }}
          >
            <div
              style={{
                height: "220px",
                width: "251px",
                overflow: "hidden",
                borderRadius: "16px",
                display: imageLoaded ? "block" : "none",
              }}
            >
              {props?.data?.source == "Gmaps" ? (
                <Image
                  src={
                    props?.data?.image?.photo_reference
                      ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.image?.photo_reference}`
                      : "https://images.thetarzanway.com/media/icons/bookings/notfounds/noroom.png"
                  }
                  alt="Image 1"
                  priority
                  height="220"
                  width="251"
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                  onError={() => {
                    setImageLoaded(true);
                  }}
                  className="object-cover rounded-lg [height:220px]"
                />
              ) : (
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
              )}
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
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 text-[#01202B]  w-full h-fit justify-start">
              <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                  <div className="text-[20px] font-semibold">
                    {props.data?.display_name || props.data?.name ? props.data?.display_name || props.data.name : null}
                  </div>
                </div>
                {stars && (
                  <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                    <span className="flex flex-row text-[#FFD201] text-[12px]">
                      {stars}
                    </span>
                    <span className="text-[12px]">{props.data?.rating}  </span>
                    <span className="underline text-[12px]">
                      {props.data?.user_ratings_total} user reviews
                    </span>
                  </span>
                )}
              </div>
              <div className="text-[20px] font-semibold flex items-center gap-2">
                {props?.data?.source === "Gmaps" && (
                  <span className="flex items-center gap-[1px] text-[10px] bg-[#ECECEC] text-[#333] px-2 py-[2px] rounded-full font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="10"
                      height="10"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#48b564"
                        d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"
                      ></path>
                      <path
                        fill="#fcc60e"
                        d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"
                      ></path>
                      <path
                        fill="#2c85eb"
                        d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"
                      ></path>
                      <path
                        fill="#ed5748"
                        d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"
                      ></path>
                      <path
                        fill="#5695f6"
                        d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"
                      ></path>
                    </svg>
                    Result from Google Maps
                  </span>
                )}
              </div>

              {props.data?.tags && (
                <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap">
                  {props.data.tags?.slice(0, 2)?.map((e, i) => (
                    <span
                      key={i}
                      className={`border-2 rounded-full px-2 py-1`}
                      style={{ backgroundColor: colors[i % colors.length] }}
                    >
                      {e}
                    </span>
                  ))}
                  {props?.data?.tags?.length > 2 && (
                    <span className={`border-2 rounded-full px-2 py-1`}>
                      +{props?.data?.tags?.length - 2} more
                    </span>
                  )}
                </div>
              )}
              <div>
                <div className=" text-sm text-[#6E757A] line-clamp-3 text-[14px] py-2">
                  {props.data?.one_liner_description}
                  {/* {props.data.short_description
                    .split(" ")
                    .slice(0, 40)
                    .join(" ")}
                  {props?.data?.source !== "Gmaps" && (
                    <span className="font-bold text-gray-500"> ...more</span>
                  )} */}
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
                <div className=" w-full flex justify-end">
                  <Button
                    bgColor={"#F7E700"}
                  borderRadius="8px"
                  fontWeight="400"
                  hoverColor="white"
                  height={"full"}
                  className="p-[12px]"
                  borderWidth={"1px"}
                    onclick={() => handleClick(props.data?.id)}
                  >
                    View Details
                  </Button>
                </div>
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
          >{props?.data?.source == "Gmaps" ? (
                <Image
                  src={
                    props?.data?.image?.photo_reference
                      ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.image?.photo_reference}`
                      : "https://images.thetarzanway.com/media/icons/bookings/notfounds/noroom.png"
                  }
                  alt="Image 1"
                  priority
                  height="220"
                  width="251"
                  style={{width:"100%"}}
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                  onError={() => {
                    setImageLoaded(true);
                  }}
                  className="object-cover rounded-lg [height:220px]"
                />
              ) : (
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
              )}
            {/* <ImageLoader
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
            ></ImageLoader> */}
            {/* {props.data?.is_very_popular && (
              <div className="absolute top-4 left-0 z-[1090]">
                <ClippathComp className="text-[12px] font-medium bg-red-400 text-white  px-[16px] py-[8px] -mr-2 md:-mr-3 z-[1090]">
                  Recommended
                </ClippathComp>
              </div>
            )} */}
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
          {props.data?.display_name || props.data?.name ?  props.data?.display_name || props.data.name : null}
        </div>

        {stars && (
          <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a] py-1">
            <span className="flex flex-row text-[#FFD201] text-[12px]">
              {stars}
            </span>
          </span>
        )}

        {props.data?.tags && (
                <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap py-2">
                  {props.data.tags?.slice(0, 2)?.map((e, i) => (
                    <span
                      key={i}
                      className={`border-2 rounded-full px-2 py-1`}
                      style={{ backgroundColor: colors[i % colors.length] }}
                    >
                      {e}
                    </span>
                  ))}
                  {props?.data?.tags?.length > 2 && (
                    <span className={`border-2 rounded-full px-2 py-1`}>
                      +{props?.data?.tags?.length - 2} more
                    </span>
                  )}
                </div>
              )}

        <div className="my-1">
          {/* <div className=" text-sm text-[#01202B] line-clamp-3 text-[14px]">
            {props.data.short_description.split(" ").slice(0, 40).join(" ")}
            <span className="font-bold text-gray-500"> ...more</span>
          </div> */}
          <div className=" text-sm text-[#6E757A] line-clamp-3 text-[14px] py-2">
            {props.data?.one_liner_description}
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
        <NewPoiDetailsDrawer
          itineraryDrawer
          date={props.date}
          show={showDetails.show}
          trackPoiBookingAdded={trackPoiBookingAdded}
          handleCloseDrawer={handleCloseDrawer}
          Topheading={"Select Poi"}
          cityId={props?.cityId}
          itinerary_city_id={props?.itinerary_city_id}
          id={props.data?.id}
          dayIndex={props?.dayIndex | 0}
          setShowLoginModal={props.setShowLoginModal}
          setShowDrawer={props?.setShowDrawer}
          activityData={activityData}
        />

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
              className="p-[12px] !w-full"
              width={"100%"}
              borderWidth={"1px"}
            onclick={() => handleClick(props.data?.id)}
          >
            View Details
          </Button>
        )}
      </div>
      {props.data?.is_very_popular && (
        // <div className="absolute top-6 -left-2 z-[1]">
        //   <RecommendedBadge />
        // </div>
        <div className="absolute top-6 left-5 z-[1]">
          {/* <RecommendedBadge /> */}
          <div className="flex items-center gap-1 bg-[#5CBA66] text-white text-13px px-3 py-2 rounded-xl text-[12px]">

            <span>Recommended</span>
          </div>
        </div>
      )}
    </div>
  );
}
