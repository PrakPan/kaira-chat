import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import usePageLoaded from "../../../custom hooks/usePageLoaded";

const Container = styled.div`
  background-color: white;
  border-radius: 2rem;
  width: 100%;
  padding: 0.75rem;
  width: 95%;
  margin: 0 auto 0 auto;
`;

const SearchText = styled.span`
  opacity: 0.7;
`;

const MobileBar = (props) => {
  const isPageLoaded = usePageLoaded();

  return (
    <Container className="center-div" onClick={props.setPannelOpen}>
      <SearchText className="">
        {isPageLoaded ? (
          <FontAwesomeIcon
            icon={faSearch}
            style={{ margin: "0 0.5rem 0 0" }}
          ></FontAwesomeIcon>
        ) : null}
        Start Planning
      </SearchText>
    </Container>
  );
};

export default MobileBar;
