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
import { optimizedImageUrl } from "../../helper/imageUrl";
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

// The archive's most-used transfer icon — media/icons/bookings/flight.png, on
// 43% of all legs — is no longer in the media bucket, so those rows rendered a
// broken image however correct the URL was. These keys are all present (verified
// 200 through the image handler), and double as a fallback for any other icon
// that has since been deleted.
const FALLBACK_ICON = {
  Flight: "media/icons/bookings/transfers/airplane.svg",
  Train: "media/icons/bookings/transfers/railway.svg",
  Taxi: "media/icons/bookings/transfers/car-sedan.svg",
  Bus: "media/icons/bookings/transfers/bus.svg",
  Ferry: "media/icons/bookings/transfers/boat.svg",
};

const MODE_LABEL = {
  Flight: "Flight",
  Train: "Train",
  Taxi: "Road transfer",
  Bus: "Bus",
  Ferry: "Ferry",
};

const V1TransfersList = ({ transfers }) => {
  const items = (transfers || []).filter((t) => t && t.name);
  if (!items.length) return null;

  return (
    <section id="Transfers" className="mt-8 mb-6">
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

          const fallbackIcon = FALLBACK_ICON[transfer.booking_type] || null;

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
              {transfer.icon || fallbackIcon ? (
                <img
                  src={optimizedImageUrl(transfer.icon || fallbackIcon, {
                    width: 64,
                  })}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain flex-shrink-0"
                  loading="lazy"
                  onError={(event) => {
                    // Swap to the mode's icon once; if that 404s too, hide the
                    // slot rather than leaving a broken-image glyph.
                    const img = event.currentTarget;
                    const next = fallbackIcon
                      ? optimizedImageUrl(fallbackIcon, { width: 64 })
                      : null;
                    if (next && img.src !== next) {
                      img.src = next;
                      return;
                    }
                    img.style.visibility = "hidden";
                  }}
                />
              ) : (
                <span className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              )}

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
