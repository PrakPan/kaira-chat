import React, { useState } from "react";
import styled from "styled-components";
import BackroundImageLoader from "../UpdatedBackgroundImageLoader";
import media from "../media";
import Button from "../ui/button/Index";
import H4 from "../heading/H4";
import H7 from "../heading/H7";

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
                {props.location}
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
          Plan trip to {props.location} !
        </Button>
      </CtaContainer>
    </Container>
  );
};

export default Experiences;
