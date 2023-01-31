import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from './Flickity/Index';
import { useRouter } from 'next/router';
 
const Card = styled.div`
      padding: 2rem 2rem;
    @media screen and (min-width: 768px){
        min-height: 40vh;
     }
`;

const CardHeading = styled.p`
    font-size: 1rem;
    font-weight: 700;
    margin : 0.5rem 0.6rem 0rem 0.6rem;
 `;
const CardSubHeading = styled.p`
font-size: 0.85rem;
font-weight: 400;
margin : 0 0 0.5rem 0;
`;
const CardListItem = styled.p`
    font-size: 0.9rem;
    font-weight: 100;
    
    margin : 0 0.6rem 1rem 0.6rem;
    line-height: 1.5;
 `;
 const GridContainer = styled.div`
     display: grid;
     grid-template-columns: 1fr 1fr; 
     grid-gap: 1rem;
 `;
 const ButtonContainer = styled.div`
      &:hover{
        background-color: black;
     }
 `;
const CardContainer = (props) => {
    const router = useRouter();
    return (

        
            <Card className='border center-v text-cener'>
                <ImageLoader borderRadius="50%" width="60%" widthMobile="40%"  url={props.image} dimensionsMobile={{width: 600, height: 600}} dimensions={{width: 900, height: 900}}></ImageLoader>
                <CardHeading className='font-opensans text-center'>{props.heading}</CardHeading>
                <CardSubHeading className='font-opensans text-center'>{props.duration + " | " + props.destination}</CardSubHeading>
                <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft>
                <CardListItem className='' ><em>{props.text}</em></CardListItem>
                <GridContainer>
                        <ButtonContainer className='border center-div' style={{borderRadius: '10px'}} >
                            <Button fontWeight="600" fontSize="0.85rem" width="100%" onclick={() => router.push('/itinerary/'+props.id)} borderWidth="0" borderRadius="2rem">View Plan</Button>
                        </ButtonContainer>
                        <ButtonContainer className='border center-div' style={{borderRadius: '10px'}}>
                        <Button  fontWeight="600" fontSize="0.85rem" borderWidth="0" width="100%" borderRadius="10px" bgColor="#f7e700" onclick={() => console.log('')}>Start Planning</Button>
                        </ButtonContainer>
                </GridContainer>
            </Card>
        
    );
}

export default CardContainer;