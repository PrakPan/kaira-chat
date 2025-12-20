import React, { useState } from "react";
import { MdOutlineStar, MdStarHalf } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import ImageLoader from "../../ImageLoader";
import media from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEllipsis } from "react-icons/fa6";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { useDispatch, useSelector } from "react-redux";
import setItinerary from "../../../store/actions/itinerary";
import { openNotification } from "../../../store/actions/notification";
import { MERCURY_HOST } from "../../../services/constants";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export const getStars = (rating) => {
  var stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar key={i} />);
  }
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
  return stars;
  // const stars = [];
  // stars.push(<MdOutlineStar className="text-primary-stars" />);

  // return stars;
};

//
const formatTime = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minutes} ${period}`;
};

const SlabElement = (props) => {
  const {
    trackActivityBookingAdd,
    trackActivityCardClicked,
    trackPoiCardClicked,
  } = useAnalytics();

  return (
    <div className="w-[95%] mx-auto">
      {props.element.element_type === "activity" ? (
        <Activity
          element={props.element}
          dayIndex={props?.dayIndex}
          slabIndex={props?.slabIndex}
          itinerary_city_id={props?.itinerary_city_id}
          setShowLoginModal={props?.setShowLoginModal}
          trackActivityBookingAdd={trackActivityBookingAdd}
          trackActivityCardClicked={trackActivityCardClicked}
          trackPoiCardClicked={trackActivityCardClicked}
          cityID={props?.cityID}
          cityName={props?.cityName}
          totalElements={props.totalElements}
        />
      ) : props.element.element_type === "recommendation" ? (
        <Recommendation
          element={props.element}
          dayIndex={props?.dayIndex}
          slabIndex={props?.slabIndex}
          itinerary_city_id={props?.itinerary_city_id}
          setShowLoginModal={props?.setShowLoginModal}
          cityID={props?.cityID}
          cityName={props?.cityName}
        />
      ) : null}
    </div>
  );
};

export default SlabElement;

const handleMoveElementCommonly = async (
  dispatch,
  itinerary,
  router,
  itinerary_city_id,
  dayIndex,
  slabIndex,
  position,
  heading,
  setShowLoginModal
) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    if (setShowLoginModal) {
      setShowLoginModal(true);
      return;
    }
  }
  try {
    const res = await axios.post(
      `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/element/move/`,
      {
        itinerary_city_id: itinerary_city_id,
        day_by_day_index: dayIndex,
        element_index: slabIndex,
        position: position,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    let itineraryCities = [];
    if (res?.status === 200) {
      itineraryCities = newItinerary.cities.map((city) => {
        const cityTemp = { ...city };
        if (city.id === itinerary_city_id) {
          const day = cityTemp.day_by_day[dayIndex];
          if (!day) return cityTemp;
          const slabElements = [...day.slab_elements];
          const fromIndex = slabIndex;
          const toIndex = position;
          if (
            fromIndex >= 0 &&
            fromIndex < slabElements.length &&
            toIndex >= 0 &&
            toIndex < slabElements.length
          ) {
            const [moved] = slabElements.splice(fromIndex, 1);
            slabElements.splice(toIndex, 0, moved);
          }
          day.slab_elements = slabElements;
        }
        return cityTemp;
      });
    }

    newItinerary.cities = itineraryCities;
    dispatch(setItinerary(newItinerary));
    // handleCloseMenue();
    dispatch(
      openNotification({
        type: "success",
        text: `${heading} has been moved successfully.`,
        heading: "Success!",
      })
    );
  } catch (error) {
    // handleCloseMenue();
    console.log("error is:", error);
    const errorMsg =
      error?.response?.data?.errors?.[0]?.message?.[0] ||
      error.message ||
      "Something went wrong! Please try after some time.";
    dispatch(
      openNotification({
        type: "error",
        text: errorMsg,
        heading: "Error!",
      })
    );
  }
};

const Activity = (props) => {
  let isPageWide = media("(min-width: 769px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const itinerary = useSelector((state) => state.Itinerary);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);

  const handleClick = (event) => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.setProperty("overflow", "visible", "important");
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenue = () => {
    setAnchorEl(null);
    document.documentElement.style.overflow = "auto";
  };

  const { drawer, poi_id, type } = router?.query;
  const activityData = {
    id: poi_id,
    type: type,
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    router.push(
      {
        pathname: `/itinerary/${router?.query?.id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };

  const handleActivity = async (poi, type, dayIndex) => {
    if (type === "activity") {
      props?.trackActivityCardClicked(
        router.query.id,
        poi?.booking?.id || poi?.poi,
        "day_by_day_ellapse"
      );
    }
    if (type === "poi") {
      props?.trackPoiCardClicked(
        router.query.id,
        poi?.booking?.id || poi?.poi,
        "day_by_day_ellapse"
      );
    }
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showPoiDetail",
          poi_id: poi?.booking?.id || poi?.poi,
          type: type,
          dayIndex: props?.dayIndex,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: props.element.heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const handleDelete = async (e) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      if (props?.setShowLoginModal) {
        props?.setShowLoginModal(true);
        return;
      }
    }
    try {
      let res;
      if (props?.element?.poi != null) {
        res = await axios.delete(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/poi/delete/`,
          {
            data: {
              itinerary_city_id: props?.itinerary_city_id,
              day_by_day_index: props?.dayIndex,
              poi_index: props?.slabIndex,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
      } else {
        res = await axios.delete(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${props?.element?.booking?.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
      }
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));

      const newItinerary = JSON.parse(JSON.stringify(itinerary));
      let itineraryCities = [];

      if (
        (props?.element?.poi != null && res?.status === 200) ||
        (props?.element?.booking?.id && res?.status === 204)
      ) {
        if (props?.element?.poi != null) {
          itineraryCities = newItinerary.cities.map((city) => {
            const cityTemp = city;
            if (city.id === props?.itinerary_city_id) {
              cityTemp.day_by_day[props?.dayIndex]?.slab_elements.splice(
                props?.slabIndex,
                1
              );
            }
            return cityTemp;
          });
        } else {
          itineraryCities = newItinerary.cities.map((city) => {
            if (city.id === props?.itinerary_city_id) {
              city.day_by_day.forEach((day, index) => {
                if (day?.slab_elements) {
                  day.slab_elements = day.slab_elements.filter(
                    (item) => item?.booking?.id !== props?.element?.booking?.id
                  );
                }
              });

              city.activities = city.activities?.filter(
                (item) => item?.id !== props?.element?.booking?.id
              );
            }
            return city;
          });
        }
      }

      newItinerary.cities = itineraryCities;
      dispatch(setItinerary(newItinerary));
      handleCloseMenue();
      dispatch(
        openNotification({
          type: "success",
          text: `${props.element.heading} has been removed from your itinerary`,
          heading: "Success!",
        })
      );
    } catch (error) {
      handleCloseMenue();
      console.log("error is:", error);
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error.message ||
        "Something went wrong! Please try after some time.";
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
    }
    // setLoading(false);
  };

  const handleMoveElement = async (position) => {
    await handleMoveElementCommonly(
      dispatch,
      itinerary,
      router,
      props.itinerary_city_id,
      props.dayIndex,
      props.slabIndex,
      position,
      props.element.heading,
      props?.setShowLoginModal
    );
    handleCloseMenue();
  };

  return (
    <>
      <div className="flex gap-1 md:gap-3 flex-row justify-between bg-white border-radius-10 p-xs-md border-1">
        <div className="w-full flex flex-row items-stretch  gap-sm-md  bg-white">
          <div
            onClick={() =>
              handleActivity(
                props?.element,
                props?.element?.poi != "undefined"
                  ? "poi"
                  : props?.element?.element_type
              )
            }
            className="cursor-pointer"
          >
            <ImageLoader
              borderRadius={"10px"}
              style={{
                width: "88px",
                height: "82px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col max-ph:mb-sm gap-xxs-md max-ph:gap-xs">
            <div
              onClick={() =>
                handleActivity(
                  props?.element,
                  props?.element?.poi != null ? "poi" : "activity"
                )
              }
              className={`${isPageWide ? "Body2M_14" : "Body3M_12"}`}
            >
              {props.element.heading}
            </div>

            <div className="flex flex-wrap items-center text-sm ">
              <div className="pr-[8px] flex gap-[8px] items-center justify-center -ml-[2px]">
                {props?.element?.poi ? (
                  <Image
                    src={
                      props?.element?.poi ? "/assets/Itinerary/global.svg" : ""
                    }
                    alt="ticket"
                    width={18}
                    height={18}
                  />
                ) : null}
                <div className="text-[#6E757A] Body3R_12">
                  {props?.element?.poi ? "Self Exploration" : ""}
                </div>
                {!props?.element?.poi ? (
                  <div className="w-max items-center bg-[#F5FFF7] text-[#10A317] text-[12px] rounded-sm">
                    Activity
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* For POIs (Self Exploration) - timings and ratings on new line */}
              {props?.element?.poi ? (
                <div className="w-full flex  mt-2 gap-2 sm:gap-3">
                  {(props.element?.start_time || props.element?.end_time) && (
                    <div className="Body3M_12 text-[#6E757A]">
                      {props.element?.start_time &&
                        formatTime(props.element.start_time)}
                      {props.element?.start_time &&
                        props.element?.end_time &&
                        " - "}
                      {props.element?.end_time &&
                        formatTime(props.element.end_time)}
                    </div>
                  )}
                  {props.element?.rating && (
                    <div className="flex items-center border-l pl-[8px] border-[#BFBFBF] font-normal text-[#6E757A]">
                      <div className="Body3M_12">
                        {props.element?.rating}&nbsp;
                      </div>
                      <div className="flex items-center text-primary-stars">
                        <Image
                          src="/star.svg"
                          width={16}
                          height={16}
                          alt="star"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // For Activities - timings and ratings inline
                <>
                  {(props.element?.start_time || props.element?.end_time) && (
                    <div className="border-l pl-[8px] pr-[8px] border-[#BFBFBF] Body3M_12 text-[#6E757A] justify-center items-center">
                      {props.element?.start_time &&
                        formatTime(props.element.start_time)}
                      {props.element?.start_time &&
                        props.element?.end_time &&
                        " - "}
                      {props.element?.end_time &&
                        formatTime(props.element.end_time)}
                    </div>
                  )}
                  {props.element?.rating ? (
                    <div className="flex items-center border-l pl-[8px] border-[#BFBFBF] font-normal text-[#6E757A]">
                      <div className="Body3M_12">
                        {props.element?.rating}&nbsp;
                      </div>
                      <div className="flex items-center text-primary-stars">
                        <Image
                          src="/star.svg"
                          width={16}
                          height={16}
                          alt="star"
                        />
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {!props?.element?.poi ? (
              <div className="flex flex-row gap-xs flex-wrap ">
                {/* {props?.element?.tags && props.element.tags.map((item, i) => ( */}
                <div
                  className={`rounded-9xl text-[12px] font-400 leading-md px-sm py-xxs text-white ${"bg-[#5CBA66]"}`}
                >
                  ✓ Included
                </div>
                {/* ))} */}
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={`flex gap-3 flex-col  ${
            !isPageWide
              ? "flex-row-reverse justify-end "
              : " items-end justify-between"
          }`}
        >
          <div>
            {" "}
            <IconButton
              size="small"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className="-mt-sm"
              onClick={handleClick}
              color="#000"
              fontSize="small"
            >
              <FaEllipsis color="#000" />{" "}
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              disableScrollLock
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
              }}
              anchorOrigin={isPageWide ? { horizontal: "right" } : undefined}
              transformOrigin={isPageWide ? { horizontal: "right" } : undefined}
            >
              <MenuItem className="list-menu-item" onClick={handleDelete}>
                Remove
              </MenuItem>
              {props.slabIndex != 0 && (
                <MenuItem
                  onClick={() => handleMoveElement(props.slabIndex - 1)}
                  className="list-menu-item"
                >
                  Move Up
                </MenuItem>
              )}
              {props.slabIndex != props.totalElements - 1 && (
                <MenuItem
                  onClick={() => handleMoveElement(props.slabIndex + 1)}
                  className="list-menu-item"
                >
                  Move Down
                </MenuItem>
              )}
            </Menu>
          </div>
          <div className="max-ph:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleActivity(
                  props?.element,
                  props?.element?.poi != null ? "poi" : "activity"
                );
              }}
              className="IndigoOutlinedButton !w-[78px] Body2M_14"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {drawer === "showPoiDetail" &&
        String(poi_id) ===
          String(
            props?.element?.booking?.id ||
              props.element?.poi ||
              props.element?.activity
          ) && (
          <POIDetailsDrawer
            itineraryDrawer
            show={true}
            iconId={
              props.element?.poi ? props.element?.poi : props.element?.activity
            }
            handleCloseDrawer={handleCloseDrawer}
            name={props.element.heading}
            image={props.element.icon}
            text={props.element?.text}
            Topheading={"Select Our Point Of Interest"}
            activityData={activityData}
            itinerary_city_id={props?.itinerary_city_id}
            dayIndex={props?.dayIndex}
            slabIndex={props?.slabIndex}
            showBookingDetail={true}
            setShowLoginModal={props?.setShowLoginModal}
            date={props?.date}
            cityID={props?.cityID}
            cityName={props?.cityName}
            removeDelete={false}
          />
        )}
    </>
  );
};

const Recommendation = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const itinerary = useSelector((state) => state.Itinerary);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activityData, setActivityData] = useState({
    id: "",
    type: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.setProperty("overflow", "visible", "important");
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenue = () => {
    setAnchorEl(null);
    document.documentElement.style.overflow = "auto";
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = async (poi, type) => {
    setShowDrawer(true);
    setActivityData(() => ({
      id: poi,
      type: type,
    }));

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: props.element.heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const handleDelete = async (e) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      if (props?.setShowLoginModal) {
        props?.setShowLoginModal(true);
        return;
      }
    }

    try {
      let res;
      res = await axios.delete(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/restaurant/delete/`,
        {
          data: {
            itinerary_city_id: props?.itinerary_city_id,
            day_by_day_index: props?.dayIndex,
            restaurant_index: props?.slabIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));

      console.log(res);

      const newItinerary = JSON.parse(JSON.stringify(itinerary));
      let itineraryCities = [];

      if (res?.status === 200) {
        itineraryCities = newItinerary.cities.map((city) => {
          const cityTemp = city;
          if (city.id === props?.itinerary_city_id) {
            cityTemp.day_by_day[props?.dayIndex]?.slab_elements.splice(
              props?.slabIndex,
              1
            );
          }
          return cityTemp;
        });
      }

      newItinerary.cities = itineraryCities;
      dispatch(setItinerary(newItinerary));
      handleCloseMenue();
      dispatch(
        openNotification({
          type: "success",
          text: `${props.element.heading} has been removed from your itinerary`,
          heading: "Success!",
        })
      );
    } catch (error) {
      handleCloseMenue();
      console.log("error is:", error);
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error.message ||
        "Something went wrong! Please try after some time.";
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
    }
    // setLoading(false);
  };

  const handleMoveElement = async (position) => {
    await handleMoveElementCommonly(
      dispatch,
      itinerary,
      router,
      props.itinerary_city_id,
      props.dayIndex,
      props.slabIndex,
      position,
      props.element.heading,
      props?.setShowLoginModal
    );
    handleCloseMenue();
  };

  if (props.element.type === "Meal Recommendation") {
    return <MealRecommendation element={props.element} />;
  }

  return (
    <>
      <div className="flex gap-3 flex-row justify-between bg-white border-radius-10 p-xs-md border-1">
        <div className="w-full flex flex-row items-stretch  gap-sm-md bg-white">
          <div
            onClick={() =>
              handleActivity(props?.element?.restaurants?.[0]?.id, "restaurant")
            }
            className="cursor-pointer"
          >
            <ImageLoader
              borderRadius={"10px"}
              style={{
                width: "88px",
                height: "82px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col max-ph:mb-sm gap-xxs-md max-ph:gap-xs">
            <div
              onClick={() =>
                handleActivity(
                  props?.element?.restaurants?.[0]?.id,
                  "restaurant"
                )
              }
              className={`${isPageWide ? "Body2M_14" : "Body3M_12"}`}
            >
              {props.element.heading}
            </div>

            <div className="flex flex-wrap items-center text-sm">
              <div className="pr-[8px] flex gap-[8px] justify-center items-center">
                <Image
                  src={"/assets/Itinerary/restaurant.svg"}
                  alt="ticket"
                  width={18}
                  height={18}
                />
                <div className="text-[#6E757A] Body3R_12">Restaurant</div>
              </div>

              {/* For Restaurants - timings and ratings on new line */}
              <div className="w-full flex gap-2 sm:gap-3  mt-2">
                {(props.element?.start_time || props.element?.end_time) && (
                  <div className="Body3M_12 text-[#6E757A]">
                    {props.element?.start_time &&
                      formatTime(props.element?.start_time)}
                    {props.element?.start_time &&
                      props.element?.end_time &&
                      " - "}
                    {props.element?.end_time &&
                      formatTime(props.element?.end_time)}
                  </div>
                )}
                {props.element?.restaurants?.[0]?.rating && (
                  <div className="flex items-center border-l pl-[8px] border-[#BFBFBF] font-normal text-[#6E757A]">
                    <div className="Body3M_12">
                      {props.element?.restaurants?.[0]?.rating}&nbsp;
                    </div>
                    <div className="flex items-center text-primary-stars">
                      <Image
                        src="/star.svg"
                        width={16}
                        height={16}
                        alt="star"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-xs flex-wrap ">
              {/* {props?.element?.tags && props.element.tags.map((item, i) => (
                <div className={`rounded-9xl text-sm font-400 leading-md px-sm py-xxs text-white ${i % 2 ? 'bg-tag-sky' : 'bg-tag-grass'}`} key={i}>{item}</div>
              ))} */}
            </div>
          </div>
        </div>

        <div
          className={`flex gap-3 flex-col  ${
            !isPageWide
              ? "flex-row-reverse justify-end "
              : " items-end justify-between"
          }`}
        >
          <div>
            {" "}
            <IconButton
              size="small"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className="-mt-sm"
              onClick={handleClick}
              color="#000"
              fontSize="small"
            >
              <FaEllipsis color="#000" />{" "}
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              disableScrollLock
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
              }}
              anchorOrigin={isPageWide ? { horizontal: "right" } : undefined}
              transformOrigin={isPageWide ? { horizontal: "right" } : undefined}
            >
              <MenuItem className="list-menu-item" onClick={handleDelete}>
                Remove
              </MenuItem>
              {props.slabIndex != 0 && (
                <MenuItem
                  onClick={() => handleMoveElement(props.slabIndex - 1)}
                  className="list-menu-item"
                >
                  Move Up
                </MenuItem>
              )}
              {props.slabIndex != props.totalElements - 1 && (
                <MenuItem
                  onClick={() => handleMoveElement(props.slabIndex + 1)}
                  className="list-menu-item"
                >
                  Move Down
                </MenuItem>
              )}
            </Menu>
          </div>
          <div className="max-ph:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleActivity(
                  props?.element?.restaurants?.[0]?.id,
                  "restaurant"
                );
              }}
              className="IndigoOutlinedButton !w-[78px] Body2M_14"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <POIDetailsDrawer
        itineraryDrawer
        show={showDrawer}
        iconId={props.element?.restaurants?.[0]?.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.element.heading}
        image={props.element.icon}
        text={props.element?.text}
        Topheading={"Select Our Point Of Interest"}
        activityData={activityData}
        dayIndex={props?.dayIndex}
        itinerary_city_id={props?.itinerary_city_id}
        slabIndex={props?.slabIndex}
        setShowLoginModal={props?.setShowLoginModal}
        cityID={props?.cityID}
        cityName={props?.cityName}
      />
    </>
  );
};

const MealRecommendation = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className="flex items-center gap-3 bg-white">
      <div className="w-[10%] h-full">
        <ImageLoader
          style={{
            width: isPageWide ? "40px" : "30px",
            height: isPageWide ? "40px" : "30px",
            filter: "grayscale(100%) brightness(0%) contrast(100%)",
            margin: "auto",
          }}
          url={
            props.element?.icon
              ? props.element.icon
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="w-[90%] flex flex-col gap-2 text-sm">
        <div className="font-medium text-[16px]">{props.element.heading}</div>
      </div>
    </div>
  );
};

const Restaurant = (props) => {
  return (
    <div className="flex items-center gap-3">
      <div>
        <ImageLoader
          borderRadius={"5px"}
          style={{
            width: "70px",
            height: "70px",
          }}
          url={
            props.element?.image
              ? props.element.image
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="">
        <div className="font-medium md:text-[14px]">{props.element.name}</div>
        <div className="flex items-center gap-1">
          <FaLocationDot className="text-2xl" />
          <span className="text-[12px] line-clamp-1">
            {props.element.address}
          </span>
        </div>
        <div className="line-clamp-3 text-[12px] text-[#7A7A7A]">
          {props.element.description}
        </div>
      </div>
    </div>
  );
};
