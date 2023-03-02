import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarker, faCalendar, faStarHalf, faMountain} from '@fortawesome/free-solid-svg-icons';
import Gallery5 from './Gallery5';
import Gallery3 from './Gallery3';
import Gallery2 from './Gallery2';
import ImageLoader from '../../../components/ImageLoader';
import media from '../../../components/media';
const Wrapper = styled.div`
  height: max-content;
  color: black;
  padding-top: 10vh;
  position: sticky;
  background-color: wihte;
  @media screen and (min-width: 768px) {

  }
`;
const IconListContainer = styled.div`

  height: max-content;
  width: 90vw;
  margin: auto;
  padding: 1rem 0;
  @media screen and (min-width: 768px) {
    width: 77vw;
     padding: 0;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    height: max-content;
      width: 95vw;
  }
`;
const DetailsContainer = styled.div`
margin-top: 2.5vh;
@media screen and (min-width: 768px) {
  width: 90%;
  margin: auto;
  height: 100%;
  margin-top: 0;
}
`;
const Rating= styled.p`
  margin: 0;
  text-align: center;
  font-size: 2vh;
  margin: 2vh auto;
`;
const ExperienceName = styled.h1`
  font-size: ${(props) => props.theme.fontsizes.desktop.headings.four};
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 7.5vh;
    margin: 5vh 0 2.5vh 0;

  }
`;
const Duration = styled.p`
font-weight: 300;
  text-align: center;
  margin-bottom: 3vh;
  font-size: 1.25rem;
`;
const Heading = styled.h1`
 
`;
 
 
 
const BlackContainer = (props) => {

  let isPageWide = media('(min-width: 768px)')

    if(props.images){ if(props.images.length)
   return (
    <>

      <Wrapper>
  
        
       {props.images.length > 4 ? <Gallery5 setGalleryOpen={null} images={props.images} title={props.title}></Gallery5> :  <div style={{margin: isPageWide ? '5vh auto 0 auto' : 'auto', borderRadius: '5px', width: isPageWide ? '65vw' : '95vw',   height: isPageWide ?  '28.43vw' : '95vw', backgroundColor: "#e4e4e4"}}><ImageLoader
          width="65vw"
           url={props.images[0]}
          borderRadius='0.5rem'
          height='100%'
          heighttab="100%"
          dimensions={{width: 1600, height: 700}}
          dimensionsMobile={{width: 1200, height: 1200}}
          fit="cover"
          widthmobile="95vw"
        /></div> }
       {/* {props.images.length === 3 || props.images.length === 4 ? <Gallery3 setGalleryOpen={null} images={props.images} ></Gallery3> : null} */}
       {/* {props.images.length === 2 ? <Gallery2 setGalleryOpen={null} images={props.images} ></Gallery2> : null} */}
        {/* {
          props.images.length === 1 ? 
          <div style={{margin: isPageWide ? '5vh auto 0 auto' : 'auto', borderRadius: '5px', width: isPageWide ? '65vw' : '95vw',   height: isPageWide ?  '28.43vw' : '95vw', backgroundColor: "#e4e4e4"}}><ImageLoader
          width="65vw"
           url={props.images[0]}
          borderRadius='0.5rem'
          height='100%'
          heighttab="100%"
          dimensions={{width: 1600, height: 700}}
          dimensionsMobile={{width: 1200, height: 1200}}
          fit="cover"
          widthmobile="95vw"
        /></div> : null
        } */}
        <IconListContainer>
        <DetailsContainer>
            <ExperienceName className='font-opensans' style={{fontSize: props.title.length > 25 ? '2rem' : '3rem'}}>{props.title}</ExperienceName>
            <Duration className="font-opensans">{props.duration}</Duration>
            
            <div></div>
      
          </DetailsContainer> 
      </IconListContainer>
      {/* <Heading className="font-opensans">{props.title}</Heading> */}

      </Wrapper>
      
    </>
  );
  else return <div></div>
      }
      else return <div></div>

};

export default React.memo(BlackContainer);
