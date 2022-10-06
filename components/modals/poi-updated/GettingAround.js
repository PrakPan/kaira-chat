import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Heading = styled.h2`
font-size: 1.25rem;
text-align: center;
margin: 0 0 0.5rem 0;
font-weight: 700;
`;
const GettingAround = (props) => {
const [showMore, setShowMore] = useState(false);
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
useEffect(() => {
    if(props.getting_around)
    if(props.getting_around.length > 250) setShowMore(true)
   }, [props.getting_around]);
 
return( 
<div>{props.getting_around ? <Container>
    {/* <Heading className="font-opensans">Getting Around</Heading> */}
    <Description className="font-nunito" >{showMore ? props.getting_around.substring(0,250) : props.getting_around}</Description>
    {showMore ? <Description style={{margin: '0'}} className="font-nunito">...</Description> : null}
    {showMore ? <Description style={{margin: '0', textDecoration:'underline'}} className="font-nunito" onClick={() => setShowMore(false)}>Read More</Description>: null}
</Container>: null}
</div>
);

}

export default GettingAround;