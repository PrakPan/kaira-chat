import styles from "./HeadingContent.module.scss";
import KairaCta from "../KairaCta";

// Hero heading, subtitle and CTA.
//
// Deliberately unanimated. This block used to run a GSAP entrance timeline: it
// split the <h1> into per-word spans and set them to
// ANIMATION_CONFIG.initialStates.fromBottom — `{ y: 100, opacity: 0 }` — then
// tweened them in. The h1 is the page's LCP element, so painting it was gated
// on the GSAP bundle downloading, parsing and executing; until then the largest
// thing on screen was invisible. Removing the timeline lets the heading paint
// from the server-rendered HTML, which is as early as it can happen.
//
// If an entrance effect is wanted back, it has to be one that animates *from*
// the painted state (e.g. a CSS transform on an already-opaque element) rather
// than one that starts at opacity 0 — and it must not depend on JS to become
// visible.
// `onCraftTrip` opens the planner over the page (see TailoredFormModal). Given
// one, the CTA is a button rather than a link: the reader stays on the homepage
// and the form comes to them. Without one it stays a plain link to /new-trip,
// which is what every other surface using this hero still wants.
const HeadingContent = ({ title, subtitle, onCraftTrip }) => {

  return (
    <div className={styles.headingContent}>
      <div>
        <h1 className={`${styles.title} heading-text`}>
          Your Trip. Your Vibe.{" "}
        </h1>
        <h1 className={`${styles.title} heading-text`}>Our AI's on It.</h1>
      </div>
      <div className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          Solo? Couple? Group? We Plan Like It’s Just for You - Because It Is.
        </p>
      </div>
      {/* The page's one CTA shape — see components/revamp/home/KairaCta. The
          hero used to carry a squared indigo button of its own, which made it
          the only control on the homepage that didn't look like the others. */}
      <div style={{ marginTop: 24 }}>
        {onCraftTrip ? (
          <KairaCta size="lg" onClick={onCraftTrip}>
            Craft a trip in seconds
          </KairaCta>
        ) : (
          <KairaCta size="lg" href="/new-trip">
            Craft a trip in seconds
          </KairaCta>
        )}
      </div>
    </div>
  );
};

export default HeadingContent;
