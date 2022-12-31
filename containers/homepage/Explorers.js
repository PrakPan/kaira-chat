import React, {useState} from 'react';
import styled from 'styled-components';

//  import NewSearchMobile from '../../../components/search/homepage/mobile/Index';
// import NewSearchDesktop from '../../../components/search/homepage/desktop/Index';
import media from '../../components/media';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../components/ImageLoader';
 
const Container = styled.div`
width: 100%;
 
height: 100%;
background-color: rgba(0,0,0,0.4);
display: grid;
grid-template-columns: 1fr 1fr 1fr;
@media screen and (min-width: 768px){
  
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;

}
`;
 
 const ImageContainer = styled.div`
    background-color: rgba(0,0,0,0.4);
 `;
 
const Explorers= (props) => {
    let isPageWide = media('(min-width: 768px)')

     
   
   
  
    return(
        <Container className="center-dv"> 
        <ImageContainer>1
        <ImageLoader

            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>
        </ImageContainer>
          
               <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>   <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>   <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>   <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>   <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>
             <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader> <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader> <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader> <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader> <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader> <ImageLoader
            url="media/website/WhatsApp Image 2022-12-29 at 16.03.24 (1).jpg"
            dimensions={{width: 1200, height: 1200}}
            dimensionsMobile={{width: 900, height: 900}}
            height="auto"
            ></ImageLoader>

        </Container>
    );

}

export default Explorers;