import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import CountryCardV2 from "../destination/CountryCardV2";
import openTailoredModal from "../../../services/openTailoredModal";
import urls from "../../../services/urls";
import styles from "./KairaPlansSection.module.scss";

/*
 * "Let Kaira plan whatever's on your mind." — a swipeable rail of travel-style
 * / intent pages (the same set surfaced under "Travel Styles" in the footer).
 *
 * Cards reuse the editorial <CountryCardV2> so the rail matches the
 * destination carousels elsewhere on the site. Each card either deep-links to
 * a theme landing page or opens the "personalise" modal.
 */

const TRAVEL_STYLES = [
 
 
  {
    id: "summer-holidays",
    tag: "Seasonal",
    name: "Summer Holidays",
    one_liner_description:
      "Beat the heat — the best places to be when the city gets too hot.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format",
    link: urls.travel_planner.SUMMER,
  },
  {
    id: "road-trips",
    tag: "Self-drive",
    name: "Road Trips",
    one_liner_description:
      "Open roads and real routes — itineraries built for the drive.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&auto=format",
    link: urls.travel_planner.ROADTRIPS,
  },
  {
    id: "europe-1l",
    tag: "Budget",
    name: "Europe under 1 Lakh",
    one_liner_description:
      "Yes, really — a Europe trip that fits under a lakh per person.",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80&auto=format",
    link: urls.travel_planner.EUROPE_1_LAKH,
  },
   {
    id: "la-tomatina",
    tag: "Festival",
    name: "La Tomatina",
    one_liner_description:
      "Spain's wildest tomato fight — plan the whole Spain run around it.",
    image:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&q=80&auto=format",
    link: urls.travel_planner.LATOMATINA,
  },
  //  {
  //   id: "personalise",
  //   tag: "Made for you",
  //   name: "Personalise",
  //   one_liner_description:
  //     "Tell Kaira exactly what you want and she shapes a whole trip around it.",
  //   image:
  //     "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80&auto=format",
  //   action: "personalise",
  // }
];

const KairaPlansSection = ({ items = TRAVEL_STYLES }) => {
  const router = useRouter();

  const handleClick = (item) => {
    if (item.action === "personalise") return openTailoredModal(router);
    if (item.link) router.push(item.link);
  };

  return (
    <section
      style={{
        padding: "72px 0",
        background:
          "radial-gradient(ellipse 700px 320px at 95% 10%, var(--ttw-lavender) 0%, transparent 60%), var(--ttw-bg)",
      }}
    >
      <div className="ttwContainer">
        <div style={{ marginBottom: 32, width: "100%" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              margin: "0 0 12px 0",
              color: "var(--ttw-ink)",
            }}
          >
            Let Kaira plan whatever&apos;s{" "}
            <span className="ttwSerif">on your mind.</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--ttw-ink-3)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "920px",
            }}
          >
            A honeymoon in Santorini, a family trip to Japan, a solo run through
            Southeast Asia, or a long workation in Bali? Kaira has planned it
            before — and knows{" "}
            <span className="ttwSerif" style={{ color: "var(--ttw-ink)" }}>
              what actually works.
            </span>
          </p>
        </div>

        <div className={styles.railWrap}>
          <Swiper
            className={styles.rail}
            modules={[Navigation]}
            spaceBetween={18}
            slidesPerView={1.15}
            navigation={{
              nextEl: ".kaira-plans-next",
              prevEl: ".kaira-plans-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 18 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className={styles.slide}>
                <CountryCardV2 item={item} onClick={() => handleClick(item)} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            aria-label="Previous travel styles"
            className={`kaira-plans-prev ${styles.navBtn} ${styles.navPrev}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div
            aria-label="Next travel styles"
            className={`kaira-plans-next ${styles.navBtn} ${styles.navNext}`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KairaPlansSection;
