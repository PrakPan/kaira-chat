import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Route from "./Route";

const Container = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: 0.5rem;
  border-style: none none solid none;
  border-color: rgba(238, 238, 238, 1);
  border-width: 1px;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  if (props.data)
    return (
      <Container className="font-lexend">
        <div style={{ display: "flex", gap: "0.5rem", marginRight: "0rem" }}>
          <div style={{ padding: "0.5rem 0.5rem 0.5rem 1rem" }}>
            <ImageLoader
              blur={!props.data.user_selected}
              url="media/icons/bookings/airplane-ticket (1).png"
              leftalign
              dimensions={{ width: 200, height: 200 }}
              width="2.5rem"
              widthmobile="3rem"
            ></ImageLoader>
          </div>
        </div>
        <div
          className=" text-center"
          style={{
            padding: "1rem 0.5rem",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "none none none solid",
            display: "flex",
          }}
        >
          <Route data={props.data}></Route>
        </div>
      </Container>
    );
  else return null;
};

export default Section;
