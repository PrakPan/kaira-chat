import React from "react";

interface ChipProps {
  label: React.ReactNode;
  active?: boolean;
  dashed?: boolean;
  onClick?: () => void;
}

/** Reusable selectable pill used for who/month/quick-hint choices. */
const Chip: React.FC<ChipProps> = ({ label, active, dashed, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-[13px] py-[8px] rounded-full text-[12.5px] font-semibold transition-all duration-150"
    style={{
      background: active ? "#0f1a2e" : "#fff",
      color: active ? "#fff" : "#1a2436",
      border: `1.5px ${dashed && !active ? "dashed" : "solid"} ${
        active ? "#0f1a2e" : "#ececec"
      }`,
    }}
  >
    {active ? "✓ " : ""}
    {label}
  </button>
);

export default Chip;
