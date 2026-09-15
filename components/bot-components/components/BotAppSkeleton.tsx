import React from "react";
import ItineraryShimmer from "./ItineraryShimmer";

// Loading placeholders for /chat/[id].
//
// A refresh used to paint in three steps: nothing (router not ready, then the
// ssr:false BotApp chunk downloading), then the bare sidebar rail next to two
// empty white panels while the session restore ran, then the content. These
// pieces fill both gaps: `BotAppSkeleton` stands in for the whole shell before
// BotApp mounts, and BotApp overlays `ItineraryPanelSkeleton` /
// `ChatPanelSkeleton` on its own panels until the restore settles.
//
// It deliberately doesn't read as a dead grey page: the real chrome paints
// straight away (brand mark, Kaira's avatar + "thinking…" status, the
// composer pill), the placeholders rise in one after another, and a
// brand-coloured sweep runs across the itinerary
// panel — so the page looks like it is already working, not stuck.
//
// The layout swap is pure CSS (`max-ph:` / `md:`), never a JS viewport check —
// see hooks/useMedia.js on why a measured swap shrinks the page at mount.
//
// This file is imported statically by BotAppClient, so keep it dependency-light.

const skelStyles = `
  @keyframes botSkelSweep {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .bot-skel {
    background: linear-gradient(90deg, #e9eaee 0%, #f4f5f7 50%, #e9eaee 100%);
    background-size: 800px 100%;
    animation: botSkelSweep 1.4s linear infinite;
    border-radius: 6px;
  }

  /* Placeholders rise in one after another; delay comes from --d. */
  @keyframes botSkelRise {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bot-rise {
    opacity: 0;
    animation: botSkelRise 0.35s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
    animation-delay: var(--d, 0ms);
  }
  /* Same, for ItineraryShimmer's city cards + connectors (its own markup). */
  .bot-stagger > div > :not(style) {
    opacity: 0;
    animation: botSkelRise 0.35s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
  }
  .bot-stagger > div > :nth-child(3) { animation-delay: 70ms; }
  .bot-stagger > div > :nth-child(4) { animation-delay: 140ms; }
  .bot-stagger > div > :nth-child(5) { animation-delay: 210ms; }
  .bot-stagger > div > :nth-child(n+6) { animation-delay: 280ms; }

  /* Brand progress sweep — the RouteLoader bar, full width. */
  @keyframes botSkelProgress {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }
  .bot-progress {
    position: absolute; left: 0; right: 0; top: 0; height: 3px;
    overflow: hidden; background: #f0efe4; z-index: 5;
  }
  .bot-progress::after {
    content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 40%;
    border-radius: 999px;
    background: linear-gradient(90deg, #f7e700 0%, #0f1a2e 100%);
    animation: botSkelProgress 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  /* Kaira's live status dot. */
  @keyframes botSkelPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.35; transform: scale(0.7); }
  }
  .bot-status-dot { animation: botSkelPulse 1.2s ease-in-out infinite; }

  /* Remounted after a handoff — already on screen, don't fade in again. */
  .bot-no-rise .bot-rise,
  .bot-no-rise .bot-stagger > div > :not(style) {
    animation: none; opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .bot-skel, .bot-status-dot, .bot-progress::after {
      animation: none;
    }
    .bot-rise, .bot-stagger > div > :not(style) {
      animation: none; opacity: 1;
    }
  }
`;

const SkelStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: skelStyles }} />
);

// The skeleton changes hands during one load — the page (router not ready), the
// dynamic() loading slot (chunk downloading), then BotApp's own panel overlays —
// and each owner mounts a fresh copy. Replaying the rise-in at every handoff
// would blank the placeholders and fade them back, a flicker. So only copies
// first rendered within the opening moment animate; later ones render settled.
// Server render always animates (matches the client's first render).
const RISE_WINDOW_MS = 400;
let firstSkeletonRenderAt: number | null = null;
const riseClass = () => {
  if (typeof window === "undefined") return "";
  const now = Date.now();
  if (firstSkeletonRenderAt === null) firstSkeletonRenderAt = now;
  return now - firstSkeletonRenderAt > RISE_WINDOW_MS ? "bot-no-rise" : "";
};

