import React, { useState } from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const FAQAccordion = ({ faqs = [], defaultOpen = 0, heading, lede }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  if (!faqs || !faqs.length) return null;

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section className={`${styles.block} ${styles.faqBlock}`}>
      <div className={styles.container}>
        {(heading || lede) && (
          <div className={styles.faqHead}>
            <div className={styles.sectionHeadLeft}>
              {heading && <h2>{heading}</h2>}
              {lede && <p className={styles.lede}>{lede}</p>}
            </div>
          </div>
        )}
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${
                openIndex === i ? styles.faqItemOpen : ""
              }`}
            >
              <button
                type="button"
                className={`${styles.faqQ} ${styles.faqQ}`}
                onClick={() => toggle(i)}
              >
                {f.question}
                <span className={styles.faqIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </span>
              </button>
              <div className={styles.faqA}>
                <div
                  className={styles.faqAInner}
                  dangerouslySetInnerHTML={{ __html: f.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
