// Kaira icon set — shared by the desktop rail (components/Sidebar) and the
// mobile header/drawer (BotApp's MobileHeaderMenu). Lucide-style 24x24 stroke
// glyphs that take their color from `currentColor`, so callers set color via
// CSS rather than baking a hex into the path.
import React from "react";

export interface IconProps {
  size?: number;
  className?: string;
}

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ChevronIcon: React.FC<
  IconProps & { direction: "left" | "right" }
> = ({ direction, size = 15, className }) => (
  <svg width={size} height={size} className={className} {...strokeProps}>
    <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 17, className }) => (
  <svg width={size} height={size} className={className} {...strokeProps}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ size = 19, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    style={{ flex: "none" }}
    {...strokeProps}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

/** Suitcase — "My trips". A house reads as "home", which /dashboard is not. */
export const SuitcaseIcon: React.FC<IconProps> = ({ size = 15, className }) => (
  <svg width={size} height={size} className={className} {...strokeProps}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} className={className} {...strokeProps}>
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} className={className} {...strokeProps}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
