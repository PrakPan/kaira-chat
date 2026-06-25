import { useRef } from "react";
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
 * Nav arrows are bound per-instance via refs so multiple rails can live on the
 * same page without colliding on a shared selector.
 */
const MobileCardCarousel = ({
  items = [],
  slidesPerView = 1.12,
  spaceBetween = 16,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className={styles.railWrap}>
      <Swiper
        className={styles.rail}
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // refs aren't set on first render; wire them before Swiper inits.
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {items.map((it) => (
          <SwiperSlide key={it.key} className={styles.slide}>
            {it.node}
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        ref={prevRef}
        aria-label="Previous"
        className={`${styles.navBtn} ${styles.navPrev}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <div
        ref={nextRef}
        aria-label="Next"
        className={`${styles.navBtn} ${styles.navNext}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
};

export default MobileCardCarousel;
