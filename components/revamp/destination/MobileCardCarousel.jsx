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
import useMediaQuery from "../../../hooks/useMedia";
import styles from "./MobileCardCarousel.module.scss";

// Card sections render as their original CSS-grid on desktop and a swipeable,
// one-card-per-view rail (with prev/next nav) on mobile (<= 640px). Gated with
// the same useMediaQuery hook the homepage card sections use — a JS switch,
// not a CSS `sm:` toggle — so the desktop grid is guaranteed to render.
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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const slides = React.Children.toArray(children);

  if (!slides.length) return null;

  if (!isMobile) {
    return <div className={gridClass}>{children}</div>;
  }

  return (
    <div className={styles.railWrap}>
      <Swiper
        className={styles.rail}
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={{ prevEl, nextEl }}
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
  );
};

export default MobileCardCarousel;
