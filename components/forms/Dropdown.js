import React from 'react';
import styled from 'styled-components';
import Label from './Label';
import Message from './Message';
import Tooltip from '@mui/material/Tooltip';
const InputContainer = styled.div`
  width: 100%;
  margin: 0px auto;
`;
const StyledDropdown = styled.select`
  display: block;
  width: 100%;
  padding: 5px;
  background-color: ${(props) => props.bgColor || 'transparent'};
  color: ${(props) => props.color || props.theme.colors.secondary};
  font-family: ${(props) => props.theme.font.nunito}, sans-serif;
  font-size: 1rem;
  border: 1px solid
    ${(props) =>
      props.error
        ? props.theme.colors.error
        : props.success
        ? props.theme.colors.success
        : props.borderColor || props.theme.colors.brandColor};
  border-radius: 5px;
  box-sizing: border-box;
  margin: 0;
  ${(props) => (props.readOnly ? 'cursor:no-drop;' : '')}
  ${(props) =>
    props.disabled
      ? 'opacity:0.4;cursor:no-drop;'
      : `
opacity:1;
&:hover,
&:focus {
  border: 1px solid ${props.hoverColor || props.theme.colors.secondary};
  outline: none;
  transition: border 0.6s ease;
}
`};
`;
const Dropdown = ({
  color,
  bgColor,
  id,
  value,
  error,
  success,
  validate,
  size,
  onChangeHandler,
  children,
  ...props
}) => {
  function onValueChange(e) {
    // let targetValue;
    // if (e.target.value) {
    //   targetValue = e.target.value;
    // }
    onChangeHandler(e);
  }
  return (
    <>
      <InputContainer>
        {props.info ? (
          <Tooltip title={props.info} arrow>
            <Label
              htmlFor={props.id}
              required={props.required}
              color={props.color}
            >
              {props.label}
            </Label>
          </Tooltip>
        ) : (
          <Label
            htmlFor={props.id}
            required={props.required}
            color={props.color}
          >
            {props.label}
          </Label>
        )}
        <StyledDropdown
          {...props}
          value={value || ''}
          id={id}
          size={props.multiple ? size : '1'}
          onChange={(e) => onValueChange(e)}
          onBlur={(e) => validate(e, 'error')}
          error={error}
          success={success}
        >
          {children}
        </StyledDropdown>
        <Message error={error} success={success} />
      </InputContainer>
    </>
  );
};
export default Dropdown;
