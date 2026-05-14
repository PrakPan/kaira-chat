import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";
import { IconButton, Menu, MenuItem } from "@mui/material";
import media from "../media";
import { openNotification } from "../../store/actions/notification";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import Image from "next/image";
import ActivityAddDrawer from "../drawers/poiDetails/activityAddDrawer";
import setItinerary from "../../store/actions/itinerary";
import POIDetailsDrawer from "../drawers/poiDetails/POIDetailsDrawer";
import styled from 'styled-components';


const Container = styled.div`
  min-width: 100%;
  width: fit-content;
  position: sticky;
  top: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  background-color: white !important;
  border-bottom: 1px solid #e5e3de;
  box-sizing: border-box;
`;

const CityDrawerView = ({
  show,
  onClose,
  cityId,
  setShowCityDrawer,
  ...otherProps
}) => {
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const router = useRouter();
  const { drawer, poi_id, type } = router?.query;
  const city = itineraryDaybyDay?.cities?.find((c) => c.id === cityId);
  const cityIndex = itineraryDaybyDay?.cities?.findIndex(c => c.id === cityId);

  // Find the specific element to get its details
  const findElementDetails = () => {
    if (!poi_id || !type || !city) return null;

    let foundElement = null;
    let dayIndex = -1;
    let slabIndex = -1;

    // Search through all days and elements
    city?.day_by_day?.forEach((day, dIndex) => {
      day?.slab_elements?.forEach((element, eIndex) => {
        if (type === "activity" && element?.booking?.id === poi_id) {
          foundElement = element;
          dayIndex = dIndex;
          slabIndex = eIndex;
        } else if (type === "poi" && element?.poi === poi_id) {
          foundElement = element;
          dayIndex = dIndex;
          slabIndex = eIndex;
        } else if (element?.restaurants?.[0]?.id === poi_id) {
          foundElement = element;
          dayIndex = dIndex;
          slabIndex = eIndex;
        }
      });
    });

    return { foundElement, dayIndex, slabIndex };
  };

  const handleCityDrawerClose = () => {
    const newQuery = { ...router.query };
    delete newQuery.cityDrawer;
    delete newQuery.drawer;
    delete newQuery.poi_id;
    delete newQuery.type;
    delete newQuery.dayIndex;
    delete newQuery.slabIndex;
    delete newQuery.itinerary_city_id;

    router.push(
      {
        pathname: window.location.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const handlePoiDrawerClose = () => {
    // Remove only POI drawer params, keep cityDrawer open
    const newQuery = { ...router.query };
    delete newQuery.drawer;
    delete newQuery.poi_id;
    delete newQuery.type;
    delete newQuery.dayIndex;
    delete newQuery.slabIndex;

    // IMPORTANT: Keep the cityDrawer query param to prevent closing
    if (!newQuery.cityDrawer && cityId) {
      newQuery.cityDrawer = cityId;
    }

    router.push(
      {
        pathname: window.location.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const elementDetails = findElementDetails();

  if (!show || !city) return null;  
  return (
    <div className="w-full" onClick={handleCityDrawerClose}>
      <div
        className="h-full w-full bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ItineraryCityWithDrawer
          city={city}
          setShowCityDrawer={handleCityDrawerClose}
          onClose={setShowCityDrawer}
          index={cityIndex}
          {...otherProps}
        />
      </div>

      {/* POI/Activity/Restaurant Details Drawer */}
      {drawer === "showPoiDetail" && elementDetails.foundElement && (
        <POIDetailsDrawer
          itineraryDrawer
          show={true}
          iconId={poi_id}
          handleCloseDrawer={handlePoiDrawerClose}
          name={elementDetails.foundElement.heading}
          image={elementDetails.foundElement.icon}
          text={elementDetails.foundElement?.text}
          Topheading={"Select Our Point Of Interest"}
          activityData={{ id: poi_id, type: type }}
          itinerary_city_id={cityId}
          dayIndex={elementDetails.dayIndex}
          slabIndex={elementDetails.slabIndex}
          showBookingDetail={true}
          setShowLoginModal={otherProps?.setShowLoginModal}
          date={city?.start_date} // Pass city start date
          cityID={city?.city?.id}
          cityName={city?.city?.name}
          removeDelete={false}
          // Pass additional props from old code
          element={elementDetails.foundElement}
          mercuryItinerary={otherProps?.mercuryItinerary}
          activityBookings={otherProps?.activityBookings}
          setActivityBookings={otherProps?.setActivityBookings}
        />
      )}
    </div>
  );
};

export default CityDrawerView;

const handleMoveElementCommonly = async (
  dispatch,
  itinerary,
  router,
  itinerary_city_id,
  dayIndex,
  slabIndex,
  position,
  heading,
  setShowLoginModal,
  id,
  customer,
) => {
  const token = localStorage.getItem("access_token");

  console.log("Moving element:", dayIndex, slabIndex, "to position:", position);

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
      },
    );

    if (res?.status === 200) {
      const updatedDayByDay = res.data;
      const newItinerary = JSON.parse(JSON.stringify(itinerary));

      // Update the specific city's day_by_day data
      const itineraryCities = newItinerary.cities.map((city) =>
        city.id === itinerary_city_id
          ? { ...city, day_by_day: updatedDayByDay }
          : city,
      );

      newItinerary.cities = itineraryCities;

      // Dispatch immediately without closing drawer
      dispatch(setItinerary(newItinerary));

      dispatch(
        openNotification({
          type: "success",
          text: `${heading} has been moved successfully.`,
          heading: "Success!",
        }),
      );
    }
  } catch (error) {
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
      }),
    );
  }
};

