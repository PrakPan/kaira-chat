import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: center;
  margin-block: 1rem;
  border-radius: 50px;
  &:hover {
    background: #f0f0f0;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 10px;
  padding-top: 10px;
`;

const Text = styled.div`
  font-weight: 500;
  p {
    font-weight: 400;
    margin-bottom: 0rem;
    margin-top: 4px;
    font-size: 12px;
    color: #7e7e7e;
  }
`;

const Result = (props) => {
  const _handleClick = (e) => {
    e.stopPropagation();
    props.setSearchFinalized({ name: props.name, type: props.type });
    props.setDestination(props.name);
    if (props.setShowResults) props.setShowResults(false);
    props.setFocusSearch(false);
  };

  return (
    <Container
      className="font-lexend"
      onClick={(e) => {
        _handleClick(e),
          props._updateDestinationHandler(
            props.result.resource_id || props.result.id,
            props.inbox_id,
            props.result
          );
      }}
    >
      <MarkerContainer>
        <FaMapMarkerAlt />
      </MarkerContainer>
      <Text>
        <div>{props.name}</div>
        <p>{props.result.parent}</p>
      </Text>
    </Container>
  );
};

export default Result;
