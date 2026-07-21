import React from "react";
import type { CityCard } from "../utils/cityDayElements";
import {
  CardCloseButton,
  CardImage,
  CardShell,
  Chevron,
} from "./mapCardChrome";

// The app's call-to-action yellow, as worn by View Cart / Get in touch (see
// BotApp). Red was the city pin's own fill, which made the button read as a
// warning rather than the invitation it is.
const CTA_YELLOW = "#F7E700";

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

        {/* When the city is visited, in the same neutral chip the element cards
            use for their day line — so a date reads the same on both cards. */}
        {card.dateRange && (
          <div
            style={{
              display: "inline-flex",
              marginTop: 6,
              padding: "3px 7px",
              borderRadius: 6,
              background: "#F3F4F6",
              fontSize: 10.5,
              fontWeight: 700,
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: "14px",
              whiteSpace: "nowrap",
            }}
          >
            {card.dateRange}
          </div>
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
            background: CTA_YELLOW,
            color: "#111827",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: "16px",
            cursor: "pointer",
          }}
        >
          View Itinerary on Map
          <Chevron dir="next" size={12} />
        </button>
      </div>
    </CardShell>
  );
};

export default CityOverviewCard;
