import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import Heading from "../../components/newheading/heading/Index";
import urls from "../../services/urls";

const Container = styled.div`
  background: #f7e700;
  min-height: 25vh;
  @media screen and (min-width: 768px) {
  }
`;

const WaitingFor = () => {
  return (
    <Container className="center-div text-center">
      <Heading margin="1rem" align="center">
        What are you waiting for?
      </Heading>
      <Button
        link={urls.ERROR404}
        display={"inline"}
        borderRadius={"3rem"}
        borderWidth="1px"
      >
        Register Now
      </Button>
    </Container>
  );
};

export default WaitingFor;
