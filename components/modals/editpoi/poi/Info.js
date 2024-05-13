import React from "react";
import styled from "styled-components";
import media from "../../../media";
import Button from "../../../Button";
import { BsInfoCircle } from "react-icons/bs";

const Container = styled.div`
  position: relative;
  padding: 0 0.5rem 3rem 0.5rem;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 700;
  display: inline;
  line-height: 1;
`;

const RightBottomContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0.5rem;
  display: flex;
`;

const Description = styled.p`
  font-weight: 300;
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const StyledInfoIcon = styled(BsInfoCircle)`
  margin-left: 0.25rem;
  &:hover {
    cursor: pointer;
  }
`;

const Accommodation = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className="">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Name className="font-lexend">{props.heading}</Name>
        <StyledInfoIcon
          onClick={() => props._openPoiModal(props.data.activity_data.poi)}
        ></StyledInfoIcon>
      </div>
      {props.text ? (
        <Description
          className="font-lexend"
          onClick={() => props._openPoiModal(props.data.activity_data.poi)}
        >
          {isPageWide && props.text.length
            ? props.text.substring(0, 250) + "..."
            : props.text.substring(0, 80) + "..."}
        </Description>
      ) : null}
      <RightBottomContainer>
        <Button
          onclick={props._updatePoiHandler}
          onclickparam={props.data}
          borderRadius="2rem"
          padding="0.25rem 1rem"
          borderWidth="0"
          bgColor="#f7e700"
          hoverColor="white"
          hoverBgColor="black"
        >
          Select
        </Button>
      </RightBottomContainer>
    </Container>
  );
};

export default Accommodation;
