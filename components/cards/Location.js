import React, { useState } from "react";
import styled from "styled-components";
import BackroundImageLoader from "../UpdatedBackgroundImageLoader";
import media from "../media";
import Button from "../ui/button/Index";
import H4 from "../heading/H4";
import H7 from "../heading/H7";
import ImageLoader from "../ImageLoader";

const Container = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  height: 60vh;
  position: relative;
  @media screen and (min-width: 768px) {
    margin: 0;
    max-width: 100%;
    height: 50vh;
  }
  &:hover {
    cursor: pointer;
    .TextContainer {
      bottom: 30%;
    }
    .CtaContainer {
      height: 30%;
    }
  }
  @media screen and (min-width: 1300px) {
    &:hover {
      .TextContainer {
        bottom: 23%;
      }
      .CtaContainer {
        height: 20%;
      }
    }
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  flex-direction: column;
  position: absolute;
  bottom: 8%;
  ${(props) => props.loading && "bottom : 23%"};
  transition: bottom 0.3s ease;
`;

const CtaContainer = styled.div`
position absolute;
color : white;
font-size : 3rem;
background: linear-gradient(to bottom, transparent, black);
overflow : hidden;
bottom : 0;
left : 0;
right : 0;
height : 0%;
${(props) => props.loading && "height : 20%"};
transition : height 0.3s ease;
`;

const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Container
      className={`${imageLoading ? "bg-gray-200 animate-pulse" : ""}`}
      onClick={props.onclick ? props.onclick : null}
    >
      <BackroundImageLoader
        filter="brightness(0.9)"
        padding="0"
        zoomonhover
        dimensions={{ width: 900, height: 1800 }}
        height={isPageWide ? "50vh" : "60vh"}
        url={props.img}
        onload={() => {
          setImageLoading(false);
        }}
      >
        <TextContainer loading={loading} className="w-full TextContainer">
          {imageLoading ? (
            <div className="w-full flex flex-col gap-3 items-center">
              <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
            </div>
          ) : (
            <>
              <H7
                style={{
                  textAlign: "center",
                  color: "white",
                  lineHeight: 1,
                  width: "100%",
                  letterSpacing: "1px",
                }}
                className="font-lexend"
              >
                {props.heading}
              </H7>
              <H4
                className="font-lexend"
                style={{
                  color: "white",
                  letterSpacing: "0",
                  marginTop: "0.5rem",
                  textAlign: "center",
                  lineHeight: 1,
                  width: "100%",
                }}
              >
                {props.name}
              </H4>
            </>
          )}
        </TextContainer>
      </BackroundImageLoader>

      <CtaContainer loading={loading} className="CtaContainer">
        <Button
          margin="1.5rem auto"
          color="white"
          borderColor="white"
          borderRadius="50px"
          style={{ maxWidth: "98%", fontSize: "0.85rem" }}
          loading={loading}
          onclick={() => {
            if (props.onclick) {
              setLoading(true);
              props.onclick();
            }
          }}
        >
          Plan trip to {props.name} !
        </Button>
      </CtaContainer>
    </Container>
  );
};

export default Experiences;

export const LocationCard = (props) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      onClick={props.onclick ? props.onclick : null}
      className={`group relative h-[45vh] rounded-[10px] overflow-hidden ${
        imageLoading ? "bg-gray-200 animate-pulse" : ""
      }`}
    >
      <ImageLoader
        noLazy={props.noLazy}
        url={props.img}
        style={{ filter: props.filter }}
        height={props.height ? props.height : "100%"}
        width={props.width ? props.width : "100%"}
        dimensions={props.dimensions}
        dimensionsMobile={props.dimensionsMobile}
        borderRadius={props.borderRadius ? props.borderRadius : "10px"}
        noPlaceholder={props.noPlaceholder}
        resizeMode={props.resizeMode}
        onload={() => {
          setImageLoading(false);
        }}
      />

      {props.location.best_time ? (
        imageLoading ? (
          <div className="w-[40%] h-6 absolute top-4 left-4 rounded-full  bg-gray-300 animate-pulse"></div>
        ) : (
          <div className="w-fit absolute top-4 left-4 rounded-full text-xs text-center font-normal text-white bg-[#01202B] px-[10px] py-1">
            {props.location.best_time}
          </div>
        )
      ) : null}

      <div
        className={`w-full flex flex-col px-3 gap-2 rounded-[10px] absolute bottom-0 pb-4 translate-y-[60px] transition-all ${
          !imageLoading &&
          "bg-gradient-to-t from-black from-60% group-hover:translate-y-0"
        }`}
      >
        <div className="w-full">
          {imageLoading ? (
            <div className="w-full flex flex-col gap-2 items-start py-2">
              <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
            </div>
          ) : (
            <div className="w-full flex flex-col py-1">
              <div>
                <p className="text-white text-lg font-bold leading-[16px]">
                  {props.name}
                </p>
                <p className="text-white text-md font-light leading-[14px]">
                  {props.heading}
                </p>
              </div>
            </div>
          )}
        </div>

        <button className="w-full bg-[#F7E700] rounded-lg text-sm text-black text-center px-2 py-2">
          Plan a trip
        </button>
      </div>
    </div>
  );
};
