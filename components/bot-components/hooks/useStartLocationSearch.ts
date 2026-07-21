import { useEffect, useRef, useState } from "react";
import { MERCURY_HOST } from "../../../services/constants";

export interface StartLocation {
  /** Display label, e.g. "New Delhi, Delhi, India". */
  text: string;
  /** Google place id, kept so the backend can resolve the exact location. */
  place_id: string;
  types?: string[];
}

interface StartLocationRow {
  text?: string;
  place_id?: string;
  types?: string[];
}

/**
 * Debounced lookup against the geos `start_locations` endpoint — the departure
 * city / airport autocomplete used by the pricing form. Fires only for queries
 * of ≥2 characters; aborts in-flight requests when the query changes or the
 * hook unmounts.
 */
export function useStartLocationSearch(query: string, minChars = 2) {
  const [results, setResults] = useState<StartLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setResults([]);
      setLoading(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    setLoading(true);
    const handle = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const base = MERCURY_HOST;
        const res = await fetch(
          `${base}/api/v1/geos/search/start_locations/?q=${encodeURIComponent(q)}`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );
        if (!res.ok) throw new Error(`start_locations ${res.status}`);
        const data: StartLocationRow[] = await res.json();
        const mapped = (Array.isArray(data) ? data : [])
          .filter((r) => r && r.text)
          .slice(0, 8)
          .map((r) => ({
            text: r.text as string,
            place_id: r.place_id ?? "",
            types: r.types,
          }));
        setResults(mapped);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("[useStartLocationSearch] failed:", err?.message || err);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(handle);
  }, [query, minChars]);

  // Abort any pending request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  return { results, loading };
}

export default useStartLocationSearch;
