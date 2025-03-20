import { useState, useEffect } from "react";

import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";
import ImageLoader from "../../ImageLoader";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useRouter } from "next/router";

const CitySummary = (props) => {
  const router=useRouter();
  const [dayByDay, setDayByDay] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [poi, setPoi] = useState(0);
  const [activities, setActivities] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [activityData, setActivityData] = useState({
    id: "",
    type: "",
  });

  const handleView = async (poi, type) => {
    try {
      setShowDrawer(true);
      setActivityData(() => ({
        id: poi,
        type: type,
      }));
    } catch (error) {
      console.log("error is:",error)
    }

  };  
  useEffect(() => {
    let dayByDayArray = [];

    for (const daybyday of props.city.day_by_day) {
      for (const element of daybyday?.slab_elements) {
        if (element.element_type === "activity") {
          dayByDayArray.push(element);
        }
      }
    }
    setActivities(props.city.activities);
    setDayByDay(dayByDayArray);
  }, [props.city]);

  const handleActivity = (e) => {
    setPoi(e.target.id);
    setShowDrawer(true);

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: dayByDay[e.target.id].heading,
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
    <div className="p-3 flex flex-col gap-3">
      {dayByDay && dayByDay.length ? (
        <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row">
          <div className="text-[14px] font-medium leading-[22px] w-[80px]">
            Explore:{" "}
          </div>
          <div className="text-sm font-normal flex flex-row items-center flex-wrap gap-1 w-[]">
            {dayByDay.map(
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
              {dayByDay.length > 3 && `+${dayByDay?.length - 3} more`}
            </span>
          </div>
        </div>
      ) : null}
      <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row">
        <div className="text-[14px] font-medium leading-[22px] w-[80px]">
          {activities?.length > 0 && <>Activity:</>}{" "}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap gap-2">
            {activities?.map((item) => (
              <div 
              key={item.id}
              className="flex gap-2 group w-[333px] p-[10px] border-[2px] rounded-[12px] shadow-none hover:cursor-pointer" onClick={() =>
                handleView(
                  item.id,
                  "activity"
                )
              }>
                <div className="w-[50px]">
                  <ImageLoader
                    borderRadius={"5px"}
                    style={{
                      width: "48px",
                      height: "48px",
                      cursor: "pointer",
                      margin: "auto",
                    }}
                    url={item?.image}
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                  <div className="w-fit font-semibold font-[Poppins] text-[12px] cursor-pointer">
                    {item?.name}
                  </div>
                  <div className="hidden group-hover:!block">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="mt-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg> 

                  </div>
                  </div>
                  <div className="flex gap-3 text-[12px] font-[Poppins]">
                    <div className="w-auto flex items-center gap-1">
                      <svg
                        width="14"
                        height="11"
                        viewBox="0 0 14 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.8 8.08398L6.66667 6.68398L8.5 8.08398L7.8 5.81732L9.66667 4.35065H7.4L6.66667 2.08398L5.93333 4.35065H3.66667L5.5 5.81732L4.8 8.08398ZM1.33333 10.7507C0.966667 10.7507 0.652778 10.6201 0.391667 10.359C0.130556 10.0979 0 9.78399 0 9.41732V7.16732C0 7.0451 0.0388889 6.93954 0.116667 6.85065C0.194444 6.76176 0.294444 6.70621 0.416667 6.68398C0.683333 6.5951 0.902778 6.43398 1.075 6.20065C1.24722 5.96732 1.33333 5.70621 1.33333 5.41732C1.33333 5.12843 1.24722 4.86732 1.075 4.63398C0.902778 4.40065 0.683333 4.23954 0.416667 4.15065C0.294444 4.12843 0.194444 4.07287 0.116667 3.98398C0.0388889 3.8951 0 3.78954 0 3.66732V1.41732C0 1.05065 0.130556 0.736762 0.391667 0.475651C0.652778 0.21454 0.966667 0.0839844 1.33333 0.0839844H12C12.3667 0.0839844 12.6806 0.21454 12.9417 0.475651C13.2028 0.736762 13.3333 1.05065 13.3333 1.41732V3.66732C13.3333 3.78954 13.2944 3.8951 13.2167 3.98398C13.1389 4.07287 13.0389 4.12843 12.9167 4.15065C12.65 4.23954 12.4306 4.40065 12.2583 4.63398C12.0861 4.86732 12 5.12843 12 5.41732C12 5.70621 12.0861 5.96732 12.2583 6.20065C12.4306 6.43398 12.65 6.5951 12.9167 6.68398C13.0389 6.70621 13.1389 6.76176 13.2167 6.85065C13.2944 6.93954 13.3333 7.0451 13.3333 7.16732V9.41732C13.3333 9.78399 13.2028 10.0979 12.9417 10.359C12.6806 10.6201 12.3667 10.7507 12 10.7507H1.33333ZM1.33333 9.41732H12V7.71732C11.5889 7.47287 11.2639 7.14787 11.025 6.74232C10.7861 6.33676 10.6667 5.8951 10.6667 5.41732C10.6667 4.93954 10.7861 4.49787 11.025 4.09232C11.2639 3.68676 11.5889 3.36176 12 3.11732V1.41732H1.33333V3.11732C1.74444 3.36176 2.06944 3.68676 2.30833 4.09232C2.54722 4.49787 2.66667 4.93954 2.66667 5.41732C2.66667 5.8951 2.54722 6.33676 2.30833 6.74232C2.06944 7.14787 1.74444 7.47287 1.33333 7.71732V9.41732Z"
                          fill="#01202B"
                        />
                      </svg>{" "}
                      <div>{item?.pax} tickets</div>
                    </div>
                    <div className="w-auto flex items-center gap-1">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.32734 0.417969C3.01534 0.417969 0.333344 3.10597 0.333344 6.41797C0.333344 9.72997 3.01534 12.418 6.32734 12.418C9.64534 12.418 12.3333 9.72997 12.3333 6.41797C12.3333 3.10597 9.64534 0.417969 6.32734 0.417969ZM6.33334 11.218C3.68134 11.218 1.53334 9.06997 1.53334 6.41797C1.53334 3.76597 3.68134 1.61797 6.33334 1.61797C8.98534 1.61797 11.1333 3.76597 11.1333 6.41797C11.1333 9.06997 8.98534 11.218 6.33334 11.218ZM6.20134 3.41797H6.16534C5.92534 3.41797 5.73334 3.60997 5.73334 3.84997V6.68197C5.73334 6.89197 5.84134 7.08997 6.02734 7.19797L8.51734 8.69197C8.72134 8.81197 8.98534 8.75197 9.10534 8.54797C9.23134 8.34397 9.16534 8.07397 8.95534 7.95397L6.63334 6.57397V3.84997C6.63334 3.60997 6.44134 3.41797 6.20134 3.41797Z"
                          fill="black"
                        />
                      </svg>
                      {item?.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <button
            className="bg-black text-white w-[120px] h-[38px] rounded-md px-[12px] py-[6px]"
            onClick={() => setShowAddDrawer(true)}
          >
            Add Activity
          </button> */}
          <p
            className=" text-blue cursor-pointer font-semibold underline"
            onClick={() => setShowAddDrawer(true)}
          >
           + Add Activity in {props?.city?.city?.name}
          </p>
        </div>
      </div>
      {dayByDay && dayByDay.length ? (
        <POIDetailsDrawer
          itineraryDrawer
          show={showDrawer}
          iconId={
            dayByDay[poi]?.poi ? dayByDay[poi]?.poi : dayByDay[poi]?.activity
          }
          handleCloseDrawer={handleCloseDrawer}
          name={dayByDay?.[poi].heading }
          image={dayByDay[poi].icon}
          text={dayByDay[poi]?.text }
          Topheading={"Select Our Point Of Interest"}
          activityData={activityData}
        />
      ) : null}
      <ActivityAddDrawer
        showDrawer={showAddDrawer}
        setShowDrawer={setShowAddDrawer}
        cityName={props.city.city.name}
        cityID={props.city.city.id}
        date={props?.city?.start_date}
        itinerary_city_id={props?.city?.id}
        setActivities={setActivities}
        activities={activities}
        activityBookings={props?.activityBookings}
        setActivityBookings={props?.setActivityBookings}
      ></ActivityAddDrawer>
    </div>
  );
};

export default CitySummary;
