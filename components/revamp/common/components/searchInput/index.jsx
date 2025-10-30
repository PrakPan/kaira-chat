import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../../../../hooks/useDebounce";
import axiossearchinstance from "../../../../../services/search/searchsuggest";
import { useRouter } from "next/router";
import NewResults from "../../../../search/header/desktop/pannel/NewResults";
import Locations from "../../../../search/header/desktop/pannel/Locations";
import { MERCURY_HOST } from "../../../../../services/constants";
import axios from "axios";
import SearchPannel from "../../../../search/header/desktop/pannel/Index";
import { ImSearch } from "react-icons/im";
import DesktopSearch from "../../../../search/header/desktop/Index";
import useMediaQuery from "../../../../media";

const SearchContainer = styled.div`
  position: relative;
  width: 416px;
  border-radius: 8px;
  background: #fff;
`;
const Container = styled.div`
  background-color: white;
  border-radius: 5px 5px 1rem 1rem !important;
  text-align: left;
  position: absolute;
  width: 37%;

  top: 15px;
  z-index: 101;
  left: 26%;
  @media screen and (min-width: 950px) {
    left: 32%;
  }
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

const TopContainer = styled.div`
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #e4e4e4;
  width: 100%;
  margin: auto;
  height: 50px;
  z-index: 101;
  background-color: white;
`;

const Search = styled.input`
  border: none !important;
  width: 80%;
  margin-top: 12px;
  margin-inline: 40px;
  &:focus {
    outline: none;
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
  const router = useRouter();
  const ref = useRef();
  const [inputValue, setInputValue] = useState(value || "");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isdesktop = useMediaQuery("(min-width: 768px)");
  const ismobile = useMediaQuery("(max-width: 480px)");
  const [results, setResults] = useState([]);
  const [hotLocationsData, setHotLocationsData] = useState([]);

  const debouncedSearch = useDebounce(inputValue, 400);
  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const searchRef = useRef(null);

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
        axios
          .get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`)
          .then((response) => {
            setHotLocationsData(response.data);
          });
      }
    } catch (error) {
      console.log("error in getting hote dstinations: ", error);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div>
      {!isSearchOpened && <div
        className="center-div h-full"
        onClick={() => setIsSearchOpened(true)}

      >
        <TopContainer>
          <SearchContainer>
            <Search placeholder="Where do you want to go?"></Search>
            <ImSearch
              style={{
                position: "absolute",
                top: "17px",
                left: "13px",
                color: "#B0BABF",
                pointerEvents: "none",
              }}
            />
          </SearchContainer>
        </TopContainer>
      </div>}

      {isSearchOpened ? (
        <DesktopSearch onclose={() => setIsSearchOpened(false)}></DesktopSearch>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SearchInput;


