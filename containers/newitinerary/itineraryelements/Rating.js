import styled from "styled-components";
import { useEffect } from "react";
import { AiFillStar } from "react-icons/ai";

const Container = styled.div`
  margin: ${(props) => (props.margin ? props.margin : "0")};
`;

const Rating = (props) => {
  return (
    <Container margin={props.margin} className="flex flex-row">
      <AiFillStar
        style={{ color: "#f7e700", marginRight: "0.25rem" }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: "#f7e700", marginRight: "0.25rem" }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: "#f7e700", marginRight: "0.25rem" }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: "#f7e700", marginRight: "0.25rem" }}
      ></AiFillStar>
      <AiFillStar
        style={{ color: "#e4e4e4", marginRight: "0.25rem" }}
      ></AiFillStar>
    </Container>
  );
};

export default Rating;
