import React, { useState } from 'react';
import styled from 'styled-components';
import { getIndianPrice } from '../../../../services/getIndianPrice';
const Container = styled.div`
  padding: 0.75rem;
  @media screen and (min-width: 768px) {
    margin: 0.5rem 0.5rem 0 0.5rem;
    // display: flex;
    // justify-content: space-between;
    // text-align: center;
  }

  // @media screen and (min-width: 768px) {
  //   display: grid;
  //   grid-template-columns: auto 6fr;
  //   gap: 1.5rem;
  //   padding: 1rem 0.5rem;
  // }
`;
const Cost = styled.p`
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    text-align: center; 
`;
const Text = styled.p`
  font-size: 15px;
  font-weight: 300;
  margin: 0;
  text-align: left;
  @media screen and (min-width: 768px) {
    text-align: center;
  }
`;
const FlexBox = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    gap : 0.4rem;
  }
`;
const Section = (props) => {

  const [selected  ,setSelected] = useState([])

  var adult 
  if (props.selectedBooking.pax.number_of_adults > 1) adult = ' Adults'
  else adult = ' adult'
   var child;
   if (props.selectedBooking.pax.number_of_children > 1) child = " Childs";
   else child = " Child";

    if (props.data)
      return (
        <Container className="font-lexend">
          <Text>Starting from</Text>
          <div>
            <FlexBox>
              <Cost className="font-lexend">
                {props.data.Fare
                  ? props.data.Fare.OfferedFare
                    ? "₹" +
                      getIndianPrice(Math.round(props.data.Fare.OfferedFare))
                      
                    : null
                  : null}
              </Cost>

              <Text>
                {"( " +
                  props.selectedBooking.pax.number_of_adults +
                  adult +
                  (props.selectedBooking.pax.number_of_children
                    ? ", " +
                      props.selectedBooking.pax.number_of_children +
                      child
                    : "") +
                  " )"}
              </Text>
            </FlexBox>
          </div>
        </Container>
      );
    else return null;
}

export default Section;
