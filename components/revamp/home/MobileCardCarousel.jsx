import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./MobileCardCarousel.module.scss";

/*
 * Mobile-only swipeable rail. Callers render their normal grid AND this rail,
 * then let CSS pick one: pass `className="ttw-narrow-only"` here and
 * `ttw-wide-only` on the grid. Both layouts therefore exist in the server HTML
 * and the choice costs no JavaScript, so the section is its final height from
 * the first paint.
 *
 * It used to be a `useMediaQuery` ternary. That hook starts at `false`, so the
 * server and first client render always produced the desktop grid and the page
 * shrank at hydration — see the note by `.ttw-narrow-only` in globals.css for
 * what that did to Meta's in-app webview.
 *
 *   items — [{ key, node }]   (node is the already-built card element)
 *
 * Nav arrows are bound per-instance via callback refs held in state: once the
 * buttons mount, the state update re-renders and Swiper (v9) re-binds its
 * navigation to the real elements. This avoids the stale-ref problem of
 * onBeforeInit and the selector collisions of shared class names when several
 * rails live on the same page.
 */
const MobileCardCarousel = ({
  items = [],
  slidesPerView = 1,
  spaceBetween = 16,
  className = "",
}) => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <div className={`${styles.railWrap} ${className}`.trim()}>
      <Swiper
        className={styles.rail}
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={{ prevEl, nextEl }}
        /* Above 640px this rail is display:none, and Swiper measures 0-width
           slides when it initialises hidden. These make it re-measure when the
           element becomes visible, so a desktop→mobile resize (or a rotation)
           gets a correctly laid-out rail instead of a stack of zero-width
           slides. */
        observer
        observeParents
      >
        {items.map((it) => (
          <SwiperSlide key={it.key} className={styles.slide}>
            {it.node}
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
  );
};

export default MobileCardCarousel;
