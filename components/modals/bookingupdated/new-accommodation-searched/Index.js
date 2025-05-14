import React, { useState } from "react";
import NewHotelBooking from "./NewHotelBooking";
import ViewHotelDetails from "../../ViewHotelDetails/viewHotelDetails";

const Accommodation = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const num_adults=props.occupancies?.reduce(
    (sum, room) => sum + (room.adults || 0),
    0
  )
  // console.log("num_adults:", num_adults);
  return (
    <div>
      <NewHotelBooking
        currentBooking={props.currentBooking}
        payment={props.payment}
        plan={props.plan}
        tailored_id={props.tailored_id}
        itinerary_id={props.itinerary_id}
        booking={props.accommodation}
        alternates={props.alternates}
        selectedBooking={props.selectedBooking}
        num_adults={num_adults}
        openDetails={() => setShowDetails(true)}
        banner_imcurage={props.banner_image}
        handleClick={props?.handleClick}
        key={props?.key}
        handleClose={props?.handleClose}

      />

      <ViewHotelDetails
        mercury={props?.mercury}
        check_in={props.selectedBooking.check_in}
        check_out={props.selectedBooking.check_out}
        pax={props.selectedBooking?.pax}
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.accommodation.id}
        bookingId={props.selectedBooking.id}
        currentBooking={props.accommodation}
        show={showDetails}
        traceId={props.traceId}
        provider={props.provider}
        setUpdateBookingState={props.setUpdateBookingState}
        setUnauthorized={props.setUnauthorized}
        _updateStayBookingHandler={props._updateStayBookingHandler}
        getPaymentHandler={props.getPaymentHandler}
        handleClick={props?.handleClick}
        plan={props?.plan}
        setStayBookings={props.setStayBookings}
        occupancies={props.occupancies}
        source={props.source}
        setShowLoginModal={props?.setShowLoginModal}
        handleClose={props?.handleClose}
      ></ViewHotelDetails>
    </div>
  );
};

export default Accommodation;
