<<<<<<< HEAD
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
=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
const Container = styled.div`
  grid-gap: 0.75rem;
  @media screen and (min-width: 768px) {
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
  function proptipsMaker(tips) {
    if (tips.length > 3) {
      return tips
        .slice(0, 3)
        .map((element, index) => <li key={index}>{element}</li>);
    }
    return tips
      .slice(0, 3)
      .map((element, index) => <li key={index}>{element}</li>);
  }

  useEffect(() => {}, []);

  return (
    <Container>
      <Heading>Tips</Heading>
      <Text>
        <ul>
          {props.tips == undefined || props.tips == null
            ? null
            : proptipsMaker(props.tips)}
        </ul>
      </Text>
    </Container>
  );
};

export default Tips;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
