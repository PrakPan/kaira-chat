<<<<<<< HEAD
import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
 
=======
import React, {useState } from 'react';
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
import styled from 'styled-components';
import {AiOutlineSearch} from 'react-icons/ai';
import SearchInput from './Input';
 
 const Container = styled.div`
 
 `;


 const ClosedContainer = styled.div`
    display: flex;
    border-style: none none solid none;
    color: #DEDEDE;
    align-items: center;
    font-size: 14px;
    margin: 0.5rem auto;
    justify-content: center;
    width: 90%;
    padding: 0.5rem;

 `;

 
const Search = (props) => {

<<<<<<< HEAD
  let isPageWide = media('(min-width: 768px)');
//   const [loaded, setLoaded] = useState(false);

=======
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
    const [open, setOpen] = useState(false);
  return (
    <Container>
        {!open ? 
        <ClosedContainer onClick={() => setOpen(true)}>
            <AiOutlineSearch></AiOutlineSearch>
            Filter Cities
        </ClosedContainer>    
        : <SearchInput _showSearchedLocations={props._showSearchedLocations}></SearchInput>
    }
           </Container>
  );
}


export default Search;

