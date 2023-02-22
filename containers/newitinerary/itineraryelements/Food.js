import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {AiFillCar} from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import {MdOutlineFlightTakeoff} from 'react-icons/md';
import {IoMdRestaurant} from 'react-icons/io';
import FoodItem from './FoodItem';
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
 margin: 0.75rem 0; 
 overflow: hidden;
 line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
font-size: 14px;
 
 `
 const Heading = styled.p`
    margin: 0;
    font-weight: 500;
    line-height: 1;
 `;
 const Line= styled.div`
 border-style: none none solid none;
   border-color: #e4e4e4;
   border-width: 1px;
 `;
const ItineraryFoodElement = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container
     
        className='font-poppins'>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <SectionOneText>{props.time}</SectionOneText>
                 
                  
                 
            </div>

            <GridContainer>
                <div className='text-center'>
                <IoMdRestaurant style={{fontSize: '2rem', textAlign: 'center'}}></IoMdRestaurant>

                </div>
             
                <div style={{display: 'flex', alignItems: 'center'}}>
                <Heading>{props.heading}</Heading>

                </div>
            </GridContainer>
            <Text>
                {props.text}
                </Text>
                {
                    props.food_items ? 
                    props.food_items.map(food => {
                        return (
<FoodItem heading="Lassi" 
image={food.image}
name={food.name}
                text={food.description}
                                ></FoodItem>
                        )
                    })
                    : null
                }
                
                
              

<Line></Line>
         </Container>
        
    );
 }

export default ItineraryFoodElement;