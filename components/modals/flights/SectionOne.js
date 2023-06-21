import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TbArrowBack } from 'react-icons/tb';
import { CgClose } from 'react-icons/cg';
const Container = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-between;
  width: 95%;
  margin-block : 0.75rem;
`;

const Section = (props) => {
  return (
    <Container className="font-lexend">
      {/* <FontAwesomeIcon
        className="hover-pointer"
        icon={faChevronLeft}
        onClick={props.setHideFlightModal}
        style={{
          margin: "0.5rem",
          position: "sticky",
          top: "0",
          visibility: "hidden",
        }}
      ></FontAwesomeIcon>
      <TbArrowBack
        className="hover-pointer"
        icon={faChevronLeft}
        style={{
          margin: "0.5rem",
          position: "sticky",
          top: "0",
          fontSize: "1.75rem",
        }}
        onClick={props.setHideFlightModal}
      ></TbArrowBack> */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <CgClose
          onClick={props.setHideFlightModal}
          className="hover-pointer"
          style={{
            fontSize: "1.75rem",
            marginLeft: "-5px",
          }}
        ></CgClose>
        <div style={{ fontSize: "16px" }}>{props.text}</div>
      </div>
    </Container>
  );
};

export default Section;
