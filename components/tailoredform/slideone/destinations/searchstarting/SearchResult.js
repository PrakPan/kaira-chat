import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";

const Container = styled.div`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 16px;
  align-items: center;
  border-radius: 4px;
  &:hover {
    background: #FEFFC0;
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
      className=" hover-pointer px-2 py-[4px]"
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
