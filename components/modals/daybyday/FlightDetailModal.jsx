import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailBand from "../../revamp/common/components/bookingDetail/DetailBand";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import DetailSection from "../../revamp/common/components/bookingDetail/DetailSection";
import DrawerShell from "../../revamp/common/components/bookingDetail/DrawerShell";
import FactChips from "../../revamp/common/components/bookingDetail/FactChips";
import JourneyRail from "../../revamp/common/components/bookingDetail/JourneyRail";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import { getModeAccent } from "../../revamp/common/components/bookingDetail/modeAccent";
import {
  formatDateTime,
  formatMinutes,
} from "../../revamp/common/components/bookingDetail/format";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { openNotification } from "../../../store/actions/notification";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { Logo } from "../flights/new-flight-searched/LogoContainer";

/** Airline mark, hard-constrained against the app's unscoped img rules. */
const AirlineMark = ({ code }) => (
  <span
    className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white"
    style={{ width: 18, height: 18 }}
  >
    <Logo src={code} ht={18} wd={18} />
  </span>
);

const FlightDetailModal = ({
  segments,
  fareRule,
  name,
  booking_id,
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

  const accent = getModeAccent("Flight");

  const legs = segments || [];
  const item = data?.transfer_details?.items?.[0];
  const first = legs[0];
  const last = legs[legs.length - 1];

  const totalPax =
    (data?.number_of_adults || 0) +
    (data?.number_of_children || 0) +
    (data?.number_of_infants || 0);

  const depart = formatDateTime(first?.origin?.departure_time);

  const totalDuration = (() => {
    const raw =
      item?.segments?.[legs.length - 1]?.accumulated_duration ||
      item?.segments?.[0]?.duration;
    return typeof raw === "number" ? formatMinutes(raw) : raw || null;
  })();

  const stops = Math.max(0, legs.length - 1);

  // Terminals arrive as "Terminal 3" from some suppliers and a bare "3" from
  // others, so only prefix the ones that need it.
  const terminalOf = (point) =>
    point?.terminal
      ? String(point.terminal).toLowerCase().includes("terminal")
        ? point.terminal
        : `Terminal ${point.terminal}`
      : null;

  const placeOf = (point, index, isArrival) => {
    const dt = formatDateTime(
      isArrival ? point?.arrival_time : point?.departure_time,
    );
    return {
      kind: "place",
      key: `${isArrival ? "arr" : "dep"}-${index}`,
      time: dt?.time,
      date: dt?.shortDate,
      title: [point?.airport_code, point?.city_name].filter(Boolean).join(" · "),
      subtitle: [point?.airport_name, terminalOf(point)].filter(Boolean).join(" · "),
    };
  };

  const nodes = (() => {
    const out = [];
    legs.forEach((segment, index) => {
      out.push(placeOf(segment?.origin, index, false));

      out.push({
        kind: "carrier",
        key: `air-${index}`,
        icon: segment?.airline?.code ? (
          <AirlineMark code={segment.airline.code} />
        ) : null,
        name: segment?.airline?.name || null,
        meta: [
          segment?.airline?.code && segment?.airline?.flight_number
            ? `${segment.airline.code} ${segment.airline.flight_number}`
            : null,
          formatMinutes(segment?.duration),
        ]
          .filter(Boolean)
          .join(" · "),
      });

      if (index === legs.length - 1) {
        out.push(placeOf(segment?.destination, index, true));
        return;
      }

      out.push({
        ...placeOf(segment?.destination, index, true),
        key: `stop-${index}`,
      });

      const ground = legs[index + 1]?.ground_time;
      if (ground) {
        out.push({
          kind: "wait",
          key: `wait-${index}`,
          name: "Change of planes",
          meta: `${formatMinutes(ground) || ground} layover`,
        });
      }
    });
    return out;
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
      <DrawerShell
        embedded={isEmbedded}
        band={<DetailBand mode="Flight" onBack={handleClose} loading />}
      >
        <DetailError />
      </DrawerShell>
    );
  }

  const body = (
    <>
      <JourneyRail nodes={nodes} accent={accent} />

      <DetailSection label="Booking">
        <FactChips
          facts={[
            {
              label: "Travellers",
              value: totalPax
                ? `${totalPax} traveller${totalPax > 1 ? "s" : ""}`
                : null,
            },
            {
              label: "Cabin",
              value: first?.airline?.cabin_class || first?.cabin_class,
            },
            { label: "Baggage", value: first?.baggage_allowance },
            { label: "Cabin bag", value: first?.cabin_baggage_allowance },
            { label: "Refundable", value: item?.is_refundable ? "Yes" : null },
          ]}
        />
      </DetailSection>

      <PolicyNote html={fareRule?.fareRuleDetail} title="Fare rules" />
    </>
  );

  if (isEmbedded) return <div className="flex flex-col">{body}</div>;

  return (
    <DrawerShell
      band={
        <DetailBand
          mode="Flight"
          title={drawer ? null : name}
          kicker={["Flight", depart?.date].filter(Boolean).join(" · ")}
          summary={[
            totalDuration,
            stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`,
          ]
            .filter(Boolean)
            .join(" · ")}
          status={data?.status}
          onBack={handleClose}
        />
      }
      footer={
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
      }
    >
      {body}
      <ToastContainer />
    </DrawerShell>
  );
};

export default FlightDetailModal;
