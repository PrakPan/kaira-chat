import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useDebounce from "../../../../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedCity } from "../../../../../store/actions/slideOneActions";

const Container = styled.input`
  width: 92%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  padding-left: 3.5rem;
  background-color: transparent;
  cursor: pointer;
  height: 100%;
  &:focus {
    border: none;
    outline: none;
  }
  border: none;

  @media screen and (min-width: 768px) {
  }
`;

const SearchInput = (props) => {
  const [value, setValue] = useState("");
  const debouncedSearch = useDebounce(value);
  const selectedCities = useSelector((state) => state.tailoredInfoReducer.slideOne.selectedCities);
  const dispatch=useDispatch();
  useEffect(() => {
    props._handleKey(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (props.searchFinalized) setValue(props.searchFinalized.name);
  }, [props.searchFinalized]);

  const _resetSelectedCities = () => {
    if (props.inbox_id !== selectedCities[0]?.input_id) {
      dispatch(resetSelectedCity(props.inbox_id));
    }
  };

  const _handleReset = () => {
    setValue("");
    props.setSearchFinalized(false);
    props.setResults([]);
    props.setShowResults(false);
    _resetSelectedCities();
  };

  function _handleBlur() {
    props.onblur();
    setTimeout(() => {
      if (!value) props.setShowDestination(true);
    }, 250);
  }

  return (
    <Container
      autoFocus={props.autofocus}
      onFocus={props.onfocus}
      onBlur={_handleBlur}
      onClick={props.searchFinalized ? _handleReset : _resetSelectedCities}
      readOnly={props.eventDates ? true : false}
      placeholder="Search destination"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    ></Container>
  );
};

export default SearchInput;
