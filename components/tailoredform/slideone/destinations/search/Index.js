import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';
import SearchResults from './results/Index';
import axios from 'axios';
const Container = styled.div`
 
width: 100%;
 
  @media screen and (min-width: 768px){
 
}

`;

 
const Search = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  // const [selectedCities, setSelectedCities] = useState([]);
  const _handleKey = (e) => {
    axios.get(`https://dev.apis.tarzanway.com/search/?q=`+e.target.value).then(res=>{
        if(res.data.length){
          setShowResults(true);
            console.log('res', res.data);
            setResults(res.data)
            // props._showSearchedLocations(res.data);
        }
        else setShowResults(false);

        // else props._showSearchedLocations([]);

    });
  }
  return (
   <Container>
        <SearchInput _handleKey={_handleKey}></SearchInput>
        {showResults ? <SearchResults top="5.75rem" results={results}></SearchResults> : null}
    </Container>
  );
}


export default Search;