export const ItineraryCityWithDrawer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const itinerary = useSelector((state) => state.Itinerary);
  const { id } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.Itinerary);

  const currentCity =
    itinerary?.cities?.find((c) => c.id === props.city.id) || props.city;

  // Get router query params
  const { drawer, idx, date, itinerary_city_id } = router?.query;

  return (
    <div className="flex flex-col w-full h-full bg-white pb-[120px] md:pb-[50px]">
      <Container>
      {/* Back Button */}
      <div className="md:px-4 py-2  bg-white">
        <button
          onClick={() => props?.onClose(false)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-base font-medium">Back</span>
        </button>
      </div>
      </Container>

      {/* City Header */}
      <div className="md:px-6 py-4  bg-white">
        <h2 className="text-[20px] font-medium mb-3">
          {props.city?.city?.name} - {props.city?.duration}{" "}
          {/* {props.city?.duration === 1 ? "Day" : "Days"}, {props.city?.duration}{" "} */}
          {props.city?.duration === 1 ? "Night" : "Nights"}
        </h2>

        {/* Hotel Info */}
        {props.city?.hotels && props.city?.hotels?.length > 0 && (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <g opacity="0.3">
                <path
                  d="M19.25 18.25V1.25C19.25 0.984784 19.1446 0.73043 18.9571 0.542893C18.7696 0.355357 18.5152 0.25 18.25 0.25H8.25C7.98478 0.25 7.73043 0.355357 7.54289 0.542893C7.35536 0.73043 7.25 0.984784 7.25 1.25V18.25H4.25V14.25H5.25C5.51522 14.25 5.76957 14.1446 5.95711 13.9571C6.14464 13.7696 6.25 13.5152 6.25 13.25V8.25C6.25 7.98478 6.14464 7.73043 5.95711 7.54289C5.76957 7.35536 5.51522 7.25 5.25 7.25H1.25C0.984784 7.25 0.73043 7.35536 0.542893 7.54289C0.355357 7.73043 0.25 7.98478 0.25 8.25V13.25C0.25 13.5152 0.355357 13.7696 0.542893 13.9571C0.73043 14.1446 0.984784 14.25 1.25 14.25H2.25V18.25H1.25C0.984784 18.25 0.73043 18.3554 0.542893 18.5429C0.355357 18.7304 0.25 18.9848 0.25 19.25C0.25 19.5152 0.355357 19.7696 0.542893 19.9571C0.73043 20.1446 0.984784 20.25 1.25 20.25H19.25C19.5152 20.25 19.7696 20.1446 19.9571 19.9571C20.1446 19.7696 20.25 19.5152 20.25 19.25C20.25 18.9848 20.1446 18.7304 19.9571 18.5429C19.7696 18.3554 19.5152 18.25 19.25 18.25ZM2.25 9.25H4.25V12.25H2.25V9.25ZM12.25 18.25V15.25C12.25 14.9848 12.3554 14.7304 12.5429 14.5429C12.7304 14.3554 12.9848 14.25 13.25 14.25C13.5152 14.25 13.7696 14.3554 13.9571 14.5429C14.1446 14.7304 14.25 14.9848 14.25 15.25V18.25H12.25ZM16.25 18.25V15.25C16.25 14.4544 15.9339 13.6913 15.3713 13.1287C14.8087 12.5661 14.0456 12.25 13.25 12.25C12.4544 12.25 11.6913 12.5661 11.1287 13.1287C10.5661 13.6913 10.25 14.4544 10.25 15.25V18.25H9.25V2.25H17.25V18.25H16.25Z"
                  fill="black"
                  stroke="white"
                  stroke-width="0.5"
                />
                <path d="M12.25 4.25H10.25V6.25H12.25V4.25Z" fill="black" />
                <path d="M16.25 4.25H14.25V6.25H16.25V4.25Z" fill="black" />
                <path d="M12.25 8.25H10.25V10.25H12.25V8.25Z" fill="black" />
                <path d="M16.25 8.25H14.25V10.25H16.25V8.25Z" fill="black" />
              </g>
            </svg>
            <span className="text-[14px]">{props.city?.hotels[0]?.name}</span>
            {props.city?.hotels[0]?.rating && (
              <div className="flex items-center gap-1">
                <span className="text-[14px]">
                  {"|"} {props.city?.hotels[0].rating}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clip-path="url(#clip0_7451_2336)">
                    <path
                      d="M9.944 6.4L8 0L6.056 6.4H0L4.944 9.928L3.064 16L8 12.248L12.944 16L11.064 9.928L16 6.4H9.944Z"
                      fill="#F7E700"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7451_2336">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="divide-y border-1 border-b "></div>

      {/* Day by Day Content */}
      <div className="flex-1">
        <CityDaybyDayExpanded
          city={currentCity}
          itinerary={itinerary}
          dispatch={dispatch}
          router={router}
          index={props?.index}
          id={id}
          customer={customer}
          {...props}
        />
      </div>

      {/* ActivityAddDrawer - MOVE THIS OUTSIDE THE LOOP */}
      {drawer === "showAddActivity" && (
        <ActivityAddDrawer
          showDrawer={drawer === "showAddActivity"}
          mercuryItinerary={props?.mercuryItinerary}
          setShowDrawer={() => {
            // Clear drawer params but keep cityDrawer
            const newQuery = { ...router.query };
            delete newQuery.drawer;
            delete newQuery.idx;
            delete newQuery.date;
            delete newQuery.itinerary_city_id;

            router.push(
              {
                pathname: window.location.pathname,
                query: newQuery,
              },
              undefined,
              { shallow: true },
            );
          }}
          cityName={currentCity?.city?.name}
          cityID={currentCity?.city?.id}
          date={date}
          setItinerary={props?.setItinerary}
          itinerary_city_id={currentCity?.id}
          day={`Day ${parseInt(idx) + 1 || 1}`}
          duration={currentCity?.duration}
          start_date={currentCity?.start_date}
          day_slab_index={parseInt(idx) || 0}
          setShowLoginModal={props?.setShowLoginModal}
          activityBookings={props?.activityBookings}
          setActivityBookings={props?.setActivityBookings}
        />
      )}
    </div>
  );
};

// Expanded View (shows in drawer)
const CityDaybyDayExpanded = (props) => {
  return (
    <div className="space-y-4 md:p-4">
      {props.city?.day_by_day?.map((day, index) => (
        <DayCardExpanded
          key={day.slab_id || index}
          day={day}
          index={index}
          dayIndex={props?.index}
          city={props.city}
          // {...props}
        />
      ))}
    </div>
  );
};

// Get time period based on time
const getTimePeriod = (startTime) => {
  if (!startTime) return "Noon";
  const hour = parseInt(startTime.split(":")[0], 10);
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Noon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

// Expanded Day Card
const DayCardExpanded = ({ day, dayIndex, index, ...props }) => {

  const router = useRouter();
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedActivities = {};
  day.slab_elements?.forEach((element) => {
    const period = getTimePeriod(element.start_time);
    if (!groupedActivities[period]) {
      groupedActivities[period] = [];
    }
    groupedActivities[period].push(element);
  });

  const periods = ["Morning", "Noon", "Evening", "Night"];

  const handleItemClick = () => {
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.city?.id,
          idx: index,
          date: day?.date,
        },
      },
      undefined,
      {
        scroll: false,
      },
    );
  };


  return (
    <div className="bg-white">
      {/* Day Header */}
      <div className="py-3 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] !font-inter">
            Day {index + 1} {" | "}
            {new Date(day.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          onClick={handleItemClick}
        >
          <path
            d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7417 6.1 19.225C4.88333 18.6917 3.825 17.975 2.925 17.075C2.025 16.175 1.30833 15.1167 0.775 13.9C0.258333 12.6833 0 11.3833 0 10C0 8.61667 0.258333 7.31667 0.775 6.1C1.30833 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31667 6.1 0.799999C7.31667 0.266666 8.61667 0 10 0C11.3833 0 12.6833 0.266666 13.9 0.799999C15.1167 1.31667 16.175 2.025 17.075 2.925C17.975 3.825 18.6833 4.88333 19.2 6.1C19.7333 7.31667 20 8.61667 20 10C20 11.3833 19.7333 12.6833 19.2 13.9C18.6833 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6917 13.9 19.225C12.6833 19.7417 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
            fill="#1D1B20"
          />
        </svg>
      </div>

      {/* Activities grouped by time period */}
      <div className="">
        {periods.map((period) => {
          const activities = groupedActivities[period];
          if (!activities || activities.length === 0) return null;

          return (
            <div key={period} className="p-2 px-0">
              <div className="flex gap-2">
                {/* Time Period Label */}
                <div className="w-16 md:w-20 flex-shrink-0">
                  <span className="text-[14px]  text-gray-500">{period}</span>
                </div>

                {/* Activities */}
                <div className="flex-1 space-y-3">
                  {activities.map((element, idx) => (
                    <ActivityCardExpanded
                      key={idx}
                      element={element}
                      itinerary_city_id={props?.city.id}
                      dayIndex={index}
                      index={index}
                      slabIndex={day.slab_elements.indexOf(element)}
                      totalElements={day.slab_elements.length}
                      {...props}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityCardExpanded = ({
  element,
  slabIndex,
  totalElements,
  dayIndex,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const itinerary = useSelector((state) => state.Itinerary);

  const open = Boolean(anchorEl);

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${period}`;
  };

  const { itinerary_city_id } = router?.query;

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  const handleCloseMenue = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMoveElement = async (position) => { 
    console.log("Moving element to position:", position);
    await handleMoveElementCommonly(
      dispatch,
      itinerary,
      router,
      itinerary_city_id || props?.city.id,
      dayIndex,
      slabIndex,
      position,
      element.heading,
      props?.setShowLoginModal,
      props.id,
      props.customer,
    );
    handleCloseMenue();
  };

  const handleItemClick = (item) => {
    if (!item) return;

    // Determine the type and ID
    let itemType = "";
    let itemId = "";

    if (item?.activity) {
      itemType = "activity";
      itemId = item.booking?.id;
    } else if (item?.poi) {
      itemType = "poi";
      itemId = item.poi;
    } else {
      itemType = "restaurant";
      itemId = item?.restaurants?.[0]?.id;
    }

    if (itemType && itemId) {
      // Create new query object with cityDrawer preserved
      const newQuery = {
        ...router.query,
        drawer: `showPoiDetail`,
        itinerary_city_id: props?.itinerary_city_id || props?.city?.id,
        poi_id: itemId,
        type: itemType,
        dayIndex: dayIndex,
        slabIndex: slabIndex,
      };

      // If cityDrawer is already in query, keep it
      if (router.query.cityDrawer) {
        newQuery.cityDrawer = router.query.cityDrawer;
      }

      router.push(
        {
          pathname: window.location.pathname,
          query: newQuery,
        },
        undefined,
        {
          scroll: false,
        },
      );
    }
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
      if (element?.poi != null) {
        res = await axios.delete(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/poi/delete/`,
          {
            data: {
              itinerary_city_id: itinerary_city_id || props?.city.id,
              day_by_day_index: dayIndex,
              poi_index: slabIndex,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
      } else {
        res = await axios.delete(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${element?.booking?.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
      }

      if (
        (element?.poi != null && res?.status === 200) ||
        (element?.booking?.id && res?.status === 204)
      ) {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));

        if (element?.poi != null) {
          // For POI deletion - remove from day_by_day
          const itineraryCities = newItinerary.cities.map((city) => {
            if (city.id === (itinerary_city_id || props?.city.id)) {
              const updatedCity = { ...city };
              updatedCity.day_by_day = [...city.day_by_day];
              updatedCity.day_by_day[dayIndex] = {
                ...city.day_by_day[dayIndex],
                slab_elements: [...city.day_by_day[dayIndex].slab_elements],
              };
              updatedCity.day_by_day[dayIndex].slab_elements.splice(
                slabIndex,
                1,
              );
              return updatedCity;
            }
            return city;
          });
          newItinerary.cities = itineraryCities;
        } else {
          // For activity deletion - remove from both day_by_day and activities
          const itineraryCities = newItinerary.cities.map((city) => {
            if (city.id === itinerary_city_id) {
              const updatedCity = { ...city };

              // Remove from day_by_day
              updatedCity.day_by_day = city.day_by_day.map((day) => ({
                ...day,
                slab_elements:
                  day.slab_elements?.filter(
                    (item) => item?.booking?.id !== element?.booking?.id,
                  ) || [],
              }));

              // Remove from activities list
              updatedCity.activities =
                city.activities?.filter(
                  (item) => item?.id !== element?.booking?.id,
                ) || [];

              return updatedCity;
            }
            return city;
          });
          newItinerary.cities = itineraryCities;
        }

        // Dispatch immediately without closing drawer
        dispatch(setItinerary(newItinerary));
        handleCloseMenue();

        dispatch(
          openNotification({
            type: "success",
            text: `${element.heading} has been removed from your itinerary`,
            heading: "Success!",
          }),
        );
      }
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
        }),
      );
    }
  };

  // Get activity icon based on element type
  const getActivityIcon = () => {
    if (element.element_type === "activity") {
      return "🎯"; // Activity icon
    } else if (
      element.element_type === "restaurant" ||
      element.heading?.toLowerCase().includes("restaurant")
    ) {
      return "🍽️"; // Restaurant icon
    } else if (element.element_type === "transfer") {
      return "✈️"; // Transfer icon
    }
    return "📍"; // Default POI icon
  };

  return (
    <div className="flex gap-3">
      {/* Icon with connector line */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
          {element.icon ? (
            <img
              src={imgUrlEndPoint + element.icon}
              alt={element.heading}
              className="w-8 h-8 rounded-full object-cover"
              onClick={() => handleItemClick(element)}
            />
          ) : (
            <span
              className="text-lg cursor-pointer"
              onClick={() => handleItemClick(element)}
            >
              {getActivityIcon()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4
              className="text-[14px] font-normal mb-1 cursor-pointer hover:text-[#0066CC]"
              onClick={() => handleItemClick(element)}
            >
              {element.heading}
            </h4>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E757A]">
              {/* Activity Type Badge */}
              {element.element_type === "activity" && element.booking?.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11.55 14C11.2467 14 10.9521 13.9772 10.6663 13.9317C10.3804 13.8862 10.1033 13.8179 9.835 13.7268L0 10.2268L0.35 9.25366L5.18 10.978L6.3875 7.93902L3.885 5.39512C3.57 5.07642 3.44458 4.69797 3.50875 4.25976C3.57292 3.82154 3.80333 3.48862 4.2 3.26098L6.6325 1.89512C6.83083 1.7813 7.03208 1.71585 7.23625 1.69878C7.44042 1.68171 7.64167 1.71301 7.84 1.79268C8.03833 1.86098 8.21042 1.96911 8.35625 2.11707C8.50208 2.26504 8.61 2.44146 8.68 2.64634L8.9075 3.38049C9.05917 3.86992 9.30708 4.30244 9.65125 4.67805C9.99542 5.05366 10.4067 5.33821 10.885 5.53171L11.2525 4.43902L12.25 4.74634L11.4625 7.10244C10.5992 6.96585 9.835 6.63577 9.17 6.1122C8.505 5.58862 8.015 4.93984 7.7 4.16585L5.9325 5.1561L8.05 7.5122L6.4925 11.439L8.6625 12.2073L10.1325 7.81951C10.2958 7.87642 10.4592 7.92764 10.6225 7.97317C10.7858 8.0187 10.955 8.05854 11.13 8.09268L9.6425 12.5659L10.185 12.7537C10.395 12.822 10.6138 12.876 10.8413 12.9159C11.0688 12.9557 11.305 12.9756 11.55 12.9756C11.8533 12.9756 12.1421 12.9472 12.4163 12.8902C12.6904 12.8333 12.9558 12.748 13.2125 12.6341L14 13.4024C13.6267 13.5959 13.2358 13.7439 12.8275 13.8463C12.4192 13.9488 11.9933 14 11.55 14ZM10.15 2.73171C9.765 2.73171 9.43542 2.59797 9.16125 2.33049C8.88708 2.06301 8.75 1.74146 8.75 1.36585C8.75 0.990244 8.88708 0.668699 9.16125 0.40122C9.43542 0.13374 9.765 0 10.15 0C10.535 0 10.8646 0.13374 11.1388 0.40122C11.4129 0.668699 11.55 0.990244 11.55 1.36585C11.55 1.74146 11.4129 2.06301 11.1388 2.33049C10.8646 2.59797 10.535 2.73171 10.15 2.73171Z"
                    fill="#ACACAC"
                  />
                </svg>
              )}

              {element.element_type !== "activity" && (
                <span className="text-[#6E757A] text-sm">
                  {element.element_type === "recommendation"
                    ? "Dinner"
                    : "Self Exploration"}
                </span>
              )}

              {element.element_type == "activity" &&
                (element.booking?.id ? (
                  <span className="text-[#6E757A] text-sm">Activity</span>
                ) : (
                  <span className="text-[#6E757A] text-sm">
                    Self Exploration
                  </span>
                ))}

              {/* Time */}
              {(element.start_time || element.end_time) && (
                <span className="text-[#6E757A] text-sm">
                  {" | "} {formatTime(element.start_time)}
                  {element.end_time && ` - ${formatTime(element.end_time)}`}
                </span>
              )}

              {/* Rating */}
              {element.rating && (
                <span className="flex items-center gap-1">
                  <span className="text-[#6E757A] text-sm">
                    {" | "} {element.rating}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8.701 5.6L7 0L5.299 5.6H0L4.326 8.687L2.681 14L7 10.717L11.326 14L9.681 8.687L14 5.6H8.701Z"
                      fill="#F7E700"
                    />
                  </svg>
                </span>
              )}

              {element.element_type === "activity" && element.booking?.id && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#5CBA66] text-white rounded-[40px] text-xs font-medium">
                  <span className="text-white">✓</span> Included
                </span>
              )}
            </div>
          </div>

          {/* Three dots menu */}
          <div className="flex-shrink-0">
            <IconButton
              size="small"
              id={`menu-button-${slabIndex}`}
              aria-controls={open ? `menu-${slabIndex}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ padding: "4px" }}
            >
              <FaEllipsis className="text-gray-600" />
            </IconButton>
            <Menu
              id={`menu-${slabIndex}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenue}
              disableScrollLock
              MenuListProps={{
                "aria-labelledby": `menu-button-${slabIndex}`,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {slabIndex > 0 && (
                <MenuItem onClick={() => handleMoveElement(slabIndex - 1)} className="text-[14px]">
                  Move Up
                </MenuItem>
              )}
              {slabIndex < totalElements - 1 && (
                <MenuItem onClick={() => handleMoveElement(slabIndex + 1)}>
                  Move Down
                </MenuItem>
              )}
              <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
