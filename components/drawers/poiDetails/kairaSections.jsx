import React from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

// ─── Kaira design-system palette (inline-hex, matching the drawer convention) ─
// ink scale: #0b1220 / #1a2436 / #445069 / #8a93a6 / #b8becc · paper: #fafaf5
// #f4f3ec · line #ececec · yellow #f7e700 / wash #fffde7 · green #1f8a5a /
// soft #e7f5ee · red #b84034 / soft #fff1ee.
//
// Shared presentational helpers, mirroring the canonical activity-details
// drawer (components/drawers/activityDetails/ActivityDetails.jsx) so every POI
// drawer renders the same chrome.

// Section heading used across Description / Getting around / Timings etc.
export const SectionTitle = ({ children, className = "" }) => (
  <h3
    className={`font-sans text-[17px] font-bold leading-[24px] tracking-[-0.01em] text-[#0b1220] ${className}`}
  >
    {children}
  </h3>
);

export const Divider = () => <div className="h-px w-full bg-[#ececec]" />;

// Bulleted list with an icon glyph. variant: "include" | "exclude" | default dot.
export const IconList = ({ items, variant }) => (
  <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
    {(items || []).map((item, i) => (
      <li
        key={i}
        className="flex items-start gap-2.5 text-[15px] leading-[23px] text-[#445069]"
      >
        {variant === "include" ? (
          <IoCheckmarkCircle className="mt-[2px] shrink-0 text-[17px] text-[#1f8a5a]" />
        ) : variant === "exclude" ? (
          <IoCloseCircle className="mt-[2px] shrink-0 text-[17px] text-[#b84034]" />
        ) : (
          <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#b8becc]" />
        )}
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// Static section header used inside a divide-y group (Tips, Getting around …).
// Always expanded — collapse/expand was removed so details stay visible.
export const CollapsibleSection = ({ title, children }) => (
  <div className="flex flex-col">
    <div className="flex w-full items-center justify-between py-3.5 text-left">
      <span className="font-sans text-[17px] font-bold tracking-[-0.01em] text-[#0b1220]">
        {title}
      </span>
    </div>
    <div className="pb-3.5">{children}</div>
  </div>
);

// Small info chip used for facts / tags.
// neutral renders the canonical Kaira "chip" (white + hairline border); the
// green/red tones use the soft semantic surfaces.
export const FactPill = ({ icon, children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-white border border-[#ececec] text-[#1a2436]",
    green: "bg-[#e7f5ee] border border-transparent text-[#1f8a5a]",
    red: "bg-[#fff1ee] border border-transparent text-[#b84034]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
};
