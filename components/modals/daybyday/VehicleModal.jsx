import React, { useState } from "react";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailBand from "../../revamp/common/components/bookingDetail/DetailBand";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import DetailSection from "../../revamp/common/components/bookingDetail/DetailSection";
import DrawerShell from "../../revamp/common/components/bookingDetail/DrawerShell";
import FactChips from "../../revamp/common/components/bookingDetail/FactChips";
import JourneyRail from "../../revamp/common/components/bookingDetail/JourneyRail";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import VehiclePhoto from "../../revamp/common/components/bookingDetail/VehiclePhoto";
import {
  getModeAccent,
  getVehicleIcon,
  isSelfDrive as isSelfDriveMode,
  resolveModeKey,
} from "../../revamp/common/components/bookingDetail/modeAccent";
import { resolveImageUrl } from "../../../helper/imageUrl";
import { optimizedMediaUrl } from "../../../lib/mediaImage";
import {
  addMinutesToDate,
  arrivalOffsetLabel,
  dayOffset,
  formatDateTime,
  formatMinutes,
  legEndpoints,
  legVehicle,
  legVehicleName,
  paxLabel,
} from "../../revamp/common/components/bookingDetail/format";

/** An operator's logo, hard-constrained against the app's unscoped img rules. */
const OperatorLogo = ({ src, name }) => (
  <span
    className="flex items-center justify-center shrink-0"
    style={{ height: 15, maxWidth: 68 }}
  >
    <img
      // Resolved to an absolute URL first, then routed through the image
      // handler: a logo of ours is served resized instead of full-resolution,
      // and a supplier's own CDN link comes back out untouched.
      src={optimizedMediaUrl(resolveImageUrl(src), { width: 400 })}
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

  // A self-drive rental is driven by the traveller, so there is no operator to
  // name and no supplier route to swap it for — the change flow doesn't apply.
  const isSelfDrive = isSelfDriveMode(mode);

  // The vehicle lives on the quote. Taxi quotes send a whole category object;
  // a self-drive quote now sends nothing but the name, so the two are read
  // separately and the section renders on either.
  const vehicle = legVehicle(data);
  const vehicleName = legVehicleName(data);

  // Car or bike comes out of the vehicle the quote names, resolved centrally so
  // this drawer and the itinerary rows always land on the same glyph.
  const accentKey = resolveModeKey(data) || mode;
  const accent = getModeAccent(accentKey);
  const VehicleIcon = getVehicleIcon(accentKey);

  const departure =
    check_in ||
    transfer_details?.start_datetime ||
    transfer_details?.gozo?.start_date;
  const depart = formatDateTime(departure);
  const arrival = check_out
    ? formatDateTime(check_out)
    : addMinutesToDate(departure, transfer_details?.duration);

  // `distance` is an object on the newer suppliers and a bare number on the
  // older ones; interpolating the object straight in printed "[object Object] km".
  const distance =
    transfer_details?.distance?.text ||
    (transfer_details?.distance?.value
      ? `${transfer_details.distance.value} km`
      : typeof transfer_details?.distance === "number"
        ? `${transfer_details.distance} km`
        : null);

  const travelClass =
    transfer_details?.prices?.[0]?.class ||
    transfer_details?.results?.[0]?.prices?.[0]?.class_name;

  // Omio / 12go itineraries carry their own leg-by-leg breakdown; direct
  // suppliers don't, and the two cities are the whole story for them.
  const segments = transfer_details?.results?.[0]?.segments || [];

  const totalDuration =
    transfer_details?.duration?.text ||
    formatMinutes(transfer_details?.results?.[0]?.duration);

  const { from, to, fromDetail, toDetail } = legEndpoints(data);
  const arrivesLater = arrivalOffsetLabel(dayOffset(check_in, check_out));

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
          title: from || "Departure",
          subtitle: fromDetail,
        },
        {
          kind: "carrier",
          key: "leg",
          name: isSelfDrive
            ? vehicle?.type
              ? `Self-drive ${vehicle.type}`
              : "Self-drive"
            : transfer_details?.operator?.name || mode || "Transfer",
          meta: [totalDuration, distance].filter(Boolean).join(" · ") || null,
        },
        {
          kind: "place",
          key: "to",
          time: arrival?.time,
          date: arrival?.shortDate,
          title: to || "Arrival",
          subtitle: toDetail,
          tag: arrivesLater,
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
          tag: arrivesLater,
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
      <DrawerShell band={<DetailBand mode={accentKey} onBack={handleClose} loading />}>
        <DetailError />
      </DrawerShell>
    );
  }

  const canChange =
    !isEmbedded && !isSelfDrive && typeof handleEditRoute === "function";
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

      {(vehicle || vehicleName) && (
        <DetailSection label={isSelfDrive ? "Your vehicle" : "Vehicle"}>
          {/* Only when the supplier actually sent a photo. A self-drive quote
              never does, and the photo's empty state — a 128px tinted stage
              holding a faded glyph — is a lot of drawer to spend saying
              nothing; the name row below carries the vehicle instead. */}
          {vehicle?.image ? (
            <VehiclePhoto
              image={vehicle.image}
              alt={vehicleName || vehicle?.type}
              mode={accentKey}
            />
          ) : null}

          {vehicleName ? (
            <div className="flex items-center gap-2.5 px-4 pb-4">
              <span
                className="flex items-center justify-center shrink-0 h-9 w-9 rounded-xl"
                style={{
                  background: accent.soft,
                  border: `1px solid ${accent.line}`,
                }}
              >
                <VehicleIcon size={18} color={accent.solid} />
              </span>
              <span className="text-[13.5px] font-600 text-[#0b1220] break-words min-w-0">
                {vehicleName}
              </span>
            </div>
          ) : null}

          <FactChips
            // Whichever field the name came from is already stated in the row
            // above, so it doesn't get a chip of its own as well.
            facts={[
              { label: "Class", value: vehicle?.type },
              { label: "Model", value: vehicle?.model_name },
              { label: "Fuel", value: vehicle?.fuel_type },
              { label: "Seats", value: vehicle?.seating_capacity },
              { label: "Bags", value: vehicle?.bag_capacity },
            ].filter((fact) => fact.value !== vehicleName)}
          />
        </DetailSection>
      )}

      <PolicyNote html={cancellation_policies} />
    </>
  );

  // Embedded in a combo's rail: the node it expands from already names the leg
  // and owns the gutter, so the body contributes its rail and sections only.
  if (isEmbedded) return <div className="flex flex-col">{body}</div>;

  return (
    <DrawerShell
      band={
        <DetailBand
          mode={accentKey}
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
