import styled from 'styled-components';
import { useState, useEffect } from 'react';
   const Container = styled.div`
    margin-top: 1rem;
    display: grid;
    max-width: 100vw;
    overflow-x: hidden;
    grid-template-columns: max-content max-content max-content max-content max-content max-content;

`;
const SelectedMenu = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #f7e700;
    background-color: #262626;
    padding: 0.75rem 1.5rem;
    border-style: none none solid none;
    border-width: 4px;
    border-color: #f7e700;
    border-radius: 10px 10px 0 0;
`;
const NotSelectedMenu = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: rgb(122, 122, 122);
    
    background-color: transparent;
    padding: 0.75rem 1.5rem;
   
`;

const Menu = (props) => {
   
    useEffect(() => {
      
    },[]);
    
    return(

        <Container className='font-poppins'>
            <SelectedMenu>Breif</SelectedMenu>
            <NotSelectedMenu>Itinerary</NotSelectedMenu>
            <NotSelectedMenu>Stays</NotSelectedMenu>
            <NotSelectedMenu>Flights</NotSelectedMenu>
            <NotSelectedMenu>Transfers</NotSelectedMenu>
            <NotSelectedMenu>Activities</NotSelectedMenu>




         </Container>
        
    );
 }

export default Menu;