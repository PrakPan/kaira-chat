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
  if (props.data)
    return (
      <Container className="font-lexend">
        <div
          className="center-dv"
          style={{
            padding: "0.75rem 0rem",
            borderColor: "rgba(238, 238, 238, 1)",
            borderWidth: "1px",
            borderStyle: "none solid none none",
          }}
        >
          {props.data?.taxi_category?.image ? (
            <ImageLoader
              is_url
              noLazy
              url={props.data.taxi_category.image}
              width="80%"
              widthmobile="70%"
              height="auto"
            ></ImageLoader>
          ) : (
            <ImageLoader
              url={"media/icons/bookings/car (2).png"}
              width="80%"
              widthmobile="70%"
              height="auto"
            ></ImageLoader>
          )}
          <p
            style={{
              margin: "0.5rem 0rem 0rem 0rem",
              fontSize: "15px",
              fontWeight: "700",
            }}
            className="font-lexend text-center"
          >
            {props.data.taxi_category.type}
          </p>
          <p
            style={{
              margin: "0 0rem 0.25rem 0rem",
              fontSize: "13px",
              fontWeight: "300",
            }}
            className="font-lexend text-center"
          >
            {props.data?.taxi_category?.seating_capacity + "-seater"}
          </p>
        </div>
        <Route
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          getPaymentHandler={props.getPaymentHandler}
          selectedBooking={props.selectedBooking}
          data={props.data}
          _updateSearchedTaxi={props._updateSearchedTaxi}
        ></Route>
      </Container>
    );
  else return null;
};

export default Section;
