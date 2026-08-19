import React from "react";
import {
  PiBusFill,
  PiCarFill,
  PiCarProfileFill,
  PiCarSimpleFill,
  PiJeepFill,
  PiMotorcycleFill,
  PiScooterFill,
  PiVanFill,
} from "react-icons/pi";

/**
 * The stand-in for a taxi we have no photograph of.
 *
 * `taxi_category.image` is empty on a fair number of priced vehicles and the
 * supplier CDNs drop others, and the quote card used to answer that by hiding
 * the image tile altogether — so a list of results came out ragged, and the one
 * thing the photo said at a glance (how big is this car) went missing exactly
 * where the customer is comparing cars.
 *
 * Every class therefore has a silhouette of its own, all drawn from one
 * Phosphor family so the set reads as a system: a hatchback is not a sedan is
 * not an SUV. Van/mini van and bus/mini bus share a glyph and differ in scale,
 * because that is precisely what "mini" means and no icon set draws those two
 * shapes apart convincingly.
 *
 * `scale` is a fraction of the tile the glyph is dropped into, so the classes
 * stay in proportion to each other at whatever size the caller draws them —
 * a mini van next to a van in the same list has to look like the smaller car.
 */

const GLYPHS = {
  hatchback: { key: "hatchback", Icon: PiCarSimpleFill, scale: 0.6 },
  sedan: { key: "sedan", Icon: PiCarProfileFill, scale: 0.68 },
  suv: { key: "suv", Icon: PiJeepFill, scale: 0.72 },
  minivan: { key: "minivan", Icon: PiVanFill, scale: 0.66 },
  van: { key: "van", Icon: PiVanFill, scale: 0.82 },
  minibus: { key: "minibus", Icon: PiBusFill, scale: 0.7 },
  bus: { key: "bus", Icon: PiBusFill, scale: 0.9 },
  scooter: { key: "scooter", Icon: PiScooterFill, scale: 0.6 },
  bike: { key: "bike", Icon: PiMotorcycleFill, scale: 0.64 },
  // What an unrecognised class gets, and the only entry callers may want to
  // treat as "no idea" — see `isGenericTaxiGlyph`.
  taxi: { key: "taxi", Icon: PiCarFill, scale: 0.64 },
};

/**
 * Tried in order, and order is the whole design: "mini bus" has to be tested
 * before "bus" and "mini van" before "van", or every minibus in the list draws
 * a coach. The model name is matched with the same table because a category
 * typed "Other" — a third of the priced vehicles — names the shape only there
 * ("V Class", "Toyota Hiace").
 */
const PATTERNS = [
  [/scoot|moped|vespa|activa/i, "scooter"],
  [/motor.?(bike|cycle)|\bbike\b|two.?wheeler|enfield|\bbullet\b/i, "bike"],
  [/mini.?bus|midi.?bus|tempo.?travell?er|\btravell?er\b|urbania|sprinter/i, "minibus"],
  [/\bbus\b|coach/i, "bus"],
  [
    /mini.?van|\bmpv\b|people.?carrier|multi.?purpose|alphard|\bvito\b|\bv.?class\b|rifter/i,
    "minivan",
  ],
  [/\bvans?\b|shuttle|hiace|caravelle|transporter|isuzu.?elf/i, "van"],
  [
    /\bsuv\b|\bmuv\b|jeep|4.?x.?4|off.?road|innova|crysta|fortuner|\bxuv\b|\bxylo\b|ertiga|creta|scorpio|safari|land.?cruiser/i,
    "suv",
  ],
  [
    /sedan|saloon|limousine|\blimo\b|executive|business|premium|luxur|first.?class|standard|comfort|dzire|etios|camry/i,
    "sedan",
  ],
  [
    /hatch|compact|economy|budget|\bmicro\b|\bmini\b|\bsmall\b|wagon.?r|\balto\b|\bi10\b|\bi20\b/i,
    "hatchback",
  ],
];

const matchGlyph = (text) => {
  const value = String(text || "").trim();
  if (!value) return null;
  const hit = PATTERNS.find(([pattern]) => pattern.test(value));
  return hit ? GLYPHS[hit[1]] : null;
};

/**
 * The glyph for a vehicle class. `type` is the category's own label ("SUV",
 * "Mini Van"); `modelName` is consulted only when the type says nothing useful.
 * Always returns a glyph — the generic car when nothing matches.
 */
export const getTaxiTypeGlyph = (type, modelName) =>
  matchGlyph(type) || matchGlyph(modelName) || GLYPHS.taxi;

/** Whether a glyph is the fallback rather than a recognised class. */
export const isGenericTaxiGlyph = (glyph) => glyph?.key === GLYPHS.taxi.key;

// The taxi accent's gold (see bookingDetail/modeAccent.js), softened. A
// placeholder should read as a placeholder: present enough to fill the tile,
// quiet enough that it is never mistaken for a photo of the car.
export const TAXI_GLYPH_COLOR = "#8A6100";

/**
 * The silhouette, sized against the tile it sits in — pass the tile's height as
 * `size` and each class takes its own share of it.
 */
export const TaxiTypeGlyph = ({
  type,
  modelName,
  size = 48,
  color = TAXI_GLYPH_COLOR,
  opacity = 0.45,
  className = "",
  style,
}) => {
  const glyph = getTaxiTypeGlyph(type, modelName);
  const Icon = glyph.Icon;

  return (
    <Icon
      size={Math.round(size * glyph.scale)}
      color={color}
      className={className}
      // The app's unscoped `img {}`/flex rules do not reach an <svg>, but the
      // shrink does: inside a flex row this would otherwise squash.
      style={{ flex: "none", opacity, ...style }}
      aria-hidden="true"
    />
  );
};

export default TaxiTypeGlyph;
