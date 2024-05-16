import React from "react";
import styled from "styled-components";

const TestimonialCard = (props) => {
  const Container = styled.div`
    position: relative;
    padding: 1rem;
    margin-top: 15vw;
    @media screen and (min-width: 768px) {
      margin-top: 5vw;
    }
  `;

  const Name = styled.p`
    font-size: 1.5rem;
    text-align: center;
    margin: 15vw 0 0 0;
    @media screen and (min-width: 768px) {
      margin: 5vw 0 0 0;
    }
  `;

  const Location = styled.p`
    font-size: 0.75rem;
    text-align: center;
  `;

  const Content = styled.p`
    text-align: center;
    &:before {
      content: "";
      display: block;
      position: relative;
      left: -1rem;
    }
  `;

  return (
    <Container className="border">
      <Name className="font-lexend">Daniel Arnold</Name>
      <Location className="font-lexend">AUSTRALIA</Location>
      <Content className="font-nunito">{props.text}</Content>
    </Container>
  );
};

export default TestimonialCard;
