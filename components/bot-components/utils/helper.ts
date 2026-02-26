import { UserLocation } from "../types";


/**
 * Safely parse JSON from localStorage
 */
export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
};

/**
 * Format duration text
 */
export const formatDuration = (days: number): string => {
  return `${days} ${days === 1 ? "day" : "days"}`;
};

/**
 * Format location count text
 */
export const formatLocationCount = (count: number): string => {
  return `${count} location${count !== 1 ? "s" : ""} found`;
};

/**
 * Get user location from cache or return null
 */
export const getCachedUserLocation = (): UserLocation | null => {
  const cached = localStorage.getItem("userLocation");
  return safeJsonParse<UserLocation | null>(cached, null);
};

export const cacheUserLocation = (location: UserLocation): void => {
  try {
    localStorage.setItem("userLocation", JSON.stringify(location));
  } catch (error) {
    console.error("Error caching user location:", error);
  }
};


export const createBoundsFromLocations = (
  locations: Array<{ lat: number; lng: number }>
): google.maps.LatLngBounds => {
  const bounds = new window.google.maps.LatLngBounds();
  
  locations.forEach((location) => {
    bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
  });
  
  return bounds;
};