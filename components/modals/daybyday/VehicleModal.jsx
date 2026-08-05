import React, { useState } from "react";
import { IoPeople } from "react-icons/io5";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import DetailCard from "../../revamp/common/components/bookingDetail/DetailCard";
import DetailError from "../../revamp/common/components/bookingDetail/DetailError";
import FactList from "../../revamp/common/components/bookingDetail/FactList";
import ModeThumb from "../../revamp/common/components/bookingDetail/ModeThumb";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import OperatorBadge from "../../revamp/common/components/bookingDetail/OperatorBadge";
import RouteStrip from "../../revamp/common/components/bookingDetail/RouteStrip";
import StatusPill from "../../revamp/common/components/bookingDetail/StatusPill";
import { getModeAccent } from "../../revamp/common/components/bookingDetail/modeAccent";
import {
  addMinutesToDate,
  dayOffset,
  formatDateTime,
  formatMinutes,
  paxLabel,
  shortDateTime,
} from "../../revamp/common/components/bookingDetail/format";

/** One station stop on the journey timeline: when, where, and on what. */
const Stop = ({ stamp, name, note }) => (
  <div className="min-w-0">
    <div className="flex items-baseline gap-2 flex-wrap">
      {stamp?.time ? (
        <span className="ttw-type-h5 text-[#0b1220] ttw-type-num">{stamp.time}</span>
      ) : null}
      {stamp?.date ? (
        <span className="ttw-type-small text-[#8a93a6]">{stamp.date}</span>
      ) : null}
    </div>
    {name ? (
      <div className="ttw-type-small text-[#445069] break-words">{name}</div>
    ) : null}
    {note ? (
      <div className="mt-1">
        <span className="ttw-type-small font-500 text-[#445069] bg-[#f4f3ec] rounded-md px-1.5 py-0.5">
          {note}
        </span>
      </div>
    ) : null}
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
  const accent = getModeAccent(mode);
  const legDayOffset = dayOffset(departure, check_out);

  if (error) {
    return (
      <div className="bg-[#fafaf5] w-full h-full flex flex-col">
        {!isEmbedded && (
          <BookingDetailHeader
            onBack={handleClose}
            bgClassName="bg-[#fafaf5]"
            className="px-6 max-ph:px-4"
          />
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
        accent={accent}
        leading={<ModeThumb mode={mode} size={32} />}
        title={mode ? `${mode} transfer` : "Transfer"}
        subtitle={depart?.date}
        right={status ? <StatusPill status={status} /> : null}
      >
        <RouteStrip
          accent={accent}
          dayOffset={legDayOffset}
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
          className="border-t border-[#efede6]"
          columns={2}
          facts={[
            {
              label: "Travellers",
              value: paxLabel(number_of_adults, number_of_children),
              icon: <IoPeople size={14} color="#8a93a6" aria-hidden="true" />,
            },
            {
              label: "Class",
              value: travelClass,
              icon: (
                <MdAirlineSeatReclineNormal
                  size={14}
                  color="#8a93a6"
                  aria-hidden="true"
                />
              ),
            },
          ]}
        />
      </DetailCard>

      {/* Journey breakdown — every leg, its operator, and the wait between. */}
      {segments.length > 0 && (
        <DetailCard
          label="Journey details"
          accent={accent}
          bodyClassName="px-4 py-4"
        >
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
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: accent.solid }}
                    />
                    <span
                      className="w-[2px] flex-1 my-1.5 rounded-full"
                      style={{ background: accent.line }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0"
                      style={{ borderColor: accent.solid }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <Stop
                      stamp={dep}
                      name={segment?.departure_station?.name}
                      note={segment?.vehicle_number}
                    />

                    <OperatorBadge
                      name={segment?.operator?.name}
                      image={segment?.operator?.image}
                      duration={
                        segment?.duration_formatted ||
                        formatMinutes(segment?.duration)
                      }
                    />

                    <Stop stamp={arr} name={segment?.arrival_station?.name} />
                  </div>
                </div>

                {layover ? (
                  <div className="flex items-center gap-2 my-3 ml-[22px]">
                    <span className="ttw-type-small font-500 text-[#8A6100] bg-[#FFF3D1] rounded-full px-3 py-1">
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
    // Paper pane, white cards: the drawer used to be white on white, where the
    // only thing separating a card from the page was a hairline.
    <div className="h-screen bg-[#fafaf5] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 max-ph:px-4 pb-6">
        <BookingDetailHeader
          title={name}
          loading={loading}
          onBack={handleClose}
          bgClassName="bg-[#fafaf5]"
          leading={!loading && mode ? <ModeThumb mode={mode} /> : null}
        />
        <div className="pt-2">{body}</div>
      </div>

      {/* Remove (left) + Change (right) — pinned action bar */}
      {(canDelete || canChange) && (
        <div className="sticky bottom-0 z-10 border-t border-[#e9e7de] bg-white px-6 max-ph:px-4 py-4">
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
