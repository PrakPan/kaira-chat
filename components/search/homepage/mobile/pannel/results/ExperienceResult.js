import React from 'react';
import styled from 'styled-components';
const Container = styled.div`
padding: 1rem;
text-align: left;
display: flex;
justify-content: space-between;
border: solid 1px #E4e4e4;
border-radius: 5px;
&:hover{
    cursor: pointer;
}
`;
const ResultTitle = styled.p`
margin: 0;
&:hover{
    font-weight: 800;
}
`;
const CTA = styled.div`
border-style: solid;
border-width: 1px;
border-radius: 2rem;
color: black; 
fontSize: 1rem; 
margin: 0;
text-align: center;
height: max-content;
padding: 0.5rem;
`;
const Result= (props) => {

    return(
        <Container>
        <div>
            <ResultTitle className="font-nunito">{props.title}</ResultTitle>
            <p style={{opacity : "0.5", fontSize: "0.75rem", margin: "0"}} className="font-nuniti">{props.type.toUpperCase()}</p>
        </div>
        <div className="center-div">
            <CTA className="font-nunito">Check Out</CTA>
        </div>
        </Container> 
    );
}

export default Result;
