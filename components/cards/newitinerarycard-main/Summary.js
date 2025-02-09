import React from "react";
import styled from "styled-components";
import { MdOutlineFlight, MdLocalActivity } from "react-icons/md";
import { AiFillHome, AiFillCar } from "react-icons/ai";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const IconContainer = styled.div`
  font-size: 12px;
  padding: 0 0 1rem 0;
  color: ${(props) => props.color};
  line-height: 1;
`;

const Summary = (props) => {
  return (
    <Container>
      <IconContainer
        className="font-lexend text-center"
        color={props.summary.Stays?.count ? "rgba(0,0,0, 1)" : "#b5b3b3"}
      >
        <AiFillHome
          style={{
            display: "block",
            fontSize: "1.1rem",
            width: "max-content",
            margin: "0 auto 0.25rem auto",
          }}
        ></AiFillHome>
        {props.summary.Stays?.count + " Stays"}
      </IconContainer>

      <IconContainer
        className="font-lexend text-center"
        color={props.summary.Transfers?.count ? "black" : "#b5b3b3"}
      >
        <AiFillCar
          style={{
            display: "block",
            fontSize: "1.1rem",
            width: "max-content",
            margin: "0 auto 0.25rem auto",
          }}
        ></AiFillCar>
        {props.summary.Transfers?.count + " Transfers"}
      </IconContainer>

      <IconContainer
        className="font-lexend text-center"
        color={props.summary?.Flights?.count ? "black" : "#b5b3b3"}
      >
        <MdOutlineFlight
          style={{
            display: "block",
            fontSize: "1.1rem",
            width: "max-content",
            margin: "0 auto 0.25rem auto",
          }}
        ></MdOutlineFlight>
        {props.summary.Flights?.count + " Flights"}
      </IconContainer>

      <IconContainer
        className="font-lexend text-center"
        color={props.summary.Activities?.count ? "black" : "#b5b3b3"}
      >
        <MdLocalActivity
          style={{
            display: "block",
            fontSize: "1.1rem",
            width: "max-content",
            margin: "0 auto 0.25rem auto",
          }}
        ></MdLocalActivity>
        {props.summary.Activities?.count + " Activities"}
      </IconContainer>
    </Container>
  );
};

export default Summary;
