import React, { useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import styled from "styled-components";
import { getIndianPrice } from "../../../services/getIndianPrice";
import ActivityDetailsDrawer from "../../../components/drawers/activityDetails/ActivityDetailsDrawer";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import {
  Container,
  TransparentButton,
} from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import Button from "../../../components/ui/button/Index";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

export default function NewActivityBooking(props) {
  const [isSelect, setisSelect] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stars, setStars] = useState(null);
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

  const handleClick=async(e,id)=>{
    // e.preventDefault();
    const res=await axios.get(`${MERCURY_HOST}/api/v1/ancillaries/activity/${id}`)
  };

  return (
    <>
      <div
        className={`flex gap-1 lg:w-[50vw] w-[100vw] py-2 px-3 flex-col justify-start`}
      >
        <div
          style={{
            display: "grid",
            gridGap: "0.5rem",
            gridTemplateColumns: "1fr 2fr",
            marginBottom: "0.75rem",
          }}
          id="Activity"
        >
          <div>
            {" "}
            <div style={{ width: "100%", height: "100%" }}>
              <ImageLoader
                height="100%"
                width="100%"
                //   widthmobile="1.5rem"
                dimensions={{ width: 1600, height: 900 }}
                dimensionsMobile={{ width: 1600, height: 900 }}
                borderRadius={"16px"}
                fit="cover"
                onload={() => {
                  setTimeout(() => {
                    setImageLoaded(true);
                  }, 1000);
                }}
                onfail={() => {
                  setImageFail(true);
                  setImageLoaded(true);
                }}
                url={
                  props.data?.image && !imageFail
                    ? props.data.image
                    : "media/icons/bookings/notfounds/noroom.png"
                }
              ></ImageLoader>
              {/* {props.data?.ideal_duration_number &&
                props.data?.ideal_duration_unit ? (
                  <div className=" bottom-2 right-2 bg-[#000000bf] text-white p-2 rounded-lg flex flex-row items-center gap-1">
                    <FaClock />
                    {props.data.ideal_duration_number}{" "}
                    {props.data.ideal_duration_number > 1
                      ? props.data?.ideal_duration_unit.toLowerCase()
                      : props.data?.ideal_duration_unit
                          .toLowerCase()
                          .slice(0, -1)}
                  </div>
                )
                 : null} */}
            </div>
            <div
              style={{
                height: "100%",
                overflow: "hidden",
                borderRadius: "16px",
                display: !imageLoaded ? "block" : "none",
              }}
            >
              <SkeletonCard height={"100%"} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-[#01202B]  w-full h-fit justify-start">
            <div className="flex flex-col justify-between">
              <div className="flex flex-row justify-between">
                <div className="text-2xl font-bold">
                  {props.data?.name ? props.data.name : null}
                </div>
                {props.data?.is_very_popular && (
                  <div>
                    <ClippathComp className="text-sm font-bold bg-[#F7E700] text-#090909 pl-4 pr-2 py-1 -mr-2 md:-mr-3">
                      Recommended
                    </ClippathComp>
                  </div>
                )}
              </div>
              {stars && (
                <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                  <span className="flex flex-row text-[#FFD201]">{stars}</span>
                  <span className="">{props.data?.rating} . </span>
                  <span className="underline">
                    {props.data?.user_ratings_total} user reviews
                  </span>
                </span>
              )}
            </div>

            <div className="my-2">
              <div className="font-light text-sm text-[#01202B] line-clamp-3">
                {props.data.short_description}
              </div>
              <div className="font-bold text-gray-500"> ...more</div>
            </div>
            <div className="flex flex-row items-center justify-between">
              {props.data?.pricing?.total_price ? (
                <div className="flex flex-col md:flex-row gap-1">
                  <div className="text-2xl font-bold">
                    <span>₹</span>
                    {getIndianPrice(props.data.pricing.total_price)}
                  </div>
                  <div className="font-normal text-base self-end">
                    for {props.data.pricing.total_pax} people
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
                <div className="h-full">
                  <Button
                    display="flex"
                    height="100%"
                    center
                    fontWeight="500"
                    fontSize="0.85rem"
                    width="100%"
                    onclick={(e) => console.log('clicked')}
                    borderRadius="10px"
                    bgColor="#f8e000"
                    borderWidth="1px"
                  >
                    Add to Itinerary
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ActivityDetailsDrawer
        itineraryDrawer
        date={props.date}
        show={showDetails.show}
        activityId={props.data?.id}
        handleCloseDrawer={handleCloseDrawer}
        Topheading={"Select Our Activity"}
        getAccommodationAndActivitiesHandler={
          props.getAccommodationAndActivitiesHandler
        }
      />
    </>
  );
}
