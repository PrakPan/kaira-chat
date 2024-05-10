import React from "react";
import styled from "styled-components";
import Button from "../../../components/ui/button/Index";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 1rem;
  z-index: 1000;
  left: 0;
`;

const BannerMobile = (props) => {
  return (
    <Container className="" style={{ borderRadius: "0" }}>
      <Button
        fontWeight="500"
        onclick={props.onclick}
        hovercolor="white"
        hoverbgcolor="black"
        padding="0.75rem"
        bgColor="#F7e700"
        borderWidth="1px"
        borderRadius="2rem"
        margin="0"
        width="100%"
      >
        <p className="font-lexend" style={{ margin: "0", fontWeight: "500" }}>
          Schedule Callback
        </p>
      </Button>
    </Container>
  );
};

export default BannerMobile;
