<<<<<<< HEAD
import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
 
=======
import React from 'react';
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'

import axios from 'axios'
const Container = styled.input`
 &:focus{
    border: solid 1px #dedede;
    outline: none;
    border-radius: 8px;
 }
 font-size: 14px;
 margin: 0.5rem 0;
 padding: 0.5rem;
 border: solid 1px #dedede;
 border-radius: 8px;

 width: 100%;
  @media screen and (min-width: 768px){
 
}

`;

 
const SearchInput = (props) => {

<<<<<<< HEAD
  let isPageWide = media('(min-width: 768px)');

  const _handleKey = (e) => {
    axios.get(`https://dev.apis.tarzanway.com/search/?q=`+e.target.value+"&parent=Himachal Pradesh").then(res=>{
        if(res.data.length){
            console.log('res', res.data);
=======

  const _handleKey = (e) => {
    axios.get(`https://apis.tarzanway.com/search/?q=`+e.target.value+"&parent=Himachal Pradesh").then(res=>{
        if(res.data.length){
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
            props._showSearchedLocations(res.data);
        }
        // else setShowResults(false);

        else props._showSearchedLocations([]);

    });
  }
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);

  return (
<<<<<<< HEAD
   <Container placeholder='Search cities' className='font-opensans' autoFocus onChange={(event) => _handleKey(event)} >
=======
   <Container placeholder='Search cities' className='font-lexend' autoFocus onChange={(event) => _handleKey(event)} >
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
    
    </Container>
  );
}


export default SearchInput;

