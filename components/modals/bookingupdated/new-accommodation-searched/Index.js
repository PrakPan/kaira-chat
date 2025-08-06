import React, { useState } from "react";
import NewHotelBooking from "./NewHotelBooking";
import ViewHotelDetails from "../../ViewHotelDetails/viewHotelDetails";

const Accommodation = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const num_adults = props.occupancies?.reduce(
    (sum, room) => sum + (room.adults || 0),
    0
  );
  const num_children = props.occupancies?.reduce(
    (sum, room) => sum + (room.childAges?.length || 0),
    0
  );
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
        num_adults={num_adults}
        num_children={num_children}
        openDetails={() => setShowDetails(true)}
        banner_imcurage={props.banner_image}
        handleClick={props?.handleClick}
        key={props?.key}
        handleClose={props?.handleClose}
      />

      <ViewHotelDetails
        currentBooking={props.currentBooking}
        mercury={props?.mercury}
        check_in={props.currentBooking.check_in}
        check_out={props.currentBooking.check_out}
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.accommodation.id}
        bookingId={props.currentBooking.booking_id}
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
        itinerary_city_id={props.itinerary_city_id}
        city_id={props?.city_id}
      ></ViewHotelDetails>
    </div>
  );
};

export default Accommodation;
