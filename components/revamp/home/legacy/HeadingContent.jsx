import styles from "./HeadingContent.module.scss";
import Link from "next/link";
import Button from "../../common/components/button";

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
const HeadingContent = ({ title, subtitle }) => {
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
      <div>
        <Link href="/new-trip">
          <Button
            variant="filled"
            color="default"
            size="medium"
            className="mt-6 !bg-primary-indigo !border-primary-indigo hover:!bg-primary-indigo/90"
          >
            <div className="flex items-center space-x-2">
              {/* Inline SVG rather than <FontAwesomeIcon>: the icon sits in the
                  hero, and pulling the Font Awesome React runtime in to draw a
                  plus is JS the critical path doesn't need. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Create a Trip in Seconds</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeadingContent;
