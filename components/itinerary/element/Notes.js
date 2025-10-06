import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  color: black !important;
  margin-top: 1rem;
`;

const Text = styled.p`
  font-size: 0.75rem;
  font-weight: 200;
  margin: 0.25rem 0;
  @media screen and (min-width: 768px) {
    font-size: 0.75rem;
    margin: 0.5rem 0;
  }
`;

const Notes = (props) => {
  let NotesArr = [];
  for (const property in props.meta) {
    if (
      property !== "Journey time in secs" &&
      property !== "Time" &&
      property !== "Distance" &&
      property !== "distance" &&
      property !== "duration" &&
      property !== "estimated_cost"
    )
      NotesArr.push(
        <Text
          className={props.blur ? " blurry-text" : " "}
        >
          <b
            style={{ fontWeight: "600" }}
            className={props.blur ? " blurry-text" : ""}
          >{`${property}: `}</b>
          {props.meta[property]}
        </Text>
      );
  }
  return <Container>{NotesArr}</Container>;
};

export default Notes;
