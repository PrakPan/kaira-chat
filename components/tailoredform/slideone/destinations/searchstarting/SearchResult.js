import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SearchInput from './Input';

const Container = styled.div`
width: 100%;
 border-radius: 10px;
 padding: 0.5rem;
 font-size: 0.85rem;
 margin-bottom: 0.25rem;
 background-color: white;

 &:hover{
    background-color: rgba(247,231,0, 0.2);
 }
  @media screen and (min-width: 768px){
 
}

`;

 
const SearchResult = (props) => {

  let isPageWide = media('(min-width: 768px)');
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  return (
   <Container className='border font-opensans hover-pointer' onClick={() => props.selectResult(props.text, props.place_id)}>
        {props.text}
    </Container>
  );
}


export default SearchResult;

