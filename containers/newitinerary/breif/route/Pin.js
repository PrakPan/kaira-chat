import styled from 'styled-components';
import { useState, useEffect } from 'react';

<<<<<<< Updated upstream
 
const  Container = styled.div`
    border-radius: 50%;
    background-color: black;
    width: 30px;
    height: 30px;
`;
const InnerContainer = styled.div`
border-radius: 50%;
background-color:   ${(props) => (props.duration? "#f7e700" : "#e4e4e4")};
=======
const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.pinColour ? props.pinColour : 'black'};
  width: 30px;
  height: 30px;
`;
const InnerContainer = styled.div`
  border-radius: 50%;

  background-color: ${(props) =>
    props.pinColour ? 'black' : '#f7e700'};
  width: 10px;
  height: 10px;
`;
>>>>>>> Stashed changes

width: 10px;
height: 10px;
`
 
const Pin = (props) => {
   
    useEffect(() => {
      
    },[]);

<<<<<<< Updated upstream
    return(
        <Container className='center-div'>
            <InnerContainer duration={props.duration}></InnerContainer>
        </Container>
        
    );
 }
=======
  return (
    <Container className="center-div" pinColour={props.pinColour}>
      <InnerContainer duration={props.duration} pinColour={props.pinColour}></InnerContainer>
    </Container>
  );
};
>>>>>>> Stashed changes

export default  Pin;