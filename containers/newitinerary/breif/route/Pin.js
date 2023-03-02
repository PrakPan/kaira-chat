import styled from 'styled-components';
import { useState, useEffect } from 'react';

 
const  Container = styled.div`
    border-radius: 50%;
    background-color: black;
    width: 30px;
    height: 30px;
`;
const InnerContainer = styled.div`
border-radius: 50%;
background-color:   ${(props) => (props.duration? "#f7e700" : "#e4e4e4")};

width: 10px;
height: 10px;
`
 
const Pin = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='center-div'>
            <InnerContainer duration={props.duration}></InnerContainer>
        </Container>
        
    );
 }

export default  Pin;