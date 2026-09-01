import React, { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  AskKairaPill — the footer's way into the conversation.
//
//  The hint ROTATES. On a surface whose only editing affordance is a sentence,
//  a static "Ask Kaira to change something…" teaches nothing: the user has to
//  guess the vocabulary. Cycling through worked examples — naming this trip's
//  own cities — is what makes "add something to do in Hanoi" discoverable
//  without adding a single control.
//
//  Its own component, not markup inside BottomCTABar, for a mundane but hard
//  reason: BottomCTABar early-returns for several pricing states BEFORE this
//  would sit, so a rotation timer declared there would be a conditional hook.
//
//  Styling is inline rather than Tailwind for the reason designTokens.js
//  documents — three stylesheets load after Tailwind in _app, several with
//  `!important`, and buttons in particular pick up radius and elevation the
//  design doesn't have.
// ─────────────────────────────────────────────────────────────────────────────

const ROTATE_MS = 3000;

const Arrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function AskKairaPill({ hints = [], onClick, disabled = false }) {
  const [i, setI] = useState(0);

  // Held in a ref so a new `hints` array identity — this list is rebuilt
  // whenever the trip re-derives — doesn't restart the rotation mid-cycle.
  const lenRef = useRef(hints.length);
  lenRef.current = hints.length;

  useEffect(() => {
    if (lenRef.current < 2) return undefined;
    const t = setInterval(() => {
      // Modulo against the CURRENT length: the list grows from 2 to 4 entries
      // the moment the itinerary's cities arrive, and a stale index would sit
      // out of range until the next tick.
      setI((n) => (lenRef.current ? (n + 1) % lenRef.current : 0));
    }, ROTATE_MS);
    return () => clearInterval(t);
    // Re-armed only when the list crosses the "worth rotating" threshold.
  }, [hints.length > 1]);

  const label = hints[i % (hints.length || 1)] || "Ask Kaira anything";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid #ececec",
        borderRadius: 999,
        background: "#ffffff",
        boxShadow: "0 8px 20px -10px rgba(11,18,32,0.15)",
        padding: "6px 7px 6px 8px",
      }}
      className="flex min-w-0 flex-1 items-center gap-[8px] text-left disabled:opacity-40"
    >
      <img
        src="/KairaInsta.png"
        alt=""
        aria-hidden
        className="h-[28px] w-[28px] flex-none rounded-full object-cover"
        // Bare `img {}` rules in styles.css / bootstrap apply globally and knock
        // an <img> out of alignment as a flex child — see the BrandLockup
        // centring fix. Pinned inline so it can't drift.
        style={{
          margin: 0,
          maxWidth: "none",
          display: "block",
          border: "1.5px solid #f7e700",
          background: "#cfe4f0",
        }}
      />
      {/* aria-live so the rotation is announced as a changing hint rather than
          read as a button whose name silently changes under the cursor. */}
      <span
        aria-live="polite"
        className="min-w-0 flex-1 truncate text-[13.5px] text-[#8a93a6]"
      >
        {label}
      </span>
      <span
        style={{ background: "#0b1220", color: "#f7e700", borderRadius: "50%" }}
        className="grid h-[32px] w-[32px] flex-none place-items-center"
        aria-hidden
      >
        <Arrow />
      </span>
    </button>
  );
}
