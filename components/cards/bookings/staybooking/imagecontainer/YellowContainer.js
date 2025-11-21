import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import { GrStar } from "react-icons/gr";

const YellowContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: max-content;
  background-color: rgba(247, 231, 0, 0.8);
  padding: 0.5rem;
`;

const Heading = styled.p`
  font-weight: 700;
  display: inline;
  line-height: 1;
  margin: 0;
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
`;

const Detail = styled.div`
  font-size: 0.75rem;
`;

const Booking = (props) => {
  const IndianPrice = getIndianPrice(Math.ceil(props.price / 100));
  let StarsJSX = [];
  if (props.star_category)
    for (var i = 1; i <= 5; i++) {
      if (i > props.star_category)
        StarsJSX.push(
          <GrStar
            style={{
              fontSize: "0.75rem",
              lineHeight: "1",
              opacity: "0.3",
              marginTop: "-0.1rem",
            }}
          ></GrStar>
        );
      else
        StarsJSX.push(
          <GrStar
            style={{
              fontSize: "0.75rem",
              lineHeight: "1",
              marginTop: "-0.1rem",
            }}
          ></GrStar>
        );
    }
  return (
    <YellowContainer>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto max-content",
          margin: "0.5rem 0",
        }}
      >
        <div>
          <Heading className="">
            {props.heading} {StarsJSX}
          </Heading>
          {/* <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> */}
        </div>
        {props.price && !props.are_prices_hidden ? (
          <div
            style={{ fontSize: "1rem", overflow: "hidden", fontWeight: "600" }}
            className=" center-div"
          >
            {"₹ " + IndianPrice + "/-"}
          </div>
        ) : null}
      </div>
      {/* <GridContainer></GridContainer> */}
      <DetailsContainer>
        {props.city ? (
          <Detail className="">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ margin: "0 0.25rem 0 0" }}
            />
            {props.city}
          </Detail>
        ) : (
          <div></div>
        )}
        {props.duration ? (
          <Detail className="" style={{ textAlign: "right" }}>
            {props.duration + " Night(s) "}
          </Detail>
        ) : (
          <div></div>
        )}
      </DetailsContainer>
    </YellowContainer>
  );
};

export default Booking;
