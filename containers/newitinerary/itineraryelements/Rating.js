import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
const Container = styled.div`
  margin: ${(props) => (props.margin ? props.margin : '0')};
  @media screen and (min-width: 768px) {
  }
`;

const Rating = (props) => {
  useEffect(() => {}, []);

  return (
    <Container margin={props.margin} className="flex flex-row">
      <AiFillStar
        style={{ color: '#f7e700', marginRight: '0.25rem' }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: '#f7e700', marginRight: '0.25rem' }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: '#f7e700', marginRight: '0.25rem' }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: '#f7e700', marginRight: '0.25rem' }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: '#e4e4e4', marginRight: '0.25rem' }}
      ></AiFillStar>
    </Container>
  );
};

export default Rating;
