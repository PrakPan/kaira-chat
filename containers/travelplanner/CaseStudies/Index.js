import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from '../../../components/FlickityCarousel';
import media from '../../../components/media';
import Card from './Card';
import TRAVELERS from '../../../public/content/travelers';
const Container = styled.div`
      padding: 0 0.5rem ;
@media screen and (min-width: 768px){
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
      padding: 0;
    }
`;

 
const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');

    
   
    if(false)
    return (

        <Container className='font-opensans'> 
            <Flickity cards={[<Card review id={TRAVELERS[0].id} duration={TRAVELERS[0].duration} destination={TRAVELERS[0].destination}   heading={TRAVELERS[0].name} text={TRAVELERS[0].review}></Card>, <Card review duration={TRAVELERS[1].duration} destination={TRAVELERS[1].destination}  id={TRAVELERS[1].id} heading={TRAVELERS[1].name} text={TRAVELERS[1].review}></Card>, <Card review id={TRAVELERS[2].id} heading={TRAVELERS[2].name} text={TRAVELERS[2].review} duration={TRAVELERS[2].duration} destination={TRAVELERS[2].destination} ></Card>]}></Flickity>
        </Container>
    );
    else return(
        <Container>
            <Card review id={TRAVELERS[0].id} duration={TRAVELERS[0].duration} destination={TRAVELERS[0].destination}  heading={TRAVELERS[0].name} text={TRAVELERS[0].review} image={TRAVELERS[0].image}>  </Card>
            <Card review id={TRAVELERS[1].id}  duration={TRAVELERS[1].duration} destination={TRAVELERS[1].destination} heading={TRAVELERS[1].name} text={TRAVELERS[1].review}  image={TRAVELERS[1].image}> </Card>
            <Card review id={TRAVELERS[2].id}  duration={TRAVELERS[2].duration} destination={TRAVELERS[2].destination} heading={TRAVELERS[2].name} text={TRAVELERS[2].review}  image={TRAVELERS[2].image}> </Card>
 
        </Container>
    );
}

export default FullImgContent;