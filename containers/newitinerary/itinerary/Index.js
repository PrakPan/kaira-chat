import styled from 'styled-components';
import { useState, useEffect } from 'react';
import DayContainer from './DayContainer';

   const Container = styled.div`
 
    @media screen and (min-width: 768px){
 
    }
`;
 
const CitiesContainer = styled.div`
    width: calc(100vw-32px);
    overflow: hidden;
    display: grid;
    grid-template-columns: max-content max-content max-content;
    grid-gap: 0.75rem;
    height: max-content;
    position: sticky;
    top: 15vw;
    z-index: 10;
    background-color: white;
`;
const City = styled.div`
    border-radius: 8px;
    padding: 0.5rem;
`;


const Itinerary = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container
     
        className='font-poppins'>
                <CitiesContainer>
                    {  props.city_slabs ?  props.city_slabs.length ?
                        props.city_slabs.map( (city, index) => {

                            return(
                                <City className='border-thin' style={{backgroundColor: !index ?  'black' : 'white', color: !index ? 'white' : 'black'}}>{city.city_name +( city.duration ?  " ("+city.duration+"N)" : '')}</City> 
                            )
                        })
                        : null : null
                     
                    }
        {/* <City className='border-thin' style={{backgroundColor: 'black', color: 'white'}}>Jaipur (2N)</City>
        <City className='border-thin' >Jodhpur (2N)</City>
        <City className='border-thin'>Jaisalmer (2N)</City> */}

        </CitiesContainer>    
        {
            props.day_slabs ? props.day_slabs.map((day, index) => {
                return (
                    <DayContainer data={day}></DayContainer>

                )
            })
            : null
    
        }
            

           
         </Container>
        
    );
 }

export default Itinerary;