import React from "react";
import styled from "styled-components";
import { FcCheckmark } from 'react-icons/fc'
import {MdClose} from 'react-icons/md'
const Container = styled.div`
  padding: 0 1rem 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Description = styled.p`
  margin: 1rem 0;
  font-weight: 100;
  text-align: center;
  letter-spacing: 1px;
  @media screen and (min-width: 768px) {
    margin: 2rem 2rem 0 2rem;
    text-align: center;
  }
`;
const Icon = styled.div`
  width: 1rem;
  height: 1rem;
  margin: -0.2rem 0.5rem 0.5rem 0;
`;
const UL = styled.div``;
const LIContainer = styled.div`
  display: flex;
  width: max-content;
  margin: auto;
`;
const LI = styled.div`
  font-weight: 100;
  display: flex;
  align-items: center;
`;
const Heading = styled.h2`
  font-size: 1rem;
  text-align: center;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;
const EntryFees = (props) => {
  let weekdaysArr = [];
  const WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (var i = 0; i < WEEKDAYS.length; i++) {
    if (props.weekdays.includes(WEEKDAYS[i])) {
      weekdaysArr.push(
        <LIContainer>
          <Icon><FcCheckmark /></Icon>
          <LI className="font-nunito vertical-center-di">{WEEKDAYS[i]}</LI>{" "}
        </LIContainer>
      );
    } else {
      weekdaysArr.push(
        <LIContainer>
          <Icon>
            <MdClose />
          </Icon>
          <LI className="font-nunito vertical-center-di">{WEEKDAYS[i]}</LI>{" "}
        </LIContainer>
      );
    }
  }
  return (
    <div>
      {props.weekdays ? (
        <Container>
          <div>
            <Heading>Days</Heading>
            <UL>{weekdaysArr}</UL>
          </div>
          <div>
            <Heading>Timings</Heading>
            <p
              className="font-nunito"
              style={{
                fontWeight: "100",
                textAlign: "center",
                marginBottom: "0.25rem",
              }}
            >
              Usually open from
            </p>
            <p
              className="font-nunito"
              style={{ fontWeight: "100", textAlign: "center" }}
            >
              8:00AM - 9:00PM
            </p>
          </div>
        </Container>
      ) : null}
    </div>
  );
};

export default EntryFees;
