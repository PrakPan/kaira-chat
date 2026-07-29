import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import { PulseLoader } from "react-spinners";

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Instrument Serif', 'Times New Roman', serif";

const PAD_X = 22;
const PAD_TOP = 18;
const ICON_SIZE = 40;
const ICON_GAP = 12;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/* Bottom sheet on a phone, centred card from the 768px breakpoint up — the same
   shape the itinerary's other confirmation surfaces use (NotesPopup, the dates
   warning modal). */
const Sheet = styled.div`
  animation: ${slideUp} 0.24s ease-out;

  @media screen and (min-width: 768px) {
    animation: ${fadeIn} 0.16s linear;
  }
`;

const WarningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3.6 2.7 19.2A1.2 1.2 0 0 0 3.75 21h16.5a1.2 1.2 0 0 0 1.05-1.8L12 3.6Z"
      stroke="#CD2026"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M12 9.5v4.4" stroke="#CD2026" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17.2" r="1.05" fill="#CD2026" />
  </svg>
);

/**
 * "Are you sure?" gate in front of a booking removal.
 *
 * Rendered by BookingDetailActions, so every booking-detail drawer gets it for
 * free — the drawers never mount this directly. It portals to document.body
 * rather than #modal-portal (where DrawerActionFooter lives) so it sits above
 * the drawer panel and its footer bar no matter which drawer opened it.
 *
 * Props:
 *  - itemLabel: noun for the default copy ("stay", "flight", "activity", …)
 *  - message: overrides the default sentence entirely
 *  - title: accessible name only — the visible heading is fixed, since its
 *    serif "itinerary" accent is part of the layout
 *  - zIndex: stacking order; defaults above the cart-hosted drawers (1710/1720)
 */
export default function RemoveBookingConfirmModal({
  open,
  onCancel,
  onConfirm,
  title = "Remove from itinerary?",
  itemLabel = "booking",
  message,
  confirmLabel = "Yes, remove",
  cancelLabel = "Keep it",
  confirming = false,
  zIndex = 2000,
}) {
  // Escape closes, matching the drawers this sits on top of.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel?.();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  // Names the consequence rather than leaving it to "it": the removal cancels a
  // real booking, and getting it back means booking again — not an undo.
  const body =
    message ||
    `Are you sure you want to remove this ${itemLabel} from your itinerary? This booking will be cancelled, and you'd have to book it again to get it back.`;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-end md:items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(11,18,32,0.35)", backdropFilter: "blur(1px)" }}
        onClick={confirming ? undefined : onCancel}
      />

      <Sheet
        className="relative w-full md:max-w-[26.5rem] md:mx-4 flex flex-col overflow-hidden rounded-t-[20px] md:rounded-[20px]"
        style={{
          background: "#fafafa",
          boxShadow: "0 12px 44px rgba(11,18,32,0.20)",
        }}
      >
        {/* yellow top strip — shared with the itinerary's other sheets */}
        <div
          style={{
            height: 6,
            flexShrink: 0,
            background: "linear-gradient(90deg,#FFE600,#F2D700)",
          }}
        />

        {/* mobile drag handle */}
        <div className="md:hidden flex justify-center flex-shrink-0" style={{ padding: "8px 0 4px" }}>
          <div style={{ width: 44, height: 4, borderRadius: 999, background: "#E0DCCD" }} />
        </div>

        {/* Padding is inline, not `px-5`/`pb-5`: Bootstrap ships those same
            class names with `!important` and its scale (3rem) wins over
            Tailwind's, so the sheet would inherit whichever loaded last. */}

        {/* Icon and title are one centred row — `items-center`, not
            `items-start`, which left the 40px badge hanging below the cap
            height of the single line of type beside it. */}
        <div
          className="flex items-center"
          style={{ padding: `${PAD_TOP}px ${PAD_X}px 0`, gap: ICON_GAP }}
        >
          <span
            className="shrink-0 grid place-items-center"
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: 12,
              background: "#FDECEC",
              border: "1px solid #F5CDCE",
            }}
          >
            <WarningIcon />
          </span>

          <div
            className="min-w-0"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#0B1220",
            }}
          >
            Remove from{" "}
            <em
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.015em",
              }}
            >
              itinerary
            </em>
            ?
          </div>
        </div>

        {/* Body copy starts in the title's column, not back at the sheet edge,
            so the badge owns a gutter and the two lines read as one block. */}
        <div
          style={{
            padding: `10px ${PAD_X}px 20px`,
            paddingLeft: PAD_X + ICON_SIZE + ICON_GAP,
          }}
        >
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "#5C5A55",
              margin: 0,
            }}
          >
            {body}
          </p>
        </div>

        <div
          className="flex flex-col-reverse md:flex-row justify-center"
          style={{ padding: `0 ${PAD_X}px ${PAD_X}px`, gap: 10 }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="w-full md:w-auto transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: 500,
              color: "#5C5A55",
              background: "#FFFFFF",
              border: "1px solid #E6E1D2",
              padding: "12px 20px",
              borderRadius: 999,
              minHeight: 45,
              // Matched widths so the centred pair reads as one control, and
              // neither pill collapses around a short label like "Keep it".
              minWidth: 132,
            }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="w-full md:w-auto transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: 600,
              color: "#FFFFFF",
              background: "#CD2026",
              border: "1.5px solid #CD2026",
              padding: "12px 20px",
              borderRadius: 999,
              minHeight: 45,
              minWidth: 132,
            }}
          >
            {confirming ? (
              <PulseLoader size={8} speedMultiplier={0.6} color="#FFFFFF" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </Sheet>
    </div>,
    document.body
  );
}
