import React from 'react';
import styled from 'styled-components';
import Accordion from './Accordion'

const Container = styled.div`
@media screen and (min-width: 768px){
}
`;

const Faqs = (props) => {
    
 
     return(
        <Container>
            <Accordion faqs={props.faqs}></Accordion>
        </Container>
  ); 
}

export default Faqs;
