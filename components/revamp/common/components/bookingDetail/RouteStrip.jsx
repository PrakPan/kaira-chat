import React from "react";

/**
 * The origin → destination row every transfer detail drawer opens with.
 *
 * A filled dot for departure and a hollow one for arrival, joined by a dashed
 * hairline that carries the leg's meta (distance · duration) in a sand chip.
 * Deliberately monochrome: the drawers used to mark the two ends with a green
 * and a red pin, which read as a status rather than as two ends of a line.
 *
 * Props:
 *  - origin / destination: { name, time, date }. Any field may be missing — a
 *    sightseeing taxi has no destination address, an intercity leg has no
 *    arrival time — and the strip simply drops what it isn't given.
 *  - meta: text for the middle chip.
 */
function Endpoint({ name, time, date, align = "left" }) {
  if (!name && !time && !date) return <div className="flex-1" />;

  return (
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : ""}`}>
      {name ? (
        <div className="ttw-type-h5 text-[#0b1220] break-words">{name}</div>
      ) : null}
      {time ? <div className="ttw-type-small text-[#445069] mt-1">{time}</div> : null}
      {date ? <div className="ttw-type-small text-[#8a93a6]">{date}</div> : null}
    </div>
  );
}

export default function RouteStrip({
  origin,
  destination,
  meta,
  className = "",
}) {
  const hasOrigin = !!(origin?.name || origin?.time || origin?.date);
  const hasDestination = !!(
    destination?.name ||
    destination?.time ||
    destination?.date
  );

  if (!hasOrigin && !hasDestination) return null;

  return (
    <div className={`px-4 py-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#0b1220] shrink-0" />
        <span className="flex-1 border-t border-dashed border-[#d9d9d2]" />
        {meta ? (
          <span className="ttw-type-small text-[#445069] bg-[#f4f3ec] rounded-full px-2.5 py-0.5 whitespace-nowrap">
            {meta}
          </span>
        ) : null}
        <span className="flex-1 border-t border-dashed border-[#d9d9d2]" />
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#0b1220] bg-white shrink-0" />
      </div>

      <div className="flex items-start justify-between gap-4 mt-3">
        <Endpoint {...(origin || {})} />
        <Endpoint {...(destination || {})} align="right" />
      </div>
    </div>
  );
}
