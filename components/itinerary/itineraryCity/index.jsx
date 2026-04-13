import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logEvent } from "../../../services/ga/Index";
import { toast } from "react-toastify";
import BackArrow from "../../ui/BackArrow";
import { openNotification } from "../../../store/actions/notification";
import FullScreenGallery from "../../fullscreengallery/Index";
import Skeleton from "../../modals/ViewHotelDetails/Skeleton";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import { bookingDetails } from "../../../services/bookings/FetchAccommodation";
import useMediaQuery from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import SkeletonCard from "../../ui/SkeletonCard";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";
import AccommodationDetailDrawer from "../../modals/AccommodationDetailDrawer";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";

const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 251;
  cursor: pointer;
`;

const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;
  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

/* ─── Reusable SVG sub-components ──────────────────────────────────────── */
const PlusCircleIcon = ({ id }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
  >
    <g clipPath={`url(#${id})`}>
      <path
        d="M13.2022 9.89942C13.2021 9.74474 13.1407 9.5964 13.0313 9.48703C12.9219 9.37765 12.7736 9.3162 12.6189 9.31617L10.4856 9.31618L10.4856 7.18284C10.4829 7.02991 10.4203 6.88414 10.3112 6.77693C10.2021 6.66972 10.0553 6.60964 9.90233 6.60964C9.74937 6.60964 9.60254 6.66972 9.49345 6.77693C9.38436 6.88414 9.32174 7.02991 9.31908 7.18284L9.31908 9.31618L7.18574 9.31618C7.03281 9.31884 6.88704 9.38146 6.77983 9.49055C6.67262 9.59964 6.61254 9.74647 6.61254 9.89942C6.61254 10.0524 6.67262 10.1992 6.77983 10.3083C6.88704 10.4174 7.03281 10.48 7.18574 10.4827L9.31908 10.4827L9.31908 12.616C9.32174 12.7689 9.38435 12.9147 9.49344 13.0219C9.60253 13.1291 9.74937 13.1892 9.90232 13.1892C10.0553 13.1892 10.2021 13.1291 10.3112 13.0219C10.4203 12.9147 10.4829 12.7689 10.4856 12.616L10.4856 10.4827L12.6189 10.4827C12.7736 10.4826 12.9219 10.4212 13.0313 10.3118C13.1407 10.2024 13.2021 10.0541 13.2022 9.89942Z"
        fill="#07213A"
      />
      <path
        d="M14.8492 4.94975C13.8703 3.97078 12.623 3.3041 11.2651 3.034C9.90726 2.7639 8.4998 2.90253 7.22071 3.43234C5.94163 3.96215 4.84838 4.85936 4.07921 6.01051C3.31004 7.16165 2.8995 8.51503 2.8995 9.8995C2.8995 11.284 3.31004 12.6373 4.07921 13.7885C4.84838 14.9396 5.94163 15.8368 7.22071 16.3667C8.4998 16.8965 9.90726 17.0351 11.2651 16.765C12.623 16.4949 13.8703 15.8282 14.8492 14.8492C16.1601 13.5355 16.8964 11.7554 16.8964 9.8995C16.8964 8.0436 16.1601 6.26349 14.8492 4.94975ZM5.77471 14.0243C4.9589 13.2085 4.40333 12.1691 4.17825 11.0375C3.95317 9.90597 4.06869 8.73308 4.5102 7.66718C4.95171 6.60128 5.69938 5.69023 6.65867 5.04926C7.61796 4.40828 8.74577 4.06616 9.8995 4.06616C11.0532 4.06616 12.181 4.40828 13.1403 5.04926C14.0996 5.69023 14.8473 6.60128 15.2888 7.66718C15.7303 8.73308 15.8458 9.90597 15.6207 11.0375C15.3957 12.1691 14.8401 13.2085 14.0243 14.0243C12.9295 15.1167 11.4461 15.7302 9.8995 15.7302C8.35292 15.7302 6.8695 15.1167 5.77471 14.0243Z"
        fill="#07213A"
      />
    </g>
    <defs>
      <clipPath id={id}>
        <rect
          width="14"
          height="14"
          fill="white"
          transform="translate(9.8995) rotate(45)"
        />
      </clipPath>
    </defs>
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
  >
    <path
      d="M6.30562 1.04912C6.45928 0.737826 6.53611 0.582179 6.64041 0.53245C6.73115 0.489183 6.83658 0.489183 6.92732 0.53245C7.03162 0.582179 7.10845 0.737826 7.26211 1.04912L8.71989 4.00243C8.76526 4.09433 8.78794 4.14028 8.82109 4.17596C8.85044 4.20755 8.88563 4.23314 8.92473 4.25132C8.96889 4.27186 9.01959 4.27927 9.121 4.29409L12.3818 4.77071C12.7252 4.8209 12.8969 4.846 12.9764 4.92987C13.0455 5.00284 13.078 5.10311 13.0649 5.20276C13.0497 5.31729 12.9254 5.43836 12.6768 5.6805L10.3182 7.97785C10.2446 8.04947 10.2079 8.08528 10.1841 8.12788C10.1631 8.16561 10.1497 8.20705 10.1445 8.24991C10.1386 8.29832 10.1473 8.3489 10.1646 8.45007L10.7212 11.695C10.7799 12.0372 10.8092 12.2084 10.7541 12.3099C10.7061 12.3983 10.6208 12.4602 10.5219 12.4786C10.4083 12.4996 10.2546 12.4188 9.94726 12.2572L7.03211 10.7241C6.94128 10.6764 6.89586 10.6525 6.84802 10.6431C6.80565 10.6348 6.76208 10.6348 6.71972 10.6431C6.67187 10.6525 6.62645 10.6764 6.53562 10.7241L3.62047 12.2572C3.31313 12.4188 3.15946 12.4996 3.04584 12.4786C2.94698 12.4602 2.86167 12.3983 2.81368 12.3099C2.75852 12.2084 2.78787 12.0372 2.84657 11.695L3.40311 8.45007C3.42046 8.3489 3.42914 8.29832 3.42327 8.24991C3.41807 8.20705 3.4046 8.16561 3.38359 8.12788C3.35987 8.08528 3.32311 8.04947 3.24958 7.97785L0.890894 5.68049C0.642296 5.43836 0.517997 5.31729 0.502872 5.20276C0.489712 5.10311 0.522223 5.00284 0.591355 4.92987C0.670811 4.846 0.842502 4.8209 1.18588 4.77071L4.44673 4.29409C4.54814 4.27927 4.59884 4.27186 4.643 4.25132C4.6821 4.23314 4.7173 4.20755 4.74664 4.17596C4.77979 4.14028 4.80247 4.09433 4.84784 4.00243L6.30562 1.04912Z"
      fill="#F7E700"
      stroke="#C1A51B"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M9.917 1.75L12.25 4.083M1.75 12.25l.583-2.333 7-7 2.334 2.333-7 7-2.917.583z"
      stroke="#111827"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Main component ────────────────────────────────────────────────────── */
const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus,
  );

  const [dayByDay, setDayByDay] = useState(null);
  const [dayByDayIndex, setDayByDayIndex] = useState(0);

  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [taxiLoading, setTaxiLoading] = useState(false);

  const transferBookings = useSelector(
    (state) => state.TransferBookings,
  ).transferBookings;

  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.Itinerary);
  const reduxItineraryId = useSelector((state) => state.ItineraryId);
  const currentItineraryId = router.query.id || reduxItineraryId;

  // Compute how many days precede this city so CityDay can show a continuous day index
  const dayOffset = (itineraryDaybyDay?.cities || [])
    .slice(0, props.index)
    .reduce((sum, c) => sum + (c.day_by_day?.length || c.duration || 0), 0);

  const [images, setImages] = useState(null);

  const {
    drawer,
    poi_id,
    type,
    dayIndex,
    index,
    itinerary_city_id,
    idx,
    date,
    bookingId,
    city_id,
  } = router?.query;

  const [draftHotelDrawer, setDraftHotelDrawer] = useState({ show: false, id: null });
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  const handleDraftHotelClick = (hotelId) => {
  if (!localStorage?.getItem("access_token")) { props?.setShowLoginModal(true); return; }
  setDraftHotelDrawer({ show: true, id: hotelId });
};

  const multiHotelStays =
    props.cityHotels ||
    stay?.filter((hotel) => {
      return hotel?.itinerary_city_id === props?.itinerary_city_id;
    });

  const multiHotelDuration =
    props.totalDuration ||
    multiHotelStays?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.duration,
      0,
    ) ||
    0;

  const _setImagesHandler = (images) => {
    setImages(images);
  };

  useEffect(() => {
    let dayByDayArray = [];
    var idx = 0;
    for (const daybyday of props.city.day_by_day) {
      for (const element of daybyday?.slab_elements) {
        element.dayIndex = idx;
        dayByDayArray.push(element);
      }
      idx += 1;
    }
    setDayByDay(dayByDayArray);
  }, [props.city]);

  useEffect(() => {
    if (
      drawer === "showPoiDetail" &&
      poi_id &&
      dayByDay &&
      dayByDay.length > 0 &&
      String(itinerary_city_id) === String(props.city.id)
    ) {
      const foundIndex = dayByDay.findIndex((item) => {
        if (item?.booking?.id) {
          return String(item.booking.id) === String(poi_id);
        }
        return (
          String(item?.poi) === String(poi_id) ||
          String(item?.activity) === String(poi_id)
        );
      });
      if (foundIndex !== -1) {
        setDayByDayIndex(foundIndex);
      }
    }
  }, [drawer, poi_id, dayByDay, itinerary_city_id, props.city.id]);

  const fetchDetails = async (hotelId = null) => {
    if (!localStorage?.getItem("access_token")) {
      props?.setShowLoginModal(true);
      return;
    }
    setShowDetails(true);
    setLoading(true);
    const targetHotelId =
      hotelId || stay?.[props?.index]?.id || multiHotelStays?.[0]?.id;
    router.push(
      {
        pathname: router.asPath.split("?")[0],
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "showHotelDetail",
          idx: props?.index,
          booking_id: targetHotelId,
          city_id: props?.city?.city?.id,
        },
      },
      undefined,
      { scroll: false },
    );
    setLoading(false);
  };

  const handleStay = (e, label, value, clickType, hotelId) => {
    e.stopPropagation();
    if (!localStorage?.getItem("access_token")) {
      const index = multiHotelStays.findIndex((h) => h?.id === hotelId);
      props?.handleClickAc(
        index !== -1 ? index : props?.index,
        props?.city,
        props?.city?.city?.id,
        props?.city?.id,
        clickType,
      );
    } else props?.setShowLoginModal(true);

    logEvent({
      action: "Hotel_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    router.push(
      {
        pathname: router.asPath.split("?")[0],
        query: {},
      },
      undefined,
      { scroll: false },
    );
  };

  useEffect(() => {
    if (props.index === 0) {
      setViewMore(true);
    }
  }, []);

  // Close activity drawer when URL back-navigation removes the drawer query
  useEffect(() => {
    if (showActivityDrawer && drawer !== "activity") {
      setShowActivityDrawer(false);
    }
  }, [drawer]);

  const handleDeleteTaxi = async (val) => {
    if (!localStorage?.getItem("access_token")) {
      props?.setShowLoginModal(true);
      return;
    }
    const dataPassed = val != null ? val : taxiData;
    try {
      setTaxiLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/${
          dataPassed?.booking_type?.includes(",")
            ? `combo`
            : dataPassed?.booking_type?.toLowerCase()
        }/${dataPassed?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      if (response.status === 204) {
        dispatch(updateTransferBookings(dataPassed?.id));
        setTaxiLoading(false);
        props?.getPaymentHandler();
        setHandleShowTaxi(false);
        handleCloseDrawer();
        dispatch(
          openNotification({
            type: "success",
            text: `Taxi deleted successfully`,
            heading: "Success!",
          }),
        );
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errors?.[0]?.message?.[0] ||
        err.response?.data?.errors[0]?.detail ||
        err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        }),
      );
      setTaxiLoading(false);
    }
  };

  const activityData = {
    id: poi_id,
    type: type,
    dayIndex: dayIndex,
    index: index,
  };

  // Derived: hotel row is visible
  const hotelExists =
    multiHotelStays &&
    multiHotelStays.length > 0 &&
    hotels_status === "SUCCESS" &&
    !!multiHotelStays?.[0]?.id;

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="rounded-lg flex flex-col w-full bg-white border-[0.5px] border-[#e5e5e5]"
    >
      {/* ── Card header ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 w-full border-b border-[#EBEBEB] font-inter">
        {/*
          Row 1
          LEFT : City name (bold, truncated)
          RIGHT: [+ Activity] [+ Taxi] — always aligned to city name baseline
        */}
        <div className="flex items-center justify-between gap-3">
          <div className="md:text-[18px] text-[16px] font-semibold leading-snug min-w-0 flex items-center gap-1 overflow-hidden">
            <span className="truncate">{props?.city?.city?.name}</span>
            {props?.city?.duration === 0 ? (
              <span className="shrink-0"> (Transit City)</span>
            ) : props?.city?.duration > 0 ? (
              <>
                <span className="max-ph:hidden md:inline shrink-0 md:text-[18px] text-[16px] font-semibold leading-snug"> - {props?.city?.duration} {props?.city?.duration > 1 ? "Nights" : "Night"}</span>
                <span className="md:hidden shrink-0 md:text-[18px] text-[16px] font-semibold leading-snug"> - {props?.city?.duration}N</span>
              </>
            ) : null}
          </div>

          {!(itineraryDaybyDay.status == "Draft") && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowActivityDrawer(true);
                  router.push(
                    {
                      pathname: router.asPath.split("?")[0],
                      query: {
                        ...(currentItineraryId ? { id: currentItineraryId } : {}),
                        drawer: "activity",
                        itinerary_city_id: props?.city?.id,
                        city_id: props?.city?.city?.id,
                      },
                    },
                    undefined,
                    { scroll: false },
                  );
                }}
                className="flex h-7 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] border border-black text-[13px] whitespace-nowrap"
              >
                <PlusCircleIcon id="act_ic" />
                Activity
              </button>
              <button
                onClick={() => {
                  router.push(
                    {
                      pathname: router.asPath.split("?")[0],
                      query: {
                        ...(currentItineraryId ? { id: currentItineraryId } : {}),
                        drawer: "addCityTaxi",
                        itinerary_city_id: props?.city?.id,
                      },
                    },
                    undefined,
                    { scroll: false },
                  );
                }}
                className="flex h-7 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] border border-black text-[13px] whitespace-nowrap"
              >
                <PlusCircleIcon id="taxi_ic" />
                Taxi
              </button>
            </div>
          )}
        </div>

        {/*
          Row 2
          LEFT : Hotel name (truncated) • X Days, Y Night • rating ★
          RIGHT: ✏ Change Hotel — aligned to the same row as hotel info
        */}
        <div className="flex items-center justify-between gap-3 mt-1 min-w-0">
          {/* Left side */}
          <div className="flex items-center min-w-0 flex-1 overflow-hidden">
            {hotels_status === "PENDING" ? (
              <div className="flex items-center gap-2 animate-pulse">
                <SkeletonCard
                  width="110px"
                  height="14px"
                  borderRadius="6px"
                  variant="default"
                />
                <SkeletonCard
                  width="80px"
                  height="14px"
                  borderRadius="6px"
                  variant="default"
                />
                <SkeletonCard
                  width="36px"
                  height="14px"
                  borderRadius="6px"
                  variant="default"
                />
              </div>
            ) : hotelExists ? (
              <div className="flex flex-col gap-1 min-w-0 w-full">
                {multiHotelStays.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center gap-1 text-[14px] text-[#111827] min-w-0"
                  >
                    {/* Hotel name — truncated, full name on title tooltip */}
                    <span
                      className="underline cursor-pointer truncate shrink min-w-0 max-w-[130px] md:max-w-[200px]"
                     onClick={() =>
  itineraryDaybyDay.status === "Draft"
    ? handleDraftHotelClick(hotel.id)
    : fetchDetails(hotel.id)
}
                      title={hotel?.name}
                    >
                      {hotel?.name}
                    </span>

                    {/* Rating + star */}
                    {hotel?.rating && hotel?.rating !== 0 ? (
                      <>
                        <span className="text-[#6B7280] shrink-0">•</span>
                        <span className="font-[500] shrink-0">
                          {hotel.rating}
                        </span>
                        <StarIcon />
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              !(itineraryDaybyDay.status == "Draft") && (
                <button
                  className="text-blue cursor-pointer text-[14px] font-medium hover:underline whitespace-nowrap"
                  onClick={(e) =>
                    handleStay(e, "Add", props.city.city.name, "Add", null)
                  }
                >
                  + Add Stay in {props?.city?.city?.name}
                </button>
              )
            )}
          </div>

          {/* Right side: Change Hotel — only when hotel row is visible */}
          {hotelExists && !(itineraryDaybyDay.status == "Draft") && (
            <button
              onClick={() => {
                router.push(
                  {
                    pathname: router.asPath.split("?")[0],
                    query: {
                      ...(currentItineraryId ? { id: currentItineraryId } : {}),
                      drawer: "changeHotelBooking",
                      itinerary_city_id: props?.city?.id,
                      city_id: props?.city?.city?.id,
                    },
                  },
                  undefined,
                  { scroll: false },
                );
                props?.handleClickAc?.(
                  props?.index,
                  props?.city,
                  props?.city?.city?.id,
                  props?.city?.id,
                  "Change",
                );
              }}
              className="flex items-center gap-[5px] shrink-0 bg-[#fafafa] px-2 py-1.5 rounded-[8px] font-medium text-[#111827] hover:underline whitespace-nowrap text-[13px]"
            >
              <EditIcon />
              Change Hotel
            </button>
          )}
        </div>
      </div>
      {/* ── End header ──────────────────────────────────────────────────── */}

      {viewMore ? (
        <>
          <CityDaybyDay
            mercuryItinerary={props?.mercuryItinerary}
            city={props.city}
            dayOffset={dayOffset}
            setItinerary={props?.setItinerary}
            setShowLoginModal={props?.setShowLoginModal}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
            intracityBookings={props?.intracityBookings}
            nextCity={props?.nextCity}
            setShowCityDrawer={props?.setShowCityDrawer}
            isDraft={props?.isDraft}
          />
        </>
      ) : (
        <CitySummary
          city={props.city}
          setViewMore={setViewMore}
          activityBookings={props?.activityBookings}
          setActivityBookings={props?.setActivityBookings}
          setItinerary={props?.setItinerary}
          setShowLoginModal={props?.setShowLoginModal}
          index={props?.index}
          intracityBookings={props?.intracityBookings}
          _updateFlightBookingHandler={props?._updateFlightBookingHandler}
          _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
          _updatePaymentHandler={props?._updatePaymentHandler}
          getPaymentHandler={props?.getPaymentHandler}
          nextCity={props?.nextCity}
        />
      )}

      {/* POI Details Drawer */}
      {drawer === "showPoiDetail" &&
        String(itinerary_city_id) === String(props.city.id) &&
        dayByDay &&
        dayByDay.length > 0 &&
        dayByDay[dayByDayIndex] && (
          <POIDetailsDrawer
            itineraryDrawer
            show={true}
            handleCloseDrawer={handleCloseDrawer}
            slabIndex={dayByDayIndex}
            iconId={
              dayByDay[dayByDayIndex]?.booking?.id ||
              dayByDay[dayByDayIndex]?.poi ||
              dayByDay[dayByDayIndex]?.activity
            }
            name={dayByDay[dayByDayIndex]?.heading}
            image={dayByDay[dayByDayIndex]?.icon}
            text={dayByDay[dayByDayIndex]?.text}
            Topheading={"Select Our Point Of Interest"}
            activityData={activityData}
            showBookingDetail={true}
            setShowLoginModal={props?.setShowLoginModal}
            dayIndex={dayIndex}
            itinerary_city_id={props.city.id}
            cityID={props.city.city.id}
            cityName={props.city.city.name}
            removeDelete={false}
          />
        )}

      {/* Sightseeing/Taxi Drawer */}
      {drawer === "SightSeeing" &&
        String(itinerary_city_id) === String(props.city.id) &&
        bookingId && (
          <TransferDrawer
            show={true}
            setHandleShow={setHandleShowTaxi}
            bookingData={taxiData}
            booking_type={"Taxi"}
            booking_id={bookingId}
            loading={taxiLoading}
            handleDelete={handleDeleteTaxi}
            origin_itinerary_city_id={
              props?.city?.id || props?.city?.gmaps_place_id
            }
            destination_itinerary_city_id={
              props?.city?.id || props?.city?.gmaps_place_id
            }
            itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
            setShowDrawer={setHandleShowTaxi}
            _updateFlightBookingHandler={props?._updateFlightBookingHandler}
            _updatePaymentHandler={props?._updatePaymentHandler}
            getPaymentHandler={props?.getPaymentHandler}
            setShowLoginModal={props?.setShowLoginModal}
            setError={props?.setError}
            isIntracity={true}
            isSightseeing={true}
          />
        )}


        {draftHotelDrawer.show && (
  <AccommodationDetailDrawer
    show={draftHotelDrawer.show}
    onHide={() => setDraftHotelDrawer({ show: false, id: null })}
    accommodationId={draftHotelDrawer.id}
    onChangeHotel={() => {
      setDraftHotelDrawer({ show: false, id: null });
      props?.handleClickAc(props?.index, props?.city, props?.city?.city?.id, props?.city?.id, "Change");
    }}
    setShowLoginModal={props?.setShowLoginModal}
    _setImagesHandler={_setImagesHandler}
  />
)}

      {/* Activity Add Drawer */}
      {showActivityDrawer && (
        <ActivityAddDrawer
          showDrawer={showActivityDrawer}
          setShowDrawer={(val) => {
            setShowActivityDrawer(val);
            if (!val) handleCloseDrawer();
          }}
          cityName={props?.city?.city?.name}
          cityID={props?.city?.city?.id}
          date={props?.city?.day_by_day?.[0]?.date}
          start_date={props?.city?.start_date || props?.city?.day_by_day?.[0]?.date}
          duration={props?.city?.duration}
          itinerary_city_id={props?.city?.id}
          mercuryItinerary={props?.mercuryItinerary}
          itinerary_id={router?.query?.id}
          day_slab_index={0}
          getPaymentHandler={props?.getPaymentHandler}
          getAccommodationAndActivitiesHandler={props?.getAccommodationAndActivitiesHandler}
          setShowLoginModal={props?.setShowLoginModal}
          setItinerary={props?.setItinerary}
          _GetInTouch={props?._GetInTouch}
        />
      )}

      {/* Add City Taxi / Sightseeing Drawer */}
      {drawer === "addCityTaxi" &&
        String(itinerary_city_id) === String(props?.city?.id) && (
          <TransferEditDrawer
            mercury
            isMercury
            showDrawer={true}
            drawerType="multicity"
            booking_type="multicity"
            origin_itinerary_city_id={props?.city?.id}
            destination_itinerary_city_id={props?.city?.id}
            originCityId={props?.city?.city?.id}
            destinationCityId={props?.city?.city?.id}
            city={props?.city?.city?.name}
            dcity={props?.city?.city?.name}
            oCityData={props?.city}
            dCityData={props?.city}
            getPaymentHandler={props?.getPaymentHandler}
            _updatePaymentHandler={props?._updatePaymentHandler}
            _updateFlightBookingHandler={props?._updateFlightBookingHandler}
            _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
            setShowLoginModal={props?.setShowLoginModal}
            _GetInTouch={props?._GetInTouch}
          />
        )}
    </div>
  );
};

export default ItineraryCity;
