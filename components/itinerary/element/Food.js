import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FoodItem from "./FoodItem";

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
    let FOOD_JSX = [];
    let data_arr = JSON.parse(props.text);
    for (var i = 0; i < data_arr.length; i++) {
      FOOD_JSX.push(<FoodItem data={data_arr[i]}></FoodItem>);
    }
    setJSX(FOOD_JSX);
  }, [props.text]);

  return <Container className=" ">{JSX}</Container>;
};

export default Food;
