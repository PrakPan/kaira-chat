import React from "react";
import { PulseLoader } from "react-spinners";

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path
      d="M8 6V4.5A1.5 1.5 0 019.5 3h5A1.5 1.5 0 0116 4.5V6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M18.5 6l-.7 12.1a2 2 0 01-2 1.9H8.2a2 2 0 01-2-1.9L5.5 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * The two-button row every booking-detail drawer pins to its bottom bar:
 * destructive action on the left, "Change …" on the right in the site yellow
 * (same fill as the itinerary's View Cart CTA).
 *
 * Rendered as a plain row so each drawer can keep whatever bottom container it
 * already has — DrawerActionFooter for the drawers that portal their footer
 * out of the scroll pane, a `sticky bottom-0` div for the rest.
 *
 * Either action may be omitted; a lone button then spans the full width.
 */
export default function BookingDetailActions({
  onDelete,
  deleting = false,
  deleteLabel = "Remove from Itinerary",
  deleteDisabled = false,
  onChange,
  changeLabel = "Change",
  changeDisabled = false,
}) {
  if (!onDelete && !onChange) return null;

  // min-w-0 lets the pills shrink past their nowrap label instead of widening
  // the bar — an over-wide bar puts a horizontal scrollbar on the whole drawer.
  return (
    <div className="flex items-center gap-2 md:gap-3 w-full max-w-full">
      {onDelete && (
        <button
          type="button"
          className="ttw-btn-remove-pill flex-1 min-w-0 overflow-hidden"
          onClick={onDelete}
          disabled={deleting || deleteDisabled}
        >
          {deleting ? (
            <PulseLoader size={8} speedMultiplier={0.6} color="#CD2026" />
          ) : (
            <>
              <span className="shrink-0 flex items-center">
                <TrashIcon />
              </span>
              {/* Full descriptive label on wider screens; on a phone it can't
                  fit beside the "Change …" pill, so it drops to just "Remove".
                  The show/hide lives in globals.css (ttw-remove-label-*) at the
                  520px pill-shrink breakpoint — this build doesn't emit
                  Tailwind's max-[520px] arbitrary variant. */}
              <span className="truncate ttw-remove-label-full">{deleteLabel}</span>
              <span className="ttw-remove-label-short">Remove</span>
            </>
          )}
        </button>
      )}

      {onChange && (
        <button
          type="button"
          className="ttw-btn-change-pill flex-1 min-w-0 overflow-hidden"
          onClick={onChange}
          disabled={changeDisabled}
        >
          <span className="truncate">{changeLabel}</span>
        </button>
      )}
    </div>
  );
}
