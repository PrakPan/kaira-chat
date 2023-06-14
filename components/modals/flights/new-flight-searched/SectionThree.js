import React from 'react';
import styled from 'styled-components';
import { getIndianPrice } from '../../../../services/getIndianPrice';
const Container = styled.div`
margin: 0.5rem 0.5rem 0 0.5rem;
padding: 0.5rem 0;
display: flex;
justify-content: space-between;
@media screen and (min-width: 768px){
   
    
}


`;
const Cost = styled.p`
    font-size: 23px;
    font-weight: 700;
    margin: 0;
    text-align: right;

  
`;
const Pax = styled.p`
font-size: 14px;
font-weight: 300;
margin: 0;
text-align: right;
`;
const Section = (props) => {
  var adult 
  if (props.selectedBooking.pax.number_of_adults > 1) adult = ' Adults'
  else adult = ' adult'
   var child;
   if (props.selectedBooking.pax.number_of_children > 1) child = " Childs";
   else child = " Child";

    if (props.data)
      return (
        <Container className="font-lexend">
          <div></div>
          <div>
            <Cost className="font-lexend">
              {props.data.Fare
                ? props.data.Fare.OfferedFare
                  ? "₹ " +
                    getIndianPrice(Math.round(props.data.Fare.OfferedFare)) +
                    " /-"
                  : null
                : null}
            </Cost>
            <Pax>
              {props.selectedBooking.pax.number_of_adults +
                adult +
                (props.selectedBooking.pax.number_of_children
                  ? ", " +
                    props.selectedBooking.pax.number_of_children +
                    child
                  : "")}
            </Pax>
          </div>
        </Container>
      );
    else return null;
}

export default Section;
