import React, { useState, useEffect } from "react";
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
import { connect } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import Flickity from "./Flickity";
import { EXPERIENCE_FILTERS_BOX } from "../../services/constants";
import { fadeIn } from "react-animations";
import Popup from "../ErrorPopup";
import { RxCross2 } from "react-icons/rx";
import usePageLoaded from "../custom hooks/usePageLoaded";
import { logEvent } from "../../services/ga/Index";

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  height: max-content;
  color: black;
  z-index: ${(props) => (props.showBlack ? "1006" : "2")};
  position: relative;
  background-color: ${(props) =>
    props.slideIndex || props.tailoredFormModal
      ? "white"
      : "rgba(255,255,255,0.9)"};
  width: 100%;
  border: none !important;
  border-radius: ${(props) =>
    props.tailoredFormModal ? "12px !important" : "8px !important"};
  @media screen and (min-width: 768px) {
    ${(props) => props.tailoredFormModal && "height : 100%"};
    margin: auto 0;

    min-height: 400px;
  }
`;

const CloseIcon = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: right;
  border-bottom: 1px solid #0000004a;
  padding-block: 1rem;
`;

const Heading = styled.p`
  font-size: 1.35rem;
  margin: 0.5rem 0 0.5rem 0;
  ${(props) => props.tailoredFormModal && "margin : 1rem 0"};
  text-align: left;
  font-weight: 600;
  color: black;
  line-height: normal;

  @media screen and (min-width: 815px) {
    font-size: 1.4rem;
    margin: 0.25rem 0 0.25rem 0;
    ${(props) => props.tailoredFormModal && "margin : 1rem 0"};
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

const Enquiry = (props) => {
  const router = useRouter();
  const routerquery = router.query;
  const initialInputId = Date.now();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [valueStart, setValueStart] = useState(null);
  const [valueEnd, setValueEnd] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfInfants, setNumberOfInfants] = useState(0);
  const [budget, setBudget] = useState("Affordable");
  const [isLoading, setIsLoading] = useState(false);
  const [roomConfiguration, setRoomConfiguration] = useState([
    {
      adults: 2,
      children: 0,
      childAges: [],
    },
  ]);
  const [priceRange, setPriceRange] = useState({
    min_price: 0,
    max_price: 3000,
  });
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [focusedDate, setFocusedDate] = useState(null);
  const [groupType, setGroupType] = useState(null);
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
  const [addTransfers, setAddTransfers] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [defaultPriceRange, setDefaultPriceRange] = useState({
    min_price: 0,
    max_price: 3000,
  });
  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    if (groupType === "Solo") {
      setRoomConfiguration([
        {
          adults: 1,
          children: 0,
          childAges: [],
        },
      ]);
    }
  }, [groupType]);

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

  if (routerquery.state && !routerquery.city) {
    console.log("PROPS", props);
    selectedObj = [
      {
        destination_id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
      },
    ];
  } else if (routerquery.country) {
    console.log("PROPS2", props);
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: "Country",
      },
    ];
  } else {
    console.log("PROPS3", props);
    selectedObj = [
      {
        id: routerquery.page_id || props.page_id,
        name: routerquery.destination || props.destination,
        input_id: initialInputId,
        type: routerquery?.type ? routerquery.type : props?.destinationType,
      },
    ];
  }

  //console.log("SelectedObj",selectedObj,routerquery);

  const _handleHideBlack = () => {
    // setShowBlack(false);
    setShowCities(false);
    setShowSearchStarting(false);
  };

  const _submitDataHandler = () => {
    const value_start = new Date(valueStart);
    const value_end = new Date(valueEnd);

    setLoading(true);

    let cityids = [];
    let locations = [];
    let stateIds = [];
    let countryIds = [];
    let continentIds = [];
    let preferences = [];

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
        // console.log("Selected Cities",selectedCities);
        if (
          cityids.indexOf(selectedCities[i].id) == -1 &&
          selectedCities[i].id
        ) {
          if (selectedCities[i].type == "State")
            stateIds.push(selectedCities[i].id);
          else if (selectedCities[i].type == "Country")
            countryIds.push(selectedCities[i].id);
          else if (selectedCities[i].type == "Continent")
            continentIds.push(selectedCities[i].id);
          else {
            cityids.push(selectedCities[i].id);
          }
          locations.push(selectedCities[i].name);
        }
      }
    } catch {}

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

    const source = {
      path: router.asPath,
      ...routerquery,
    };

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
      room_configuration: roomConfiguration,
      price_range: priceRange,
    };

    if (selectedCities[0].destination_id) {
      data.destination_id = [selectedCities[0].destination_id];
    }
    if (continentIds.length) data.destination_id = continentIds;
    if (stateIds.length) data.state_id = stateIds;
    if (countryIds.length) data.country_id = countryIds;
    if (cityids.length) data.city_id = cityids;
    if (locations.length) data.locations = locations;
    if (start_date === "1970-01-01") data.start_date = "";
    if (end_date === "1970-01-01") data.end_date = "";
    if (startingLocation) data;

    completeItineraryCreate();

    // setLoading(true);
    // localStorage.removeItem("MyPlans");

    // axiostailoredinstance
    //   .post("", data, {
    //     headers: {
    //       Authorization: `Bearer ${props.token}`,
    //     },
    //   })
    //   .then((response) => {
    //     setSubmitted(true);
    //     if (!response.data.auto_itinerary_created) {
    //       router.push("/thank-you");
    //     } else {
    //       if (response.data.loader_time) {
    //         window.location.href =
    //           "/itinerary/" +
    //           response.data.itinerary.itinerary_id +
    //           "?t=" +
    //           response.data.loader_time;
    //       } else {
    //         window.location.href =
    //           "/itinerary/" + response.data.itinerary.itinerary_id;
    //       }
    //       setLoading(false);

    //       logEvent({
    //         action: "conversion",
    //         params: {
    //           send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
    //         },
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     router.push("/thank-you");
    //   });
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
    // setSlideIndex(slideIndex + 1);
    if (props.HeroBanner && isPageWide) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    initiateItineraryCreate();
  };

  const _SlideTwoSubmitHandler = () => {
    if (!submitSecondSlide) return setShowPopup({ ...showPopup, group: true });
    setShowPopup(popupObj);
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
        // console.log("Selected Cities",selectedCities);
        if (
          cityids.indexOf(selectedCities[i].id) == -1 &&
          selectedCities[i].id
        ) {
          if (selectedCities[i].type == "State")
            stateIds.push(selectedCities[i].id);
          else if (selectedCities[i].type == "Country")
            countryIds.push(selectedCities[i].id);
          else if (selectedCities[i].type == "Continent")
            continentIds.push(selectedCities[i].id);
          else {
            cityids.push(selectedCities[i].id);
          }
          locations.push(selectedCities[i].name);
        }
      }
    } catch {}

    const data = {
      source: {
        path: router.asPath,
      },
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

  useEffect(() => {});

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

    const data = {
      source: {
        path: router.asPath,
      },
      itinerary_id: itineraryId,
      group_type: groupType || "Solo",
      price_range: priceRange,
      number_of_adults: number_of_adults,
      number_of_children: number_of_children,
      number_of_infants: number_of_infants,
      room_configuration: roomConfiguration,
      add_hotels: addHotels,
      add_transfers: addTransfers,
    };

    setLoading(true);
    localStorage.removeItem("MyPlans");

    itineraryComplete
      .post("", data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        setError(null);
        setSubmitted(true);
        window.location.href = `/itinerary/${itineraryId}`;
        window.scrollTo(0, 0);

        // if (!response.data?.auto_itinerary_created) {
        //   router.push("/thank-you");
        // } else {
        // if (response.data.time) {
        // router.push(`/itinerary/${itineraryId}?t=60`);

        // } else {
        //   router.push(`/itinerary/${itineraryId}`);
        // }

        logEvent({
          action: "conversion",
          params: {
            send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
          },
        });

        // }
      })
      .catch((err) => {
        console.log("ERROR >>>", err);
        setLoading(false);
        setError(err.message);
        router.push("/thank-you");
      });
  };

  // if (!loading && !submitted)
  return (
    <>
      {showBlack && !props.tailoredFormModal ? (
        <BlackContainer onClick={() => _handleHideBlack()}></BlackContainer>
      ) : null}

      <Container
        showBlack={showBlack}
        tailoredFormModal={props.tailoredFormModal}
        slideIndex={slideIndex}
        className={isPageWide ? "center-div border" : "center-div"}
        onClick={() => {
          // setShowBlack(true);
        }}
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

        {showPopup.group && (
          <Popup
            setShowPopup={setShowPopup}
            top={props.tailoredFormModal ? "16rem" : "190px"}
            left="20%"
            tipLeft="45%"
            text="Please select your group type!"
          />
        )}

        <div
          style={{
            padding: props.tailoredFormModal ? "0rem 1rem" : "0.5rem 1rem",
            marginBottom: slideIndex === 2 ? "0rem" : "0rem",
          }}
          className="w-full flex flex-row items-center"
        >
          {slideIndex && !props.tailoredFormModal ? (
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

          <div className="w-full">
            {props.tailoredFormModal && (
              <CloseIcon>
                {slideIndex ? (
                  <BiArrowBack
                    onClick={_prevSlideHandler}
                    className="hover-pointer"
                    style={{ marginTop: "2px", fontSize: "1.5rem" }}
                  ></BiArrowBack>
                ) : (
                  <div></div>
                )}
                <RxCross2
                  style={{
                    fontSize: "1.75rem",
                    textAlign: "right",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!focusedDate) {
                      props.onHide();
                    }
                  }}
                />
              </CloseIcon>
            )}

            <Heading
              tailoredFormModal={props.tailoredFormModal}
              style={{ textAlign: !slideIndex ? "left" : "center" }}
            >
              {getHeading()}
            </Heading>
          </div>
        </div>

        <div style={{ padding: "0 1rem", width: "100%" }}>
          <div
            style={{
              borderStyle: "solid none none none",
              borderWidth: "1px",
              color: "#D3D3D3",
              height: "1px",
              width: "100%",
              marginBottom: "1.5rem",
            }}
          ></div>

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
            setRoomConfiguration={setRoomConfiguration}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            addHotels={addHotels}
            setAddHotels={setAddHotels}
            addTransfers={addTransfers}
            setAddTransfers={setAddTransfers}
            setSlideIndex={setSlideIndex}
            setLoginComplete={setLoginComplete}
            defaultPriceRange={defaultPriceRange}
          ></Flickity>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {slideIndex === 0 ? (
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
              margin="1rem 0"
              borderRadius="5px"
              borderWidth="1px"
              bgColor="#f7e700"
              onclick={() => _SlideOneSubmitHandler()}
              loading={isLoading}
            >
              Continue
            </Button>
          ) : null}

          {slideIndex === 1 ? (
            !props.token || props.phone === "null" ? (
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
                  bgColor="#f7e700"
                  onclick={_SlideTwoSubmitHandler}
                  loading={isLoading && submitted}
                >
                  Continue
                </Button>
              </div>
            ) : (
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
                  bgColor="#f7e700"
                  loading={loading}
                  onclick={_submitDataHandler}
                >
                  Get Itinerary!
                </Button>
              </div>
            )
          ) : null}
        </div>
      </Container>
    </>
  );
  // else
  //   return (
  //     <>
  //       {showBlack && !props.tailoredFormModal ? (
  //         <BlackContainer onClick={() => setShowBlack(false)}></BlackContainer>
  //       ) : null}

  //       <Container className="border center-div">
  //         <LoadingLottie height="50%" width="50%"></LoadingLottie>
  //         <LoadingText>Finalizing your plan...</LoadingText>
  //       </Container>
  //     </>
  //   );
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
