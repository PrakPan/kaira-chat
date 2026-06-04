import styled from "styled-components";
import React, { useState } from "react";
import { connect } from "react-redux";
import * as ga from "../../../services/ga/Index";
import TransferModeContainer from "./TransferModeContainer";
import TaxiModal from "../../../components/modals/taxis/Index";
import FlightModal from "../../../components/modals/flights/Index";
import PinSection from "../../newitinerary/breif/route/PinSection";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import { ITINERARY_VERSION } from "../../../services/constants";
import TransferContainerForMissing from "./TransferContainerForMissing";
import TransferEditDrawer from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import routeAlternates from "../../../services/itinerary/brief/routeAlternates";
import axiosRoundTripInstance from "../../../services/itinerary/brief/roundTripSuggestion";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 100%;
  }
  @media screen and (min-width: 360px) {
    width: 100%;
    margin: 0 -0.4rem 0 0rem;
  }
  margin-bottom: 1.5rem;
`;

const TransContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 7rem;
  }
`;

const Line = styled.hr`
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size: 8px 3px, 100% 3px;
  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;
  height: 1px;
  border: 2px;
  width: ${(props) => (props.Transfers ? `16rem` : `5rem`)};
  top: ${(props) => (props.Transfers ? `101px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-110px` : `-22px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 8.4rem;
    height: 1px;
    top: 40px;
    right: -50px;
  }
