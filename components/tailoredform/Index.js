import { useState, useEffect, useMemo } from "react";
import Button from "../ui/button/Index";
import media from "../media";
import {
  itineraryInitiate,
  itineraryComplete,
} from "../../services/leads/tailored";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import Flickity from "./Flickity";
import { EXPERIENCE_FILTERS_BOX } from "../../services/constants";
import Popup from "../ErrorPopup";
import usePageLoaded from "../custom hooks/usePageLoaded";
import { logEvent } from "../../services/ga/Index";
import {
  setFixedDate,
  setItineraryCreated,
  setItineraryInitiateData,
  setItineraryNotCreated,
  setRoomConfiguration,
} from "../../store/actions/slideOneActions";
import {
  BlackContainer,
  buildItineraryPayload,
  Container,
  divideTravellers,
  headings,
  useSourceParams,
} from "./utils/slideOneActions";
import useMediaQuery from "../media";
import Modal from "../ui/Modal";
import ModalWithBackdrop from "../ui/ModalWithBackdrop";
import RouteOverviewModal from "./slideOne/RouteOverviewModal";
import BottomModal from "../ui/LowerModal";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "../../hooks/useAnalytics";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { authCloseLogin } from "../../store/actions/auth";
import Login from "../modals/Login";
import StepsProgress from "./StepsProgress";


