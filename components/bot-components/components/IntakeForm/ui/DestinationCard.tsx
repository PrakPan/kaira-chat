import React from "react";
import type { Destination } from "../types";

interface DestinationCardProps {
  destination: Destination;
  active?: boolean;
  onSelect: (d: Destination) => void;
}

/** Featured destination tile shown in the step-1 grid. */
const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  active,
  onSelect,
}) => (
  <button
    type="button"
    onClick={() => onSelect(destination)}
    className="relative w-full text-left p-0 bg-transparent"
  >
    <div
      className="relative w-full overflow-hidden transition-all duration-300"
      style={{
        aspectRatio: "1 / 1.2",
        borderRadius: active ? "8px 26px 8px 26px" : "26px 8px 26px 8px",
        border: `2.5px solid ${active ? "#0f1a2e" : "transparent"}`,
        backgroundColor: "#ffede0",
      }}
    >
      {destination.image && (
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.66) 100%)",
        }}
      />
      {destination.tags && (
        <span
          className="absolute top-[6px] left-[6px] z-[3] px-[7px] py-[3px] rounded-full text-[8px] font-extrabold uppercase tracking-wide"
          style={{ background: "rgba(255,255,255,.94)", color: "#1a2436" }}
        >
          {destination.tags}
        </span>
      )}
      {active && (
        <span
          className="absolute top-[6px] right-[6px] z-[4] w-[18px] h-[18px] rounded-full grid place-items-center"
          style={{ background: "#0f1a2e" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f7e700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      <span className="absolute bottom-[7px] left-0 right-0 z-[2] text-center text-white text-[11px] font-bold">
        {destination.name}
      </span>
    </div>
  </button>
);

export default DestinationCard;
