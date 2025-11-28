import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState, useEffect } from "react";
import ViewMoreButton from "../../../itinerary/daySummary/ViewMoreButton";
import Details from "../../../../containers/itinerary/TransfersContainer/FlightDetail";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import media from "../../../media";
import { RiArrowDropDownLine } from "react-icons/ri";
import Drawer from "../../../ui/Drawer";
import BackArrow from "../../../ui/BackArrow";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { currencySymbols } from "../../../../data/currencySymbols";

const Container = styled.div`
  width: 100%;
  background-color: white;
  margin: auto;
  ${(props) =>
    props.isSelected &&
    "background : #FFFBBB ; border : 1px solid #F7E700!important"};
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  @media screen and (min-width: 768px) {
    background: white;
    width: 100%;
    position: relative;
  }
`;

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

export function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

const Flight = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [showFareDrawer, setShowFareDrawer] = useState(false);
  const [selectedFareData, setSelectedFareData] = useState(null);
  const [selectedFareIndex, setSelectedFareIndex] = useState(null);
  const currency = useSelector(state=>state.UserLocation).location;


  const totalPax =
    (props?.pax?.adults || 0) + (props?.pax?.children || 0) + (props?.pax?.infants || 0);

  let isPageWide = media("(min-width: 768px)");
  const handleView = () => {
    setViewMore((prev) => !prev);
  };
  return (
    <Container
      className="relative border-b p-2 space-y-3 overflow-visible"
      isSelected={props.isSelected}
    >
      <div className="flex flex-row gap-2 justify-between md:items-start items-center">
        <div className="flex flex-row items-center gap-3">
          <div
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{
              width: isPageWide ? "48px" : "40px",
              height: isPageWide ? "48px" : "40px",
            }}
          >
            <LogoContainer
              data={props.data}
              width={isPageWide ? 48 : 40}
              height={isPageWide ? 48 : 40}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm md:text-md font-semibold flex items-center gap-2 flex-wrap">
              {props.data?.segments?.[0]?.airline?.name}
              {props.data?.is_refundable && (
                <span className="bg-[#4CAF50] text-white  px-2.5 py-0.5 rounded text-[12px] font-medium">
                  Refundable
                </span>
              )}
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              {props.data?.segments?.[0]?.airline?.code}-
              {props.data?.segments?.[0]?.airline?.flight_number}
            </div>
          </div>
        </div>
        {isPageWide && (
          <div className="text-right">
            <div className="text-md md:text-md font-bold">
              {props.data?.final_fare
                ? `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${getIndianPrice(props.data?.final_fare)}`
                : null}
            </div>
            <div className="text-xs text-gray-500">for {(props?.pax?.adults || 0) + (props?.pax?.children || 0) + (props?.pax?.infants || 0)} person</div>
          </div>
        )}
      </div>

      {/* Flight Details Section */}
      <div className="flex flex-row w-full justify-between items-center">
        <FlightDetails
          data={props.data}
          origin={props.data?.segments[0]?.origin}
          destination={
            props.data?.segments[props.data?.segments?.length - 1]?.destination
          }
          duration={
            typeof props.data?.total_duration == "number"
              ? convertMinutesToHours(props.data?.total_duration)
              : props.data?.total_duration
          }
          isNonStop={props.data?.segments?.length === 1}
          numStops={props.data?.segments?.length - 1}
          segments={props.data?.segments}
          setShowDetails={setShowDetails}
        />

        {isPageWide && (
          <div className="flex ">
            <div
              className="text-blue underline text-sm font-medium cursor-pointer flex items-end"
              onClick={handleView}
            >
              {viewMore ? "Hide Details" : "View Details"}
              <RiArrowDropDownLine
                className={`text-lg transition-all duration-200 ${
                  viewMore ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Price and View Details Row */}
      {!isPageWide && (
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-left">
            <div className="text-md font-bold">
              {props.data?.final_fare
                ? `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${getIndianPrice(props.data?.final_fare)}`
                : null}
            </div>
            <div className="text-sm text-gray-600">for {totalPax} person</div>
          </div>
          <div
            className="text-blue-600 text-sm font-medium cursor-pointer flex items-center gap-1"
            onClick={handleView}
          >
            View Details
            <RiArrowDropDownLine
              className={`text-2xl transition-all duration-200 ${
                viewMore ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      )}

      {viewMore && (
        <div className="mt-4">
          {props.data?.other_results && props.data.other_results.length > 0 ? (
      <FareOptionsTable
              otherResults={props.data.other_results}
              onSelectFare={props.onSelect}
              provider={props?.provider}
              _updateBookingHandler={props?._updateBookingHandler}
              selectedBooking={props?.selectedBooking}
              trace_id={props?.trace_id}
              onFlightSelect={props?.onFlightSelect}
              edge={props?.edge}
              booking_id={props?.booking_id}
              selectedResultIndex={
                props?.selectedBooking?.result_index || props.data?.result_index
              }
              setSelectedFareData={setSelectedFareData}
              pax={props?.pax}
              setShowFareDrawer={setShowFareDrawer}
              // PASS NEW PROPS
              selectedFlight={props.selectedFlight}
              setSelectedFlight={props.setSelectedFlight}
              selectedFareInFlight={props.selectedFareInFlight}
              setSelectedFareInFlight={props.setSelectedFareInFlight}
              flightIndex={props.flightIndex}
            />
          ) : (
            <Details
              segments={props.data?.segments}
              provider={props.provider}
              resultIndex={props.data?.result_index}
              setShowDetails={setShowDetails}
              individual={props?.individual}
              originCityId={props.originCityId}
              destinationCityId={props.destinationCityId}
              setTransferBookingsIntercity={props.setTransferBookingsIntercity}
              edge={props?.edge}
              getPaymentHandler={props.getPaymentHandler}
              booking_id={props?.selectedBooking?.id}
              combo={props?.combo}
              setShowLoginModal={props?.setShowLoginModal}
            />
          )}
        </div>
      )}

      <Drawer
        show={showFareDrawer}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1501 }}
        className=" pb-0 md:pb-[100px]"
        width={"50vw"}
        mobileWidth={"100vw"}
        onHide={() => {
          setShowFareDrawer(false);
        }}
      >
        <div className="p-4">
          <BackArrow
            handleClick={() => {
              setShowFareDrawer(false);
            }}
          />
          <div className="text-xl py-2 font-semibold">
            Flight from{" "}
            {selectedFareData?.segments?.[0]?.origin?.city_name ||
              props.data?.segments[0]?.origin?.city_name}{" "}
            to{" "}
            {selectedFareData?.segments?.[
              selectedFareData?.segments?.length - 1
            ]?.destination?.city_name ||
              props.data?.segments[props.data?.segments?.length - 1]
                ?.destination?.city_name}
          </div>
          <div className="p-4 border rounded-lg border-gray-400 mt-1">
            <div className="flex flex-row gap-2 justify-between md:items-start items-center mt-2">
              <div className="flex flex-row items-center gap-3">
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    width: isPageWide ? "48px" : "40px",
                    height: isPageWide ? "48px" : "40px",
                  }}
                >
                  <LogoContainer
                    data={selectedFareData || props.data}
                    width={isPageWide ? 48 : 40}
                    height={isPageWide ? 48 : 40}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm md:text-md font-semibold flex items-center gap-2 flex-wrap">
                    {selectedFareData?.segments?.[0]?.airline?.name ||
                      props.data?.segments?.[0]?.airline?.name}
                    {(selectedFareData?.is_refundable ||
                      props.data?.is_refundable) && (
                      <span className="bg-[#4CAF50] text-white  px-2.5 py-0.5 rounded text-[12px] font-medium">
                        Refundable
                      </span>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {selectedFareData?.segments?.[0]?.airline?.code ||
                      props.data?.segments?.[0]?.airline?.code}
                    -
                    {selectedFareData?.segments?.[0]?.airline?.flight_number ||
                      props.data?.segments?.[0]?.airline?.flight_number}
                  </div>
                </div>
              </div>
              {isPageWide && (
                <div className="text-right">
                  <div className="text-md md:text-md font-bold">
                    {selectedFareData?.final_fare || props.data?.final_fare
                      ? `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${getIndianPrice(
                          selectedFareData?.final_fare || props.data?.final_fare
                        )}`
                      : null}
                  </div>
                  <div className="text-xs text-gray-500">for {totalPax} person</div>
                </div>
              )}
            </div>

            <div className="flex flex-row w-full justify-between items-center">
              <FlightDetails
                data={selectedFareData || props.data}
                origin={
                  selectedFareData?.segments?.[0]?.origin ||
                  props.data?.segments[0]?.origin
                }
                destination={
                  selectedFareData?.segments?.[
                    selectedFareData?.segments?.length - 1
                  ]?.destination ||
                  props.data?.segments[props.data?.segments?.length - 1]
                    ?.destination
                }
                duration={
                  typeof (
                    selectedFareData?.total_duration ||
                    props.data?.total_duration
                  ) == "number"
                    ? convertMinutesToHours(
                        selectedFareData?.total_duration ||
                          props.data?.total_duration
                      )
                    : selectedFareData?.total_duration ||
                      props.data?.total_duration
                }
                isNonStop={
                  (selectedFareData?.segments?.length ||
                    props.data?.segments?.length) === 1
                }
                numStops={
                  (selectedFareData?.segments?.length ||
                    props.data?.segments?.length) - 1
                }
                segments={selectedFareData?.segments || props.data?.segments}
                setShowDetails={setShowDetails}
              />
            </div>

            <div className="mt-2">
              <Details
                segments={selectedFareData?.segments}
                provider={props.provider}
                resultIndex={selectedFareData?.result_index}
                setShowDetails={setShowDetails}
                individual={props?.individual}
                originCityId={props.originCityId}
                destinationCityId={props.destinationCityId}
                setTransferBookingsIntercity={
                  props.setTransferBookingsIntercity
                }
                edge={props?.edge}
                getPaymentHandler={props.getPaymentHandler}
                booking_id={props?.selectedBooking?.id}
                combo={props?.combo}
                setShowLoginModal={props?.setShowLoginModal}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </Container>
  );
};

