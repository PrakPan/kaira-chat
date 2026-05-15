import styles from "./LuxuryEuropeDestinations.module.scss";

/*
 * Generic "package" card — image-left / body-right layout with a tier
 * badge, a route ribbon, a title, an inclusions row, and a price + CTA
 * footer. Used by:
 *   - LuxuryEuropeDestinations (connected-trips section on the homepage)
 *   - MyTripsSection (a logged-in user's plans)
 *
 * Pure visual component. Pass data via props; no API/data-coupling lives
 * here. Styles come from LuxuryEuropeDestinations.module.scss so both
 * callers share a single design.
 *
 * Props (all optional except `image`):
 *   image       — background image URL
 *   tier        — badge text ("Most booked", "Premium", "Family-friendly")
 *   tierVariant — 'default' | 'premium' | 'popular' (colour scheme)
 *   route       — string[] of waypoints, separated by arrows in the UI
 *   title       — ReactNode (supports inline serif spans)
 *   includes    — string[] of green-check inclusions
 *   price       — { amount, per }
 *   ctaLabel    — call-to-action text (defaults to "Tailor in chat")
 *   onClick     — click/keydown handler (whole card)
 *   className   — extra class merged onto the card root
 */

const Arrow = () => <span className={styles.arrow} aria-hidden />;

const tierClassName = (variant) => {
  if (variant === "premium") return `${styles.tier} ${styles.tierPremium}`;
  if (variant === "popular") return `${styles.tier} ${styles.tierPopular}`;
  return styles.tier;
};

const PackageCard = ({
  image,
  tier,
  tierVariant,
  route,
  title,
  includes,
  price,
  ctaLabel = "Tailor in chat",
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
      <div
        className={styles.img}
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      >
        {tier ? (
          <span className={tierClassName(tierVariant)}>
            {tierVariant === "popular" ? "★ " : ""}
            {tier}
          </span>
        ) : null}
      </div>

      <div className={styles.body}>
        {Array.isArray(route) && route.length > 0 ? (
          <div className={styles.route}>
            {route.map((stop, idx) => (
              <span
                key={`${stop}-${idx}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                {stop}
                {idx < route.length - 1 && <Arrow />}
              </span>
            ))}
          </div>
        ) : null}

        {title ? <h3 className={styles.title}>{title}</h3> : null}

        {Array.isArray(includes) && includes.length > 0 ? (
          <div className={styles.includes}>
            {includes.map((inc, i) => (
              <span key={`${inc}-${i}`} className={styles.include}>
                {inc}
              </span>
            ))}
          </div>
        ) : null}

        <div className={styles.meta}>
          {price ? (
            <div className={styles.price}>
              {price.from !== false ? (
                <span className={styles.priceFrom}>{price.fromLabel || "From"}</span>
              ) : null}
              <span className={styles.priceAmount}>{price.amount}</span>
              {price.per ? (
                <span className={styles.pricePer}>{price.per}</span>
              ) : null}
            </div>
          ) : (
            <span />
          )}
          {ctaLabel ? (
            <span className={styles.cta}>
              {ctaLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
};

export default PackageCard;
