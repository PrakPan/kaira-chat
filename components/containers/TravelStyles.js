import React from 'react';
import styled,{keyframes} from 'styled-components';
import LazyImageLoader from '../ImageLoader';
// import Link from 'next/link';
import media from '../media';
import { useRouter } from 'next/router';
// import * as ga from '../../services/ga/Index';
// import urls from '../../services/urls';
/*Grid container for experience types currently used on homepage*/

const GridGap = 1;

const Container = styled.div`
  margin-top:  5rem;
`;
const TopSlideIn = keyframes`
  from { 
    transform: translateY(0%);
  } 
  to { 
    transform: translateY(-50%);
  } 
`;

const TopSlideOut = keyframes`
  from { 
    transform: translateY(-50%);
  } 
  to { 
    transform: translateY(0%);
  } 
`;

const BottomSlideIn = keyframes`
  from { 
    transform: translateY(0%);
    opacity: 0;
  } 
  to { 
    transform: translateY(-100%);
    opacity: 1;
  } 
`;

const BottomSlideOut = keyframes`
  from { 
    transform: translateY(-100%);
    opacity: 1;
  } 
  to { 
    transform: translateY(0%);
    opacity: 0;
  } 
`;


const Card= styled.div`
  cursor: pointer;
  overflow: hidden;
  &:nth-of-type(3){
    grid-column: span 2;
  }
  &:nth-of-type(4){
    grid-column: 3/5; 
  }
  &:nth-of-type(1){
    grid-column: span 4;
  }
  &:nth-of-type(5){
    grid-column: span 4;
  }
  &:nth-of-type(2){
    grid-column: span 4;
  }
 @media screen and (min-width: 768px){
  &:nth-of-type(1){
    grid-column: 1 / 3;
  }
  &:nth-of-type(2){
    grid-column: 3/5;
  }
  &:nth-of-type(3){
    grid-column: 1 / 3;
    
  }
  &:nth-of-type(4){
    grid-column: 3 / 5;
   
  }
  &:nth-of-type(5){
    grid-column: 3 / 5;
  }
  &:hover{
    .AnimateTop{
      animation: 0.5s ${TopSlideIn} forwards;
   }
     .AnimateBottom{
       animation: 0.5s ${BottomSlideIn} forwards;
     }
 } 
}
`;

const TextContainer = styled.div`
color: white;
z-index:1;
position: absolute;
display: flex;
flex-direction: column;

align-items: center;
font-size: 0.6rem;
@media screen and (min-width: 768px){

  font-size: 1rem;  
  }
`; 

const ImageFade = styled.div`
width: 100%;
height: auto;
transition: 0.4s all ease-in-out;
`;



const ImageTextTop=styled.p`
font-size: 25px;
font-weight: 700;
margin-bottom: 0;
  text-align: center;
animation: 0.5s ${TopSlideOut};
@media screen and (min-width: 768px){
 font-size:2rem ;
  /* font-size: ${props => props.theme.fontsizes.desktop.text.one}; */
  width: 100%;
}
`;

const ImageTextBottom=styled.p`  
opacity: 1;
font-size: 1rem;
font-weight: 300;
display: none;
@media screen and (min-width: 768px){
  animation: 0.5s ${BottomSlideOut};
  display: initial;
  opacity: 0;
  }
`;

const PersonaliseContainer = styled.div`
grid-column: 1/5;
background-color: #f7e700;
@media screen and (min-width: 768px){
  display: grid;
  grid-template-columns: 1fr 2fr;
}
`;
const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
`;
const Number = styled.p`
font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
`;
const ExperientialTravelStyle = (props) =>{
  let isPageWide = media('(min-width: 768px)')
  const router = useRouter();
 const _handleRedirect = (experience_filter) => {
   localStorage.setItem('experience_filter', experience_filter);
   router.push('/travel-experiences')
 }
//  const _handleTailoredRedirect = () => {
//   router.push(urls.TAILORED_TRAVEL)
// }
// const _handleTailoredClick = () => {
//   setLoading(true);
//   setTimeout(_handleTailoredRedirect, 1000);

//   ga.callback_event({
//     action: 'TG-Bannerone',
    
//     callback: _handleTailoredRedirect,
//   })

// }

 const GridContainer = styled.div`
 display: grid;
 grid-template-columns: repeat(4, 1fr);
 grid-gap: ${GridGap}rem;
