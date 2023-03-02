import React from 'react';
import styled from 'styled-components';
import Progress from './Progress'

const Container = styled.div`
margin: 0.5rem auto 6px auto;
width: 90%;
@media screen and (min-width: 768px){
    width: 65vw;
}
`;

const ProgressContainer = (props) => {
   

    return(
       <Container>
            <Progress questionIndex={props.questionIndex} />
       </Container>
    );
   
}

export default ProgressContainer;