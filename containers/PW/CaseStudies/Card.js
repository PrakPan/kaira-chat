import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from './Flickity/Index';
 
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

const CardListItem = styled.p`
    font-size: 0.9rem;
    font-weight: 300;
    margin : 0 0.6rem 1rem 0.6rem;
    line-height: 1.5;
 `;
const CardContainer = (props) => {
    return (

        
            <Card className='border center-v text-cener'>
                <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft>
                <CardListItem >{props.text}</CardListItem>
                <CardHeading className='font-opensans'>{props.heading}</CardHeading>

            </Card>
        
    );
}

export default CardContainer;