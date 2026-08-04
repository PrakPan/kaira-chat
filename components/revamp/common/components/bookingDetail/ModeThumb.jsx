import React, { useState } from "react";
import { IoCar } from "react-icons/io5";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdOutlineFlightTakeoff, MdTransferWithinAStation } from "react-icons/md";

/**
 * The little tile beside a transfer booking's title.
 *
 * Shows the vehicle the supplier sent a photo of — a taxi booking carries the
 * actual car — and falls back to the transport-mode glyph when it didn't (or
 * when the photo 404s, which the supplier CDNs do).
 *
 * Deliberately not `helper/TransfersIcon`: that renders remote PNGs and pads
 * them with `p-3`, which at this size leaves nothing of the glyph visible. The
 * inline icons here also match the rest of the booking-detail chrome, which is
 * all currentColor SVG on the ink palette.
 */
const GLYPHS = {
  Flight: MdOutlineFlightTakeoff,
  Taxi: IoCar,
  Car: IoCar,
  Train: IoMdTrain,
  Ferry: IoMdBoat,
  Bus: FaBus,
};

// `booking_type` reaches us as "Taxi", "taxi", or — on a combo — a comma-joined
// list of its legs' types, so normalise before looking up a glyph.
const glyphFor = (mode) => {
  const first = String(mode || "").split(",")[0].trim().toLowerCase();
  const key = first ? first[0].toUpperCase() + first.slice(1) : "";
  return GLYPHS[key] || MdTransferWithinAStation;
};

export default function ModeThumb({ mode, image, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  const Glyph = glyphFor(mode);
  const showImage = !!image && !imageFailed;

  return (
    <div className="w-9 h-9 rounded-lg bg-[#f4f3ec] flex items-center justify-center overflow-hidden shrink-0">
      {showImage ? (
        <img
          src={image}
          alt={alt || mode || "Transfer"}
          className="w-full h-full object-contain"
          // The global img reset (styles.css + Bootstrap) adds margins and caps
          // width, which knocks the photo off-centre inside the tile.
          style={{ margin: 0, maxWidth: "none" }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Glyph size={20} color="#0b1220" aria-hidden="true" />
      )}
    </div>
  );
}
