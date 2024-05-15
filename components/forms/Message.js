import React from "react";
import styled from "styled-components";

const StyeldMessage = styled.p`
  max-width: 100%;
  text-align: left;
  margin: 5px 0px;
  font-family: ${(props) => props.theme.font.nunito}, sans-serif;
  font-size: 1rem;
  font-weight: bolder;
  color: ${(props) =>
    props.error
      ? props.theme.colors.error
      : props.success
      ? props.theme.colors.success
      : props.color || props.theme.colors.secondary};
  visibility: ${(props) => (props.error ? "visible" : "hidden")};
`;

const Message = (props) => {
  const { color, error, success } = props;
  return (
    <StyeldMessage error={error} success={success} color={color}>
      {error || "text"}
    </StyeldMessage>
  );
};
export default Message;
