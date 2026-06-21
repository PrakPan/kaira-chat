import styled from "styled-components";

const Container = styled.div`
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
`;

const Label = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  margin: 0 0.5rem 0.5rem 0;
  font-size: 0.75rem;
  &:hover {
    cursor: pointer;
    background-color: #f4f3ec;
  }
`;

export default function CheckboxLabels(props) {
  const _isFilterAlreadySelected = (filter) => {
    if (props.filtersState.type.includes(filter)) return true;
    else return false;
  };
  const _onChangeHandler = (filter) => {
    if (!_isFilterAlreadySelected(filter))
      props._addFilterHandler(filter, "type");
    else props._removeFilterHandler(filter, "type");
  };
  return (
    <Container>
      {props.filters.map((filter, i) => (
        <Label
          key={i}
          style={{
            backgroundColor: _isFilterAlreadySelected(filter)
              ? "#0b1220"
              : "#f4f3ec",
            color: _isFilterAlreadySelected(filter) ? "#fafaf5" : "#445069",
            borderColor: "#ececec",
          }}
          className="border"
          onClick={() => _onChangeHandler(filter)}
        >
          {filter}
        </Label>
      ))}
    </Container>
  );
}
