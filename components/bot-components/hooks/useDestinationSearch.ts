import { useEffect, useRef, useState } from "react";
import { MERCURY_HOST } from "../../../services/constants";
import { resolveImage } from "../components/IntakeForm/constants";
import type { Destination } from "../components/IntakeForm/types";

interface SuggestRow {
  name: string;
  type?: string; // "Country" | "City"
  resource_id?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
  path?: string;
  is_active?: boolean;
}

function mapRow(row: SuggestRow): Destination {
  return {
    name: row.name,
    image: resolveImage(row.image ?? null),
    country: row.country || (row.type === "Country" ? row.name : undefined),
    resource_id: row.resource_id,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    place_tag: row.country ? `${row.type ?? "Place"} · ${row.country}` : row.type,
  };
}

/**
 * Debounced lookup against the geos suggest endpoint. Fires only for queries of
 * ≥2 characters; aborts in-flight requests when the query changes or the hook
 * unmounts. Returns CDN-resolved destination rows.
 */
export function useDestinationSearch(query: string, minChars = 2) {
  const [results, setResults] = useState<Destination[]>([]);
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
        const base = MERCURY_HOST || "https://dev.mercury.tarzanway.com";
        const res = await fetch(
          `${base}/api/v1/geos/search/suggest/?q=${encodeURIComponent(q)}`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );
        if (!res.ok) throw new Error(`suggest ${res.status}`);
        const data: SuggestRow[] = await res.json();
        const mapped = (Array.isArray(data) ? data : [])
          .filter((r) => r && r.name && r.is_active !== false)
          .slice(0, 8)
          .map(mapRow);
        setResults(mapped);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("[useDestinationSearch] failed:", err?.message || err);
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

export default useDestinationSearch;
