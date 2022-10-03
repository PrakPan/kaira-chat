import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import media from '../../../components/media';
import {connect} from 'react-redux';
import * as authaction from '../../../store/actions/auth';
import * as otpaction from '../../../store/actions/getOtp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import { useRouter } from 'next/router'
import Button from '../../../components/Button';
import Progress from './Progress';
import ProgressBooking from './ProgressBooking';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getFirstName } from '../../../services/getfirstname';
import { setMinutes, setSeconds } from 'date-fns';
const Container = styled.div`
    width: 100vw;
    height: 100vw;

    position: absolute;
`;

const InnerContainer = styled.div`
    width: 50vw;
    display: inline-block;
    transform-origin: 0% 0%; 
    min-height: 50vh;
    z-index: 1;
    background-color: white;
   
 

`;
const Message = styled.p`
    font-size: 0.75rem;
    font-weight: 100;
    letter-spacing: 1px;
    max-width: 100%;
    margin: 0.5rem 1rem 1rem 1rem;
`;
const TimeContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: self;
    width: 100%;
    margin: 0;
    @media screen and (min-width: 768px){
        display: grid;
        grid-template-columns: 0.5rem 1fr 0.5rem  1fr 0.5rem 1fr 0.5rem;
        box-sizing: border-box;
        max-width: 100%;
    }

`;
const TimeCircle = styled.div`
    min-height: 22vw;
    background-color: white;
    margin: 0.5rem;
    @media screen and (min-width: 768px){
        margin: 0;
        min-height: max-content;
    }
`
const ButtonsContainer = styled.div`
    max-width: 75%;
     @media screen and (min-width: 768px){
        max-width: 65%;
    }
`;
const ProgressContainer = styled.div`
    margin: 1rem 0;
`;
const TimeRemaining = styled.p`
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    margin: 1rem 1rem 0.5rem 1rem;    
    @media screen and (min-width: 768px){
        font-size: 1.5rem;

    }

`;
const TimeNumber = styled.p`
    font-size: 1.9rem;
    line-height: 1;
    margin: 0;
    font-weight: 800;
    @media screen and (min-width: 768px){
        font-size: 2.25rem;

    }
`;
const TimeUnit = styled.p`
font-size: 0.75rem;
    margin: 0;
    font-weight: 300;
    @media screen and (min-width: 768px){


    }
`
const ItineraryMessage = styled.p`
    margin: 0 0.5rem 1rem 0.5rem;
    text-align: center;
    font-weight: 600;
    @media screen and (min-width: 768px){
        padding:  0.75rem 0 0 0;
    }

