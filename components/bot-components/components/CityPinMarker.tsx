import React from "react";

// The numbered route pin for a city that carries a day-by-day deck.
//
// The same teardrop `getNumberedPin` draws — but as DOM rather than a marker
// icon, because its city's elements are photo markers (see ElementMarker) and
// those can only be DOM. Marker icons and HTML overlays live in different map
// panes with a fixed order, so a pin left as an icon would sit in the lower pane
// and be buried under the very photos it is meant to gather: at the zoom a
// multi-city route fits to, a city's elements land within a marker's width of
// its pin. Drawing both as DOM puts them in one pane, where the z-index the map
// actually intends decides what covers what.

export const CITY_PIN_WIDTH = 36;
export const CITY_PIN_HEIGHT = 46;

const BRAND = "#FD6D6C";

interface Props {
  number: number;
  cityName: string;
  onClick: () => void;
}

const CityPinMarker: React.FC<Props> = ({ number, cityName, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={cityName}
    aria-label={cityName}
    style={{
      display: "block",
      width: CITY_PIN_WIDTH,
      height: CITY_PIN_HEIGHT,
      padding: 0,
      border: "none",
      background: "none",
      cursor: "pointer",
    }}
  >
    <svg
      width={CITY_PIN_WIDTH}
      height={CITY_PIN_HEIGHT}
      viewBox="0 0 48 61"
      fill="none"
      aria-hidden
      style={{
        display: "block",
        filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.30))",
      }}
    >
      <path
        d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z"
        fill={BRAND}
      />
      {/* Fills the teardrop's hollow centre, so the number reads against white
          rather than against the map. */}
      <circle cx="24" cy="23.9643" r="11.5" fill="#fff" />
      <text
        x="24"
        y="28.5"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill={BRAND}
      >
        {number}
      </text>
    </svg>
  </button>
);

export default CityPinMarker;
