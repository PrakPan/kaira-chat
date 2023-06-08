 
import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';
import SearchResults from './results/Index';
import HotLocations from './results/HotLocations';
import axios from 'axios';
import Spinner from '../../../../Spinner';
import axioslocationsinstance from '../../../../../services/search/search'
import { useRouter } from 'next/router';
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
  const [hotLocationsData, setHotLocationsData] = useState([]);
  const [showHotLocations, setShowHotLocations] = useState(false)
  const {query} = useRouter()
  // const [selectedCities, setSelectedCities] = useState([]);
  const _handleKey = (e) => {
    
    if(e.target.value === '') setShowHotLocations(true);
    if(e.target.value)
    if(e.target.value.length > 1)
    {
    setShowHotLocations(false);
    setShowResults(true);
      setLoading(true)
      axios
        .get(`https://apis.tarzanway.com/search/suggest/?q=` + e.target.value)
        .then((res) => {
          setLoading(false);
          if (res.data.length) {
            // const resultsData = res.data.map((e) => e["_source"]);
            setResults(res.data.slice(0, 5));
          } else {
            setShowResults(false);
            setShowHotLocations(true);
          }

          // else props._showSearchedLocations([]);
        })
        .catch((error) => {
          setLoading(false);
          setShowResults(true);
          setResults({
            type: "error",
            data: (
              <div style={{ margin: "1rem" }}>
                Something went wrong! Please try again later.
              </div>
            ),
          });
        });
}
  }
  useEffect(() => {
    if (query.city || query.link) {
      axios
        .get(
          `https://apis.tarzanway.com/poi/city/recommended/?slug=${
            query.city || query.link
          }`

        )
        .then((res) => {
          if (res.data.length) setHotLocationsData(res.data);
          else setShowHotLocations(false);
        })
        .catch((e) => setShowHotLocations(false));
    } else
      axioslocationsinstance
        .get("hot_destinations")
        .then((response) => {
          if (response.data.length) setHotLocationsData(response.data);
          else setShowHotLocations(false);
        })
        .catch((e) => {
          setShowHotLocations(false);
        });
     }, []);
  // useEffect(() => {
  //   if (showResults) setShowHotLocations(false)
  //   else setShowHotLocations(true)
  // },[showResults])
  return (
    <Container>
      <div style={{ display: "flex" }}>
        <SearchInput
          setShowDestination={props.setShowDestination}
          showHotLocations={showHotLocations}
          destination={props.destination}
          onfocus={() => {
            props.onfocus();
            setTimeout(() => {
            setShowHotLocations(true);
            },500)
          }}
          onblur={props.onblur}
          searchFinalized={props.searchFinalized}
          inbox_id={props.inbox_id}
          _handleKey={_handleKey}
          setSearchFinalized={props.setSearchFinalized}
          setResults={setResults}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
          setShowResults={setShowResults}
          autofocus={props.autofocus}
        ></SearchInput>

        {/* {loading ? <Spinner size={16} margin="0"></Spinner> : null} */}
      </div>
      {showResults && (
        <SearchResults
          _updateDestinationHandler={props._updateDestinationHandler}
          setFocusSearch={props.setFocusSearch}
          loading={loading}
          setShowResults={setShowResults}
          inbox_id={props.inbox_id}
          setDestination={props.setDestination}
          top="2.75rem"
          results={results}
          setSearchFinalized={props.setSearchFinalized}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
        ></SearchResults>
      )}
      {showHotLocations && (
        <SearchResults
          hotLocations
          _updateDestinationHandler={props._updateDestinationHandler}
          setFocusSearch={props.setFocusSearch}
          loading={loading}
          setShowResults={setShowHotLocations}
          inbox_id={props.inbox_id}
          setDestination={props.setDestination}
          top="2.75rem"
          results={hotLocationsData}
          setSearchFinalized={props.setSearchFinalized}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
        ></SearchResults>
      
      )} 
    </Container>
  );
}


export default Search;
 