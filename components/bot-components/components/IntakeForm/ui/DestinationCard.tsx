import React, { useState } from "react";
import type { Destination } from "../types";

interface DestinationCardProps {
  destination: Destination;
  active?: boolean;
  onSelect: (d: Destination) => void;
}

// Badge palette mirrors `.sc-dcard-tag` variants in the design mock.
const BADGE_STYLES: Record<
  "love" | "hot" | "default",
  { background: string; color: string }
> = {
  love: { background: "#ffe0ea", color: "#c73862" },
  hot: { background: "#f7e700", color: "#0b1220" },
  default: { background: "rgba(255,255,255,.94)", color: "#1a2436" },
};

/** Featured destination tile shown in the step-1 grid. */
const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  active,
  onSelect,
}) => {
  const badge =
    destination.badge_type === "love" || destination.badge_type === "hot"
      ? BADGE_STYLES[destination.badge_type]
      : BADGE_STYLES.default;

  // Start "loaded" when there's no image so the shimmer doesn't run forever.
  const [imgLoaded, setImgLoaded] = useState(!destination.image);

  return (
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
      {!imgLoaded && (
        <div className="ttw-dcard-skel absolute inset-0" aria-hidden="true" />
      )}
      {destination.image && (
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className="w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity .3s ease" }}
        />
      )}
      <style>{`
        @keyframes ttwDcardShimmer { 0% { background-position: -300px 0; } 100% { background-position: 300px 0; } }
        .ttw-dcard-skel {
          background: linear-gradient(90deg, #ece9e1 0%, #f6f4ee 50%, #ece9e1 100%);
          background-size: 600px 100%;
          animation: ttwDcardShimmer 1.3s linear infinite;
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.66) 100%)",
        }}
      />
      {destination.tags && (
        <span
          className="absolute top-[6px] left-[6px] z-[3] px-[7px] py-[3px] rounded-full text-[8px] font-extrabold uppercase whitespace-nowrap"
          style={{
            background: badge.background,
            color: badge.color,
            letterSpacing: ".02em",
            boxShadow: "0 2px 6px rgba(0,0,0,.18)",
          }}
        >
          {destination.badge_type === "love" ? "♥ " : ""}
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
};

export default DestinationCard;
