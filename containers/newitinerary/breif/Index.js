import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Route from './route/Index';
import Cities from './cities/Index';
  const Container = styled.div`

`;

const Brief = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
             <Route></Route>
             <Cities></Cities>
        </Container>
        
    );
 }

export default Brief;