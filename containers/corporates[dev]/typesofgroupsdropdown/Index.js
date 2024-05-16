import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import DropDownList from "./DropDownList";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.5rem;
  }
`;

const Card = styled.div`
  &:nth-of-type(2) {
    margin: 1rem 1rem 0rem 1rem;
    grid-row: 1;
    grid-column: 1/2;
  }
`;

const DropDownWhyUs = () => {
  return (
    <Container>
      <Card>
        <ImageLoader
          dimensions={{ width: 600, height: 350 }}
          url="media/ruby/cycletour.jpg"
        />
      </Card>
      <Card>
        <DropDownList></DropDownList>
      </Card>
    </Container>
  );
};

export default DropDownWhyUs;
