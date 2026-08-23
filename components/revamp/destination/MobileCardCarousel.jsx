import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./MobileCardCarousel.module.scss";

// Card sections render as their original CSS-grid on desktop and a swipeable,
// one-card-per-view rail (with prev/next nav) on mobile (<= 640px).
//
// BOTH are rendered and CSS picks one, via the global `ttw-narrow-only` /
// `ttw-wide-only` classes (see the note beside them in globals.css). Only one
// is ever `display: none`-free, so the pair is safe even inside a flex or grid
// parent — the hidden half is out of layout entirely.
//
// This used to be a `useMediaQuery` switch. That hook seeds its state to
// `false` and only corrects itself in an effect, so the server and the first
// client render both emitted the DESKTOP grid, which stacks into a very tall
// column on a phone; hydration then swapped in the rail and the page collapsed.
// On the homepage that shrank the document from 15966px to 12131px, and in
// Meta's in-app webview — where hydration takes seconds — anything scrolled
// past the post-collapse maximum got clamped by the browser to the new bottom,
// dumping the user on the footer. Deciding in CSS means the first paint already
// has the final height, so there is nothing to clamp.
//
// slidesPerView / spaceBetween default to the homepage values (1 / 16). Nav
// arrows bind per-instance via callback refs held in state, avoiding the
// stale-ref and shared-selector pitfalls when several rails share a page.
const MobileCardCarousel = ({
  gridClass,
  children,
  slidesPerView = 1,
  spaceBetween = 16,
}) => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const slides = React.Children.toArray(children);

  if (!slides.length) return null;

  return (
    <>
      <div className={`${styles.railWrap} ttw-narrow-only`}>
        <Swiper
          className={styles.rail}
          modules={[Navigation]}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          navigation={{ prevEl, nextEl }}
          /* Above 640px this rail is display:none, and Swiper measures
             0-width slides when it initialises hidden. These make it
             re-measure once it becomes visible, so a desktop→mobile resize
             (or a rotation) gets a laid-out rail rather than zero-width
             slides. */
          observer
          observeParents
        >
          {slides.map((node, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              {node}
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          ref={setPrevEl}
          role="button"
          aria-label="Previous"
          className={`${styles.navBtn} ${styles.navPrev}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div
          ref={setNextEl}
          role="button"
          aria-label="Next"
          className={`${styles.navBtn} ${styles.navNext}`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>

      <div className={`${gridClass || ""} ttw-wide-only`.trim()}>
        {children}
      </div>
    </>
  );
};

export default MobileCardCarousel;
