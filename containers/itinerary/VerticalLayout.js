import styled from "styled-components";
import React, { use, useEffect, useRef } from "react";
import Pin from "../newitinerary/breif/route/Pin";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useState } from "react";
import { useRouter } from "next/router";
import { axiosDeleteBooking } from "../../services/itinerary/bookings";
import { getTransferBookingPath } from "../../helper/transferBookingPath";
import {
  getModeAccent,
  resolveModeKey,
} from "../../components/revamp/common/components/bookingDetail/modeAccent";
import {
  updateAirportTransferBooking,
  updateTransferBookings,
} from "../../store/actions/transferBookingsStore";
import { useDispatch, useSelector } from "react-redux";
import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
import TransferSkeleton from "../../components/itinerary/Skeleton/TransferSkeleton";
import { openNotification } from "../../store/actions/notification";
import { RiArrowDropRightLine } from "react-icons/ri";
import TransferDrawer from "./TransferDrawer";
import { LuInfo } from "react-icons/lu";
import TransferPickupDropButton from "./TransferPickupDropButton";
import PickupDropDrawer from "./PickupDropDrawer";
import { useHandleClose } from "../../hooks/useHandleClose";
import { useAnalytics } from "../../hooks/useAnalytics";
import useMediaQuery from "../../components/media";
import { setCloneItineraryDrawer } from "../../store/actions/cloneItinerary";

// Transfer links adopt the CityDay slab-element heading styling (the activity
// title: Inter, tight tracking/leading). Color stays on each link's existing
// utility class (text-blue), and font size/weight stay on their existing
// classes too, so they keep their current scale and link color.
const TRANSFER_LINK_FONT = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  letterSpacing: "0",
  lineHeight: 1.1,
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VerticalLine = styled.div`
  width: 2px;
  height: ${(props) => props.height || "40px"};
  background: ${(props) =>
    props.gradient === "top"
      ? "linear-gradient(to bottom, #DDDDDD, transparent)"
      : "linear-gradient(to top, #DDDDDD, transparent)"};
  background-size: 10px 10px;
`;

const PinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Small inline loader shown in the pickup/drop transfer row while the city's
// airport transfers are being repriced (transfers/pricing status PENDING). The
// backend deletes the old airport bookings and recreates them asynchronously,
// so without this the row would just vanish until the new bookings arrive.
const PickupDropLoader = () => (
  <div className="flex items-center gap-2 mt-1">
    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
    <span className="text-[13px] text-[#a5a5a5]">Updating transfers…</span>
  </div>
);

// P1 (Draft) stage loader for the transfer row. The existing TransferSkeleton
// is sized for the finalized layout (fixed 200px text bar + margins) and
// overflows the narrower draft column, breaking the layout — so the draft
// stage gets its own compact shimmer that mirrors the draft transfer row
// (icon dot + city line + duration line). It is replaced by the real transfer
// the moment the draft surfaces a city/booking for the leg.
const P1TransferLoader = () => (
  <div className="flex gap-2 mt-2 animate-pulse">
    <div className="w-[18px] h-[18px] rounded-full bg-gray-200 flex-shrink-0 mt-[2px]" />
    <div className="flex flex-col gap-2">
      <div className="w-[140px] h-[14px] rounded bg-gray-200" />
      <div className="w-[90px] h-[10px] rounded bg-gray-200" />
    </div>
  </div>
);

// Modes that leave the traveller at a hub they need a taxi to or from, so only
// these can carry a pickup/drop. A combo transfer names itself after every leg
// it bundles, comma-joined ("Train,Taxi"), so the legs are matched one by one —
// comparing the whole string reads a train that ends in a taxi as neither.
const HUB_MODES = ["flight", "train", "ferry", "bus"];

// Every mode a transfer travels, normalised. A combo says so twice — in its own
// comma-joined name and in its legs — but either can arrive empty, so both are
// read and the union answered on: a mode named anywhere counts.
const transferModes = (bookingMode, booking) => {
  const legs = Array.isArray(booking?.children) ? booking.children : [];
  return [
    ...String(bookingMode || "").split(","),
    ...legs.map((leg) => leg?.booking_type),
  ]
    .map((mode) => String(mode || "").trim().toLowerCase())
    .filter(Boolean);
};

const hasHubMode = (bookingMode, booking) =>
  transferModes(bookingMode, booking).some((mode) => HUB_MODES.includes(mode));

// The road legs of a combo — the taxi that carries the traveller between a city
// and the hub either side of the long-haul leg.
const isRoadLeg = (leg) => {
  const type = (leg?.booking_type || "").toLowerCase();
  return ["taxi", "cab", "car", "sedan", "self-drive", "selfdrive"].some(
    (mode) => type.includes(mode),
  );
};

/**
 * Whether the transfer already carries the taxi this side's CTA would add.
 *
 * A combo bundles its legs in travel order, so its first leg is the ride out of
 * the origin city (the drop) and its last the ride into the destination (the
 * pickup) — a "Train,Taxi" from Ninh Binh to Hoi An needs a drop at Ninh Binh
 * but already has the taxi from Da Nang station. Offering to add one on top of
 * it would book the same ride twice.
 */
const comboCoversSide = (booking, side) => {
  const legs = booking?.children;
  if (!Array.isArray(legs) || legs.length < 2) return false;
  const leg = side === "drop" ? legs[0] : legs[legs.length - 1];
  if (side === "drop" ? leg?.is_airport_drop : leg?.is_airport_pickup)
    return true;
  return isRoadLeg(leg);
};

// "+ Add …" label for a leg's missing pickup or drop. The hub is named by the
// city, not the mode — the same wording everywhere, whether the traveller is
// met at an airport, a station or a pier.
const addTransferLabel = (type, cityName) => {
  const what = type === "pickup" ? "Pickup" : "Drop";
  return `+ Add ${what}${cityName ? ` in ${cityName}` : ""}`;
};

/**
 * One side of a leg's pickup/drop pair, as a single link.
 *
 * The pair brackets the transfer rather than trailing it, because that is the
 * order the traveller lives it: the drop (hotel → hub in the origin city)
 * happens before boarding, so it renders above the transfer box, and the
 * pickup (hub → hotel in the destination city) after it, below. Both are flex
 * children of the transfer column, so `order-first` is what lifts the drop
 * past the box.
 *
 * Each side is one taxi in one city — which is also how the booking store files
 * them — so each link goes straight to that taxi: a booked side reads "Drop
 * Added" / "Pickup Added" and opens its booking detail, a missing one reads
 * "+ Add … in <city>" and opens that city's Pickup/Drop search. This replaces
 * the black tooltip that listed the bookings inline but led nowhere.
 *
 * `canAdd` is the caller's gate: the transfer has to end at a hub, and a combo
 * that already includes this side's taxi closes it. A side that is already
 * booked always shows regardless. The trip's first leg has no drop to add (it
 * starts from home) and its last no pickup.
 */
