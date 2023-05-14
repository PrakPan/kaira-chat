import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import media from '../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import Button from '../../Button';
import Progress from './Progress';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import urls from '../../../services/urls';
const Container = styled.div`
    width: 100vw;
    height: 100vw;

    position: absolute;
`;

const InnerContainer = styled.div`
    width: 50vw;
    min-height: 50vh;
    position: sticky;
    z-index: 1000;
    top:0vh;
    left: 25vw;
    background-color: white;
    float: right;
    border-style: solid;
    border-color: #f7e700;
    border-width: 5px;
 

`;
const Time = styled.p`
    text-align: center;
    font-size: 1.5rem;
    font-weight: 300;
`;
const ButtonsContainer = styled.div`
    min-width: 35%;
`;
const ProgressContainer = styled.div`
    margin: 1rem 0;
`;
const TimeRemaining = styled.p`
    font-size: 1.5rem;
    font-weight: 600;
`;
const Timer = (props) =>{
    let isPageWide = media('(min-width: 768px)')

    const [timer, setTimer] = useState('');
    const [tooltip, setTooltip] = useState(false);
    const target = useRef(null);

    // const timerduration = '12'
    const  msToTime = (duration) => {
        var milliseconds = Math.floor((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return hours+" Hours";
      }
    
    const [hideTimer, setHideTimer] = useState(false);
    const [progress, setProgress] = useState(0);
    const messages = [
        "One",
        "Two",
        "Three",
        "Four"
    ];
    // const gifs = [GIF, GIF2, GIF, GIF2]
    const _handleTimerClose = () => {
        window.scrollTo(0,window.innerHeight)
        setHideTimer(true);
        props._hideTimerHandler();

    }

    // useEffect(() => {
    //     // Countdown setinterval
    //     const time = "2021-09-16 10:05:48";
    //     const startingdate= new Date(time);
    //     const finaldate =  new Date(new Date(startingdate).setHours(startingdate.getHours() + 12));
    //     let startingtimer =  finaldate.getTime() - new Date().getTime() ;

    //     const timerId = setInterval(function(){
    //         startingtimer = startingtimer - 1000;
    //         setTimer( msToTime(startingtimer) );
    //     }, 1000);


    
    //     return () => {
    //         // clearInterval(progressId);
    //         clearInterval(timerId)
    //     }
      
    //   },[]);
   
    
      if(isPageWide)
        return(
            // <Container
              
            // >
                    <InnerContainer
                      style={{
                        width: hideTimer ? 'max-content' : '30vw',
                        left: hideTimer ? 'auto' : '35vw',
                        right: hideTimer ? '0' : 'auto',
                        // transform: hideTimer ? 'translate(50%)' : '0',
                        position: hideTimer ? 'sticky' : 'sticky',
                        top: hideTimer ? '12.5vh' : '15vh',
                        minHeight: hideTimer ? 'max-content' : '70vh',
                        float: hideTimer ? 'right' : 'none',
                        padding: hideTimer ? '1rem' : '0',
                    }}
                    className="borde center-div"
                    >
                        <TimeRemaining style={{fontSize: hideTimer ? '1rem' : '1.5rem'}} className="font-lexend">
                            Time Remaining
                        </TimeRemaining>
                        <Time>{timer}</Time>
                    {!hideTimer ? 
                        <Progress>
                            {/* <img src={gifs[progress]} style={{width: '4rem', display: 'block', margin: '0.5rem auto'}}></img> */}
                            {/* <p className="font-nunito" style={{textAlign: 'center'}}>{messages[progress]}</p> */}
                        </Progress> 
                    : null}
                       <ButtonsContainer>
                            {hideTimer ? null : <Button hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" bgColor="white"  margin="0.5rem auto" onclick={_handleTimerClose}>Show Itinerary</Button>}
                        {hideTimer ? null : <Button onclick={()=> window.location.href=urls.WHATSAPP+"?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20"} hoverColor="white" hoverBgColor="black"  onclickparam={null} width="100%"  bgColor="white" borderRadius="2rem"  borderColor="black"   margin="0" >
        <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
         Connect on WhatsApp</Button>}
         </ButtonsContainer>
                    </InnerContainer>
            // </Container>
    );
    else return(
        <Container>
        <InnerContainer
        style={{
          width: hideTimer ? 'max-content' : '70vw',
          left: hideTimer ? 'auto' : '15vw',
          right: hideTimer ? '0' : 'auto',
          // transform: hideTimer ? 'translate(50%)' : '0',
          position: hideTimer ? 'sticky' : 'sticky',
          top: hideTimer ? '12.5vh' : '15vh',
          minHeight: hideTimer ? 'max-content' : '70vh',
          float: hideTimer ? 'right' : 'none',
          padding: hideTimer ? '1rem' : '0',
      }}
      className="borde center-div"
      >
          <TimeRemaining style={{fontSize: hideTimer ? '1rem' : '1.5rem'}} className="font-lexend">
              Time Remaining
          </TimeRemaining>
          <Time>{timer}</Time>
      {!hideTimer ? 
          <Progress>
              {/* <img src={gifs[progress]} style={{width: '4rem', display: 'block', margin: '0.5rem auto'}}></img> */}
              {/* <p className="font-nunito" style={{textAlign: 'center'}}>{messages[progress]}</p> */}
          </Progress> 
      : null}
         <ButtonsContainer>
              {hideTimer ? null : <Button hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" bgColor="white"  margin="0.5rem auto" onclick={_handleTimerClose}>Show Itinerary</Button>}
          {hideTimer ? null : <Button onclick={()=> window.location.href=urls.WHATSAPP+"?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20"} hoverColor="white" hoverBgColor="black"  onclickparam={null} width="100%"  bgColor="white" borderRadius="2rem"  borderColor="black"   margin="0" >
<FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
Connect on WhatsApp</Button>}
</ButtonsContainer>
      </InnerContainer></Container>
    );


    
}

export default Timer;