import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import axios from 'axios';
import NewResults from './NewResults';
import Locations from './Locations';
import * as ga from '../../../../../services/ga/Index';
import { ImSearch } from 'react-icons/im';
import { MdCancel } from 'react-icons/md';
const Container = styled.div`
    background-color: white;
    border-radius: 5px 5px 1rem 1rem !important;
    text-align: left;
    position: absolute;
width: 37%;
top : 15px;
left : 32%;
z-index: 2;
    `;

const TopContainer = styled.div`
    border-style: none none solid none;
    border-width: 1px;
    border-color: #e4e4e4;
    width: 98%;
    margin: auto;
    margin-left : 5px;
    height : 50px;
`;
const SearchContainer = styled.div`
width : 100%;
margin-block : auto;
    position : absolute;
`;
const Search = styled.input`
    border: none !important;
    width: 70%;
    margin-top: 12px;
    margin-inline: 35px;
    &:focus{
        outline: none;
    }
`;
const Text = styled.div`
font-weight: 400;
margin: 1.5rem;
font-size: 12px;
color: #7e7e7e;
font-size : 1rem;
`

const SearchPannel= (props) => {
  let isPageWide = media('(min-width: 768px)')
    const [showResults, setShowResults] = useState(false);
    let [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const [showP , setShowP] = useState(false)
    const _onChangeHandler = (event) => {
        if(event.target.value.length %3 === 0)
        ga.event({
            action: "HS-locationssearched",
            params : {
              'search_text': event.target.value
            }
          });
          setShowP(false)

        setInputValue(event.target.value);
        setResults(null)
        axios.get(`https://apis.tarzanway.com/search/?q=`+event.target.value).then(res=>{
            if(res.data.length){
                setResults(res.data);
                setShowResults(true)
                setShowP(false)
            }
            else {
                setShowP(true) 
                setShowResults(false)
            };
        });
    }
    const ref=useRef();

    useEffect(() => {

    const checkIfClickedOutside = e => {
        if ( ref.current && !ref.current.contains(e.target)) {
            // if(!isPageWide)  props._hideMenu();
            props.setPannelClose();
        }
      }
    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside)

    };
},[]);
    return(
        <Container className="border"  ref={ref}>
       <TopContainer>
            <SearchContainer>
                    <Search autoFocus onChange={_onChangeHandler} value={inputValue} className="font-lexend" placeholder="Search by destination (country, region or city)" ></Search>
                    <ImSearch style={{position : 'absolute' , top : '17px' , left : '8px', color : '#B0BABF' , pointerEvents : 'none'}} />
                    {inputValue !== '' &&<MdCancel onClick={()=>{setInputValue(''); setShowResults(false)}} style={{position : 'absolute' , top : '13px' , right : '35px',fontSize : '1.4rem', color : '#7A7A7A', cursor : 'pointer'}} />}
            </SearchContainer>
        </TopContainer>
        {showP && (inputValue != '') && <Text>We couldn't find anything for '{inputValue}'</Text>}
        {showResults ? <NewResults setPannelClose={props.setPannelClose} results={results} inputValue={inputValue} /> : 
        <Locations setPannelClose={props.setPannelClose} hotlocations={props.hotlocations}></Locations>}
        </Container>
    );
}

export default SearchPannel;
