import React from 'react';
import styled from 'styled-components';
import media from '../../../media';


const Container = styled.div`
display: inline-block;
padding: 0.4rem 2rem 0.4rem 0.5rem;
position: absolute;
top: 0.5rem;
left: 0;
&::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 2.4rem  solid rgba(0,0,0,0.5);
  border-left: 0em solid transparent;
  border-right: 1.5rem solid transparent;
}

@media screen and (min-width: 768px){
   
    
}


`;
 const Span = styled.span`
 
    color: white;
    font-size: 0.8rem;
    position: relative;
    letter-spacing: 1px;
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
