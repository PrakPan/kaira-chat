import React from "react";
import styled from "styled-components";
import BackgroundImageLoader from "../../UpdatedBackgroundImageLoader";

const Container = styled.div`
  width: 100%;
  height: ${(props) => (props.heightmobile ? props.heightmobile : "37rem")};
  @media screen and (min-width: 768px) {
    height: ${(props) => (props.height ? props.height : "37rem")};
  }
  position: relative;
`;

export default function NewYearBanner(props) {
    if (props.center) {
        return (
            <Container height={props.height} heightmobile={props.heightmobile}>
                {props.img ? (
                    <BackgroundImageLoader
                        padding={props.padding}
                        filter={props.filter}
                        center
                        url={props.url}
                        height={props.height}
                        dimensions={{ width: 1806, height: 592 }}
                        dimensionsMobile={{ width: 607, height: 810 }}
                        className="center-div"
                        style={{ position: "absolute", zIndex: props.zIndex }}
                        noLazy={props.noLazy}
                    >
                        <div className="w-full">{props.children}</div>
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
                        noLazy={props.noLazy}
                    >
                        <div>{props.children}</div>
                    </BackgroundImageLoader>
                )}
            </Container>
        );
    } else {
        return (
            <Container height={props.height} heightmobile={props.heightmobile}>
                <BackgroundImageLoader
                    padding={props.padding}
                    filter={props.filter}
                    url={props.url}
                    dimensions={
                        props?.resizeMode === "fill"
                            ? { width: 2240, height: 840 }
                            : { width: 2240, height: 1040 }
                    }
                    dimensionsMobile={
                        props?.resizeMode === "fill"
                            ? { width: 607, height: 810 }
                            : { width: 607, height: 810 }
                    }
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
