import React from "react";
import CurrentlyReplacing from "./CurrentlyReplacing";
import media from "../../../media";

const LeftSideBar = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div>
      {isPageWide ? (
        <CurrentlyReplacing
          selectedPoi={props.selectedPoi}
          replacing={props.replacing}
          setHideBookingModal={props.setHideBookingModal}
        ></CurrentlyReplacing>
      ) : null}
      {isPageWide ? <hr /> : null}
    </div>
  );
};

export default LeftSideBar;
