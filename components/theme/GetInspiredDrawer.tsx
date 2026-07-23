// components/theme/GetInspiredDrawer.tsx
//
// Desktop-only "Get inspired" trigger + slide-in drawer used inside HeroV2 on
// the themed destination pages. The trigger sits directly below the hero's
// "Start planning" CTA; clicking it slides a right-side drawer over the page
// that renders the BotApp StartScreen (traveller stories + themed trip cards).
// Selecting any card / prompt hands the prompt off to the /chat route, exactly
// like HeroV2 seeds the chat — keeping tap-to-plan behaviour identical to the
// chat welcome screen.
//
// This is intentionally desktop-only: the mobile inspiration surface is already
// handled by the pinned bar + bottom sheet in GetInspiredSection.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setPendingSeed } from "../../services/heroChatHandoff";
import StartScreen from "../bot-components/components/StartScreen";
import type { ThemeConfig } from "../bot-components/types/themeConfig";
import Drawer from "../ui/Drawer";

interface GetInspiredDrawerProps {
  // Optional: StartScreen falls back to its built-in default content when this
  // is not supplied, so the trigger still works even before themeConfig lands.
  themeConfig?: ThemeConfig;
  // Trigger label — lets each themed page use destination-specific wording
  // (e.g. "Get inspired by Greece"). Falls back to the generic label.
  label?: string;
}

const GetInspiredDrawer: React.FC<GetInspiredDrawerProps> = ({
  themeConfig,
  label = "Get inspired",
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Height of the site's sticky header, measured on open so the drawer sits
  // flush beneath it (the header height varies by breakpoint).
  const [topOffset, setTopOffset] = useState(0);

  // Measure the sticky header each time the drawer opens so the panel aligns
  // exactly with its bottom edge — no gap, and the header stays visible above.
  useEffect(() => {
    if (!open) return;
    const header =
      document.querySelector('[class*="navigationMenu"]') ||
      document.querySelector("header") ||
      document.querySelector("nav");
    const bottom = header?.getBoundingClientRect().bottom;
    if (bottom && bottom > 0) setTopOffset(Math.round(bottom));
  }, [open]);

  // Close on Escape. (Body-scroll lock, backdrop and slide animation are all
  // handled by the shared <Drawer> component.)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goToChat = (seed: string) => {
    const s = (seed || "").trim();
    if (s) setPendingSeed(s);
    router.push(s ? `/chat?seed=${encodeURIComponent(s)}` : "/chat");
  };

  const handlePromptSelect = (prompt: string) => {
    setOpen(false);
    goToChat(prompt);
  };

  return (
    <>
      {/* Trigger — desktop only (mobile uses the pinned GetInspiredSection bar). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gi-drawer-trigger max-ph:hidden md:inline-flex items-center gap-2 rounded-xl border border-[#E7D4F7] bg-[#F7ECFF] px-3 py-1 text-[13px] font-semibold text-[#922ADC] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#922ADC] shadow-none"
      >
        <span aria-hidden>✦</span>
        <span>{label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      {/* Keep the trigger desktop-only even if Tailwind's responsive classes
          are ever purged — the drawer content itself is gated by `open`, which
          can only be set from this (hidden-on-mobile) trigger. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .gi-drawer-trigger { display: none !important; }
        }
      ` }} />

      {/* Slide-in panel — reuses the shared <Drawer> (portal, backdrop, body
          scroll-lock and right-anchored slide animation all live there). The
          measured `top`/`mobileTop` keeps it flush beneath the sticky header. */}
      <Drawer
        show={open}
        anchor="right"
        bgColor="#ffffff"
        width="47%"
        mobileWidth="100%"
        // top={topOffset ? `${topOffset}px` : undefined}
        mobileTop={topOffset ? `${topOffset}px` : undefined}
        style={{ zIndex: 1600 }}
        onHide={() => setOpen(false)}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ececec] flex-shrink-0">
            <h3
              className="text-lg font-semibold text-gray-900 m-0"
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Kick off your Greece <span className="">Adventure</span>
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              style={{ width: 32, height: 32 }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 18, height: 18 }}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content — StartScreen manages its own scrolling. */}
          <div className="flex-1 overflow-hidden">
            <StartScreen
              onPromptSelect={handlePromptSelect}
              themeConfig={themeConfig}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default GetInspiredDrawer;
