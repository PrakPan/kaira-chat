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
            id: null,
            heading: "Simran",
            text: "Our couple trip to Kashmir was amazingly planned by The Tarzan Way. The best part was their support team that was always in touch with us regarding any problem."
        },
        {
            id: null,
            heading: "Meena",
            text: "We planned a family trip with Tarzan Way and did face a few problems during the experience with the taxi guy but the team was prompt in resolving the issue"
        },
        {   
            id: null,
            heading: 'Lokesh',
            text: 'Our short family plan was planned and booked by Tarzan Way and it was amazing. We actually didn’t have a lot of time to travel but they help in covering most locations.'
        },
       
    ]
   
    if(!isPageWide)
    return (

        <Container className='font-opensans'>
            <Flickity cards={[<Card heading={data[0].heading} id={data[0].id} text={data[0].text}></Card>, <Card id={data[1].id}  heading={data[1].heading} text={data[1].text}></Card>, <Card  id={data[2].id}  heading={data[2].heading} text={data[2].text}></Card>]}></Flickity>
        </Container>
    );
    else return(
        <Container>
            <Card  id={data[0].id}  heading={data[0].heading} text={data[0].text}> </Card>
            <Card  id={data[1].id}  heading={data[1].heading} text={data[1].text}> </Card>
            <Card id={data[2].id}   heading={data[2].heading} text={data[2].text}> </Card>
 
        </Container>
    );
}

export default FullImgContent;