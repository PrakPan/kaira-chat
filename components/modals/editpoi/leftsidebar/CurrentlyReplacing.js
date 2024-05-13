import React from "react";
import styled from "styled-components";

const Container = styled.div`
  bottom: 0;
  @media screen and (min-width: 768px) {
    margin: 0 0.5rem;
  }
`;

const TextContainer = styled.div`
  margin: 0 -1rem;

  @media screen and (min-width: 768px) {
    margin: 0;
  }
`;

const HelperText = styled.p`
  color: black;
  font-size: 0.75rem;
  margin: 0 0.5rem 0.5rem 0.5rem;
  display: block;
  padding: 0.75rem 0rem;
  line-height: 1;
  text-align: center;
  background-color: #f7e700;

  @media screen and (min-width: 768px) {
    text-align: left;
    background-color: white;
    margin: 0.5rem 0 0 0;
    padding: 0;
  }
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 1.75rem;
  display: block;
  margin: 0;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const CurrentlyReplacing = (props) => {
  return (
    <Container>
      <TextContainer>
        <div>
          <HelperText className="font-nunito">CURRENTLY REPLACING</HelperText>
          <Name className="font-lexend">{props.replacing}</Name>
        </div>
      </TextContainer>
    </Container>
  );
};

export default CurrentlyReplacing;
