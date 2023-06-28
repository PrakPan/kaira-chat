import React from "react";
import styled from "styled-components";
import media from "../media";
import ImageLoader from "../ImageLoader";
import { useRouter } from "next/router";
import { useState } from "react";

const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;
const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: ${(props) => (props.continent ? "35vh" : "23vh")};

  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
  @media screen and (min-width: 768px) {
    // height: 35vh;
    height: ${(props) => (props.continent ? "71vh" : "35vh")};
  }
`;

const BlackContainer = styled.div`
  width: 100%;
  position: absolute;
  color: white;
  left: 50%;
  top : 50%;
  @media screen and (min-width: 768px) {
    ${(props) => (props.continent ? "top : 50%" : "top : unset ; bottom: 0%")};
  }
  transform: translate(-50%, -50%);
`;
const Heading = styled.p`
  font-size: ${(props) => (props.continent ? "3rem" : "1.25rem")};
  font-weight: 700;
  line-height: 1;
  text-align: center;
  margin-bottom: 0rem;

  @media screen and (min-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;
const Subheading = styled.p`
  font-size: ${(props) => (props.continent ? "1.5rem" : "1rem")};

  line-height: 1;
  text-align: center;
margin : 0;
  font-weight: 200;
`;

const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [ImageLoaded, setImageLoaded] = useState(false);

  const _handleRedirect = (e) => {
    e.preventDefault();
    if (props.path) window.location.href = "/" + props.path;
  };
  const path = props.city
    ? "https://thetarzanway.com/travel-guide/city/"
    : "https://thetarzanway.com/travel-planner/";
  return (
    <ImageContainer
      className="hover-pointer"
      onClick={(e) => _handleRedirect(e)}
      continent={props.continent}
    >
      <ImageFade>
        <ImageLoader
          url={props.img}
          dimensions={
            props.continent || props.hd
              ? { width: 1500, height: 1000 }
              : { width: 800, height: 900 }
          }
          dimensionsMobile={
            props.continent || props.hd
              ? { width: 800, height: 700 }
              : { width: 300, height: 400 }
          }
          height={props.continent ? "71vh" : "35vh"}
          onload={() => setImageLoaded(true)}
          style={{filter : 'brightness(0.75)'}}
        ></ImageLoader>
      </ImageFade>
      <BlackContainer continent={props.continent} className="font-lexend">
        {ImageLoaded && <>
          <Heading continent={props.continent}>{props.location}</Heading>
          {isPageWide && (
            <Subheading continent={props.continent}>{props.heading}</Subheading>
          )}
        </>}
      </BlackContainer>
    </ImageContainer>
  );
};

export default Experiences;
