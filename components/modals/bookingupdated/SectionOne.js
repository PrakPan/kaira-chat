import React from 'react';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';
const Container = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
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
        onClick={props.setHideBookingModal}
        style={{ fontSize: '2rem' }}
      ></IoMdClose>
      <Text>
        Changing Stays in {props?.booking_city ? props?.booking_city : 'City'}
      </Text>
    </Container>
  );
};

export default Section;
