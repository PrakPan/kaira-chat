import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../components/ui/button/Index';
import { useRouter } from 'next/router';
import {FaLongArrowAltRight, FaChevronRight, FaAngleRight} from 'react-icons/fa';
import {HiOutlineChevronRight} from 'react-icons/hi';
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
      router.push('/tailored-travel?search_text=Andaman')
    }
  return(
    <Container className="" style={{borderRadius: '0'}}>
        {/* <Button  onclick={_handleRedirect} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="0" borderRadius="2rem" margin="0" width="100%" ><p className="font-opensans" style={{margin: '0', fontWeight: '400'}}>Craft your own experience</p></Button> */}
        <Button fontWeight='600' onclick={_handleRedirect} onclickparam={null} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="1px" borderRadius="2rem" margin="0" width="100%" >
        Try our free trip planner now!
          <FaLongArrowAltRight style={{fontSize: '1.75rem', marginLeft: '0.25rem', lineHeight: '1'}}></FaLongArrowAltRight>
          </Button>
   </Container>
  );
}

export default BannerMobile;
