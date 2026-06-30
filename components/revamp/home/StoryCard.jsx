import ImageWithSkeleton from "../destination/ImageWithSkeleton";
import styles from "./TravelerStoriesSection.module.scss";

/*
 * Generic editorial card used by:
 *   - TravelerStoriesSection (home page traveller moments)
 *   - MyTripsSection (a user's planned trips)
 *
 * Props (all optional except `image`):
 *   image       — background image URL for the card hero
 *   badge       — top-left pill ("Vietnam · 5 nights" / "Released")
 *   moment      — bold one-line headline (ReactNode supported)
 *   detail      — supporting paragraph (ReactNode supported)
 *   author      — { initial, name, location, avatarVariant: 'coral'|'pink'|'blue'|'green' }
 *   rating      — number; renders next to a star
 *   onClick     — click/keydown handler (whole card)
 *   className   — extra class merged onto the card root
 *
 * The card stays purely visual. Pass anything that fits the shape; do not
 * add API/data-coupling here. New sections should call it directly.
 */

const avatarClass = (variant) => {
  const map = {
    coral: styles.avCoral,
    pink: styles.avPink,
    blue: styles.avBlue,
    green: styles.avGreen,
  };
  return `${styles.avatar} ${map[variant] || styles.avCoral}`;
};

const StoryCard = ({
  image,
  badge,
  moment,
  detail,
  author,
  rating,
  onClick,
  className = "",
}) => {
  const interactive = typeof onClick === "function";

  return (
    <a
      className={`${styles.card} ${className}`.trim()}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (interactive && e.key === "Enter") onClick(e);
      }}
    >
      <ImageWithSkeleton src={image} asBackground className={styles.img}>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
      </ImageWithSkeleton>
      <div className={styles.body}>
        {moment ? <div className={styles.moment}>{moment}</div> : null}
        {detail ? <div className={styles.detail}>{detail}</div> : null}
        {(author || rating != null) && (
          <div className={styles.foot}>
            {author ? (
              <div className={styles.authorRow}>
                <div className={avatarClass(author.avatarVariant)}>
                  {author.initial}
                </div>
                <span>
                  <b>{author.name}</b>
                  {author.location ? <> · {author.location}</> : null}
                </span>
              </div>
            ) : (
              <span />
            )}
            {rating != null ? (
              <div className={styles.rating}>
                <span className={styles.ratingStar}>★</span>
                {rating}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </a>
  );
};

export default StoryCard;
