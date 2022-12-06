import React, {useState} from 'react';
import styled from 'styled-components';
import { getHumanDate } from '../../../../../services/getHumanDate'; 
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
    const getDate = (date) => {
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10);
       
        return(getHumanDate(day+"/"+month+"/"+year) );
    
    }
  
  return(
      <Container className=''>
            <Heading className='font-opensans'>{props.plan ? props.plan.name ? props.plan.name : null : null}</Heading>
            <Duration className='font-opensans' >{props.plan ? props.plan.duration_number ? props.plan.duration_number + " " + props.plan.duration_unit : null : null}</Duration >
            <hr style={{margin: '0.3rem 0'}}></hr>
            <HeadingTwo className='font-opensans'>Trip Details</HeadingTwo>
            <GridContainer>
                <div>
                    <HeadingThree>Start Date</HeadingThree>
                    <Subheading>{props.date ? getDate(props.date.format('YYYY-MM-DD') ): null}</Subheading>
                </div>
                <div>
                    <HeadingThree>Travelers</HeadingThree>
                    <Subheading>{props.pax ? props.pax : null}</Subheading>

                </div>
            </GridContainer>
        </Container>
  );

}

export default Cart;
