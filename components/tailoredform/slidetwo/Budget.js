import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: <div style={{marginLeft: '50%'}}>₹3,000<div>per day</div></div>
  },
  {
    value: 33,
    label: '',
  },
  {
    value: 66,
    label: '',
  },
  {
    value: 100,
    label: <div style={{position: 'relative', left: '-50%'}}>₹10,000<div style={{textAlign: 'right'}}>per day</div></div>
  },
];

function valuetext(value) {
  return `${value}°C`;
}

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function DiscreteSliderValues() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Restricted values"
        defaultValue={20}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}