import React from "react";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { getIndianPrice } from "../../../services/getIndianPrice";
import PackageCard from "../home/PackageCard";

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
    total_price,
    price,
    starting_price,
    payment_information,
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
    number_of_adults,
    number_of_children,
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

  const heading = title || name;
  const tierLabel = tier || tag || "Most popular";
  const isPopular =
    String(tierLabel).toLowerCase().includes("best") ||
    String(tierLabel).toLowerCase().includes("value") ||
    String(tierLabel).toLowerCase().includes("popular");

  const totalPax =
    (Number(number_of_adults) || 0) + (Number(number_of_children) || 0);

  // Prefer an already per-person value when the backend provides one.
  const perPersonValue =
    payment_information?.per_person_discounted_cost ||
    payment_information?.per_person_cost;

  // Otherwise derive it from the total cost divided by the number of travellers.
  const totalValue =
    total_price ||
    price ||
    starting_price ||
    payment_information?.discounted_cost;

  // Only ever show a per-person price. If we can't get one (no per-person
  // value from the backend and no total/pax to derive it), show no price.
  const perPersonPrice = perPersonValue
    ? perPersonValue
    : totalValue && totalPax > 0
    ? Math.round(totalValue / totalPax)
    : null;

  const routeCities = cities && cities.length ? cities : [];
  const route = routeCities
    .map((c) => (typeof c === "string" ? c : c.name || c.title))
    .filter(Boolean);

  // Counts for the inclusions row
  const staysCount = countItems(stays) || routeCities.length || 0;
  const activitiesCount =
    countItems(activities) ||
    routeCities.reduce(
      (p, c) => p + countItems(c.activities) + countItems(c.pois),
      0
    ) ||
    0;
  const flightsCount = countItems(flights) || (routeCities.length > 1 ? 2 : 1);
  const transfersCount =
    countItems(transfers) ||
    (routeCities.length ? Math.max(routeCities.length - 1, 1) : 0);

  const includes = [
    staysCount ? `${staysCount} Stays` : null,
    flightsCount ? `${flightsCount} Flights` : null,
    transfersCount ? `${transfersCount} Transfers` : null,
    activitiesCount ? `${activitiesCount} Activities` : null,
  ].filter(Boolean);

  const travellers = [
    number_of_adults
      ? `${number_of_adults} adult${number_of_adults === 1 ? "" : "s"}`
      : null,
    number_of_children
      ? `${number_of_children} child${number_of_children === 1 ? "" : "ren"}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const handleClick = () => {
    if (onClick) return onClick(itinerary);
    if (id) window.location.assign("/itinerary/" + id);
    else if (path) window.location.assign("/" + path);
    else if (slug) window.location.assign("/itinerary/" + slug);
  };

  return (
    <PackageCard
      image={resolvedImage}
      tier={tierLabel}
      tierVariant={isPopular ? "popular" : "default"}
      route={route}
      title={heading}
      includes={includes}
      travellers={travellers || null}
      price={
        perPersonPrice
          ? { amount: `₹${getIndianPrice(perPersonPrice)}`, per: "/ person" }
          : null
      }
      ctaLabel="View trip"
      onClick={handleClick}
    />
  );
};

export default ItineraryCardV2;