`;

const TransfersContainer = (props) => {
  let locationsArr = [];

  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [alternateRoutes, setAlternateRoutes] = useState({});
  const [loadingAlternates, setLoadingAlternates] = useState(true);
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [alternatesError, setAlternatesError] = useState(null);
  const [originCity, setOriginCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const [daySlabIndex, setDaySlabIndex] = useState(null);
  const [elementIndex, setElementIndex] = useState(null);

  console.log("ROUTED", props?.route);

  const _changeFlightHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata,
    destination_city,
    taxi_type,
    transfer_type,
    user_selected
  ) => {
    ga.event({
      action: "Itinerary-bookings-flight_change",
      params: { name: name },
    });
    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      id: id,
      tailored_id: tailored_id,
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
      user_selected: user_selected,
      destination_city: destination_city,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
    });
    props.setShowFlightModal(true);
  };

  const _changeTaxiHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata,
    destination_city,
    taxi_type,
    transfer_type
  ) => {
    ga.event({
      action: "Itinerary-bookings-taxi_change",
      params: { name: name },
    });

    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      id: id,
      tailored_id: tailored_id,
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
      destination_city: destination_city,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
    });

    props.setShowTaxiModal(true);
  };

  function getTransportationType(url) {
    if (url) {
      const fileName = url.substring(
        url.lastIndexOf("/") + 1,
        url.lastIndexOf(".")
      );
      const firstLetter = fileName.charAt(0).toUpperCase();
      const restOfWord = fileName.slice(1);
      const transportationType = firstLetter + restOfWord;
      return transportationType;
    } else {
      return url;
    }
  }

  function NoOfNights(days) {
    if (days > 1) {
      return " Nights";
    } else {
      return " Night";
    }
  }

  const roundTripSuggestion = () => {
    setLoadingAlternates(true);
    axiosRoundTripInstance
      .get(`?itinerary_id=${props?.itinerary_id}`)
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
        setLoadingAlternates(false);
      })
      .catch((err) => {
        console.log("[ERROR][TransferEdit]: ", err);
        setLoadingAlternates(false);
      });
  };

  const handleTransferEdit = (e) => {
    setOriginCity(props?.routes[+e.target.id - 1]?.city_name);
    setDestinationCity(props?.routes[+e.target.id + 1]?.city_name);
    setDaySlabIndex(
      props?.routes[+e.target.id]?.element_location?.day_slab_index
    );
    setElementIndex(props?.routes[+e.target.id]?.element_index);
    setShowDrawer(true);
    roundTripSuggestion();
    routeAlternates
      .get(`/?route_id=` + props?.routes[+e.target.id]?.transfers?.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data.routes.length > 0) {
          const data = response.data;
          setAlternateRoutes(data);
        } else {
          setAlternatesError(
            "No route found, please get in touch with us to complete this booking!"
          );
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        setLoadingAlternates(false);
        setAlternatesError(
          "No Route Found, please get in touch with us to complete this booking!"
        );
      });
  };

  const return_booking_from_id = (arr, id) => {
    if (arr) return arr.find((obj) => obj.id === id);
  };

  if (
    props?.plan?.version == ITINERARY_VERSION.version_2 &&
    !(
      props?.plan?.is_released_for_customer ||
      props?.plan?.round_trip_taxi_added
    )
  ) {
    if (props?.routes) {
      for (var i = 0; i < props.routes.length - 1; i += 2) {
        locationsArr.push(
          <PinSection
            key={i}
            transfersPin
            setCurrentPopup={false}
            city={props.routes[i].city_name}
            duration={props?.routes[i]?.duration}
            pinColour={props.routes[i].color}
            index={i}
          ></PinSection>
        );

        var modes = false;
        if (props.routes[i + 1]?.modes && props.routes[i + 1]?.modes.length) {
          modes = props.routes[i + 1]?.modes;
        } else if (
          props.routes[i + 1]?.bookings &&
          props.routes[i + 1]?.bookings.length
        ) {
          modes = props.routes[i + 1]?.bookings;
        }
        {
          modes
            ? modes.map((mode, index) => {
                if (
                  props?.transferBookings &&
                  props?.routes[i + 1].bookings[index]?.id
                ) {
                  var CurrentBooking = return_booking_from_id(
                    props?.transferBookings,
                    props?.routes[i + 1].bookings[index]?.id
                  );
                  mode === "Flight" ||
                  (mode.booking_type && mode.booking_type === "Flight")
                    ? locationsArr.push(
                        <div className="flex flex-col gap-1">
                          <TransferModeContainer
                            setShowLoginModal={props?.setShowLoginModal}
                            routes={props?.routes}
                            getPaymentHandler={props.getPaymentHandler}
                            _updateTaxiBookingHandler={
                              props._updateTaxiBookingHandler
                            }
                            _updatePaymentHandler={props._updatePaymentHandler}
                            token={props.token}
                            payment={props?.payment}
                            booking_type={
                              props?.routes[i + 1].bookings[index]?.booking_type
                            }
                            pinColour={props.routes[i].color}
                            costings_breakdown={
                              CurrentBooking?.costings_breakdown
                            }
                            booking={CurrentBooking}
                            heading={CurrentBooking?.booking_display_name}
                            index={i}
                            icon={CurrentBooking?.icon}
                            modes={
                              props?.routes[i + 1].bookings[index]?.booking_type
                            }
                            transferbookings={props.transferBookings}
                            _changeFlightHandler={_changeFlightHandler}
                            _changeTaxiHandler={_changeTaxiHandler}
                            setShowTaxiModal={props.setShowTaxiModal}
                            userSelected={CurrentBooking?.user_selected}
                            taxi_type={CurrentBooking?.taxi_type}
                            transportMode={
                              props?.routes[i + 1].bookings[index]?.booking_type
                            }
                            duration={props?.breif?.city_slabs[i]?.duration}
                            route={props?.routes[i + 1]}
                            itinerary_id={props?.itinerary_id}
                            fetchData={props.fetchData}
                            originCity={props.routes[i].city_name}
                            destinationCity={props.routes[i + 2]?.city_name}
                          ></TransferModeContainer>
                        </div>
                      )
                    : locationsArr.push(
                        props?.transferBookings && (
                          <TransferModeContainer
                            setShowLoginModal={props?.setShowLoginModal}
                            routes={props?.routes}
                            getPaymentHandler={props.getPaymentHandler}
                            _updateTaxiBookingHandler={
                              props._updateTaxiBookingHandler
                            }
                            _updatePaymentHandler={props._updatePaymentHandler}
                            token={props.token}
                            payment={props?.payment}
                            booking_type={CurrentBooking?.booking_type}
                            pinColour={props?.breif?.city_slabs[i]?.color}
                            costings_breakdown={
                              CurrentBooking?.costings_breakdown
                            }
                            heading={CurrentBooking?.booking_display_name}
                            transferbookings={props.transferBookings}
                            _changeTaxiHandler={_changeTaxiHandler}
                            _changeFlightHandler={_changeFlightHandler}
                            setShowTaxiModal={props.setShowTaxiModal}
                            index={i}
                            booking={CurrentBooking}
                            userSelected={CurrentBooking?.user_selected}
                            modes={
                              props?.routes[i + 1].bookings[index]?.booking_type
                            }
                            icon={CurrentBooking?.images?.image}
                            taxi_type={CurrentBooking?.taxi_type}
                            transportMode={
                              props?.routes[i + 1].bookings[index]?.booking_type
                            }
                            duration={props?.breif?.city_slabs[i]?.duration}
                            route={props?.routes[i + 1]}
                            itinerary_id={props?.itinerary_id}
                            fetchData={props.fetchData}
                            originCity={props.routes[i].city_name}
                            destinationCity={props.routes[i + 2]?.city_name}
                          ></TransferModeContainer>
                        )
                      );
                }
              })
            : props?.routes[i + 1]?.transfers?.id
            ? locationsArr.push(
                <TransContainer>
                  <div style={{ position: "relative" }}>
                    <Line pinColour={props?.breif?.city_slabs[i]?.color} />
                  </div>
                  <div className="w-full h-full flex items-center justify-start ml-4">
                    {/* {props?.routes[i + 1]?.transfers?.id !== "" && (
                      <button
                        id={i + 1}
                        onClick={handleTransferEdit}
                        className="text-blue hover:underline"
                      >
                        + Add Transfer from {props?.routes[i]?.city_name} to{" "}
                        {props?.routes[i + 2]?.city_name}
                      </button>
                    )} */}
                  </div>
                </TransContainer>
              )
            : locationsArr.push(
                <TransContainer>
                  <div style={{ position: "relative" }}>
                    <Line
                      pinColour={props?.breif?.city_slabs[0]?.color}
                      Transfers={true}
                    />
                  </div>
                  <TransferContainerForMissing
                    cityname1={props?.routes[0]?.city_name}
                    cityname2={props?.routes[2]?.city_name}
                    email={props?.email}
                    name={props?.name}
                    phone={props?.phone}
                  />
                </TransContainer>
              );
        }
      }
    }
  } else {
    if (props?.transferBookings) {
      for (var i = 0; i < props.transferBookings.length; i++) {
        locationsArr.push(
          <PinSection
            transfersPin
            setCurrentPopup={false}
            key={i + props.transferBookings[i]?.city}
            // city={props?.transferBookings[i - 1]?.destination_city}
            city={props.transferBookings[i] && props.transferBookings[i].city}
            duration={
              props?.breif?.city_slabs[i]?.duration
                ? props?.breif?.city_slabs[i]?.duration +
                  NoOfNights(props?.breif?.city_slabs[i]?.duration)
                : null
            }
            pinColour={props?.breif?.city_slabs[i]?.color}
            index={i}
          ></PinSection>
        );

        {
          props?.transferBookings &&
          props?.transferBookings[i].booking_type === "Flight"
            ? locationsArr.push(
                <div className="flex flex-col gap-1">
                  <TransferModeContainer
                    setShowLoginModal={props?.setShowLoginModal}
                    routes={props?.routes}
                    getPaymentHandler={props.getPaymentHandler}
                    _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    token={props.token}
                    payment={props?.payment}
                    booking_type={props?.transferBookings[i]?.booking_type}
                    pinColour={props?.breif?.city_slabs[i]?.color}
                    costings_breakdown={
                      props?.transferBookings[i]?.costings_breakdown
                    }
                    booking={props?.transferBookings[i]}
                    heading={props?.transferBookings[i]?.booking_display_name}
                    index={i}
                    icon={props?.transfers[i]?.icon}
                    modes={getTransportationType(props?.transfers[i]?.icon)}
                    transferbookings={props.transferBookings}
                    _changeFlightHandler={_changeFlightHandler}
                    _changeTaxiHandler={_changeTaxiHandler}
                    setShowTaxiModal={props.setShowTaxiModal}
                    userSelected={props?.transferBookings[i]?.user_selected}
                    taxi_type={props?.transferBookings[i]?.taxi_type}
                    transportMode={getTransportationType(
                      props?.transfers[i]?.icon
                    )}
                    duration={props?.breif?.city_slabs[i]?.duration}
                  ></TransferModeContainer>
                </div>
              )
            : locationsArr.push(
                props?.transferBookings && (
                  <TransferModeContainer
                    setShowLoginModal={props?.setShowLoginModal}
                    routes={props?.routes}
                    getPaymentHandler={props.getPaymentHandler}
                    _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    token={props.token}
                    payment={props?.payment}
                    booking_type={props?.transferBookings[i]?.booking_type}
                    pinColour={props?.breif?.city_slabs[i]?.color}
                    costings_breakdown={
                      props?.transferBookings[i]?.costings_breakdown
                    }
                    heading={props?.transferBookings[i]?.booking_display_name}
                    transferbookings={props.transferBookings}
                    _changeTaxiHandler={_changeTaxiHandler}
                    _changeFlightHandler={_changeFlightHandler}
                    setShowTaxiModal={props.setShowTaxiModal}
                    index={i}
                    booking={props?.transferBookings[i]}
                    userSelected={props?.transferBookings[i]?.user_selected}
                    modes={getTransportationType(props?.transfers[i]?.icon)}
                    icon={props?.transferBookings[i]?.images?.image}
                    taxi_type={props?.transferBookings[i]?.taxi_type}
                    transportMode={getTransportationType(
                      props?.transfers[i]?.icon
                    )}
                    duration={props?.breif?.city_slabs[i]?.duration}
                  ></TransferModeContainer>
                )
              );
        }
      }
    }
  }

  var modes = false;
  if (
    props?.routes &&
    props?.routes.length > 1 &&
    props?.plan?.version == "v2" &&
    !(
      props?.plan?.is_released_for_customer ||
      props?.plan?.round_trip_taxi_added
    )
  ) {
    if (props.routes[1]?.modes && props.routes[1]?.modes.length) {
      modes = props.routes[1]?.modes;
    } else if (props.routes[1]?.bookings && props.routes[1]?.bookings.length) {
      modes = props.routes[1]?.bookings;
    }
  }

  return (
    <Container id="transfers">
      <div
        id="Transfer_Container"
        className="cursor-pointer  mb-8  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
      >
        Transfers
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>

      {props.showFlightModal && (
        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={props.setHideFlightModal}
        />
      )}
      {props.showTaxiModal && (
        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={() => props.setShowTaxiModal(false)}
        />
      )}

      <FlightModal
        getPaymentHandler={props.getPaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        itinerary_id={
          props?.transferBookings
            ? props?.transferBookings[0]["itinerary_id"]
            : null
        }
        setHideFlightModal={props.setHideFlightModal}
        alternates={selectedBooking.id}
        tailored_id={selectedBooking["tailored_itinerary"]}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightHandler={props._updateFlightHandler}
        setHideBookingModal={props.setHideBookingModal}
        selectedBooking={selectedBooking}
        setShowFlightModal={props.setShowFlightModal}
        showFlightModal={props.showFlightModal}
      ></FlightModal>

      <TaxiModal
        getPaymentHandler={props.getPaymentHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        setHideBookingModal={props.setHideBookingModal}
        setHideTaxiModal={() => props.setShowTaxiModal(false)}
        showTaxiModal={props.showTaxiModal}
        _updatePaymentHandler={props._updatePaymentHandler}
        selectedBooking={selectedBooking}
      ></TaxiModal>

      {(props?.transferBookings || props?.routes.length > 1) && (
        <>
          {locationsArr}

          {props?.routes && props?.routes.length > 1 && (
            <PinSection
              transfersPin
              setCurrentPopup={false}
              dayId={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
                  .day_slab_location.start_day_slab_index
              }
              cityData={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
              }
              dayslab={props.dayslab}
              lat={
                props.breif.city_slabs[props.breif.city_slabs.length - 1].lat
              }
              long={
                props.breif.city_slabs[props.breif.city_slabs.length - 1].long
              }
              Mapid={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
                  .gmaps_place_id
              }
              city={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
                  .city_name
              }
              cityId={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
                  .city_id
              }
              duration={
                props.breif.city_slabs[props.breif.city_slabs.length - 1]
                  .duration
                  ? props.breif.city_slabs[props.breif.city_slabs.length - 1]
                      .duration +
                    NoOfNights(
                      props.breif.city_slabs[props.breif.city_slabs.length - 1]
                        .duration
                    )
                  : null
              }
              pinColour={
                props.breif.city_slabs[props.breif.city_slabs.length - 1].color
              }
            ></PinSection>
          )}
        </>
      )}

      <TransferEditDrawer
        addOrEdit={"transferAdd"}
        itinerary_id={props?.itinerary_id}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        selectedTransferHeading={props?.route?.heading}
        origin={originCity}
        destination={destinationCity}
        alternateRoutes={alternateRoutes}
        roundTripSuggestions={roundTripSuggestions}
        multiCitySuggestions={multiCitySuggestions}
        loadingAlternates={loadingAlternates}
        alternatesError={alternatesError}
        day_slab_index={daySlabIndex}
        element_index={elementIndex}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
      />
    </Container>
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

export default connect(mapStateToPros)(TransfersContainer);
