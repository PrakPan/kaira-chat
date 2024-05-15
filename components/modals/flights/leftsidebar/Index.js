import React from "react";
import CurrentlyReplacing from "./CurrentlyReplacing";
import media from "../../../media";

const LeftSideBar = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div>
      {isPageWide ? (
        <CurrentlyReplacing
          selectedBooking={props.selectedBooking}
          setHideBookingModal={props.setHideBookingModal}
          replacing={props.replacing}
        ></CurrentlyReplacing>
      ) : null}
    </div>
  );
};

export default LeftSideBar;
