import React, {useState, useEffect } from 'react';
  
// import media from '../../media';
 
import styled from 'styled-components';
 
 
 const Heading = styled.p``;
 
const Question = (props) =>{
 
//   let isPageWide = media('(min-width: 768px)');
  
  return <Heading className={props.hover_pointer ? "text-centr font-opensans hover-pointer" : "text-centr font-opensans"}>{props.children}</Heading>;
}


export default Question;

