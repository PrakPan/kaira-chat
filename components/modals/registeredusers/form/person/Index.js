import React, { useEffect } from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  dislpay: grid;
  grid-template-columns: auto max-content;
`;

const Person = (props) => {
  useEffect(() => {}, []);

  return (
    <GridContainer className="border">
      <div>name@pw.live</div>
      <div>Invited</div>
    </GridContainer>
  );
};

export default Person;
