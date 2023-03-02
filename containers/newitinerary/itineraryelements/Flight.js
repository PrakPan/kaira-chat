import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {AiFillCar} from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import {MdOutlineFlightTakeoff} from 'react-icons/md';
   const Container = styled.div`
   padding: 0.5rem;
   
    @media screen and (min-width: 768px){
 
    }
`;
 
 const SectionOneText = styled.span`
    
 `;
 const GridContainer = styled.div`
    display: grid;
    margin-top: 1rem;
    grid-template-columns: 1fr 5fr;
    grid-column-gap: 0.5rem;
 `;
 const Text = styled.p`
 
 overflow: hidden;
 line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
font-size: 14px;
 
 `
 const Heading = styled.p`
    margin-bottom: 0.35rem;
    margin-top: 1rem;
    font-weight: 500;
    line-height: 1;
 `;
 const Line= styled.div`
 border-style: none none solid none;
   border-color: #e4e4e4;
   border-width: 1px;
 `;
const ItineraryFlightElement = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container
     
        className='font-poppins'>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <SectionOneText>{props.time}</SectionOneText>
                 
                    <div style={{flexGrow: '1', justifyContent: 'flex-end', display: 'flex'}}>
                         
                        <Button
                        borderRadius="8px"
                        fontWeight="700"
                        fontSize="12px"
                        borderWidth="1.5px"
                        padding="0.5rem 0.5rem"
                        onclick={() => console.log('')}
                        >
                        Flights from ₹ 3,456
                        </Button>
                        </div>
                 
            </div>
            <Heading>{props.heading}</Heading>

            <GridContainer>
                <div className='text-center'>
                <MdOutlineFlightTakeoff style={{fontSize: '2.5rem', textAlign: 'center'}}></MdOutlineFlightTakeoff>

                </div>
             
                <div>
                <div style={{marginBottom: '0.25rem'}}>
                    Delhi - Goa 
                </div>
                <div style={{marginBottom: '0.5rem'}}>
                    Duration: 1 h 5 min non-stop 
                </div>
                </div>
            </GridContainer>
            <Text>
                {props.text}
                </Text>

<Line></Line>
         </Container>
        
    );
 }

export default ItineraryFlightElement;