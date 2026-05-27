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
import PickupDropDrawer from "../../../containers/itinerary/PickupDropDrawer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import {
  updateTransferBookings,
  updateAirportTransferBooking,
} from "../../../store/actions/transferBookingsStore";
import SkeletonCard from "../../ui/SkeletonCard";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";
import HotelP1Detail from "../../modals/AccommodationDetailDrawer/HotelP1Detail";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import { useHandleClose } from "../../../hooks/useHandleClose";
import { useAnalytics } from "../../../hooks/useAnalytics";

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

/* Hotel trust-strip glyphs — green stroke icons (ported 1:1 from v4 HTML) */
const HotelTrustIcon = ({ type }) => {
  const common = {
    width: 11,
    height: 11,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (type === "clock") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...common}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (type === "refresh") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <polyline points="3 3 3 8 8 8" />
      </svg>
    );
  }
  // check (Verified)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...common}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

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

  const {
    trackActivityBookingAdd,
    trackHotelCardClicked,
    trackTaxiCardClicked,
    trackTaxiBookingAdd,
  } = useAnalytics();

  // Compute how many days precede this city so CityDay can show a continuous
  // day index. Intermediate cities have a checkout day whose date matches the
  // next city's first day — collapse those so the same date keeps the same
  // Day N label across the city boundary instead of incrementing.
  const dayOffset = (() => {
    const cities = itineraryDaybyDay?.cities || [];
    let offset = 0;
    for (let i = 0; i < props.index; i++) {
      const city = cities[i];
      const days = city?.day_by_day || [];
      offset += days.length || city?.duration || 0;
      const lastDate = days[days.length - 1]?.date;
      const nextFirstDate = cities[i + 1]?.day_by_day?.[0]?.date;
      if (lastDate && nextFirstDate && lastDate === nextFirstDate) {
        offset -= 1;
      }
    }
    return offset;
  })();

  const [images, setImages] = useState(null);

  const hasIntracityTransfer =
    Array.isArray(props?.intracityBookings) && props.intracityBookings.length > 0;

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
    oItineraryCity,
    dItineraryCity,
    drawerType,
    doj,
  } = router?.query;

  const handleDrawerClose = useHandleClose();
  const airportBookingsForCity = useSelector(
    (state) =>
      state?.TransferBookings?.transferBookings?.airport?.[props?.city?.id] ||
      [],
  );
  const airportBookingForChange = airportBookingsForCity.find(
    (b) => String(b?.id) === String(bookingId),
  );

  const handleAirportTransferChangeSubmit = async (transferData) => {
    if (!localStorage?.getItem("access_token")) {
      props?.setShowLoginModal?.(true);
      return;
    }
    try {
      const cityKey = props?.city?.id || props?.city?.gmaps_place_id;
      const bookingPayload = {
        transfer_type: "airport",
        source_itinerary_city: cityKey,
        destination_itinerary_city: null,
        is_pickup: transferData.transferType === "pickup",
        is_drop: transferData.transferType === "drop",
        source: transferData?.source,
        trace_id: transferData?.traceId,
        result_index: transferData?.selectedQuote?.result_index,
        booking_id: transferData?.booking_id,
      };
      const response = await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${currentItineraryId}/bookings/taxi/`,
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(updateAirportTransferBooking(`${cityKey}`, response.data));
        if (props?._updatePaymentHandler) props._updatePaymentHandler();
        if (props?.getPaymentHandler) props.getPaymentHandler();
        dispatch(
          openNotification({
            type: "success",
            text: `${transferData.transferType === "pickup" ? "Pickup" : "Drop"} transfer updated successfully`,
            heading: "Success!",
          }),
        );
      }
      handleDrawerClose();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong, please try again.";
      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        }),
      );
    }
  };

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
        pathname: window.location.pathname,
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
    if (localStorage?.getItem("access_token")) {
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
        pathname: window.location.pathname,
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
    ((hotels_status === "SUCCESS") || (hotels_status ==="FAILURE")) &&
    !!multiHotelStays?.[0]?.id;

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="rounded-[14px] flex flex-col w-full bg-[#FBFAF3] border border-[#ECECEC] overflow-hidden shadow-[0_1px_2px_rgba(11,18,32,0.04)]"
    >
      {/* ── Card header — editorial masthead ────────────────────────────── */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-[18px] pb-3.5 w-full border-b border-[#ECECEC] bg-[#FBFAF3]">
        {/*
          Row 1
          LEFT : duration eyebrow + city name (headline)
          RIGHT: [+ Activity] [+ Taxi]
        */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 flex items-baseline flex-wrap gap-x-2 gap-y-1">
            {/* City name — bold sans headline (matches v4 HTML .chapter-name) */}
            <h3 className="ttw-type-h6 font-medium text-[#0B1220] !text-[22px] tracking-[-0.025em] leading-[1] m-0 break-words">
              {props?.city?.city?.name}
            </h3>
            {props?.city?.duration === 0 ? (
              <span className="ttw-type-small text-[#8892A6]">Transit City</span>
            ) : props?.city?.duration > 0 ? (
              <span className="ttw-type-small text-[#000]">
                -  {props?.city?.duration} {props?.city?.duration > 1 ? "Nights" : "Night"}
              </span>
            ) : null}
          </div>

          {!(itineraryDaybyDay.status == "Draft") ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  trackActivityBookingAdd?.(
                    currentItineraryId,
                    "city_header",
                  );
                  setShowActivityDrawer(true);
                  router.push(
                    {
                      pathname: window.location.pathname,
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
                className="flex h-7 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] border border-black ttw-type-small whitespace-nowrap"
              >
                <PlusCircleIcon id="act_ic" />
                Activity
              </button>
              <button
                onClick={() => {
                  trackTaxiCardClicked?.(
                    currentItineraryId,
                    "",
                    "city_header_add_taxi",
                  );
                  trackTaxiBookingAdd?.(
                    currentItineraryId,
                    "",
                    "city_header_add_taxi",
                  );
                  router.push(
                    {
                      pathname: window.location.pathname,
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
                className="flex h-7 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] border border-black ttw-type-small whitespace-nowrap"
              >
                <PlusCircleIcon id="taxi_ic" />
                Taxi
              </button>
            </div>
          ) : null}
        </div>

        {/*
          Hotel section — ported from v4 HTML .hotel-block.
          One white bordered card per stay; data comes from the Stays redux
          slice (multiHotelStays). "View room" opens the hotel detail, "Change
          hotel" opens the change drawer (p2) or messages the bot (Draft/p1).
        */}
        {hotels_status === "PENDING" ? (
          <div className="mt-3 rounded-[14px] border border-[#ECECEC] bg-white p-4 flex items-center gap-3 animate-pulse">
            <SkeletonCard width="40px" height="40px" borderRadius="10px" variant="default" />
            <div className="flex flex-col gap-2">
              <SkeletonCard width="160px" height="14px" borderRadius="6px" variant="default" />
              <SkeletonCard width="110px" height="12px" borderRadius="6px" variant="default" />
            </div>
          </div>
        ) : hotelExists ? (
          multiHotelStays.map((hotel) => {
            const isDraftStage = itineraryDaybyDay.status === "Draft";
            const ratingValue = hotel?.rating || hotel?.star_category;
            const roomName = hotel?.room_name || hotel?.room_type || hotel?.room;

            const openHotelDetail = () => {
              trackHotelCardClicked?.(
                currentItineraryId,
                hotel.id,
                "city_header_view_room",
              );
              return isDraftStage
                ? handleDraftHotelClick(hotel.id)
                : fetchDetails(hotel.id);
            };

            const changeHotel = () => {
              if (!localStorage?.getItem("access_token")) {
                props?.setShowLoginModal(true);
                return;
              }
              if (isDraftStage) {
                trackHotelCardClicked?.(
                  currentItineraryId,
                  hotel.id || "",
                  "city_header_change_hotel_draft",
                );
                props?.onSendMessage?.(
                  `change hotel in ${props?.city?.city?.name}`,
                );
                return;
              }
              trackHotelCardClicked?.(
                currentItineraryId,
                hotel.id || "",
                "city_header_change_hotel",
              );
              router.push(
                {
                  pathname: window.location.pathname,
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
            };

            return (
              <div
                key={hotel.id}
                onClick={openHotelDetail}
                className="mt-3 rounded-[12px] border border-[#ECECEC] bg-white px-3.5 py-3.5 cursor-pointer transition-all duration-150 hover:!border-black hover:translate-x-[2px] shadow-none"
              >
                {/* Top row: icon + name/rating; Change Hotel top-right on desktop */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-[9px] bg-[#FFFDE7] grid place-items-center shrink-0 overflow-hidden text-[16px]">
                      {hotel?.image ? (
                        <img
                          src={hotel.image}
                          alt={hotel?.name || "Hotel"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span aria-hidden="true">🏨</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openHotelDetail();
                        }}
                        title={hotel?.name}
                        className="block text-left ttw-type-h6 text-[14px] tracking-[-0.01em] leading-[1.25] text-[#0c121e] break-words hover:underline"
                      >
                        {hotel?.name}
                      </button>
                      {(ratingValue || roomName) && (
                        <div className="flex items-center gap-1.5 flex-wrap text-[11.5px] text-[#4A566E] mt-0.5">
                          {ratingValue ? (
                            <span className="text-[#f5a623] font-semibold whitespace-nowrap">
                              ★ {ratingValue}
                            </span>
                          ) : null}
                          {ratingValue && roomName ? (
                            <span className="text-[#B8BECC]">·</span>
                          ) : null}
                          {roomName ? (
                            <span className="break-words">{roomName}</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Desktop — Change Hotel top-right */}
                  {isDesktop && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        changeHotel();
                      }}
                      className="flex h-7 shrink-0 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] underline ttw-type-small whitespace-nowrap"
                    >
                      <EditIcon />
                      Change Hotel
                    </button>
                  )}
                </div>

                {/* Trust strip */}
                <div className="flex gap-x-3 gap-y-1 flex-wrap pt-2.5 mt-3 border-t border-[#ECECEC]">
                  {[
                    { type: "check", label: "Verified" },
                    { type: "clock", label: "Live availability" },
                    // { type: "refresh", label: "Free cancel · 24h" },
                  ].map((t) => (
                    <span
                      key={t.label}
                      className="ttw-type-status !font-semibold text-[#4A566E] flex items-center gap-[5px]"
                    >
                      <span className="text-[#1F8A5A] flex items-center">
                        <HotelTrustIcon type={t.type} />
                      </span>
                      {t.label}
                    </span>
                  ))}
                </div>

                {/* Mobile — Change Hotel below the trust strip, right-aligned */}
                {!isDesktop && (
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        changeHotel();
                      }}
                      className="flex h-7 shrink-0 items-center justify-center gap-1 px-3.5 py-2 rounded-[8px] underline ttw-type-small whitespace-nowrap"
                    >
                      <EditIcon />
                      Change Hotel
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          !(itineraryDaybyDay.status == "Draft") && (
            <div className="mt-3 pt-3 border-t border-dashed border-[#E3DFCF]">
              <button
                className="text-[#0B1220] cursor-pointer ttw-type-body-strong hover:underline underline-offset-2 decoration-[#F7E700] decoration-2 whitespace-nowrap"
                onClick={(e) => {
                  trackHotelCardClicked?.(
                    currentItineraryId,
                    "",
                    "city_header_add_stay",
                  );
                  handleStay(e, "Add", props.city.city.name, "Add", null);
                }}
              >
                + Add Stay in {props?.city?.city?.name}
              </button>
            </div>
          )
        )}

        {/* Draft/p1: Change Transfer CTA — sends message to bot */}
        {itineraryDaybyDay.status == "Draft" &&
          hasIntracityTransfer && (
            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-dashed border-[#E3DFCF] min-w-0">
              <div className="ttw-type-body-strong text-[#0B1220]">Transfer</div>
              <button
                onClick={() =>
                  props?.onSendMessage?.(
                    `change transfer in ${props?.city?.city?.name}`,
                  )
                }
                className="flex items-center gap-[5px] shrink-0 bg-[#F4F1E6] hover:bg-[#EDE7D2] px-2.5 py-1.5 rounded-full text-[#0B1220] whitespace-nowrap ttw-type-label transition-colors"
              >
                <EditIcon />
                Change Transfer
              </button>
            </div>
          )}

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

      {/* Airport Pickup/Drop Booking Detail Drawer */}
      {drawer === "AirportTaxiDetail" &&
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
            isAirport={true}
            AirportTransferType={router?.query?.transferType}
          />
        )}

      {/* Airport Pickup/Drop Change/Search Drawer (opened from "Change" in detail) */}
      {drawer === "addPickupDrop" &&
        (String(oItineraryCity) === String(props?.city?.id) ||
          String(oItineraryCity) === String(props?.city?.gmaps_place_id)) &&
        (String(dItineraryCity) === String(props?.city?.id) ||
          String(dItineraryCity) === String(props?.city?.gmaps_place_id)) && (
          <PickupDropDrawer
            isOpen={true}
            onClose={handleDrawerClose}
            transferType={drawerType}
            bookingMode={"multicity"}
            originCityName={props?.city?.city?.name}
            destinationCityName={props?.city?.city?.name}
            origin_itinerary_city_id={
              props?.city?.id || props?.city?.gmaps_place_id
            }
            destination_itinerary_city_id={
              props?.city?.id || props?.city?.gmaps_place_id
            }
            originCityId={props?.city?.city?.id}
            destinationCityId={props?.city?.city?.id}
            booking_id={bookingId}
            doj={doj || airportBookingForChange?.check_in}
            trips={airportBookingForChange?.transfer_details?.trips}
            onSubmit={handleAirportTransferChangeSubmit}
            _updateFlightBookingHandler={props?._updateFlightBookingHandler}
            _updatePaymentHandler={props?._updatePaymentHandler}
            getPaymentHandler={props?.getPaymentHandler}
            setShowLoginModal={props?.setShowLoginModal}
          />
        )}


        {draftHotelDrawer.show && (
  <HotelP1Detail
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

      {/* Full-screen gallery for city / hotel thumbnail images (p1 city gallery and p1 hotel drawer) */}
      {images && images.length > 0 && (
        <FullScreenGallery
          mercury={false}
          closeGalleryHandler={() => setImages(null)}
          images={images}
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
          regionID={props?.city?.city?.region}
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
            intracityBookings={props?.intracityBookings}
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
