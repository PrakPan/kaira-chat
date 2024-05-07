import React from "react";
import styled from "styled-components";

const Container = styled.div``;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
`;

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
          LOCATIONS_TO_SHOW + props.locations[i] + " " + "   •   ";
      else LOCATIONS_TO_SHOW = LOCATIONS_TO_SHOW + props.locations[i];
    }
  }

  return (
    <Container className="font-lexend">
      <Heading className="font-lexend">{props.name}</Heading>
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
    </Container>
  );
};
export default Info;
