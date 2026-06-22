import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import PackageCard from "../home/PackageCard";
import packageStyles from "../home/LuxuryEuropeDestinations.module.scss";
import { MERCURY_HOST } from "../../../services/constants";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { getIndianPrice } from "../../../services/getIndianPrice";

/*
 * MyTripsSection — renders a logged-in user's plans using the shared
 * <PackageCard> design from the homepage's connected-trips section. The
 * card layout (image / route / title / includes / price + CTA) lives
 * in components/revamp/home/PackageCard.jsx; this file only handles the
 * trip-data fetch and the trip → PackageCard prop mapping.
 */

/* ---------- trip → PackageCard mapping ---------- */

const STATUS_TO_TIER = {
  Released: { tier: "Released", variant: "premium" },
  Confirmed: { tier: "Confirmed", variant: "popular" },
  Draft: { tier: "Draft", variant: "default" },
};

const buildRoute = (trip) => {
  const cities = trip?.cities || trip?.itinerary_locations || trip?.locations || [];
  return cities.map((c) => c?.name).filter(Boolean);
};

const buildIncludes = (trip) => {
  const summary = trip?.payment_information?.summary || {};
  const out = [];
  Object.entries(summary).forEach(([label, val]) => {
    const count = val?.count;
    if (count) out.push(`${count} ${label.toLowerCase()}`);
  });
  if (trip?.number_of_adults) {
    const pax = [
      trip.number_of_adults ? `${trip.number_of_adults} adult${trip.number_of_adults === 1 ? "" : "s"}` : null,
      trip.number_of_children ? `${trip.number_of_children} child${trip.number_of_children === 1 ? "" : "ren"}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    if (pax) out.push(pax);
  }
  return out;
};

const buildPrice = (trip) => {
  const info = trip?.payment_information || {};
  if (info.are_prices_hidden) return null;

  const totalPax =
    (Number(trip?.number_of_adults) || 0) + (Number(trip?.number_of_children) || 0);

  // Only ever show a per-person price: prefer a per-person value from the
  // backend, otherwise derive it from the total cost divided by travellers.
  const perPersonValue =
    info.per_person_discounted_cost ||
    (info.discounted_cost != null && totalPax > 0
      ? Math.round(info.discounted_cost / totalPax)
      : null);

  if (perPersonValue == null) return null;
  return { amount: `₹${getIndianPrice(perPersonValue)}`, per: "/ person" };
};

const tripToPackage = (trip) => {
  const rawImage = Array.isArray(trip?.image) ? trip.image[0] : trip?.images?.[0];
  const statusInfo = STATUS_TO_TIER[trip?.status];
  return {
    id: trip?.id,
    slug: trip?.slug,
    image: rawImage ? `${imgUrlEndPoint}${rawImage}` : undefined,
    tier: statusInfo?.tier,
    tierVariant: statusInfo?.variant,
    route: buildRoute(trip),
    title: trip?.name || "Untitled trip",
    includes: buildIncludes(trip),
    price: buildPrice(trip),
  };
};

/* ---------- Component ---------- */

const MyTripsSection = ({ apiItineraries, className = "" }) => {
  const router = useRouter();
  const [trips, setTrips] = useState(apiItineraries || []);
  const [plansCount, setPlansCount] = useState(null);
  const currency = useSelector((state) => state.UserLocation)?.location;

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) return;
    const query = `?currency=${currency?.currency || "INR"}&limit=4&offset=0`;
    axios
      .get(`${MERCURY_HOST}/api/v1/itinerary/my-plans/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTrips(res?.data?.data?.plans || []);
        setPlansCount(res?.data?.results ?? null);
      })
      .catch((err) => console.log("[ERROR][MyTrips:fetch]", err.message));
  }, [currency?.currency]);

  if (!trips || trips.length === 0) return null;

  return (
    <section className={packageStyles.section}>
      <div className={`ttwContainer ${className}`.trim()}>
        <div className="ttwSectionHead">
          <div className={packageStyles.headLeft}>
            <span className={packageStyles.kicker}>
              <span className={packageStyles.kickerStar}>★</span>
              Your plans
            </span>
            <h2>
              Pick up where{" "}
              <span className="ttwSerif">you left off.</span>
            </h2>
            <p className="ttwLede">
              {plansCount
                ? `${plansCount} plan${plansCount === 1 ? "" : "s"} in your library.`
                : "Tap any trip to keep planning with Kaira."}
            </p>
          </div>
          <button
            type="button"
            className="ttwSectionLink"
            onClick={() => router.push("/dashboard")}
            style={{ background: "transparent", border: 0, cursor: "pointer" }}
          >
            View all plans
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        <div className={packageStyles.grid}>
          {trips.map((trip) => {
            const pkg = tripToPackage(trip);
            return (
              <PackageCard
                key={pkg.id}
                image={pkg.image}
                tier={pkg.tier}
                tierVariant={pkg.tierVariant}
                route={pkg.route}
                title={pkg.title}
                includes={pkg.includes}
                price={pkg.price}
                ctaLabel="Open in planner"
                onClick={() => router.push(`/chat/${trip.id}`)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyTripsSection;
