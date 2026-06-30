import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./MobileCardCarousel.module.scss";

/*
 * Mobile-only swipeable rail. Callers render their normal grid on desktop and
 * swap to this on small screens (gate with the useMedia hook), so the same
 * cards become a peek-and-swipe carousel on phones.
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
  slidesPerView = 1.12,
  spaceBetween = 16,
}) => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <div className={styles.railWrap}>
      <Swiper
        className={styles.rail}
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={{ prevEl, nextEl }}
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
