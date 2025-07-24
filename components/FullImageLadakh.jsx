import React from "react";
import styled from "styled-components";
import BackgroundImageLoader from "./UpdatedBackgroundImageLoader";

const Container = styled.div`
  width: 100%;
  position: relative;

  // Apply aspect ratio only when no height is provided
  height: ${(props) => (props.heightmobile ? props.heightmobile : "auto")};
  aspect-ratio: ${(props) => (props.heightmobile ? "unset" : "9 / 5")};

  @media screen and (min-width: 768px) {
    height: ${(props) => (props.height ? props.height : "auto")};
    aspect-ratio: ${(props) => (props.height ? "unset" : "9 / 5")};
  }
`;

const FullImageLadakh = (props) => {
  const dimensions = { width: 1920, height: 800 };
  const dimensionsMobile = { width: 375, height: 632 };

  if (props.center) {
    return (
      <Container height={props.height} heightmobile={props.heightmobile}>
        <BackgroundImageLoader
          padding={props.padding}
          filter={props.filter}
          center
          url={props.url}
          height={props.height}
          dimensions={dimensions}
          dimensionsMobile={dimensionsMobile}
          className="center-div"
          style={{ position: "absolute", zIndex: props.zIndex }}
          noLazy={props.noLazy}
        >
          <div className="w-full">{props.children}</div>
        </BackgroundImageLoader>
      </Container>
    );
  } else {
    return (
      <Container height={props.height} heightmobile={props.heightmobile}>
        <BackgroundImageLoader
          padding={props.padding}
          filter={props.filter}
          url={props.url}
          dimensions={dimensions}
          dimensionsMobile={dimensionsMobile}
          style={{ position: "absolute" }}
          className="center"
          resizeMode={props.resizeMode}
          noLazy={props.noLazy}
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

export default FullImageLadakh;
