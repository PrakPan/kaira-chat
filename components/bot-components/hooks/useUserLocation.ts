import { useState, useEffect } from "react";
import { MapState, UserLocation } from "../types";

const STORAGE_KEY = "userLocation";

export const useUserLocation = (
  setMapState: React.Dispatch<React.SetStateAction<MapState>>
) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Check cache first
        const cachedLocation = localStorage.getItem(STORAGE_KEY);

        if (cachedLocation) {
          const userLoc: UserLocation = JSON.parse(cachedLocation);
          setUserLocation(userLoc);
          setMapState({
            lat: userLoc.lat,
            lng: userLoc.lng,
            zoom: 4,
          });
          setIsLoadingLocation(false);
          return;
        }

        // Fetch from API
        const locationResponse = await fetch("https://ipapi.co/json/");
        const locationData = await locationResponse.json();

        if (
          locationData.city &&
          locationData.latitude &&
          locationData.longitude
        ) {
          const userLoc: UserLocation = {
            lat: locationData.latitude,
            lng: locationData.longitude,
            city: locationData.city,
            regionName: locationData.region,
            country: locationData.country_name,
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(userLoc));

          setUserLocation(userLoc);
          setMapState({
            lat: locationData.latitude,
            lng: locationData.longitude,
            zoom: 4,
          });
        }
      } catch (error) {
        console.error("Error getting IP location:", error);
        
        // Fallback to cache
        const cachedLocation = localStorage.getItem(STORAGE_KEY);
        if (cachedLocation) {
          const userLoc: UserLocation = JSON.parse(cachedLocation);
          setUserLocation(userLoc);
          setMapState({
            lat: userLoc.lat,
            lng: userLoc.lng,
            zoom: 4,
          });
        }
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getUserLocation();
  }, [setMapState]);

  return { userLocation, isLoadingLocation };
};