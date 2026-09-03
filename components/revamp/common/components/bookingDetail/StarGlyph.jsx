import React from "react";

/**
 * A star placed by geometry rather than by font metrics.
 *
 * "★" typed into a line is whatever glyph the fallback stack happens to have —
 * a symbol face on one phone, an emoji font on another — and each draws it at a
 * different height above the baseline. That is why the header's star sat low
 * beside its numeral no matter what `vertical-align` nudge it was given: the
 * nudge was correcting for one font's idea of where a star lives.
 *
 * Drawn as a path there is nothing to guess. The box is `size` tall and sits on
 * the baseline, so shifting it down by (0.35 × textSize − size / 2) puts its
 * centre on the cap-height centre of the digits beside it — the optical middle
 * of "3★" — at any pair of sizes.
 */
export default function StarGlyph({
  size = 11,
  textSize = 10,
  className = "",
  style,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: `${(0.35 * textSize - size / 2).toFixed(2)}px`,
        ...style,
      }}
    >
      <path d="M12 2.4l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.42l-5.88 3.09 1.12-6.55L2.48 9.32l6.58-.96z" />
    </svg>
  );
}
