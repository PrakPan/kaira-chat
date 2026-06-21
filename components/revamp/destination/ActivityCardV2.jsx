import React from "react";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { getIndianPrice } from "../../../services/getIndianPrice";
import ImageWithSkeleton from "./ImageWithSkeleton";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const ActivityCardV2 = ({ item, kairaPick = false, onClick }) => {
  if (!item) return null;
  const {
    name,
    title,
    display_name,
    description,
    one_liner_description,
    image,
    rating,
    user_ratings_total,
    price,
    total_price,
    tag,
    tags,
  } = item;

  const heading = display_name || title || name || "";
  const desc = one_liner_description || description || "";
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${imgUrlEndPoint}${image}`
    : "";
  const priceValue = total_price || price;
  const tagList = Array.isArray(tags) && tags.length
    ? tags
    : tag
    ? [tag]
    : kairaPick
    ? ["★ Kaira's pick"]
    : [];

  const handleClick = () => {
    if (onClick) onClick(item);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={styles.ttdCard}
    >
      <ImageWithSkeleton
        src={resolvedImage}
        asBackground
        className={styles.ttdImg}
      >
      </ImageWithSkeleton>
      <div className={styles.ttdBody}>
        <h4>{heading}</h4>
        {desc && <p>{desc}</p>}
        {/* <div className={styles.ttdFoot}>
          {rating || user_ratings_total ? (
            <span className={styles.ttdRating}>
              <span className="star">★</span> {rating || "4.7"}
              {user_ratings_total ? ` · ${user_ratings_total} reviews` : ""}
            </span>
          ) : (
            <span />
          )}
          {priceValue ? (
            <span className={styles.ttdPrice}>
              ₹{getIndianPrice(priceValue)} <small>/pp</small>
            </span>
          ) : null}
        </div> */}
      </div>
    </div>
  );
};

export default ActivityCardV2;
