import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import axiosCountInstance from "../../services/itinerary/count";

const Text = styled.h1`
  position: relative;
  top: 2.2rem;
  @media screen and (min-width: 768px) {
    top: 1.5rem;
  }
  &:nth-of-type(1) {
    font-size: 2.5rem;
    font-weight: 700;
    @media screen and (min-width: 768px) {
      font-size: 3.5rem;
    }
  }
  &:nth-of-type(2) {
    font-size: 1rem;
    font-weight: 200;
    @media screen and (min-width: 768px) {
      font-size: 1.25rem;
    }
  }
`;

const Container = styled.div`
  margin: 1rem 0rem 2rem 0rem;
  width: 18rem;
  @media screen and (min-width: 768px) {
    width: 21rem;
  }
`;

const LeafContainer = styled.div`
  position: relative;
  &:nth-of-type(1) {
    float: left;
  }
  &:nth-of-type(2) {
    float: right;
    transform: scaleX(-1);
  }
`;

const TravellerCounter = (props) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axiosCountInstance.get("").then((res) => setCount(res.data.user));
  }, []);

  return (
    <div className=" center-div text-center">
      <Container>
        <LeafContainer>
          <ImageLoader
            dimensions={{ height: 500, width: 300 }}
            dimensionsMobile={{ height: 500, width: 270 }}
            height={"8rem"}
            url={"media/testimonials/leaf.svg"}
          />
        </LeafContainer>
        <LeafContainer>
          <ImageLoader
            height={"8rem"}
            dimensions={{ height: 500, width: 300 }}
            dimensionsMobile={{ height: 500, width: 270 }}
            url={"media/testimonials/leaf.svg"}
          />
        </LeafContainer>
        <Text>{count}</Text>
        <Text>Travellers and Counting</Text>
      </Container>
    </div>
  );
};

export default TravellerCounter;
