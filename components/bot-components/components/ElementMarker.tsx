import React, { useState } from "react";
import { categoryColor, categoryGlyph } from "../utils/categoryIcons";

// The map's marker for one day-by-day element: the place's own photo, cropped to
// a disc, with a small category badge on its lower-left edge saying what it is.
// A photo tells you where you are going in a way a generic pictogram cannot, and
// the badge keeps the category legible once the photo has taken the disc over.
//
// This is DOM rather than a `google.maps.Marker` icon: a marker icon is a single
// image, and an SVG one loaded as an image is forbidden from pulling in an
// external photo. Compositing the photo into a canvas would need CORS headers
// the image host does not send, so the marker is drawn as HTML on an OverlayView
// instead (see Map.tsx `MarkerOverlay`).

export const ELEMENT_MARKER_SIZE = 40;
export const ACTIVE_ELEMENT_MARKER_SIZE = 52;

interface Props {
  name: string;
  image: string | null;
  type: string;
  /** The element whose card is open — wears the bigger disc, so in a cluster it
   * is obvious which pin the card in front of you belongs to. */
  active: boolean;
  onClick: () => void;
}

const Glyph: React.FC<{ type: string; size: number }> = ({ type, size }) => {
  const glyph = categoryGlyph(type);
  return (
    <svg
      width={size}
      height={size}
      viewBox={glyph.viewBox}
      fill="none"
      aria-hidden
      style={{ display: "block" }}
      dangerouslySetInnerHTML={{ __html: glyph.markup }}
    />
  );
};

const ElementMarker: React.FC<Props> = ({
  name,
  image,
  type,
  active,
  onClick,
}) => {
  // A photo that 404s would otherwise leave a white hole where the marker was.
  const [broken, setBroken] = useState(false);
  const color = categoryColor(type);
  const size = active ? ACTIVE_ELEMENT_MARKER_SIZE : ELEMENT_MARKER_SIZE;
  const showPhoto = !!image && !broken;
  // Sized off the disc so the badge keeps its proportions when the marker grows.
  const badge = Math.round(size * 0.42);

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      aria-label={name}
      style={{
        position: "relative",
        width: size,
        height: size,
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
        // The disc grows out of its own centre; the overlay pins that centre to
        // the element's coordinates, so a resize never walks the marker off its
        // point.
        transition: "width 140ms ease-out, height 140ms ease-out",
      }}
    >
      {/* The photo, cropped to a disc inside a white collar. Without the photo
          this is the category's own colour, which is what the map showed before
          photos — so an imageless element still reads as its type. */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background: showPhoto ? "#E8EBEE" : color,
          border: `${active ? 3 : 2}px solid #fff`,
          boxSizing: "border-box",
          boxShadow: `0 ${active ? 5 : 3}px ${active ? 12 : 8}px rgba(11,18,32,${
            active ? 0.34 : 0.24
          })`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showPhoto ? (
          <img
            src={image!}
            alt=""
            onError={() => setBroken(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Glyph type={type} size={Math.round(size * 0.5)} />
        )}
      </div>

      {/* Anchored on the disc's lower-left edge — 225° round the circle, rather
          than the bounding box's corner, which for a circle is empty space. */}
      {showPhoto && (
        <span
          style={{
            position: "absolute",
            left: "14.6%",
            top: "85.4%",
            transform: "translate(-50%, -50%)",
            width: badge,
            height: badge,
            borderRadius: "50%",
            background: color,
            border: "1.5px solid #fff",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 3px rgba(11,18,32,0.28)",
          }}
        >
          <Glyph type={type} size={Math.round(badge * 0.62)} />
        </span>
      )}
    </button>
  );
};

export default ElementMarker;
