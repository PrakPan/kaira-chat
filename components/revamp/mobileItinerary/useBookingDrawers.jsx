import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";
import VisaDetailDrawer from "../../drawers/visaDetails/VisaDetailDrawer";
import VisaSearchDrawer from "../../drawers/visaDetails/VisaSearchDrawer";
import EsimDetailDrawer from "../../drawers/esimDetails/EsimDetailDrawer";
import EsimPackagesDrawer from "../../drawers/esimDetails/EsimPackagesDrawer";
import { MERCURY_HOST } from "../../../services/constants";
import {
  addAncillaryBooking,
  removeAncillaryBooking,
} from "../../../store/actions/ancillaryBookings";

// ─────────────────────────────────────────────────────────────────────────────
//  useBookingDrawers — the itinerary's rows, opening the SAME drawers the old
//  desktop day-by-day did: booking details and every change / add flow.
//
//  Desktop (DesktopItinerary) uses all of it. The phone (MobileItinerary) keeps
//  its own detail sheets for READING a booking and takes only the change / add
//  flows from here — every "Change", "Add" and "Fix" on its rows, and the
//  detail sheet's own "Change" (the `onChange*` handlers below). There the
//  drawers rise as bottom sheets: BotApp puts the ItineraryContainer that
//  renders them under ui/Drawer's DrawerSheetContext, and `sheets` below does
//  the same for the pickers this hook renders itself.
//
//  The old chain (MenuV2 → DaybyDay → ItineraryCity / CityItem / CityDay)
//  opens nearly all of its drawers by a shallow `router.push` of query params,
//  and the component that renders each drawer reads `router.query` and mounts
//  it when the params name its row. Those renderers all live inside
//  ItineraryContainer, which stays MOUNTED on both surfaces (display:none
//  behind the new itinerary), and every drawer portals to #modal-portal — so pushing
//  the old params from here opens the old drawers exactly as before, with the
//  old behaviour behind them (login gates, deletes, reprices, change flows).
//  Each push below mirrors one old handler; the file:line it mirrors is noted.
//
//  The row "keys" the old renderers match on:
//    • transfers: `oItineraryCity` / `dItineraryCity` — the itinerary city id,
//      or the home city's `gmaps_place_id` at either end of the trip (the same
//      halves the intercity booking key is built from);
//    • city-level drawers: `itinerary_city_id`.
//
//  Some drawers were local state in the old UI and can't be reached by URL, so
//  they are rendered here instead (returned as `drawers`): the draft/pricing
//  activity drawer (CityDay), the visa / eSIM drawers (Bookings tab), and the
//  visa / eSIM pickers those drawers' own "Change" opens.
//
//  A P1 draft keeps its old behaviour too: its hotel and transfer "Change"
//  went to Kaira, and its transfers had no details to open.
//
//  Not here: the CTAs that SAY "ask Kaira" — "Day at leisure · ask Kaira ›".
//  Those go to the chat on both surfaces (useTripActions). An empty stay's
//  "Add a stay · ADD ›" is changeStay below.
// ─────────────────────────────────────────────────────────────────────────────

const PUSH_OPTS = { scroll: false, shallow: true };

