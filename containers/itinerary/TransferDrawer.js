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
import FleetVehicles from "../../components/revamp/common/components/bookingDetail/FleetVehicles";
import JourneyRail from "../../components/revamp/common/components/bookingDetail/JourneyRail";
import PolicyNote from "../../components/revamp/common/components/bookingDetail/PolicyNote";
import VehiclePhoto from "../../components/revamp/common/components/bookingDetail/VehiclePhoto";
import { getModeAccent } from "../../components/revamp/common/components/bookingDetail/modeAccent";
import {
  formatDateTime,
  legVehicle,
  packageTotals,
  paxLabel,
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
import {
  getFleetLabel,
  getFleetManifest,
  getVehicleCount,
} from "../../components/modals/taxis/MultiVehicleInfo";
import {
  getCancellationPolicy,
  getVendorCharges,
  vendorChargeFacts,
} from "../../components/modals/taxis/VendorCharges";
import { currencySymbols } from "../../data/currencySymbols";
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

  // Which detail body can actually describe this booking.
  //
  // The `booking_type` prop is what the mount that opened the drawer knows from
  // context, and every sightseeing mount says "Taxi" — but a city's sightseeing
  // slot also holds self-booked trains, buses, ferries and rental cars, and
  // those were being read as taxis: no route, no stations, no class, a car
  // glyph on a train. Once the booking itself has loaded, it is the authority
  // on what it is; the prop only stands in while the fetch is in flight (and it
  // is still what addresses the endpoint, since the type is unknown until the
  // response arrives). Lowercased on the way out, because the type reaches the
  // drawers as "Taxi", "taxi" or "Self-Drive" depending on where it was built.
  const resolvedType = String(
    data?.booking_type || data?.transfer_details?.mode || booking_type || "",
  )
    .trim()
    .toLowerCase();
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

  // Whether the detail body may offer "Change Transfer" at all.
  //
  // Intra-city transfers used to have no change flow, hence the blanket
  // `isIntracity` suppression. Sightseeing and airport pickup/drop now do (the
  // tabbed "Add Taxi" drawer). Sightseeing has no other route, so it shows the
  // CTA only where that drawer can actually open; airport keeps its
  // PickupDropDrawer fallback and so stays exactly as visible as before.
  //
  // The gate is stated once and handed to whichever body renders the booking:
  // a sightseeing slot holds trains and ferries as well as taxis, and the two
  // bodies offering different answers for the same booking is a bug waiting to
  // be filed.
  const noChange = cityTaxiChange
    ? false
    : data?.transfer_type === "sightseeing"
      ? true
      : isIntracity;

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

    // A convoy booking covers several cabs, so the leg has to say how many.
    // What they cost is the cart's to state, not this drawer's.
    const vehicleCount = getVehicleCount(child);
    const convoyTag =
      vehicleCount > 1
        ? // Naming the cabs beats counting them once they differ: "2 taxis"
          // is true but says nothing about what the group actually gets.
          getFleetLabel(child) || `${vehicleCount} taxis`
        : null;

    return {
      kind: "service",
      key: child?.id || index,
      accent: getModeAccent(legType || child?.booking_type),
      date: stamp?.shortDate,
      // A multi-day package has no meaningful clock time — how long it runs for
      // is the useful figure in that slot.
      time:
        child?.transfer_type === "sightseeing" && days > 1
          ? `${days} days`
          : stamp?.time,
      title: child?.name || `${child?.booking_type || "Transfer"} transfer`,
      subtitle,
      tag: convoyTag,
      status: child?.status,
      legType,
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
            // Only when the drawer has already shown THIS car above the legs.
            hideVehicle={
              !!comboVehicleKey && vehicleKey(child) === comboVehicleKey
            }
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

  // A multi-city taxi combo is the one shape where the legs share their vehicles,
  // so the drawer leads with the car (or cars) and the legs are its inclusions.
  //
  // Gated on there actually being a vehicle rather than on `booking_type`: a
  // combo reports that as "taxi", "Taxi" or a comma-joined list of its legs'
  // types depending on how it was built, and the old equality check against
  // "taxi" silently dropped the vehicle card on most of them.
  const comboVehicle = data?.children?.map(legVehicle).find(Boolean) || null;

  // The real composition, when the package rides in more than one kind of car. `comboVehicle`
  // is only the largest member on that shape, so it names one car and stays silent about the
  // rest — which is exactly the claim "the car, throughout" would be making.
  const comboFleet =
    getFleetManifest(data) ||
    (data?.children || []).map((child) => getFleetManifest(child)).find(Boolean) ||
    null;

  const isMulticityTaxi =
    data?.combo_type === "multicity" && (!!comboVehicle || !!comboFleet);

  /**
   * What a leg rides in, as a comparable key.
   *
   * "The car, throughout" is a claim about the legs, and it is built from the FIRST
   * of them that names a vehicle — so it is only true of the legs whose car actually
   * matches. Comparing the specs the drawer displays, rather than trusting the
   * heading, is what lets a leg with a different car keep its own vehicle card
   * instead of being silently covered by someone else's.
   */
  const vehicleKey = (booking) => {
    const manifest = getFleetManifest(booking);
    if (manifest?.is_mixed) return `fleet:${manifest.label || ""}`;
    const car = legVehicle(booking);
    if (!car) return null;
    return [
      car.type,
      car.model_name,
      car.fuel_type,
      car.seating_capacity,
      car.bag_capacity,
      getVehicleCount(booking) || 1,
    ]
      .map((part) => part ?? "")
      .join("|");
  };

  // The car the section above is describing. Read off `data.children` in their
  // stored order, exactly as `comboVehicle` is a few lines up — not off the sorted
  // `comboLegs`, whose first entry can be a different leg, and which is not declared
  // until below this anyway.
  const comboVehicleKey = isMulticityTaxi
    ? (data?.children || []).map(vehicleKey).find(Boolean) || null
    : null;
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

  // "1 car" is only true of a single-vehicle booking. Read the real count off the parent, or
  // off the first leg that carries one.
  const comboVehicleCount = Math.max(
    getVehicleCount(data),
    ...(data?.children || []).map((child) => getVehicleCount(child)),
    1,
  );
  const comboFleetLabel =
    getFleetLabel(data) ||
    (data?.children || []).map((child) => getFleetLabel(child)).find(Boolean);
  const comboSummary = isMulticityTaxi
    ? `${comboLegs.length} services · ${
        comboFleetLabel ||
        `${comboVehicleCount} ${comboVehicleCount === 1 ? "car" : "cars"}`
      }`
    : `${comboLegs.length} ${comboLegs.length === 1 ? "leg" : "legs"}`;

  // What the whole package comes to — how far it drives and how many days it
  // runs for. A multi-city or round-trip taxi is sold on exactly those two
  // figures (the search card quotes both), but the parent booking carries
  // neither: mercury stores distance per leg and nothing at all on the combo,
  // so they are added up from the legs here. See `packageTotals` for why a
  // sightseeing leg's "80 kms per day" cannot simply join the sum.
  const comboTotals = packageTotals(comboLegs);
  const comboDistanceLabel =
    comboTotals.km !== null
      ? // "+" when only some legs quoted a distance: the sum is then a floor,
        // not the trip's real length, and stating it flat would understate it.
        `${comboTotals.km.toLocaleString("en-IN")} kms${comboTotals.partial ? "+" : ""}`
      : null;
  const comboDaysLabel = comboTotals.days
    ? `${comboTotals.days} ${comboTotals.days === 1 ? "day" : "days"}`
    : null;

  // Who the package was priced for. Read off the parent, falling back to the
  // first leg that names anyone — the combo is built from its legs and older
  // ones were saved without the pax copied up.
  const comboPaxLabel =
    paxLabel(data?.number_of_adults, data?.number_of_children) ||
    comboLegs
      .map((leg) => paxLabel(leg?.number_of_adults, leg?.number_of_children))
      .find(Boolean) ||
    null;

  // Only the drawer's first section pads away from the band, and the totals
  // take that job whenever they are there to state.
  const showComboTotals =
    data?.combo_type === "multicity" &&
    !!(comboPaxLabel || comboDaysLabel || comboDistanceLabel);

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

  // The parent, then each leg under its rail title — the order the drawer reads in.
  const comboSources = [{ title: null, booking: data }].concat(
    comboLegs.map((leg, index) => ({
      title: railNodes[index]?.title,
      booking: leg,
    })),
  );

  /**
   * One entry per DISTINCT answer across the package, each remembering which legs
   * gave it.
   *
   * A combo is one booking per leg under the hood, and every leg of a chain is sold
   * on one supplier's quote — so asking each of them what the fare covers and how it
   * cancels returns the same answer three times over. Collapsing on the answer
   * itself, rather than assuming they always agree, keeps the honest case honest:
   * a package whose legs really were sold on different terms still states each set
   * and names the services it governs.
   *
   * The parent is asked first, for the shapes where mercury lifts these onto the
   * combo itself instead of leaving them on the legs.
   */
  const collectAcrossLegs = (read, identify) => {
    const groups = [];
    comboSources.forEach(({ title, booking }) => {
      const value = read(booking);
      if (!value) return;
      const id = identify(value);
      const seen = groups.find((group) => group.id === id);
      if (seen) seen.titles.push(title);
      else groups.push({ id, value, titles: [title] });
    });
    return groups;
  };

  // What the package's fare covers, and how it cancels — stated once, below the
  // legs, instead of repeating the same chips and the same policy inside every
  // service. TaxiDetailModal drops both when embedded for exactly this reason.
  const comboFareIncludes = collectAcrossLegs(
    (booking) => {
      const charges = getVendorCharges(booking);
      // The charges block stamps its own currency; these amounts were quoted in it
      // and are not restated when an itinerary's display currency changes.
      const facts = vendorChargeFacts(
        charges,
        currencySymbols?.[charges?.currency || booking?.currency] || "",
      );
      return facts.length ? facts : null;
    },
    (facts) => facts.map((fact) => fact.value).join("|"),
  );
  const comboPolicies = collectAcrossLegs(getCancellationPolicy, (html) => html);

  // A single answer needs no qualifier; several are only tellable apart by the legs
  // they govern. One that came off the parent has no leg name to give, so it keeps
  // the bare label rather than trailing an empty dash.
  const sectionLabel = (base, group, groups) => {
    if (groups.length === 1) return base;
    const named = group.titles.filter(Boolean);
    return named.length ? `${base} — ${named.join(", ")}` : base;
  };

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
          {resolvedType === "flight" ? (
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
          ) : resolvedType === "taxi" ? (
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
              noChange={noChange}
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
              noChange={noChange}
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
          {/* What the package amounts to, stated once for the whole thing: who
              it carries, how long it runs, how far it drives. The last two led
              the search card the package was chosen from and then vanished once
              it was booked, leaving the drawer to describe a three-day, 900 km
              trip as "3 services". Distance drops out on its own for a package
              whose legs quote none — a multi-city flight combo, say. */}
          {showComboTotals && (
            <DetailSection label="Package" className="pt-4" divider={false}>
              <FactChips
                facts={[
                  { label: "Travellers", value: comboPaxLabel },
                  { label: "Days", value: comboDaysLabel },
                  { label: "Total distance", value: comboDistanceLabel },
                ]}
              />
            </DetailSection>
          )}

          {/* Every service in a multi-city taxi package rides in the same
              vehicles, so they are stated once, above the services they cover. */}
          {isMulticityTaxi && (
            <DetailSection
              label={
                comboFleet?.is_mixed ? "The cars, throughout" : "The car, throughout"
              }
              className={showComboTotals ? "" : "pt-3"}
            >
              {comboFleet?.is_mixed ? (
                <>
                  <FleetVehicles vehicles={comboFleet.vehicles} />
                  {/* The fleet label is already the band's summary line, so the
                      chips carry the totals the cards above cannot state. */}
                  <FactChips
                    facts={[
                      {
                        label: "Taxis",
                        value: comboVehicleCount > 1 ? comboVehicleCount : null,
                      },
                      { label: "Total seats", value: comboFleet.seats },
                      { label: "Total bags", value: comboFleet.bags },
                    ]}
                  />
                </>
              ) : (
                <>
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
                      {
                        label:
                          comboVehicleCount > 1 ? "Seats / taxi" : "Seats",
                        value: comboVehicle?.seating_capacity,
                      },
                      {
                        label: comboVehicleCount > 1 ? "Bags / taxi" : "Bags",
                        value: comboVehicle?.bag_capacity,
                      },
                      {
                        label: "Taxis",
                        value: comboVehicleCount > 1 ? comboVehicleCount : null,
                      },
                    ]}
                  />
                </>
              )}
            </DetailSection>
          )}

          <DetailSection
            label={
              isMulticityTaxi
                ? `${comboLegs.length} services included`
                : `${comboLegs.length} ${comboLegs.length === 1 ? "leg" : "legs"}`
            }
            className={showComboTotals || isMulticityTaxi ? "" : "pt-3"}
          >
            <JourneyRail nodes={railNodes} accent={comboAccent} compact />
          </DetailSection>

          {comboFareIncludes.map((group, index) => (
            <DetailSection
              key={`combo-fare-${index}`}
              label={sectionLabel("Fare includes", group, comboFareIncludes)}
            >
              <FactChips facts={group.value} />
            </DetailSection>
          ))}

          {comboPolicies.map((group, index) => (
            <PolicyNote
              key={`combo-policy-${index}`}
              html={group.value}
              title={sectionLabel("Cancellation", group, comboPolicies)}
            />
          ))}
        </DrawerShell>
      )}
    </Drawer>
  );
};

export default TransferDrawer;
