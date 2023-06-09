import React from 'react';
import styled from 'styled-components';
import Button from '../ui/button/Index';
import Heading from '../heading/Heading';
import urls from '../../services/urls';
import media from '../media';
import { useRouter } from 'next/router';
import * as ga from '../../services/ga/Index';
import openTailoredModal from '../../services/openTailoredModal';
const Container = styled.div`
@media screen and (min-width: 768px){
    margin: 5rem 0;
}

`;
const GridContainer = styled.div`
display: grid;
grid-gap: 0.5rem;

margin: auto;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 3rem;

}
`;
// const Heading = styled.p`

// `;
const Banner= (props) => {
    let isPageWide = media('(min-width: 768px)')
    const router = useRouter();
    
      const _handleGuideRedirect = () => {
        router.push(urls.TRAVEL_GUIDE)
      }
      const _handleGuideClick = () => {
        // setLoading(true);
        setTimeout(_handleGuideRedirect, 1000);
      
        ga.callback_event({
          action: 'TG-Bannerone',
          
          callback: _handleGuideRedirect,
        })
      
      }

return(
    <Container>
            {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Top Destinations to travel</Heading>         */}

        <Heading align="center" bold margin={isPageWide ? "0 auto 2.5rem auto" : "0 auto 1rem auto 0" } >Let us help you plan your next experience</Heading>
        <GridContainer>
            <Button external_link="https://www.blog.thetarzanway.com" borderRadius="2rem" margin="auto" padding="0.5rem 2.5rem">I need travel inspiration</Button>
            <Button onclick={_handleGuideClick} onclickparams={null} margin="auto" borderRadius="2rem" padding="0.5rem 2.5rem"> I want to read guides</Button>
            <Button onclick={()=>openTailoredModal(router)} onclickparams={null} borderRadius="2rem" margin="auto" padding="0.5rem 2.5rem">Let's start planning now</Button>
        </GridContainer>
    </Container>
);

}

export default Banner;
