import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "./media";
import usePageLoaded from "./custom hooks/usePageLoaded";
import LazyLoad from "react-lazyload";
import Image from "next/image";

const ImageLoader = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const isPageLoaded = usePageLoaded();
  const [error, setError] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const transparentImageUrl =
    "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png";

  // Check if the current image is transparent
  const checkIfTransparent = (url) => {
    return (
      url === transparentImageUrl ||
      url.includes("transparent.png") ||
      (props.url &&
        typeof props.url === "string" &&
        props.url.includes("transparent"))
    );
  };

  let smallImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.url,
    edits: {
      resize: {
        width: 99,
        height: 99,
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

      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensions.width,
            height: props.dimensions.height,
            fit: props?.fit ?? "cover",
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

  const Container = styled(props.noLazy ? "div" : LazyLoad)`
    @media screen and (min-width: 768px) {
      width: ${props.width ? props.width : "100%"};
      ${(props) =>
        props.transparent &&
        `
      aspect-ratio: 2 / 1;
    `}
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      height: ${props.heighttab ? props.heighttab : "auto"};
      width: ${props.widthtab ? props.widthtab : "100%"};
    }

    @media screen and (max-width: 767px) {
      ${(props) =>
        props.transparent &&
        `
      aspect-ratio: 1.4315;
    `}
    }

    ${(props) =>
      props.transparent &&
      `
    position: relative;
  `}
  `;

  const FullImage = styled.img`
    width: 100%;
    object-fit: ${props.resizeMode ? props.resizeMode : "cover"};
    z-index: 0 !important;

    ${(props) =>
      props.transparent &&
      `
      height: 100%;
      object-fit: contain;
    `}

    &:hover {
      opacity: ${props.hoveropacity ? props.hoveropacity : "1"};
      cursor: ${props.hoverpointer ? "pointer" : "auto"};
    }
  `;

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  const _handleError = () => {
    if (!error) {
      if (props.onfail) props.onfail();
      setError(true);
    }
  };

  let is_url = isValidHttpUrl(props.url);

  const fullImageLoadedHandler = () => {
    if (props.onload) {
      props.onload();
    }
    setFullLoaded(true);
  };

  const getBtoaUrl = (imgUrlEndPoint, imageRequest) => {
    try {
      return `${imgUrlEndPoint}${btoa(imageRequest)}`;
    } catch (err) {
      console.error(err);
      return "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png";
    }
  };

  // Helper function to get the final image URL and check if it's transparent
  const getFinalImageUrl = (
    isError,
    isPageLoaded,
    imageRequest,
    originalUrl
  ) => {
    if (!is_url) {
      if (isError) {
        return transparentImageUrl;
      }
      if (isPageLoaded) {
        return getBtoaUrl(imgUrlEndPoint, imageRequest);
      }
      return transparentImageUrl;
    }
    return originalUrl;
  };

  // Check transparency when URLs change
  useEffect(() => {
    const smallUrl = getFinalImageUrl(
      false,
      isPageLoaded,
      smallImageRequest,
      props.url
    );
    const fullUrl = getFinalImageUrl(
      error,
      isPageLoaded,
      imageRequest || imageRequestMobile,
      props.url
    );

    setIsTransparent(
      checkIfTransparent(smallUrl) || checkIfTransparent(fullUrl)
    );
  }, [error, isPageLoaded, props.url]);

  if (!props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
          blur={fullLoaded}
          transparent={isTransparent}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: isTransparent
              ? "auto"
              : props.heightmobile
              ? props.heightmobile
              : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            src={
              is_url
                ? props.url
                : error
                ? transparentImageUrl
                : isPageLoaded
                ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                : transparentImageUrl
            }
            // src={
            //   !is_url
            //     ? isPageLoaded
            //       ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
            //       : transparentImageUrl
            //     : props.url
            // }
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              objectFit: isTransparent ? "contain" : "cover",
              ...props.style,
            }}
          />

          <FullImage
            src={
              is_url
                ? props.url
                : isPageLoaded
                ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                : transparentImageUrl
            }
            transparent={isTransparent}
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          />
        </Container>
      );
    else
      return (
        <Container
          blur={fullLoaded}
          transparent={isTransparent}
          onClick={props.onclick}
          style={{
            width: props.width ? props.width : "100%",
            height: isTransparent
              ? "auto"
              : props.height
              ? props.height
              : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            src={
              !is_url
                ? isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
                  : transparentImageUrl
                : props.url
            }
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              objectFit: isTransparent ? "contain" : "cover",
              ...props.style,
            }}
          />

          <FullImage
            src={
              !is_url
                ? error
                  ? transparentImageUrl
                  : isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            transparent={isTransparent}
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          />
        </Container>
      );
  } else if (props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
          blur={fullLoaded}
          transparent={isTransparent}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: isTransparent
              ? "auto"
              : props.heightmobile
              ? props.heightmobile
              : "100%",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            ...props.style,
          }}
        >
          <SmallImage
            src={
              !is_url
                ? isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
                  : transparentImageUrl
                : props.url
            }
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              objectFit: isTransparent ? "contain" : "cover",
              ...props.style,
            }}
          />

          <FullImage
            src={
              !is_url
                ? error
                  ? transparentImageUrl
                  : isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, imageRequestMobile)
                  : transparentImageUrl
                : props.url
            }
            width={props.dimensionsMobile.width}
            height={props.dimensionsMobile.height}
            transparent={isTransparent}
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          />
        </Container>
      );
    else
      return (
        <Container
          blur={fullLoaded}
          transparent={isTransparent}
          onClick={props.onclick}
          style={{
            width: props.width ? props.width : "100%",
            height: isTransparent
              ? "auto"
              : props.height
              ? props.height
              : "max-content",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <SmallImage
            src={
              !is_url
                ? isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
                  : transparentImageUrl
                : props.url
            }
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              objectFit: isTransparent ? "contain" : "cover",
              ...props.style,
            }}
          />
          <FullImage
            src={
              !is_url
                ? error
                  ? transparentImageUrl
                  : isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                  : transparentImageUrl
                : props.url
            }
            transparent={isTransparent}
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: isTransparent
                ? "100%"
                : props.height
                ? props.height
                : "100%",
              display: fullLoaded ? "block" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "0",
              maxWidth: props.maxwidth ? props.maxwidth : "none",
              maxHeight: props.maxheight ? props.maxheight : "none",
              ...props.style,
            }}
          />
        </Container>
      );
  }
};

export default ImageLoader;

const SmallImage = (props) => {
  return (
    <Image
      alt=""
      src={props.src}
      width={145}
      height={145}
      style={{ width: "100%", ...props.style }}
    />
  );
};
