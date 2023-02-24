import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
 
import styled from 'styled-components';
 
const Container = styled.div`
    display: flex;
    margin: 0.5rem 0;

`;
const Result = (props) => {

  let isPageWide = media('(min-width: 768px)');
 
  
  return (
    <Container className='font-opensans' >
                <div style={{fontWeight: '600'}}>{props.name}</div>
                <div style={{flexGrow: '1', textAlign: 'right', fontWeight: '300'}}>{props.type}</div>
           </Container>
  );
}


export default Result;

