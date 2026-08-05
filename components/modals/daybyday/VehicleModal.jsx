import React, { useState } from "react";
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
  addMinutesToDate,
  dayOffset,
  formatDateTime,
  formatMinutes,
  paxLabel,
} from "../../revamp/common/components/bookingDetail/format";

/** An operator's logo, hard-constrained against the app's unscoped img rules. */
const OperatorLogo = ({ src, name }) => (
  <span
    className="flex items-center justify-center shrink-0"
    style={{ height: 15, maxWidth: 68 }}
  >
    <img
      src={src}
      alt={name || "Operator"}
      // Sized and painted inline: the app ships unscoped `img {}` rules that
      // force `object-fit: cover` and a hero-image blur/desaturate filter, and
      // no utility class can out-specify a filter nothing else sets.
      style={{
        display: "block",
        height: "100%",
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        margin: 0,
        filter: "none",
      }}
    />
  </span>
);

const VehicleDetailModal = ({
  data,
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded,
  error,
  handleClose,
  handleEditRoute,
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  const {
    name,
    transfer_details,
    number_of_adults,
    number_of_children,
    check_in,
    check_out,
    booking_type,
    cancellation_policies,
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

  const mode = booking_type || transfer_details?.mode;
  const accent = getModeAccent(mode);

  const departure =
    check_in ||
    transfer_details?.start_datetime ||
    transfer_details?.gozo?.start_date;
  const depart = formatDateTime(departure);
  const arrival = check_out
    ? formatDateTime(check_out)
    : addMinutesToDate(departure, transfer_details?.duration);

  const distance =
    transfer_details?.distance?.text ||
    (transfer_details?.distance ? `${transfer_details.distance} km` : null);

  const travelClass =
    transfer_details?.prices?.[0]?.class ||
    transfer_details?.results?.[0]?.prices?.[0]?.class_name;

  // Omio / 12go itineraries carry their own leg-by-leg breakdown; direct
  // suppliers don't, and the two cities are the whole story for them.
  const segments = transfer_details?.results?.[0]?.segments || [];

  const totalDuration =
    transfer_details?.duration?.text ||
    formatMinutes(transfer_details?.results?.[0]?.duration);
  const crossesMidnight = dayOffset(check_in, check_out) > 0;

  // The rail is built from segments when the supplier sent them — a connection
  // becomes a mid-rail node rather than a nested card — and from the booking's
  // own two cities when it didn't.
  const nodes = (() => {
    if (!segments.length) {
      return [
        {
          kind: "place",
          key: "from",
          time: depart?.time,
          date: depart?.shortDate,
          title: transfer_details?.source?.city_name || "Departure",
          subtitle: transfer_details?.source?.station_name || null,
        },
        {
          kind: "carrier",
          key: "leg",
          name: transfer_details?.operator?.name || mode || "Transfer",
          meta: [totalDuration, distance].filter(Boolean).join(" · ") || null,
        },
        {
          kind: "place",
          key: "to",
          time: arrival?.time,
          date: arrival?.shortDate,
          title: transfer_details?.destination?.city_name || "Arrival",
          subtitle: transfer_details?.destination?.station_name || null,
          tag: crossesMidnight ? "Arrives next day" : null,
          tagTone: "warn",
        },
      ];
    }

    const out = [];
    segments.forEach((segment, index) => {
      const dep = formatDateTime(segment?.departure_datetime);
      const arr = formatDateTime(segment?.arrival_datetime);
      const next = segments[index + 1];
      const isLast = index === segments.length - 1;

      out.push({
        kind: "place",
        key: `dep-${index}`,
        time: dep?.time,
        date: dep?.shortDate,
        title: segment?.departure_station?.name || `Stop ${index + 1}`,
        subtitle: segment?.departure_station?.city_name || null,
        tag: segment?.vehicle_number || null,
      });

      out.push({
        kind: "carrier",
        key: `car-${index}`,
        icon: segment?.operator?.image ? (
          <OperatorLogo src={segment.operator.image} name={segment?.operator?.name} />
        ) : null,
        name: segment?.operator?.image ? null : segment?.operator?.name || null,
        meta:
          segment?.duration_formatted || formatMinutes(segment?.duration) || null,
      });

      // Only the final arrival gets a node of its own; an intermediate one is
      // the same station the next segment departs from.
      if (isLast) {
        out.push({
          kind: "place",
          key: `arr-${index}`,
          time: arr?.time,
          date: arr?.shortDate,
          title: segment?.arrival_station?.name || "Arrival",
          subtitle: segment?.arrival_station?.city_name || null,
          tag: crossesMidnight ? "Arrives next day" : null,
          tagTone: "warn",
        });
        return;
      }

      const arrivedAt = segment?.arrival_datetime
        ? new Date(segment.arrival_datetime)
        : null;
      const leavesAt = next?.departure_datetime
        ? new Date(next.departure_datetime)
        : null;
      // Suppliers occasionally hand back overlapping stamps; a zero or negative
      // wait is bad data, not a layover worth showing.
      const wait =
        arrivedAt && leavesAt ? Math.round((leavesAt - arrivedAt) / 60000) : 0;

      out.push({
        kind: "place",
        key: `stop-${index}`,
        time: arr?.time,
        date: arr?.shortDate,
        title: segment?.arrival_station?.name || "Change here",
        subtitle: segment?.arrival_station?.city_name || null,
      });

      if (wait > 0) {
        out.push({
          kind: "wait",
          key: `wait-${index}`,
          name: "Change of service",
          meta: `${formatMinutes(wait)} wait`,
        });
      }
    });
    return out;
  })();

  if (error) {
    return (
      <DrawerShell band={<DetailBand mode={mode} onBack={handleClose} loading />}>
        <DetailError />
      </DrawerShell>
    );
  }

  const canChange = !isEmbedded && typeof handleEditRoute === "function";
  const canDelete = !!handleDelete && type !== "combo";

  const body = (
    <>
      <JourneyRail nodes={nodes} accent={accent} />

      <DetailSection label="Booking">
        <FactChips
          facts={[
            {
              label: "Travellers",
              value: paxLabel(number_of_adults, number_of_children),
            },
            { label: "Class", value: travelClass },
            { label: "Distance", value: distance },
          ]}
        />
      </DetailSection>

      <PolicyNote html={cancellation_policies} />
    </>
  );

  if (isEmbedded) {
    return (
      <div className="flex flex-col">
        {name ? (
          <h3 className="ttw-type-h4 text-[#0b1220] px-4 pt-3 mb-0">{name}</h3>
        ) : null}
        {body}
      </div>
    );
  }

  return (
    <DrawerShell
      band={
        <DetailBand
          mode={mode}
          title={name}
          kicker={[mode, depart?.date].filter(Boolean).join(" · ")}
          summary={[totalDuration, distance].filter(Boolean).join(" · ")}
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
            onChange={canChange ? () => handleEditRoute(data) : undefined}
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

export default VehicleDetailModal;
