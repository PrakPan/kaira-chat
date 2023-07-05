import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes} from '@fortawesome/free-solid-svg-icons';
import Results from './results/Index';
import Locations from './Locations';
import * as ga from '../../../../../services/ga/Index';
import axioslocationsinstance from '../../../../../services/search/search'
import axiossearchsuggestinstance from '../../../../../services/search/searchsuggest'
const Container = styled.div`
    background-color: white;
    border-radius: 2rem !important;
    text-align: left;
    position: absolute;
width: 50%;
margin: -6vh  auto;
z-index: 2;
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
    const [showResults, setShowResults] = useState(false);
    let [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
const [hotLocationsData, setHotLocationsData] = useState();


    const _onChangeHandler = (event) => {
        if(event.target.value.length %3 === 0)
        {process.env.NODE_ENV === 'production' && 
        ga.event({
            action: "HS-locationssearched",
            params : {
              'search_text': event.target.value
            }
          });}
        setInputValue(event.target.value);
        axiossearchsuggestinstance
          .get(`?q=` + event.target.value)
          .then((res) => {
            if (res.data.length) {
              setResults(res.data.slice(0, 10));
              setShowResults(true);
            } else setShowResults(false);
          });
    }
    const ref=useRef();

    useEffect(() => {

    const checkIfClickedOutside = e => {
        if ( ref.current && !ref.current.contains(e.target)) {
            props.setPannelClose();
        }
      }
    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside)

    };
},[]);


    useEffect(() => {
      axioslocationsinstance.get("hot_destinations").then(response => {
        setHotLocationsData(response.data);
   });
       },[]);

    return(
        <Container className="border"  ref={ref}>

       <TopContainer>
            <FontAwesomeIcon icon={faChevronLeft} onClick={props.setPannelClose} style={{textAlign: 'left',fontSize: '1.5rem', fontWeight: '300', margin: '1.5rem'}}></FontAwesomeIcon>
            <SearchContainer>
                    <Search autoFocus onChange={_onChangeHandler} value={inputValue} className="font-lexend" placeholder="Search Locations" ></Search>
            </SearchContainer>
        </TopContainer>
        {!showResults ? <Locations hotlocations={hotLocationsData}></Locations> : <Results results={results}></Results>}
        </Container>
    );
}

export default SearchPannel;
