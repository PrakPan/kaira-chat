import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 1rem;
  color: black;
  width: max-content;
  margin: 1rem 0;
`;

const BlackContainer = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-left: 0.75rem;
  background-color: black;
`;

const InterConnect = (props) => {
  return (
    <Container>
      <BlackContainer></BlackContainer>
      <div className="center-div">{props.location}</div>
    </Container>
  );
};

export default InterConnect;
