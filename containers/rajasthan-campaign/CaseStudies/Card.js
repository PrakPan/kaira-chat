import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import {ImQuotesLeft} from 'react-icons/im';
import Flickity from './Flickity/Index';
import { useRouter } from 'next/router';
import Button from '../../../components/ui/button/Index';
 import * as ga from '../../../services/ga/Index';
 import media from '../../../components/media';

const Card = styled.div`
      padding: 2rem 2rem;
      min-height: 40vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: 768px){
        min-height: 40vh;
        &:hover{
            cursor: pointer;
            background-color: rgba(247,231,0,0.1);
         }
     }
     &:hover{
        cursor: pointer;
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
    const router = useRouter();
    let isPageWide = media('(min-width: 768px)');

    const _handleItineraryRedirect = () => {
        router.push('/itinerary/'+props.id)
      }
      const _handleItineraryClick = () => {
        // setDesktopBannerLoading(true);
        setTimeout(_handleItineraryRedirect, 1000);
      
        ga.callback_event({
          action: 'TT-Desktopbanner',
          
          callback: _handleItineraryRedirect,
        })
      
      }
    return (

        
            <Card className='border center-v text-cener' onClick={isPageWide ? _handleItineraryRedirect : null} >
                <ImQuotesLeft style={{fontSize: '1.25rem', marginLeft: '-0rem'}}></ImQuotesLeft>
                <CardListItem >{props.text}</CardListItem>
                <CardHeading className='font-opensans'>{props.heading}</CardHeading>
                <div className='hidden-desktop'><Button onclick={_handleItineraryClick} margin="1rem 0 0 0.5rem" fontSize="0.85rem" padding="0.25rem 1rem" borderRadius="2rem" borderWidth="0px" bgColor="#f7e700" fontSizeDesktop="0.85rem">View Plan</Button></div>
            </Card>
        
    );
}

export default CardContainer;