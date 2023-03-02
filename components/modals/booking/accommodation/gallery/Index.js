import React, {useRef, useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faStar} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../../../../ImageLoader';
import MobileGallery from './mobile/Index';
const Container = styled.div`

    @media screen and (min-width: 768px) {
        position: relative;

    }
`;

const LeftCrossContainer  = styled.div`
    position: absolute;
    left: 0;
    background-color: hsl(0,0%,80%);
    opacity: 0.7;
    z-index: 1000;
    width: 2.5vw;
    height: 2.5vw;
    &:hover{
        cursor: pointer;
    }
`;
const RightCrossContainer  = styled.div`
    position: absolute;
    right: 0;
    background-color: hsl(0,0%,80%);
    opacity: 0.7;
    z-index: 1000;
    width: 2.5vw;
    height: 2.5vw;
    &:hover{
        cursor: pointer;
    }
`;

const RatingContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: green;
    padding: 0.25rem;
    font-size: 0.75rem;
    color: white;
    border-radius: 0 0 0px 5px;

`;
const Gallery = (props) => {
  let isPageWide = media('(min-width: 768px)')
   
  return(
      <Container className=''>
          {/* {isPageWide ? <LeftCrossContainer className='center-div' style={{top: isPageWide ? '6.25vw' : '20vw'}}>
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
          </LeftCrossContainer> : null} */}
        {false ? <ImageLoader borderRadius="50%" url={props.images.length ? props.images[0].image : ''}   width='15vw' widthmobile="100%" height="auto"   dimensions={{width: 1600, height: 1600}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>
        : <MobileGallery review_score={props.review_score} review_count={props.review_count} images={props.images}></MobileGallery>}
        {/* {isPageWide ? <RightCrossContainer className='center-div' style={{top: isPageWide ? '6.25vw' : '20vw'}}>
              <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
          </RightCrossContainer> : null} */}
        {/* {!isPageWide ? <RatingContainer className='font-opensans'>
            <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
            8.5/10 (376)
        </RatingContainer> : null} */}
      </Container> 
  );
  

}
 
export default Gallery;