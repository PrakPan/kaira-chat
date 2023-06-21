import React from 'react';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';
const Container = styled.div`
  margin: 0;
  display: flex;
  gap : 0.5rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
  }
`;
const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const Section = (props) => {
  return (
    <Container className=" font-lexend">
      <IoMdClose
        className="hover-pointer"
        onClick={props.setHideFlightModal}
        style={{ fontSize: "2rem" }}
      ></IoMdClose>
      <Text>{props.text}</Text>
    </Container>
  );
};

export default Section;
