import React from 'react';
import styled from 'styled-components';
import Button from '../../components/ui/button/Index';
import media from '../../components/media';
import {BsWhatsapp} from 'react-icons/bs';
import urls from '../../services/urls';
import Enquiry from './newenquiry/Index';

const Container = styled.div`
    text-align: center;
 color:white;
@media screen and (min-width: 768px){
    padding: 0 7.5vh;
    text-align: left;
    display: grid;
    grid-template-columns: 2fr 1fr;
    }
`;
const Heading = styled.h1`
color: white;

width: 99%;
font-weight: 700;
margin-bottom: 1rem;
font-size: 2rem;
@media screen and (min-width: 768px){
  font-size: 4rem;
  font-weight: 700;

}
`;
const SubText = styled.h3`
color: white;
    font-weight: 100;
    width: 99%;
    font-size: 1.2rem;
     @media screen and (min-width: 768px){
        font-size: 2rem;
     }

`;

const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');

    return (

        <Container className='font-opensans'>
           <div style={{padding: '5vh 0 0 0'}}>
            <Heading>Rajasthan Travel Planner</Heading>
            <SubText>Personalize a Completely Unique Plan Now!</SubText>
           <SubText>Get Benefit of Exclusive Festive Offers</SubText> 

            <Button onclick={()=> window.location.href=urls.WHATSAPP+"?text=Hey Team! I'm looking to book a travel plan to Rajasthan. Can you help me personalize my itinerary?"} onclickparams={null}  fontSizeDesktop="1.25rem" link="/" margin={"2.5rem 0 0 0"} marginMobile="1.5rem auto" bgColor="#f7e700" borderRadius="10px" lineHeight="1"  hoverBgColor="black" hoverColor="white" borderWidth="0px" padding="0.75rem 1.5rem">
                <BsWhatsapp style={{fontSize: '1.5rem', margin: '-0.125rem 0.25rem 0 0'}}> </BsWhatsapp>
                WhatsApp Now!</Button>
                </div>
                <div className='center-div hidden-mobile'
                >
                    <Enquiry>

</Enquiry>
                </div>
        </Container>
    );
}

export default FullImgContent;