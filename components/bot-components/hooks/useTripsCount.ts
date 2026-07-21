import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import myPlansInstance from "../../../services/sales/MyPlans";

/**
 * Total trips on the user's /dashboard, for the "My trips" badge.
 *
 * Same source and response shape the dashboard itself reads for its
 * "My Trips (N)" heading (containers/userprofile/Index.js) — the total lives on
 * `data.results`, NOT `data.data.plans.length`, which is only the current page.
 * `limit=1` because we want the count, not the rows.
 *
 * Returns null while loading, when logged out, or on any failure — callers
 * should render no badge rather than a zero.
 */
export const useTripsCount = (): number | null => {
  const token = useSelector((state: any) => state.auth?.token);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setCount(null);
      return;
    }

    let cancelled = false;
    myPlansInstance
      .get("/?currency=INR&limit=1&offset=0", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: any) => {
        if (cancelled) return;
        const total = res?.data?.results;
        setCount(typeof total === "number" ? total : null);
      })
      .catch(() => {
        // A missing badge is fine; a wrong count is not.
        if (!cancelled) setCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return count;
};
