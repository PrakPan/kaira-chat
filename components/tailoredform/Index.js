import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  itineraryInitiate,
  itineraryComplete,
} from "../../services/leads/tailored";
import { EXPERIENCE_FILTERS_BOX } from "../../services/constants";
import {
  resetSelectedCity,
  setAnytimeDate,
  setDateType,
  setFixedDate,
  setFlexibleDate,
  setItineraryCreated,
  setItineraryInitiateData,
  setRoomConfiguration,
  setSelectedCities,
} from "../../store/actions/slideOneActions";
import { changeUserLocation } from "../../store/actions/userLocation";
import { authCloseLogin } from "../../store/actions/auth";
import {
  buildItineraryPayload,
  divideTravellers,
  useSourceParams,
} from "./utils/slideOneActions";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useAnalyticsSession } from "../../hooks/useAnalyticsSession";
import {
  FUNNELS,
  reportFunnelStage,
} from "../../services/analyticsFunnel";
import getPlatform from "../../utils/getPlatform";
import RoutePreparationLoader from "./RoutePreparationLoader";
import BotLoginModal from "../bot-components/components/BotLoginModal";
import StepTrip from "./kaira/StepTrip";
import StepRoute, { cityName } from "./kaira/StepRoute";
import StepGroup, { travellerSummary } from "./kaira/StepGroup";
import StepVibe from "./kaira/StepVibe";
import { describeDate } from "./kaira/WhenPanel";
import { IconArrowLeft, IconArrowRight, IconX } from "./kaira/icons";

// Last-resort fallback, used only if the app-wide location bootstrap never
// reports anything at all, so the field can't hang forever. The bootstrap
// itself already falls back to New Delhi, so this almost never fires.
const DELHI_FALLBACK = {
  name: "New Delhi, IN",
  place_id: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
};

// A resolved location can name itself either way: the geo API returns `text`,
// older cached cookies only carry `city`.
const locationName = (loc) => loc?.text || loc?.city || "";

const STEP_NAMES = ["The trip", "The route", "Who's going", "The vibe"];
const TOTAL_STEPS = 4;

// The same four marks as components/tailoredform/TrustFactor.js, so the form
// footer and the rest of the site show one set of icons.
const TRUST = [
  { icon: "/assets/trustfactor/trust-factor-1.svg", label: "10,000+ travellers" },
  { icon: "/assets/trustfactor/trust-factor-2.svg", label: "24/7 Support" },
  { icon: "/assets/trustfactor/trust-factor-3.svg", label: "GST Invoice" },
  { icon: "/assets/trustfactor/trust-factor-4.svg", label: "Secure Payments" },
];

// The router query drives the step; hooks below must not run until it is
// ready, so the real component only mounts once it is.
const Enquiry = (props) => {
  const router = useRouter();
  if (!router.isReady) return null;
  return <EnquiryForm {...props} router={router} />;
};

