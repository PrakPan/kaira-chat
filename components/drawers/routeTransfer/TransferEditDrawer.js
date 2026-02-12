import { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { FaX } from "react-icons/fa6";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { IoIosArrowUp, IoIosArrowDown, IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import Drawer from "../../ui/Drawer";
import axiosRoundTripEditInstance from "../../../services/itinerary/brief/roudTripEdit";
import { routeDetails } from "../../../services/itinerary/brief/transferEdit";
import axiosRoundTripInstance, {
  axiosMulticityRoundTripInstance,
} from "../../../services/itinerary/brief/roundTripSuggestion";
import { openNotification } from "../../../store/actions/notification";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import Button from "../../../components/ui/button/Index";
import ImageLoader from "../../../components/ImageLoader";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getIndianPrice } from "../../../services/getIndianPrice";
import useMediaQuery from "../../media";
import TransfersIcon from "../../../helper/TransfersIcon";
import { logEvent } from "../../../services/ga/Index";
import TaxiModal from "../../../components/modals/taxis/Index";
import FlightModal from "../../../components/modals/flights/Index";
import media from "../../../components/media";
import { getDate } from "../../../helper/DateUtils";
import {
  fetchMulticityRoundtrip,
  fetchTransferMode,
  loadOtherTransfers,
  UpdateTransferMode,
} from "../../../services/bookings/FetchTaxiRecommendations";
import { FaClock, FaPlaneDeparture } from "react-icons/fa";
import { AiOutlineRight, AiOutlineUp } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import { BiTrain } from "react-icons/bi";
import { PiTaxi } from "react-icons/pi";
import {
  ImCheckboxChecked,
  ImCheckboxUnchecked,
  ImCross,
} from "react-icons/im";
import ComboFlight from "../../modals/flights/ComboFlight";
import ComboTaxi from "../../modals/taxis/ComboTaxi";
import {
  MdDirectionsBoat,
  MdDirectionsBus,
  MdDirectionsTransit,
  MdLocalTaxi,
} from "react-icons/md";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";
import {
  setTransfersBookings,
  updateSingleTransferBooking,
} from "../../../store/actions/transferBookingsStore";
import BackArrow from "../../ui/BackArrow";
import { Pax } from "../activityDetails/Pax";
import { TbArrowBack } from "react-icons/tb";
import { DatePicker } from "../../../containers/newitinerary/breif/route/RouteEditSection";
import { axiosGetTransfers } from "../../../services/itinerary/bookings";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { useHandleClose } from "../../../hooks/useHandleClose";
import { useRouter } from "next/router";
import { useGenericAPIModal } from "../../modals/warning/Index";
import { updateFlightBookingWarning } from "../../../services/bookings/UpdateBookings";
import { getDateInfo } from "../../../utils/dateFormate";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { currencySymbols } from "../../../data/currencySymbols";
import { Link } from "react-scroll";
import SkeletonCard from "../../ui/SkeletonCard";

const svgIcons = {
  time: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10.2 11.1333L11.1333 10.2L8.66668 7.73334V4.66668H7.33334V8.26668L10.2 11.1333ZM8.00001 14.6667C7.07779 14.6667 6.21112 14.4916 5.40001 14.1413C4.5889 13.7916 3.88334 13.3167 3.28334 12.7167C2.68334 12.1167 2.20845 11.4111 1.85868 10.6C1.50845 9.7889 1.33334 8.92223 1.33334 8.00001C1.33334 7.07779 1.50845 6.21112 1.85868 5.40001C2.20845 4.5889 2.68334 3.88334 3.28334 3.28334C3.88334 2.68334 4.5889 2.20823 5.40001 1.85801C6.21112 1.50823 7.07779 1.33334 8.00001 1.33334C8.92223 1.33334 9.7889 1.50823 10.6 1.85801C11.4111 2.20823 12.1167 2.68334 12.7167 3.28334C13.3167 3.88334 13.7916 4.5889 14.1413 5.40001C14.4916 6.21112 14.6667 7.07779 14.6667 8.00001C14.6667 8.92223 14.4916 9.7889 14.1413 10.6C13.7916 11.4111 13.3167 12.1167 12.7167 12.7167C12.1167 13.3167 11.4111 13.7916 10.6 14.1413C9.7889 14.4916 8.92223 14.6667 8.00001 14.6667ZM8.00001 13.3333C9.47779 13.3333 10.7362 12.814 11.7753 11.7753C12.814 10.7362 13.3333 9.47779 13.3333 8.00001C13.3333 6.52223 12.814 5.26379 11.7753 4.22468C10.7362 3.18601 9.47779 2.66668 8.00001 2.66668C6.52223 2.66668 5.26401 3.18601 4.22534 4.22468C3.18623 5.26379 2.66668 6.52223 2.66668 8.00001C2.66668 9.47779 3.18623 10.7362 4.22534 11.7753C5.26401 12.814 6.52223 13.3333 8.00001 13.3333Z"
        fill="#ACACAC"
      />
    </svg>
  ),
  location: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8.00001 14.6667C6.82223 14.6667 5.86112 14.4806 5.11668 14.1083C4.37223 13.7361 4.00001 13.2556 4.00001 12.6667C4.00001 12.4 4.08057 12.1528 4.24168 11.925C4.40279 11.6972 4.62779 11.5 4.91668 11.3333L5.96668 12.3167C5.86668 12.3611 5.75834 12.4111 5.64168 12.4667C5.52501 12.5222 5.43334 12.5889 5.36668 12.6667C5.51112 12.8445 5.84446 13 6.36668 13.1333C6.8889 13.2667 7.43335 13.3333 8.00001 13.3333C8.56668 13.3333 9.1139 13.2667 9.64168 13.1333C10.1695 13 10.5056 12.8445 10.65 12.6667C10.5722 12.5778 10.4722 12.5056 10.35 12.45C10.2278 12.3945 10.1111 12.3445 10 12.3L11.0333 11.3C11.3445 11.4778 11.5833 11.6806 11.75 11.9083C11.9167 12.1361 12 12.3889 12 12.6667C12 13.2556 11.6278 13.7361 10.8833 14.1083C10.1389 14.4806 9.17779 14.6667 8.00001 14.6667ZM8.01668 11C9.11668 10.1889 9.94446 9.37501 10.5 8.55834C11.0556 7.74168 11.3333 6.92223 11.3333 6.10001C11.3333 4.96668 10.9722 4.11112 10.25 3.53334C9.52779 2.95557 8.77779 2.66668 8.00001 2.66668C7.22223 2.66668 6.47223 2.95557 5.75001 3.53334C5.02779 4.11112 4.66668 4.96668 4.66668 6.10001C4.66668 6.84445 4.9389 7.61945 5.48334 8.42501C6.02779 9.23057 6.87223 10.0889 8.01668 11ZM8.00001 12.6667C6.43334 11.5111 5.2639 10.3889 4.49168 9.30001C3.71945 8.21112 3.33334 7.14445 3.33334 6.10001C3.33334 5.31112 3.47501 4.61945 3.75834 4.02501C4.04168 3.43057 4.40557 2.93334 4.85001 2.53334C5.29446 2.13334 5.79446 1.83334 6.35001 1.63334C6.90557 1.43334 7.45557 1.33334 8.00001 1.33334C8.54446 1.33334 9.09446 1.43334 9.65001 1.63334C10.2056 1.83334 10.7056 2.13334 11.15 2.53334C11.5945 2.93334 11.9583 3.43057 12.2417 4.02501C12.525 4.61945 12.6667 5.31112 12.6667 6.10001C12.6667 7.14445 12.2806 8.21112 11.5083 9.30001C10.7361 10.3889 9.56668 11.5111 8.00001 12.6667ZM8.00001 7.33334C8.36668 7.33334 8.68057 7.20279 8.94168 6.94168C9.20279 6.68057 9.33335 6.36668 9.33335 6.00001C9.33335 5.63334 9.20279 5.31945 8.94168 5.05834C8.68057 4.79723 8.36668 4.66668 8.00001 4.66668C7.63335 4.66668 7.31946 4.79723 7.05834 5.05834C6.79723 5.31945 6.66668 5.63334 6.66668 6.00001C6.66668 6.36668 6.79723 6.68057 7.05834 6.94168C7.31946 7.20279 7.63335 7.33334 8.00001 7.33334Z"
        fill="#ACACAC"
      />
    </svg>
  ),
  right_arrow: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
    >
      <path
        d="M1.41 0L0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0Z"
        fill="black"
      />
    </svg>
  ),
  check_white: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M5.24909 9.45L2.79909 7L1.98242 7.81666L5.24909 11.0833L12.2491 4.08333L11.4324 3.26666L5.24909 9.45Z"
        fill="white"
      />
    </svg>
  ),
};

const FloatingView = styled.div`
  position: sticky;
  bottom: 80px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 901;
  cursor: pointer;
`;

const ClippathComp = styled.div`
  clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 95% 50%, 100% 0%);
`;

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const TRANSFER_TYPES = {
  ONEWAYTRIP: {
    name: "one-way-trip",
    label: "One Way Transfer Options",
  },
  ROUNDTRIP: {
    name: "round-trip",
    label: "Round-trip options",
  },
  MULTICITYROUNDTRIP: {
    name: "MULTICITYROUNDTRIP",
    label: "Multi-City/Round Trip Taxi",
  },
  name: "MULTICITYROUNDTRIP",
  label: "Multi-City/Round Trip Taxi",
};

