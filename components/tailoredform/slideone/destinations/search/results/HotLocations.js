import React, {  useEffect } from "react";
import SkeletonCard from "../../../../../ui/SkeletonCard";
import styled from "styled-components";
import Result from "./Result";
const AbsoluteContainer = styled.div`
  background-color: white;
  padding: 0 0.5rem;
  position: absolute;
  top: ${(props) => props.top};
  width: 100%;
  left: 0;
  z-index: 10;
`;


const skeleton = (
  <div style={{ display: "flex", marginBlock: "1rem" }}>
    <SkeletonCard borderRadius="100%" width="52px" ml="1px"></SkeletonCard>
    <div>
      <SkeletonCard
        height="14px"
        ml="7px"
        width={"50%"}
        borderRadius={"2px"}
      ></SkeletonCard>
      <SkeletonCard
        height="12px"
        ml="7px"
        mt="4px"
        width={"35%"}
        borderRadius={"2px"}
      ></SkeletonCard>
    </div>
  </div>
);

const HotLocations = (props) => {
  useEffect(() => {
    document.body.addEventListener("click", () => props.setShowResults(false));

    return () => {
      document.body.removeEventListener("click", () =>
        props.setShowResults(false)
        );
    };
  }, []);

  if (props.loading)
    return (
      <AbsoluteContainer className="border" top={props.top}>
        {[skeleton, skeleton, skeleton, skeleton, skeleton]}
      </AbsoluteContainer>
    );
  return (
    <AbsoluteContainer
      className={props.results.length && "border"}
      top={props.top}
    >

      {props.results.length
        ? props.results.map((result, i) => {
            if (i < 5)
              return (
                <Result
                  _updateDestinationHandler={props._updateDestinationHandler}
                  //   setShowResults={props.setShowResults}
                  setFocusSearch={props.setFocusSearch}
                  inbox_id={props.inbox_id}
                  setDestination={props.setDestination}
                  name={result.name}
                  result={result}
                  type={result.type}
                  setSearchFinalized={props.setSearchFinalized}
                  setSelectedCities={props.setSelectedCities}
                  selectedCities={props.selectedCities}
                ></Result>
              );
          })
        : null}
    </AbsoluteContainer>
  );
};

export default HotLocations;
