import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
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
import TransferBooking from "./TransferBooking";
import media from "../../../components/media";

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

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

const TransferBookings = (props) => {
  const transferBookingsIntercity = useSelector((state) => state.TransferBookings.transferBookings).intercity;
  let isPageWide = media("(min-width: 768px)");
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const alternateRoutes = {};
  const loadingAlternates = true;
  const roundTripSuggestions = null;
  const multiCitySuggestions = null;
  const alternatesError = null
  const originCity = null;
  const destinationCity= null
  const daySlabIndex = null;
  const elementIndex = null;
  const transferId = null;

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
    user_selected,
    booking_id
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
      booking_id:booking_id
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
    transfer_type,
    origin,
    destination
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
      origin: origin,
      destination: destination,
    });

    props.setShowTaxiModal(true);
  };


  return (
    <div id="transfers" className={`mt-16 ${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`} >
      <div
        id="Transfer_Container"
        className="cursor-pointer font-lexend mb-8  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
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

<div>
  {Object.keys(transferBookingsIntercity)?.map((key, index) => 
    transferBookingsIntercity[key]?.id ? (
      <>
        <PinSection
          key={index}
          transfersPin
          setCurrentPopup={false}
          city={transferBookingsIntercity[key]?.transfers_details?.source?.name}
          index={index}
          pinColour={index === 0 ? null : CITY_COLOR_CODES[index % 7]}
        />
        
        <TransferBooking
          key={transferBookingsIntercity[key]?.id}
          index={index}
          booking={transferBookingsIntercity[key]}
          payment={props?.payment}
          token={props?.token}
          setShowLoginModal={props?.setShowLoginModal}
          _changeTaxiHandler={_changeTaxiHandler}
          _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
          getPaymentHandler={props?.getPaymentHandler}
          _changeFlightHandler={_changeFlightHandler}
        />

        {index === Object.keys(transferBookingsIntercity).length - 1 && (
          <PinSection
            key={`last-${index}`}
            transfersPin
            setCurrentPopup={false}
            city={transferBookingsIntercity[key]?.destination?.name}
            index={index}
            pinColour={null}
          />
        )}
      </>
    ) : null
  )}
</div>


      <FlightModal
        getPaymentHandler={props?.getPaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        setHideFlightModal={props.setHideFlightModal}
        alternates={selectedBooking.id}
        tailored_id={selectedBooking["tailored_itinerary"]}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightHandler={props._updateFlightHandler}
        setHideBookingModal={props.setHideBookingModal}
        selectedBooking={selectedBooking}
        setShowFlightModal={props?.setShowFlightModal}
        showFlightModal={props?.showFlightModal}
        itinerary_id={props?.itinerary_id}
        selectedTransferHeading={props?.route?.heading}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={daySlabIndex}
        elementIndex={elementIndex}
        routeId={transferId}
        booking_id={selectedBooking?.booking_id}
      ></FlightModal>

      <TaxiModal
        getPaymentHandler={props.getPaymentHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        setHideBookingModal={props.setHideBookingModal}
        setHideTaxiModal={() => props.setShowTaxiModal(false)}
        showTaxiModal={props.showTaxiModal}
        _updatePaymentHandler={props._updatePaymentHandler}
        selectedBooking={selectedBooking}
        itinerary_id={props?.itinerary_id}
        selectedTransferHeading={props?.route?.heading}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={daySlabIndex}
        elementIndex={elementIndex}
        routeId={transferId}
      ></TaxiModal>

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
        routeId={props?.route?.transfers?.id}
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
    plan: state.Plan,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
    transferBookings: state.Bookings.transferBookings,
    itinerary_id: state.ItineraryId,
  };
};

export default connect(mapStateToPros)(TransferBookings);
