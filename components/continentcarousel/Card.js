import React from "react";
import styled from "styled-components";
import media from "../media";
import ImageLoader from "../ImageLoader";
import { useState } from "react";
import Link from "next/link";
import { logEvent } from "../../services/ga/Index";
import H2 from "../heading/H2";
import H7 from "../heading/H7";

const ImageFade = styled.div`
  width: 100%;
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
    height: ${(props) => (props.continent ? "71vh" : "35vh")};
  }
`;

const BlackContainer = styled.div`
  width: 100%;
  position: absolute;
  color: white;
  left: 50%;
  top: 50%;
  @media screen and (min-width: 768px) {
    ${(props) => (props.continent ? "top : 50%" : "top : unset ; bottom: 4%")};
  }
  ${(props) =>
    props.continent
      ? "transform: translate(-50%, -50%);"
      : "transform: translate(-50%, 0%);"};
`;

const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [ImageLoaded, setImageLoaded] = useState(false);

  const _handleRedirect = (e) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: props?.location,
        event_action: `Plan your trip anywhere in the world`,
      },
    });
  };

  return (
    <Link href={"/" + props.path}>
      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect(e)}
        continent={props.continent}
      >
        <ImageFade
          className={!ImageLoaded && "bg-gray-200 h-[71vh] animate-pulse"}
        >
          <ImageLoader
            url={props.img}
            dimensions={
              props.continent || props.hd
                ? { width: 1200, height: 800 }
                : { width: 800, height: 900 }
            }
            dimensionsMobile={
              props.continent || props.hd
                ? { width: 800, height: 600 }
                : { width: 300, height: 300 }
            }
            height={props.continent ? "71vh" : "35vh"}
            onload={() => setImageLoaded(true)}
            style={{ filter: "brightness(0.75)" }}
          ></ImageLoader>
        </ImageFade>

        <BlackContainer continent={props.continent} className="">
          {ImageLoaded ? (
            <div className="px-3">
              <H2
                style={{
                  fontSize: props.continent ? "3rem" : "1.25rem",
                  lineHeight: 1,
                  textAlign: props.country ? "left" : "center",
                  marginBottom: isPageWide ? "0.5rem" : "0rem",
                }}
              >
                {props.location}
              </H2>
              {isPageWide && (
                <H7
                  style={{
                    fontSize: props.continent ? "1.5rem" : "1rem",
                    lineHeight: 1,
                    textAlign: props.country ? "left" : "center",
                  }}
                >
                  {props.heading}
                </H7>
              )}
            </div>
          ) : (
            <div
              className={`flex flex-col gap-2 px-3 ${
                props.continent ? "items-center" : "items-start"
              }`}
            >
              <div
                className={`bg-gray-300 rounded-md animate-pulse ${
                  props.continent ? "w-[30%] h-10" : "w-[50%] h-8"
                }`}
              ></div>
              <div
                className={`bg-gray-300 rounded-md animate-pulse ${
                  props.continent ? "w-[50%] h-8" : "w-[70%] h-6"
                }`}
              ></div>
            </div>
          )}
        </BlackContainer>
      </ImageContainer>
    </Link>
  );
};

export default Experiences;
