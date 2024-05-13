import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import media from "../../media";

const Container = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 1rem 0.2rem;
  @media screen and (min-width: 768px) {
    margin: 1rem;
  }
`;

const Text = styled.div`
  font-size: 1.2rem;
  line-height: 2rem;
`;

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className=" font-lexend">
      <IoMdClose
        className="hover-pointer"
        onClick={props.setHideTaxiModal}
        style={{ fontSize: "1.5rem" }}
      ></IoMdClose>
      {props.selectedBooking.transfer_type === "Multicity" ? (
        <Text>
          {isPageWide
            ? "Changing " + props.selectedBooking.name
            : "Change transfer"}
        </Text>
      ) : (
        <Text>
          {props.selectedBooking.city &&
          props.selectedBooking.destination_city &&
          isPageWide
            ? "Changing taxi from " +
              props.selectedBooking.city +
              " to " +
              props.selectedBooking.destination_city
            : "Change transfer"}
        </Text>
      )}
    </Container>
  );
};

export default Section;
