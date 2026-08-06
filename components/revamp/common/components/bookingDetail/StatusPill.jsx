import React from "react";

/**
 * Booking status badge. A status reads as a state, not a label, so it is
 * coloured by what it means rather than always sitting in the same grey.
 *
 * Server values: Added, Quoted, Paid, Confirmed, Cancelled, Refunded, Expired,
 * Hold. Solid fills, no outline — a tinted border around a tinted pill draws a
 * second edge inside the chip and reads as a seam. Fills come from the chip
 * palette the itinerary day cards use, which is built for exactly this.
 */
export const statusTone = (status) => {
  switch (status) {
    case "Confirmed":
    case "Paid":
      return "bg-[#DFF3E7] text-[#1F8A5A]";
    case "Cancelled":
    case "Refunded":
    case "Expired":
      return "bg-[#FCE7E4] text-[#B42318]";
    case "Hold":
    case "Quoted":
      return "bg-[#FFF3D1] text-[#8A6100]";
    default:
      return "bg-[#E6F0FF] text-[#1D6FE0]";
  }
};

export default function StatusPill({ status, className = "" }) {
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ttw-type-small font-600 leading-none tracking-[0.02em] ${statusTone(
        status,
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
