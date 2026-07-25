// components/revamp/destination/TripIdeasSheet.jsx
//
// Phone-only bottom sheet behind the hero's "Discover trip ideas for X" chip.
// On desktop that chip still expands the inline prompt chips; on phones the
// chips are cramped and easy to miss, so the same prompts open here as a clean
// tap-to-plan list. Selecting an entry hands the prompt off exactly like the
// inline chips do.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Prompts arrive either as plain strings or as { label, prompt, icon } objects.
const normalizePrompt = (p) => {
  if (typeof p === "string") return { label: p, prompt: p, icon: null };
  return {
    label: p?.label || p?.prompt || "",
    prompt: p?.prompt || p?.label || "",
    icon: p?.icon || null,
  };
};

const TripIdeasSheet = ({ open, onClose, onSelect, destinationLabel, prompts = [] }) => {
  const [mounted, setMounted] = useState(false);
  // `rendered` keeps the sheet in the tree through the closing animation;
  // `shown` drives the slide-up / slide-down transition itself.
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);

  // Held in a ref so a re-rendered parent (new inline callback identity) never
  // re-runs the open effect — that would double up the body scroll-lock and
  // leave the page unscrollable after close.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setShown(false);
      // Unmount only once the sheet has slid back down.
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
    setRendered(true);
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!mounted || !rendered) return null;

  const entries = prompts.map(normalizePrompt).filter((p) => p.label);

  return createPortal(
    <div
      className="fixed inset-0 md:hidden"
      style={{ zIndex: 1650 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Trip ideas for ${destinationLabel || "your trip"}`}
    >
      <div
        onClick={onClose}
        className="absolute inset-0"
        style={{
          background: "rgba(11,18,32,0.55)",
          opacity: shown ? 1 : 0,
          transition: "opacity 0.25s ease-out",
        }}
      />

      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col bg-white"
        style={{
          maxHeight: "82vh",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          boxShadow: "0 -10px 34px rgba(0,0,0,0.22)",
          transform: shown ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex justify-center pt-2.5">
          <span
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              background: "#E2E5EA",
            }}
          />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-3">
          <div>
            <div className="text-[17px] font-bold text-[#0B1220]">
              Trip ideas for {destinationLabel || "you"}
            </div>
            <div className="mt-0.5 text-[12.5px] text-[#6B7280]">
              Tap one — Kaira picks it up in chat.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trip ideas"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-0 bg-[#F2F3F5] text-[#0B1220]"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-5" style={{ WebkitOverflowScrolling: "touch" }}>
          {entries.map((entry, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(entry.prompt)}
              className="mb-2 flex w-full items-center gap-3 rounded-2xl border border-[#EDE7F4] bg-white px-3.5 py-3 text-left"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F7ECFF] text-[15px] text-[#922ADC]"
              >
                {entry.icon || "✦"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold leading-snug text-[#0B1220]">
                  {entry.label}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="#922ADC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TripIdeasSheet;
