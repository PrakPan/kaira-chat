import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import { updateFlightBooking } from "../../../services/bookings/UpdateBookings";
import { connect, useDispatch, useSelector } from "react-redux";
import axiosflightsearch, {
  axiosFlightSearch,
} from "../../../services/bookings/FlightSearch";
import SectionOne from "./SectionOne";
import Button from "../../ui/button/Index";
import Flight from "./new-flight-searched/Index";
import LoadingLottie from "../../ui/LoadingLottie";
import Drawer from "../../ui/Drawer";
import Skeleton from "./Skeleton";
import { TbArrowBack } from "react-icons/tb";
import { openNotification } from "../../../store/actions/notification";
import { FaFilter } from "react-icons/fa";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import LogInModal from "../Login";
import { toast, ToastContainer } from "react-toastify";
import { setTransfersBookings } from "../../../store/actions/transferBookingsStore";
import ComboFlight from "./ComboFlight";
import BackArrow from "../../ui/BackArrow";

const GridContainer = styled.div`
min-height: 65vh;
max-height: 40vh;

@media screen and (min-width: 768px) {
    min-height: 90vh;
    overflow-y: scroll;
`;

const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 85%;
  z-index: 2;
  cursor: pointer;
`;

const Floating = styled.div`
  position: sticky;
  bottom: 65px;
  background: #01202b;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 85%;
  z-index: 2;
  cursor: pointer;
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  width: 100%;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
  }
`;

const ContentContainer = styled.div`
  @media screen and (min-width: 768px) {
    width: 95%;
    margin: auto;
  }
