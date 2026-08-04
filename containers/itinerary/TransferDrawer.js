import { useState, useEffect } from "react";
import Image from "next/image";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import Drawer from "../../components/ui/Drawer";
import BookingDetailHeader from "../../components/revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../components/revamp/common/components/BookingDetailActions";
import DetailCard from "../../components/revamp/common/components/bookingDetail/DetailCard";
import DetailError from "../../components/revamp/common/components/bookingDetail/DetailError";
import FactList from "../../components/revamp/common/components/bookingDetail/FactList";
import ModeThumb from "../../components/revamp/common/components/bookingDetail/ModeThumb";
import PolicyNote from "../../components/revamp/common/components/bookingDetail/PolicyNote";
import RouteStrip from "../../components/revamp/common/components/bookingDetail/RouteStrip";
import StatusPill from "../../components/revamp/common/components/bookingDetail/StatusPill";
import VehiclePhoto from "../../components/revamp/common/components/bookingDetail/VehiclePhoto";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../store/actions/notification";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useRouter } from "next/router";
import { useHandleClose } from "../../hooks/useHandleClose";
import { getDateDifferenceInDays } from "../../helper/DateUtils";
import { currencySymbols } from "../../data/currencySymbols";
import { useAnalytics } from "../../hooks/useAnalytics";
import dayjs from "dayjs";

// The booked car on a taxi leg. Suppliers file it under either key on the quote.
const legVehicle = (leg) =>
  leg?.transfer_details?.quote?.taxi_category ||
  leg?.transfer_details?.quote?.vehicle ||
  null;

const vehicleFacts = (vehicle) => [
  { label: "Model", value: vehicle?.model_name },
  { label: "Fuel type", value: vehicle?.fuel_type },
  { label: "Luggage bags", value: vehicle?.bag_capacity },
  { label: "Seat capacity", value: vehicle?.seating_capacity },
];

// Two legs describe the same car when the supplier gave them the same class and
// model — worth knowing, because then the car only needs showing once.
const sameVehicle = (a, b) =>
  !!a && !!b && a.type === b.type && a.model_name === b.model_name;

