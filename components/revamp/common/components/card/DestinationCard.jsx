import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AiFillStar } from "react-icons/ai";
import { useRouter } from "next/router";
import { imgUrlEndPoint } from "../../../../theme/ThemeConstants";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import ImageWithSkeleton from "../../../destination/ImageWithSkeleton";
import styles from "../../../../../styles/pages/revamp/destination.module.scss";

const DestinationCard = ({
  title,
  one_liner_description,
  description,
  rating,
  reviewCount,
  image,
  tags = [],
  height = "376px",
  onClick,
  className = "",
  showImageText = true,
  placesBragSection,
  link,
  total_price,
  // Consumed so they don't leak onto the DOM node.
  gradientOverlay,
  imageFallback,
  imageSrcSet,
  imageSizes,
  setShowTailoredModal,
}) => {
  const router = useRouter();

  const resolvedImage = image
    ? placesBragSection || String(image).startsWith("http")
      ? image
      : `${imgUrlEndPoint}${image}`
    : "";

  const tag = (Array.isArray(tags) && tags[0]) || "";
  const bestFor = one_liner_description || description || "";

  const handleClick = () => {
    if (onClick) return onClick();
    if (link) router.push(link);
  };

  // Full-bleed editorial card — mirrors CountryCardV2.
  if (showImageText) {
    const meta = [];
    if (rating)
      meta.push(
        <>
          <b>★ {rating}</b>
        </>
      );
    if (reviewCount)
      meta.push(
        <>
          <b>{Number(reviewCount).toLocaleString()}</b> reviews
        </>
      );
    if (total_price)
      meta.push(
        <>
          From <b>₹{getIndianPrice(total_price)}</b>
        </>
      );

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        className={`${styles.countryCard} ${className}`}
        style={{ height }}
      >
        <ImageWithSkeleton
          src={resolvedImage}
          asBackground
          className={styles.countryCardBg}
        />
        <div className={styles.countryCardShade} />
        {tag && <div className={styles.countryCardTag}>{tag}</div>}
        <div className={styles.countryCardArrow}>
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ color: "#0b1220", transform: "rotate(-45deg)" }}
          />
        </div>
        <div className={styles.countryCardBody}>
          <h3>
            <span className={styles.serif}>{title}</span>
          </h3>
          {bestFor && (
            <div className={styles.countryCardBestFor}>{bestFor}</div>
          )}
          {meta.length > 0 && (
            <div className={styles.countryCardMeta}>
              {meta.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Image on top, details below — used for activity / product cards.
  return (
    <div onClick={handleClick} className={`w-full cursor-pointer ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-lg sm:rounded-2xl"
        style={{ height }}
      >
        <ImageWithSkeleton
          src={resolvedImage}
          asBackground
          className="absolute inset-0 w-full h-full bg-cover bg-center"
        />
        {tag && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#F2F2F2E5] backdrop-blur-[50px] text-xs font-medium rounded-full">
            {tag}
          </div>
        )}
      </div>
      <div className="pt-3 sm:pt-4">
        <h3 className="font-semibold mb-1 text-md text-black">{title}</h3>
        {bestFor && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bestFor}</p>
        )}
        {(rating || reviewCount) && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <AiFillStar key={i} className="text-yellow-400 w-4 h-4" />
            ))}
            {reviewCount && (
              <span className="text-sm text-gray-600 ml-1">
                {rating} ({Number(reviewCount).toLocaleString()})
              </span>
            )}
          </div>
        )}
        {total_price && (
          <div className="flex flex-row items-center text-[20px] font-bold pt-2">
            ₹{getIndianPrice(total_price)}/-
            <span className="text-[12px] font-[400] ml-2">per person</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
