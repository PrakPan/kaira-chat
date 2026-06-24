import React from "react";
import OfflineQuoteCTA from "./OfflineQuoteCTA";

/**
 * Kaira-styled empty state shown when a search drawer returns no results.
 *
 * Renders an engaging illustration, a heading + the drawer-specific message,
 * the (kaira yellow) Request Offline Quote CTA and a reassuring sub-line.
 * Pass through every OfflineQuoteCTA prop (itinerary_id, type, payload,
 * startDate, onEditDates, submitted, onSubmitted, …) via `ctaProps`.
 */
const DefaultIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#07213A" strokeWidth="1.8" />
    <path d="M16.5 16.5L21 21" stroke="#07213A" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8.2 11h5.6" stroke="#07213A" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const OfflineQuoteEmptyState = ({
  message,
  title = "No options available right now",
  subline = "Our travel experts will curate a personalised quote and get back to you shortly.",
  icon,
  minHeight = "70vh",
  ...ctaProps
}) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ minHeight }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ height: 72, width: 72, background: "#fdf6c8" }}
      >
        {icon || <DefaultIcon />}
      </div>

      <div className="flex max-w-[420px] flex-col gap-1.5">
        <h3 className="font-sans text-[17px] font-bold text-[#0b1220]">
          {title}
        </h3>
        {message ? (
          <p className="font-sans text-[14px] leading-relaxed text-[#445069]">
            {message}
          </p>
        ) : null}
      </div>

      <OfflineQuoteCTA {...ctaProps} />

      <p className="max-w-[360px] font-sans text-[12px] leading-relaxed text-[#8a93a5]">
        {subline}
      </p>
    </div>
  );
};

export default OfflineQuoteEmptyState;
