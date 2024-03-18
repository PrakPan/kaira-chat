import React from "react";
import styled from "styled-components";
import ImageLoader from "./ImageLoader";

const SaifBackgroundImageLoader = (props) => {
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const FullContainer = styled("div")`
    margin: 0 auto;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 30rem;
    padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};

    @media screen and (min-width: 768px) {
      height: 37rem;
      padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};
    }
  `;
  const imageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.url,
    edits: {
      resize: {
        width: 1,
        height: 1,
        fit: "cover",
      },
    },
  });
  return (
    <>
      <div
        style={{
          position: "static",
          zIndex: "0",
          top: "0",
          left: "0",
          height: props.height ? props.height : "100%",
          width: props.width ? props.width : "100%",
          width: "100%",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          filter: props.filter,
          backgroundColor: "rgb(230 230 230)",
          // backgroundImage: `url(${`${imgUrlEndPoint}/${Buffer.from(
          //   imageRequest
          // ).toString("base64")}`})`,
          ...props.style,
        }}
      >
        <ImageLoader
          noLazy={props.noLazy}
          url={props.url}
          style={{ filter: props.filter }}
          height="100%"
          width="100%"
          dimensions={props.dimensions}
          dimensionsMobile={props.dimensionsMobile}
          borderRadius={props.borderRadius ? props.borderRadius : "0"}
          noPlaceholder={props.noPlaceholder}
          resizeMode={props.resizeMode}
        />
      </div>
      <div
        style={{
          // position: "relative",
          // zIndex: "2",
          width: "100%",
          height: "100%",
          padding: props.padding,
        }}
      >
        {props.children}
      </div>
    </>
  );
};

export default SaifBackgroundImageLoader;
