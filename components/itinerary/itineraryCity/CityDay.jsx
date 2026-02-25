import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useDispatch, useSelector } from "react-redux";
import { BsPeopleFill } from "react-icons/bs";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { FaEdit } from "react-icons/fa";
import ImageLoader from "../../ImageLoader";
import { useRouter } from "next/router";
import styled from "styled-components";
import Image from "next/image";
import { getHumanDateWithYearv2 } from "../../../services/getHumanDateV2";
import { getDate } from "../../../helper/ConvertDateFormat";
import { IoBagCheckOutline } from "react-icons/io5";


const SectionHeading = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  max-width: 410px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }
`;

import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import { MdOutlineDownhillSkiing } from "react-icons/md";
import SkeletonCard from "../../ui/SkeletonCard";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";
import { FaTaxi } from "react-icons/fa6";
import { it } from "date-fns/locale";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 767px)");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { trackActivityBookingAdd, trackActivityCardClicked } = useAnalytics();
  const transferBookings = useSelector(
    (state) => state.TransferBookings,
  ).transferBookings;
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.Itinerary);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showDrawer, setShowDrawer] = useState(false);

  const router = useRouter();
  const { drawer, idx, itinerary_city_id, date } = router?.query;

  const handleAddActivity = () => {
    if (localStorage.getItem("access_token")) {
      // if(id != customer){
      //   dispatch(setCloneItineraryDrawer(true));
      //   return;
      // }
    } else {
      props?.setShowLoginModal(true);
      return;
    }
    trackActivityBookingAdd(router.query.id, "day_by_day_collapse");
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.itinerary_city_id,
          idx: props?.index,
          date: props?.day?.date,
        },
      },
      undefined,
      {
        scroll: false,
      },
    );
  };

  const handleItemClick = (item) => {
    if (!item) return;

    // Determine the type and ID
    let itemType = "";
    let itemId = "";

    if (item?.activity) {
      itemType = "activity";
      itemId = item.booking.id;
    } else if (item?.poi) {
      itemType = "poi";
      itemId = item.poi;
    } else if (item?.restaurant) {
      itemType = "restaurant";
      itemId = item?.restaurant;
    }

    if (itemType && itemId) {
      trackActivityCardClicked(router.query.id, itemType);
      router.push(
        {
          pathname: `/itinerary/${router.query.id}`,
          query: {
            drawer: `showPoiDetail`,
            itinerary_city_id: props?.itinerary_city_id,
            poi_id: itemId,
            type: itemType,
          },
        },
        undefined,
        {
          scroll: false,
        },
      );
    }
  };

  const handleMoreItemsClick = () => {
    handleAddActivity();
  };

  useEffect(() => {
    // Collect all slab elements and prioritize activities
    let activities = [];
    let pois = [];
    let restaurants = [];
    let recommendations = [];

    for (let elem of props.day.slab_elements) {
      if (elem?.activity) {
        activities.push(elem);
      } else if (elem?.poi) {
        pois.push(elem);
      } else if (elem?.restaurant) {
        restaurants.push(elem);
      }
        else if (elem?.element_type == 'recommendation') {  
        recommendations.push(elem);
        }
    }

    // Prioritize: Activities first, then POIs, then Restaurants
    const allElements = [...activities, ...pois, ...restaurants, ...recommendations];
    setElements(allElements);

    // Show maximum 2 items
   setDisplayItems(allElements);
  }, [props.day?.slab_elements]);

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  const matchingIntracityBookings = props?.intracityBookings?.filter(
    (booking) => {
      const checkIn = booking?.check_in?.split(" ")[0];
      const checkOut = booking?.check_out?.split(" ")[0];
      const allDates = getDatesInRange(checkIn, checkOut);

      const dayDate = new Date(props?.day?.date).toISOString().split("T")[0];
      return allDates.includes(dayDate);
    },
  );

  const formattedTaxiDetails = matchingIntracityBookings?.map(
    (booking, index) => {
      const checkInDate = new Date(booking?.check_in);
      const checkOutDate = new Date(booking?.check_out);

      const formattedCheckIn = checkInDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      const formattedCheckOut = checkOutDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      return {
        ...booking,
        id: booking.id,
        currentDayLabel: `Day ${props.index + 1}, ${getDate(props?.day?.date)}`,
        fromLocation:
          booking.transfer_details?.source?.name || "Unknown Source",
        toLocation:
          booking.transfer_details?.destination?.name || "Unknown Destination",
        passengers:
          booking.number_of_adults +
          booking.number_of_children +
          booking.number_of_infants,
      };
    },
  );

  const getTotalCount = () => {
    return elements.length;
  };

  const getItemName = (item) => {
    return item?.heading || item?.name;
  };

  const getItemImage = (item) => {
    return imgUrlEndPoint + item?.icon;
  };

  const getItemRating = (item) => {
    return item?.rating;
  };

  // Format date as "17th Feb"
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };

  const renderActivityItem = (item, index, isSecondItem = false) => {
    const remainingCount = elements.length - 2;
    const itemName = getItemName(item);
    
    const handleMouseEnter = (e, itemKey) => {
      const element = e.currentTarget.querySelector("h4");
      // Check if text is truncated
      const isTruncated = element.scrollWidth > element.clientWidth;

      if (isTruncated) {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
        });
        setHoveredItem(itemKey);
      }
    };

   return item?.element_type === "recommendation" ? (
  // 🔮 Recommendation UI
  <div
    key={index}
    className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1"
  >
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 11 13" fill="none">
  <path d="M2.46801 12.0306C2.14424 12.1386 1.8099 11.8976 1.8099 11.5563V7.59375C1.8099 7.50113 1.78417 7.41033 1.73559 7.33147L0.0757254 4.63739C-0.0233917 4.47652 -0.0233509 4.27351 0.0758306 4.11267L2.46549 0.237556C2.55654 0.0899072 2.71761 0 2.89107 0H7.72872C7.90218 0 8.06326 0.0899073 8.15431 0.237556L10.544 4.11267C10.6431 4.27351 10.6432 4.47652 10.5441 4.63739L8.8842 7.33147C8.83562 7.41033 8.8099 7.50113 8.8099 7.59375V11.5563C8.8099 11.8976 8.47555 12.1386 8.15178 12.0306L5.46801 11.136C5.36538 11.1018 5.25442 11.1018 5.15178 11.136L2.46801 12.0306ZM2.97656 9.93891C2.97656 10.2798 3.31019 10.5207 3.63379 10.4135L5.15267 9.91041C5.25476 9.8766 5.36503 9.8766 5.46712 9.91041L6.98601 10.4135C7.3096 10.5207 7.64323 10.2798 7.64323 9.93891V9.25C7.64323 8.97386 7.41937 8.75 7.14323 8.75H3.47656C3.20042 8.75 2.97656 8.97386 2.97656 9.25V9.93891ZM3.54696 1.16667C3.37369 1.16667 3.21277 1.25637 3.12167 1.40376L1.44742 4.11209C1.34782 4.27321 1.34782 4.47679 1.44742 4.63791L3.12167 7.34624C3.21277 7.49363 3.37369 7.58333 3.54696 7.58333H7.07283C7.2461 7.58333 7.40702 7.49363 7.49813 7.34624L9.17237 4.63791C9.27197 4.47679 9.27197 4.27321 9.17237 4.11209L7.49813 1.40376C7.40702 1.25637 7.2461 1.16667 7.07283 1.16667H3.54696ZM5.0497 6.39822C4.85505 6.59373 4.53883 6.59464 4.34307 6.40025L2.98262 5.04938C2.78618 4.85433 2.78562 4.53678 2.98137 4.34103L3.10426 4.21814C3.29952 4.02287 3.6161 4.02287 3.81137 4.21814L4.3428 4.74957C4.53847 4.94524 4.85585 4.94477 5.05095 4.74852L6.81154 2.97751C7.00542 2.78249 7.32039 2.78063 7.51655 2.97335L7.63418 3.08892C7.83209 3.28336 7.83385 3.60175 7.63811 3.79836L5.0497 6.39822Z" fill="#AD5BE7"/>
</svg>
    </div>

    <div className="flex flex-col min-w-0  justify-center">
      <span className="text-xs text-[#07213A] font-medium">
        Recommendation:
      </span>

      <h4 className="text-sm text-[#111827] font-normal truncate mb-0 leading-4">
        {itemName}
      </h4>
       {item?.time && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-[#666666]">
            {item?.time}
          </span>
        </div>
      )}
    </div>
    
  </div>
) : (
  // 🖼 Normal Activity UI
  <div
    key={index}
    className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1"
  >
    <img
      src={getItemImage(item)}
      alt="activity"
      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
    />

    <div className="flex flex-col items-start justify-center gap-1 md:gap-1 min-w-0 flex-1">
      <div className="flex items-center gap-2 w-full">
        <TooltipWrapper
          onMouseEnter={(e) => handleMouseEnter(e, `${index}-${itemName}`)}
          onMouseLeave={() => setHoveredItem(null)}
          className="flex-1 min-w-0"
        >
          <h4
            className="text-xs md:text-sm text-[#000] !font-normal truncate mb-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-[#0066CC]"
            onClick={() => handleItemClick(item)}
          >
            {itemName}
          </h4>
        </TooltipWrapper>
      </div>

      {item?.time && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-[#666666]">
            {item?.time}
          </span>
        </div>
      )}
    </div>
  </div>
);
  };

  return (
    <>
      {/* Day Row - Tabular Format */}
      <div className="flex border-b border-[#E8E8E8] hover:bg-[#FAFAFA] transition-colors">
        <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start">
          <span className="text-xs md:text-sm text-[#000]">
            {formatDateLabel(props?.day?.date)}
          </span>
        </div>
        <div className="flex-1 px-2 md:px-4 py-2 md:py-3 min-w-0">
          {elements.length > 0 ? (
  <div className="flex flex-col gap-2">
    {displayItems.map((item, index) => renderActivityItem(item, index, false))}
  </div>
)  : props?.isLastDay ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex-shrink-0">
                <IoBagCheckOutline className="w-[30px] md:w-[40px] h-[20px] md:h-[27px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm  mt-1">
                  Check out from {props?.city?.name}
                  {/* This is your check out day in {props?.city?.name}, take a{" "}
                  {transferBookings?.intercity?.[
                    `${props?.city?.id}:${
                      props?.nextCity?.id ||
                      props?.nextCity?.gmaps_place_id
                    }`
                  ]?.booking_type || "transfer"}{" "}
                  to{" "}
                  {props?.nextCity?.city?.name ||
                    itineraryDaybyDay?.end_city?.name}
                  . */}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MdOutlineDownhillSkiing
                size={16}
                className="w-[30px] md:w-[40px] h-[20px] md:h-[27px]"
              />
              <span className="text-xs md:text-sm">No activity is added.</span>
            </div>
          )}
        </div>
      </div>

      {drawer === "showAddActivity" &&
        itinerary_city_id == props?.itinerary_city_id &&
        idx == props?.index && !props?.isInDrawer && (
          <ActivityAddDrawer
            showDrawer={
              itinerary_city_id == props?.itinerary_city_id &&
              idx == props?.index
            }
            mercuryItinerary={props?.mercuryItinerary}
            setShowDrawer={setShowDrawer}
            cityName={props.city.name}
            cityID={props.city.id}
            date={date}
            setItinerary={props?.setItinerary}
            itinerary_city_id={props?.itinerary_city_id}
            day={`Day ${idx + 1}`}
            duration={props.duration}
            start_date={props?.start_date}
            day_slab_index={idx}
            setShowLoginModal={props?.setShowLoginModal}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
            setShowSettings={props?.setShowSettings}
          ></ActivityAddDrawer>
        )}
    </>
  );
};

export default CityDay;
