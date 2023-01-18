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
            duration: "6 Days",
            image: "media/cities/163005607325070333480834960938.jpeg",
            destination: "Andaman", 
            text: "We've planned a couple vacations now through The Tarzan Way and our honeymoon experience in Andaman was the best. The on-ground team was really helpful and made our honeymoon to Andaman extra special."
        },
        {
            heading: "Payal Saluja",
            duration: "6 Days",
            destination: "Andaman", 
            image: "media/cities/163005607325070333480834960938.jpeg",

            text: "We had the challenge to travel to Andaman with my old-aged parents but Tarzan Way made sure that the trip go smoothly and their itinerary and support were just marvelous. Would definitely recommend them."
        },
        {
            heading: 'Simran Agrawal',
            duration: "6 Days",
            destination: "Andaman", 
            image: "media/cities/163005607325070333480834960938.jpeg",

            text: 'I used to work at The Tarzan Way and knew that they made amazing itineraries for their plan but experiencing it was a different thing. They managed everything very well and their software and support was really unique.'
        },
       
    ]
    if(!isPageWide)
    return (

        <Container className='font-opensans'>
            <Flickity cards={[<Card heading={data[0].heading} text={data[0].text}></Card>, <Card heading={data[0].heading} text={data[0].text}></Card>, <Card heading={data[0].heading} text={data[0].text}></Card>]}></Flickity>
        </Container>
    );
    else return(
        <Container>
            <Card duration={data[0].duration} destination={data[0].destination}  heading={data[0].heading} text={data[0].text} image={data[0].image}>  </Card>
            <Card  duration={data[1].duration} destination={data[1].destination} heading={data[1].heading} text={data[1].text}  image={data[1].image}> </Card>
            <Card   duration={data[2].duration} destination={data[2].destination} heading={data[2].heading} text={data[2].text}  image={data[2].image}> </Card>
 
        </Container>
    );
}

export default FullImgContent;