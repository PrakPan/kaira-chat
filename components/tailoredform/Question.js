import React, {useState, useEffect } from 'react';
  
// import media from '../../media';
 
import styled from 'styled-components';
 
 
 const Heading = styled.p`
 font-weight: 600;
 margin: ${(props) =>

  props.margin ? props.margin : "0 0 0.5rem 0"};

 `;
 
const Question = (props) =>{
 
//   let isPageWide = media('(min-width: 768px)');
  
  return <Heading margin={props.margin} className={props.hover_pointer ? "text-centr font-opensans hover-pointer" : "text-centr font-opensans"}>{props.children}</Heading>;
}


export default Question;

