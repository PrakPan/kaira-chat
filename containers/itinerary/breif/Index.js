import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Heading from '../../../components/heading/Heading';
import Route from './route/Index';
import media from '../../../components/media';
import Overview from './overview/Index';
import Timer from '../timer/Index';
import DesktopBanner from '../../../components/containers/Banner';
import Banner from '../../homepage/banner/Mobile';
import { useRouter } from 'next/router';
 const Container = styled.div`
   
  padding: 1rem;
    color: black;
    @media screen and (min-width: 768px){
      width: 70%;
      margin: auto;
      padding: 2rem;
    }
`;
const RouteSlab = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const router = useRouter();
  const _handleTimerClose = () => {
    window.scrollTo(0,window.innerHeight)
    props._hideTimerHandler();

}
const _handleTailoredRedirect = (e) => {
  router.push('/tailored-travel')
}



  return(
    <div>
      {props.showTimer? <Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds}  timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={true} _handleTimerClose={_handleTimerClose} showTimer={props.showTimer} _hideTimerHandler={props._hideTimerHandler}></Timer> : null}
      <Container>
  {isPageWide? <Heading color="black" margin="0 0 1rem 0" bold>Route</Heading> : <Heading color="black" align="center" margin="0 0 2rem 0" bold>Route</Heading>} 
       <Route breif={props.breif}></Route>
       {true ? <Heading color="black" margin="2rem 0" align="center" bold>Overview</Heading> : null}
       {true ? <Overview breif={props.breif}></Overview> : null}
      </Container>
      {props.traveleritinerary ? <DesktopBanner onclick={_handleTailoredRedirect} text="Want to personalize your own experience like this?"></DesktopBanner> : null}
      {props.traveleritinerary ? <div className='hidden-desktop'><Banner text="Want to craft your own travel experience like this?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div>: null}
   </div>
  );
}

export default RouteSlab;
