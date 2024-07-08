import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchInput from "./Input";
import SearchResults from "./results/Index";
import axioslocationsinstance from "../../../../../services/search/search";
import axiossearchsuggestinstance from "../../../../../services/search/searchsuggest";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 100%;

  @media screen and (min-width: 768px) {
  }
`;

const Search = (props) => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotLocationsData, setHotLocationsData] = useState([]);
  const [showHotLocations, setShowHotLocations] = useState(false);
  const { query } = useRouter();

  const _handleKey = (value) => {
    if (value === "") setShowHotLocations(true);
    if (value)
      if (value.length > 1) {
        setShowHotLocations(false);
        setShowResults(true);
        setLoading(true);
        axiossearchsuggestinstance
          .get(`?q=` + value)
          .then((res) => {
            setLoading(false);
            if (res.data.length) {
              setResults(res.data.slice(0, 5));
            } else {
              setShowResults(false);
              setShowHotLocations(true);
            }
          })
          .catch((error) => {
            setLoading(false);
            setShowResults(true);
            setResults({
              type: "error",
              data: (
                <div style={{ margin: "1rem" }}>
                  Something went wrong! Please try again later.
                </div>
              ),
            });
          });
      }
  };

  useEffect(() => {
    var params = "";
    if (query.state) params = `?state=${query.state}`;
    else if (query.country) params = `?country=${query.country}`;
    else if (query.continent) params = `?continent=${query.continent}`;

    axioslocationsinstance
      .get("hot_destinations" + params)
      .then((response) => {
        if (response.data.length) setHotLocationsData(response.data);
        else setShowHotLocations(false);
      })
      .catch((e) => {
        setShowHotLocations(false);
      });
  }, []);

  return (
    <Container>
      <div style={{ display: "flex" }}>
        <SearchInput
          setShowDestination={props.setShowDestination}
          showHotLocations={showHotLocations}
          destination={props.destination}
          onfocus={() => {
            props.onfocus();
            setTimeout(() => {
              setShowHotLocations(true);
            }, 500);
          }}
          onblur={props.onblur}
          searchFinalized={props.searchFinalized}
          inbox_id={props.inbox_id}
          _handleKey={_handleKey}
          setSearchFinalized={props.setSearchFinalized}
          setResults={setResults}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
          setShowResults={setShowResults}
          autofocus={props.autofocus}
        ></SearchInput>
      </div>

      {showResults && (
        <SearchResults
          _updateDestinationHandler={props._updateDestinationHandler}
          setFocusSearch={props.setFocusSearch}
          loading={loading}
          setShowResults={setShowResults}
          inbox_id={props.inbox_id}
          setDestination={props.setDestination}
          top="2.75rem"
          results={results}
          setSearchFinalized={props.setSearchFinalized}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
        ></SearchResults>
      )}

      {showHotLocations && (
        <SearchResults
          hotLocations
          _updateDestinationHandler={props._updateDestinationHandler}
          setFocusSearch={props.setFocusSearch}
          loading={loading}
          setShowResults={setShowHotLocations}
          inbox_id={props.inbox_id}
          setDestination={props.setDestination}
          top="2.75rem"
          results={hotLocationsData}
          setSearchFinalized={props.setSearchFinalized}
          setSelectedCities={props.setSelectedCities}
          selectedCities={props.selectedCities}
        ></SearchResults>
      )}
    </Container>
  );
};

export default Search;
