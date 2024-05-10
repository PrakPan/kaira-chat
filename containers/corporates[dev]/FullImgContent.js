import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";

const Container = styled.div`
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 33% 0 0 0;

  @media screen and (min-width: 768px) {
    padding: 10vh 10vh 0 10vh;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Heading = styled.h1`
  color: white;
  width: 99%;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 2rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
    font-weight: 700;
  }
`;

const SubText = styled.h3`
  color: white;
  font-weight: 100;
  width: 99%;
  font-size: 1.25rem;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
  }
`;

const CompanyName = styled.h4`
  color: white;
  font-weight: 800;
  width: 99%;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <>
      <Container className="font-lexend">
        {isPageWide ? (
          <CompanyName className="font-lexend">
            TheTarzanWay
            <span style={{ fontWeight: "100" }}> For Business</span>
          </CompanyName>
        ) : null}

        <Heading>Hassle-Free Business Travel Partner</Heading>

        <SubText>
          Workcations, Retreats, Conferences, Weekend Getaways and more
        </SubText>
      </Container>

      <Button
        onclick={props.setEnquiryOpen}
        onclickparams={null}
        link="/"
        padding="0.75rem 1rem"
        fontSize="18px"
        fontWeight="500"
        bgColor="#f7e700"
        borderRadius="7px"
        color="black"
        borderWidth="1px"
        margin={isPageWide ? "1rem 11vh" : "1rem auto 1rem auto"}
      >
        Schedule Callback
      </Button>
    </>
  );
};

export default FullImgContent;
