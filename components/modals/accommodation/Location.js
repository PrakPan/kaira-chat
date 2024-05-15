import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
`;

const Address = styled.div``;

const Location = (props) => {
  return (
    <Container>
      <Address>
        <p className="font-lexend" style={{ fontWeight: "300" }}>
          {props.data.addr2}
        </p>
      </Address>
    </Container>
  );
};

export default Location;
