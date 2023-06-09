import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TbArrowBack } from 'react-icons/tb';
const Container = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  @media screen and (min-width: 768px) {
    width: 50vw;
  }
`;

const Section = (props) => {
  return (
    <Container className="font-lexend">
      <FontAwesomeIcon
        className="hover-pointer"
        icon={faChevronLeft}
        onClick={props.setHideFlightModal}
        style={{
          margin: '0.5rem',
          position: 'sticky',
          top: '0',
          visibility: 'hidden',
        }}
      ></FontAwesomeIcon>
      <TbArrowBack
        className="hover-pointer"
        icon={faChevronLeft}
        style={{
          margin: '0.5rem',
          position: 'sticky',
          top: '0',
          fontSize: '1.75rem',
        }}
        onClick={props.setHideFlightModal}
      ></TbArrowBack>
    </Container>
  );
};

export default Section;
