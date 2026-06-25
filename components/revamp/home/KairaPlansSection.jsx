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

// Each card opens Kaira pre-briefed (or a real theme page where one exists),
// so it doubles as an SEO link to a destination/intent.
const chat = (seed) => `/chat?seed=${encodeURIComponent(seed)}`;

const TRAVEL_STYLES = [
  {
    id: "honeymoon-packages",
    tag: "Honeymoon",
    name: "Honeymoon packages",
    one_liner_description:
      "Slow mornings and quiet villas, planned around just the two of you.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Honeymoon package.jpg",
    link: chat("Honeymoon package"),
  },
  {
    id: "family-abroad",
    tag: "Family",
    name: "Family trips abroad",
    one_liner_description:
      "Easy routes, kid-friendly stays and plenty for everyone to do.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Familt trip abroad.jpg",
    link: chat("Family trip abroad"),
  },
  {
    id: "solo-itineraries",
    tag: "Solo",
    name: "Solo travel itineraries",
    one_liner_description:
      "Safe, social and well-paced. Routes built for travelling on your own.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/solo travel.jpg",
    link: chat("Solo travel itinerary"),
  },
  {
    id: "adventure-trips",
    tag: "Adventure",
    name: "Adventure trips",
    one_liner_description:
      "Treks, climbs and big-view days for travellers who like it active.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/adventure activity.jpg",
    link: chat("Adventure trip"),
  },
  {
    id: "maldives-budget",
    tag: "Beach",
    name: "Maldives on a budget",
    one_liner_description:
      "Overwater dreams without the overwater price. Local islands, smart timing.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/maldiv on budget.jpg",
    link: chat("Maldives on a budget"),
  },
  {
    id: "budget-international",
    tag: "Budget",
    name: "Budget international travel",
    one_liner_description:
      "Your first stamp abroad without breaking the bank. Real prices, no markups.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/budgetinternational.jpg",
    link: chat("Budget international trip"),
  },
  {
    id: "luxury-travel",
    tag: "Premium",
    name: "Luxury travel",
    one_liner_description:
      "Design hotels, private transfers and the good tables, sorted end to end.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/luxury travel.jpg",
    link: chat("Luxury holiday"),
  },
  {
    id: "japan-cherry",
    tag: "Seasonal",
    name: "Japan in cherry blossom season",
    one_liner_description:
      "Time it right for sakura. Kyoto, Tokyo and the quiet spots in between.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Japan in cherry blossom season .jpg",
    link: chat("Japan in cherry blossom season"),
  },
  {
    id: "bali-honeymoons",
    tag: "Honeymoon",
    name: "Bali for honeymoons",
    one_liner_description:
      "Ubud greens to Seminyak sunsets, shaped into one slow honeymoon.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Bali for honeymoon.jpg",
    link: chat("Bali honeymoon"),
  },
  {
    id: "vietnam-kids",
    tag: "Family",
    name: "Vietnam with kids",
    one_liner_description:
      "Lantern towns, junk-boat nights and food the whole family will love.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Vietnam with kids   .jpg",
    link: chat("Vietnam family trip with kids"),
  },
  {
    id: "thailand-weekend",
    tag: "Quick escape",
    name: "Thailand long weekends",
    one_liner_description:
      "Three days, two flights, one beach. A reset that fits a long weekend.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Thiland.jpg",
    link: chat("Thailand long weekend"),
  },
  {
    id: "europe-summer",
    tag: "Seasonal",
    name: "Europe in summer",
    one_liner_description:
      "Long days, lake towns and the classic run, timed for peak season.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Europe in summer.jpg",
    link: chat("Europe in summer"),
  },
  {
    id: "rajasthan-winter",
    tag: "India",
    name: "Rajasthan in winter",
    one_liner_description:
      "Forts, dunes and cool desert evenings. The best season to go.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Rajasthan in winter.jpg",
    link: chat("Rajasthan in winter"),
  },
  {
    id: "kerala-backwaters",
    tag: "India",
    name: "Kerala backwaters",
    one_liner_description:
      "Houseboats, slow canals and green that goes on for days.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Kerala backwaters.jpg",
    link: urls.travel_planner.KERALA,
  },
  {
    id: "ladakh-july",
    tag: "India",
    name: "Ladakh in July",
    one_liner_description:
      "High passes open, skies clear. The window to ride the Himalayas.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Ladakh in july.jpg",
    link: urls.travel_planner.LADAKH,
  },
  {
    id: "bhutan-delhi",
    tag: "Offbeat",
    name: "Bhutan from Delhi",
    one_liner_description:
      "Monasteries, mountain air and permits handled. Quietly unforgettable.",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/Bhutan from delhi.jpg",
    link: chat("Bhutan trip from Delhi"),
  },
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
            before, and knows{" "}
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
