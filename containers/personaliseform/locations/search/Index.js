import React, { useState , useEffect}  from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faMagnif} from '@fortawesome/free-solid-svg-icons';
import { BiSearchAlt2 } from 'react-icons/bi';
import axios from 'axios';
import Locations from './Locations';
import SearchResult  from './SearchResult';
import SelectedCity  from './SelectedCity';
import SelectedCitiesContainer from './SelectedCitiesContainer';
import axioslocationsinstance from '../../../../services/poi/hotlocations';
import {CONTENT_SERVER_HOST} from '../../../../services/constants';
import media from '../../../../components/media';
import Location from './Location';
import * as ga from '../../../../services/ga/Index';
import { useRouter } from 'next/router'

const ResultsContainer = styled.div`
border-radius: 5px;
padding-bottom: 10vh;
@media screen and (min-width: 768px){
    padding-bottom: 0;
}
`;
const SearchGrid = styled.div`
    display: grid;
    grid-template-columns: 10fr 2fr;
    margin-bottom: 1rem;
    border-radius: 2rem;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    @media screen and (min-width: 768px){
        grid-template-columns: 10fr 1fr;

        margin-bottom: 0.5rem;
    }
    `;
    const Search = styled.input`
        padding: 1rem;
        border-radius: 2rem 0rem 0rem 2rem;
        border: none;

        &:focus{
            outline: none;

        }
    `;
    const IconContainer = styled.div`
        background-color: #f7e700;
        border-radius: 0rem 2rem 2rem 0rem;

    `;
    const TopLocations = styled.p`
        font-weight: 700;
        letter-spacing: 1px;
        font-size: 1rem;
        padding: 0rem;
        margin: 1.5rem 0 0 0;

    `;
   const Results  = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-gap: 0.75rem;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
}
   `;
const SearchField = (props) => {
    let isPageWide = media('(min-width: 768px)')
    const router = useRouter();

    const [autofocus, setAutoFocus] = useState(false);
    const [value, setValue] = useState('');
    const [results, setResults] = useState([]);
    const [results_data, setResultsData] = useState(false);
    useEffect(() => {

    if(router.query.search_text){
        setValue(router.query.search_text);
        _fetchResults(router.query.search_text)
    }
},[router.query]);

    const _handleChange = (event) => {
        let newanswers = props.answers;
        newanswers[0]=event.target.value;
        props.setAnswers(newanswers);
        if(event.key === 'Enter') props.nextQuestionHandler();
        
    }
   
    const _handleSearch = (event) => {
        // if(event.key === 'd') props._setOptionsHandler(0);
        // else props._setOptionsHandler(1);
    }
    const _fetchResults = (value) => {
        let resultsarr = [];

        axios.get(CONTENT_SERVER_HOST+"/search/?q="+value).then((res) => {
            // props._setOptionsHandler(res);
            setResultsData(res.data);

            for(var i = 0 ; i < res.data.length ; i++){
                resultsarr.push(
                    <Location _removeCityHandler={props._removeCityHandler} selectedCities={props.selectedCities} location={res.data[i]["_source"]} key={i} image={res.data[i].image} _addCityHandler={props._addCityHandler} name={res.data[i]["_source"].name} parent={res.data[i]["_source"].parent} id={res.data[i]["_source"].resource_id}></Location>
                )
            }
            setResults([...resultsarr]);
      }).catch((error) => {
  
      })
    }
    const _handleChangeNew = (event) => {
        if(event.target.value.length %3 === 0)
        ga.event({
            action: "tailored-form-locationssearched",
            params : {
              'search_text': event.target.value
            }
          });
        setValue(event.target.value);
        setAutoFocus(true);
        _fetchResults(event.target.value)

        
    }
    const [loaded, setLoaded] = useState(false);
    const [hotLocationsData, setHotLocationsData] = useState();

    const _reRenderLocations = (results) => {
        let resultsarr = [];
        for(var i = 0 ; i < results.length ; i++){
            resultsarr.push(
                <Location _removeCityHandler={props._removeCityHandler} selectedCities={props.selectedCities} location={results[i]["_source"]} key={i} image={results[i].image} _addCityHandler={props._addCityHandler} name={results[i]["_source"].name} parent={results[i]["_source"].parent} id={results[i]["_source"].resource_id}></Location>
            )
        }
        setResults([...resultsarr]);
    }
    useEffect(() => {
        if(results_data)
        _reRenderLocations(results_data);
      },[props.selectedCities]);

   useEffect(() => {
        axioslocationsinstance.get("").then(response => {
                setHotLocationsData(response.data);
                setLoaded(true);           
            });
      },[]);
    
    

    return(
        <div>
        <SearchGrid className="border-thin">
                <Search autoComplete='off' autoCorrect='off' autoFocus={autofocus} type="text" id="fname" name="fname" className="font-nunito" placeholder="Search locations"  onChange={(event) => _handleChangeNew(event)} value={value} ></Search>
                <IconContainer className="center-div"><BiSearchAlt2 style={{fontSize: '1.5rem'}}></BiSearchAlt2></IconContainer>
        </SearchGrid>
        {!isPageWide ?  <SelectedCitiesContainer questionIndex={props.questionIndex} goToStart={props.goToStart} selectedCities={props.selectedCities} _removeCityHandler={props._removeCityHandler} ></SelectedCitiesContainer>:null}

        <TopLocations className="font-opensans text-center">{!results.length ? 'Top destinations for you' : 'Destinations around '+ "'"+value+"'"}</TopLocations>
        {!results.length ? <Locations _removeCityHandler={props._removeCityHandler} selectedCities={props.selectedCities} hotlocations={hotLocationsData} _addCityHandler={props._addCityHandler}></Locations>:null}
        {results.length ? <ResultsContainer className="border-thi">
            
            {/* <div className="border-thin" style={{margin: '1rem 0.5rem'}}></div> */}
            <Results style={{paddingTop: !results.length? '0' : '1rem'}}>
                {results}
                {!results.length && value? <SearchResult key={value} _addCityHandler={props._addCityHandler} location={value} newcity ></SearchResult>:null}
            </Results>

        </ResultsContainer>
        : null}

        </div>
    );
   
}

export default (SearchField);