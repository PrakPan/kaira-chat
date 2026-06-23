import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { fadeIn } from "react-animations";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import getPlatform from "../../../utils/getPlatform";
import { useRouter } from "next/router";
import { getAdParams } from "../../../helper/adAttribution";
const fadeInAnimation = keyframes`${fadeIn}`;


// Derive the room configuration to show for an itinerary.
// The itinerary's traveller counts (number_of_adults/children/infants) are the
// source of truth — a saved room_configuration can be stale (e.g. the default
// 2 adults / 1 room) even when the itinerary actually has 10 travellers.
// Priority:
//  1. Derive from the itinerary's pax counts when present:
//     total travellers = adults + children + infants, rooms = ceil((adults + children) / 2),
//     UNLESS a saved room_configuration already matches those counts (keep their split).
//  2. Fall back to the saved room_configuration when there are no pax counts.
//  3. Fall back to the default 2 travellers / 1 room.
export const deriveRoomConfiguration = (itinerary) => {
  const existing = itinerary?.hotels_config?.room_configuration;
  const adults = itinerary?.number_of_adults || 0;
  const children = itinerary?.number_of_children || 0;
  const infants = itinerary?.number_of_infants || 0;

  // No traveller info for this itinerary → keep their saved rooms, else default.
  if (adults + children + infants === 0) {
    if (existing && existing.length > 0) return existing;
    return [{ adults: 2, children: 0, infants: 0, childAges: [] }];
  }

  // Keep the saved room split only when it already matches the itinerary's pax.
  if (existing && existing.length > 0) {
    let savedAdults = 0;
    let savedChildren = 0;
    let savedInfants = 0;
    for (const room of existing) {
      savedAdults += room?.adults || 0;
      savedChildren += room?.children || 0;
      savedInfants += room?.infants || 0;
    }
    if (
      savedAdults === adults &&
      savedChildren === children &&
      savedInfants === infants
    ) {
      return existing;
    }
  }

  const roomCount = Math.max(1, Math.ceil((adults + children) / 2));
  const rooms = Array.from({ length: roomCount }, () => ({
    adults: 0,
    children: 0,
    infants: 0,
    childAges: [],
  }));

  // Distribute travellers round-robin across the rooms so the totals match the
  // itinerary's pax. childAges only tracks children (Pax ignores infants).
  let idx = 0;
  for (let i = 0; i < adults; i++) {
    rooms[idx % roomCount].adults += 1;
    idx += 1;
  }
  idx = 0;
  for (let i = 0; i < children; i++) {
    rooms[idx % roomCount].children += 1;
    rooms[idx % roomCount].childAges.push(10);
    idx += 1;
  }
  idx = 0;
  for (let i = 0; i < infants; i++) {
    rooms[idx % roomCount].infants += 1;
    idx += 1;
  }

  return rooms;
};

export const divideTravellers = (slideThreeData) => {
  let distribution = [];

  let tempadults = slideThreeData?.roomConfiguration?.[0]?.adults||slideThreeData.numberOfAdults;
  let tempChildren = slideThreeData?.roomConfiguration?.[0]?.children||slideThreeData.numberOfChildren;
  let tempInfants = slideThreeData?.roomConfiguration?.[0]?.infants||slideThreeData.numberOfInfants;
  while (tempadults != 0) {
    if (tempadults >= 2) {
      distribution.push({ adults: 2, children: 0 });
      tempadults -= 2;
    } else {
      distribution.push({ adults: tempadults, children: 0 });
      tempadults = 0;
    }
  }

  let childIdx = 0;

  while (tempChildren != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempChildren -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(10);
    childIdx += 1;
  }

  while (tempInfants != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempInfants -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(1);
    childIdx += 1;
  }

  return distribution;
};

export function buildPreferences(selectedPreferences, EXPERIENCE_FILTERS_BOX) {
  let preferences = [];
  for (let pref of selectedPreferences) {
    const box = EXPERIENCE_FILTERS_BOX.find(b => b.display === pref);
    if (box) preferences.push(...box.actual);
  }
  return preferences;
}

