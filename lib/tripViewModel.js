// ─────────────────────────────────────────────────────────────────────────────
//  buildTripViewModel(state) — the single adapter behind the mobile itinerary.
//
//  Pure: no hooks, no DOM, no dispatch. Consumed by exactly one `useSelector`
//  in MobileItinerary so the whole page has one derivation point.
//
//  It flattens the timeline that `containers/itinerary/DaybyDay.jsx` assembles
//  (start node → outbound leg → per-city stop + intercity transfer → return leg
//  → end node) into an array of legs, folding each inter-city transfer into the
//  city it ARRIVES at as `inboundTravel`.
//
//  The subtleties below are load-bearing; each one is a bug that has already
//  been fixed once in the components this replaces:
//
//   • `state.Stays` is FLAT across every city and carries an id-less
//     PLACEHOLDER for each hotel-less city. Match on `itinerary_city_id`, never
//     by index.
//   • `airport` transfers are keyed by itinerary-city id for intermediate
//     cities but by gmaps_place_id at the trip's start/end, AND the arrival
//     "drop" on leg 1 needs a date filter or a return-trip transfer is
//     attributed to it.
//   • Day numbering collapses a shared checkout/arrival date between two
//     cities, so it is not `cityIndex + dayIndex`.
//   • A combo booking's `booking_type` is comma-joined ("Taxi, Flight"), so the
//     mode must come from `getModeAccent`, which splits on "," first.
//   • `state.Itinerary` starts as `{ name: "", images: ["null"] }` — NOT null —
//     so emptiness must be judged on `cities.length`, not on the object.
// ─────────────────────────────────────────────────────────────────────────────

import {
  resolveElementType,
  getItemId,
  getItemImage,
  getTimeOfDay,
  getDurationLabel,
  getDisplayTags,
} from "../components/itinerary/itineraryCity/CityDay";
import {
  getModeAccent,
  resolveModeKey,
} from "../components/revamp/common/components/bookingDetail/modeAccent";
import { getDatesInRange } from "../helper/DateUtils";
import { optimizedMediaUrl } from "./mediaImage";
import {
  comboChildren,
  durationLabel,
  flightHubCode,
  formatDateRange,
  formatDayHeaderDate,
  formatFlightDate,
  formatPaxLabel,
  isFlightBooking,
  parseLocalDate,
  SHORT_MONTHS,
  legDestName,
  legSrcName,
  resolveDurationMins,
  transferModeLabel,
} from "./itineraryFormat";

const DAY_ELEMENT_TYPES = ["activity", "poi", "restaurant", "recommendation"];

// Media arrives from the API as an S3 KEY ("media/hotels/…"), which is what the
// legacy <ImageLoader> takes. This surface paints plain <img>/background-image
// instead, so it needs a URL — the same CDN base ImageLoader defaults to, run
// through the resizer at the size the element actually shows. Anything already
// absolute (a supplier's own CDN) is passed straight through by the resizer.
const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/";
export const mediaUrlFromKey = (key, width) => {
  if (!key || typeof key !== "string") return null;
  return optimizedMediaUrl(key.startsWith("http") ? key : CDN + key, { width });
};

// The stay row's thumbnail is 42 CSS px; 126 is that at 3x, and the resizer
// never enlarges past the original.
const STAY_THUMB_PX = 126;

/** An activity counts as PAID only when its booking is in the cart AND selected. */
const makeIsSelectedInCart = (cart) => (item) =>
  !!cart?.summary &&
  Object.values(cart.summary).some((category) =>
    category?.bookings?.some(
      (booking) =>
        booking?.id === item?.booking?.id && booking?.selected === true,
    ),
  );

/**
 * Cumulative day offset for city `i`, reproducing the collapse in
 * `itineraryCity/index.jsx`: when a city's last day and the next city's first
 * day are the same date, that shared travel day is counted once.
 */
