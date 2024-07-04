import React from "react";
import styled from "styled-components";
import ImageLoader from "../../ImageLoader";
import Link from "next/link";
import { logEvent } from "../../../services/ga/Index";

const Name = styled.p`
  padding: 0rem 0;
  color: black;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1;
  width: 100%;
`;

const Subtext = styled.p`
  font-weight: 400;
  font-size: 12px;
  margin: 0;
`;

const Experiences = (props) => {
  let filters_to_show = "";
  try {
    for (var i = 0; i < props?.tags.length; i++) {
      if (i === props?.tags.length - 1)
        filters_to_show = filters_to_show + props?.tags[i];
      else filters_to_show = filters_to_show + props?.tags[i] + ", ";
    }
  } catch {}

  const handleImageClick = (e) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: props?.location ? props.location : "",
        event_action: `Top locations across ${props?.state && props.state}`,
      },
    });
  };

  return (
    <Link
      className="hover-pointer"
      href={"/" + props.path}
      style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
      onClick={handleImageClick}
    >
      <div>
        <ImageLoader
          noLazy
          hoverpointer
          url={props.img}
          dimensions={{ width: 400, height: 400 }}
          borderRadius="10px"
          dimensionsMobile={{ width: 300, height: 300 }}
          style={{ cursor: "pointer" }}
          filter="brightness(0.80)"
        ></ImageLoader>
      </div>
      <div style={{ padding: "0.5rem 0" }} className="hover-pointer">
        <>
          <Name className="font-lexend">{props.location}</Name>
          <Subtext className="font-lexend truncate">{filters_to_show}</Subtext>
        </>
      </div>
    </Link>
  );
};

export default Experiences;
