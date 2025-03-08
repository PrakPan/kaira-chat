import styled from "styled-components";
import { useState } from "react";
import { TransportIconFetcher } from "../../../../helper/TransportIconFetcher";
import { MdEdit } from "react-icons/md";
import TransferEditDrawer from "../../../../components/drawers/routeTransfer/TransferEditDrawer";
import { logEvent } from "../../../../services/ga/Index";
import { connect } from "react-redux";
import TaxiModal from "../../../../components/modals/taxis/Index";
import FlightModal from "../../../../components/modals/flights/Index";
import { useEffect } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: ${(props) => (props.hidemidsection ? "4.5rem" : "8rem")};
  }
`;


// const Line = styled.hr`
//   background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
//     ${(props) =>
//       props.pinColour
//         ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
//         : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

//   background-size: 12px 3px, 100% 3px;
//   color: #c80000;
//   -webkit-transform: rotate(90deg);
//   position: absolute;
//   width: 2px;
//   height: 1.7px;
//   top: 23px;
//   right: -22px;
//   border: 2px;
//   opacity: initial;

//   @media screen and (min-width: 768px) {
//         width: 8rem;
//         height: 1.7px;
//         top: 46px;
//         right: -46px;
//   }
// `;
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
  width: ${(props) => (props?.Transfers ? `16rem` : `5rem`)};
  top: ${(props) => (props?.Transfers ? `101px` : `23px`)};
  right: ${(props) => (props?.Transfers ? `-110px` : `-22px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 8.4rem;
    height: 1px;
    top: 40px;
    right: -50px;
  }
`;

const Text = styled.div`
  color: #4d4d4d;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 3.5rem;
  display: flex;
  align-items: center;
  margin: 1.5rem;
`;

const MidSectionV2 = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [addOrEdit, setAddOrEdit] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(
    props.Bookings ? props?.bookings[0] : {}
  );
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  


  // let routeKey = props?.routeKey;
  // let parts = routeKey ? routeKey.split(":") : [null, null];


  useEffect(() => {
    if (props.cityTransferBookings && props.flightBookings) {
      let booking = null;
      if (props.bookings) {
        const allBookings = [
          ...props.flightBookings,
          ...props.cityTransferBookings,
        ];
        booking = allBookings.find(
          (book) => book.id === props?.bookings[0]?.id
        );
      }
      if (booking) {
        setSelectedBooking({
          ...selectedBooking,
          name: booking["name"],
          costings_breakdown: booking["transfer_details"],
          cost: booking["price"],
          itinerary_id: booking["itinerary_id"],
          itinerary_name: booking["itinerary_name"],
          tailored_id: booking["tailored_itinerary"],
          id: booking["id"],
          check_in: booking["check_in"],
          check_out: booking["check_out"],
          pax: {
            number_of_adults: booking["number_of_adults"],
            number_of_children: booking["number_of_children"],
            number_of_infants: booking["number_of_infants"],
          },
          city: booking["city"],
          taxi_type: booking["taxi_type"],
          transfer_type: booking["transfer_type"],
          // destination_city: booking["destination_address"]["shortName"] ? booking["destination_address"]["shortName"] : null,
          destination_city: booking?.destination_address?.shortName ? booking["destination_address"]["shortName"] : null,
          origin_iata: booking["origin_city_iata_code"],
          destination_iata: booking["destination_city_iata_code"],
          origin: booking["source_address"],
          destination: booking["destination_address"],
        });
      }
    }
  }, [props.flightBookings, props.cityTransferBookings]);

  const getBooking = (bookingId) => {
    let booking = null;
    if (props.flightBookings) {
      booking = props.flightBookings.find((book) => book.id === bookingId);
    }

    if (booking) return booking;

    if (props.transferBookings) {
      booking = props.transferBookings.find((book) => book.id === bookingId);
    }
    return booking;
  };

  let hidemidsection = props.hidemidsection;
  if (props?.route && props?.route?.modes && props?.route?.modes.length)
    hidemidsection = false;
  else if (props?.bookings && props?.bookings.length) hidemidsection = false;
  else if (props?.route && props?.route?.transfers) hidemidsection = false;
  else hidemidsection = true;

  const handleTransferEdit = (e) => {
    setShowDrawer(true);
    setAddOrEdit(e.target.id);

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Transfer Change",
        event_action: "Route",
      },
    });
  };

  const handleChangeTransfer = (e) => {
    if (props.cityTransferBookings.modes === "Flight") {
      setShowFlightModal(true);
    } else if (props.modes === "Taxi") {
      setShowTaxiModal(true);
    } else {
      handleTransferEdit(e, "Edit Transfer");
    }
  };

  return (
    <Container className="font-lexend" hidemidsection={hidemidsection}>
      <div style={{ position: "relative" }}>
        <Line pinColour={props.pinColour} hidemidsection={hidemidsection} />
      </div>

      {hidemidsection && (
        <> 
          {props.version == "v2" ? (
            (
              <Text>
                {props.cityTransferBookings && props.cityTransferBookings?.duration ? (
                  <TransportIconFetcher
                    TransportMode={props.cityTransferBookings?.booking_type}
                    Instyle={{
                      fontSize:
                        props.route?.modes[0] === "Bus" ? "1.2rem" : "1.4rem",
                      marginRight: "0.8rem",
                      color: "#4d4d4d",
                    }}
                  />
                ) 
                
                : 
                (
                  <button
                    onClick={(e) => handleChangeTransfer(e)}
                    className="text-[14px] font-[600] leading-[54px] text-blue hover:underline"
                  >
                    +Add Transfer
                  </button>
                )}

                {/* {props.bookings && props.bookings.length ? (
                  props?.bookings?.map((element, index) => (
                    <div className="flex flex-row" key={index}>
                      <div className="flex flex-row pr-0">
                        {element.booking_type}
                        {index !== props?.bookings.length - 1 && (
                          <span className="pr-2">,</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : props.route &&
                  props.route.modes &&
                  props.route.modes.length ? (
                  props.route.modes.map((element, index) => (
                    <div className="flex flex-row" key={index}>
                      <div className="flex flex-row pr-0">
                        {element}
                        {index !== props.route.modes.length - 1 && (
                          <span className="pr-2">,</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )} */}

                {
                // props.route?.modes &&
                // props.route?.modes.length &&
               
                props.cityTransferBookings && props.cityTransferBookings?.duration ? (
                  <div className="inline-flex items-center gap-2">
                    <div> {props.modes}: {props.cityTransferBookings?.duration}</div>
                  </div>
                ) : (
                  <></>
                )}

                {/* {props?.route?.transfers &&
                  props?.route?.transfers?.id &&
                  props?.route?.transfers?.id !== "" &&
                  !props?.plan?.round_trip_taxi_added &&
                  ((props?.route?.modes && props?.route?.modes?.length) ||
                    (props?.bookings && props?.bookings?.length)) && ( */}
                    {props.cityTransferBookings && props.cityTransferBookings?.duration && <div
                      id="transferEdit"
                      onClick={(e) => handleChangeTransfer(e)}
                      className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                    >
                      <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                    </div>}
                  {/* )} */}
              </Text>
            )
          ) : (
            <Text>
              {props.modes && (
                <TransportIconFetcher
                  TransportMode={props.modes}
                  Instyle={{
                    fontSize: props.modes === "Bus" ? "1.2rem" : "1.4rem",
                    marginRight: "0.8rem",
                    color: "#4d4d4d",
                  }}
                />
              )}
              {props.modes ? `${props.modes} :` : null} {props.duration}
            </Text>
          )}
        </>
      )}


       <FlightModal
        showFlightModal={showFlightModal}
        setShowFlightModal={setShowFlightModal}
        setHideFlightModal={() => setShowFlightModal(false)}
        setHideBookingModal={() => setShowFlightModal(false)}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        alternates={selectedBooking?.id}
        tailored_id={selectedBooking["tailored_itinerary"]}
        // _updateFlightHandler={props._updateFlightHandler}
        selectedBooking={selectedBooking}
        itinerary_id={props?.itinerary_id}
        selectedTransferHeading={props?.route?.heading}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={props?.route?.element_location?.day_slab_index}
        elementIndex={props?.route?.element_index}
        routeId={props?.route?.transfers?.id}
        city={props?.city}
        dcity={props?.dcity}
        oCityData={props?.oCityData}
        dCityData={props?.dCityData}
      ></FlightModal>

      <TaxiModal
        mercury
        showTaxiModal={showTaxiModal}
        setHideBookingModal={() => setShowTaxiModal(false)}
        setHideTaxiModal={() => setShowTaxiModal(false)}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        selectedBooking={selectedBooking}
        itinerary_id={props?.itinerary_id}
        selectedTransferHeading={props?.route?.heading}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
        daySlabIndex={props?.route?.element_location?.day_slab_index}
        elementIndex={props?.route?.element_index}
        routeId={props?.route?.transfers?.id}
        origin={props?.originCity}
        destination={props?.destinationCity}
        city={props?.city}
        dcity={props?.dcity}
        oCityData={props?.oCityData}
        dCityData={props?.dCityData}
      ></TaxiModal>

      <TransferEditDrawer
      mercury
        addOrEdit={addOrEdit}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        selectedTransferHeading={props?.route?.heading}
        origin={props?.originCity}
        destination={props?.destinationCity}
        day_slab_index={props?.route?.element_location?.day_slab_index}
        element_index={props?.route?.element_index}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
        routeId={props?.route?.transfers?.id}
        selectedBooking={selectedBooking}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        city={props?.city}
        dcity={props?.dcity}
        oCityData={props?.oCityData}
        dCityData={props?.dCityData}
      /> 
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    ItineraryId: state.ItineraryId,
    // transferBookings: gs.transferBookings,
    flightBookings: state.Bookings.flightBookings,
    _bookings: state.Bookings,
  };
};

export default connect(mapStateToPros)(MidSectionV2);
