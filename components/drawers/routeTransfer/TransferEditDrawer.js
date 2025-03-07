import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import Drawer from "../../ui/Drawer";
import transferEdit from "../../../services/itinerary/brief/transferEdit";
import axiosRoundTripEditInstance from "../../../services/itinerary/brief/roudTripEdit";
import {
  routeDetails,
  otherTransferSearch,
} from "../../../services/itinerary/brief/transferEdit";
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
import { fetchTransferMode } from "../../../services/bookings/FetchTaxiRecommendations";
import { PulseLoader } from "react-spinners";
import { FaMapMarkerAlt } from "react-icons/fa";

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
    city,
    dcity,
    oCityData,
    dCityData,
    mercury
  } = props;

  const isDesktop = useMediaQuery("(min-width:768px)");
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [transfersError, setTransfersError] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [transferType, setTransferType] = useState(
    TRANSFER_TYPES.ONEWAYTRIP.name
  );
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showOtherTransfer, setShowOtherTrasfer] = useState(false);
  const [showMercuryTransfer, setShowMercuryTransfer] = useState(false);
  const [selectedMercuryTransfer, setSelectedMercuryTransfer] = useState(null);

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


    {mercury || props?.isMercury ?
      fetchTransferMode
      .post("",{origin: props?.origin, destination: props?.destination, number_of_adults: 1, number_of_children: 1, number_of_infants:3, top_only:"false"})
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

      : 
      
      routeDetails
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
    !mercury && axiosRoundTripInstance
      .get(`?itinerary_id=${props?.ItineraryId}`)
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

  const handleSelect = (index, transfer, multimode) => {
    const access_token = localStorage.getItem("access_token");
    if (!props.token) {
      setShowLoginModal(true);
      return;
    }

    switch (transfer.mode) {
      case "Flight":
        setSelectedResult({ transferIndex: index, mode: transfer.mode });
        setShowFlightModal(true);
        break;
      case "Taxi":
        setSelectedResult({ transferIndex: index, mode: transfer.mode });
        setShowTaxiModal(true);
        break;
      default:
        setSelectedResult({
          transferIndex: index,
          mode: transfer.mode,
          transfer: transfer,
        });
        setShowOtherTrasfer(true);
        break;
    }

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `Select`,
        evemt_value: `Select ${transfer.mode}`,
        event_action: "Transfer Add/Change Drawer",
      },
    });
  };

  const handleSelectResult = (result) => {
    setSelectedResult((prev) => {
      if (prev.multimode) {
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
    setShowFlightModal(false);
    setShowTaxiModal(false);
  };

  const handleRoundTripSelect = (trace_id, cab_id) => {
    console.log(trace_id);
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
    !mercury && axiosRoundTripEditInstance
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
      })
      .catch((err) => {
        setSelectLoading(false);
        setShowDrawer(false);
        if (err.response.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
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
      onHide={() => setShowDrawer(false)}
      mobileWidth={"100vw"}
      width="50vw"
    >
      <div className="relative px-2 bg-white z-[900] flex flex-col gap-4 pt-4 pb-[100px] justify-start items-start mx-auto w-[98%] min-h-screen">
        <div className="flex flex-row gap-3 my-0 justify-start items-center">
          <IoMdArrowRoundBack
            onClick={() => setShowDrawer(false)}
            className="hover-pointer text-3xl font-semibold"
          />
          <div className="text-lg md:text-2xl lg:text-2xl font-semibold">
            {props.addOrEdit === "transferAdd" ? "Adding" : "Changing"} transfer
            from {city} to {dcity}{" "}
          </div>
        </div>

        {mercury ? showOtherTransfer && (
          <OtherTransfer
            showOtherTransfer={showOtherTransfer}
            setShowOtherTrasfer={setShowOtherTrasfer}
            selectedResult={selectedResult}
            setSelectedResult={setSelectedResult}
            number_of_travellers={
              props?.plan?.number_of_adults + props?.plan?.number_of_children
            }
            check_in={check_in}
          /> ): showMercuryTransfer && (
            <MercuryTransfer
            transfer={selectedMercuryTransfer}
            setShowMercuryTransfer={setShowMercuryTransfer}
            />
        )
      }

        {loadingTransfers ? (
          <div className="mt-10 w-full flex flex-col gap-3 items-center">
            <div className="w-full flex flex-row items-center gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
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
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
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
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
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
            
            <div className="w-full flex flex-row gap-4 px-2 whitespace-nowrap overflow-x-auto hide-scrollbar">
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
            </div>

            {selectLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="mb-96">
                  <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
                </div>
              </div>
            )}

            {transferType === TRANSFER_TYPES.ONEWAYTRIP.name ? (
              <>
                <div className="w-full flex justify-start">
                  {transfers.length < 2
                    ? `${transfers.length} way`
                    : `${transfers.length} ways`}{" "}
                  to travel from {city} to {dcity}
                </div>
                <div className="w-full flex flex-col items-center gap-3">
                  {transfers.map((transfer, index) => {
                    if (isDesktop)
                      return (
                        <RouteContainer
                          key={index}
                          transferIndex={index}
                          transfer={transfer}
                          handleSelect={handleSelect}
                          selectedResult={selectedResult}
                          setShowMercuryTransfer={setShowMercuryTransfer}
                          setSelectedMercuryTransfer={setSelectedMercuryTransfer}
                          mercury={true}
                        />
                      );
                    return (
                      <MobileRouteContainer
                        key={index}
                        transferIndex={index}
                        transfer={transfer}
                        handleSelect={handleSelect}
                      />
                    );
                  })}
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
        origin={selectedBooking?.origin?.shortName || oCityData?.gmaps_place_id || oCityData?.city?.id}
        destination={selectedBooking?.destination?.shortName || dCityData?.gmaps_place_id || dCityData?.city?.id}
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
  const { transferIndex, transfer, handleSelect, selectedResult } = props;
  const [viewMore, setViewMore] = useState(false);
  const [singleTransfer, setSingleTransfer] = useState(transfer[0]);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  
  return (
    <div
      className={`w-full flex flex-col gap-0 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
        transferIndex === 0 && transfer[0]?.isSelected
          ? "border-yellow-300"
          : ""
      } border-x-2 border-t-2 border-b-4`}
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
        <div className="flex flex-row gap-2 w-full">
          <div
            className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
          >
            <TransfersIcon
              TransportMode={singleTransfer.mode}
              Instyle={{
                fontSize: singleTransfer.mode === "Bus" ? "2.5rem" : "3rem",
                color: "black",
              }}
              classname={{ width: 80, height: 75 }}
            />
          </div>

          <div className="w-full flex flex-col gap-2 justify-center">
            <div className="flex flex-row items-center justify-between">
              <TransferItem transfer={singleTransfer} />
              <div className="flex flex-col gap-2 items-end">
                <EstimatedCost cost={singleTransfer?.prices[0]?.price} />
                {/* {
                singleTransfer?.mode === "Bus" || singleTransfer?.mode === "Train" || singleTransfer?.mode === "Ferry" || singleTransfer?.mode === "Car" ? <MercurySelectButton transfer={singleTransfer} setShowMercuryTransfer={props?.setShowMercuryTransfer} setSelectedMercuryTransfer={props?.setSelectedMercuryTransfer}/>: */}
                <SelectButton
                transfer={singleTransfer}
                transferIndex={transferIndex}
                handleSelect={handleSelect}
              />
              {/* } */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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

const SelectButton = ({ multimode, transferIndex, transfer, handleSelect }) => {
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
        onClick={() => handleSelect(transferIndex, transfer, multimode)}
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
  max-width: 100%;
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
  setShowOtherTrasfer,
  selectedResult,
  setSelectedResult,
  number_of_travellers,
  check_in,
  showOtherTransfer
}) => {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherTransfer, setOtherTransfer] = useState(null);
  const [traceId, setTraceId] = useState(null);

  useEffect(() => {
    // getOtherTrasfer(selectedResult.transfer.mode);
    getOtherTrasfer(selectedResult.transfer);
  }, []);

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

  // const getOtherTrasfer = (mode) => {
    // setLoading(true);
    // const requestData = {
    //   edge_id: selectedResult.transfer.id,
    //   start_datetime: `${getDate(check_in || new Date()?.toISOString().split("T")[0])}T00:00:00`,
    //   number_of_travellers: number_of_travellers || 1,
    // };

    // otherTransferSearch
    //   .post(`${mode.toLowerCase()}/search/`, requestData)
    //   .then((res) => {
    //     if (res.data.success) {
    //       setTraceId(res.data.trace_id);
    //       setOtherTransfer(res.data.data);
    //     } else {
    //       setError("Prices not found at the moment, please try again!");
    //     }

    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     setError("Something went wrong, please try again!");
    //   });
    const getOtherTrasfer = (transfer) => {
      setLoading(false);
    setOtherTransfer(transfer);
  };

  return (
    
    <Drawer
      show={showOtherTransfer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1502 }} 
      className="font-lexend"
      onHide={() => setShowOtherTrasfer(false)}
      mobileWidth={"100vw"}
      width="50vw"
    >
    {/* <div
      onClick={handleClose}
      className="absolute z-50 flex items-center justify-center bg-black bg-opacity-50 top-0 bottom-0 left-0 right-0 -mx-2"
    >
      <div ref={ref} className="bg-white w-fit p-3 rounded-lg space-y-5">
        <div className="text-lg">Select your seat</div>

        <div className="w-full flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center w-4 h-4 border-2 border-t-black rounded-full animate-spin"></div>
          ) : error ? (
            <div className="bg-red-500 text-white p-1 rounded-md">{error}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {otherTransfer &&
                otherTransfer.prices.map((price, i) => (
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
          )}
        </div>
      </div>
    </div> */}
            <Container>
          <div className="flex flex-row gap-3 my-0 justify-start items-center">
          <IoMdArrowRoundBack
            onClick={() => setShowOtherTrasfer(false)}
            className="hover-pointer text-3xl font-semibold"
          />
        </div>
          {otherTransfer &&
           otherTransfer.prices.map((price, i) => (
            <div key={i} className="flex items-center p-4 border rounded-lg shadow-md w-full max-w-full mb-3">
            <div className="flex items-center gap-4 justify-between w-full ">
              <TransfersIcon
                TransportMode={otherTransfer.mode}
                Instyle={{
                  fontSize: otherTransfer.mode === "Bus" ? "2.5rem" : "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
              <div className="flex-1">
                <Heading>{otherTransfer.mode} (Any)</Heading>
                <ModelText>Swift Dzire or similar</ModelText>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <FaMapMarkerAlt />
                  <Text>{otherTransfer.distance}</Text>
                  <span>&#8226;</span>
                  <Text>4-5 hours</Text>
                </div>
              </div>
              <div className="text-right">
                <Cost>{"₹" + getIndianPrice(Math.ceil(price.price)) + "/-"}</Cost>
                <button className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-black hover:text-white transition-all">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
    </Container>
    </Drawer>
    
  );
};



const MercuryTransfer = ({transfer,setShowMercuryTransfer}) => {
  console.log("Transfer Data",transfer);


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


const MercurySelectButton = ({transfer, setShowMercuryTransfer,setSelectedMercuryTransfer }) => {
  const getLabel = () => {
        return `Select a ${transfer.mode}`;
  };

  return (
    <div className="group text-blue flex flex-row items-center cursor-pointer hover:translate-x-1 transition-all">
      <button
        onClick={() => {setShowMercuryTransfer(true)
          setSelectedMercuryTransfer(transfer)
        }}
        className="focus:outline-none"
      >
        {getLabel()}
      </button>

      <RiArrowRightSLine className="text-xl group-hover:scale-110 group-hover:translate-x-1 transition-all" />
    </div>
  );
};


