import styled from 'styled-components';
import { useState, useEffect } from 'react';
const Container = styled.div`
     
     grid-gap: 0.75rem;
         @media screen and (min-width: 768px){
 
    }
`;
const Heading = styled.p`
font-weight: 500;
margin-bottom: 2px;
`;
const Text = styled.p`
    font-size: 14px;
`;
 
const Tips = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container>
                     <Heading>Tips</Heading>
                     <Text>
                        <ul>
                        {props.tips && props.tips.map((element)=>(
<li>{element}</li>
                     ))}
                        </ul>
                     

                     </Text>
        </Container>
        
    );
 }

export default Tips;