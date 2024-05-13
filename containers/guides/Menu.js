import React, { useEffect } from "react";
import Details from "./Details";

const SimpleTabs = (props) => {
  useEffect(() => {});

  return (
    <div>
      <Details guideLoaded={props.guideLoaded} data={props.data}></Details>
    </div>
  );
};

export default React.memo(SimpleTabs);
