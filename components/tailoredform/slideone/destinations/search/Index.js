import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';
import SearchResults from './results/Index';
const Container = styled.div`
 
width: 100%;
 
  @media screen and (min-width: 768px){
 
}

`;

 
const Search = (props) => {

  let isPageWide = media('(min-width: 768px)');
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  return (
   <Container>
        <SearchInput></SearchInput>
        <SearchResults top="5.75rem"></SearchResults>
    </Container>
  );
}


export default Search;

