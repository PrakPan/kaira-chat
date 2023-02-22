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
    margin: 0;
`;
 
const Tips = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container>
                     <Heading>Tips</Heading>
                     
                     {
                        props.tips ? 
                        props.tips.map(tip => {
                            return (
                                <Text>
                                        {tip}
                                </Text> 
                            )
                        })
                        : null
                     }
        </Container>
        
    );
 }

export default Tips;