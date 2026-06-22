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
  { value: "20+", after: "human experts to fine-tune your plan" },
  { value: "100+", after: "countries, real routes" },
  { value: "94%", after: "come back for a second trip" },
  { value: "2 secs", after: "avg reply time" },
  { value: "4.9", after: "rated across 10,000+ trips" },
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
