import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styled from 'styled-components';
function valuetext(value) {
  return `${value}°C`;
}
const PrettoSlider = styled(Slider)({
    color: '#f7e700',
    height: 8,
    '& .MuiSlider-rail':{
        backgroundColor: "#f7e700"
    },
    '& .MuiSlider-track': {
      border: 'none',
      backgroundColor: "#f7e700"
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid #f7e700',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#f7e700',
      color: 'black',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });
  
export default function RangeSlider() {
  const [value, setValue] = React.useState([1, 5]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '80%' , margin: 'auto'}}>
      <PrettoSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        marks={[{value: 0, label: 'Rs 0'},  {value: 10000, label: 'Rs 10000'}]}
        min={0}
        max={10000}
      />
    </Box>
  );
}
