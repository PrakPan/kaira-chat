import React from "react";
import styled from "styled-components";
import H8 from "../../../heading/H8";

const Locations = styled.p`
  line-height: 1.2;
  margin: 0.5rem 0 0.75rem 0;
  color: rgb(122, 122, 122);
  font-weight: 300;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const TourType = styled.p`
  line-height: 1.2;
  margin: 0.75rem 0 0.5rem 0;
  font-weight: 300;
  font-size: 14px;
`;

const Info = (props) => {
  let LOCATIONS_TO_SHOW = "";

  if (props.locations) {
    for (var i = 0; i < props.locations.length; i++) {
      if (i !== props.locations.length - 1)
        LOCATIONS_TO_SHOW =
          LOCATIONS_TO_SHOW + (props.locations[i]?.name || props.locations[i]) + " " + "   •   ";
      else LOCATIONS_TO_SHOW = LOCATIONS_TO_SHOW + (props.locations[i]?.name || props.locations[i]);
    }
  }

  return (
    <div className="">
      <div className="">
        <H8
          style={{
            lineHeight: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.name}
        </H8>
      </div>
      <Locations>{LOCATIONS_TO_SHOW}</Locations>
      {props.PW ? (
        <TourType>
          Tour Type: <b style={{ fontWeight: "500" }}>Customisable</b>
        </TourType>
      ) : props.user_name !== "TTW Exclusive" &&
        props.user_name != "" &&
        props.user_name !== "TTW" ? (
        <TourType>
          <b style={{ fontWeight: "500" }}>
            {props.user_name ? "Curated by " + props.user_name : ""}
          </b>
        </TourType>
      ) : (
        <TourType>
          <b style={{ fontWeight: "500" }}>Handcrafted by us</b>
        </TourType>
      )}
    </div>
  );
};

export default Info;
