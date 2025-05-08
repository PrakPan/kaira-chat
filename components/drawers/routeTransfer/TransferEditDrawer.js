import { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { IoIosArrowUp, IoIosArrowDown, IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import Drawer from "../../ui/Drawer";
import axiosRoundTripEditInstance from "../../../services/itinerary/brief/roudTripEdit";
import { routeDetails } from "../../../services/itinerary/brief/transferEdit";
import axiosRoundTripInstance from "../../../services/itinerary/brief/roundTripSuggestion";
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
import { getDate } from "../../../helper/DateUtils";
import {
  fetchTransferMode,
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
import { MdDirectionsBoat, MdDirectionsBus, MdDirectionsTransit, MdLocalTaxi } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";
import { updateSingleTransferBooking } from "../../../store/actions/transferBookingsStore";
import BackArrow from "../../ui/BackArrow";
import { Pax } from "../activityDetails/Pax";

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
    label: "One-way options",
  },
  ROUNDTRIP: {
    name: "round-trip",
    label: "Round-trip options",
  },
  MULTICITYTRIP: {
    name: "multi-city-trip",
    label: "Multi-city options",
  },
};

const TransferEditDrawer = (props) => {
  const {
    ItineraryId,
    showDrawer,
    setShowDrawer,
    selectedTransferHeading,
    origin,
    destination,
    day_slab_index,
    element_index,
    openNotification,
    fetchData,
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
  } = props;

  console.log("Origin & Destination Iti", origin_itinerary_city_id, destination_itinerary_city_id);
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [transfersError, setTransfersError] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [transferType, setTransferType] = useState(
    TRANSFER_TYPES.ONEWAYTRIP.name
  );
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
const {number_of_adults,number_of_children,number_of_infants} = useSelector(state=>state.Itinerary)
  // console.log("SELECTED BOOKING",city,dcity,oCityData,dCityData,mercuryTransfer?.destination?.city_name);

  useEffect(() => {
    if (showDrawer) {
      fetchRoutes();
    }
  }, [showDrawer]);

  const fetchRoutes = () => {
    setLoadingTransfers(true);
    setTransfersError(null);
    roundTripSuggestion();

    const requestData = {
      start_datetime: `${getDate(check_in)}T00:00:00`,
      number_of_travellers:
        props?.plan?.number_of_adults + props?.plan?.number_of_children,
    };

    {
      mercury || props?.isMercury
        ? fetchTransferMode
            .post(
              "",
              {
                origin:
                  props?.origin ||
                  originCityId ||
                  mercuryTransfer?.source?.city,
                destination:
                  props?.destination ||
                  mercuryTransfer?.destination?.city ||
                  destinationCityId,
                number_of_adults: number_of_adults || props?.plan?.number_of_adults || 1,
                number_of_children: number_of_children ||  props?.plan?.number_of_children || 0,
                number_of_infants: number_of_infants || props?.plan?.number_of_infants || 0,
                //top_only: "false",
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              }
            )

            .then((res) => {
              if (res.data.success && res.data.routes.data.length > 0) {
                const data = res.data.routes.data;
                setTransfers(data);
              } else {
                setTransfersError(
                  "No route found, please get in touch with us to complete this booking!"
                );
              }
              setLoadingTransfers(false);
            })
            .catch((err) => {
              setLoadingTransfers(false);
              setTransfersError(
                "No route found, please get in touch with us to complete this booking!"
              );
            })
        : routeDetails
            .get(`${routeId}/`, requestData)
            .then((res) => {
              if (res.data.success && res.data.routes.data.length > 0) {
                const data = res.data.routes.data;
                setTransfers(data);
              } else {
                setTransfersError(
                  "No route found, please get in touch with us to complete this booking!"
                );
              }
              setLoadingTransfers(false);
            })
            .catch((err) => {
              setLoadingTransfers(false);
              setTransfersError(
                "No route found, please get in touch with us to complete this booking!"
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
    console.log("Inside handleSelect", transfer);
    if (!transfer) {
      setSelectedResult(null);
      return;
    }
    console.log("STransfer", transfer, mode);
    let selectedBookings = {
      ...selectedBooking,
      origin_iata: transfer?.source?.code,
      destination_iata: transfer?.destination?.code,
      edge: transfer?.id,
    };

    setSelectedBooking(selectedBookings);
    console.log("Transfer", selectedBooking);

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
            fetchData((scroll = false));
            openNotification({
              text: "Your Transfer updated successfully!",
              heading: "Success!",
              type: "success",
            });
          }
          setSelectLoading(false);
          setShowDrawer(false);
          setCurrentStep(0);
        })
        .catch((err) => {
          setSelectLoading(false);
          setShowDrawer(false);
          setCurrentStep(0);
          if (err.response.status === 403) {
            openNotification({
              text: "You are not allowed to make changes to this itinerary",
              heading: "Error!",
              type: "error",
            });
          } else {
            openNotification({
              text: "There seems to be a problem, please try again!",
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

  const handleTransferType = (e) => {
    setTransferType(e.target.id);
  };

  return (
    <Drawer
      show={showDrawer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      width={"50vw"}
      mobileWidth={"100vw"}
      onHide={() => {
        setShowDrawer(false);
        setCurrentStep(0);
        setIsRouteSelected(false);
        setShowOtherTrasfer(false);
      }}
    >
      <div className="relative px-2 bg-white z-[900] flex flex-col gap-4 pt-4 pb-[100px] justify-start items-start mx-auto w-[98%] min-h-screen">
        <div className="flex flex-row gap-2 my-0 justify-start items-center">
          {currentStep === 0 ? (
            <>
            <BackArrow handleClick={()=>{
              setShowDrawer(false);
              setCurrentStep(0);
              setIsRouteSelected(false);
            }}/>
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
        <div className="text-lg md:text-xl lg:text-xl font-semibold">
          {props.addOrEdit === "transferAdd" ? "Adding" : "Changing"} transfer
          from {city || mercuryTransfer?.source?.city_name} to{" "}
          {dcity || mercuryTransfer?.destination?.city_name}{" "}
        </div>

        {/* {showOtherTransfer &&
        <OtherTransfer
          showOtherTransfer={showOtherTransfer}
          setShowOtherTrasfer={setShowOtherTrasfer}
          selectedResult={selectedResult}
          setSelectedResult={setSelectedResult}
          number_of_travellers={
            props?.plan?.number_of_adults +
            props?.plan?.number_of_children
          }
          check_in={check_in}
          mercuryTransfer={mercuryTransfer}
          currentStep={currentStep}
        />
      } */}

        {loadingTransfers ? (
          <div className="mt-10 w-full flex flex-col gap-3 items-center">
            <div className="w-full flex flex-row items-center gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              {/* <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div> */}
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              {/* <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div> */}
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              {/* <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div> */}
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>
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
                    setShowDrawer(false);
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
          <div className="w-full flex flex-col items-center gap-3">
            {/* <div className="w-full flex flex-row gap-4 px-2 whitespace-nowrap overflow-x-auto hide-scrollbar">
              <RadioButton
                name={TRANSFER_TYPES.ONEWAYTRIP.name}
                label={TRANSFER_TYPES.ONEWAYTRIP.label}
                transferType={transferType}
                handleTransferType={handleTransferType}
              />
              {roundTripSuggestions && (
                <RadioButton
                  name={TRANSFER_TYPES.ROUNDTRIP.name}
                  label={TRANSFER_TYPES.ROUNDTRIP.label}
                  transferType={transferType}
                  handleTransferType={handleTransferType}
                />
              )}
              {multiCitySuggestions && (
                <RadioButton
                  name={TRANSFER_TYPES.MULTICITYTRIP.name}
                  label={TRANSFER_TYPES.MULTICITYTRIP.label}
                  transferType={transferType}
                  handleTransferType={handleTransferType}
                />
              )}
            </div> */}

            {selectLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="mb-96">
                  <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
                </div>
              </div>
            )}

            {transferType === TRANSFER_TYPES.ONEWAYTRIP.name ? (
              <>
                {/* <div className="w-full flex justify-start">
                  {transfers.length < 2
                    ? `${transfers.length} way`
                    : `${transfers.length} ways`}{" "}
                  to travel from {city || mercuryTransfer?.source?.city_name} to{" "}
                  {dcity || mercuryTransfer?.destination?.city_name}
                </div> */}
                <div className="w-full flex flex-col items-center gap-3">
      {currentStep === 0 ? (
        <>
        {transfers && transfers.length > 0 && (
          <div className="mb-4 w-full">
            <div className="inline-block mb-3">
              <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                RECOMMENDED
              </span>
            </div>
            
            <div
              key={0}
              className="flex justify-between items-center p-3 bg-white rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 mb-4"
              onClick={() => {
                setSelectedTransferIndex(0);
                setCurrentStep(1);
              }}
            >
              <div>
                <span className="font-medium p-2 text-lg">{transfers[0]?.name} |</span>
                <span className="text-gray-600 ml-1">
                  {Math.ceil(
                    transfers[0].transfers.reduce((sum, t) => sum + (t.duration || 0), 0) / 60
                  )}{" "}
                  hours | {transfers[0].transfers.reduce((sum, t) => sum + (t.distance || 0), 0)} kms
                </span>
              </div>
              <AiOutlineRight size={20} className="text-gray-400" />
            </div>
          </div>
        )}
        
      
        {transfers && transfers.length > 1 && (
          <div className="w-full">
            <div className="inline-block mb-3 w-full">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                OTHERS
              </span>
            </div>
            
            {transfers.slice(1).map((transfer, idx) => {
              const index = idx + 1; // Actual index in the transfers array
              return (
                <div
                  key={index}
                  className="flex justify-between p-3 items-center bg-white rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 mb-4"
                  onClick={() => {
                    setSelectedTransferIndex(index);
                    setCurrentStep(1);
                  }}
                >
                  <div>
                    <span className="font-medium p-2 text-lg">{transfer?.name} |</span>
                    <span className="text-gray-600 ml-1">
                      {Math.ceil(
                        transfer.transfers.reduce((sum, t) => sum + (t.duration || 0), 0) / 60
                      )}{" "}
                      hours | {transfer.transfers.reduce((sum, t) => sum + (t.distance || 0), 0)} kms
                    </span>
                  </div>
                  <AiOutlineRight size={20} className="text-gray-400" />
                </div>
              );
            })}
          </div>
      )}
        </>
      ) : (
        selectedTransferIndex !== null && (
          isDesktop ? (
            transfers[selectedTransferIndex]?.transfers?.length > 1 ? (
              <NewMultiModeContainer
                key={selectedTransferIndex}
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
                setHideFlightModal={() => setShowComboFlightModal(false)}
                setHideBookingModal={() => setShowComboFlightModal(false)}
                showTaxiModal={showComboTaxiModal}
                setShowComboTaxiModal={setShowComboTaxiModal}
                setHideTaxiModal={() => setShowComboTaxiModal(false)}
                getPaymentHandler={props.getPaymentHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateFlightBookingHandler={_updateFlightBookingHandler}
                _updateBookingHandler={props._updateBookingHandler}
                alternates={selectedBooking?.id}
                tailored_id={selectedBooking?.tailored_itinerary}
                selectedBooking={selectedBooking}
                itinerary_id={ItineraryId}
                selectedTransferHeading={selectedTransferHeading}
                fetchData={fetchData}
                setShowLoginModal={setShowLoginModal}
                check_in={check_in}
                _GetInTouch={props._GetInTouch}
                daySlabIndex={day_slab_index}
                elementIndex={element_index}
                routeId={routeId}
                mercuryTransfer={selectedMercuryTransfer}
                mercury={mercuryTransfer}
                individual={props?.individual}
                originCityId={props?.originCityId}
                destinationCityId={props?.destinationCityId}
                token={props?.token}
                origin_itinerary_city_id={origin_itinerary_city_id}
                destination_itinerary_city_id={destination_itinerary_city_id}
                setShowDrawer={setShowDrawer}
                dCityData={dCityData}
                oCityData={oCityData}
                openNotification={openNotification}
                showDrawer={showDrawer}
                origin={origin}
                destination={destination}
                city={city}
                dcity={dcity}
                currentModeDepartureDate={currentModeDepartureDate}
                setCurrentModeDepartureDate={setCurrentModeDepartureDate}
                currentModeDepartureTime={currentModeDepartureTime}
                setCurrentModeDepartureTime={setCurrentModeDepartureTime}
              />
            ) : (
              <RouteContainer
                setSelectedMercuryTransfer={setSelectedMercuryTransfer}
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
                setHideFlightModal={() => setShowComboFlightModal(false)}
                hideDrawer={() => {
                  setShowDrawer(false);
                  setCurrentStep(0);
                  setIsRouteSelected(false);
                  setShowOtherTrasfer(false);
                  setSelectedTransferIndex(null); // Reset selected transfer
                }}
                setHideBookingModal={() => setShowComboFlightModal(false)}
                showTaxiModal={showComboTaxiModal}
                setShowComboTaxiModal={setShowComboTaxiModal}
                setHideTaxiModal={() => setShowComboTaxiModal(false)}
                getPaymentHandler={props.getPaymentHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateFlightBookingHandler={_updateFlightBookingHandler}
                _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                _updateBookingHandler={props._updateBookingHandler}
                alternates={selectedBooking?.id}
                tailored_id={selectedBooking?.tailored_itinerary}
                selectedBooking={selectedBooking}
                itinerary_id={ItineraryId}
                selectedTransferHeading={selectedTransferHeading}
                fetchData={fetchData}
                setShowLoginModal={setShowLoginModal}
                check_in={check_in}
                _GetInTouch={props._GetInTouch}
                daySlabIndex={day_slab_index}
                elementIndex={element_index}
                routeId={routeId}
                mercuryTransfer={selectedMercuryTransfer}
                individual={props?.individual}
                originCityId={props?.originCityId}
                destinationCityId={props?.destinationCityId}
                token={props?.token}
                origin_itinerary_city_id={origin_itinerary_city_id}
                destination_itinerary_city_id={destination_itinerary_city_id}
                setShowDrawer={setShowDrawer}
                dCityData={dCityData}
                oCityData={oCityData}
                openNotification={openNotification}
                showDrawer={showDrawer}
                origin={origin}
                destination={destination}
                currentModeDepartureDate={currentModeDepartureDate}
                setCurrentModeDepartureDate={setCurrentModeDepartureDate}
                currentModeDepartureTime={currentModeDepartureTime}
                setCurrentModeDepartureTime={setCurrentModeDepartureTime}
                showOtherTrasfer={showOtherTransfer}
                setShowOtherTrasfer={setShowOtherTrasfer}
              />
            )
          ) : (
            // Mobile view logic
            transfers[selectedTransferIndex]?.transfers?.length > 1 ? (
              <NewMultiModeContainer
                key={selectedTransferIndex}
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
                setHideFlightModal={() => setShowComboFlightModal(false)}
                setHideBookingModal={() => setShowComboFlightModal(false)}
                showTaxiModal={showComboTaxiModal}
                setShowComboTaxiModal={setShowComboTaxiModal}
                setHideTaxiModal={() => setShowComboTaxiModal(false)}
                getPaymentHandler={props.getPaymentHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateFlightBookingHandler={_updateFlightBookingHandler}
                _updateBookingHandler={props._updateBookingHandler}
                alternates={selectedBooking?.id}
                tailored_id={selectedBooking?.tailored_itinerary}
                selectedBooking={selectedBooking}
                itinerary_id={ItineraryId}
                selectedTransferHeading={selectedTransferHeading}
                fetchData={fetchData}
                setShowLoginModal={setShowLoginModal}
                check_in={check_in}
                _GetInTouch={props._GetInTouch}
                daySlabIndex={day_slab_index}
                elementIndex={element_index}
                routeId={routeId}
                mercuryTransfer={selectedMercuryTransfer}
                mercury={mercuryTransfer}
                individual={props?.individual}
                originCityId={props?.originCityId}
                destinationCityId={props?.destinationCityId}
                token={props?.token}
                origin_itinerary_city_id={origin_itinerary_city_id}
                destination_itinerary_city_id={destination_itinerary_city_id}
                setShowDrawer={setShowDrawer}
                dCityData={dCityData}
                oCityData={oCityData}
                openNotification={openNotification}
                showDrawer={showDrawer}
                origin={origin}
                destination={destination}
                city={city}
                dcity={dcity}
                currentModeDepartureDate={currentModeDepartureDate}
                setCurrentModeDepartureDate={setCurrentModeDepartureDate}
                currentModeDepartureTime={currentModeDepartureTime}
                setCurrentModeDepartureTime={setCurrentModeDepartureTime}
              />
            ) : (
              <RouteContainer
                setSelectedMercuryTransfer={setSelectedMercuryTransfer}
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
                setHideFlightModal={() => setShowComboFlightModal(false)}
                hideDrawer={() => {
                  setShowDrawer(false);
                  setCurrentStep(0);
                  setIsRouteSelected(false);
                  setShowOtherTrasfer(false);
                  setSelectedTransferIndex(null); // Reset selected transfer
                }}
                setHideBookingModal={() => setShowComboFlightModal(false)}
                showTaxiModal={showComboTaxiModal}
                setShowComboTaxiModal={setShowComboTaxiModal}
                setHideTaxiModal={() => setShowComboTaxiModal(false)}
                getPaymentHandler={props.getPaymentHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateFlightBookingHandler={_updateFlightBookingHandler}
                _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                _updateBookingHandler={props._updateBookingHandler}
                alternates={selectedBooking?.id}
                tailored_id={selectedBooking?.tailored_itinerary}
                selectedBooking={selectedBooking}
                itinerary_id={ItineraryId}
                selectedTransferHeading={selectedTransferHeading}
                fetchData={fetchData}
                setShowLoginModal={setShowLoginModal}
                check_in={check_in}
                _GetInTouch={props._GetInTouch}
                daySlabIndex={day_slab_index}
                elementIndex={element_index}
                routeId={routeId}
                mercuryTransfer={selectedMercuryTransfer}
                individual={props?.individual}
                originCityId={props?.originCityId}
                destinationCityId={props?.destinationCityId}
                token={props?.token}
                origin_itinerary_city_id={origin_itinerary_city_id}
                destination_itinerary_city_id={destination_itinerary_city_id}
                setShowDrawer={setShowDrawer}
                dCityData={dCityData}
                oCityData={oCityData}
                openNotification={openNotification}
                showDrawer={showDrawer}
                origin={origin}
                destination={destination}
                currentModeDepartureDate={currentModeDepartureDate}
                setCurrentModeDepartureDate={setCurrentModeDepartureDate}
                currentModeDepartureTime={currentModeDepartureTime}
                setCurrentModeDepartureTime={setCurrentModeDepartureTime}
                showOtherTrasfer={showOtherTransfer}
                setShowOtherTrasfer={setShowOtherTrasfer}
              />
            )
          )
        )
      )}
    </div>
              </>
            ) : transferType === TRANSFER_TYPES.ROUNDTRIP.name ? (
              <RoundTripSuggestion
                handleRoundTripSelect={handleRoundTripSelect}
                roundTripSuggestions={roundTripSuggestions}
              />
            ) : transferType === TRANSFER_TYPES.MULTICITYTRIP.name ? (
              <MultiCityTripSuggestion
                handleRoundTripSelect={handleRoundTripSelect}
                multiCitySuggestions={multiCitySuggestions}
              />
            ) : null}
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
        selectedTransferHeading={selectedTransferHeading}
        fetchData={fetchData}
        setShowLoginModal={setShowLoginModal}
        check_in={check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={day_slab_index}
        elementIndex={element_index}
        routeId={routeId}
        mercuryTransfer={selectedMercuryTransfer}
        individual={props?.individual}
        originCityId={props?.originCityId}
        destinationCityId={props?.destinationCityId}
      ></FlightModal>

      {/* <ComboFlight
        handleFlightSelect={handleSelectResult}
        showFlightModal={showComboFlightModal}
        setShowFlightModal={setShowComboFlightModal}
        setHideFlightModal={() => setShowComboFlightModal(false)}
        setHideBookingModal={() => setShowComboFlightModal(false)}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        alternates={selectedBooking?.id}
        tailored_id={selectedBooking?.tailored_itinerary}
        // _updateFlightHandler={props._updateFlightHandler}
        selectedBooking={selectedBooking}
        itinerary_id={ItineraryId}
        selectedTransferHeading={selectedTransferHeading}
        fetchData={fetchData}
        setShowLoginModal={setShowLoginModal}
        check_in={check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={day_slab_index}
        elementIndex={element_index}
        routeId={routeId}
        mercuryTransfer={selectedMercuryTransfer}
        individual={props?.individual}
        originCityId={props?.originCityId}
        destinationCityId={props?.destinationCityId}
      ></ComboFlight> */}

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
        selectedTransferHeading={selectedTransferHeading}
        fetchData={fetchData}
        setShowLoginModal={setShowLoginModal}
        check_in={check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={day_slab_index}
        elementIndex={element_index}
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
    selectedTransferHeading,
    fetchData,
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
    setShowDrawer,
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
  } = props;
  const [viewMore, setViewMore] = useState(false);
  const [singleTransfer, setSingleTransfer] = useState(transfer[0]);
  const [comboStartDate, setComboStartDate] = useState(null);
  const [comboStartTime, setComboStartTime] = useState(null);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (currentStep < 1 || currentStep > transfer.length) return;
    setShowComboFlightModal(false);
    setShowComboTaxiModal(false);
    setShowOtherTrasfer(false);

    const currentTransfer = transfer[currentStep - 1];

    const baseStartDate = selectedBooking?.check_in
      ? dayjs(selectedBooking?.check_in).format("YYYY-MM-DD")
      : dCityData?.start_date ??
        (oCityData?.start_date && oCityData?.duration != null
          ? addDaysToDate(oCityData.start_date, oCityData.duration)
          : null);

    console.log(
      "Start Dtae",
      selectedBooking,
      selectedBooking?.check_in,
      dCityData?.start_date,
      oCityData.start_date,
      oCityData.duration,
      baseStartDate,
      dCityData,
      oCityData
    );
    let calculatedStartTime;

    if (currentStep === 1) {
      calculatedStartTime = dayjs(`${baseStartDate} 12:00`);
    } else {
      const prevSelected = selectedData[currentStep - 2];
      const prevArrivalTime = prevSelected?.arrival_time;

      if (prevArrivalTime) {
        let arrivalMoment = dayjs(prevArrivalTime);
        calculatedStartTime = arrivalMoment.add(1, "hour");
        const updatedStartDate = calculatedStartTime.format("YYYY-MM-DD");
        setComboStartDate(updatedStartDate);
      } else {
        calculatedStartTime = dayjs(`${baseStartDate} 12:00`);
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
  console.log("Origin & Desti Single Transfer",origin_itinerary_city_id)

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
          <>
            {console.log("current step is:", currentStep)}
            {
              <div
                className="w-full flex justify-between items-center p-2 md:p-3 cursor-pointer shadow-md"
                onClick={() => setCurrentStep(1)}
              >
                <div className="text-sm md:text-base">
                  <span className="font-medium">
                    {/* {sequencedModes.join(", ")} */}
                    {name}{" "}
                  </span>
                  <p className="font-normal">
                    {Math.ceil(
                      transfer.reduce((sum, t) => sum + (t.duration || 0), 0) /
                        60
                    )}{" "}
                    hours | {totalDistance} kms
                  </p>
                </div>
                <AiOutlineRight size={16} className="md:text-20" />
              </div>
            }
            {currentStep === 1 ? (
              singleTransfer?.mode === "Flight" ? (
                <ComboFlight
                  combo={false}
                  edge={singleTransfer?.id}
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
                  selectedTransferHeading={selectedTransferHeading}
                  fetchData={fetchData}
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
                />
              ) : singleTransfer?.mode === "Taxi" ? (
                <ComboTaxi
                  handleFlightSelect={handleFlightSelect}
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
                  selectedTransferHeading={selectedTransferHeading}
                  fetchData={fetchData}
                  setShowLoginModal={setShowLoginModal}
                  check_in={check_in}
                  _GetInTouch={_GetInTouch}
                  daySlabIndex={daySlabIndex}
                  elementIndex={elementIndex}
                  routeId={routeId}
                  mercuryTransfer={mercuryTransfer}
                  individual={individual}
                  originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
                  destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
                  comboStartDate={currentModeDepartureDate}
                  comboStartTime={currentModeDepartureTime}
                  _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                  origin_itinerary_city_id={origin_itinerary_city_id}
                destination_itinerary_city_id={destination_itinerary_city_id}
                dCityData={dCityData}
                oCityData={oCityData}
                />
              ) : (
                <OtherTransfer
                  showOtherTransfer={showOtherTrasfer}
                  setShowOtherTrasfer={setShowOtherTrasfer}
                  selectedResult={selectedResult}
                  selectedBooking={selectedBooking}
                  setSelectedResult={setSelectedResult}
                  mercuryTransfer={mercuryTransfer}
                  transfer={transfer}
                  number_of_travellers={
                    props?.plan?.number_of_adults +
                    props?.plan?.number_of_children
                  }
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
                getPaymentHandler={ getPaymentHandler}
                />
              )
            ) : (
              ""
            )}
            {/* <div className="flex flex-row gap-2 w-full">
          <div
            className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
          >
            <TransfersIcon
              TransportMode={singleTransfer?.mode}
              Instyle={{
                fontSize: singleTransfer?.mode === "Bus" ? "2.5rem" : "3rem",
                color: "black",
              }}
              classname={{ width: 80, height: 75 }}
            />
          </div>

          <div className="w-full flex flex-col gap-2 justify-center">
            <div className="flex flex-row items-center justify-between">
              <TransferItem transfer={singleTransfer} />
              <div className="flex flex-col gap-2 items-end">
                <EstimatedCost cost={singleTransfer?.prices[0]?.price} /> */}
            {/* {
                singleTransfer?.mode === "Bus" || singleTransfer?.mode === "Train" || singleTransfer?.mode === "Ferry" || singleTransfer?.mode === "Car" ? <MercurySelectButton transfer={singleTransfer} setShowMercuryTransfer={props?.setShowMercuryTransfer} setSelectedMercuryTransfer={props?.setSelectedMercuryTransfer}/>: */}
            {/* <SelectButton
                  transfer={singleTransfer}
                  transferIndex={transferIndex}
                  handleSelect={handleSelect}
                  setSelectedMercuryTransfer={setSelectedMercuryTransfer}
                  isRouteSelected={isRouteSelected}
                  setIsRouteSelected={setIsRouteSelected}
                /> */}
            {/* } */}
            {/* </div>
            </div>
          </div>
        </div> */}
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
      return <BiTrain size={size} />;
    case "taxi":
      return <MdLocalTaxi size={size} />;
    case "flight":
      return <FaPlaneDeparture size={size} />;
    case "bus":
      return <MdDirectionsBus size={size} />;
    case "ferry":
      return <MdDirectionsBoat size={size} />;
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
  selectedTransferHeading,
  fetchData,
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
  setShowDrawer,
  dCityData,
  oCityData,
  openNotification,
  origin,
  destination,
  currentModeDepartureDate,
  setCurrentModeDepartureDate,
  currentModeDepartureTime,
  setCurrentModeDepartureTime,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedModeIds, setSelectedModeIds] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [comboStartTime, setComboStartTime] = useState(null);
  const [comboStartDate, setComboStartDate] = useState(null);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const [skipFlightFetch, setSkipFlightFetch] = useState(false);
  const [skipTaxiFetch, setSkipTaxiFetch] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const {number_of_adults,number_of_children,number_of_infants} = useSelector(state => state.Itinerary);
  const sequencedModes = transfer.map((t) => t.mode);

  console.log("Selected Data", selectedData);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const totalDistance = transfer.reduce((sum, t) => sum + (t.distance || 0), 0);

  const sourceCity = transfer.length > 0 ? transfer[0].source.city_name : "";
  const destinationCity =
    transfer.length > 0
      ? transfer[transfer.length - 1].destination.city_name
      : "";

  const calculateTotalPrice = () => {
    let total = 0;

    Object.keys(selectedModeIds).forEach((stepIndex) => {
      const selectedId = selectedModeIds[stepIndex];
      const selectedOption = transfer.find((t) => t.id === selectedId);

      if (selectedOption && selectedOption.prices && selectedOption.prices[0]) {
        total += selectedOption.prices[0].price;
      }
    });

    return total > 0 ? `₹${total}` : "";
  };

  const getCurrentMode = () => {
    return currentStep > 0 && currentStep <= sequencedModes.length
      ? sequencedModes[currentStep - 1]
      : "";
  };

  const propagateTimeChanges = (startIndex) => {
    setSelectedData((prev) => {
      const newData = [...prev];
      
      for (let i = startIndex; i < transfer.length; i++) {
        if (newData[i-1] && newData[i]) {
          // Get the previous step's arrival time
          const prevArrivalTime = newData[i-1].arrival_time;
          
          if (prevArrivalTime) {
            let arrivalMoment = dayjs(prevArrivalTime);
            let newDepartureTime = arrivalMoment.add(1, 'hour');
            
            const newDepartureDate = newDepartureTime.format("YYYY-MM-DD");
            const newDepartureTimeStr = newDepartureTime.format("HH:mm");
            
            // Set the new departure time for the current step
            newData[i] = {
              ...newData[i],
              departure_time: `${newDepartureDate}T${newDepartureTimeStr}`
            };
            
            // If this is a non-Flight/non-Taxi mode, calculate its arrival time
            if (newData[i].mode !== "Flight" && newData[i].mode !== "Taxi") {
              const newDepartureDateTime = dayjs(`${newDepartureDate}T${newDepartureTimeStr}`);
              const newArrivalDateTime = newDepartureDateTime.add(newData[i].duration || 0, 'minute');
              newData[i].arrival_time = newArrivalDateTime.format('YYYY-MM-DDTHH:mm');
            }
          }
        }
      }
      
      return newData;
    });
  };
  
  const handleTimeSelect = (time) => {
    setCurrentModeDepartureTime(time);
    setComboStartTime(time);
    setShowTimeDropdown(false);
    
    if (selectedModeIds[currentStep - 1]) {
      const currentTransfer = transfer[currentStep - 1];
      const currentSelectedData = { ...selectedData[currentStep - 1] };
      
      // Update departure time for the current step
      currentSelectedData.departure_time = `${currentModeDepartureDate}T${time}`;
      
      // For non-Flight/non-Taxi, calculate arrival time based on duration
      if (currentTransfer.mode !== "Flight" && currentTransfer.mode !== "Taxi") {
        const departureDateTime = dayjs(`${currentModeDepartureDate}T${time}`);
        const arrivalDateTime = departureDateTime.add(currentSelectedData.duration || 0, 'minute');
        currentSelectedData.arrival_time = arrivalDateTime.format('YYYY-MM-DDTHH:mm');
      }
      
      setSelectedData((prev) => {
        const newData = [...prev];
        newData[currentStep - 1] = currentSelectedData;
        
        // Update all subsequent steps
        for (let i = currentStep; i < transfer.length; i++) {
          if (newData[i-1] && newData[i]) {
            const prevArrivalTime = newData[i-1].arrival_time;
            
            if (prevArrivalTime) {
              let arrivalMoment = dayjs(prevArrivalTime);
              let newDepartureTime = arrivalMoment.add(1, 'hour');
              
              const newDepartureDate = newDepartureTime.format("YYYY-MM-DD");
              const newDepartureTimeStr = newDepartureTime.format("HH:mm");
              
              newData[i] = {
                ...newData[i],
                departure_time: `${newDepartureDate}T${newDepartureTimeStr}`
              };
              
              // If this is a non-Flight/non-Taxi mode, calculate its arrival time
              if (newData[i].mode !== "Flight" && newData[i].mode !== "Taxi") {
                const newDepartureDateTime = dayjs(`${newDepartureDate}T${newDepartureTimeStr}`);
                const newArrivalDateTime = newDepartureDateTime.add(newData[i].duration || 0, 'minute');
                newData[i].arrival_time = newArrivalDateTime.format('YYYY-MM-DDTHH:mm');
              }
            }
          }
        }
        
        return newData;
      });
      
      // Handle select for the current step
      const currentTransferData = transfer[currentStep - 1];
      handleSelect(
        currentStep - 1,
        currentSelectedData,
        currentTransferData,
        currentTransferData.mode
      );
      
      // Handle select for all subsequent steps
      selectedData.forEach((data, index) => {
        if (index >= currentStep && data) {
          const modeTransfer = transfer[index];
          handleSelect(
            index,
            selectedData[index],
            modeTransfer,
            modeTransfer.mode
          );
        }
      });
    }
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
      setSkipFlightFetch(true);
      setShowComboFlightModal(false);
    } else if (currentTransfer.mode === "Taxi") {
      setSkipTaxiFetch(true);
      setShowComboTaxiModal(false);
    }
  
    // Set up time for the next step based on current step's arrival time
    const currentSelectedData = selectedData[currentStep - 1];
    if (currentSelectedData && currentSelectedData.arrival_time && currentStep < transfer.length) {
      let arrivalMoment = dayjs(currentSelectedData.arrival_time);
      let nextDepartureTime = arrivalMoment.add(1, 'hour');
      
      const newDepartureDate = nextDepartureTime.format("YYYY-MM-DD");
      const newDepartureTimeStr = nextDepartureTime.format("HH:mm");
      
      setCurrentModeDepartureDate(newDepartureDate);
      setCurrentModeDepartureTime(newDepartureTimeStr);
      setComboStartDate(newDepartureDate);
      setComboStartTime(newDepartureTimeStr);
    }
  
    setCurrentStep(currentStep + 1);
  };

const handleBackButton = () => {

  if (currentStep === 1) {
    setCurrentStep(0); 
    return;
  }
  

  const currentTransfer = transfer[currentStep - 2];
  console.log("Current Transfer",currentTransfer,currentStep)
  if (currentTransfer.mode === "Flight") {
   // setSkipFlightFetch(true);
    setShowComboFlightModal(true);
  } else if (currentTransfer.mode === "Taxi") {
    console.log("Inside fetch")
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
    setSkipFlightFetch(false);
    setSkipTaxiFetch(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourFormatted = hour.toString().padStart(2, '0');
        const minuteFormatted = minute.toString().padStart(2, '0');
        const time = `${hourFormatted}:${minuteFormatted}`;
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour}:${minuteFormatted} ${period}`;
        
        options.push({ value: time, display: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();


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
        if (mode !== "Flight" && mode !== "Taxi") {
          // For non-Flight/non-Taxi modes, calculate arrival_time based on duration
          const departureDateTime = dayjs(`${currentModeDepartureDate}T${currentModeDepartureTime}`);
          const arrivalDateTime = departureDateTime.add(searchData.duration || 0, 'minute');
          
          searchData.departure_time = `${currentModeDepartureDate}T${currentModeDepartureTime}`;
          searchData.arrival_time = arrivalDateTime.format('YYYY-MM-DDTHH:mm');
        }
        
        setSelectedData((prev) => {
          const newData = [...prev];
          newData[index] = searchData;
          return newData;
        });
      } else {
        const selectedTransfer = transfer.find((item) => item.id === id);
        if (selectedTransfer) {
          if (selectedTransfer.mode !== "Flight" && selectedTransfer.mode !== "Taxi") {
            // For non-Flight/non-Taxi modes, calculate arrival_time based on duration
            const departureDateTime = dayjs(`${currentModeDepartureDate}T${currentModeDepartureTime}`);
            const arrivalDateTime = departureDateTime.add(selectedTransfer.duration || 0, 'minute');
            
            selectedTransfer.departure_time = `${currentModeDepartureDate}T${currentModeDepartureTime}`;
            selectedTransfer.arrival_time = arrivalDateTime.format('YYYY-MM-DDTHH:mm');
          }
          
          setSelectedData((prev) => {
            const newData = [...prev];
            newData[index] = selectedTransfer;
            return newData;
          });
        }
      }
    }
  
    console.log("Selllmon",selectedData);
    handleSelect(
      transferIndex,
      isDeselecting
        ? null
        : searchData || transfer.find((item) => item.id === id),
      transfer,
      mode
    );
    
    // Propagate time changes to all subsequent steps
    if (!isDeselecting && index < transfer.length - 1) {
      propagateTimeChanges(index + 1);
    }
  };

  const handleFlightSelection = (flightData) => {
    console.log("Flight Data", flightData);
    handleModeSelect(
      currentStep - 1,
      flightData?.id || flightData?.resultIndex,
      flightData,
      "Flight"
    );
  };

  const handleTaxiSelection = (taxiData) => {
    handleModeSelect(
      currentStep - 1,
      taxiData?.id || taxiData?.result_index,
      taxiData,
      "Taxi"
    );
  };

  const handleUpdateTransfer = async () => {
    setUpdateLoading(true);
    if (Object.keys(selectedModeIds).length === totalSteps) {
      try {
        const transfersPayload = selectedData.map((item, index) => {
          const currentTransfer = transfer[index];

          const transferObj = {
            booking_type: currentTransfer.mode,
            edge_id: currentTransfer.id,
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
            return {
              ...transferObj,
              result_index: item.selectedPrice
                ? transfer[index].prices.findIndex(
                    (p) =>
                      p.price === item.selectedPrice.price &&
                      p.currency === item.selectedPrice.currency
                  )
                : 0,
              start_time: item.departure_time || `${currentModeDepartureDate}T${currentModeDepartureTime}`,
            };
          }
        });

        const baseStartDate =
          dCityData?.start_date ??
          (oCityData?.start_date && oCityData?.duration != null
            ? addDaysToDate(oCityData.start_date, oCityData.duration)
            : dayjs().format("YYYY-MM-DD"));
        const requestBody = {
          destination_itinerary_city: (destination_itinerary_city_id),
          source_itinerary_city: (origin_itinerary_city_id)
            ? origin_itinerary_city_id
            : null,
          number_of_adults: number_of_adults,
          number_of_children: number_of_children,
          number_of_infants: number_of_infants,
          start_datetime: baseStartDate + "T00:00:00",
          transfers: transfersPayload,
        };

        if (selectedBooking) {
          requestBody.booking_id = selectedBooking?.id;
        }

        const response = await UpdateTransferMode.post(
          `${itinerary_id}/bookings/transfer/`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        console.log(
          "Using key:",
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`
        );

        dispatch(
          updateSingleTransferBooking(
            `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
            data
          )
        );

        getPaymentHandler();

        console.log("Transfer from updated successfully:", data);

        setShowDrawer(false);

        openNotification({
          text: `Transfer from ${city || mercury?.source?.city_name} to ${dcity || mercury?.destination?.city_name} has been updated successfully!`,
          heading: "Success!",
          type: "success",
        });

        setUpdateLoading(false);
      } catch (error) {
        setUpdateLoading(false);
        openNotification({
          text: "Error updating Transfers!",
          heading: "Error!",
          type: "error",
        });
        console.error("Error updating transfer:", error);
      }
    } else {
      setUpdateLoading(false);
    }
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (currentStep < 1 || currentStep > transfer.length) return;
  
    const currentTransfer = transfer[currentStep - 1];
  
    const baseStartDate = selectedBooking?.check_in
      ? dayjs(selectedBooking?.check_in).format("YYYY-MM-DD")
      : dCityData?.start_date ??
        (oCityData?.start_date && oCityData?.duration != null
          ? addDaysToDate(oCityData.start_date, oCityData.duration)
          : null);
    
    let calculatedStartTime;
  
    if (currentStep === 1) {
      calculatedStartTime = dayjs(`${baseStartDate} 12:00`);
    } else {
      // Check for previous step's arrival time
      const prevSelected = selectedData[currentStep - 2];
      const prevArrivalTime = prevSelected?.arrival_time;
  
      if (prevArrivalTime) {
        // If previous step has arrival_time, use it + 1 hour
        let arrivalMoment = dayjs(prevArrivalTime);
        calculatedStartTime = arrivalMoment.add(1, 'hour');
      } else if (prevSelected?.departure_time && prevSelected?.duration) {
        // If previous step has no arrival_time but has departure_time and duration,
        // calculate arrival_time = departure_time + duration + 1 hour
        let departureDateTime = dayjs(prevSelected.departure_time);
        let calculatedArrival = departureDateTime.add(prevSelected.duration, 'minute');
        calculatedStartTime = calculatedArrival.add(1, 'hour');
        
        // Store this calculated arrival time for future reference
        setSelectedData(prev => {
          const newData = [...prev];
          if (newData[currentStep - 2]) {
            newData[currentStep - 2] = {
              ...newData[currentStep - 2],
              arrival_time: calculatedArrival.format('YYYY-MM-DDTHH:mm')
            };
          }
          return newData;
        });
      } else {
        // Fallback to noon if no previous information available
        calculatedStartTime = dayjs(`${baseStartDate} 12:00`);
      }
    }
    
    // Set the calculated time to state
    setCurrentModeDepartureDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartDate(calculatedStartTime.format("YYYY-MM-DD"));
    setComboStartTime(calculatedStartTime.format("HH:mm"));
    setCurrentModeDepartureTime(calculatedStartTime.format("HH:mm"));
  
    // Initialize Flight or Taxi modes
    if (["Flight", "Taxi"].includes(currentTransfer.mode)) {
      if (!selectedModeIds[currentStep - 1]) {
        handleSelect(
          currentStep - 1,
          currentTransfer,
          "",
          currentTransfer.mode
        );
  
        if (currentTransfer.mode === "Flight") {
          if (!skipFlightFetch) setShowComboFlightModal(true);
          else setSkipFlightFetch(false);
        }
  
        if (currentTransfer.mode === "Taxi") {
          if (!skipTaxiFetch) setShowComboTaxiModal(true);
          else setSkipTaxiFetch(false);
        }
      }
    } else {
      if (!selectedModeIds[currentStep - 1]) {
        handleSelect(currentStep - 1, null, "", currentTransfer.mode);
      }
    }
  }, [currentStep, transfer]);
  
  // useEffect for propagating time changes based on selectedData changes
  useEffect(() => {
    if (Object.keys(selectedModeIds).length > 0) {
      for (let i = 0; i < transfer.length - 1; i++) {
        // If current step has data but next step doesn't, and current has arrival time
        if (selectedData[i] && !selectedData[i+1] && selectedData[i].arrival_time) {
          let arrivalMoment = dayjs(selectedData[i].arrival_time);
          let nextDepartureTime = arrivalMoment.add(1, 'hour');
          
          // If this is the step before current step, update current step's departure time
          if (i === currentStep - 2) {
            setCurrentModeDepartureDate(nextDepartureTime.format("YYYY-MM-DD"));
            setCurrentModeDepartureTime(nextDepartureTime.format("HH:mm"));
            setComboStartDate(nextDepartureTime.format("YYYY-MM-DD"));
            setComboStartTime(nextDepartureTime.format("HH:mm"));
          }
        }
        // Check for non-Flight/non-Taxi modes that might be missing arrival_time
        else if (selectedData[i] && !selectedData[i].arrival_time && 
                selectedData[i].departure_time && selectedData[i].duration &&
                selectedData[i].mode !== "Flight" && selectedData[i].mode !== "Taxi") {
          
          // Calculate and store arrival_time
          const departureDateTime = dayjs(selectedData[i].departure_time);
          const arrivalDateTime = departureDateTime.add(selectedData[i].duration, 'minute');
          
          setSelectedData(prev => {
            const newData = [...prev];
            newData[i] = {
              ...newData[i],
              arrival_time: arrivalDateTime.format('YYYY-MM-DDTHH:mm')
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
        const dropdownElement = document.getElementById('time-dropdown');
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setShowTimeDropdown(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showTimeDropdown]);

  return (
    <div className="w-full bg-white">
      {currentStep === 0 && (
        <div
          className="flex justify-between items-center p-3 md:p-4 border border-b cursor-pointer shadow-md"
          onClick={() => setCurrentStep(1)}
        >
          <div className="text-sm md:text-base">
            <span className="font-medium">
              {name}{" "}
            </span>
            <p className="font-normal">
              {Math.ceil(
                transfer.reduce((sum, t) => sum + (t.duration || 0), 0) / 60
              )}{" "}
              hours | {totalDistance} kms
            </p>
          </div>
          <AiOutlineRight size={16} className="md:text-20" />
        </div>
      )}

      {/* Expanded content */}
      {currentStep >= 1 && (
        <>
          <div className="flex justify-between items-center p-3 md:p-4 border border-b cursor-pointer shadow-md">
            <div className="font-bold text-sm md:text-base">
              {sequencedModes.join(", ")} |
              <span className="font-normal">
                {Math.ceil(
                  transfer.reduce((sum, t) => sum + (t.duration || 0), 0) / 60
                )}{" "}
                hours | {totalDistance} kms
              </span>
            </div>
            <AiOutlineUp size={16} className="md:text-20" />
          </div>
          <div className="border">
            <div className="w-full bg-yellow-50 border-b-[#ffd201] border-b-1 rounded-md p-2 md:p-4">
              <div className="relative flex justify-between items-center  mb-1 md:mb-2 p-1 md:p-2">
                <div className="flex items-center w-full justify-center">
                  {transfer.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center  justify-center"
                    >
                      <div
                        className={`flex items-center gap-2 justify-center ${
                          currentStep === index + 1
                            ? "bg-[#FFF6C2]"
                            : "bg-[#FAF8E7]"
                        } p-2 rounded-lg`}
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            currentStep === index + 1
                              ? "bg-yellow-400"
                              : "bg-gray-200"
                          }`}
                        >
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium">{item.mode}</span>
                      </div>

                      {index < transfer.length - 1 && (
                        <div
                          className={`w-16 h-[3px] ${
                            currentStep === index + 2
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                          } mx-2`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center p-4 relative">
              <span className="text-[#2AAAFF] font-medium text-sm z-10 pr-3">
                {transfer[currentStep - 1]?.source?.city_name}
              </span>

              <div className="absolute left-0 right-0 flex justify-center items-center">
                <div className="border-t border-dotted border-gray-400 w-[50%] mx-8"></div>
              </div>

              <span className="bg-gray-100 text-gray-700 text-sm px-4 py-1 rounded-full z-10 mx-4">
                {transfer[currentStep - 1]?.distance} km
              </span>

              <span className="text-green-600 font-medium text-sm z-10  pl-3">
                {transfer[currentStep - 1]?.destination?.city_name}
              </span>
            </div>

            {currentStep >= 1 && currentStep <= totalSteps && (
              <div className="space-y-3 md:space-y-4">
                {getCurrentTransfer().map((option, index) => {
                  if (option.mode === "Flight") {
                    return (
                      <ComboFlight
                        key={option.id}
                        combo={true}
                        edge={option?.id}
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
                        selectedTransferHeading={selectedTransferHeading}
                        fetchData={fetchData}
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
                        skipFetch={skipFlightFetch}
                        onFilterApplied={handleFilterApplied}
                        dCityData={dCityData}
                        oCityData={oCityData}
                        source_itinerary_city_id={origin_itinerary_city_id}
                        destination_itinerary_city_id={destination_itinerary_city_id}
                      />
                    );
                  }
                  if (option.mode === "Taxi") {
                    return (
                      <ComboTaxi
                        key={option.id}
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
                        selectedTransferHeading={selectedTransferHeading}
                        fetchData={fetchData}
                        setShowLoginModal={setShowLoginModal}
                        check_in={check_in}
                        _GetInTouch={_GetInTouch}
                        daySlabIndex={daySlabIndex}
                        elementIndex={elementIndex}
                        routeId={routeId}
                        mercuryTransfer={mercuryTransfer}
                        individual={individual}
                        originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
                        destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
                        isSelected={
                          selectedModeIds[currentStep - 1] === option.id
                        }
                        onSelect={handleTaxiSelection}
                        comboStartDate={comboStartDate}
                        comboStartTime={comboStartTime}
                        onFilterApplied={handleFilterApplied}
                        dCityData={dCityData}
                        oCityData={oCityData}
                      />
                    );
                  }

                  if (option.prices && option.prices.length > 0) {
                    const formatTimeForDisplay = (timeValue) => {
                      console.log("Time Value",timeValue);
                       if (!timeValue) return "";
                     
                       const timeOption = timeOptions.find(option => option.value === timeValue);
                       if (timeOption) {
                         return timeOption.display;
                       }
                      
                     
                       const [hours, minutes] = timeValue.split(':');
                       const hour = parseInt(hours, 10);
                       const hour12 = hour % 12 || 12;
                       const period = hour < 12 ? 'AM' : 'PM';
                       return `${hour12}:${minutes} ${period}`;
                     };
                    return (
                      <>
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                            <div className="mb-2 sm:mb-0">
                              <span className="text-sm text-gray-600">
                                Departure Date:{" "}
                              </span>
                              <span className="font-semibold">
                                {currentModeDepartureDate}
                              </span>
                            </div>

                            <div className="time-dropdown-container relative w-full sm:w-auto" id="time-dropdown">
                            <div className="time-dropdown-container relative w-full sm:w-auto" id="time-dropdown">
                              <div
                                className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowTimeDropdown(!showTimeDropdown);
                                }}
                              >
                                <span className="text-sm font-medium">
                                  Departure Time: {formatTimeForDisplay(currentModeDepartureTime)}
                                  {/* {
                                    timeOptions.find(t => t.value === currentModeDepartureTime)?.display || 
                                    currentModeDepartureTime
                                  } */}
                                  
                                </span>
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-4 w-4 ml-2" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d={showTimeDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                                  />
                                </svg>
                          
                              </div>
                              
                              {showTimeDropdown && (
                                <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-48 max-h-60 overflow-y-auto">
                                  {timeOptions.map((time, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${
                                        time.value === currentModeDepartureTime ? 'bg-gray-100 font-medium' : ''
                                      }`}
                                      onClick={() => handleTimeSelect(time.value)}
                                    >
                                      {time.display}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                              
                              {showTimeDropdown && (
                                <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-48 max-h-60 overflow-y-auto">
                                  {timeOptions.map((time, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${
                                        time.value === currentModeDepartureTime ? 'bg-gray-100 font-medium' : ''
                                      }`}
                                      onClick={() => handleTimeSelect(time.value)}
                                    >
                                      {time.display}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {option.prices.map((priceOption, priceIndex) => {
                          const price = priceOption.price || 0;
                          const currency =
                            priceOption.currency === "INR"
                              ? "₹"
                              : priceOption.currency;
                          const priceOptionId = `${option.id}-${priceIndex}`;

                          return (
                            <div
                              key={`${option.id}-price-${priceIndex}`}
                              className="flex flex-col md:flex-row justify-between bg-white p-3 md:p-4 border-b"
                            >
                              <div className="flex gap-2 md:gap-3 mb-2 md:mb-0">
                                <div className="text-gray-500 mt-1">
                                  {getModeIcon(option.mode)}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm md:text-base">
                                    {option.text}{" "}
                                     {priceOption.name
                                      ? `- ${priceOption.name}`
                                      : ""}
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-600">
                                    {Math.floor(option?.duration / 60) +
                                      "-" +
                                      Math.ceil(option?.duration / 60)}{" "}
                                    hours | {option.distance} kms
                                  </div>
                                 { priceOption?.class && <div className="text-xs md:text-sm">
                                    <span className="font-semibold">
                                      Facilities:
                                    </span>{" "}
                                    {priceOption?.class}
                                  </div>}
                                  {priceOption.description && (
                                    <div className="text-xs md:text-sm text-gray-700 mt-1">
                                      {priceOption.description}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-col gap-2 items-center md:items-center justify-center">
                                <div className="font-semibold text-sm md:text-base">
                                  {currency} {price} {`/-`}
                                </div>
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const selectedPriceData = {
                                      ...option,
                                      selectedPrice: priceOption,
                                    };
                                    handleModeSelect(
                                      currentStep - 1,
                                      priceOptionId,
                                      selectedPriceData,
                                      option.mode
                                    );
                                  }}
                                >
                                  {selectedModeIds[currentStep - 1] ===
                                  priceOptionId ? (
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
                        })}
                      </>
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
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between">
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
                                option.mode
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

                {/* Navigation buttons */}
                <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-stretch md:items-center p-3 md:p-4">
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
                      className={`px-6 md:px-8 py-2 rounded-md font-medium text-sm md:text-base w-full md:w-auto
                        ${
                          isCurrentModeSelected()
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      disabled={!isCurrentModeSelected()}
                    >
                      Next
                    </button>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                      <button
                        onClick={handleUpdateTransfer}
                        className={`px-6 md:px-8 py-2 rounded-md font-medium text-sm md:text-base w-full md:w-auto relative
  ${
    Object.keys(selectedModeIds).length === totalSteps
      ? "bg-black text-white"
      : "bg-gray-200 text-gray-500 cursor-not-allowed"
  }`}
                        disabled={
                          Object.keys(selectedModeIds).length !== totalSteps ||
                          updateLoading
                        }
                      >
                        <div className="flex items-center justify-center min-w-[140px]">
                          {updateLoading ? (
                            <PulseLoader
                              size={15}
                              speedMultiplier={0.6}
                              color="#FFFFFF"
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

const MobileRouteContainer = (props) => {
  const { transferIndex, transfer, handleSelect } = props;
  const [viewMore, setViewMore] = useState(false);
  const [singleTransfer, setSingleTransfer] = useState(transfer[0]);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  const getHours = () => {
    const from = Math.floor(singleTransfer.duration / 60);
    const to = Math.ceil(singleTransfer.duration / 60);

    if (from) {
      return `${from}-${to} hours`;
    }

    return `${to} hour`;
  };

  return (
    <div
      className={`w-full flex flex-col gap-3 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
        transferIndex === 0 ? "border-yellow-300" : ""
      } border-x-2 border-t-2 border-b-4`}
    >
      {singleTransfer[0]?.recommended && (
        <ClippathComp className="text-sm font-semibold bg-[#F7E700] text-#090909 pl-2 pr-2 py-1 -ml-4 -mt-4 rounded-tl-2xl">
          Recommended
        </ClippathComp>
      )}

      {transfer.length > 1 ? (
        viewMore ? (
          <div className="w-full flex flex-col items-center justify-center">
            <MobileMultiModeContainer
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
            <MobileMultiRoute
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
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <div
              className={`w-[50px] h-[50px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={singleTransfer.mode}
                Instyle={{
                  fontSize: singleTransfer.mode === "Bus" ? "2rem" : "2.5rem",
                  color: "black",
                }}
                classname={{ width: 50, height: 50 }}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="text-[16px] font-[600] leading-3">
                {singleTransfer.text}
              </div>

              <div className="text-sm text-gray-400">
                {singleTransfer?.duration && `${getHours()}`}
                {singleTransfer?.distance &&
                  ` | ${singleTransfer.distance} Kms`}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              {singleTransfer?.facilities?.length ? (
                <div className="text-sm">
                  Facilities:{" "}
                  {singleTransfer.facilities?.map((facility, index) => (
                    <span key={index}>
                      <span key={index}>{facility}</span>
                      {index < singleTransfer.facilities?.length - 1 && " | "}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-row items-end justify-between mb-2">
              <div className="flex flex-col gap-2 items-start">
                <EstimatedCost cost={singleTransfer?.prices[0]?.price} />
              </div>

              <SelectButton
                transfer={singleTransfer}
                transferIndex={transferIndex}
                handleSelect={handleSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileMultiRoute = (props) => {
  const { transferIndex, transfer, handleSelect, setViewMore } = props;

  const getHours = () => {
    const from = Math.floor(transfer.duration / 60);
    const to = Math.ceil(transfer.duration / 60);

    if (from) {
      return `${from}-${to} hours`;
    }

    return `${to} hour`;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row items-center gap-2">
        <div
          className={`w-[50px] h-[50px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={transfer.mode}
            Instyle={{
              fontSize: transfer.mode === "Bus" ? "2rem" : "2.5rem",
              color: "black",
            }}
            classname={{ width: 50, height: 50 }}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col items-start gap-2">
            <div className="text-[16px] font-[600] leading-3">
              {transfer.text}
            </div>

            <button
              onClick={() => setViewMore((prev) => !prev)}
              className="w-fit h-fit text-blue -mt-[0.5rem]"
            >
              +1 more
            </button>
          </div>

          <div className="text-sm text-gray-400">
            {transfer?.duration && `${getHours()}`}
            {transfer?.distance && ` | ${transfer.distance} Kms`}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          {transfer?.facilities?.length ? (
            <div className="text-sm">
              Facilities:{" "}
              {transfer.facilities?.map((facility, index) => (
                <span key={index}>
                  <span key={index}>{facility}</span>
                  {index < transfer.facilities?.length - 1 && " | "}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-end justify-between mb-2">
          <div className="flex flex-col gap-2 items-start">
            <EstimatedCost cost={transfer?.prices[0]?.price} />
          </div>
          <SelectButton
            transfer={transfer}
            transferIndex={transferIndex}
            handleSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

const MobileMultiModeContainer = ({
  transferIndex,
  transfer,
  handleSelect,
}) => {
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
                  TransportMode={singleTransfer?.mode}
                  Instyle={{
                    fontSize:
                      singleTransfer?.mode === "Bus" ? "2rem" : "2.5rem",
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
              <div className="w-full flex flex-col items-start justify-start gap-0">
                <TransferItem transfer={singleTransfer} transferIndex={index} />

                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-2 items-start">
                    <EstimatedCost cost={singleTransfer.prices[0]?.price} />
                  </div>
                  <SelectButton
                    transfer={singleTransfer}
                    transferIndex={transferIndex}
                    handleSelect={handleSelect}
                  />
                </div>
              </div>
            </div>
          </div>

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
          transferType === name ? "border-black" : "border-[#636366]"
        } rounded-full cursor-pointer`}
      >
        {transferType === name && (
          <div id={name} className="p-1 w-3 h-3 rounded-full bg-black"></div>
        )}
      </div>
      <label htmlFor={name} className="text-sm font-normal">
        {label}
      </label>
    </div>
  );
};

const RoundTripSuggestion = ({
  roundTripSuggestions,
  handleRoundTripSelect,
}) => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(roundTripSuggestions.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const routes = [];
    const pricing = [];
    roundTripSuggestions?.routes?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);
    roundTripSuggestions?.data?.cabRate.forEach((route) => {
      pricing.push(route);
    });
    setPricing(pricing);
  }, [roundTripSuggestions]);

  const handleSelectCab = (e) => {
    setSelectError(false);
    setSelectedCab(e.target.id);
  };

  const handleSelect = () => {
    if (selectedCab) {
      handleRoundTripSelect(roundTripSuggestions?.trace_id, +selectedCab);
    } else {
      setSelectError(true);
    }
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4`}
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
              Intercity Round Trip{" "}
              {isDesktop &&
                `(${routes[0]?.source?.shortName} to ${
                  routes[routes.length - 1]?.destination?.shortName
                })`}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {roundTripSuggestions?.data?.quotedDistance} Kms
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
                <div className="text-[14px] font-normal">
                  {route?.source?.shortName} to {route?.destination?.shortName}
                </div>
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
                    id={price?.cab?.id}
                    onClick={handleSelectCab}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      selectedCab == price?.cab?.id
                        ? "border-black"
                        : "border-[#636366]"
                    } `}
                  >
                    {selectedCab == price?.cab?.id && (
                      <div
                        id={price?.cab?.id}
                        className="w-3 h-3 bg-black rounded-full"
                      ></div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-[#636366] text-[14px] font-normal">
                    {price.cab.type}:{" "}
                    <span className="text-black font-bold">
                      ₹{getIndianPrice(Math.floor(price?.fare?.totalAmount))}
                    </span>
                  </div>
                  {(viewDetails[i] || true) && (
                    <div className="text-sm">
                      <span className="font-semibold">Facilities: </span>
                      {price?.cab?.seatingCapacity
                        ? `${price.cab.seatingCapacity} Seating Capacity | `
                        : null}
                      {price?.cab?.bagCapacity
                        ? `${price.cab.bagCapacity} Bag Capacity | `
                        : null}
                      {price?.cab?.bigBagCapaCity
                        ? `${price.cab.bigBagCapaCity} Big Bag Capacity | `
                        : null}
                      {price?.cab?.fuelType
                        ? ` Fuel Type ${price.cab?.fuelType}`
                        : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={handleSelect}
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent checked={false} className="mb-1" />
          <label className="text-center cursor-pointer">{"Select"}</label>
        </div>
      </div>
    </div>
  );
};

const MultiCityTripSuggestion = ({
  multiCitySuggestions,
  handleRoundTripSelect,
}) => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(multiCitySuggestions.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const routes = [];
    const pricing = [];
    multiCitySuggestions?.routes?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);
    multiCitySuggestions?.data?.cabRate.forEach((route) => {
      pricing.push(route);
    });
    setPricing(pricing);
  }, [multiCitySuggestions]);

  const handleSelectCab = (e) => {
    setSelectError(false);
    setSelectedCab(e.target.id);
  };

  const handleSelect = () => {
    if (selectedCab) {
      handleRoundTripSelect(multiCitySuggestions?.trace_id, +selectedCab);
    } else {
      setSelectError(true);
    }
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4`}
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
              Destination Taxi Only {isDesktop && "(Multicity)"}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {multiCitySuggestions?.data?.quotedDistance} Kms
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
                <div className="text-[14px] font-normal">
                  {route?.source?.shortName} to {route?.destination?.shortName}
                </div>
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
                    id={price?.cab?.id}
                    onClick={handleSelectCab}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      selectedCab == price?.cab?.id
                        ? "border-black"
                        : "border-[#636366]"
                    } `}
                  >
                    {selectedCab == price?.cab?.id && (
                      <div
                        id={price?.cab?.id}
                        className="w-3 h-3 bg-black rounded-full"
                      ></div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-[#636366] text-[14px] font-normal">
                    {price.cab.type}:{" "}
                    <span className="text-black font-bold">
                      ₹{getIndianPrice(Math.floor(price?.fare?.totalAmount))}
                    </span>
                  </div>
                  {(viewDetails[i] || true) && (
                    <div className="text-sm">
                      <span className="font-semibold">Facilities: </span>
                      {price?.cab?.seatingCapacity
                        ? `${price.cab.seatingCapacity} Seating Capacity | `
                        : null}
                      {price?.cab?.bagCapacity
                        ? `${price.cab.bagCapacity} Bag Capacity | `
                        : null}
                      {price?.cab?.bigBagCapaCity
                        ? `${price.cab.bigBagCapaCity} Big Bag Capacity | `
                        : null}
                      {price?.cab?.fuelType
                        ? ` Fuel Type ${price.cab?.fuelType}`
                        : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={handleSelect}
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent checked={selectedCab} className="mb-1" />
          <label className="text-center cursor-pointer">
            {selectedCab ? "Selected" : "Select"}
          </label>
        </div>
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
  padding: 0.75rem 0.5rem;
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
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherTransfer, setOtherTransfer] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loadingOptionId, setLoadingOptionId] = useState(null);
  const { number_of_adults, number_of_children, number_of_infants } = useSelector(state => state.Itinerary);
  const [showPax, setShowPax] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [localSelectedData, setLocalSelectedData] = useState([]);
  const [isResultSelected, setIsResultSelected] = useState(false);
  const itinerary_id = useSelector(state => state.ItineraryId);
  const [departureTime, setDepartureTime] = useState(currentModeDepartureTime || "00:00");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  
  // Store the last request data to compare changes
  const [lastRequestData, setLastRequestData] = useState(null);
  
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
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour % 12 || 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedHour = hour12.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const display = `${formattedHour}:${formattedMinute} ${period}`;
        const value = `${hour.toString().padStart(2, '0')}:${formattedMinute}`;
        
        options.push({ display, value });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    console.log("Result", selectedResult?.transfer);
    if (selectedResult) {
      setSelectedResult(selectedResult);
      getOtherTrasfer(selectedResult?.transfer);
    }

    if (selectedResult?.selectedPrice) {
      const index = currentStep - 1;
      
      if (setSelectedData) {
        setSelectedData(prev => {
          const newData = Array.isArray(prev) ? [...prev] : [];
          newData[index] = selectedResult;
          return newData;
        });
        
        setLocalSelectedData(prev => {
          const newData = Array.isArray(prev) ? [...prev] : [];
          newData[index] = selectedResult;
          return newData;
        });
      }
    }
  }, [selectedResult]);

  useEffect(() => {
  }, [pax]);

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

  const isPriceOptionSelected = (transferId, priceIndex) => {
    const currentSelection = localSelectedData[currentStep - 1];
    
    if (!currentSelection) return false;
    
    return (
      currentSelection.id === transferId && 
      currentSelection.selectedPrice?.result_index === priceIndex
    );
  };
  
  const handleUpdateTransfer = async () => {
    handleUpdateTransferWithData(localSelectedData);
  };

  const handleModeSelect = (index, priceOptionId, selectedPriceData, mode) => {
    if (updateLoading) {
      return;
    }
    
    const [transferId, priceIndex] = priceOptionId.split('-');
    
    const isDeselecting = isPriceOptionSelected(selectedPriceData.id, parseInt(priceIndex));
    
    setLoadingOptionId(priceOptionId);

    if (isDeselecting) {
      setLocalSelectedData(prev => {
        const newData = [...prev];
        newData[index] = undefined;
        return newData;
      });
      
      if (setSelectedData) {
        setSelectedData(prev => {
          const newData = [...prev];
          newData[index] = undefined;
          return newData;
        });
      }
      
      setLoadingOptionId(null);

      if (handleSelect) {
        handleSelect(
          transferIndex,
          null,
          transfer,
          mode
        );
      }
    } else {
      const newLocalData = [...localSelectedData];
      newLocalData[index] = selectedPriceData;
      setLocalSelectedData(newLocalData);
      
      if (setSelectedData) {
        const newParentData = Array.isArray(setSelectedData) ? [...setSelectedData] : [];
        newParentData[index] = selectedPriceData;
        setSelectedData(newParentData);
      }
      if (handleSelect) {
        handleSelect(
          transferIndex,
          selectedPriceData,
          transfer,
          mode
        );
      }
    
      setTimeout(() => {
        handleUpdateTransferWithData(newLocalData);
      }, 50);
    }
  };

  const addDaysToDate = (dateString, numberOfDays) => {
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

  const handleTimeSelect = (time) => {
    setDepartureTime(time.value);
    setShowTimeDropdown(false);
    // const newTime = time.value;
    // handleUpdateTransferWithData(localSelectedData, newTime);
  };

  const buildRequestPayload = (updatedData, newTime = null) => {
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
        };

        if (transferItem.mode === "Flight") {
          return {
            ...transferObj,
            result_index: item.resultIndex || item.result_index || 0,
            trace_id: item?.trace_id || localStorage.getItem("Travclan_trace_id") || "",
          };
        } else if (transferItem.mode === "Taxi") {
          return {
            ...transferObj,
            trace_id: item.trace_id || "",
            result_index: item.result_index || 0,
            source: item.source || "",
          };
        } else {
          let resultIndex = 0;
          
          if (item.selectedPrice) {
            resultIndex = item.selectedPrice.result_index || 0;
          }
          
          return {
            ...transferObj,
            result_index: resultIndex,
          };
        }
      })
      .filter(Boolean);
      
    if (transfersPayload.length === 0 && !newTime) {
      throw new Error("No valid transfer options selected");
    }

    const baseStartDate =
      dCityData?.start_date ??
      (oCityData?.start_date && oCityData?.duration != null
        ? addDaysToDate(oCityData.start_date, oCityData.duration)
        : dayjs().format("YYYY-MM-DD"));
  
    const timeToUse = newTime || departureTime;
    
  
    const requestBody = {
      destination_itinerary_city: (destination_itinerary_city_id)
        ? destination_itinerary_city_id
        : null,
      source_itinerary_city: (origin_itinerary_city_id)
        ? origin_itinerary_city_id
        : null,
      number_of_adults: pax.adults,
      number_of_children: pax.children,
      number_of_infants: pax.infants,
      start_datetime: `${baseStartDate}T${timeToUse}:00`,
      transfers: transfersPayload,
    };

    if (selectedBooking?.id) {
      requestBody.booking_id = selectedBooking.id;
    }

    return requestBody;
  };

  const handleUpdateTransferWithData = async (updatedData, newTime = null) => {
    try {
      const newRequestBody = buildRequestPayload(updatedData, newTime);
      
      if (lastRequestData && 
          newTime === null && 
          JSON.stringify(lastRequestData.transfers) === JSON.stringify(newRequestBody.transfers) &&
          lastRequestData.start_datetime === newRequestBody.start_datetime &&
          (lastRequestData.number_of_adults !== newRequestBody.number_of_adults ||
           lastRequestData.number_of_children !== newRequestBody.number_of_children ||
           lastRequestData.number_of_infants !== newRequestBody.number_of_infants)) {
        
        console.log("Only pax changed, not making API call");
        setLastRequestData(newRequestBody);
        return;
      }
      setUpdateLoading(true);
      
      console.log("Sending request body:", newRequestBody);
      
      const response = await UpdateTransferMode.post(
        `${itinerary_id}/bookings/transfer/`,
        newRequestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setLastRequestData(newRequestBody);

      const data = response.data;
      setIsResultSelected(true);

      dispatch(
        updateSingleTransferBooking(
          `${origin_itinerary_city_id}:${destination_itinerary_city_id}`,
          data
        )
      );

      getPaymentHandler();

      console.log("Key to update", origin_itinerary_city_id, destination_itinerary_city_id);
      console.log("Transfer updated successfully:", data);

      if (!newTime) {
        hideDrawer();

        dispatch(openNotification({
          text: `Transfer from ${city || transfer[0]?.source?.city_name} to ${dcity || transfer[0]?.destination?.city_name} has been updated successfully!`,
          heading: "Success!",
          type: "success",
        }));
      } else {
        dispatch(openNotification({
          text: `Departure time updated successfully!`,
          heading: "Success!",
          type: "success",
        }));
      }
    } catch (error) {
      console.error("Error updating transfer:", error);
      dispatch(openNotification({
        text: error.message || "Error updating Transfers!",
        heading: "Error!",
        type: "error",
      }));
    } finally {
      setUpdateLoading(false);
      setLoadingOptionId(null);
    }
  };

  const formatTimeForDisplay = (timeValue) => {
   console.log("Time Value",timeValue);
    if (!timeValue) return "";
  
    const timeOption = timeOptions.find(option => option.value === timeValue);
    if (timeOption) {
      return timeOption.display;
    }
   
  
    const [hours, minutes] = timeValue.split(':');
    const hour = parseInt(hours, 10);
    const hour12 = hour % 12 || 12;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${period}`;
  };

  const handlePaxChange = (newPax) => {
    setPax(newPax);
  
  };

  return (
    <Container>
      <div className="w-full">
        <div className="flex justify-end py-2">
          <Pax
            setShowPax={setShowPax}
            pax={pax}
            setPax={handlePaxChange} 
            showPax={showPax}
            combo={true}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">Departure Date: </span>
            <span className="font-semibold">{currentModeDepartureDate}</span>
          </div>

          <div className="time-dropdown-container relative w-full sm:w-auto" ref={ref}>
            <div
              className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
              onClick={() => setShowTimeDropdown(prev => !prev)}
            >
              <span className="text-sm font-medium">
                Departure Time: {formatTimeForDisplay(departureTime)}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${showTimeDropdown ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            {showTimeDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-48 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {timeOptions.map((time, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time.display}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {otherTransfer &&
        otherTransfer.prices &&
        otherTransfer.prices.length > 0 &&
        otherTransfer.prices.map((priceOption, priceIndex) => {
          const price = priceOption.price || 0;
          const currency =
            priceOption.currency === "INR" ? "₹" : priceOption.currency;
          const priceOptionId = `${otherTransfer.id}-${priceIndex}`;
          
        
          const isOptionSelected = isPriceOptionSelected(otherTransfer.id, priceIndex);
          
        
          const isOptionLoading = loadingOptionId === priceOptionId;

          return (
            <div
              key={`${otherTransfer.id}-price-${priceIndex}`}
              className={`flex w-full flex-col md:flex-row justify-between bg-white p-3 md:p-4 border-b
                ${isOptionSelected ? "border-blue-500 bg-blue-50" : ""}`}
            >
              <div className="flex gap-2 md:gap-3 mb-2 md:mb-0">
                <div className="text-gray-500 mt-1">
                  {getModeIcon(otherTransfer.mode)}
                </div>
                <div>
                  <div className="font-semibold text-sm md:text-base">
                    {otherTransfer.text}{" "}
                    {priceOption.name ? `- ${priceOption.name}` : ""}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {Math.floor(otherTransfer?.duration / 60) +
                      "-" +
                      Math.ceil(otherTransfer?.duration / 60)}{" "}
                    hours | {otherTransfer.distance} kms
                  </div>
                  {priceOption?.class && (
                    <div className="text-xs md:text-sm">
                      <span className="font-semibold">Facilities:</span>{" "}
                      {priceOption?.class}
                    </div>
                  )}
                  {priceOption.description && (
                    <div className="text-xs md:text-sm text-gray-700 mt-1">
                      {priceOption.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-col gap-2 items-center md:items-end justify-between">
                <div className="text-md font-bold">
                  <span
                    className="!font-[lexend]"
                    style={{ fontFamily: "Lexend" }}
                  >
                    {currency} {price} {`/-`}
                  </span>
                </div>
                
                <div
                  className={`cursor-pointer ${updateLoading && !isOptionLoading ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (updateLoading && !isOptionLoading) return;
                    const selectedPriceData = {
                      ...otherTransfer,
                      selectedPrice: {
                        ...priceOption,
                        result_index: priceIndex
                      },
                    };
                    
                    handleModeSelect(
                      currentStep - 1,
                      priceOptionId,
                      selectedPriceData,
                      otherTransfer.mode
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
        })}
      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </Container>
  );
};


const MercuryTransfer = ({ transfer, setShowMercuryTransfer }) => {
  // const handleSelectPrice = (index) => {
  //   setSelectedResult((prev) => {
  //     return {
  //       ...prev,
  //       trace_id: traceId,
  //       result_index: otherTransfer.prices[index].result_index,
  //     };
  //   });

  //   setShowOtherTrasfer(false);
  // };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowMercuryTransfer(false);
      }}
      className="absolute z-50 flex items-center justify-center bg-black bg-opacity-50 top-0 bottom-0 left-0 right-0 -mx-2"
    >
      <div className="bg-white w-fit p-3 rounded-lg space-y-5">
        <div className="text-lg">Select your seat</div>

        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col gap-2">
            {transfer &&
              transfer.prices.map((price, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectPrice(i)}
                  className="flex flex-row items-center justify-between gap-5 hover:bg-gray-200 cursor-pointer p-1 rounded-md"
                >
                  <div>{price.class ? price.class : "Seater"}</div>
                  <div className="font-semibold">
                    ₹{getIndianPrice(price.price)}/-{" "}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MercurySelectButton = ({
  transfer,
  setShowMercuryTransfer,
  setSelectedMercuryTransfer,
}) => {
  const getLabel = () => {
    return `Select a ${transfer.mode}`;
  };

  return (
    <div className="group text-blue flex flex-row items-center cursor-pointer hover:translate-x-1 transition-all">
      <button
        onClick={() => {
          setShowMercuryTransfer(true);
          setSelectedMercuryTransfer(transfer);
        }}
        className="focus:outline-none"
      >
        {getLabel()}
      </button>

      <RiArrowRightSLine className="text-xl group-hover:scale-110 group-hover:translate-x-1 transition-all" />
    </div>
  );
};
