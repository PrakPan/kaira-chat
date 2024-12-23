import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import BackgroundImageLoader from "../../../UpdatedBackgroundImageLoader";

const Container = styled.div`
  width: 100%;
  height: ${(props) => (props.height ? props.height + "px" : "100%")};
  position: relative;
`;

const DurationContainer = styled.div`
  position: absolute;
  top: 0;
  width: max-content;
  font-size: 0.85rem;
  color: white;
  border-radius: 20px;
  padding: 0.25rem 0.35rem;
  right: 0;
  background: #01202b;
  letter-spacing: 0.1em;
  margin: 0.5rem;
  font-weight: 600;
`;

const ImageSlider = (props) => {
  const Component = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight((Component.current.offsetWidth * 2.5) / 5);
  }, []);

  var isArr = Array.isArray(props.images);

  var image;
  if (isArr || props.images === null) {
    if (props.images && props.images.length) {
      for (let i = 0; i < props.images.length; i++) {
        if (props.images[i]) {
          image = props.images[i];
          break;
        }
      }
    }
  } else image = props.images?.main_image;

  let LOCATIONS_TO_SHOW = "";
  if (props.locations) {
    if (props.locations.length > 2) {
      LOCATIONS_TO_SHOW =
        "Explore " +
        props.locations[0] +
        ", " +
        props.locations[1] +
        "+" +
        (props.locations.length - 2).toString();
    } else {
      if (props.locations.length === 1)
        LOCATIONS_TO_SHOW = "Explore " + props.locations[0];
      else if (props.locations.length === 2)
        LOCATIONS_TO_SHOW =
          "Explore " + props.locations[0] + ", " + props.locations[1];
    }
  }

  return (
    <Container props={props} ref={Component}>
      <BackgroundImageLoader
        dimensions={{ width: 1000, height: 500 }}
        dimensionsMobile={{ width: 600, height: 300 }}
        filter="none"
        height={height + "px"}
        url={image}
        borderRadius="10px 10px 0 0"
      ></BackgroundImageLoader>

      <DurationContainer>
        {props.duration_number
          ? props.duration_number +
            "N/" +
            (parseInt(props.duration_number) + 1) +
            "D"
          : props.duration}
      </DurationContainer>
    </Container>
  );
};

export default React.memo(ImageSlider);