const rise = (ms: number) =>
  ({ ["--d" as any]: `${ms}ms` }) as React.CSSProperties;

// Mirrors the itinerary panel's header strip — title, travellers · dates,
// route stops — on desktop, and the compact rounded trip card on mobile.
export const ItineraryHeaderSkeleton: React.FC = () => (
  <div
    className="bot-rise bg-white flex flex-col gap-[11px] p-[16px] border-b border-slate-100 max-ph:border max-ph:border-[#ECECEC] max-ph:rounded-[14px] max-ph:mx-3 max-ph:mt-[10px] max-ph:p-[10px] max-ph:gap-[8px]"
    aria-hidden="true"
  >
    <SkelStyles />
    <div className="flex items-start justify-between gap-3">
      <div className="bot-skel h-[26px] w-[55%] max-ph:h-[15px] max-ph:w-[60%]" />
      <div className="flex gap-3 max-ph:hidden">
        <div className="bot-skel w-9 h-9 !rounded-full" />
        <div className="bot-skel w-9 h-9 !rounded-full" />
      </div>
      <div className="bot-skel w-4 h-4 md:hidden" />
    </div>
    <div className="flex items-center gap-[22px] max-ph:gap-3">
      <div className="bot-skel h-[13px] w-[130px] max-ph:w-[90px] max-ph:h-[11px]" />
      <div className="bot-skel h-[13px] w-[170px] max-ph:w-[110px] max-ph:h-[11px]" />
    </div>
    <div className="flex items-center gap-[10px]">
      <div className="bot-skel h-[18px] w-[80px] max-ph:h-[14px]" />
      <div className="bot-skel h-[18px] w-[80px] max-ph:h-[14px]" />
      <div className="bot-skel h-[18px] w-[80px] max-ph:h-[14px] max-xs:hidden" />
    </div>
  </div>
);

// Progress sweep + header strip + day-by-day cards — the whole left panel.
export const ItineraryPanelSkeleton: React.FC = () => (
  <div
    className={`${riseClass()} relative flex flex-col h-full w-full bg-white overflow-hidden`}
    aria-busy="true"
    aria-label="Loading itinerary"
  >
    <SkelStyles />
    <div className="bot-progress" aria-hidden="true" />
    <ItineraryHeaderSkeleton />
    {/* flex-auto, not flex-1: on mobile the panel sits in MobileLayout's
        auto-height scroll pane, where a 0 basis collapses this to 0px and
        clips every card. Auto basis still shrinks inside a fixed-height pane. */}
    <div className="bot-stagger flex-auto min-h-0 overflow-hidden">
      <ItineraryShimmer />
    </div>
  </div>
);

const KairaAvatar: React.FC<{ size: number; dot?: boolean }> = ({
  size,
  dot,
}) => (
  <div
    className="relative flex-shrink-0 rounded-full border-2 border-white"
    style={{
      width: size,
      height: size,
      background: "linear-gradient(180deg, #a8d2f5, #7ab8e8)",
    }}
  >
    <img
      src="/KairaInsta.png"
      alt=""
      className="w-full h-full rounded-full object-cover"
    />
    {dot && (
      <span className="absolute bottom-[1px] right-[1px] w-[11px] h-[11px] rounded-full bg-[#4ade80] border-2 border-white" />
    )}
  </div>
);

