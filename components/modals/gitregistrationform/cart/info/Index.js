import React, {useState} from 'react';
 import styled from 'styled-components';
 
 const Container = styled.div`
    padding: 0  0.5rem;
 `;
const Heading = styled.p`
    font-weight: 600;
    margin-bottom: 2px;
`
const Duration = styled.p`
    font-weight: 300;
    color:  rgba(91, 89, 89, 1);
    margin-bottom: 0px;
font-size: 13px;

`;
const HeadingTwo = styled.p`
font-weight: 600;
    margin-bottom: 6px;
    font-size: 14px;
 

`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const HeadingThree =  styled.p`
font-weight: 400;
    margin-bottom: 2px;
    font-size: 13px;
`
const Subheading = styled.p`
font-weight: 300;
color:  rgba(91, 89, 89, 1);
margin-bottom: 0px;
font-size: 13px;
`
const Cart = (props) => {

  
  return(
      <Container className=''>
            <Heading className='font-opensans'>Kanatal Excursion</Heading>
            <Duration className='font-opensans' >3 Nights</Duration >
            <hr style={{margin: '0.3rem 0'}}></hr>
            <HeadingTwo className='font-opensans'>Trip Details</HeadingTwo>
            <GridContainer>
                <div>
                    <HeadingThree>Start Date</HeadingThree>
                    <Subheading>13th Dec</Subheading>
                </div>
                <div>
                    <HeadingThree>Travelers</HeadingThree>
                    <Subheading>5</Subheading>

                </div>
            </GridContainer>
        </Container>
  );

}

export default Cart;
