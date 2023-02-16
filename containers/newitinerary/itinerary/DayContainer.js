import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ItineraryElement from '../itineraryelements/Index';
import ItineraryFlightElement from '../itineraryelements/Flight';
import ItineraryFoodElement from '../itineraryelements/Food';
import ItineraryPoiElement from '../itineraryelements/Poi';

   const Container = styled.div`
 
    @media screen and (min-width: 768px){
 
    }
`;
 
const Date = styled.div`
    width: max-content;
    border-radius: 2rem;
    margin: 1rem auto;
    padding: 0.25rem 1rem ;
    background-color: #f4f4f4;
    font-weight: 300;
`;


const DayContainer = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container
     
        className='font-poppins'>

      
            <Date>Feb 3, 2023</Date>

            <div className='border-thin' style={{borderRadius: '10px'}}>
            <ItineraryFlightElement time="9:00AM"  heading="Depart from Delhi"
                               text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'

               ></ItineraryFlightElement>

               <ItineraryElement time="9:00AM"  heading="Check in to your stay" ></ItineraryElement>
               <ItineraryFoodElement  time="12:00PM"  heading="Food Reccommendation"
                               text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'

               ></ItineraryFoodElement>
                <ItineraryPoiElement time="9:00AM - 12:00PM" image={'media/website/grey.png'}  booking heading="Baapu Bazaar"
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'
                ></ItineraryPoiElement>


            </div>
         </Container>
        
    );
 }

export default DayContainer;