import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Locations from "./Locations";
import * as ga from "../../../../../services/ga/Index";
import axiossearchsuggestinstance from "../../../../../services/search/searchsuggest";
import NewResults from "./NewResults";
import { ImSearch } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { CONTENT_SERVER_HOST } from "../../../../../services/constants";
import { connect } from "react-redux";

const Container = styled.div`
  background-color: white;
  border-radius: 2rem;
  height: 100%;
  text-align: left;
  position: fixed;
  overflow: overlay;
  top: 0;
  width: 100%;
  z-index: 1500;
  @media screen and (min-width: 768px) {
    width: 100%;
  }
`;

const TopContainer = styled.div`
  border-style: none none solid none;
  position: fixed;
  background: white;
  border-width: 1px;
  border-color: #e4e4e4;
  padding-right: 15px;
  height: 70px;
  margin: auto;
  display: grid;
  grid-template-columns: max-content auto;
`;

const SearchContainer = styled.div`
  margin-block: auto;
`;

const Search = styled.input`
  border: 1px solid #dde2e4;
  padding: 10px;
  padding-inline: 50px;
  border-radius: 6px;
  position: relative;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: black;
  }
`;

const Text = styled.div`
  font-weight: 400;
  margin: 1.5rem;
  font-size: 12px;
  color: #7e7e7e;
  font-size: 1rem;
`;

const SearchPannel = (props) => {
  const [showResults, setShowResults] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState(null);
  const [hotLocationsData, setHotLocationsData] = useState();
  const [showP, setShowP] = useState(false);

  useEffect(() => {
    setHotLocationsData(props.hotLocations);
  }, []);

  const _onChangeHandler = (event) => {
    setInputValue(event.target.value);
    if (event.target.value.length % 3 === 0) {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "HS-locationssearched",
          params: {
            search_text: event.target.value,
          },
        });
    }
    setShowP(false);
    setShowResults(true);
    setResults(null);
    axiossearchsuggestinstance.get(`?q=` + event.target.value).then((res) => {
      if (res.data.length) {
        setResults(res.data.slice(0, 10));
        setShowResults(true);
        setShowP(false);
      } else {
        setShowP(true);
        setShowResults(false);
      }
    });
  };

  return (
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
        <RxCross2
          onClick={props.setPannelClose}
          style={{
            fontSize: "1.8rem",
            textAlign: "left",
            fontWeight: "500",
            margin: "auto 0.7rem",
          }}
        />

        <SearchContainer>
          <Search
            autoFocus
            onChange={_onChangeHandler}
            value={inputValue}
            className="font-lexend"
            placeholder="Search Locations"
          ></Search>

          <ImSearch
            style={{
              position: "absolute",
              top: "27px",
              left: "73px",
              color: "#B0BABF",
              pointerEvents: "none",
            }}
          />

          {inputValue !== "" && (
            <MdCancel
              onClick={() => {
                setInputValue("");
                setShowResults(false);
              }}
              style={{
                position: "absolute",
                top: "25px",
                right: "25px",
                fontSize: "1.1rem",
                color: "#7A7A7A",
              }}
            />
          )}
        </SearchContainer>
      </TopContainer>

      <div style={{ marginTop: "85px" }}>
        {showP && inputValue != "" && (
          <Text>We couldn't find anything for '{inputValue}'</Text>
        )}

        {showResults ? (
          <NewResults setPannelClose={props.setPannelClose} results={results} />
        ) : (
          <Locations
            setPannelClose={props.setPannelClose}
            hotlocations={hotLocationsData}
          ></Locations>
        )}
      </div>
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    hotLocations: state.HotLocationSearch.locations,
  };
};

export default connect(mapStateToPros)(SearchPannel);
