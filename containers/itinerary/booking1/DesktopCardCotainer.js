import React from 'react';
import styled from 'styled-components'


const Container = styled.div`

margin: auto;
padding: 0;
grid-template-columns: 1fr;
grid-template-rows: auto auto;
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 2rem;
    padding: 0.5rem;
}
@media (min-width: 768px) and (max-width: 1024px) {

}

`
;
const Cards = (props) => {


  return (
    <Container>
        {props.children}
    </Container>
  );
}

export default Cards;