import * as React from 'react';
import styled from 'styled-components'

const Container = styled.div`

`;
const Heading = styled.p`
    font-weight: 700 !important;
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    letter-spacing: 1px;
`;

export default function CheckboxLabels(props) {
  return (
   <Container>
       <Heading className="font-opensans">{props.heading}</Heading>
   </Container>
  );
}
