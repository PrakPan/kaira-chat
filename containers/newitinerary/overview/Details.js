import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../../../components/ui/button/Index';
import { convertDateFormat } from '../../../helper/ConvertDateFormat';
import { format, parseISO } from 'date-fns';
const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  max-width: 100vw;
  overflow-x: auto;
  grid-gap: 1rem;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content max-content max-content max-content max-content max-content;
    grid-column-gap: 2.5rem;
  }
`;
const convertDFormat = (dt) => {
  const date = parseISO(dt);
  const formattedDate = format(date, 'MMMM do');
  return formattedDate;
};
const Heading = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #7a7a7a;
  margin: 0;
`;
const Text = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
`;
const Details = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-lexend">
      <div style={{ width: 'max-content' }}>
        <Heading>Destination</Heading>
        <Text>Rajasthan</Text>
      </div>
      <div style={{ width: 'max-content' }}>
        <Heading>Type of Travel</Heading>
        <Text>Adventure</Text>
      </div>
      <div style={{ width: 'max-content' }}>
        <Heading>Group Type</Heading>
        <Text>Friends</Text>
      </div>
      <div style={{ width: 'max-content' }}>
        <Heading>Duration</Heading>
        <Text>5 Nights</Text>
      </div>
      <div style={{ width: 'max-content' }}>
        <Heading>Destination</Heading>
        <Text>Rajasthan</Text>
      </div>
      <div className="hidden-mobile">
        <Button
          borderRadius="6px"
          borderWidth="1.5px"
          onclick={() => console.log('')}
        >
          Trip Settings
        </Button>
      </div>
    </Container>
  );
};

export default Details;
