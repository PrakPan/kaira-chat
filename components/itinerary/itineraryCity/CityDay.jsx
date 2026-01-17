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

const SectionHeading = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
`;

import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import { MdOutlineDownhillSkiing } from "react-icons/md";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 767px)");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]);
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { trackActivityBookingAdd, trackActivityCardClicked } = useAnalytics();
  const transferBookings = useSelector(
    (state) => state.TransferBookings
  ).transferBookings;
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const dispatch = useDispatch();
  const {id} = useSelector(state=>state.auth);
  const {customer} = useSelector(state=>state.Itinerary)

  const router = useRouter();
  const { drawer, idx, itinerary_city_id, date } = router?.query;
  
  const handleAddActivity = () => {
    if(localStorage.getItem("access_token")){
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
      }
    );
  };

  useEffect(() => {
    let elements = [];
    for (let elem of props.day.slab_elements) {
      if (elem?.activity) {
        elements.push(elem);
      }
    }
    setElements(elements);
  }, [props.day?.slab_elements]);

  const matchingIntracityBookings = props?.intracityBookings?.filter(
    (booking) => {
      const checkIn = booking?.check_in?.split(" ")[0];
      const checkOut = booking?.check_out?.split(" ")[0];
      const allDates = getDatesInRange(checkIn, checkOut);

      const dayDate = new Date(props?.day?.date).toISOString().split("T")[0];
      return allDates.includes(dayDate);
    }
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
    }
  );console.log("Elements >>>",elements)

  return (
    <>
      {/* Day Row - Tabular Format */}
      <div className="flex border-b border-[#E8E8E8] hover:bg-[#FAFAFA] transition-colors">
        <div className="w-32 px-4 py-4 border-r border-[#E8E8E8] flex items-start">
          <span className="text-sm font-medium text-[#1A1A1A]">
            Day {props.index + 1}
          </span>
        </div>
        <div className="flex-1 px-4 py-3">
          {elements.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* First Activity */}
                <img 
                  src={elements[0]?.image_url || "/api/placeholder/40/40"} 
                  alt="activity"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-[#1A1A1A]">
                      {elements[0]?.name || elements[0]?.poi?.name}
                    </h4>
                    {elements[0]?.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#666666]">{elements[0]?.rating}</span>
                        <span className="text-yellow-500 text-xs">⭐</span>
                      </div>
                    )}
                    {elements[0]?.is_included && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                        $ Included
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {elements.length > 1 && (
                <button className="ml-2 px-3 py-1 text-xs font-medium text-[#666666] hover:bg-gray-100 rounded transition-colors">
                  +{elements.length - 1}
                </button>
              )}
            </div>
          ) : props?.isLastDay ? (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img
                  src="/checkout.png"
                  alt="checkout"
                  className="w-[40px] h-[27px] object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#1A1A1A]">Check out day</div>
                <div className="text-xs text-[#666666] mt-1">
                  This is your check out day in {props?.city?.name}, take a{" "}
                  {transferBookings?.intercity?.[
                    `${props?.city?.id}:${
                      props?.nextCity?.id ||
                      props?.nextCity?.gmaps_place_id
                    }`
                  ]?.booking_type || "transfer"}{" "}
                  to{" "}
                  {props?.nextCity?.city?.name ||
                    itineraryDaybyDay?.end_city?.name}
                  .
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#999999]">
              <MdOutlineDownhillSkiing size={18} />
              <span className="text-sm">No activity is added.</span>
            </div>
          )}
        </div>
      </div>

      {drawer === "showAddActivity" &&
        itinerary_city_id == props?.itinerary_city_id &&
        idx == props?.index && (
          <ActivityAddDrawer
            showDrawer={
              itinerary_city_id == props?.itinerary_city_id &&
              idx == props?.index
            }
            mercuryItinerary={props?.mercuryItinerary}
            setShowDrawer={setShowAddDrawer}
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
          />
        )}
    </>
  );
};

export default CityDay;