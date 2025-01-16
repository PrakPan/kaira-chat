import { useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import ImageLoader from "../../ImageLoader";
import { isJson } from "../../../services/isJSON";
import media from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";

const SlabElement = (props) => {
  return (
    <div className="">
      {props.element.element_type === "activity" ? (
        <Activity element={props.element} />
      ) : props.element.element_type === "recommendation" ? (
        <Recommendation element={props.element} />
      ) : null}
    </div>
  );
};

export default SlabElement;

const Activity = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showDrawer, setShowDrawer] = useState(false);

  const getStars = (rating) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<MdOutlineStar className="text-[#FFD201]" />);
    }
    if (Math.floor(rating) < rating) {
      stars.push(<MdOutlineStar className="text-[#E3E3E3]" />);
    }

    return stars;
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = (e) => {
    setShowDrawer(true);

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full flex flex-row items-center gap-3 bg-white">
          <div onClick={handleActivity} className="md:w-[12%] cursor-pointer">
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

          <div className="flex flex-col">
            <div
              onClick={handleActivity}
              className="w-fit font-medium text-[16px] cursor-pointer"
            >
              {props.element.heading}
            </div>

            <div className="flex flex-row gap-2 items-center text-sm">
              <div className="flex flex-row items-center">{getStars(4.5)}</div>
              <div className="text-[#7A7A7A] text-[12px]">4.5</div>
              <div className="text-[#7A7A7A] text-[12px] underline">
                2450 Google reviews
              </div>
            </div>
            {/* <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
              {props.element?.poi ? "Self Exploration" : "Activity"}
            </div> */}
          </div>
        </div>

        <button
          onClick={handleActivity}
          className="w-fit text-[12px] font-semibold border-2 border-black hover:bg-black hover:text-white rounded-lg p-2 text-nowrap"
        >
          View Details
        </button>
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
      />
    </>
  );
};

const Recommendation = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [viewMore, setViewMore] = useState(false);

  if (props.element.type === "Meal Recommendation") {
    return <MealRecommendation element={props.element} />;
  }

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
        {/* {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null} */}

        {props.element.text ? (
          isJson(props.element.text) ? (
            <>
              <div
                className={`${
                  viewMore ? "" : "h-[90px]"
                } overflow-hidden grid md:grid-cols-2 gap-4`}
              >
                {JSON.parse(props.element.text).map((res, index) => (
                  <Restaurant key={index} element={res} />
                ))}
              </div>

              <button
                onClick={() => setViewMore((prev) => !prev)}
                className="w-fit mx-auto flex items-center cursor-pointer"
              >
                {viewMore ? (
                  <>
                    View Less <RiArrowDropUpLine className="text-2xl" />
                  </>
                ) : (
                  <>
                    View More <RiArrowDropDownLine className="text-2xl" />
                  </>
                )}
              </button>
            </>
          ) : null
        ) : null}
      </div>
    </div>
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
        {/* {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null} */}
        {/* <p className="line-clamp-3">{props.element.text}</p> */}
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
        <div className="line-clamp-3 text-[12px] text-[#7A7A7A]">
          {props.element.description}
        </div>
      </div>
    </div>
  );
};
