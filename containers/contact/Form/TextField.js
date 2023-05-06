import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";

const Text = (props) => {
  return (
    <TextField
      id={props.id}
      required
      name={props.name}
      fullWidth
      label={props.label}
      variant="outlined"
      placeholder={props.placeholder}
      onChange={(event) => props._changeDetailsHandler(event, props.name)}
    />
  );
};

export default React.memo(Text);
