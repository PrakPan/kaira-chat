// components/theme/GetInspiredSection.tsx
//
// "Get Inspired" surface for the destination-style theme pages. It reuses the
// BotApp StartScreen (traveller stories + themed trip cards) so the content and
// tap-to-plan behaviour stay identical to the greece-islands-done-right chat
// welcome screen.
//
//  • Mobile — a bar pinned to the bottom of the viewport opens the same
//    cards/stories in a slide-up bottom sheet.
//  • Desktop — the exact same cards/stories are rendered inline as a page
//    section, styled with the destination page's section pattern.
//
// Selecting any card or story hands the prompt off to the /chat route, mirroring
// how HeroV2 seeds the chat.

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { setPendingSeed } from "../../services/heroChatHandoff";
import { useStatsStripPinned } from "../../services/floatingStatsStrip";
import StartScreen from "../bot-components/components/StartScreen";
import type { ThemeConfig } from "../bot-components/types/themeConfig";
import styles from "../../styles/pages/revamp/destination.module.scss";

interface GetInspiredSectionProps {
  themeConfig: ThemeConfig;
}

const GetInspiredSection: React.FC<GetInspiredSectionProps> = ({
  themeConfig,
}) => {
  const router = useRouter();
  const [showInspiration, setShowInspiration] = useState(false);
  const statsStripPinned = useStatsStripPinned();

  // ── Draggable bottom-sheet state (mobile) ──
  // The sheet element is 92% of the viewport tall. We move it vertically with a
  // `translateY` offset so it rests showing 75% of the screen, can be dragged up
  // to (near) full-screen, and dragged down past a threshold to dismiss —
  // mirroring an Instagram-style comment sheet.
  const [winH, setWinH] = useState(0);
  const [sheetH, setSheetH] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, t: 0 });

  // Snap offsets (px from the sheet's fully-expanded position).
  const expandedT = 0;
  const defaultT = sheetH ? sheetH - Math.round(winH * 0.75) : 0;

  // Initialise measurements + entry animation, and lock body scroll while open.
  useEffect(() => {
    if (!showInspiration) return;
    const H = window.innerHeight;
    const sh = Math.round(H * 0.92);
    setWinH(H);
    setSheetH(sh);
    setTranslateY(sh); // start off-screen, then slide up to the default snap
    const raf = requestAnimationFrame(() =>
      setTranslateY(sh - Math.round(H * 0.75))
    );
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
    };
  }, [showInspiration]);

  const closeSheet = () => {
    setTranslateY(sheetH || winH || 1000); // animate down, then unmount
    setDragging(false);
    setTimeout(() => setShowInspiration(false), 280);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStart.current = { y: e.touches[0].clientY, t: translateY };
    setDragging(true);
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const next = dragStart.current.t + (e.touches[0].clientY - dragStart.current.y);
    setTranslateY(Math.max(0, next)); // can't drag above fully-expanded
  };

  const onDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    // Dragged far enough below the default rest position → dismiss.
    if (translateY > defaultT + winH * 0.18) {
      closeSheet();
      return;
    }
    // Otherwise snap to the nearer of expanded / default.
    const snap =
      Math.abs(translateY - expandedT) <= Math.abs(translateY - defaultT)
        ? expandedT
        : defaultT;
    setTranslateY(snap);
  };

  const goToChat = (seed: string) => {
    const s = (seed || "").trim();
    if (s) setPendingSeed(s);
    router.push(s ? `/chat?seed=${encodeURIComponent(s)}` : "/chat");
  };

  const handlePromptSelect = (prompt: string) => {
    setShowInspiration(false);
    goToChat(prompt);
  };

  return (
    <>
      {/* ── Desktop: inline "Get inspired" section ── */}
      <section className={`${styles.container} hidden md:block`}>
        <div className={styles.block}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadLeft}>
              <h2>
                Get <span className={styles.serif}>inspired.</span>
              </h2>
              <p className={styles.lede}>
                Real trips and ready-made ideas.{" "}
                <span className={styles.serif}>Tap any card</span> — Kaira picks
                it up in chat.
              </p>
            </div>
          </div>
          <div
            style={{
              height: 680,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid #ececec",
            }}
          >
            <StartScreen
              onPromptSelect={handlePromptSelect}
              themeConfig={themeConfig}
            />
          </div>
        </div>
      </section>

      {/* ── Mobile: "Get Inspired" bar pinned to the bottom ──
           Visibility is controlled via a scoped <style> media query rather than
           a Tailwind `md:hidden` class: inline `display` styles would otherwise
           override the class and leak the fixed bar onto desktop. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .gi-inspire-bar {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 1500;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 14px;
          border: 0; border-top: 1px solid #ececec;
          background: #F7ECFF; color: #922ADC;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .gi-inspire-bar { display: none !important; }
          .gi-inspire-sheet { display: none !important; }
        }
      ` }} />
      {/* Hidden while the destination stats strip is floating at the bottom of
          the viewport, so only one bar ever owns that slot. */}
      {!statsStripPinned && (
        <button
          type="button"
          onClick={() => setShowInspiration(true)}
          className="gi-inspire-bar"
        >
          <span>Discover Trip ideas for Greece</span>
          <span aria-hidden>→</span>
        </button>
      )}

      {/* ── Mobile: inspiration bottom sheet ── */}
      {showInspiration && (
        <div className="gi-inspire-sheet md:hidden fixed inset-0" style={{ zIndex: 1600 }}>
          {/* Backdrop */}
          <div
            onClick={closeSheet}
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.5)",
              animation: "giFadeIn 0.25s ease-out forwards",
            }}
          />

          {/* Sheet */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-white flex flex-col"
            style={{
              height: sheetH,
              transform: `translateY(${translateY}px)`,
              transition: dragging ? "none" : "transform 0.3s ease-out",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
              willChange: "transform",
            }}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Inspiration"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes giFadeIn { from { opacity: 0; } to { opacity: 1; } }
            ` }} />

            {/* Drag handle — grab here to slide the sheet up/down. */}
            <div
              className="flex justify-center pt-3 pb-2 flex-shrink-0"
              style={{ touchAction: "none", cursor: "grab" }}
              onTouchStart={onDragStart}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 999,
                  background: "#E5E7EB",
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <StartScreen
                onPromptSelect={handlePromptSelect}
                themeConfig={themeConfig}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetInspiredSection;