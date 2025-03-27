import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import * as ga from "../../../services/ga/Index";
import TaxiModal from "../../../components/modals/taxis/Index";
import FlightModal from "../../../components/modals/flights/Index";
import PinSection from "../../newitinerary/breif/route/PinSection";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import TransferEditDrawer from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import TransferBooking from "./TransferBooking";
import media from "../../../components/media";
import Pin from "../../newitinerary/breif/route/Pin";

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
  let isPageWide = media("(min-width: 768px)");
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const transferBooking = useSelector((state) => state.TransferBookings)?.transferBookings

  const alternateRoutes = {};
  const loadingAlternates = true;
  const roundTripSuggestions = null;
  const multiCitySuggestions = null;
  const alternatesError = null;
  const originCity = null;
  const destinationCity = null;
  const daySlabIndex = null;
  const elementIndex = null;
  const transferId = null;
  const itineraries = useSelector((state) => state.Itinerary);
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
    booking_id,
    originCityId,
    destinationCityId,
    edge
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
      booking_id: booking_id,
      originCityId:originCityId,
      destinationCityId:destinationCityId,
      edge:edge
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
    destination,
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
    <div
      id="transfers"
      className={`mt-16 ${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}
    >
      <div
        id="Transfer_Container"
        className="cursor-pointer font-lexend mb-8  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
      >
        Transfers
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {transferBooking?.intercity != undefined && (
        <>
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
            <>
              <PinSection
                key={-1}
                transfersPin
                setCurrentPopup={false}
                city={itineraries?.start_city?.city_name}
                index={-1}
                PinSection
                pinColour={null}
              />

              <TransferBooking
                loadbookings={props?.loadbookings}
                key={
                  transferBooking?.intercity[
                    `${
                      itineraries?.start_city?.gmaps_place_id +
                      ":" +
                      itineraries?.cities[0]?.id
                    }`
                  ]?.id
                }
                index={-1}
                booking={
                  transferBooking?.intercity[
                    `${
                      itineraries?.start_city?.gmaps_place_id +
                      ":" +
                      itineraries?.cities[0]?.id
                    }`
                  ]
                }
                payment={props?.payment}
                token={props?.token}
                setShowLoginModal={props?.setShowLoginModal}
                _changeTaxiHandler={_changeTaxiHandler}
                _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
                getPaymentHandler={props?.getPaymentHandler}
                _changeFlightHandler={_changeFlightHandler}
                origin={itineraries?.start_city}
                destination={itineraries?.cities[0].city}
                id={itineraries?.start_city?.gmaps_place_id}
                check_in={itineraries?.start_date}
                selectedBooking={selectedBooking}
                originCityId={null}
                destinationCityId={itineraries?.cities[0]?.id}
                
              />
            </>
            {itineraries?.cities?.map((item, index) => (
              <>
                {index != itineraries.cities.length - 1 && (
                  <>
                    <PinSection
                      key={index}
                      transfersPin
                      setCurrentPopup={false}
                      city={item.city.name}
                      index={index}
                      PinSection
                      pinColour={CITY_COLOR_CODES[index % 7]}
                    />

                    <TransferBooking
                      loadbookings={props?.loadbookings}
                      key={
                        transferBooking?.intercity[
                          `${item.id + ":" + itineraries?.cities[index + 1].id}`
                        ]?.id
                      }
                      index={index}
                      booking={
                        transferBooking?.intercity[
                          `${item.id + ":" + itineraries?.cities[index + 1].id}`
                        ]
                      }
                      payment={props?.payment}
                      token={props?.token}
                      setShowLoginModal={props?.setShowLoginModal}
                      _changeTaxiHandler={_changeTaxiHandler}
                      _updateTaxiBookingHandler={
                        props?._updateTaxiBookingHandler
                      }
                      getPaymentHandler={props?.getPaymentHandler}
                      _changeFlightHandler={_changeFlightHandler}
                      origin={item.city}
                      destination={itineraries?.cities[index + 1].city}
                      id={item.id}
                      check_in={item.start_date}
                      selectedBooking={selectedBooking}
                      originCityId={item.id}
                      destinationCityId={itineraries?.cities[index + 1].id}
                    />
                  </>
                )}
              </>
            ))}
            <PinSection
              key={itineraries?.cities.length}
              transfersPin
              setCurrentPopup={false}
              city={
                itineraries?.cities[itineraries?.cities.length - 1]?.city.name
              }
              index={itineraries?.cities.length - 1}
              PinSection
              pinColour={CITY_COLOR_CODES[itineraries?.cities.length % 7]}
            />
            <TransferBooking
              loadbookings={props?.loadbookings}
              key={
                transferBooking?.intercity[
                  `${itineraries?.cities[itineraries?.cities.length - 1]?.id}:${
                    itineraries?.end_city?.gmaps_place_id
                  }`
                ]?.id
              }
              index={itineraries?.cities.length - 1}
              booking={
                transferBooking?.intercity[
                  `${itineraries?.cities[itineraries?.cities.length - 1]?.id}:${
                    itineraries?.end_city?.gmaps_place_id
                  }`
                ]
              }
              payment={props?.payment || null}
              token={props?.token || null}
              setShowLoginModal={props?.setShowLoginModal}
              _changeTaxiHandler={_changeTaxiHandler}
              _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
              getPaymentHandler={props?.getPaymentHandler}
              _changeFlightHandler={_changeFlightHandler}
              origin={itineraries?.cities[itineraries?.cities.length - 1].city}
              destination={itineraries?.end_city}
              id={itineraries?.end_city?.gmaps_place_id}
              check_in={itineraries?.end_date}
              end={true}
              selectedBooking={selectedBooking}
              originCityId={
                itineraries?.cities[itineraries?.cities.length - 1]?.id
              }
              destinationCityId={null}
            />
            <PinSection
              key={itineraries?.cities.length}
              transfersPin
              setCurrentPopup={false}
              city={itineraries?.end_city?.city_name}
              index={itineraries?.cities.length}
              PinSection
              pinColour={null}
            />
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
            edge={selectedBooking?.edge}
            originCityId={
              itineraries?.cities[itineraries?.cities.length - 1]?.id
            }
            destinationCityId={itineraries?.end_city?.gmaps_place_id}
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
            selectedBooking={selectedBooking}
          />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
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
    itinerary_id: state.ItineraryId,
    transferBookings: state.TransferBookings.transferBookings,
  };
};

export default connect(mapStateToProps)(TransferBookings);
