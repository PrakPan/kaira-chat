import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 1rem 1rem 0;
`;

const UL = styled.ul``;

const LI = styled.li`
  font-weight: 300;
`;

const EntryFees = (props) => {
  let entryArr = [];
  for (var i = 0; i < props.entry_fees.length; i++) {
    entryArr.push(<LI className="font-nunito">{props.entry_fees[i]}</LI>);
  }
  return (
    <div>
      {props.entry_fees ? (
        <Container className="center-div">
          <UL>{entryArr}</UL>
        </Container>
      ) : null}
    </div>
  );
};

export default EntryFees;
