import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
 import Pax from './Pax';
  import Cost from './Cost';
     import ImageLoader from '../../../ImageLoader';
    import Button from '../../../ui/button/Index';
const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 0.5rem;

`;
const Info = (props) => {
  
 
    
    return(
        <Container  >
          <Pax></Pax>
          <Cost starting_cost={props.starting_cost}></Cost>
          <div>
            <ImageLoader url={"media/icons/bookings/bookmark-white.png" } leftalign  width="2rem" widthmobile="1.5rem" height="auto" ></ImageLoader>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
            borderWidth="0"
            bgColor="#f7e700"
            borderRadius="10px"
            fontWeight="600"
            fontSize="0.75rem"
            onclick={() => console.log('')}
            >
                View Itinerary
            </Button>
          </div>

        </Container>
    );
}
export default Info;

