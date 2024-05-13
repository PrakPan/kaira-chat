import React, { useState } from "react";
import styled from "styled-components";
import SearchResult from "./SearchResult";
import Spinner from "../../../../Spinner";
import axiossearchstartinginstance from "../../../../../services/search/startinglocation";
import SkeletonCard from "../../../../ui/SkeletonCard";

const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  left: 0;
  top: 2.75rem;
  z-index: 4;
`;

const InputContainer = styled.input`
  width: 9rem;
  &:focus {
    border: none;
    outline: none;
  }
  border: none;

  @media screen and (min-width: 768px) {
  }
`;

const skeleton = (
  <div style={{ display: "flex", marginBlock: "1rem", marginLeft: "10px" }}>
    <SkeletonCard borderRadius="100%" width="52px" ml="1px"></SkeletonCard>
    <div>
      <SkeletonCard
        height="14px"
        ml="4px"
        width={"50%"}
        borderRadius={"2px"}
      ></SkeletonCard>
      <SkeletonCard
        height="12px"
        ml="4px"
        mt="4px"
        width={"35%"}
        borderRadius={"2px"}
      ></SkeletonCard>
    </div>
  </div>
);

const SearchInput = (props) => {
  const [loading, setLoading] = useState(false);
  const [resultsJSX, setResultsJSX] = useState([]);

  const _selectResult = (event, text, place_id) => {
    event.stopPropagation();
    setResultsJSX([]);
    props.setShowSearchStarting(false);
    props.setStartingLocation({ name: text, place_id: place_id });
  };

  const _getResults = (query) => {
    if (query)
      if (query.length > 1) {
        setLoading(true);
        axiossearchstartinginstance
          .get(`?q=` + query)
          .then((res) => {
            setLoading(false);
            let results = [];
            if (!res.data.length) _handleClearResults();
            else
              for (var i = 0; i < res.data.length; i++) {
                results.push(
                  <SearchResult
                    selectResult={_selectResult}
                    text={res.data[i].text}
                    place_id={res.data[i].place_id}
                  ></SearchResult>
                );
              }
            setResultsJSX(results);
          })
          .catch((error) => {
            setLoading(false);
            _handleClearResults();
            setResultsJSX([
              <div style={{ margin: "1rem" }}>
                Something went wrong! Please try again later.
              </div>,
            ]);
          });
      }
  };

  const _handleClearResults = () => {
    setResultsJSX([]);
    props.onfocus();
  };

  const _handleBlur = (e) => {
    props.onblur();
    if (!e.target.value) props.setShowSearchStarting(false);
  };

  return (
    <div>
      {props.showSearchStarting ? (
        <div style={{ display: "flex" }}>
          <InputContainer
            onFocus={props.onfocus}
            onBlur={_handleBlur}
            placeholder="Departing from"
            className="font-lexend"
            autoFocus
            onChange={(e) => _getResults(e.target.value)}
          ></InputContainer>
          {loading ? <Spinner size={16} margin="0"></Spinner> : null}
        </div>
      ) : null}
      {!props.showSearchStarting && props.startingLocation ? (
        <div className="font-lexend" onClick={_handleClearResults}>
          {props.startingLocation.name}
        </div>
      ) : null}
      {resultsJSX.length && props.showSearchStarting ? (
        <ResultsContainer className="border">
          {loading
            ? [skeleton, skeleton, skeleton, skeleton, skeleton]
            : resultsJSX}
        </ResultsContainer>
      ) : null}
    </div>
  );
};

export default SearchInput;
