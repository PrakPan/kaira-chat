import React from "react";
import type { CityCard } from "../utils/cityDayElements";
import {
  CardCloseButton,
  CardImage,
  CardShell,
  Chevron,
} from "./mapCardChrome";

const BRAND = "#FD6D6C"; // the city pin's fill — the CTA reads as part of the pin

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

interface Props {
  card: CityCard;
  /** Open the city's first day-by-day element on the map. */
  onExplore: () => void;
  onClose: () => void;
  onFocus: () => void;
}

/**
 * What a city's deck shows first: the city itself, with an Explore call to action
 * that walks its day-by-day elements (see CityElementCard). Pinned to the city's
 * numbered route marker.
 */
const CityOverviewCard: React.FC<Props> = ({
  card,
  onExplore,
  onClose,
  onFocus,
}) => {
  const stops = card.elements.length;
  const subtitle = [
    card.dayCount > 0 ? plural(card.dayCount, "day") : null,
    stops > 0 ? plural(stops, "place") : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <CardShell onFocus={onFocus}>
      <CardImage src={card.image} alt={card.cityName}>
        <CardCloseButton onClick={onClose} />
      </CardImage>

      <div style={{ padding: "10px 12px 12px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {card.cityName}
        </h4>

        {subtitle && (
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1.5,
              color: "#6B7280",
            }}
          >
            {subtitle}
          </p>
        )}

        <button
          type="button"
          onClick={onExplore}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            width: "100%",
            marginTop: 10,
            padding: "8px 10px",
            boxSizing: "border-box",
            borderRadius: 8,
            border: "none",
            background: BRAND,
            color: "#fff",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "16px",
            cursor: "pointer",
          }}
        >
          Explore
          <Chevron dir="next" size={12} />
        </button>
      </div>
    </CardShell>
  );
};

export default CityOverviewCard;
