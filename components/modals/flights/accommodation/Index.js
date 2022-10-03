import React, {useRef, useEffect, useState} from 'react';
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
const AllPhotos = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background-color: white;
    opacity: 0.7;
    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    font-size: 0.75rem;
    &:hover{
        cursor: pointer;
    }

`;


const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')
  const [showPhotos, setShowPhotos] = useState(false);
  const [images, setImages] = useState([]);
  const closePhotosHandler = () => {
     setImages(null);
    setShowPhotos(false);
    }
  
 //   if(!showPhotos)
  return(
      <Container className='border-thin'>
           <GridContainer>
              <ImageContainer className='center-div'>
                  {/* {isPageWide ? <ImageLoader url={props.images[0].image} borderRadius="50%" width="75%" height="auto"   dimensions={{width: 1600, height: 1600}}></ImageLoader>
                : <ImageLoader url={props.images[0].image} borderRadius="50%" width="60%" height="auto"   dimensions={{width: 1600, height: 1600}}></ImageLoader>    
            } */}
                    {/* <AllPhotos onClick={openPhotosHandler}className='font-opensans'>All Photos</AllPhotos> */}
              {/* <ViewAll className='font-opensans' style={{margin: '0.5rem 0', fontSize: '0.75rem'}}>View All</ViewAll> */}
                <Gallery images={props.accommodation.images} review_score={props.review_score} review_count={props.review_count}></Gallery>
              </ImageContainer>
                <Info  bookings={props.bookings} accommodation={props.accommodation} new_booking_id={props.accommodation.id} room_id={props.accommodation.costings_breakdown.length ? props.accommodation.costings_breakdown[0].id : null} number_of_rooms={props.accommodation.costings_breakdown.length ? props.accommodation.costings_breakdown[0].number_of_rooms : '1'} pricing_type={props.accommodation.costings_breakdown.length ? props.accommodation.costings_breakdown[0].pricing_type : 'EP'} selectedBooking={props.selectedBooking} room_type={props.accommodation.costings_breakdown.length ? props.accommodation.costings_breakdown[0].room_type_name : 'Standard Room'} updateLoadingState={props.updateLoadingState} tailored_id={props.tailored_id} booking_id={props.booking_id} itinerary_id={props.itinerary_id} accommodation_id={props.accommodation.accommodation} _updateBookingHandler={props._updateBookingHandler}  name={props.accommodation.name} description={props.description} location={props.location} star={props.accommodation.star_category} cost={!props.accommodation.booking_cost ? 0 : Math.round((props.accommodation.booking_cost)/100) } />
          </GridContainer>
      </Container>
  );
//   else return(
//       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
//   )
  

}
 
export default Accommodation;