const TransferDrawer = ({
  show,
  booking_type,
  handleDelete,
  city,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  oCityData,
  dCityData,
  setShowLoginModal,
  dcity,
  selectedBooking,
  setSelectedBooking,
  originCityId,
  destinationCityId,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  isIntracity,
  isAirport,
  AirportTransferType,
  setIsTransferDrawerOpen,
  isSightseeing,
  combo,
  booking_id,
  transferType,
  drawerZIndex,
  onClose,
  onChangeStart,
}) => {
  const handleDrawerClose = useHandleClose();
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(false);
  const reduxItineraryId = useSelector((state) => state.ItineraryId);
  const currentItineraryId = router.query.id || reduxItineraryId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);

  const onDeleteClick = async (val) => {
    if (deleting) return;
    try {
      setDeleting(true);
      await handleDelete(val);
    } finally {
      setDeleting(false);
    }
  };
  const isCombo = data?.children && data?.children.length > 0;
  const [isDrawerOpen, setIsDrawerOpen] = useState(show);
  const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType } =
    router?.query;

  const currency = useSelector((state) => state.currency);
  const transferBookingsMap = useSelector(
    (state) => state?.TransferBookings?.transferBookings,
  );
  const itineraryCities = useSelector((state) => state?.Itinerary?.cities);

  // City taxis — sightseeing packages, airport pickup/drop, and the multi-day
  // combos that bundle them — are changed in the tabbed "Add Taxi" drawer, the
  // only surface that can search them. A change has to know which tab to land
  // on and which itinerary city the drawer belongs to.
  const cityTaxiTab =
    data?.combo_type === "multicity"
      ? "multicity"
      : data?.transfer_type === "sightseeing"
        ? "sightseeing"
        : data?.is_airport_pickup || data?.is_airport_drop
          ? "airport"
          : null;

  const cityTaxiChange = (() => {
    if (!data || !cityTaxiTab) return null;
    const tab = cityTaxiTab;

    // Prefer the key the booking is actually filed under in redux — that is
    // exactly the key the tabbed drawer's own selectors read, so the drawer
    // recognises the booking as "already added" instead of offering to add a
    // duplicate. Mount sites that hand the ids down (and the URL the detail
    // drawer was opened with) are the fallbacks; the cart passes neither.
    const fromStore = (() => {
      if (!data?.id || !transferBookingsMap) return null;
      for (const bucket of ["intracity", "airport"]) {
        const group = transferBookingsMap?.[bucket];
        if (!group) continue;
        for (const key of Object.keys(group)) {
          if (
            Array.isArray(group[key]) &&
            group[key].some((b) => b?.id === data.id)
          ) {
            return key;
          }
        }
      }
      return null;
    })();

    // On an intercity leg a drop happens at the origin city and a pickup at the
    // destination; on the intra-city mounts both ids are the same city anyway.
    const fromProps = data?.is_airport_drop
      ? origin_itinerary_city_id || destination_itinerary_city_id
      : destination_itinerary_city_id || origin_itinerary_city_id;

    // When the store knows where the booking is filed, that key is the only
    // one worth using — landing the drawer on a different city would make it
    // read the booking as absent and offer to add a second one.
    const candidates = fromStore
      ? [fromStore]
      : [fromProps, router?.query?.itinerary_city_id];

    // The tabbed drawer only ever mounts under an itinerary city
    // (itineraryCity/index.jsx keys it off `props.city.id`). Airport legs at the
    // trip's home cities are filed under a gmaps place id instead, which no
    // mount can match — leave those on the older addPickupDrop route.
    const cityId = candidates
      .filter(Boolean)
      .find((id) =>
        itineraryCities?.some?.((c) => String(c?.id) === String(id)),
      );
    if (!cityId) return null;

    return { tab, cityId };
  })();

  // The cart opens this drawer with no leg city ids, but every change flow the
  // itinerary mounts is keyed by them. The intercity bucket is keyed
  // "<originItineraryCityId>:<destinationItineraryCityId>", so the booking's own
  // entry carries both — recover them rather than pushing a URL nothing matches.
  const [routeOriginCity, routeDestinationCity] = (() => {
    if (!data?.id) return [];
    const group = transferBookingsMap?.intercity;
    if (!group) return [];
    const key = Object.keys(group).find((k) => {
      const entry = group[k];
      return (
        entry?.id === data.id ||
        (Array.isArray(entry?.children) &&
          entry.children.some((c) => c?.id === data.id))
      );
    });
    return key ? key.split(":") : [];
  })();

  const editOItineraryCity = origin_itinerary_city_id || routeOriginCity;
  const editDItineraryCity =
    destination_itinerary_city_id || routeDestinationCity;

  const { trackTaxiDetail } = useAnalytics();

  // A combo bundles several services, and the drawer is opened from whichever
  // one the traveller tapped — the "Sightseeing taxi included" chip on a day
  // card, an airport pickup row, a cart line. Open that leg rather than always
  // leg 1, working from the most specific signal the caller gave us down to the
  // vaguest, and falling back to the first leg when none of them identifies one.
  const openLegIndex = (() => {
    const children = data?.children;
    if (!children?.length) return 0;

    // The caller named a booking: either the leg itself or the combo's own id.
    const targetId = booking_id || bookingId;
    const byId = children.findIndex(
      (child) => String(child?.id) === String(targetId),
    );
    if (byId !== -1) return byId;

    if (isSightseeing || drawer === "SightSeeing") {
      const bySightseeing = children.findIndex(
        (child) => child?.transfer_type === "sightseeing",
      );
      if (bySightseeing !== -1) return bySightseeing;
    }

    if (isAirport || drawer === "AirportTaxiDetail") {
      // "pickup"/"drop" comes in on the URL for the AirportTaxiDetail route and
      // as a prop from the mounts that open the drawer directly.
      const kind = router?.query?.transferType || AirportTransferType;
      const byAirport = children.findIndex((child) =>
        kind === "drop"
          ? child?.is_airport_drop
          : kind === "pickup"
            ? child?.is_airport_pickup
            : child?.is_airport_pickup || child?.is_airport_drop,
      );
      if (byAirport !== -1) return byAirport;
    }

    return 0;
  })();

  useEffect(() => {
    if (show && isCombo && data?.children?.length > 0) {
      setExpandedIndexes([openLegIndex]);
    }
  }, [show, isCombo, data?.children?.length, openLegIndex]);

  const handleEditRoute = (data = null) => {
    // Every change flow below is mounted by the itinerary page, underneath
    // whatever opened this drawer. A host that stacks on top of it (the cart)
    // has to get out of the way first or the flow opens invisibly behind it.
    onChangeStart?.();

    // Sightseeing / airport pickup-drop: open the tabbed "Add Taxi" drawer for
    // this city with the matching tab pre-selected, carrying the booking id so
    // the drawer knows which of the city's taxis is being changed.
    if (cityTaxiChange) {
      router.push(
        {
          pathname: window.location.pathname,
          query: {
            ...(currentItineraryId ? { id: currentItineraryId } : {}),
            drawer: "addCityTaxi",
            itinerary_city_id: cityTaxiChange.cityId,
            taxiTab: cityTaxiChange.tab,
            // Only the Sightseeing tab uses it; the Airport tab finds the
            // booking itself from the store.
            ...(booking_id && cityTaxiChange.tab === "sightseeing"
              ? { changeBookingId: booking_id }
              : {}),
          },
        },
        undefined,
        {
          scroll: false,
          shallow: true,
        },
      );
      return;
    }

    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer:
            data?.is_airport_drop || data?.is_airport_pickup
              ? "addPickupDrop"
              : "editTransfer",
          drawerType: data?.is_airport_drop
            ? "drop"
            : data?.is_airport_pickup
              ? "pickup"
              : data?.combo_type === "multicity"
                ? "multicity"
                : null,
          bookingId: booking_id,
          oItineraryCity: editOItineraryCity,
          dItineraryCity: editDItineraryCity,
          doj: data?.check_in,
          // Changing a multi-city combo should land on the Multicity tab, not
          // the drawer's default (Sightseeing).
          ...(data?.combo_type === "multicity"
            ? { taxiTab: "multicity" }
            : {}),
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      },
    );
  };

  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${router.query.sessionId || router?.query?.id}/bookings/${
            combo ? `combo` : booking_type?.toLowerCase()
          }/${booking_id}/`,
        );
        setData(res?.data);
        // Sightseeing transfers are intracity taxis — track the detail view
        // separately so the taxi funnel is distinguishable from intercity
        // transfers in analytics.
        const isSightseeingDetail =
          isSightseeing ||
          drawer === "SightSeeing" ||
          res?.data?.transfer_type === "sightseeing";
        if (isSightseeingDetail) {
          trackTaxiDetail?.(
            router.query.id || router.query.sessionId,
            booking_id,
            "transfer_drawer",
          );
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        const errorMsg =
          error?.response?.data?.errors?.[0]?.message?.[0] || error.message;
        dispatch(
          openNotification({
            text: errorMsg,
            heading: "Error!",
            type: "error",
          }),
        );
      }
    };

    fetchDetails();
  }, []);

  // A combo leg, rendered as a collapsible card. Collapsed it reads as a line
  // in the itinerary — what it is, when, and what it costs; expanded it hands
  // off to the same detail body the standalone drawers use.
  const renderDetailContent = (transferData, index) => {
    const type =
      transferData?.transfer_type === "sightseeing"
        ? "Taxi"
        : transferData?.booking_type;
    const isExpanded = expandedIndexes.includes(index);
    const isMulticity = data?.combo_type === "multicity";

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return {};
      const date = new Date(dateTimeString);
      if (Number.isNaN(date.getTime())) return {};
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    };

    const checkIn = formatDateTime(transferData.check_in);
    const checkOut = formatDateTime(transferData.check_out);
    const dateDiff =
      getDateDifferenceInDays(transferData.check_in, transferData.check_out) + 1;

    const flightItem = transferData.transfer_details?.items?.[0];
    const flightSegments = flightItem?.segments;

    const origin = transferData.transfer_details?.trips?.[0]?.origin;
    const destination = transferData.transfer_details?.trips?.[0]?.destination;
    const originName = origin?.address;
    const destinationName = destination?.address;
    const transferType = transferData.transfer_type;
    const distance = transferData.transfer_details?.distance?.text;
    const duration = transferData.transfer_details?.duration?.text;

    const legTitle =
      transferData.name || `${transferData.booking_type} Transfer`;

    // The one-line summary under the leg title: a flight names its airline and
    // date, a sightseeing package its span and limits, anything else its route.
    const legSummary = (() => {
      if (type === "Flight") {
        const departure = flightSegments?.[0]?.origin?.departure_time;
        return [
          flightSegments?.[0]?.airline?.name,
          departure ? dayjs(departure).format("ddd, MMM D") : null,
        ]
          .filter(Boolean)
          .join(" · ");
      }
      if (transferType === "sightseeing") {
        const days = dateDiff <= 1 ? 1 : dateDiff;
        return [`${days} ${days <= 1 ? "day" : "days"}`, duration, distance]
          .filter(Boolean)
          .join(" · ");
      }
      return originName && destinationName
        ? `${originName} → ${destinationName}`
        : originName || destinationName || "";
    })();

    // The chip beside the title: a flight shows the cities it connects, every
    // other mode shows what kind of transfer it is.
    const legChip =
      type === "Flight"
        ? [
            flightSegments?.[0]?.origin?.city_name,
            flightSegments?.[flightSegments.length - 1]?.destination?.city_name,
          ]
            .filter(Boolean)
            .join(" → ")
        : transferType;

    // The combo shell only renders once the fetch has resolved, so a leg never
    // has to stand in for a loading state of its own.
    const renderDetailsByType = () => {
      switch (type) {
        case "Flight":
          return (
            <FlightDetailModal
              segments={flightSegments}
              fareRule={flightItem?.fare_rule?.[0]}
              booking_id={transferData?.id}
              setShowDetails={null}
              name={transferData?.name}
              getPaymentHandler={getPaymentHandler}
              isEmbedded={true}
              setShowLoginModal={setShowLoginModal}
              handleEditRoute={handleEditRoute}
              data={isCombo ? transferData : data}
            />
          );
        case "Taxi":
          return (
            <TaxiDetailModal
              data={transferData}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              noHeading={true}
              handleEditRoute={handleEditRoute}
            />
          );
        default:
          return (
            <VehicleDetailModal
              data={transferData}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              handleClose={handleClose}
              handleEditRoute={handleEditRoute}
            />
          );
      }
    };

    // On a multi-city taxi combo the legs usually ride in the same car, which is
    // shown once above the list — so a leg only names its own vehicle when the
    // supplier actually gave it a different one.
    const ownVehicle = legVehicle(transferData);
    const distinctVehicle = sameVehicle(ownVehicle, comboVehicle)
      ? null
      : ownVehicle;

    const renderMulticityLeg = () => (
      <div className="flex flex-col gap-3">
        {originName && destinationName ? (
          <div className="rounded-xl border border-[#ececec] bg-white">
            <RouteStrip
              origin={{ name: originName, time: checkIn.time, date: checkIn.date }}
              destination={{
                name: destinationName,
                time: checkOut.time,
                date: checkOut.date,
              }}
              meta={[distance, duration].filter(Boolean).join(" · ")}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-[#ececec] bg-white">
            <FactList
              columns={2}
              facts={[
                {
                  label: "Starts",
                  value: checkIn.time
                    ? `${checkIn.date} · ${checkIn.time}`
                    : checkIn.date,
                },
                {
                  label: "Ends",
                  value: checkOut.time
                    ? `${checkOut.date} · ${checkOut.time}`
                    : checkOut.date,
                },
                {
                  label:
                    transferType === "sightseeing" ? "Distance limit" : "Distance",
                  value: distance,
                },
                { label: "Duration", value: duration },
              ]}
            />
          </div>
        )}

        {distinctVehicle ? (
          <div className="rounded-xl border border-[#ececec] bg-white overflow-hidden">
            <div className="ttw-type-small font-600 text-[#0b1220] bg-[#f4f3ec] px-4 py-2">
              {distinctVehicle.type || "Vehicle"}
            </div>
            <FactList columns={2} facts={vehicleFacts(distinctVehicle)} />
          </div>
        ) : null}

        <PolicyNote html={transferData.cancellation_policy} className="" />
      </div>
    );

    // A leg that can still be re-routed or dropped on its own — only offered
    // once a sibling leg is paid for, since the combo's own action bar covers
    // the all-unpaid case.
    const showLegActions =
      data?.children?.some((child) => child.status === "Paid") &&
      transferData.status !== "Paid";

    return (
      <div
        key={`${transferData.id}-${index}`}
        className="rounded-2xl border border-[#ececec] bg-white overflow-hidden mb-3"
      >
        <div
          className="flex items-start justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-[#faf9f4] transition-colors"
          onClick={() => toggleExpand(index)}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="ttw-type-h5 text-[#0b1220] mb-0">
                {index + 1}. {legTitle}
              </h3>
              {legChip ? (
                <span className="ttw-type-small text-[#2b4a8b] bg-[#eef2fb] px-2 py-0.5 rounded-full capitalize whitespace-nowrap">
                  {legChip}
                </span>
              ) : null}
              {transferData.status ? (
                <StatusPill status={transferData.status} />
              ) : null}
            </div>
            {legSummary ? (
              <div className="ttw-type-small text-[#445069] mt-0.5">
                {legSummary}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showLegActions ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRoute(transferData);
                  }}
                  className="ttw-type-small font-500 text-[#0b1220] underline whitespace-nowrap"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(transferData);
                  }}
                  className="p-1.5 text-[#CD2026] hover:bg-[#fdeeeb] rounded-lg flex items-center"
                  title="Remove this leg"
                  aria-label="Remove this leg"
                >
                  <Image src="/delete.svg" width={16} height={16} alt="" />
                </button>
              </>
            ) : null}

            {transferData.price ? (
              <div className="text-right max-ph:hidden">
                <div className="ttw-type-body font-600 font-mono text-[#0b1220]">
                  {currency?.currency
                    ? currencySymbols?.[currency?.currency]
                    : "₹"}
                  {transferData.price?.toLocaleString()}
                </div>
              </div>
            ) : null}

            <span className="text-[#8a93a6] flex items-center">
              {isExpanded ? (
                <AiOutlineUp className="w-4 h-4" />
              ) : (
                <AiOutlineDown className="w-4 h-4" />
              )}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-[#ececec] bg-[#faf9f4] p-3">
            {/* Only a multi-city *taxi* leg gets the trimmed layout — a
                multi-city flight combo has no shared vehicle to hoist, so its
                legs still open the full flight detail body. */}
            {isMulticity && type === "Taxi"
              ? renderMulticityLeg()
              : renderDetailsByType()}
          </div>
        )}
      </div>
    );
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    handleDrawerClose();
    onClose?.();
  };

  // Combo legs can only be re-routed while none of them is paid for, and
  // multicity-flight combos have no edit flow at all. The sightseeing terms
  // below only apply when we have nowhere to send the change: a multi-day taxi
  // combo opened from the day-by-day "Sightseeing taxi included" chip is still
  // changeable — it just changes in the tabbed drawer rather than editTransfer.
  const canChangeCombo =
    !(data?.combo_type === "multicity" && data?.booking_type === "Flight") &&
    !!data?.children?.every((child) => child.status !== "Paid") &&
    (!!cityTaxiChange ||
      (data?.transfer_type != "sightseeing" && drawer != "SightSeeing"));

  // A multi-city taxi combo is the one shape where the legs share a vehicle, so
  // the drawer leads with the car and the legs are its inclusions.
  //
  // Gated on there actually being a vehicle rather than on `booking_type`: a
  // combo reports that as "taxi", "Taxi" or a comma-joined list of its legs'
  // types depending on how it was built, and the old equality check against
  // "taxi" silently dropped the vehicle card on most of them.
  const comboVehicle = data?.children?.map(legVehicle).find(Boolean) || null;
  const isMulticityTaxi = data?.combo_type === "multicity" && !!comboVehicle;

  return (
    <Drawer
      show={isDrawerOpen}
      anchor={"right"}
      backdrop
      style={{ zIndex: drawerZIndex ?? 1501 }}
      className=""
      onHide={handleClose}
      mobileWidth="100%"
      width={"50%"}
      bgColor="#ffffff"
    >
      {!isCombo ? (
        <>
          {booking_type === "Flight" ? (
            loading ? (
              <FlightDetailLoader />
            ) : (
              <FlightDetailModal
                segments={data?.transfer_details?.items?.[0]?.segments}
                fareRule={data?.transfer_details?.items?.[0]?.fare_rule?.[0]}
                booking_id={data?.id}
                name={city}
                setShowLoginModal={setShowLoginModal}
                onChange={true}
                handleClose={handleClose}
                getPaymentHandler={getPaymentHandler}
                error={error}
                handleEditRoute={handleEditRoute}
                data={data}
              />
            )
          ) : loading ? (
            <VehicleDetailLoader />
          ) : booking_type === "Taxi" ? (
            <TaxiDetailModal
              data={data}
              handleDelete={handleDelete}
              loading={loading}
              _updateFlightBookingHandler={_updateFlightBookingHandler}
              _updatePaymentHandler={_updatePaymentHandler}
              getPaymentHandler={getPaymentHandler}
              oCityData={oCityData}
              dCityData={dCityData}
              setShowLoginModal={setShowLoginModal}
              city={city}
              dcity={dcity}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
              origin_itinerary_city_id={origin_itinerary_city_id}
              destination_itinerary_city_id={destination_itinerary_city_id}
              handleClose={handleClose}
              // Intra-city taxis used to have no change flow at all, hence the
              // blanket `isIntracity` suppression. Sightseeing and airport
              // pickup/drop now do (the tabbed "Add Taxi" drawer). Sightseeing
              // has no other route, so it shows the CTA only where that drawer
              // can actually open; airport keeps its PickupDropDrawer fallback
              // and so stays exactly as visible as before.
              noChange={
                cityTaxiChange
                  ? false
                  : data?.transfer_type === "sightseeing"
                    ? true
                    : isIntracity
              }
              error={error}
              // isAirport={isAirport}
              setIsTransferDrawerOpen={setIsTransferDrawerOpen}
              handleEditRoute={handleEditRoute}
            />
          ) : (
            <VehicleDetailModal
              data={data}
              handleDelete={handleDelete}
              loading={loading}
              handleClose={handleClose}
              error={error}
              handleEditRoute={handleEditRoute}
            />
          )}
        </>
      ) : error ? (
        <div className="h-screen flex flex-col overflow-hidden">
          <BookingDetailHeader
            onBack={handleClose}
            className="px-6 max-ph:px-4"
          />
          <DetailError />
        </div>
      ) : (
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 max-ph:px-4 pb-6">
            <BookingDetailHeader
              title={
                data.name ||
                `${data.children[0]?.source_address?.name || ""} to ${
                  data.children[data.children.length - 1]?.destination_address
                    ?.name || ""
                }`
              }
              onBack={handleClose}
              leading={
                <ModeThumb
                  mode={isMulticityTaxi ? "Taxi" : data.booking_type}
                  image={isMulticityTaxi ? comboVehicle?.image : null}
                  alt={comboVehicle?.type}
                />
              }
            />

            <div className="pt-2">
              {/* Every leg of a multi-city taxi combo rides in the same car, so
                  the vehicle is described once here rather than per leg. */}
              {isMulticityTaxi && (
                <DetailCard label="Vehicle" title={comboVehicle?.type || "Taxi"}>
                  <VehiclePhoto
                    image={comboVehicle?.image}
                    alt={comboVehicle?.type}
                  />

                  <FactList columns={2} facts={vehicleFacts(comboVehicle)} />
                </DetailCard>
              )}

              <div className="ttw-type-label text-[#8a93a6] mb-2">
                {isMulticityTaxi
                  ? "Booking inclusions"
                  : `${data.children.length} ${
                      data.children.length === 1 ? "leg" : "legs"
                    }`}
              </div>

              {data.children.map((child, index) =>
                renderDetailContent(child, index),
              )}
            </div>
          </div>

          {/* Remove (left) + Change (right) — one bar for both combo shapes */}
          <div className="sticky bottom-0 z-10 border-t border-[#ececec] px-6 max-ph:px-4 py-4 bg-white">
            <BookingDetailActions
              onDelete={() => onDeleteClick(data)}
              deleting={deleting}
              confirmItemLabel="transfer"
              onChange={
                canChangeCombo ? () => handleEditRoute(data) : undefined
              }
              changeLabel="Change Transfer"
            />
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default TransferDrawer;
