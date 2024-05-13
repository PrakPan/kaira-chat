import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-block: 1rem;
  margin-left: 10px;
  border-radius: 50px;
  &:hover {
    background: #f0f0f0;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 10px;
  padding-top: 10px;
`;

const Text = styled.div`
font-weight : 500;
}
`;

const SearchResult = (props) => {
  return (
    <Container
      className="font-lexend hover-pointer"
      onClick={(event) => props.selectResult(event, props.text, props.place_id)}
    >
      <MarkerContainer>
        <FaMapMarkerAlt />
      </MarkerContainer>
      <Text>{props.text}</Text>
    </Container>
  );
};

export default SearchResult;
