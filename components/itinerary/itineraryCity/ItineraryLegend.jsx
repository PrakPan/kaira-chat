import { useEffect, useRef, useState } from "react";

/*
 * "Kaira Protected" / "What the labels mean" chips, rendered inside the trip
 * details card (BotApp's itinerary header strip) below the route line. Either
 * chip opens the same panel explaining the status badges on the day cards.
 *
 * The card is `sticky top-0` inside the mobile scroll pane, so the panel is an
 * absolutely-positioned dropdown rather than an in-flow block: expanding it
 * must not grow the sticky card and push the timeline down.
 *
 * The chip geometry (CHIP_BASE / CHIP_TEXT_STYLE) and the three swatch colors
 * are copied verbatim from CityDay.jsx's TAG_STYLE_BY_KEY so the legend matches
 * the day-card badges exactly. Those constants are module-private to CityDay.jsx
 * (which must not be edited), so they are mirrored here rather than imported.
 */
const CHIP_BASE =
  "inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-[3px] uppercase whitespace-nowrap";

const CHIP_TEXT_STYLE = {
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, ui-monospace, monospace",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  lineHeight: 1.1,
};

// Styles mirror CityDay.jsx's TAG_STYLE_BY_KEY (green-soft / violet-soft / blue
// / pink-soft / ink) so each legend swatch matches its day-card badge exactly.
const GREEN = {
  background: "#DFF3E7",
  color: "#1F8A5A",
  border: "1px solid rgba(31,138,90,0.3)",
};
const VIOLET = {
  background: "#F1E6FF",
  color: "#7E3DD4",
  border: "1px solid rgba(126,61,212,0.25)",
};
const BLUE = {
  background: "#E6F0FF",
  color: "#1D6FE0",
  border: "1px solid rgba(29,111,224,0.25)",
};
const PINK = {
  background: "#FFE5EC",
  color: "#D9577A",
  border: "1px solid rgba(217,87,122,0.25)",
};
const INK = { background: "#0B1220", color: "#F7E700" };
const YELLOW = { background: "#F7E700", color: "#0B1220" };
const PEACH = { background: "#FFE5D1", color: "#0B1220" };

// Grouped by swatch colour so like-coloured chips sit together.
const LEGEND_ITEMS = [
  // green-soft
  {
    label: "On your own",
    style: GREEN,
    desc: "Not pre-booked — go at your own pace. No ticket needed.",
  },
  {
    label: "Self guided",
    style: GREEN,
    desc: "Explore at your own pace with directions provided.",
  },
  {
    label: "Included",
    style: GREEN,
    desc: "Already included in your trip package.",
  },
  // blue
  {
    label: "Guided",
    style: BLUE,
    desc: "Led by a local guide.",
  },
  // violet-soft
  {
    label: "Suggested",
    style: VIOLET,
    desc: "A spot we recommend — visit if it appeals to you.",
  },
  // yellow
  {
    label: "Kaira's pick",
    style: YELLOW,
    desc: "A standout Kaira specially recommends for this trip.",
  },
  // pink-soft
  {
    label: "Must do",
    style: PINK,
    desc: "A trip highlight worth prioritising.",
  },
  // peach
  {
    label: "Insider spot",
    style: PEACH,
    desc: "A lesser-known local favourite worth seeking out.",
  },
  // ink
  {
    label: "Tickets held",
    style: INK,
    desc: "Entry tickets are reserved and confirmed for you.",
  },
  {
    label: "Table reserved",
    style: INK,
    desc: "Your table is booked at this restaurant.",
  },
];

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6l7-3z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="7.6" r="1.1" fill="currentColor" />
  </svg>
);

// The panel closes itself once this long passes with no pointer, scroll or key
// activity anywhere inside it — reading it counts as activity, so a still
// cursor parked over the text is the only thing that lets it lapse.
const IDLE_CLOSE_MS = 5000;

