import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
import SearchResult from './SearchResult';

//  import LocationsContainer from './LocationsContainer'
import axiossearchstartinginstance from '../../../../../services/search/startinglocation';

const Container = styled.div`
 `;
const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  left: 0;
  top: 2.5rem;
  z-index: 4;
 `;
const InputContainer = styled.input`
 &:focus{
    border: none;
    outline: none;
 }
 border: none;
 
  @media screen and (min-width: 768px){
 
}

`;

 
const SearchInput = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [loading, setLoading] = useState(false);
  const [resultsJSX, setResultsJSX] = useState([]);
  const [selected, setSelected] = useState(false);
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);

  const _selectResult  =(text) => {
    setSelected(text);
  }
  const _getResults = (query) => {
  axiossearchstartinginstance.get(
        `?q=`+query
      )
      .then((res) => {
        setLoading(false);

       console.log(res.data);
       let results = [];
       for(var i = 0 ; i < res.data.length; i++){
        results.push(
          <SearchResult selectResult={_selectResult} text={res.data[i].text}></SearchResult>
        );
       }
       setResultsJSX(results)
      //   setLocations(res.data);
      //  setLoaded(true);

      })
      .catch((error) => {
        setLoading(false);

        // alert('Page could not be loaded. Please try again.');
      });
    }
    const _handleClearResults = () => {
      setResultsJSX([]);
      setSelected(false);
    }
  return (
    <Container>
   {!selected ? <InputContainer placeholder='Search your location' className='font-opensans' autoFocus onChange={(e) => _getResults(e.target.value)}>
    
    </InputContainer>
    : <div className='font-opensans' onClick={_handleClearResults}>{selected}</div>}
    {!selected ? <ResultsContainer>
    {resultsJSX}
    </ResultsContainer> : null}

    </Container>

  );
}


export default SearchInput;

