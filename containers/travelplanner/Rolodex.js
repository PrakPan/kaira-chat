import React from 'react';
// import 'styled' from 'styled-'
import styled, {keyframes} from 'styled-components';

const Container = styled.div`
    height: 4rem;
     padding: 0.5rem;
    display: flex;
    overflow: hidden;
    color: white;
    justify-content: center;
    @media screen and (min-width: 768px){
        justify-content: flex-start;

    
    }
    
`;
const Words = styled.div`

`;

const SpinWords = keyframes`
2.5%{
    transform: translateY(-0%)
}
22.5%{
    transform: translateY(-100%)
}

42.5%{
    transform: translateY(-200%)
}


62.5%{
    transform: translateY(-300%)
}
82.5%{
    transform: translateY(-400%)
}


100%{
    transform: translateY(-500%)
}

`;
const Word = styled.span`
display: block;
height: 100%;
font-weight: 800;
padding-left: 0.5rem;
font-size: 1.5rem;
margin: 0;
text-align: left;
@media screen and (min-width: 768px){
   font-size: 2rem;
}
animation: ${SpinWords} 8s infinite;

`;
const Text = styled.p`
font-size: 1.5rem;
margin: 0;
font-weight: 800;
@media screen and (min-width: 768px){
   font-size: 2rem;
}
`;
const Rolodex = (props) => {
    
  return(
    <Container className="font-opensans">
    <Text>
      As per your
    </Text>
    <Words>
        <Word>Pocket</Word>
        <Word>Group Type</Word>
        <Word>Travel Style</Word>
        <Word>Pocket</Word>
        <Word>Group Type</Word>
        <Word>Travel Style</Word>
        <Word>Pocket</Word>
        <Word>Group Type</Word>
        <Word>Travel Style</Word>


    </Words>
   
  </Container>
  );
}

export default Rolodex;
