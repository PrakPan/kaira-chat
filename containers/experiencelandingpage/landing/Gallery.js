import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import media from '../../../components/media';
 

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
    grid-template-areas:
      'one twopointone twopointtwo three'
      'one five five three';
      grid-gap: 1vw;

  }
  @media (min-width: 768px) and (max-width: 1024px) {
    height: 40vh;
    grid-template-columns: 30vw 15vw 15vw 30vw;

  }

`;
const ImageOne = styled.div`
  grid-area: one;
  background-color: #e4e4e4;
`;

const ImageTwoPointOne = styled.div`
  grid-area: two;
  background-color: #e4e4e4;

  @media screen and (min-width: 768px) {
    grid-area: twopointone;
  }
  @media (min-width: 768px) and (max-width: 1024px) {

  }
`;
const ImageTwoPointTwo = styled.div`
grid-area: three;
background-color: #e4e4e4;

@media screen and (min-width: 768px) {
  grid-area: twopointtwo;
}
`;

const ImageThree = styled.div`
  grid-area: three;
  background-color: #e4e4e4;


`;

 
const ImageFive = styled.div`
  grid-area: one;
  background-color: #e4e4e4;

@media screen and (min-width: 768px) {
  grid-area: five;
}
`;

 
const Gallery = (props) => {
  let ImageContainerTopPadding = 0;
  let imageheight = null;
  let imagewidth = null;
  if(typeof window !=='undefined'){
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
       
          <ImageOne className='hidden-mobile'>
            <ImageLoader
              url={props.images.image_1}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              fit="cover"
              onclick={imageClickHandler}
              hoveropacity="0.8"
              hoverpointer
              dimensions={{width: imagewidth*2, height: imageheight*2}}
            />
          </ImageOne> 
          <ImageTwoPointOne>
            <ImageLoader
              url={props.images.image_2}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
              onclick={imageClickHandler}

              hoveropacity="0.8"
              hoverpointer
              fit="cover"
            />
          </ImageTwoPointOne>
          <ImageTwoPointTwo>
            <ImageLoader
              url={props.images.image_3}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
              fit="cover"
              hoveropacity="0.8"
              hoverpointer
              onclick={imageClickHandler}
            />
          </ImageTwoPointTwo>
          
          <ImageThree className='hidden-mobile'>
            <ImageLoader
              url={props.images.image_4}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*2, height: imageheight*2}}
              dimensionsMobile={{width: 1200, height: 1200}}
              fit="cover"
              hoveropacity="0.8"
              hoverpointer
              onclick={imageClickHandler}
            />
          </ImageThree>
         
          <ImageFive>
            <ImageLoader
              url={props.images.main_image}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              dimensions={{width: imagewidth*4, height: imageheight*2}}
              fit="cover"
              dimensionsMobile={{width: 1200, height: 1200}}
              hoveropacity="0.8"
              hoverpointer
              onclick={imageClickHandler}
            />
          </ImageFive>
         
        </ImageContainer>

  );
}

export default Gallery;
