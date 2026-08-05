import { IoCar } from "react-icons/io5";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdOutlineFlightTakeoff, MdTransferWithinAStation } from "react-icons/md";

/**
 * Per-transport-mode accent for the booking-detail drawers.
 *
 * A transfer drawer used to be entirely ink-on-sand, which made a flight, a
 * train and a taxi indistinguishable at a glance. Each mode now carries a hue,
 * taken from the chip palette the itinerary day cards already use
 * (itineraryCity/CityDay.jsx) and the Kaira scale documented in
 * poiDetails/kairaSections.jsx — nothing invented, so a drawer reads as the
 * same family as the itinerary it opened from.
 *
 *  - soft: tinted surface for header strips and icon tiles
 *  - wash: the near-white end of the header gradient
 *  - line: hairline that separates a tinted surface from white
 *  - solid: the saturated tone, for glyphs, rail and dots on white
 *  - onInk: the lightened tone, for the glyph in the drawer's ink header band
 *
 * Taxi is the exception that proves the system: the brand yellow is too light
 * to carry a glyph, so it keeps the yellow surface and the ink foreground the
 * itinerary legend pairs it with.
 */
const ACCENTS = {
  Flight: {
    key: "Flight",
    soft: "#E6F0FF",
    wash: "#F6FAFF",
    line: "rgba(29,111,224,0.22)",
    solid: "#1D6FE0",
    onInk: "#7FB0F5",
    Icon: MdOutlineFlightTakeoff,
  },
  Train: {
    key: "Train",
    soft: "#F1E6FF",
    wash: "#FAF7FF",
    line: "rgba(126,61,212,0.20)",
    solid: "#7E3DD4",
    onInk: "#C4A3F0",
    Icon: IoMdTrain,
  },
  Bus: {
    key: "Bus",
    soft: "#DFF3E7",
    wash: "#F6FBF8",
    line: "rgba(31,138,90,0.22)",
    solid: "#1F8A5A",
    onInk: "#89D4AE",
    Icon: FaBus,
  },
  Ferry: {
    key: "Ferry",
    soft: "#E4F4FE",
    wash: "#F5FBFE",
    line: "rgba(14,127,184,0.20)",
    solid: "#0E7FB8",
    onInk: "#7FC8EA",
    Icon: IoMdBoat,
  },
  Taxi: {
    key: "Taxi",
    soft: "#FFF3D1",
    wash: "#FFFEF5",
    line: "rgba(196,175,0,0.35)",
    // Gold, not the brand yellow and not ink. Ink is the neutral fallback's
    // colour too, so a taxi rail drawn in it was indistinguishable from a mode
    // we failed to recognise — and the brand yellow is far too light to carry a
    // 2px rail or a glyph. This is the tone the layover chip already uses.
    solid: "#8A6100",
    onInk: "#F0D76B",
    Icon: IoCar,
  },
};

ACCENTS.Car = ACCENTS.Taxi;

const NEUTRAL = {
  key: "Transfer",
  soft: "#f4f3ec",
  wash: "#fafaf5",
  line: "#ececec",
  solid: "#0b1220",
  onInk: "#c9cfda",
  Icon: MdTransferWithinAStation,
};

/**
 * `booking_type` reaches the drawers as "Taxi", "taxi", or — on a combo — a
 * comma-joined list of its legs' types, so normalise before looking up.
 */
export const getModeAccent = (mode) => {
  const first = String(mode || "").split(",")[0].trim().toLowerCase();
  if (!first) return NEUTRAL;
  const key = first[0].toUpperCase() + first.slice(1);
  return ACCENTS[key] || NEUTRAL;
};

/** The header-strip fill: the mode's tint fading toward white. */
export const accentGradient = (accent) =>
  `linear-gradient(120deg, ${accent.soft} 0%, ${accent.wash} 78%)`;

export default getModeAccent;
