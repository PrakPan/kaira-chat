import React from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import Button from "../../components/ui/button/Index";
import urls from "../../services/urls";

const Container = styled.div`
  background: #f7e700;
  padding: 1rem 0rem 1rem 0rem;
  margin: 0rem 0rem 1rem 0rem;
  @media screen and (min-width: 768px) {
    display: grid;
    padding: 2rem;
    grid-template-columns: 2fr 1fr;
  }
`;

const Card = styled.div`
  &:nth-of-type(1) {
    grid-column: 2/3;
  }
  &:nth-of-type(2) {
    padding: 1rem 0rem 1rem 0rem;
    grid-row: 1;
  }
`;

const Text = styled.p`
  width: 80%;
  font-size: 1rem;
  &:nth-of-type(1) {
    font-weight: 800;
    font-size: 1.5rem;
  }
  &:nth-of-type(2) {
    font-weight: 650;
    font-style: italic;
  }
  @media screen and (min-width: 768px) {
    &:nth-of-type(1) {
      font-size: 2rem;
    }
    font-size: 1.2rem;
  }
`;

const YellowReview = () => {
  return (
    <Container>
      <Card className="center-div">
        <div>
          <ImageLoader
            dimensions={{ width: 540, height: 500 }}
            borderRadius={"50%"}
            width="80%"
            url="media/ruby/cycletour.jpg"
          />
        </div>
      </Card>

      <Card className="center-div text-center">
        <Text className="font-nunito">Medya Danisman</Text>
        <Text className="font-nunito">
          "Lorem Ipsum Random Review Lorem Ipsum Random"
        </Text>
        <Text className="font-nunito">
          “Random Review Lorem Ipsum Random Review Lorem Ipsum Random Review
          Lorem Ipsum Random Review Lorem IpsumRandom Review Lorem IpsumRandom
          Ipsum Random Review Lorem Ipsum Random Review Lorem IpsumRandom Review
          Lorem IpsumRandom Ipsum Random Review Lorem Ipsum Random Review Lorem
          IpsumRandom Review Lorem IpsumRandom Review Lorem IpsumRandom Random”
        </Text>
        <Button
          boxShadow
          link={urls.ERROR404}
          hoverColor={"white"}
          hoverBgColor={"black"}
          borderRadius={"5px"}
          width={"13rem"}
        >
          Check out her itinenary
        </Button>
      </Card>
    </Container>
  );
};

export default YellowReview;
