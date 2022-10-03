import React from 'react';
import styled from 'styled-components';

const Heading = styled.h2`
font-size: 1rem;
text-align: center;
margin: 0;
font-weight: 600;
`;
const Recommendations = (props) => {

const Container = styled.div`
    border-style: none none solid none;
    border-width: 1px;
    border-color: #E4e4e4;
    padding: 1rem 0.5rem;
    @media screen and (min-width: 768px){
        padding: 2rem 1rem;
    }
`;

const GridContainer = styled.div`
    display: grid;
    @media screen and (min-width: 768px){
        grid-template-columns: 50% 50%;
    }
    @media screen and (min-width: 768px) and (min-height: 1024px) {
        grid-template-columns: 100%;

    }
    
`;
const UL = styled.ul`

`;
const LI = styled.li`
margin: 1rem 0;
font-weight: 100;
letter-spacing: 1px;
`;
// list-style-image: ${require('../../../assets/icons/alert.svg')};

// style={{margin: "1rem 0", listStyleImage: require('../../../assets/icons/alert.svg')}}
let recommendations = [];
let tips = [];

for(var i = 0; i<props.recommendations.length ; i++){
    recommendations.push(
        <LI>{props.recommendations[i]}</LI>
    )
}
for(var j = 0; j<props.tips.length ; j++){
    tips.push(
        <LI>{props.tips[j]}</LI>
    );
}
return( 
<div>{props.recommendations ? <Container>
    <GridContainer>
        <div style={{width: "100%", overflow: "scroll"}}>
            <Heading className="font-opensans">Do's and Dont's</Heading>
            <UL className="font-nunito" style={{margin: "1rem 0"}}>
                {tips}
            </UL>
        </div>
        <div>
            <Heading className="font-opensans">Recommendations</Heading>
            <ul className="font-nunito">
                {recommendations}
              
            </ul>
        </div>
    </GridContainer>
</Container>: null}</div>
);

}

export default Recommendations;