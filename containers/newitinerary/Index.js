import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Overview from './overview/Index';
import Menu from './Menu';
import Brief from './breif/Index';
import NewFooter from '../../components/newfooter/Index';
  const Container = styled.div`
    padding: 24vw 1rem 1rem 1rem;

`;


const NewItinerary = (props) => {
   
    useEffect(() => {
      
    },[]);
    const FONT_SIZES_MOBILE = {
        heading : [],
        text: [],
    }
    return(
        <div>
        <Container>
            <Overview FONT_SIZES_MOBILE={FONT_SIZES_MOBILE} ></Overview>
            <Menu></Menu>
            <div style={{border: '1px solid #F0F0F0', width: '100vw', marginLeft: '-1rem', marginBottom: '1rem'}}></div>
            <Brief></Brief>
        </Container>
        <NewFooter>
            
        </NewFooter>
        </div>
        
    );
 }

export default NewItinerary;