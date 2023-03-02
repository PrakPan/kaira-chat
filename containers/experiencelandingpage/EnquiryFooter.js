import React from 'react';
import styled from 'styled-components';
import Enquiry from '../../components/modals/enquiry/Index';
// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index';
const  PaymentFooter= (props) => {
 
    const Container = styled.div`
        width: 100%;
        height: max-content;
        position: fixed;
        bottom: 0;
        z-index: 1;
    `;
    const BookingContainer = styled.div`

        background-color: rgba(0,0,0,0.8);
        padding: 0.5rem;
        @media screen and (min-width: 768px){
          width: 50%; 
          margin: 0.5rem auto;
        }
    `;
  

   return( 
    <Container className="">
      <BookingContainer className="center-div">
              {/* <Button
              
              color="white"
              hoverBgColor="white"
              borderColor="white"
              hoverColor="black"
              onclick={props.handleOpen}
              >
                Enquire Now
              </Button> */}
               <Button
              boxShadow
              color="white"
              hoverBgColor="white"
              borderColor="white"
              hoverColor="black"
              onclick={props.handleOpen}
              >
                Enquire Now
              </Button>
      </BookingContainer>
      <Enquiry show={props.show}  handleClose={props.handleClose}  ></Enquiry>
    </Container>
  );

}
 
export default  PaymentFooter;