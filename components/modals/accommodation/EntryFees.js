import React from 'react';
import styled from 'styled-components';

const Heading = styled.h2`
font-size: 1.5rem;
text-align: center;
margin: 0;
font-weight: 600;
`;


const Container = styled.div`
    
    padding: 0 1rem 1rem 0;

`;


const Description = styled.p`
margin: 1rem 0;
font-weight: 100;
text-align: center;
letter-spacing: 1px;
@media screen and (min-width: 768px){
    margin: 2rem 2rem 0 2rem;
    text-align: center;

}
`;
const UL = styled.ul``;
const LI = styled.li`
    font-weight: 300;
`;
const EntryFees= (props) => {
    let entryArr = [];
    for(var i = 0; i<props.entry_fees.length; i++){
        entryArr.push(<LI className="font-nunito">
            {props.entry_fees[i]}
        </LI>)
    }
return( 
<div>{props.entry_fees ? <Container className='center-div'>
    {/* <Heading className="font-lexend">Getting Around</Heading> */}
    {/* <Description className="font-nunito">{props.getting_around}</Description> */}
    <UL>
        {entryArr}
    </UL>
</Container>: null}</div>
);

}

export default EntryFees;