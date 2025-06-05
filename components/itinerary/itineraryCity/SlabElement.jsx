import { useState } from "react";
import { MdOutlineStar, MdStarHalf } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import ImageLoader from "../../ImageLoader";
import media from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";
import Image from "next/image";

export const getStars = (rating) => {
  const stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<MdOutlineStar className="text-[#FFD201]" />);
  }
  if (Math.floor(rating) < rating) {
    stars.push(<MdStarHalf className="text-[#FFD201]" />);
  }

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
  let isPageWide = media("(min-width: 768px)");
  const [showDrawer, setShowDrawer] = useState(false);
  const [activityData, setActivityData] = useState({
    id: "",
    type: "",
  });
  const [showBookingDetail, setShowBookingDetail] = useState(true);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = async (poi, type) => {
    setShowDrawer(true);
    if (poi?.booking?.id) setShowBookingDetail(true);
    setActivityData(() => ({
      id: poi?.booking?.id
        ? poi?.booking?.id
        : poi?.poi
        ? poi?.poi
        : poi?.activity
        ? poi?.activity
        : null,
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

  return (
    <>
      <div className="hidden lg:!flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full flex flex-row items-center gap-3 bg-white">
          <div
            onClick={() =>
              handleActivity(
                props?.element,
                props?.element?.poi != "undefined"
                  ? "poi"
                  : props?.element?.element_type
              )
            }
            className="md:w-[12%] cursor-pointer"
          >
            <ImageLoader
              borderRadius={"5px"}
              style={{
                width: isPageWide ? "60px" : "50px",
                height: isPageWide ? "60px" : "50px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col md:ml-[10px]">
            <div
              onClick={() =>
                handleActivity(
                  props?.element,
                  props?.element?.poi != null ? "poi" : "activity"
                )
              }
              className="w-fit font-medium text-[16px] cursor-pointer"
            >
              {props.element.heading}
            </div>

            <div className="flex flex-row gap-2 items-center text-sm">
              {props?.element?.poi ? (
                <div className="w-max items-center bg-[#FAFAFA]  text-[#7A7A7A] opacity-[70%] text-[12px] px-1 rounded-sm">
                  Self Exploration
                </div>
              ) : (
                <>
                  <div className="w-max items-center bg-[#F5FFF7]  text-[#10A317] text-[12px] px-1 rounded-sm">
                    Activity
                  </div>
                </>
              )}

              {props?.element?.activity != null ? (
                <div className="flex justify-between hidden lg:!flex  items-center">
                  <div className="flex gap-3">
                    {props?.element?.booking?.pax && (
                      <div className="flex text-[12px] font-medium items-center gap-1">
                        <Image
                          src="/ticket.svg"
                          alt="ticket"
                          width={13.33}
                          height={10.67}
                        />
                        {props?.element?.booking?.pax} ticket
                        {props?.element?.booking?.pax > 1 ? "s" : ""}
                      </div>
                    )}
                    {props.element?.booking?.duration &&
                      props.element?.booking?.duration !== "0 hours" && (
                        <div className="flex text-[12px] font-medium items-center gap-1">
                          <Image
                            src="/clock.svg"
                            alt="clock"
                            width={13.33}
                            height={10.67}
                          />
                          {props.element?.booking?.duration}
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="flex  items-center">
                    {getStars(props.element?.rating)}
                  </div>
                  <div className=" text-[#7A7A7A] text-[12px]">
                    {props.element?.rating}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            handleActivity(
              props?.element,
              props?.element?.poi != null ? "poi" : "activity"
            )
          }
          className="hidden lg:!block w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap md:hidden"
        >
          View Details
        </button>
      </div>

      <div className="lg:hidden">
        <div className="flex flex-col gap-3 md:flex-row  md:justify-between">
          <div className="w-full flex flex-row  gap-3 bg-white">
            <div
              onClick={() =>
                handleActivity(
                  props?.element,
                  props?.element?.poi != "undefined"
                    ? "poi"
                    : props?.element?.element_type
                )
              }
              className="md:w-[12%] cursor-pointer"
            >
              <ImageLoader
                borderRadius={"5px"}
                style={{
                  width: isPageWide ? "60px" : "50px",
                  height: isPageWide ? "60px" : "50px",
                  cursor: "pointer",
                  margin: "auto",
                }}
                url={props.element?.icon}
              />
            </div>

            <div className=" md:ml-[10px] w-full flex flex-col gap-1">
              <div
                onClick={() =>
                  handleActivity(
                    props?.element,
                    props?.element?.poi != null ? "poi" : "activity"
                  )
                }
                className="w-fit font-medium text-[16px] cursor-pointer"
              >
                {props.element.heading}
              </div>

              <div className="w-fulltext-sm flex flex-col gap-1">
                {props?.element?.poi ? (
                  <div className="w-max items-center bg-[#FAFAFA]  text-[#7A7A7A] opacity-[70%] text-[12px] px-1 rounded-sm">
                    Self Exploration
                  </div>
                ) : (
                  <>
                    <div className="w-max items-center bg-[#F5FFF7]  text-[#10A317] text-[12px] px-1 rounded-sm">
                      Activity
                    </div>
                  </>
                )}
                {props?.element?.activity != null ? (
                  <div className="flex justify-between lg:hidden">
                    <div className="flex gap-3">
                      <div className="flex text-[12px] font-medium items-center gap-1">
                        <Image
                          src="/ticket.svg"
                          alt="ticket"
                          width={13.33}
                          height={10.67}
                        />
                        {props?.element?.booking?.pax} ticket
                        {props?.element?.booking?.pax > 1 ? "s" : ""}
                      </div>
                      {props.element?.booking?.duration &&
                        props.element?.booking?.duration !== "0 hours" && (
                          <div className="flex text-[12px] font-medium items-center gap-1">
                            <Image
                              src="/clock.svg"
                              alt="clock"
                              width={13.33}
                              height={10.67}
                            />
                            {props.element?.booking?.duration}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <>
                      <div className="!flex  items-center">
                        {getStars(props.element?.rating)}
                      </div>
                      <div className=" text-[#7A7A7A] text-[12px]">
                        {props.element?.rating}
                      </div>
                    </>
                  </div>
                )}

                <button
                  onClick={() =>
                    handleActivity(
                      props?.element,
                      props?.element?.poi != null ? "poi" : "activity"
                    )
                  }
                  className="!block w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap md:hidden"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <POIDetailsDrawer
        itineraryDrawer
        show={showDrawer}
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
        showBookingDetail={showBookingDetail}
        setShowLoginModal={props?.setShowLoginModal}
        date={props?.date}
        cityID={props?.cityID}
        cityName={props?.cityName}
      />
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
      <div className="hidden lg:!flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full flex flex-row items-center gap-3 bg-white">
          <div
            onClick={() =>
              handleActivity(props?.element?.restaurants?.[0]?.id, "restaurant")
            }
            className="md:w-[12%] cursor-pointer"
          >
            <ImageLoader
              borderRadius={"5px"}
              style={{
                width: isPageWide ? "60px" : "50px",
                height: isPageWide ? "60px" : "50px",
                cursor: "pointer",
                margin: "auto",
              }}
              url={props.element?.icon}
            />
          </div>

          <div className="flex flex-col md:ml-[10px]">
            <div
              onClick={() =>
                handleActivity(
                  props?.element?.restaurants?.[0]?.id,
                  "restaurant"
                )
              }
              className="w-fit font-medium text-[16px] cursor-pointer"
            >
              {props.element.heading}
            </div>

            <div className="flex flex-row gap-2 items-center text-sm">
              <div className="flex flex-row items-center bg-[#FCE3DB] text-[#EE724B] text-[12px] px-1 gap-2 rounded-sm">
                <div className="flex items-center">
                  <Image
                    src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/restaurant-icon.png`}
                    height={12}
                    width={12}
                    className="object-contain"
                  />
                </div>
                <div>Restaurant</div>
              </div>
              <div className="hidden lg:!flex items-center">
                {getStars(props.element?.restaurants?.[0]?.rating)}
              </div>
              <div className="hidden lg:!block text-[#7A7A7A] text-[12px]">
                {props.element?.restaurants?.[0]?.rating}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            handleActivity(props?.element?.restaurants?.[0]?.id, "restaurant")
          }
          className="hidden lg:!block w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap md:hidden"
        >
          View Details
        </button>
      </div>

      <div className="lg:hidden">
        <div className="flex flex-col gap-3 md:flex-row  md:justify-between">
          <div className="w-full flex flex-row  gap-3 bg-white">
            <div
              onClick={() =>
                handleActivity(
                  props?.element?.restaurants?.[0]?.id,
                  "restaurant"
                )
              }
              className="md:w-[12%] cursor-pointer"
            >
              <ImageLoader
                borderRadius={"5px"}
                style={{
                  width: isPageWide ? "60px" : "50px",
                  height: isPageWide ? "60px" : "50px",
                  cursor: "pointer",
                  margin: "auto",
                }}
                url={props.element?.icon}
              />
            </div>

            <div className=" md:ml-[10px] w-full flex flex-col gap-1">
              <div
                onClick={() =>
                  handleActivity(
                    props?.element?.restaurants?.[0]?.id,
                    "restaurant"
                  )
                }
                className="w-fit font-medium text-[16px] cursor-pointer"
              >
                {props.element.heading}
              </div>

              <div className="w-fulltext-sm flex flex-col gap-1">
                <div className="flex flex-row items-center bg-[#FCE3DB] text-[#EE724B] text-[12px] px-1 gap-2 rounded-sm w-max">
                  <div className="flex items-center">
                    <Image
                      src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/restaurant-icon.png`}
                      height={12}
                      width={12}
                      className="object-contain"
                    />
                  </div>
                  <div>Restaurant</div>
                </div>
                <div className="flex justify-between lg:hidden">
                  <div className="flex gap-1">
                    <div className="flex flex-row items-center">
                      {getStars(props.element?.restaurants?.[0]?.rating)}
                    </div>
                    <div className="text-[#7A7A7A] text-[12px]">
                      {props.element?.restaurants?.[0]?.rating}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleActivity(
                      props?.element?.restaurants?.[0]?.id,
                      "restaurant"
                    )
                  }
                  className="!block w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap md:hidden"
                >
                  View Details
                </button>
              </div>
            </div>
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
