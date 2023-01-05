import React from 'react';
// import 'styled' from 'styled-'
import styled, {keyframes} from 'styled-components';

const Container = styled.div`
    height: 4rem;
     padding: 0.5rem;
    display: flex;
    overflow: hidden;
    
`;
const Words = styled.div`

`;

const SpinWords = keyframes`
10%{
    transform: translateY(-112%)
}
25%{
    transform: translateY(-100%)
}

35%{
    transform: translateY(-212%)
}
50%{
    transform: translateY(-200%)
}
60%{
    transform: translateY(-312%)
}
75%{
    transform: translateY(-300%)
}
85%{
    transform: translateY(-412%)
}
100%{
    transform: translateY(-400%)
}

`;
const Word = styled.span`
display: block;
height: 100%;
font-weight: 800;
padding-left: 0.5rem;
font-size: 1.2rem;
margin: 0;
@media screen and (min-width: 768px){
   font-size: 2rem;
}
animation: ${SpinWords} 6s infinite;

`;
const Text = styled.p`
font-size: 1.2rem;
margin: 0;
font-weight: 300;
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
        <Word>One</Word>
        <Word>Two</Word>
        <Word>Three</Word>
        <Word>Four</Word>
        <Word>Five</Word>

    </Words>
   
  </Container>
  );
}

export default Rolodex;
