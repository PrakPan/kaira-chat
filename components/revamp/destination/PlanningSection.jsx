import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const ICONS = {
  visa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M15 8h2" />
      <path d="M15 12h2" />
      <path d="M7 16h10" />
    </svg>
  ),
  plane: (
    <svg viewBox="0 0 24 24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(45deg)" }}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1z" />
    </svg>
  ),
  route: (
    <svg viewBox="0 0 24 24" fill="none" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M15 9a3 3 0 0 0-3-2.5c-1.7 0-3 1-3 2.3 0 3 6 1.7 6 4.7 0 1.4-1.3 2.3-3 2.3A3 3 0 0 1 9 15" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" height="24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

// Ordered so cards always render in a sensible, consistent layout.
const FIELDS = [
  { key: "visa_policy", title: "Visa", icon: ICONS.visa },
  { key: "getting_in", title: "Getting in", icon: ICONS.plane },
  { key: "getting_around", title: "Getting around", icon: ICONS.route },
  { key: "currency", title: "Currency", icon: ICONS.money },
  { key: "best_time_to_visit", title: "Best time to visit", icon: ICONS.calendar },
  { key: "ideal_duration", title: "Ideal duration", icon: ICONS.clock },
];

const PlanningSection = ({ destinationInfo, destinationName }) => {
  if (!destinationInfo || typeof destinationInfo !== "object") return null;

  const cards = FIELDS.filter((f) => {
    const v = destinationInfo[f.key];
    return typeof v === "string" ? v.trim().length > 0 : !!v;
  });

  if (cards.length === 0) return null;

  return (
    <section className={`${styles.block} ${styles.fromIndia}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <h2>
              Planning{" "}
              <span className={styles.serif}>
                {destinationName ? `${destinationName}.` : "your trip."}
              </span>
            </h2>
            <p className={styles.lede}>
              Practical bits — visa, money, getting around.{" "}
              <span className={styles.serif}>Less guessing</span>, more booking.
            </p>
          </div>
        </div>
        <div className={styles.indiaGrid}>
          {cards.map((card) => (
            <div className={styles.indiaCard} key={card.key}>
              <div className={styles.indiaCardIcon}>{card.icon}</div>
              <h4>{card.title}</h4>
              <p>{destinationInfo[card.key]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanningSection;
