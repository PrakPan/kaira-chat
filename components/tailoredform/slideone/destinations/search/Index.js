 
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
    if(e.target.value)
    if(e.target.value.length > 1)
    axios.get(`https://apis.tarzanway.com/search/?q=`+e.target.value).then(res=>{
        if(res.data.length){
          setShowResults(true);
            setResults(res.data)
            // props._showSearchedLocations(res.data);
        }
        else setShowResults(false);

        // else props._showSearchedLocations([]);

    });
  }
  return (
   <Container>
        <SearchInput onfocus={props.onfocus} onblur={props.onblur} searchFinalized={props.searchFinalized} _handleKey={_handleKey}  setSearchFinalized={props.setSearchFinalized} setResults={setResults}  setShowResults={setShowResults}></SearchInput>
        {showResults && !props.searchFinalized? <SearchResults inbox_id={props.inbox_id} setDestination={props.setDestination} top="5.75rem" results={results} setSearchFinalized={props.setSearchFinalized} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities}></SearchResults> : null}
    </Container>
  );
}


export default Search;
 