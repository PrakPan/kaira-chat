import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../../../components/ui/button/Index';
import { useRouter } from 'next/router';
import urls from '../../../../services/urls';
import openTailoredModal from '../../../../services/openTailoredModal';

const Container = styled.div`
position: fixed;
bottom: 0;
width: 100vw;
padding: 1rem;
background-color: white;
z-index: 1000;
left: 0;
`;

const BannerMobile = (props) => {
    const router = useRouter();

  return(
    <Container className="border" style={{borderRadius: '0'}}>
        <Button onclick={()=>openTailoredModal(router)} boxShadow width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" >View Itinerary</Button>
        
   </Container>
  );
}

export default BannerMobile;
