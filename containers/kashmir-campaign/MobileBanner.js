import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../components/ui/button/Index';
import { useRouter } from 'next/router';

const Container = styled.div`
position: fixed;
bottom: 0;
width: 100vw;
padding: 1rem;
// background-color: white;
z-index: 1000;
left: 0;
`;

const BannerMobile = (props) => {
    const router = useRouter();

    const _handleRedirect = () => {
      router.push('/tailored-travel?search_text=Kashmir')
    }
  return(
    <Container className="" style={{borderRadius: '0'}}>
        {/* <Button  onclick={_handleRedirect} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="0" borderRadius="2rem" margin="0" width="100%" ><p className="font-opensans" style={{margin: '0', fontWeight: '400'}}>Craft your own experience</p></Button> */}
        <Button fontWeight='600' onclick={_handleRedirect} onclickparam={null} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="1px" borderRadius="2rem"  margin="0" width="100%" ><p className="font-opensans" style={{margin: '0', fontWeight: '600'}}>Try our free trip planner now!</p></Button>
   </Container>
  );
}

export default BannerMobile;
