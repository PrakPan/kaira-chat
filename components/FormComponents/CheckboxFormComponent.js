import styled from "styled-components";

// Styled Components
const CheckboxContainer = styled.div`
  display: grid;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props) => (props.checked ? "black" : "white")};
  border-radius: 3px;

  border: solid 2px #01202b;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }

  &:hover {
    background: ${(props) => (props.checked ? "tomato" : "peachpuff")};
  }
`;

const CheckmarkIcon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const CheckboxFormComponent = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      {checked && (
        <CheckmarkIcon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </CheckmarkIcon>
      )}
    </StyledCheckbox>
  </CheckboxContainer>
);

export default CheckboxFormComponent;
