import { useState, useEffect } from "react";

import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";

const CitySummary = (props) => {
  const [activities, setActivities] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [poi, setPoi] = useState(0);

  useEffect(() => {
    let activityArray = [];

    for (const daybyday of props.city.day_by_day) {
      for (const element of daybyday?.slab_elements) {
        if (element.element_type === "activity") {
          activityArray.push(element);
        }
      }
    }

    setActivities(activityArray);
  }, [props.city]);

  const handleActivity = (e) => {
    setPoi(e.target.id);
    setShowDrawer(true);

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: activities[e.target.id].heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const handleSeeMore = () => {
    props.setViewMore(true);
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  return (
    <div className="flex p-3">
      {activities && activities.length ? (
        <div className="text-sm font-normal flex flex-row items-center flex-wrap gap-1 w-full">
          <span className="text-[14px] font-medium leading-[22px]">
            Explore:{" "}
          </span>
          {activities.map(
            (poi, index) =>
              index < 3 && (
                <span
                  onClick={handleActivity}
                  key={index}
                  id={index}
                  className="cursor-pointer hover:text-blue border-2 rounded-full px-2 lg:px-3 md:px-3 py-1"
                >
                  {poi.heading}
                </span>
              )
          )}
          <span
            onClick={handleSeeMore}
            className="ml-2 text-blue hover:underline font-[600] text-[12px] leading-[22px] cursor-pointer"
          >
            {activities.length > 3 ? "1+ more" : "see more"}
          </span>
        </div>
      ) : null}

      {activities && activities.length ? (
        <POIDetailsDrawer
          itineraryDrawer
          show={showDrawer}
          iconId={
            activities[poi]?.poi
              ? activities[poi]?.poi
              : activities[poi]?.activity
          }
          handleCloseDrawer={handleCloseDrawer}
          name={activities[poi].heading}
          image={activities[poi].icon}
          text={activities[poi]?.text}
          Topheading={"Select Our Point Of Interest"}
        />
      ) : null}
    </div>
  );
};

export default CitySummary;
