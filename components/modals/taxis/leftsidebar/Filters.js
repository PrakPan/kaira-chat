import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 0 2rem 0;
`;

const Label = styled.p`
  font-size: 0.75rem;
  margin: 0 0 0 0.5rem;
`;
export default function CheckboxLabels(props) {
  const _onChangeHandler = (checked, filter, heading) => {
    if (checked) props._addFilterHandler(filter, heading);
    else props._removeFilterHandler(filter, heading);
  };

  return (
    <Container>
      <FormGroup>
        {props.filters.map((filter, i) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                onChange={(event) =>
                  _onChangeHandler(event.target.checked, filter, props.heading)
                }
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: 16 },
                  color: "black",
                  "&.Mui-checked": { color: "black" },
                }}
                defaultChecked={filter === props.default ? true : false}
              />
            }
            label={<Label className="font-lexend">{filter}</Label>}
          />
        ))}
      </FormGroup>
    </Container>
  );
}
