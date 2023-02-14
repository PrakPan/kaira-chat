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
     }
`;

const CardHeading = styled.p`
    font-size: 0.8rem;
    font-weight: 700;
    margin : 0;
 `;
const CardSubHeading = styled.p`
font-size: 0.8rem;
font-weight: 400;
margin : 0 0 0.5rem 0 ;
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
     grid-template-columns: 1fr 2fr; 
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

        
            <Card className=''>
                <GridContainer>
                <div>
                <ImageLoader borderRadius="8px" width="100%" widthMobile="100%"  url={props.image} dimensionsMobile={{width: 600, height: 600}} dimensions={{width: 900, height: 900}}></ImageLoader>
                <Button borderRadius="6px" onclick={() => console.log('')} fontSizeDesktop="12px" borderWidth="1px" width="100%" bgColor="#f7e700" margin="0.5rem 0">View Details</Button>

                </div>
                <div>
                <CardHeading className='font-opensans'>{props.heading}</CardHeading>
                <CardSubHeading className='font-opensans'>{props.duration + " • " + props.destination}</CardSubHeading>
                {/* <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft> */}
                <CardListItem className='' >{props.text}</CardListItem>
                </div>
                </GridContainer>
               
            </Card>
        
    );
}

export default CardContainer;