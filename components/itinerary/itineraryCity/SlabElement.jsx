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
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { useDispatch, useSelector } from "react-redux";
import setItinerary from "../../../store/actions/itinerary";
import { openNotification } from "../../../store/actions/notification";
import { MERCURY_HOST } from "../../../services/constants";

export const getStars = (rating) => {
  const stars = [];
  stars.push(<MdOutlineStar className="text-[#FFD201]" />);

  return stars;
};

const SlabElement = (props) => {
  return (
    <div className="">
      {props.element.element_type === "activity" ? (
        <Activity
          element={props.element}
          dayIndex={props?.dayIndex}
          slabIndex={props?.slabIndex}
          itinerary_city_id={props?.itinerary_city_id}
          setShowLoginModal={props?.setShowLoginModal}
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

      if ((props?.element?.poi != null && res?.status === 200) || (props?.element?.booking?.id && res?.status === 204)) {
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
        }
        else {
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


  return (
    <>
      <div className=" lg:!flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white border-radius-10 p-2 border-1">
        <div className="w-full flex flex-row items-center gap-2 bg-white">
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
                width: "50px",
                height: "50px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col">
            <div
              onClick={() =>
                handleActivity(
                  props?.element,
                  props?.element?.poi != null ? "poi" : "activity"
                )
              }
              className="w-fit text-[14px]  cursor-pointer font-medium font-montserrat mt-1"
            >
              {props.element.heading}
            </div>

            <div className="flex flex-row items-center text-[12px] font-montserrat">
              <div className="pr-[8px]">
                <Image
                  src={props?.element?.poi ? '/assets/Itinerary/global.svg' : '/assets/Itinerary/activity.svg'}
                  alt="ticket"
                  width={15}
                  height={15}
                />
              </div>

              <div className="border-l pl-[8px] pr-[8px] border-[#BFBFBF] font-normal text-[#6E757A]"> 12:30 - 1:30 PM</div>

              {props.element?.rating ? <div className="flex border-l pl-[8px] border-[#BFBFBF] font-normal text-[#6E757A]">
                <div className="text-[12px]">
                  {props.element?.rating}
                </div>
                <div className="flex items-center">
                  {getStars(props.element?.rating)}
                </div>
              </div>
                : null}
            </div>
          </div>
        </div>

        <div className={`flex gap-3 items-center ${!isPageWide ? 'ml-[60px] mt-[10px] flex-row-reverse justify-end' : ''}`}>
          <div> <IconButton size="small" id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick} color="#000" fontSize="small"><FaEllipsis color="#000" /> </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              disableScrollLock
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
              anchorOrigin={
                isPageWide
                  ? { horizontal: "right", }
                  : undefined
              }
              transformOrigin={
                isPageWide
                  ? { horizontal: "right" }
                  : undefined
              }
            >
              <MenuItem className="list-menu-item" onClick={handleDelete}>Remove</MenuItem>
              {props.slabIndex != 0 && <MenuItem className="list-menu-item" onClick={handleCloseMenue}>Move Up</MenuItem>}
              {props.slabIndex != (props.totalElements - 1) && <MenuItem className="list-menu-item" onClick={handleCloseMenue}>Move Down</MenuItem>}
            </Menu>
          </div>
          <div>
            <button
              onClick={() =>
                handleActivity(
                  props?.element,
                  props?.element?.poi != null ? "poi" : "activity"
                )
              }
              className="ttw-btn-secondary">
              Details
            </button>
          </div>
        </div>
      </div >

      {
        drawer === "showPoiDetail" &&
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
        )
      }
    </>
  );
};

const Recommendation = (props) => {
  let isPageWide = media("(min-width: 768px)");

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

  if (props.element.type === "Meal Recommendation") {
    return <MealRecommendation element={props.element} />;
  }

  return (
    <>
      <div className="lg:!flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white border-radius-10 p-2 border-1">
        <div className="w-full flex flex-row items-center gap-2 bg-white">
          <div
            onClick={() =>
              handleActivity(props?.element?.restaurants?.[0]?.id, "restaurant")
            }
            className="cursor-pointer"
          >
            <ImageLoader
              borderRadius={"10px"}
              style={{
                width: "50px",
                height: "50px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col">
            <div
              onClick={() =>
                handleActivity(
                  props?.element?.restaurants?.[0]?.id,
                  "restaurant"
                )
              }
              className="w-fit text-[14px] font-medium cursor-pointer font-montserrat"
            >
              {props.element.heading}
            </div>


            <div className="flex flex-row items-center text-[12px] font-montserrat mt-1">
              <div className="pr-[8px]">
                <Image
                  src={'/assets/Itinerary/restaurant.svg'}
                  alt="ticket"
                  width={15}
                  height={15}
                />
              </div>

              <div className="border-l pl-[8px] pr-[8px] border-[#BFBFBF] font-normal text-[#6E757A]"> 12:30 - 1:30 PM</div>

              {props.element?.restaurants?.[0]?.rating ? <div className="flex border-l pl-[8px] border-[#BFBFBF] font-normal text-[#6E757A]">
                <div className="text-[12px]">
                  {props.element?.restaurants?.[0]?.rating}
                </div>
                <div className="flex items-center">
                  {getStars(props.element?.restaurants?.[0]?.rating)}
                </div>
              </div>
                : null}
            </div>
          </div>
        </div>


        <div className={`flex gap-3 items-center ${!isPageWide ? 'ml-[60px] mt-[10px] flex-row-reverse justify-end' : ''}`}>
          <div> <IconButton size="small" id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick} color="#000" fontSize="small"><FaEllipsis color="#000" /> </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              disableScrollLock
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
              anchorOrigin={
                isPageWide
                  ? { horizontal: "right", }
                  : undefined
              }
              transformOrigin={
                isPageWide
                  ? { horizontal: "right" }
                  : undefined
              }
            >
              {props.slabIndex != 0 && <MenuItem className="list-menu-item" onClick={handleCloseMenue}>Move Up</MenuItem>}
              {props.slabIndex != (props.totalElements - 1) && <MenuItem className="list-menu-item" onClick={handleCloseMenue}>Move Down</MenuItem>}
            </Menu>
          </div>
          <div>
            <button
              onClick={() =>
                handleActivity(props?.element?.restaurants?.[0]?.id, "restaurant")
              }
              className="ttw-btn-secondary"
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
