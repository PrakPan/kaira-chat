import React, {useState, useEffect } from 'react';
  
import media from '../../../components/media';
 
import styled from 'styled-components';
 

const Container = styled.div`
color: black;
width: 100%;
background-color: red;
 @media screen and (min-width: 768px){
 
}

`;

 
const SlideOne = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
        1
    </Container>
  );
}


export default SlideOne;

