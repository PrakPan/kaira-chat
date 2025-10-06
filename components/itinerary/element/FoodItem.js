import React from "react";
import styled from "styled-components";
import ImageLoader from "../../ImageLoader";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 0.5rem;

  border-radius: 5px;
  padding: 0.25rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 2fr 4fr;
  }
`;

const Heading = styled.p`
  font-weight: 600;
  margin: 0;
`;

const Text = styled.p`
  font-size: 0.75rem;
  font-weight: 300;
  margin: 0;
`;

const FoodData = (props) => {
  return (
    <Container className="border-thin">
      <div className="center-div">
        <ImageLoader
          url={props.data ? props.data.image : null}
          dimensions={{ width: 400, height: 400 }}
          width="100%"
          widthMobile="100%"
          borderRadius="50%"
        ></ImageLoader>
      </div>
      <div>
        <Heading className="">
          {props.data ? props.data.name : null}
        </Heading>
        <Text className="">
          {props.data ? props.data.description.substring(0, 150) + "..." : null}
        </Text>
      </div>
    </Container>
  );
};

export default FoodData;
