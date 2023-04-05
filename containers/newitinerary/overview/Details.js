import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../../../components/ui/button/Index';
const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  max-width: 100vw;
  overflow-x: hidden;
  grid-gap: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content max-content max-content max-content max-content max-content;
    grid-column-gap: 2.5rem;
  }
`;

const Heading = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #7a7a7a;
  margin: 0;
`;
const Text = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;
const Details = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-poppins">
      {props.group_type !== null ? (
        <div style={{ width: 'max-content' }}>
          <Heading>Group Type</Heading>
          <Text>{props.group_type}</Text>
        </div>
      ) : null}

      {props.duration_time != null ? (
        <div style={{ width: 'max-content' }}>
          <Heading>Duration</Heading>
          <Text>{props.duration_time} Nights</Text>
        </div>
      ) : null}

      {props.travellerType != null ? (
        <div style={{ width: 'max-content' }}>
          <Heading>Type of Travel</Heading>
          <Text>
            {props.travellerType[0]}{' '}
            {props.travellerType.length - 1 <= 0
              ? null
              : `+${props.travellerType.length - 1}`}
          </Text>
        </div>
      ) : null}

      {/* <div style={{ width: 'max-content' }}>
        <Heading>Destination</Heading>
        <Text>Rajasthan</Text>
      </div> */}
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
