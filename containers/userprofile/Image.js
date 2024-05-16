import React from "react";
import styled from "styled-components";

const Image = () => {
  const Container = styled.div`
    width: 100%;
    height: 40vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 66px 0;
    text-align: center;
    @media screen and (min-width: 768px) {
      height: 50vh;
    }
  `;

  return <Container></Container>;
};

export default Image;
