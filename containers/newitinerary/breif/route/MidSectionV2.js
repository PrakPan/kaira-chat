import styled from "styled-components";
import { useState } from "react";
import { TransportIconFetcher } from "../../../../helper/TransportIconFetcher";
import { MdEdit } from "react-icons/md";
import TransferEditDrawer from "../../../../components/drawers/routeTransfer/TransferEditDrawer";
import { logEvent } from "../../../../services/ga/Index";
import { connect, useSelector } from "react-redux";
import TaxiModal from "../../../../components/modals/taxis/Index";
import FlightModal from "../../../../components/modals/flights/Index";
import { useEffect } from "react";
import TransferSkeleton from "../../../../components/itinerary/Skeleton/TransferSkeleton";
import { HiOutlineRefresh } from "react-icons/hi";

const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  width: fit-content;
  padding-top: 0.3rem;
  padding-bottom: 1.3rem;
  @media screen and (min-width: 768px) {
    min-height: ${(props) => (props.hidemidsection ? "4.5rem" : "8rem")};
  }
`;

const Line2 = styled.hr`
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size: 12px 3px, 100% 3px;
  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;
  width: 5rem;
  height: 1.7px;
  top: 23px;
  right: -22px;
  border: 2px;
  opacity: initial;

  @media screen and (min-width: 768px) {
    width: 8rem;
    height: 1.7px;
    top: 46px;
    right: -46px;
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

  width: ${(props) => (props.Transfers ? `19rem` : `9rem`)};

  top: ${(props) => (props.Transfers ? `128px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-134px` : `-55px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 8.3rem;
    height: 1px;
    top: 34px;
    right: -49px;
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
    props.Bookings ? props?.bookings[0] : {
      id: null,
      name: null,
    }
  );
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  console.log("Destination City Data",props?.dcityData)

  console.log("All Book",selectedBooking )

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
          destination_city: booking?.destination_address?.shortName
            ? booking["destination_address"]["shortName"]
            : null,
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
    if (props.cityTransferBookings?.modes === "Flight") {
      setShowFlightModal(true);
    } else if (props.cityTransferBookings?.modes === "Taxi") {
      setShowTaxiModal(true);
    } else {
      handleTransferEdit(e, "Edit Transfer");
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginTop: "5px",
    marginLeft: "5px",
  };

  // console.log("Load Bookings",props?.loadbookings);

  return (
    <Container className={`font-lexend`} hidemidsection={hidemidsection}>
      <div style={{ position: "relative" }}>
        <Line pinColour={props.pinColour} hidemidsection={hidemidsection} />
      </div>

      {hidemidsection &&
        ((transfers_status === "PENDING") ? (
          <TransferSkeleton />
        ) : (
          <>
            {props.version == "v2" ? (
              <Text>
                {props.cityTransferBookings &&
                props.cityTransferBookings?.duration ? (
                  <></>
                ) : (
                  <button
                    onClick={(e) => handleChangeTransfer(e)}
                    className="text-[14px] font-[600] leading-[54px] text-blue hover:underline"
                  >
                    + Add Transfer
                  </button>
                )}

                {props.cityTransferBookings &&
                props.cityTransferBookings?.duration ? (
                  <div
                    className={`inline-flex items-center gap-2 ${
                      !isPageWide ? "w-max" : ""
                    }`}
                  >
                    <div className="text-base text-[#01202B]">
                      {" "}
                      {props.modes}: {props.cityTransferBookings?.duration}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {props.cityTransferBookings &&
                  props.cityTransferBookings?.duration && (
                    <div
                      id="transferEdit"
                      onClick={(e) => {handleChangeTransfer(e); setIsHovered(false)}}
                      className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90 relative"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <HiOutlineRefresh
                        className="transition-transform text-blue"
                      />
                      <div
                        style={popupStyle}
                        className="z-50 absolute -bottom-140 left-1/2 -translate-x-1/2 text-sm text-center flex flex-col gap-2 bg-[#2b2b2a]"
                      >
                        <div className="relative">
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                          <span className="absolute -top-[21px] left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-[#2b2b2a]"></span>

                          <div className="text-nowrap font-normal text-white text-sm">
                            Change
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </Text>
            ) : (
              <div className="font-normal text-base text-[#01202B]">
                {props.modes ? `${props.modes} :` : null} {props.duration}
              </div>
            )}
          </>
        ))}

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
        selectedBooking={props?.cityTransferBookings || selectedBooking}
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
        // selectedBooking={selectedBooking}
        getPaymentHandler={props.getPaymentHandler}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        _updateBookingHandler={props._updateBookingHandler}
        city={props?.city}
        dcity={props?.dcity}
        oCityData={props?.oCityData}
        dCityData={props?.dCityData}
        selectedBooking={props?.cityTransferBookings}
        setSelectedBooking={setSelectedBooking}
        transferData={props?.cityTransferBookings}
        originCityId={
          props?.oCityData?.city?.id || props?.oCityData?.gmaps_place_id
        }
        destinationCityId={
          props?.dCityData?.city?.id || props?.dCityData?.gmaps_place_id
        }
        origin_itinerary_city_id={props?.oCityData?.id || props?.oCityData?.gmaps_place_id || props?.oCityData?.gmaps_place_id}
        destination_itinerary_city_id={props?.dCityData?.id || props?.dCityData?.gmaps_place_id || props?.dCityData?.gmaps_place_id}
        booking_id={selectedBooking?.id}
      />
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    ItineraryId: state.ItineraryId,
    flightBookings: state.Bookings.flightBookings,
    _bookings: state.Bookings,
  };
};

export default connect(mapStateToPros)(MidSectionV2);
