import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';


const Container = styled.div`
display: inline-block;
padding: 0.3rem 1.5rem 0.3rem 0.5rem;
position: absolute;
top: 0.5rem;
left: 0.25rem;
&::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 2.2rem  solid rgba(255, 255, 255, 0.8);
  border-left: 0em solid transparent;
  border-right: 0.75rem solid transparent;
}

@media screen and (min-width: 768px){
   
    
}


`;
 const Span = styled.span`
 
    color: black;
    font-size: 0.8rem;
    position: relative;
    line-height: 1;
    letter-spacing: 2px;
 `;
const Tag= (props) => {
    let isPageWide = media('(min-width: 768px)')
  

    return(
      <Container className='font-lexend'>  
        <Span>{ props.tag.toUpperCase()}</Span>
      </Container>
  ); 
}

export default Tag;