export default function useBookingDrawers({
  askKaira,
  onLoginRequired,
  beforeOpen,
  // The phone: the drawers this hook renders itself open as bottom sheets.
  sheets = false,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const itinerary = useSelector((s) => s.Itinerary);
  const stays = useSelector((s) => s.Stays);
  const transferBookings = useSelector((s) => s.TransferBookings?.transferBookings);
  const reduxItineraryId = useSelector((s) => s.ItineraryId);
  const finalizedStatus = useSelector((s) => s.ItineraryStatus?.finalized_status);
  const ancillaryBookings = useSelector((s) => s.AncillaryBookings);

  const [draftActivity, setDraftActivity] = useState({ show: false });
  const [ancillary, setAncillary] = useState(null);
  // The visa / eSIM picker, opened straight onto a booking to replace it.
  const [ancillaryChange, setAncillaryChange] = useState(null);

  const isDraft = itinerary?.status === "Draft";
  const cities = Array.isArray(itinerary?.cities) ? itinerary.cities : [];
  const startKey = itinerary?.start_city?.gmaps_place_id;
  const endKey = itinerary?.end_city?.gmaps_place_id;

  // Same lookup every old row uses (VerticalLayout / ItineraryCity).
  const itineraryId = router.query.id || reduxItineraryId;
  const withId = (query) => (itineraryId ? { id: itineraryId, ...query } : query);

  const push = useCallback(
    (query) => {
      beforeOpen?.();
      router.push({ pathname: window.location.pathname, query }, undefined, PUSH_OPTS);
    },
    [router, beforeOpen],
  );

  const loggedIn = () =>
    typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const requireLogin = () => {
    if (loggedIn()) return true;
    onLoginRequired?.();
    return false;
  };

  const cityIndexOf = (leg) => cities.findIndex((c) => c?.id === leg?.id);
  // The CityItem row a journey belongs to — into this city, or out of it.
  const inboundRow = (leg) => {
    const i = cityIndexOf(leg);
    return { o: i === 0 ? startKey : cities[i - 1]?.id, d: leg?.id };
  };
  const outboundRow = (leg) => {
    const i = cityIndexOf(leg);
    return { o: leg?.id, d: i === cities.length - 1 ? endKey : cities[i + 1]?.id };
  };

  // ── Stays ──────────────────────────────────────────────────────────────────

  // ItineraryCity fetchDetails (index.jsx:434) → HotelBooking's hotel drawer.
  // A draft hotel asks Kaira instead (index.jsx:341).
  const openStay = (leg) => {
    if (!leg?.stay) return;
    if (!requireLogin()) return;
    if (isDraft) {
      askKaira?.(`Show ${leg.stay.name}, ${leg.city} Details`, leg.stay.name);
      return;
    }
    push(
      withId({
        drawer: "showHotelDetail",
        idx: cityIndexOf(leg),
        booking_id: leg.stay.bookingId,
        city_id: leg.cityId,
      }),
    );
  };

  // ItineraryCity handleChangeHotel (index.jsx:628) / handleAddStay → DaybyDay
  // handleClickAc (DaybyDay.jsx:138) → HotelBooking's change / add drawer.
  // The stay is matched on its itinerary city rather than by city index: the
  // flat Stays list goes out of step with the cities once any city has two
  // hotels, which is how the old lookup picked the wrong booking.
  const changeStay = (leg) => {
    if (!requireLogin()) return;
    if (isDraft) {
      askKaira?.(`change hotel in ${leg.city}`, `${leg.city} stay`);
      return;
    }
    const cityStays = (stays || []).filter((s) => s?.itinerary_city_id === leg.id);
    const stay = cityStays.find((s) => !!s?.id) || cityStays[0] || null;
    const city = cities[cityIndexOf(leg)];
    push({
      drawer: "changeHotelBooking",
      clickType: stay?.id ? "Change" : "Add",
      itineraryCityId: leg.id,
      booking_id: stay?.id,
      check_in: city?.start_date || stay?.check_in,
      check_out: city?.end_date || stay?.check_out,
      hotel_duration: stay?.duration,
      city_id: stay?.city?.id || stay?.city_id || leg.cityId,
      // The placeholder stay of a hotel-less city carries no name; the search
      // drawer still wants one.
      city_name: stay?.city_name || leg.city,
    });
  };

  // ── Journeys ───────────────────────────────────────────────────────────────

  // CityItem handleEdit (VerticalLayout.js:543) → the row's TransferDrawer. A
  // draft leg has no booking behind it; its chip was inert (VerticalLayout.js:1252).
  const openJourney = (travel, row) => {
    if (!travel?.bookingId || travel?.isDraftLeg || isDraft) return;
    if (!requireLogin()) return;
    push(
      withId({
        drawer: "Intracity",
        bookingId: travel.bookingId,
        transferType: travel.raw?.booking_type,
        oItineraryCity: row.o,
        dItineraryCity: row.d,
      }),
    );
  };

  // CityItem handleChangeTransfer (VerticalLayout.js:1186) → TransferEditDrawer.
  const changeJourney = (travel, row, { from, to, doj }) => {
    if (isDraft || travel?.isDraftLeg) {
      askKaira?.(`change transfer from ${from} to ${to}`, travel?.title);
      return;
    }
    if (!requireLogin()) return;
    push(
      withId({
        drawer: "editTransfer",
        drawerType: null,
        bookingId: travel?.bookingId,
        oItineraryCity: row.o,
        dItineraryCity: row.d,
        doj: travel?.raw?.check_in || doj,
      }),
    );
  };

  // CityItem handleAddTransfer (VerticalLayout.js:670) → TransferEditDrawer, add.
  const addJourney = (row) => {
    if (!requireLogin()) return;
    push(withId({ drawer: "editTransfer", oItineraryCity: row.o, dItineraryCity: row.d }));
  };

  // CityItem openAirportPickupDrop with an empty side (VerticalLayout.js:654):
  // the city's Add Taxi drawer on its Pickup/Drop tab, or — at the trip's home
  // city, which has no itinerary city to mount it — the standalone
  // PickupDropDrawer. A drop happens at the row's origin, a pickup at its end.
  const addPickupDrop = (type, row, travel) => {
    const cityId = type === "drop" ? row.o : row.d;
    if (!cityId) return;
    if (cities.some((c) => String(c?.id) === String(cityId))) {
      push(withId({ drawer: "addCityTaxi", itinerary_city_id: cityId, taxiTab: "airport" }));
      return;
    }
    push(
      withId({
        drawer: "addPickupDrop",
        drawerType: type,
        oItineraryCity: row.o,
        dItineraryCity: row.d,
        doj: type === "pickup" ? travel?.raw?.check_out : travel?.raw?.check_in,
      }),
    );
  };

  // ── Taxis in a city ────────────────────────────────────────────────────────

  // ItineraryCity openTaxiDrawer (index.jsx:601) → TransferEditDrawer's taxis.
  const addTaxi = (leg) => {
    push({
      drawer: "addCityTaxi",
      itinerary_city_id: leg.id,
      ...(itinerary?.multicity_taxi === true ? { taxiTab: "multicity" } : {}),
    });
  };

  // A car in a city: the sightseeing chip (CityDay.jsx:1049) → the city's
  // TransferDrawer; an airport pickup / drop opens through the journey row it
  // belongs to, as the old PickupDropCTA did (VerticalLayout.js:654).
  const openTaxi = (leg, extra) => {
    if (!extra?.bookingId) return;
    if (extra.airportRole) {
      const inThisCity = (transferBookings?.airport?.[leg.id] || []).some(
        (t) => t?.id === extra.bookingId,
      );
      // The pickup meets the journey IN; the drop the journey OUT — except
      // leg 1's ride from the traveller's home, filed under the home city.
      const row =
        extra.airportRole === "pickup" || !inThisCity ? inboundRow(leg) : outboundRow(leg);
      openJourney({ bookingId: extra.bookingId, raw: extra.raw }, row);
      return;
    }
    push(
      withId({ drawer: "SightSeeing", bookingId: extra.bookingId, itinerary_city_id: leg.id }),
    );
  };

  // A car's "Change" — TransferDrawer's handleEditRoute (TransferDrawer.js:283):
  // the city's tabbed Add Taxi drawer, on the booking's own tab, carrying the
  // booking so the drawer changes it rather than adding a second car. The city
  // is the key redux files the booking under, which is exactly what that
  // drawer's selectors read; this leg is the fallback.
  const changeTaxi = (leg, extra) => {
    if (!extra?.bookingId) return;
    if (!requireLogin()) return;
    const tab =
      extra.raw?.combo_type === "multicity"
        ? "multicity"
        : extra.airportRole
          ? "airport"
          : "sightseeing";
    const filedUnder = ["intracity", "airport"]
      .map((bucket) => transferBookings?.[bucket] || {})
      .flatMap((group) =>
        Object.keys(group).filter(
          (key) =>
            Array.isArray(group[key]) &&
            group[key].some((t) => t?.id === extra.bookingId),
        ),
      )
      .find((key) => cities.some((c) => String(c?.id) === String(key)));
    push(
      withId({
        drawer: "addCityTaxi",
        itinerary_city_id: filedUnder || leg.id,
        taxiTab: tab,
        // Only the Sightseeing tab reads it; the Airport tab finds the
        // booking in the store itself.
        ...(tab === "sightseeing" ? { changeBookingId: extra.bookingId } : {}),
      }),
    );
  };

  // ── Day items ──────────────────────────────────────────────────────────────

  // CityDay handleDraftActivityClick (CityDay.jsx:637): while the trip is a
  // draft or still pricing, an activity opens the selection drawer, primed by
  // the same activity POST.
  const openDraftActivity = async (leg, day, item) => {
    const activityId = item?.raw?.booking?.id || item?.raw?.id;
    if (!activityId) return;
    const source = item?.raw?.booking?.source || item?.raw?.source;
    beforeOpen?.();
    try {
      await fetch(`${MERCURY_HOST}/api/v1/ancillaries/activity/${activityId}/?currency=INR`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          start_date: day?.date,
          number_of_adults: itinerary?.number_of_adults || 2,
          number_of_children: itinerary?.number_of_children || 0,
          children_ages: [],
          ...(source && { source }),
        }),
      });
    } catch (err) {
      console.error("Failed to fetch activity details", err);
    }
    setDraftActivity({
      show: true,
      id: activityId,
      source,
      date: day?.date,
      cityId: leg.cityId,
      itineraryCityId: leg.id,
    });
  };

  // CityDay handleItemClick (CityDay.jsx:732) → ItineraryCity's POI / activity
  // detail drawer, where Change, Replace and Remove live.
  const openDayItem = (leg, day, item) => {
    const type = item?.elementType;
    if (!type || type === "recommendation" || !item?.detailId) return;
    if (type === "activity" && (isDraft || finalizedStatus === "PENDING")) {
      openDraftActivity(leg, day, item);
      return;
    }
    push({
      drawer: "showPoiDetail",
      poi_id: item.detailId,
      type,
      dayIndex: day?.dayIndex,
      slabIndex: item?.raw?.index,
      itinerary_city_id: leg.id,
    });
  };

  // A booked activity's "Change" — ActivityDetails handleChangeActivity
  // (ActivityDetails.jsx:425): the city's activity picker on this day, carrying
  // the booking so the pick swaps it instead of adding a second one.
  const changeActivity = (leg, day, item) => {
    if (!requireLogin()) return;
    push({
      drawer: "activity",
      itinerary_city_id: leg.id,
      city_id: leg.cityId,
      // The city's own day index — the slot the activity sits in.
      dayIdx: day?.dayIndex ?? 0,
      date: day?.date,
      booking_id: item?.raw?.booking?.id || item?.detailId,
    });
  };

  // ── Visa / eSIM ────────────────────────────────────────────────────────────

  // The Bookings tab's "View Detail" (ActivitiesBookings.js:25).
  const openAncillary = (item) => {
    const booking = (ancillaryBookings || []).find((b) => b?.id === item?.id);
    if (!booking) return;
    beforeOpen?.();
    setAncillary(booking);
  };
  const closeAncillary = () => setAncillary(null);

  // A visa / eSIM's "Change": the drawer's own picker (VisaDetailDrawer.jsx:559),
  // opened straight onto the booking it replaces.
  const changeAncillary = (item) => {
    if (!item?.id) return;
    if (!requireLogin()) return;
    beforeOpen?.();
    setAncillaryChange({ type: item.type === "eSIM" ? "eSIM" : "Visa", bookingId: item.id });
  };
  const closeAncillaryChange = () => setAncillaryChange(null);

  const onAncillaryAdded = (booking, replaceId) => {
    if (booking?.id) dispatch(addAncillaryBooking(booking, replaceId));
    else if (replaceId) dispatch(removeAncillaryBooking(replaceId));
  };
  const onAncillaryRemoved = (bookingId) => {
    if (bookingId) dispatch(removeAncillaryBooking(bookingId));
  };
  const variant = sheets ? "sheet" : "drawer";

  const drawers = (
    <>
      {draftActivity.show ? (
        <ActivityDetailsDrawer
          itineraryDrawer
          date={draftActivity.date}
          show={draftActivity.show}
          setShowDetails={setDraftActivity}
          activityId={draftActivity.id}
          source={draftActivity.source}
          handleCloseDrawer={() => setDraftActivity({ show: false })}
          Topheading="Select Our Activity"
          cityId={draftActivity.cityId}
          itinerary_city_id={draftActivity.itineraryCityId}
          setShowLoginModal={() => onLoginRequired?.()}
          showPackages={false}
        />
      ) : null}
      <VisaDetailDrawer
        show={ancillary?.booking_type === "Visa"}
        visa={ancillary?.visa}
        bookingId={ancillary?.id}
        showManageActions
        variant={variant}
        onHide={closeAncillary}
        onAdded={onAncillaryAdded}
        onRemoved={onAncillaryRemoved}
        onBooked={closeAncillary}
      />
      <EsimDetailDrawer
        show={ancillary?.booking_type === "eSIM"}
        pkg={ancillary?.external_data?.package}
        bookingId={ancillary?.id}
        showManageActions
        variant={variant}
        onHide={closeAncillary}
        onAdded={onAncillaryAdded}
        onRemoved={onAncillaryRemoved}
        onBooked={closeAncillary}
      />
      {ancillaryChange?.type === "Visa" ? (
        <VisaSearchDrawer
          show
          bookingId={ancillaryChange.bookingId}
          variant={variant}
          onHide={closeAncillaryChange}
          onAdded={onAncillaryAdded}
          onRemoved={onAncillaryRemoved}
          onBooked={closeAncillaryChange}
        />
      ) : null}
      {ancillaryChange?.type === "eSIM" ? (
        <EsimPackagesDrawer
          show
          bookingId={ancillaryChange.bookingId}
          variant={variant}
          onHide={closeAncillaryChange}
          onAdded={onAncillaryAdded}
          onRemoved={onAncillaryRemoved}
          onBooked={closeAncillaryChange}
        />
      ) : null}
    </>
  );

  // Handlers shaped for LegSection's callbacks.
  return {
    drawers,
    onOpenStay: openStay,
    onChangeStay: changeStay,
    onOpenTravel: (leg, travel) =>
      openJourney(travel, travel === leg.outboundTravel ? outboundRow(leg) : inboundRow(leg)),
    onChangeTravel: (leg) =>
      changeJourney(leg.inboundTravel, inboundRow(leg), {
        from: leg.inboundTravel?.fromCity,
        to: leg.city,
        doj: cities[cityIndexOf(leg)]?.start_date,
      }),
    onChangeReturn: (leg) =>
      changeJourney(leg.outboundTravel, outboundRow(leg), {
        from: leg.city,
        to: leg.outboundTravel?.destName,
        doj: itinerary?.end_date,
      }),
    onAddTravel: (leg) => addJourney(inboundRow(leg)),
    onAddReturn: (leg) => addJourney(outboundRow(leg)),
    // The journey's missing car: a drop (at its origin) or a pickup (at its
    // end). "NO TAXIS ADDED" names both halves and opens on the pickup, the
    // side the old CTA led with. On the way home the only half is the drop.
    onAddJourneyTaxi: (leg, travel, chip, isReturn) => {
      if (!chip?.ask) return;
      const row = isReturn ? outboundRow(leg) : inboundRow(leg);
      const type = isReturn || chip.ask === "drop" ? "drop" : "pickup";
      addPickupDrop(type, row, travel);
    },
    onAddTaxi: addTaxi,
    onOpenExtra: openTaxi,
    onOpenDayItem: openDayItem,
    onOpenAncillary: openAncillary,
    // The phone's detail sheets' "Change" (see the header).
    onChangeTaxi: changeTaxi,
    onChangeActivity: changeActivity,
    onChangeAncillary: changeAncillary,
  };
}
