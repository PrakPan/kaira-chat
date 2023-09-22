import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "./media";
import usePageLoaded from "./custom hooks/usePageLoaded";
import LazyLoad from "react-lazyload";
const ImageLoader = (props) => {
  const [error, setError] = useState(false);
  let isPageWide = media("(min-width: 768px)");
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

  const smallurl = imgUrlEndPoint + "40x30/" + props.url;
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
    setError(true);
  };
  let is_url = isValidHttpUrl(props.url);
  const fullImageLoadedHandler = () => {
    if (props.onload) {
      props.onload();
    }
    setFullLoaded(true);
  };
  if (!props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
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
          {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
          <SmallImage
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
            // loading="lazy"
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
          {/* <img src={imgUrlEndPoint + props.url} /> */}
          {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
          <SmallImage
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
            // loading="lazy"
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
  } else if (props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: props.height ? props.height : "auto",
            margin: props.leftalign ? "0" : "0 auto",
            filter: props.blur ? "blur(0.5rem)" : "blur(0)",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            ...props.style,
          }}
        >
          {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
          <SmallImage
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
            // loading="lazy"
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                  ? `${imgUrlEndPoint}/${btoa(imageRequestMobile)}`
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : props.url
            }
            // src={!is_url  ?   `${imgUrlEndPoint}/${btoa(imageRequestMobile)}` :props.url}
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
          {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
          <SmallImage
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
            // loading="lazy"
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
  // }
};

export default ImageLoader;

// ImageLoader with next/image :-

// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import media from "./media";
// import usePageLoaded from "./custom hooks/usePageLoaded";
// import Image from "next/image";
// // import LazyLoad from "react-lazyload";
// const ImageLoader = (props) => {
//   const elementRef = useRef()
//   const [error, setError] = useState(false);
//   let isPageWide = media("(min-width: 768px)");
//   const isPageLoaded = usePageLoaded();
//   const [fullLoaded, setFullLoaded] = useState(false);

//   const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

//   let smallImageRequest = JSON.stringify({
//     bucket: "thetarzanway-web",
//     key: props.url,
//     edits: {
//       resize: {
//         width: 10,
//         height: 10,
//         fit: "cover",
//       },
//     },
//   });
//   const colorRequest = JSON.stringify({
//     bucket: "thetarzanway-web",
//     key: props.url,
//     edits: {
//       resize: {
//         width: 1,
//         height: 1,
//         fit: "cover",
//       },
//     },
//   });
//   let imageRequest;
//   let imageRequestMobile;
//   if (isPageWide) {
//     if (props.dimensions) {
//       smallImageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width:
//               props.dimensions.width > 99
//                 ? Math.round(props.dimensions.width / 100)
//                 : props.dimensions.width,
//             height:
//               props.dimensions.width > 99
//                 ? Math.round(props.dimensions.height / 100)
//                 : props.dimensions.height,
//             fit: "cover",
//           },
//         },
//       });
//       if (!props.fit)
//         imageRequest = JSON.stringify({
//           bucket: "thetarzanway-web",
//           key: props.url,
//           edits: {
//             resize: {
//               width: props.dimensions.width,
//               height: props.dimensions.height,
//               fit: "cover",
//             },
//           },
//         });
//       else
//         imageRequest = JSON.stringify({
//           bucket: "thetarzanway-web",
//           key: props.url,
//           edits: {
//             resize: {
//               width: props.dimensions.width,
//               height: props.dimensions.height,
//               fit: props.fit,
//             },
//           },
//         });
//     } else {
//       imageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             fit: "cover",
//           },
//         },
//       });
//       smallImageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             fit: "cover",
//           },
//         },
//       });
//     }
//   } else {
//     if (props.dimensionsMobile)
//       imageRequestMobile = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: props.dimensionsMobile.width,
//             height: props.dimensionsMobile.height,
//           },
//         },
//       });
//     else if (props.dimensions)
//       imageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: props.dimensions.width,
//             height: props.dimensions.width,
//             fit: "cover",
//           },
//         },
//       });
//     else
//       imageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             fit: "cover",
//           },
//         },
//       });
//   }

//   const smallurl = imgUrlEndPoint + "40x30/" + props.url;
//   const Container = styled.div`
//     transition: filter 0.5s ease;
//     @media screen and (min-width: 768px) {
//       width: ${props.width ? props.width : "100%"};
//     }
//     @media (min-width: 768px) and (max-width: 1024px) {
//       height: ${props.heighttab ? props.heighttab : "auto"};
//       width: ${props.widthtab ? props.widthtab : "100%"};
//     }
//   `;

//   const SmallImage = styled.img`
//     width: 100%;
//     transition: opacity 0.5s ease;
//   `;
//   const FullImage = styled(Image)`
//     width: 100%;
//     object-fit: ${props.resizeMode ? props.resizeMode : "cover"};
//     z-index: 0 !important;
//     transition: opacity 0.5s ease;
//     &:hover {
//       opacity: ${props.hoveropacity ? props.hoveropacity : "1"};
//       cursor: ${props.hoverpointer ? "pointer" : "auto"};
//     }
//   `;

//   function isValidHttpUrl(string) {
//     let url;

//     try {
//       url = new URL(string);
//     } catch (_) {
//       return false;
//     }

//     return url.protocol === "http:" || url.protocol === "https:";
//   }
//   const _handleError = () => {
//     setError(true);
//   };
//   let is_url = isValidHttpUrl(props.url);
//   const fullImageLoadedHandler = () => {
//     if (props.onload) {
//       props.onload();
//     }
//     setFullLoaded(true);
//   };
//   if (!props.dimensionsMobile) {
//     if (!isPageWide)
//       return (
//         <Container
//           blur={fullLoaded}
//           onClick={props.onclick}
//           style={{
//             width: props.widthmobile ? props.widthmobile : "100%",
//             height: props.height ? props.height : "max-content",
//             margin: props.leftalign ? "0" : "0 auto",
//             filter: props.blur ? "blur(0.5rem)" : "blur(0)",
//             borderRadius: props.borderRadius ? props.borderRadius : "0",
//             backgroundImage: (fullLoaded || props.noPlaceholder)
//               ? ""
//               : `url(${`${imgUrlEndPoint}/${Buffer.from(colorRequest).toString(
//                   "base64"
//                 )}`})`,
//           }}
//         >
//           {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
//           <SmallImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             src={
//               !is_url
//                 ? isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             style={{
//               height: props.height ? props.height : "auto",
//               display: !fullLoaded ? "initial" : "none",
//               // opacity: !fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "5px",
//               ...props.style,
//             }}
//             alt={props.alt || ""}
//           ></SmallImage>
//           <FullImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             // placeholder="blur"
//             // blurDataURL={
//             //   !is_url
//             //     ? isPageLoaded
//             //       ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//             //       : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//             //     : props.url
//             // }
//             src={
//               !is_url
//                 ? error
//                   ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                   : isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             onLoad={fullImageLoadedHandler}
//             onError={props.onfail ? props.onfail : _handleError}
//             style={{
//               height: !fullLoaded
//                 ? "0px"
//                 : props.height
//                 ? props.height
//                 : "auto",
//               visibility: fullLoaded ? "visible" : "hidden",
//               // opacity: fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "0",
//               maxWidth: props.maxwidth ? props.maxwidth : "none",
//               maxHeight: props.maxheight ? props.maxheight : "none",
//               ...props.style,
//             }}
//             height={props.dimensions ? props.dimensions.height : 500}
//             width={props.dimensions ? props.dimensions.width : 500}
//             alt={props.alt || ""}
//           ></FullImage>
//         </Container>
//       );
//     else
//       return (
//         <Container
//           blur={fullLoaded}
//           onClick={props.onclick}
//           style={{
//             width: props.width ? props.width : "100%",
//             height: props.height ? props.height : "max-content",
//             margin: props.leftalign ? "0" : "0 auto",
//             filter: props.blur ? "blur(0.5rem)" : "blur(0)",
//             borderRadius: props.borderRadius ? props.borderRadius : "0",
//             backgroundImage: (fullLoaded || props.noPlaceholder)
//               ? ""
//               : `url(${`${imgUrlEndPoint}/${Buffer.from(colorRequest).toString(
//                   "base64"
//                 )}`})`,
//           }}
//         >
//           {/* <img src={imgUrlEndPoint + props.url} /> */}
//           {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
//           <SmallImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             src={
//               !is_url
//                 ? isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             style={{
//               height: props.height ? props.height : "auto",
//               display: !fullLoaded ? "initial" : "none",
//               // opacity: !fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "5px",
//               ...props.style,
//             }}
//             alt={props.alt || ""}
//           ></SmallImage>
//           <FullImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             // placeholder="blur"
//             // blurDataURL={
//             //   !is_url
//             //     ? isPageLoaded
//             //       ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//             //       : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//             //     : props.url
//             // }
//             src={
//               !is_url
//                 ? error
//                   ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                   : isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             onLoad={fullImageLoadedHandler}
//             onError={props.onfail ? props.onfail : _handleError}
//             style={{
//               height: !fullLoaded
//                 ? "0px"
//                 : props.height
//                 ? props.height
//                 : "auto",
//               visibility: fullLoaded ? "visible" : "hidden",
//               // opacity: fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "0",
//               maxWidth: props.maxwidth ? props.maxwidth : "none",
//               maxHeight: props.maxheight ? props.maxheight : "none",
//               ...props.style,
//             }}
//             height={props.dimensions ? props.dimensions.height : 500}
//             width={props.dimensions ? props.dimensions.width : 500}
//             alt={props.alt || ""}
//           ></FullImage>
//         </Container>
//       );
//   } else if (props.dimensionsMobile) {
//     if (!isPageWide)
//       return (
//         <Container
//           blur={fullLoaded}
//           onClick={props.onclick}
//           style={{
//             width: props.widthmobile ? props.widthmobile : "100%",
//             height: props.height ? props.height : "auto",
//             margin: props.leftalign ? "0" : "0 auto",
//             filter: props.blur ? "blur(0.5rem)" : "blur(0)",
//             borderRadius: props.borderRadius ? props.borderRadius : "0",
//             backgroundImage: (fullLoaded || props.noPlaceholder)
//               ? ""
//               : `url(${`${imgUrlEndPoint}/${Buffer.from(colorRequest).toString(
//                   "base64"
//                 )}`})`,
//             ...props.style,
//           }}
//         >
//           <SmallImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             src={
//               !is_url
//                 ? isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             style={{
//               height: props.height ? props.height : "auto",
//               display: !fullLoaded ? "initial" : "none",
//               // opacity: !fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "5px",
//               ...props.style,
//             }}
//             alt={props.alt || ""}
//           ></SmallImage>
//           <FullImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             // placeholder="blur"
//             // blurDataURL={
//             //   !is_url
//             //     ? isPageLoaded
//             //       ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//             //       : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//             //     : props.url
//             // }
//             src={
//               !is_url
//                 ? error
//                   ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                   : isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(imageRequestMobile)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             // src={!is_url  ?   `${imgUrlEndPoint}/${btoa(imageRequestMobile)}` :props.url}
//             width={props.dimensionsMobile.width}
//             height={props.dimensionsMobile.height}
//             onLoad={fullImageLoadedHandler}
//             onError={props.onfail ? props.onfail : _handleError}
//             style={{
//               // height: props.height ? props.height : "auto",
//               visibility: fullLoaded ? "visible" : "hidden",
//               // opacity: fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "0",
//               maxWidth: props.maxwidth ? props.maxwidth : "none",
//               maxHeight: props.maxheight ? props.maxheight : "none",
//               ...props.style,
//             }}
//             alt={props.alt || ""}
//           ></FullImage>
//         </Container>
//       );
//     else
//       return (
//         <Container
//           blur={fullLoaded}
//           onClick={props.onclick}
//           style={{
//             width: props.width ? props.width : "100%",
//             height: props.height ? props.height : "max-content",
//             margin: props.leftalign ? "0" : "0 auto",
//             filter: props.blur ? "blur(0.5rem)" : "blur(0)",
//             borderRadius: props.borderRadius ? props.borderRadius : "0",
//             backgroundImage: (fullLoaded || props.noPlaceholder)
//               ? ""
//               : `url(${`${imgUrlEndPoint}/${Buffer.from(colorRequest).toString(
//                   "base64"
//                 )}`})`,
//           }}
//         >
//           {/* <SpinnerContainer><Spinner></Spinner></SpinnerContainer> */}
//           <SmallImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             src={
//               !is_url
//                 ? isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             style={{
//               height: props.height ? props.height : "auto",
//               display: !fullLoaded ? "initial" : "none",
//               // opacity: !fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "5px",
//               ...props.style,
//             }}
//             alt={props.alt || ""}
//           ></SmallImage>
//           <FullImage
//             loading={props.noLazy ? "eager" : "lazy"}
//             // placeholder="blur"
//             // blurDataURL={
//             //   !is_url
//             //     ? isPageLoaded
//             //       ? `${imgUrlEndPoint}/${btoa(smallImageRequest)}`
//             //       : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//             //     : props.url
//             // }
//             src={
//               !is_url
//                 ? error
//                   ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                   : isPageLoaded
//                   ? `${imgUrlEndPoint}/${btoa(imageRequest)}`
//                   : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
//                 : props.url
//             }
//             onLoad={fullImageLoadedHandler}
//             onError={props.onfail ? props.onfail : _handleError}
//             style={{
//               height: !fullLoaded
//                 ? "0px"
//                 : props.height
//                 ? props.height
//                 : "auto",
//               visibility: fullLoaded ? "visible" : "hidden",
//               // display : fullLoaded ? 'initial' : 'none',
//               // opacity: fullLoaded ? 1 : 0,
//               borderRadius: props.borderRadius ? props.borderRadius : "0",
//               maxWidth: props.maxwidth ? props.maxwidth : "none",
//               maxHeight: props.maxheight ? props.maxheight : "none",
//               ...props.style,
//             }}
//             height={props.dimensions ? props.dimensions.height : 500}
//             width={props.dimensions ? props.dimensions.width : 500}
//             alt={props.alt || ""}
//           ></FullImage>
//         </Container>
//       );
//   }
//   // }
// };

// export default ImageLoader;
