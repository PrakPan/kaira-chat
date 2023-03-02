import React from 'react';
import styled, { keyframes } from 'styled-components';
const fade = keyframes`
  from {
    opacity: 0.2;
    transform: rotat(90deg);
    transform: translat(0px, 400px);
  }
  to {
    opacity: 1;
    transform: rotat(0deg);
  }
`;
const StyledLabel = styled.label`
  display: flex;
  max-width: 100%;
  justify-content: left;
  align-items: center;
  margin: ${(props) => props.margin || '0px 0px 10px 0px'};
  font-family: ${(props) => props.theme.font.opensans}, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.color || props.theme.colors.secondary};
  animation: ${fade} 1s ease;
`;
const Label = React.forwardRef((props, ref) => {
  return (
    <StyledLabel {...props} ref={ref}>
      {props.required ? (
        <>
          {props.children}&nbsp;&nbsp;
          <span
            style={{ color: 'red' }}
            title='This is a required field. You have to fill this field.'>
            *
          </span>
        </>
      ) : (
        props.children
      )}
    </StyledLabel>
  );
});
export default Label;
