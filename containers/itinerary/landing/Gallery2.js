import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import media from '../../../components/media';
import usePageLoaded from '../../../components/custom hooks/usePageLoaded';
 

const ImageContainer = styled.div`
   display: grid;
  width: max-content;

  margin: auto;
  grid-template-columns: 45vw 45vw;
  grid-template-rows: 50% 50%;
  grid-template-areas:
    'one two'
    'one two';
    grid-gap: 2.5vw;
  & > div {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

  }

  @media screen and (min-width: 768px) {
     margin: 5vh auto;
    grid-template-columns: 37.5vw  37.5vw;
    grid-template-rows: 50% 50%;
    grid-template-areas: 'one two'
     'one two';
     
      grid-gap: 1vw;

  }
   

`;
const ImageOne = styled.div`
  grid-area: one;
  background-color: #e4e4e4;
`;

const ImageTwo = styled.div`
  grid-area: two;
  background-color: #e4e4e4;

`;
  

 
 
 

 
const Gallery = (props) => {
  const isPageLoaded = usePageLoaded();

  let ImageContainerTopPadding = 0;
  let imageheight = null;
  let imagewidth = null;
  if(isPageLoaded){
       ImageContainerTopPadding = localStorage.getItem('NavbarHeight');
         imageheight = Math.round(window.innerHeight / 2);
       imagewidth = Math.round(window.innerWidth / 4)
  }
      let isPageWide = media('(min-width: 768px)')

 const imageClickHandler = () => {
    props.setGalleryOpen(true)
  }
   
  return(
   <ImageContainer topPadding={ImageContainerTopPadding}>
       
          <ImageOne className=''>
            <ImageLoader
              url={props.images[0]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
             dimensionsMobile={{width: 400, height: 600}}
              dimensions={{width: 1600, height: 1200}}
            />
          </ImageOne> 
          <ImageTwo>
            <ImageLoader
              url={props.images[1]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: 1600, height: 1200}}
              dimensionsMobile={{width: 400, height: 600}}
             
             />
          </ImageTwo >
         
          
         
         
        </ImageContainer>

  );
}

export default Gallery;
