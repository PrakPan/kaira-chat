import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarker, faCalendar, faStarHalf, faMountain} from '@fortawesome/free-solid-svg-icons';

import Gallery from './Gallery'
import usePageLoaded from '../../../components/custom hooks/usePageLoaded';
const Wrapper = styled.div`
  height: max-content;
  color: black;
  padding-top: 12vh;
  position: sticky;

  background-color: hsl(0,0%,97%);
  @media screen and (min-width: 768px) {

    min-height: 100vh;
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

`;

const ImageOne = styled.div`
  grid-area: one;
`;

const ImageTwoPointOne = styled.div`
  grid-area: two;
  @media screen and (min-width: 768px) {
    grid-area: twopointone;

  }
`;
const ImageTwoPointTwo = styled.div`

@media screen and (min-width: 768px) {
  grid-area: twopointtwo;
}
`;

const ImageThree = styled.div`
  grid-area: three;

`;

const ImageFour = styled.div`
  grid-area: four;

`;

const ImageFive = styled.div`
  grid-area: five;
`;

const Imageix = styled.div`
  grid-area: six;
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
const DescriptionText = styled.p`
  line-height: 1.75;
  font-weight: 300;
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

const WhatsIncluded = styled.p`
  font-weight: 600;


`;
const CheckAvailability = styled.div`
  position:  absolute;
  bottom: 0.5rem;
  text-align: center;
  background-color: #F7e700;
  width: 90%;
  left: 5%;
  margin: auto;
  border-radius: 2rem;
  padding: 0.5rem;
  font-weight: 600;
  &:hover{
    cursor: pointer;
    background-color: black;
    color: #F7e700;
  }
`;
const TagContainer = styled.div`
  text-align: center;
`;

const IconContainer = styled.div`
 

`;

const Icon = styled.img`
  height: 2.5vh;
  width: 2.5vh;

`;

const IconText = styled.span`
  margin-left: 0.5rem;
  font-size: 2vh;
`;

const BlackContainer = (props) => {
  const isPageLoaded = usePageLoaded();

  const [escapeState, setEscapeState] = useState(false);

  useEffect(() => {
    //Escape hatch for mobile images, do not remove
    setEscapeState(true)
   }, []);

  const imageClickHandler = () => {
    props.setGalleryOpen(true)
  }
  
  return (
    <>

      <Wrapper>
 
      {/* <IconListContainer>
        
        <ExperienceName className='font-lexend'>{props.title}</ExperienceName>

      </IconListContainer> */}
        
       <Gallery setGalleryOpen={props.setGalleryOpen} images={props.images} ></Gallery>
        <IconListContainer>
        <DetailsContainer>
            <ExperienceName className='font-lexend' style={{fontSize: props.title.length > 25 ? '2rem' : '3rem'}}>{props.title}</ExperienceName>
            <TagsContainer>
            <TagContainer>
            {isPageLoaded ? <FontAwesomeIcon icon={faMapMarker} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon>: null}
              <p className="font-lexend" style={{margin: "0.5rem"}}>{props.region}</p>
            </TagContainer>
            <TagContainer>
              {isPageLoaded ? <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon>: null}
              <p className="font-lexend" style={{margin: "0.5rem"}}>{!props.duration === 'null Days' ?  '4 Days' : props.duration}</p>
            </TagContainer>            
            <TagContainer>
              {isPageLoaded ? <FontAwesomeIcon icon={faMountain} style={{ fontSize: "2.5vh"}}></FontAwesomeIcon>: null}
              <p className="font-lexend" style={{margin: "0.5rem"}}>{props.filter}</p>
            </TagContainer>
            </TagsContainer>

            <div></div>
      
          </DetailsContainer>  
      </IconListContainer>

      </Wrapper>
      
    </>
  );
  
};

export default React.memo(BlackContainer);
