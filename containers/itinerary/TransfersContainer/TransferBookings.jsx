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
import ComboFlight from "../../../components/modals/flights/ComboFlight";

const CITY_COLOR_CODES = [
  "#000000", // shade of blue
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
  const transferBooking = useSelector(
    (state) => state.TransferBookings
  )?.transferBookings;

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


  const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const sortByCheckIn = (bookings) => {
    return [...bookings].sort((a, b) => {
      const dateA = parseDate(a.check_in);
      const dateB = parseDate(b.check_in);
      return dateA - dateB;
    });
  };

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
      originCityId: originCityId,
      destinationCityId: destinationCityId,
      edge: edge,
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

  
  const renderTransfersSection = () => {
    const sections = [];


    sections.push(
      <PinSection
        key={-1}
        transfersPin
        setCurrentPopup={false}
        city={itineraries?.start_city?.city_name}
        index={-1}
        pinColour={null}
      />
    );

    
    if (itineraries?.cities?.length > 0) {
      const sourceKey = itineraries?.start_city?.gmaps_place_id;
      const destKey = itineraries?.cities?.[0]?.id;
      const connectionKey = `${sourceKey}:${destKey}`;
      
      
      const intercityBooking = transferBooking?.intercity[connectionKey];
      if (intercityBooking && Object.keys(intercityBooking).length > 0) {
        sections.push(
          <TransferBooking
            mercuryItinerary={props?.mercuryItinerary}
            loadbookings={props?.loadbookings}
            key={intercityBooking.id || `intercity-${connectionKey}`}
            index={-1}
            booking={intercityBooking}
            payment={props?.payment}
            token={props?.token}
            setShowLoginModal={props?.setShowLoginModal}
            _changeTaxiHandler={_changeTaxiHandler}
            _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
            getPaymentHandler={props?.getPaymentHandler}
            _changeFlightHandler={_changeFlightHandler}
            origin={itineraries?.start_city}
            destination={itineraries?.cities?.[0].city}
            oCityData={itineraries?.start_city}
            dCityData={itineraries?.cities?.[0]}
            id={itineraries?.start_city?.gmaps_place_id}
            check_in={itineraries?.start_date}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={itineraries?.start_city?.gmaps_place_id}
            destinationCityId={itineraries?.cities?.[0]?.id}
            pinColour1={CITY_COLOR_CODES[0]}
            pinColour2={
              itineraries?.cities?.length > 1
                ? CITY_COLOR_CODES[1]
                : CITY_COLOR_CODES[0]
            }
            _updateFlightBookingHandler={props._updateFlightBookingHandler}
            _updatePaymentHandler={props._updatePaymentHandler}
          />
        );
      }

     
      const intracityBookings = transferBooking?.intracity[sourceKey] || [];
      if (intracityBookings.length > 0) {
        const sortedIntracity = sortByCheckIn(intracityBookings);
        
        sortedIntracity.forEach((booking, index) => {
          sections.push(
            <TransferBooking
              mercuryItinerary={props?.mercuryItinerary}
              loadbookings={props?.loadbookings}
              key={`intracity-${booking.id}-${index}`}
              index={-1}
              booking={booking}
              payment={props?.payment}
              token={props?.token}
              setShowLoginModal={props?.setShowLoginModal}
              _changeTaxiHandler={_changeTaxiHandler}
              _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
              getPaymentHandler={props?.getPaymentHandler}
              _changeFlightHandler={_changeFlightHandler}
              origin={itineraries?.start_city}
              destination={booking.transfer_details?.destination || itineraries?.start_city}
              oCityData={itineraries?.start_city}
              dCityData={itineraries?.start_city}
              id={itineraries?.start_city?.gmaps_place_id}
              check_in={booking.check_in}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={itineraries?.start_city?.gmaps_place_id}
              destinationCityId={itineraries?.start_city?.gmaps_place_id}
              pinColour1={CITY_COLOR_CODES[0]}
              pinColour2={CITY_COLOR_CODES[0]}
              _updateFlightBookingHandler={props._updateFlightBookingHandler}
              _updatePaymentHandler={props._updatePaymentHandler}
              isIntracity={true}
            />
          );
        });
      }
    }

    itineraries?.cities?.forEach((item, index) => {
      if (index < itineraries.cities.length - 1) {
       
        sections.push(
          <PinSection
            key={item.id}
            transfersPin
            setCurrentPopup={false}
            city={item.city.name}
            index={index}
            pinColour={CITY_COLOR_CODES[(index + 1) % 7]}
          />
        );

        const sourceKey = item.id;
        const destKey = itineraries?.cities?.[index + 1].id;
        const connectionKey = `${sourceKey}:${destKey}`;

        const intercityBooking = transferBooking?.intercity[connectionKey];
        if (intercityBooking && Object.keys(intercityBooking).length > 0) {
          sections.push(
            <TransferBooking
              mercuryItinerary={props?.mercuryItinerary}
              loadbookings={props?.loadbookings}
              key={intercityBooking.id || `intercity-${connectionKey}`}
              index={index}
              booking={intercityBooking}
              payment={props?.payment}
              token={props?.token}
              setShowLoginModal={props?.setShowLoginModal}
              _changeTaxiHandler={_changeTaxiHandler}
              _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
              getPaymentHandler={props?.getPaymentHandler}
              _updatePaymentHandler={props._updatePaymentHandler}
              _changeFlightHandler={_changeFlightHandler}
              origin={item.city}
              destination={itineraries?.cities?.[index + 1].city}
              oCityData={itineraries?.cities?.[index]}
              dCityData={itineraries?.cities?.[index + 1]}
              id={item.id}
              check_in={item.start_date}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={item.id}
              destinationCityId={itineraries?.cities?.[index + 1].id}
              pinColour1={CITY_COLOR_CODES[(index + 1) % 7]}
              pinColour2={CITY_COLOR_CODES[(index + 2) % 7]}
              _updateFlightBookingHandler={props._updateFlightBookingHandler}
            />
          );
        }

        
        const intracityBookings = transferBooking?.intracity[sourceKey] || [];
        if (intracityBookings.length > 0) {

          const sortedIntracity = sortByCheckIn(intracityBookings);
          
          sortedIntracity.forEach((booking, idx) => {
            sections.push(
              <TransferBooking
                mercuryItinerary={props?.mercuryItinerary}
                loadbookings={props?.loadbookings}
                key={`intracity-${booking.id}-${idx}`}
                index={index}
                booking={booking}
                payment={props?.payment}
                token={props?.token}
                setShowLoginModal={props?.setShowLoginModal}
                _changeTaxiHandler={_changeTaxiHandler}
                _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
                getPaymentHandler={props?.getPaymentHandler}
                _changeFlightHandler={_changeFlightHandler}
                origin={item.city}
                destination={booking.transfer_details?.destination || item.city}
                oCityData={itineraries?.cities?.[index]}
                dCityData={itineraries?.cities?.[index]}
                id={item.id}
                check_in={booking.check_in}
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
                originCityId={item.id}
                destinationCityId={item.id}
                pinColour1={CITY_COLOR_CODES[(index + 1) % 7]}
                pinColour2={CITY_COLOR_CODES[(index + 1) % 7]}
                _updateFlightBookingHandler={props._updateFlightBookingHandler}
                isIntracity={true}
              />
            );
          });
        }
      }
    });

   
    if (itineraries?.cities?.length > 0) {
      const lastIndex = itineraries.cities.length - 1;
      const lastCity = itineraries.cities[lastIndex];
      
      sections.push(
        <PinSection
          key={`last-${lastCity.id}`}
          transfersPin
          setCurrentPopup={false}
          city={lastCity.city.name}
          index={lastIndex}
          pinColour={CITY_COLOR_CODES[itineraries?.cities.length % 7]}
        />
      );

      const sourceKey = lastCity.id;
      const destKey = itineraries?.end_city?.gmaps_place_id;
      const connectionKey = `${sourceKey}:${destKey}`;
      
     
      const intercityBooking = transferBooking?.intercity[connectionKey];
      if (intercityBooking && Object.keys(intercityBooking).length > 0) {
        sections.push(
          <TransferBooking
            mercuryItinerary={props?.mercuryItinerary}
            loadbookings={props?.loadbookings}
            key={intercityBooking.id || `intercity-${connectionKey}`}
            index={lastIndex}
            booking={intercityBooking}
            payment={props?.payment || null}
            token={props?.token || null}
            setShowLoginModal={props?.setShowLoginModal}
            _changeTaxiHandler={_changeTaxiHandler}
            _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
            getPaymentHandler={props?.getPaymentHandler}
            _changeFlightHandler={_changeFlightHandler}
            origin={lastCity.city}
            destination={itineraries?.end_city}
            oCityData={lastCity}
            dCityData={itineraries?.end_city}
            id={itineraries?.end_city?.gmaps_place_id}
            check_in={itineraries?.end_date}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={lastCity.id}
            destinationCityId={itineraries?.end_city?.gmaps_place_id}
            pinColour1={CITY_COLOR_CODES[itineraries?.cities?.length % 7]}
            pinColour2={"#000000"}
            _updateFlightBookingHandler={props._updateFlightBookingHandler}
          />
        );
      }

      const intracityBookings = transferBooking?.intracity[sourceKey] || [];
      if (intracityBookings.length > 0) {
        
        const sortedIntracity = sortByCheckIn(intracityBookings);
        
        sortedIntracity.forEach((booking, idx) => {
          sections.push(
            <TransferBooking
              mercuryItinerary={props?.mercuryItinerary}
              loadbookings={props?.loadbookings}
              key={`intracity-${booking.id}-${idx}`}
              index={lastIndex}
              booking={booking}
              payment={props?.payment}
              token={props?.token}
              setShowLoginModal={props?.setShowLoginModal}
              _changeTaxiHandler={_changeTaxiHandler}
              _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
              getPaymentHandler={props?.getPaymentHandler}
              _changeFlightHandler={_changeFlightHandler}
              origin={lastCity.city}
              destination={booking.transfer_details?.destination || lastCity.city}
              oCityData={itineraries?.cities?.[lastIndex]}
              dCityData={itineraries?.cities?.[lastIndex]}
              id={lastCity.id}
              check_in={booking.check_in}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={lastCity.id}
              destinationCityId={lastCity.id}
              pinColour1={CITY_COLOR_CODES[(lastIndex + 1) % 7]}
              pinColour2={CITY_COLOR_CODES[(lastIndex + 1) % 7]}
              _updateFlightBookingHandler={props._updateFlightBookingHandler}
              isIntracity={true}
            />
          );
        });
      }
    }

    sections.push(
      <PinSection
        key={-2}
        transfersPin
        setCurrentPopup={false}
        city={itineraries?.end_city?.city_name}
        index={-2}
        pinColour={null}
      />
    );

   
    const endCityIntracityBookings = transferBooking?.intracity[itineraries?.end_city?.gmaps_place_id] || [];
    if (endCityIntracityBookings.length > 0) {

      const sortedIntracity = sortByCheckIn(endCityIntracityBookings);
      
      sortedIntracity.forEach((booking, idx) => {
        sections.push(
          <TransferBooking
            mercuryItinerary={props?.mercuryItinerary}
            loadbookings={props?.loadbookings}
            key={`intracity-end-${booking.id}-${idx}`}
            index={-2}
            booking={booking}
            payment={props?.payment}
            token={props?.token}
            setShowLoginModal={props?.setShowLoginModal}
            _changeTaxiHandler={_changeTaxiHandler}
            _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
            getPaymentHandler={props?.getPaymentHandler}
            _changeFlightHandler={_changeFlightHandler}
            origin={itineraries?.end_city}
            destination={booking.transfer_details?.destination || itineraries?.end_city}
            oCityData={itineraries?.end_city}
            dCityData={itineraries?.end_city}
            id={itineraries?.end_city?.gmaps_place_id}
            check_in={booking.check_in}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={itineraries?.end_city?.gmaps_place_id}
            destinationCityId={itineraries?.end_city?.gmaps_place_id}
            pinColour1={"#000000"}
            pinColour2={"#000000"}
            _updateFlightBookingHandler={props._updateFlightBookingHandler}
            isIntracity={true}
          />
        );
      });
    }

    return sections;
  };

  return (
    <div
      id="transfers"
      className={`mt-16 ${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}
    >
      <div
        id="Transfer_Container"
        className="cursor-pointer font-lexend mb-8 mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
      >
        Transfers
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {
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
            {renderTransfersSection()}
          </div>

          <FlightModal
            combo={true}
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
            originCityId={selectedBooking?.originCityId}
            destinationCityId={selectedBooking?.destinationCityId}
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
      }
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