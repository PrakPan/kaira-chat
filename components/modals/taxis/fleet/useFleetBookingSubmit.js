import { useState } from "react";
import { replaceUrl } from "../../../../helper/historyUrl";
import { useDispatch } from "react-redux";

import { axiosTaxiBooking } from "../../../../services/bookings/UpdateTaxiGozo";
import { updateFlightBookingWarning } from "../../../../services/bookings/UpdateBookings";
import { openNotification } from "../../../../store/actions/notification";
import {
  updateAirportTransferBooking,
  updateSingleTransferBooking,
} from "../../../../store/actions/transferBookingsStore";

/**
 * Book several taxis at once: one POST, one TransferBooking, several cabs.
 *
 * Mirrors the flow in taxi-searched/sectionone/Route.js — warning pre-flight, booking POST,
 * redux update, payment refresh — rather than extracting it. Route.js also owns a warning
 * modal, analytics and a page-reload branch, and it is the path every existing taxi booking
 * goes through; refactoring it to serve both would put the working path at risk for the sake
 * of forty shared lines. Keep them in step by hand.
 *
 * The ONLY wire difference from a single-cab booking is `vehicles` in place of
 * `result_index`. The backend branches on `vehicles` first and composes the selection into
 * one quote, so everything downstream of that is the ordinary code path. It validates
 * nothing about seats or car count - the customer's selection is taken as given.
 */
export const useFleetBookingSubmit = ({
  itineraryId,
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
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const resolvedItineraryId = itineraryId || selectedBooking?.itinerary_id;

  const notifyError = (error, fallback) => {
    // The API layer wraps 4xx as {success: false, errors: [{message: [...]}]}, but the view
    // layer emits a bare {message: "..."} for its own guards. Read both before giving up,
    // otherwise a real explanation shows as a generic failure.
    const data = error?.response?.data;
    const message =
      data?.errors?.[0]?.message?.[0] ||
      data?.errors?.[0]?.message ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      fallback;

    dispatch(
      openNotification({
        type: "error",
        text: message,
        heading: "Error!",
      }),
    );
  };

  const book = async (requestData) => {
    const response = await axiosTaxiBooking.post(
      `${resolvedItineraryId}/bookings/taxi/`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    dispatch(
      openNotification({
        type: "success",
        text: "Taxis added successfully.",
        heading: "Success!",
      }),
    );

    if (airportBooking) {
      dispatch(updateAirportTransferBooking(`${cityId}`, response.data));
    } else {
      dispatch(
        updateSingleTransferBooking(
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
          response.data,
        ),
      );
    }

    getPaymentHandler?.();
    setHideBookingModal?.();

    if (response.data?.is_refresh_needed) {
      const url = new URL(window.location);
      ["drawer", "booking_id", "flight_modal", "modal", "edit"].forEach((param) =>
        url.searchParams.delete(param),
      );
      replaceUrl(url.toString());
      setTimeout(() => window.location.reload(), 200);
    }

    return response.data;
  };

  /**
   * @param {{source: string, trace_id: string, vehicles: {result_index: string, quantity: number}[]}} selection
   */
  const submit = async ({ source, trace_id, vehicles }) => {
    if (!vehicles?.length) return null;

    const requestData = {
      booking_id,
      source,
      trace_id,
      vehicles,
      source_itinerary_city: origin_itinerary_city_id,
      destination_itinerary_city: destination_itinerary_city_id,
      edge,
    };

    setLoading(true);
    try {
      // Same pre-flight the single-cab path runs. The warning view reads named keys off
      // request.data and ignores the rest, so the extra `vehicles` key is inert here.
      const warning = await updateFlightBookingWarning.post(
        `${resolvedItineraryId}/transfers/taxi/warning/`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (warning?.data?.show_warning === true) {
        // Surfacing this needs the confirm modal that lives in Route.js. Until the fleet
        // section grows one, say what happened rather than booking behind a warning the
        // customer never saw.
        dispatch(
          openNotification({
            type: "warning",
            text:
              warning.data.warning ||
              "This change needs confirmation. Please pick a single taxi for now.",
            heading: "Please confirm",
          }),
        );
        return null;
      }

      return await book(requestData);
    } catch (error) {
      notifyError(
        error,
        "There seems to be a problem, please try again after some time!",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};

export default useFleetBookingSubmit;
