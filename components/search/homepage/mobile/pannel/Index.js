<<<<<<< HEAD
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
        axios.get(`https://dev.apis.tarzanway.com/search/?q=`+event.target.value).then(res=>{
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
=======
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import axios from 'axios';
import Locations from './Locations';
import * as ga from '../../../../../services/ga/Index';
import axioslocationsinstance from '../../../../../services/search/search'
import NewResults from './NewResults';
import {ImSearch} from 'react-icons/im'
import {MdCancel} from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx';

const Container = styled.div`
    background-color: white;
    border-radius: 2rem;
    height: 100vh;
    text-align: left;
    position: fixed;
    overflow : overlay;
top: 0;
width: 100%;
z-index: 1500;
// overflow: hidden;
@media screen and (min-width: 768px){
        width: 100%;
    }
    `;

const TopContainer = styled.div`
    border-style: none none solid none;
    position : fixed;
    background : white;
    border-width: 1px;
    border-color: #e4e4e4;
padding-right : 15px;
    height : 70px;
    margin: auto;
    display: grid;
    grid-template-columns: max-content auto;
`;
const SearchContainer = styled.div`
margin-block : auto;
`;
const Search = styled.input`
border: 1px solid #DDE2E4;
padding: 10px;
padding-inline : 50px;
border-radius: 6px;
position : relative;
width: 100%;
    &:focus{
        outline: none;
    }
&::placeholder{
  color  : black;  
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
    const [showResults, setShowResults] = useState(false);
    let [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const [hotLocationsData, setHotLocationsData] = useState();
    const [showP , setShowP] = useState(false)
    const _onChangeHandler = (event) => {
        setInputValue(event.target.value);
        if(event.target.value.length %3 === 0)
        ga.event({
            action: "HS-locationssearched",
            params : {
              'search_text': event.target.value
            }
          });
          setShowP(false)
          setShowResults(true);
          setResults(null);
          axios
            .get(
              `https://apis.tarzanway.com/search/suggest/?q=` +
                event.target.value
            )
            .then((res) => {
              if (res.data.length) {
                setResults(res.data.slice(0, 10));
                setShowResults(true);
                setShowP(false);
              } else {
                setShowP(true);
                setShowResults(false);
              }
            });
    }


    useEffect(() => {
      axioslocationsinstance.get("hot_destinations").then(response => {
        setHotLocationsData(response.data);
   });
       },[]);

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
            <RxCross2 onClick={props.setPannelClose} style={{fontSize: '1.8rem',textAlign: 'left', fontWeight: '500', margin: 'auto 0.7rem'}}/>
            <SearchContainer>
                    <Search autoFocus onChange={_onChangeHandler} value={inputValue} className="font-lexend" placeholder="Search Locations">
                    </Search>
                    <ImSearch style={{position : 'absolute' , top : '27px' , left : '73px', color : '#B0BABF' , pointerEvents : 'none'}} />
                    {inputValue !== '' &&<MdCancel onClick={()=>{setInputValue(''); setShowResults(false)}} style={{position : 'absolute' , top : '25px' , right : '25px',fontSize : '1.1rem', color : '#7A7A7A'}} />}
            </SearchContainer>
        </TopContainer>
        <div style={{marginTop  :'85px'}}>
        {showP && (inputValue != '') &&  <Text>We couldn't find anything for '{inputValue}'</Text>}

        {showResults ? <NewResults setPannelClose={props.setPannelClose} results={results} />:
        <Locations setPannelClose={props.setPannelClose} hotlocations={hotLocationsData}></Locations>}
        </div>
        </Container>
    );
}

export default SearchPannel;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
