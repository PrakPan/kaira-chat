import React, {useState, useEffect} from 'react';
import { Carousel } from 'react-bootstrap';
import ImageLoader from '../../../../../ImageLoader';
import styled from 'styled-components';
import media from '../../../../../media';
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
                <StyledCarouselItem  className='center-div'   >
                <ImageLoader borderRadius="50%" url={props.images[i] ? props.images[i].image : 'media/webiste/grey.jpg'}   width='12.5vw' widthmobile="100%" height="auto"   dimensions={{width: 800, height: 800}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>
                <Carousel.Caption style={{bottom: '0', left: '0',  padding: '0', width: '100%'}}>
               </Carousel.Caption>
            </StyledCarouselItem>
            )
        }
     
        setImagesJSX(imagesjsx)
      },[props.images])
      let isPageWide = media('(min-width: 768px)')

      return(
        <div  className='center-div' interval={ props.hover ?  1000 : null } wrap={false} slide={false} fade activeIndex={index} onSelect={handleSelect}>
            <ImageLoader borderRadius="50%" url={props.images.length ? props.images[0].image : 'media/website/grey.png'}   width='12.5vw' widthmobile="25vw" height={isPageWide ? "12.5vw" : "25vw"}   dimensions={{width: 800, height: 800}} dimensionsMobile={{width: 600, height: 600}}></ImageLoader>

      </div>
        );
  } 


export default FlickityCarousel; 