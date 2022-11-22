import React from 'react';
import styled from 'styled-components'
import { useRouter } from 'next/router';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
position: sticky;
top: 0;
padding: 0.5rem;
display: flex;
align-items: center;
background-color: black;
z-index: 1000;
height: 66px;
`;

const DropDown = styled.div`
    background-color: #f7e700;
    border-radius: 5px;
    padding: 6px 10px;
    font-weight: 600;
    color: black;
`;

const Menu = (props) => {
    const router = useRouter();

  
  return(
    <Container className="" style={{}}>
       <div style={{display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexGrow: '1', height: 'max-content'}}>
        <DropDown className='font-opensans hover-pointer'>Duration</DropDown>
        <DropDown className='font-opensans hover-pointer'>Budget</DropDown>
        <DropDown className='font-opensans hover-pointer'>Treks</DropDown>

        </div>
        <div className='' style={{color: 'white', display: 'flex', paddingRight: '1rem'}}>
            <div className='font-opensans hidden-mobile hover-pointer center-div'style={{marginRight: '0.5rem', lineHeight: '1'}}>Connect on WhatsApp</div>
            <ImageLoader onclick={props.openWhatsapp} url="media/icons/bookings/whatsapp.svg" width="2rem" height="2rem" widthmobile="2rem"  ></ImageLoader>

        </div>
   </Container>
  );
}

export default Menu;