export function classifyLocations(selectedCities) {
  let cityids = [];
  let stateIds = [];
  let countryIds = [];
  let continentIds = [];
  let pageIds = [];
  let locations = [];

  for (let city of selectedCities) {
    if (!city?.id) continue;
    if (cityids.includes(city.id)) continue;

    switch (city.type?.toLowerCase()) {
      case "page":
        pageIds.push(city.id);
        break;
      case "state":
        stateIds.push(city.id);
        break;
      case "country":
        countryIds.push(city.id);
        break;
      case "continent":
        continentIds.push(city.id);
        pageIds.push(city.id);
        break;
      default:
        cityids.push(city.id);
    }
    locations.push(city.name);
  }

  return { cityids, stateIds, countryIds, continentIds, pageIds, locations };
}

export function buildItineraryPayload({
  source,
  selectedPreferences,
  EXPERIENCE_FILTERS_BOX,
  selectedCities,
  startingLocation,
  dateData,
  session_id = null,
}) {
  const preferences = buildPreferences(selectedPreferences, EXPERIENCE_FILTERS_BOX);
  const { cityids, stateIds, countryIds, continentIds, pageIds } =
    classifyLocations(selectedCities);

  const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : null);

  let datesPayload = { type: dateData.type, duration: dateData.duration };

  if (dateData.type === "fixed") {
    datesPayload.start_date = formatDate(dateData.start_date);
    datesPayload.end_date = formatDate(dateData.end_date);
  } else if (dateData.type === "flexible") {
    datesPayload.month = dateData.month;
    datesPayload.year = dateData.year;
  } 

  return {
    source,
    experience_filters_selected: preferences,
    start_location: {
      gmaps_place_id: startingLocation?.place_id || "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
    },
    cities: cityids,
    states: stateIds,
    countries: countryIds,
    continents: continentIds,
    pages: pageIds,
    end_location: {},
    dates: datesPayload,
    ...(session_id != null && { session_id })

  };
}

export const useSourceParams = () => {
  const router = useRouter();
  const platform = getPlatform();

  const source = React.useMemo(() => {
    // Read directly from browser URL (most reliable)
    const queryObj = {};
    
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      for (const [key, value] of urlParams.entries()) {
        if (value === "true") queryObj[key] = true;
        else if (value === "false") queryObj[key] = false;
        else if (!isNaN(Number(value)) && value !== '') queryObj[key] = Number(value);
        else queryObj[key] = value;
      }
      
    }
    
    // Fallback to router.query if window.location gave nothing
    if (Object.keys(queryObj).length === 0) {
      Object.assign(queryObj, router.query);

    }

    // Merge persisted ad attribution as a fallback so the itinerary payload
    // always carries utm_*/gclid even if the URL was stripped during navigation.
    // URL value wins when present; storage fills the gaps.
    const stored = getAdParams();
    const merged = { ...stored, ...queryObj };

    const resolvedSource =
      merged.source || router?.asPath || merged.utm_source;


    return {
      path: router.asPath,
      platform,
      ...merged,
      source: resolvedSource,
    };
  }, [router.query, router.asPath, platform]);

  return source;
};


export const Container = styled.div`
  height: max-content;
  padding: 2px;
  color: black;
  width: 100%;
  border: none !important;

  @media screen and (min-width: 768px) {
    ${(props) => props.tailoredFormModal && "height : 100%"};
    margin: auto 0;
    min-height: 500px;
  }
`;

export const BlackContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1005;
  width: 100%;
  display: none;
  animation: 0.5s ${fadeInAnimation};
  @media screen and (min-width: 768px) {
    display: initial;
  }
`;

export const headings = [
  "Select Your Travel Destinations and Dates",
  "Customize Your Journey from Start to Finish",
  "Select your Group Type & Inclusions",
  "Select Your Hotel Preferences",
  // "Awesome! We've Got Your Details",
];
