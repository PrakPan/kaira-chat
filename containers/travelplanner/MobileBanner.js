import React from "react";
import styled from "styled-components";
import validateTextSize from "../../services/textSizeValidator";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 1rem;
  z-index: 1000;
  left: 0;
`;

const MobileBannerButton = styled.button`
  font-weight: 500;
  color: black;
  border: 1px solid black;
  padding: 0.75rem;
  background-color: #f7e700;
  border-radius: 2rem;
  margin: 0;
  width: 100%;
  text-align: center;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const BannerMobile = (props) => {
  return (
    <Container className="" style={{ borderRadius: "0" }}>
      <MobileBannerButton onClick={props.handleClick}>
        {props.city
          ? validateTextSize(
              `Craft a trip to ${props.city} now!`,
              8,
              "Craft a trip now!"
            )
          : "Craft a trip now!"}
      </MobileBannerButton>
    </Container>
  );
};

export default BannerMobile;
