import React, { useState } from "react";
import styled from "styled-components";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";
import Images from "./Image";

const ArrowImage = styled.div`
  width: 5vw;
  height: auto;
  filter: invert(1);
  opacity: 0.5;
  margin: 0 2.5vw;
  position: fixed;
  top: 50%;
  @media screen and (min-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 3rem;
    top: 55%;
  }
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const ImageCotainer = styled.div`
  margin: 0 auto 0 auto;
  width: 80vw;
  height: 70vh;
  @media screen and (min-width: 768px) {
    height: 70vh;
    width: max-content;
    margin: 10vh auto 0 auto;
  }
`;

const IndexContainer = styled.span`
  width: max-content;
  display: block;
  margin: 5vh auto 0 auto;
  color: white;
`;

const ActiveIndex = styled.span``;

const InactiveIndex = styled.span`
  color: hsl(0, 0%, 70%);
`;

const Gallery = (props) => {
  const [imageSelected, setImageSelected] = useState(0);

  const _prevImgHandler = (val) => {
    if (!(imageSelected === 0)) setImageSelected(imageSelected - 1);
  };
  const _nextImgHandler = (val) => {
    if (!(imageSelected === props.images.length - 1))
      setImageSelected(imageSelected + 1);
  };

  return (
    <div>
      <IndexContainer>
        <ActiveIndex>{imageSelected + 1 + " "}/</ActiveIndex>
        <InactiveIndex> {props.images.length}</InactiveIndex>
      </IndexContainer>
      <ArrowImage
        onClick={_prevImgHandler}
        style={{ left: "0", fontSize: "2vw" }}
      >
        <BsArrowLeftCircleFill />
      </ArrowImage>
      <ArrowImage
        onClick={_nextImgHandler}
        style={{ right: "0", fontSize: "2vw" }}
      >
        <BsArrowRightCircleFill />
      </ArrowImage>
      <ImageCotainer className="center-div">
        <Images
          images={props.images}
          imageSelected={imageSelected}
          _nextImgHandler={_nextImgHandler}
          _prevImgHandler={_prevImgHandler}
        ></Images>
      </ImageCotainer>
    </div>
  );
};

export default Gallery;
