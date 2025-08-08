import { useState } from "react";
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
    // setActivityData(() => ({
    //   id: poi?.booking?.id
    //     ? poi?.booking?.id
    //     : poi?.poi
    //     ? poi?.poi
    //     : poi?.activity
    //     ? poi?.activity
    //     : null,
    //   type: type,
    // }));

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
              className="w-fit text-[14px] cursor-pointer font-montserrat mt-1"
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

              <div className="opacity-[.4] border-l pl-[8px] pr-[8px] border-[#BFBFBF]"> 12:30 - 1:30 PM</div>

              {props.element?.rating ? <div className="flex border-l pl-[8px] border-[#BFBFBF]">
                <div className="text-[12px] opacity-[.4]">
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
          <div> <IconButton size="small" color="#000" fontSize="small"><FaEllipsis color="#000" /> </IconButton> </div>
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
              className="w-fit text-[14px] cursor-pointer font-montserrat"
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

              <div className="opacity-[.4] border-l pl-[8px] pr-[8px] border-[#BFBFBF]"> 12:30 - 1:30 PM</div>

              {props.element?.restaurants?.[0]?.rating ? <div className="flex border-l pl-[8px] border-[#BFBFBF]">
                <div className="text-[12px] opacity-[.4]">
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
          <div> <IconButton size="small" color="#000" fontSize="small"><FaEllipsis color="#000" /> </IconButton> </div>
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