const ScrollContainer = styled.div`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Enquiry = (props) => {
  const router = useRouter();
  if (!router.isReady) return;

  const dispatch = useDispatch();
  const showLogin = useSelector((state) => state.auth.showLogin);
  const onHide = () => dispatch(authCloseLogin());
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [route, setRoute] = useState([]);
  const [locationsLatLong, setLocationsLatLong] = useState(
    useSelector(
      (state) => state.tailoredInfoReducer.itineraryInititateData?.basic_route
    ) || []
  );
  const [showRouteOverview, setShowRouteOverview] = useState(false);

  const routerquery = router.query;
  const initialInputId = Date.now();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slideOneData = useSelector(
    (state) => state.tailoredInfoReducer.slideOne
  );
  const itineraryInititateData = useSelector(
    (state) => state.tailoredInfoReducer.itineraryInititateData
  );
  const slideThreeData = useSelector(
    (state) => state.tailoredInfoReducer.slideThree
  );
  const slideFourData = useSelector(
    (state) => state.tailoredInfoReducer.slideFour
  );
  const isItineraryCreated = useSelector(
    (state) => state.tailoredInfoReducer.itineraryCreated
  );

  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [startingLocation, setStartingLocation] = useState(false);
  const isPageLoaded = usePageLoaded();
  const [isRouteChanged, setIsRouteChanged] = useState(false);
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
  const [submitSecondSlide, setSubmitSecondSlide] = useState(false);
  const [itineraryId, setItineraryId] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    startLocation: null,
    destination1: null,
    when: null,
  });

  const slideIndex = Number(router.query.slideIndex) || 0;
  const { trackItineraryInitiated, trackItineraryCompleted } = useAnalytics();

  let isPageWide = media("(min-width: 768px)");
  const source = useSourceParams();

  useEffect(() => {
    if (props.tailoredFormModal) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.tailoredFormModal]);

  useEffect(() => {
    if ((slideIndex && slideIndex != 0) || isItineraryCreated) {
      dispatch(setItineraryCreated(false));
      if (!itineraryInititateData)
        router.push({
          pathname: "/new-trip",
        });
    }
  }, [router.isReady, slideIndex]);

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

  const _handleHideBlack = () => {
    setShowCities(false);
    setShowSearchStarting(false);
  };

  const _submitDataHandler = () => {
    setIsSubmitting(true);
    completeItineraryCreate();
  };

  const _prevSlideHandler = () => {
    if (slideIndex) {
      if (slideIndex == 1) {
        setIsRouteChanged(false);
      }
      router.push({
        pathname: "/new-trip",
        query: {
          slideIndex: slideIndex - 1,
        },
      });
    }
  };

  const selectedCities = slideOneData.selectedCities;

  useEffect(() => {
    setShowPopup(popupObj);
  }, [
    slideOneData.date.start_date,
    slideOneData.date.end_date,
    startingLocation,
    destination,
    showSearchStarting,
    showCities,
    selectedCities.length,
    slideIndex,
  ]);

  const _SlideOneSubmitHandler = () => {
    if (!slideOneData.selectedCities[0].id) {
      setErrors({
        startLocation: null,
        destination1: "destination can't be null",
        when: null,
      });
      return;
    }
    if (
      slideOneData.date.type === "fixed" &&
      !(slideOneData.date.start_date && slideOneData.date.end_date)
    ) {
      setErrors({
        startLocation: null,
        destination1: null,
        when: "start or end date can't be null",
      });
      return;
    }

    if (
      slideOneData.date.type === "flexible" &&
      !(slideOneData.date.month && slideOneData.date.duration)
    ) {
      setErrors({
        startLocation: null,
        destination1: null,
        when: "month or duration can't be null",
      });
      return;
    }

    if (slideOneData.date.type === "anytime" && !slideOneData.date.duration) {
      setErrors({
        startLocation: null,
        when: "duration can't be null",
      });
      return;
    }

    setShowPopup(popupObj);
    if (props.HeroBanner && isPageWide) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    initiateItineraryCreate(slideOneData);
  };

  const _SlideThreeSubmitHandler = () => {
    if (!submitSecondSlide) return setShowPopup({ ...showPopup, group: true });
    setShowPopup(popupObj);
    let dist = divideTravellers(slideThreeData);
    dispatch(setRoomConfiguration(dist));

    if (totalSlides == 3) {
      _submitDataHandler();
      return;
    }
    router.push({
      pathname: "/new-trip",
      query: {
        slideIndex: slideThreeData.addHotels ? slideIndex + 1 : slideIndex + 2,
      },
    });
  };

  const _slideTwoSkip = () => {
    try {
      router.push({
        pathname: "/new-trip",
        query: {
          slideIndex: slideIndex + 1,
        },
      });
    } catch (error) {
      console.log("new slide index is: ", error);
    }
  };

const initiateItineraryCreate = async (slideOneData) => {
    const data = buildItineraryPayload({
      source,
      selectedPreferences: slideOneData.selectedPreferences,
      EXPERIENCE_FILTERS_BOX,
      selectedCities,
      startingLocation,
      dateData: slideOneData.date,
    });
    
    let newEndDate = null;
    let totalDuration = null;
    let shouldUpdateDates = false; 
    
    if (locationsLatLong.length > 0 && slideIndex == 1) {
      
      const startDate = new Date(slideOneData.date.start_date);
      let currentDate = new Date(startDate);
      
      const updatedRoute = locationsLatLong.map((location) => {
        const nights = location.duration || location.nights || 1;
        const start = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + nights);
        const end = new Date(currentDate);
        
        return {
          ...location,
          duration: nights,
          nights: nights,
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
        };
      });
      
      // Calculate new trip end date based on total duration
      newEndDate = new Date(currentDate);
      totalDuration = Math.ceil((newEndDate - startDate) / (1000 * 60 * 60 * 24));
      shouldUpdateDates = true; // Set flag to true
      
      // Update the dates in the payload
      data["basic_route"] = updatedRoute;
      data["dates"] = {
        ...data["dates"],
        end_date: newEndDate.toISOString().split('T')[0],
        duration: totalDuration
      };
    }

    try {
      setIsLoading(true);
      const res = await itineraryInitiate.post("", data);
      const resData = res.data;
      trackItineraryInitiated("itinerary_initiated");

      setError(null);
      setItineraryId(resData.itinerary_id);
      setRoute([resData.start_city, ...resData.basic_route, resData.end_city]);
      
      // Update the locationsLatLong with the response data
      setLocationsLatLong(resData.basic_route || []);
      
      dispatch(setItineraryInitiateData(resData));
      
      // Update slideOne dates in Redux if routes were changed
      if (shouldUpdateDates && newEndDate) {
        dispatch(setFixedDate(
          slideOneData.date.start_date,
          newEndDate.toISOString().split('T')[0]
        ));
      }
      
      // Reset the route changed flag
      setIsRouteChanged(false);
      
      // Navigate to next slide
      router.push({
        pathname: "/new-trip",
        query: {
          slideIndex: slideIndex + 1,
        },
      });
      // setShowRouteOverview(true);
    } catch (err) {
      console.log("ERROR: ", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeItineraryCreate = () => {
    const data = {
      source,
      itinerary_id: itineraryId,
      group_type: slideThreeData.groupType || "Solo",
      number_of_adults: slideThreeData.numberOfAdults,
      number_of_children: slideThreeData.numberOfChildren,
      number_of_infants: slideThreeData.numberOfInfants,
      room_configuration: slideThreeData.roomConfiguration,
      add_flights: slideThreeData.addFlights,
      add_hotels: slideThreeData.addHotels,
      add_transfers_and_activities: slideThreeData.addInclusions,
      hotel_types: slideFourData.hotelType.map((s) => parseInt(s)),
      meal_preferences: slideFourData.mealPreferences,
      special_request: slideFourData.specialRequests,
    };

    setIsSubmitting(true);
    setIsLoading(true);
    localStorage.removeItem("MyPlans");
    itineraryComplete
      .post("", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setError(null);
        setSubmitted(true);
        trackItineraryCompleted(itineraryId, "itinerary_completed");
        dispatch(setItineraryCreated(true));

        setTimeout(() => {
          window.location.href = `/itinerary/${itineraryId}`;
          window.scrollTo(0, 0);
        }, 100);

        logEvent({
          action: "conversion",
          params: {
            send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
          },
        });
      })
      .catch((err) => {
        console.log("ERROR >>>", err);
        setIsSubmitting(false);
        setIsLoading(false);
        setError(err.message);
      });
  };

  const totalSlides = localStorage.getItem("access_token")
    ? (slideThreeData.addHotels ? 4 : 3)
    : (slideThreeData.addHotels ? 5 : 4);
  // const totalSlides = (localStorage.getItem("access_token")&&!slideThreeData.addHotels) ? 3 :(slideThreeData.addHotels&&localStorage.getItem("access_token")) ? 4  : localStorage.getItem("access_token") ? 4 : 5;

  const [steps, setSteps] = useState(['Introduction', 'Customize Route', 'Who’s Going & Inclusions']);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("access_token");

    setSteps((prevSteps) => {
      let updatedSteps = [...prevSteps];

      updatedSteps = updatedSteps.filter(
        (step) => step !== "Stay Preferences" && step !== "Login"
      );

      if (slideThreeData?.addHotels) {
        if (isLoggedIn) {
          updatedSteps.push("Stay Preferences");
        } else {
          updatedSteps.push("Stay Preferences", "Login");
        }
      } else if (!isLoggedIn) {
        updatedSteps.push("Login");
      }

      return updatedSteps;
    });
  }, [slideThreeData?.addHotels]);


 useEffect(() => {
    if (slideOneData) {
      const hasDestination =
        Array.isArray(slideOneData.selectedCities) &&
        slideOneData.selectedCities.length > 0;

     
      let duration = null;
      
      if (slideOneData?.date?.type === "fixed" && 
          slideOneData?.date?.start_date && 
          slideOneData?.date?.end_date) {
       
        const start = new Date(slideOneData.date.start_date);
        const end = new Date(slideOneData.date.end_date);
        duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      } else if (slideOneData?.date?.type === "flexible" || 
                 slideOneData?.date?.type === "anytime") {
       
        duration = slideOneData.date.duration;
      }

      if (hasDestination && duration) {
        const cityName = slideOneData.selectedCities[0]?.name;
        const stepTitle = `Introduction: ${duration} Days Trip in ${cityName}`;

        setSteps(prev =>
          prev.map((title, index) => (index === 0 ? stepTitle : title))
        );
      }
    }
  }, [slideOneData]);

  return (<>

    <div className="container">
       
      <div className="py-2xl">
        <div className="text-md-lg font-600 leading-xl-sm mb-md">Plan Your Trip</div>
        <StepsProgress
          slideIndex={slideIndex}
          totalSlides={totalSlides}
          steps={steps}
        ></StepsProgress>
      </div>
      {/*       
              <div className=" ">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#F0F0F0"
                    strokeWidth="6"
                  />
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
                  <text
                    x="32"
                    y="32"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                  >
                    <tspan fontSize="16" fontWeight="500">
                      {slideIndex + 1}
                    </tspan>
                    <tspan fontSize="16" fontWeight="500" dy={"1"}>
                      /
                    </tspan>
                    <tspan fontSize="12" fontWeight="400" dy="2">
                      {totalSlides}
                    </tspan>
                  </text>
                </svg>
              </div> */}

    
      <div className="h-[calc(100vh-300px)] max-sm:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
        {!props.tailoredFormModal ? (
          <BlackContainer onClick={() => _handleHideBlack()}></BlackContainer>
        ) : null}

        <Container
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

          {showPopup.dateStart && (
            <Popup
              setShowPopup={setShowPopup}
              bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
              left="10px"
              text="Please select starting date!"
            />
          )}

          {showPopup.dateEnd && (
            <Popup
              setShowPopup={setShowPopup}
              bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
              left="170px"
              mobileleft={"135px"}
              text="Please select ending date!"
            />
          )}

          <div className="flex flex-col items-center justify-center  h-full">
            <div
              className="h-max  font-inter flex flex-col gap-[30px] w-100"
            >
              <div className="flex flex-col gap-[24px]">
                {/* {slideIndex && !isDesktop ? (
              <div>
                <BiArrowBack
                  onClick={_prevSlideHandler}
                  className="hover-pointer"
                  style={{ marginTop: "2px", fontSize: "1.5rem" }}
                ></BiArrowBack>
              </div>
            ) : (
              <></>
            )} */}
                <div className={`w-full flex items-center justify-center`}>
                  {/* {isDesktop && (
                <div
                  style={{
                    padding: props.tailoredFormModal
                      ? "0rem 1rem"
                      : "0.5rem 1rem",
                    marginBottom: slideIndex === 2 ? "0rem" : "0rem",
                  }}
                  className="w-max flex flex-row items-center"
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
              )} */}
                  <div>
                    {headings[slideIndex] &&
                      <h1
                        className="text-xl-md font-600 leading-2xl-md max-pg:text-xl max-ph:text-center mb-zero"
                      >
                        {headings[slideIndex]}
                      </h1>
                    }
                  </div>
                  {/* 
              <div className=" ">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="#F0F0F0"
                    strokeWidth="6"
                  />
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
                  <text
                    x="32"
                    y="32"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                  >
                    <tspan fontSize="16" fontWeight="500">
                      {slideIndex + 1}
                    </tspan>
                    <tspan fontSize="16" fontWeight="500" dy={"1"}>
                      /
                    </tspan>
                    <tspan fontSize="12" fontWeight="400" dy="2">
                      {totalSlides}
                    </tspan>
                  </text>
                </svg>
              </div> */}

                </div>
              </div>

              <div className="flex flex-col items-center">
                <div id="login" className="z-[1650]">
                  <Login
                    show={showLogin}
                    onhide={onHide}
                    zIndex={"3300"}
                    onSuccess={() => {
                      completeItineraryCreate();
                    }}
                  />
                </div>
                <div
                  className={`${slideIndex == 1 ? "w-[100%]" : isDesktop ? "max-w-[600px]" : "w-full"}`}
                >
                  <Flickity
                    initialInputId={initialInputId}
                    tailoredFormModal={props.tailoredFormModal}
                    startingLocation={startingLocation}
                    setStartingLocation={setStartingLocation}
                    showSearchStarting={showSearchStarting}
                    setShowSearchStarting={setShowSearchStarting}
                    showCities={showCities}
                    setShowCities={setShowCities}
                    destination={destination}
                    setDestination={setDestination}
                    cities={props.cities}
                    selectedCities={selectedCities}
                    setSubmitSecondSlide={setSubmitSecondSlide}
                    eventDates={props.eventDates}
                    route={
                      itineraryInititateData?.start_city
                        ? [
                          itineraryInititateData?.start_city,
                          ...locationsLatLong,
                          itineraryInititateData?.end_city,
                        ]
                        : route
                    }
                    _submitDataHandler={_submitDataHandler}
                    setLocationsLatLong={setLocationsLatLong}
                    locationsLatLong={
                      locationsLatLong?.length > 0 ? locationsLatLong : route
                    }
                    errors={errors}
                    completeItineraryCreate={completeItineraryCreate}
                    setIsRouteChanged={setIsRouteChanged}
                    isloading={isLoading}
                  ></Flickity>
                  {isDesktop ? (
                    <ModalWithBackdrop
                      centered
                      show={showRouteOverview == true}
                      mobileWidth="100%"
                      backdrop
                      closeIcon={true}
                      onHide={() => setShowRouteOverview(false)}
                      borderRadius={"12px"}
                      animation={false}
                      backdropStyle={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(1px)",
                      }} // <- add this
                      paddingX="20px"
                      paddingY="20px"
                    >
                      <RouteOverviewModal
                        setShowRouteOverview={setShowRouteOverview}
                      />
                    </ModalWithBackdrop>
                  ) : (
                    <BottomModal
                      show={showRouteOverview == true}
                      onHide={() => setShowRouteOverview(false)}
                      width="100%"
                      height="max-content"
                      paddingX="20px"
                      paddingY="20px"
                    >
                      <RouteOverviewModal
                        setShowRouteOverview={setShowRouteOverview}
                      />
                    </BottomModal>
                  )}

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

                </div>
              </div>
            </div>
          </div>
        </Container>

      </div>

     

    </div>

    
    <div className="fixed bottom-[70px] max-sm:bottom-0 w-100 bg-primary-cornsilk z-[22]">
      {/* <div className="border-b-sm"></div> */}
      <div className="container p-md">
        {slideIndex === 0 && (
          <div className="max-w-[600px] my-zero mx-auto max-ph:w-full">
            <div className="flex justify-between">
              <button
                className={`LargeIndigoOutlinedButton `}
                onClick={() => router.back()}
              >
                Cancel
              </button>

            <Button
                width={`${isPageWide ? '300px' : '50%'}`}
                fontSize="1rem"
                padding="0.5rem 2rem"
                fontWeight="500"
                borderRadius="8px"
                borderWidth="1px"
                bgColor="#07213A"
                onclick={_SlideOneSubmitHandler}
                loading={isLoading}
                disabled={isLoading}
                height="50px"
                color="white"
                className="whitespace-nowrap"
              >
                Continue
              </Button>
            </div>
          </div>
        )}


        {slideIndex === 1 && (
          <div
            className={` bg-primary-cornsilk z-[15] flex justify-between w-full
    ${!isDesktop && "flex items-center justify-between gap-2"}
  `}
          >
            {/* LEFT SIDE */}
            <button
              className={`LargeIndigoOutlinedButton `}
              onClick={_prevSlideHandler}
            >
              Back
            </button>

              {/* <button
                className={`LargeIndigoOutlinedButton ${!isDesktop && "w-[90px]"}`}
                onClick={_slideTwoSkip}
              >
                Skip
              </button> */}
              {isRouteChanged ? (
                <Button
                  width={`${isPageWide ? '300px' : '50%'}`}
                  fontSize="1rem"
                  padding="0.5rem 1rem"
                  fontWeight="500"
                  bgColor="#07213A"
                  borderRadius="8px"
                  color="white"
                  height="50px"
                  loading={isLoading}
                  disabled={isLoading}
                  onclick={() => initiateItineraryCreate(slideOneData)}
                  
                >
                  Update & Continue
                </Button>
              ) : (
                <button
                  className={`LargeIndigoButton cursor-not-allowed w-[50%] ${isDesktop && "w-[300px]"} `}
                  onClick={() =>
                    router.push({
                      pathname: "/new-trip",
                      query: { slideIndex: slideIndex + 1 },
                    })
                  }
                >
                  Continue
                </button>
              )}
            
          </div>

        )}

        {slideIndex === 2 && (
          <div className="max-w-[600px] my-zero mx-auto max-ph:w-full">
            <div className="flex justify-between items-center">
              <button
                className={`LargeIndigoOutlinedButton`}
                onClick={_prevSlideHandler}
              >
                Back
              </button>

              <Button
                width={`${isPageWide ? '300px' : '50%'}`}
                fontSize="1rem"
                padding="0.5rem 1rem"
                fontWeight="500"
                bgColor="#07213A"
                color="white"
                height="50px"
                onclick={_SlideThreeSubmitHandler}
                loading={isLoading}
                borderRadius="8px"
                className={`${!isDesktop && "w-[120px]"}`}
              >
                {totalSlides == 3 ? "Get Itinerary!" : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {slideIndex === 3 && (
          <div className="max-w-[600px] my-zero mx-auto max-ph:w-full">
            <div className="flex justify-between items-center">
              <button
                className={`LargeIndigoOutlinedButton`}
                onClick={_prevSlideHandler}
              >
                Back
              </button>
              <Button
                width={`${isPageWide ? '300px' : '50%'}`}
                fontSize="1rem"
                padding="0.5rem 1rem"
                fontWeight="500"
                margin="30px 0"
                borderRadius="8px"
                borderWidth="1px"
                bgColor="#07213A"
                height="50px"
                color="white"
                loading={isSubmitting}
                disabled={isSubmitting}

                onclick={() => {
                  totalSlides == 4
                    ? _submitDataHandler()
                    : router.push({
                      pathname: "/new-trip",
                      query: {
                        slideIndex: slideIndex + 1,
                      },
                    });
                }}
              >
                {totalSlides == 4 ? "Get Itinerary!" : "Continue"}
              </Button>
            </div>
          </div>
        )}
        {slideIndex === 4 ? (
          <div className="flex justify-end">
            <Button
              fontSize="1rem"
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
              margin="40px 0"
              borderRadius="5px"
              borderWidth="1px"
              bgColor="#07213A"
              color="white"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={_submitDataHandler}
              height="50px"
              width={`${isPageWide ? '300px' : ''}`}
            >
              {totalSlides == 5 ? "Get Itinerary!" : "Continue"}
            </Button>
          </div>
        ) : null}

      </div>
    </div>

  </>
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
