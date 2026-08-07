import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { currencySymbols } from "../../../../data/currencySymbols";
import FleetPicker from "./FleetPicker";
import { useFleetBookingSubmit } from "./useFleetBookingSubmit";

/**
 * The mixed-fleet block inside the taxi search modal.
 *
 * Kept separate from FleetPicker so the picker stays a dumb, reusable control — the multicity
 * drawer submits through its own "Update Transfer" bar and needs the same UI without this
 * booking path.
 */
const TaxiFleetSection = ({
  fleet,
  source,
  traceId,
  // Present when the modal is being used to *choose* rather than to book (the transfer edit
  // drawer collects a selection and submits it itself).
  handleTaxiSelect,
  booking_id,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  edge,
  selectedBooking,
  getPaymentHandler,
  setHideBookingModal,
  token,
  airportBooking,
  cityId,
  itineraryId,
  // Lets the parent grey out the convoy cards while a fleet option is being added, so only
  // the option actually being committed looks active.
  onBusyChange,
  // The mirror image: something OUTSIDE this block is being added, so freeze in place.
  externalBusy = false,
}) => {
  const currency = useSelector((state) => state.currency);
  const reduxItineraryId = useSelector((state) => state.ItineraryId);
  const [pickerKey, setPickerKey] = useState(0);
  // Which fleet row is mid-submit, so the loader lands on that one alone.
  const [pendingKey, setPendingKey] = useState(null);

  // Load More replaces the candidate list rather than appending to it, so a stale selection
  // could point at result_indexes that no longer exist. Remount the picker when the pool
  // changes rather than letting it hold ids the server would reject.
  const candidateSignature = useMemo(
    () => (fleet?.candidates || []).map((c) => c.result_index).join("|"),
    [fleet],
  );
  useEffect(() => {
    setPickerKey((key) => key + 1);
  }, [candidateSignature]);

  const { submit, loading } = useFleetBookingSubmit({
    itineraryId: itineraryId || reduxItineraryId,
    selectedBooking,
    token,
    airportBooking,
    cityId,
    origin_itinerary_city_id,
    destination_itinerary_city_id,
    edge,
    booking_id,
    getPaymentHandler,
    setHideBookingModal,
  });

  if (!fleet?.candidates?.length) return null;

  // The backend stamps the currency it priced in. Trust that over the redux preference: this
  // modal searches without a currency parameter, so redux can be reporting a currency the
  // amounts were never converted to.
  const currencySymbol =
    (fleet?.currency && currencySymbols?.[fleet.currency]) ||
    (currency?.currency && currencySymbols?.[currency.currency]) ||
    "₹";

  const handleAdd = async (vehicles, _summary, rowKey) => {
    if (!vehicles?.length) return;
    if (handleTaxiSelect) {
      // Selection mode: hand the choice back instead of booking, mirroring what the
      // single-cab card does with {trace_id, result_index}.
      handleTaxiSelect({ trace_id: traceId, vehicles });
      return;
    }
    setPendingKey(rowKey || null);
    onBusyChange?.(true);
    try {
      await submit({ source, trace_id: traceId, vehicles });
    } finally {
      // The modal usually closes on success, but a failed add has to hand the buttons back.
      setPendingKey(null);
      onBusyChange?.(false);
    }
  };

  return (
    <FleetPicker
      key={pickerKey}
      fleet={fleet}
      source={source}
      symbol={currencySymbol}
      pendingKey={pendingKey}
      busy={loading || Boolean(pendingKey) || externalBusy}
      onAdd={handleAdd}
    />
  );
};

export default TaxiFleetSection;
