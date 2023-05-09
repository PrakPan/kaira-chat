import React, {useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import media from '../../../components/media';
import usePageLoaded from '../../../components/custom hooks/usePageLoaded';
const Container = styled.div`

    @media screen and (min-width: 768px){

    }

`;

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
  background-color: hsl(0,0%,97%);
  borde-radius: 0.5rem;

`;

const ImageTwoPointOne = styled.div`
  grid-area: two;
  background-color: hsl(0,0%,97%);
  borde-radius: 0.5rem;
  @media screen and (min-width: 768px) {
    grid-area: twopointone;
  }
  @media (min-width: 768px) and (max-width: 1024px) {

  }
`;
const ImageTwoPointTwo = styled.div`
grid-area: three;
background-color: hsl(0,0%,97%);
borde-radius: 0.5rem;

@media screen and (min-width: 768px) {
  grid-area: twopointtwo;
}
`;

const ImageThree = styled.div`
  grid-area: three;
  background-color: hsl(0,0%,97%);
  borde-radius: 0.5rem;


`;

const ImageFour = styled.div`
  grid-area: four;

`;

const ImageFive = styled.div`
  grid-area: one;
  background-color: hsl(0,0%,97%);
  borde-radius: 0.5rem;
@media screen and (min-width: 768px) {
  grid-area: five;
}
`;

const Imageix = styled.div`
  grid-area: six;
`;

const Gallery = (props) => {
  const isPageLoaded = usePageLoaded()
      let ImageContainerTopPadding;
      if(isPageLoaded) ImageContainerTopPadding = localStorage.getItem('NavbarHeight');
      let isPageWide = media('(min-width: 768px)')

 const imageClickHandler = () => {
    props.setGalleryOpen(true)
  }
  let imageheight;
  let imagewidth;
  if(isPageLoaded){
   imageheight = Math.round(window.innerHeight / 2);
    imagewidth = Math.round(window.innerWidth / 4);
  }
  return(
   <ImageContainer topPadding={ImageContainerTopPadding}>
          {isPageWide?
          <ImageOne>
            <ImageLoader
              url={props.images[0].image}
              borderRadius='0.5rem'
              height='100%'
              heighttab="100%"
              fit="cover"
              onclick={imageClickHandler}
              hoveropacity="0.8"
              hoverpointer
              dimensions={{width: imagewidth*2, height: imageheight*2}}
            />
          </ImageOne> : null}
          <ImageTwoPointOne>
            <ImageLoader
              url={props.images[1].image}
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
              url={props.images[2].image}
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
          { isPageWide ?
          <ImageThree>
            <ImageLoader
              url={props.images[3].image}
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
          : null}
          <ImageFive>
            <ImageLoader
              url={props.images[4].image}
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
