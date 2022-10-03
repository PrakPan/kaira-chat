import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
import Info from './Info';
import FullScreenGallery from '../../../fullscreengallery/Index';
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
    @media screen and (min-width: 768px) {
        grid-template-columns: max-content auto;

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
const RightContainer  = styled.div`

`;
const ViewAll = styled.div`
    margin: 0.5rem 0 4px 0;
    font-size: 0.75rem;
    border-style: none none solid none;
    border-width: 1px;
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
    const openPhotosHandler = () => {
        let images = [];
        for(var i = 0;  i < props.images.length; i++){
            images.push(props.images[i].image);
        }
        setImages(images)
        setShowPhotos(true);
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
                <Gallery images={props.images} review_score={props.review_score} review_count={props.review_count}></Gallery>
              </ImageContainer>
                <Info  pricing_type={props.pricing_type} selectedBooking={props.selectedBooking} includeBreakfast={props.includeBreakfast} room_type={props.room_type} updateLoadingState={props.updateLoadingState} tailored_id={props.tailored_id} booking_id={props.booking_id} itinerary_id={props.itinerary_id} accommodation_id={props.accommodation_id} _updateBookingHandler={props._updateBookingHandler} type={props.type} name={props.name} description={props.description} location={props.location} star={props.star} cost={props.cost} />
          </GridContainer>
      </Container>
  );
//   else return(
//       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
//   )
  

}
 
export default Accommodation;