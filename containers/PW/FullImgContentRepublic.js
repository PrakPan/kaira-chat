import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";
import { Link } from "react-scroll";

const Container = styled.div`
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    padding: 12.5vh 7.5vh;
  }
`;

const Heading = styled.h1`
  color: white;
  width: 99%;
  font-weight: 800;
  margin-bottom: 0;
  margin-left: -3px;
  line-height: 1;
  letter-spacing: 3px;
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
  letter-spacing: 3px;
  line-height: 1.5;
  margin: 0 0 0 -1px;
  font-size: 1.2rem;
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PaddingContianer = styled.div`
  padding: 0 0 0 0;
  flex-grow: 1;
  @media screen and (min-width: 768px) {
    padding: 0 0 0 0;
  }
`;

const LogosContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  width: max-content;
  margin: auto;
  grid-gap: 0.5rem;
  padding-bottom: 0.5rem;
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className="font-lexend center-di ">
      <PaddingContianer>
        <Heading style={{ fontWeight: "800" }}>HOLI SPECIALS</Heading>
        <SubText>Avail 50% discount for Holi Dates.</SubText>
        <SubText>#PWTravelTogether</SubText>
        <Link style={{ textDecoration: "none" }} to="holi">
          <Button
            borderWidth="0"
            bgColor="#f7e700"
            hoverBgColor="black"
            fontWeight="700"
            borderRadius="5px"
            padding="0.5rem 1.5rem"
            hoverColor="white"
            margin={isPageWide ? "2.5rem 0 0 0 " : "4rem 0 0 0"}
            onclick={() => console.log("")}
          >
            View Now
          </Button>
        </Link>
      </PaddingContianer>
      <LogosContainer></LogosContainer>
    </Container>
  );
};

export default FullImgContent;
