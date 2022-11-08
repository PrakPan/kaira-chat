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
   const [url, setUrl] = useState(null);
   useEffect(() => {
        if(props.images.length) setUrl(props.images[0].image);
        else setUrl('media/icons/bookings/notfounds/noroom.png');
  },[props.images])

  const _handleFail = ( ) => {
    setUrl('media/icons/bookings/notfounds/noroom.png');
  }
  return(
      <Container className=''>
          
     
      <ImageLoader onfail={_handleFail} hoverpointer onclick={props.setShowDetails } borderRadius="10px" url={url}   width='12.5vw' widthmobile="30vw" height={isPageWide ? "12.5vw" : "25vw"}   dimensions={{width: 800, height: 800}} dimensionsMobile={{width: 600, height: 600}}></ImageLoader>

      </Container> 
  );
  

}
 
export default Gallery;