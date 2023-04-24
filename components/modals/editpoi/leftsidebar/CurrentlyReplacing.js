import React from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFontAwesomeLogoFull} from '@fortawesome/free-solid-svg-icons';
import media from '../../../media';
import cross from '../../../../public/assets/icons/navigation/close.svg';
import {BiTimeFive} from 'react-icons/bi'
const Container  = styled.div`
bottom: 0;
@media screen and (min-width: 768px) {
    margin: 0 0.5rem;
}
`;
const TextContainer = styled.div`
  margin: 0 -1rem;
  
  @media screen and (min-width: 768px) {
    margin: 0;
}
`;
const HelperText = styled.p`
    color: black;
    font-size: 0.75rem;
    margin: 0 0.5rem 0.5rem 0.5rem;
    display: block;
    padding: 0.75rem 0rem;
    line-height: 1;
    text-align: center;
    background-color: #f7e700;

    @media screen and (min-width: 768px) {
        text-align: left;
        background-color: white;
        margin: 0.5rem 0 0 0;
        padding: 0;
    }
    
`;
const Name  = styled.p`
    font-weight: 700;
    font-size: 1.75rem;
    display: block;
    margin:  0;
    text-align: center;
    @media screen and (min-width: 768px) {
        text-align: left;
    }
    

`;
 
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

`;
const StyledTimeIcon = styled(BiTimeFive)`
@media screen and (min-width: 768px) {
font-size: 0.9rem;
}

`;
const IconContainer = styled.div`
padding: 1rem;
@media screen and (min-width: 768px) {
    padding: 0;
}
`;
const IconText  = styled.p`
margin: 0;
@media screen and (min-width: 768px) {
    font-weight: 300;
    font-size: 0.75rem;
}
`;
const CurrentlyReplacing = (props) =>{
    let isPageWide = media('(min-width: 768px)')
     return(
        <Container>
            <TextContainer>
                <div>
                <HelperText className="font-nunito">CURRENTLY REPLACING</HelperText>
                <Name className="font-lexend" >
                    {props.replacing}
                 </Name>
                
                </div>
            </TextContainer>
            {/* <GridContainer>
                <IconContainer className={!isPageWide ? 'center-div' : ''}>
                    <StyledTimeIcon></StyledTimeIcon>
                    <IconText className='font-lexend' style={{margin: '0'}}>2 hours</IconText>
                </IconContainer>
                <IconContainer className={!isPageWide ? 'center-div' : ''}>
                    <StyledTimeIcon></StyledTimeIcon>
                    <IconText className='font-lexend' style={{margin: '0'}}>2 hours</IconText>

                </IconContainer>

            </GridContainer> */}
        </Container>
    );
}

export default CurrentlyReplacing;