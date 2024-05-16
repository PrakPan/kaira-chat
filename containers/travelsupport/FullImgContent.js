import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import openTailoredModal from "../../services/openTailoredModal";

const Container = styled.div`
  text-align: center;
  color: white;
  padding: 0 0.5rem;
  @media screen and (min-width: 768px) {
    padding: 15vh 10vh;
    text-align: left;
  }
`;

const Heading = styled.h1`
  color: white;
  width: 99%;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 2rem;
  @media screen and (min-width: 768px) {
    font-size: 4rem;
    font-weight: 700;
  }
`;

const SubText = styled.h3`
  color: white;
  font-weight: 100;
  width: 99%;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Button = styled.div`
  width: max-content;
  padding: 0.75rem 1.25rem;
  font-size: 1.25rem;
  border-radius: 2rem;
  border-color: white;
  border-width: 1px;
  border-style: solid;
  margin: 2.5rem auto;
  font-weight: 100;
  @media screen and (min-width: 768px) {
    margin: 15vh 0;
    font-size: 1.5rem;
  }
  &:hover {
    cursor: pointer;
    background-color: white;
    color: black;
  }
`;

const FullImgContent = (props) => {
  const router = useRouter();

  return (
    <Container className="center-di">
      <Heading className="font-lexend">{props.heading}</Heading>
      <SubText className="font-lexend">{props.subheading}</SubText>
      <Button onClick={() => openTailoredModal(router)} className="font-lexend">
        Start Planning
      </Button>
    </Container>
  );
};

export default FullImgContent;
