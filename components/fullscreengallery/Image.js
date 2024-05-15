import React, { useEffect } from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";
const ImageWrapper = styled.div`
  width: 100%;
  cursor: pointer;
  @media screen and (min-width: 768px) {
  }
`;

const ImageContainer = (props) => {
  let isPageWide = media("(min-width: 768px)");

  let is_url = isValidHttpUrl(props.images[props.imageSelected]);
  useEffect(() => {
    var img = new Image();
    if (!is_url) img.src = `${imgUrlEndPoint}/${btoa(imageRequest)}`;
    else img.src = props.images[props.imageSelected];
    img.onload = function () {
      var height = img.height;
      var width = img.width;
      let aspectration;
      aspectration = width / height;
    };
    var img = new Image();
    if (!is_url) img.src = `${imgUrlEndPoint}/${btoa(nextImageRequest)}`;
    else img.src = props.images[props.imageSelected + 1];
    img.onload = function () {
      var height = img.height;
      var width = img.width;
      let aspectration;
      aspectration = width / height;
    };
  }, []);

  let touchstart = null;
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  let imageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.images[props.imageSelected],
  });

  let nextImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.images[props.imageSelected + 1],
  });

  const _handleDragStart = (event) => {
    touchstart = event.clientX;
  };

  const _handleDragEnd = (event) => {
    if (touchstart > event.clientX) props._nextImgHandler();
    else props._prevImgHandler();
  };

  return (
    <ImageWrapper
      style={{ display: "block" }}
      draggable="true"
      onDragStart={_handleDragStart}
      onDragEnd={_handleDragEnd}
    >
      <ImageLoader
        url={props.images[props.imageSelected]}
        maxheight="60vh"
        maxwidth={isPageWide ? "70vw" : "80vw"}
        fit="cover"
      />
    </ImageWrapper>
  );
};

export default React.memo(ImageContainer);
