import styles from "./WhyKairaSection.module.scss";

/*
 * "Why travellers choose Kaira over every other AI travel planner."
 * A sticky intro on the left, a numbered list of differentiators on the right.
 * Pass `features` to reuse the layout for any comparison/explainer surface.
 */

const DEFAULT_FEATURES = [
  {
    title: (
      <>
        She doesn&apos;t suggest it. <span className={styles.serif}>She decides.</span>
      </>
    ),
    body: "No list of links to sort through. No tabs to open. Kaira builds your complete personalised itinerary end to end — and if something doesn't feel right, you change it in chat and she rebuilds instantly.",
  },
  {
    title: (
      <>
        1,100+ platforms. <span className={styles.serif}>One search.</span>
      </>
    ),
    body: "Flights, hotels, and experiences compared across the web automatically. You don't need to check three booking sites and hope you got the best deal. Kaira does that in the background, every time.",
  },
  {
    title: (
      <>
        The price you see is the <span className={styles.serif}>price you pay.</span>
      </>
    ),
    body: "No markups. No convenience fees that appear at the last step. What Kaira quotes is what you book at. Nothing added, nothing hidden.",
  },
  {
    title: (
      <>
        2 minutes from first message to <span className={styles.serif}>full itinerary.</span>
      </>
    ),
    body: "Faster than most travel sites even load their search results. You tell Kaira what you want, she comes back with a complete trip plan. Not a starting point — a finished one.",
  },
  {
    title: (
      <>
        One place to <span className={styles.serif}>book everything.</span>
      </>
    ),
    body: "Flights, hotels, transfers, experiences. All confirmed in one conversation, one checkout, one booking summary. No 40 tabs, no 20 contact numbers, no “let me check with my team and get back to you.”",
  },
];

const WhyKairaSection = ({ features = DEFAULT_FEATURES }) => {
  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className={styles.wrap}>
          <div className={styles.intro}>
            <span className={styles.kicker}>
              <span className={styles.kickerStar}>★</span> Why Kaira
            </span>
            <h2 className={styles.title}>
              Why travellers choose Kaira over every other{" "}
              <span className={styles.serif}>AI travel planner.</span>
            </h2>
            <p className={styles.lede}>
              Most AI tools give you ideas.{" "}
              <span className={styles.serif}>Kaira gives you a trip.</span> Tell
              her your destination, dates, budget, and travel style and she
              builds your complete itinerary in under 2 minutes. Flights,
              hotels, experiences, transfers — all in one place, ready to book.
            </p>
            <p className={styles.tag}>Here&apos;s what&apos;s different.</p>
          </div>

          <div className={styles.list}>
            {features.map((f, i) => (
              <div key={i} className={styles.feature}>
                <div className={styles.index}>{i + 1}</div>
                <div>
                  <h3 className={styles.featTitle}>{f.title}</h3>
                  <p className={styles.featBody}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKairaSection;
