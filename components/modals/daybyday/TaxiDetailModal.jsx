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
  paxLabel,
  railStamp,
} from "../../revamp/common/components/bookingDetail/format";
import ComboTaxi from "../taxis/ComboTaxi";
import {
  getFleetManifest,
  getVehicleCount,
  MultiVehicleNote,
  VehicleCountBadge,
} from "../taxis/MultiVehicleInfo";

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

  // A sightseeing package is sold by the day from a single pickup point, so it
  // has no drop address — its rail counts days rather than tracing a route.
  const isSightseeing = transfer_type === "sightseeing";
  const hasRoute = !!(originName && destinationName);
  const dayCount = Math.max(1, dayOffset(check_in, check_out) + 1);

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
    ? `${dayCount} ${dayCount === 1 ? "day" : "days"}${durationText ? ` · ${durationText} daily` : ""}`
    : [durationText, distance].filter(Boolean).join(" · ");

  const kicker = isSightseeing
    ? [depart?.date, arrival?.date].filter(Boolean).join(" – ")
    : ["Taxi", depart?.date].filter(Boolean).join(" · ");

  const nodes = (() => {
    // Sightseeing: one node per day at the traveller's disposal.
    if (isSightseeing && !hasRoute) {
      return Array.from({ length: dayCount }, (_, i) => {
        const stamp = railStamp(check_in, i);
        return {
          kind: "day",
          key: `day-${i}`,
          time: `Day ${i + 1}`,
          date: stamp.date,
          title: "At your disposal",
          subtitle: [durationText, distance].filter(Boolean).join(" · ") || null,
          tag: i === 0 && originName ? `Pickup: ${originName}` : null,
        };
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
        tag: arrivalOffsetLabel(dayOffset(check_in, check_out)),
        tagTone: "warn",
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
              ? { label: "Per day", value: distance }
              : { label: "Distance", value: distance },
            isSightseeing ? { label: "Hours", value: durationText } : null,
          ].filter(Boolean)}
        />
      </DetailSection>

      {(vehicle || fleet) && (
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

      <PolicyNote html={data?.cancellation_policy} />
      <PolicyNote html={data?.cancellation_policies} />
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
