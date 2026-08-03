import { useState, useEffect, useMemo, useRef } from "react";
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
import {
  setFixedDate,
  setItineraryCreated,
  setItineraryInitiateData,
  setItineraryNotCreated,
  setRoomConfiguration,
  setSelectedCities,
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
import {
  FUNNELS,
  reportFunnelStage,
} from "../../services/analyticsFunnel";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { authCloseLogin, authShowLogin } from "../../store/actions/auth";
import Login from "../modals/Login";
import StepsProgress from "./StepsProgress";
import getPlatform from "../../utils/getPlatform";
import { useAnalyticsSession } from "../../hooks/useAnalyticsSession";
import Image from "next/image";
import RoutePreparationLoader from "./RoutePreparationLoader";
import BotLoginModal from "../bot-components/components/BotLoginModal";
import { FaX } from "react-icons/fa6";

{
  /* <Login/> to see this itinerary's cost */
}
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
  const onHide = () => { setShowLoginForm(false); dispatch(authCloseLogin())};
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [route, setRoute] = useState([]);
  const [locationsLatLong, setLocationsLatLong] = useState(
    useSelector(
      (state) => state.tailoredInfoReducer.itineraryInititateData?.basic_route,
    ) || [],
  );
  const [showRouteOverview, setShowRouteOverview] = useState(false);

  const routerquery = router.query;
  const initialInputId = Date.now();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItineraryId, setLoadingItineraryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasCompletedRef = useRef(false);
  // Authoritative itinerary id, refreshed on every successful initiate
  // response so completion never reads a stale value from Redux/local state.
  const latestItineraryIdRef = useRef(null);
  // Monotonic counter to discard out-of-order initiate responses.
  const initiateSeqRef = useRef(0);
  const [isRecalculatingRoute, setIsRecalculatingRoute] = useState(false);

  const slideOneData = useSelector(
    (state) => state.tailoredInfoReducer.slideOne,
  );
  const itineraryInititateData = useSelector(
    (state) => state.tailoredInfoReducer.itineraryInititateData,
  );
  const slideThreeData = useSelector(
    (state) => state.tailoredInfoReducer.slideThree,
  );
  const slideFourData = useSelector(
    (state) => state.tailoredInfoReducer.slideFour,
  );
  const isItineraryCreated = useSelector(
    (state) => state.tailoredInfoReducer.itineraryCreated,
  );

  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [startingLocation, setStartingLocation] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState();
  const isPageLoaded = usePageLoaded();
  const [isRouteChanged, setIsRouteChanged] = useState(false);
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const [destination, setDestination] = useState(
    routerquery.destination || props.destination,
  );
  const popupObj = {
    dateStart: false,
    dateEnd: false,
    group: false,
    InputOne: false,
  };
  const currency = useSelector((state) => state.UserLocation).location;
  const [showPopup, setShowPopup] = useState(popupObj);
  const [submitSecondSlide, setSubmitSecondSlide] = useState(false);
  const [itineraryId, setItineraryId] = useState(null);
  const [apiSucceeded, setApiSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [shouldNavigateToNextSlide, setShouldNavigateToNextSlide] =
    useState(false);
  const [errors, setErrors] = useState({
    startLocation: null,
    destination1: null,
    when: null,
  });

  const slideIndex = Number(router.query.slideIndex) || 0;
  const { trackItineraryFormStage, trackSkipLoginCompleted } = useAnalytics();
  const { sessionId, isReady } = useAnalyticsSession();

  // ── itinerary_form conversion funnel ──────────────────────────────────────
  // Every stage goes through services/analyticsFunnel, which dedups per form
  // run and back-fills any mandatory earlier stage that hasn't fired yet, so
  // the funnel can never report a later step more often than an earlier one.
  //
  // One run == one mount of the form. A hard reload sends the user back to
  // slide 0 (see the itineraryInititateData guard below), which is genuinely a
  // new creation attempt, so the guard deliberately isn't persisted.
  const funnelRunIdRef = useRef(null);
  if (funnelRunIdRef.current === null) {
    funnelRunIdRef.current = `form-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }
  const trackFormStageRef = useRef(trackItineraryFormStage);
  trackFormStageRef.current = trackItineraryFormStage;
  // Latest known itinerary id, read at emit time so back-filled stages carry
  // the same id as the stage that triggered them.
  const reportFormStage = (stage, properties = {}) => {
    reportFunnelStage(FUNNELS.itineraryForm, stage, {
      scopeId: funnelRunIdRef.current,
      properties,
      emit: (eventName, extra) =>
        trackFormStageRef.current?.(
          eventName,
          latestItineraryIdRef.current || null,
          extra,
        ),
    });
  };
  let isPageWide = media("(min-width: 768px)");
  const source = useSourceParams();
  const [showLoginForm,setShowLoginForm] = useState(false);

  useEffect(() => {
    if (slideIndex === 0) {
      setApiSucceeded(false);
      setIsManualNavigation(false);
      hasCompletedRef.current = false;
    }
  }, [slideIndex]);

  // On a fresh form open, drop any itinerary id left over from a previous
  // (possibly abandoned) tailored-form session. The store is in-memory and
  // only cleared on a *successful* completion, so without this reset the next
  // creation could navigate to /chat/<old id>.
  useEffect(() => {
    dispatch(setItineraryInitiateData(null));
    setItineraryId(null);
    latestItineraryIdRef.current = null;
    initiateSeqRef.current = 0;
    hasCompletedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funnel step 1 — the form is open, itinerary creation has begun.
  useEffect(() => {
    reportFormStage("itinerary_creation_started", {
      entry_slide: Number(router.query.slideIndex) || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.tailoredFormModal) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.tailoredFormModal]);

  useEffect(() => {
    if (!router.isReady) return;

    const { page_id, destination, type } = router.query;
    if (page_id && destination && slideOneData?.selectedCities?.length === 0) {
      const initialInputId = Date.now();
      let data = {
        id: page_id,
        name: destination,
        input_id: initialInputId,
        type: type || "City",
      };
      dispatch(setSelectedCities(page_id, initialInputId, data));
    }
  }, [router.isReady, router.query.page_id, router.query.destination]);

  useEffect(() => {
    if ((slideIndex && slideIndex != 0) || isItineraryCreated) {
      dispatch(setItineraryCreated(false));
      if (!itineraryInititateData)
        router.push(
          {
            // pathname: "/new-trip",
            query: {
              ...router.query,
              slideIndex: 0,
            },
          },
          undefined,
          { shallow: true },
        );
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

  // Funnel steps 3 & 4 — the route slide is done.
  //
  // The "preferences" in this funnel are slide 0's experience filters, which
  // travel to the backend in the same /initiate payload as the route. That is
  // why they are reported here rather than at the "Stay Preferences" screen,
  // and why the funnel lists preferences immediately after route. Stay
  // preferences (hotel type / meals / special requests) are not a funnel stage;
  // they ride along on itinerary_creation_completed.
  const markRouteCompleted = (route, routeEdited) => {
    reportFormStage("itinerary_route_completed", {
      route,
      route_edited: routeEdited,
    });
    reportFormStage("itinerary_preferences_completed", {
      experience_preferences: slideOneData?.selectedPreferences ?? null,
    });
  };

  // Funnel steps 6 & 7 — the sign-in gate. `outcome` records how the gate was
  // passed, because it is genuinely optional here: an already-authenticated
  // user never sees it, the 3-slide flow never raises it, and the modal itself
  // offers a skip. Reporting the stage on every path (with the reason) is what
  // keeps the funnel from showing more completions than logins.
  const markLoginStage = (stage, outcome) => {
    reportFormStage(stage, {
      outcome,
      already_authenticated: outcome === "already_authenticated",
    });
  };

  const hasAccessToken = () =>
    typeof window !== "undefined" && !!localStorage.getItem("access_token");

  const _prevSlideHandler = () => {
    if (slideIndex) {
      if (slideIndex == 1) {
        setIsRouteChanged(false);
      }
      setIsManualNavigation(true);
      router.push(
        {
          query: {
            ...router.query,
            slideIndex: slideIndex - 1,
          },
        },
        undefined,
        { shallow: true },
      );
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
        destination1: "Select a destination to proceed",
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
        when: "Select a date to proceed",
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
        when: "month or duration can't be empty",
      });
      return;
    }

    if (slideOneData.date.type === "anytime" && !slideOneData.date.duration) {
      setErrors({
        startLocation: null,
        when: "duration can't be empty",
      });
      return;
    }

    setShowPopup(popupObj);
    if (props.HeroBanner && isPageWide) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setIsManualNavigation(false);
    initiateItineraryCreate(slideOneData);
  };

  const _SlideThreeSubmitHandler = () => {
    if (!submitSecondSlide) return setShowPopup({ ...showPopup, group: true });
    setShowPopup(popupObj);
    let dist = divideTravellers(slideThreeData);
    dispatch(setRoomConfiguration(dist));

    // Funnel step 4 — "Who's Going & Inclusions" is done. This used to fire
    // from completeItineraryCreate, i.e. one step too late and after the
    // preferences event, which is why the dashboard showed more preferences
    // than inclusions.
    reportFormStage("itinerary_inclusions_completed", {
      inclusions: {
        add_flights: slideThreeData.addFlights,
        add_hotels: slideThreeData.addHotels,
        add_transfers_and_activities: slideThreeData.addInclusions,
      },
      group_type: slideThreeData.groupType || "Solo",
      number_of_adults: slideThreeData.numberOfAdults,
      number_of_children: slideThreeData.numberOfChildren,
      number_of_infants: slideThreeData.numberOfInfants,
    });

    // This is now the final slide — raise the sign-in gate before completing.
    if (!hasAccessToken()) {
      markLoginStage("user_login_initiated", "gate_shown");
      setShowLoginForm(true);
    } else {
      markLoginStage("user_login_initiated", "already_authenticated");
      markLoginStage("user_login_completed", "already_authenticated");
      _submitDataHandler();
    }
  };

  const _slideTwoSkip = () => {
    try {
      router.push(
        {
          // pathname: "/new-trip",
          query: {
            ...router.query,
            slideIndex: slideIndex + 1,
          },
        },
        undefined,
        { shallow: true },
      );
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
      ...(isReady && sessionId && { session_id: sessionId }),
    });

    let newEndDate = null;
    let totalDuration = null;
    let shouldUpdateDates = false;
    let routeToTrack = null;

    const isFixedDate = slideOneData.date.type === "fixed";

    const isRecalculating = slideIndex === 1 && isRouteChanged;

    if (locationsLatLong.length > 0 && slideIndex == 1) {
      if (isFixedDate && slideOneData.date.start_date) {
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
            start_date: start.toISOString().split("T")[0],
            end_date: end.toISOString().split("T")[0],
          };
        });

        newEndDate = new Date(currentDate);
        totalDuration = Math.ceil(
          (newEndDate - startDate) / (1000 * 60 * 60 * 24),
        );
        shouldUpdateDates = true;

        data["basic_route"] = updatedRoute;
        routeToTrack = updatedRoute;
        data["dates"] = {
          ...data["dates"],
          end_date: newEndDate.toISOString().split("T")[0],
          duration: totalDuration,
        };
      } else {
        const hasResponseDates = locationsLatLong.some(
          (loc) => loc.start_date && loc.end_date,
        );

        if (hasResponseDates && itineraryInititateData?.start_date) {
          const startDate = new Date(itineraryInititateData.start_date);
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
              start_date: start.toISOString().split("T")[0],
              end_date: end.toISOString().split("T")[0],
            };
          });

          data["basic_route"] = updatedRoute;
          routeToTrack = updatedRoute;
        } else {
          const updatedRoute = locationsLatLong.map((location) => {
            const { start_date, end_date, ...locationWithoutDates } = location;
            const nights = location.duration || location.nights || 1;

            return {
              ...locationWithoutDates,
              duration: nights,
              nights: nights,
            };
          });

          data["basic_route"] = updatedRoute;
          routeToTrack = updatedRoute;
        }

        totalDuration = data["basic_route"].reduce(
          (sum, loc) => sum + (loc.duration || 1),
          0,
        );

        if (data["dates"]) {
          const { start_date, end_date, ...datesWithoutFixed } = data["dates"];
          data["dates"] = {
            ...datesWithoutFixed,
            duration: totalDuration,
          };
        }
      }
    }

    // Add itinerary_id to payload if it exists (for subsequent calls)
    if (itineraryId) {
      data.itinerary_id = itineraryId;
    }

    const token = localStorage.getItem("access_token");

    // Claim a sequence number so a slow/earlier initiate response can't
    // overwrite the id from a newer one (route edits re-initiate repeatedly).
    const seq = ++initiateSeqRef.current;

    try {
      setIsLoading(true);
      setApiSucceeded(false);
      hasCompletedRef.current = false;

      // setLoadingItineraryId(null);
      const res = await itineraryInitiate.post("", data, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const resData = res.data;

      // A newer initiate has been fired since this request started — its id is
      // authoritative, so ignore this stale response entirely.
      if (seq !== initiateSeqRef.current) {
        return;
      }

      const newItineraryId = resData?.itinerary_id ?? null;

      if(resData){
        setApiSucceeded(true);
      }

      setError(null);

      // Update the id from THIS response everywhere. The ref is the source of
      // truth read by completeItineraryCreate.
      latestItineraryIdRef.current = newItineraryId;

      // Funnel step 2 — /initiate succeeded. Set the id first so this event
      // (and any stage back-filled behind it) carries the real itinerary id
      // rather than the `itineraryId` state, which is still the *previous*
      // render's value at this point and was null on the very first initiate.
      //
      // Only the route slide's own recalculate counts as completing the route
      // step; a plain initiate from slide 0 does not. Firing
      // itinerary_route_completed here on every initiate is what inflated that
      // step above the ones after it.
      reportFormStage("itinerary_initiate_completed", {
        route: routeToTrack || resData.basic_route || null,
        duration: totalDuration,
      });
      setItineraryId(newItineraryId);
      setLoadingItineraryId(newItineraryId);

      setRoute([resData.start_city, ...resData.basic_route, resData.end_city]);

      setLocationsLatLong(resData.basic_route || []);

      dispatch(setItineraryInitiateData(resData));

      if (shouldUpdateDates && newEndDate && isFixedDate) {
        dispatch(
          setFixedDate(
            slideOneData.date.start_date,
            newEndDate.toISOString().split("T")[0],
          ),
        );
      }

      setIsRouteChanged(false);

      if (isRecalculating) {
        // The user edited the route on slide 1 and this recalculate is what
        // advances them off it, so the route step is done. (The unedited path
        // fires the same stages from the slide-1 Continue button below.)
        markRouteCompleted(routeToTrack || resData.basic_route || null, true);

        router.push(
          {
            query: {
              ...router.query,
              slideIndex: slideIndex + 1,
            },
          },
          undefined,
          { shallow: true },
        );

        setTimeout(() => {
          setIsLoading(false);
          setIsRecalculatingRoute(false);
          setLoadingItineraryId(null);
        }, 100);

        return;
      }
    } catch (err) {
      // Ignore errors from a superseded initiate request.
      if (seq !== initiateSeqRef.current) return;
      console.log("ERROR: ", err.message);
      setError(err.response?.data?.errors?.[0]?.message?.[0] || err.message);
      setApiSucceeded(false);
      setLoadingItineraryId(null);
      setIsLoading(false);
      setIsRecalculatingRoute(false);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  const completeItineraryCreate = () => {
    const platform = getPlatform();

    // Prevent double / re-entrant completion (multiple entry points: slide 3
    // button, login onSuccess/onSkipLogin, Flickity).
    if (hasCompletedRef.current) {
      return;
    }

    // Prefer the ref (refreshed on every initiate response) so we can never
    // complete against a stale id from the in-memory Redux slice.
    const finalItineraryId =
      latestItineraryIdRef.current ||
      itineraryInititateData?.itinerary_id ||
      itineraryId;

    if (!finalItineraryId) {
      console.error("❌ No itinerary ID available for completion");
      setError(
        "Unable to complete itinerary. Please start from the beginning.",
      );
      setIsSubmitting(false);
      setIsLoading(false);

      router.push(
        {
          // pathname: "/new-trip",
          query: { ...router.query, slideIndex: 0 },
        },
        undefined,
        { shallow: true },
      );
      return;
    }

    const data = {
      // source,
      itinerary_id: finalItineraryId,
      group_type: slideThreeData.groupType || "Solo",
      number_of_adults: slideThreeData.numberOfAdults,
      number_of_children: slideThreeData.numberOfChildren,
      number_of_infants: slideThreeData.numberOfInfants,
      add_flights: slideThreeData.addFlights,
      currency: currency?.currency || "INR",
      add_hotels: slideThreeData.addHotels,
      add_transfers_and_activities: slideThreeData.addInclusions,
      meal_preferences: slideFourData.mealPreferences,
      special_request: slideFourData.specialRequests,
    };

    hasCompletedRef.current = true;
    setIsSubmitting(true);
    setIsLoading(true);
    localStorage.removeItem("MyPlans");
    let token = localStorage.getItem("access_token");

    itineraryComplete
      .post("", data, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      .then((response) => {
        setError(null);
        setSubmitted(true);
        // Funnel step 8 — /complete succeeded. `latestItineraryIdRef` is what
        // reportFormStage stamps events with, so make sure it holds the id we
        // actually completed against before reporting.
        latestItineraryIdRef.current = finalItineraryId;
        reportFormStage("itinerary_creation_completed", {
          platform,
          currency: currency?.currency || "INR",
          // Stay preferences aren't a funnel stage of their own (the funnel's
          // "preferences" are slide 0's experience filters), so carry them here
          // rather than dropping them.
          hotel_types: slideFourData?.hotelType ?? null,
          meal_preferences: slideFourData?.mealPreferences ?? null,
          special_request: slideFourData?.specialRequests ?? null,
          // Terminal funnel event and the next line navigates away — get it out
          // of the batch queue now rather than relying on the pagehide drain.
          immediate: true,
        });
        dispatch(setItineraryInitiateData(null));
        dispatch(setItineraryCreated(true));

        // Stash the route so /chat can render a skeleton itinerary before the
        // status API call returns. Closure-captured here because
        // setItineraryInitiateData(null) above has already cleared Redux.
        try {
          if (
            typeof window !== "undefined" &&
            Array.isArray(itineraryInititateData?.basic_route) &&
            itineraryInititateData.basic_route.length > 0
          ) {
            sessionStorage.setItem(
              `tailored_skeleton_${finalItineraryId}`,
              JSON.stringify({
                basic_route: itineraryInititateData.basic_route,
                start_city: itineraryInititateData.start_city ?? null,
                end_city: itineraryInititateData.end_city ?? null,
              }),
            );
          }
        } catch {}

        // Fire analytics best-effort — navigation is NOT gated on them. The
        // route change to /chat is a client-side navigation (no page unload),
        // so the gtag/dataLayer beacons still send. Gating navigation on
        // gtag's event_callback previously left users stranded on the
        // dashboard whenever the callback never fired.
        // Only count the Google Ads conversion for new users. `is_new_user` is
        // persisted at signup (store/actions/auth.js) because the redux flag is
        // cleared by AUTH_SUCCESS before we reach itinerary completion. Consume
        // the flag once fired so it counts once per new user, never for
        // returning users.
        let isNewUser = false;
        try {
          isNewUser = localStorage.getItem("is_new_user") === "true";
        } catch {}

        try {
          if (isNewUser && typeof window.gtag === "function") {
            
            window.gtag("event", "conversion", {
              send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
              transaction_id: finalItineraryId,
              value: 1.0,
              currency: currency?.currency || "INR",
            });
            try {
              localStorage.removeItem("is_new_user");
            } catch {}
          }
        } catch (error) {
          console.error("✗ Error firing Google Ads conversion:", error);
        }

        try {
          if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
              event: "itinerary_completed",
              itinerary_id: finalItineraryId,
              platform: platform,
              currency: currency?.currency || "INR",
              group_type: slideThreeData.groupType || "Solo",
              number_of_travelers:
                slideThreeData.numberOfAdults + slideThreeData.numberOfChildren,
              add_flights: slideThreeData.addFlights,
              add_hotels: slideThreeData.addHotels,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("✗ Error pushing to dataLayer:", error);
        }

        // Route to the SAME id that was just completed on the backend
        // (finalItineraryId), never the stale local/Redux id.
        router.push(`/chat/${finalItineraryId}?source=tailored`);
      })
      .catch((err) => {
        // Allow another attempt after a failed completion.
        hasCompletedRef.current = false;
        setIsSubmitting(false);
        setIsLoading(false);
        setError(err.response?.data?.errors?.[0]?.message?.[0] || err.message);
      });
  };

  // Guard against SSR/prerender where localStorage is undefined. Runs in the
  // render body (unlike the other localStorage reads, which are in handlers/
  // effects), so it must be safe when window is absent.
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const totalSlides = 3;

  const [steps, setSteps] = useState([
    "Introduction",
    "Customize Route",
    "Who’s Going & Inclusions",
  ]);

  useEffect(() => {
    if (slideOneData) {
      const hasDestination =
        Array.isArray(slideOneData.selectedCities) &&
        slideOneData.selectedCities.length > 0;

      let duration = null;

      if (
        slideOneData?.date?.type === "fixed" &&
        slideOneData?.date?.start_date &&
        slideOneData?.date?.end_date
      ) {
        const start = new Date(slideOneData.date.start_date);
        const end = new Date(slideOneData.date.end_date);
        duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      } else if (
        slideOneData?.date?.type === "flexible" ||
        slideOneData?.date?.type === "anytime"
      ) {
        duration = slideOneData.date.duration;
      }

      if (hasDestination && duration) {
        const cityName = slideOneData.selectedCities[0]?.name;
        const stepTitle = `Introduction: ${duration} Days, ${cityName}`;

        setSteps((prev) =>
          prev.map((title, index) => (index === 0 ? stepTitle : title)),
        );
      }
    }
  }, [slideOneData]);

  const handleLoadingComplete = () => {
    const MINIMUM_LOADING_TIME = 2000;

    setTimeout(() => {
      const currentSlideIndex = Number(router.query.slideIndex) || 0;

      // Only auto-navigate from slide 0 (not for route recalculation on slide 1)
      if (
        !isManualNavigation &&
        currentSlideIndex === 0 &&
        !isRecalculatingRoute
      ) {
        const nextSlideIndex = currentSlideIndex + 1;

        router.push(
          {
            query: {
              ...router.query,
              slideIndex: nextSlideIndex,
            },
          },
          undefined,
          { shallow: true },
        );

        setTimeout(() => {
          setIsLoading(false);
          setLoadingItineraryId(null);
          setIsRecalculatingRoute(false);
        }, 300);
      } else {
        setIsLoading(false);
        setLoadingItineraryId(null);
        setIsRecalculatingRoute(false);
      }
    }, MINIMUM_LOADING_TIME);
  };

  const handleLoadingError = (errorMessage) => {
    console.error("❌ Loading error:", errorMessage);
    setError(errorMessage);
    setIsLoading(false);
    setLoadingItineraryId(null);
    setApiSucceeded(false);
  };

  if (isLoading && slideIndex === 0 && !isRecalculatingRoute) {
    return (
      <div className="container">
        <div className="py-2xl">
          <div className="text-md-lg font-600 leading-xl-sm mb-md">
            Plan Your Trip
          </div>
          <StepsProgress
            slideIndex={slideIndex}
            totalSlides={totalSlides}
            steps={steps}
          />
        </div>

        <RoutePreparationLoader
          itineraryId={loadingItineraryId}
          onComplete={handleLoadingComplete}
          onError={handleLoadingError}
          handleCompletion={handleLoadingComplete}
          apiSucceeded={apiSucceeded}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="py-2xl">
          <div className="text-md-lg font-600 leading-xl-sm mb-md">
            <div className="flex justify-between">
            <span>
            Plan Your Trip
            </span>
            <FaX className="cursor-pointer" onClick={() => {
                    if (props?.onHide) {
                      props.onHide();
                    } else router.push("/");
                  }}/>
            </div>
          </div>
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
              <div className="h-max  font-inter flex flex-col gap-[30px] w-100">
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
                      {headings[slideIndex] && (
                        <h1 className="text-xl-md font-600 leading-2xl-md max-pg:text-xl max-ph:text-center mb-zero">
                          {headings[slideIndex]}
                        </h1>
                      )}
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
                    <BotLoginModal
                      show={showLoginForm}
                      onhide={onHide}
                      zIndex={"3300"}
                      onSuccess={() => {
                        markLoginStage("user_login_completed", "logged_in");
                        // Close the login modal explicitly on success. Its
                        // visibility is driven by local `showLoginForm`, so
                        // relying on the subsequent /chat navigation to unmount
                        // it leaves the modal stuck open whenever completion is
                        // slow, errors, or has no itinerary id to navigate to.
                        onHide();
                        completeItineraryCreate();
                      }}
                      isTailored={true}
                      onSkipLogin={() => {
                        // skip_login_completed is the branch metric; the funnel
                        // stage still has to fire (with the reason) or every
                        // skipper would look like a drop-off that then somehow
                        // reaches itinerary_creation_completed.
                        trackSkipLoginCompleted({
                          itinerary_id: latestItineraryIdRef.current || null,
                          surface: "tailored_form",
                        });
                        markLoginStage("user_login_completed", "skipped");
                        onHide();
                        completeItineraryCreate();
                      }}
                      message={"Welcome to The Tarzan Way!"}
                    />
                  </div>
                  <div
                    className={`${
                      slideIndex == 1
                        ? "w-[100%]"
                        : isDesktop
                          ? `max-w-[600px] ${slideIndex == 0 ? (error ? "pb-[50px]" : "pb-[5px]") : ""}`
                          : `w-full ${slideIndex == 0 ? (error ? "pb-[40px]" : "pb-[85px]") : ""}`
                    }`}
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
          {error ? (
            <p className="text-sm text-red-600 text-center">{error}</p>
          ) : null}
          {slideIndex === 0 && (
            <div className="max-w-[600px] my-zero mx-auto max-ph:w-full">
              <div className="flex justify-between">
                <button
                  className={`LargeIndigoOutlinedButton `}
                  onClick={() => {
                    if (props?.onHide) {
                      props.onHide();
                    } else router.push("/");
                  }}
                >
                  Cancel
                </button>

                <Button
                  width={`${isPageWide ? "300px" : "50%"}`}
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
              <button
                className={`LargeIndigoOutlinedButton `}
                onClick={_prevSlideHandler}
                // disabled={isLoading}
              >
                Back
              </button>

              {isRouteChanged ? (
                <Button
                  width={`${isPageWide ? "300px" : "50%"}`}
                  fontSize="1rem"
                  padding="0.5rem 1rem"
                  fontWeight="500"
                  bgColor="#07213A"
                  borderRadius="8px"
                  color="white"
                  height="50px"
                  loading={isLoading}
                  disabled={isLoading}
                  onclick={() => {
                    setIsLoading(true);
                    setApiSucceeded(false);
                    setIsRecalculatingRoute(true);
                    setIsManualNavigation(false);
                    initiateItineraryCreate(slideOneData);
                  }}
                >
                  Continue
                </Button>
              ) : (
                <button
                  className={`LargeIndigoButton w-[50%] ${
                    isDesktop && "w-[300px]"
                  } `}
                  style={{
                    width: isPageWide ? "300px" : "50%",
                  }}
                  disabled={isLoading}
                  onClick={() => {
                    if (!isLoading) {
                      // Route slide finished untouched.
                      markRouteCompleted(locationsLatLong, false);
                      router.push(
                        {
                          query: {
                            ...router.query,
                            slideIndex: slideIndex + 1,
                          },
                        },
                        undefined,
                        { shallow: true },
                      );
                    }
                  }}
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
                  width={`${isPageWide ? "300px" : "50%"}`}
                  fontSize="1rem"
                  padding="0.5rem 1rem"
                  fontWeight="500"
                  bgColor="#07213A"
                  color="white"
                  height="50px"
                  onclick={_SlideThreeSubmitHandler}
                  loading={isLoading}
                  borderRadius="8px"
                  className="whitespace-nowrap"
                >
                  Get Itinerary!
                </Button>
              </div>
            </div>
          )}
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
