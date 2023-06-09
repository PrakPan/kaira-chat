import React, {useState, useEffect} from 'react';
  
import styled from  'styled-components';
import media from '../../../../media';

const GridContainer = styled.div`
  dislpay: grid;
  grid-template-columns: auto max-content;
`;
 
const Person = (props) => {
  let isPageWide = media('(min-width: 768px)')

     

    useEffect(() => {
         
      },[]);

        
  return(
      <GridContainer className='border'>
        <div>name@pw.live</div>
        <div>Invited</div>
      </GridContainer>
  );

}

export default Person;