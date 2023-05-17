import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import media from '../../../components/media';
import usePageLoaded from '../../../components/custom hooks/usePageLoaded';
 

const ImageContainer = styled.div`
  height: 55vh;
  display: grid;
  width: max-content;
  margin: auto;
  grid-template-columns: 45vw 45vw;
  grid-template-rows: 50% 50%;
  grid-template-areas:
    'one one'
    'two three';
    grid-gap: 2.5vw;
  & > div {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

  }

  @media screen and (min-width: 768px) {
    height: 50vh;
    margin: 5vh auto;
    grid-template-columns: 25vw 12.5vw 12.5vw 25vw;
    grid-template-rows: 50% 50%;
    grid-template-areas: 'one twopointone twopointtwo three'
     'one five five three';
     
      grid-gap: 1vw;

  }
   

`;
const ImageOne = styled.div`
  grid-area: one;
  background-color: #e4e4e4;
  border-radius: 5px;
`;

const ImageTwoPointOne = styled.div`
  grid-area: two;
  background-color: #e4e4e4;
  border-radius: 5px;

  @media screen and (min-width: 768px) {
    grid-area: twopointone;
  }
  @media (min-width: 768px) and (max-width: 1024px) {

  }
`;
const ImageTwoPointTwo = styled.div`
grid-area: three;
background-color: #e4e4e4;
border-radius: 5px;

@media screen and (min-width: 768px) {
  grid-area: twopointtwo;
}
`;

const ImageThree = styled.div`
  grid-area: three;
  background-color: #e4e4e4;
  border-radius: 5px;


`;

 
const ImageFive = styled.div`
  grid-area: one;
  background-color: #e4e4e4;
  border-radius: 5px;

@media screen and (min-width: 768px) {
  grid-area: five;
}
`;


const Gallery = (props) => {
  const isPageLoaded = usePageLoaded();
      let isPageWide = media("(min-width: 768px)");

  let ImageContainerTopPadding = 0;
  let imageheight = null;
  let imagewidth = null;
  if(isPageLoaded){
       ImageContainerTopPadding = localStorage.getItem('NavbarHeight');
         imageheight = Math.round(window.innerHeight / 2);
       imagewidth = Math.round(window.innerWidth / 4)
  }

 const imageClickHandler = () => {
    props.setGalleryOpen(true)
  }
   
  return(
   <ImageContainer topPadding={ImageContainerTopPadding}>
       
          <ImageOne className='hidden-mobile'>
            <ImageLoader
              url={props.images[0]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              fit="cover"
              
              dimensions={{width: imagewidth*2, height: imageheight*2}}
            />
          </ImageOne> 
          <ImageTwoPointOne>
            <ImageLoader
              url={props.images[1]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
             
              fit="cover"
            />
          </ImageTwoPointOne>
          <ImageTwoPointTwo>
            <ImageLoader
              url={props.images[2]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
              fit="cover"
              
             />
          </ImageTwoPointTwo>
          
          <ImageThree className='hidden-mobile'>
            <ImageLoader
              url={props.images[3]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
              fit="cover"
              
            />
          </ImageThree>
         
          <ImageFive>
            <ImageLoader
              url={props.images[4]}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*4, height: imageheight*2}}
              fit="cover"
              dimensionsMobile={{width: 1200, height: 1200}}
             
            />
          </ImageFive>
         </ImageContainer>

  );
}

export default Gallery;