const EnquiryForm = (props) => {
  const { router } = props;
  const dispatch = useDispatch();
  const onHide = () => {
    setShowLoginForm(false);
    dispatch(authCloseLogin());
  };

  const [locationsLatLong, setLocationsLatLong] = useState(
    useSelector(
      (state) => state.tailoredInfoReducer.itineraryInititateData?.basic_route,
    ) || [],
  );

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

  const [startingLocation, setStartingLocation] = useState(null);
  const startingLocationRef = useRef(null);
  startingLocationRef.current = startingLocation;
  // Set once the user picks or clears the starting point by hand. Until then
  // the field belongs to the app-wide location bootstrap and every later
  // resolution is allowed to overwrite it — otherwise an early cookie or the
  // Delhi safety net would win the race against the real lookup and the user
  // would be departing from the wrong city.
  const userTouchedStartRef = useRef(false);

  const [isRouteChanged, setIsRouteChanged] = useState(false);
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const currency = useSelector((state) => state.UserLocation).location;
  const [itineraryId, setItineraryId] = useState(null);
  const [apiSucceeded, setApiSucceeded] = useState(false);
  const [error, setError] = useState(null);
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
  const source = useSourceParams();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // ── The on-screen keyboard ────────────────────────────────────────────────
  // The form is a full-height sheet whose body scrolls inside it, so it has to
  // be sized to the part of the screen the reader can actually see. `100dvh`
  // is not that: on iOS Safari and on the Instagram / Facebook in-app browsers
  // the keyboard is an overlay — the layout viewport does not shrink — so the
  // sheet kept its full height and the bottom of it, including the suggestion
  // list under whichever field had focus, sat behind the keyboard. Android is
  // better behaved but still varies by `windowSoftInputMode`.
  //
  // visualViewport is the one thing that reports the visible box on all three.
  // Publish it as custom properties and let the stylesheet use them (see
  // `--kf-vvh` in styles/kaira-form.css); `offsetTop` matters because iOS
  // scrolls the layout viewport up under the keyboard rather than resizing it.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--kf-vvh", `${Math.round(vv.height)}px`);
      root.style.setProperty("--kf-vvo", `${Math.round(vv.offsetTop)}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      root.style.removeProperty("--kf-vvh");
      root.style.removeProperty("--kf-vvo");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.page_id, router.query.destination]);

  useEffect(() => {
    if ((slideIndex && slideIndex != 0) || isItineraryCreated) {
      dispatch(setItineraryCreated(false));
      if (!itineraryInititateData)
        router.push(
          {
            query: {
              ...router.query,
              slideIndex: 0,
            },
          },
          undefined,
          { shallow: true },
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, slideIndex]);

  // ── Starting point ────────────────────────────────────────────────────────
  // The visitor's city comes from the app-wide bootstrap in pages/_app.js
  // (IP lookup, 3-day cache, New Delhi on failure), which lands in Redux as
  // `UserLocation.location`. Show the cookie immediately so the field is
  // filled on the first paint, then let the resolved location replace it —
  // the lookup is a network round trip and regularly finishes after the first
  // render.
  useEffect(() => {
    if (userTouchedStartRef.current || startingLocationRef.current) return;
    try {
      const raw = Cookies.get("userLocation");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const name = locationName(parsed);
      if (name) setStartingLocation({ name, place_id: parsed.place_id });
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (userTouchedStartRef.current) return;
    const name = locationName(props.userLocation);
    if (!name) return;
    setStartingLocation({
      name,
      place_id: props.userLocation.place_id,
    });
  }, [props.userLocation]);

  // Safety net only: the bootstrap always resolves (New Delhi on failure), so
  // this fires just when it never reported at all.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!startingLocationRef.current && !userTouchedStartRef.current) {
        setStartingLocation(DELHI_FALLBACK);
      }
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const handlePickStart = (loc) => {
    userTouchedStartRef.current = true;
    setStartingLocation(loc);
    setErrors((e) => ({ ...e, startLocation: null }));
    try {
      Cookies.set(
        "userLocation",
        JSON.stringify({
          ...(props.userLocation || {}),
          text: loc.name,
          city: loc.name,
          place_id: loc.place_id,
        }),
        { expires: 3 },
      );
    } catch (e) {}
    dispatch(
      changeUserLocation({
        location: {
          ...(props.userLocation || {}),
          text: loc.name,
          place_id: loc.place_id,
        },
      }),
    );
  };

  const handleClearStart = () => {
    userTouchedStartRef.current = true;
    setStartingLocation(null);
  };

  const selectedCities = slideOneData.selectedCities || [];
  const dest = selectedCities.find((c) => c?.id) || null;
  const primaryInputId = selectedCities[0]?.input_id;

  const handlePickDest = (r) => {
    const id = r.resource_id || r.id;
    const inputId = primaryInputId || Date.now();
    dispatch(setSelectedCities(id, inputId, { ...r, id }));
    setErrors((e) => ({ ...e, destination1: null }));
    setError(null);
  };

  const handleClearDest = () => {
    selectedCities.forEach((c) => {
      if (c?.input_id) dispatch(resetSelectedCity(c.input_id));
    });
  };

  // ── Dates ─────────────────────────────────────────────────────────────────
  const dateInfo = describeDate(slideOneData.date);
  const onFixed = (s, e) => {
    dispatch(setFixedDate(s, e));
    setErrors((er) => ({ ...er, when: null }));
  };
  const onFlexible = (month, year, nights) => {
    dispatch(setFlexibleDate(month, year, nights));
    setErrors((er) => ({ ...er, when: null }));
  };
  const onAnytime = (nights) => {
    dispatch(setAnytimeDate(nights));
    setErrors((er) => ({ ...er, when: null }));
  };
  const onResetType = (type) => dispatch(setDateType(type));

  useEffect(() => {
    setErrors({ startLocation: null, destination1: null, when: null });
  }, [slideIndex]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = (index) =>
    router.push(
      {
        query: {
          ...router.query,
          slideIndex: index,
        },
      },
      undefined,
      { shallow: true },
    );

  const _prevSlideHandler = () => {
    if (slideIndex) {
      if (slideIndex == 1) {
        setIsRouteChanged(false);
      }
      setIsManualNavigation(true);
      goTo(slideIndex - 1);
    }
  };

  const close = () => {
    if (props?.onHide) {
      props.onHide();
    } else router.push("/");
  };

  // Funnel steps 3 & 4 — the route slide is done.
  //
  // The funnel's "preferences" stage historically meant slide 0's experience
  // filters, which were submitted with the route in the same /initiate
  // payload; the dashboard's FLOW still lists it right after route. The vibe
  // step now captures preferences later, so this stage keeps firing here (to
  // keep the funnel monotonic) and the actual picks ride along on
  // itinerary_creation_completed as `preferences`.
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
  // user never sees it, and the modal itself offers a skip. Reporting the
  // stage on every path (with the reason) is what keeps the funnel from
  // showing more completions than logins.
  const markLoginStage = (stage, outcome) => {
    reportFormStage(stage, {
      outcome,
      already_authenticated: outcome === "already_authenticated",
    });
  };

  const hasAccessToken = () =>
    typeof window !== "undefined" && !!localStorage.getItem("access_token");

  // ── Step submits ──────────────────────────────────────────────────────────
  const canFindRoute = !!dest?.id && dateInfo.ok;

  const _SlideOneSubmitHandler = () => {
    if (!dest?.id) {
      setErrors({
        startLocation: null,
        destination1: "Pick a destination to continue",
        when: null,
      });
      return;
    }
    const d = slideOneData.date;
    if (d.type === "fixed" && !(d.start_date && d.end_date)) {
      setErrors({ startLocation: null, destination1: null, when: "Pick your dates to continue" });
      return;
    }
    if (d.type === "flexible" && !(d.month && d.duration)) {
      setErrors({ startLocation: null, destination1: null, when: "Pick a rough month and how long" });
      return;
    }
    if (d.type === "anytime" && !d.duration) {
      setErrors({ startLocation: null, destination1: null, when: "Tell me roughly how long" });
      return;
    }

    if (props.HeroBanner && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setIsManualNavigation(false);
    initiateItineraryCreate(slideOneData);
  };

  const _RouteSubmitHandler = () => {
    if (isLoading) return;
    if (isRouteChanged) {
      setIsLoading(true);
      setApiSucceeded(false);
      setIsRecalculatingRoute(true);
      setIsManualNavigation(false);
      initiateItineraryCreate(slideOneData);
      return;
    }
    // Route slide finished untouched.
    markRouteCompleted(locationsLatLong, false);
    goTo(slideIndex + 1);
  };

  const _GroupSubmitHandler = () => {
    let dist = divideTravellers(slideThreeData);
    dispatch(setRoomConfiguration(dist));

    // Funnel step 5 — "Who's going & inclusions" is done.
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

    goTo(slideIndex + 1);
  };

  const _VibeSubmitHandler = () => {
    if (isSubmitting) return;
    // Final slide — raise the sign-in gate before completing.
    if (!hasAccessToken()) {
      markLoginStage("user_login_initiated", "gate_shown");
      setShowLoginForm(true);
    } else {
      markLoginStage("user_login_initiated", "already_authenticated");
      markLoginStage("user_login_completed", "already_authenticated");
      setIsSubmitting(true);
      completeItineraryCreate();
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

      if (resData) {
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
      // step; a plain initiate from slide 0 does not.
      reportFormStage("itinerary_initiate_completed", {
        route: routeToTrack || resData.basic_route || null,
        duration: totalDuration,
      });
      setItineraryId(newItineraryId);
      setLoadingItineraryId(newItineraryId);

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
        // fires the same stages from the slide-1 Continue button.)
        markRouteCompleted(routeToTrack || resData.basic_route || null, true);

        goTo(slideIndex + 1);

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
  };

  const completeItineraryCreate = () => {
    const platform = getPlatform();

    // Prevent double / re-entrant completion (multiple entry points: vibe
    // step button, login onSuccess / onSkipLogin).
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
      goTo(0);
      return;
    }

    const vibePreferences = Array.isArray(slideFourData?.vibePreferences)
      ? slideFourData.vibePreferences.filter(Boolean)
      : [];

    const data = {
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
      // Chips picked on the vibe step. Only sent when the user picked some.
      ...(vibePreferences.length > 0 && { preferences: vibePreferences }),
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
      .then(() => {
        setError(null);
        // Funnel step 8 — /complete succeeded. `latestItineraryIdRef` is what
        // reportFormStage stamps events with, so make sure it holds the id we
        // actually completed against before reporting.
        latestItineraryIdRef.current = finalItineraryId;
        reportFormStage("itinerary_creation_completed", {
          platform,
          currency: currency?.currency || "INR",
          preferences: vibePreferences,
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
        // so the gtag/dataLayer beacons still send.
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
        goTo(currentSlideIndex + 1);

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

  // ── Derived copy ──────────────────────────────────────────────────────────
  const fetching = isLoading && slideIndex === 0 && !isRecalculatingRoute;
  const fromName = startingLocation?.name || "";
  const destName = dest?.name || "";
  const startName = itineraryInititateData?.start_city?.name || fromName;
  const firstCity = locationsLatLong.length ? cityName(locationsLatLong[0]) : "";
  const travSummary = travellerSummary(slideThreeData);
  const isUnsure = slideOneData.date?.type === "anytime";
  const monthPhrase = dateInfo.monthPhrase || "season";

  const kairaLine = fetching
    ? `Hold on, I'm reading ${destName || "your trip"} for you…`
    : slideIndex === 0
      ? "Hi, I'm Kaira, your travel agent. Tell me where and when, I'll do the rest."
      : slideIndex === 1
        ? "Here's the route I'd run. Trade nights, drag cities, make it yours."
        : slideIndex === 2
          ? "Who am I planning for? I'll size rooms and seats to match."
          : "Last one. Tell me the vibe and I'll build the days around it.";

  const headerSummary = `${fromName || "…"} → ${destName || "…"} · ${
    dateInfo.header || "dates tbd"
  } · ${travSummary}`;

  const readNote = isUnsure
    ? `Next I'll read ${destName || "your destination"} across the year and suggest when to go. The route and vibe ideas follow from that.`
    : `Next I'll read ${destName || "your destination"} in your dates. The route and vibe suggestions come from what's actually on in ${monthPhrase}.`;

  const fetchLabels = [
    `Searching ${destName || "your destination"} · ${dateInfo.header || "your best window"}`,
    `Drafting your route`,
    isUnsure ? "Picking the best window to go" : `Picking what ${monthPhrase} is good for`,
  ];

  const st = slideIndex + 1;
  const segClass = (i) => {
    if (st >= i && !(i === st && fetching)) return "kform-seg is-done";
    if (fetching && i === st + 1) return "kform-seg is-next";
    return "kform-seg";
  };
  const segLabelClass = (i) =>
    st === i && !fetching
      ? "kform-seg-label is-current"
      : st > i
        ? "kform-seg-label is-past"
        : "kform-seg-label";

  const ctaLabel =
    slideIndex === 0
      ? "Find my route"
      : slideIndex === 3
        ? "Get my itinerary"
        : "Continue";
  const ctaDisabled =
    (slideIndex === 0 && !canFindRoute) || isSubmitting || (isLoading && slideIndex !== 0);
  const ctaBusy = isSubmitting || (isLoading && slideIndex === 1);
  const onCta = () => {
    if (slideIndex === 0) return _SlideOneSubmitHandler();
    if (slideIndex === 1) return _RouteSubmitHandler();
    if (slideIndex === 2) return _GroupSubmitHandler();
    return _VibeSubmitHandler();
  };

  const destNamesForChips = Array.from(
    new Set(
      [
        ...selectedCities.filter((c) => c?.id).map((c) => c.name),
        ...locationsLatLong.map((c) => cityName(c)),
      ].filter(Boolean),
    ),
  );

  const embedded = !!(props.tailoredFormModal || props.HeroBanner);

  const card = (
    <div className={`kform-card${embedded ? " kform-card--embedded" : ""}`}>
      {/* header */}
      <div className="kform-head">
        <div className="kform-avatar">
          <img src="/KairaInsta.png" alt="Kaira" />
          <span className="kform-online" />
        </div>
        <div className="kform-head-text">
          <div className="kform-title">
            Plan your trip <span className="kform-serif">with Kaira</span>
          </div>
          <div className="kform-kline">{kairaLine}</div>
        </div>
        <div className="kform-summary" title={headerSummary}>
          {headerSummary}
        </div>
        <button type="button" className="kform-iconbtn" onClick={close} aria-label="close">
          <IconX size={15} />
        </button>
      </div>

      {/* progress */}
      <div className="kform-progress">
        {STEP_NAMES.map((name, i) => (
          <div className="kform-progress-item" key={name}>
            <div className={segClass(i + 1)} />
            <div className={segLabelClass(i + 1)}>
              0{i + 1} · {name}
            </div>
          </div>
        ))}
      </div>
      <div className="kform-crumb">
        {fetching
          ? "Reading your destination…"
          : `Step ${st} of ${TOTAL_STEPS} · ${STEP_NAMES[slideIndex] || ""}`}
      </div>

      {/* body */}
      <div className="kform-body">
        {fetching ? (
          <RoutePreparationLoader
            itineraryId={loadingItineraryId}
            onComplete={handleLoadingComplete}
            onError={handleLoadingError}
            handleCompletion={handleLoadingComplete}
            apiSucceeded={apiSucceeded}
            destName={destName}
            monthPhrase={monthPhrase}
            fetchLabels={fetchLabels}
          />
        ) : slideIndex === 0 ? (
          <StepTrip
            key="trip"
            startingLocation={startingLocation}
            onPickStart={handlePickStart}
            onClearStart={handleClearStart}
            dest={dest}
            onPickDest={handlePickDest}
            onClearDest={handleClearDest}
            date={slideOneData.date}
            dateInfo={dateInfo}
            onFixed={onFixed}
            onFlexible={onFlexible}
            onAnytime={onAnytime}
            onResetType={onResetType}
            errors={errors}
            readNote={readNote}
          />
        ) : slideIndex === 1 ? (
          <StepRoute
            key="route"
            startName={startName}
            cities={locationsLatLong}
            setCities={setLocationsLatLong}
            setIsRouteChanged={setIsRouteChanged}
          />
        ) : slideIndex === 2 ? (
          <StepGroup key="group" fromName={fromName} firstCity={firstCity} />
        ) : (
          <StepVibe
            key="vibe"
            destNames={destNamesForChips}
            destName={destName}
            startDate={dateInfo.startYMD || null}
            groupType={slideThreeData.groupType}
            dateShort={dateInfo.short}
          />
        )}
      </div>

      {/* footer */}
      <div className="kform-foot">
        {error ? <div className="kform-error">{error}</div> : null}
        <div className="kform-foot-row">
          {!fetching ? (
            <div className="kform-trust">
              {TRUST.map((t) => (
                <div className="kform-trust-item" key={t.label}>
                  <img src={t.icon} alt="" aria-hidden="true" />
                  {t.label}
                </div>
              ))}
            </div>
          ) : (
            <div className="kform-foot-spacer" />
          )}
          {fetching ? (
            <div className="kform-foot-note"></div>
          ) : (
            <>
              {slideIndex > 0 && (
                <>
                  <button
                    type="button"
                    className="kform-back kform-back--text"
                    onClick={_prevSlideHandler}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="kform-back kform-back--icon"
                    onClick={_prevSlideHandler}
                    aria-label="back"
                  >
                    <IconArrowLeft />
                  </button>
                </>
              )}
              <button
                type="button"
                className={`kform-cta${ctaDisabled ? " is-disabled" : ""}`}
                onClick={onCta}
                disabled={ctaDisabled}
              >
                {ctaLabel}
                {ctaBusy ? <span className="kform-spin" /> : <IconArrowRight />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    // Embedded, this root sits between the host modal and the card. It has to
    // carry the host's height through, or the card's own `height: 100%`
    // resolves against an auto-height parent, falls back to its content, and
    // overflows the sheet — taking the footer's Continue button off screen.
    <div className={`kform${embedded ? " kform--embedded" : ""}`}>
      {embedded ? card : <div className="kform-backdrop">{card}</div>}

      <BotLoginModal
        show={showLoginForm}
        onhide={onHide}
        zIndex={"3300"}
        onSuccess={() => {
          markLoginStage("user_login_completed", "logged_in");
          // Close the login modal explicitly on success. Its visibility is
          // driven by local `showLoginForm`, so relying on the subsequent /chat
          // navigation to unmount it leaves the modal stuck open whenever
          // completion is slow, errors, or has no itinerary id to navigate to.
          onHide();
          setIsSubmitting(true);
          completeItineraryCreate();
        }}
        isTailored={true}
        onSkipLogin={() => {
          // skip_login_completed is the branch metric; the funnel stage still
          // has to fire (with the reason) or every skipper would look like a
          // drop-off that then somehow reaches itinerary_creation_completed.
          trackSkipLoginCompleted({
            itinerary_id: latestItineraryIdRef.current || null,
            surface: "tailored_form",
          });
          markLoginStage("user_login_completed", "skipped");
          onHide();
          setIsSubmitting(true);
          completeItineraryCreate();
        }}
        message={"Welcome to The Tarzan Way!"}
      />
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
