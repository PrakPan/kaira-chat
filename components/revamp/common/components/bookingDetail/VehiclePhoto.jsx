import React, { useState } from "react";
import { FaTaxi } from "react-icons/fa";

/**
 * The supplier's photo of the booked car, sitting at the top of the Vehicle
 * card. Falls back to a glyph when the booking has no photo or the supplier's
 * CDN drops it.
 *
 * A plain <img> rather than ImageLoader: these URLs are absolute supplier
 * links, not keys in our own bucket, and ImageLoader's lazy-load never settles
 * reliably inside a drawer that mounts after the page has loaded. Same choice
 * the redesigned taxi search card makes.
 */
export default function VehiclePhoto({ image, alt }) {
  const [failed, setFailed] = useState(false);
  const showImage = !!image && !failed;

  return (
    <div className="flex items-center justify-center border-b border-[#ececec] px-4 py-4">
      <div className="w-full max-w-[220px] h-[120px] flex justify-center items-center">
        {showImage ? (
          <img
            src={image}
            alt={alt || "Vehicle"}
            className="w-full h-full object-contain"
            // The global img reset (styles.css + Bootstrap) adds margins and
            // caps width, which pushes the photo off-centre in the tile.
            style={{ margin: 0, maxWidth: "none" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <FaTaxi className="w-12 h-12 text-[#b8becc]" />
        )}
      </div>
    </div>
  );
}
