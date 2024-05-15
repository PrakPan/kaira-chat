import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import BackgroundImageLoader from "../../../UpdatedBackgroundImageLoader";

const Container = styled.div`
  width: 100%;
  height: ${(props) => props.height + "px"};
  position: relative;
`;

const ImageSlider = (props) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight((Component.current.offsetWidth * 3) / 4);
  }, []);

  const Component = useRef();

  var isArr = Object.prototype.toString.call(props.images) == "[object Array]";

  let image;
  if (isArr || props.images === null) image = props.images[0];
  else image = props.images.main_image;

  return (
    <Container props={props} ref={Component}>
      <BackgroundImageLoader
        height={height + "px"}
        url={image}
      ></BackgroundImageLoader>
    </Container>
  );
};

export default React.memo(ImageSlider);
