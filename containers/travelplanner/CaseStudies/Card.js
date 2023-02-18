import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from './Flickity/Index';
import { useRouter } from 'next/router';
import {AiFillStar} from 'react-icons/ai'
 
const Card = styled.div`
      padding: 2rem 0rem;
    @media screen and (min-width: 768px){
     }
`;

const CardHeading = styled.p`
    font-size: 0.9rem;
    font-weight: 700;
    margin : 0;
 `;
const CardSubHeading = styled.p`
font-size: 0.9rem;
font-weight: 400;
margin : 0 0 0rem 0 ;
color: rgb(122, 122, 122);

`;
const CardListItem = styled.p`
    font-size: 0.9rem;
    font-weight: 300;
    
    margin : 0  ;
    line-height: 1.5;
 `;
 const GridContainer = styled.div`
     display: grid;
     grid-template-columns: 1fr 1.5fr; 
     grid-gap: 1rem;
 `;
 const ButtonContainer = styled.div`
      &:hover{
        background-color: black;
     }
 `;
 const RatingContainer = styled.div`
 display: flex;
 margin-bottom: 0.75rem;
 @media screen and (min-width: 768px){
    flex-direction: row;
    gap: 0.75rem;
}
 `;
const CardContainer = (props) => {
    const router = useRouter();
    return (

        
            <Card className=''>
                <GridContainer>
                <div>
                <ImageLoader borderRadius="8px" width="100%" widthMobile="100%"  url={props.image} dimensionsMobile={{width: 600, height: 600}} dimensions={{width: 900, height: 900}}></ImageLoader>
                <Button fontWeight="600" borderRadius="6px" onclick={() => router.push('/itinerary/'+props.id)} fontSizeDesktop="12px" borderWidth="1px" width="100%" bgColor="#f7e700" margin="0.5rem 0">View Details</Button>

                </div>
                <div>

                <CardHeading className='font-opensans'>{props.heading}</CardHeading>
                <RatingContainer>
                    <div>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem'}}></AiFillStar>

                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                    <CardSubHeading className='font-opensans'>{props.duration + " • " + props.destination}</CardSubHeading>

                    </div>
                </RatingContainer>
                

                {/* <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft> */}
                <CardListItem className='' >{props.text}</CardListItem>
                </div>
                </GridContainer>
               
            </Card>
        
    );
}

export default CardContainer;