import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarker, faCalendar, faStarHalf, faMountain} from '@fortawesome/free-solid-svg-icons';
import Gallery from './Gallery';

const Wrapper = styled.div`
  height: max-content;
  color: black;
  padding-top: 10vh;
  position: sticky;
  background-color: wihte;
  @media screen and (min-width: 768px) {

    min-height: 100vh;
  }
`;
const IconListContainer = styled.div`

  height: max-content;
  width: 90vw;
  margin: auto;
  padding: 1rem 0;
  @media screen and (min-width: 768px) {
    width: 77vw;
    height: 30vh;
    overflow: hidden;
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
    margin: 0;

  }
`;
 
const TagsContainer  = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  font-weight: 100;
  margin: 2rem auto 2rem auto;
  font-size: 2vh;
`;

 
const TagContainer = styled.div`
  text-align: center;
`;

 
 
 
const BlackContainer = (props) => {



   
  // if(props.experienceLoaded)
  return (
    <>

      <Wrapper>
 
      {/* <IconListContainer>
        
        <ExperienceName className='font-opensans'>{props.title}</ExperienceName>

      </IconListContainer> */}
        
       <Gallery setGalleryOpen={props.setGalleryOpen} images={props.images} ></Gallery>
        <IconListContainer>
        <DetailsContainer>
            <ExperienceName className='font-opensans' style={{fontSize: props.title.length > 25 ? '2rem' : '3rem'}}>{props.title}</ExperienceName>
            <Rating className="font-nunito">
             {typeof window!=='undefined' ? <FontAwesomeIcon icon={faStar} style={{color: "#F7e700", fontSize: "2vh"}}></FontAwesomeIcon>: null}
             {typeof window!=='undefined' ? <FontAwesomeIcon icon={faStar} style={{color: "#F7e700", fontSize: "2vh"}}></FontAwesomeIcon>: null}
             {typeof window!=='undefined' ? <FontAwesomeIcon icon={faStar} style={{color: "#F7e700", fontSize: "2vh"}}></FontAwesomeIcon>: null}
             {typeof window!=='undefined' ?<FontAwesomeIcon icon={faStar} style={{color: "#F7e700", fontSize: "2vh"}}></FontAwesomeIcon>: null}
             {typeof window!=='undefined' ?<FontAwesomeIcon icon={props.rating > 4.5 ? faStar : faStarHalf} style={{color: "#F7e700", fontSize: "2vh"}}></FontAwesomeIcon>: null}
          {" "+props.rating}</Rating>
            <TagsContainer>
            <TagContainer>
              {typeof window!=='undefined' ? <FontAwesomeIcon icon={faMapMarker} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon> : null}
              <p className="font-nunito" style={{margin: "0.5rem"}}>{props.region}</p>
            </TagContainer>
            <TagContainer>
            {typeof window!=='undefined' ? <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon>: null}
              <p className="font-nunito" style={{margin: "0.5rem"}}>{props.duration}</p>
            </TagContainer>            
            <TagContainer>
                {typeof window!=='undefined' ? <FontAwesomeIcon icon={faMountain} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon>: null}
              <p className="font-nunito" style={{margin: "0.5rem"}}>{props.filter}</p>
            </TagContainer>
            </TagsContainer>

            <div></div>
      
          </DetailsContainer> 
      </IconListContainer>

      </Wrapper>
      
    </>
  );
  // else return <div></div>
};

export default React.memo(BlackContainer);
