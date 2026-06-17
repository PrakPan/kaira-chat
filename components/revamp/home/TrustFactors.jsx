import React from "react";

/*
 * Reusable "honest strip" — a dark band of short truths under the hero.
 *
 * Pass `items` to customise. Each item can be either:
 *   - { value, label, after } → renders "label [value] after" with the
 *     italic-yellow value inline (default rendering).
 *   - { node } → fully custom node.
 */
const DEFAULT_ITEMS = [
  { before: "Fine-tuned by", value: "23", after: "local humans" },
  { value: "100+", after: "countries, real routes" },
  { before: "Since", value: "2018" },
  { value: "~2s", after: "avg reply" },
  { value: "94%", after: "come back for second trip" },
];

const StripValue = ({ children }) => (
  <b
    className="ttwSerif"
    style={{
      color: "var(--ttw-yellow, #f7e700)",
      fontSize: "18px",
      fontWeight: 400,
    }}
  >
    {children}
  </b>
);

const TrustFactors = ({ items = DEFAULT_ITEMS }) => {
  return (
    <div
      style={{
        background: "var(--ttw-ink-rail, #0f1a2e)",
        color: "rgba(255,255,255,0.9)",
        padding: "18px 0",
      }}
    >
      <div className="ttwContainer">
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: "24px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: "13.5px",
            fontWeight: 500,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {item.node ? (
                item.node
              ) : (
                <>
                  {item.before ? <span>{item.before}</span> : null}
                  <StripValue>{item.value}</StripValue>
                  {item.after ? <span>{item.after}</span> : null}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustFactors;
