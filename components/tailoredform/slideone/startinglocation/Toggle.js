import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
const YellowSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#f7e700',
      '&:hover': {
        backgroundColor: alpha('#f7e700', theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#f7e700',
    },
  }));

export default function SwitchLabels() {
  return (
    <FormGroup>
      <FormControlLabel control={<YellowSwitch  />} label={<div className='' style={{fontSize: '0.75rem'}}>Delhi</div>} />
     </FormGroup>
  );
}