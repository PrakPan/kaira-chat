import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../../../components/ui/button/Index';
import { useRouter } from 'next/router';
import urls from '../../../../services/urls';

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

    const _handleRedirect = () => {
      if(props.link)  router.push(props.link);
       else  router.push(urls.TAILORED_TRAVEL);
    }
  return(
    <Container className="border" style={{borderRadius: '0'}}>
        {/* <Button  onclick={_handleRedirect} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="0" borderRadius="2rem" margin="0" width="100%" ><p className="font-opensans" style={{margin: '0', fontWeight: '400'}}>Craft your own experience</p></Button> */}
        <Button  link={urls.TAILORED_TRAVEL} boxShadow width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" >View Itinerary</Button>
        
   </Container>
  );
}

export default BannerMobile;
