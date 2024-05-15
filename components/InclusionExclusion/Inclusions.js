import React from "react";
import InElementContainer from "./containers/InElementContainer";
import { MainHeading } from "./InclusionExclusionStyled";

const Inclusions = (props) => {
  return (
    <div>
      <MainHeading size={"1.4rem"} style={{ paddingBottom: "10px" }}>
        Inclusions
      </MainHeading>

      <InElementContainer info={props.info} Idxs={props.staysIds} />
      <InElementContainer info={props.info} Idxs={props.transferIds} />
    </div>
  );
};

export default Inclusions;
