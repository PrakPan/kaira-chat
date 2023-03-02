import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import styled from 'styled-components'

const Container = styled.div`
    width: 80%;
    margin: 0rem auto 2rem auto;

`;
export default function ContinuousSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const marks = [
    {
      value: 0,
      label: '₹ 1.5k',
    },

    {
      value: 100,
      label: '₹ 15k',
    },
  ];
  return (
    <Container>
     
      <Slider  marks={marks} defaultValue={30} aria-label="Disabled slider"  size="small" />
      </Container>
  );
}
