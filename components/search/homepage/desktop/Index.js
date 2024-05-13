import React, { useState } from "react";
import styled from "styled-components";
import Bar from "./Bar";
import Pannel from "./pannel/Index";

const Container = styled.div`
  width: 50%;
  margin: auto;
`;

const MobileSearch = (props) => {
  const [pannelOpen, setPannelOpen] = useState(false);

  return (
    <Container>
      <Bar
        setPannelOpen={() => setPannelOpen(true)}
        hidden={pannelOpen ? true : false}
      ></Bar>
      {pannelOpen ? (
        <Pannel setPannelClose={() => setPannelOpen(false)}></Pannel>
      ) : null}
    </Container>
  );
};

export default MobileSearch;
