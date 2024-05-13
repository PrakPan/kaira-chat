import React from "react";
import styled from "styled-components";
import SectionOne from "./sectionone/Index";
import SectionTwo from "./sectiontwo/Index";
import SectionThree from "./SectionThree";
import SectionFour from "./SectionFour";
import { getHumanDate } from "../../../../services/getHumanDate";

const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  height: 100%;
  @media screen and (min-width: 768px) {
    border-radius: 10px;
    position: relative;
  }
`;

const Booking = (props) => {
  const getDate = (date) => {
    if (date) {
      let year = date.substring(0, 4);
      let month = date.substring(5, 7);
      let day = date.substring(8, 10);
      return getHumanDate(day + "/" + month + "/" + year);
    }
  };

  return (
    <div style={{ height: "max-content" }}>
      <div
        style={{ margin: "0 0 0.25rem 0", fontSize: "18px" }}
        className="font-lexend"
      >
        <b>{props.data ? (props.data.city ? props.data.city : "") : ""}</b>
        {" - Flight Booking"}
      </div>
      <div
        style={{ margin: "0 0 1rem 0", fontSize: "14px", fontWeight: "300" }}
        className="font-lexend"
      >
        {props.data
          ? props.data.check_in
            ? getDate(props.data.check_in)
            : ""
          : ""}
      </div>

      <Container className="border" style={{ borderRadius: "10px" }}>
        <SectionOne data={props.data}></SectionOne>
        <SectionTwo data={props.data}></SectionTwo>
        <SectionThree
          is_registration_needed={props.is_registration_needed}
          are_prices_hidden={props.are_prices_hidden}
          setShowLoginModal={props.setShowLoginModal}
          token={props.token}
          _deselectBookingHandler={props._deselectFlightBookingHandler}
          flightFlickityIndex={props.flightFlickityIndex}
          is_selecting={props.is_selecting}
          data={props.data}
        ></SectionThree>
        {!props.is_registration_needed ? (
          <SectionFour
            setShowFlightModal={props.setShowFlightModal}
            data={props.data}
          ></SectionFour>
        ) : null}
      </Container>
    </div>
  );
};

export default Booking;
