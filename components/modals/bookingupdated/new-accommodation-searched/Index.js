import React, { useState } from "react";
import AccommodationModal from "../../accommodation/Index";
import HotelBookingContainer from "../../../../containers/itinerary/HotelsBooking/HotelBookingContainer";

const Accommodation = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <HotelBookingContainer
        currentBooking={props.currentBooking}
        payment={props.payment}
        plan={props.plan}
        tailored_id={props.tailored_id}
        itinerary_id={props.itinerary_id}
        booking={props.accommodation}
        alternates={props.alternates}
        selectedBooking={props.selectedBooking}
        handleClick={false}
        openDetails={() => setShowDetails(true)}
        banner_image={props.banner_image}
      ></HotelBookingContainer>

      <AccommodationModal
        check_in={props.selectedBooking.check_in}
        check_out={props.selectedBooking.check_out}
        pax={props.selectedBooking?.pax}
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.accommodation.id}
        currentBooking={props.accommodation}
        show={showDetails}
        traceId={props.traceId}
        provider={props.provider}
        setUpdateBookingState={props.setUpdateBookingState}
        setUnauthorized={props.setUnauthorized}
        _updateStayBookingHandler={props._updateStayBookingHandler}
        getPaymentHandler={props.getPaymentHandler}
      ></AccommodationModal>
    </div>
  );
};

export default Accommodation;
