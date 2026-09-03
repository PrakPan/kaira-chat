// Transfers for an archived V1 itinerary.
//
// Mercury keeps transfers per city, so the normal itinerary view threads them
// between city sections. The V1 export doesn't have that: it carries one flat
// trip-level `transfers` array with no origin/destination city ids to hang the
// legs off. Rather than guess which gap each leg belongs in, the archive view
// hides the between-city sections and renders the whole set here as a single
// vertical list under the day-by-day.
//
// Each entry has only: name, booking_type, icon, travel_duration, pax,
// check_in, check_out. No prices, seats, vendors or booking ids — the archive
// has none of that — so this is presentational only.

import React from "react";
import {
  TRANSPORT_ICONS,
  getTransportBadgeStyle,
} from "../bot-components/components/transportIcons";
import { getHumanDate } from "../../services/getHumanDate";

// "2024-05-17 00:00:00" -> "17 May 2024"; anything unparseable is dropped
// rather than shown raw.
const formatDate = (value) => {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  try {
    return getHumanDate(`${day}/${month}/${year}`);
  } catch (err) {
    return null;
  }
};

// The archive's `icon` is a media-bucket path, and the most-used one by far —
// media/icons/bookings/flight.png, on 43% of all legs — is no longer in the
// bucket, so those rows rendered a broken image however correct the URL was.
// The mode's own vector icon is used instead: it is the same set the live chat
// draws its transport cards with (WidgetRenderer), so an archived leg and a
// current one look alike, and it can't 404.
//
// Only Flight, Taxi and Train occur in the archive; `bus` comes along with the
// shared set and costs nothing to keep mapped.
const MODE_KEY = {
  Flight: "flight",
  Taxi: "taxi",
  Train: "train",
  Bus: "bus",
};

const MODE_LABEL = {
  Flight: "Flight",
  Train: "Train",
  Taxi: "Road transfer",
  Bus: "Bus",
};

const V1TransfersList = ({ transfers }) => {
  const items = (transfers || []).filter((t) => t && t.name);
  if (!items.length) return null;

  return (
    <section id="V1Transfers" className="mt-8 mb-6">
      <h2 className="ttw-type-h3 font-medium text-[#262626] mb-1">Transfers</h2>
      <p className="ttw-type-small text-[#7A7A7A] mb-3">
        How you move between stops on this trip.
      </p>

      <ol className="flex flex-col divide-y divide-[#ECEAEA] border-t border-b border-[#ECEAEA]">
        {items.map((transfer, index) => {
          const checkIn = formatDate(transfer.check_in);
          const checkOut = formatDate(transfer.check_out);
          // Same day on both ends reads as one date, not a range.
          const dates =
            checkIn && checkOut && checkIn !== checkOut
              ? `${checkIn} – ${checkOut}`
              : checkIn;

          const modeKey = MODE_KEY[transfer.booking_type] || "taxi";
          const icon = TRANSPORT_ICONS[modeKey] ?? TRANSPORT_ICONS.taxi;
          const accent = getTransportBadgeStyle(modeKey);

          const meta = [
            MODE_LABEL[transfer.booking_type] || transfer.booking_type,
            transfer.travel_duration || null,
            transfer.pax
              ? `${transfer.pax} ${transfer.pax > 1 ? "travellers" : "traveller"}`
              : null,
          ].filter(Boolean);

          return (
            <li
              key={`${transfer.name}-${index}`}
              className="flex flex-row items-center gap-2.5 py-2.5"
            >
              {/* Same tinted chip the chat's transport cards use, so the two
                  read as one design language. */}
              <span
                aria-hidden="true"
                className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-[9px] flex-shrink-0"
                style={{ background: accent.background, color: accent.color }}
              >
                {icon}
              </span>

              <div className="flex flex-col min-w-0">
                <span className="text-[13px] md:text-[14px] text-[#262626] truncate">
                  {transfer.name}
                </span>
                <span className="text-[11px] md:text-[12px] text-[#7A7A7A]">
                  {meta.join(" · ")}
                  {dates ? `${meta.length ? " · " : ""}${dates}` : ""}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default V1TransfersList;
