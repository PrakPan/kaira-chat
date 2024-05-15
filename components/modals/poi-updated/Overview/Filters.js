import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 0.5rem 0 0 0;

  @media screen and (min-width: 768px) {
    width: 100%;
    margin: 0.5rem 0 0 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  @media screen and (min-width: 768px) {
    justify-content: center;
  }
`;

const Filter = styled.div`
  padding: 0.25rem 1rem;
  border-radius: 2rem !important;
  width: max-content;
  font-size: 0.75rem;
  margin: 0 0.5rem 0.5rem 0;
`;

const Filters = (props) => {
  let filters = [];
  if (props.experience_filters)
    if (props.experience_filters.length)
      for (var i = 0; i < props.experience_filters.length; i++) {
        filters.push(
          <Filter className="font-lexend border-thin">
            {props.experience_filters[i]}
          </Filter>
        );
      }

  return (
    <Container>
      <FlexContainer>{filters}</FlexContainer>
    </Container>
  );
};

export default Filters;
