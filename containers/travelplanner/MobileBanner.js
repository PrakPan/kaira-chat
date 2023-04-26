import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../components/ui/button/Index';
import { useRouter } from 'next/router';
import {FaLongArrowAltRight, FaChevronRight, FaAngleRight} from 'react-icons/fa';
import {HiOutlineChevronRight} from 'react-icons/hi';
import validateTextSize from '../../services/textSizeValidator'
const Container = styled.div`
position: fixed;
bottom: 0;
width: 100vw;
padding: 1rem;
// background-color: white;
z-index: 1000;
left: 0;
`;
const MobileBannerButton = styled.button`
font-weight : 500;
color : black;
border : 1px solid black;
padding : 0.75rem;
background-color : #F7e700;
border-radius : 2rem;
margin : 0;
width : 100%;
text-align : center;
&:hover{
  background-color : black;
  color : white;

}

`
const BannerMobile = (props) => {
    const router = useRouter();

    const _handleRedirect = () => {
      router.push(`/tailored-travel?search_text=${props.city}`)
    }
  return(
    <Container className="" style={{borderRadius: '0'}}>
        {/* <Button  onclick={_handleRedirect} hovercolor="white" hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderWidth="0" borderRadius="2rem" margin="0" width="100%" ><p className="font-lexend" style={{margin: '0', fontWeight: '400'}}>Craft your own experience</p></Button> */}
       
        {/* <Button fontWeight="600" onclick={props.handleClick} hoverColor="black" onclickparam={null} borderWidth='1px' hoverbgcolor="black" padding="0.75rem" bgColor="#F7e700" borderRadius="2rem" margin="0" width="100%" >
        {props.city ? validateTextSize(`Craft a trip to ${props.city} now!`,8,'Craft a trip now!') : 'Craft a trip now!'}
          </Button> */}
          
          <MobileBannerButton onClick={props.handleClick}>
          {props.city ? validateTextSize(`Craft a trip to ${props.city} now!`,8,'Craft a trip now!') : 'Craft a trip now!'}

          </MobileBannerButton>

   </Container>
  );
}

export default BannerMobile;
