import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import styled from "styled-components";
function valuetext(value) {
  return `${value}°C`;
}

const PrettoSlider = styled(Slider)({
  color: "#f7e700",
  height: 8,
  "& .MuiSlider-rail": {
    backgroundColor: "#f7e700",
    opacity: "0.4",
  },
  "& .MuiSlider-track": {
    border: "none",
    backgroundColor: "#f7e700",
  },
  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#fff",
    border: "2px solid #f7e700",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    display: "none",

    background: "unset",
    padding: 0,
    width: 28,
    height: 28,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#f7e700",
    color: "black",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function RangeSlider(props) {
  const [value, setValue] = React.useState([1, 5]);

  const handleChange = (event, newValue) => {
    if (newValue[0] === value[0] && newValue[1] === value[1]) null;
    else {
      setValue(newValue);
      props._updateStarFilterHandler(newValue[0], newValue[1]);
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto 1rem auto" }}>
      <PrettoSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        marks={[
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
        ]}
        step={1}
        min={1}
        max={5}
      />
    </Box>
  );
}
