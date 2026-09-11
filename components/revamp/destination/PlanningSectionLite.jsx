import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";
import { ICONS } from "./PlanningSection.jsx";

// A condensed sibling of <PlanningSection />. Same `destination_info` source,
// but light on the page instead of the dark navy rail: it sits high up (above
// "When to go") to answer the two or three questions a traveller asks before
// they read anything else, and the full dark section further down still carries
// the long-form copy.
//
// `best_time_to_visit` is deliberately NOT one of these — the very next section
// on the page is "When to go", so repeating it here would preempt it.
const FIELDS = [
  { key: "visa_policy", title: "Visa", icon: ICONS.visa },
  { key: "currency", title: "Currency", icon: ICONS.money },
  { key: "getting_around", title: "Getting around", icon: ICONS.route },
  { key: "ideal_duration", title: "Ideal duration", icon: ICONS.clock },
];

// Trim a free-text field down to its first sentence. The API values run from
// three words to a full paragraph, and this strip only has room for a line or
// two — `.planLiteValue` clamps whatever survives to two lines as a backstop.
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

const PlanningSectionLite = ({
  destinationInfo,
  destinationName,
  heading,
  lede,
}) => {
  if (!destinationInfo || typeof destinationInfo !== "object") return null;

  const cards = FIELDS.map((field) => ({
    ...field,
    value: condense(destinationInfo[field.key]),
  })).filter((card) => card.value.length > 0);

  if (cards.length === 0) return null;

  return (
    <section className={`${styles.block} ${styles.planLite}`}>
      <div className={styles.container}>
        <div className={styles.planLiteHead}>
          <span className={styles.planLiteKicker}>Practical bits</span>
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

        <div className={styles.planLiteGrid}>
          {cards.map((card) => (
            <div className={styles.planLiteCard} key={card.key}>
              <span className={styles.planLiteIcon}>{card.icon}</span>
              <div className={styles.planLiteBody}>
                <span className={styles.planLiteLabel}>{card.title}</span>
                <p className={styles.planLiteValue}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanningSectionLite;
