import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { FlightSegment } from "../../../containers/itinerary/TransfersContainer/FlightDetail";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailCard from "../../revamp/common/components/bookingDetail/DetailCard";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import StatusPill from "../../revamp/common/components/bookingDetail/StatusPill";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { openNotification } from "../../../store/actions/notification";
import { useAnalytics } from "../../../hooks/useAnalytics";
import LogoContainer from "../flights/new-flight-searched/LogoContainer";
import FlightDetails from "../flights/new-flight-searched/FlightDetails";
import { convertMinutesToHours } from "../flights/new-flight-searched/Index";

const LOGO_SIZE = 44;

const FlightDetailModal = ({
  segments,
  fareRule,
  setShowDetails,
  name,
  booking_id,
  originCityId,
  destinationCityId,
  drawer,
  isEmbedded,
  handleClose,
  getPaymentHandler,
  error,
  setShowLoginModal,
  handleEditRoute,
  data,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const { trackTransferBookingDelete } = useAnalytics();

  const [loading, setLoading] = useState(false);

  const fareRules = fareRule?.fareRuleDetail;
  const item = data?.transfer_details?.items?.[0];
  const airline = segments?.[0]?.airline;
  const lastSegment = segments?.[segments?.length - 1];

  const totalPax =
    (data?.number_of_adults || 0) +
    (data?.number_of_children || 0) +
    (data?.number_of_infants || 0);

  const duration = (() => {
    const raw =
      item?.segments?.[segments?.length - 1]?.accumulated_duration ||
      item?.segments?.[0]?.duration;
    return typeof raw === "number" ? convertMinutesToHours(raw) : raw;
  })();

  const handleDelete = async () => {
    if (!localStorage.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/flight/${booking_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(booking_id));
        getPaymentHandler();
        trackTransferBookingDelete(router.query.id, booking_id, id);
        setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: "Booking deleted Successfully",
            heading: "Success!",
          }),
        );
        handleClose();
        const bodyStyle = window.getComputedStyle(document.body).overflow;
        if (bodyStyle === "hidden") {
          document.body.style.overflow = "initial";
        }
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.transfer_details?.items?.[0]?.errors?.[0]
          ?.message?.[0] || err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        }),
      );
      setLoading(false);
    }
  };

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
      {/* The flight itself — who flies it, and the shape of the journey. */}
      <DetailCard
        label={isEmbedded ? null : "Flight"}
        title={airline?.name}
        subtitle={
          airline?.code
            ? `${airline.code}-${airline.flight_number}${
                totalPax ? ` · ${totalPax} traveller${totalPax > 1 ? "s" : ""}` : ""
              }`
            : null
        }
        right={
          data?.status ? (
            <StatusPill status={data.status} />
          ) : item?.is_refundable ? (
            <span className="ttw-type-small font-600 bg-[#e7f5ee] text-[#1f7a52] border border-[#c7e7d7] px-2.5 py-1 rounded-full whitespace-nowrap">
              Refundable
            </span>
          ) : null
        }
        bodyClassName="px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          >
            <LogoContainer
              data={item || segments}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
          </div>

          <FlightDetails
            data={item}
            origin={segments?.[0]?.origin}
            destination={lastSegment?.destination}
            duration={duration}
            isNonStop={segments?.length === 1}
            numStops={(segments?.length || 1) - 1}
            segments={segments}
            setShowDetails={setShowDetails}
          />
        </div>
      </DetailCard>

      {/* Leg-by-leg: airports, terminals, layovers. */}
      {segments?.length > 0 && (
        <DetailCard label="Itinerary">
          <FlightSegment
            segments={segments}
            originCityId={originCityId}
            destinationCityId={destinationCityId}
            combo={isEmbedded}
          />
        </DetailCard>
      )}

      <PolicyNote html={fareRules} title="Fare details & rules" />
    </>
  );

  if (isEmbedded) return <div className="flex flex-col">{body}</div>;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 max-ph:px-4 pb-6">
        <BookingDetailHeader
          title={drawer ? null : name}
          onBack={handleClose}
        />
        <div className="pt-2">{body}</div>
      </div>

      {/* Remove (left) + Change (right) — pinned action bar */}
      <div className="sticky bottom-0 z-10 border-t border-[#ececec] bg-white px-6 max-ph:px-4 py-4">
        <BookingDetailActions
          onDelete={handleDelete}
          deleting={loading}
          confirmItemLabel="flight"
          onChange={
            !drawer && typeof handleEditRoute === "function"
              ? () => handleEditRoute()
              : undefined
          }
          changeLabel="Change Transfer"
          changeDisabled={loading}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default FlightDetailModal;
