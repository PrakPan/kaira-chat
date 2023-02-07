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
const Overview = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
                <GridContainer>
                    <Heading className='font-poppins'>Gateway to Rajasthan</Heading>
                    <div className='center-div'>
                    <Button borderRadius="6px" borderWidth="1.5px" onclick={() => console.log('')}>
                        Trip Settings
                    </Button>
                    </div>
                </GridContainer>
                <Details></Details>
                <div style={{border: '1px solid #F0F0F0', width: '100vw', marginLeft: '-1rem', marginTop: '1rem', marginBottom: '1rem'}}></div>
                <ImagesMobile></ImagesMobile>
        </Container>
        
    );
 }

export default Overview;