const ItineraryLegend = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  // "Inside" for dismissal means the chips or the panel — not the root, which
  // spans the full card width and would swallow clicks on the empty space
  // beside the chips.
  const chipsRef = useRef(null);
  const panelRef = useRef(null);
  const idleTimerRef = useRef(null);

  // Restarted by every activity handler below; fires only after a quiet spell.
  const bumpIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setOpen(false), IDLE_CLOSE_MS);
  };

  // Arm the timer when the panel opens, and stop it when it closes or unmounts.
  useEffect(() => {
    if (!open) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return undefined;
    }
    bumpIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [open]);

  // Dismiss the dropdown on an outside tap or Escape. `pointerdown` (not click)
  // so a tap that starts outside closes it before the tapped control fires.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      const inside =
        chipsRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target);
      if (!inside) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    // Capture phase: a click landing on a control that stops propagation (the
    // day cards and drawers below do) would never reach a bubbling listener.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  // Hover-to-open, but only where hovering is real. A touch tap synthesises a
  // mouseenter before its click, which would open then immediately toggle shut.
  const onMouseEnter = () => {
    if (window.matchMedia?.("(hover: hover)").matches) setOpen(true);
  };

  return (
    <div
      ref={rootRef}
      className="relative mt-[11px] max-ph:mt-[9px]"
      onPointerMove={open ? bumpIdleTimer : undefined}
      onPointerDown={open ? bumpIdleTimer : undefined}
      onWheel={open ? bumpIdleTimer : undefined}
      onTouchMove={open ? bumpIdleTimer : undefined}
      onKeyDown={open ? bumpIdleTimer : undefined}
    >
      {/* `w-fit`: the row is the hover target, so it must hug the two chips —
          a full-width row would open the panel from the empty space beside them. */}
      <div
        ref={chipsRef}
        onMouseEnter={onMouseEnter}
        className="w-fit flex items-center flex-wrap gap-[8px] max-ph:gap-[6px]"
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex items-center gap-[6px] max-ph:gap-[5px] text-[12.5px] max-ph:text-[11.5px] font-inter font-semibold text-[#0B1220] bg-[#F7E700] border-[1px] border-[#E4D500] rounded-full px-[13px] max-ph:px-[11px] py-[7px] max-ph:py-[6px] whitespace-nowrap"
        >
          <ShieldIcon />
          Kaira Protected
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex items-center gap-[7px] max-ph:gap-[6px] text-[12.5px] max-ph:text-[11.5px] font-inter font-semibold text-[#4b5159] bg-[#f4f3ef] border-[1px] border-[#ECECEC] rounded-full px-[13px] max-ph:px-[11px] py-[7px] max-ph:py-[6px] whitespace-nowrap"
        >
          <InfoIcon />
          What the labels mean
        </button>
      </div>

      {open && (
        // Taller than the viewport on mobile, so it scrolls within itself
        // rather than overflowing the card it hangs off. `no-scrollbar` keeps
        // that scroll invisible — the list is short enough to be obviously
        // scrollable from its clipped last row.
        <div
          ref={panelRef}
          onScroll={bumpIdleTimer}
          className="no-scrollbar absolute left-0 right-0 top-full mt-[10px] z-40 max-h-[60vh] overflow-y-auto overscroll-contain rounded-[12px] bg-white border-[1px] border-[#ECECEC] shadow-[0_10px_30px_rgba(11,18,32,0.14)] px-[15px] max-ph:px-[13px] py-3 max-ph:py-[11px] flex flex-col gap-2.5"
        >
          {/* Sits above the chip list — it explains the Kaira Protected badge,
              which is a trip-level guarantee, not one of the day-card labels. */}
          <div className="flex items-start gap-[10px] max-ph:gap-[9px] pb-[11px] border-b border-[#ECECEC]">
            <span className="shrink-0 mt-[2px] text-[#0B1220]">
              <ShieldIcon />
            </span>
            <p className="m-0 text-[12.5px] max-ph:text-[11.5px] font-inter text-[#4b5159] leading-snug">
              <span className="font-semibold text-[#0B1220]">
                Kaira Protected:
              </span>{" "}
              Trip assured with 24x7 complimentary support, and comprehensive
              trip insurance.
            </p>
          </div>

          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center max-ph:items-start gap-[11px] max-ph:gap-[9px] py-[5px] max-ph:py-[4px]">
              <span
                className={`${CHIP_BASE} shrink-0`}
                style={{ ...CHIP_TEXT_STYLE, ...item.style }}
              >
                {item.label}
              </span>
              <span className="text-[12.5px] max-ph:text-[11.5px] font-inter text-[#4b5159] leading-snug">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryLegend;
