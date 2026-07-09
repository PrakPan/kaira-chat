import { useState } from "react";

/*
 * Collapsible "What the labels mean" legend shown at the top of the chat-page
 * Itinerary timeline (gated by `fromChat` in DaybyDay). It explains the status
 * badges rendered inside the day cards.
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

const ItineraryLegend = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-ph:-mt-5">
      <div className="flex items-center flex-wrap gap-[8px] max-ph:gap-[6px]">
        <span className="inline-flex items-center gap-[6px] max-ph:gap-[5px] text-[12.5px] max-ph:text-[11.5px] font-inter font-semibold text-[#0B1220] bg-[#F7E700] border-[1px] border-[#E4D500] rounded-full px-[13px] max-ph:px-[11px] py-[7px] max-ph:py-[6px] whitespace-nowrap">
          <ShieldIcon />
          Kaira Protected
        </span>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-[7px] max-ph:gap-[6px] text-[12.5px] max-ph:text-[11.5px] font-inter font-semibold text-[#4b5159] bg-[#f4f3ef] border-[1px] border-[#ECECEC] rounded-full px-[13px] max-ph:px-[11px] py-[7px] max-ph:py-[6px] whitespace-nowrap"
        >
          <InfoIcon />
          What the labels mean
        </button>
      </div>

      {open && (
        <div className="mt-[14px] rounded-[12px] bg-white border-[1px] border-[#ECECEC] px-[15px] max-ph:px-[13px] py-3 max-ph:py-[11px] flex flex-col gap-2.5">
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
