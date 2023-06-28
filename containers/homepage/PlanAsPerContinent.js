import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import media from "../../components/media";
import Button from "../../components/ui/button/Index";
import ImageLoader from "../../components/ImageLoader";
import axiosPageListInstance from '../../services/pages/list'
import SkeletonCard from "../../components/ui/SkeletonCard";
import openTailoredModal from "../../services/openTailoredModal";
const Container = styled.div`
  height: 90vh;
  display: grid;
  gap: 0.2rem;
  grid-template-areas:
    "a a a a a b b b b b"
    "a a a a a b b b b b"
    "c c c d d d e e e e"
    "c c c d d d e e e e"
    "c c c d d d e e e e"
    "c c c d d d e e e e"
    "f f f f f f e e e e"
    "f f f f f f g g g g";

  padding: 10px;

  @media screen and (min-width: 768px) {
    height: 95vh;
    gap: 0.5rem;
    grid-template-areas:
      "a a a a b b b b b"
      "a a a a b b b b b"
      "a a a a b b b b b"
      "a a a a e e e e e"
      "c d d d e e e e e"
      "c d d d e e e e e"
      "c d d d e e e e e"
      "f f f g g g g g g"
      "f f f g g g g g g"
      "f f f g g g g g g"
      "f f f g g g g g g";
  }

 
  }
`;
const TopSlideIn = keyframes`
from { 
  transform: translateY(0%);
}
to { 
  transform: translateY(30%);
} 
`;

const TopSlideOut = keyframes`
from { 
  transform: translateY(30%);
}
to { 
  transform: translateY(0%);
} 

`;

const TextContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: ${(props) => (props.right ? "9px" : null)};
  text-align: ${(props) => (props.right ? "right" : "left")};
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  & > p {
    margin-top: -5px;
    font-weight: 500;
    font-size: 14px;
    @media screen and (min-width: 768px) {
      font-size: 20px;
    }
  }
  @media screen and (min-width: 768px) {
    animation: 0.5s ${TopSlideOut};
    transform: translate(0%, 0%);

    text-align: left;
    top: 30px;
    left: 30px;
  }
`;

const Heading = styled.div`
  font-size: 16px;
  font-weight: 700;
  @media screen and (min-width: 768px) {
    font-size: 25px;
  }
`;

const GridItem = styled.div`
  grid-area: ${(props) => props.className};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;
const ImageContainer = styled.div`
  cursor: pointer;
  height: 100%;
  width: 100%;
  .StartNow {
    display: none;
    top: 45px;
    animation: 0.5s ${TopSlideIn};
    @media screen and (min-width: 768px) {
      top: 65px;
      left: 30px;
    }
  }
  transition: 0.5s all ease-in-out;
  &:hover {
    // transform: scale(1.1);
  @media screen and (min-width: 768px) {

    .AnimateTop {
      animation: 0.5s ${TopSlideIn} forwards;
    }
    .StartNow {
      animation: 0.5s ${TopSlideIn} forwards;
      display: initial;
    }
  }
}
`;

const BlackContainer = styled.div`
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 100%
  );
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  &:hover {
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(255, 255, 255, 0) 58%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#ffffff",GradientType=1);
  }
`;

const PlanAsPerTheme = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const order = ["a", "b", "c", "d", 'e', 'f', 'g'];

  const _handleTripRedirect = (path) => {
      if(path) window.location.href = '/' + path
  };

  const ThemeContainer = props.data?.map((e, i) => (
    <GridItem
      className={order[i]}
      key={i}
      onClick={() => _handleTripRedirect(e.path)}
    >
      <ImageContainer>
        {
          <TextContainer className="AnimateTop">
            <Heading>{isPageWide ? e.banner_heading : e.destination}</Heading>
            {isPageWide && <div className="StartNow">Explore!</div>}
          </TextContainer>
        }
        <ImageLoader
          noLazy
          fit="cover"
          width="100%"
          height="100%"
          dimensions={{ width: 1500, height: 800 }}
          dimensionsMobile={{ width: 500, height: 500 }}
          url={e.image}
          style={{ filter: "brightness(0.75)" }}

          // onload={_handleImageLoaded}
        ></ImageLoader>
        {/* {<BlackContainer />} */}
      </ImageContainer>
    </GridItem>
  ));

  const SkeletonContainer = order.map((e,i) => (
    <GridItem
      className={e}
      key={i}
    >
     <SkeletonCard />
    </GridItem>
  ));

  return (
    <>
      <Container>{props.data.length ? ThemeContainer : SkeletonContainer}</Container>

      {!props.nostart ? (
        <Button
          onclick={() =>
            openTailoredModal(router, props.page_id, props.destination)
          }
          borderWidth="1px"
          fontWeight="500"
          borderRadius="6px"
          margin="2rem auto"
          padding="0.5rem 2rem"
        >
          Create a plan. It's free!
        </Button>
      ) : null}
    </>
  );
};

export default React.memo(PlanAsPerTheme);
