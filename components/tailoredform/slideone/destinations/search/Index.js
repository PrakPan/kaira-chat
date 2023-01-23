import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';

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
    </Container>
  );
}


export default Search;

