import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from '../../../components/FlickityCarousel';
import media from '../../../components/media';
import Card from './Card';
const Container = styled.div`
      
@media screen and (min-width: 768px){
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 2rem;
    }
`;

 
const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');

    const data = [
        {
            heading: "Pranshu Aggarwal",
            text: "We've planned a couple vacations now through The Tarzan Way and our honeymoon experience in Andaman was the best. The on-ground team was really helpful and made our honeymoon to Andaman extra special."
        },
        {
            heading: "Payal Saluja",
            text: "We had the challenge to travel to Andaman with my old-aged parents but Tarzan Way made sure that the trip go smoothly and their itinerary and support were just marvelous. Would definitely recommend them."
        },
        {
            heading: 'Simran Agrawal',
            text: 'I used to work at The Tarzan Way and knew that they made amazing itineraries for their plan but experiencing it was a different thing. They managed everything very well and their software and support was really unique.'
        },
       
    ]
    if(!isPageWide)
    return (

        <Container className='font-lexend'>
            <Flickity cards={[<Card heading={data[0].heading} text={data[0].text}></Card>, <Card heading={data[1].heading} text={data[1].text}></Card>, <Card heading={data[2].heading} text={data[2].text}></Card>]}></Flickity>
        </Container>
    );
    else return(
        <Container>
            <Card   heading={data[0].heading} text={data[0].text}> </Card>
            <Card   heading={data[1].heading} text={data[1].text}> </Card>
            <Card   heading={data[2].heading} text={data[2].text}> </Card>
 
        </Container>
    );
}

export default FullImgContent;