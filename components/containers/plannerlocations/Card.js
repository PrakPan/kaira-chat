import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../ImageLoader";
import Link from "next/link";
import { logEvent } from "../../../services/ga/Index";

const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
  @media screen and (min-width: 768px) {
    height: 35vh;
  }
`;

const BlackContainer = styled.div`
  width: 100%;
  position: absolute;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
  bottom: 0;
  flex-direction: column;
`;

const Heading = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subheading = styled.p`
  font-size: 1rem;
  line-height: 1;
  text-align: center;
  font-weight: 300;
`;

const Experiences = (props) => {
  const [loading, setLoading] = useState(true);

  const handleImageClick = (e) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: props?.location ? props.location : "",
        event_action: `Plan as per the best destinations${
          props.country && " in " + props.country
        }`,
      },
    });
  };

  return (
    <Link className="hover-pointer" href={"/" + props.path}>
      <ImageContainer
        className={`w-full ${loading ? "bg-gray-200 animate-pulse" : ""}`}
        onClick={handleImageClick}
      >
        <ImageFade>
          <ImageLoader
            url={props.img}
            dimensions={{ width: 500, height: 500 }}
            dimensionsMobile={{ width: 800, height: 800 }}
            height="35vh"
            style={{ filter: "brightness(0.9)" }}
            onload={() => {
              setLoading(false);
            }}
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="font-lexend w-full">
          {loading ? (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-[80%] h-10 bg-gray-300 w-20 rounded-lg"></div>
              <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
            </div>
          ) : (
            <>
              <Heading>{props.location}</Heading>
              <Subheading>{props.heading}</Subheading>
            </>
          )}
        </BlackContainer>
      </ImageContainer>
    </Link>
  );
};

export default Experiences;
