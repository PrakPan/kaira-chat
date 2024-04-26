import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import AccommodationModal from "../../accommodation/Index";
import HotelBookingContainer from "../../../../containers/itinerary/HotelsBooking/HotelBookingContainer";

const Container = styled.div`
  /* margin: 0 0 1rem 0;
  border-radius: 10px !important;
  @media screen and (min-width: 768px) {
    padding: 0.5rem;
    &:hover {
      cursor: pointer;
      background-color: rgba(247, 231, 0, 0.1);
    }
  } */
`;

const Accommodation = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container>
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
          _updateSearchedAccommodation={props._updateSearchedAccommodation}
          _SelectedBookingHandler={props._SelectedBookingHandler}
          openDetails={() => setShowDetails(true)}
          banner_image={props.banner_image}
          // handleClickAc={handleClickAc}
        ></HotelBookingContainer>
      </div>

      <AccommodationModal
        check_in={props.selectedBooking.check_in}
        check_out={props.selectedBooking.check_out}
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.accommodation.id}
        currentBooking={props.accommodation}
        show={showDetails}
      ></AccommodationModal>
    </Container>
  );
};

export default Accommodation;
