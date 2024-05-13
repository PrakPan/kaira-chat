import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Link from "next/link";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 0.5rem;
  margin: 1rem;
`;

const Heading = styled.p`
  font-weight: 600;
  margin: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const ImageText = styled.div`
  font-weight: 400;
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
`;

const LocationContainer = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 0.5rem;
  &:hover {
    cursor: pointer;
  }
  max-width: 100%;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-gap: 0.5rem;
  &:hover {
    cursor: pointer;
  }
`;

const Locations = (props) => {

  let locations = [];
  if (props.hotlocations) {
    for (var i = 0; i < props.hotlocations.length; i++) {
      const data = props.hotlocations[i];

      locations.push(
        <LocationContainer className="border-thin" href={"/" + data.path}>
          <ImageLoader
            url={props.hotlocations[i].image}
            borderRadius="50%"
            height="100%"
            width="100%"
            heighttab="100%"
            dimensions={{ width: 600, height: 600 }}
            dimensionsMobile={{ width: 600, height: 600 }}
            fit="cover"
            hoverpointer
          />
          <ImageText className="center-div text-center font-lexend">
            {props.hotlocations[i].name}
          </ImageText>
        </LocationContainer>
      );
    }
  } else {
    for (var i = 0; i < 6; i++) {
      locations.push(
        <LocationContainer className="border-thin">
          <ImageLoader
            url={"media/website/grey.png"}
            borderRadius="50%"
            height="100%"
            width="100%"
            heighttab="100%"
            dimensions={{ width: 100, height: 100 }}
            dimensionsMobile={{ width: 100, height: 100 }}
            fit="cover"
            hoverpointer
          />
          <ImageText className="center-div text-center font-lexend">
            {""}
          </ImageText>
        </LocationContainer>
      );
    }
  }
  
  return (
    <div>
      <Heading className="font-lexend">Top Locations</Heading>
      <Container>{locations}</Container>
    </div>
  );
};

export default Locations;
