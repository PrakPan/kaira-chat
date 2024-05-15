import React from "react";
import styled from "styled-components";
import CurrentlyReplacing from "./CurrentlyReplacing";
import media from "../../../media";

const Container = styled.div``;

const LeftSideBar = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      {isPageWide ? (
        <CurrentlyReplacing
          selectedBooking={props.selectedBooking}
          setHideBookingModal={props.setHideBookingModal}
          replacing={props.replacing}
        ></CurrentlyReplacing>
      ) : null}
    </Container>
  );
};

export default LeftSideBar;
