import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../ui/button/Index";
import { format } from "date-fns";
import media from "../media";
import axiostailoredinstance, {
  itineraryInitiate,
  itineraryComplete,
} from "../../services/leads/tailored";
import LoadingLottie from "../ui/LoadingLottie";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import Flickity from "./Flickity";
import { EXPERIENCE_FILTERS_BOX } from "../../services/constants";
import { fadeIn } from "react-animations";
import Popup from "../ErrorPopup";
import { RxCross2 } from "react-icons/rx";
import usePageLoaded from "../custom hooks/usePageLoaded";
import { logEvent } from "../../services/ga/Index";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Header from "../../components/navbar/Index";
import { Body1M_16, Body3R_12 } from "../new-ui/Body";

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  height: max-content;
  padding: 2px;
  color: black;
  z-index: ${(props) => (props.showBlack ? "1006" : "2")};
  position: relative;
  background-color: ${(props) =>
    props.slideIndex || props.tailoredFormModal
      ? "white"
      : "rgba(255,255,255,0.9)"};
  width: 100%;
  border: none !important;

  @media screen and (min-width: 768px) {
    ${(props) => props.tailoredFormModal && "height : 100%"};
    margin: auto 0;
    min-height: 500px;
  }
`;

const BlackContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1005;
  width: 100vw;
  display: none;
  height: 100vh;
  animation: 0.5s ${fadeInAnimation};
  @media screen and (min-width: 768px) {
    display: initial;
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  position: absolute;
  bottom: 30%;
  opacity: 0.8;
`;

const useSourceParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const source = useMemo(() => {
    const queryObj = {};
    for (const [key, value] of searchParams.entries()) {
      if (value === "true") queryObj[key] = true;
      else if (value === "false") queryObj[key] = false;
      else if (!isNaN(value)) queryObj[key] = Number(value);
      else queryObj[key] = value;
    }

    let resolvedPath = pathname;
    for (const [key, val] of Object?.entries(params)) {
      resolvedPath = resolvedPath?.replace(`[${key}]`, val);
    }

    return {
      path: resolvedPath,
      ...queryObj,
    };
  }, [pathname, searchParams, params]);

  return source;
};

