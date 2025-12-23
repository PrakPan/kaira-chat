import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { fadeIn } from "react-animations";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import getPlatform from "../../../utils/getPlatform";
const fadeInAnimation = keyframes`${fadeIn}`;


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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const platform = getPlatform();

  const source = React.useMemo(() => {
    const queryObj = {};

    for (const [key, value] of searchParams.entries()) {
      if (value === "true") queryObj[key] = true;
      else if (value === "false") queryObj[key] = false;
      else if (!isNaN(Number(value))) queryObj[key] = Number(value);
      else queryObj[key] = value;
    }

    let resolvedPath = pathname;
    for (const [key, val] of Object.entries(params || {})) {
      resolvedPath = resolvedPath.replace(`[${key}]`, val);
    }

    const resolvedSource =
      queryObj.utm_source ||
      queryObj.source ||
      "new-trip";

    return {
      path: resolvedPath,
      platform,
      ...queryObj,
      source: resolvedSource,
    };
  }, [pathname, searchParams, params, platform]);

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
