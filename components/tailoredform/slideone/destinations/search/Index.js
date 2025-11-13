import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchInput from "./Input";
import SearchResults from "./results/Index";
import axiossearchsuggestinstance from "../../../../../services/search/searchsuggest";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
const Container = styled.div`
  width: 100%;

  @media screen and (min-width: 768px) {
  }
`;

const Search = (props) => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const hotlocationsData = useSelector((state) => state.HotLocationSearch)?.locations || [];
  const [showHotLocations, setShowHotLocations] = useState(false);
  const { query } = useRouter();

  const _handleKey = (value) => {
    console.log("value", value);
    if (value && !props.searchFinalized){
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
      else{
        setShowResults(false);
      }
    }
    else{
      setShowResults(false);
    }
  };

  useEffect(() => {
    var params = "";
    if (query.state) params = `?state=${query.state}`;
    else if (query.country) params = `?country=${query.country}`;
    else if (query.continent) params = `?continent=${query.continent}`;
  }, []);

  return (
    <Container>
      <div style={{ display: "flex" }}>
        <SearchInput
          setShowDestination={props.setShowDestination}
          showHotLocations={showHotLocations}
          destination={props.destination}
          setDestination={props.setDestination}
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
          setShowResults={setShowResults}
          eventDates={props.eventDates}
        ></SearchInput>
      </div>

      {showResults ? (
        <>
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
          maxResult={5}
        ></SearchResults>
        </>
      ) : showHotLocations ? (
        <SearchResults
          hotLocations
          _updateDestinationHandler={props._updateDestinationHandler}
          setFocusSearch={props.setFocusSearch}
          loading={loading}
          setShowResults={setShowHotLocations}
          inbox_id={props.inbox_id}
          setDestination={props.setDestination}
          top="2.75rem"
          results={hotlocationsData}
          setSearchFinalized={props.setSearchFinalized}
          setValueStart={props.setValueStart}
          setValueEnd={props.setValueEnd}
          tailoredFormModal={props.tailoredFormModal}
          maxResult={hotlocationsData.length}
        ></SearchResults>
      ) : null}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    hotLocations: state.HotLocationSearch.locations,
  };
};

export default connect(mapStateToPros)(Search);