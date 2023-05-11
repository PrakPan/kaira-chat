import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Info from './Info';
import Gallery from './gallery/Index';
const Container = styled.div`
    margin: 0 0 1rem 0;
    
    border-radius: 5px;
    @media screen and (min-width: 768px) {
        padding: 0.5rem;

    }
`;

const GridContainer = styled.div`
    display: grid; 
    grid-gap: 1rem;
    grid-template-columns: max-content auto;

    @media screen and (min-width: 768px) {

    }

`;

const ImageContainer = styled.div`
    
`;
 


const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')
    
 //   if(!showPhotos)
  return(
      <Container className='border-thin'>
           <GridContainer>
              <ImageContainer className='center-div'>
                 
                <Gallery images={props.accommodation.images} ></Gallery>
              </ImageContainer>
                <Info bookings={props.bookings} _updateSearchedAccommodation={props._updateSearchedAccommodation}  accommodation={props.accommodation} new_booking_id={props.accommodation.id}  pricing_type={'TBO'} selectedBooking={props.selectedBooking} room_type={props.accommodation.rooms_available.length ? props.accommodation.rooms_available[0].room_type_name : 'Standard Room'} updateLoadingState={props.updateLoadingState} tailored_id={props.tailored_id} booking_id={props.booking_id} itinerary_id={props.itinerary_id} accommodation_id={props.accommodation.id} _updateBookingHandler={props._updateBookingHandler}  name={props.accommodation.name} star={props.accommodation.star_category}  />
          </GridContainer>
      </Container>
  );
//   else return(
//       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
//   )
  

}
 
export default Accommodation;