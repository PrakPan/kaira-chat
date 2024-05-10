import React from "react";
import styled from "styled-components";

const SubHeadingterms = styled.p`
  font-size: 2rem;
  font-weight: 600;
  text-align: left;
`;

export default function Section({ title, subtitle, dark, id }) {
  return (
    <div className={"section" + (dark ? " section-dark" : "")}>
      <div className="section-content" id={id}>
        <SubHeadingterms
          margin="2rem auto "
          font-weight="400"
          text-align="left"
        >
          {title}
        </SubHeadingterms>
        <p style={{ textAlign: "left", lineHeight: "30px" }}>{subtitle}</p>
      </div>
    </div>
  );
}
