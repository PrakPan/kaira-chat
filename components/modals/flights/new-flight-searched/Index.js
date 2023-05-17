import React from 'react';
import styled from 'styled-components'
 import SectionTwo from './sectiontwo/Index';
 import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
  const Container = styled.div`
    width: 100%;        
    background-color: white;
     border-radius: 10px;
    display: flex;
    flex-flow: column;
    height: 100%;
    margin-bottom: 0.5rem;
    @media screen and (min-width: 768px){
        border-radius: 10px;
        position: relative;

    }
    
`;

 
 
 
const Booking = (props) =>{
     return(
        <Container className='border' style={{ borderRadius: "10px"}}>
          <SectionTwo data={props.data}></SectionTwo>
         <SectionThree selectedBooking={props.selectedBooking} _deselectBookingHandler={props._deselectBookingHandler} is_selecting={props.is_selecting} data={props.data}></SectionThree>
         <SectionFour selectedBooking={props.selectedBooking} data={props.data} _updateBookingHandler={props._updateBookingHandler}></SectionFour>

        </Container>
    );
 
}

export default  (Booking);