import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";
import { ICONS } from "./PlanningSection.jsx";

// A condensed sibling of <PlanningSection />. Same `destination_info` source,
// but light on the page instead of the dark navy rail: it sits high up (above
// "When to go") to answer the two or three questions a traveller asks before
// they read anything else, and the full dark section further down still carries
// the long-form copy.
//
// Built from the same parts as the page's other sections — the shared section
// head, and white 22px cards like the "When to go" seasons beside it.
//
// `best_time_to_visit` is deliberately NOT one of these — the very next section
// on the page is "When to go", so repeating it here would preempt it.
const FIELDS = [
  { key: "visa_policy", title: "Visa", icon: ICONS.visa },
  { key: "currency", title: "Currency", icon: ICONS.money },
  { key: "getting_around", title: "Getting around", icon: ICONS.route },
  { key: "ideal_duration", title: "Ideal duration", icon: ICONS.clock },
];

// A value this short is an answer, not a paragraph ("Omani Rial (OMR)"), so it
// is set as the card's headline figure instead of as body copy.
const SHORT_ANSWER = 40;

// "7-10 days", "10 to 14 days", "2 weeks" — the figure inside the
// ideal-duration copy, lifted out as that card's headline.
const DURATION = /(\d+)(?:\s*(?:-|–|—|to)\s*(\d+))?\s*(days?|nights?|weeks?)\b/i;

// Trim a free-text field down to its first sentence. The API values run from
// three words to a full paragraph, and a card only has room for a few lines —
// `.planLiteValue` clamps whatever survives as a backstop.
//
// Written without a lookbehind on purpose: Safari only shipped those in 16.4,
// and an unsupported regex literal is a *parse* error, so it would take the
// whole bundle down rather than just this component.
const condense = (text) => {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  const stop = value.search(/[.!?](\s|$)/);
  // Only cut at a full stop that leaves something meaningful behind; a very
  // early one is usually an abbreviation ("approx." / "e.g.").
  return stop > 30 ? value.slice(0, stop + 1) : value;
};

// Split a card's copy into an optional headline figure and body text.
const shape = (key, value) => {
  if (value.length <= SHORT_ANSWER) return { figure: value, body: "" };
  if (key === "ideal_duration") {
    const m = value.match(DURATION);
    if (m) {
      const range = m[2] ? `${m[1]}-${m[2]}` : m[1];
      // The copy says "a 7-10 day trip"; the figure stands alone, so it
      // takes the plural whenever it is more than one.
      const unit = m[3].toLowerCase().replace(/s$/, "");
      const plural = m[2] || Number(m[1]) !== 1 ? "s" : "";
      return { figure: `${range} ${unit}${plural}`, body: value };
    }
  }
  return { figure: "", body: value };
};

// "Getting around" -> "Getting <serif>around</serif>", the same treatment the
// season cards give their titles. One-word titles stay plain.
const renderTitle = (title) => {
  const parts = title.split(" ");
  if (parts.length === 1) return title;
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className={styles.serif}>{last}</span>
    </>
  );
};

const PlanningSectionLite = ({
  destinationInfo,
  destinationName,
  heading,
  lede,
}) => {
  if (!destinationInfo || typeof destinationInfo !== "object") return null;

  const cards = FIELDS.map((field) => {
    const value = condense(destinationInfo[field.key]);
    return { ...field, value, ...shape(field.key, value) };
  }).filter((card) => card.value.length > 0);

  if (cards.length === 0) return null;

  return (
    <section className={`${styles.block} ${styles.planLite}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <div className={styles.itinPill}>Practical bits</div>
            <h2>
              {heading || (
                <>
                  Know before you <span className={styles.serif}>go.</span>
                </>
              )}
            </h2>
            <p className={styles.lede}>
              {lede || (
                <>
                  Visa, money, getting around
                  {destinationName ? ` in ${destinationName}` : ""} -{" "}
                  <span className={styles.serif}>less guessing</span>, more
                  booking.
                </>
              )}
            </p>
          </div>
        </div>

        <div
          className={`${styles.planLiteGrid} ${
            cards.length < 4 ? styles[`planLiteGrid${cards.length}`] : ""
          }`}
        >
          {cards.map((card) => (
            <article className={styles.planLiteCard} key={card.key}>
              <span className={styles.planLiteIcon}>{card.icon}</span>
              <div className={styles.planLiteBody}>
                <h3 className={styles.planLiteTitle}>
                  {renderTitle(card.title)}
                </h3>
                {card.figure && (
                  <div className={styles.planLiteFigure}>{card.figure}</div>
                )}
                {card.body && (
                  <p className={styles.planLiteValue}>{card.body}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanningSectionLite;