`;
const Timer = (props) =>{
    let isPageWide = media('(min-width: 768px)')

    const ITINERARY_TIMER_MESSAGE="Your tailor made plan is ready. As a next step to get to know you better, our travel expert will reach out to you to prepare the perfect plan.";
    const BOOKING_TIMER_MESSAGE="Here are a few recommendations for booking your travel experience that you can completely edit on your own. Our experience captain will get in touch with you to help you out. "

    let firstname;
    let name = localStorage.getItem('name');
    if(!name) firstname="Traveler"
    else firstname=getFirstName(name);

   
      let message ="Hi TTW,%0AHere is my travel plan:%0A%0A"+window.location.href+"%0A%0AI would like to ask something.";
      if(isPageWide){
          if(!props.card){
            if(props.hideTimer) return <div></div>;
            else return(
        <InnerContainer
        style={{
            width:  '40vw',
              left: '30vw',
              right:   'auto',
              position:  'sticky',
              top:  '12.5vh',
              minHeight: '70vh',
              float:  'none',
              padding:  '0rem',
              marginTop:  '0',
              borderWidth: '5px',
              borderColor: 'rgba(0, 0, 0, 0.3)',
              boxShadow:'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.34)',
              borderStyle: 'none',
              zIndex: '1',

      }}
      className="borde center-div"
      >
        {!props.hideTimer   ? <FontAwesomeIcon icon={faTimes} onClick={props._handleTimerClose} style={{margin: "0.5rem", position: 'absolute', top: '0', right: '0', fontSize: '1.5rem'}}/> : null}
          {!props.hideTimer ? <TimeRemaining style={{fontSize: props.hideTimer ? '1rem' : '2.5rem'}} className="font-opensans">
          {"Hi "+firstname+"!"}
          </TimeRemaining> : null}
          
      
      
        {props.hideTimer ? null : <p className="font-opensans" style={{fontWeight: 300, margin: '0 1rem 1.5rem 1rem', textAlign: 'center'}}>{props.booking? BOOKING_TIMER_MESSAGE: ITINERARY_TIMER_MESSAGE}</p>}

         <ButtonsContainer>
              {props.hideTimer  || props.booking? null : <Button hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" borderWidth="0" bgColor="#f7e700"  margin="0.5rem auto 0.5rem auto" onclick={props._handleTimerClose}>Preview Itinerary</Button>}
            {props.booking ?<Button hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" borderWidth="2px" bgColor="white"  margin="0.5rem auto 0.5rem auto" onclick={props.openItinerary}>Preview Itinerary</Button> : null}
          {props.hideTimer ? null : <Button onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="white" hoverBgColor="black"  onclickparam={null} width="100%"  bgColor="#128C7E" borderWidth="0" color="white" borderRadius="2rem"  borderColor="black"   margin="0.5rem auto 0.5rem auto" >
<FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
Connect on WhatsApp</Button>}
</ButtonsContainer>
      </InnerContainer>
    );
    }
    else   return(
        <InnerContainer
        style={{
          width:  'max-content',
          marginTop: props.hideTimer ? '2vh' : '0',
          minHeight: 'max-content',
          float:  'none',
          padding: props.hideTimer ? '0.5rem' : '0rem',
          borderWidth: '5px',
          borderColor: props.hideTimer ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          boxShadow: props.hideTimer ?  '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' :'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderStyle: props.hideTimer ? 'none' : 'none',
      }}
      className="borde center-div"
      >
        
      <div style={{backgroundColor: !props.hideTimer ? "#f7e700" : 'transparent', paddingTop: '0', margin:   '0'}}>
          <TimeContainer style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '0.5rem'}}>
              <TimeCircle className="center-div"  style={{  width: props.hideTimer ? '100%' : '28.3vw', minHeight : props.hideTimer ? 'max-content' : '22vw', padding: '0.25rem'}}>
                  <TimeNumber className="font-opensans" style={{fontSize: props.hideTimer ? '1rem' : '1.9rem'}}>{props.hours}</TimeNumber>
                  <TimeUnit className="font-nunito">Hours</TimeUnit>
            </TimeCircle>
            {/* <div className="center-div font-opensans" style={{fontSize: '1.5rem', fontWeight: '600'}}>:</div> */}
              <TimeCircle className="center-div"  style={{  width: props.hideTimer ? '100%' : '28.3vw', minHeight : props.hideTimer ? 'max-content' : '22vw', padding: '0.25rem'}}>
                  <TimeNumber className="font-opensans" style={{fontSize: props.hideTimer ? '1rem' : '1.9rem'}}>{props.minutes}</TimeNumber>
                  <TimeUnit className="font-nunito">Minutes</TimeUnit>  
                </TimeCircle>
               {/* <div className="center-div font-opensans" style={{fontSize: '1.5rem', fontWeight: '600'}}>:</div>  */}
              <TimeCircle className="center-div"  style={{ width: props.hideTimer ? '100%' : '28.3vw', minHeight : props.hideTimer ? 'max-content' : '22vw', padding: '0.25rem'}}>
                <TimeNumber className="font-opensans" style={{fontSize: props.hideTimer ? '1rem' : '1.9rem'}}>{props.seconds}</TimeNumber>
                <TimeUnit className="font-nunito">Seconds</TimeUnit>    
            </TimeCircle>

        </TimeContainer>
     </div>
      
      </InnerContainer>
    );
}
    else{
       
        if(!props.card){
          if(props.hideTimer) return <div></div>;
    else return(
        <InnerContainer
        style={{
          width: props.booking ? '90vw' : '95vw',
          left: props.hideTimer ? '2vh' : '2.5vw',
          right: props.hideTimer ? '100vw' : 'auto',
          position: props.hideTimer ? 'sticky' : 'sticky',
          top: props.hideTimer ? '2vh' : '10vh',
          marginTop: props.hideTimer ? '2vh' : '0',
          minHeight: props.hideTimer ? 'max-content' : '70vh',
          float: props.hideTimer ? 'none' : 'none',
          padding: props.hideTimer ? '0.5rem' : '0rem',
          borderWidth: '5px',
          borderColor: props.hideTimer ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          boxShadow: props.hideTimer ?  '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' :'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderStyle: props.hideTimer ? 'none' : 'none',
          marginRight: props.hideTimer ? '-1rem' : '0',
          zIndex: '1001',
      }}
      className="borde center-div"
      >
          {!props.hideTimer? <FontAwesomeIcon icon={faTimes} onClick={props._handleTimerClose} style={{margin: "0.5rem",  position: 'absolute', top: '0', right: '0', fontSize: '1.5rem'}}/> : null}

          {!props.hideTimer ? <TimeRemaining style={{fontSize: props.hideTimer ? '1rem' : '2.5rem'}} className="font-opensans">
          {"Hi "+firstname+"!"}
          </TimeRemaining> : null}
         
          
    
     {props.hideTimer ? null : <p className="font-opensans" style={{fontWeight: 300, margin: '0 1rem 1.5rem 1rem', textAlign: 'center'}}>{props.booking ? BOOKING_TIMER_MESSAGE : ITINERARY_TIMER_MESSAGE}</p>}

         <ButtonsContainer>
              {props.hideTimer || props.booking ? null : <Button borderStyle="solid" color="black" borderWidth="2px" hoverColor="black" width="100%" hoverBgColor="white" borderRadius="2rem" borderRadius="2rem" bgColor="transparent"  margin="0.5rem auto" onclick={props._handleTimerClose}>Preview Itinerary</Button>}
              {props.booking ?<Button  hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" borderWidth="2px" bgColor="white"  margin="0.5rem auto 0.5rem auto" onclick={props.openItinerary}>Preview Itinerary</Button> : null}
          {props.hideTimer ? null : <Button onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="white" hoverBgColor="black"  color="white" onclickparam={null} width="100%"  bgColor="#128C7E" borderWidth="0" borderRadius="2rem"  borderColor="black"   margin="0 0 1rem 0" >

<FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
Connect on WhatsApp</Button>}
</ButtonsContainer>
      </InnerContainer>
    );
        }
    else   return(
        <InnerContainer
        style={{
          width:  'max-content',
          marginTop: props.hideTimer ? '2vh' : '0',
          minHeight: 'max-content',
          float: props.hideTimer ? 'none' : 'none',
          padding: props.hideTimer ? '0.5rem' : '0rem',
          borderWidth: '5px',
          borderColor: props.hideTimer ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          boxShadow: props.hideTimer ?  '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' :'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderStyle: props.hideTimer ? 'none' : 'none',
      }}
      className="borde center-div"
      >
          {!props.hideTimer ? <FontAwesomeIcon icon={faTimes} onClick={props._handleTimerClose} style={{margin: "0.5rem",  position: 'absolute', top: '0', right: '0', fontSize: '1.5rem'}}/> : null}

          {!props.hideTimer ? <TimeRemaining style={{fontSize: props.hideTimer ? '1rem' : '2.5rem'}} className="font-opensans">
          {"Hi "+firstname+"!"}
          </TimeRemaining> : null}
         
          
     
     {props.hideTimer ? null :<p className="font-opensans" style={{fontWeight: 300, margin: '0 1rem 1.5rem 1rem', textAlign: 'center'}}>{props.booking ? BOOKING_TIMER_MESSAGE: ITINERARY_TIMER_MESSAGE}</p>}

         <ButtonsContainer>
              {props.hideTimer || props.booking ? null : <Button borderStyle="solid" color="black" borderWidth="2px" hoverColor="black" width="100%" hoverBgColor="white" borderRadius="2rem" borderRadius="2rem" bgColor="transparent"  margin="0.5rem auto" onclick={props._handleTimerClose}>Preview Itinerary</Button>}
              {props.booking ?<Button  hoverColor="white" width="100%" hoverBgColor="black" borderRadius="2rem" borderWidth="2px" bgColor="white"  margin="0.5rem auto 0.5rem auto" onclick={props.openItinerary}>Preview Itinerary</Button> : null}
          {props.hideTimer ? null : <Button onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="white" hoverBgColor="black"  color="white" onclickparam={null} width="100%"  bgColor="#128C7E" borderWidth="0" borderRadius="2rem"  borderColor="black"   margin="0 0 1rem 0" >

<FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
Connect on WhatsApp</Button>}
</ButtonsContainer>
      </InnerContainer>
    );
}


    
}

const mapStateToPros = (state) => {
    return{
      otpFail : state.auth.otpFail,
      mobileFail: state.auth.mobileFail,
      otpSent: state.auth.otpSent,
      loading: state.auth.loading,
      newUser: state.auth.newUser,
      emailFail: state.auth.emailFail,
      token: state.auth.token,
      authRedirectPath: state.auth.authRedirectPath,
      loadingsocial: state.auth.loadingsocial
    }
  }
  const mapDispatchToProps = dispatch => {
      return{
        onAuth: (mobile, password, name, email) => dispatch(authaction.auth(mobile, password, name, email)),
        onOtp: (mobile, setNewUser) => dispatch(otpaction.getotp(mobile, setNewUser)),
        onResetLogin: () => dispatch(authaction.authResetLogin()),
        onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
        onFbAuth: (response) => dispatch(authaction.fbAuth(response))
  
      }
    }

export default connect(mapStateToPros,mapDispatchToProps)(React.memo(Timer));