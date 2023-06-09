import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from './Flickity/Index';
 
const Card = styled.div`
      padding: 1rem 2rem;
    @media screen and (min-width: 768px){
        min-height: 40vh;
     }
`;

const CardHeading = styled.p`
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
`;

const CardListItem = styled.p`
    font-size: 0.9rem;
    font-weight: 300;
    margin-bottom: 1rem;
    line-height: 1.5;
`;
const CardContainer = (props) => {
    return (

        
            <Card className='border center-v text-cener'>
                <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-1.25rem'}}></ImQuotesLeft>
                <CardListItem >{props.text}</CardListItem>
                <CardHeading className='font-lexend'>{props.heading}</CardHeading>

            </Card>
        
    );
}

export default CardContainer;