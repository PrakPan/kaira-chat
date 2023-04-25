import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import Results from './results/Index';
import { RxCross2 } from 'react-icons/rx';
import Locations from './Locations';
import * as ga from '../../../../../services/ga/Index';
import axioslocationsinstance from '../../../../../services/poi/hotlocations';
import NewResults from './NewResults';
import { ImSearch } from 'react-icons/im';
import { MdCancel } from 'react-icons/md';

const Container = styled.div`
  background-color: white;
  border-radius: 2rem;
  height: 100vh;
  text-align: left;
  position: fixed;
  overflow: overlay;
  top: 0;
  width: 100%;
  z-index: 1500;
  // overflow: hidden;
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
  let isPageWide = media('(min-width: 768px)');
  const [showResults, setShowResults] = useState(false);
  let [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState(null);
  const [hotLocationsData, setHotLocationsData] = useState();
  const [showP, setShowP] = useState(false);
  const _onChangeHandler = (event) => {
    setInputValue(event.target.value);
    if (event.target.value.length % 3 === 0)
      ga.event({
        action: 'HS-locationssearched',
        params: {
          search_text: event.target.value,
        },
      });
    setShowP(false);
    setShowResults(true);
    setResults(null);
    axios
      .get(`https://apis.tarzanway.com/search/?q=` + event.target.value)
      .then((res) => {
        if (res.data.length) {
          setResults(res.data);
          setShowResults(true);
          setShowP(false);
        } else {
          setShowP(true);
          setShowResults(false);
        }
      });
  };

  useEffect(() => {
    axioslocationsinstance.get('').then((response) => {
      setHotLocationsData(response.data);
    });
  }, []);

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
            fontSize: '1.8rem',
            textAlign: 'left',
            fontWeight: '500',
            margin: 'auto 0.7rem',
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
              position: 'absolute',
              top: '27px',
              left: '73px',
              color: '#B0BABF',
              pointerEvents: 'none',
            }}
          />
          {inputValue !== '' && (
            <MdCancel
              onClick={() => {
                setInputValue('');
                setShowResults(false);
              }}
              style={{
                position: 'absolute',
                top: '25px',
                right: '25px',
                fontSize: '1.1rem',
                color: '#7A7A7A',
              }}
            />
          )}
        </SearchContainer>
      </TopContainer>
      <div style={{ marginTop: '85px' }}>
        {showP && inputValue != '' && (
          <Text>We couldn't find anything for '{inputValue}'</Text>
        )}

        {showResults ? (
          <NewResults results={results} />
        ) : (
          <Locations hotlocations={hotLocationsData}></Locations>
        )}
      </div>
    </Container>
  );
};

export default SearchPannel;
