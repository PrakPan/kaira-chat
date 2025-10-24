import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarWeek,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import BackgroundImageLoader from "../../../BackgroundImageLoader";

const TagsContainer = styled.div`
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: left;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
`;

const TagContainer = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: max-content auto;
`;

const TagHeading = styled.p`
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
  font-size: 0.75rem;
  line-height: 1;
`;

const TagText = styled.p`
  font-weight: 100;
  margin: 0;
  font-size: 0.75rem;
`;

const ImageSlider = (props) => {
  const Component = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight((Component.current.offsetWidth * 3) / 4);
  }, []);

  const Container = styled.div`
    width: 100%;
    height: ${height + "px"};
    position: relative;
  `;

  return (
    <Container ref={Component} style={{ height: height + "px" }}>
      <BackgroundImageLoader
        height={height + "px"}
        url={props.image}
        filter="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)"
      ></BackgroundImageLoader>

      <TagsContainer>
        <div>
          <TagContainer>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ fontSize: "1rem", margin: "0rem 0.5rem 0 0" }}
            />
            <div>
              <TagHeading className="">LOCATIONS</TagHeading>
              <TagText className="">
                {props.locations.join(" ")}
              </TagText>
            </div>
          </TagContainer>
          <TagContainer>
            <FontAwesomeIcon
              icon={faCalendarWeek}
              style={{ fontSize: "1rem", margin: "0rem 0.5rem 0 0" }}
            />
            <div>
              <TagHeading className="">DURATION</TagHeading>
              <TagText className="">{props.duration}</TagText>
            </div>
          </TagContainer>
        </div>
        <TagContainer style={{ height: "max-content" }}>
          <FontAwesomeIcon
            icon={faWallet}
            style={{ fontSize: "1rem", margin: "0rem 0.5rem 0 0" }}
          />
          <div>
            <TagHeading className="">BUDGET</TagHeading>
            <TagText className="">{props.budget}</TagText>
          </div>
        </TagContainer>
      </TagsContainer>
    </Container>
  );
};

export default React.memo(ImageSlider);
