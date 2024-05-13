import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FoodItem from "./Poi";

const Container = styled.div`
  width: 100%;
  color: black !important;
  margin-top: 1rem;
  display: grid;
  grid-gap: 0.5rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Food = (props) => {
  const [JSX, setJSX] = useState(null);

  useEffect(() => {
    let POI_JSX = [];
    try {
      let data_arr = JSON.parse(props.text);
      for (var i = 0; i < data_arr.length; i++) {
        POI_JSX.push(<FoodItem data={data_arr[i]}></FoodItem>);
      }
      setJSX(POI_JSX);
    } catch {}
  }, [props.text]);

  return <Container className=" ">{JSX}</Container>;
};

export default Food;
