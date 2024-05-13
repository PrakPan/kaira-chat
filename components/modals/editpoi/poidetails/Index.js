import React from "react";
import Poi from "../../poi-updated/Body";

const Index = (props) => {
  return (
    <div>
      <Poi poi={props.data}></Poi>
    </div>
  );
};

export default Index;
