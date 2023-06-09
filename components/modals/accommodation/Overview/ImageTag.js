import React from 'react';
import styled from 'styled-components';
import media from '../../../media';


const Container = styled.div`
display: inline-block;
padding: 0.4rem 1.5rem 0.4rem 3rem;
position: absolute;
bottom: 0.5rem;
z-index: 1000;
right: 0;
&::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 2.4rem  solid rgba(247,231,0,0.5);
  border-right: 0em solid transparent;
  border-left: 1.5rem solid transparent;
}

@media screen and (min-width: 768px){
   
  right: 20%;

}


`;
 const Span = styled.span`
 
    color: black;
    font-size: 0.8rem;
    position: relative;
    letter-spacing: 1px;
    font-weight: 400;
 `;
const Tag= (props) => {
    let isPageWide = media('(min-width: 768px)')
  

    return(
      <Container className='font-lexend'>  
        <Span  className='font-lexend'>{props.tag.toUpperCase()}</Span>
      </Container>
  ); 
}

export default Tag;
