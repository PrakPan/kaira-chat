import styled from 'styled-components';
import { useState, useEffect } from 'react';
   const Container = styled.div`
    margin-top: 1rem;
    display: grid;
    position: sticky;
    top: 0;
    padding-top: 0.5rem;
    background-color: white;
    z-index: 2;
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
    const MENU = ['Brief', 'Itinerary', 'Stays', 'Flights', 'Transfers', 'Activities'];
    const [menuJSX, setMenuJSX] = useState([]);
   
    useEffect(() => {   
        let menu = [];
        for(var i = 0 ; i < MENU.length ; i++){
            if(props.currentMenu !== MENU[i]) 
            menu.push(
                <NotSelectedMenu>{MENU[i]}</NotSelectedMenu>
            )
            else menu.push(
                <SelectedMenu>{MENU[i]}</SelectedMenu>
 
            )
        }
        setMenuJSX(menu);
    },[props.currentMenu]);
    
    return(

        <Container
     
        className='font-opensans'>
{menuJSX}


         </Container>
        
    );
 }

export default Menu;