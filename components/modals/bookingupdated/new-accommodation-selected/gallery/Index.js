import React, {useRef, useEffect, useState} from 'react';
 import styled from 'styled-components';
import media from '../../../../media';
 
 import ImageLoader from '../../../../ImageLoader';
 const Container = styled.div`

    @media screen and (min-width: 768px) {
        position: relative;

    }
`;

 
 

 
const Gallery = (props) => {
  let isPageWide = media('(min-width: 768px)')
   
  return(
      <Container className=''>
          
     
      <ImageLoader hoverpointer onclick={props.setShowDetails} borderRadius="10px" url={props.images.length ? props.images[0].image : 'media/website/grey.png'}   width='12.5vw' widthmobile="30vw" height={isPageWide ? "12.5vw" : "25vw"}   dimensions={{width: 800, height: 800}} dimensionsMobile={{width: 600, height: 600}}></ImageLoader>

      </Container> 
  );
  

}
 
export default Gallery;