import React from "react";
import type { CityCard } from "../utils/cityDayElements";
import {
  CardCloseButton,
  CardImage,
  CardShell,
  Chevron,
} from "./mapCardChrome";

// Accents match the map's category marker icons (Map.tsx `getMarkerIcon`), so a
// card's chip reads as the same thing its pin does. `tint` is the same hue at
// ~10% over white — used to highlight the day/date line.
const TYPE_META: Record<
  string,
  { label: string; color: string; tint: string }
> = {
  activity: { label: "Activity", color: "#AD5BE7", tint: "#F6EEFD" },
  poi: { label: "Self exploration", color: "#5CBA66", tint: "#ECF7ED" },
};

const pagerBtn = (disabled: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 8px",
  margin: 0,
  boxSizing: "border-box",
  borderRadius: 7,
  border: "none",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 11.5,
  fontWeight: 600,
  lineHeight: "16px",
  color: disabled ? "#C3C7CC" : "#122A43",
  cursor: disabled ? "default" : "pointer",
  flexShrink: 0,
});

interface Props {
  card: CityCard;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  /** Step back out to the city's overview card. */
  onBack: () => void;
  onFocus: () => void;
}

/**
 * One day-by-day activity / POI, pinned to that element's own map marker — image,
 * name, one-liner, and a highlighted line for the day it falls on. The pager
 * walks the city's elements in itinerary order.
 */
const CityElementCard: React.FC<Props> = ({
  card,
  index,
  onPrev,
  onNext,
  onBack,
  onFocus,
}) => {
  const total = card.elements.length;
  const el = card.elements[Math.min(index, total - 1)];
  if (!el) return null;

  const meta = TYPE_META[el.type] ?? TYPE_META.poi;
  const atStart = index <= 0;
  const atEnd = index >= total - 1;

  return (
    <CardShell onFocus={onFocus}>
      <CardImage src={el.image} alt={el.name}>
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            padding: "2px 8px",
            borderRadius: 9999,
            background: meta.color,
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            lineHeight: "16px",
            whiteSpace: "nowrap",
          }}
        >
          {meta.label}
        </span>
        <CardCloseButton
          onClick={onBack}
          label={card.cityName ? `Back to ${card.cityName}` : "Back to city"}
        />
      </CardImage>

      <div style={{ padding: "10px 12px 8px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 7px",
            borderRadius: 6,
            background: meta.tint,
            fontSize: 10.5,
            fontWeight: 700,
            color: meta.color,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: "14px",
          }}
        >
          <span>Day {el.dayNumber}</span>
          {el.dateLabel && (
            <>
              <span style={{ opacity: 0.45 }}>•</span>
              <span>{el.dateLabel}</span>
            </>
          )}
        </div>

        <h4
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {el.name}
        </h4>

        {el.oneLiner && (
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 11,
              lineHeight: 1.5,
              color: "#6B7280",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {el.oneLiner}
          </p>
        )}

        {/* Pushed to the card's two edges — negative margins pull the buttons'
            padding back out to the card's own gutter so the labels line up with
            the text above them. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            margin: "10px -8px 0",
            padding: "7px 0 0",
            borderTop: "1px solid #F0F1F3",
          }}
        >
          <button
            type="button"
            onClick={onPrev}
            disabled={atStart}
            style={pagerBtn(atStart)}
          >
            <Chevron dir="prev" />
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={atEnd}
            style={pagerBtn(atEnd)}
          >
            Next
            <Chevron dir="next" />
          </button>
        </div>
      </div>
    </CardShell>
  );
};

export default CityElementCard;
