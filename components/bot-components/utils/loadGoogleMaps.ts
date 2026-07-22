// On-demand Google Maps JS API loader (CWV).
//
// The Maps SDK used to load via a <script> in _document's <head>, so it
// downloaded on EVERY page even though maps only appear inside the bot. It is
// now injected lazily the first time a map or geocoder is actually needed
// (bot map view / route geocoding). The promise is memoised so concurrent
// callers share a single script tag and later calls resolve instantly.

let mapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const w = window as any;
  if (w.google?.maps) return Promise.resolve();
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps]"
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("maps load failed")));
      return;
    }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = () => resolve();
    script.onerror = () => {
      mapsPromise = null; // allow a retry on a later interaction
      reject(new Error("maps load failed"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}
