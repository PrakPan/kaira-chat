import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { getIndianPrice } from "../../../services/getIndianPrice";
import ImageWithSkeleton from "./ImageWithSkeleton";
import styles from "../../../styles/pages/revamp/destination.module.scss";


const Arrow = () => <span className={styles.arrow} aria-hidden />;

const renderRoute = (cities = []) => {
  if (!cities || !cities.length) return null;
  const labels = cities
    .map((c) => (typeof c === "string" ? c : c.name || c.title))
    .filter(Boolean);
  return labels.map((label, i) => (
    <React.Fragment key={`${label}-${i}`}>
      <span>{label}</span>
      {i < labels.length - 1 && <Arrow />}
    </React.Fragment>
  ));
};

const countItems = (arrLike) => {
  if (!arrLike) return 0;
  if (Array.isArray(arrLike)) return arrLike.length;
  if (typeof arrLike === "number") return arrLike;
  return 0;
};

const ItineraryCardV2 = ({ itinerary, onClick }) => {
  if (!itinerary) return null;
  const {
    name,
    title,
    image,
    images,
    duration,
    nights,
    total_price,
    price,
    starting_price,
    payment_information,
    curator,
    curated_by,
    cities = [],
    tier,
    tag,
    path,
    slug,
    id,
    stays,
    flights,
    transfers,
    activities,
  } = itinerary;

  const firstImage =
    (Array.isArray(images) && images.length && (images[0]?.image || images[0])) ||
    image ||
    "";
  const resolvedImage = firstImage
    ? typeof firstImage === "string" && firstImage.startsWith("http")
      ? firstImage
      : `${imgUrlEndPoint}${firstImage}`
    : "";

  const durationN =
    nights ||
    duration ||
    (cities && cities.length
      ? cities.reduce((p, c) => p + (c.duration || 0), 0)
      : 0);
  const nightsLabel = durationN ? `${durationN} Nights` : null;

  const heading = title || name;
  const curatorName = curator || curated_by || "Kaira";
  const tierLabel = tier || tag || "Most popular";
  const isPopular =
    String(tierLabel).toLowerCase().includes("best") ||
    String(tierLabel).toLowerCase().includes("value") ||
    String(tierLabel).toLowerCase().includes("popular");

  const priceValue =
    total_price ||
    price ||
    starting_price ||
    payment_information?.per_person_discounted_cost ||
    payment_information?.discounted_cost;

  const routeCities = cities && cities.length ? cities : [];

  // Counts for "includes" grid
  const staysCount = countItems(stays) || routeCities.length || 0;
  const activitiesCount =
    countItems(activities) ||
    (routeCities.reduce(
      (p, c) =>
        p + countItems(c.activities) + countItems(c.pois),
      0
    ) || 0);
  const flightsCount =
    countItems(flights) || (routeCities.length > 1 ? 2 : 1);
  const transfersCount =
    countItems(transfers) ||
    (routeCities.length ? Math.max(routeCities.length - 1, 1) : 0);

  const includes = [
    { num: staysCount, label: "Stays" },
    { num: flightsCount, label: "Flights" },
    { num: transfersCount, label: "Transfers" },
    { num: activitiesCount, label: "Activities" },
  ].filter((i) => i.num > 0);

  const handleClick = () => {
    if (onClick) return onClick(itinerary);
    if (id) window.location.assign("/itinerary/" + id);
    else if (path) window.location.assign("/" + path);
    else if (slug) window.location.assign("/itinerary/" + slug);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={styles.itinCard}
    >
      <ImageWithSkeleton
        src={resolvedImage}
        asBackground
        className={styles.itinImg}
      >
        {nightsLabel && (
          <div className={styles.itinNights}>{nightsLabel}</div>
        )}
        {tierLabel && (
          <div
            className={`${styles.itinTier} ${
              isPopular ? styles.itinTierPopular : ""
            }`}
          >
            {tierLabel}
          </div>
        )}
      </ImageWithSkeleton>
      <div className={styles.itinBody}>
        {routeCities.length > 0 && (
          <div className={styles.itinRoute}>{renderRoute(routeCities)}</div>
        )}
        <h3 className={styles.itinCardTitle}>{heading}</h3>
        {/* <div className={styles.itinBy}>
          <div className={styles.itinByAvatar} />
          Curated by <b>{curatorName}</b>
        </div> */}
        {includes.length > 0 && (
          <div className={styles.itinIncludes} style={{fontWeight: "bold"}}>
            {includes.map((inc) => (
              <div key={inc.label} className={styles.itinIncItem}>
                <span className="num">{inc.num}</span>
                <span>{inc.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.itinMeta} style={{fontWeight: "bold"}}>
          {priceValue ? (
            <div className={styles.itinPrice}>
              <div className="from">From</div>
              <div className="amount">
                ₹{getIndianPrice(priceValue)}
                <span className="per"> / couple</span>
              </div>
            </div>
          ) : (
            <div />
          )}
          <div className={styles.itinCta}>
            View trip
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCardV2;