const FareOptionsTable = ({
  otherResults,
  onSelectFare,
  pax,
  setShowFareDrawer,
  setSelectedFareData,
  selectedBooking,
  _updateBookingHandler,
  provider,
  trace_id,
  onFlightSelect,
  edge,
  booking_id,
  selectedResultIndex,
  // NEW PROPS
  selectedFlight,
  setSelectedFlight,
  selectedFareInFlight,
  setSelectedFareInFlight,
  flightIndex,
}) => {
  const router = useRouter();
  
  const getIndianPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  if (!otherResults || otherResults.length === 0) {
    return null;
  }

  const totalPax =
    (pax?.adults || 0) + (pax?.children || 0) + (pax?.infants || 0);

  const handleFareSelect = (result) => {
    const currentlySelected = 
      selectedFlight === flightIndex && 
      selectedFareInFlight === result.result_index;
    
    if (currentlySelected) {
      // UNCHECK: Clear selection
      setSelectedFlight(null);
      setSelectedFareInFlight(null);
      return;
    }
    
    // CHECK: Set new selection
    setSelectedFlight(flightIndex);
    setSelectedFareInFlight(result.result_index);
    
    // Call onFlightSelect if provided
    onFlightSelect?.();

    if (onSelectFare) {
      onSelectFare({
        ...result,
        resultIndex: result.result_index,
        arrival_time: result?.duration,
        booking_type: "Flight",
        trace_id: trace_id || localStorage.getItem("Travclan_trace_id"),
      });
    } else if (_updateBookingHandler) {
      _updateBookingHandler({
        booking_id: selectedBooking?.id || booking_id,
        itinerary_id: selectedBooking?.itinerary_id || router.query.id,
        result_index: result.result_index,
        flightProvider: provider,
        edge: edge,
      });
    }
  };

  const isSelected = (result) => {
    return (
      selectedFlight === flightIndex && 
      selectedFareInFlight === result.result_index
    );
  };

  return (
    <>
      {/* Desktop View - Table Layout */}
      <div className="max-ph:hidden md:block bg-white rounded-lg overflow-hidden mt-2">
        {/* Header - Updated grid to include Check-In Bag column */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr_auto] gap-4 px-2 py-1 border-b">
          <div className="text-[14px] font-normal text-gray-500">Cabin Bag</div>
          <div className="text-[14px] font-normal text-gray-500">Check-In Bag</div>
          <div className="text-[14px] font-normal text-gray-500">Class</div>
          <div className="text-[14px] font-normal text-gray-500">Refundable</div>
          <div className="text-[14px] font-normal text-gray-500 text-left">
            For {totalPax} {totalPax === 1 ? "person" : "persons"}
          </div>
          <div className="w-16 text-[14px] font-normal text-gray-500 text-left">
            Fare Rule
          </div>
        </div>

        {/* Rows - Updated grid to include Check-In Bag column */}
        <div className="">
          {otherResults.map((result, index) => (
            <div
              key={result.result_index || index}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr_auto] gap-4 px-2 py-2 hover:bg-gray-50 transition-colors items-start"
            >
              <div className="text-base text-gray-900">
                {result.segments?.[0]?.cabin_baggage_allowance || "7 Kg"}
              </div>
              <div className="text-base text-gray-900">
                {result.segments?.[0]?.baggage_allowance || "N/A"}
              </div>
              <div className="text-base text-gray-900">
                {result.segments?.[0]?.cabin_class?.replace(" Class", "") ||
                  "Economy"}
              </div>
              <div className="text-base text-gray-900">
                {result.is_refundable ? "Yes" : "No"}
              </div>
              <div className="text-base font-normal text-gray-900 text-left">
                {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{getIndianPrice(result.final_fare)}
              </div>
              <div className="flex items-start justify-start gap-1">
                <button
                  className="flex items-center justify-center"
                  onClick={() => {
                    setSelectedFareData(result);
                    setTimeout(() => {
                      setShowFareDrawer(true);
                    }, 0);
                  }}
                  title="View details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M5.25 12.75H10.5V11.25H5.25V12.75ZM5.25 9.75H12.75V8.25H5.25V9.75ZM5.25 6.75H12.75V5.25H5.25V6.75ZM3.75 15.75C3.3375 15.75 2.98438 15.6031 2.69063 15.3094C2.39687 15.0156 2.25 14.6625 2.25 14.25V3.75C2.25 3.3375 2.39687 2.98438 2.69063 2.69063C2.98438 2.39687 3.3375 2.25 3.75 2.25H14.25C14.6625 2.25 15.0156 2.39687 15.3094 2.69063C15.6031 2.98438 15.75 3.3375 15.75 3.75V14.25C15.75 14.6625 15.6031 15.0156 15.3094 15.3094C15.0156 15.6031 14.6625 15.75 14.25 15.75H3.75ZM3.75 14.25H14.25V3.75H3.75V14.25Z"
                      fill="#2AB0FC"
                    />
                  </svg>
                </button>
                <p className="text-gray-400 justify-center items-center">|</p>
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-blue-600 items-center justify-center mt-[3px]"
                  checked={isSelected(result)}
                  onChange={() => handleFareSelect(result)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Card Layout with Check-In Bag */}
      <div className="md:hidden space-y-3 mt-2">
        {otherResults.map((result, index) => (
          <div
            key={result.result_index || index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Details</h3>
              <div className="flex items-center gap-2">
                <button
                  className="p-1"
                  onClick={() => {
                    setSelectedFareData(result);
                    setTimeout(() => {
                      setShowFareDrawer(true);
                    }, 0);
                  }}
                  title="View details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M5.25 12.75H10.5V11.25H5.25V12.75ZM5.25 9.75H12.75V8.25H5.25V9.75ZM5.25 6.75H12.75V5.25H5.25V6.75ZM3.75 15.75C3.3375 15.75 2.98438 15.6031 2.69063 15.3094C2.39687 15.0156 2.25 14.6625 2.25 14.25V3.75C2.25 3.3375 2.39687 2.98438 2.69063 2.69063C2.98438 2.39687 3.3375 2.25 3.75 2.25H14.25C14.6625 2.25 15.0156 2.39687 15.3094 2.69063C15.6031 2.98438 15.75 3.3375 15.75 3.75V14.25C15.75 14.6625 15.6031 15.0156 15.3094 15.3094C15.0156 15.6031 14.6625 15.75 14.25 15.75H3.75ZM3.75 14.25H14.25V3.75H3.75V14.25Z"
                      fill="#2AB0FC"
                    />
                  </svg>
                </button>
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                  checked={isSelected(result)}
                  onChange={() => handleFareSelect(result)}
                />
              </div>
            </div>

            {/* Card Content - Added Check-In Bag row */}
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Cabin Bag</span>
                <span className="text-gray-900 text-base font-medium">
                  {result.segments?.[0]?.cabin_baggage_allowance || "7 kg"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Check-In Bag</span>
                <span className="text-gray-900 text-md font-medium">
                  {result.segments?.[0]?.baggage_allowance || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Class</span>
                <span className="text-gray-900 text-md font-medium">
                  {result.segments?.[0]?.cabin_class?.replace(" Class", "") ||
                    "Economy"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Refundable</span>
                <span className="text-gray-900 text-md font-medium">
                  {result.is_refundable ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">For {totalPax} person</span>
                <span className="text-gray-900 text-md font-semibold">
                  {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{getIndianPrice(result.final_fare)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Flight;
