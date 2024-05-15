import React from "react";
import styled from "styled-components";
import Carousel from "react-bootstrap/Carousel";

const CarouselContainer = styled.div`
  filter: drop-shadow(4px 6px 10px black);
  border-radius: 15px;
`;

const CarouselImage = styled.img`
  border-radius: 15px;
`;

const Overview = (props) => {
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  let imgRequestBody = {
    bucket: "thetarzanway-web",
    key: "",
    edits: {
      resize: {
        width: 1200,
        height: 600,
        fit: "cover",
      },
    },
  };
  return (
    <CarouselContainer>
      <Carousel interval="1000">
        <Carousel.Item>
          <CarouselImage
            className="d-block w-100"
            src={`${imgUrlEndPoint}/${btoa(
              JSON.stringify({
                ...imgRequestBody,
                key: props.images.main_image,
              })
            )}`}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage
            className="d-block w-100"
            src={`${imgUrlEndPoint}/${btoa(
              JSON.stringify({ ...imgRequestBody, key: props.images.image_1 })
            )}`}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage
            className="d-block w-100"
            src={`${imgUrlEndPoint}/${btoa(
              JSON.stringify({ ...imgRequestBody, key: props.images.image_2 })
            )}`}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage
            className="d-block w-100"
            src={`${imgUrlEndPoint}/${btoa(
              JSON.stringify({ ...imgRequestBody, key: props.images.image_3 })
            )}`}
            alt="Fourth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage
            className="d-block w-100"
            src={`${imgUrlEndPoint}/${btoa(
              JSON.stringify({ ...imgRequestBody, key: props.images.image_4 })
            )}`}
            alt="Fifth slide"
          />
        </Carousel.Item>
      </Carousel>
    </CarouselContainer>
  );
};

export default Overview;
