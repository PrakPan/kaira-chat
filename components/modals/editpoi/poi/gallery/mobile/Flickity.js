import React, {useState, useEffect} from 'react';
import Flickity from 'react-flickity-component';
import { Carousel } from 'react-bootstrap';
import ImageLoader from '../../../../../ImageLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
const RatingContainer = styled.div`
   
    background-color: green;
    padding: 0.5rem;
    font-size: 0.75rem;
    color: white;
    border-radius: 0 0;
    width: max-content;
    border-radius: 0 0px  0 0px; 

`;
const ReviewCount = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    color: black;
    font-size: 0.75rem;
    background-color: white;
    opacity: 0.7;
    border-radius: 0px;
    padding: 0.5rem;

`;
const StyledCarouselItem = styled(Carousel.Item)`
    min-height: 50vw;
    @media screen and (min-width: 768px) {
        min-height: 15vw;
        min-width: 15vw;
    }
`;
const FlickityCarousel = (props) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    const [imagesJSX, setImagesJSX] = useState([]);
    const [hover, setHover] = useState(false);
    const _onMouseEnter = () => {
         setHover(true);
    }
    let color="green";
    if(props.review_score < 8 && props.review_score > 6.5) color="orange";
    else if(props.review_score < 6.5) color="red";
    useEffect(() => {
        let imagesjsx = [];
        for(var i = 0 ; i<props.images.length; i++){
            imagesjsx.push(
                <StyledCarouselItem     >
                <ImageLoader borderRadius="0px" url={props.images[i].image }   width='15vw' widthmobile="100%" height="auto"   dimensions={{width: 800, height: 800}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>
                <Carousel.Caption style={{bottom: '0', left: '0',  padding: '0', width: '100%'}}>
                    <RatingContainer className='font-opensans' style={{backgroundColor: color}}>
                        <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                            {props.review_score+"/10"} 
                    </RatingContainer> 
                    <ReviewCount className='font-opensans'>{props.review_count + " Reviews"}</ReviewCount>
               </Carousel.Caption>
               {/* <RatingContainer className='font-opensans'>
                        <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                            8.5/10 
                    </RatingContainer> 
                    <ReviewCount className='font-opensans'>326 Reviews</ReviewCount> */}
            </StyledCarouselItem>
            )
        }
        setImagesJSX(imagesjsx)
      },[props.images])

      return(
        <Carousel   interval={ props.hover ?  1000 : null } wrap={false} slide={false} fade activeIndex={index} onSelect={handleSelect}>
            {imagesJSX}
      </Carousel>
        );
  } 


export default FlickityCarousel; 