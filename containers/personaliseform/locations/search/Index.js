import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BiSearchAlt2 } from "react-icons/bi";
import Locations from "./Locations";
import SearchResult from "./SearchResult";
import SelectedCitiesContainer from "./SelectedCitiesContainer";
import axioslocationsinstance from "../../../../services/poi/hotlocations";
import axiossearchsuggestinstance from "../../../../services/search/searchsuggest";
import { CONTENT_SERVER_HOST } from "../../../../services/constants";
import media from "../../../../components/media";
import Location from "./Location";
import * as ga from "../../../../services/ga/Index";
import { useRouter } from "next/router";

const ResultsContainer = styled.div`
  border-radius: 5px;
  padding-bottom: 10vh;
  @media screen and (min-width: 768px) {
    padding-bottom: 0;
  }
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 10fr 2fr;
  margin-bottom: 1rem;
  border-radius: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 10fr 1fr;

    margin-bottom: 0.5rem;
  }
`;

const Search = styled.input`
  padding: 1rem;
  border-radius: 2rem 0rem 0rem 2rem;
  border: none;

  &:focus {
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

const Results = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.75rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const SearchField = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [autofocus, setAutoFocus] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [results_data, setResultsData] = useState(false);
  const [hotLocationsData, setHotLocationsData] = useState();

  useEffect(() => {
    if (router.query.search_text && router.query.search_text !== "null") {
      setValue(router.query.search_text);
      _fetchResults(router.query.search_text);
    }
  }, [router.query]);

  useEffect(() => {
    if (results_data) _reRenderLocations(results_data);
  }, [props.selectedCities]);

  useEffect(() => {
    axioslocationsinstance.get("").then((response) => {
      setHotLocationsData(response.data);
    });
  }, []);

  const _fetchResults = (value) => {
    let resultsarr = [];

    axiossearchsuggestinstance
      .get("?q=" + value)
      .then((res) => {
        setResultsData(res.data);
        for (var i = 0; i < Math.min(15, res.data.length); i++) {
          resultsarr.push(
            <Location
              _removeCityHandler={props._removeCityHandler}
              selectedCities={props.selectedCities}
              location={res.data[i]}
              key={i}
              image={res.data[i].image}
              _addCityHandler={props._addCityHandler}
              name={res.data[i].name}
              parent={res.data[i].parent}
              id={res.data[i].resource_id}
              type={res.data[i].type}
            ></Location>
          );
        }
        setResults([...resultsarr]);
      })
      .catch((error) => {});
  };

  const _handleChangeNew = (event) => {
    if (event.target.value.length % 3 === 0) {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "tailored-form-locationssearched",
          params: {
            search_text: event.target.value,
          },
        });
    }
    setValue(event.target.value);
    setAutoFocus(true);
    _fetchResults(event.target.value);
  };

  const _reRenderLocations = (results) => {
    let resultsarr = [];
    for (var i = 0; i < results.length; i++) {
      resultsarr.push(
        <Location
          _removeCityHandler={props._removeCityHandler}
          selectedCities={props.selectedCities}
          location={results[i]}
          key={i}
          image={results[i].image}
          _addCityHandler={props._addCityHandler}
          name={results[i].name}
          parent={results[i].parent}
          id={results[i].resource_id}
          type={results[i].type}
        ></Location>
      );
    }
    setResults([...resultsarr]);
  };

  return (
    <div>
      <SearchGrid className="border-thin">
        <Search
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autofocus}
          type="text"
          id="fname"
          name="fname"
          className="font-nunito"
          placeholder="Search locations"
          onChange={(event) => _handleChangeNew(event)}
          value={value}
        ></Search>
        
        <IconContainer className="center-div">
          <BiSearchAlt2 style={{ fontSize: "1.5rem" }}></BiSearchAlt2>
        </IconContainer>
      </SearchGrid>

      {!isPageWide ? (
        <SelectedCitiesContainer
          questionIndex={props.questionIndex}
          goToStart={props.goToStart}
          selectedCities={props.selectedCities}
          _removeCityHandler={props._removeCityHandler}
        ></SelectedCitiesContainer>
      ) : null}

      <TopLocations className="font-lexend text-center">
        {!results.length
          ? "Top destinations for you"
          : "Destinations around " + "'" + value + "'"}
      </TopLocations>

      {!results.length ? (
        <Locations
          _removeCityHandler={props._removeCityHandler}
          selectedCities={props.selectedCities}
          hotlocations={hotLocationsData}
          _addCityHandler={props._addCityHandler}
        ></Locations>
      ) : null}

      {results.length ? (
        <ResultsContainer className="border-thi">
          <Results style={{ paddingTop: !results.length ? "0" : "1rem" }}>
            {results}
            {!results.length && value ? (
              <SearchResult
                key={value}
                _addCityHandler={props._addCityHandler}
                location={value}
                newcity
              ></SearchResult>
            ) : null}
          </Results>
        </ResultsContainer>
      ) : null}
    </div>
  );
};

export default SearchField;
