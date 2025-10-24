import React from "react";
import styled from "styled-components";
import Button from "../../../ui/button/Index";

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const Section = (props) => {
  return (
    <Container className="">
      <GridContainer>
        <Button
          width="100%"
          borderRadius="0 0 10px 10px"
          borderStyle="solid none none none"
          borderColor="rgba(222, 222, 222, 1)"
          borderWidth="1px"
          onclickparam={null}
          onclick={() => console.log("test")}
        >
          Change
        </Button>
      </GridContainer>
    </Container>
  );
};

export default Section;
