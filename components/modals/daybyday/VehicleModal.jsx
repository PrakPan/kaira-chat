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

const shortDateTime = (value) => {
  if (!value) return {};
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {};
  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};

const formatMinutes = (minutes) => {
  if (typeof minutes !== "number" || Number.isNaN(minutes)) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours ? `${hours}h ` : ""}${rest}m`.trim();
};

const paxLabel = (adults, children) =>
  [
    adults ? `${adults} adult${adults > 1 ? "s" : ""}` : null,
    children ? `${children} child${children > 1 ? "ren" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ") || null;

/** One station stop on the journey timeline: when, where, and on what. */
const Stop = ({ stamp, name, note }) => (
  <div className="min-w-0">
    <div className="flex items-baseline gap-2 flex-wrap">
      {stamp?.time ? (
        <span className="ttw-type-h5 text-[#0b1220]">{stamp.time}</span>
      ) : null}
      {stamp?.date ? (
        <span className="ttw-type-small text-[#8a93a6]">{stamp.date}</span>
      ) : null}
    </div>
    {name ? (
      <div className="ttw-type-small text-[#445069] break-words">{name}</div>
    ) : null}
    {note ? <div className="ttw-type-small text-[#8a93a6]">{note}</div> : null}
  </div>
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
  // suppliers don't, and the route strip above is the whole story for them.
  const segments = transfer_details?.results?.[0]?.segments || [];

  const mode = booking_type || transfer_details?.mode;

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

  const canChange = !isEmbedded && typeof handleEditRoute === "function";
  const canDelete = !!handleDelete && type !== "combo";

  const body = (
    <>
      {/* Journey — the two cities, when it leaves and when it lands. */}
      <DetailCard
        label={isEmbedded ? null : "Journey"}
        title={mode ? `${mode} transfer` : "Transfer"}
        subtitle={depart?.date}
        right={status ? <StatusPill status={status} /> : null}
      >
        <RouteStrip
          origin={{
            name: transfer_details?.source?.city_name,
            time: depart?.time,
            date: depart?.date,
          }}
          destination={{
            name: transfer_details?.destination?.city_name,
            time: arrival?.time,
            date: arrival?.date,
          }}
          meta={distance}
        />

        <FactList
          className="border-t border-[#ececec]"
          columns={2}
          facts={[
            {
              label: "Travellers",
              value: paxLabel(number_of_adults, number_of_children),
            },
            { label: "Class", value: travelClass },
          ]}
        />
      </DetailCard>

      {/* Journey breakdown — every leg, its operator, and the wait between. */}
      {segments.length > 0 && (
        <DetailCard label="Journey details" bodyClassName="px-4 py-4">
          {segments.map((segment, index) => {
            const dep = shortDateTime(segment?.departure_datetime);
            const arr = shortDateTime(segment?.arrival_datetime);
            const next = segments[index + 1];
            const arrivedAt = segment?.arrival_datetime
              ? new Date(segment.arrival_datetime)
              : null;
            const leavesAt = next?.departure_datetime
              ? new Date(next.departure_datetime)
              : null;
            // Suppliers occasionally hand back overlapping stamps; a zero or
            // negative wait is bad data, not a layover worth showing.
            const waitMinutes =
              arrivedAt && leavesAt
                ? Math.round((leavesAt - arrivedAt) / 60000)
                : 0;
            const layover = waitMinutes > 0 ? formatMinutes(waitMinutes) : null;

            return (
              <div key={index}>
                <div className="flex gap-3">
                  {/* Rail: filled dot leaves, hollow dot arrives */}
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0b1220] shrink-0" />
                    <span className="w-px flex-1 my-1.5 bg-[#d9d9d2]" />
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#0b1220] bg-white shrink-0" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <Stop
                      stamp={dep}
                      name={segment?.departure_station?.name}
                      note={segment?.vehicle_number}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      {segment?.operator?.image ? (
                        <img
                          src={segment.operator.image}
                          alt={segment?.operator?.name || "Operator"}
                          className="h-5 w-auto object-contain"
                          style={{ margin: 0, maxWidth: "none" }}
                        />
                      ) : null}
                      <span className="ttw-type-small text-[#445069]">
                        {segment?.duration_formatted ||
                          formatMinutes(segment?.duration)}
                      </span>
                    </div>

                    <Stop stamp={arr} name={segment?.arrival_station?.name} />
                  </div>
                </div>

                {layover ? (
                  <div className="flex items-center gap-2 my-3 ml-[22px]">
                    <span className="ttw-type-small text-[#445069] bg-[#f4f3ec] border border-[#ececec] rounded-full px-3 py-1">
                      {layover} layover
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </DetailCard>
      )}

      <PolicyNote html={cancellation_policies} />
    </>
  );

  if (isEmbedded) {
    return (
      <div className="flex flex-col">
        {name ? <h3 className="ttw-type-h4 text-[#0b1220] mb-3">{name}</h3> : null}
        {body}
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 max-ph:px-4 pb-6">
        <BookingDetailHeader
          title={name}
          loading={loading}
          onBack={handleClose}
          leading={!loading && mode ? <ModeThumb mode={mode} /> : null}
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
            onChange={canChange ? () => handleEditRoute(data) : undefined}
            changeLabel="Change Transfer"
            changeDisabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleDetailModal;
