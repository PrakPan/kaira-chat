import styled from "styled-components";
import Bookings from "./UpdatedIndex";
import { connect } from "react-redux";

const NotFoundContainer = styled.div`
  padding: 5vh;
`;

const MessageContainer = styled.div`
  padding: 0.5rem 0.5rem;
  border-radius: 5px;
  background-color: hsl(0, 0%, 97%);
  font-weight: 300;
  width: 100%;
  margin: auto;
  text-align: center;
  @media screen and (min-width: 768px) {
  }
`;

const IndexWrapper = (props) => {
  if (!props.no_bookings) {
    return (
      <Bookings
        itinerary={props.itinerary}
        hasUserPaid={props.hasUserPaid}
        payment_status={props.payment_status}
        plan={props.plan}
        id={props.id}
        isDatePresent={props.isDatePresent}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        showTaxiModal={props.showTaxiModal}
        setShowTaxiModal={props.setShowTaxiModal}
        paymentLoading={props.paymentLoading}
        budget={props.budget}
        _deselectActivityBookingHandler={props._deselectActivityBookingHandler}
        activityFlickityIndex={props.activityFlickityIndex}
        _deselectFlightBookingHandler={props._deselectFlightBookingHandler}
        flightFlickityIndex={props.flightFlickityIndex}
        _deselectTransferBookingHandler={props._deselectTransferBookingHandler}
        transferFlickityIndex={props.transferFlickityIndex}
        flightLoading={props.flightLoading}
        stayFlickityIndex={props.stayFlickityIndex}
        setStayFlickityIndex={props.setStayFlickityIndex}
        selectingBooking={props.selectingBooking}
        _deselectStayBookingHandler={props._deselectStayBookingHandler}
        getPaymentHandler={props.getPaymentHandler}
        flightBookings={props.flightBookings}
        transferLoading={props.transferLoading}
        cardUpdateLoading={props.cardUpdateLoading}
        _updateFlightBookingHandler={props._updateFlightBookingHandler}
        _updateStayBookingHandler={props._updateStayBookingHandler}
        activityBookings={props.activityBookings}
        transferBookings={props.transferBookings}
        stayBookings={props.stayBookings}
        _selectTaxiHandler={props._selectTaxiHandler}
        setHideFlightModal={props.setHideFlightModal}
        showFlightModal={props.showFlightModal}
        setShowFlightModal={props.setShowFlightModal}
        token={props.token}
        is_auth={props.email === props.user_email ? true : false}
        traveleritinerary={props.traveleritinerary}
        is_stock={props.is_stock}
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateBookingHandler={props._updateBookingHandler}
        reloadBookings={props.reloadBookings}
        setShowBookingModal={props.setShowBookingModal}
        showBookingModal={props.showBookingModal}
        setHideBookingModal={props.setHideBookingModal}
        hours={props.hours}
        minutes={props.minutes}
        seconds={props.seconds}
        timeRequired={props.timeRequired}
        hideTimer={props.hideTimer}
        showTimer={false}
        itineraryDate={props.itineraryDate}
        blur={false}
        openItinerary={props.openItinerary}
        _handleTimerClose={props._handleTimerClose}
        setImagesHandler={props.setImagesHandler}
        payment={props.payment}
        booking={props.booking}
      ></Bookings>
    );
  } else
    return (
      <NotFoundContainer>
        <MessageContainer className="border-thin ">
          Looks like our travel experts are working on providing you the best
          available accommodations.
        </MessageContainer>
      </NotFoundContainer>
    );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    email: state.auth.email,
  };
};

export default connect(mapStateToPros)(IndexWrapper);
