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
 *   travellers  — optional string rendered as its own row below the
 *                 inclusions, sharing the same green-check styling
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
  travellers,
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

        {travellers ? (
          <div className={styles.includes}>
            <div className="mt-[2px]">
             <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                      >
                        <path
                          d="M11.1133 6.75342C12.0266 7.37342 12.6666 8.21342 12.6666 9.33342V11.3334H15.3333V9.33342C15.3333 7.88008 12.9533 7.02008 11.1133 6.75342Z"
                          fill="#ACACAC"
                        />
                        <path
                          d="M9.99995 6.00008C11.4733 6.00008 12.6666 4.80675 12.6666 3.33341C12.6666 1.86008 11.4733 0.666748 9.99995 0.666748C9.68661 0.666748 9.39328 0.733415 9.11328 0.826748C9.66661 1.51341 9.99995 2.38675 9.99995 3.33341C9.99995 4.28008 9.66661 5.15341 9.11328 5.84008C9.39328 5.93341 9.68661 6.00008 9.99995 6.00008Z"
                          fill="#ACACAC"
                        />
                        <path
                          d="M6.00065 6.00008C7.47398 6.00008 8.66732 4.80675 8.66732 3.33341C8.66732 1.86008 7.47398 0.666748 6.00065 0.666748C4.52732 0.666748 3.33398 1.86008 3.33398 3.33341C3.33398 4.80675 4.52732 6.00008 6.00065 6.00008ZM6.00065 2.00008C6.73398 2.00008 7.33398 2.60008 7.33398 3.33341C7.33398 4.06675 6.73398 4.66675 6.00065 4.66675C5.26732 4.66675 4.66732 4.06675 4.66732 3.33341C4.66732 2.60008 5.26732 2.00008 6.00065 2.00008Z"
                          fill="#ACACAC"
                        />
                        <path
                          d="M6.00033 6.66675C4.22033 6.66675 0.666992 7.56008 0.666992 9.33341V11.3334H11.3337V9.33341C11.3337 7.56008 7.78032 6.66675 6.00033 6.66675ZM10.0003 10.0001H2.00033V9.34008C2.13366 8.86008 4.20033 8.00008 6.00033 8.00008C7.80032 8.00008 9.86699 8.86008 10.0003 9.33341V10.0001Z"
                          fill="#ACACAC"
                        />
                      </svg>
            </div>
            <span className={styles.notinclude}>{travellers}</span>
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
