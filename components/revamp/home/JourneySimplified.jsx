import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./JourneySimplified.module.scss";
import { getIndianPrice } from "../../../services/getIndianPrice";

/*
 * "How it works" — three humanized steps.
 *
 * Each step has a number, a title (can include <span className="ttwSerif">),
 * a paragraph, and an optional "demo" node (chat preview / curator card).
 * Pass `steps` to reuse on a similar marketing surface.
 */

const ChatDemo = ({ you, kaira }) => (
  <div className={styles.demo}>
    <span className={styles.you}>{you.label || "You"}</span>
    {you.text}
    <div className={styles.k}>
      <span className={styles.kLabel}>{kaira.label || "Kaira"}</span>
      <span>{kaira.text}</span>
    </div>
  </div>
);

const CuratorCard = ({ name, blurb }) => (
  <div className={styles.curator}>
    <div className={styles.curatorPhoto} aria-hidden />
    <div>
      <div className={styles.curatorName}>{name}</div>
      <div className={styles.curatorBlurb}>{blurb}</div>
    </div>
  </div>
);

const DEFAULT_STEPS = [
  {
    title: (
      <>
        Tell Kaira what&apos;s{" "}
        <span className={styles.serif}>on your mind.</span>
      </>
    ),
    body: "Budget, dates, must-haves. Write like you'd text a friend — Hindi, Hinglish, English, all fine.",
    extra: (
      <ChatDemo
        you={{ label: "You", text: "Vietnam, 6 days, Hoi An + cruise, ₹1.4L couple" }}
        kaira={{ label: "Kaira", text: "Here are a few options…" }}
      />
    ),
  },
  {
    title: (
      <>
        A travel expert <span className={styles.serif}>fine-tunes</span> it.
      </>
    ),
    body: "An on-ground curator adjusts what Kaira can't feel — monsoon timing, overrated spots, the quiet ghat at 6am.",
    extra: (
      <CuratorCard
        name="Nimmi · On-ground curator"
        blurb="Swaps Hoi An → Da Nang this month. Knows the real cardamom road."
      />
    ),
  },
  {
    title: (
      <>
        Change anything. <span className={styles.serif}>Unlimited</span>{" "}
        revisions.
      </>
    ),
    body: "Different hotels? An extra night? More activities? Keep tweaking until it feels right.",
    extra: (
      <ChatDemo
        you={{
          label: "You",
          text: "Thinking of hostels this time to meet new people.",
        }}
        kaira={{
          label: "Expert",
          text: "Alright, updating. Lmk if you want to see more options.",
        }}
      />
    ),
  },
  {
    title: (
      <>
        Book only what you <span className={styles.serif}>pick.</span>
      </>
    ),
    body: "Pay only for what you choose. Transparent pricing, no hidden markups. Book, swap, or cancel anything from inside the chat.",
    extra: (
      <ChatDemo
        you={{ label: "Final itinerary", text: "6 nights · flights + stays · ₹1,38,400" }}
        kaira={{ label: "Kaira →", text: " book in 30 seconds. Cancel up to 48h before." }}
      />
    ),
  },
];

const cityName = (c) =>
  typeof c === "string" ? c : c?.name || c?.title || c?.display_name || "";

const getNights = (it) =>
  it?.number_of_nights ||
  it?.nights ||
  it?.total_nights ||
  it?.duration ||
  it?.days ||
  0;

const getPrice = (it) =>
  it?.total_price ||
  it?.price ||
  it?.starting_price ||
  it?.payment_information?.per_person_discounted_cost ||
  it?.payment_information?.discounted_cost ||
  0;

const shortPrice = (n) => {
  if (!n) return "";
  if (n >= 100000)
    return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  return `₹${getIndianPrice(n)}`;
};

// Builds the three "how it works" steps from real page data. Steps 1 & 3 use
// the page's first itinerary (destination, nights, price); step 2 swaps in the
// page's own cities. Any piece without data falls back to DEFAULT_STEPS.
const buildDynamicSteps = ({ itinerary, cities = [], destinationName }) => {
  const next = DEFAULT_STEPS.map((s) => ({ ...s }));
  const last = next.length - 1;
  const dest = destinationName || "";
  const itinCities = ((itinerary && itinerary.cities) || [])
    .map(cityName)
    .filter(Boolean);
  const pageCities = (cities || []).map(cityName).filter(Boolean);
  const nights = getNights(itinerary);
  const price = getPrice(itinerary);

  if (itinerary) {
    const topCities = itinCities.slice(0, 2).join(" + ");
    const youText = [
      `${dest || itinCities[0] || "Trip"}${nights ? ` ${nights} nights` : ""}`,
      topCities || null,
      price ? `${shortPrice(price)} couple` : null,
    ]
      .filter(Boolean)
      .join(", ");

    next[0] = {
      ...next[0],
      extra: (
        <ChatDemo
          you={{ label: "You", text: youText }}
          kaira={{ label: "Kaira", text: "On it. Checking 1,147 platforms now…" }}
        />
      ),
    };

    next[last] = {
      ...next[last],
      extra: (
        <ChatDemo
          you={{
            label: "Final itinerary",
            text: `${nights ? `${nights} nights · ` : ""}flights + stays${
              price ? ` · ${shortPrice(price)}` : ""
            }`,
          }}
          kaira={{
            label: "Kaira →",
            text: " book in 30 seconds. Cancel up to 48h before.",
          }}
        />
      ),
    };
  }

  const swapCities = pageCities.length >= 2 ? pageCities : itinCities;
  if (swapCities.length >= 2) {
    const [c1, c2] = swapCities;
    next[1] = {
      ...next[1],
      extra: (
        <CuratorCard
          name="Nimmi, 34 · On-ground curator"
          blurb={`Swaps ${c1} → ${c2} this month. Knows the real ${
            dest || "local"
          } route.`}
        />
      ),
    };
  }

  return next;
};

const JourneySimplified = ({ steps, itinerary, cities = [], destinationName }) => {
  const resolvedSteps =
    steps ||
    (itinerary || (cities && cities.length)
      ? buildDynamicSteps({ itinerary, cities, destinationName })
      : DEFAULT_STEPS);
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.head}>
          <div>
            <h2>
              How it <span className={styles.serif}>works.</span>
            </h2>
            <p className={styles.lede}>
              Kaira plans fast.{" "}
              <span className={styles.serif}>Humans catch</span> what AI misses.
              You only pay for what you pick.
            </p>
          </div>
        </div>

        <div className={styles.carouselWrap}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.1}
            navigation={{
              nextEl: ".journey-next",
              prevEl: ".journey-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
          >
            {resolvedSteps.map((step, idx) => (
              <SwiperSlide key={idx} className={styles.slide}>
                <div className={styles.step}>
                  <div className={styles.num}>{idx + 1}</div>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.body}>{step.body}</p>
                  {step.extra}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            aria-label="Previous step"
            className={`journey-prev ${styles.navBtn} ${styles.navPrev}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div
            aria-label="Next step"
            className={`journey-next ${styles.navBtn} ${styles.navNext}`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySimplified;
