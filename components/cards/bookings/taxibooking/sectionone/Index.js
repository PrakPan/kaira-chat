import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Route from "./Route";

const Container = styled.div`
  display: flex;
  border-style: none none solid none;
  border-color: rgba(238, 238, 238, 1);
  border-width: 1px;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  if (props.data)
    return (
      <Container className="font-lexend">
        <div
          className="center-dv"
          style={{
            padding: "1rem",
            borderColor: "rgba(238, 238, 238, 1)",
            borderWidth: "1px",
            borderStyle: "none solid none none",
          }}
        >
          <p
            style={{
              margin: "0 0 0.25rem 0",
              fontSize: "15px",
              fontWeight: "700",
            }}
            className="font-lexend text-center"
          >
            {props.data.taxi_type}
          </p>
          <ImageLoader
            url={
              props.data.images
                ? props.data.images.image
                  ? props.data.images.image
                  : "media/icons/bookings/car (2).png"
                : "media/icons/bookings/car (2).png"
            }
            width="3.5rem"
            widthmobile="4rem"
            height="auto"
          ></ImageLoader>
        </div>
        <Route rental={props.rental} data={props.data}></Route>
      </Container>
    );
  else return null;
};

export default Section;
