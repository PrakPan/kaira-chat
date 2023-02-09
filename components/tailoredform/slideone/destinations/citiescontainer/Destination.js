import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
 import ImageLoader from '../../../../ImageLoader';

 import BackgroundImageLoader  from '../../../../UpdatedBackgroundImageLoader';
 import {BsCheckCircleFill} from 'react-icons/bs';
 const LocationContainer = styled.div`
  &:hover{
     cursor: pointer;
 }
 max-width: 100%;
 border-radius: 10px;
 display: grid;
  grid-gap: 2px;
 &:hover{
     cursor: pointer;
 }
 
 `;
 const ImageTextContainer = styled.div`
font-weight: 400;
margin: 0;
padding: 0 0.25rem 0.25rem 0.25rem;
font-size: 0.75rem;

`;

const HoverContainer = styled.div`
text-align: center;
background-color: ${(props) => (props.is_selected ?  'rgba(247,231,0,0.3);' : 'rgba(0,0,0,0.4);')};
color:  ${(props) => (props.is_selected ?  'black' : 'white')};
font-weight: ${(props) => (props.is_selected ?  '800' : '400')};
min-width: 90px;
min-height: 70px;
width: 100%;
@media screen and (min-width: 768px){
  min-width: 108px;
  min-height: 90px;
 &:hover{
  background-color: rgba(247,231,0,0.3);
  color: black;
  font-weight: 800;
 }
}
`;
 const DimensionContainer  = styled.div`
 min-width: 90px;
min-height: 70px;
 @media screen and (min-width: 768px){
  min-width: 108px;
  min-height: 90px;
 
}
 `;
const Location = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [loaded, setLoaded] = useState(false);

  
  return (
    <LocationContainer className='border-thin' >
                {/* <ImageContainer onClick={() => _handlePersonaliseRedirect(id, name, parent)}              > */}
                {/* <BackgroundImageLoader filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" height="4rem"  url={'media/website/Goa.jpg'} filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)" borderRadius="10px 10px 0 0"></BackgroundImageLoader> */}
<div style={{position: 'relative'}}>
                    <DimensionContainer>{
                      props.image ? <ImageLoader
                        url={props.image}
                        borderRadius='5px'
                        height='auto'
                        width="100%"
                        heighttab="100%"
                        dimensions={{width: 300, height: 250}}
                        dimensionsMobile={{width: 540, height: 420}}
                        fit="cover"
                     onclick={props.onclick}
                     onload={() => setLoaded(true)}
                        hoverpointer/>:null}</DimensionContainer>
                        <HoverContainer  is_selected={props.is_selected} onClick={() => props.onclick(props.onclickparam)} className='center-div' style={{ borderRadius: '5px',position: 'absolute', top: '0',width: '100%', height: '100%', fontSize: '0.85rem'}}>{props.text}
                        {props.is_selected ? <BsCheckCircleFill/> : null}
                        </HoverContainer>
                        </div>
                        {/* <ImageTextContainer className='font-opensans'>
                        
                            </ImageTextContainer> */}
                {/* <ImageText className="font-opesans center-div">{props.hotlocations[i].name}</ImageText> */}
           {/* </ImageContainer> */}
           </LocationContainer>
  );
}


export default Location;

