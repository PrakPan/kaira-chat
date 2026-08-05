import { useState, useEffect } from "react";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import Drawer from "../../components/ui/Drawer";
import BookingDetailActions from "../../components/revamp/common/components/BookingDetailActions";
import DetailBand from "../../components/revamp/common/components/bookingDetail/DetailBand";
import DetailError from "../../components/revamp/common/components/bookingDetail/DetailError";
import DetailSection from "../../components/revamp/common/components/bookingDetail/DetailSection";
import DrawerShell from "../../components/revamp/common/components/bookingDetail/DrawerShell";
import FactChips from "../../components/revamp/common/components/bookingDetail/FactChips";
import JourneyRail from "../../components/revamp/common/components/bookingDetail/JourneyRail";
import VehiclePhoto from "../../components/revamp/common/components/bookingDetail/VehiclePhoto";
import { getModeAccent } from "../../components/revamp/common/components/bookingDetail/modeAccent";
import {
  formatDateTime,
  legVehicle,
} from "../../components/revamp/common/components/bookingDetail/format";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../store/actions/notification";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useRouter } from "next/router";
import { useHandleClose } from "../../hooks/useHandleClose";
import { getDateDifferenceInDays } from "../../helper/DateUtils";
import { getTransferBookingPath } from "../../helper/transferBookingPath";
import { useAnalytics } from "../../hooks/useAnalytics";

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
          `${MERCURY_HOST}/api/v1/itinerary/${router.query.sessionId || router?.query?.id}/bookings/${getTransferBookingPath(
            booking_type,
            { combo },
          )}/${booking_id}/`,
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
  // A combo leg as a rail node. Collapsed it says what the service is and
  // when; tapping it expands the full detail body in place, which is the same
  // body the standalone drawer renders.
  const legNode = (child, index) => {
    const legType =
      child?.transfer_type === "sightseeing" ? "Taxi" : child?.booking_type;
    const stamp = formatDateTime(child?.check_in);
    const end = formatDateTime(child?.check_out);
    const days = getDateDifferenceInDays(child?.check_in, child?.check_out) + 1;

    const origin = child?.transfer_details?.trips?.[0]?.origin?.address;
    const destination =
      child?.transfer_details?.trips?.[0]?.destination?.address;
    const distance = child?.transfer_details?.distance?.text;
    const duration = child?.transfer_details?.duration?.text;

    const flightSegments = child?.transfer_details?.items?.[0]?.segments;

    // What the service is, in one line: a flight names its airline, a day
    // package its span, anything else the route it covers.
    const subtitle = (() => {
      if (legType === "Flight") {
        return [
          flightSegments?.[0]?.airline?.name,
          flightSegments?.[0]?.origin?.city_name &&
          flightSegments?.[flightSegments.length - 1]?.destination?.city_name
            ? `${flightSegments[0].origin.city_name} → ${flightSegments[flightSegments.length - 1].destination.city_name}`
            : null,
        ]
          .filter(Boolean)
          .join(" · ");
      }
      if (child?.transfer_type === "sightseeing") {
        return [
          `${days <= 1 ? 1 : days} ${days <= 1 ? "day" : "days"}`,
          duration,
          distance,
        ]
          .filter(Boolean)
          .join(" · ");
      }
      return origin && destination
        ? `${origin} → ${destination}`
        : origin || destination || null;
    })();

    return {
      kind: "service",
      key: child?.id || index,
      time: stamp?.shortDate,
      date:
        child?.transfer_type === "sightseeing" && days > 1
          ? `${days} days`
          : stamp?.time,
      title: child?.name || `${child?.booking_type || "Transfer"} transfer`,
      subtitle,
      status: child?.status,
      end,
      legType,
      booking: child,
    };
  };

  // The expanded body for a leg — the standalone drawer's own detail, embedded.
  const renderLegDetail = (child, legType) => {
    switch (legType) {
      case "Flight":
        return (
          <FlightDetailModal
            segments={child?.transfer_details?.items?.[0]?.segments}
            fareRule={child?.transfer_details?.items?.[0]?.fare_rule?.[0]}
            booking_id={child?.id}
            name={child?.name}
            getPaymentHandler={getPaymentHandler}
            isEmbedded
            setShowLoginModal={setShowLoginModal}
            handleEditRoute={handleEditRoute}
            data={child}
          />
        );
      case "Taxi":
        return (
          <TaxiDetailModal
            data={child}
            handleDelete={null}
            isEmbedded
            noHeading
            handleEditRoute={handleEditRoute}
          />
        );
      default:
        return (
          <VehicleDetailModal
            data={child}
            handleDelete={null}
            isEmbedded
            handleClose={handleClose}
            handleEditRoute={handleEditRoute}
          />
        );
    }
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
  const comboAccent = getModeAccent(
    isMulticityTaxi ? "Taxi" : data?.booking_type,
  );

  // A package is a sequence of services, so it reads in the order it happens —
  // not the order the API happened to return.
  const comboLegs = [...(data?.children || [])].sort(
    (a, b) => new Date(a?.check_in || 0) - new Date(b?.check_in || 0),
  );

  const comboTitle =
    data?.name ||
    `${comboLegs[0]?.source_address?.name || ""} to ${
      comboLegs[comboLegs.length - 1]?.destination_address?.name || ""
    }`;

  const comboSpan = (() => {
    const from = formatDateTime(comboLegs[0]?.check_in);
    const to = formatDateTime(comboLegs[comboLegs.length - 1]?.check_out);
    if (from?.shortDate && to?.shortDate && from.shortDate !== to.shortDate) {
      return `${from.shortDate} – ${to.date || to.shortDate}`;
    }
    return from?.date || null;
  })();

  const comboKicker = [
    isMulticityTaxi ? "Multi-day taxi" : data?.booking_type,
    comboSpan,
  ]
    .filter(Boolean)
    .join(" · ");

  const comboSummary = isMulticityTaxi
    ? `${comboLegs.length} services · 1 car`
    : `${comboLegs.length} ${comboLegs.length === 1 ? "leg" : "legs"}`;

  // The legs, as rail nodes that open in place. `expandedIndexes` still drives
  // which is open, so the leg-resolution logic above is untouched.
  const railNodes = comboLegs.map((child, index) => {
    const node = legNode(child, index);
    const open = expandedIndexes.includes(index);
    return {
      ...node,
      open,
      onToggle: () => toggleExpand(index),
      detail: open ? renderLegDetail(child, node.legType) : null,
    };
  });

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
        <DrawerShell
          band={
            <DetailBand mode={data?.booking_type} onBack={handleClose} loading />
          }
        >
          <DetailError />
        </DrawerShell>
      ) : (
        <DrawerShell
          band={
            <DetailBand
              mode={isMulticityTaxi ? "Taxi" : data.booking_type}
              title={comboTitle}
              kicker={comboKicker}
              summary={comboSummary}
              status={data?.status}
              onBack={handleClose}
            />
          }
          footer={
            <BookingDetailActions
              onDelete={() => onDeleteClick(data)}
              deleting={deleting}
              confirmItemLabel="transfer"
              onChange={canChangeCombo ? () => handleEditRoute(data) : undefined}
              changeLabel="Change Transfer"
            />
          }
        >
          {/* Every service in a multi-city taxi package rides in the same car,
              so the vehicle is stated once, above the services it covers. */}
          {isMulticityTaxi && (
            <DetailSection label="The car, throughout" className="pt-3">
              <VehiclePhoto
                image={comboVehicle?.image}
                alt={comboVehicle?.type}
                mode="Taxi"
              />
              <FactChips
                facts={[
                  { label: "Class", value: comboVehicle?.type },
                  { label: "Model", value: comboVehicle?.model_name },
                  { label: "Fuel", value: comboVehicle?.fuel_type },
                  { label: "Seats", value: comboVehicle?.seating_capacity },
                  { label: "Bags", value: comboVehicle?.bag_capacity },
                ]}
              />
            </DetailSection>
          )}

          <DetailSection
            label={
              isMulticityTaxi
                ? `${comboLegs.length} services included`
                : `${comboLegs.length} ${comboLegs.length === 1 ? "leg" : "legs"}`
            }
            className={isMulticityTaxi ? "" : "pt-3"}
          >
            <JourneyRail nodes={railNodes} accent={comboAccent} />
          </DetailSection>
        </DrawerShell>
      )}
    </Drawer>
  );
};

export default TransferDrawer;
