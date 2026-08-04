import React, { useState } from "react";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailCard from "../../revamp/common/components/bookingDetail/DetailCard";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import FactList from "../../revamp/common/components/bookingDetail/FactList";
import ModeThumb from "../../revamp/common/components/bookingDetail/ModeThumb";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import RouteStrip from "../../revamp/common/components/bookingDetail/RouteStrip";
import StatusPill from "../../revamp/common/components/bookingDetail/StatusPill";
import VehiclePhoto from "../../revamp/common/components/bookingDetail/VehiclePhoto";
import ComboTaxi from "../taxis/ComboTaxi";

const formatDateTime = (dateString) => {
  if (!dateString) return {};
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return {};
  return {
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const addMinutesToDate = (dateString, minutes) => {
  if (!dateString || typeof minutes !== "number") return {};
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return {};
  date.setMinutes(date.getMinutes() + minutes);
  return formatDateTime(date.toISOString());
};

const paxLabel = (adults, children) =>
  [
    adults ? `${adults} adult${adults > 1 ? "s" : ""}` : null,
    children ? `${children} child${children > 1 ? "ren" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ") || null;

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
  noHeading,
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
  const routeMeta = [distance, durationText].filter(Boolean).join(" · ");

  // Both shapes of the quote carry the same vehicle facts under different keys.
  const vehicle =
    transfer_details?.quote?.taxi_category || transfer_details?.quote?.vehicle;

  // A sightseeing package is sold by the day from a single pickup point, so it
  // has no drop address to point a route at — its facts go in a list instead.
  const isSightseeing = transfer_type === "sightseeing";
  const hasRoute = !!(originName && destinationName);

  const modeLabel = is_airport_pickup
    ? "Airport pickup"
    : is_airport_drop
      ? "Airport drop"
      : isSightseeing
        ? "Sightseeing taxi"
        : "Taxi transfer";

  const title =
    data?.name ||
    (hasRoute ? `Taxi from ${originName} to ${destinationName}` : modeLabel);

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
      <div className="bg-white w-full h-full flex flex-col">
        {!isEmbedded && (
          <BookingDetailHeader onBack={handleClose} className="px-6 max-ph:px-4" />
        )}
        <DetailError />
      </div>
    );
  }

  const body = (
    <>
      {/* Journey — where it picks up, where it drops, and what that costs in
          distance and time. A sightseeing package has no drop point, so it
          falls back to the dates it covers. */}
      <DetailCard
        label={isEmbedded ? null : "Journey"}
        title={modeLabel}
        subtitle={depart?.date}
        right={status ? <StatusPill status={status} /> : null}
      >
        {hasRoute ? (
          <RouteStrip
            origin={{ name: originName, time: depart?.time, date: depart?.date }}
            destination={{
              name: destinationName,
              time: arrival?.time,
              date: arrival?.date,
            }}
            meta={routeMeta}
          />
        ) : (
          <FactList
            columns={2}
            facts={[
              { label: "Pick-up", value: originName },
              {
                label: "Starts",
                value: depart?.time ? `${depart.date} · ${depart.time}` : depart?.date,
              },
              {
                label: "Ends",
                value: arrival?.time
                  ? `${arrival.date} · ${arrival.time}`
                  : arrival?.date,
              },
              { label: isSightseeing ? "Distance limit" : "Distance", value: distance },
              { label: "Duration", value: durationText },
            ]}
          />
        )}

        <FactList
          className="border-t border-[#ececec]"
          facts={[
            {
              label: "Travellers",
              value: paxLabel(number_of_adults, number_of_children),
            },
          ]}
        />
      </DetailCard>

      {/* Vehicle — the car itself, then its specs as a grid. */}
      {vehicle && (
        <DetailCard label="Vehicle" title={vehicle?.type || "Taxi"}>
          <VehiclePhoto image={vehicle?.image} alt={vehicle?.type} />

          <FactList
            columns={2}
            facts={[
              { label: "Model", value: vehicle?.model_name },
              { label: "Fuel type", value: vehicle?.fuel_type },
              { label: "Luggage bags", value: vehicle?.bag_capacity },
              { label: "Seat capacity", value: vehicle?.seating_capacity },
            ]}
          />
        </DetailCard>
      )}

      <PolicyNote html={data?.cancellation_policy} />
      <PolicyNote html={data?.cancellation_policies} />
    </>
  );

  // Embedded: the combo drawer already owns the scroll pane, the header and the
  // action bar, so the leg contributes its cards and nothing else.
  if (isEmbedded) {
    return (
      <div className="flex flex-col">
        {!noHeading && (
          <h3 className="ttw-type-h4 text-[#0b1220] mb-3">{title}</h3>
        )}
        {body}
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 max-ph:px-4 pb-6">
        <BookingDetailHeader
          title={title}
          loading={loading}
          onBack={handleClose}
          leading={
            !loading ? (
              <ModeThumb mode="Taxi" image={vehicle?.image} alt={vehicle?.type} />
            ) : null
          }
        />
        <div className="pt-2">{body}</div>
      </div>

      {/* Remove (left) + Change (right) — pinned action bar */}
      {(canDelete || canChange) && (
        <div className="sticky bottom-0 z-10 border-t border-[#ececec] bg-white px-6 max-ph:px-4 py-4">
          <BookingDetailActions
            onDelete={canDelete ? onDeleteClick : undefined}
            deleting={deleting}
            deleteDisabled={loading}
            confirmItemLabel="transfer"
            onChange={canChange ? handleChangeTransfer : undefined}
            changeLabel="Change Transfer"
            changeDisabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default TaxiDetailModal;
