import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


// import Button from '../../../components/Button';
  import ImageLoader from '../../components/ImageLoader';
  import urls from '../../services/urls';
  import { FaTimes } from 'react-icons/fa';
   const FixedContainer = styled.div`
width: 100%;
color: white;
  position: sticky;
  bottom: 0;
  height: 66px;
  border: none;
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding : 0 0.5rem;
    background-color: transparent;
    @media screen and (min-width: 768px){
    display: none;
    }
`;
 
 

 
 
const WhatsAppContainer  = styled.div`
    position: relative;
    background-color: hsl(0,0%,96%);
    border-radius: 50%;
    padding: 0.75rem;
`
const StyledFaTimes = styled(FaTimes)`
    position: absolute;
    right: 0.25rem;
    top: -0.25rem;
    border: solid 1px #e4e4e4;
     background-color: hsl(0,0%,98%);
color: black;
    border-radius: 50%;
    padding: 4px;
    height: 16px;
    width: 16px;
`;
const Banner = (props) => {
  // const router = useRouter
  const _openWhatsApp = () => {
    let message ="Hey TTW! I need some help with finalising  my  TTWxPW experience";
    window.location.href=urls.WHATSAPP+"?text="+message 
  }
    return(
      <FixedContainer>
        <WhatsAppContainer className='border-thin' onClick={_openWhatsApp}>
       <ImageLoader display="inline"  url="media/icons/bookings/whatsapp.svg" leftalign widthmobile="2rem" height="2rem"></ImageLoader>
     {/* <p style={{margin: '0'}} className="font-opensans">Contact Us</p> */}
      {/* <Cross style={{fontSize: '0.5rem'}}> */}
        <StyledFaTimes style={{fontSize: '0.5rem', lineHeight: '1'}}></StyledFaTimes>
      {/* </Cross> */}
     </WhatsAppContainer>
     </FixedContainer>
    );
  
  // else return null;
   
}
 
export default React.memo(Banner);