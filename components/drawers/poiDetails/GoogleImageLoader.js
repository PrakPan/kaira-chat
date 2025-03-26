import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import usePageLoaded from "../../custom hooks/usePageLoaded";
import LazyLoad from "react-lazyload";
import Image from "next/image";

const GoogleImageLoader = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const isPageLoaded = usePageLoaded();
  const [error, setError] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const[imageUrl,setImageUrl]=useState(null)
  useEffect(() => {

    const fetchImageWithHeaders = async () => {

      const response = await fetch(props.url, {
        method: 'GET',
        // headers: {
        //   'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        //   'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        //   'Accept-Language': 'en-US,en;q=0.9',
        //   'Cache-Control': 'no-cache',
        //   'Pragma': 'no-cache',
        //   'Priority': 'u=0, i',
        //   'Sec-CH-UA': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        //   'Sec-CH-UA-Mobile': '?0',
        //   'Sec-CH-UA-Platform': '"Linux"',
        //   'Sec-Fetch-Dest': 'document',
        //   'Sec-Fetch-Site': 'none',
        //   'Sec-Fetch-User': '?1',
        //   'Upgrade-Insecure-Requests': '1',
        //   'X-Browser-Channel': 'stable',
        //   'X-Browser-Copyright': 'Copyright 2025 Google LLC. All rights reserved.',
        //   'X-Browser-Validation': 'Xu3McleZcKTT6TgGB8KFHwGJApU=',
        //   'X-Browser-Year': '2025',
        // },
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectUrl);
      } else {
        console.error('Image fetch failed', response.statusText);
      }
    };

    if(new URL(props?.url).hostname=="lh3.googleusercontent.com"){

    fetchImageWithHeaders();
    }
  }, [props?.url]);
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  let smallImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: imageUrl,
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
        key: imageUrl,
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
          key: imageUrl,
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
          key: imageUrl,
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
        key: imageUrl,
        edits: {
          resize: {
            fit: "cover",
          },
        },
      });
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: imageUrl,
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
        key: imageUrl,
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
        key: imageUrl,
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
        key: imageUrl,
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
    }
    @media (min-width: 768px) and (max-width: 1024px) {
      height: ${props.heighttab ? props.heighttab : "auto"};
      width: ${props.widthtab ? props.widthtab : "100%"};
    }
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
    if (!error) {
      if (props.onfail) props.onfail();
      setError(true);
    }
  };

  let is_url = isValidHttpUrl(imageUrl);

  const fullImageLoadedHandler = () => {
    if (props.onload) {
      props.onload();
    }
    setFullLoaded(true);
  };

  const getBtoaUrl = (imgUrlEndPoint, imageRequest) => {
    try {
      return `${imgUrlEndPoint}/${btoa(imageRequest)}`
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  if (!props.dimensionsMobile) {
    if (!isPageWide)
      return (
        <Container
          blur={fullLoaded}
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: props.heightmobile ? props.heightmobile : "max-content",
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
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            style={{
              height: props.height ? props.height : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          />

          <FullImage
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                    ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                    : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: props.height ? props.height : "100%",
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
            src={
              !is_url
                ? isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            style={{
              height: props.height ? props.height : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          />

          <FullImage
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                    ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                    : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: props.height ? props.height : "100%",
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
          onClick={props.onclick}
          style={{
            width: props.widthmobile ? props.widthmobile : "100%",
            height: props.heightmobile ? props.heightmobile : "100%",
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
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            style={{
              height: props.height ? props.height : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          />

          <FullImage
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                    ? getBtoaUrl(imgUrlEndPoint, imageRequestMobile)
                    : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            width={props.dimensionsMobile.width}
            height={props.dimensionsMobile.height}
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: props.height ? props.height : "100%",
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
            src={
              !is_url
                ? isPageLoaded
                  ? getBtoaUrl(imgUrlEndPoint, smallImageRequest)
                  : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            style={{
              height: props.height ? props.height : "100%",
              display: !fullLoaded ? "initial" : "none",
              borderRadius: props.borderRadius ? props.borderRadius : "5px",
              ...props.style,
            }}
          />
          <FullImage
            src={
              !is_url
                ? error
                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                  : isPageLoaded
                    ? getBtoaUrl(imgUrlEndPoint, imageRequest)
                    : "https://d31aoa0ehgvjdi.cloudfront.net/media/website/transparent.png"
                : imageUrl
            }
            onLoad={fullImageLoadedHandler}
            onError={_handleError}
            resizeMode={props.resizeMode}
            style={{
              height: props.height ? props.height : "100%",
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

export default GoogleImageLoader;

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

// const FullImage = (props) => {
//   return (
//     <Image
//       alt=""
//       src={props.src}
//       width={145}
//       height={145}
//       onLoad={props.onLoad}
//       onError={props.onError}
//       style={{
//         width: "100%",
//         objectFit: `${props.resizeMode ? props.resizeMode : "cover"}`,
//         zIndex: "0 !important",
//         ...props.style,
//       }}
//     />
//   );
// };
