import React from "react";

/**
 * What a booking-detail drawer shows when its fetch fails. Replaces the bare
 * centred sentence each transfer drawer used to render at a hard-coded vh
 * height — this one centres itself in whatever pane it is dropped into.
 */
export default function DetailError({
  message = "Oops, unable to get the details at the moment.",
  onRetry,
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="w-11 h-11 rounded-full bg-[#f4f3ec] flex items-center justify-center text-[#445069]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      </span>

      <div className="ttw-type-body text-[#445069] max-w-[320px]">{message}</div>

      {onRetry ? (
        <button type="button" className="ttw-btn-change-pill mt-1" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
