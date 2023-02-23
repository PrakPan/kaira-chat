import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
 
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

  let isPageWide = media('(min-width: 768px)');
//   const [loaded, setLoaded] = useState(false);

    const [open, setOpen] = useState(false);
  return (
    <Container>
        {!open ? 
        <ClosedContainer onClick={() => setOpen(true)}>
            <AiOutlineSearch></AiOutlineSearch>
            Filter Cities
        </ClosedContainer>    
        : <SearchInput></SearchInput>
    }
           </Container>
  );
}


export default Search;

