import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import Info from "./Info";

const Container = styled.div`
  margin: 0 0 1rem 0;
  background-color: hsl(0, 0%, 96%);
  border-radius: 5px;
  padding: 0.5rem;

  @media screen and (min-width: 768px) {
    padding: 0.5rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 5fr;
    grid-gap: 1rem;
  }
`;


const Accommodation = (props) => {
  return (
    <Container className="borde">
      <GridContainer>
        <div className="center-dv">
          <ImageLoader
            url={props.data.icon}
            borderRadius="50%"
            width="100%"
            height="auto"
            dimensions={{ width: 500, height: 500 }}
          ></ImageLoader>
        </div>
        <Info
          _updatePoiHandler={props._updatePoiHandler}
          data={props.data}
          _openPoiModal={props._openPoiModal}
          updateLoadingState={props.updateLoadingState}
          tailored_id={props.tailored_id}
          itinerary_id={props.itinerary_id}
          heading={props.data.heading}
          text={props.data.text}
        />
      </GridContainer>
    </Container>
  );
};

export default Accommodation;
