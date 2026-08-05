import React from "react";
import Image from "next/image";

/**
 * Sticky top row shared by every booking-detail drawer (transfer, hotel,
 * activity, POI, visa, eSIM): back arrow and the booking title on one line.
 *
 * The title used to sit on its own row below the arrow with a "Change" button
 * beside it; Change now lives in the bottom action bar (BookingDetailActions),
 * so the header is purely back + title.
 *
 * Props:
 *  - title: booking name. Rendered truncated so long routes/hotel names never
 *    push the layout wide.
 *  - onBack: back-arrow handler.
 *  - loading: renders a title placeholder instead of the text.
 *  - leading: optional node between the arrow and the title (e.g. the transfer
 *    mode icon), so drawers that identified the booking with a glyph keep it.
 *  - right: optional trailing node (badges/status), kept off the title's line
 *    width so it can't be pushed out by truncation.
 *  - bgClassName: the sticky background content scrolls under. Defaults to
 *    white; a drawer whose scroll pane is tinted (the transfer drawers sit on
 *    the paper tone so their cards read as raised) passes its own, which has to
 *    replace `bg-white` rather than sit beside it — two `bg-*` utilities on one
 *    element are resolved by stylesheet order, not by class order.
 */
export default function BookingDetailHeader({
  title,
  onBack,
  loading = false,
  leading = null,
  right = null,
  className = "",
  bgClassName = "bg-white",
}) {
  return (
    <div
      className={`sticky top-0 z-[900] ${bgClassName} flex items-center gap-3 py-4 w-full max-w-full ${className}`}
    >
      <Image
        src="/backarrow.svg"
        className="cursor-pointer shrink-0"
        width={22}
        height={2}
        alt="Back"
        onClick={onBack}
      />

      {leading ? <div className="shrink-0 flex items-center">{leading}</div> : null}

      {loading ? (
        <div className="h-6 w-56 max-w-full rounded bg-[#ececec] opacity-50" />
      ) : title ? (
        <h2 className="ttw-type-h4 md:ttw-type-h3 font-600 text-[#0b1220] truncate min-w-0 mb-0">
          {title}
        </h2>
      ) : null}

      {right ? <div className="ml-auto shrink-0">{right}</div> : null}
    </div>
  );
}
