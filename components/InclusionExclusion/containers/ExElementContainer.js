import React from "react";
import { FcCancel } from "react-icons/fc";
import {
  ColElementContainer,
  LinkComp,
  MainHeading,
  RowElementContainer,
  SubHeading,
} from "../InclusionExclusionStyled";

const ExElementContainer = (props) => {
  return (
    <RowElementContainer style={{ paddingBottom: "10px" }}>
      <RowElementContainer>
        <FcCancel style={{ fontWeight: "300", fontSize: "2rem" }} />

        <ColElementContainer style={{ paddingLeft: "12px" }}>
          <MainHeading size={"1.2rem"}>Flights</MainHeading>
          <ColElementContainer>
            {props.Idxs?.map((idx, index) =>
              index < 3 ? (
                <SubHeading size={"0.9rem"} key={index}>
                  {props.info.costings_breakdown[idx.id].detail.name}
                </SubHeading>
              ) : null
            )}
          </ColElementContainer>
        </ColElementContainer>
      </RowElementContainer>

      <LinkComp>+ Add Flights</LinkComp>
    </RowElementContainer>
  );
};

export default ExElementContainer;