const dayOffsetForCity = (cities, i) => {
  let offset = 0;
  for (let k = 0; k < i; k++) {
    const days = cities[k]?.day_by_day || [];
    offset += days.length || cities[k]?.duration || 0;
    const lastDate = days[days.length - 1]?.date;
    const nextFirst = cities[k + 1]?.day_by_day?.[0]?.date;
    if (lastDate && nextFirst && lastDate === nextFirst) offset -= 1;
  }
  return offset;
};

/**
 * Is there actually a transfer in this slot?
 *
 * `intercity` is keyed by ROUTE, and the key is there whether or not anything
 * is booked on it — the transfers payload emits a slot per leg, and deleting a
 * booking empties its slot to `{}` rather than dropping the key (see
 * `updateTransferBookings`, which keeps the key so the leg stays in place).
 *
 * An `id` is what makes it a booking — the same test the day-by-day makes
 * (`intercity[key].id`). Without this, an empty slot rendered as a transfer
 * that does not exist: the row fell back to the two city names for a title and
 * `transferModeLabel(undefined)` for a mode, so the trip claimed a "Transfer"
 * from Bengaluru to Kochi, quoted and price-held, that nobody had booked.
 *
 * P1 draft rows are the exception: they carry a `legs` list and (in some
 * paths) no id, and they are a real statement about the route — see
 * `isDraftLeg` below, which keeps them un-changeable until the trip is
 * confirmed.
 */
const isBookedTransfer = (booking) =>
  !!booking && (!!booking.id || Array.isArray(booking.legs));

/** Title + mono meta for one inter-city transfer. */
const buildTravel = (booking, { originCityName, destCityName }) => {
  if (!isBookedTransfer(booking)) return null;

  const isFlight = isFlightBooking(booking);

  // Flights are labelled by IATA code — "DEL → BOM". The full hub name is
  // correct but unreadable at this width: two of them truncate to
  // "Indira Gandhi International Air… → Chhatrapati Shivaji Mahara…", which
  // tells you less than the three letters on your boarding pass. When a code
  // isn't available (draft flights carry neither segments nor iata fields) it
  // falls through to the city rather than the long airport name.
  const origin =
    (isFlight && flightHubCode(booking, "origin")) ||
    legSrcName(booking) ||
    originCityName ||
    "";
  const destination =
    (isFlight && flightHubCode(booking, "destination")) ||
    legDestName(booking) ||
    destCityName ||
    "";

  const mins = resolveDurationMins(booking, booking?.duration);
  const children = comboChildren(booking);

  // A COMBO is one booking made of several legs — "taxi to the airport, then
  // fly". Each leg keeps its own mode so the row can show every one of them:
  // collapsing a taxi+flight to a single glyph tells the traveller they are
  // being driven the whole way.
  const segments = children
    ? children.map((leg) => ({
        bookingId: leg?.id ?? null,
        modeLabel: transferModeLabel(leg?.booking_type),
        modeKey: getModeAccent(resolveModeKey(leg)).key,
        title: `${legSrcName(leg) || ""} → ${legDestName(leg) || ""}`,
        durationLabel: durationLabel(resolveDurationMins(leg, leg?.duration)),
      }))
    : null;

  // On a combo `booking_type` arrives comma-joined ("Taxi, Flight"), and
  // transferModeLabel only reads the first token — so the label claimed the
  // whole journey was a taxi. Build it from the legs instead, de-duplicated so
  // a taxi-flight-taxi combo reads "Private taxi + Flight", not
  // "Private taxi + Flight + Private taxi".
  const comboLabel = segments
    ? Array.from(new Set(segments.map((x) => x.modeLabel).filter(Boolean))).join(
        " + ",
      )
    : null;

  return {
    bookingId: booking?.id ?? null,
    // What the per-booking endpoint is addressed by. `booking_type` arrives
    // comma-joined on a combo ("Taxi, Flight"), and getTransferBookingPath
    // reads a combo off `combo` instead — so hand it the LEADING mode, exactly
    // as CartBookingDetail does.
    bookingType: String(booking?.booking_type || "").split(",")[0] || null,
    transferType: booking?.transfer_type ?? null,
    title: origin && destination ? `${origin} → ${destination}` : destCityName || "",
    modeLabel: comboLabel || transferModeLabel(booking?.booking_type),
    // First-token split — the single-mode fallback. A combo renders one glyph
    // per segment instead (see `segments`), so this is only the leading mode.
    modeKey: getModeAccent(resolveModeKey(booking)).key,
    isCombo: !!segments,
    departLabel: formatFlightDate(
      booking?.date_of_journey || booking?.check_out || booking?.check_in,
    ),
    durationLabel: durationLabel(mins),
    // P1 draft legs are plain strings with no bookable id — not changeable yet.
    isDraftLeg: Array.isArray(booking?.legs) && !booking?.id,
    segments,
    raw: booking,
  };
};

