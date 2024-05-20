import React, { useState } from "react";
import styled from "styled-components";
import media from "./media";
import usePageLoaded from "./custom hooks/usePageLoaded";
import LazyLoad from "react-lazyload";
import Image from "next/image";

const OldImageLoader = (props) => {
  const Container = styled(props.noLazy ? "div" : LazyLoad)`
    @media screen and (min-width: 768px) {
      width: ${props.width ? props.width : "100%"};
    }
    @media (min-width: 768px) and (max-width: 1024px) {
      height: ${props.heighttab ? props.heighttab : "auto"};
      width: ${props.widthtab ? props.widthtab : "100%"};
    }
  `;

  const SmallImage = styled.img`
    width: 100%;
  `;

  const FullImage = styled.img`
    width: 100%;
    object-fit: ${props.resizeMode ? props.resizeMode : "cover"};
    z-index: 0 !important;

    &:hover {
      opacity: ${props.hoveropacity ? props.hoveropacity : "1"};
      cursor: ${props.hoverpointer ? "pointer" : "auto"};
    }
  `;

  let isPageWide = media("(min-width: 768px)");
  const [error, setError] = useState(false);
  const isPageLoaded = usePageLoaded();
  const [fullLoaded, setFullLoaded] = useState(false);
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  let smallImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.url,
    edits: {
      resize: {
        width: 10,
        height: 10,
        fit: "cover",
      },
    },
  });

  let imageRequest;

  let imageRequestMobile;

  if (isPageWide) {
    if (props.dimensions) {
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width:
              props.dimensions.width > 99
                ? Math.round(props.dimensions.width / 100)
                : props.dimensions.width,
            height:
              props.dimensions.width > 99
                ? Math.round(props.dimensions.height / 100)
                : props.dimensions.height,
            fit: "cover",
          },
        },
      });
      if (!props.fit)
        imageRequest = JSON.stringify({
          bucket: "thetarzanway-web",
          key: props.url,
          edits: {
            resize: {
              width: props.dimensions.width,
              height: props.dimensions.height,
              fit: "cover",
            },
          },
        });
      else
        imageRequest = JSON.stringify({
          bucket: "thetarzanway-web",
          key: props.url,
          edits: {
            resize: {
              width: props.dimensions.width,
              height: props.dimensions.height,
              fit: props.fit,
            },
          },
        });
    } else {
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
    }
  } else {
    if (props.dimensionsMobile)
      imageRequestMobile = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensionsMobile.width,
            height: props.dimensionsMobile.height,
          },
        },
      });
    else if (props.dimensions)
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensions.width,
            height: props.dimensions.width,
            fit: "cover",
          },
        },
      });
    else
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  let is_url = isValidHttpUrl(props.url);

  const _handleError = () => {
    setError(true);
  };

  const fullImageLoadedHandler = () => {
    setFullLoaded(true);
    if (props.onload) {
      props.onload();
    }
  };

  if (props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: props.height ? props.height : "auto",
            margin: props.leftalign ? "0" : "0 auto",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            ...props.style,
          }}
        >
          <SmallImage
            alt=""
            src={
              !is_url
                ? isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            style={{
              height: props.height ? props.height : "auto",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          ></SmallImage>

          <FullImage
            alt=""
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(imageRequestMobile)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            width={props.dimensionsMobile.width}
            height={props.dimensionsMobile.height}
            onLoad={fullImageLoadedHandler}
            onError={props.onfail ? props.onfail : _handleError}
            style={{
              height: props.height ? props.height : "auto",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          ></FullImage>
        </Container>
      );
    else
      return (
        <Container
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.width ? props.width : "100%",
            height: props.height ? props.height : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            alt=""
            src={
              !is_url
                ? isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            style={{
              height: props.height ? props.height : "auto",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          ></SmallImage>

          <FullImage
            alt=""
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            onLoad={fullImageLoadedHandler}
            onError={props.onfail ? props.onfail : _handleError}
            style={{
              height: props.height ? props.height : "auto",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          ></FullImage>
        </Container>
      );
  } else {
    if (!isPageWide)
      return (
        <Container
          noLazy={props.noLazy}
          props={props}
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: props.height ? props.height : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            alt=""
            src={
              !is_url
                ? isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            onError={props.onfail}
            style={{
              height: props.height ? props.height : "auto",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          ></SmallImage>

          <FullImage
            alt=""
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            onLoad={fullImageLoadedHandler}
            onError={props.onfail ? props.onfail : _handleError}
            style={{
              height: props.height ? props.height : "auto",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          ></FullImage>
        </Container>
      );
    else
      return (
        <Container
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.width ? props.width : "100%",
            height: props.height ? props.height : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            alt=""
            src={
              !is_url
                ? isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            onLoad={fullImageLoadedHandler}
            style={{
              height: props.height ? props.height : "auto",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          ></SmallImage>
          <FullImage
            alt=""
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            onLoad={fullImageLoadedHandler}
            onError={props.onfail ? props.onfail : _handleError}
            style={{
              height: props.height ? props.height : "auto",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          ></FullImage>
        </Container>
      );
  }
};

const ImageLoader = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const isPageLoaded = usePageLoaded();

  let imageRequest;
  let imageRequestMobile;
  let smallImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.url,
    edits: {
      resize: {
        width: 10,
        height: 10,
        fit: "cover",
      },
    },
  });

  if (isPageWide) {
    if (props.dimensions) {
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width:
              props.dimensions.width > 99
                ? Math.round(props.dimensions.width / 100)
                : props.dimensions.width,
            height:
              props.dimensions.width > 99
                ? Math.round(props.dimensions.height / 100)
                : props.dimensions.height,
            fit: "cover",
          },
        },
      });
      if (!props.fit)
        imageRequest = JSON.stringify({
          bucket: "thetarzanway-web",
          key: props.url,
          edits: {
            resize: {
              width: props.dimensions.width,
              height: props.dimensions.height,
              fit: "cover",
            },
          },
        });
      else
        imageRequest = JSON.stringify({
          bucket: "thetarzanway-web",
          key: props.url,
          edits: {
            resize: {
              width: props.dimensions.width,
              height: props.dimensions.height,
              fit: props.fit,
            },
          },
        });
    } else {
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
    }
  } else {
    if (props.dimensionsMobile)
      imageRequestMobile = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensionsMobile.width,
            height: props.dimensionsMobile.height,
          },
        },
      });
    else if (props.dimensions)
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensions.width,
            height: props.dimensions.width,
            fit: "cover",
          },
        },
      });
    else
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
  }

  if (isPageWide && props.dimensionsMobile) {
    return (
      <ImageContainer
        containerStyle={{
          width: props.width ? props.width : "100%",
          height: props.height ? props.height : "max-content",
          margin: props.leftalign ? "0" : "0 auto",
          filter: props.blur ? "blur(0.5rem)" : "blur(0)",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
        }}
        isPageLoaded={isPageLoaded}
        imageRequest={imageRequest}
        smallImageRequest={smallImageRequest}
        {...props}
      />
    );
  } else if (isPageWide && !props.dimensionsMobile) {
    return (
      <ImageContainer
        containerStyle={{
          width: props.width ? props.width : "100%",
          height: props.height ? props.height : "max-content",
          margin: props.leftalign ? "0" : "0 auto",
          filter: props.blur ? "blur(0.5rem)" : "blur(0)",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
        }}
        isPageLoaded={isPageLoaded}
        imageRequest={imageRequest}
        smallImageRequest={smallImageRequest}
        {...props}
      />
    );
  } else if (!isPageWide && props.dimensionsMobile) {
    return (
      <ImageContainer
        containerStyle={{
          width: props.widthmobile ? props.widthmobile : "100%",
          height: props.height ? props.height : "auto",
          margin: props.leftalign ? "0" : "0 auto",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          ...props.style,
        }}
        isPageLoaded={isPageLoaded}
        imageRequest={imageRequestMobile}
        smallImageRequest={smallImageRequest}
        {...props}
      />
    );
  } else if (!isPageWide && !props.dimensionsMobile) {
    return (
      <ImageContainer
        containerStyle={{
          width: props.widthmobile ? props.widthmobile : "100%",
          height: props.height ? props.height : "max-content",
          margin: props.leftalign ? "0" : "0 auto",
          filter: props.blur ? "blur(0.5rem)" : "blur(0)",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
        }}
        isPageLoaded={isPageLoaded}
        imageRequest={imageRequest}
        smallImageRequest={smallImageRequest}
        {...props}
      />
    );
  }
};

export default ImageLoader;

const ImageContainer = (props) => {
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const [error, setError] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);

  function handleError() {
    setError(true);
  }

  function fullImageLoadedHandler() {
    setFullLoaded(true);
    if (props.onload) {
      props.onload();
    }
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  let is_url = isValidHttpUrl(props.url);

  return (
    <div
      blur={fullLoaded}
      onClick={props.onclick}
      style={{ ...props.containerStyle }}
    >
      {/* Small Image */}
      <Image
        src={
          is_url
            ? props.url
            : props.isPageLoaded
            ? `${imgUrlEndPoint}/${btoa(props.smallImageRequest)}`
            : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
        }
        width={100}
        height={100}
        loading={props.noLazy ? "eager" : "lazy"}
        onLoad={fullImageLoadedHandler}
        onError={props.onfail ? props.onfail : handleError}
        alt=""
        style={{
          width: props.width ? props.width : "100%",
          height: props.height ? props.height : "100%",
          display: !fullLoaded ? "initial" : "none",
          borderRadius: props.borderRadius ? props.borderRadius : "5px",
          ...props.style,
        }}
      />

      {/* Full Image */}
      <Image
        src={
          is_url
            ? props.url
            : error
            ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
            : props.isPageLoaded
            ? `${imgUrlEndPoint}/${btoa(props.imageRequest)}`
            : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
        }
        width={145}
        height={145}
        priority={props.noLazy ? true : false}
        loading={props.noLazy ? "eager" : "lazy"}
        onLoad={fullImageLoadedHandler}
        onError={props.onfail ? props.onfail : handleError}
        alt=""
        style={{
          display: fullLoaded ? "block" : "none",
          width: props.width ? props.width : "100%",
          height: props.height ? props.height : "100%",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          maxWidth: props.maxwidth ? props.maxwidth : "none",
          maxHeight: props.maxheight ? props.maxheight : "none",
          objectFit: props.resizeMode ? props.resizeMode : "cover",
          ...props.style,
        }}
      />
    </div>
  );
};
