import React,{useState,useEffect, useRef} from 'react';
import styled from 'styled-components';
import TTWblack from '../../assets/logoblack.svg';

const TTWBlack=styled.img`
display: ${props=>(props.showlogo ? 'initial' : 'none')};
width:3.1rem;
height:3.1rem;
margin: 0.35rem 0rem 0rem 1rem;
@media screen and (min-width: 768px){
  width:3.6rem;
  height:3.6rem;
  margin: 0.2rem 0rem 0rem 1.9rem;
}
`;

const HideShowNavLogo=(props)=>{

    const LogoContainer=styled.div`
    height: ${props.height};    
    `;

    const [showlogo, setshowlogo]=useState(false);
    var yellownavpos;
    let elem = useRef();

  useEffect(() => {
    const setNavPos=()=>{
      try{
      yellownavpos=elem.current.getBoundingClientRect().top;      
      }catch(err){
         yellownavpos=0;
      }
    }
    const togglelogo=()=>{      
      if(yellownavpos==0){
        setshowlogo(true);
        
      }
      else{
        setshowlogo(false);
        
      }
    }
    window.addEventListener("scroll", ()=>{setNavPos(); togglelogo(); });
    return () => {
      window.removeEventListener("scroll", ()=>{setNavPos(); togglelogo(); });
    };
  });

    return(
        <LogoContainer ref={elem} >
        <TTWBlack  showlogo={showlogo} src={TTWblack}/>
        </LogoContainer>
    );
}

export default HideShowNavLogo;