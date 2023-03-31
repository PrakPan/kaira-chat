import styled from 'styled-components';
import { useState, useEffect } from 'react';
import City from './City';
const Container = styled.div``;

const Cities = (props) => {
  useEffect(() => {}, []);
  const cityData = [
    {
      city: 'Jodhpur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
    {
      city: 'udaipur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
    {
      city: 'jaipur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
  ];
  return (
    <Container>
      <City cityData={cityData[0]}></City>
      <City cityData={cityData[0]}></City>
      <City cityData={cityData[0]}></City>
    </Container>
  );
};

export default Cities;
