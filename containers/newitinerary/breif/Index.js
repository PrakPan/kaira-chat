import styled from "styled-components";
import { useEffect } from "react";
import Route from "./route/Index";
import Cities from "./cities/Index";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-column-gap: 2rem;
  }
`;

const Brief = (props) => {
  useEffect(() => {}, []);

  return (
    <Container>
      <Route></Route>
      <Cities></Cities>
    </Container>
  );
};

export default Brief;
