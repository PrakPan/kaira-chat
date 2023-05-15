import React, { useState } from 'react';
import styled from 'styled-components';
import Results from './Results';

const Container = styled.div`
   padding: 1rem;
`;

const ResultsContainer= (props) => {
  const [filters, setFilters] = useState({
      all: true,
      locations: false,
        experiences: false,
        blogs: false,
  })

    return(
        <Container>
          
            <Results results={props.results} filters={filters}></Results>
        </Container>
    );
}

export default ResultsContainer;
