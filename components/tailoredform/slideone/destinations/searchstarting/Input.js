import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchResult from "./SearchResult";
import Spinner from "../../../../Spinner";
import axiossearchstartinginstance from "../../../../../services/search/startinglocation";
import SkeletonCard from "../../../../ui/SkeletonCard";
import useDebounce from "../../../../../hooks/useDebounce";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { changeUserLocation } from "../../../../../store/actions/userLocation";

const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  left: 0;
  top: 53px;
  padding: 20px;
  z-index: 4;
`;

const InputContainer = styled.input`
  width: 100%;
  &:focus {
    border: none;
    outline: none;
  }
  border: none;
  &::placeholder {
    font-weight: 400;
  }

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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    _getResults(debouncedSearch);
  }, [debouncedSearch]);

  const _selectResult = (event, text, place_id) => {
    event.stopPropagation();
    setResultsJSX([]);
    props.setShowSearchStarting(false);
    props.setStartingLocation({ name: text, place_id: place_id });
    Cookies.set(
      "userLocation",
      JSON.stringify({
        text: text,
        place_id: place_id,
      })
    );
    props.changeUserLocation({
      location: { text: text, place_id: place_id },
    });
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
                    image	={res.data[i].image}
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
    <div className="w-[90%]">
      {props.showSearchStarting ? (
        <div style={{ display: "flex" }}>
          <InputContainer
            onFocus={props.onfocus}
            className="Body2M_14 placeholder:font-weight-400 w-full"
            onBlur={_handleBlur}
            placeholder="Enter the start Location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></InputContainer>
          {loading ? <Spinner size={16} margin="0"></Spinner> : null}
        </div>
      ) : null}
      {!props.showSearchStarting && props.startingLocation  ? (
        <div className="" onClick={_handleClearResults}>
          {props.startingLocation.name}
        </div>
      ) : null}
      {resultsJSX.length && props.showSearchStarting ? (
        <ResultsContainer className="border">
          {loading
            ? [skeleton, skeleton, skeleton, skeleton, skeleton]
            : <div className="flex flex-col gap-[8px]">{resultsJSX}</div>}
        </ResultsContainer>
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeUserLocation: (payload) => dispatch(changeUserLocation(payload)),
  };
};

export default connect(null, mapDispatchToProps)(SearchInput);
