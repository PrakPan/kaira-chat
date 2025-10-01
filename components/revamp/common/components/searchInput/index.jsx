import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../../../../hooks/useDebounce";
import axiossearchinstance from "../../../../../services/search/searchsuggest";
import { useRouter } from "next/router";
import NewResults from "../../../../search/header/desktop/pannel/NewResults";
import Locations from "../../../../search/homepage/mobile/pannel/Locations";
import { MERCURY_HOST } from "../../../../../services/constants";
import axios from "axios";

const SearchContainer = styled.div`
  position: relative;
  width: 416px;
  border-radius: 8px;
  border: 1px solid var(--Text-Colors-Stroke, #e5e5e5);
  background: #fff;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #dee2e6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #6c757d;
  margin-right: 12px;
  font-size: 14px;
  width: 14px;
  height: 14px;
  transition: color 0.3s ease;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #495057;
  font-family: inherit;

  &::placeholder {
    color: #adb5bd;
    font-weight: 400;
  }
`;

const ResultsContainer = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-top: none;
  max-height: 240px;
  overflow-y: auto;
  border-radius: 0 0 8px 8px;
  z-index: 1000;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ResultItem = styled.li`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const SearchInput = ({
  placeholder = "Search a destination...",
  value,
  onChange,
  onSubmit,
  className = "",
  ...props
}) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState(value || "");
  const [results, setResults] = useState([]);
  const [hotLocationsData, setHotLocationsData] = useState([]);

  const debouncedSearch = useDebounce(inputValue, 400);
  const [isSearchOpened, setIsSearchOpened] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axiossearchinstance.get(`?q=${debouncedSearch}`);
        setResults(res.data.slice(0, 10) || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [debouncedSearch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpened(false);
      }
    };
    try {
      if (hotLocationsData?.length == 0) {
        axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`).then((response) => {
          setHotLocationsData(response.data);
        });
      }
    } catch (error) {
      console.log("error in getting hote dstinations: ", error)
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(inputValue);
    }
  };

  const handleContainerClick = () => {
    const input = document.getElementById("search-input");
    if (input) {
      input.focus();
    }
  };


  return (
    <SearchContainer className={`${className} relative`}>
      <SearchInputWrapper onClick={handleContainerClick}>
        <SearchIcon icon={faSearch} />
        <StyledInput
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={value !== undefined ? value : inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onClick={() => setIsSearchOpened(true)}
          {...props}
        />
      </SearchInputWrapper>
      <div ref={searchRef} className="absolute bg-white mt-0">
        {isSearchOpened && <>
          {inputValue?.length > 0 ? <NewResults
            setPannelClose={setIsSearchOpened}
            results={results}
            inputValue={inputValue}
          /> : <Locations
            setPannelClose={setIsSearchOpened}
            hotlocations={hotLocationsData}
          ></Locations>}
        </>}
      </div>
    </SearchContainer>
  );
};

export default SearchInput;
