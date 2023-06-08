<<<<<<< HEAD
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Route from './route/Index';
import Cities from './cities/Index';
  const Container = styled.div`
  @media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-column-gap: 2rem;
}
`;

const Brief = (props) => {
   
    useEffect(() => {
      
    },[]);
    console.log(props.brief)

    return(
        <Container>

             <Route  city_slabs={props.brief ? props.brief.city_slabs ? props.brief.city_slabs : null : null}></Route>
             <Cities city_slabs={props.brief ? props.brief.city_slabs ? props.brief.city_slabs : null : null}></Cities>

        </Container>
        
    );
 }

=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Route from './route/Index';
import Cities from './cities/Index';
  const Container = styled.div`
  @media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-column-gap: 2rem;
}
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

>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
export default Brief;