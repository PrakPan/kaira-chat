import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Route from "./Route";

const Container = styled.div`
  display: grid;
  grid-template-columns: 7.5rem auto;
  border-style: none none solid none;
  border-color: rgba(238, 238, 238, 1);
  border-width: 1px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 8.5rem auto;
  }
`;

const Section = (props) => {
  if (props.selectedBooking)
    return (
      <Container className="">
        <div
          className="center-dv"
          style={{
            padding: "0.75rem 0.5rem",
            borderColor: "rgba(238, 238, 238, 1)",
            borderWidth: "1px",
            borderStyle: "none solid none none",
          }}
        >
          <ImageLoader
            url="media/icons/bookings/car (2).png"
            width="5rem"
            widthmobile="5rem"
            height="auto"
          ></ImageLoader>
          <p
            style={{
              margin: "0 0rem 0.25rem 0rem",
              fontSize: "15px",
              fontWeight: "700",
            }}
            className=" text-center"
          >
            {props.selectedBooking.taxi_type}
          </p>
        </div>
        <Route selectedBooking={props.selectedBooking}></Route>
      </Container>
    );
  else return null;
};

export default Section;
