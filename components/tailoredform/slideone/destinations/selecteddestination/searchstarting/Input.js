import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'


const Container = styled.input`
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
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  return (
   <Container placeholder='Search your location' className='font-opensans' autoFocus>
    
    </Container>
  );
}


export default SearchInput;