`;

const Booking = (props) => {
  console.log("Flight Selected Booking", props?.selectedBooking);
  console.log(
    "Flight Selected Booking",
    props?.originCityId,
    props?.destinationCityId
  );
  let isPageWide = media("(min-width: 768px)");
  const dispatch = useDispatch();
  const transferBookings = useSelector((state) => state.TransferBookings);
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersState, setFiltersState] = useState({
    order: "asc",
    non_stop_flights: true,
    departure_time_period: "",
    arrival_time_period: "",
    airline_name: "",
    sort_by: "price",
  });
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [isFetchingError, setFetchingIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [moreLoadingState, setMoreLoadingState] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [flightCount, setFlightsCount] = useState(0);
  const [pax, setPax] = useState({
    adults: props.selectedBooking?.pax?.number_of_adults
      ? props.selectedBooking.pax.number_of_adults
      : 1,
    children: props.selectedBooking?.pax?.number_of_children
      ? props.selectedBooking.pax.number_of_children
      : 0,
    infants: props.selectedBooking?.pax?.number_of_infants
      ? props.selectedBooking.pax.number_of_infants
      : 0,
  });
  const [classType, setClassType] = useState({
    key: "All",
    value: 1,
  });
  const [showTransferEditDrawer, setShowTransferEditDrawer] = useState(false);

  // console.log("Ord",props?.originCityId,props?.destinationCityId);

  // useEffect(() => {
  //   if (!isPageWide && props.showFlightModal) _FetchFlightsHandler();
  //   if (!props.showFlightModal) {
  //     setOptionsJSX([]);
  //     setLoading(true);
  //   }
  // }, [props.showFlightModal]);

  // useEffect(() => {
  //   if (isPageWide && props.showFlightModal) _FetchFlightsHandler();
  // }, [props.showFlightModal, props.token, filtersState, pax, classType]);

  //console.log("Booking Data",props?.selectedBooking);
  const _FetchFlightsHandler = () => {
    let options = [];
    setOptionsJSX([]);
    setFlightsCount(0);
    setLoading(true);
    setUpdateBookingState(false);
    setUnauthorized(false);
    setFetchingIsError({
      error: false,
      errorMsg: ``,
    });

    if (props.selectedBooking && props.token) {
      const requestData = {
        adult_count: pax.adults,
        child_count: pax.children,
        infant_count: pax.infants,
        direct_flight: filtersState.non_stop_flights ? "true" : "false",
        journey_type: "1",
        origin: props.selectedBooking.origin_iata,
        destination: props.selectedBooking.destination_iata,
        preferred_departure_time: `${
          props?.selectedBooking?.check_in
            ? new Date(props?.selectedBooking?.check_in.replace(" ", "T"))
                ?.toISOString()
                ?.slice(0, 19)
            : new Date()?.toISOString()?.slice(0, 19)
        }`,
        flight_cabin_class: classType.value,
      };

      axiosFlightSearch
        .post(
          `?${filtersState.sort_by}_order=${filtersState.order}${
            filtersState.departure_time_period
              ? "&departure_time_period=" + filtersState.departure_time_period
              : ""
          }${
            filtersState.arrival_time_period
              ? "&arrival_time_period=" + filtersState.arrival_time_period
              : ""
          }`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const provider = res.data.provider;
          localStorage.setItem(`${provider}_trace_id`, res.data.trace_id);

          if (res.data?.results.length) {
            for (var i = 0; i < res.data.results.length; i++) {
              options.push(
                <Flight
                  itinerary_id={props.itinerary_id}
                  data={res.data.results[i]}
                  selectedBooking={props.selectedBooking}
                  _updateBookingHandler={_newUpdateBookingHandler}
                  isSelected={false}
                  provider={res.data?.provider}
                  filtersState={filtersState}
                  booking_id={props.selectedBooking?.booking_id}
                  originCityId={props?.originCityId}
                  destinationCityId={props?.destinationCityId}
                  setTransferBookingsIntercity={
                    props.setTransferBookingsIntercity
                  }
                  edge={props?.edge || props?.selectedBooking?.edge}
                ></Flight>
              );
            }
            setOptionsJSX(options);
            setFlightsCount(res.data.results.length);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setFetchingIsError({
            error: true,
            errorMsg: `Sorry, we could not find any flights from ${props.selectedBooking.origin_iata} to ${props.selectedBooking.destination_iata} for given dates at the moment. Please contact us to complete this booking`,
          });
        });
    } else {
      setLoading(false);
      setFetchingIsError({
        error: true,
        errorMsg: `Sorry, we could not find any flights from ${props.selectedBooking.origin_iata} to ${props.selectedBooking.destination_iata} for given dates at the moment. Please contact us to complete this booking`,
      });
    }
  };

  const _newUpdateBookingHandler = ({
    booking_id,
    itinerary_id,
    result_index,
    provider,
  }) => {
    if (props.handleFlightSelect) {
      props.handleFlightSelect({
        trace_id: localStorage.getItem(`${provider}_trace_id`),
        result_index: result_index,
      });
      // return;
    }

    setUpdateBookingState(true);
    setUnauthorized(false);
    let updated_bookings_arr = [];

    updated_bookings_arr.push({
      trace_id: localStorage.getItem(`${provider}_trace_id`),
      id: booking_id,
      user_selected: true,
      booking_type: "Flight",
      itinerary_id: itinerary_id,
      result_index: result_index,
      itinerary_type: "Tailored",
    });

    const requestData = {
      booking_id,
      trace_id: localStorage.getItem(`${provider}_trace_id`),
      result_indices: [result_index],
      source_itinerary_city: props?.originCityId,
      destination_itinerary_city: props?.destinationCityId,
      edge: props?.edge || props?.selectedBooking?.edge,
    };

    //  console.log("originCityId + destinationCityId",props?.originCityId + ":" + props?.destinationCityId);
    console.log("Request Data", requestData);
    // updateFlightBooking
    //   .post(`${itinerary_id}/bookings/flight/`, requestData, {
    //     headers: {
    //       Authorization: `Bearer ${props.token}`,
    //     },
    //   })
    //   .then((res) => {
    //     props._updateFlightBookingHandler([res.data]);
    //     props.getPaymentHandler();
    //     setUpdateBookingState(false);
    //     const updatedTransferBookings = {
    //       ...transferBookings,
    //       intercity: {
    //         ...transferBookings.intercity,
    //         [originCityId + ":" + destinationCityId]: res?.data,
    //       },
    //     };
    //     dispatch(setTransfersBookings(updatedTransferBookings));
    updateFlightBooking
      .post(`${itinerary_id}/bookings/flight/`, requestData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateFlightBookingHandler([res.data]);
        props.getPaymentHandler();
        setUpdateBookingState(false);

        const updatedTransferBookings = JSON.parse(
          JSON.stringify(transferBookings?.transferBookings)
        );
        const bookingIdToUpdate = requestData?.booking_id;

        Object.keys(updatedTransferBookings).forEach((category) => {
          if (updatedTransferBookings[category]) {
            Object.keys(updatedTransferBookings[category]).forEach((key) => {
              const booking = updatedTransferBookings[category][key];

              if (!booking || Object.keys(booking).length === 0) {
                return;
              }

              if (booking?.id === bookingIdToUpdate) {
                updatedTransferBookings[category][key] = {
                  ...booking,
                  ...res.data,
                };
              } else if (
                booking?.children &&
                Array.isArray(booking.children) &&
                booking.children.length > 0
              ) {
                let foundMatch = false;
                const updatedChildren = booking.children.map((childBooking) => {
                  if (childBooking && childBooking.id === bookingIdToUpdate) {
                    foundMatch = true;
                    return {
                      ...childBooking,
                      ...res.data,
                    };
                  }
                  return childBooking;
                });

                if (foundMatch) {
                  updatedTransferBookings[category][key] = {
                    ...booking,
                    children: updatedChildren,
                  };
                }
              }
            });
          }
        });

        dispatch(setTransfersBookings(updatedTransferBookings));
        props.openNotification({
          type: "success",
          text: "Flight updated successfully.",
          heading: "Sucess!",
        });
        props.setHideFlightModal();
      })
      .catch((err) => {
        setUpdateBookingState(false);
        setUnauthorized(true);
        const errorMsg =
            err?.response?.data?.errors?.[0]?.message?.[0] || err.message ;
        props.openNotification({
          type: "error",
          text: errorMsg || "Oops, this action is not allowed on another user's itinerary.",
          heading: "Error!",
        });
        props.setHideFlightModal();
      });
  };

  const _loadAccommodationsHandler = () => {
    setViewMoreStatus(false);
    setMoreLoadingState(true);
    let trace_id = localStorage.getItem("tbo_trace_id");

    axiosflightsearch
      .get("/?limit=" + limit + "&offset=" + offset, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        params: {
          number_of_adults: props.selectedBooking.pax.number_of_adults,
          number_of_children: props.selectedBooking.pax.number_of_children,
          number_of_infants: props.selectedBooking.pax.number_of_infants,
          check_in: props.selectedBooking.check_in,
          city_code: props.selectedBooking.origin_iata,
          destination_city_code: props.selectedBooking.destination_iata,
          flight_cabin_class: "1",
          trace_id: trace_id,
        },
      })
      .then((res) => {
        setMoreLoadingState(false);
        localStorage.setItem("tbo_trace_id", res.data.TraceId);
        if (res.data.search && res.data.search.airline_names) {
          setFlightsCount(res.data.data);
        }
        let options = optionsJSX.slice();
        if (res.data.Results.length) {
          for (var i = 0; i < res.data.Results.length; i++) {
            options.push(
              <Flight
                itinerary_id={props.itinerary_id}
                data={res.data.Results[i]}
                selectedBooking={props.selectedBooking}
                _updateBookingHandler={_newUpdateBookingHandler}
                individual={props?.individual}
                originCityId={props?.originCityId}
                destinationCityId={props?.destinationCityId}
                edge={props?.edge || props?.selectedBooking?.edge}
                setTransferBookingsIntercity={
                  props.setTransferBookingsIntercity
                }
                setShowLoginModal={props?.setShowLoginModal}
              ></Flight>
            );
          }
          setOptionsJSX([...options]);
        }
        if (res.data.next_page) {
          setViewMoreStatus(true);
          setOffset(offset + 20);
        } else {
          setViewMoreStatus(false);
          setOffset(0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMoreLoadingState(false);
      });
  };

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  if (props.token)
    return (
      <Drawer
        anchor={"right"}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        show={props.showFlightModal}
        onHide={props.setHideFlightModal}
        mobileWidth={"100%"}
        width={"50%"}
      >
        {!props?.combo ? (
          <>
            <ToastContainer />
            <SectionOne
              _FetchFlightsHandler={_FetchFlightsHandler}
              setHideBookingModal={props.setHideBookingModal}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              filtersState={filtersState}
              setFiltersState={setFiltersState}
              flightCount={flightCount}
              setHideFlightModal={props.setHideFlightModal}
              text={props.selectedBooking?.name}
              selectedBooking={props.selectedBooking}
              pax={pax}
              setPax={setPax}
              classType={classType}
              setClassType={setClassType}
              handleTransferEdit={handleTransferEdit}
              mercuryTransfer={props?.mercuryTransfer}
            ></SectionOne>

            <GridContainer style={{ clear: "right" }}>
              <ContentContainer style={{ position: "relative" }}>
                {updateLoadingState && !updateBookingState ? (
                  <div
                    className="center-div"
                    style={{ width: "max-content", margin: "auto" }}
                  >
                    <LoadingLottie
                      height={"5rem"}
                      width={"5rem"}
                      margin="none"
                    />
                    Fetching best fares
                  </div>
                ) : null}

                {updateBookingState ? (
                  <div
                    style={{
                      width: "max-content",
                      margin: "auto",
                      height: isPageWide ? "80vh" : "40vh",
                    }}
                    className="center-div font-lexend"
                  >
                    <LoadingLottie
                      height={"5rem"}
                      width={"5rem"}
                      margin="none"
                    />
                    Please wait while we update your flight
                  </div>
                ) : null}

                {isFetchingError.error ? (
                  <div className="flex flex-row items-center justify-center h-[80vh] text-center font-lexend">
                    {isFetchingError.errorMsg}
                  </div>
                ) : !noResults && !updateLoadingState && !unauthorized ? (
                  <OptionsContainer id="options">
                    <div style={{ clear: "right" }}>
                      {optionsJSX.length && !updateBookingState
                        ? optionsJSX
                        : null}

                      {loading && !optionsJSX.length ? <Skeleton /> : null}

                      {!loading && !optionsJSX.length ? (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "auto",
                            height: isPageWide ? "80vh" : "70vh",
                          }}
                          className="center-div"
                        >
                          Oops, it looks like there are no alternate flights
                          available.
                        </div>
                      ) : null}
                    </div>

                    {moreLoadingState ? <Skeleton /> : null}

                    {viewMoreStatus &&
                    !updateBookingState &&
                    !loading &&
                    optionsJSX.length ? (
                      <Button
                        boxShadow
                        onclickparam={null}
                        onclick={_loadAccommodationsHandler}
                        margin="0.25rem auto"
                        borderWidth="1px"
                        borderRadius="2rem"
                        padding="0.25rem 1rem"
                      >
                        View More
                      </Button>
                    ) : null}
                  </OptionsContainer>
                ) : null}

                {unauthorized ? (
                  <div
                    style={{
                      width: "100%",
                      margin: "auto",
                      height: isPageWide ? "80vh" : "40vh",
                    }}
                    className="center-div text-center"
                  >
                    Oops, this action is not allowed on another user's itinerary
                  </div>
                ) : null}

                {noResults && !unauthorized ? (
                  <p className="font-lexend text-center">
                    Oops, we couldn't find what you were searching!
                  </p>
                ) : null}
              </ContentContainer>
              {!isPageWide && (
                <>
                  <Floating>
                    <FaFilter
                      style={{ height: "18px", width: "18px", color: "white" }}
                      cursor={"pointer"}
                      onClick={(e) => {
                        setShowFilter(true);
                      }}
                    />
                  </Floating>
                  <FloatingView>
                    <TbArrowBack
                      style={{ height: "28px", width: "28px" }}
                      cursor={"pointer"}
                      onClick={props.setHideFlightModal}
                    />
                  </FloatingView>
                </>
              )}
            </GridContainer>

            <TransferEditDrawer
              itinerary_id={props?.itinerary_id}
              showDrawer={showTransferEditDrawer}
              setShowDrawer={setShowTransferEditDrawer}
              selectedTransferHeading={props.selectedTransferHeading}
              origin={props.selectedBooking?.city}
              destination={props.selectedBooking?.destination_city}
              day_slab_index={props.daySlabIndex}
              element_index={props.elementIndex}
              fetchData={props?.fetchData}
              setShowLoginModal={props?.setShowLoginModal}
              check_in={props?.check_in}
              _GetInTouch={props._GetInTouch}
              routeId={props.routeId}
              selectedBooking={props.selectedBooking}
              mercuryTransfer={props?.mercuryTransfer}
              mercury={true}
            />
          </>
        ) : (
          <div className="p-3">
            <BackArrow
              handleClick={() => {
                props.setHideFlightModal(false);
                // setCurrentStep(0);
                // setIsRouteSelected(false);
              }}
            />
            <div className="text-lg md:text-xl lg:text-xl font-semibold mt-1">
              Changing {props.selectedBooking?.name}
            </div>

            {/* <ComboFlight
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
                                     origin_itinerary_city_id={origin_itinerary_city_id}
                                   destination_itinerary_city_id={destination_itinerary_city_id}
                                   dCityData={dCityData}
                                             oCityData={oCityData}
                                   /> */}
            <ComboFlight
              combo={true}
              //handleFlightSelect={handleFlightSelect}

              showComboFlightModal={props?.showFlightModal}
              setShowComboFlightModal={props?.setShowFlightModal}
              setHideFlightModal={props.setHideFlightModal}
              setHideBookingModal={props?.setHideBookingModal}
              getPaymentHandler={props?.getPaymentHandler}
              _updatePaymentHandler={props?._updatePaymentHandler}
              _updateFlightBookingHandler={props?._updateFlightBookingHandler}
              _updateBookingHandler={props?._updateBookingHandler}
              alternates={props?.selectedBooking.id}
              tailored_id={props?.selectedBooking["tailored_itinerary"]}
              selectedBooking={props?.selectedBooking}
              itinerary_id={props?.itinerary_id}
              selectedTransferHeading={props?.route?.heading}
              fetchData={props?.fetchData}
              setShowLoginModal={props?.setShowLoginModal}
              check_in={props?.route?.check_in}
              _GetInTouch={props._GetInTouch}
              daySlabIndex={props?.daySlabIndex}
              elementIndex={props?.elementIndex}
              routeId={props?.transferId}
              // mercuryTransfer={mercuryTransfer}
              //individual={individual}
              originCityId={props?.selectedBooking?.originCityId}
              destinationCityId={props?.selectedBooking?.destinationCityId}
              // isSingleTransfer={true}
              comboStartDate={props?.selectedBooking?.start_date}
              comboStartTime={props?.selectedBooking?.start_date}
              source_code={
                props?.selectedBooking?.source?.code ||
                props.selectedBooking.origin_iata
              }
              destination_code={
                props?.selectedBooking?.destination?.code ||
                props.selectedBooking.destination_iata
              }
              //   origin_itinerary_city_id={origin_itinerary_city_id}
              // destination_itinerary_city_id={destination_itinerary_city_id}
              // dCityData={dCityData}
              //           oCityData={oCityData}
              token={props?.token}
              booking_id={props?.selectedBooking?.booking_id}
              edge={props?.selectedBooking?.edge}
            />
          </div>
        )}
      </Drawer>
    );

  return (
    <LogInModal show={true} onhide={props.setHideFlightModal}></LogInModal>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);

// {
//   "booking_id": "7ad0b554-7efd-4d53-9ca6-eb21873950de",
//   "trace_id": "aa92d7fc-2c68-459e-8063-7831dbc26a87",
//   "result_indices": [
//       "83e60545-1374-443a-ac16-d5cb510f1a9b"
//   ],
//   "source_itinerary_city": "17aa0882-e52e-4625-bd69-450d1eae9761",
//   "destination_itinerary_city": "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
//   "edge": "016b1fbe-8c17-4115-a5ea-77052b60b820"
// }

// {
//   "trace_id": "ebeffef4-c015-400b-806f-ea8f066ee604",
//   "result_indices": [
//       "728b0185-38cf-41fd-a4dd-acac77715ac6"
//   ],
//   "source_itinerary_city": "a8593ec8-cd94-4ae9-8ae4-5f9f4f6fe484",
//   "destination_itinerary_city": "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
//   "booking_id": "9b716e0e-74ba-421e-84ac-d541c532c62a",
//   "edge": "abec3aef-d7fa-426d-b98b-0095b391f21f"
// }

// {
//   "booking_id": "9b716e0e-74ba-421e-84ac-d541c532c62a",
//   "trace_id": "6088a073-0da2-4c4c-b058-3de4edf30834",
//   "result_indices": [
//       "2cee1c63-29e9-45b3-8e80-86a90993b6b8"
//   ],
//   "source_itinerary_city": "17aa0882-e52e-4625-bd69-450d1eae9761",
//   "destination_itinerary_city": "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
//   "edge": "016b1fbe-8c17-4115-a5ea-77052b60b820"
// }
