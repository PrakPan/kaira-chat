import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';

const Text = styled.h1`
position: relative;
top: 2.2rem; 
@media screen and (min-width: 768px){     
    top: 1.5rem;    
}
&:nth-of-type(1){
    font-size: 2.5rem;
    font-weight: 700;
    @media screen and (min-width: 768px){        
    font-size: 3.5rem;    
    }
}
&:nth-of-type(2){
    font-size: 1rem;
    font-weight:200;
    @media screen and (min-width: 768px){        
    font-size: 1.25rem;    
    }
}
`;


const Container = styled.div`
margin: 1rem 0rem 2rem 0rem;
width: 18rem;
@media screen and (min-width: 768px){     
width: 21rem;
}
`;

const LeafContainer=styled.div`
position: relative;
&:nth-of-type(1){
float: left;
}
&:nth-of-type(2){
  float:right;
  transform: scaleX(-1);
  }
`;

const Leaf=styled.img`
height: 8rem;
`;

const StoriesHeading=styled.span`
width: 100%;
padding: 0rem 1rem 3rem 1rem;
font-weight: 200;
font-size: 1.2rem;  
@media screen and (min-width: 768px){   
font-size: 2rem;  
}


`;

const TravellerCounter = () => {

  const [counter, setCounter] = useState(1214);

  useEffect(() => {
    const timer =
      counter < 1321 && setInterval(() => setCounter(counter + 1), 10);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="font-lexend center-div text-center">
      <Container>
        <LeafContainer>
          <ImageLoader
            dimensions={{ height: 500, width: 300 }}
            dimensionsMobile={{ height: 500, width: 270 }}
            height={"8rem"}
            url={"media/testimonials/leaf.svg"}
            // widthmobile='2rem'
          />
        </LeafContainer>
        <LeafContainer>
          <ImageLoader
            height={"8rem"}
            dimensions={{ height: 500, width: 300 }}
            dimensionsMobile={{ height: 500, width: 270 }}
            url={"media/testimonials/leaf.svg"}
          />
        </LeafContainer>
        <Text>{counter}</Text>
        <Text>Travellers and Counting</Text>
      </Container>
    </div>
  );
}

export default TravellerCounter;