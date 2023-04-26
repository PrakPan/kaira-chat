import React from 'react';
import styled from 'styled-components';
import img from '../../public/assets/icons/confused.svg';
// import Button from '../Button'
import Button from '../ui/button/Index'
// import Heading from '../heading/Heading';
import Heading from '../newheading/heading/Index';

import { useRouter } from 'next/router'
import media from '../media';
import urls from '../../services/urls';

 //Personalisation banner used on homepage and listing page ..

const Container = styled.div`
        background-color: #F7e700;
        padding: 2rem 1rem;
        margin: 1rem 0;
        @media screen and (min-width: 768px){
            display: grid;
            grid-template-columns: 1fr 1fr;    
            min-height: 50vh;
        }
`;
const Icon = styled.img`
    width: 20%;
    height: auto;
    display: block;
    margin: auto;
    @media screen and (min-width: 768px){
        width: 40%;
    }
`;
const Text = styled.p`
    width: 70%;
    display: block;
    text-align: center;
    
`;
const Personalise= (props) => {
    const router = useRouter()

    const _handleRedirect = (e) => {
        router.push('/tailored-travel')
    }
    let isPageWide = media('(min-width: 768px)')


  return(
      <Container>
          <div className="center-div">
        <Icon src={img}></Icon>
        </div>  
        <Heading align="center" aligndesktop="left" margin="0" noline  bold>Can't find a suitable experience?</Heading>        

        <div className="center-div">

        <Text className="font-lexend" style={{margin: '1rem auto 2rem auto', fontWeight: '300'}}>
            Just answer a few questions and craft your own experience.
        </Text>
        <Button boxShadow link={urls.TAILORED_TRAVEL}  borderRadius="2rem" padding="0.5rem 2rem" margin="auto" borderWidth="1px">Craft Now</Button>
        </div>
      </Container>
  ); 

}

export default Personalise;

{/* <Button onclick={_handleRedirect} borderRadius="2rem" padding="0.5rem 2rem" margin="auto" borderWidth="1px">Craft Now</Button> */}