const PickupDropCTA = ({
  fromChat,
  side,
  originCityName,
  destinationCityName,
  firstCity,
  lastCity,
  bookings = [],
  canAdd = true,
  renderIcons,
  onOpen,
}) => {
  const isPickup = side === "pickup";
  const isBooked = bookings.length > 0;
  const isTripEdge = isPickup ? lastCity : firstCity;
  if (!isBooked && (!canAdd || isTripEdge)) return null;

  const label = isBooked
    ? isPickup
      ? "Pickup Added"
      : "Drop Added"
    : addTransferLabel(side, isPickup ? destinationCityName : originCityName);

  return (
    <span
      className={`self-start inline-flex items-center gap-1 hover:underline cursor-pointer ${
        isPickup ? "" : "order-first"
      } ${
        fromChat
          ? "text-[#1f6feb] font-[600] text-[13px] max-ph:text-[12.5px] py-[5px] max-ph:py-[5px] px-[2px]"
          : "text-blue font-[500] text-[14px]"
      }`}
      style={TRANSFER_LINK_FONT}
      onClick={() => onOpen?.(side, bookings[0])}
    >
      {isBooked ? renderIcons?.(bookings) : null}
      {label}
    </span>
  );
};

// The leg has no transfer booked yet — otherwise the same CTA the booked rows
// carry, minus the bookings a transfer can already cover.
const TaxiPickupDropItem = ({
  fromChat,
  side,
  openAirportPickupDrop,
  originCityName,
  destinationCityName,
  firstCity,
  lastCity,
  currentAirportBookings,
}) => (
  <PickupDropCTA
    fromChat={fromChat}
    side={side}
    originCityName={originCityName}
    destinationCityName={destinationCityName}
    firstCity={firstCity}
    lastCity={lastCity}
    bookings={
      currentAirportBookings?.filter((book) =>
        side === "pickup" ? book?.is_airport_pickup : book?.is_airport_drop,
      ) || []
    }
    onOpen={openAirportPickupDrop}
  />
);

const AirportBookingItem = ({
  fromChat,
  side,
  booking,
  canAdd,
  originCityName,
  destinationCityName,
  handleEdit,
  openAirportPickupDrop,
  firstCity,
  lastCity,
}) => {
  const sideBookings = booking.filter((book) =>
    side === "pickup" ? book?.is_airport_pickup : book?.is_airport_drop
  );
  // Airport-category bookings that are neither leg of a pickup/drop pair. They
  // have no add-or-change flow of their own, so they stay a plain list of names
  // that opens the booking detail — listed once, below the transfer box with
  // the pickup.
  const otherBookings =
    side === "pickup"
      ? booking.filter(
          (book) => !book?.is_airport_drop && !book?.is_airport_pickup
        )
      : [];

  /**
   * The mode glyph on an itinerary transfer row.
   *
   * Reads the same accent map the booking-detail drawers use, so a mode can't
   * end up with one icon in the itinerary and another in its drawer. That map
   * already carried this exact set — flight, taxi, train, ferry, bus — plus the
   * self-drive glyphs this switch was missing: an unmatched `booking_type` hit
   * `default: null` and the row rendered no icon at all.
   *
   * Takes the booking, not just its type, wherever the caller has one: a
   * self-drive bike and a self-drive car share the same `booking_type`, and only
   * the vehicle category on the quote tells them apart. A bare label still works
   * and resolves to the car.
   *
   * `color` was already being passed by callers and silently dropped; it now
   * applies, defaulting to the grey the switch hardcoded.
   */
  const correctIcon = (bookingOrMode, color = "#a5a5a5") => {
    const key = resolveModeKey(bookingOrMode);
    if (!key) return null;
    const { Icon } = getModeAccent(key);
    return <Icon className="text-2xl" size={16} color={color} />;
  };

  // One glyph per distinct mode among a side's bookings.
  const renderIcons = (bookings) =>
    [...new Set(bookings.map(resolveModeKey))].map((mode, index) => (
      <React.Fragment key={mode || index}>{correctIcon(mode)}</React.Fragment>
    ));

  const linkClass = fromChat
    ? "text-[#1f6feb] font-[600] text-[13px] max-ph:text-[12.5px] py-[5px] max-ph:py-[5px] px-[2px]"
    : "text-blue font-[500] text-[14px]";

  return (
    <>
      {otherBookings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {otherBookings.map((book, index) => (
            <span
              key={book?.id || index}
              className={`inline-flex items-center gap-1 hover:underline cursor-pointer ${linkClass}`}
              style={TRANSFER_LINK_FONT}
              onClick={() => handleEdit(false, book)}
            >
              {correctIcon(book)}
              {book?.name}
            </span>
          ))}
        </div>
      )}

      <PickupDropCTA
        fromChat={fromChat}
        side={side}
        originCityName={originCityName}
        destinationCityName={destinationCityName}
        firstCity={firstCity}
        lastCity={lastCity}
        bookings={sideBookings}
        canAdd={canAdd}
        renderIcons={renderIcons}
        onOpen={openAirportPickupDrop}
      />
    </>
  );
};

