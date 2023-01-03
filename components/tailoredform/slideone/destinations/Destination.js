import React, {useState, useEffect } from 'react';
  
import media from '../../../media';
 
import styled from 'styled-components';
 import ImageLoader from '../../../ImageLoader';

 import BackgroundImageLoader  from '../../../UpdatedBackgroundImageLoader';
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
background-color: rgba(0,0,0,0.4);
color: white;

 &:hover{
  background-color: rgba(247,231,0,0.1);
  color: black;
  font-weight: 600;
 }
`;
 
const Location = (props) => {

  let isPageWide = media('(min-width: 768px)');
  
  return (
    <LocationContainer className='border-thin' >
                {/* <ImageContainer onClick={() => _handlePersonaliseRedirect(id, name, parent)}              > */}
                {/* <BackgroundImageLoader filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" height="4rem"  url={'media/website/Goa.jpg'} filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)" borderRadius="10px 10px 0 0"></BackgroundImageLoader> */}
<div style={{position: 'relative'}}>
                   <ImageLoader
                        url={'media/website/Goa.jpg'}
                        borderRadius='5px'
                        height='auto'
                        width="100%"
                        heighttab="100%"
                        dimensions={{width: 600, height: 400}}
                        dimensionsMobile={{width: 600, height:400}}
                        fit="cover"
                     onclick={props.onclick}
                        hoverpointer/>
                        <HoverContainer  onClick={() => props.onclick(true)} className='center-div' style={{ borderRadius: '5px',position: 'absolute', top: '0',width: '100%', height: '100%', fontSize: '0.85rem'}}>{props.text}</HoverContainer>
                        </div>
                        {/* <ImageTextContainer className='font-opensans'>
                        
                            </ImageTextContainer> */}
                {/* <ImageText className="font-opesans center-div">{props.hotlocations[i].name}</ImageText> */}
           {/* </ImageContainer> */}
           </LocationContainer>
  );
}


export default Location;

