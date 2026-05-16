import React from "react";
import styles from "./JourneySimplified.module.scss";

/*
 * "How it works" — three humanized steps.
 *
 * Each step has a number, a title (can include <span className="ttwSerif">),
 * a paragraph, and an optional "demo" node (chat preview / curator card).
 * Pass `steps` to reuse on a similar marketing surface.
 */

const ChatDemo = ({ you, kaira }) => (
  <div className={styles.demo}>
    <span className={styles.you}>{you.label || "You"}</span>
    {you.text}
    <div className={styles.k}>
      <span className={styles.kLabel}>{kaira.label || "Kaira"}</span>
      <span>{kaira.text}</span>
    </div>
  </div>
);

const CuratorCard = ({ name, blurb }) => (
  <div className={styles.curator}>
    <div className={styles.curatorPhoto} aria-hidden />
    <div>
      <div className={styles.curatorName}>{name}</div>
      <div className={styles.curatorBlurb}>{blurb}</div>
    </div>
  </div>
);

const DEFAULT_STEPS = [
  {
    title: (
      <>
        Tell Kaira your <span className="ttwSerif">vibe.</span>
      </>
    ),
    body: "Write like you'd text a friend. Budget, dates, must-haves. Hindi, Hinglish, English — all fine.",
    extra: (
      <ChatDemo
        you={{ label: "You", text: "Kerala 6 days, backwaters + hills, ₹1.4L couple" }}
        kaira={{ label: "Kaira", text: "On it. Checking 1,147 platforms now…" }}
      />
    ),
  },
  {
    title: (
      <>
        A human <span className="ttwSerif">fine-tunes</span> it.
      </>
    ),
    body: "An on-ground curator adjusts what Kaira can't feel — monsoon timing, overrated spots, the quiet ghat at 6am.",
    extra: (
      <CuratorCard
        name="Nimmi, 34 · Kochi"
        blurb="Swaps Munnar → Thekkady this month. Knows the real cardamom road."
      />
    ),
  },
  {
    title: (
      <>
        Pay for what you <span className="ttwSerif">pick.</span>
      </>
    ),
    body: "Transparent pricing. No hidden markups. Book, swap, or cancel anything — from inside the chat.",
    extra: (
      <ChatDemo
        you={{ label: "Final itinerary", text: "6 nights · flights + stays · ₹1,38,400" }}
        kaira={{ label: "Kaira →", text: " book in 30 seconds. Cancel up to 48h before." }}
      />
    ),
  },
];

const JourneySimplified = ({ steps = DEFAULT_STEPS }) => {
  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className="ttwSectionHead">
          <div>
            <h2>
              How it <span className={styles.serif} >works.</span>
            </h2>
            <p className="ttwLede">
              Kaira plans fast.{" "}
              <span className="ttwSerif">Humans catch</span> what AI misses.
              You only pay for what you pick.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.step}>
              <div className={styles.num}>{idx + 1}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
              {step.extra}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySimplified;
