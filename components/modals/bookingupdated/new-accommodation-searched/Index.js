import React, { useState } from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Info from './Info';
import Gallery from './gallery/Index';
import Buttons from './Buttons';
import AccommodationModal from '../../accommodation/Index';
import HotelBookingContainer from '../../../../containers/itinerary/HotelsBooking/HotelBookingContainer';

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: max-content auto;

  @media screen and (min-width: 768px) {
  }
`;

const ImageContainer = styled.div`
  padding: 0 0.5rem;
  border-style: none solid none none;
  border-color: rgba(175, 164, 164, 0.4);
  border-width: 1px;
  margin: 0.5rem 0;
`;

const Accommodation = (props) => {
  let isPageWide = media('(min-width: 768px)');
  const [showDetails, setShowDetails] = useState(false);
  //   if(!showPhotos)
  return (
    <Container>
      <div onClick={() => setShowDetails(true)}>
        <HotelBookingContainer
          currentBooking={props.currentBooking}
          booking={props.accommodation}
          handleClick={false}
          // handleClickAc={handleClickAc}
        ></HotelBookingContainer>
      </div>

      {/* <GridContainer>
        <ImageContainer
          className="center-di"
          onClick={() => setShowDetails(true)}
        >
          <Gallery
            setShowDetails={() => setShowDetails(true)}
            images={props.accommodation.images}
          ></Gallery>
        </ImageContainer>
        <Info
          alternates={props.alternates}
          _updateSearchedAccommodation={props._updateSearchedAccommodation}
          setShowDetails={() => setShowDetails(true)}
          token={props.token}
          rating={4.2}
          bookings={props.bookings}
          accommodation={props.accommodation}
          new_booking_id={props.accommodation.id}
          pricing_type={'TBO'}
          selectedBooking={props.selectedBooking}
          room_type={
            props.accommodation.rooms_available.length
              ? props.accommodation.rooms_available[0].room_type_name
              : 'Standard Room'
          }
          updateLoadingState={props.updateLoadingState}
          tailored_id={props.tailored_id}
          booking_id={props.booking_id}
          itinerary_id={props.itinerary_id}
          accommodation_id={props.accommodation.id}
          _updateBookingHandler={props._updateBookingHandler}
          name={props.accommodation.name}
          star={props.accommodation.star_category}
        />
      </GridContainer> */}
      <div className="hidden-desktop">
        <Buttons
          alternates={props.alternates}
          _updateSearchedAccommodation={props._updateSearchedAccommodation}
          itinerary_id={props.itinerary_id}
          tailored_id={props.tailored_id}
          accommodation={props.accommodation}
          bookings={props.bookings}
          setShowDetails={() => setShowDetails(true)}
        ></Buttons>
      </div>
      <AccommodationModal
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.accommodation.id}
        show={showDetails}
      ></AccommodationModal>
    </Container>
  );
};

export default Accommodation;
