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
            heading: "Divya Rajput",
            text: "We planned a new years family trip to Jodhpur, Jaisalmer, and Bikaner and The Tarzan Way planned a perfect package."
        },
        {
            heading: "Harshitha Gangappa",
            text: "With timely suggestions, I was able to cover all the places luxurious stay at the Lalit Jaipur"
        },
        {
            heading: 'Rotaract',
            text: 'Great support and on-ground coordination for our group of 60 travelers by The Tarzan Way.'
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
            <Card   heading={data[0].heading} text={data[0].text}> </Card>
            <Card   heading={data[1].heading} text={data[1].text}> </Card>
            <Card   heading={data[2].heading} text={data[2].text}> </Card>
 
        </Container>
    );
}

export default FullImgContent;