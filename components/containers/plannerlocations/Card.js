import React from "react";
import styled from "styled-components";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import { useRouter } from "next/router";
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
  // background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  // height: 0%;
  // border : 1px solid red;
  position: absolute;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
  // top: 0;
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
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const path = props.city
    ? "https://thetarzanway.com/travel-guide/city/"
    : "https://thetarzanway.com/travel-planner/";

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
      <ImageContainer onClick={handleImageClick}>
        <ImageFade>
          <ImageLoader
            url={props.img}
            dimensions={{ width: 500, height: 500 }}
            dimensionsMobile={{ width: 800, height: 800 }}
            height="35vh"
            style={{ filter: "brightness(0.9)" }}
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="font-lexend">
          <Heading>{props.location}</Heading>
          <Subheading>{props.heading}</Subheading>
        </BlackContainer>
      </ImageContainer>
    </Link>
  );
};

export default Experiences;