const Enquiry = (props) => {
  const router = useRouter();
  const [route,setRoute]=useState([]);
  const routerquery = router.query;
  const initialInputId = Date.now();
  const { token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [valueStart, setValueStart] = useState(null);
  const [valueEnd, setValueEnd] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfInfants, setNumberOfInfants] = useState(0);
  const [budget, setBudget] = useState("Affordable");
  const [isLoading, setIsLoading] = useState(false);
  const [roomConfiguration, setRoomConfiguration] = useState([
    {
      adults: 1,
      children: 0,
      childAges: [],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [priceRange, setPriceRange] = useState({
    min_price: 0,
    max_price: 3000,
  });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [focusedDate, setFocusedDate] = useState(null);
  const [groupType, setGroupType] = useState("Solo");
  const [startingLocation, setStartingLocation] = useState(false);
  const isPageLoaded = usePageLoaded();
  const [destination, setDestination] = useState(
    routerquery.destination || props.destination
  );
  const popupObj = {
    dateStart: false,
    dateEnd: false,
    group: false,
    InputOne: false,
  };
  const [showPopup, setShowPopup] = useState(popupObj);
  const [showBlack, setShowBlack] = useState(false);
  const [submitSecondSlide, setSubmitSecondSlide] = useState(false);
  const [itineraryId, setItineraryId] = useState(null);
  const [error, setError] = useState(null);
  const [addHotels, setAddHotels] = useState(false);
  const [addFlights, setAddFlights] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [defaultPriceRange, setDefaultPriceRange] = useState({
    min_price: 0,
    max_price: 3000,
  });

  const headings = ["Build Your Travel Plan — Easy, Fun, and Just the Way You Like It.", "Route Overview — Customize Your Journey from Start to Finish!", "Let’s Set Things Up — Tell Us Who’s In & What You Need to Make It Perfect?", "Almost There — Let's Personalize the Final Details of Your Trip.", "Awesome! We've got your details."]

  let isPageWide = media("(min-width: 768px)");
  const source = useSourceParams();

  const divideTravellers = () => {
    let distribution = [];

    let tempadults = numberOfAdults;
    let tempChildren = numberOfChildren;
    let tempInfants = numberOfInfants;
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

  useEffect(() => {
    if (props.tailoredFormModal) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.tailoredFormModal]);

  useEffect(() => {
    if (loginComplete && props.token && props.phone !== "null") {
      _submitDataHandler();
    }
    setShowPopup(popupObj);
  }, [slideIndex, props.token, props.phone]);

  useEffect(() => {
    if (props.userLocation) {
      const userLocation = props.userLocation;
      if (userLocation.text && userLocation.place_id)
        setStartingLocation({
          name: userLocation.text,
          place_id: userLocation.place_id,
        });
    }
  }, [props.userLocation]);

  var selectedObj;

  // if (routerquery.state && !routerquery.city) {
  //   selectedObj = [
  //     {
  //       destination_id: routerquery.page_id || props.page_id,
  //       name: routerquery.destination || props.destination,
  //       input_id: initialInputId,
  //     },
  //   ];
  // } else if (routerquery.country && !routerquery.city) {
  //   selectedObj = [
  //     {
  //       id: routerquery.page_id || props.page_id,
  //       name: routerquery.destination || props.destination,
  //       input_id: initialInputId,
  //       type: "Country",
  //     },
  //   ];
  // }else if(routerquery.city){
  //     selectedObj = [
  //     {
  //       id: routerquery.page_id || props.page_id,
  //       name: routerquery.destination || props.destination,
  //       input_id: initialInputId,
  //       type: "City",
  //     },
  //   ];
  // }
  //  else {
  //   selectedObj = [
  //     {
  //       id: routerquery.page_id || props.page_id,
  //       name: routerquery.destination || props.destination,
  //       input_id: initialInputId,
  //       type: routerquery?.type ? routerquery.type : props?.destinationType,
  //     },
  //   ];
  // }

  const queryType = router?.query?.type?.toLowerCase();
  const propType = props?.type?.toLowerCase();

  if (queryType === "page" || propType === "page") {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "Page",
      },
    ];
  } else if ((routerquery.state && !routerquery.city) || propType === "state") {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "State",
      },
    ];
  } else if ((routerquery.city) || propType === "city" || queryType === "city") {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "City",
      },
    ];
  } else if (routerquery.country || propType === "country") {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "Country",
      },
    ];
  } else if (routerquery.continent || queryType === "continent" || propType === "continent") {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "Continent",
      },
    ];
  } else {
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: routerquery?.type || props?.destinationType,
      },
    ];
  }




  const _handleHideBlack = () => {
    setShowCities(false);
    setShowSearchStarting(false);
  };

  const _submitDataHandler = () => {
    const value_start = new Date(valueStart);
    const value_end = new Date(valueEnd);

    if (isSubmitting) {
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    let cityids = [];
    let locations = [];
    let stateIds = [];
    let countryIds = [];
    let continentIds = [];
    let preferences = [];
    let pageIds = [];

    for (var i = 0; i < selectedPreferences.length; i++) {
      for (var j = 0; j < EXPERIENCE_FILTERS_BOX.length; j++) {
        if (selectedPreferences[i] === EXPERIENCE_FILTERS_BOX[j].display) {
          for (var k = 0; k < EXPERIENCE_FILTERS_BOX[j].actual.length; k++) {
            preferences.push(EXPERIENCE_FILTERS_BOX[j].actual[k]);
          }
          break;
        }
      }
    }

    try {
      for (var i = 0; i < selectedCities.length; i++) {
        if (
          cityids.indexOf(selectedCities[i].id) == -1 &&
          selectedCities[i].id
        ) {
          if (selectedCities[i].type?.toLowerCase() == "state")
            stateIds.push(selectedCities[i].id);
          else if (selectedCities[i].type?.toLowerCase() == "country")
            countryIds.push(selectedCities[i].id);
          else if (selectedCities[i].type?.toLowerCase() == "continent")
            continentIds.push(selectedCities[i].id);
          else if (selectedCities[i].type?.toLowerCase() == "city" || selectedCities[i].type?.toLowerCase() == "location") {
            cityids.push(selectedCities[i].id);
          }
          else {
            continentIds.push(selectedCities[i].id);
          }
          locations.push(selectedCities[i].name);
        }
      }
    } catch { }


    let dist = divideTravellers()
    const start_date = format(value_start, "yyyy-MM-dd");
    const end_date = format(value_end, "yyyy-MM-dd");

    let number_of_adults = 2,
      number_of_children = 0,
      number_of_infants = 0;

    if (groupType === "Solo") {
      number_of_adults = 1;
    } else if (groupType === "Couple") {
      number_of_adults = 2;
    } else {
      number_of_adults = numberOfAdults;
      number_of_children = numberOfChildren;
      number_of_infants = numberOfInfants;
    }

    //     const source = {
    //   path: router.pathname, 
    //   ...router.query,       
    // };

    let data = null;
    data = {
      source,
      experience_filters_selected: preferences,
      budget: budget,
      start_date: start_date,
      end_date: end_date,
      group_type: groupType || "Solo",
      number_of_adults: number_of_adults,
      number_of_children: number_of_children,
      number_of_infants: number_of_infants,
      flexible_dates: flexible,
      user_location: {
        place_id: startingLocation
          ? startingLocation.place_id
          : "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
      },
      room_configuration: dist,
      price_range: priceRange,
    };

    if (selectedCities[0].destination_id) {
      data.destination_id = [selectedCities[0].destination_id];
    }
    if (continentIds.length) data.destination_id = continentIds;
    if (stateIds.length) data.state_id = stateIds;
    if (countryIds.length) data.country_id = countryIds;
    if (pageIds.length) data.page_id = pageIds;
    if (cityids.length) data.city_id = cityids;
    if (locations.length) data.locations = locations;
    if (start_date === "1970-01-01") data.start_date = "";
    if (end_date === "1970-01-01") data.end_date = "";
    if (startingLocation) data;

    completeItineraryCreate();
  };

  const _prevSlideHandler = () => {
    if (slideIndex) setSlideIndex(slideIndex - 1);
  };

  const getHeading = () => {
    if (props.tailoredFormModal && focusedDate) {
      if (focusedDate == "startDate") return "Please select start date.";
      if (focusedDate == "endDate") return "Please select end date.";
    } else return "Get your free travel plan now";
  };

  const [selectedCities, setSelectedCities] = useState(selectedObj);



  useEffect(() => {
    setShowPopup(popupObj);
  }, [
    valueStart,
    valueEnd,
    startingLocation,
    destination,
    showSearchStarting,
    showCities,
    groupType,
    selectedCities.length,
    slideIndex,
  ]);

  const _SlideOneSubmitHandler = () => {
    if (!selectedCities[0].destination_id && !selectedCities[0].id) {
      return setShowPopup({ ...showPopup, InputOne: true });
    }
    if (!valueStart && !flexible) {
      return setShowPopup({ ...showPopup, dateStart: true });
    }
    if (!valueEnd && !flexible) {
      return setShowPopup({ ...showPopup, dateEnd: true });
    }

    setShowPopup(popupObj);
    if (props.HeroBanner && isPageWide) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    initiateItineraryCreate();
  };

  const _SlideTwoSubmitHandler = () => {
    if (!submitSecondSlide) return setShowPopup({ ...showPopup, group: true });
    setShowPopup(popupObj);
    setSlideIndex(slideIndex + 1);
    let dist = divideTravellers();
    setRoomConfiguration(dist);
  };

  const _SlideThreeSubmitHandler = () => {
    setSlideIndex(slideIndex + 1);
  };

  const initiateItineraryCreate = () => {
    const start_date = valueStart
      ? format(new Date(valueStart), "yyyy-MM-dd")
      : null;
    const end_date = valueEnd ? format(new Date(valueEnd), "yyyy-MM-dd") : null;

    let cityids = [];
    let locations = [];
    let stateIds = [];
    let countryIds = [];
    let continentIds = [];
    let preferences = [];
    let pageIds = [];

    for (var i = 0; i < selectedPreferences.length; i++) {
      for (var j = 0; j < EXPERIENCE_FILTERS_BOX.length; j++) {
        if (selectedPreferences[i] === EXPERIENCE_FILTERS_BOX[j].display) {
          for (var k = 0; k < EXPERIENCE_FILTERS_BOX[j].actual.length; k++) {
            preferences.push(EXPERIENCE_FILTERS_BOX[j].actual[k]);
          }
          break;
        }
      }
    }

    try {
      for (var i = 0; i < selectedCities.length; i++) {
        if (
          cityids.indexOf(selectedCities[i].id) == -1 &&
          selectedCities[i].id
        ) {
          if (selectedCities[i].type?.toLowerCase() == "page") {
            pageIds.push(selectedCities[i].id);
          } else if (selectedCities[i].type?.toLowerCase() == "state")
            stateIds.push(selectedCities[i].id);
          else if (selectedCities[i].type?.toLowerCase() == "country")
            countryIds.push(selectedCities[i].id);
          else if (selectedCities[i].type?.toLowerCase() == "continent") {
            continentIds.push(selectedCities[i].id);
            pageIds.push(selectedCities[i].id);
          }
          else {
            cityids.push(selectedCities[i].id);
          }
          locations.push(selectedCities[i].name);
        }
      }
    } catch { }



    const data = {
      source,
      experience_filters_selected: preferences,
      start_location: {
        gmaps_place_id: startingLocation
          ? startingLocation.place_id
          : "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
      }, // Start location build itinerary from - Can be empty
      cities: cityids, // City ids to build itinerary
      pages: [], // Page ids (from web customization) to build itinerary - Theme pages and continent itineraries
      states: stateIds, // State ids to build itinerary
      countries: countryIds, // Country ids to build itinerary
      pages: pageIds,
      end_location: {}, // If empty, it is same as start_location
      start_date: start_date, // YYYY-MM-DD
      end_date: end_date, // YYYY-MM-DD
      flexible_dates: flexible, //  If this is true, then start and end dates are decided automatically
    };

    setIsLoading(true);
    itineraryInitiate
      .post("", data)
      .then((res) => {
        const data = res.data;
        

       setError(null);
        setItineraryId(data.itinerary_id);
        setIsLoading(false);
        setSlideIndex(slideIndex + 1);
        setRoute(data.basic_route);

        const hotelsBudget = data?.hotels_budget;
        if (hotelsBudget) {
          const minPrice = parseInt(0.5 * hotelsBudget);
          const maxPrice = parseInt(1.5 * hotelsBudget);
          setDefaultPriceRange({ min_price: minPrice, max_price: maxPrice });
        }
      })
      .catch((err) => {
        console.log("ERROR: ", err.message);
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => { });

  const completeItineraryCreate = () => {
    let number_of_adults = 2;
    let number_of_children = 0;
    let number_of_infants = 0;

    if (groupType === "Solo") {
      number_of_adults = 1;
    } else if (groupType === "Couple") {
      number_of_adults = 2;
    } else {
      number_of_adults = numberOfAdults;
      number_of_children = numberOfChildren;
      number_of_infants = numberOfInfants;
    }
    let dist = divideTravellers();


    const data = {
      source,
      // : {
      //   path: router.asPath,
      // },
      itinerary_id: itineraryId,
      group_type: groupType || "Solo",
      price_range: priceRange,
      number_of_adults: number_of_adults,
      number_of_children: number_of_children,
      number_of_infants: number_of_infants,
      room_configuration: slideIndex == 1 ? dist : roomConfiguration,
      add_hotels: addHotels,
      add_flights: addFlights,
    };

    setLoading(true);
    setIsSubmitting(true);
    localStorage.removeItem("MyPlans");

    itineraryComplete
      .post("", data, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setError(null);
        setSubmitted(true);
        window.location.href = `/itinerary/${itineraryId}`;
        window.scrollTo(0, 0);

        logEvent({
          action: "conversion",
          params: {
            send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
          },
        });
      })
      .catch((err) => {
        console.log("ERROR >>>", err);
        setLoading(false);
        setIsSubmitting(false);
        setError(err.message);
        router.push("/thank-you");
      });
  };

  const totalSlides = localStorage.getItem("access_token") ? 4 : 5;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = ((slideIndex + 1) / totalSlides) * circumference;
  return (
    <div className="flex h-full w-full justify-center items-center">
      {showBlack && !props.tailoredFormModal ? (
        <BlackContainer onClick={() => _handleHideBlack()}></BlackContainer>
      ) : null}

      <Container
        showBlack={showBlack}
        tailoredFormModal={props.tailoredFormModal}
        slideIndex={slideIndex}
      >
        {showPopup.InputOne && (
          <Popup
            setShowPopup={setShowPopup}
            top={props.tailoredFormModal ? "17rem" : "12.6rem"}
            mobileTop="14rem"
            left="10px"
            text="Please select your destination!"
          />
        )}

        {showPopup.dateStart && !flexible && (
          <Popup
            setShowPopup={setShowPopup}
            bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
            left="10px"
            text="Please select starting date!"
          />
        )}

        {showPopup.dateEnd && !flexible && (
          <Popup
            setShowPopup={setShowPopup}
            bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
            left="170px"
            mobileleft={"135px"}
            text="Please select ending date!"
          />
        )}

        {/* {showPopup.group && (
          <Popup
            setShowPopup={setShowPopup}
            top={props.tailoredFormModal ? "16rem" : "190px"}
            left="20%"
            tipLeft="45%"
            text="Please select your group type!"
          />
        )} */}

        <div
          style={{
            padding: props.tailoredFormModal ? "0rem 1rem" : "0.5rem 1rem",
            marginBottom: slideIndex === 2 ? "0rem" : "0rem",
          }}
          className="w-full flex flex-row items-center"
        >
          {slideIndex ? (
            <div className="center-div">
              <BiArrowBack
                onClick={_prevSlideHandler}
                className="hover-pointer"
                style={{ marginTop: "2px", fontSize: "1.5rem" }}
              ></BiArrowBack>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* main block */}
        <div className="flex flex-col items-center justify-center  h-full">
          <div style={{ padding: "0 1rem", width: "100%" }} className="h-max  font-inter flex flex-col items-center gap-[46px]">
            <div className="relative w-full flex justify-center">
              <h1 className="text-black font-inter text-[40px] font-bold leading-[48px] text-center max-w-[800px]">
                {headings[slideIndex]}
              </h1>

              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  {/* Background Circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#F0F0F0"
                    strokeWidth="6"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#5CBA66"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                  {/* Text in Center */}
                  <text
                    x="32"
                    y="32"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                  >
                    <tspan fontSize="16" fontWeight="500">{slideIndex + 1}</tspan>
                    <tspan fontSize="16" fontWeight="500" dy={"1"}>/</tspan>
                    <tspan fontSize="12" fontWeight="400" dy="2">{totalSlides}</tspan>
                  </text>

                </svg>
              </div>

            </div>

            <div className="max-w-[600px] ">
              <Flickity
                initialInputId={initialInputId}
                focusedDate={focusedDate}
                setFocusedDate={setFocusedDate}
                tailoredFormModal={props.tailoredFormModal}
                flexible={flexible}
                setFlexible={setFlexible}
                startingLocation={startingLocation}
                setStartingLocation={setStartingLocation}
                children_cities={props.children_cities}
                showSearchStarting={showSearchStarting}
                setShowSearchStarting={setShowSearchStarting}
                showCities={showCities}
                setShowCities={setShowCities}
                destination={destination}
                setDestination={setDestination}
                token={props.token}
                phone={props.phone}
                slideIndex={slideIndex}
                cities={props.cities}
                selectedCities={selectedCities}
                setSelectedCities={setSelectedCities}
                valueStart={valueStart}
                valueEnd={valueEnd}
                setValueStart={setValueStart}
                setValueEnd={setValueEnd}
                groupType={groupType}
                setGroupType={setGroupType}
                numberOfAdults={numberOfAdults}
                setNumberOfAdults={setNumberOfAdults}
                numberOfChildren={numberOfChildren}
                setNumberOfChildren={setNumberOfChildren}
                numberOfInfants={numberOfInfants}
                setNumberOfInfants={setNumberOfInfants}
                setBudget={setBudget}
                selectedPreferences={selectedPreferences}
                setSelectedPreferences={setSelectedPreferences}
                setSubmitSecondSlide={setSubmitSecondSlide}
                eventDates={props.eventDates}
                roomConfiguration={roomConfiguration}
                setRoomConfiguration={setRoomConfiguration}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                addHotels={addHotels}
                setAddHotels={setAddHotels}
                addFlights={addFlights}
                setAddFlights={setAddFlights}
                setSlideIndex={setSlideIndex}
                setLoginComplete={setLoginComplete}
                defaultPriceRange={defaultPriceRange}
                route={route}
              ></Flickity>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              {slideIndex === 0 &&
                <Button
                  fontSize="1rem"
                  width={!isPageWide ? "auto" : "100%"}
                  style={
                    !isPageWide && isPageLoaded
                      ? {
                        position: "fixed",
                        left: "1rem",
                        right: "1rem",
                        bottom: "0",
                      }
                      : {}
                  }
                  padding="0.5rem 2rem"
                  fontWeight="500"
                  margin="30px 0"
                  borderRadius="5px"
                  borderWidth="1px"
                  bgColor="#07213A"
                  onclick={_SlideOneSubmitHandler}
                  loading={isLoading}
                  disabled={isLoading}
                  height="50px"
                  color="white"
                >
                  Continue
                </Button>
              }

              {slideIndex === 1 && (
                (!props.token || props.phone === "null" || addHotels) && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      fontSize="1rem"
                      width={!isPageWide ? "auto" : "100%"}
                      style={
                        !isPageWide
                          ? {
                            position: "fixed",
                            left: "1rem",
                            right: "1rem",
                            bottom: "0",
                          }
                          : {}
                      }
                      padding="0.5rem 2rem"
                      fontWeight="500"
                      margin="1rem 0"
                      borderRadius="5px"
                      borderWidth="1px"
                      bgColor="#07213A"
                      onclick={() => setSlideIndex(2)}
                      loading={isLoading && submitted}
                      height="50px"
                      color="white"
                    >
                      Continue
                    </Button>
                  </div>
                )
              )}

              {slideIndex === 2 &&
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    fontSize="1rem"
                    width={!isPageWide ? "auto" : "100%"}
                    style={
                      !isPageWide
                        ? {
                          position: "fixed",
                          left: "1rem",
                          right: "1rem",
                          bottom: "0",
                        }
                        : {}
                    }
                    padding="0.5rem 2rem"
                    fontWeight="500"
                    margin="30px 0"
                    borderRadius="5px"
                    borderWidth="1px"
                    bgColor="#07213A"
                    onclick={_SlideTwoSubmitHandler}
                    loading={isLoading && submitted}
                    height="50px"
                    color="white"
                  >
                    Continue
                  </Button>
                </div>
              }

              {slideIndex === 3 && (
                <div className="flex justify-end">
                  <Button
                    fontSize="1rem"
                    width={!isPageWide ? "auto" : "100%"}
                    style={
                      !isPageWide
                        ? { position: "fixed", left: "1rem", right: "1rem", bottom: "0" }
                        : {}
                    }
                    padding="0.5rem 2rem"
                    fontWeight="500"
                    margin="40px 0"
                    borderRadius="5px"
                    borderWidth="1px"
                    bgColor="#07213A"
                    color="white"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onclick={
                      () => {
                        setSlideIndex(4);
                        _SlideThreeSubmitHandler;
                      }
                    }
                    height="50px"
                  >
                    Continue
                  </Button>
                </div>
              )}
              {slideIndex === 4 ? (
                <div className="flex justify-end">
                  <Button
                    fontSize="1rem"
                    width={!isPageWide ? "auto" : "100%"}
                    style={
                      !isPageWide
                        ? { position: "fixed", left: "1rem", right: "1rem", bottom: "0" }
                        : {}
                    }
                    padding="0.5rem 2rem"
                    fontWeight="500"
                    margin="40px 0"
                    borderRadius="5px"
                    borderWidth="1px"
                    bgColor="#07213A"
                    color="white"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={
                      _submitDataHandler
                    }
                    height="50px"
                  >
                    Continue
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    userLocation: state.UserLocation.location,
  };
};

export default connect(mapStateToPros)(Enquiry);