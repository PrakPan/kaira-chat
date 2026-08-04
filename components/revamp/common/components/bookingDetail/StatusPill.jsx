import React from "react";

/**
 * Booking status badge. A status reads as a state, not a label, so it is
 * coloured by what it means rather than always sitting in the same grey.
 *
 * Server values: Added, Quoted, Paid, Confirmed, Cancelled, Refunded, Expired,
 * Hold. Same tones the visa detail drawer introduced.
 */
export const statusTone = (status) => {
  switch (status) {
    case "Confirmed":
    case "Paid":
      return "bg-[#e7f5ee] text-[#1f7a52] border-[#c7e7d7]";
    case "Cancelled":
    case "Refunded":
    case "Expired":
      return "bg-[#fdeeeb] text-[#b42318] border-[#f5d4cd]";
    case "Hold":
    case "Quoted":
      return "bg-[#fff6df] text-[#8a6100] border-[#f0e0b4]";
    default:
      return "bg-[#eef2fb] text-[#2b4a8b] border-[#d7e0f3]";
  }
};

export default function StatusPill({ status, className = "" }) {
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full flex-shrink-0 ttw-type-small font-600 leading-none tracking-[0.02em] ${statusTone(
        status,
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
