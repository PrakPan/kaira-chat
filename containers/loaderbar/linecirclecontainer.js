import styled from "styled-components";
import React, { useEffect, useState } from 'react';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const COLORS = {
    black: '#212529',
    gray: '#757D75',
    background: '#f7e700',
    white: 'white',
  };

  const LineCirclecontainer = styled.div`
width:max-content;
height:max-content;
`
const CircleWrapper = styled.div`
 display:flex;
 flex-direction:row;
 align-items:center;
 justify-content:center;
 
`

  const Circle1 = styled.div`
width:38px;
height:37px;
margin: 0 2vw 0 0vw;
top:59vh;
left:22.5vw;
left:34.5vw;
background-color:${COLORS.black};
border-radius:50%;
padding:5px 12px;
color:${COLORS.background};

animation:mymove 0.3s linear ;

@keyframes mymove {
    from {transform: scale(1,1); background-color:${COLORS.gray};}
 to {transform: scale(1.1,1.1); background-color:${COLORS.black};}
     
  
  }
  @media screen and (min-width: 768px){
    left:34.5vw;
    margin: 0 0 0 0vw;
  }


`
const Circle2 = styled.div`
width:38px;
height:37px;
left:38.9vw;
top:59vh;
margin: 0 0 0 8.8vw;
background-color:${COLORS.black};
border-radius:50%;
padding:5px 12px;
color:${COLORS.background};
animation:mymove 2.25s cubic-bezier(1,.03,1,.04);


@keyframes mymove {
    from {transform: scale(1,1); background-color:${COLORS.gray};}
 to {transform: scale(1.1,1.1); background-color:${COLORS.black};}
     
  
  }
  @media screen and (m-width: 768px){
    animation:mymove 1.88s cubic-bezier(1,.03,1,.04);
  left:43.9vw;
  margin: 0 0 0 6.8vw;
  }
`

const Circle3 = styled.div`
width:38px;
height:37px;

margin: 0 0 0 8.9vw;
top:59vh;
left:53vw;
background-color:${COLORS.black};
border-radius:50%;
padding:5px 12px;
color:${COLORS.background};
animation:mymove 3.6s cubic-bezier(1,.03,1,.04);

@keyframes mymove {
    from {transform: scale(1,1); background-color:${COLORS.gray};}
    to {transform: scale(1.1,1.1); background-color:${COLORS.black};}
}
@media screen and (min-width: 768px){
  left: 53vw;
  margin: 0 0 0 6.9vw;
}

`
const Circle4 = styled.div`
width:38px;
height:37px;
margin: 0 0 0 8.8vw;

top:59vh;
left:67vw;
background-color:${COLORS.black};
border-radius:50%;
padding:5px 12px;

color:${COLORS.background};
animation:mymove 5.1s cubic-bezier(1,.03,1,.04) ;


@keyframes mymove {
    from {transform: scale(1,1); background-color:${COLORS.gray};}
 to {transform: scale(1.1,1.1); background-color:${COLORS.black};}
     
  
  }
  @media screen and (min-width: 768px){
   left:62vw;
   margin: 0 0 0 6.8vw;
  }
`

const Line = styled.div`
height: 0.625rem;
width: auto;
display:flex;
justify-content: flex-start;


top:60.6vh;
left:31.5vw;
background-color:${COLORS.black};

animation: w70 5s linear;
@keyframes w70 {
  from { width: 0%; }
  to { width: 100%; }
}
@media screen and (min-width: 768px){
  width:auto;
  left:36.5vw;
  animation: w70 5s linear;
@keyframes w70 {
    from { width: 0%; }
    to { width: 100%; }
}
}

`

const Linecirclecontainer =()=>{
    
    return(
        <LineCirclecontainer>
        <Line style={{ margin: '0 0.1rem -1.5rem 0' }}></Line>
        <CircleWrapper >
          <Circle1  > <FontAwesomeIcon icon={faCheckSquare} /></Circle1>
          <Circle2 > <FontAwesomeIcon icon={faCheckSquare} /></Circle2>
          <Circle3 > <FontAwesomeIcon icon={faCheckSquare} /></Circle3>
          <Circle4 > <FontAwesomeIcon icon={faCheckSquare} /></Circle4>
        </CircleWrapper>
      </LineCirclecontainer>
    )
}
export default Linecirclecontainer;