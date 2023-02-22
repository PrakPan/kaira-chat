import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../../../components/ui/button/Index';
import Details from './Details';
import ImagesMobile from './ImagesMobile';
  const Container = styled.div`

`;
const GridContainer = styled.div`
    display:  grid;
    grid-template-columns: auto max-content;
    margin-bottom: 0.5rem;

`;
const Heading = styled.h1`
    font-size: 28px;
    font-weight: 600;
    line-height: 34px;
`;
const Line = styled.div`
border: 1px solid #F0F0F0;
 width: 100vw;
  margin-left: -1rem;
   margin-bottom:1rem;
   @media screen and (min-width: 768px){
   visibility: hidden;

}

`;
const Overview = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
                <GridContainer>
                    <Heading className='font-poppins'>{props.name}</Heading>
                    <div className='center-div'>
                    <div className='hidden-desktop'><Button borderRadius="6px" borderWidth="1.5px" onclick={() => console.log('')}>
                        Trip Settings
                    </Button></div>
                    </div>
                </GridContainer>
                <Details group_type={props.group_type} duration={props.duration} filters={props.filters}></Details>
                <Line  ></Line>

                 <ImagesMobile images={props.plan ? props.plan.images : null}></ImagesMobile>
        </Container>
        
    );
 }

export default Overview;