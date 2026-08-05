import React from "react";

/**
 * The origin → destination row every transfer detail drawer opens with.
 *
 * A filled dot for departure and a hollow one for arrival, joined by a dashed
 * hairline with the mode's own glyph riding it and the leg's meta (distance ·
 * duration) beside it. Both dots and the glyph take the transport mode's accent
 * colour, so the route itself is what makes a flight look different from a
 * taxi — the strip used to be two identical grey pins on every mode.
 *
 * Props:
 *  - origin / destination: { name, time, date }. Any field may be missing — a
 *    sightseeing taxi has no destination address, an intercity leg has no
 *    arrival time — and the strip simply drops what it isn't given.
 *  - dayOffset: calendar days the leg crosses, badged on the arrival so an
 *    overnight journey says so instead of quietly showing another date.
 *  - meta: text beside the glyph.
 *  - accent: from modeAccent; falls back to ink when absent.
 */
const INK = { solid: "#0b1220", soft: "#f4f3ec", line: "#ececec" };

function Endpoint({ name, time, date, align = "left", badge }) {
  if (!name && !time && !date) return <div className="flex-1" />;

  return (
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : ""}`}>
      {name ? (
        <div className="ttw-type-h5 text-[#0b1220] break-words">{name}</div>
      ) : null}

      {time ? (
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            align === "right" ? "justify-end" : ""
          }`}
        >
          <span className="ttw-type-body font-600 text-[#1a2436] ttw-type-num">
            {time}
          </span>
          {badge}
        </div>
      ) : (
        badge || null
      )}

      {date ? <div className="ttw-type-small text-[#8a93a6]">{date}</div> : null}
    </div>
  );
}

export default function RouteStrip({
  origin,
  destination,
  meta,
  accent,
  dayOffset = 0,
  className = "",
}) {
  const tone = accent || INK;

  const hasOrigin = !!(origin?.name || origin?.time || origin?.date);
  const hasDestination = !!(
    destination?.name ||
    destination?.time ||
    destination?.date
  );

  if (!hasOrigin && !hasDestination) return null;

  const overnight = dayOffset > 0 && (
    <span
      className="ttw-type-small font-600 leading-none px-1.5 py-1 rounded-md whitespace-nowrap"
      style={{ background: tone.soft, color: tone.solid }}
      title={`Arrives ${dayOffset} day${dayOffset > 1 ? "s" : ""} later`}
    >
      +{dayOffset}d
    </span>
  );

  return (
    <div className={`px-4 py-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: tone.solid }}
        />
        <span className="flex-1 border-t border-dashed border-[#d9d9d2]" />

        {meta || tone.Icon ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 whitespace-nowrap"
            style={{ background: tone.soft }}
          >
            {tone.Icon ? (
              <tone.Icon size={13} color={tone.solid} aria-hidden="true" />
            ) : null}
            {meta ? (
              <span className="ttw-type-small text-[#445069] leading-none">
                {meta}
              </span>
            ) : null}
          </span>
        ) : null}

        <span className="flex-1 border-t border-dashed border-[#d9d9d2]" />
        <span
          className="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0"
          style={{ borderColor: tone.solid }}
        />
      </div>

      <div className="flex items-start justify-between gap-4 mt-3">
        <Endpoint {...(origin || {})} />
        <Endpoint {...(destination || {})} align="right" badge={overnight} />
      </div>
    </div>
  );
}
