import React from "react";
import styled from "styled-components";
import BackgroundImageLoader from "./UpdatedBackgroundImageLoader";

const Container = styled.div`
  width: 100%;
  padding: 0;
  height: ${(props) => (props.heightmobile ? props.heightmobile : "37rem")};
  @media screen and (min-width: 768px) {
    height: ${(props) => (props.height ? props.height : "37rem")};
    padding: 0;
  }
  position: relative;
`;

const FullImage = (props) => {
  if (props.center) {
    return (
      <Container height={props.height} heightmobile={props.heightmobile}>
        {props.img ? (
          <BackgroundImageLoader
            padding={props.padding}
            filter={props.filter}
            center
            url={props.url}
            dimensions={{ width: 1806, height: 592 }}
            dimensionsMobile={{ width: 607, height: 810 }}
            className="center-div"
            style={{ position: "absolute", zIndex: props.zIndex }}
          >
            <div>{props.children}</div>
          </BackgroundImageLoader>
        ) : (
          <BackgroundImageLoader
            filter={props.filter}
            center
            className="center-div"
            url={props.url}
            dimensions={{ width: 1806, height: 592 }}
            dimensionsMobile={{ width: 607, height: 810 }}
            style={{ position: "absolute", zIndex: props.zIndex }}
          >
            <div>{props.children}</div>
          </BackgroundImageLoader>
        )}
      </Container>
    );
  } else {
    return (
      <Container
        height={props.height}
        heightmobile={props.heightmobile}
        className="center-dv"
      >
        <BackgroundImageLoader
          padding={props.padding}
          filter={props.filter}
          url={props.url}
          dimensions={
            props?.resizeMode === "fill"
              ? { width: 2240, height: 840 }
              : { width: 2240, height: 840 }
          }
          dimensionsMobile={
            props?.resizeMode === "fill"
              ? { width: 607, height: 810 }
              : { width: 607, height: 810 }
          }
          style={{ position: "absolute" }}
          className="center-dv"
          resizeMode={props.resizeMode}
        >
          <div
            style={{
              position: "absolute",
              zIndex: "5",
              width: "100%",
              height: "100%",
            }}
          >
            {props.children}
          </div>
        </BackgroundImageLoader>
      </Container>
    );
  }
};

export default FullImage;
