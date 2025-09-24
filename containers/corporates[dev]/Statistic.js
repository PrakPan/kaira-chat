import React from "react";
import styled from "styled-components";
import Heading from "../../components/newheading/heading/Index";

const StatisticContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  padding: 1rem;
`;

const BottomText = styled.p`
  font-size: 0.8rem;
  font-weight: 100;
  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
    font-weight: 300;
  }
`;

const Statistic = () => {
  return (
    <StatisticContainer>
      <div className=" text-center">
        <Heading bold margin="auto" noline align="center">
          100%
        </Heading>
        <BottomText className="">Statistic 1</BottomText>
      </div>
      <div className=" text-center">
        <Heading bold margin="auto" noline align="center">
          100%
        </Heading>
        <BottomText className="">Statistic 1</BottomText>
      </div>
      <div className=" text-center">
        <Heading bold margin="auto" noline align="center">
          100%
        </Heading>
        <BottomText className="">Statistic 1</BottomText>
      </div>
    </StatisticContainer>
  );
};

export default Statistic;