`; 
const ImageCard =styled.div`
display: flex;
align-items: center;
justify-content: center;
${ImageFade}{
  filter: saturate(100%) brightness(60%);  
}
@media screen and (min-width: 768px){
  align-items: flex-end;
  transition: 0.4s all ease-in-out;
  &:hover{
    ${ImageFade}{
      transition: 0.4s all ease-in-out;
      transform: scale(1.1);
    filter: saturate(100%) brightness(50%);  
    }
  }
}
`;




  return(
    <Container>
      <Number className='font-lexend'>10,000+</Number>
      <Heading className='font-lexend'>Experiences Curated</Heading>
    <GridContainer>
      {isPageWide?
      <Card>
        <ImageCard onClick={() => _handleRedirect('Caravans')}>
          <TextContainer>
            <ImageTextTop className="AnimateTop font-lexend">Caravans</ImageTextTop>
            <ImageTextBottom className="AnimateBottom font-lexend">EXPLORE</ImageTextBottom>
          </TextContainer>
          <ImageFade>
          <LazyImageLoader  fit="cover" dimensions={{width: Math.round(props.width/2), height: Math.round(props.height/2)}}  dimensionsMobile={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} url="media/website/KT9A9994.jpg"/>
          </ImageFade>
        </ImageCard>
      </Card>
      : <div></div>
      }
      <Card>
      <ImageCard onClick={() => _handleRedirect('Faces Of India')}>
          <TextContainer>
            <ImageTextTop className="AnimateTop font-lexend" >Faces of India</ImageTextTop>
            <ImageTextBottom className="AnimateBottom font-nunito">EXPLORE</ImageTextBottom>
          </TextContainer>
          <ImageFade >
          <LazyImageLoader fit="cover" dimensions={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} dimensionsMobile={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} url="media/website/IMG_20180530_220624.jpg"/> 
          </ImageFade>
        </ImageCard>
      </Card>
      {/* <Card>
        <ImageCard>
          <TextContainer>
            <ImageTextTop className="AnimateTop font-lexend text-center">Personalised</ImageTextTop>
            <ImageTextTop className="AnimateTop font-lexend text-center">Travel</ImageTextTop>

            <ImageTextBottom className="AnimateBottom font-nunito">EXPLORE</ImageTextBottom>
          </TextContainer>
          <ImageFade >
          <LazyImageLoader  fit="cover" dimensions={{width: WidthValue, height: props.height}}  dimensionsMobile={{width: props.width, height: props.height}}url="media/website/joshua-earle-ICE__bo2Vws-unsplash.jpg"/>
          </ImageFade>
          </ImageCard>
      </Card> */}

      <Card>
      <ImageCard onClick={() => _handleRedirect('Volunteer & Travel')}>
          <TextContainer>
            <ImageTextTop className="AnimateTop font-lexend" >Volunteer & Travel</ImageTextTop>
            <ImageTextBottom className="AnimateBottom font-nunito">EXPLORE</ImageTextBottom>
          </TextContainer>
          <ImageFade >
          <LazyImageLoader fit="cover" dimensions={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} dimensionsMobile={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} url="media/website/Volunteering.jpg"/> 
          </ImageFade>
        </ImageCard>
      </Card>
      <Card>
      <ImageCard onClick={() => _handleRedirect('Travel & Learn')}>
          <TextContainer>
            <ImageTextTop className="AnimateTop font-lexend">Travel & Learn</ImageTextTop>
            <ImageTextBottom className="AnimateBottom font-nunito">EXPLORE</ImageTextBottom>
          </TextContainer>
          <ImageFade >
          <LazyImageLoader  fit="cover" dimensions={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} dimensionsMobile={{width: Math.round(props.width/2), height: Math.round(props.height/2)}} url="media/website/yoga ose-1.jpg"/>
          </ImageFade>
        </ImageCard>
    </Card> 
    {/* {window.innerWidth > 768 ?
    <PersonaliseContainer>
        <PersonaliseBox className="center-div font-lexend">Personalise</PersonaliseBox>
         <div>
            <LazyImageLoader  fit="cover" dimensions={{width: 1600, height: 700}} dimensionsMobile={{width: props.width, height: props.height}} url="media/ruby/cycletour.jpg"/>
        </div>
    </PersonaliseContainer>
    : null}
     */}
    </GridContainer>
    </Container>
  );
}

export default ExperientialTravelStyle;