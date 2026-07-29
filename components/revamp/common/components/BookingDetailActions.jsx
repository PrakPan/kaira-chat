import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import RemoveBookingConfirmModal from "./RemoveBookingConfirmModal";

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

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
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
 *
 * Removing is destructive and cancels the booking, so onDelete never fires
 * straight from the click — it goes through RemoveBookingConfirmModal first.
 * Every drawer inherits that gate from here; pass `confirmDelete={false}` for
 * the rare caller that runs its own confirmation.
 */
export default function BookingDetailActions({
  onDelete,
  deleting = false,
  deleteLabel = "Remove from Itinerary",
  deleteDisabled = false,
  onChange,
  changeLabel = "Change",
  changeLabelShort,
  changeDisabled = false,
  confirmDelete = true,
  confirmItemLabel = "booking",
  confirmMessage,
  confirmLabel,
  confirmZIndex,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!onDelete && !onChange) return null;

  const handleDeleteClick = () => {
    if (confirmDelete) {
      setConfirmOpen(true);
      return;
    }
    onDelete();
  };

  // Hand back to the drawer's own `deleting` state — the pill shows the loader
  // while the request runs, so the sheet closes rather than sitting on top of it.
  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete();
  };

  // Both pills grow to share the bar, but they size from their content
  // (flex-auto, not flex-1) so a long "Change …" label isn't squeezed into an
  // equal half. The remove pill is the one that gives: min-w-0 lets it shrink
  // past its label, keeping the bar itself from overflowing the drawer.
  //
  // ttw-actions-row is what makes that work: the pill classes carry
  // `width: 100%` for their standalone usages, and with flex-basis:auto that
  // width becomes the basis — one pill would claim the whole row. The row
  // scopes the pills back to `width: auto` (globals.css).
  return (
    <>
      <div className="ttw-actions-row flex items-center gap-2 md:gap-3 w-full max-w-full">
        {onDelete && (
          <button
            type="button"
            className="ttw-btn-remove-pill flex-auto min-w-0 overflow-hidden"
            onClick={handleDeleteClick}
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
            className="ttw-btn-change-pill flex-auto shrink-0"
            onClick={onChange}
            disabled={changeDisabled}
          >
            {/* Never ellipsised — the pill holds its content width and the remove
                pill absorbs the squeeze. A caller with a label too long even for
                that can hand in a short form that swaps in below 520px. */}
            {changeLabelShort ? (
              <>
                <span className="ttw-change-label-full">{changeLabel}</span>
                <span className="ttw-change-label-short">{changeLabelShort}</span>
              </>
            ) : (
              <span>{changeLabel}</span>
            )}
            <span className="shrink-0 flex items-center">
              <ArrowRightIcon />
            </span>
          </button>
        )}
      </div>

      <RemoveBookingConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        itemLabel={confirmItemLabel}
        message={confirmMessage}
        confirmLabel={confirmLabel}
        {...(confirmZIndex ? { zIndex: confirmZIndex } : {})}
      />
    </>
  );
}
