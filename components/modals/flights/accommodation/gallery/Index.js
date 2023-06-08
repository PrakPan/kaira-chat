import React from 'react';
import styled from 'styled-components';

import ImageLoader from '../../../../ImageLoader';
import MobileGallery from './mobile/Index';
const Container = styled.div`

    @media screen and (min-width: 768px) {
        position: relative;

    }
`;

const Gallery = (props) => {
   
  return(
      <Container className=''>
         
        {false ? <ImageLoader borderRadius="50%" url={props.images.length ? props.images[0].image : 'media/website/grey.jpg'}   width='15vw' widthmobile="100%" height="auto"   dimensions={{width: 1600, height: 1600}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>
        : <MobileGallery review_score={props.review_score} review_count={props.review_count} images={props.images}></MobileGallery>}
    
      </Container> 
  );
  

}
 
export default Gallery;