const CityItem = ({
  city,
  selectedBooking,
  setSelectedBooking,
  duration,
  booking_type,
  transfer_type,
  upPresent,
  downPresent,
  booking_id,
  length,
  destination_city_id,
  destination_city_name,
  origin_city_name,
  setShowLoginModal,
  oCityData,
  dCityData,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  _updateTaxiBookingHandler,
  airportBookings,
  booking,
  hotelName,
  destinationHotelName,
  sourceGmaps,
  destinationGmaps,
  sourceLat,
  sourceLong,
  destinationLat,
  destinationLong,
  firstCity,
  lastCity,
  bookingIdToDelete,
  pinColour,
  isLast,
  isFirstCity,
  check_in,
  check_out,
  date_of_journey,
  fromChat,
  isDraft,
  showPins,
  onSendMessage,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { transfers_status,pricing_status } = useSelector((state) => state.ItineraryStatus);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const reduxItineraryId = useSelector((state) => state.ItineraryId);

  // P1 (Draft) fallback: when the shimmer/draft itinerary doesn't yet carry
  // a start city name, label the row with the user's cached IP location so
  // the start pin/label isn't blank during the loading state.
  const userLocationFallback = (() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = JSON.parse(localStorage.getItem("userLocation") || "null");
      return cached?.city || null;
    } catch {
      return null;
    }
  })();

  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false);
  const [transferDrawerType, setTransferDrawerType] = useState(null); // 'pickup' or 'drop'
  const [selectedTransferBooking, setSelectedTransferBooking] = useState(null);
  const { trackTransferBookingAdd, trackTransferBookingChange, trackTransferBookingDelete } = useAnalytics();
  const { id } = useSelector((state) => state.auth);

  const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType,  doj, initialMode, initialEdgeId, drawerSource} =
    router?.query;

  // Use Redux ItineraryId as the canonical ID (works on /chat/[sessionId] pages too)
  const currentItineraryId = router.query.id || reduxItineraryId;
  const isDraftMode = fromChat && !currentItineraryId;

  // Second copy of the same lookup, for the other component in this file. Both
  // now read the shared accent map, so the two can't drift — and neither drops
  // a mode it doesn't recognise on the floor the way `default: null` did.
  const correctIcon = (bookingOrMode, color = "#a5a5a5") => {
    const key = resolveModeKey(bookingOrMode);
    if (!key) return null;
    const { Icon } = getModeAccent(key);
    return <Icon className="text-2xl" size={16} color={color} />;
  };

  const handleClose = useHandleClose()

  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comboDetails, setComboDetails] = useState(false);
  const [transferType, setTransferType] = useState(null);
  const [isIntracity, setIsIntracity] = useState(false);
  const [error, setError] = useState(false);
  const [currentAirportBookings, setCurrentAirportBookings] = useState(
    airportBookings || []
  );
  const [airportBookingId, setAirportBookingId] = useState(null);


  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const auth = useSelector(state=>state.auth);
  const {customer} = useSelector(state=>state.Itinerary)

  useEffect(() => {
    setCurrentAirportBookings(airportBookings || []);

  }, [airportBookings]);

  useEffect(() => {
  }, [bookingId]);

  useEffect(() => {
    if (!booking_id) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [booking_id]);

  useEffect(() => {
    // If URL has bookingId and transferType, set airportBookingId from URL
    if (router.query.bookingId && router.query.transferType) {
      setAirportBookingId(router.query.bookingId);
      setTransferType(router.query.transferType);
    } else if (!router.query.drawer) {
      // Reset airportBookingId when drawer is closed
      setAirportBookingId(null);
      setTransferType(null);
    }
  }, [router.query.bookingId, router.query.transferType, router.query.drawer]);

  const Itinerary = useSelector(state =>state.Itinerary)

  // P1 (Draft) stage: the itinerary isn't confirmed/built yet, so its transfers
  // are client-side drafts (BotApp stamps them `draft-transfer-*` / is_draft) with
  // no booking on the server. The booking-details drawer would 404 on those ids,
  // so the chip's View CTA is hidden and the chip itself is inert until P2.
  const isP1Draft = Itinerary?.status === "Draft";

  // P1/Draft transfer-loader safety net. The draft row shows P1TransferLoader
  // while a leg's transfer is still expected (transfers_status PENDING — set by
  // display_itinerary right after the day-by-day lands). It must stop when
  // display_transfers resolves the leg to "no transfer" (transfers_status flips
  // to SUCCESS) — handled directly in the render below — but also when
  // display_transfers never arrives at all. Bound that wait so the loader can't
  // spin forever; once elapsed we drop the loader for this leg.
  const [transferWaitElapsed, setTransferWaitElapsed] = useState(false);
  useEffect(() => {
    if (Itinerary?.status === "Draft") {
      setTransferWaitElapsed(false);
      const t = setTimeout(() => setTransferWaitElapsed(true), 12000);
      return () => clearTimeout(t);
    }
    setTransferWaitElapsed(false);
  }, [Itinerary?.status, transfers_status]);

useEffect(() => {
  const isDrawerClosed = !drawer;
  
  if (isDrawerClosed) {
    document.body.style.overflow = 'initial';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  }
}, [drawer]);


  // const handleEdit = async (combo, book) => {
  //   setTransferType(book?.booking_type || booking_type);
  //   setIsIntracity(false);
  //   if (combo) {
  //     setComboDetails(true);
  //   }
  //   setAirportBookingId(book?.id);
  //   setLoading(true);
  //   router.push(
  //     {
  //       pathname: window.location.pathname,
  //       query: {
  //         drawer: "Intracity",
  //         bookingId: book?.id,
  //         oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
  //         dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id
  //       },
  //     },
  //     undefined,
  //     {
  //       scroll: false,
  //     }
  //   );
  // };
  const handleEdit = async (combo, book) => {
     if(!localStorage.getItem("access_token")){
      setShowLoginModal(true);
      return;
     }
    //  if( auth?.id != customer){
    //   dispatch(setCloneItineraryDrawer(true));
    //   return;
    // }
    const bookingType = book?.booking_type || booking_type;
    setTransferType(bookingType);
    trackTransferBookingChange(router.query.id, bookingIdToDelete, oCityData?.name || oCityData?.city_name, dCityData?.name || dCityData?.city_name);
    setIsIntracity(false);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);

    // Navigate to the URL with bookingId and transferType
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "Intracity",
          bookingId: book?.id,
          transferType: bookingType,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  };

  const handlePickupDropDrawer = (drawerType) => {
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "addPickupDrop",
          drawerType: drawerType,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
          doj: drawerType == 'pickup' ? check_out : check_in

        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  };

  // The city a pickup/drop is booked in, named by the itinerary's own city.
  // `origin_city_name`/`destination_city_name` describe the transfer's
  // endpoints, which for a hub-to-hub leg are the hubs themselves ("Rovaniemi,
  // Bus Station") — but the taxi is booked in the city, so the CTA names the
  // city. The trip's home cities carry the name flat instead of under `city`.
  const cityLabel = (cityData, fallback) =>
    cityData?.city?.name || cityData?.city_name || cityData?.name || fallback;

  // The city a side of this leg's pickup/drop pair belongs to: a drop happens
  // at the origin, a pickup at the destination.
  const airportCityId = (type) =>
    type === "drop"
      ? oCityData?.id || oCityData?.gmaps_place_id
      : dCityData?.id || dCityData?.gmaps_place_id;

  // Open the same Add Taxi drawer used by the "+ Taxi" CTA, but with the
  // Pickup/Drop tab pre-selected.
  const handleAddCityTaxiAirport = (type) => {
    const cityId = airportCityId(type);
    if (!cityId) return;
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "addCityTaxi",
          itinerary_city_id: cityId,
          taxiTab: "airport",
        },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  // A side can still be added to when the transfer ends at a hub and the
  // transfer doesn't already include that ride itself.
  const canAddAirportSide = (side) =>
    hasHubMode(booking_type, booking) && !comboCoversSide(booking, side);

  /**
   * Open one side of this leg's pickup/drop pair.
   *
   * A booked side names exactly one taxi, so it opens that booking's detail —
   * where its times, fare and Change/Remove live. Only an empty side needs the
   * search: the city's Pickup/Drop drawer, which offers this side as a search
   * card. That drawer mounts under an itinerary city only, and the transfers at
   * either end of the trip are filed under the home city's gmaps place id
   * instead, so those fall back to the standalone PickupDropDrawer.
   */
  const openAirportPickupDrop = (type, booking) => {
    if (booking) {
      handleEdit(false, booking);
      return;
    }
    const cityId = airportCityId(type);
    const isItineraryCity = Itinerary?.cities?.some(
      (itineraryCity) => String(itineraryCity?.id) === String(cityId),
    );
    if (isItineraryCity) {
      handleAddCityTaxiAirport(type);
      return;
    }
    handlePickupDropDrawer(type);
  };

  const handleAddTransfer = () => {
    if(localStorage.getItem("access_token")){
    trackTransferBookingChange(currentItineraryId, bookingIdToDelete, oCityData?.name || oCityData?.city_name, dCityData?.name || dCityData?.city_name);
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "editTransfer",
          bookingId: booking?.id,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  } else {
    setShowLoginModal(true);
  }
  };


  const handleIntracityBookings = async (combo, booking) => {
    setIsIntracity(true);
    setTransferType(booking?.booking_type);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${getTransferBookingPath(
          booking?.booking_type,
          { combo }
        )}/${booking?.id}/`
      );
      setData(res?.data);
      setTransferType(res?.data?.booking_type);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };


   const handleDelete = async (val) => {
  if (!localStorage?.getItem("access_token")) {
    setShowLoginModal(true);
    return;
  }
  const dataPassed = val != null ? val : data;
  
  try {
    setLoading(true);
    const response = await axiosDeleteBooking.delete(
      `${router?.query?.id}/bookings/${getTransferBookingPath(
        dataPassed?.booking_type
      )}/${dataPassed?.id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status === 204) {
      // For multicity combo, pass all child booking IDs along with parent ID
      if (dataPassed?.combo_type === "multicity" && dataPassed?.children) {
        const childIds = dataPassed.children.map(child => child.id);
        dispatch(updateTransferBookings(dataPassed?.id, childIds, dataPassed?.combo_type));
      } else {
        // For regular bookings
        dispatch(updateTransferBookings(dataPassed?.id));
      }
      
      setLoading(false);
      getPaymentHandler();
      trackTransferBookingDelete(router.query.id, dataPassed?.id, id);

      const isAirportTransferBooking =
        dataPassed?.is_airport_pickup || dataPassed?.is_airport_drop;

      if (isIntracity || isAirportTransferBooking) {
        setCurrentAirportBookings((prev) =>
          prev.filter((booking) => booking.id !== dataPassed?.id)
        );
      } else {
        setVisible(true);
      }

      // `city` can be undefined for airport transfer deletes, which produced
      // "undefined deleted successfully". Fall back to a Taxi Pickup/Drop label.
      const deletedLabel =
        city ||
        (dataPassed?.is_airport_drop
          ? "Taxi Drop"
          : dataPassed?.is_airport_pickup
          ? "Taxi Pickup"
          : "Booking");

      dispatch(
        openNotification({
          type: "success",
          text: `${deletedLabel} deleted successfully`,
          heading: "Success!",
        })
      );
      handleClose();

      const bodyStyle = window.getComputedStyle(document.body).overflow;
      if (bodyStyle === "hidden") {
        document.body.style.overflow = "initial";
      }
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
      })
    );
    setLoading(false);
  }
};

  //   useEffect(() => {
  //   if (transferType !== null && airportBookingId) {
  //     router.push(
  //       {
  //         pathname: window.location.pathname,
  //         query: {
  //           drawer: "Intracity",
  //           bookingId: airportBookingId,
  //           transferType: transferType,
  //           oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
  //           dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id
  //         },
  //       },
  //       undefined,
  //       {
  //         scroll: false,
  //       }
  //     );
  //   }
  // }, [transferType, airportBookingId]);

  useEffect(() => {
    if (router.query.transferType || transferType !== null) {

    } else {
      setAirportBookingId(null);
    }
  }, [router.query.transferType, transferType]);

  useEffect(() => {

    if (!router.query.drawer) {
      setTransferType(null);
      setAirportBookingId(null);
      setLoading(false);
    }
  }, [router.query.drawer]);


  const handleTransferSubmit = async (transferData) => {
    if (!localStorage?.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      // setLoading(true);

      const bookingPayload = {
        transfer_type: "airport",
        source_itinerary_city:
          transferData.transferType === "pickup"
            ? dCityData?.id || dCityData?.gmaps_place_id
            : oCityData?.id || oCityData?.gmaps_place_id,
        destination_itinerary_city: null,
        // transferData.transferType === "pickup"
        //   ? dCityData?.id || dCityData?.gmaps_place_id
        //   : oCityData?.id || oCityData?.gmaps_place_id,
        is_pickup: transferData.transferType === "pickup",
        is_drop: transferData.transferType === "drop",
        source: transferData?.source,
        trace_id: transferData?.traceId,
        // A mixed fleet names its cabs in `vehicles` instead of picking one
        // `result_index`; the backend branches on `vehicles` first.
        ...(transferData?.vehicles?.length
          ? { vehicles: transferData.vehicles }
          : { result_index: transferData?.selectedQuote?.result_index }),
        // Optional supplier extras ticked on the result card (Mozio only). They ride up on
        // the selected quote, and mercury re-prices the booking through Mozio to include
        // them - omitting them here would book the taxi without the child seat the
        // traveller asked for. Absent unless something was ticked.
        ...(transferData?.selectedQuote?.optional_amenities?.length
          ? {
              optional_amenities:
                transferData.selectedQuote.optional_amenities,
            }
          : {}),
        booking_id: transferData?.booking_id,
      };

      const response = await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/taxi/`,
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          updateAirportTransferBooking(
            `${transferData.transferType === "pickup"
              ? dCityData?.id || dCityData?.gmaps_place_id
              : oCityData?.id || oCityData?.gmaps_place_id
            }`,
            response.data
          )
        );

        if (_updatePaymentHandler) _updatePaymentHandler();
        if (getPaymentHandler) getPaymentHandler();

        dispatch(
          openNotification({
            type: "success",
            text: `${transferData.transferType === "pickup" ? "Pickup" : "Drop"
              } transfer added successfully`,
            heading: "Success!",
          })
        );
      }
      setIsTransferDrawerOpen(false);
      handleClose();
      setTransferDrawerType(null);
      setSelectedTransferBooking(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.detail
          ? error?.response?.data?.errors?.[0]?.detail?.[0]
          : null || error.message;
      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDurationRange = (minutes) => {
  const hours = minutes / 60;

  const lower = Math.floor(hours);
  const upper = Math.ceil(hours);

  if (lower === upper) {
    return `${lower} hour${lower > 1 ? "s" : ""}`;
  }

  return `${lower}-${upper} hours`;
};

  // ── Chat-only transfer/flight presentation helpers ──────────────────────
  const isFlightLeg = !!booking_type?.toLowerCase?.().includes("flight");

  const formatFlightDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Departure date shown on every transfer chip. Read from the check-in date:
  // date_of_journey is only passed on the start/end transfers, so fall back to
  // the destination city's check-in (start_date) — the day you leave the origin
  // — then to the raw check-in/out props.
  const departDate =
    date_of_journey ||
    dCityData?.start_date ||
    check_out ||
    check_in ||
    oCityData?.end_date;
  const departLabel = formatFlightDate(departDate);

  // Duration (minutes) computed from a check-in → check-out datetime pair, used
  // as a fallback when the booking itself carries no duration.
  const durationFromCheckInOut = (ci, co) => {
    if (!ci || !co) return 0;
    const a = new Date(ci).getTime();
    const b = new Date(co).getTime();
    if (isNaN(a) || isNaN(b) || b <= a) return 0;
    return Math.round((b - a) / 60000);
  };

  const transferModeLabel = (() => {
    const t = booking_type?.toLowerCase() || "";
    if (t.includes("flight")) return "Flight";
    if (t.includes("train")) return "Train";
    if (t.includes("ferry") || t.includes("boat")) return "Ferry";
    if (t.includes("bus")) return "Bus";
    if (
      t.includes("taxi") ||
      t.includes("car") ||
      t.includes("cab") ||
      t.includes("sedan")
    )
      return "Private taxi";
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "Transfer";
  })();

  // Approx transfer duration. The value may arrive as a top-level numeric
  // `duration` (minutes) or inside transfer_details.duration ({ text: "3 hours
  // 30 mins", value: seconds }) — the shape the detail view reads. Flights show
  // Flights and other transfers alike show an exact "Approx 3h 30m".
  // Resolve a transfer/leg duration (minutes) from whichever field a booking
  // carries: top-level numeric, flight segments (elapsed or summed), or the
  // road-transfer transfer_details.duration ({ text, value: seconds }).
  const resolveDurationMins = (b, topLevel) => {
    const top = Number(topLevel);
    if (top > 0) return top;
    const segs = b?.transfer_details?.items?.[0]?.segments;
    if (Array.isArray(segs) && segs.length) {
      const dep = segs[0]?.origin?.departure_time;
      const arr = segs[segs.length - 1]?.destination?.arrival_time;
      const depMs = dep ? new Date(dep).getTime() : NaN;
      const arrMs = arr ? new Date(arr).getTime() : NaN;
      if (!isNaN(depMs) && !isNaN(arrMs) && arrMs > depMs) {
        return Math.round((arrMs - depMs) / 60000);
      }
      const sum = segs.reduce((s, seg) => s + (Number(seg?.duration) || 0), 0);
      if (sum > 0) return sum;
    }
    const dd = b?.transfer_details?.duration;
    const text = typeof dd === "string" ? dd : dd?.text || "";
    if (text) {
      const h = (text.match(/(\d+)\s*h/i) || [])[1];
      const m = (text.match(/(\d+)\s*m/i) || [])[1];
      const mins = parseInt(h || 0, 10) * 60 + parseInt(m || 0, 10);
      if (mins > 0) return mins;
    }
    const secs = Number(dd?.value);
    if (secs > 0) return Math.round(secs / 60);
    return 0;
  };

  const _durationDetails = booking?.transfer_details?.duration;
  const _durationText =
    typeof _durationDetails === "string"
      ? _durationDetails
      : _durationDetails?.text || "";
  const effectiveDuration =
    resolveDurationMins(booking, duration || booking?.duration) ||
    durationFromCheckInOut(booking?.check_in, booking?.check_out);

  const approxDurationLabel = (mins) => {
    const m = Number(mins) || 0;
    if (m <= 0) return "";
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    if (h > 0 && min > 0) return `Approx ${h}h ${min}m`;
    if (h > 0) return `Approx ${h}h`;
    return `Approx ${min}m`;
  };

  // Final label — falls back to the raw duration text when it can't be parsed
  // into minutes, so a duration is still shown whenever the booking has one.
  // Flights and transfers share one h/m format: a 20-minute ferry reads
  // "Approx 20m", not a whole hour rounded up from it.
  const durationLabel =
    approxDurationLabel(effectiveDuration) ||
    (_durationText ? `Approx ${_durationText}` : "");

  // Combo (multi-leg) transfer — e.g. "Train to Kyoto, Flight to Chūbu
  // Centrair". Render one row per leg, each with its own approx time.
  const comboChildren =
    Array.isArray(booking?.children) && booking.children.length > 1
      ? booking.children
      : null;
  const comboHasFlight = comboChildren?.some((c) =>
    (c?.booking_type || "").toLowerCase().includes("flight"),
  );
  const legModeLabel = (bt) => {
    const t = (bt || "").toLowerCase();
    if (t.includes("flight")) return "Flight";
    if (t.includes("train")) return "Train";
    if (t.includes("ferry") || t.includes("boat")) return "Ferry";
    if (t.includes("bus")) return "Bus";
    if (
      t.includes("taxi") ||
      t.includes("car") ||
      t.includes("cab") ||
      t.includes("sedan")
    )
      return "Taxi";
    return bt || "Transfer";
  };
  // A flight starts and ends at an airport, not a city centre — the "Munnar"
  // leg actually lands at Cochin International — so flights are labelled by
  // their hub. Provider airport names arrive noisy: trailing "(HAN)"/"(airport)"
  // suffixes, doubled spaces, and "Arpt"/"Intl" abbreviations mixed in with
  // otherwise spelled-out names.
  const cleanAirportName = (name) =>
    (name || "")
      .replace(/\s*\([A-Z]{3}\)/g, "")
      .replace(/\s*\(airport\)/gi, "")
      .replace(/\bArpt\b/gi, "Airport")
      .replace(/\bIntl\b/gi, "International")
      .replace(/\s+/g, " ")
      .trim();

  // Hub at one end of a flight: the first segment's origin / the last segment's
  // destination. Falls back to the IATA code, then "" so callers drop back to
  // the city name — draft/unpriced flights carry no segments at all.
  const flightHubName = (b, end) => {
    const segs = b?.transfer_details?.items?.[0]?.segments;
    if (!Array.isArray(segs) || !segs.length) return "";
    const point =
      end === "origin" ? segs[0]?.origin : segs[segs.length - 1]?.destination;
    return cleanAirportName(point?.airport_name) || point?.airport_code || "";
  };

  const flightOriginHub = isFlightLeg ? flightHubName(booking, "origin") : "";
  const flightDestinationHub = isFlightLeg
    ? flightHubName(booking, "destination")
    : "";

  // Leg cities live in different places by mode: road legs at
  // transfer_details.trips[*].origin/destination.{city|name|address}; flight
  // legs at transfer_details.items[0].segments[*].origin/destination — named by
  // airport hub, like the single-flight card above.
  const legSrcName = (leg) => {
    const td = leg?.transfer_details;
    if ((leg?.booking_type || "").toLowerCase().includes("flight")) {
      const hub = flightHubName(leg, "origin");
      if (hub) return hub;
    }
    const o = td?.trips?.[0]?.origin;
    const seg = td?.items?.[0]?.segments?.[0]?.origin;
    return (
      o?.city ||
      o?.name ||
      o?.address ||
      seg?.city_name ||
      seg?.city_code ||
      leg?.source_address?.name ||
      td?.source?.name ||
      ""
    );
  };
  const legDestName = (leg) => {
    const td = leg?.transfer_details;
    if ((leg?.booking_type || "").toLowerCase().includes("flight")) {
      const hub = flightHubName(leg, "destination");
      if (hub) return hub;
    }
    const trips = td?.trips;
    const d =
      (Array.isArray(trips) && trips[trips.length - 1]?.destination) ||
      trips?.[0]?.destination;
    const segs = td?.items?.[0]?.segments;
    const seg = Array.isArray(segs) ? segs[segs.length - 1]?.destination : null;
    return (
      d?.city ||
      d?.name ||
      d?.address ||
      seg?.city_name ||
      seg?.city_code ||
      leg?.destination_address?.name ||
      td?.destination?.name ||
      ""
    );
  };
  // Same resolution order as the single-transfer card: read a duration off the
  // booking, and when it carries none (the usual case for ferry/bus legs) derive
  // it from the leg's check-in → check-out pair.
  const legDurationLabel = (leg) =>
    approxDurationLabel(
      resolveDurationMins(leg, leg?.duration) ||
        durationFromCheckInOut(leg?.check_in, leg?.check_out),
    );
  // Flight legs carry a real segment departure_time; road/rail/ferry legs only
  // have date_of_journey or a check-in datetime, so fall through to those.
  const legDepartsDate = (leg) =>
    formatFlightDate(
      leg?.transfer_details?.items?.[0]?.segments?.[0]?.origin
        ?.departure_time ||
        leg?.departure_time ||
        leg?.date_of_journey ||
        leg?.check_in,
    );

  // Chat transfer "Change" — mirrors the booking-details Change button
  // (TransferDrawer.handleEditRoute): opens the regular editTransfer search
  // drawer for this leg's booking so the user can swap the transfer. Combos use
  // the same drawer as any other transfer (not the multicity taxi drawer).
  const handleChangeTransfer = (e) => {
    e?.stopPropagation?.();
    // P1 (Draft): the transfer is a client-side draft (start/end combo or a
    // between-city leg) with no server booking to edit, so "Change" routes the
    // swap through chat instead of the drawer. The drawer only opens in P2.
    if (isP1Draft) {
      const src =
        origin_city_name || oCityData?.city_name || booking?.from_city || "";
      const dest =
        destination_city_name ||
        dCityData?.city_name ||
        booking?.to_city ||
        "";
      onSendMessage?.(`change transfer from ${src} to ${dest}`);
      return;
    }
    if (!localStorage.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    trackTransferBookingChange(
      router.query.id,
      bookingIdToDelete,
      oCityData?.name || oCityData?.city_name,
      dCityData?.name || dCityData?.city_name,
    );
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "editTransfer",
          drawerType: null,
          bookingId: booking?.id,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
          doj: booking?.check_in || departDate,
        },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  // Right-side action group on every chat transfer chip: [Change] [View ›].
  // Change opens the change drawer; View opens the booking-details drawer (the
  // chip's own onClick). On mobile only Change shows — View is hidden. In P1
  // there is no server-side booking to view, so View is dropped there too.
  const transferChipActions = (
    <div className="flex items-center gap-[14px] max-ph:gap-0 shrink-0">
      <button
        type="button"
        onClick={handleChangeTransfer}
        className="text-[12.5px] max-ph:text-[11.5px] font-[600] text-[#1f6feb] whitespace-nowrap hover:underline"
      >
        Change
      </button>
      {!isP1Draft && (
        <span className="text-[12.5px] max-ph:text-[11.5px] font-[600] text-[#1f6feb] whitespace-nowrap max-ph:hidden">
          View ›
        </span>
      )}
    </div>
  );

  // Chip body click → booking-details drawer, except in P1 where the chip is inert.
  const handleTransferChipClick = (combo) => {
    if (isP1Draft) return;
    handleEdit(combo, booking);
  };
  const transferChipCursor = isP1Draft ? "" : "cursor-pointer";


  return (
    <Container
      className={`${fromChat ? "" : (isLast ? "mb-[60px]" : "")}`}
      style={fromChat ? { display: "block", width: "100%" } : undefined}
    >
    {!fromChat && (!(Itinerary.status == "Draft") ?  <PinWrapper>
  {upPresent &&  <VerticalLine height={"50px"} gradient="top" />}
  {upPresent && downPresent ? (
    <div className="flex items-center justify-center">
      {/* {correctIcon(booking_type)} */}
    </div>
  ) : (
   <Pin length={length} pinColour={"black"} inner={true} className="-ml-[8.5px]" />
  )}
  {downPresent && <VerticalLine height={"50px"} gradient="bottom" />}
</PinWrapper> :  <PinWrapper>
  {/* P1 (Draft) stage. Endpoint *labels* (start/end city name rows) carry
      isFirstCity/isLast and render the pin with a single line on the
      appropriate side — those rows have no upPresent/downPresent. Every
      other row (including the start→first-city and last-city→end transfers,
      which have firstCity/lastCity set) renders one connecting line. Two
      stacked gradients fade to transparent where they meet, which leaves a
      visible gap; one line keeps the connector continuous. */}
  {upPresent && downPresent && (
    <div className="flex items-center justify-center m-2 py-2">
      <VerticalLine height={"50px"} gradient="top" />
    </div>
  )}
  {!upPresent && !downPresent && isFirstCity && (
    <>
      <Pin length={length} pinColour={"black"} inner={true} />
      {/* <VerticalLine height={"50px"} gradient="bottom" /> */}
    </>
  )}
  {!upPresent && !downPresent && isLast && (
    <>
      {/* <VerticalLine height={"50px"} gradient="top" /> */}
      <Pin length={length} pinColour={"black"} inner={true} />
    </>
  )}
</PinWrapper>)}
     

      <div
        className={`flex flex-col gap-2 ${fromChat ? "w-full" : ""} ${!fromChat && !downPresent && upPresent && "mt-[41px]z"
          } ${!fromChat && !upPresent && downPresent && "mb-[41px]"}`}
        style={
          // P1 (Draft) start/end city label rows: pin sits at one end of a
          // taller PinWrapper (pin + line). align-self pulls the city name
          // to the same end so the text lines up with the pin instead of
          // the wrapper's vertical centre.
          Itinerary?.status === "Draft" && !upPresent && !downPresent
            ? { alignSelf: isLast ? "flex-end" : "flex-start" }
            : undefined
        }
      >
        {/* City and Duration Section - Aligned with Pin */}
        <div
          className={`flex flex-col gap-3 ${!(upPresent && downPresent) ? "itmes-center justify-center" : ""
            }`}
        >
          {!(upPresent && downPresent) && (
            <div
              className={`${isDesktop ? "Body1M_16" : "Body2M_14"} ${
                fromChat ? "flex items-center gap-3 max-ph:gap-[11px] py-[4px] max-ph:py-[3px] px-[2px]" : ""
              }`}
            >
              {/* Chat: solid endpoint dot (replaces the removed pin rail) */}
              {fromChat && (isFirstCity || isLast) && (
                <span className="inline-block w-3.5 h-3.5 max-ph:w-[13px] max-ph:h-[13px] rounded-full bg-[#171A1F] shrink-0" />
              )}
              {/* P1 fallback: when the draft itinerary hasn't surfaced a
                  start-city name yet, use the user's IP-derived city so the
                  label isn't blank under the start pin. */}
              {fromChat ? (
                <span className="font-[800] text-[17px] max-ph:text-[15.5px] tracking-[-0.3px] leading-tight text-[#171A1F]">
                  {city ||
                    (Itinerary?.status === "Draft" && isFirstCity
                      ? userLocationFallback
                      : null)}
                </span>
              ) : (
                city ||
                (Itinerary?.status === "Draft" && isFirstCity
                  ? userLocationFallback
                  : null)
              )}
              {/* Chat: trip start/end tag on the endpoint nodes */}
              {fromChat && (isFirstCity || isLast) && (
                <span className="text-[10px] font-[700] tracking-[0.7px] text-[#9aa0a8] uppercase whitespace-nowrap">
                  {isFirstCity ? "Start" : "End"}
                </span>
              )}
            </div>
          )}

          {transfers_status === "PENDING" && !(Itinerary.status == "Draft")  ? (
  upPresent && downPresent ? (
    <TransferSkeleton fromChat={fromChat} />
  ) : (
    ""
  )
) : (
  upPresent &&
  downPresent && (
    <div
      className={`text-[16px] font-[500] flex flex-col gap-2 ${
        (currentAirportBookings &&
          currentAirportBookings.length > 0) ||
        ["flight", "train", "ferry", "bus"].includes(
          booking_type?.toLowerCase()
        )
          ? "mt-0"
          : (booking_id || city) && !visible
          ? "mt-0"
          : "mt-0"
      }`}
    >
      {(booking_id || city) && !visible ? (
        <>
          {/* EXISTING BOOKING DISPLAY - Icon and City Name */}
          {fromChat ? (
            isP1Draft &&
            Array.isArray(booking?.legs) &&
            booking.legs.length > 0 ? (
              /* Chat P1 (Draft): the server sends the route as leg strings
                 ("Ferry from Nusa Penida to Sanur", "Flight from Bali to New
                 Delhi", …) with no bookable id yet. Combo legs (start/end
                 transfers spanning multiple hops) are shown comma-separated and
                 wrap onto new lines on mobile. The chip body is inert in P1 —
                 "Change" routes through chat (handleChangeTransfer), the drawer
                 only opens in P2. */
              <div className="flex items-start gap-[12px] max-ph:gap-[10px] w-full px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] rounded-[12px] max-ph:rounded-[11px] bg-[#EEF4FE] border-[1px] border-[#DBE7FB]">
                <span className="flex items-center shrink-0 text-[#1f6feb] mt-[1px]">
                  {correctIcon(booking, "#1f6feb")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] max-ph:text-[12px] font-[600] text-[#1c2c44] leading-snug break-words">
                    {booking.legs.join(", ")}
                  </div>
                  {/* The draft only carries the first leg's duration, so a
                      multi-leg combo total would be wrong — show it for a
                      single-leg transfer only. */}
                  {booking.legs.length === 1 && durationLabel ? (
                    <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                      {durationLabel}
                    </div>
                  ) : null}
                </div>
                {transferChipActions}
              </div>
            ) : comboChildren ? (
              /* Chat: combo (multi-leg) card — one row per booking, each with
                 its own approx time. Mirrors the old "Train to Kyoto, Flight
                 to Chūbu Centrair" combo but split into scannable rows. */
              <div
                onClick={() => handleTransferChipClick(true)}
                className={`flex items-stretch w-full rounded-[12px] border-[1px] ${transferChipCursor} overflow-hidden bg-[#EEF4FE] border-[#DBE7FB]`}
              >
                <div className="flex-1 min-w-0 flex flex-col">
                  {comboChildren.map((leg, i) => {
                    // Fall back to the trip's overall origin/destination for the
                    // first/last leg when the leg itself doesn't carry a city.
                    const src =
                      legSrcName(leg) || (i === 0 ? origin_city_name : "");
                    const dest =
                      legDestName(leg) ||
                      (i === comboChildren.length - 1
                        ? destination_city_name
                        : "");
                    const modeLabel = legModeLabel(leg?.booking_type);
                    const dur = legDurationLabel(leg);
                    // Every leg shows its departure date, not just flights. Only
                    // the first leg may borrow the trip's departure date — later
                    // legs could fall on a different day, so leave them blank
                    // rather than assert a date we don't have.
                    const departs =
                      legDepartsDate(leg) || (i === 0 ? departLabel : "");
                    return (
                      <div
                        key={leg?.id || i}
                        className={`flex items-center gap-[13px] max-ph:gap-[11px] px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] ${
                          i > 0 ? "border-t border-[#DBE7FB]" : ""
                        }`}
                      >
                        <span className="flex items-center shrink-0 text-[#1f6feb]">
                          {correctIcon(leg, "#1f6feb")}
                        </span>
                        <div className="flex-1 min-w-0">
                          {/* Wraps instead of truncating: a flight leg is named
                              by its airport hub, which rarely fits one line. */}
                          <div className="text-[13px] max-ph:text-[12.5px] font-[700] text-[#1c2c44] leading-snug break-words">
                            {src && dest
                              ? `${src} → ${dest}`
                              : `${modeLabel}${dest ? ` to ${dest}` : ""}`}
                          </div>
                          <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                            {modeLabel}
                            {departs ? ` · Departs ${departs}` : ""}
                            {dur ? ` · ${dur}` : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center px-[15px] shrink-0">
                  {transferChipActions}
                </div>
              </div>
            ) : isFlightLeg ? (
              /* Chat: dedicated flight card */
              <div
                onClick={() => handleTransferChipClick(transfer_type === "combo")}
                className={`flex items-center gap-[13px] max-ph:gap-[11px] w-full px-[15px] max-ph:px-[12px] py-[13px] max-ph:py-[11px] rounded-[12px] max-ph:rounded-[11px] bg-[#EEF4FE] border-[1px] border-[#DBE7FB] ${transferChipCursor}`}
              >
                <MdOutlineFlightTakeoff size={20} color="#1f6feb" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  {/* Hub names run long ("Netaji Subhash Chandra Bose
                      International Airport"), so this line wraps rather than
                      truncating — clipping would hide the destination. */}
                  <div className="text-[13.5px] max-ph:text-[12.5px] font-[700] text-[#1c2c44] leading-snug break-words">
                    {flightOriginHub || origin_city_name} →{" "}
                    {flightDestinationHub || destination_city_name}
                  </div>
                  <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                    Flight
                    {departLabel ? ` · Departs ${departLabel}` : ""}
                    {durationLabel ? ` · ${durationLabel}` : ""}
                  </div>
                </div>
                {transferChipActions}
              </div>
            ) : (
              /* Chat: transfer chip */
              <div
                onClick={() => handleTransferChipClick(transfer_type === "combo")}
                className={`flex items-center gap-[12px] max-ph:gap-[10px] w-full px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] rounded-[12px] max-ph:rounded-[11px] bg-[#EEF4FE] border-[1px] border-[#DBE7FB] ${transferChipCursor}`}
              >
                <span className="flex items-center shrink-0 text-[#1f6feb]">
                  {booking?.children
                    ? booking?.children?.map((book, i) => {
                        return (
                          <React.Fragment key={i}>
                            {correctIcon(book, "#1f6feb")}
                            {i < booking?.children?.length - 1 && (
                              <span>
                                <RiArrowDropRightLine size={18} color={"#1f6feb"} />
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })
                    : correctIcon(booking, "#1f6feb")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] max-ph:text-[12px] font-[600] text-[#1c2c44] truncate">
                    {origin_city_name} → {destination_city_name}
                  </div>
                  <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                    {transferModeLabel}
                    {departLabel ? ` · Departs ${departLabel}` : ""}
                    {durationLabel ? ` · ${durationLabel}` : ""}
                  </div>
                </div>
                {transferChipActions}
              </div>
            )
          ) : (
          <div className="flex gap-1">
            <div className="mt-[4px] flex items-start">
              {booking?.children
                ? booking?.children?.map((book, i) => {
                    return (
                      <React.Fragment key={i}>
                        {correctIcon(book)}
                        {i < booking?.children?.length - 1 && (
                          <span>
                            <RiArrowDropRightLine size={18} color={"#a5a5a5"} />
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })
                : correctIcon(booking)}
            </div>

            <div className="flex flex-col">
              <div
                className={`flex items-center gap-2 ${
                  upPresent && downPresent ? "group hover:cursor-pointer" : ""
                }`}
                onClick={() => {
                  if(!(Itinerary.status == "Draft")){
                  upPresent &&
                    downPresent &&
                    handleEdit(transfer_type === "combo", booking);
                  }
                }}
              >
                <div
                  className={`${
                    isDesktop ? "Body1M_16" : "Body2M_14"
                  } group-hover:text-blue `}
                  style={TRANSFER_LINK_FONT}
                >
                  {upPresent && downPresent ? city : ""}
                </div>
                {upPresent && downPresent && !(Itinerary.status == "Draft") && (
                  <div className="">
                    <FaPen
                      size={12}
                      className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
                    />
                  </div>
                )}
              </div>

             {duration > 0 && (
  <div className="Body3R_12">
    Duration: {Itinerary.status === "Draft"
      ? formatDurationRange(duration)
      : duration}
  </div>
)}
            </div>
          </div>
          )}

          {/* AIRPORT/STATION PICKUP DROP - Show only for flight/train/ferry/bus */}
          {/* While the airport transfers are being repriced (transfers or
              pricing PENDING), show a loader instead of silently hiding the row. */}
          {(transfers_status === "PENDING" || pricing_status === "PENDING") && !(Itinerary.status == "Draft") && (
            <PickupDropLoader />
          )}
         {transfers_status != "PENDING" &&
  pricing_status != "PENDING" &&
  // Only render the pickup/drop section when it has something to show — the
  // transfer has a leg that ends at a hub, or there are existing airport
  // bookings. For a plain taxi (no hub, no bookings) this section renders
  // nothing, so skipping it avoids an empty row + its gap padding the bottom of
  // the transfer box unevenly.
  (hasHubMode(booking_type, booking) || currentAirportBookings.length > 0) && (
    /* Each side is a flex child of this transfer column in its own right, so
       the drop can sit above the transfer box (`order-first`) and the pickup
       below it — the order the traveller takes them in. */
    ["drop", "pickup"].map((side) =>
      (booking_id || currentAirportBookings.length > 0) ? (
        /* If main booking exists OR there are pickup/drop bookings, show AirportBookingItem */
        <AirportBookingItem
          fromChat={fromChat}
          key={`airport-${side}-${booking_id || "no-main"}`}
          side={side}
          booking={currentAirportBookings}
          canAdd={canAddAirportSide(side)}
          originCityName={cityLabel(oCityData, origin_city_name)}
          destinationCityName={cityLabel(dCityData, destination_city_name)}
          handleEdit={handleEdit}
          openAirportPickupDrop={openAirportPickupDrop}
          firstCity={firstCity}
          lastCity={lastCity}
        />
      ) : !(Itinerary.status == "Draft") ? (
        /* If NO main booking and NO pickup/drop bookings, show TaxiPickupDropItem */
        <TaxiPickupDropItem
          fromChat={fromChat}
          key={`taxi-no-booking-${side}`}
          side={side}
          openAirportPickupDrop={openAirportPickupDrop}
          originCityName={cityLabel(oCityData, origin_city_name)}
          destinationCityName={cityLabel(dCityData, destination_city_name)}
          firstCity={firstCity}
          lastCity={lastCity}
          currentAirportBookings={currentAirportBookings}
        />
      ) : null,
    )
  )}
        </>
      ) : Itinerary.status == "Draft" ? (
        // P1 (Draft) stage: the leg's transfer hasn't surfaced yet. Show the
        // compact draft loader ONLY while a transfer is still expected
        // (transfers_status PENDING) and within the bounded wait. It disappears
        // when (booking_id || city) becomes truthy (the transfer "comes in" and
        // the branch above renders), when display_transfers resolves this leg to
        // no transfer (transfers_status → SUCCESS), or when display_transfers
        // never arrives (the wait elapses) — so it can no longer spin forever.
         !transferWaitElapsed ? (
          <P1TransferLoader />
        ) : null
      ) : (
        <>
          {/* NO BOOKING - Show both CTAs */}
          {/* First CTA: Add Transfer */}
          { !(Itinerary.status == "Draft")  ?
          fromChat ? (
            /* Chat: the missing transfer is a gap in the route, not an optional
               extra — so it takes the same card shape as a booked transfer, in
               amber rather than blue, with the CTA as the card's right action
               (mirrors `transferChipActions`). */
            <div className="flex items-center gap-[12px] max-ph:gap-[10px] w-full px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] rounded-[12px] max-ph:rounded-[11px] bg-[#FFF7E6] border-[1px] border-[#F5DFA6]">
              <span className="flex items-center shrink-0 text-[#B67B10]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4.5 2.8 20h18.4L12 4.5z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10v4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] max-ph:text-[12px] font-[600] text-[#5c4405]">
                  No transfer added from {origin_city_name} to{" "}
                  {destination_city_name}
                </div>
              </div>
              {/* One text node, not a flex row: a flex container underlines
                  each child separately, leaving a gap in the rule. */}
              <button
                type="button"
                onClick={handleAddTransfer}
                className="shrink-0 text-[12.5px] max-ph:text-[11.5px] font-[600] text-[#1f6feb] whitespace-nowrap hover:underline"
              >
                + Add Transfer
              </button>
            </div>
          ) :
          isPageWide ? (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
              style={TRANSFER_LINK_FONT}
            >
              + Add Transfer from {origin_city_name} to {destination_city_name}
            </button>
          ) :  (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
              style={TRANSFER_LINK_FONT}
            >
              + Add Transfer
            </button>
          ) : null}

          {/* Second CTA: Add Taxi Pickup/Drop - Only when NO booking */}
          {!isDraftMode &&
            (transfers_status === "PENDING" || pricing_status === "PENDING") && (
              <PickupDropLoader />
            )}
          {!isDraftMode &&
            transfers_status != "PENDING" &&
            pricing_status != "PENDING" &&
            ["drop", "pickup"].map((side) => (
              <TaxiPickupDropItem
                fromChat={fromChat}
                key={`taxi-no-booking-${side}`}
                side={side}
                openAirportPickupDrop={openAirportPickupDrop}
                originCityName={cityLabel(oCityData, origin_city_name)}
                destinationCityName={cityLabel(dCityData, destination_city_name)}
                firstCity={firstCity}
                lastCity={lastCity}
                currentAirportBookings={currentAirportBookings}
              />
            ))}
        </>
      )}
    </div>
  )
)}
          {/* )} */}
        </div>
      </div>

      {drawer === "addPickupDrop" &&
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id) && (
          <PickupDropDrawer
            isOpen={drawer === "addPickupDrop" &&
              (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
              (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)}
            hotelName={hotelName}
            destinationHotelName={destinationHotelName}
            sourceLat={sourceLat}
            sourceLong={sourceLong}
            destinationLat={destinationLat}
            destinationLong={destinationLong}
            booking={booking}
            onClose={handleClose}
            transferType={drawerType}
            doj={doj || date_of_journey}
            bookingMode={booking_type?.toLowerCase()}
            originCityName={origin_city_name}
            destinationCityName={destination_city_name}
            onSubmit={handleTransferSubmit}
            existingBooking={selectedTransferBooking}
            sourceGmaps={sourceGmaps}
            destinationGmaps={destinationGmaps}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            setShowLoginModal={setShowLoginModal}
            city={origin_city_name}
            dcity={destination_city_name}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
            booking_id={bookingId}
          />
        )}



      {((drawer == "editTransfer" && drawerSource !== "chat" &&
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)) || drawerType == "multicity") && (
          <TransferEditDrawer
            mercury
            addOrEdit={"transferAdd"}
            showDrawer={
              drawer == "editTransfer" && drawerSource !== "chat" &&
              (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
              (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)
            }
            destination={destination_city_id}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            oCityData={oCityData}
            dCityData={dCityData}
            setShowLoginModal={setShowLoginModal}
            city={origin_city_name}
            dcity={destination_city_name}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
            booking_id={booking_id}
            booking_type={drawerType == "multicity" ? "multicity" : null}
            initialMode={initialMode || undefined}
            initialEdgeId={initialEdgeId || undefined}
          />
        )}

      {"Intracity" === drawer &&
        (bookingId === airportBookingId || bookingId === booking_id) &&
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id) && (
          <TransferDrawer
            show={
              "Intracity" === drawer && (bookingId === airportBookingId || bookingId === booking_id)
            }
            error={error}
            transferType={router.query.transferType || transferType}
            combo={booking_type?.includes(",")}
            booking_type={transferType || booking_type}
            handleDelete={handleDelete}
            city={city}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            oCityData={oCityData}
            dCityData={dCityData}
            setShowLoginModal={setShowLoginModal}
            dcity={destination_city_name}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
            isIntracity={isIntracity}
            booking_id={airportBookingId || booking_id}
            setError={setError}
          />
        )}
    </Container>
  );
};

export default CityItem;

