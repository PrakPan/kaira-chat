import React from "react";
import ReactDOM from "react-dom";

import Sheet from "../../revamp/common/components/Sheet";
import {
  deriveLockIn,
  LockInNotice,
} from "../../../containers/itinerary/booking1/NewBookingSlide";

// ─────────────────────────────────────────────────────────────────────────────
//  HoldOfferOverlay — the "Not paying today?" card, raised over the itinerary.
//
//  The hold is offered in two places outside the cart: the ribbon capping the
//  bottom cart bar, and the bar at the foot of the in-chat payment widget. Both
//  are one line and a button — enough to make the offer, not enough to explain
//  it. They used to charge on the spot, which asked for ₹999 with the reasons
//  to pay it still inside a cart the traveller had not opened.
//
//  So they raise THIS instead: the same card the cart shows inline, with the
//  same two ways out of it, and the payment starts from its buttons rather than
//  from theirs.
//
//  `LockInNotice` and `deriveLockIn` come from the cart drawer itself, exactly
//  as the phone's CartSheet takes them — the card, the money on it and the rules
//  behind it are one implementation, so this surface cannot offer a hold the
//  cart would decline or name a different amount for it.
//
//  Popup on desktop, bottom sheet on the phone. Both portal to <body>: the
//  itinerary scrolls inside a `-webkit-overflow-scrolling: touch` pane, and on
//  iOS a position:fixed descendant of such a scroller anchors to the scrolled
//  content rather than the viewport, so an inline overlay would scroll away
//  with the trip behind it.
// ─────────────────────────────────────────────────────────────────────────────

// Above the cart drawer (1600) and the phone's cart sheet (1620), because this
// can be raised while either is on screen. Below nothing that matters: the
// gateway opens in its own layer, and this closes before it does.
const HOLD_OVERLAY_Z = 1660;

export default function HoldOfferOverlay({
  open,
  onClose,
  isMobile,
  cart,
  isPaying = false,
  onHold,
  onPayFull,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  cart: any;
  isPaying?: boolean;
  onHold: () => void;
  onPayFull: () => void;
}) {
  // The drawer's own derivation, not a second copy of it. `lockInCompleted` is
  // the drawer's post-gateway flag and belongs to the surface running Razorpay;
  // here the cart refetch after a payment is what moves this on.
  const lock = deriveLockIn(cart);

  const card = (
    <LockInNotice
      lockInFee={lock.lockInFee}
      lockInPaid={lock.hasLockInPaid}
      lockInPaidAmount={lock.lockInPaidAmount}
      lockInHoldUntil={lock.lockInHoldUntil}
      lockInHoldExpired={lock.lockInHoldExpired}
      // The gross the hold freezes and the balance still owed — both stated by
      // the cart, neither derived from the other.
      tripTotal={cart?.discounted_cost}
      balanceDue={Math.round(cart?.total_payable_amount || 0)}
      onHold={onHold}
      onPayFull={onPayFull}
      isPaying={isPaying}
    />
  );

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onClose={onClose}
        // No header and no footer: the card leads with its own heading ("Not
        // paying today?") and ends with its own two buttons, so a sheet chrome
        // around it said everything twice. Passed explicitly rather than left
        // off — Sheet is untyped JSX, so its props infer as required.
        title={null}
        subtitle={null}
        headerRight={null}
        footer={null}
        height="auto"
        zIndex={HOLD_OVERLAY_Z}
        contentClassName="px-[14px] pt-[6px] pb-[14px]"
      >
        {card}
      </Sheet>
    );
  }

  if (!open || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hold this price"
      // Not dismissible once an attempt is under way: the card is deliberately
      // left up as the screen the gateway opens over, and a stray backdrop click
      // beside Razorpay would pull it out from under a payment in flight.
      onClick={isPaying ? undefined : onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: HOLD_OVERLAY_Z,
        background: "rgba(3, 12, 24, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* The card is the dialog — clicks inside it must not reach the backdrop's
          close handler above. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 430,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isPaying}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 999,
            border: "none",
            background: "rgba(11, 18, 32, 0.06)",
            color: "#6E757A",
            cursor: "pointer",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {/* The card carries `mb-md` for the cart column it normally sits in;
            nothing follows it here, so that margin is cancelled. */}
        <div className="[&>div]:mb-0">{card}</div>
      </div>
    </div>,
    document.body,
  );
}
