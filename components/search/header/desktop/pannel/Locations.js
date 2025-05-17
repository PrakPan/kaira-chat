import React from "react";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import SkeletonCard from "../../../../ui/SkeletonCard";
import Link from "next/link";

const Container = styled.div`
  margin: 1rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
  }
`;

const Heading = styled.p`
  font-weight: 500;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  margin: 1rem;
  color: #7a7a7a;
`;

const LocationContainer = styled(Link)`
  padding: 0.3rem;
  max-width: 100%;
  display: flex;
  color: black;
  text-decoration: none;
  gap: 12px;
  align-items: center;
  border-radius: 50px;
  &:hover {
    background: #f0f0f0;
    cursor: pointer;
  }
`;

const SkeletonContainer = styled.div`
  padding: 0.3rem;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  gap: 2px;
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

const Locations = (props) => {
  let locations = [];

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

  if (props.hotlocations) {
    for (var i = 0; i < props.hotlocations.length; i++) {
      const data = props.hotlocations[i];
      locations.push(
        <LocationContainer href={"/" + data.path}>
          <MarkerContainer>
            <FaMapMarkerAlt />
          </MarkerContainer>
          <Text>
            <div>{props.hotlocations[i].name}</div>
            {props.hotlocations[i].parent ? (
              <p>{props.hotlocations[i].parent}</p>
            ) : props.hotlocations[i].state?.name ? (
              <p>{props.hotlocations[i].state?.name}</p>
            ) : props.hotlocations[i]?.path ? getParent(props.hotlocations[i]?.path) : null}
          </Text>
        </LocationContainer>
      );
    }
  } else {
    for (var i = 0; i < 8; i++) {
      locations.push(
        <SkeletonContainer>
          <SkeletonCard
            borderRadius="100%"
            width="44px"
            ml="1px"
          ></SkeletonCard>
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
        </SkeletonContainer>
      );
    }
  }

  return (
    <div>
      <Heading className="font-lexend">POPULAR DESTINATIONS</Heading>
      <Container>{locations}</Container>
    </div>
  );
};

export default Locations;
