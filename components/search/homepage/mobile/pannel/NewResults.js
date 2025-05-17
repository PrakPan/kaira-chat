import React from "react";
import styled from "styled-components";
import { ImSearch } from "react-icons/im";
import SkeletonCard from "../../../../ui/SkeletonCard";
import Link from "next/link";

const Container = styled.div`
  margin: 1rem;
`;

const LocationContainer = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 0.3rem;
  max-width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border-radius: 50px;
  &:hover {
    background: #f0f0f0;
    cursor: pointer;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 14px;
`;

const Text = styled.div`
  font-weight: 500;
  p {
    font-weight: 400;
    margin-bottom: 0rem;
    margin-top: -2px;
    font-size: 12px;
    color: #7e7e7e;
  }
`;

const SkeletonContainer = styled.div`
  margin: 1rem;
`;

const NewResults = (props) => {
  const getParent = (path) => {
    if (!path) return "";

    const links = path.split("/");
    links.pop();
    const parent = links.map((part) => capitalizeFirstLetter(part)).join(" > ");

    return parent;
  };

  const capitalizeFirstLetter = (string) => {
    const words = string.split("_");
    const newString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return newString;
  };
  const skeleton = (
    <div
      style={{
        display: "grid",
        padding: "0.3rem",
        gap: "2px",
        gridTemplateColumns: "0.5fr 5fr",
      }}
    >
      <SkeletonCard borderRadius="100%" width="44px"></SkeletonCard>
      <div style={{ marginBlock: "auto" }}>
        <SkeletonCard
          height="14px"
          ml="8px"
          width={"70%"}
          borderRadius={"2px"}
        ></SkeletonCard>
        <SkeletonCard
          height="12px"
          ml="8px"
          mt="4px"
          width={"55%"}
          borderRadius={"2px"}
        ></SkeletonCard>
      </div>
    </div>
  );

  if (!props.results)
    return (
      <SkeletonContainer>
        {[skeleton, skeleton, skeleton, skeleton, skeleton]}
      </SkeletonContainer>
    );

  return (
    <>
      <Container>
        {props.results.map((e, i) => {
          if (i < 5)
            return (
              <LocationContainer key={e.resource_id} href={"/" + e.path}>
                <MarkerContainer>
                  <ImSearch />
                </MarkerContainer>
                <Text>
                  <div>{e.name}</div>
                  {e.parent ? <p>{e.parent}</p> : e?.path ? getParent(e.path) : null}
                </Text>
              </LocationContainer>
            );
        })}
      </Container>
    </>
  );
};

export default NewResults;
