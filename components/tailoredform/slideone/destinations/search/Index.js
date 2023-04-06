 
import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';
import SearchResults from './results/Index';
import axios from 'axios';
import Spinner from '../../../../Spinner';
const Container = styled.div`
 
width: 100%;
 
  @media screen and (min-width: 768px){
 
}

`;

 
const Search = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [selectedCities, setSelectedCities] = useState([]);
  const _handleKey = (e) => {
    
    if(e.target.value)
    if(e.target.value.length > 1)
    {
      setLoading(true)
      setShowResults(true);
      axios.get(`https://apis.tarzanway.com/search/?q=`+e.target.value).then(res=>{
      setLoading(false)  
      if(res.data.length){
          // setShowResults(true);
            setResults(res.data)
            // props._showSearchedLocations(res.data);
        }
        else setShowResults(false);

        // else props._showSearchedLocations([]);

    }).catch(e=>setLoading(false))
    
    ;}
  }
  return (
   <Container>
    <div style={{display: 'flex'}}>
    <SearchInput setShowDestination={props.setShowDestination} destination={props.destination} onfocus={props.onfocus} onblur={props.onblur} searchFinalized={props.searchFinalized} inbox_id={props.inbox_id} _handleKey={_handleKey}  setSearchFinalized={props.setSearchFinalized} setResults={setResults} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities} setShowResults={setShowResults}></SearchInput>
    {loading ? <Spinner size={16} margin="0"></Spinner> : null}
    </div>
        {showResults && !props.searchFinalized? <SearchResults _updateDestinationHandler={props._updateDestinationHandler} setFocusSearch={props.setFocusSearch} loading={loading} setShowResults={setShowResults} inbox_id={props.inbox_id} setDestination={props.setDestination} top="2.75rem" results={results} setSearchFinalized={props.setSearchFinalized} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities}></SearchResults> : null}
    </Container>
  );
}


export default Search;
 