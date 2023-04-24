import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
import Info from './Info';
import FullScreenGallery from '../../../fullscreengallery/Index';
import Gallery from './gallery/Index';
const Container = styled.div`
    margin: 0 0 1rem 0;
    background-color: hsl(0,0%,96%);
    border-radius: 5px;
    padding: 0.5rem;

    @media screen and (min-width: 768px) {
        padding: 0.5rem;

    }
`;

const GridContainer = styled.div`
    display: grid; 
            grid-template-columns: 2fr 5fr;

    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 5fr;
        grid-gap: 1rem;
    }

`;

const ImageContainer = styled.div`
    
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
      <Container className='borde'>
           <GridContainer>
              <ImageContainer className='center-dv'>
                  {/* {isPageWide ? <ImageLoader url={props.images[0].image} borderRadius="50%" width="75%" height="auto"   dimensions={{width: 1600, height: 1600}}></ImageLoader>
                : <ImageLoader url={props.images[0].image} borderRadius="50%" width="60%" height="auto"   dimensions={{width: 1600, height: 1600}}></ImageLoader>    
            } */}
                    {/* <AllPhotos onClick={openPhotosHandler}className='font-lexend'>All Photos</AllPhotos> */}
              {/* <ViewAll className='font-lexend' style={{margin: '0.5rem 0', fontSize: '0.75rem'}}>View All</ViewAll> */}
                {/* <Gallery images={props.images} review_score={props.review_score} review_count={props.review_count}></Gallery> */}
                <ImageLoader url={props.data.icon} borderRadius="50%" width="100%" height="auto"   dimensions={{width: 500, height: 500}}></ImageLoader>    
              </ImageContainer>
                <Info  _updatePoiHandler={props._updatePoiHandler} data={props.data} _openPoiModal={props._openPoiModal}  updateLoadingState={props.updateLoadingState} tailored_id={props.tailored_id}  itinerary_id={props.itinerary_id} heading={props.data.heading} text={props.data.text}/>
          </GridContainer>
      </Container>
  );
//   else return(
//       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
//   )
  

}
 
export default Accommodation;