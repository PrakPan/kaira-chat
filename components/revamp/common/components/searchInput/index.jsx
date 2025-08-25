import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchContainer = styled.div`
  position: relative;
  //   width: 100%;
  width: 416px;
  border-radius: 8px;
  border: 1px solid var(--Text-Colors-Stroke, #e5e5e5);
  background: #fff;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  //   background-color: #f8f9fa;
  //   border: 1px solid #e9ecef;
  //   border-radius: 25px;
  padding: 12px 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #dee2e6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus-within {
    // border-color: #007bff;
    // box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #6c757d;
  margin-right: 12px;
  font-size: 14px;
  width: 14px;
  height: 14px;
  transition: color 0.3s ease;

  ${SearchInputWrapper}:focus-within & {
    // color: #007bff;
  }
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

const SearchInput = ({
  placeholder = "Search a destination...",
  value,
  onChange,
  onSubmit,
  className = "",
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || "");

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
    // Focus the input when clicking anywhere on the container
    const input = document.getElementById("search-input");
    if (input) {
      input.focus();
    }
  };

  return (
    <SearchContainer className={className}>
      <SearchInputWrapper onClick={handleContainerClick}>
        <SearchIcon icon={faSearch} />
        <StyledInput
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={value !== undefined ? value : inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          {...props}
        />
      </SearchInputWrapper>
    </SearchContainer>
  );
};

export default SearchInput;