const TransferEditDrawer = (props) => {
  const {
    showDrawer,
    origin,
    destination,
    day_slab_index,
    openNotification,
    setShowLoginModal,
    check_in,
    routeId,
    selectedBooking,
    setSelectedBooking,
    city,
    dcity,
    oCityData,
    dCityData,
    mercury,
    mercuryTransfer,
    origin_itinerary_city_id,
    destination_itinerary_city_id,
    originCityId,
    destinationCityId,
    _updateFlightBookingHandler,
    booking_id,
    transferData,
    booking_type,
  } = props;

  const actualClose = useHandleClose();
  const dispatch = useDispatch();
  const router = useRouter();
  const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType } =
    router?.query;
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [loadingMulticityTransfers, setLoadingMulticityTransfers] =
    useState(true);
  const [transfersError, setTransfersError] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [transferType, setTransferType] = useState(
    booking_type == "multicity" || drawerType == "multicity"
      ? TRANSFER_TYPES.MULTICITYROUNDTRIP.name
      : TRANSFER_TYPES.ONEWAYTRIP.name,
  );
  const [loadingRoundTrip, setLoadingRoundTrip] = useState(false);
  const [loadingMultiCity, setLoadingMultiCity] = useState(false);
  const [updatingTransfer, setUpdatingTransfer] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [multicityRoundtripTraceId, setMulticityRoundtripTraceId] =
    useState(null);
  const [selectedTripType, setSelectedTripType] = useState(null);

  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showComboFlightModal, setShowComboFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showComboTaxiModal, setShowComboTaxiModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showOtherTransfer, setShowOtherTrasfer] = useState(false);
  const [showMercuryTransfer, setShowMercuryTransfer] = useState(false);
  const [selectedMercuryTransfer, setSelectedMercuryTransfer] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentModeDepartureDate, setCurrentModeDepartureDate] =
    useState(null);
  const [currentModeDepartureTime, setCurrentModeDepartureTime] =
    useState(null);
  const [selectedTransferIndex, setSelectedTransferIndex] = useState(null);
  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);
  const ItineraryId = useSelector((state) => state.ItineraryId);
  // console.log("SELECTED BOOKING",city,dcity,oCityData,dCityData,mercuryTransfer?.destination?.city_name);

  const [skipFlightFetch, setSkipFlightFetch] = useState(false);
  const [skipTaxiFetch, setSkipTaxiFetch] = useState(false);
  const [flightResults, setFlightResults] = useState([]);
  const [taxiResults, setTaxiResults] = useState([]);
  const currency = useSelector((state) => state.currency);

  const { email } = useSelector((state) => state.auth);

  useEffect(() => {
    if (booking_type == "multicity" || drawerType == "multicity") {
      setTransferType(TRANSFER_TYPES.MULTICITYROUNDTRIP.name);
    }
  }, [booking_type]);

  useEffect(() => {
    if (showDrawer) {
      fetchRoutes();
    }
  }, [showDrawer]);

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  // console.log("IsMulti", booking_type, transferType);
  useEffect(() => {
    if (showDrawer) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [showDrawer]);

  // console.log("IsMulti",booking_type,transferType);
  const fetchRoutes = () => {
    setLoadingTransfers(true);
    setLoadingMulticityTransfers(true);
    setTransfersError(null);
    // roundTripSuggestion();

    const requestData = {
      start_datetime: `${getDate(check_in)}T00:00:00`,
      number_of_travellers:
        number_of_adults + number_of_children + number_of_infants,
    };

    const multiCityRoundtripRequestData = {
      start_date:
        dCityData?.start_date ??
        (oCityData?.start_date && oCityData?.duration != null
          ? addDaysToDate(oCityData.start_date, oCityData.duration)
          : dayjs(selectedBooking.check_in).format("YYYY-MM-DD")),
      start_time: `00:00`,
      number_of_travellers:
        number_of_adults + number_of_children + number_of_infants,
    };

    {
      mercury || props?.isMercury
        ? fetchMulticityRoundtrip
            .get(
              `/${router.query.id}/?currency=${currency?.currency || "INR"}`,
              // multiCityRoundtripRequestData
            )
            .then((response) => {
              setMultiCitySuggestions(response?.data?.suggestions?.[0]);
              setMulticityRoundtripTraceId(response?.data?.trace_id);
              setRoundTripSuggestions(response?.data?.suggestions?.[1]);
              setLoadingMulticityTransfers(false);
              setLoadingTransfers(false);
            })
            .catch((error) => {
              setLoadingTransfers(false);
              setLoadingMulticityTransfers(false);
              console.error("Error::Fetching Multicity Round Trip");
            })
        : null;
    }
    {
      booking_type != "multicity" && (mercury || props?.isMercury)
        ? fetchTransferMode
            .post(
              `?currency=${currency?.currency || "INR"}`,
              {
                origin:
                  props?.origin ||
                  originCityId ||
                  mercuryTransfer?.source?.city,
                destination:
                  props?.destination ||
                  mercuryTransfer?.destination?.city ||
                  destinationCityId,
                number_of_adults:
                  number_of_adults || props?.plan?.number_of_adults || 1,
                number_of_children:
                  number_of_children || props?.plan?.number_of_children || 0,
                number_of_infants:
                  number_of_infants || props?.plan?.number_of_infants || 0,
                //top_only: "false",
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token",
                  )}`,
                },
              },
            )

            .then((res) => {
              if (res.data.success && res.data.routes.data.length > 0) {
                const data = res.data.routes.data;
                setTransfers(data);
              } else {
                setTransfersError(
                  "No route found, please get in touch with us to complete this booking!",
                );
              }
              setLoadingTransfers(false);
            })
            .catch((err) => {
              setLoadingTransfers(false);
              setTransfersError(
                err?.response?.data?.errors[0]?.message[0] ||
                  "No route found, please get in touch with us to complete this booking!",
              );
            })
        : booking_type != "multicity" &&
          routeDetails
            .get(`${routeId}/`, requestData)
            .then((res) => {
              if (res.data.success && res.data.routes.data.length > 0) {
                const data = res.data.routes.data;
                setTransfers(data);
              } else {
                setTransfersError(
                  "No route found, please get in touch with us to complete this booking!",
                );
              }
              setLoadingTransfers(false);
            })
            .catch((err) => {
              setLoadingTransfers(false);
              setTransfersError(
                err.response?.data?.errors[0]?.message[0] ||
                  "No route found, please get in touch with us to complete this booking!",
              );
            });
    }
  };

  const roundTripSuggestion = () => {
    !mercury &&
      axiosRoundTripInstance
        .get(`?itinerary_id=${props?.ItineraryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          const results = response.data;

          for (let i = 0; i < results.length; i++) {
            if (
              results[i].success &&
              results[i].transfer_type === "Intercity round-trip"
            ) {
              setRoundTripSuggestions(results[i]);
            } else if (
              results[i].success &&
              results[i].transfer_type === "Multicity"
            ) {
              setMultiCitySuggestions(results[i]);
            }
          }
        })
        .catch((err) => {
          console.log("[ERROR][roundTripSuggestion]: ", err);
        });
  };

  const handleSelect = (index, transfer, multimode, mode) => {
    if (!transfer) {
      setSelectedResult(null);
      return;
    }
    let selectedBookings = {
      ...selectedBooking,
      origin_iata: transfer?.source?.code,
      destination_iata: transfer?.destination?.code,
      edge: transfer?.id,
    };

    setSelectedBooking(selectedBookings);

    if (!props.token) {
      setShowLoginModal(true);
      return;
    }

    switch (mode) {
      case "Flight":
        const isExistingFlightSelection =
          selectedResult &&
          selectedResult.transferIndex === index &&
          selectedResult.mode === "Flight";

        if (isExistingFlightSelection) {
          setShowComboFlightModal(true);
          setSelectedResult(null);
          setIsRouteSelected(true);
        } else {
          setIsRouteSelected(true);
          setSelectedResult({ transferIndex: index, mode: transfer.mode });
          setShowComboFlightModal(true);
        }
        break;

      case "Taxi":
        const isExistingTaxiSelection =
          selectedResult &&
          selectedResult.transferIndex === index &&
          selectedResult.mode === "Taxi";

        if (isExistingTaxiSelection) {
          setShowComboTaxiModal(true);
          setIsRouteSelected(true);
          setSelectedResult(null);
        } else {
          setSelectedResult({ transferIndex: index, mode: transfer.mode });
          setIsRouteSelected(true);
          setShowComboTaxiModal(true);
        }
        break;

      default:
        const isExistingSelection =
          selectedResult &&
          selectedResult.transferIndex === index &&
          selectedResult.mode === transfer.mode;

        if (isExistingSelection) {
          // Deselecting
          setSelectedResult({
            transferIndex: index,
            mode: transfer.mode,
            transfer: transfer,
          });
          //  setSelectedResult(null);
        } else {
          // New selection
          setSelectedResult({
            transferIndex: index,
            mode: transfer.mode,
            transfer: transfer,
          });
          //  setShowOtherTrasfer(true)
        }
        break;
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult((prev) => {
      if (prev?.multimode) {
        return {
          ...prev,
          modes: [
            ...prev.modes,
            {
              ...result,
            },
          ],
        };
      }
      return {
        ...prev,
        ...result,
      };
    });
    // setShowFlightModal(false);
    // setShowTaxiModal(false);
    // setShowComboTaxiModal(false);
  };

  const handleRoundTripSelect = (trace_id, cab_id) => {
    // console.log(trace_id);
    const access_token = localStorage.getItem("access_token");
    if (!props.token) {
      setShowLoginModal(true);
      return;
    }
    setSelectLoading(true);

    const data = {
      itinerary_id: ItineraryId,
      trace_id,
      cab_id,
    };
    !mercury &&
      axiosRoundTripEditInstance
        .post("", data, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 201) {
            // fetchData((scroll = false));
            openNotification({
              text: "Your Transfer updated successfully!",
              heading: "Success!",
              type: "success",
            });
          }
          setSelectLoading(false);
          actualClose();
          setCurrentStep(0);
        })
        .catch((err) => {
          setSelectLoading(false);
          actualClose();
          setCurrentStep(0);
          if (err.response.status === 403) {
            openNotification({
              text: "You are not allowed to make changes to this itinerary",
              heading: "Error!",
              type: "error",
            });
          } else {
            openNotification({
              text:
                err.response?.data?.errors[0]?.message[0] ||
                "There seems to be a problem, please try again!",
              heading: "Error!",
              type: "error",
            });
          }
        });

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `Select`,
        evemt_value: trace_id,
        event_action: "Transfer Add/Change Drawer",
      },
    });
  };

  const handleMultiCitySelect = (trace_id, result_index, quote_index) => {
    const access_token = localStorage.getItem("access_token");
    if (!props.token) {
      setShowLoginModal(true);
      return;
    }
    setUpdatingTransfer(true);
    setSelectLoading(true);

    const data = {
      trace_id,
      result_index,
      quote_index,
    };

    axiosMulticityRoundTripInstance
      .post(`${ItineraryId}/bookings/multicitytaxi/`, data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          // fetchData((scroll = false));
          openNotification({
            text: "Your Multi-City transfer booked successfully!",
            heading: "Success!",
            type: "success",
          });
        }
        dispatch(setTransfersBookings(response?.data?.data));
        props?.getPaymentHandler();
        setSelectLoading(false);
        setUpdatingTransfer(false);
        // setShowDrawer(false);
        setCurrentStep(0);
      })
      .catch((err) => {
        setSelectLoading(false);
        setUpdatingTransfer(false);
        // setShowDrawer(false);
        setCurrentStep(0);
        console.error(
          "Error::While Creating Multicity/RoundTrip Booking",
          err.message,
        );
        if (err.response?.status === 403) {
          openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          openNotification({
            text:
              err.response?.data?.errors[0]?.message[0] ||
              "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });

    logEvent({
      action: "MultiCity_Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `Select`,
        event_value: trace_id,
        event_action: "MultiCity Transfer Add/Change Drawer",
      },
    });
  };

  const handleTransferType = (e) => {
    setTransferType(e.target.id);
  };

  return (
    <Drawer
      show={showDrawer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className=" pb-0 md:pb-[100px]"
      width={"50vw"}
      mobileWidth={"100vw"}
      onHide={() => {
        if (showDrawer) actualClose();
        setCurrentStep(0);
        setIsRouteSelected(false);
        setShowOtherTrasfer(false);
        setSkipFlightFetch(false);
        setSkipTaxiFetch(false);
        setFlightResults([]);
        setTaxiResults([]);
        setTransferType(
          booking_type == "multicity"
            ? TRANSFER_TYPES.MULTICITYROUNDTRIP.name
            : TRANSFER_TYPES.ONEWAYTRIP.name,
        );
        setSelectedCab(null);
      }}
    >
      <div
        className={`relative px-xl bg-white z-[900] flex flex-col gap-xl pt-4  ${
          transfers[selectedTransferIndex]?.transfers?.length > 1
            ? "md:pb-0"
            : "md:pb-[30px]"
        } justify-start items-start mx-auto w-[100%] min-h-screen`}
      >
        <div className="flex flex-row gap-2 w-full my-0 justify-between items-center">
          {currentStep === 0 ? (
            <>
              <BackArrow
                handleClick={() => {
                  actualClose();
                  setCurrentStep(0);
                  setSkipFlightFetch(false);
                  setSkipTaxiFetch(false);
                  setIsRouteSelected(false);
                  setTransferType(
                    booking_type == "multicity"
                      ? TRANSFER_TYPES.MULTICITYROUNDTRIP.name
                      : TRANSFER_TYPES.ONEWAYTRIP.name,
                  );
                  setFlightResults([]);
                  setTaxiResults([]);
                }}
              />

              {email && email?.includes('tarzanway.com') && (
                <a
                  href={`https://mercury.tarzanway.com/admin/geos/route/search-route/?origin=${props?.origin || originCityId || mercuryTransfer?.source?.city}&destination=${props?.destination || destinationCityId || mercuryTransfer?.destination?.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-sm text-blue font-500"
                >
                + Modify from Backend (Staff)
              </a>)}
            </>
          ) : (
            <>
              <BackArrow
                handleClick={() => {
                  if (currentStep >= 1) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              />
            </>
          )}
        </div>
        {currentStep === 0 && (
          <>
            <div>
              {transferType === TRANSFER_TYPES.ONEWAYTRIP.name ? (
                <div className="text-xl font-600 leading-2xl">
                  {props.addOrEdit === "transferAdd" ? "Adding" : "Changing"}{" "}
                  transfer from {city || mercuryTransfer?.source?.city_name} to{" "}
                  {dcity || mercuryTransfer?.destination?.city_name}{" "}
                </div>
              ) : (
                <div className="text-xl font-600 leading-2xl">
                  Changing Transfer
                </div>
              )}

              <div className="text-text-spacegrey text-sm-xl leading-lg-md mt-xs">
                {" "}
                Explore all available transfer options at a glance and pick what
                suits you best.{" "}
              </div>
            </div>
          </>
        )}

        {(loadingTransfers &&
          transferType === TRANSFER_TYPES.ONEWAYTRIP.name) ||
        (loadingMulticityTransfers &&
          transferType === TRANSFER_TYPES.MULTICITYROUNDTRIP.name) ? (
          <div className="mt-10 w-full flex flex-col gap-3 items-center">
            {["", "", ""].map(() => (
              <>
                <div className="rounded-3xl border-sm border-solid border-text-disabled p-md relative w-full">
                  <div>
                    <div className=" text-white text-sm  leading-lg inline">
                      <SkeletonCard
                        width="40%"
                        height="30px"
                        borderRadius="8px"
                        variant="default"
                      />
                    </div>
                    <div>
                      <div>
                        <div className="text-md-lg font-600 leading-xl-sm mt-sm mb-sm">
                          <SkeletonCard
                            width="70%"
                            height="25px"
                            borderRadius="8px"
                            variant="default"
                          />
                        </div>
                        <div className="flex mt-xs">
                          <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs w-40">
                            <span>
                              {" "}
                              <SkeletonCard
                                width="20px"
                                height="20px"
                                borderRadius="50%"
                                variant="default"
                              />
                            </span>
                            <span>
                              <SkeletonCard
                                width="100px"
                                height="20px"
                                borderRadius="8px"
                                variant="default"
                              />
                            </span>
                          </div>
                          <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs">
                            <span>
                              <SkeletonCard
                                width="20px"
                                height="20px"
                                borderRadius="50%"
                                variant="default"
                              />
                            </span>
                            <span>
                              <SkeletonCard
                                width="100px"
                                height="20px"
                                borderRadius="8px"
                                variant="default"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-lg top-lg">
                        <SkeletonCard
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          variant="default"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : transfersError &&
          roundTripSuggestions === null &&
          multiCitySuggestions === null ? (
          <div className="w-full flex flex-col space-y-5 items-center justify-center">
            <div className="flex items-center justify-center bg-red-500 text-white rounded p-2">
              {transfersError}
            </div>
            <div className="flex">
              <GetInTouchContainer>
                <Button
                  color="#111"
                  fontWeight="500"
                  fontSize="1rem"
                  borderWidth="2px"
                  width="100%"
                  borderRadius="8px"
                  bgColor="#f8e000"
                  padding="12px"
                  onclick={() => {
                    props._GetInTouch();
                    actualClose();
                    setCurrentStep(0);
                    setIsRouteSelected(false);
                  }}
                >
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <ImageLoader
                      dimensions={{ height: 50, width: 50 }}
                      dimensionsMobile={{ height: 50, width: 50 }}
                      height={"20px"}
                      width={"20px"}
                      leftalign
                      url={"media/icons/login/customer-service-black.png"}
                    />
                    <span className="text-nowrap">Get in touch!</span>
                  </div>
                </Button>
              </GetInTouchContainer>
            </div>
          </div>
        ) : (
          <div className="w-100">
            {currentStep === 0 && (
              <>
                <div className="w-full flex flex-col items-center ">
                  <div className="w-full flex flex-row gap-4 whitespace-nowrap overflow-x-auto hide-scrollbar">
                    {booking_type != "multicity" && (
                      <RadioButton
                        name={TRANSFER_TYPES.ONEWAYTRIP.name}
                        label={TRANSFER_TYPES.ONEWAYTRIP.label}
                        transferType={transferType}
                        handleTransferType={handleTransferType}
                      />
                    )}
                    {(booking_type == "multicity" ||
                      roundTripSuggestions ||
                      multiCitySuggestions) && (
                      <RadioButton
                        name="MULTICITYROUNDTRIP"
                        label="Multi-City/Round Trip Taxi"
                        transferType={transferType}
                        handleTransferType={handleTransferType}
                      />
                    )}
                  </div>
                  <hr className="my-lg w-100" />
                </div>
              </>
            )}

            {transferType === TRANSFER_TYPES.ONEWAYTRIP.name ? (
              <>
                <div className="w-full flex flex-col items-center">
                  {currentStep === 0 ? (
                    <>
                      {transfers && transfers.length > 0 && (
                        <div
                          className="rounded-3xl border-sm border-solid border-text-disabled p-md cursor-pointer hover:bg-text-smoothwhite relative w-full"
                          key={0}
                          onClick={() => {
                            setSelectedTransferIndex(0);
                            setCurrentStep(1);
                          }}
                        >
                          <div>
                            <div className="bg-tag-grass text-white rounded-md-lg text-sm font-500 leading-lg px-md py-xs inline">
                              <span> RECOMMENDED </span>
                            </div>

                            <div>
                              <div>
                                <div className="text-md-lg font-600 leading-xl-sm mt-sm">
                                  {transfers[0]?.name}
                                </div>
                                <div className="flex mt-xs">
                                  {Math.ceil(
                                    transfers[0].transfers.reduce(
                                      (sum, t) => sum + (t.duration || 0),
                                      0,
                                    ) / 60,
                                  ) ? (
                                    <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs w-40">
                                      <span> {svgIcons.time} </span>
                                      <span>
                                        {Math.ceil(
                                          transfers[0].transfers.reduce(
                                            (sum, t) => sum + (t.duration || 0),
                                            0,
                                          ) / 60,
                                        )}
                                        &nbsp;Hours
                                      </span>
                                    </div>
                                  ) : null}
                                  {transfers[0].transfers.reduce(
                                    (sum, t) => sum + (t.distance || 0),
                                    0,
                                  ) ? (
                                    <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs">
                                      <span> {svgIcons.location} </span>
                                      <span>
                                        {transfers[0].transfers.reduce(
                                          (sum, t) => sum + (t.distance || 0),
                                          0,
                                        )}
                                        &nbsp;kms
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div className="absolute right-lg top-lg">
                                {svgIcons.right_arrow}{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {transfers && transfers.length > 1 && (
                        <div className="w-full">
                          {transfers.slice(1).map((transfer, idx) => {
                            const index = idx + 1;
                            return (
                              <div
                                key={index}
                                className="rounded-3xl border-sm border-solid border-text-disabled p-md cursor-pointer hover:bg-text-smoothwhite relative mt-md w-full"
                                onClick={() => {
                                  setSelectedTransferIndex(index);
                                  setCurrentStep(1);
                                }}
                              >
                                <div>
                                  <div>
                                    <div className="text-md-lg font-600 leading-xl-sm ">
                                      {transfer?.name}
                                    </div>
                                    <div className="flex mt-xs">
                                      <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs w-40">
                                        <span> {svgIcons.time} </span>
                                        <span>
                                          {Math.ceil(
                                            transfer.transfers.reduce(
                                              (sum, t) =>
                                                sum + (t.duration || 0),
                                              0,
                                            ) / 60,
                                          )}
                                          &nbsp;Hours
                                        </span>
                                      </div>
                                      <div className="flex text-text-spacegrey text-400 text-sm-md items-center gap-xs">
                                        <span> {svgIcons.location} </span>
                                        <span>
                                          {transfer.transfers.reduce(
                                            (sum, t) => sum + (t.distance || 0),
                                            0,
                                          )}
                                          &nbsp;kms
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="absolute right-lg top-lg">
                                    {svgIcons.right_arrow}{" "}
                                  </div>
                                </div>

                                {/* <div>
                                  <span className="font-medium p-1 md:p-2 text-left text-md md:text-lg">
                                    {transfer?.name} {isDesktop ? "|" : ""}
                                  </span>
                                  <span className="text-gray-600 ml-1 text-md md:text-lg">
                                    {isDesktop ? "" : <br />}
                                    {Math.ceil(
                                      transfer.transfers.reduce(
                                        (sum, t) => sum + (t.duration || 0),
                                        0
                                      ) / 60
                                    )}{" "}
                                    hours |{" "}
                                    {transfer.transfers.reduce(
                                      (sum, t) => sum + (t.distance || 0),
                                      0
                                    )}{" "}
                                    kms
                                  </span>
                                </div> */}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    selectedTransferIndex !== null &&
                    (isDesktop ? (
                      transfers[selectedTransferIndex]?.transfers?.length >
                      1 ? (
                        <NewMultiModeContainer
                          useHandleClose={actualClose}
                          key={selectedTransferIndex}
                          booking_id={booking_id}
                          name={transfers[selectedTransferIndex]?.name}
                          transferIndex={selectedTransferIndex}
                          transfer={transfers[selectedTransferIndex]?.transfers}
                          handleSelect={handleSelect}
                          selectedResult={selectedResult}
                          setCurrentStep={setCurrentStep}
                          currentStep={currentStep}
                          handleFlightSelect={handleSelectResult}
                          showComboFlightModal={showComboFlightModal}
                          setShowComboFlightModal={setShowComboFlightModal}
                          setHideFlightModal={() =>
                            setShowComboFlightModal(false)
                          }
                          setHideBookingModal={() =>
                            setShowComboFlightModal(false)
                          }
                          showTaxiModal={showComboTaxiModal}
                          setShowComboTaxiModal={setShowComboTaxiModal}
                          setHideTaxiModal={() => setShowComboTaxiModal(false)}
                          getPaymentHandler={props.getPaymentHandler}
                          _updatePaymentHandler={props._updatePaymentHandler}
                          _updateFlightBookingHandler={
                            _updateFlightBookingHandler
                          }
                          _updateBookingHandler={props._updateBookingHandler}
                          alternates={selectedBooking?.id}
                          tailored_id={selectedBooking?.tailored_itinerary}
                          selectedBooking={selectedBooking}
                          itinerary_id={ItineraryId}
                          setShowLoginModal={setShowLoginModal}
                          check_in={check_in}
                          _GetInTouch={props._GetInTouch}
                          daySlabIndex={day_slab_index}
                          routeId={routeId}
                          mercuryTransfer={selectedMercuryTransfer}
                          mercury={mercuryTransfer}
                          individual={props?.individual}
                          originCityId={props?.originCityId}
                          destinationCityId={props?.destinationCityId}
                          token={props?.token}
                          origin_itinerary_city_id={origin_itinerary_city_id}
                          destination_itinerary_city_id={
                            destination_itinerary_city_id
                          }
                          dCityData={dCityData}
                          oCityData={oCityData}
                          openNotification={openNotification}
                          showDrawer={showDrawer}
                          origin={origin}
                          destination={destination}
                          city={city}
                          dcity={dcity}
                          currentModeDepartureDate={currentModeDepartureDate}
                          setCurrentModeDepartureDate={
                            setCurrentModeDepartureDate
                          }
                          currentModeDepartureTime={currentModeDepartureTime}
                          setCurrentModeDepartureTime={
                            setCurrentModeDepartureTime
                          }
                          skipTaxiFetch={skipTaxiFetch}
                          skipFlightFetch={skipFlightFetch}
                          setSkipFlightFetch={setSkipFlightFetch}
                          setSkipTaxiFetch={setSkipTaxiFetch}
                          flightResults={flightResults}
                          taxiResults={taxiResults}
                          setFlightResults={setFlightResults}
                          setTaxiResults={setTaxiResults}
                        />
                      ) : (
                        <RouteContainer
                          useHandleClose={actualClose}
                          setSelectedMercuryTransfer={
                            setSelectedMercuryTransfer
                          }
                          key={selectedTransferIndex}
                          booking_id={booking_id}
                          name={transfers[selectedTransferIndex]?.name}
                          transferIndex={selectedTransferIndex}
                          transfer={transfers[selectedTransferIndex]?.transfers}
                          handleSelect={handleSelect}
                          selectedResult={selectedResult}
                          setSelectedResult={setSelectedResult}
                          setCurrentStep={setCurrentStep}
                          currentStep={currentStep}
                          handleFlightSelect={handleSelectResult}
                          showComboFlightModal={showComboFlightModal}
                          setShowComboFlightModal={setShowComboFlightModal}
                          setHideFlightModal={() =>
                            setShowComboFlightModal(false)
                          }
                          hideDrawer={() => {
                            actualClose();
                            setCurrentStep(0);
                            setIsRouteSelected(false);
                            setShowOtherTrasfer(false);
                            setSelectedTransferIndex(null); // Reset selected transfer
                          }}
                          setHideBookingModal={() =>
                            setShowComboFlightModal(false)
                          }
                          showTaxiModal={showComboTaxiModal}
                          setShowComboTaxiModal={setShowComboTaxiModal}
                          setHideTaxiModal={() => setShowComboTaxiModal(false)}
                          getPaymentHandler={props.getPaymentHandler}
                          _updatePaymentHandler={props._updatePaymentHandler}
                          _updateFlightBookingHandler={
                            _updateFlightBookingHandler
                          }
                          _updateTaxiBookingHandler={
                            props._updateTaxiBookingHandler
                          }
                          _updateBookingHandler={props._updateBookingHandler}
                          alternates={selectedBooking?.id}
                          tailored_id={selectedBooking?.tailored_itinerary}
                          selectedBooking={selectedBooking}
                          itinerary_id={ItineraryId}
                          setShowLoginModal={setShowLoginModal}
                          check_in={check_in}
                          _GetInTouch={props._GetInTouch}
                          daySlabIndex={day_slab_index}
                          routeId={routeId}
                          mercuryTransfer={selectedMercuryTransfer}
                          individual={props?.individual}
                          originCityId={props?.originCityId}
                          destinationCityId={props?.destinationCityId}
                          token={props?.token}
                          origin_itinerary_city_id={origin_itinerary_city_id}
                          destination_itinerary_city_id={
                            destination_itinerary_city_id
                          }
                          dCityData={dCityData}
                          oCityData={oCityData}
                          openNotification={openNotification}
                          showDrawer={showDrawer}
                          origin={origin}
                          destination={destination}
                          currentModeDepartureDate={currentModeDepartureDate}
                          setCurrentModeDepartureDate={
                            setCurrentModeDepartureDate
                          }
                          currentModeDepartureTime={currentModeDepartureTime}
                          setCurrentModeDepartureTime={
                            setCurrentModeDepartureTime
                          }
                          showOtherTrasfer={showOtherTransfer}
                          setShowOtherTrasfer={setShowOtherTrasfer}
                        />
                      )
                    ) : // Mobile view logic
                    transfers[selectedTransferIndex]?.transfers?.length > 1 ? (
                      <NewMultiModeContainer
                        useHandleClose={actualClose}
                        key={selectedTransferIndex}
                        booking_id={booking_id}
                        name={transfers[selectedTransferIndex]?.name}
                        transferIndex={selectedTransferIndex}
                        transfer={transfers[selectedTransferIndex]?.transfers}
                        handleSelect={handleSelect}
                        selectedResult={selectedResult}
                        setCurrentStep={setCurrentStep}
                        currentStep={currentStep}
                        handleFlightSelect={handleSelectResult}
                        showComboFlightModal={showComboFlightModal}
                        setShowComboFlightModal={setShowComboFlightModal}
                        setHideFlightModal={() =>
                          setShowComboFlightModal(false)
                        }
                        setHideBookingModal={() =>
                          setShowComboFlightModal(false)
                        }
                        showTaxiModal={showComboTaxiModal}
                        setShowComboTaxiModal={setShowComboTaxiModal}
                        setHideTaxiModal={() => setShowComboTaxiModal(false)}
                        getPaymentHandler={props.getPaymentHandler}
                        _updatePaymentHandler={props._updatePaymentHandler}
                        _updateFlightBookingHandler={
                          _updateFlightBookingHandler
                        }
                        _updateBookingHandler={props._updateBookingHandler}
                        alternates={selectedBooking?.id}
                        tailored_id={selectedBooking?.tailored_itinerary}
                        selectedBooking={selectedBooking}
                        itinerary_id={ItineraryId}
                        setShowLoginModal={setShowLoginModal}
                        check_in={check_in}
                        _GetInTouch={props._GetInTouch}
                        daySlabIndex={day_slab_index}
                        routeId={routeId}
                        mercuryTransfer={selectedMercuryTransfer}
                        mercury={mercuryTransfer}
                        individual={props?.individual}
                        originCityId={props?.originCityId}
                        destinationCityId={props?.destinationCityId}
                        token={props?.token}
                        origin_itinerary_city_id={origin_itinerary_city_id}
                        destination_itinerary_city_id={
                          destination_itinerary_city_id
                        }
                        dCityData={dCityData}
                        oCityData={oCityData}
                        openNotification={openNotification}
                        showDrawer={showDrawer}
                        origin={origin}
                        destination={destination}
                        city={city}
                        dcity={dcity}
                        currentModeDepartureDate={currentModeDepartureDate}
                        setCurrentModeDepartureDate={
                          setCurrentModeDepartureDate
                        }
                        currentModeDepartureTime={currentModeDepartureTime}
                        setCurrentModeDepartureTime={
                          setCurrentModeDepartureTime
                        }
                        skipTaxiFetch={skipTaxiFetch}
                        skipFlightFetch={skipFlightFetch}
                        setSkipFlightFetch={setSkipFlightFetch}
                        setSkipTaxiFetch={setSkipTaxiFetch}
                        flightResults={flightResults}
                        taxiResults={taxiResults}
                        setFlightResults={setFlightResults}
                        setTaxiResults={setTaxiResults}
                      />
                    ) : (
                      <RouteContainer
                        useHandleClose={actualClose}
                        setSelectedMercuryTransfer={setSelectedMercuryTransfer}
                        booking_id={booking_id}
                        key={selectedTransferIndex}
                        name={transfers[selectedTransferIndex]?.name}
                        transferIndex={selectedTransferIndex}
                        transfer={transfers[selectedTransferIndex]?.transfers}
                        handleSelect={handleSelect}
                        selectedResult={selectedResult}
                        setSelectedResult={setSelectedResult}
                        setCurrentStep={setCurrentStep}
                        currentStep={currentStep}
                        handleFlightSelect={handleSelectResult}
                        showComboFlightModal={showComboFlightModal}
                        setShowComboFlightModal={setShowComboFlightModal}
                        setHideFlightModal={() =>
                          setShowComboFlightModal(false)
                        }
                        hideDrawer={() => {
                          actualClose();
                          setCurrentStep(0);
                          setIsRouteSelected(false);
                          setShowOtherTrasfer(false);
                          setSelectedTransferIndex(null); // Reset selected transfer
                        }}
                        setHideBookingModal={() =>
                          setShowComboFlightModal(false)
                        }
                        showTaxiModal={showComboTaxiModal}
                        setShowComboTaxiModal={setShowComboTaxiModal}
                        setHideTaxiModal={() => setShowComboTaxiModal(false)}
                        getPaymentHandler={props.getPaymentHandler}
                        _updatePaymentHandler={props._updatePaymentHandler}
                        _updateFlightBookingHandler={
                          _updateFlightBookingHandler
                        }
                        _updateTaxiBookingHandler={
                          props._updateTaxiBookingHandler
                        }
                        _updateBookingHandler={props._updateBookingHandler}
                        alternates={selectedBooking?.id}
                        tailored_id={selectedBooking?.tailored_itinerary}
                        selectedBooking={selectedBooking}
                        itinerary_id={ItineraryId}
                        setShowLoginModal={setShowLoginModal}
                        check_in={check_in}
                        _GetInTouch={props._GetInTouch}
                        daySlabIndex={day_slab_index}
                        routeId={routeId}
                        mercuryTransfer={selectedMercuryTransfer}
                        individual={props?.individual}
                        originCityId={props?.originCityId}
                        destinationCityId={props?.destinationCityId}
                        token={props?.token}
                        origin_itinerary_city_id={origin_itinerary_city_id}
                        destination_itinerary_city_id={
                          destination_itinerary_city_id
                        }
                        dCityData={dCityData}
                        oCityData={oCityData}
                        openNotification={openNotification}
                        showDrawer={showDrawer}
                        origin={origin}
                        destination={destination}
                        currentModeDepartureDate={currentModeDepartureDate}
                        setCurrentModeDepartureDate={
                          setCurrentModeDepartureDate
                        }
                        currentModeDepartureTime={currentModeDepartureTime}
                        setCurrentModeDepartureTime={
                          setCurrentModeDepartureTime
                        }
                        showOtherTrasfer={showOtherTransfer}
                        setShowOtherTrasfer={setShowOtherTrasfer}
                      />
                    ))
                  )}
                </div>
              </>
            ) : transferType === "MULTICITYROUNDTRIP" ? (
              <div className="w-full flex flex-col items-center gap-4">
                {roundTripSuggestions && (
                  <div className="w-full">
                    {/* <h3 className="text-lg font-semibold mb-3">Round Trip</h3> */}
                    <RoundTripSuggestion
                      handleRoundTripSelect={handleMultiCitySelect}
                      roundTripSuggestions={roundTripSuggestions}
                      selectedCab={selectedCab}
                      setSelectedCab={setSelectedCab}
                      selectedTripType={selectedTripType}
                      setSelectedTripType={setSelectedTripType}
                    />
                  </div>
                )}

                {multiCitySuggestions && (
                  <div className="w-full">
                    {/* <h3 className="text-lg font-semibold mb-3"></h3> */}

                    <MultiCityTripSuggestion
                      handleRoundTripSelect={handleMultiCitySelect}
                      multiCitySuggestions={multiCitySuggestions}
                      selectedCab={selectedCab}
                      setSelectedCab={setSelectedCab}
                      selectedTripType={selectedTripType}
                      setSelectedTripType={setSelectedTripType}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {transferType === "MULTICITYROUNDTRIP" &&
          (roundTripSuggestions || multiCitySuggestions) && (
            <div className="w-full  bg-white border-t border-gray-200 z-10 md:relative md:border-0 md:bg-transparent">
              <div className="flex justify-end items-end px-1 py-3 md:p-0">
                <button
                  onClick={() => {
                    const tripTypeIndex =
                      selectedTripType === "roundtrip" ? 1 : 0;
                    handleMultiCitySelect(
                      multicityRoundtripTraceId,
                      tripTypeIndex,
                      selectedCab?.result_index,
                    );
                  }}
                  className={`
            px-3 py-2 rounded-lg font-semibold text-base
            transition-all duration-200 ease-in-out
            flex items-center justify-center
            
            ${
              !selectedCab || updatingTransfer
                ? "bg-[#f8e000] text-gray-500 cursor-not-allowed"
                : "bg-[#f8e000] text-black border-1 border-black hover:bg-yellow-400 active:transform active:scale-95 cursor-pointer"
            }
          `}
                  disabled={!selectedCab || updatingTransfer}
                >
                  {updatingTransfer ? (
                    <div className="flex items-end gap-2">
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Transfer"
                  )}
                </button>
              </div>
            </div>
          )}
      </div>

      <FlightModal
        handleFlightSelect={handleSelectResult}
        showFlightModal={showFlightModal}
        setShowFlightModal={setShowFlightModal}
        setHideFlightModal={() => setShowFlightModal(false)}
        setHideBookingModal={() => setShowFlightModal(false)}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        alternates={selectedBooking?.id}
        tailored_id={selectedBooking?.tailored_itinerary}
        // _updateFlightHandler={props._updateFlightHandler}
        selectedBooking={selectedBooking}
        itinerary_id={ItineraryId}
        setShowLoginModal={setShowLoginModal}
        check_in={check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={day_slab_index}
        routeId={routeId}
        mercuryTransfer={selectedMercuryTransfer}
        individual={props?.individual}
        originCityId={props?.originCityId}
        destinationCityId={props?.destinationCityId}
      ></FlightModal>

      <TaxiModal
        handleTaxiSelect={handleSelectResult}
        showTaxiModal={showTaxiModal}
        setHideBookingModal={() => setShowTaxiModal(false)}
        setHideTaxiModal={() => setShowTaxiModal(false)}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        selectedBooking={selectedBooking}
        itinerary_id={ItineraryId}
        setShowLoginModal={setShowLoginModal}
        check_in={check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={day_slab_index}
        routeId={routeId}
        oCityData={oCityData}
        dCityData={dCityData}
        mercury={mercury}
        origin={
          selectedBooking?.origin?.shortName ||
          oCityData?.gmaps_place_id ||
          oCityData?.city?.id
        }
        destination={
          selectedBooking?.destination?.shortName ||
          dCityData?.gmaps_place_id ||
          dCityData?.city?.id
        }
      ></TaxiModal>
      {/* {!isDesktop && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={() => {
              actualClose();
              setCurrentStep(0);
              setSkipFlightFetch(false);
              setSkipTaxiFetch(false);
              setIsRouteSelected(false);
              setFlightResults([]);
              setTaxiResults([]);
            }}
          />
        </FloatingView>
      )} */}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    token: state.auth.token,
    ItineraryId: state.ItineraryId,
    plan: state.Plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(TransferEditDrawer);

const RouteContainer = (props) => {
  const {
    transferIndex,
    transfer,
    handleSelect,
    selectedResult,
    setSelectedResult,
    setCurrentStep,
    currentStep,
    handleFlightSelect,
    showComboFlightModal,
    setShowComboFlightModal,
    setHideFlightModal,
    setHideBookingModal,
    showTaxiModal,
    setHideTaxiModal,
    setShowComboTaxiModal,
    getPaymentHandler,
    _updatePaymentHandler,
    _updateFlightBookingHandler,
    _updateBookingHandler,
    alternates,
    tailored_id,
    selectedBooking,
    itinerary_id,
    setShowLoginModal,
    check_in,
    _GetInTouch,
    daySlabIndex,
    elementIndex,
    routeId,
    mercuryTransfer,
    individual,
    originCityId,
    destinationCityId,
    token,
    destination_itinerary_city_id,
    origin_itinerary_city_id,
    dCityData,
    oCityData,
    openNotification,
    setSelectedMercuryTransfer,
    setIsRouteSelected,
    isRouteSelected,
    currentModeDepartureDate,
    setCurrentModeDepartureDate,
    setCurrentModeDepartureTime,
    currentModeDepartureTime,
    showOtherTrasfer,
    setShowOtherTrasfer,
    name,
    _updateTaxiBookingHandler,
    hideDrawer,
    booking_id,
  } = props;

  const actualClose = useHandleClose();
  const [viewMore, setViewMore] = useState(false);
  const [singleTransfer, setSingleTransfer] = useState(transfer[0]);
  const [comboStartDate, setComboStartDate] = useState(null);
  const [comboStartTime, setComboStartTime] = useState(null);
  const [flightResults, setFlightResults] = useState([]);
  const [taxiResults, setTaxiResults] = useState([]);
  const {
    number_of_adults,
    number_of_children,
    number_of_infants,
    start_date,
  } = useSelector((state) => state.Itinerary);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (props.show) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props.show]);

  useEffect(() => {
    if (currentStep < 1 || currentStep > transfer.length) return;
    setShowComboFlightModal(false);
    setShowComboTaxiModal(false);
    setShowOtherTrasfer(false);

    const currentTransfer = transfer[currentStep - 1];

    const baseStartDate =
      oCityData?.start_date && oCityData?.duration != null
        ? addDaysToDate(oCityData.start_date, oCityData.duration)
        : oCityData?.id
          ? oCityData?.start_date
          : start_date;

    let calculatedStartTime;

    if (currentStep === 1) {
      calculatedStartTime = dayjs(`${baseStartDate} 00:00`);
    } else {
      const prevSelected = selectedData[currentStep - 2];
      const prevArrivalTime = prevSelected?.arrival_time;

      if (prevArrivalTime) {
        let arrivalMoment = dayjs(prevArrivalTime);
        calculatedStartTime = arrivalMoment.add(1, "hour");
        const updatedStartDate = calculatedStartTime.format("YYYY-MM-DD");
        setComboStartDate(updatedStartDate);
      } else {
        calculatedStartTime = dayjs(`${baseStartDate} 00:00`);
      }
    }
    setCurrentModeDepartureDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartTime(calculatedStartTime.format("HH:mm"));
    setCurrentModeDepartureTime(calculatedStartTime.format("HH:mm"));

    if (["Flight", "Taxi"].includes(currentTransfer.mode)) {
      handleSelect(currentStep - 1, currentTransfer, "", currentTransfer.mode);

      if (currentTransfer.mode === "Flight") {
        setShowComboFlightModal(true);
      }

      if (currentTransfer.mode === "Taxi") {
        setShowComboTaxiModal(true);
      }
    } else {
      handleSelect(currentStep - 1, currentTransfer, "", currentTransfer.mode);
      setShowOtherTrasfer(true);
    }
  }, [currentStep, transfer]);

  const totalDistance = transfer.reduce((sum, t) => sum + (t.distance || 0), 0);

  return (
    <>
      <div
        className={` ${
          transfer?.length > 1
            ? `w-full flex flex-col gap-0 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
                transferIndex === 0 && transfer[0]?.isSelected
                  ? "border-yellow-300"
                  : ""
              } border-x-2 border-t-2 border-b-4`
            : "w-full"
        }`}
      >
        {transfer[0]?.recommended && (
          <ClippathComp className="text-sm font-semibold bg-[#F7E700] text-#090909 pl-2 pr-2 py-1 -ml-4 -mt-4 rounded-tl-2xl">
            Recommended
          </ClippathComp>
        )}

        {selectedResult &&
          selectedResult.trace_id &&
          selectedResult.transferIndex === transferIndex && (
            <div className="text-sm text-green-900 pb-1">
              {selectedResult.mode} Selected
            </div>
          )}

        {transfer.length > 1 ? (
          viewMore ? (
            <div className="w-full flex flex-col items-center justify-center">
              <MultiModeContainer
                transferIndex={transferIndex}
                transfer={transfer}
                handleSelect={handleSelect}
              />
              <ViewMoreButton
                viewMore={viewMore}
                handleViewMore={handleViewMore}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <MultiRoute
                transferIndex={transferIndex}
                transfer={singleTransfer}
                handleSelect={handleSelect}
                setViewMore={setViewMore}
              />
              <ViewMoreButton
                viewMore={viewMore}
                handleViewMore={handleViewMore}
              />
            </div>
          )
        ) : (
          //  need to add header
          <>
            {currentStep === 1 ? (
              singleTransfer?.mode === "Flight" ? (
                <ComboFlight
                  combo={false}
                  edge={singleTransfer?.id}
                  booking_id={booking_id}
                  transferData={singleTransfer}
                  handleFlightSelect={handleFlightSelect}
                  showComboFlightModal={showComboFlightModal}
                  setShowComboFlightModal={setShowComboFlightModal}
                  setHideFlightModal={hideDrawer}
                  setHideBookingModal={setHideBookingModal}
                  getPaymentHandler={getPaymentHandler}
                  _updatePaymentHandler={_updatePaymentHandler}
                  _updateFlightBookingHandler={_updateFlightBookingHandler}
                  _updateBookingHandler={_updateBookingHandler}
                  alternates={alternates}
                  tailored_id={tailored_id}
                  selectedBooking={selectedBooking}
                  itinerary_id={itinerary_id}
                  setShowLoginModal={setShowLoginModal}
                  check_in={check_in}
                  _GetInTouch={_GetInTouch}
                  daySlabIndex={daySlabIndex}
                  elementIndex={elementIndex}
                  routeId={routeId}
                  mercuryTransfer={mercuryTransfer}
                  individual={individual}
                  originCityId={originCityId}
                  destinationCityId={destinationCityId}
                  isSingleTransfer={true}
                  comboStartDate={currentModeDepartureDate}
                  comboStartTime={currentModeDepartureTime}
                  source_code={singleTransfer?.source?.code}
                  destination_code={singleTransfer?.destination?.code}
                  source_itinerary_city_id={origin_itinerary_city_id}
                  destination_itinerary_city_id={destination_itinerary_city_id}
                  dCityData={dCityData}
                  oCityData={oCityData}
                  flightResults={flightResults}
                  setFlightResults={setFlightResults}
                  skipFetch={false}
                  heading={name}
                />
              ) : singleTransfer?.mode === "Taxi" ? (
                <ComboTaxi
                  handleFlightSelect={handleFlightSelect}
                  booking_id={booking_id}
                  showTaxiModal={showTaxiModal}
                  setShowComboTaxiModal={setShowComboTaxiModal}
                  setHideTaxiModal={hideDrawer}
                  setHideBookingModal={setHideBookingModal}
                  getPaymentHandler={getPaymentHandler}
                  _updatePaymentHandler={_updatePaymentHandler}
                  _updateFlightBookingHandler={_updateFlightBookingHandler}
                  _updateBookingHandler={_updateBookingHandler}
                  alternates={alternates}
                  tailored_id={tailored_id}
                  selectedBooking={selectedBooking}
                  itinerary_id={itinerary_id}
                  edge={singleTransfer?.id}
                  setShowLoginModal={setShowLoginModal}
                  check_in={check_in}
                  _GetInTouch={_GetInTouch}
                  daySlabIndex={daySlabIndex}
                  elementIndex={elementIndex}
                  routeId={routeId}
                  mercuryTransfer={mercuryTransfer}
                  individual={individual}
                  originCityId={
                    oCityData?.city?.id || oCityData?.gmaps_place_id
                  }
                  destinationCityId={
                    dCityData?.city?.id || dCityData?.gmaps_place_id
                  }
                  sourceRouteCityId={singleTransfer?.source?.city}
                  destinationRouteCityId={singleTransfer?.destination?.city}
                  sourceHubId={singleTransfer?.source?.id}
                  destinationHubId={singleTransfer?.destination?.id}
                  comboStartDate={currentModeDepartureDate}
                  comboStartTime={currentModeDepartureTime}
                  _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                  origin_itinerary_city_id={origin_itinerary_city_id}
                  destination_itinerary_city_id={destination_itinerary_city_id}
                  dCityData={dCityData}
                  oCityData={oCityData}
                  taxiResults={taxiResults}
                  setTaxiResults={setTaxiResults}
                  skipTaxiResults={false}
                  heading={name}
                />
              ) : (
                <OtherTransfer
                  showOtherTransfer={showOtherTrasfer}
                  booking_id={booking_id}
                  setShowOtherTrasfer={setShowOtherTrasfer}
                  selectedResult={selectedResult}
                  selectedBooking={selectedBooking}
                  setSelectedResult={setSelectedResult}
                  mercuryTransfer={mercuryTransfer}
                  transfer={transfer}
                  number_of_travellers={
                    number_of_adults + number_of_children + number_of_infants
                  }
                  name={name}
                  mode={singleTransfer?.mode}
                  check_in={check_in}
                  currentStep={currentStep}
                  currentModeDepartureDate={currentModeDepartureDate}
                  currentModeDepartureTime={currentModeDepartureTime}
                  oCityData={oCityData}
                  dCityData={dCityData}
                  origin_itinerary_city_id={origin_itinerary_city_id}
                  destination_itinerary_city_id={destination_itinerary_city_id}
                  handleSelect={handleSelect}
                  hideDrawer={hideDrawer}
                  getPaymentHandler={getPaymentHandler}
                />
              )
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
};

const MultiRoute = (props) => {
  const { transferIndex, transfer, handleSelect, setViewMore } = props;

  return (
    <div className="flex flex-row gap-2 w-full">
      <div
        className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
      >
        <TransfersIcon
          TransportMode={transfer.mode}
          Instyle={{
            fontSize: transfer.modea === "Bus" ? "2.5rem" : "3rem",
            color: "black",
          }}
          classname={{ width: 80, height: 75 }}
        />
      </div>

      <div className="w-full flex flex-col gap-2 justify-center">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-start gap-2">
            <TransferItem transfer={transfer} />

            <button
              onClick={() => setViewMore((prev) => !prev)}
              className="w-fit h-fit text-blue -mt-[0.5rem]"
            >
              +1 more
            </button>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <EstimatedCost cost={transfer?.prices[0]?.price} />
            <SelectButton
              multimode
              transfer={transfer}
              transferIndex={transferIndex}
              handleSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getModeIcon = (mode, size = 20) => {
  switch (mode.toLowerCase()) {
    case "train":
      return <BiTrain color="#fff" size={size} />;
    case "taxi":
      return <MdLocalTaxi color="#fff" size={size} />;
    case "flight":
      return <FaPlaneDeparture size={size} />;
    case "bus":
      return <MdDirectionsBus color="#fff" size={size} />;
    case "ferry":
      return <MdDirectionsBoat color="#fff" size={size} />;
    default:
      return <MdDirectionsTransit size={size} />;
  }
};

const NewMultiModeContainer = ({
  transferIndex,
  name,
  city,
  dcity,
  mercury,
  transfer,
  handleSelect,
  selectedResult,
  setCurrentStep,
  currentStep,
  handleFlightSelect,
  showComboFlightModal,
  setShowComboFlightModal,
  setHideFlightModal,
  setHideBookingModal,
  showTaxiModal,
  setHideTaxiModal,
  setShowComboTaxiModal,
  getPaymentHandler,
  _updatePaymentHandler,
  _updateFlightBookingHandler,
  _updateBookingHandler,
  alternates,
  tailored_id,
  selectedBooking,
  itinerary_id,
  setShowLoginModal,
  check_in,
  _GetInTouch,
  daySlabIndex,
  elementIndex,
  routeId,
  mercuryTransfer,
  individual,
  originCityId,
  destinationCityId,
  token,
  destination_itinerary_city_id,
  origin_itinerary_city_id,
  dCityData,
  oCityData,
  openNotification,
  origin,
  destination,
  currentModeDepartureDate,
  setCurrentModeDepartureDate,
  currentModeDepartureTime,
  setCurrentModeDepartureTime,
  skipTaxiFetch,
  skipFlightFetch,
  setSkipFlightFetch,
  setSkipTaxiFetch,
  flightResults,
  taxiResults,
  setFlightResults,
  setTaxiResults,
  booking_id,
}) => {
  const actualClose = useHandleClose();
  let isPageWide = media("(min-width: 768px)");
  const [expanded, setExpanded] = useState(false);
  const [selectedModeIds, setSelectedModeIds] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [comboStartTime, setComboStartTime] = useState(null);
  const [comboStartDate, setComboStartDate] = useState(null);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [transferResults, setTransferResults] = useState([]);

  const [dynamicTransferData, setDynamicTransferData] = useState({});
  const [loadingTransfers, setLoadingTransfers] = useState({});
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [transferErrors, setTransferErrors] = useState({});

  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [isProcessingWarning, setIsProcessingWarning] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const { trackTransferBookingAdd } = useAnalytics();
  const { intercity } = useSelector(
    (state) => state.TransferBookings,
  )?.transferBookings;

  const {
    number_of_adults,
    number_of_children,
    number_of_infants,
    start_date,
  } = useSelector((state) => state.Itinerary);
  const [pax, setPax] = useState({
    adults: number_of_adults,
    children: number_of_children || 0,
    infants: number_of_infants || 0,
  });
  const [showPax, setShowPax] = useState(false);

  const [expandedTransfersMulti, setExpandedTransfersMulti] = useState({});

const toggleTransferDetailsMulti = (priceOptionId) => {
  setExpandedTransfersMulti(prev => ({
    ...prev,
    [priceOptionId]: !prev[priceOptionId]
  }));
};

  const sequencedModes = transfer.map((t) => t.mode);

  const totalDistance = transfer.reduce((sum, t) => sum + (t.distance || 0), 0);
  const getCurrentMode = () => {
    return currentStep > 0 && currentStep <= sequencedModes.length
      ? sequencedModes[currentStep - 1]
      : "";
  };

  const propagateTimeChanges = (startIndex) => {
    setSelectedData((prev) => {
      const newData = [...prev];

      for (let i = startIndex; i < transfer.length; i++) {
        if (newData[i - 1] && newData[i]) {
          // Get the previous step's arrival time
          const prevArrivalTime = newData[i - 1].arrival_time;

          if (prevArrivalTime) {
            let arrivalMoment = dayjs(prevArrivalTime);
            let newDepartureTime = arrivalMoment.add(1, "hour");

            const newDepartureDate = newDepartureTime.format("YYYY-MM-DD");
            const newDepartureTimeStr = newDepartureTime.format("HH:mm");

            // Set the new departure time for the current step
            newData[i] = {
              ...newData[i],
              departure_time: `${newDepartureDate}T${newDepartureTimeStr}`,
            };

            // If this is a non-Flight/non-Taxi mode, calculate its arrival time
            if (newData[i].mode !== "Flight" && newData[i].mode !== "Taxi") {
              const newDepartureDateTime = dayjs(
                `${newDepartureDate}T${newDepartureTimeStr}`,
              );
              const newArrivalDateTime = newDepartureDateTime.add(
                newData[i].duration || 0,
                "minute",
              );
              newData[i].arrival_time =
                newArrivalDateTime.format("YYYY-MM-DDTHH:mm");
            }
          }
        }
      }

      return newData;
    });
  };

  const getCurrentTransferData = (option) => {
    const transferKey = `${option.id}-${currentStep}`;
    return dynamicTransferData[transferKey] || option;
  };

  const getCurrentTransfer = () => {
    return currentStep > 0 && currentStep <= transfer.length
      ? [transfer[currentStep - 1]]
      : [];
  };

  const isCurrentModeSelected = () => {
    return selectedModeIds[currentStep - 1] !== undefined;
  };

  const totalSteps = transfer.length;

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const handleNextStep = () => {
  const currentTransfer = transfer[currentStep - 1];
  if (currentTransfer.mode === "Flight") {
    setShowComboFlightModal(false);
  } else if (currentTransfer.mode === "Taxi") {
    setShowComboTaxiModal(false);
  }

  // Set up time for the next step based on current step's arrival time
  const currentSelectedData = selectedData[currentStep - 1];

  if (currentSelectedData && currentStep < transfer.length) {
    let arrivalTime = null;

    // FIXED: Check for Flight bookings FIRST - get arrival time from last segment
    if (currentSelectedData.segments && currentSelectedData.segments.length > 0) {
      const lastSegment = currentSelectedData.segments[currentSelectedData.segments.length - 1];
      arrivalTime = lastSegment.destination.arrival_time;
    }
    // For other transfers (Train, Bus, Ferry, etc.) with Omio results
    else if (currentSelectedData.selectedOmioResult) {
      arrivalTime = currentSelectedData.selectedOmioResult.arrival_datetime;
    }
    // For other transfers with regular arrival_time
    else if (currentSelectedData.arrival_time) {
      arrivalTime = currentSelectedData.arrival_time;
    }
    // For Taxi bookings with arrivalTime field
    else if (currentSelectedData.arrivalTime) {
      arrivalTime = currentSelectedData.arrivalTime;
    }

    if (arrivalTime) {
      let arrivalMoment = dayjs(arrivalTime);
      let nextDepartureTime = arrivalMoment.add(1, "hour");

      const newDepartureDate = nextDepartureTime.format("YYYY-MM-DD");
      const newDepartureTimeStr = nextDepartureTime.format("HH:mm");

      setCurrentModeDepartureDate(newDepartureDate);
      setCurrentModeDepartureTime(newDepartureTimeStr);
      setComboStartDate(newDepartureDate);
      setComboStartTime(newDepartureTimeStr);
    } 
  }

  setCurrentStep(currentStep + 1);
};

  const handleBackButton = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
      return;
    }

    const currentTransfer = transfer[currentStep - 2];
    if (currentTransfer.mode === "Flight") {
      // setSkipFlightFetch(true);
      setShowComboFlightModal(true);
    } else if (currentTransfer.mode === "Taxi") {
      // setSkipTaxiFetch(true);
      setShowComboTaxiModal(true);
    }

    const prevStepData = selectedData[currentStep - 2];

    if (prevStepData && prevStepData.departure_time) {
      const departureDateTime = dayjs(prevStepData.departure_time);
      const departureDate = departureDateTime.format("YYYY-MM-DD");
      const departureTime = departureDateTime.format("HH:mm");

      setCurrentModeDepartureDate(departureDate);
      setCurrentModeDepartureTime(departureTime);
      setComboStartDate(departureDate);
      setComboStartTime(departureTime);
    }

    setSelectedModeIds((prev) => {
      const newSelections = { ...prev };
      for (let i = currentStep - 1; i < totalSteps; i++) {
        delete newSelections[i];
      }
      return newSelections;
    });

    setSelectedData((prev) => {
      const newData = [...prev];
      for (let i = currentStep - 1; i < totalSteps; i++) {
        newData[i] = undefined;
      }
      return newData;
    });

    setCurrentStep(currentStep - 1);
  };

  const handleFilterApplied = () => {
    setHasAppliedFilters(true);
    // setSkipFlightFetch(false);
    setSkipTaxiFetch(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourFormatted = hour.toString().padStart(2, "0");
        const minuteFormatted = minute.toString().padStart(2, "0");
        const time = `${hourFormatted}:${minuteFormatted}`;

        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour}:${minuteFormatted} ${period}`;

        options.push({ value: time, display: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  console.log("selectedModeIds:", selectedModeIds,selectedData);

  const handleModeSelect = (index, id, searchData = null, mode = null) => {
    const isDeselecting = selectedModeIds[index] === id;



    if (isDeselecting) {
      setSelectedModeIds((prev) => {
        const newSelections = { ...prev };
        delete newSelections[index];
        return newSelections;
      });

      setSelectedData((prev) => {
        const newData = [...prev];
        newData[index] = undefined;
        return newData;
      });
    } else {
      setSelectedModeIds((prev) => ({
        ...prev,
        [index]: id,
      }));

      if (searchData) {

        if (mode === "Flight" && searchData.segments && searchData.segments.length > 0) {
        const lastSegment = searchData.segments[searchData.segments.length - 1];
        searchData.arrival_time = lastSegment.destination.arrival_time;
        console.log("Storing flight arrival time:", searchData.arrival_time);
      }

        if (mode !== "Flight" && mode !== "Taxi") {
          // For Omio results
          if (searchData.selectedOmioResult) {
            searchData.departure_time =
              searchData.selectedOmioResult.departure_datetime;
            searchData.arrival_time =
              searchData.selectedOmioResult.arrival_datetime;
          }
          // For regular other transfer results
          else {
            const departureDateTime = dayjs(
              `${currentModeDepartureDate}T${currentModeDepartureTime}`,
            );
            const arrivalDateTime = departureDateTime.add(
              searchData.duration || 0,
              "minute",
            );

            searchData.departure_time = `${currentModeDepartureDate}T${currentModeDepartureTime}`;
            searchData.arrival_time =
              arrivalDateTime.format("YYYY-MM-DDTHH:mm");
          }
        }

        setSelectedData((prev) => {
          const newData = [...prev];
          newData[index] = searchData;
          return newData;
        });
      } else {
        const selectedTransfer = transfer.find((item) => item.id === id);
        if (selectedTransfer) {
          if (
            selectedTransfer.mode !== "Flight" &&
            selectedTransfer.mode !== "Taxi"
          ) {
            // For non-Flight/non-Taxi modes, calculate arrival_time based on duration
            const departureDateTime = dayjs(
              `${currentModeDepartureDate}T${currentModeDepartureTime}`,
            );
            const arrivalDateTime = departureDateTime.add(
              selectedTransfer.duration || 0,
              "minute",
            );

            selectedTransfer.departure_time = `${currentModeDepartureDate}T${currentModeDepartureTime}`;
            selectedTransfer.arrival_time =
              arrivalDateTime.format("YYYY-MM-DDTHH:mm");
          }

          setSelectedData((prev) => {
            const newData = [...prev];
            newData[index] = selectedTransfer;
            return newData;
          });
        }
      }
    }

    handleSelect(
      transferIndex,
      isDeselecting
        ? null
        : searchData || transfer.find((item) => item.id === id),
      transfer,
      mode,
    );

    // Propagate time changes to all subsequent steps
    if (!isDeselecting && index < transfer.length - 1) {
      propagateTimeChanges(index + 1);
    }
  };

  const handleFlightSelection = (flightData) => {
    handleModeSelect(
      currentStep - 1,
      flightData?.id || flightData?.resultIndex,
      flightData,
      "Flight",
    );
  };

  const handleTaxiSelection = (taxiData) => {
    handleModeSelect(
      currentStep - 1,
      taxiData?.id || taxiData?.result_index,
      taxiData,
      "Taxi",
    );
  };

  const loadTransfers = async (option, paxData, departureDateTime) => {
    const transferKey = `${option.id}-${currentStep}`;
    setLoadingTransfers((prev) => ({ ...prev, [transferKey]: true }));

    try {
      const requestBody = {
        edge_id: option?.id,
        start_datetime: departureDateTime,
        number_of_adults: paxData.adults,
        number_of_children: paxData.children,
        number_of_infants: paxData.infants,
      };

      const response = await loadOtherTransfers.post(`/search/`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success && data.data) {
        setDynamicTransferData((prev) => ({
          ...prev,
          [transferKey]: {
            ...data.data,
            trace_id: data?.trace_id,
          },
        }));
        setTransferErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[transferKey];
          return newErrors;
        });
      }
    } catch (error) {
      setTransferErrors((prev) => ({
        ...prev,
        [transferKey]:
          error.response?.data?.errors[0]?.message[0] ||
          error.message ||
          "Failed to load transfer options",
      }));

      console.error("Error loading transfers:", error);
    } finally {
      setLoadingTransfers((prev) => ({ ...prev, [transferKey]: false }));
    }
  };

  const handleDateSelect = (date) => {
    // Convert date to YYYY-MM-DD format if it's not already
    const formattedDate =
      typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");

    setCurrentModeDepartureDate(formattedDate);
    setComboStartDate(formattedDate);
    setShowDateDropdown(false); // Keep this for consistency

    const currentTransfer = transfer[currentStep - 1];
    if (
      currentTransfer &&
      currentTransfer.mode !== "Flight" &&
      currentTransfer.mode !== "Taxi"
    ) {
      const paxData = {
        adults: pax.adults,
        children: pax.children,
        infants: pax.infants,
      };
      const departureDateTime = `${formattedDate}T${currentModeDepartureTime}:00`;
      loadTransfers(currentTransfer, paxData, departureDateTime);
    }
  };

  const handleTimeSelect = (time) => {
    setCurrentModeDepartureTime(time);
    setComboStartTime(time);
    setShowTimeDropdown(false);

    const currentTransfer = transfer[currentStep - 1];
    const currentSelectedData = { ...selectedData[currentStep - 1] };

    currentSelectedData.departure_time = `${currentModeDepartureDate}T${time}`;

    if (currentTransfer.mode !== "Flight" && currentTransfer.mode !== "Taxi") {
      const departureDateTime = dayjs(`${currentModeDepartureDate}T${time}:00`);
      const arrivalDateTime = departureDateTime.add(
        currentSelectedData.duration || 0,
        "minute",
      );
      currentSelectedData.arrival_time =
        arrivalDateTime.format("YYYY-MM-DDTHH:mm");

      // Load new transfer data for non-flight/non-taxi modes
      const paxData = {
        adults: number_of_adults,
        children: number_of_children || 0,
        infants: number_of_infants || 0,
      };
      loadTransfers(
        currentTransfer,
        paxData,
        `${currentModeDepartureDate}T${time}:00`,
      );
    }

    // Rest of your existing handleTimeSelect logic...
    setSelectedData((prev) => {
      const newData = [...prev];
      newData[currentStep - 1] = currentSelectedData;

      for (let i = currentStep; i < transfer.length; i++) {
        if (newData[i - 1] && newData[i]) {
          const prevArrivalTime = newData[i - 1].arrival_time;

          if (prevArrivalTime) {
            let arrivalMoment = dayjs(prevArrivalTime);
            let newDepartureTime = arrivalMoment.add(1, "hour");

            const newDepartureDate = newDepartureTime.format("YYYY-MM-DD");
            const newDepartureTimeStr = newDepartureTime.format("HH:mm");

            newData[i] = {
              ...newData[i],
              departure_time: `${newDepartureDate}T${newDepartureTimeStr}`,
            };

            if (newData[i].mode !== "Flight" && newData[i].mode !== "Taxi") {
              const newDepartureDateTime = dayjs(
                `${newDepartureDate}T${newDepartureTimeStr}`,
              );
              const newArrivalDateTime = newDepartureDateTime.add(
                newData[i].duration || 0,
                "minute",
              );
              newData[i].arrival_time =
                newArrivalDateTime.format("YYYY-MM-DDTHH:mm");
            }
          }
        }
      }

      return newData;
    });
    const currentTransferData = transfer[currentStep - 1];
    handleSelect(
      currentStep - 1,
      currentSelectedData,
      currentTransferData,
      currentTransferData.mode,
    );

    selectedData.forEach((data, index) => {
      if (index >= currentStep && data) {
        const modeTransfer = transfer[index];
        handleSelect(
          index,
          selectedData[index],
          modeTransfer,
          modeTransfer.mode,
        );
      }
    });
  };

  const handlePaxChange = (newPax, option) => {
    if (option && option.mode !== "Flight" && option.mode !== "Taxi") {
      const departureDateTime = `${currentModeDepartureDate}T${currentModeDepartureTime}:00`;
      loadTransfers(option, newPax, departureDateTime);
    }
  };

  // Add this handleCancel function inside your NewMultiModeContainer component

  const handleCancel = () => {
    // Find the last selected step (highest index with a selection)
    let lastSelectedIndex = -1;
    Object.keys(selectedModeIds).forEach((index) => {
      const numIndex = parseInt(index);
      if (numIndex > lastSelectedIndex) {
        lastSelectedIndex = numIndex;
      }
    });

    if (lastSelectedIndex >= 0) {
      setSelectedModeIds((prev) => {
        const newSelections = { ...prev };
        delete newSelections[lastSelectedIndex];
        return newSelections;
      });

      setSelectedData((prev) => {
        const newData = [...prev];
        newData[lastSelectedIndex] = undefined;
        return newData;
      });
    }

    setUpdateLoading(false);
  };

  const handleUpdateTransfer = async () => {
    setUpdateLoading(true);
    if (Object.keys(selectedModeIds).length === totalSteps) {
      const transfersPayload = selectedData.map((item, index) => {
        const currentTransfer = transfer[index];

        const transferObj = {
          booking_type: currentTransfer.mode,
          edge_id: currentTransfer.id,
          // booking_source: item.booking_source || "Self",
        };

        if (currentTransfer.mode === "Flight") {
          return {
            ...transferObj,
            result_index: item.resultIndex || item.result_index,
            trace_id:
              item?.trace_id || localStorage.getItem("Travclan_trace_id"),
          };
        } else if (currentTransfer.mode === "Taxi") {
          return {
            ...transferObj,
            trace_id: item.trace_id,
            result_index: item.result_index,
            source: item.source,
          };
        } else {
          const isOmio = !!item.selectedOmioResult;

          if (isOmio) {
            return {
              ...transferObj,
              source: item.booking_source || "Self",
              trace_id: item.trace_id,
              price_result_index: item.selectedPrice?.result_index || null,
              segment_result_index:
                item.selectedOmioResult?.result_index || null,
            };
          }

          return {
            ...transferObj,
            source: "Self",
            price_result_index: item.selectedPrice?.result_index || 0,
            trace_id: item.trace_id,
            result_index: item.selectedPrice
              ? transfer[index].prices.findIndex(
                  (p) =>
                    p.price === item.selectedPrice.price &&
                    p.currency === item.selectedPrice.currency,
                )
              : 0,
            start_time:
              item.departure_time ||
              `${currentModeDepartureDate}T${currentModeDepartureTime}`,
          };
        }
      });

      const baseStartDate =
        oCityData?.start_date && oCityData?.duration != null
          ? addDaysToDate(oCityData.start_date, oCityData.duration)
          : oCityData?.id
            ? oCityData?.start_date
            : start_date;

      const requestBody = {
        destination_itinerary_city: destination_itinerary_city_id,
        source_itinerary_city: origin_itinerary_city_id
          ? origin_itinerary_city_id
          : null,
        number_of_adults: number_of_adults,
        number_of_children: number_of_children,
        number_of_infants: number_of_infants,
        start_datetime: baseStartDate + "T00:00:00",
        transfers: transfersPayload,
      };

      if (selectedBooking) {
        requestBody.booking_id = selectedBooking?.id || booking_id;
      }

      setIsProcessingWarning(true);

      try {
        // Call warning API
        const warningResponse = await updateFlightBookingWarning.post(
          `${itinerary_id}/transfers/combo/warning/`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (warningResponse?.data?.show_warning === true) {
          // Show warning modal
          setWarningMessage(
            warningResponse.data.warning || "Please confirm this action.",
          );
          setPendingBookingData(requestBody);
          setShowWarningModal(true);
          setIsProcessingWarning(false);
        } else {
          // Proceed directly with booking
          setIsProcessingWarning(false);
          await handleBookingConfirm(requestBody);
        }
      } catch (error) {
        setIsProcessingWarning(false);
        setUpdateLoading(false);
        handleCancel();
        console.error("Warning API failed:", error);

        let errorMsg = "Warning check failed. Please try again.";
        if (error?.response?.data) {
          if (error.response.data.errors?.[0]?.message?.[0]) {
            errorMsg = error.response.data.errors[0].message[0];
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (typeof error.response.data === "string") {
            errorMsg = error.response.data;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }

        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        });
      }
    } else {
      setUpdateLoading(false);
    }
  };

  const handleBookingConfirm = async (requestBody) => {
    setIsProcessingBooking(true);

    try {
      const response = await UpdateTransferMode.post(
        `${itinerary_id}/bookings/transfer/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;
      dispatch(
        updateSingleTransferBooking(
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
          data,
        ),
      );

      trackTransferBookingAdd(
        itinerary_id,
        `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
        intercity?.[
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`
        ],
        data,
        city || mercury?.source?.city_name,
        dcity || mercury?.destination?.city_name,
      );

      getPaymentHandler();
      actualClose();

      openNotification({
        text: `Transfer from ${city || mercury?.source?.city_name} to ${
          dcity || mercury?.destination?.city_name
        } has been updated successfully!`,
        heading: "Success!",
        type: "success",
      });

      setUpdateLoading(false);
      setIsProcessingBooking(false);

      if (data?.is_refresh_needed) {
        const url = new URL(window.location);
        const drawerParams = [
          "drawer",
          "booking_id",
          "flight_modal",
          "modal",
          "edit",
        ];
        drawerParams.forEach((param) => {
          url.searchParams.delete(param);
        });

        window.history.replaceState({}, "", url.toString());
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    } catch (error) {
      setUpdateLoading(false);
      handleCancel();
      setIsProcessingBooking(false);

      let errorMessage = "Failed to update transfer. Please try again.";
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMessage = error.response.data.errors[0].message[0];
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      openNotification({
        text: errorMessage,
        heading: "Error!",
        type: "error",
      });
      console.error("Error updating transfer:", errorMessage);
    }
  };

  const handleWarningConfirm = async () => {
    if (pendingBookingData && !isProcessingBooking) {
      setShowWarningModal(false);
      await handleBookingConfirm(pendingBookingData);
      setPendingBookingData(null);
    }
  };

  const handleWarningCancel = () => {
    handleCancel();
    setShowWarningModal(false);
    setWarningMessage("");

    setPendingBookingData(null);
    setUpdateLoading(false);
    setIsProcessingWarning(false);
    setIsProcessingBooking(false);
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  const roundUpToNext30Min = (time) => {
    const minutes = time.minute();
    const roundedMinutes = minutes <= 30 ? 30 : 60;
    return time.minute(0).add(roundedMinutes, "minute");
  };

  useEffect(() => {
    if (currentStep < 1 || currentStep > transfer.length) return;

    const currentTransfer = transfer[currentStep - 1];

    const baseStartDate =
      oCityData?.start_date && oCityData?.duration != null
        ? addDaysToDate(oCityData.start_date, oCityData.duration)
        : oCityData?.id
          ? oCityData?.start_date
          : start_date;

    let calculatedStartTime;

    if (currentStep === 1) {
      calculatedStartTime = dayjs(`${baseStartDate} 00:00`);
    } else {
      const prevSelected = selectedData[currentStep - 2];
      const prevArrivalTime = prevSelected?.arrival_time;

      if (prevArrivalTime) {
        let arrivalMoment = dayjs(prevArrivalTime);
        calculatedStartTime = roundUpToNext30Min(arrivalMoment.add(1, "hour"));
      } else if (prevSelected?.departure_time && prevSelected?.duration) {
        let departureDateTime = dayjs(prevSelected.departure_time);
        let calculatedArrival = departureDateTime.add(
          prevSelected.duration,
          "minute",
        );
        calculatedStartTime = roundUpToNext30Min(
          calculatedArrival.add(1, "hour"),
        );

        setSelectedData((prev) => {
          const newData = [...prev];
          if (newData[currentStep - 2]) {
            newData[currentStep - 2] = {
              ...newData[currentStep - 2],
              arrival_time: calculatedArrival.format("YYYY-MM-DDTHH:mm"),
            };
          }
          return newData;
        });
      } else {
        calculatedStartTime = roundUpToNext30Min(
          dayjs(`${baseStartDate} ${dayjs().format("HH:mm")}`),
        );
      }
    }

    setCurrentModeDepartureDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartTime(calculatedStartTime.format("HH:mm"));
    setCurrentModeDepartureTime(calculatedStartTime.format("HH:mm"));

    if (["Flight", "Taxi"].includes(currentTransfer.mode)) {
      if (!selectedModeIds[currentStep - 1]) {
        handleSelect(
          currentStep - 1,
          currentTransfer,
          "",
          currentTransfer.mode,
        );

        if (currentTransfer.mode === "Flight") {
          if (!skipFlightFetch) setShowComboFlightModal(true);
          // else setSkipFlightFetch(false);
        }

        if (currentTransfer.mode === "Taxi") {
          if (!skipTaxiFetch) setShowComboTaxiModal(true);
          // else setSkipTaxiFetch(false);
        }
      }
    } else {
      if (!selectedModeIds[currentStep - 1]) {
        handleSelect(currentStep - 1, null, "", currentTransfer.mode);

        const paxData = {
          adults: pax.adults,
          children: pax.children,
          infants: pax.infants,
        };
        const departureDateTime = `${calculatedStartTime.format(
          "YYYY-MM-DD",
        )}T${calculatedStartTime.format("HH:mm")}:00`;
        loadTransfers(currentTransfer, paxData, departureDateTime);
      }
    }
  }, [currentStep, transfer]);

  // useEffect for propagating time changes based on selectedData changes
  useEffect(() => {
    if (Object.keys(selectedModeIds).length > 0) {
      for (let i = 0; i < transfer.length - 1; i++) {
        // If current step has data but next step doesn't, and current has arrival time
        if (
          selectedData[i] &&
          !selectedData[i + 1] &&
          selectedData[i].arrival_time
        ) {
          let arrivalMoment = dayjs(selectedData[i].arrival_time);
          let nextDepartureTime = arrivalMoment.add(1, "hour");

          // If this is the step before current step, update current step's departure time
          if (i === currentStep - 2) {
            setCurrentModeDepartureDate(nextDepartureTime.format("YYYY-MM-DD"));
            setCurrentModeDepartureTime(nextDepartureTime.format("HH:mm"));
            setComboStartDate(nextDepartureTime.format("YYYY-MM-DD"));
            setComboStartTime(nextDepartureTime.format("HH:mm"));
          }
        }
        // Check for non-Flight/non-Taxi modes that might be missing arrival_time
        else if (
          selectedData[i] &&
          !selectedData[i].arrival_time &&
          selectedData[i].departure_time &&
          selectedData[i].duration &&
          selectedData[i].mode !== "Flight" &&
          selectedData[i].mode !== "Taxi"
        ) {
          // Calculate and store arrival_time
          const departureDateTime = dayjs(selectedData[i].departure_time);
          const arrivalDateTime = departureDateTime.add(
            selectedData[i].duration,
            "minute",
          );

          setSelectedData((prev) => {
            const newData = [...prev];
            newData[i] = {
              ...newData[i],
              arrival_time: arrivalDateTime.format("YYYY-MM-DDTHH:mm"),
            };
            return newData;
          });
        }
      }
    }
  }, [selectedData, selectedModeIds]);

  useEffect(() => {
    if (showTimeDropdown) {
      const handleClickOutside = (event) => {
        const timeDropdown = document.getElementById("time-dropdown");

        if (timeDropdown && !timeDropdown.contains(event.target)) {
          setShowTimeDropdown(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showTimeDropdown]); // Remove showDateDropdown from dependency array

  return (
    <div className="w-full bg-white">
      {showWarningModal &&
        ReactDOM.createPortal(
          <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">
              <div className="md:hidden flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {!isProcessingBooking && (
                <button
                  onClick={handleWarningCancel}
                  className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                >
                  <FaX size={16} />
                </button>
              )}

              <div className="px-6 pb-6 pt-2 md:pt-6 max-h-[calc(90vh-8rem)] md:max-h-none overflow-y-auto">
                <h2 className="text-xl font-semibold mb-1 pr-8">
                  Dates Change Warning!
                </h2>

                <div className="text-gray-700 mb-6">
                  <div className="rounded-lg p-2">{warningMessage}</div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end border-t-2 pt-4">
                  <button
                    onClick={handleWarningCancel}
                    disabled={isProcessingBooking}
                    className="w-full md:w-auto px-6 py-2 md:py-2 text-gray-600 border rounded hover:bg-gray-50 transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessingBooking}
                    onClick={handleWarningConfirm}
                    className="w-full md:w-auto px-6 py-2 md:py-2 bg-[#07213A] text-white rounded hover:bg-[#0a2942] transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    {isProcessingBooking ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {/* {currentStep === 0 && (
        <div
          className="flex justify-between items-center p-3 md:p-4 border border-b cursor-pointer shadow-md"
          onClick={() => setCurrentStep(1)}
        >
          <div className="text-sm md:text-base">
            <span className="font-medium">{name} </span>
            <p className="font-normal">
              {Math.ceil(
                transfer.reduce((sum, t) => sum + (t.duration || 0), 0) / 60
              )}{" "}
              hours | {totalDistance} kms
            </p>
          </div>
          <AiOutlineRight size={16} className="md:text-20" />
        </div>
      )} */}

      {/* Expanded content */}
      {currentStep >= 1 && (
        <>
          <div>
            <div className="text-xl font-600 leading-2xl"> {name}</div>
          </div>
          <div>
            <div className="my-xl">
              <div className="flex justify-center items-center">
                {transfer.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center relative ${
                      index < transfer.length - 1 ? "w-[40%]" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center flex-col gap-lg justify-center  `}
                    >
                      <div
                        className={`w-[25px] h-[25px] flex items-center justify-center rounded-full border-1  ${
                          currentStep >= index + 1
                            ? "border-pureBlack"
                            : "border-text-disabled"
                        }  ${currentStep >= index + 2 ? "bg-green-500" : ""}`}
                      >
                        <span
                          className={`text-sm font-500 leading-md  ${
                            currentStep >= index + 1
                              ? "text-pureBlack"
                              : "text-text-disabled"
                          }`}
                        >
                          {" "}
                          {currentStep >= index + 2
                            ? svgIcons.check_white
                            : index + 1}{" "}
                        </span>
                      </div>
                      <span
                        className={`text-sm-md font-500 leading-md whitespace-nowrap ${
                          currentStep >= index + 1
                            ? "text-pureBlack"
                            : "text-text-disabled"
                        }`}
                      >
                        Add a {item.mode} 
                      </span>
                    </div>

                    {index < transfer.length - 1 && (
                      <div
                        className={`h-[1px] absolute left-[48px] top-[12px] ${
                          currentStep >= index + 2
                            ? "bg-pureBlack"
                            : "bg-text-disabled"
                        }`}
                        style={{
                          width: `calc(100% - ${
                            index < transfer.length - 2 ? "25px" : "20px"
                          })`,
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentStep >= 1 && currentStep <= totalSteps && (
              <div className="space-y-3 md:space-y-4">
                {getCurrentTransfer().map((option, index) => {
                  const key = `${currentStep}-${option.id}`;
                  const transferKey = `${option.id}-${currentStep}`;
                  const isLoading = loadingTransfers[transferKey];
                  if (option.mode === "Flight") {
                    return (
                      <ComboFlight
                        key={option.id}
                        combo={true}
                        edge={option?.id}
                        transferData={option}
                        handleFlightSelect={handleFlightSelect}
                        showComboFlightModal={showComboFlightModal}
                        setShowComboFlightModal={setShowComboFlightModal}
                        setHideFlightModal={setHideFlightModal}
                        setHideBookingModal={setHideBookingModal}
                        getPaymentHandler={getPaymentHandler}
                        _updatePaymentHandler={_updatePaymentHandler}
                        _updateFlightBookingHandler={
                          _updateFlightBookingHandler
                        }
                        _updateBookingHandler={_updateBookingHandler}
                        alternates={alternates}
                        tailored_id={tailored_id}
                        selectedBooking={selectedBooking}
                        itinerary_id={itinerary_id}
                        setShowLoginModal={setShowLoginModal}
                        check_in={check_in}
                        _GetInTouch={_GetInTouch}
                        daySlabIndex={daySlabIndex}
                        elementIndex={elementIndex}
                        routeId={routeId}
                        mercuryTransfer={mercuryTransfer}
                        individual={individual}
                        originCityId={option?.source?.id}
                        destinationCityId={option?.destination?.id}
                        isSelected={
                          selectedModeIds[currentStep - 1] === option.id
                        }
                        onSelect={handleFlightSelection}
                        comboStartDate={comboStartDate}
                        comboStartTime={comboStartTime}
                        source_code={option?.source?.code}
                        destination_code={option?.destination?.code}
                        onFilterApplied={handleFilterApplied}
                        dCityData={dCityData}
                        oCityData={oCityData}
                        source_itinerary_city_id={
                          option?.source?.city || origin_itinerary_city_id
                        }
                        destination_itinerary_city_id={
                          option?.destination?.city ||
                          destination_itinerary_city_id
                        }
                        flightResults={flightResults[key]}
                        skipFetch={!!flightResults[key]}
                        setFlightResults={(data) =>
                          setFlightResults((prev) => ({ ...prev, [key]: data }))
                        }
                        selectedData={
                          selectedModeIds[currentStep - 1] &&
                          selectedData &&
                          selectedData?.length
                            ? selectedData?.[currentStep - 1]
                            : null
                        }
                        transferResults={transferResults}
                        setTransferResults={setTransferResults}
                      />
                    );
                  }
                  if (option.mode === "Taxi") {
                    return (
                      <ComboTaxi
                        index={index}
                        key={option.id}
                        KEY={key}
                        edge={option?.id}
                        combo={true}
                        handleFlightSelect={handleFlightSelect}
                        showTaxiModal={showTaxiModal}
                        setShowComboTaxiModal={setShowComboTaxiModal}
                        setHideTaxiModal={setHideTaxiModal}
                        setHideBookingModal={setHideBookingModal}
                        getPaymentHandler={getPaymentHandler}
                        _updatePaymentHandler={_updatePaymentHandler}
                        _updateFlightBookingHandler={
                          _updateFlightBookingHandler
                        }
                        _updateBookingHandler={_updateBookingHandler}
                        alternates={alternates}
                        tailored_id={tailored_id}
                        selectedBooking={selectedBooking}
                        itinerary_id={itinerary_id}
                        setShowLoginModal={setShowLoginModal}
                        check_in={check_in}
                        _GetInTouch={_GetInTouch}
                        daySlabIndex={daySlabIndex}
                        elementIndex={elementIndex}
                        routeId={routeId}
                        mercuryTransfer={mercuryTransfer}
                        individual={individual}
                        originCityId={
                          option?.source?.city ||
                          oCityData?.city?.id ||
                          oCityData?.gmaps_place_id
                        }
                        destinationCityId={
                          option?.destination?.city ||
                          dCityData?.city?.id ||
                          dCityData?.gmaps_place_id
                        }
                        sourceRouteCityId={option?.source?.city}
                        destinationRouteCityId={option?.destination?.city}
                        sourceHubId={option?.source?.id}
                        destinationHubId={option?.destination?.id}
                        isSelected={
                          selectedModeIds[currentStep - 1] === option.id
                        }
                        onSelect={handleTaxiSelection}
                        comboStartDate={comboStartDate}
                        comboStartTime={comboStartTime}
                        onFilterApplied={handleFilterApplied}
                        dCityData={dCityData}
                        oCityData={oCityData}
                        taxiResults={taxiResults[key]}
                        skipTaxiFetch={!!taxiResults[key]}
                        setTaxiResults={setTaxiResults}
                        transferResults={transferResults}
                        setTransferResults={setTransferResults}
                        selectedData={
                          selectedModeIds[currentStep - 1] &&
                          selectedData &&
                          selectedData?.length
                            ? selectedData?.[currentStep - 1]
                            : null
                        }
                      />
                    );
                  }

                  const currentTransferData = getCurrentTransferData(option);

                  if (
                    currentTransferData.prices &&
                    currentTransferData.prices.length > 0
                  ) {
                    const formatTimeForDisplay = (timeValue) => {
                      if (!timeValue) return "";
                      const timeOption = timeOptions.find(
                        (option) => option.value === timeValue,
                      );
                      if (timeOption) {
                        return timeOption.display;
                      }
                      const [hours, minutes] = timeValue.split(":");
                      const hour = parseInt(hours, 10);
                      const hour12 = hour % 12 || 12;
                      const period = hour < 12 ? "AM" : "PM";
                      return `${hour12}:${minutes} ${period}`;
                    };

                    return (
                      <div key={key}>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between mb-4">
                            <div className="relative w-full sm:w-auto">
                              <label className="text-sm font-medium mb-2 block">
                                Departure Date:
                              </label>
                              <DatePicker
                                id="departure-date"
                                date={currentModeDepartureDate}
                                onDateChange={(e) => {
                                  const selectedDate = dayjs(
                                    e.target.value,
                                  ).format("YYYY-MM-DD");
                                  handleDateSelect(selectedDate);
                                }}
                                defaultDate={currentModeDepartureDate}
                              />
                            </div>

                            <div className="flex flex-col md:flex-row gap-2 mt-2">
                              <div
                                className="time-dropdown-container relative w-full sm:w-auto"
                                id="time-dropdown"
                              >
                                <div className="text-sm font-medium text-gray-700 mb-2">
                                  Departure Time
                                </div>
                                <div
                                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTimeDropdown(!showTimeDropdown);
                                  }}
                                >
                                  <span className="text-sm font-medium">
                                    {formatTimeForDisplay(
                                      currentModeDepartureTime,
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      setShowTimeDropdown(!showTimeDropdown)
                                    }
                                  >
                                    <svg
                                      className={`w-5 h-5 text-gray-600 transition-transform`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {showTimeDropdown && (
                                  <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-48 max-h-60 overflow-y-auto">
                                    {timeOptions.map((time, idx) => (
                                      <div
                                        key={idx}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${
                                          time.value ===
                                          currentModeDepartureTime
                                            ? "bg-yellow-100 font-medium"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleTimeSelect(time.value)
                                        }
                                      >
                                        {time.display}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Pax
                              setShowPax={setShowPax}
                              pax={pax}
                              setPax={(newPax) => {
                                setPax(newPax);
                                handlePaxChange(newPax, option);
                              }}
                              showPax={showPax}
                              combo={true}
                            />
                          </div>
                        </div>

                        {/* Show loading indicator when fetching new data */}
                        {isLoading && (
                          <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-600">
                              Loading updated options...
                            </span>
                          </div>
                        )}

                        {transferErrors[transferKey] && (
                          <div className="p-4">
                            <div className="flex items-center justify-center">
                              <span className="text-sm font-normal">
                                {transferErrors[transferKey]}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Render prices from current transfer data */}
                        {!isLoading &&
                          !transferErrors[transferKey] &&
                          (() => {
                            const hasOmioResults =
                              currentTransferData.results &&
                              currentTransferData.results.length > 0;

                            if (hasOmioResults) {
  return currentTransferData.results.map(
    (result, resultIndex) => {
      const resultPrices = result.prices || [];
      return resultPrices.map(
        (priceOption, priceIndex) => {
          const price = priceOption.price || 0;
          const currencySymbol =
            priceOption.currency === "INR"
              ? "₹"
              : priceOption.currency;
          const priceOptionId = `${currentTransferData.id}-${resultIndex}-${priceIndex}`;
          const operators = result.operator || [];
          const segments = result.segments || [];
          const departureInfo =
            result.departure_datetime
              ? dayjs(result.departure_datetime)
              : null;
          const arrivalInfo =
            result.arrival_datetime
              ? dayjs(result.arrival_datetime)
              : null;
          const isExpanded = expandedTransfersMulti[priceOptionId] || false;

          return (
            <div
              key={priceOptionId}
              className="flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite relative mt-md"
            >
              <div className="flex justify-between max-ph:flex-col">
                <div className="w-full">
                  {/* Operator + class header */}
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-xs">
                      {operators.map(
                        (op, opIdx) =>
                          op.image && (
                            <img
                              key={opIdx}
                              src={op.image}
                              alt={op.name}
                              className="h-5 w-auto object-contain"
                            />
                          ),
                      )}
                      <span className="text-sm font-500 text-text-spacegrey">
                        {operators
                          .map((op) => op.name)
                          .join(" | ")}
                      </span>
                    </div>
                    {priceOption.class_name && (
                      <span className="text-xs font-500 bg-gray-100 px-xs py-[2px] rounded-md text-text-spacegrey">
                        {priceOption.class_name}
                      </span>
                    )}
                  </div>

                  {/* Departure → Arrival timeline */}
                  {departureInfo && arrivalInfo && (
                    <div className="flex items-center justify-between mt-md mr-2xl max-ph:mr-zero max-ph:mb-md">
                      <div className="flex flex-col gap-xs shrink-0">
                        <span className="text-sm font-400 leading-lg-md">
                          {departureInfo.format(
                            "ddd, MMM D",
                          )}
                        </span>
                        <span className="text-md-lg font-600 leading-lg-md">
                          {departureInfo.format(
                            "h:mm A",
                          )}
                        </span>
                        <span className="text-sm font-400 leading-lg-md truncate max-w-[75px] md:max-w-[140px]">
                          {result.source?.name ||
                            currentTransferData
                              .source?.city_name}
                        </span>
                      </div>
                      <div className="flex items-center flex-1 mx-md relative">
                        <div className="w-full border-b-[2px] border-black [border-style:dashed] [border-image:repeating-linear-gradient(to_right,#6E757A_0_6px,transparent_6px_12px)_1]"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center px-1 gap-2">
                          <span className="text-sm font-400 leading-tight">
                            {result.duration_formatted ||
                              `${Math.floor(result.duration / 60)}h ${result.duration % 60}m`}
                          </span>
                          <span className="bg-primary-indigo rounded-full w-[26px] h-[26px] flex items-center justify-center flex-shrink-0">
                            {getModeIcon(
                              currentTransferData.mode,
                              13,
                            )}
                          </span>
                          <span className="text-sm font-400 leading-tight">
                            {
                              currentTransferData.distance
                            }{" "}
                            Km
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-xs shrink-0">
                        <span className="text-sm font-400 leading-lg-md">
                          {arrivalInfo.format(
                            "ddd, MMM D",
                          )}
                        </span>
                        <span className="text-md-lg font-600 leading-lg-md">
                          {arrivalInfo.format(
                            "h:mm A",
                          )}
                        </span>
                        <span className="text-sm font-400 leading-lg-md truncate max-w-[75px] md:max-w-[140px]">
                          {result.destination
                            ?.name ||
                            currentTransferData
                              .destination
                              ?.city_name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Transfer Details Button */}
                  {segments.length >= 1 && (
                    <div 
                      className="flex items-center gap-2 mt-md cursor-pointer"
                      onClick={() => toggleTransferDetailsMulti(priceOptionId)}
                    >
                      <div className="bg-[#07213A] text-white rounded-full px-3 py-1 flex items-center gap-2 text-xs md:text-[14px] font-500">
                        <span className="">
                          Details
                          {/* {segments.length - 1 > 0 ? `${segments.length - 1} ` : ''}
                          Transfer{segments.length > 2 ? 's' : ''} */}
                        </span>
                        {isExpanded ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Segments breakdown for connections */}
                  {segments.length >=1 && isExpanded && (
                    <div className="mt-md border-t border-text-disabled pt-md">
                      <div className="flex flex-col gap-2">
                        {segments.map(
                          (seg, segIdx) => {
                            const segDep =
                              seg.departure_datetime
                                ? dayjs(
                                    seg.departure_datetime,
                                  )
                                : null;
                            const segArr =
                              seg.arrival_datetime
                                ? dayjs(
                                    seg.arrival_datetime,
                                  )
                                : null;
                            const isLastSegment =
                              segIdx ===
                              segments.length - 1;

                            return (
                              <div key={segIdx}>
                                {/* Departure Row */}
                                <div className="flex flex-row items-start gap-3">
                                  {/* Time column */}
                                  <div className="flex flex-col items-end w-[68px] shrink-0 pt-1">
                                    {segDep && (
                                      <span className="text-sm font-600 leading-tight">
                                        {segDep.format(
                                          "h:mm A",
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {/* Dot column */}
                                  <div className="flex flex-col items-center shrink-0 pt-1">
                                    <div className="w-3 h-3 rounded-full border-2 border-primary-indigo bg-white"></div>
                                  </div>

                                  {/* Station info column */}
                                  <div className="flex-1 min-w-0">
                                    <span
                                      className="text-sm font-600 text-gray-900 block truncate"
                                      title={
                                        seg
                                          .departure_station
                                          ?.name
                                      }
                                    >
                                      {
                                        seg
                                          .departure_station
                                          ?.name
                                      }
                                    </span>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                      {seg.operator?.name && (
                                        <span>{seg.operator.name}</span>
                                      )}
                                      {seg.vehicle_number && (
                                        <>
                                          {seg.operator?.name && <span>|</span>}
                                          <span>{seg.vehicle_number}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Journey Line with Duration */}
                                <div className="flex flex-row items-start gap-3">
                                  {/* Time column - empty */}
                                  <div className="w-[68px] shrink-0 mr-1"></div>

                                  {/* Vertical line column - aligned with dots */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <div
                                      className="w-[2px] bg-gray-300"
                                      style={{
                                        height:
                                          "40px",
                                      }}
                                    ></div>
                                  </div>

                                  {/* Duration info */}
                                  <div className="pt-2">
                                    <span className="text-xs text-gray-500">
                                      {seg.duration_formatted ||
                                        `${Math.floor(seg.duration / 60)}h ${seg.duration % 60}m`}
                                    </span>
                                  </div>
                                </div>

                                {/* Arrival Row */}
                                {segArr && (
                                  <div className="flex flex-row items-start gap-3">
                                    {/* Time column */}
                                    <div className="flex flex-col items-end w-[68px] shrink-0 pt-1">
                                      <span className="text-sm font-600 leading-tight">
                                        {segArr.format(
                                          "h:mm A",
                                        )}
                                      </span>
                                    </div>

                                    {/* Dot column */}
                                    <div className="flex flex-col items-center shrink-0 pt-1">
                                      <div className="w-3 h-3 rounded-full border-2 border-primary-indigo bg-white"></div>
                                    </div>

                                    {/* Station info column */}
                                    <div className="flex-1 min-w-0">
                                      <span
                                        className="text-sm font-600 text-gray-900 block truncate"
                                        title={
                                          seg
                                            .arrival_station
                                            ?.name
                                        }
                                      >
                                        {
                                          seg
                                            .arrival_station
                                            ?.name
                                        }
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Connection/Layover indicator */}
                                {!isLastSegment &&
                                  segments[
                                    segIdx + 1
                                  ] && (
                                    <div className="flex flex-row items-center gap-3 mt-3 mb-3">
                                      {/* Time column - empty */}
                                      <div className="w-[68px] shrink-0 mr-1"></div>

                                      {/* Vertical line column */}
                                      <div className="flex flex-col items-center shrink-0">
                                        <div className="w-[2px] h-4 bg-gray-300"></div>
                                      </div>

                                      {/* Transfer badge */}
                                      <div className="flex flex-row items-center gap-2 bg-[#07213A] text-white px-3 py-1.5 rounded-md">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        <span className="text-xs font-500">
                                          Transfer, {(() => {
                                            const layover =
                                              dayjs(
                                                segments[
                                                  segIdx +
                                                    1
                                                ]
                                                  .departure_datetime,
                                              ).diff(
                                                dayjs(
                                                  seg.arrival_datetime,
                                                ),
                                                "minute",
                                              );
                                            const h =
                                              Math.floor(
                                                layover /
                                                  60,
                                              );
                                            const m =
                                              layover %
                                              60;
                                            return h >
                                              0
                                              ? `${h}h${m}m`
                                              : `${m}m`;
                                          })()}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price + button */}
                <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
                  <div>
                    <div className="text-lg font-700 2xl-md text-right max-ph:text-left">
                      {currencySymbol} {price}
                    </div>
                    <div className="text-text-spacegrey text-sm-md font-400 leading-lg">
                      for{" "}
                      {pax?.adults +
                        pax?.children +
                        pax?.infants}{" "}
                      people
                    </div>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      const selectedPriceData = {
                        ...currentTransferData,
                        selectedOmioResult: result,
                        selectedOmioResultIndex:
                          resultIndex,
                        selectedPrice: {
                          ...priceOption,
                          result_index:
                            priceOption.result_index,
                        },
                      };
                      handleModeSelect(
                        currentStep - 1,
                        priceOptionId,
                        selectedPriceData,
                        currentTransferData.mode,
                      );
                    }}
                  >
                    {selectedModeIds[
                      currentStep - 1
                    ] === priceOptionId ? (
                      <button className="ttw-btn-secondary-fill max-ph:w-full">
                        Selected
                      </button>
                    ) : (
                      <button className="ttw-btn-fill-yellow max-ph:w-full">
                        Add to Itinerary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        },
      );
    },
  );
}

                            return currentTransferData.prices.map(
                              (priceOption, priceIndex) => {
                                const price = priceOption.price || 0;
                                const currency =
                                  priceOption.currency === "INR"
                                    ? "₹"
                                    : priceOption.currency;
                                const priceOptionId = `${currentTransferData.id}-${priceIndex}`;
                                const currentDateTimeInfo = getDateInfo(
                                  currentTransferData.start_datetime,
                                  currentTransferData.duration,
                                );
                                return (
                                  <div
                                    key={`${currentTransferData.id}-price-${priceIndex}`}
                                    className="flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md  hover:bg-text-smoothwhite relative mt-md"
                                  >
                                    <div className="flex justify-between max-ph:flex-col">
                                      <div className="w-full">
                                        <div className="text-md font-600 leading-xl ">
                                          {currentTransferData.text}{" "}
                                          {priceOption.name
                                            ? `- ${priceOption.name}`
                                            : ""}
                                        </div>

                                        {priceOption.description && (
                                          <div className="text-xs md:text-sm text-gray-700 mt-1">
                                            {priceOption.description}
                                          </div>
                                        )}

                                        {currentDateTimeInfo && (
                                          <div className="flex items-center justify-between mt-md mr-2xl max-ph:mr-zero max-ph:mb-md">
                                            <div className="flex flex-col gap-xs shrink-0">
                                              <span className="text-sm font-400 leading-lg-md">
                                                {
                                                  currentDateTimeInfo.formattedStartDate
                                                }
                                              </span>
                                              <span className="text-md-lg font-600 leading-lg-md">
                                                {
                                                  currentDateTimeInfo.formattedStartTime
                                                }
                                              </span>
                                              <span className="text-sm font-400 leading-lg-md">
                                                {
                                                  currentTransferData.source
                                                    .city_name
                                                }
                                              </span>
                                            </div>

                                            <div className="flex items-center flex-1 mx-md relative">
                                              <div className="w-full border-b-[2px] border-black [border-style:dashed] [border-image:repeating-linear-gradient(to_right,#6E757A_0_6px,transparent_6px_12px)_1]"></div>
                                              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center px-1 gap-2">
                                                <span className="text-sm font-400 leading-lg-md">
                                                  {
                                                    currentDateTimeInfo.formattedDuration
                                                  }
                                                </span>
                                                <span className="text-md-lg font-600 leading-lg-md bg-primary-indigo rounded-full w-[25px] h-[25px] flex items-center justify-center">
                                                  {getModeIcon(
                                                    currentTransferData.mode,
                                                    13,
                                                  )}
                                                </span>
                                                <span className="text-sm font-400 leading-lg-md">
                                                  {currentTransferData.distance}{" "}
                                                  Km
                                                </span>
                                              </div>
                                            </div>

                                            <div className="flex flex-col gap-xs shrink-0">
                                              <span className="text-sm font-400 leading-lg-md">
                                                {
                                                  currentDateTimeInfo.formattedEndDate
                                                }
                                              </span>
                                              <span className="text-md-lg font-600 leading-lg-md">
                                                {
                                                  currentDateTimeInfo.formattedEndTime
                                                }
                                              </span>
                                              <span className="text-sm font-400 leading-lg-md">
                                                {
                                                  currentTransferData
                                                    .destination.city_name
                                                }
                                              </span>
                                            </div>
                                          </div>
                                        )}

                                        {priceOption?.class && (
                                          <div className="text-xs md:text-sm">
                                            <span className="font-semibold">
                                              Facilities:
                                            </span>{" "}
                                            {priceOption?.class}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
                                        <div>
                                          <div className=" text-lg font-700 2xl-md text-right max-ph:text-left">
                                            {" "}
                                            {currency} {price}{" "}
                                          </div>
                                          <div className="text-text-spacegrey text-sm-md font-400 leading-lg ">
                                            for{" "}
                                            {pax?.adults +
                                              pax?.children +
                                              pax?.infants}{" "}
                                            people{" "}
                                          </div>
                                        </div>

                                        <div
                                          className="cursor-pointer"
                                          onClick={() => {
                                            const selectedPriceData = {
                                              ...currentTransferData,
                                              selectedPrice: priceOption,
                                            };
                                            handleModeSelect(
                                              currentStep - 1,
                                              priceOptionId,
                                              selectedPriceData,
                                              currentTransferData.mode,
                                            );
                                          }}
                                        >
                                          {selectedModeIds[currentStep - 1] ===
                                          priceOptionId ? (
                                            <div className="flex items-center gap-1">
                                              {/* <ImCheckboxChecked className="h-4 w-4 md:h-5 md:w-5 text-blue-600" /> */}
                                              <button className="ttw-btn-secondary-fill max-ph:w-full">
                                                Selected
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-1">
                                              {/* <ImCheckboxUnchecked className="h-4 w-4 md:h-5 md:w-5" /> */}
                                              <button className="ttw-btn-fill-yellow max-ph:w-full">
                                                Add to Itinerary
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              },
                            );
                          })()}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className={`flex flex-col md:flex-row justify-between bg-white p-3 md:p-4 border-b rounded-md 
                          ${
                            selectedModeIds[currentStep - 1] === option.id
                              ? "border border-yellow-400 bg-yellow-50"
                              : "border"
                          }
                        `}
                      >
                        <div className="flex gap-2 md:gap-3 mb-2 md:mb-0">
                          <div className="text-gray-500 mt-1">
                            {getModeIcon(option.mode)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm md:text-base">
                              {option.text}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {option.duration} minutes | {option.distance} kms
                            </div>
                            <div className="text-xs md:text-sm">
                              <span className="font-semibold">From:</span>{" "}
                              {option.source.name} |{" "}
                              <span className="font-semibold">To:</span>{" "}
                              {option.destination.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-end md:items-end justify-between">
                          <div className="font-semibold text-sm md:text-base">
                            Price unavailable
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              handleModeSelect(
                                currentStep - 1,
                                option.id,
                                option,
                                option.mode,
                              )
                            }
                          >
                            {selectedModeIds[currentStep - 1] === option.id ? (
                              <div className="flex items-center gap-1">
                                <ImCheckboxChecked className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                <span className="text-sm">Selected</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <ImCheckboxUnchecked className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm">Select</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

                {/* Navigation buttons - Fixed to bottom */}
                <div className="sticky bottom-0 left-0 right-0 w-full bg-white border-t z-[13]">
                  <div className="flex flex-row md:flex-row gap-2 md:gap-0 justify-between items-stretch md:items-center py-3 px-4 md:px-0 max-w-full">
                    {currentStep > 1 ? (
                      <button
                        onClick={() => handleBackButton()}
                        className="bg-gray-200 text-black px-4 md:px-6 py-2 rounded-md font-medium text-sm md:text-base"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        onClick={() => handleNextStep()}
                        className={`
        ${
          isCurrentModeSelected()
            ? "ttw-btn-secondary-fill"
            : "ttw-btn-secondary-fill-disabled"
        }`}
                        disabled={!isCurrentModeSelected()}
                      >
                        Next
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row items-end gap-2 md:gap-4 w-full md:w-auto">
                        <button
                          onClick={handleUpdateTransfer}
                          className={`ttw-btn-secondary-fill ${
                            Object.keys(selectedModeIds).length !==
                              totalSteps || updateLoading
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={
                            Object.keys(selectedModeIds).length !==
                              totalSteps || updateLoading
                          }
                        >
                          <div className="flex items-center justify-center min-w-[140px]">
                            {updateLoading ? (
                              <PulseLoader
                                size={15}
                                speedMultiplier={0.6}
                                color="#ffffff"
                              />
                            ) : (
                              "Update Transfer"
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation buttons */}
                {/* <div className=" w-[100%] bottom-0 bg-white border-t z-10 ">
                  <div className="flex flex-row md:flex-row gap-2 md:gap-0 justify-between items-stretch md:items-center py-md max-ph:px-zero">
                    {currentStep > 1 ? (
                      <button
                        onClick={() => handleBackButton()}
                        className="bg-gray-200 text-black px-4 md:px-6 py-2 rounded-md font-medium text-sm md:text-base"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div> // Empty div for spacing on mobile
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        onClick={() => handleNextStep()}
                        className={`
                        ${
                          isCurrentModeSelected()
                            ? "ttw-btn-secondary-fill"
                            : "ttw-btn-secondary-fill-disabled"
                        }`}
                        disabled={!isCurrentModeSelected()}
                      >
                        Next
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row items-end gap-2 md:gap-4 w-full md:w-auto">
                        <button
                          onClick={handleUpdateTransfer}
                          className={`ttw-btn-secondary-fill ${
                            Object.keys(selectedModeIds).length !==
                              totalSteps || updateLoading
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={
                            Object.keys(selectedModeIds).length !==
                              totalSteps || updateLoading
                          }
                        >
                          <div className="flex items-center justify-center min-w-[140px]">
                            {updateLoading ? (
                              <PulseLoader
                                size={15}
                                speedMultiplier={0.6}
                                color="#000000"
                              />
                            ) : (
                              "Update Transfer"
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MultiModeContainer = ({ transferIndex, transfer, handleSelect }) => {
  return (
    <div className="w-full flex flex-col gap-0">
      {transfer.map((singleTransfer, index) => (
        <div key={index} className="flex flex-col gap-0 w-full">
          {index === 0 ? (
            <div className="flex flex-row items-center justify-between">
              <div className={`flex flex-row gap-3 items-center justify-start`}>
                <div className="w-[50px] flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  </div>
                </div>

                <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                  {singleTransfer?.source?.name}
                </div>
              </div>
            </div>
          ) : null}

          <div className="w-full flex flex-row gap-3 items-center justify-start">
            <div className="w-[55px] flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[50px] flex items-center justify-center">
                <TransfersIcon
                  TransportMode={singleTransfer.mode}
                  Instyle={{
                    fontSize: singleTransfer.mode === "Bus" ? "3rem" : "3.5rem",
                    color: "black",
                  }}
                  classname={{ width: 40, height: 40 }}
                  Multimode
                />
              </div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
            </div>

            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <div className="w-full flex flex-row items-center justify-between gap-0">
                <TransferItem transfer={singleTransfer} transferIndex={index} />

                <div className="flex flex-col gap-2 items-end">
                  <EstimatedCost cost={singleTransfer?.prices[0]?.price} />
                  <SelectButton
                    multimode
                    transfer={singleTransfer}
                    transferIndex={transferIndex}
                    handleSelect={handleSelect}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className={`flex flex-row gap-3 items-center justify-start`}>
              <div className="w-[50px] flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow rounded-full"></div>
                </div>
              </div>

              <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                {singleTransfer?.destination?.name}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ViewMoreButton = ({ viewMore, handleViewMore }) => {
  return (
    <button
      onClick={handleViewMore}
      className="text-sm flex flex-row gap-1 items-center justify-center hover:bg-black hover:text-white rounded-lg px-2 py-1"
    >
      {viewMore ? (
        <>
          View Less <IoIosArrowUp />
        </>
      ) : (
        <>
          View More <IoIosArrowDown />
        </>
      )}
    </button>
  );
};

const RadioButton = ({ name, label, transferType, handleTransferType }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div
        onClick={handleTransferType}
        id={name}
        className={`flex items-center justify-center w-5 h-5 border-2 ${
          transferType === name
            ? "border-primary-yellow"
            : "border-text-spacegrey"
        } rounded-full cursor-pointer`}
      >
        {transferType === name && (
          <div
            id={name}
            className={`p-1 w-3 h-3 rounded-full ${
              transferType === name ? "bg-primary-yellow" : "bg-text-spacegrey"
            }`}
          ></div>
        )}
      </div>
      <label htmlFor={name} className="text-sm-xl font-400 leading-xl">
        {label}
      </label>
    </div>
  );
};

const RoundTripSuggestion = ({
  roundTripSuggestions,
  handleRoundTripSelect,
  selectedCab,
  setSelectedCab,
  selectedTripType,
  setSelectedTripType,
}) => {
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(roundTripSuggestions.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");
  const currency = useSelector((state) => state.currency);

  useEffect(() => {
    const routes = [];
    const pricing = [];

    roundTripSuggestions?.data?.trips?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);

    roundTripSuggestions?.data?.quotes?.forEach((quote) => {
      pricing.push(quote);
    });
    setPricing(pricing);
  }, [roundTripSuggestions]);

  const handleSelectCab = (e) => {
    setSelectError(false);
    // Clear multicity selection and set trip type to roundtrip
    setSelectedTripType("roundtrip");
    setSelectedCab({
      ...pricing.find((p) => p.result_index == e.target.id),
      tripType: "roundtrip",
    });
  };

  const handleSelect = () => {
    if (selectedCab && selectedTripType === "roundtrip") {
      // Pass result_index as 1 for roundtrip
      handleRoundTripSelect(
        roundTripSuggestions?.trace_id,
        1,
        selectedCab.result_index,
      );
    } else {
      setSelectError(true);
    }
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4 ${
        selectedTripType === "roundtrip" ? "border-blue-300 bg-blue-50" : ""
      }`}
    >
      {isDesktop && (
        <div
          className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={"Taxi"}
            Instyle={{
              fontSize: "3rem",
              color: "black",
            }}
            classname={{ width: 80, height: 75 }}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          {!isDesktop && (
            <div
              className={`w-[60px] h-[60px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={"Taxi"}
                Instyle={{
                  fontSize: "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="text-[16px] font-medium">
              {roundTripSuggestions?.name}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {roundTripSuggestions?.distance?.value} Kms
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold">Routes</div>
          <div className="flex flex-col gap-1">
            {routes.map((route, i) => (
              <div
                key={`route-${i}`}
                className="flex flex-row items-center gap-2"
              >
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="text-[14px] font-normal">{route?.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="text-[14px] font-semibold">Available Cabs</div>
            {selectError && (
              <div className="bg-red-500 text-xs md:text-sm lg:text-sm text-white py-1 px-2 rounded-lg text-center animate-popOut">
                Please choose one cab
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {pricing?.length > 0
              ? pricing.map((price, i) => (
                  <div
                    key={`price-${i}`}
                    className="w-full flex flex-row items-start gap-2"
                  >
                    <div>
                      <div
                        id={price?.result_index}
                        onClick={handleSelectCab}
                        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                          selectedCab?.result_index == price?.result_index &&
                          selectedTripType === "roundtrip"
                            ? "border-black"
                            : "border-[#636366]"
                        } `}
                      >
                        {selectedCab?.result_index == price?.result_index &&
                          selectedTripType === "roundtrip" && (
                            <div
                              id={price?.result_index}
                              className="w-3 h-3 bg-black rounded-full"
                            ></div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <div className="text-[#636366] text-[14px] font-normal">
                        {price.transfer_details?.model_name ||
                          price.transfer_details?.type}
                        :{" "}
                        <span className="text-black font-bold">
                          {currency?.currency
                            ? currencySymbols?.[currency?.currency]
                            : "₹"}
                          {getIndianPrice(
                            Math.floor(price?.transfer_details?.total),
                          )}
                        </span>
                      </div>
                      {(viewDetails[i] || true) && (
                        <div className="text-sm">
                          <span className="font-semibold">Facilities: </span>
                          {price?.transfer_details?.seating_capacity
                            ? `${price.transfer_details.seating_capacity} Seats | `
                            : null}
                          {price?.transfer_details?.bag_capacity
                            ? `${price.cab.bagCapacity} Bags | `
                            : null}
                          {price?.cab?.bigBagCapaCity
                            ? `${price.cab.bigBagCapaCity} Big Bag Capacity | `
                            : null}
                          {price?.transfer_details?.fuel_type
                            ? ` Fuel Type ${price.transfer_details?.fuel_type}`
                            : null}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : "No Cabs Available"}
          </div>
        </div>

        {/* <div
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent
            checked={selectedTripType === 'roundtrip' && selectedCab}
            className="mb-1"
          />
          <label className="text-center cursor-pointer">
            {selectedTripType === 'roundtrip' && selectedCab ? "Selected" : "Select"}
          </label>
        </div> */}
      </div>
    </div>
  );
};

const MultiCityTripSuggestion = ({
  multiCitySuggestions,
  handleRoundTripSelect,
  selectedCab,
  setSelectedCab,
  selectedTripType,
  setSelectedTripType,
}) => {
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(multiCitySuggestions?.data?.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");
  const currency = useSelector((state) => state.currency);

  useEffect(() => {
    const routes = [];
    const pricing = [];
    multiCitySuggestions?.data?.trips?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);
    multiCitySuggestions?.data?.quotes?.forEach((quote) => {
      pricing.push(quote);
    });
    setPricing(pricing);
  }, [multiCitySuggestions]);

  const handleSelectCab = (cab) => {
    setSelectError(false);
    // Clear roundtrip selection and set trip type to multicity
    setSelectedTripType("multicity");
    setSelectedCab({
      ...cab,
      tripType: "multicity",
    });
    // Clear roundtrip selection and set trip type to multicity
    setSelectedTripType("multicity");
    setSelectedCab({
      ...cab,
      tripType: "multicity",
    });
  };

  const handleSelect = () => {
    if (selectedCab && selectedTripType === "multicity") {
      // Pass result_index as 0 for multicity
      handleRoundTripSelect(
        multiCitySuggestions?.trace_id,
        0,
        selectedCab.result_index,
      );
    } else {
      setSelectError(true);
    }
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4 ${
        selectedTripType === "multicity" ? "border-blue-300 bg-blue-50" : ""
      }`}
    >
      {isDesktop && (
        <div
          className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={"Taxi"}
            Instyle={{
              fontSize: "3rem",
              color: "black",
            }}
            classname={{ width: 80, height: 75 }}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          {!isDesktop && (
            <div
              className={`w-[60px] h-[60px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={"Taxi"}
                Instyle={{
                  fontSize: "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="text-[16px] font-medium">
              {multiCitySuggestions?.name}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {multiCitySuggestions?.data?.distance?.value} Kms
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold">Routes</div>
          <div className="flex flex-col gap-1">
            {routes.map((route, i) => (
              <div
                key={`route-${i}`}
                className="flex flex-row items-center gap-2"
              >
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="text-[14px] font-normal">{route?.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="text-[14px] font-semibold">Available Cabs</div>
            {selectError && (
              <div className="bg-red-500 text-xs md:text-sm lg:text-sm text-white py-1 px-2 rounded-lg text-center animate-popOut">
                Please choose one cab
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {pricing.map((price, i) => (
              <div
                key={`price-${i}`}
                className="w-full flex flex-row items-start gap-2"
              >
                <div>
                  <div
                    id={price?.result_index}
                    onClick={() => handleSelectCab(price)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      selectedCab?.result_index == price?.result_index &&
                      selectedTripType === "multicity"
                        ? "border-black"
                        : "border-[#636366]"
                    } `}
                  >
                    {selectedCab?.result_index == price?.result_index &&
                      selectedTripType === "multicity" && (
                        <div
                          id={price?.result_index}
                          className="w-3 h-3 bg-black rounded-full"
                        ></div>
                      )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-[#636366] text-[14px] font-normal">
                    {price?.taxi_category?.model_name ||
                      price?.taxi_category?.type}
                    :{" "}
                    <span className="text-black font-bold">
                      {currency?.currency
                        ? currencySymbols?.[currency?.currency]
                        : "₹"}
                      {getIndianPrice(Math.floor(price?.price?.total))}
                    </span>
                  </div>
                  {(viewDetails[i] || true) && (
                    <div className="text-sm">
                      <span className="font-semibold">Facilities: </span>
                      {price?.taxi_category?.seating_capacity
                        ? `${price.taxi_category.seating_capacity} Seats | `
                        : null}
                      {price?.taxi_category?.bag_capacity
                        ? `${price.taxi_category.bag_capacity} Bags | `
                        : null}
                      {price?.taxi_category?.bigBagCapaCity
                        ? `${price.taxi_category.bigBagCapaCity} Big Bag Capacity | `
                        : null}
                      {price?.taxi_category?.fuel_type
                        ? ` Fuel Type: ${price.taxi_category?.fuel_type}`
                        : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent
            checked={selectedTripType === 'multicity' && selectedCab}
            className="mb-1"
          />
          <label className="text-center cursor-pointer">
            {selectedTripType === 'multicity' && selectedCab ? "Selected" : "Select"}
          </label>
        </div> */}
      </div>
    </div>
  );
};

const EstimatedCost = ({ cost }) => {
  const estimatedCost = getIndianPrice(Math.floor(cost));

  if (estimatedCost !== "NaN" && parseInt(estimatedCost) > 0) {
    return (
      <>
        <div className="text-[13px] font-[300] leading-3">Starting from</div>
        <div className="text-[18px] font-[800] leading-3">
          <span>₹ {estimatedCost}</span>
        </div>
      </>
    );
  }

  return null;
};

const SelectButton = ({
  multimode,
  transferIndex,
  transfer,
  handleSelect,
  setSelectedMercuryTransfer,
  isRouteSelected,
  setIsRouteSelected,
}) => {
  //setSelectedMercuryTransfer(transfer);
  const getLabel = () => {
    switch (transfer.mode) {
      case "Flight":
        return "Search Flights";
      case "Taxi":
        return "Search Taxis";
      default:
        return `Select a ${transfer.mode}`;
    }
  };

  return (
    <div className="group text-blue flex flex-row items-center cursor-pointer hover:translate-x-1 transition-all">
      <button
        onClick={() =>
          handleSelect(transferIndex, transfer, multimode, transfer?.mode)
        }
        className="focus:outline-none"
      >
        {getLabel()}
      </button>

      <RiArrowRightSLine className="text-xl group-hover:scale-110 group-hover:translate-x-1 transition-all" />
    </div>
  );
};

const TransferItem = ({ transfer, transferIndex }) => {
  const getHours = () => {
    const from = Math.floor(transfer.duration / 60);
    const to = Math.ceil(transfer.duration / 60);

    if (from) {
      return `${from}-${to} hours`;
    }

    return `${to} hour`;
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-lg font-[500] leading-3">{transfer.text}</div>
      <div className="text-sm text-gray-400">
        {transfer?.duration && `${getHours()} | `}
        {transfer?.distance && `${transfer.distance} Kms`}
      </div>

      <div className="w-full">
        {transfer?.facilities?.length ? (
          <div className="text-sm">
            Facilities:{" "}
            {transfer.facilities?.map((facility, ind) => (
              <span key={ind}>
                <span>{facility}</span>
                {ind < transfer.facilities.length - 1 && " | "}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Heading = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  line-height: 1;
`;

const Location = styled.p`
  font-size: 13px;
  font-weight: 400;
  margin: 0;
`;

const IconHeading = styled.p`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const Text = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
  color: rgba(91, 89, 89, 1);
`;

export const IText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const ModelText = styled.div`
  font-size: 0.8rem;
  color: #888080;
  font-weight: 300;
  margin: 0 0 0.5rem 0;
`;

const Cost = styled.p`
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin: 0;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const formatPriceWithComma = (price) => {
  if (!price) return "0";
  return price.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const OtherTransfer = ({
  getPaymentHandler,
  setShowOtherTrasfer,
  selectedResult,
  setSelectedResult,
  number_of_travellers,
  check_in,
  showOtherTransfer,
  mercuryTransfer,
  currentModeDepartureDate,
  currentModeDepartureTime,
  selectedBooking,
  setSelectedBooking,
  transferIndex,
  setSelectedData,
  currentStep,
  handleSelect,
  transfer,
  totalSteps,
  hideDrawer,
  token,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  oCityData,
  dCityData,
  city,
  dcity,
  mercury,
  booking_id,
  mode,
  name,
}) => {
  const ref = useRef(null);
  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherTransfer, setOtherTransfer] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loadingOptionId, setLoadingOptionId] = useState(null);

  const [dynamicTransferData, setDynamicTransferData] = useState({});
  const [loadingTransfers, setLoadingTransfers] = useState({});
  const [lastPaxState, setLastPaxState] = useState(null);
  const [lastTimeState, setLastTimeState] = useState(null);
  const [lastDateState, setLastDateState] = useState(null);

  // ADD: Flags to prevent multiple API calls
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [loadingRequestKey, setLoadingRequestKey] = useState(null);
  const abortControllerRef = useRef(null);

  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);
  const [showPax, setShowPax] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [localSelectedData, setLocalSelectedData] = useState([]);
  const [isResultSelected, setIsResultSelected] = useState(false);
  const itinerary_id = useSelector((state) => state.ItineraryId);

  // Initialize with props values directly
  const [departureTime, setDepartureTime] = useState(currentModeDepartureTime);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState(currentModeDepartureDate);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [isProcessingWarning, setIsProcessingWarning] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const hasInitialLoadRef = useRef(new Set());

  const [lastRequestData, setLastRequestData] = useState(null);
  const { trackTransferBookingAdd } = useAnalytics();
  const { intercity } = useSelector(
    (state) => state.TransferBookings,
  )?.transferBookings;
  const currency = useSelector((state) => state.currency);

  const [pax, setPax] = useState({
    adults: selectedBooking?.pax?.number_of_adults
      ? selectedBooking.pax.number_of_adults
      : number_of_adults,
    children: selectedBooking?.pax?.number_of_children
      ? selectedBooking.pax.number_of_children
      : number_of_children,
    infants: selectedBooking?.pax?.number_of_infants
      ? selectedBooking.pax.number_of_infants
      : number_of_infants,
  });

  const [expandedTransfers, setExpandedTransfers] = useState({});

const toggleTransferDetails = (priceOptionId) => {
  setExpandedTransfers(prev => ({
    ...prev,
    [priceOptionId]: !prev[priceOptionId]
  }));
};

  useEffect(() => {
    if (selectedResult?.transfer?.id) {
      const currentTransferId = otherTransfer?.id;
      const newTransferId = selectedResult.transfer.id;

      // Clear immediately if it's a different transfer
      if (currentTransferId !== newTransferId) {
        setOtherTransfer(null);
        setError(null);
        setIsResultSelected(false);
        setLocalSelectedData([]);
        setLoadingRequestKey(null);
      }
    }
  }, [selectedResult?.transfer?.id, otherTransfer?.id]);

  // FIXED: Update state when props change with proper guards
  useEffect(() => {
    if (
      currentModeDepartureDate &&
      currentModeDepartureDate !== departureDate &&
      !isBookingInProgress
    ) {
      setDepartureDate(currentModeDepartureDate);
    }
  }, [currentModeDepartureDate, isBookingInProgress]);

  useEffect(() => {
    if (
      currentModeDepartureTime &&
      currentModeDepartureTime !== departureTime &&
      !isBookingInProgress
    ) {
      setDepartureTime(currentModeDepartureTime);
    }
  }, [currentModeDepartureTime, isBookingInProgress]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour % 12 || 12;
        const period = hour < 12 ? "AM" : "PM";
        const formattedHour = hour12.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const display = `${formattedHour}:${formattedMinute} ${period}`;
        const value = `${hour.toString().padStart(2, "0")}:${formattedMinute}`;

        options.push({ display, value });
      }
    }
    return options;
  };

  const handleDateChange = (event) => {
    if (isBookingInProgress) return;
    const selectedDate = dayjs(event.target.value).format("YYYY-MM-DD");
    setDepartureDate(selectedDate);
  };

  const timeOptions = generateTimeOptions();

  // FIXED: Add request deduplication and abort previous requests
  const loadTransfers = useCallback(
    async (transferData, paxData, departureDateTime) => {
      if (!transferData?.id) return;

      const transferKey = `${transferData.id}-${currentStep}`;
      const requestKey = `${transferKey}-${departureDateTime}-${JSON.stringify(
        paxData,
      )}`;

      // Prevent duplicate requests
      if (loadingRequestKey === requestKey) {
        return;
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setOtherTransfer(null);

      setLoadingRequestKey(requestKey);
      setLoadingTransfers((prev) => ({ ...prev, [transferKey]: true }));
      setError(null);

      try {
        const requestBody = {
          edge_id: transferData.id,
          start_datetime: departureDateTime,
          number_of_adults: paxData.adults,
          number_of_children: paxData.children,
          number_of_infants: paxData.infants,
        };

        const response = await loadOtherTransfers.post(
          `/search/?currency=${currency?.currency || "INR"}`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: abortControllerRef.current.signal,
          },
        );

        const data = response.data;

        if (data.success && data.data) {
          setTraceId(data.trace_id);
          setDynamicTransferData((prev) => ({
            ...prev,
            [transferKey]: data.data,
          }));
          setOtherTransfer(data.data);
          setError(null);
        } else {
          const errorMessage =
            data?.errors?.[0]?.message?.[0] ||
            data?.message ||
            "No transfer options available";
          setError(errorMessage);

          setDynamicTransferData((prev) => {
            const newData = { ...prev };
            delete newData[transferKey];
            return newData;
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Error loading transfers:", error);
        const errorMsg =
          error?.response?.data?.errors?.[0]?.message?.[0] ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load transfer options";
        setError(errorMsg);

        setDynamicTransferData((prev) => {
          const newData = { ...prev };
          delete newData[transferKey];
          return newData;
        });
      } finally {
        setLoadingTransfers((prev) => ({ ...prev, [transferKey]: false }));
        setLoadingRequestKey(null);
      }
    },
    [token, currentStep],
  );

  useEffect(() => {
    // Don't proceed if transfer hasn't loaded yet or if booking is in progress
    if (!selectedResult?.transfer?.id || isBookingInProgress) return;

    const transferId = selectedResult.transfer.id;
    const finalDate = departureDate || currentModeDepartureDate;
    const finalTime = departureTime || currentModeDepartureTime;

    if (!finalDate || !finalTime) return;

    const timeoutId = setTimeout(() => {
      const currentPaxString = JSON.stringify(pax);
      const paxChanged = lastPaxState && lastPaxState !== currentPaxString;
      const timeChanged = lastTimeState && lastTimeState !== departureTime;
      const dateChanged = lastDateState && lastDateState !== departureDate;

      // Check if this is the first load for this specific transfer
      const isFirstLoadForTransfer = !hasInitialLoadRef.current.has(transferId);

      // Determine if we should call the API
      const shouldCallApi =
        isFirstLoadForTransfer || // First time loading this transfer
        ((paxChanged || timeChanged || dateChanged) && // Something changed
          !isResultSelected && // Not already selected
          !loadingRequestKey); // Not already loading

      if (shouldCallApi) {
        const departureDateTime = `${finalDate}T${finalTime}:00`;
        loadTransfers(selectedResult.transfer, pax, departureDateTime);

        // Mark this transfer as loaded
        if (isFirstLoadForTransfer) {
          hasInitialLoadRef.current.add(transferId);
        }
      }

      // Update last states
      setLastPaxState(currentPaxString);
      setLastTimeState(departureTime);
      setLastDateState(departureDate);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    pax,
    departureTime,
    departureDate,
    selectedResult?.transfer?.id,
    currentModeDepartureDate,
    currentModeDepartureTime,
    isResultSelected,
    isBookingInProgress,
    loadingRequestKey,
  ]);

  // Reset tracking when going back to index 0 or when transfer changes
  useEffect(() => {
    if (currentStep === 0 || !selectedResult?.transfer) {
      // Clear the tracking when going back to step 0
      hasInitialLoadRef.current.clear();
      setLastPaxState(null);
      setLastTimeState(null);
      setLastDateState(null);
    }
  }, [currentStep, selectedResult?.transfer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (setSelectedData && Array.isArray(transfer)) {
      const initialData = Array(transfer.length).fill(undefined);

      if (selectedResult) {
        const index = currentStep - 1;
        initialData[index] = selectedResult;
      }

      setLocalSelectedData(initialData);
    }
  }, []);

  useEffect(() => {
    if (selectedResult) {
      setSelectedResult(selectedResult);
      // getOtherTrasfer(selectedResult?.transfer);
    }

    if (selectedResult?.selectedPrice) {
      const index = currentStep - 1;

      if (setSelectedData) {
        setSelectedData((prev) => {
          const newData = Array.isArray(prev) ? [...prev] : [];
          newData[index] = selectedResult;
          return newData;
        });

        setLocalSelectedData((prev) => {
          const newData = Array.isArray(prev) ? [...prev] : [];
          newData[index] = selectedResult;
          return newData;
        });
      }
    }
  }, [selectedResult]);

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (ref.current && !ref.current.contains(e.target)) {
      setShowOtherTrasfer(false);
    }
  };

  const handleSelectPrice = (index) => {
    setSelectedResult((prev) => {
      return {
        ...prev,
        trace_id: traceId,
        result_index: otherTransfer.prices[index].result_index,
      };
    });

    setShowOtherTrasfer(false);
  };

  const getOtherTrasfer = (transfer) => {
    setLoading(false);
    setOtherTransfer(transfer);
  };

  const isPriceOptionSelected = (
    transferId,
    priceIndexOrResultIndex,
    omiopriceIndex,
  ) => {
    const currentSelection = localSelectedData[currentStep - 1];
    if (!currentSelection) return false;

    // Omio path: 3 args (transferId, resultIndex, priceIndex)
    if (omiopriceIndex !== undefined) {
      return (
        currentSelection.id === transferId &&
        currentSelection.selectedOmioResultIndex === priceIndexOrResultIndex &&
        currentSelection.selectedPrice?.result_index ===
          currentSelection.selectedOmioResult?.prices?.[omiopriceIndex]
            ?.result_index
      );
    }

    // Self / non-Omio path: 2 args (transferId, priceIndex)
    return (
      currentSelection.id === transferId &&
      currentSelection.selectedPrice?.result_index === priceIndexOrResultIndex
    );
  };

  const handleUpdateTransfer = async () => {
    handleUpdateTransferWithData(localSelectedData);
  };

  // FIXED: Add guards to prevent multiple simultaneous booking calls
  const handleModeSelect = (index, priceOptionId, selectedPriceData, mode) => {
    if (updateLoading || isBookingInProgress) {
      return;
    }

    const [transferId, priceIndex] = priceOptionId.split("-");

    const isDeselecting = isPriceOptionSelected(
      selectedPriceData.id,
      parseInt(priceIndex),
    );

    setLoadingOptionId(priceOptionId);

    if (isDeselecting) {
      setLocalSelectedData((prev) => {
        const newData = [...prev];
        newData[index] = undefined;
        return newData;
      });

      if (setSelectedData) {
        setSelectedData((prev) => {
          const newData = [...prev];
          newData[index] = undefined;
          return newData;
        });
      }

      setLoadingOptionId(null);

      if (handleSelect) {
        handleSelect(transferIndex, null, transfer, mode);
      }
    } else {
      const newLocalData = [...localSelectedData];
      newLocalData[index] = selectedPriceData;
      setLocalSelectedData(newLocalData);

      if (setSelectedData) {
        const newParentData = Array.isArray(setSelectedData)
          ? [...setSelectedData]
          : [];
        newParentData[index] = selectedPriceData;
        setSelectedData(newParentData);
      }

      if (handleSelect) {
        handleSelect(transferIndex, selectedPriceData, transfer, mode);
      }

      // FIXED: Use setTimeout to prevent immediate execution during state updates
      setTimeout(() => {
        if (!isBookingInProgress) {
          handleUpdateTransferWithData(newLocalData);
        }
      }, 100);
    }
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  const handleTimeSelect = (time) => {
    if (isBookingInProgress) return;
    setDepartureTime(time.value);
    setShowTimeDropdown(false);
  };

  const buildRequestPayload = (updatedData, newTime = null, newDate = null) => {
    if (!Array.isArray(transfer) || transfer.length === 0) {
      throw new Error("Transfer data is missing");
    }

    const transfersPayload = updatedData
      .filter(Boolean)
      .map((item, arrayIndex) => {
        const transferItem = transfer[arrayIndex] || transfer[0];

        if (!transferItem) {
          console.error(`Transfer item for index ${arrayIndex} is missing`);
          return null;
        }

        const transferObj = {
          booking_type: transferItem.mode,
          edge_id: transferItem.id,
          // booking_source: transferItem.booking_source || "Self",
        };

        if (transferItem.mode === "Flight") {
          return {
            ...transferObj,
            result_index: item.resultIndex || item.result_index || 0,
            trace_id:
              item?.trace_id || localStorage.getItem("Travclan_trace_id") || "",
          };
        } else if (transferItem.mode === "Taxi") {
          return {
            ...transferObj,
            trace_id: item.trace_id || traceId,
            result_index: item.result_index || 0,
            source: item.source || "",
          };
        } else {
          const isOmio = !!item.selectedOmioResult;

          if (isOmio) {
            // 12go-Omio single booking payload
            return {
              ...transferObj,
              source: item?.booking_source || "Omio",
              trace_id: item.trace_id || traceId,
              price_result_index: item.selectedPrice?.result_index || null,
              segment_result_index:
                item.selectedOmioResult?.result_index || null,
            };
          }

          return {
            ...transferObj,
            source: "Self",
            price_result_index: item.selectedPrice?.result_index || 0,
            segment_result_index: null,
            trace_id: item.trace_id || traceId,
          };
        }
      })
      .filter(Boolean);

    if (transfersPayload.length === 0 && !newTime && !newDate) {
      throw new Error("No valid transfer options selected");
    }

    const dateToUse = newDate || departureDate || currentModeDepartureDate;
    const timeToUse = newTime || departureTime || currentModeDepartureTime;

    const requestBody = {
      destination_itinerary_city: destination_itinerary_city_id
        ? destination_itinerary_city_id
        : null,
      source_itinerary_city: origin_itinerary_city_id
        ? origin_itinerary_city_id
        : null,
      number_of_adults: pax.adults,
      number_of_children: pax.children,
      number_of_infants: pax.infants,
      start_datetime: `${dateToUse}T${timeToUse}:00`,
      transfers: transfersPayload,
    };

    if (selectedBooking?.id || booking_id) {
      requestBody.booking_id = selectedBooking.id || booking_id;
    }

    return requestBody;
  };

  const handleUpdateTransferWithData = async (
    updatedData,
    newTime = null,
    newDate = null,
  ) => {
    // Prevent multiple simultaneous booking calls
    if (isBookingInProgress) {
      return;
    }

    try {
      const newRequestBody = buildRequestPayload(updatedData, newTime, newDate);

      // Enhanced duplicate request prevention
      if (
        lastRequestData &&
        newTime === null &&
        newDate === null &&
        JSON.stringify(lastRequestData.transfers) ===
          JSON.stringify(newRequestBody.transfers) &&
        lastRequestData.start_datetime === newRequestBody.start_datetime &&
        (lastRequestData.number_of_adults !== newRequestBody.number_of_adults ||
          lastRequestData.number_of_children !==
            newRequestBody.number_of_children ||
          lastRequestData.number_of_infants !==
            newRequestBody.number_of_infants)
      ) {
        setLastRequestData(newRequestBody);
        return;
      }

      // Set flags to prevent duplicate calls
      setIsBookingInProgress(true);
      setUpdateLoading(true);
      setIsProcessingWarning(true);

      try {
        // Call warning API
        const warningResponse = await updateFlightBookingWarning.post(
          `${itinerary_id}/transfers/${mode?.toLowerCase()}/warning/`,
          newRequestBody,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (warningResponse?.data?.show_warning === true) {
          // Show warning modal
          setWarningMessage(
            warningResponse.data.warning || "Please confirm this action.",
          );
          setPendingBookingData({
            requestBody: newRequestBody,
            newTime,
            newDate,
          });
          setShowWarningModal(true);
          setIsProcessingWarning(false);
        } else {
          // Proceed directly with booking
          setIsProcessingWarning(false);
          await handleBookingConfirm(newRequestBody, newTime, newDate);
        }
      } catch (error) {
        setIsProcessingWarning(false);
        setIsBookingInProgress(false);
        setUpdateLoading(false);
        console.error("Warning API failed:", error);

        let errorMsg = "Warning check failed. Please try again.";
        if (error?.response?.data) {
          if (error.response.data.errors?.[0]?.message?.[0]) {
            errorMsg = error.response.data.errors[0].message[0];
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (typeof error.response.data === "string") {
            errorMsg = error.response.data;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }

        dispatch(
          openNotification({
            text: errorMsg,
            heading: "Error!",
            type: "error",
          }),
        );
      }

      setLastRequestData(newRequestBody);
    } catch (error) {
      console.error("Error building request payload:", error);
      setUpdateLoading(false);
      setIsBookingInProgress(false);
      setLoadingOptionId(null);
      dispatch(
        openNotification({
          text: error.message || "Failed to update transfer booking",
          heading: "Error!",
          type: "error",
        }),
      );
    }
  };

  const handleBookingConfirm = async (
    newRequestBody,
    newTime = null,
    newDate = null,
  ) => {
    setIsProcessingBooking(true);

    let requestPayload;

    requestPayload = {
      source: newRequestBody.transfers[0]?.source || "Self",
      destination_itinerary_city: newRequestBody.destination_itinerary_city,
      source_itinerary_city: newRequestBody.source_itinerary_city,
      edge: newRequestBody.transfers[0]?.edge_id,
      trace_id: newRequestBody.transfers[0]?.trace_id || traceId,
      price_result_index: newRequestBody.transfers[0]?.price_result_index || 0,
      segment_result_index:
        newRequestBody.transfers[0]?.segment_result_index || null,
    };

    if (newRequestBody.booking_id || booking_id) {
      requestPayload.booking_id = newRequestBody.booking_id || booking_id;
    }

    try {
      const response = await UpdateTransferMode.post(
        `${itinerary_id}/bookings/${otherTransfer?.mode?.toLowerCase()}/`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setUpdateLoading(false);
      setIsBookingInProgress(false);
      setIsProcessingBooking(false);
      setIsResultSelected(true);

      dispatch(
        updateSingleTransferBooking(
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
          response.data,
        ),
      );

      trackTransferBookingAdd(
        itinerary_id,
        `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
        intercity?.[
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`
        ],
        response.data,
        city || transfer[0]?.source?.city_name,
        dcity || transfer[0]?.destination?.city_name,
      );

      getPaymentHandler();

      if (!newTime && !newDate) {
        hideDrawer();

        dispatch(
          openNotification({
            text: `Transfer from ${city || transfer[0]?.source?.city_name} to ${
              dcity || transfer[0]?.destination?.city_name
            } has been updated successfully!`,
            heading: "Success!",
            type: "success",
          }),
        );

        if (response.data?.is_refresh_needed) {
          const url = new URL(window.location);
          const drawerParams = [
            "drawer",
            "booking_id",
            "flight_modal",
            "modal",
            "edit",
          ];
          drawerParams.forEach((param) => {
            url.searchParams.delete(param);
          });

          window.history.replaceState({}, "", url.toString());
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      } else {
        const message = newDate
          ? "Departure date updated successfully!"
          : "Departure time updated successfully!";
        dispatch(
          openNotification({
            text: message,
            heading: "Success!",
            type: "success",
          }),
        );
      }

      setLoadingOptionId(null);
    } catch (error) {
      console.error("Booking API failed:", error);
      setUpdateLoading(false);
      setIsBookingInProgress(false);
      setIsProcessingBooking(false);
      setLoadingOptionId(null);

      let errorMessage = "Failed to update transfer. Please try again.";
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMessage = error.response.data.errors[0].message[0];
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(
        openNotification({
          text: errorMessage,
          heading: "Error!",
          type: "error",
        }),
      );
    }
  };

  const handleWarningConfirm = async () => {
    if (pendingBookingData && !isProcessingBooking) {
      setShowWarningModal(false);
      await handleBookingConfirm(
        pendingBookingData.requestBody,
        pendingBookingData.newTime,
        pendingBookingData.newDate,
      );
      setPendingBookingData(null);
    }
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
    setWarningMessage("");
    setPendingBookingData(null);

    // Deselect the current selection
    setLocalSelectedData((prev) => {
      const newData = [...prev];
      newData[currentStep - 1] = undefined;
      return newData;
    });

    if (setSelectedData) {
      setSelectedData((prev) => {
        const newData = [...prev];
        newData[currentStep - 1] = undefined;
        return newData;
      });
    }

    // Reset all loading states
    setUpdateLoading(false);
    setIsBookingInProgress(false);
    setLoadingOptionId(null);
    setIsProcessingWarning(false);
    setIsProcessingBooking(false);
  };

  const formatTimeForDisplay = (timeValue) => {
    if (!timeValue) return "";

    const timeOption = timeOptions.find((option) => option.value === timeValue);
    if (timeOption) {
      return timeOption.display;
    }

    const [hours, minutes] = timeValue.split(":");
    const hour = parseInt(hours, 10);
    const hour12 = hour % 12 || 12;
    const period = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes} ${period}`;
  };

  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "";
    const date = dayjs(dateValue);
    return date.format("MMM DD, YYYY");
  };

  const handlePaxChange = (newPax) => {
    if (isBookingInProgress) return;
    setPax(newPax);
  };

  const getCurrentTransferKey = () => {
    return otherTransfer?.id ? `${otherTransfer.id}-${currentStep}` : null;
  };

  const isCurrentTransferLoading = () => {
    const transferKey = getCurrentTransferKey();
    return transferKey ? loadingTransfers[transferKey] : false;
  };

  const retryLoadTransfers = () => {
    if (isBookingInProgress) return;

    if (otherTransfer || Object.keys(dynamicTransferData).length > 0) {
      setError(null);
      const finalDate = departureDate || currentModeDepartureDate;
      const finalTime = departureTime || currentModeDepartureTime;

      if (finalDate && finalTime) {
        const departureDateTime = `${finalDate}T${finalTime}:00`;
        const transferToUse =
          otherTransfer || Object.values(dynamicTransferData)[0];
        loadTransfers(transferToUse, pax, departureDateTime);
      }
    }
  };

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Container>
      {showWarningModal &&
        ReactDOM.createPortal(
          <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">
              <div className="md:hidden flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {!isProcessingBooking && (
                <button
                  onClick={handleWarningCancel}
                  className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                >
                  <FaX size={16} />
                </button>
              )}

              <div className="px-6 pb-6 pt-2 md:pt-6 max-h-[calc(90vh-8rem)] md:max-h-none overflow-y-auto">
                <h2 className="text-xl font-semibold mb-1 pr-8">
                  Transfer Update Warning!
                </h2>

                <div className="text-gray-700 mb-6">
                  <div className="rounded-lg p-2">{warningMessage}</div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end border-t-2 pt-4">
                  <button
                    onClick={handleWarningCancel}
                    disabled={isProcessingBooking}
                    className="w-full md:w-auto px-6 py-2 md:py-2 text-gray-600 border rounded hover:bg-gray-50 transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessingBooking}
                    onClick={handleWarningConfirm}
                    className="w-full md:w-auto px-6 py-2 md:py-2 bg-[#07213A] text-white rounded hover:bg-[#0a2942] transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    {isProcessingBooking ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      <div className="w-full">
        <div>
          <div className="text-xl font-600 leading-2xl mb-md"> {name}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          {/* Date Dropdown */}
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">
              Departure Date:
            </label>
            <DatePicker
              id="departureDate"
              date={departureDate || currentModeDepartureDate}
              defaultDate={currentModeDepartureDate}
              onDateChange={handleDateChange}
              isOutsideRange={() => false}
              enableOutsideDays={true}
              disabled={isBookingInProgress}
            />
          </div>

          {/* Time Dropdown */}
          <div
            className="time-dropdown-container relative w-full sm:w-auto"
            ref={ref}
          >
            <div className="text-sm font-medium text-gray-700 mb-2">
              Departure Time
            </div>
            <div
              className={`flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50 ${
                isBookingInProgress ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                !isBookingInProgress && setShowTimeDropdown((prev) => !prev)
              }
            >
              <span className="text-sm font-medium">
                {formatTimeForDisplay(departureTime)}
              </span>
              <button>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            {showTimeDropdown && !isBookingInProgress && (
              <div className="absolute right-0 z-[15] mt-1 w-48 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {timeOptions.map((time, index) => (
                  <div
                    key={index}
                    className={`p-2 hover:bg-gray-100 cursor-pointer text-sm
                      ${
                        time.value === departureTime
                          ? "bg-yellow-100 font-medium"
                          : ""
                      }
                    `}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time.display}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end ">
          <Pax
            setShowPax={setShowPax}
            pax={pax}
            setPax={handlePaxChange}
            showPax={showPax}
            combo={true}
            disabled={isBookingInProgress}
          />
        </div>
      </div>

      {/* Loading indicator for dynamic transfer loading */}
      {(isCurrentTransferLoading() ||
        (!otherTransfer && !error && selectedResult?.transfer?.id)) && (
        <div className="flex justify-center items-center py-8">
          <PulseLoader size={10} speedMultiplier={0.8} color="#3B82F6" />
          <span className="ml-3 text-sm text-gray-600">
            Loading transfer options...
          </span>
        </div>
      )}

      {/* Error message display */}
      {error && !isCurrentTransferLoading() && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <div className="text-red-600 font-medium mb-1">
              Error Loading Transfers
            </div>
            <div className="text-gray-600 text-sm mb-3">{error}</div>
            <button
              onClick={retryLoadTransfers}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm disabled:opacity-50"
              disabled={isBookingInProgress}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Transfer options display */}
      {otherTransfer &&
        !isCurrentTransferLoading() &&
        !loadingRequestKey &&
        !error &&
        selectedResult?.transfer?.id === otherTransfer.id &&
        (() => {
          const hasOmioResults =
            otherTransfer.results && otherTransfer.results.length > 0;

      if (hasOmioResults) {
  // ─── OMIO RESULTS RENDERING ───
  return otherTransfer.results.map((result, resultIndex) => {
    const resultPrices = result.prices || [];
    return resultPrices.map((priceOption, priceIndex) => {
      const price = priceOption.price || 0;
      const formattedPrice = formatPriceWithComma(price);
      const transfer_currency = currency?.currency
        ? currencySymbols?.[currency?.currency]
        : "₹";
      const priceOptionId = `${otherTransfer.id}-${resultIndex}-${priceIndex}`;
      const isOptionSelected = isPriceOptionSelected(
        otherTransfer.id,
        resultIndex,
        priceIndex,
      );
      const isOptionLoading = loadingOptionId === priceOptionId;
      const departureInfo = result.departure_datetime
        ? dayjs(result.departure_datetime)
        : null;
      const arrivalInfo = result.arrival_datetime
        ? dayjs(result.arrival_datetime)
        : null;
      const segments = result.segments || [];
      const operators = result.operator || [];
      const isExpanded = expandedTransfers[priceOptionId] || false;

      return (
        <div
          key={priceOptionId}
          className={`flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite relative mt-md
            ${isOptionSelected ? "border-blue-500 bg-blue-50" : ""}
            ${isBookingInProgress && !isOptionLoading ? "opacity-50" : ""}`}
        >
          <div className="flex justify-between max-ph:flex-col">
            <div className="w-full">
              {/* Header: operator + class */}
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-xs">
                  {operators.map(
                    (op, opIdx) =>
                      op.image && (
                        <img
                          key={opIdx}
                          src={op.image}
                          alt={op.name}
                          className="h-5 w-auto object-contain"
                        />
                      ),
                  )}
                  <span className="text-sm font-500 text-text-spacegrey">
                    {operators.map((op) => op.name).join(" | ")}
                  </span>
                </div>
                {priceOption.class_name && (
                  <span className="text-xs font-500 bg-gray-100 px-xs py-[2px] rounded-md text-text-spacegrey">
                    {priceOption.class_name}
                  </span>
                )}
              </div>

              {/* Main departure → arrival timeline */}
              {departureInfo && arrivalInfo && (
                <div className="flex items-center justify-between mt-md mr-2xl max-ph:mr-zero max-ph:mb-md">
                  <div className="flex flex-col gap-xs shrink-0">
                    <span className="text-sm font-400 leading-lg-md">
                      {departureInfo.format("ddd, MMM D")}
                    </span>
                    <span className="text-md-lg font-600 leading-lg-md">
                      {departureInfo.format("h:mm A")}
                    </span>
                    <span className="text-sm font-400 leading-lg-md truncate max-w-[75px] md:max-w-[140px]">
                      {result.source?.name ||
                        otherTransfer.source?.city_name}
                    </span>
                  </div>

                  <div className="flex items-center flex-1 mx-md relative">
                    <div className="w-full border-b-[2px] border-black [border-style:dashed] [border-image:repeating-linear-gradient(to_right,#6E757A_0_6px,transparent_6px_12px)_1]"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center px-1 gap-1">
                      <span className="text-sm font-400 leading-tight">
                        {result.duration_formatted ||
                          `${Math.floor(result.duration / 60)}h ${result.duration % 60}m`}
                      </span>
                      <div className="bg-primary-indigo rounded-full w-[26px] h-[26px] flex items-center justify-center flex-shrink-0">
                        {getModeIcon(otherTransfer.mode, 13)}
                      </div>
                      <span className="text-sm font-400 leading-tight">
                        {otherTransfer.distance} Km
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs shrink-0">
                    <span className="text-sm font-400 leading-lg-md">
                      {arrivalInfo.format("ddd, MMM D")}
                    </span>
                    <span className="text-md-lg font-600 leading-lg-md">
                      {arrivalInfo.format("h:mm A")}
                    </span>
                    <span className="text-sm font-400 leading-lg-md truncate max-w-[75px] md:max-w-[140px]">
                      {result.destination?.name ||
                        otherTransfer.destination?.city_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Transfer Details Button */}
              {segments.length >=1 && (
                <div 
                  className="flex items-center gap-2 mt-md cursor-pointer"
                  onClick={() => toggleTransferDetails(priceOptionId)}
                >
                  <div className="bg-[#07213A] text-white rounded-full px-3 py-1 flex items-center gap-2 text-xs md:text-[14px] font-500">
                    <span className="">
                      Details
                      {/* {segments.length - 1 > 0 ? `${segments.length - 1} ` : ''}
                      Transfer{segments.length > 2 ? 's' : ''} */}
                    </span>
                    {isExpanded ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Segments breakdown */}
              {segments.length >= 1 && isExpanded && (
                <div className="mt-md border-t border-text-disabled pt-md">
                  <div className="flex flex-col gap-2">
                    {segments.map((seg, segIdx) => {
                      const segDep = seg.departure_datetime
                        ? dayjs(seg.departure_datetime)
                        : null;
                      const segArr = seg.arrival_datetime
                        ? dayjs(seg.arrival_datetime)
                        : null;
                      const isLastSegment = segIdx === segments.length - 1;

                      return (
                        <div key={segIdx}>
                          {/* Departure Row */}
                          <div className="flex flex-row items-start gap-3">
                            {/* Time column */}
                            <div className="flex flex-col items-end w-[68px] shrink-0 pt-1">
                              {segDep && (
                                <span className="text-sm font-600 leading-tight">
                                  {segDep.format("h:mm A")}
                                </span>
                              )}
                            </div>

                            {/* Dot column */}
                            <div className="flex flex-col items-center shrink-0 pt-1">
                              <div className="w-3 h-3 rounded-full border-2 border-primary-indigo bg-white"></div>
                            </div>

                            {/* Station info column */}
                            <div className="flex-1 min-w-0">
                              <span
                                className="text-sm font-600 text-gray-900 block truncate"
                                title={seg.departure_station?.name}
                              >
                                {seg.departure_station?.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                {seg.operator?.name && (
                                  <span>{seg.operator.name}</span>
                                )}
                                {seg.vehicle_number && (
                                  <>
                                    {seg.operator?.name && <span>|</span>}
                                    <span>{seg.vehicle_number}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Journey Line with Duration */}
                          <div className="flex flex-row items-start gap-3">
                            {/* Time column - empty */}
                            <div className="w-[68px] shrink-0 items-end mr-1"></div>

                            {/* Vertical line column - aligned with dots */}
                            <div className="flex flex-col items-center shrink-0">
                              <div
                                className="w-[2px] bg-gray-300"
                                style={{ height: "40px" }}
                              ></div>
                            </div>

                            {/* Duration info */}
                            <div className="pt-2">
                              <span className="text-xs text-gray-500">
                                {seg.duration_formatted ||
                                  `${Math.floor(seg.duration / 60)}h ${seg.duration % 60}m`}
                              </span>
                            </div>
                          </div>

                          {/* Arrival Row */}
                          {segArr && (
                            <div className="flex flex-row items-start gap-3">
                              {/* Time column */}
                              <div className="flex flex-col items-end w-[68px] shrink-0 pt-1">
                                <span className="text-sm font-600 leading-tight">
                                  {segArr.format("h:mm A")}
                                </span>
                              </div>

                              {/* Dot column */}
                              <div className="flex flex-col items-center shrink-0 pt-1">
                                <div className="w-3 h-3 rounded-full border-2 border-primary-indigo bg-white"></div>
                              </div>

                              {/* Station info column */}
                              <div className="flex-1 min-w-0">
                                <span
                                  className="text-sm font-600 text-gray-900 block truncate"
                                  title={seg.arrival_station?.name}
                                >
                                  {seg.arrival_station?.name}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Connection/Layover indicator */}
                          {!isLastSegment && segments[segIdx + 1] && (
                            <div className="flex flex-row items-center gap-3 mt-3 mb-3">
                              {/* Time column - empty */}
                              <div className="w-[68px] shrink-0 mr-1"></div>

                              {/* Vertical line column */}
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-[2px] h-4 bg-gray-300"></div>
                              </div>

                              {/* Transfer badge */}
                              <div className="flex flex-row items-center gap-2 bg-[#07213A] text-white px-3 py-1.5 rounded-md">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span className="text-xs font-500">
                                  Transfer, {(() => {
                                    const layover = dayjs(
                                      segments[segIdx + 1].departure_datetime,
                                    ).diff(
                                      dayjs(seg.arrival_datetime),
                                      "minute",
                                    );
                                    const h = Math.floor(layover / 60);
                                    const m = layover % 60;
                                    return h > 0
                                      ? `${h}h${m}m`
                                      : `${m}m`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price + action button */}
            <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
              <div>
                <div className="text-lg font-700 2xl-md text-right max-ph:text-left">
                  {transfer_currency} {formattedPrice}
                </div>
                <div className="text-text-spacegrey text-sm-md font-400 leading-lg">
                  for {pax?.adults + pax?.children + pax?.infants} people
                </div>
              </div>

              <div
                className={`cursor-pointer ${updateLoading && !isOptionLoading ? "opacity-50" : ""} ${isBookingInProgress && !isOptionLoading ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => {
                  if (updateLoading && !isOptionLoading) return;
                  if (isBookingInProgress && !isOptionLoading) return;

                  const selectedPriceData = {
                    ...otherTransfer,
                    selectedOmioResult: result,
                    selectedOmioResultIndex: resultIndex,
                    selectedPrice: {
                      ...priceOption,
                      result_index: priceOption.result_index,
                    },
                  };

                  handleModeSelect(
                    currentStep - 1,
                    priceOptionId,
                    selectedPriceData,
                    otherTransfer.mode,
                  );
                }}
              >
                {isOptionLoading || (updateLoading && isOptionSelected) ? (
                  <div className="flex items-center gap-1">
                    <PulseLoader
                      size={15}
                      speedMultiplier={0.6}
                      color="#000000"
                    />
                  </div>
                ) : isOptionSelected && isResultSelected ? (
                  <div className="flex items-center gap-1">
                    <button className="ttw-btn-secondary-fill max-ph:w-full">
                      Selected
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button className="ttw-btn-fill-yellow max-ph:w-full">
                      Add to Itinerary
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  });
}

          // ─── SELF / NON-OMIO RESULTS (original prices rendering) ───
          if (!otherTransfer.prices || otherTransfer.prices.length === 0)
            return null;

          return otherTransfer.prices.map((priceOption, priceIndex) => {
            const price = priceOption.price || 0;
            const transfer_currency = currency?.currency
              ? currencySymbols?.[currency?.currency]
              : "₹";
            const priceOptionId = `${otherTransfer.id}-${priceIndex}`;
            const isOptionSelected = isPriceOptionSelected(
              otherTransfer.id,
              priceIndex,
            );
            const isOptionLoading = loadingOptionId === priceOptionId;
            const currentDateTimeInfo = getDateInfo(
              otherTransfer.start_datetime,
              otherTransfer.duration,
            );

            return (
              <div
                key={`${otherTransfer.id}-price-${priceIndex}`}
                className={`flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite relative mt-md
                  ${isOptionSelected ? "border-blue-500 bg-blue-50" : ""}
                  ${isBookingInProgress && !isOptionLoading ? "opacity-50" : ""}`}
              >
                <div className="flex justify-between max-ph:flex-col">
                  <div className="w-full">
                    <div className="text-md font-600 leading-xl">
                      {otherTransfer.text}{" "}
                      {priceOption.name ? `- ${priceOption.name}` : ""}
                    </div>
                    {priceOption.description && (
                      <div className="text-xs md:text-sm text-gray-700 mt-1">
                        {priceOption.description}
                      </div>
                    )}
                    {currentDateTimeInfo && (
                      <div className="flex items-center justify-between mt-md mr-2xl max-ph:mr-zero max-ph:mb-md">
                        <div className="flex flex-col gap-xs shrink-0">
                          <span className="text-sm font-400 leading-lg-md">
                            {currentDateTimeInfo.formattedStartDate}
                          </span>
                          <span className="text-md-lg font-600 leading-lg-md">
                            {currentDateTimeInfo.formattedStartTime}
                          </span>
                          <span className="text-sm font-400 leading-lg-md">
                            {otherTransfer.source.city_name}{" "}
                            {otherTransfer.source.code && (
                              <span className="text-sm font-400 leading-lg-md">
                                {" "}
                                ( {otherTransfer.source.code} )
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center flex-1 mx-md relative">
                          <div className="w-full border-b-[2px] border-black [border-style:dashed] [border-image:repeating-linear-gradient(to_right,#6E757A_0_6px,transparent_6px_12px)_1]"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center px-1 gap-2">
                            <span className="text-sm font-400 leading-lg-md">
                              {currentDateTimeInfo.formattedDuration}
                            </span>
                            <span className="text-md-lg font-600 leading-lg-md bg-primary-indigo rounded-full w-[25px] h-[25px] flex items-center justify-center">
                              {getModeIcon(otherTransfer.mode, 13)}
                            </span>
                            <span className="text-sm font-400 leading-lg-md">
                              {otherTransfer.distance} Km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-xs shrink-0">
                          <span className="text-sm font-400 leading-lg-md">
                            {currentDateTimeInfo.formattedEndDate}
                          </span>
                          <span className="text-md-lg font-600 leading-lg-md">
                            {currentDateTimeInfo.formattedEndTime}
                          </span>
                          <span className="text-sm font-400 leading-lg-md">
                            {otherTransfer.destination.city_name}{" "}
                            {otherTransfer.destination.code && (
                              <span className="text-sm font-400 leading-lg-md">
                                {" "}
                                ( {otherTransfer.destination.code} )
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {priceOption?.class && (
                      <div className="text-xs md:text-sm">
                        <span className="font-semibold">Facilities:</span>{" "}
                        {priceOption?.class}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
                    <div>
                      <div className="text-lg font-700 2xl-md text-right max-ph:text-left">
                        {" "}
                        {transfer_currency} {price}{" "}
                      </div>
                      <div className="text-text-spacegrey text-sm-md font-400 leading-lg">
                        for {pax?.adults + pax?.children + pax?.infants} people
                      </div>
                    </div>
                    <div
                      className={`cursor-pointer ${updateLoading && !isOptionLoading ? "opacity-50" : ""} ${isBookingInProgress && !isOptionLoading ? "cursor-not-allowed opacity-50" : ""}`}
                      onClick={() => {
                        if (updateLoading && !isOptionLoading) return;
                        if (isBookingInProgress && !isOptionLoading) return;
                        const selectedPriceData = {
                          ...otherTransfer,
                          selectedPrice: {
                            ...priceOption,
                            result_index: priceOption.result_index,
                          },
                        };
                        handleModeSelect(
                          currentStep - 1,
                          priceOptionId,
                          selectedPriceData,
                          otherTransfer.mode,
                        );
                      }}
                    >
                      {isOptionLoading ||
                      (updateLoading && isOptionSelected) ? (
                        <div className="flex items-center gap-1">
                          <PulseLoader
                            size={15}
                            speedMultiplier={0.6}
                            color="#000000"
                          />
                        </div>
                      ) : isOptionSelected && isResultSelected ? (
                        <div className="flex items-center gap-1">
                          <button className="ttw-btn-secondary-fill max-ph:w-full">
                            Selected
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button className="ttw-btn-fill-yellow max-ph:w-full">
                            Add to Itinerary
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          });
        })()}
      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </Container>
  );
};
