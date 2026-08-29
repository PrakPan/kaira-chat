import React, { useState } from "react";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailBand from "../../revamp/common/components/bookingDetail/DetailBand";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import DetailSection from "../../revamp/common/components/bookingDetail/DetailSection";
import DrawerShell from "../../revamp/common/components/bookingDetail/DrawerShell";
import FactChips from "../../revamp/common/components/bookingDetail/FactChips";
import FleetVehicles from "../../revamp/common/components/bookingDetail/FleetVehicles";
import JourneyRail from "../../revamp/common/components/bookingDetail/JourneyRail";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import VehiclePhoto from "../../revamp/common/components/bookingDetail/VehiclePhoto";
import { getModeAccent } from "../../revamp/common/components/bookingDetail/modeAccent";
import {
  addMinutesToDate,
  arrivalOffsetLabel,
  dayOffset,
  formatDateTime,
  packageDayNodes,
  paxLabel,
  perDayFigure,
} from "../../revamp/common/components/bookingDetail/format";
import ComboTaxi from "../taxis/ComboTaxi";
import {
  getFleetManifest,
  getVehicleCount,
  MultiVehicleNote,
  VehicleCountBadge,
} from "../taxis/MultiVehicleInfo";
import {
  getCancellationPolicy,
  getVendorCharges,
  vendorChargeFacts,
} from "../taxis/VendorCharges";
import { currencySymbols } from "../../../data/currencySymbols";

