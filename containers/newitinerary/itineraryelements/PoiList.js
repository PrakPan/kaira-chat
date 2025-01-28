import React, { useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import styled from "styled-components";
import { getIndianPrice } from "../../../services/getIndianPrice";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { connect } from "react-redux";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const PoiList = (props) => {
  const [isSelect, setisSelect] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stars, setStars] = useState(null);
  const [showDetails, setShowDetails] = useState({
    show: false,
    data: {},
  });

  useEffect(() => {
    if (props?.data && props.data?.activity_data.activity?.rating) {
      const stars = [];
      for (
        let i = 0;
        i < Math.floor(props.data?.activity_data.activity.rating);
        i++
      ) {
        stars.push(<FaStar />);
      }
      if (
        Math.floor(props.data?.activity_data.activity.rating) <
        props.data?.activity_data.activity.rating
      ) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    } else if (props?.data && props.data?.activity_data.poi?.rating) {
      const stars = [];
      for (
        let i = 0;
        i < Math.floor(props.data?.activity_data.poi.rating);
        i++
      ) {
        stars.push(<FaStar />);
      }
      if (
        Math.floor(props.data?.activity_data.poi.rating) <
        props.data?.activity_data.poi.rating
      ) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    }
  }, [props?.data]);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDetails({ show: false, data: {} });
  };

  function handleCheckboxChange(e, activityId) {
    if (props.token) {
      if (props.activityAddDrawer) {
        props._updatePoiHandler(activityId);
      } else {
        props._updatePoiHandler(props.data);
      }
      setisSelect(!isSelect);

      props.setShowDrawer(false);
      e.stopPropagation();
    } else {
      props.setLoginModal(!props.loginModal);
    }
  }

  return (
    <>
      <div
        className={`flex gap-1  lg:w-[50vw] w-[100vw] py-2 px-3 flex-col justify-start `}
      >
        {props.data.activity_data.activity.name ? (
          props.data?.activity_data?.activity?.cost ? (
            <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ">
              <div
                onClick={() => setShowDetails({ show: true, data: props.data })}
                id="Activity"
                className={`relative flex lg:flex-row w-full flex-col gap-4 `}
              >
                <div
                  className={`'lg:h-[15rem]'
              lg:w-[30%] w-full  h-[12rem]`}
                >
                  <div style={{ display: imageLoaded ? "initial" : "none" }}>
                    <ImageLoader
                      dimensions={{ width: 400, height: 400 }}
                      dimensionsMobile={{ width: 400, height: 400 }}
                      borderRadius="16px"
                      hoverpointer
                      onclick={() => console.log("")}
                      width="100%"
                      height="100%"
                      leftalign
                      widthmobile="100%"
                      noLazy
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
                        props.data.activity_data.activity.image && !imageFail
                          ? props.data.activity_data.activity.image
                          : "media/icons/bookings/notfounds/noroom.png"
                      }
                    ></ImageLoader>
                  </div>
                  <div
                    style={{
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: "16px",
                      display: !imageLoaded ? "block" : "none",
                    }}
                  >
                    <SkeletonCard />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-[#01202B] lg:w-[67%] w-full justify-start">
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-row justify-between">
                      <div className="text-2xl font-bold">
                        {props.data.activity_data.activity.name}
                      </div>
                      {props.data.activity_data?.activity?.is_very_popular && (
                        <div>
                          <ClippathComp className="text-sm font-bold bg-[#F7E700] text-#090909 pl-4 pr-2 py-1 -mr-2">
                            Recommended
                          </ClippathComp>
                        </div>
                      )}
                    </div>
                    {stars && (
                      <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                        <span className="flex flex-row text-[#FFD201]">
                          {stars}
                        </span>
                        <span className="">
                          {props.data.activity_data.activity?.rating} .{" "}
                        </span>
                        <span className="underline">
                          {
                            props.data.activity_data.activity
                              ?.user_ratings_total
                          }{" "}
                          user reviews
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="my-2">
                    <div className="font-light text-sm text-[#01202B] line-clamp-3">
                      {props.data.text}
                    </div>
                    <div className="font-bold text-gray-500"> ...more</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-1">
                      <div className="text-2xl font-bold">
                        <span>₹</span>
                        {getIndianPrice(props.data.activity_data.activity.cost)}
                      </div>
                      <div className="font-normal text-base self-end">
                        per person*
                      </div>
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
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(
                            e,
                            props?.data?.activity_data?.id
                          );
                        }}
                        className="flex mt-2 mr-2 mb-2 flex-row gap-1 items-end justify-end cursor-pointer"
                      >
                        <CheckboxFormComponent
                          checked={isSelect}
                          className="mb-1"
                        />
                        <label className="text-center">
                          {isSelect ? "Selected" : "Select"}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null
        ) : (
          <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ">
            <div
              onClick={() => {
                setShowDetails({ show: true, data: props.data });
              }}
              id="POI"
              className={`relative flex lg:flex-row w-full flex-col gap-4`}
            >
              <div className="flex flex-col lg:w-[50%] w-full">
                {" "}
                <div
                  className={`relative 'lg:h-[15rem]'
                h-[12rem]`}
                >
                  <div style={{ display: imageLoaded ? "initial" : "none" }}>
                    <ImageLoader
                      dimensions={{ width: 400, height: 400 }}
                      dimensionsMobile={{ width: 400, height: 400 }}
                      borderRadius="16px"
                      hoverpointer
                      onclick={() => console.log("")}
                      width="100%"
                      height="100%"
                      leftalign
                      noLazy
                      widthmobile="100%"
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
                        props.data.activity_data.poi.image && !imageFail
                          ? props.data.activity_data.poi.image
                          : "media/icons/bookings/notfounds/noroom.png"
                      }
                    ></ImageLoader>
                  </div>
                  <div
                    style={{
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: "16px",
                      display: !imageLoaded ? "block" : "none",
                    }}
                  >
                    <SkeletonCard />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[90%] w-full justify-between">
                <div>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-row justify-between">
                      <div className="text-2xl font-bold">
                        {props.data.activity_data.poi.name}
                      </div>
                      {props.data.activity_data?.poi?.is_very_popular && (
                        <div>
                          <ClippathComp className="text-sm font-bold bg-[#F7E700] text-#090909 pl-4   pr-2 py-1 -mr-2">
                            Recommended
                          </ClippathComp>
                        </div>
                      )}
                    </div>
                    {stars && (
                      <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                        <span className="flex flex-row text-[#FFD201]">
                          {stars}
                        </span>
                        <span className="">
                          {props.data.activity_data.poi?.rating} .{" "}
                        </span>
                        <span className="underline">
                          {props.data.activity_data.poi?.user_ratings_total}{" "}
                          Google reviews
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="my-2">
                    <div className="text-sm font-light text-[#01202B] line-clamp-3">
                      {props.data.text}
                    </div>
                    <div className="font-bold text-gray-500"> ...more</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="w-full flex flex-row justify-end">
                    {props?.data?.added_in_itinerary?.selected ? null : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(e);
                        }}
                        className="flex mr-2 mb-2 flex-row gap-1 items-end justify-end cursor-pointer"
                      >
                        <CheckboxFormComponent
                          checked={isSelect}
                          className="mb-1"
                        />
                        <label className="text-center">
                          {isSelect ? "Selected" : "Select"}
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row justify-end">
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
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <POIDetailsDrawer
        itineraryDrawer
        show={showDetails.show}
        iconId={
          showDetails.data?.activity_data?.poi &&
          showDetails.data?.activity_data?.poi?.id
        }
        ActivityiconId={
          showDetails.data.activity_data?.activity &&
          showDetails.data.activity_data?.activity?.id
        }
        handleCloseDrawer={handleCloseDrawer}
        Topheading={"Select Our Point Of Interest"}
      />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(PoiList);
