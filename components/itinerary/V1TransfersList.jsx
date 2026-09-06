// Transfers for an archived V1 itinerary.
//
// Mercury keeps transfers per city, so the normal itinerary view threads them
// between city sections. The V1 export doesn't have that: it carries one flat
// trip-level `transfers` array with no origin/destination city ids to hang the
// legs off. Rather than guess which gap each leg belongs in, the archive view
// hides the between-city sections and renders the whole set here as a single
// list under the day-by-day.
//
// Each entry has only: name, booking_type, icon, travel_duration, pax,
// check_in, check_out. No prices, seats, vendors or booking ids — the archive
// has none of that — so this is presentational only. Dates are deliberately not
// shown: they are the dates the trip was originally travelled, years past for
// most of the export.

import React from "react";
import {
  TRANSPORT_ICONS,
  getTransportBadgeStyle,
} from "../bot-components/components/transportIcons";

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

// "Added" chip, pinned to the right of each card on desktop.
//
// Values mirror CityDay's chip system (CHIP_BASE + CHIP_TEXT_STYLE and its
// green-soft `included` fill) so a transfer chip and a day-row chip are the
// same object. They are restated here rather than imported: CityDay exports
// only the component, and lifting its whole tag system out for one chip is a
// bigger change than this earns.
// `max-ph:hidden`, NOT `hidden md:inline-flex`: a legacy stylesheet loaded
// after Tailwind ships `.hidden { display: none !important }`, which outranks
// the `md:` override and would keep the chip hidden at every width. The custom
// `max-ph` variant (≤768px) compiles to `.max-ph\:hidden`, a selector nothing
// else defines — the same collision, and the same fix, as the `.px-3` / `.border`
// cases elsewhere in the itinerary.
const CHIP_CLASS =
  "max-ph:hidden inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-[3px] uppercase whitespace-nowrap shrink-0";

const CHIP_STYLE = {
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, ui-monospace, monospace",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  lineHeight: 1.1,
  background: "#DFF3E7",
  color: "#1F8A5A",
  border: "1px solid rgba(31,138,90,0.3)",
};

const AddedChip = () => (
  <span className={CHIP_CLASS} style={CHIP_STYLE}>
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    Added
  </span>
);

const V1TransfersList = ({ transfers }) => {
  const items = (transfers || []).filter((t) => t && t.name);
  if (!items.length) return null;

  return (
    <section id="V1Transfers" className="mt-6 mb-4">
      {/* Heading matches the day card's editorial h4 rather than the old h3 +
          sub-line pair, so the section sits inside the itinerary's rhythm
          instead of announcing itself as a separate page block. */}
      <h3
        className="ttw-type-h4 text-[#0B1220] m-0 mb-3 leading-[1.1]"
        style={{ fontWeight: 500 }}
      >
        Transfers
      </h3>

      {/* Separate cards, not a ruled list: this mirrors the activity rows in
          the day-by-day above (CityDay's renderItem) — same 40px media column,
          same 10px radius, same #ECECEC hairline — so the two read as one
          design rather than two. */}
      <div className="flex flex-col gap-2">
        {items.map((transfer, index) => {
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
            <div
              key={`${transfer.name}-${index}`}
              style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-2.5 sm:gap-3 px-3 py-2.5 rounded-[10px] items-center"
            >
              <span
                aria-hidden="true"
                className="w-10 h-10 flex items-center justify-center rounded-[9px] shrink-0"
                style={{ background: accent.background, color: accent.color }}
              >
                {icon}
              </span>

              {/* Name/meta left, chip pinned right — the same arrangement the
                  day rows use for their status badge. */}
              <div className="min-w-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4
                    className="ttw-type-h6 text-[#0B1220] m-0 leading-[1.2] break-words"
                    style={{ fontWeight: 600 }}
                  >
                    {transfer.name}
                  </h4>
                  {meta.length > 0 && (
                    <span
                      className="ttw-type-small text-[#4A566E]"
                      style={{ fontSize: "11.5px", lineHeight: 1.1 }}
                    >
                      {meta.join(" · ")}
                    </span>
                  )}
                </div>

                <AddedChip />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default V1TransfersList;
