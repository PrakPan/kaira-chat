import React  from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn } from 'react-animations'
 
const fadeInAnimation = keyframes`${fadeIn}`;
 const Container = styled.div`
    width: 100%;
    margin: 1rem auto;
    animation: 1s ${fadeInAnimation};

     @media screen and (min-width: 768px){
        padding-bottom: 0;
        margin: auto;
    }
`;


const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 1rem;
width: 100%;
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
 }
`;
 const OptionContainer = styled.div`
    padding: 0.5rem;
    text-align: center;
    border-radius: 10px;
    font-size: 0.85rem;
    &:hover{
        background-color: rgba(247,231,0,0.3);
  color: black;
    }
 `;
 
const GroupType = (props) => {

     
     return(
        <Container>
            <GridContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'>
                    Adventure & Outdoor
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'>
                    Nature & Retreat 
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'  onClick={() => props.setShowPax(true)}>
                     Heritage & Culture
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'>
                    Adventure & Outdoor
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'>
                    Nature & Retreat 
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans hover-pointer'  onClick={() => props.setShowPax(true)}>
                     Heritage & Culture
                </OptionContainer>
            </GridContainer>
        </Container>
    );
   
}

export default GroupType;