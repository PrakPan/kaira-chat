import React from 'react';
import styled from 'styled-components'
 import SectionTwo from './sectiontwo/Index';
 import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
  const Container = styled.div`
    width: 95%;
    background-color: white;
    margin : auto;
    border-radius: 10px;
    height: 100%;
    margin-bottom: 0.5rem;
    @media screen and (min-width: 768px) {
    width: 100%;
      border-radius: 10px;
      position: relative;
    }
  `;
const GridContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 9rem;
    justify-content: space-between;
  }
`;
 
 
 
const Booking = (props) =>{
  console.log('propsShot: ', props);
  return (
    <>
      <Container className="border" style={{ borderRadius: "10px" }}>
        <GridContainer>
          <SectionTwo
            data={props.data}
            selectedBooking={props.selectedBooking}
          ></SectionTwo>
          <SectionThree
            selectedBooking={props.selectedBooking}
            _deselectBookingHandler={props._deselectBookingHandler}
            is_selecting={props.is_selecting}
            data={props.data}
          ></SectionThree>
        </GridContainer>
        <SectionFour
          selectedBooking={props.selectedBooking}
          data={props.data}
          _updateBookingHandler={props._updateBookingHandler}
        ></SectionFour>
      </Container>
    </>
  );
 
}

export default  (Booking);