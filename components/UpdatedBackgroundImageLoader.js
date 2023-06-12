// import build from '@date-io/date-fns';
import React, { useState, useRef, useEffect } from "react";
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
      <FullContainer
        className={props.center ? "center-div " : ""}
        padding={props.padding}
        style={{
          backgroundImage: `url(${`${imgUrlEndPoint}/${Buffer.from(
            imageRequest
          ).toString("base64")}`})`,
          width: props.width ? props.width : "100%",
          maxWidth: "100%",
          height: props.height ? props.height : "100%",
          display: "flex",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#7e7e7e",
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: "0",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
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
          />
        </div>
        <div
          style={{
            position: "static",
            zIndex: "1",
            width: "100%",
            height: "100%",
          }}
        >
          {props.children}
        </div>
      </FullContainer>
    </>
  );
};

export default SaifBackgroundImageLoader;