// A slab element's tags mix two different things: what the item IS ("culture",
// "scenic") and what its BOOKING STATE is ("tickets_held", "booked"). Only the
// first kind is a category — the state already has its own badge and its own
// STATUS row, so letting it through prints "TICKETS_HELD" twice.
const STATUS_TAGS = new Set([
  "tickets_held", "booked", "paid", "confirmed", "selected", "included",
  "free_cancel", "non_refundable", "pending", "unpaid", "reserved",
]);

const prettyTag = (t) =>
  String(t || "").replace(/[_-]+/g, " ").trim().toUpperCase();

const pickCategory = (tags) => {
  const list = Array.isArray(tags) ? tags : [];
  const real = list.find(
    (t) => t && !STATUS_TAGS.has(String(t).trim().toLowerCase()),
  );
  return real ? prettyTag(real) : null;
};

export function buildTripViewModel(state) {
  const I = state?.Itinerary || {};
  const S = Array.isArray(state?.Stays) ? state.Stays : [];
  const TB = state?.TransferBookings?.transferBookings || {};
  const intercity = TB.intercity || {};
  const intracity = TB.intracity || {};
  const airport = TB.airport || {};
  const C = state?.Cart;
  const A = Array.isArray(state?.AncillaryBookings) ? state.AncillaryBookings : [];
  const ST = state?.ItineraryStatus || {};

  const cities = Array.isArray(I.cities) ? I.cities : [];
  const startKey = I.start_city?.gmaps_place_id;
  const endKey = I.end_city?.gmaps_place_id;

  const cartUsable = !!C && !C.error && !!C.summary;

  const gates = {
    itineraryReady: cities.length > 0,
    hotelsResolved:
      ST.hotels_status === "SUCCESS" || ST.hotels_status === "FAILURE",
    transfersResolved:
      ST.transfers_status === "SUCCESS" || ST.transfers_status === "FAILURE",
    pricingReady: ST.pricing_status === "SUCCESS" && !!C && !C.error,
    isDraft: I?.status === "Draft",
  };

  // Currency is only trustworthy once pricing has resolved: on a fetch failure
  // Cart becomes { error: true } and on a thread switch {}, and the currency
  // slice has no reset — so this would silently show the PREVIOUS trip's code.
  const currency =
    (gates.pricingReady && (C?.currency || state?.currency?.currency)) || "INR";

  const isSelectedInCart = makeIsSelectedInCart(cartUsable ? C : null);

  // ── trip ───────────────────────────────────────────────────────────────────
  const perPerson = !!(C?.pay_only_for_one || C?.show_per_person_cost);
  const rawTotal = perPerson ? C?.per_person_discounted_cost : C?.discounted_cost;

  const trip = {
    title: I.name || "",
    paxLabel: formatPaxLabel({
      adults: I.number_of_adults,
      children: I.number_of_children,
      infants: I.number_of_infants,
    }),
    dateLabel: formatDateRange(I.start_date, I.end_date, { withYear: true }),
    perPerson,
    pricesHidden: !!C?.are_prices_hidden,
    totalAmount:
      gates.pricingReady && Number.isFinite(rawTotal) ? rawTotal : null,
    totalLabel: perPerson
      ? "Per Person"
      : C?.is_estimated_price
        ? C?.total_cost === 0
          ? ""
          : "Estimated Price"
        : "Trip total",
    bookingsCount: Object.values(C?.summary || {}).reduce(
      (sum, cat) => sum + (cat?.count ?? 0),
      0,
    ),
    currency,
    status: I.status || null,
  };

  // ── legs ───────────────────────────────────────────────────────────────────
  const legs = cities.map((c, i) => {
    const cityName = c?.city?.name || "";
    const prev = cities[i - 1];

    // Inbound transfer: from the trip's start city for leg 1, else from the
    // previous city. Same keying DaybyDay uses.
    const inKey = i === 0 ? `${startKey}:${c.id}` : `${prev?.id}:${c.id}`;
    const inboundBooking = intercity[inKey] || null;

    // Airport pickup at this city; airport drop on ARRIVAL. Leg 1's drop is
    // keyed by gmaps_place_id and must be date-filtered, or the RETURN trip's
    // airport transfer is attributed to it.
    const hasPickup = (airport[c.id] || []).some((x) => x?.is_airport_pickup);
    const hasDrop =
      i === 0
        ? (airport[startKey] || []).some(
            (x) =>
              x?.is_airport_drop &&
              String(x.check_in || "").split(" ")[0] <= c.start_date,
          )
        : (airport[prev?.id] || []).some((x) => x?.is_airport_drop);

    const originName = i === 0 ? I.start_city?.name : prev?.city?.name;
    const travel = buildTravel(inboundBooking, {
      originCityName: originName,
      destCityName: cityName,
    });

    // The route has a slot for this leg and nothing in it — a hole in the
    // trip, not an absent one. Gated exactly like the stay gap: never while
    // transfers are still resolving (or the row flashes "not added" at every
    // reload), and never on a P1 draft, where the transfers are synthesised
    // client-side and there is nothing to add yet.
    //
    // A MISSING key stays silent. That is a leg the payload never claimed a
    // transfer for — the traveller's own arrival into the first city, most
    // often — and inventing a gap row for it would put a job on the trip that
    // nobody said was ours.
    const travelGap =
      inboundBooking && !travel && gates.transfersResolved && !gates.isDraft
        ? {
            fromCity: originName || "",
            toCity: cityName,
            meta: [originName, cityName].filter(Boolean).join(" → ").toUpperCase(),
          }
        : null;
    const inboundTravel = travel
      ? {
          ...travel,
          meta: [
            travel.departLabel,
            travel.durationLabel,
            hasPickup && "PICKUP ADDED",
            hasDrop && "DROP ADDED",
          ]
            .filter(Boolean)
            .join(" · ")
            .toUpperCase(),
        }
      : null;

    // Stay: match on itinerary_city_id; placeholders carry no id.
    const cityHotels = S.filter((h) => h?.itinerary_city_id === c.id);
    const hotel = cityHotels.find((h) => !!h?.id) || null;
    const stars = hotel?.rating || hotel?.star_category || null;
    const roomCount = I?.hotels_config?.room_configuration?.length || null;

    const stay = hotel
      ? {
          bookingId: hotel.id,
          name: hotel.name || "",
          // `images[0].source` is the SUPPLIER name ("Agoda") — never a URL.
          imageKey: (hotel.images || []).find(Boolean)?.image || null,
          imageUrl: mediaUrlFromKey(
            (hotel.images || []).find(Boolean)?.image,
            STAY_THUMB_PX,
          ),
          meta: [
            stars ? `${stars}★` : null,
            roomCount ? `${roomCount} ROOM${roomCount === 1 ? "" : "S"}` : null,
            c?.duration ? `${c.duration} NIGHT${c.duration === 1 ? "" : "S"}` : null,
          ]
            .filter(Boolean)
            .join(" · ")
            .toUpperCase(),
          raw: hotel,
        }
      : null;

    // The gap CTA must not flash while hotels are still resolving, and never
    // appears on a P1 draft.
    const showStayGap = !hotel && gates.hotelsResolved && !gates.isDraft;

    // Intracity taxis only — airport transfers are already reflected above.
    const extras = (intracity[c.id] || []).map((t) => ({
      bookingId: t?.id ?? null,
      bookingType: String(t?.booking_type || "Taxi").split(",")[0] || "Taxi",
      transferType: t?.transfer_type ?? null,
      // Same glyph resolution the travel rows use — an extra IS a transfer, and
      // the booking object (not the label) is what tells a self-drive car from
      // a two-wheeler. Falls back to the neutral transfer accent, so this is
      // always a real key with an icon behind it.
      modeKey: getModeAccent(resolveModeKey(t)).key,
      isCombo: (comboChildren(t) || []).length > 0,
      name:
        t?.name ||
        (t?.is_airport_pickup
          ? "Taxi Pickup"
          : t?.is_airport_drop
            ? "Taxi Drop"
            : "Transfer"),
      meta: [transferModeLabel(t?.booking_type), t?.check_in?.split?.(" ")?.[0]]
        .filter(Boolean)
        .join(" · ")
        .toUpperCase(),
      dates: getDatesInRange(t?.check_in, t?.check_out) || [],
      raw: t,
    }));

    const offset = dayOffsetForCity(cities, i);
    const cityDays = Array.isArray(c?.day_by_day) ? c.day_by_day : [];

    const days = cityDays.map((day, j) => {
      const elements = (day?.slab_elements || []).filter((e) =>
        DAY_ELEMENT_TYPES.includes(resolveElementType(e)),
      );

      let paidActivityCount = 0;
      let freeIdeaCount = 0;
      let mealCount = 0;
      for (const e of elements) {
        const t = resolveElementType(e);
        if (t === "activity") {
          // Before the cart resolves, every activity reads unpaid.
          if (gates.pricingReady && isSelectedInCart(e)) paidActivityCount += 1;
          else freeIdeaCount += 1;
        } else if (t === "restaurant") mealCount += 1;
        else freeIdeaCount += 1;
      }

      const header = formatDayHeaderDate(day?.date);

      // The row leads with the CALENDAR date ("15 / SEP"), not the trip's day
      // index — "day 04" tells you nothing you can check against a boarding
      // pass or a hotel confirmation. `dayNumber` stays alongside it because
      // the day sheet's header still counts days, and because a day with no
      // date (an unscheduled draft) has nothing else to lead with.
      const dateObj = parseLocalDate(day?.date);

      return {
        key: `${c.id}-${day?.date || j}`,
        date: day?.date || null,
        dayIndex: j,
        dayNumber: String(offset + j + 1).padStart(2, "0"),
        dateDay: dateObj ? String(dateObj.getDate()) : null,
        dateMonth: dateObj ? SHORT_MONTHS[dateObj.getMonth()].toUpperCase() : null,
        title: day?.day_summary || "",
        dateMeta: header
          ? `${header.weekday} ${header.dayMonth} · ${cityName}`.toUpperCase()
          : cityName.toUpperCase(),
        dayLabel: header ? `${header.weekday} ${header.dayMonth}` : "",
        paidActivityCount,
        freeIdeaCount,
        mealCount,
        taxiChips: extras.filter((x) => x.dates.includes(day?.date)),
        items: elements.map((e) => {
          const t = resolveElementType(e);
          const kind =
            t === "activity"
              ? gates.pricingReady && isSelectedInCart(e)
                ? "booked"
                : "activity"
              : t === "restaurant"
                ? "food"
                : "poi";
          // The design's item meta is one mono line:
          //   "MORNING · 2H 30M · 4.5★ · CULTURE"
          // Every segment is optional — a POI with no rating simply drops that
          // segment rather than rendering a placeholder.
          const ratingRaw = Number(e?.rating);
          // One decimal, like the design — the API sends 4.38.
          const rating =
            Number.isFinite(ratingRaw) && ratingRaw > 0
              ? Math.round(ratingRaw * 10) / 10
              : null;
          const category = pickCategory(getDisplayTags(e));
          const metaParts = [
            getTimeOfDay(e?.time),
            getDurationLabel(e),
            rating ? `${rating}★` : null,
            category,
          ].filter(Boolean);
          return {
            id: e?.id ?? null,
            // What the detail sheet fetches with. The slab element's own `id`
            // is NOT the id any endpoint answers for — an activity is read by
            // its BOOKING id, a POI by `poi`, a restaurant by
            // `restaurants[0].id`. Same resolution the desktop day-by-day makes
            // before it opens POIDetailsDrawer.
            elementType: t,
            detailId: getItemId(e, t),
            kind,
            name: e?.name || e?.restaurants?.[0]?.name || e?.heading || "",
            imageUrl: getItemImage(e),
            meta: metaParts.join(" · ").toUpperCase(),
            timeOfDay: getTimeOfDay(e?.time) || null,
            durationLabel: getDurationLabel(e) || null,
            category,
            rating,
            raw: e,
          };
        }),
        raw: day,
      };
    });

    return {
      id: c.id,
      cityId: c?.city?.id ?? null,
      city: cityName,
      nights: c?.duration ?? 0,
      isTransit: !c?.duration,
      eyebrow: `LEG ${String(i + 1).padStart(2, "0")} · ${cityName.toUpperCase()}`,
      datesLabel: formatDateRange(
        c?.start_date || cityDays[0]?.date,
        c?.end_date || cityDays[cityDays.length - 1]?.date,
      ),
      anchor: `leg-${i}`,
      inboundTravel,
      travelGap,
      stay,
      showStayGap,
      stayGapMeta: [
        c?.duration ? `${c.duration} NIGHT${c.duration === 1 ? "" : "S"} OPEN` : null,
        formatDateRange(c?.start_date, c?.end_date),
      ]
        .filter(Boolean)
        .join(" · "),
      extras,
      days,
      raw: c,
    };
  });

  // Return leg — folded onto the last stop as `outboundTravel`.
  if (legs.length && endKey) {
    const last = cities[cities.length - 1];
    const outBooking = intercity[`${last?.id}:${endKey}`] || null;
    const out = buildTravel(outBooking, {
      originCityName: last?.city?.name,
      destCityName: I.end_city?.name,
    });
    legs[legs.length - 1].outboundTravel = out
      ? {
          ...out,
          // The city you fly back to, for the "FLY HOME · DELHI" eyebrow the
          // design gives this block. `title` is IATA ("SGN → DEL"), which is
          // right on the row and wrong as a heading.
          destName: I.end_city?.name || null,
          meta: [out.departLabel, out.durationLabel]
            .filter(Boolean)
            .join(" · ")
            .toUpperCase(),
        }
      : null;

    // Same hole, on the way home — and the same rule: the slot is claimed, so
    // say it is empty rather than drawing a journey nobody booked.
    legs[legs.length - 1].outboundGap =
      outBooking && !out && gates.transfersResolved && !gates.isDraft
        ? {
            destName: I.end_city?.name || null,
            meta: [last?.city?.name, I.end_city?.name]
              .filter(Boolean)
              .join(" → ")
              .toUpperCase(),
          }
        : null;
  }

  // ── ancillaries ────────────────────────────────────────────────────────────
  // Read the RAW bookings: `categorizeBookings` overwrites `booking_type` with
  // the category name and buries the real type under `.detail`. Both shapes are
  // accepted anyway — a caller that hands us the categorised list would
  // otherwise silently count zero of everything and hide the block.
  const anc = C?.summary?.Ancillaries?.bookings || A;
  const ancType = (b) =>
    b?.booking_type === "Ancillary"
      ? b?.detail?.booking_type || null
      : b?.booking_type || null;

  // `items` carries the BOOKING IDS, not just a tally: "Before you fly" opens
  // into the same detail sheet every other row does, and that sheet fetches
  // each booking from /bookings/ancillary/<id>/ (see AncillaryDetail).
  const ancItems = anc
    .map((b) => ({
      id: b?.id || null,
      type: ancType(b),
      name: b?.name || b?.detail?.name || null,
    }))
    .filter((item) => item.id && (item.type === "Visa" || item.type === "eSIM"));

  const ancillaries = {
    visaCount: ancItems.filter((item) => item.type === "Visa").length,
    esimCount: ancItems.filter((item) => item.type === "eSIM").length,
    items: ancItems,
  };

  return { gates, trip, legs, ancillaries };
}

export default buildTripViewModel;