const BubbleSkel: React.FC<{ user?: boolean; lines?: number[]; d: number }> = ({
  user,
  lines = [],
  d,
}) =>
  user ? (
    <div className="bot-rise flex justify-end" style={rise(d)}>
      <div className="bot-skel h-[38px] w-[46%] !rounded-[16px]" />
    </div>
  ) : (
    <div className="bot-rise flex items-start gap-[10px]" style={rise(d)}>
      <div className="bot-skel w-[30px] h-[30px] !rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1">
        {lines.map((w, i) => (
          <div key={i} className="bot-skel h-3" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );

// Kaira chat panel — the real header and composer chrome, a short conversation
// rising in.
export const ChatPanelSkeleton: React.FC = () => (
  <div
    className={`${riseClass()} flex flex-col h-full w-full bg-white border-l-[0.5px] border-l-[#e5e5e5] max-ph:border-l-0 cursor-progress`}
    style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    aria-busy="true"
    aria-label="Loading chat"
  >
    <SkelStyles />
    {/* Header — same look as ChatKitPanel's .kp-header */}
    <div className="flex items-center gap-3 px-5 py-[14px] border-b border-[#ececec] flex-shrink-0">
      <KairaAvatar size={38} dot />
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-[#0b1220] leading-[1.2]">
          Kaira
          <span className="font-normal hidden md:inline text-[#445069]">
            {" "}
            · Your AI Trip Planner
          </span>
        </div>
        <div className="flex items-center gap-[5px] mt-[1px] text-[11px] font-semibold text-[#e85a4f]">
          <span className="bot-status-dot w-[5px] h-[5px] rounded-full bg-[#e85a4f]" />
          thinking…
        </div>
      </div>
    </div>

    <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-6 px-4 py-5">
      <BubbleSkel lines={[82, 64, 40]} d={0} />
      <BubbleSkel user d={90} />
      <BubbleSkel lines={[76, 88, 58, 30]} d={180} />
      <BubbleSkel user d={270} />
    </div>

    {/* Composer — MessageInputBox's pill, inert */}
    <div className="px-[10px] py-[10px] max-ph:px-3 max-ph:pb-3 flex-shrink-0">
      <div className="flex items-center gap-2 h-[48px] pl-3 pr-[6px] rounded-full border border-[#e5e5e5] bg-white opacity-70">
        <span className="text-[20px] leading-none text-[#b8becc] select-none">
          +
        </span>
        <span className="flex-1 text-[14px] text-[#8a93a6] truncate select-none">
          Ask me anything
        </span>
        <span className="px-4 py-[7px] rounded-full border border-[#dfe2ea] text-[13px] font-semibold text-[#b8becc] select-none">
          Send
        </span>
      </div>
    </div>
  </div>
);

const TtwMark: React.FC<{ size: number }> = ({ size }) => (
  <img
    src="/logo/ttw-mark.svg"
    alt="The Tarzan Way"
    width={size}
    height={size}
    style={{ width: size, height: size }}
  />
);

// Collapsed desktop rail — same 76px footprint as Sidebar's collapsed width so
// nothing shifts when the real rail replaces it.
const RailSkeleton: React.FC = () => (
  <div
    className="flex-shrink-0 h-full bg-white border-r border-[#ececec] flex flex-col items-center gap-4 py-4"
    style={{ width: 76 }}
    aria-hidden="true"
  >
    <TtwMark size={36} />
    <div className="bot-skel w-9 h-9 !rounded-[10px] mt-2" />
    <div className="bot-skel w-9 h-9 !rounded-[10px]" />
    <div className="flex-1" />
    <div className="bot-skel w-9 h-9 !rounded-full" />
  </div>
);

// Whole-shell placeholder shown before BotApp mounts.
const BotAppSkeleton: React.FC = () => (
  <main
    className="flex flex-col h-dvh md:h-screen overflow-hidden bg-white"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <SkelStyles />
    {/* Desktop */}
    <div className="max-ph:hidden md:flex flex-1 overflow-hidden min-h-0">
      <RailSkeleton />
      <div className="h-full min-w-0" style={{ width: "50%" }}>
        <ItineraryPanelSkeleton />
      </div>
      <div className="h-full min-w-0" style={{ width: "50%" }}>
        <ChatPanelSkeleton />
      </div>
    </div>
    {/* Mobile — a sessionId refresh lands on the itinerary tab */}
    <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
      <div className="flex items-center justify-between px-4 h-[56px] border-b border-[#f0f0f0]">
        <TtwMark size={30} />
        <KairaAvatar size={32} dot />
      </div>
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="bot-skel h-[30px] w-[80px] !rounded-full" />
        <div className="bot-skel h-[30px] w-[80px] !rounded-full" />
        <div className="bot-skel h-[30px] w-[80px] !rounded-full" />
      </div>
      <div className="flex-1 min-h-0">
        <ItineraryPanelSkeleton />
      </div>
    </div>
  </main>
);

export default BotAppSkeleton;
