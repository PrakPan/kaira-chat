import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import { useRouter } from 'next/router';
import {AiFillStar} from 'react-icons/ai'
 
const Card = styled.div`
      padding:  0rem;
    @media screen and (min-width: 768px){
        padding: 2rem 0rem;

    }
`;

const CardHeading = styled.p`
    font-size: 0.9rem;
    font-weight: 700;
    margin : 0;
    margin-top : 5px;
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
 const RatingContainer = styled.div`
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
                <div style={{display : 'flex' , flexDirection : 'column' , justifyContent : 'space-between' }}>
                <ImageLoader borderRadius="8px" width="100%" widthMobile="100%"  url={props.image} dimensionsMobile={{width: 600, height: 600}} dimensions={{width: 900, height: 900}}></ImageLoader>
                <CardHeading className='font-lexend'>{props.heading}</CardHeading>
                
                <RatingContainer>
                    <div>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem', marginRight: '0.25rem'}}></AiFillStar>
                    <AiFillStar style={{color: '#FFD201', fontSize: '1.25rem'}}></AiFillStar>

                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                    <CardSubHeading className='font-lexend'>{props.duration + " • " + props.destination}</CardSubHeading>

                    </div>
                </RatingContainer>
                <Button fontWeight="500" borderRadius="6px" onclick={() => router.push('/itinerary/'+props.id)} fontSizeDesktop="12px" borderWidth="1px" width="100%" bgColor="#f7e700">View Details</Button>


                </div>
                <div>

                {/* <CardHeading className='font-lexend'>{props.heading}</CardHeading> */}
                
                

                {/* <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft> */}
                <CardListItem className='font-lexend' >{props.text}</CardListItem>
                </div>
                </GridContainer>
               
            </Card>
        
    );
}

export default CardContainer;