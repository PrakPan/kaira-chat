import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes} from '@fortawesome/free-solid-svg-icons';
import Results from './results/Index';
import Locations from './Locations';
import * as ga from '../../../../../services/ga/Index';
const Container = styled.div`
    background-color: white;
    border-radius: 2rem;
    height: 100vh;
    text-align: left;
    position: fixed;
top: 0;
width: 100%;
z-index: 1100;
overflow: hidden;
@media screen and (min-width: 768px){
        width: 100%;
    }
    `;

const TopContainer = styled.div`
    border-style: none none solid none;
    border-width: 1px;
    border-color: #e4e4e4;
    width: 95%;
    margin: auto;
    display: grid;
    grid-template-columns: max-content auto;
`;
const SearchContainer = styled.div`
    display: flex;
    align-items: center;
`;
const Search = styled.input`
    border: none !important;
    &:focus{
        outline: none;
    }
    
`;

const SearchPannel= (props) => {
  let isPageWide = media('(min-width: 768px)')
    const [showResults, setShowResults] = useState(false);
    let [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);

    const _onChangeHandler = (event) => {
        if(event.target.value.length %3 === 0)
        ga.event({
            action: "HS-locationssearched",
            params : {
              'search_text': event.target.value
            }
          });
        setInputValue(event.target.value);
        axios.get(`https://apis.tarzanway.com/search/?q=`+event.target.value).then(res=>{
            if(res.data.length){
                setResults(res.data);
                setShowResults(true);
            }
            else setShowResults(false);
        });
    }
    return(
        <Container className="">
    <style jsx global>
  {`
      body {
        margin: 0 !important; 
        height: 100% !important; 
        overflow: hidden !important;
       }
   `}
</style>
       <TopContainer>
            <FontAwesomeIcon style={{textAlign: 'left'}} icon={faChevronLeft} onClick={props.setPannelClose} style={{fontSize: '1.5rem', fontWeight: '300', margin: '1.5rem'}}></FontAwesomeIcon>
            <SearchContainer>
                    <Search autoFocus onChange={_onChangeHandler} value={inputValue} className="font-opensans" placeholder="Search Locations"></Search>
            </SearchContainer>
        </TopContainer>
        {!showResults ? <Locations hotlocations={props.hotlocations}></Locations> : <Results results={results}></Results>}
        </Container>
    );
}

export default SearchPannel;
