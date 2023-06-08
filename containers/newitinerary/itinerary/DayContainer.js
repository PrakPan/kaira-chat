<<<<<<< HEAD
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ItineraryElement from '../itineraryelements/Index';
import ItineraryFlightElement from '../itineraryelements/Flight';
import ItineraryFoodElement from '../itineraryelements/Food';
import ItineraryPoiElement from '../itineraryelements/Poi';
import { getHumanDate } from '../../../services/getHumanDate';
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

      
            <Date>{getHumanDate(props.data.slab)}</Date>

            <div className='border-thin' style={{borderRadius: '10px'}}>
                {
                    props.data.slab_elements ? props.data.slab_elements.length ? props.data.slab_elements.map((element, index) => {
                        if(element.element_type === 'transfer')
                        return(
                            <ItineraryFlightElement time="9:00AM"  heading="Depart from Delhi" text={element.text}

            ></ItineraryFlightElement>
                        )
                        else if(element.element_type === 'accommodation')
                        return(
                            <ItineraryElement time="0:00AM"  heading={element.heading} ></ItineraryElement>
                        )
                        else if(element.element_type === 'recommendation' && element.type=="Food Recommendation")
                        return(
                            <ItineraryFoodElement  time="00:00PM"  heading={element.heading} food_items={element.text ? JSON.parse(element.text) : null}

            ></ItineraryFoodElement>
                        )
                        else if(element.element_type ==='activity')
                        return(
                            <ItineraryPoiElement tips={element.activity_data ? element.activity_data.poi ? element.activity_data.poi.tips ? element.activity_data.poi.tips.length ? element.activity_data.poi.tips : null : null : null : null} text={element.text} time="00:00PM"  heading={element.heading} image={element.icon}></ItineraryPoiElement>
                        )
                        else if(element.element_type === 'meal')
                        return(
                            <ItineraryElement time="0:00AM"  heading={element.heading}  text={element.text}></ItineraryElement>
                        )
                        
                    }) 
                    
                    : null : null
                }
            
               

            </div>
         </Container>
        
    );
 }

export default DayContainer;
=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import ItineraryElement from '../itineraryelements/Index';
// import ItineraryFlightElement from '../itineraryelements/Flight';
// import ItineraryFoodElement from '../itineraryelements/Food';
// import ItineraryPoiElement from '../itineraryelements/Poi';

const Container = styled.div`
  @media screen and (min-width: 768px) {
  }
`;

const Date = styled.div`
  width: max-content;
  border-radius: 2rem;
  margin: 1rem auto;
  padding: 0.25rem 1rem;
  background-color: #f4f4f4;
  font-weight: 300;
`;

const DayContainer = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-lexend">
      <Date>Feb 3, 2023</Date>

      <div className="border-thin" style={{ borderRadius: '10px' }}>
        {/* <ItineraryFlightElement time="9:00AM"  heading="Depart from Delhi"
                               text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'

               ></ItineraryFlightElement> */}

        {/* <ItineraryElement time="9:00AM"  heading="Check in to your stay" ></ItineraryElement> */}
        {/* <ItineraryFoodElement  time="12:00PM"  heading="Food Reccommendation"
                               text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'

               ></ItineraryFoodElement>
                <ItineraryPoiElement time="9:00AM - 12:00PM" image={'media/website/grey.png'}  booking heading="Baapu Bazaar"
                text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque.'
                ></ItineraryPoiElement> */}
      </div>
    </Container>
  );
};

export default DayContainer;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