const TaxiDetailModal = ({
  data,
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  oCityData,
  dCityData,
  setShowLoginModal,
  selectedBooking,
  handleClose,
  noChange,
  error,
  isAirport,
  setIsTransferDrawerOpen,
  handleEditRoute,
  hideVehicle,
}) => {
  const [showTaxi, setShowTaxi] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  const {
    transfer_details,
    number_of_adults,
    number_of_children,
    check_in,
    check_out,
    is_airport_drop,
    is_airport_pickup,
    transfer_type,
    status,
  } = data;

  const onDeleteClick = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      await handleDelete(booking || data);
    } finally {
      setDeleting(false);
    }
  };

  const accent = getModeAccent("Taxi");

  const departure =
    check_in ||
    transfer_details?.start_datetime ||
    transfer_details?.gozo?.start_date;
  const depart = formatDateTime(departure);
  const arrival = check_out
    ? formatDateTime(check_out)
    : addMinutesToDate(departure, transfer_details?.duration);

  const trip = transfer_details?.trips?.[0];
  const originName = trip?.origin?.address;
  const destinationName = trip?.destination?.address;

  const distance =
    transfer_details?.distance?.text ||
    (transfer_details?.distance?.value
      ? `${transfer_details.distance.value} km`
      : null);
  const durationText = transfer_details?.duration?.text;

  // Both shapes of the quote carry the same vehicle facts under different keys.
  const vehicle =
    transfer_details?.quote?.taxi_category || transfer_details?.quote?.vehicle;

  // When the cabs differ, `vehicle` is only the largest of them — everything derived from it
  // describes one car and misstates the rest.
  const fleet = getFleetManifest(data);

  // Optional extras the traveller actually PAID for (Mozio child seats, meet & greet, wifi,
  // ...). Mercury prunes the quote's amenity list down to the purchased set when it saves
  // the booking, so whatever is here was bought — the provider's full menu is not stored.
  // Their cost is already inside the booking total, which is why the section below states
  // what was bought rather than repeating a price.
  const purchasedExtras = (transfer_details?.quote?.amenities || []).filter(
    (item) => item && item.key,
  );

  // Whether tolls and state tax are inside this fare or collected at the kerb, per the
  // supplier. Empty for a source that does not itemise, and for anything booked before
  // mercury started recording it — the section below is hidden in both cases rather
  // than asserting "not included", which would be a worse lie than saying nothing.
  const vendorCharges = getVendorCharges(data);
  const fareIncludes = vendorChargeFacts(
    vendorCharges,
    // The block stamps its own currency, so prefer that over the booking's: an
    // itinerary whose currency was switched after booking rewrites the booking but
    // never the stored quote, and these amounts are still in the currency they were
    // quoted in.
    currencySymbols?.[vendorCharges?.currency || data?.currency] || "",
  );

  // A sightseeing package is sold by the day from a single pickup point, so it
  // has no drop address — its rail counts days rather than tracing a route.
  const isSightseeing = transfer_type === "sightseeing";
  const hasRoute = !!(originName && destinationName);
  const dayCount = Math.max(1, dayOffset(check_in, check_out) + 1);

  // A package's allowance is quoted as "80 kms per day" / "8 hours per day",
  // and every slot below already says so — in the chip's label, or in the word
  // after the day count — so the supplier's suffix comes off first.
  const perDayDistance = isSightseeing ? perDayFigure(distance) : distance;
  const perDayDuration = isSightseeing ? perDayFigure(durationText) : durationText;

  const modeLabel = is_airport_pickup
    ? "Airport pickup"
    : is_airport_drop
      ? "Airport drop"
      : isSightseeing
        ? "Sightseeing"
        : "Taxi transfer";

  // >1 when the group did not fit in one cab, so the booking covers a convoy.
  // Every spec below (seats, bags, fuel) describes a single cab in that case.
  const vehicleCount = getVehicleCount(data);
  const travellerCount =
    (number_of_adults || 0) +
    (number_of_children || 0) +
    (data?.number_of_infants || 0);

  const title =
    data?.name ||
    (hasRoute ? `Taxi from ${originName} to ${destinationName}` : modeLabel);

  // What the band states in one line: a route leg is summarised by how far and
  // how long, a day package by how many days it runs for.
  const summary = isSightseeing
    ? `${dayCount} ${dayCount === 1 ? "day" : "days"}${perDayDuration ? ` · ${perDayDuration} daily` : ""}`
    : [durationText, distance].filter(Boolean).join(" · ");

  const kicker = isSightseeing
    ? [depart?.date, arrival?.date].filter(Boolean).join(" – ")
    : ["Taxi", depart?.date].filter(Boolean).join(" · ");

  const nodes = (() => {
    // Sightseeing: one node per day at the traveller's disposal.
    if (isSightseeing && !hasRoute) {
      return packageDayNodes({
        start: check_in,
        days: dayCount,
        meta:
          [perDayDuration, perDayDistance].filter(Boolean).join(" · ") || null,
        pickup: originName,
      });
    }

    return [
      {
        kind: "place",
        key: "from",
        time: depart?.time,
        date: depart?.shortDate,
        title: trip?.origin?.city_name || originName || "Pickup",
        subtitle: trip?.origin?.city_name ? originName : null,
      },
      {
        kind: "carrier",
        key: "car",
        name: vehicle?.type || "Taxi",
        meta: [distance, durationText].filter(Boolean).join(" · ") || null,
      },
      {
        kind: "place",
        key: "to",
        time: arrival?.time,
        date: arrival?.shortDate,
        title: trip?.destination?.city_name || destinationName || "Drop",
        subtitle: trip?.destination?.city_name ? destinationName : null,
        // A package spans days by design — the car is at the traveller's
        // disposal for each of them, which is why its distance and duration are
        // quoted per day — so its last date is not a late arrival. Warning that
        // a car booked in Munnar "arrives 3 days later" in Munnar reads as
        // something having gone wrong.
        tag: isSightseeing
          ? null
          : arrivalOffsetLabel(dayOffset(check_in, check_out)),
      },
    ];
  })();

  const handleChangeTransfer = () => {
    if (isAirport) {
      setIsTransferDrawerOpen(true);
      return;
    }
    handleEditRoute(data);
  };

  const canChange = !isEmbedded && !noChange;
  const canDelete = !!handleDelete && type !== "combo";

  if (showTaxi) {
    return (
      <ComboTaxi
        key={data.id}
        edge={data?.edge}
        combo={false}
        showTaxiModal={showTaxi}
        setShowComboTaxiModal={setShowTaxi}
        setHideTaxiModal={() => setShowTaxi(false)}
        getPaymentHandler={getPaymentHandler}
        _updatePaymentHandler={_updatePaymentHandler}
        _updateFlightBookingHandler={_updateFlightBookingHandler}
        selectedBooking={data}
        itinerary_id={data?.itinerary_id}
        setShowLoginModal={setShowLoginModal}
        mercuryTransfer={data}
        originCityId={data?.trips?.[0]?.origin?.city_id}
        destinationCityId={data?.trips?.[0]?.destination?.city_id}
        comboStartDate={data?.trips?.[0]?.start_date || selectedBooking?.start_date}
        comboStartTime={data?.trips?.[0]?.start_time || "12:00"}
        dCityData={dCityData}
        oCityData={oCityData}
      />
    );
  }

  if (error) {
    return (
      <DrawerShell band={<DetailBand mode="Taxi" onBack={handleClose} loading />}>
        <DetailError />
      </DrawerShell>
    );
  }

  const body = (
    <>
      <JourneyRail nodes={nodes} accent={accent} />

      <DetailSection label={isSightseeing ? "Package" : "Booking"}>
        <FactChips
          facts={[
            {
              label: "Travellers",
              value: paxLabel(number_of_adults, number_of_children),
            },
            isSightseeing
              ? { label: "Per day", value: perDayDistance }
              : { label: "Distance", value: distance },
            isSightseeing ? { label: "Hours", value: perDayDuration } : null,
          ].filter(Boolean)}
        />
      </DetailSection>

      {/* `hideVehicle` is set by a package drawer that has already put this exact car
          at the top as "the car, throughout" — the legs of a multi-city chain share
          their vehicles, so each of them repeating the same photo and the same five
          chips pushes the leg's own detail off the screen. It is passed per leg and
          only when the car really matches, so a leg that rides in something else
          still describes it. */}
      {(vehicle || fleet) && !hideVehicle && (
        <DetailSection
          label="Vehicle"
          // Count, not the fleet label: the note and the per-cab cards directly
          // below both spell the composition out, and a 60-character label in a
          // header opposite the word "Vehicle" is three cramped lines on a phone.
          right={<VehicleCountBadge count={vehicleCount} />}
        >
          {/* A convoy prices and describes one cab, so say so before the specs
              below are read as covering the whole group. */}
          <MultiVehicleNote
            count={vehicleCount}
            fleet={fleet}
            className="mx-4 mb-4"
          >
            {fleet?.is_mixed ? (
              <>
                This booking includes {fleet.label}
                {travellerCount > 0
                  ? ` for your ${travellerCount} traveller${travellerCount > 1 ? "s" : ""}`
                  : ""}
                {fleet.seats ? ` — ${fleet.seats} seats in total` : ""}. Each
                vehicle is listed below.
              </>
            ) : (
              <>
                This booking includes {vehicleCount} taxis
                {travellerCount > 0
                  ? ` for your ${travellerCount} traveller${travellerCount > 1 ? "s" : ""}`
                  : ""}
                {vehicle?.seating_capacity
                  ? ` — one ${vehicle.seating_capacity}-seater cannot fit everyone`
                  : ""}
                . The details below describe a single taxi.
              </>
            )}
          </MultiVehicleNote>

          {/* One hero photo of the largest cab would misrepresent a mixed fleet,
              so every cab gets the same full write-up instead. */}
          {fleet?.is_mixed ? (
            <FleetVehicles vehicles={fleet.vehicles} />
          ) : (
            <VehiclePhoto
              image={vehicle?.image}
              alt={vehicle?.type}
              vehicleType={vehicle?.type}
              modelName={vehicle?.model_name}
              mode="Taxi"
            />
          )}

          <FactChips
            facts={
              fleet?.is_mixed
                ? // The fleet label is already the badge and the note above, and
                  // the cards name each cab — what is left to add is the totals.
                  [
                    { label: "Taxis", value: vehicleCount },
                    { label: "Total seats", value: fleet.seats },
                    { label: "Total bags", value: fleet.bags },
                  ]
                : [
                    { label: "Class", value: vehicle?.type },
                    { label: "Model", value: vehicle?.model_name },
                    { label: "Fuel", value: vehicle?.fuel_type },
                    {
                      label: vehicleCount > 1 ? "Seats / taxi" : "Seats",
                      value: vehicle?.seating_capacity,
                    },
                    {
                      label: vehicleCount > 1 ? "Bags / taxi" : "Bags",
                      value: vehicle?.bag_capacity,
                    },
                    {
                      label: "Taxis",
                      value: vehicleCount > 1 ? vehicleCount : null,
                    },
                    {
                      // Lead capacity x count, which only holds when the cabs
                      // are identical. getFleetSeats covers the mixed case.
                      label: "Total seats",
                      value:
                        vehicleCount > 1 && vehicle?.seating_capacity
                          ? vehicle.seating_capacity * vehicleCount
                          : null,
                    },
                  ]
            }
          />
        </DetailSection>
      )}

      {/* What was added on top of the fare. Rendered only when something was bought, so
          every non-Mozio taxi (and every Mozio taxi booked without extras) is unchanged.
          No prices here on purpose: their cost is already inside the booking total shown
          above, and repeating it per line invites reading them as an extra charge still
          to come. What is useful at this point is WHAT was bought, hence the description. */}
      {purchasedExtras.length ? (
        <DetailSection label="Extras">
          <div className="flex flex-col gap-2 px-4 pb-4">
            {purchasedExtras.map((item) => (
              <div key={item.key}>
                <div className="text-[12.5px] font-600 text-[#0b1220]">
                  {item.name || item.key}
                </div>
                {item.description ? (
                  <div className="text-[11.5px] leading-snug text-[#8a93a6]">
                    {item.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {/* What the booked fare covers and how it cancels, as the supplier stated it at
          the time of booking. The figures are the SUPPLIER's — they reconcile with the
          taxi's own price, not with the booking total, which carries our service fee
          and GST on top. Both disappear entirely when the supplier stated neither.

          The policy is read through the resolver rather than off the booking's own
          keys: only a handful of sources put it at the top level, and every Gozo taxi
          carries it down on `transfer_details.quote.price`, where a flat lookup finds
          nothing and silently renders no policy at all.

          Both are withheld inside a combo rail. Every leg of a chain is sold on one
          supplier's quote, so a leg answers these identically to its siblings, and
          repeating the same three chips and the same page of policy under each service
          buries the leg's own detail. The package drawer collects them across the legs
          and states them once, below all of them — see `collectAcrossLegs` in
          TransferDrawer, which also covers the case where the legs DON'T agree. */}
      {!isEmbedded && fareIncludes.length ? (
        <DetailSection label="Fare includes">
          <FactChips facts={fareIncludes} />
        </DetailSection>
      ) : null}

      {!isEmbedded ? <PolicyNote html={getCancellationPolicy(data)} /> : null}
    </>
  );

  // Embedded in a combo's rail: the node it expands from already names the leg
  // and owns the band, scroll pane and action bar, so the body contributes its
  // rail and sections only.
  if (isEmbedded) return <div className="flex flex-col">{body}</div>;

  return (
    <DrawerShell
      band={
        <DetailBand
          mode="Taxi"
          title={title}
          kicker={kicker}
          summary={summary}
          status={status}
          onBack={handleClose}
          loading={loading}
        />
      }
      footer={
        canDelete || canChange ? (
          <BookingDetailActions
            onDelete={canDelete ? onDeleteClick : undefined}
            deleting={deleting}
            deleteDisabled={loading}
            confirmItemLabel="transfer"
            onChange={canChange ? handleChangeTransfer : undefined}
            changeLabel="Change Transfer"
            changeDisabled={loading}
          />
        ) : null
      }
    >
      {body}
    </DrawerShell>
  );
};

export default TaxiDetailModal;
