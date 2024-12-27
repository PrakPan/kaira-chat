import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import ImageLoader from "../../ImageLoader";
import { isJson } from "../../../services/isJSON";
import media from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";

const SlabElement = (props) => {
  return (
    <div className="py-3 bg-white">
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
      <div className="flex flex-row gap-3 bg-white">
        <div onClick={handleActivity} className="md:w-[15%] cursor-pointer">
          <ImageLoader
            borderRadius={"5px"}
            style={{
              width: isPageWide ? "120px" : "60px",
              height: isPageWide ? "120px" : "60px",
              cursor: "pointer"
            }}
            url={props.element?.icon}
          />
        </div>

        <div className="md:w-[85%] flex flex-col gap-2">
          <div
            onClick={handleActivity}
            className="w-fit font-semibold text-base cursor-pointer"
          >
            {props.element.heading}
          </div>
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element?.poi ? "Self Exploration" : "Activity"}
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
      />
    </>
  );
};

const Recommendation = (props) => {
  const [viewMore, setViewMore] = useState(false);

  if (props.element.type === "Meal Recommendation") {
    return <MealRecommendation element={props.element} />;
  }

  return (
    <div className="flex items-center gap-3 bg-white">
      <div className="w-[15%] h-full">
        <ImageLoader
          style={{
            width: "50px",
            height: "50px",
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

      <div className="w-[85%] flex flex-col gap-2 text-sm">
        <div className="font-semibold text-base">{props.element.heading}</div>
        {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null}

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
          ) : (
            <p className="line-clamp-3">{props.element.text}</p>
          )
        ) : null}
      </div>
    </div>
  );
};

const MealRecommendation = (props) => {
  return (
    <div className="flex items-center gap-3 bg-white">
      <div className="w-[15%] h-full">
        <ImageLoader
          style={{
            width: "50px",
            height: "50px",
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

      <div className="w-[85%] flex flex-col gap-2 text-sm">
        <div className="font-semibold text-base">{props.element.heading}</div>
        {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null}
        <p className="line-clamp-3">{props.element.text}</p>
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
            width: "80px",
            height: "80px",
          }}
          url={
            props.element?.image
              ? props.element.image
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="">
        <div className="font-semibold md:text-lg">{props.element.name}</div>
        <div className="line-clamp-3 font-light">
          {props.element.description}
        </div>
      </div>
    </div>
  );
};
