import React, { useState } from "react";
import styled from "styled-components";
import Results from "./Results";

const Container = styled.div`
  padding: 0 1rem;
  overflow-x: hidden;
`;
const ResultsContainer = (props) => {
  const [filters, setFilters] = useState({
    all: true,
    locations: false,
    experiences: false,
    blogs: false,
  });

  return (
    <Container>
      <Results filters={filters} results={props.results}></Results>
    </Container>
  );
};

export default ResultsContainer;
