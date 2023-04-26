import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
@media screen and (min-width: 768px){
    width: 60%;
    margin: auto;
}
`;
const FlexContainer = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 100%;
@media screen and (min-width: 768px){

}
`;
const Filter = styled.div`
    padding: 0.25rem 1rem;
    border-radius: 2rem !important;
    width: max-content;
    font-size: 0.75rem;
    margin: 0 0.5rem 0 0;
   
`;

const Filters= (props) => {
  


  return(
      <Container>
      <FlexContainer>
         {props.data.accommodation_type ? <Filter  className="font-lexend border-thin">{props.data.accommodation_type}</Filter>:null}
         {props.data.star_category ? <Filter  className="font-lexend border-thin">{props.data.star_category +" Star"}</Filter> : null}

      </FlexContainer></Container>
  );

}

export default Filters;