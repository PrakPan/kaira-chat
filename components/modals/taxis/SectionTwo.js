import React from "react";
import styled from "styled-components";
import FiltersMobile from "./filtersmobile/Index";

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {

  return (
    <Container className="font-lexend">
      <FiltersMobile
        filtersState={props.filtersState}
        _updateStarFilterHandler={props._updateStarFilterHandler}
        _removeFilterHandler={props._removeFilterHandler}
        _addFilterHandler={props._addFilterHandler}
        filters={props.FILTERS}
      ></FiltersMobile>
    </Container>
  );
};

export default Section;
